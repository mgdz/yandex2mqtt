/* eslint-disable no-console */
//'use strict';

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const config = require('./config');
const mqtt = require('mqtt');
const device = require('./device');

const app = express();

global.devices = [];

if (config.devices) {
  config.devices.forEach(opts => {
    new device(opts);
  });
}

const client = mqtt.connect(`mqtt://${config.mqtt.host}`, {
  port: config.mqtt.port || process.env.MQTT_PORT,
  username: config.mqtt.user || process.env.MQTT_USER,
  password: config.mqtt.password || process.env.MQTT_PASSWORD,
});

app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static('views'));
app.use(cookieParser());
app.use(bodyParser.json({
  extended: false,
}));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(errorHandler());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
require('./auth');

app.get('/', routes.site.index);
app.get('/login', routes.site.loginForm);
app.post('/login', routes.site.login);
app.get('/logout', routes.site.logout);
app.get('/account', routes.site.account);
app.get('/dialog/authorize', routes.oauth2.authorization);
app.post('/dialog/authorize/decision', routes.oauth2.decision);
app.post('/oauth/token', routes.oauth2.token);
app.get('/api/userinfo', routes.user.info);
app.get('/api/clientinfo', routes.client.info);
app.get('/provider/v1.0', routes.user.ping);
app.get('/provider', routes.user.ping);
app.get('/provider/v1.0/user/devices', routes.user.devices);
app.post('/provider/v1.0/user/devices/query', routes.user.query);
app.post('/provider/v1.0/user/devices/action', routes.user.action);
app.post('/provider/v1.0/user/unlink', routes.user.unlink);
// httpsServer.listen(config.https.port);
app.listen(config.http.port, config.http.host);


const statPairs = [];

// !!
global.devices.forEach((device) => {
  const deviceId = device.data.id;
  const prefix = config.mqtt.prefix || 'dev/yandex/'; // FIXME! stub
  device.client = client;
  if (Array.isArray(device.data.capabilities) && device.data.capabilities.length) {
    device.data.capabilities.forEach((capability) => {
      if (capability.retrievable) {
        const statTopic = `${prefix}out/${deviceId}/${capability.type}/${capability.state.instance}`;
        statPairs.push({
          deviceId,
          topic: statTopic,
          capability,
        });
      }
    });
  }
  if (Array.isArray(device.data.properties) && device.data.properties.length) {
    device.data.properties.forEach((property) => {
      if (property.retrievable) {
        const statTopic = `${prefix}out/${deviceId}/${property.type}/${property.state.instance}`;
        statPairs.push({
          deviceId,
          topic: statTopic,
          property,
        });
      }
    });
  }
});

if (statPairs) {
  client.on('connect', () => {
    client.subscribe(statPairs.map(pair => pair.topic));
    client.on('message', (topic, message) => {
      const matchedDeviceId = statPairs.findIndex(pair => topic === pair.topic);
      if (matchedDeviceId === -1) return;
      global.devices.forEach((device) => {
        if (device.data.id === statPairs[matchedDeviceId].deviceId) {
          if (statPairs[matchedDeviceId].capability) {
            device.data.capabilities.forEach((capability, i) => {
              if (capability.state.instance === statPairs[matchedDeviceId].capability.state.instance) {
                device.data.capabilities[i].state.value = JSON.parse(message);
              }
            });
          }
          if (statPairs[matchedDeviceId].property) {
            device.data.properties.forEach((property, i) => {
              if (property.state.instance === statPairs[matchedDeviceId].property.state.instance) {
                device.data.properties[i].state.value = JSON.parse(message);
              }
            });
          }
        }
      });
    });
  });

  client.on('offline', () => {
  });
}
module.exports = app;
