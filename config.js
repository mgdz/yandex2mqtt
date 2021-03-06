module.exports = {

  mqtt: {
    host: 'localhost',
    port: 1883,
    user: '',
    password: '',
    prefix: 'dev/yandex/',
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
      id: 'd994c7c1-bd8c-4ea4-a445-bcdbb59b5abf',
      name: 'Лампочка',
      room: 'Мастерская',
      type: 'devices.types.light',
      capabilities: [
        {
          type: 'devices.capabilities.on_off',
          retrievable: true,
          state: {
            instance: 'on',
            value: true,
          },
        },
      ],
    },
         // __________Конец первого устройства__________//


    //     // ________ Второе устройство___________//
    // {
    //   name: 'Телевизор',
    //   room: 'Комната',
    //   type: 'devices.types.media_device.tv',
    //   capabilities: [
    //     {
    //       type: 'devices.capabilities.on_off',
    //       retrievable: true,
    //       state: {
    //         instance: 'on',
    //         value: true,
    //       },
    //     },
    //     {
    //       type: 'devices.capabilities.toggle',
    //       retrievable: true,
    //       parameters: {
    //         instance: 'mute',
    //       },
    //       state: {
    //         instance: 'mute',
    //         value: true,
    //       },
    //     },

    //     {
    //       type: 'devices.capabilities.range',
    //       retrievable: true,

    //       parameters: {
    //         instance: 'channel',
    //       },
    //       state: {
    //         instance: 'channel',
    //         value: 1,
    //       },
    //     },
    //     {
    //       type: 'devices.capabilities.range',
    //       retrievable: true,

    //       parameters: {
    //         instance: 'volume',
    //         range: {
    //           min: 0,
    //           max: 100,
    //           precision: 1,
    //         },
    //       },
    //       state: {
    //         instance: 'volume',
    //         value: 10,
    //       },
    //     },
    //   ],
    // },
    //     // _________конец второго устройства_________//


    //     // ______Третье устройство____//

    // {
    //   name: 'Кондиционер',
    //   room: 'Комната',
    //   type: 'devices.types.thermostat.ac',
    //   capabilities: [
    //     {
    //       type: 'devices.capabilities.on_off',
    //       retrievable: true,
    //       state: {
    //         instance: 'on',
    //         value: true,
    //       },
    //     },
    //     {
    //       type: 'devices.capabilities.range',
    //       retrievable: true,

    //       parameters: {
    //         instance: 'temperature',
    //         unit: 'unit.temperature.celsius',
    //         range: {
    //           min: 16,
    //           max: 40,
    //           precision: 1,
    //         },
    //       },
    //       state: {
    //         instance: 'temperature',
    //         value: 25,
    //       },
    //     },
    //     {
    //       type: 'devices.capabilities.mode',
    //       retrievable: true,
    //       parameters: {
    //         instance: 'thermostat',
    //         modes: [
    //           {
    //             value: 'heat',
    //           },
    //           {
    //             value: 'cool',
    //           },
    //           {
    //             value: 'auto',
    //           },
    //           {
    //             value: 'eco',
    //           },
    //           {
    //             value: 'dry',
    //           },
    //           {
    //             value: 'fan_only',
    //           },
    //         ],
    //       },
    //       state: {
    //         instance: 'thermostat',
    //         value: 'fan_only',
    //       },
    //     },
    //     {
    //       type: 'devices.capabilities.mode',
    //       retrievable: true,
    //       parameters: {
    //         instance: 'fan_speed',
    //         modes: [
    //           {
    //             value: 'auto',
    //           },
    //           {
    //             value: 'low',
    //           },
    //           {
    //             value: 'medium',
    //           },
    //           {
    //             value: 'high',
    //           },
    //         ],
    //         ordered: true,
    //       },
    //       state: {
    //         instance: 'fan_speed',
    //         value: 'auto',
    //       },
    //     },
    //   ],
    // },
    //     // ____конец третьего устройства___//

    //     // _______________Устройство с HSV______________//
    // {
    //   name: 'Лампочка',
    //   room: 'Комната',
    //   type: 'devices.types.light',
    //   capabilities: [
    //     {
    //       type: 'devices.capabilities.on_off',
    //       retrievable: true,
    //       state: {
    //         instance: 'on',
    //         value: true,
    //       },
    //     },
    //     {
    //       type: 'devices.capabilities.color_setting',
    //       retrievable: true,
    //       parameters: {
    //         color_model: 'hsv',
    //       },
    //       state: {
    //         instance: 'hsv',
    //         value: { h: 0, s: 0, v: 0 },
    //       },
    //     },
    //   ],
    // },
    //     // __________Конец устройства__________//

    // -- датчик --

    {
      id: 'cb07fe3a-5819-4695-9eb5-bec68a0ca6a9', // unique device id (generated by uuidgen, for example)
      name: 'сенсор 1',
      room: 'Мастерская',
      type: 'devices.types.light',
      capabilities: [
        {
          type: 'devices.capabilities.on_off',
          retrievable: true,
          state: {
            instance: 'on',
            value: true,
          },
        },
        {
          type: 'devices.capabilities.color_setting',
          retrievable: true,
          parameters: {
            color_model: 'hsv',
          },
          state: {
            instance: 'hsv',
            value: { h: 0, s: 0, v: 0 },
          },
        },
      ],

      properties: [{
        type: 'devices.properties.float',
        retrievable: true,
        parameters: {
          instance: 'temperature',
          unit: 'unit.temperature.celsius',
        },
        state: {
          instance: 'temperature',
          value: -7.3,
        },
      },
      {
        type: 'devices.properties.float',
        retrievable: true,
        parameters: {
          instance: 'humidity',
          unit: 'unit.percent',
        },
        state: {
          instance: 'humidity',
          value: 16,
        },
      },
      {
        type: 'devices.properties.float',
        retrievable: true,
        parameters: {
          instance: 'battery_level',
          unit: 'unit.percent',
        },
        state: {
          instance: 'battery_level',
          value: 63,
        },
      },
      ],
    },
    // __________Конец датчика__________//
    {
      id: 'a5a738af-8409-4100-aed5-0516bb1652d3', // unique device id (generated by uuidgen, for example)
      name: 'сенсор 0',
      room: 'Мастерская',
      type: 'devices.types.sensor',
      capabilities: [],
      properties: [{
        type: 'devices.properties.float',
        retrievable: true,
        parameters: {
          instance: 'temperature',
          unit: 'unit.temperature.celsius',
        },
        state: {
          instance: 'temperature',
          value: -7.3,
        },
      },
      {
        type: 'devices.properties.float',
        retrievable: true,
        parameters: {
          instance: 'humidity',
          unit: 'unit.percent',
        },
        state: {
          instance: 'humidity',
          value: 16,
        },
      },
      {
        type: 'devices.properties.float',
        retrievable: true,
        parameters: {
          instance: 'battery_level',
          unit: 'unit.percent',
        },
        state: {
          instance: 'battery_level',
          value: 63,
        },
      },
      ],
    },
    //------
  ],
};
