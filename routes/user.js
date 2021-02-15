/* eslint-disable no-console */
// 'use strict';

const passport = require('passport');

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
      const device = global.devices.find(myDevice => myDevice.data.id === requestedDevice.id);
      if (device) {
        r.payload.devices.push(device.getState());
      }
    });
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
    request.body.payload.devices.forEach((requestedDevice) => {
      const capabilities = [];
      let capability;
      const id = requestedDevice.id;
      try {
        global.devices.forEach((myDevice) => {
          if (id === myDevice.data.id) {
            requestedDevice.capabilities.forEach((cap) => {
              capability = myDevice.setState(
                cap.type,
                cap.state.value,
                cap.state.instance,
                cap.state.relative || false,
              );
              capabilities.push(capability);
            });
          }
        });
      } catch (err) {
        console.log(err);
      }
      r.payload.devices.push({ id, capabilities });
    });
    console.log(JSON.stringify(r.payload.devices));
    response.status(200);
    response.send(r);
  },
];

module.exports.unlink = [
  passport.authenticate('bearer', { session: true }),
  (request, response) => {
    response.status(200);
  },
];
