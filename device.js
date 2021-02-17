/* eslint-disable no-console */
const config = require('./config');

class device {
  constructor(options) {
    this.data = {
      id: options.id,
      name: options.name || options.id,
      description: options.description || '',
      room: options.room || '',
      type: options.type || 'devices.types.light',
      capabilities: options.capabilities,
      properties: options.properties,
      device_info: options.device_info || {},
    };
    global.devices.push(this);
  }

  getInfo() {
    const properties = [];
    const capabilities = [];
    if (Array.isArray(this.data.properties) && this.data.properties.length) {
      this.data.properties.forEach((p) => {
        const property = {
          type: p.type,
          retrievable: p.retrievable,
          parameters: p.parameters,
        };
        properties.push(property);
      });
    }
    if (Array.isArray(this.data.capabilities) && this.data.capabilities.length) {
      this.data.capabilities.forEach((c) => {
        const capability = {
          type: c.type,
          retrievable: c.retrievable,
          parameters: c.parameters,
        };
        capabilities.push(capability);
      });
    }
    this.deviceInfo = {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      room: this.data.room,
      type: this.data.type,
      capabilities,
      properties,
    };
    return this.deviceInfo;
  }

  getState() {
    const properties = [];
    const capabilities = [];
    if (Array.isArray(this.data.properties) && this.data.properties.length) {
      this.data.properties.forEach((p) => {
        const property = {
          type: p.type,
          state: p.state,
        };
        properties.push(property);
      });
    }
    if (Array.isArray(this.data.capabilities) && this.data.capabilities.length) {
      this.data.capabilities.forEach((c) => {
        const capability = {
          type: c.type,
          state: c.state,
        };
        capabilities.push(capability);
      });
    }
    this.s = {
      id: this.data.id,
      capabilities,
      properties,
    };
    return this.s;
  }


  setState(type, value, instance, isRelative) {
    let val;
    const deviceId = this.data.id;
    const prefix = config.mqtt.prefix || 'dev/yandex/'; // FIXME! stub
    let topic = `${prefix}in/${deviceId}/`;
    try {
      val = JSON.stringify(value);
      this.data.capabilities.forEach((c, i) => {
        if (c.state.instance === instance) {
          this.data.capabilities[i].state.value = value;
        }
      });
      if (isRelative) {
        topic = `${topic + type}/relative/${instance}`;
      } else {
        topic = `${topic + type}/${instance}`;
      }
    } catch (err) {
      topic = false;
      console.log(err);
    }
    if (topic) {
      this.client.publish(topic, val);
    }
    // TODO - return result depend on client.publish(?)
    this.result = {
      type,
      state: {
        instance,
        action_result: {
          status: 'DONE',
        },
      },
    };
    return this.result;
  }
}
module.exports = device;
