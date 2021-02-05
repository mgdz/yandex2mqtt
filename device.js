/* eslint-disable no-console */
class device {
  constructor(options) {
    // var id = global.devices.length;
    // const userid = global.devices.userid;
    this.data = {
      // id: String(id),
      id: options.id,
      name: options.name || options.id,
      description: options.description || '',
      room: options.room || '',
      type: options.type || 'devices.types.light',
      custom_data: {
        // userid: userid,
        mqtt: options.mqtt || [{}],
      },
      capabilities: options.capabilities,
      properties: options.properties,
    };
    global.devices.push(this);
  }

  // !!!FIXME!!!
  //
  getInfo() {
    const properties = [];
    for(let i in this.data.properties) {
      const property = {
        type: this.data.properties[i].type,
        retrievable: this.data.properties[i].retrievable,
        parameters: this.data.properties[i].parameters,
      };
      properties.push(property);
    }
    this.i = {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      room: this.data.room,
      type: this.data.type,
      custom_data: this.data.custom_data,
      properties,
    };
    return this.i;
  }

// !!!FIXME!!!
  getState() {
    const properties = [];
    for (let i in this.data.properties) {
      const property = {
        type: this.data.properties[i].type,
        state: this.data.properties[i].state,
      };
      properties.push(property);
    }
    this.s = {
      id: this.data.id,
      properties,
    };
    return this.s;
  }

  static findDevIndex(arr, elem) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type === elem) {
        return i;
      }
    }
    return false;
  }

  // setState(id, val, type, inst, rel) {
  setState(value, type, instance, isRelative) {
    let int;
    let topic;
    try {
      int = JSON.stringify(value);
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
        topic = this.data.custom_data.mqtt[
          this.findDevIndex(this.data.custom_data.mqtt, instance)]
          .set || false;
      }
    } catch (err) {
      topic = false;
      console.log(err);
    }

    if (topic) {
      this.client.publish(topic, int);
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
