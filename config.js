module.exports = {

  mqtt: {
    host: 'localhost',
    port: 1883,
    user: '',
    password: '',
  },

  http: {
    host: '127.0.0.1',
    port: 1800,
  },

  clients: [
    {
      id: 'a5ec1a7d-e3b7-4e97-9184-349d14587225',
      name: 'Yandex',
      clientId: 'yandex-smarthome12345',
      clientSecret: 'secret12345',
      isTrusted: false,
    },
  ],

  users: [{
    id: '3040a447-892f-4344-954c-05135ef87b3b',
    username: 'admin',
    password: 'admin',
    name: 'Administrator',
  },
  ],

  devices: [
        // _______________Первое устройство______________//
    {
      id: '0db24637-bd70-47cc-88db-a7fe1ef62b92',
      name: 'Термостат',
      room: 'Мастерская',
      type: 'devices.types.thermostat',
      capabilities: [
        {
          type: 'devices.capabilities.on_off',
          retrievable: true,
          state: {
            instance: 'on',
            value: false,
          },
        },
        {
          type: 'devices.capabilities.range',
          retrievable: true,
          parameters: {
            instance: 'temperature',
            unit: 'unit.temperature.celsius',
            range: {
              min: 18,
              max: 28,
              precision: 1,
            },
          },
          state: {
            instance: 'temperature',
            value: 18,
          },
        },
      ],
      properties: [
        {
          type: 'devices.properties.float',
          retrievable: true,
          parameters: {
            instance: 'temperature',
            unit: 'unit.temperature.celsius',
          },
          state: {
            instance: 'temperature',
            value: 6,
          },
        },
      ],
    },
  ],
};
