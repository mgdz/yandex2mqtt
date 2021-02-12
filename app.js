/* eslint-disable no-console */
'use strict';

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
const fs = require('fs');
const app = express();
// const https = require('https');
// const privateKey = fs.readFileSync(config.https.privateKey, 'utf8');
// const certificate = fs.readFileSync(config.https.certificate, 'utf8');
// const credentials = {
//    key: privateKey,
//    cert: certificate
// };
// const httpsServer = https.createServer(credentials, app);
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

function findDevIndex(arr, elem) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].type === elem) {
      return i;
    }
  }
  return false;
}


const statPairs = [];

// !!
global.devices.forEach((device) => {
  const deviceId = device.data.id;
  const prefix = 'dev/yandex/out/'; // FIXME! stub
  device.client = client;
  if (Array.isArray(device.data.capabilities) && device.data.capabilities.length) {
    device.data.capabilities.forEach((capability) => {
      console.log(JSON.stringify(capability));
      if (capability.retrievable) {
        const statTopic = `${prefix + deviceId}/${capability.type}/${capability.state.instance}`;
        const statType = capability.type;
        statPairs.push({
          deviceId,
          type: statType,
          topic: statTopic,
          capability,
        });
      }
    });
  }
  if (Array.isArray(device.data.properties) && device.data.properties.length) {
    device.data.properties.forEach((property) => {
      console.log(JSON.stringify(property));
      if (property.retrievable) {
        const statTopic = `${prefix + deviceId}/${property.type}/${property.state.instance}`;
        const statType = property.type;
        statPairs.push({
          deviceId,
          type: statType,
          topic: statTopic,
          property,
        });
      }
    });
  }
});
console.log(JSON.stringify(statPairs));

if (statPairs) {
  client.on('connect', () => {
    client.subscribe(statPairs.map(pair => pair.topic));
    client.on('message', (topic, message) => {
      const matchedDeviceId = statPairs.findIndex(pair => topic === pair.topic);
      if (matchedDeviceId === -1) return;
      global.devices.forEach((device) => {
        if (device.data.id === statPairs[matchedDeviceId].deviceId) {
          if (statPairs[matchedDeviceId].capability) {
            //
            console.log(JSON.stringify(statPairs[matchedDeviceId]));
            const capability = device.data.capabilities.find(c => c.type === statPairs[matchedDeviceId].capability.type);
            device.data.capabilities[capability].state.instance = statPairs[matchedDeviceId].type;
            device.data.capabilities[capability].state.value = JSON.parse(message);
          }
          if (statPairs[matchedDeviceId].property) {
            //
            const property = device.data.properties.find(p => p.type === statPairs[matchedDeviceId].property.type);
            device.data.properties[property].state.instance = statPairs[matchedDeviceId].type;
            device.data.properties[property].state.value = JSON.parse(message);
          }
        }
      });
/*
      const device = global.devices.find((device) => device.data.id === statPairs[matchedDeviceId].deviceId);
      var devindx;
      switch (statPairs[matchedDeviceId].topicType) {
        case 'on':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.on_off')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = ['on', '1', 'true'].includes(message.toString().toLowerCase());
          } catch (err) {
            console.log(err);
          }
          break;
        case 'mute':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.toggle')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = ['on', '1', 'true'].includes(message.toString().toLowerCase());
          } catch (err) {
            console.log(err);
          }
          break;
        case 'hsv':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.color_setting')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'rgb':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.color_setting')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'temperature_k':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.color_setting')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'thermostat':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.mode')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'fan_speed':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.mode')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'brightness':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'temperature':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'volume':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        case 'channel':
          try {
            devindx = findDevIndex(device.data.capabilities, 'devices.capabilities.range')
            device.data.capabilities[devindx].state.instance = statPairs[matchedDeviceId].topicType;
            device.data.capabilities[devindx].state.value = JSON.parse(message);
          } catch (err) {
            console.log(err);
          }
          break;
        default:
          console.log('Unknown topic Type: ' + statPairs[matchedDeviceId].topicType);
      } */
    });
  });

  client.on('offline', () => {
  });
}
module.exports = app;
