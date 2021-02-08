// 'use strict';

const passport = require('passport');
const device = require('../device');

module.exports.info = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.json({
      user_id: request.user.id,
      name: request.user.name,
      scope: request.authInfo.scope });
  },
];


module.exports.ping = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.status(200);
    response.send('OK');
  },
];

module.exports.devices = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    const r = {
      request_id: request.headers['x-request-id'],
      payload: {
        user_id: request.user.id,
        devices: [],
      },
    };
    global.devices.forEach((device) => {
      r.payload.devices.push(device.getInfo());
    });
    response.status(200);
    response.send(r);
  },
];

module.exports.query = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    const r = {
      request_id: request.headers['x-request-id'],
      payload: {
        devices: [],
      },
    };
// !!!
    request.body.devices.forEach((requestedDevice) => {
      const device = global.devices.find(device => device.data.id === requestedDevice.id);
      if (device) {
        r.payload.devices.push(device.getState());
      }
    });    
//    global.devices.forEach((dev) => {
//      for (const j in request.body.devices) {
//        if (dev.data.id === request.body.devices[j].id) {
//          r.payload.devices.push(dev.getState());
//        }
//      }
//    });
//    for (const i in request.body.devices) {
//      for (const j in global.devices) {
//        if (global.devices[j].id === request.body.devices[i].id) {
//          r.payload.devices.push(global.devices[j].getState());          
//        }
//      }
//    }
    console.log(JSON.stringify(request.body));
    console.log(JSON.stringify(r));
    response.status(200);
    response.send(r);
  },
];

module.exports.action = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    const r = {
      request_id: request.headers['x-request-id'],
      payload: {
        devices: [],
      },
    };
    for (const i in request.body.payload.devices) {
      const id = request.body.payload.devices[i].id;
      let relative;
      let capabilities;
      try {
        relative = request.body.payload.devices[i].capabilities[0].state.relative || false;
        for (const device in global.devices) {
          if (global.devices[device].id === id) {
            capabilities = global.devices[device].setState(
              request.body.payload.devices[i].capabilities[0].state.value,
              request.body.payload.devices[i].capabilities[0].type,
              request.body.payload.devices[i].capabilities[0].state.instance,
              relative);
          }
        }
      } catch (err) {
        console.log(err);
      }
      r.payload.devices.push({ id, capabilities });
    }
    response.send(r);
  },
];

module.exports.unlink = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.status(200);
  },
];
