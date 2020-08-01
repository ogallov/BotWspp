const mongoDB = require("../helpers/mongodb");
class Device {
  constructor() {}

  async saveDevice(device) {
    mongoDB.save("device", device);
  }
  getActiveDevice() {}
  setDevice() {}
}

module.exports = new Device();
