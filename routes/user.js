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
    for (const i in global.devices) {
      r.payload.devices.push(global.devices[i].getInfo());
    }

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
    for (const i in request.body.devices) {
      for (const j in global.devices) {
        if (global.devices[j].id === request.body.devices[i].id) {
          r.payload.devices.push(global.devices[j].getState());
        }
      }
//      if (global.devices[i].id in request.body.devices.id) { /**/ }
//      r.payload.devices.push(global.devices[i].getState());
//      r.payload.devices.push(global.devices[request.body.devices[i].id].getInfo());
    }
    console.log(JSON.stringify(request.body));
    console.log(JSON.stringify(r));
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
          if (global.devices[device].id === request.body.devices[i].id) {
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
