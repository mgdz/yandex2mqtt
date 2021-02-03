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

  getInfo() {
    return this.data;
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
  setState(value, type, inst, rel) {
    let int;
    let topic;
    try {
      int = JSON.stringify(value);
      this.data.capabilities[
        this.findDevIndex(this.data.capabilities, type)]
        .state.instance = inst;
      this.data.capabilities[
        this.findDevIndex(this.data.capabilities, type)]
        .state.value = value;
      if (rel) {
        topic = `${this.data.custom_data.mqtt[
          this.findDevIndex(this.data.custom_data.mqtt, inst)]
          .set}/rel` || false;
      } else {
        topic = this.data.custom_data.mqtt[
          this.findDevIndex(this.data.custom_data.mqtt, inst)]
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
          instance: inst,
          action_result: {
            status: 'DONE',
          },
        },
      },
    ];
  }
}
module.exports = device;
