/* eslint-disable no-console */
class device {
  constructor(options) {
    this.data = {
      id: options.id,
      name: options.name || options.id,
      description: options.description || '',
      room: options.room || '',
      type: options.type || 'devices.types.light',
/*      custom_data: {
        mqtt: options.mqtt || [{}],
      },
*/
      capabilities: options.capabilities,
      properties: options.properties,
    };
    global.devices.push(this);
  }

  // !!!FIXME!!!
  //
  getInfo() {
    const properties = [];
    const capabilities = [];
    if (Array.isArray(this.data.properties) && this.data.properties.length) {
      for (let i in this.data.properties) {
        const property = {
          type: this.data.properties[i].type,
          retrievable: this.data.properties[i].retrievable,
          parameters: this.data.properties[i].parameters,
        };
        properties.push(property);
      }
    }
    if (Array.isArray(this.data.capabilities) && this.data.capabilities.length) {
      for (let i in this.data.capabilities) {
        const capability = {
          type: this.data.capabilities[i].type,
          retrievable: this.data.capabilities[i].retrievable,
          parameters: this.data.capabilities[i].parameters,
        };
        capabilities.push(capability);
      }
    }
    this.deviceInfo = {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      room: this.data.room,
      type: this.data.type,
      custom_data: this.data.custom_data,
      capabilities,
      properties,
    };
    return this.deviceInfo;
  }

// !!!FIXME!!!
  getState() {
    const properties = [];
    const capabilities = [];
    if (Array.isArray(this.data.properties) && this.data.properties.length) {
      for (let i in this.data.properties) {
        const property = {
          type: this.data.properties[i].type,
          state: this.data.properties[i].state,
        };
        properties.push(property);
      }
    }
    if (Array.isArray(this.data.capabilities) && this.data.capabilities.length) {
      for (let i in this.data.capabilities) {
        const capability = {
          type: this.data.capabilities[i].type,
          state: this.data.capabilities[i].state,
        };
        capabilities.push(capability);
      }
    }
    this.s = {
      id: this.data.id,
      capabilities,
      properties,
    };
    return this.s;
  }

  findDevIndex(arr, elem) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type === elem) {
        return i;
      }
    }
    return false;
  }

  // setState(id, val, type, inst, rel) {
  setState(type, value, instance, isRelative) {
    let val;
    const id = this.data.id;
    const prefix = 'dev/yandex/'; // FIXME! stub
    let topic = `${prefix + id}/`;
    try {
      val = JSON.stringify(value);
      this.data.capabilities[
        this.findDevIndex(this.data.capabilities, type)]
        .state.instance = instance;
      this.data.capabilities[
        this.findDevIndex(this.data.capabilities, type)]
        .state.value = value;
      if (isRelative) {
        topic = `${this.data.custom_data.mqtt[
          this.findDevIndex(this.data.custom_data.mqtt, instance)]
          .set}/relative` || false;
      } else {
        topic = `${topic + type + instance}/set`; // !FIXME! stub
/*        topic = this.data.custom_data.mqtt[
          this.findDevIndex(this.data.custom_data.mqtt, instance)]
          .set || false;
*/
      }
    } catch (err) {
      topic = false;
      console.log(err);
    }

    if (topic) {
      this.client.publish(topic, val);
    }
    return [
      {
        type,
        state: {
          instance,
          action_result: {
            status: 'DONE',
          },
        },
      },
    ];
  }
}
module.exports = device;
