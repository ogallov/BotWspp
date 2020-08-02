const mongoDB = require("../helpers/mongodb");
class Device {
  constructor() {}

  async saveDevice(device) {
    mongoDB.save("device", device);
  }

  async getActiveDevice(query, fields) {
    let params = {};
    params.query = query;
    params.fields = fields;
    return await mongoDB.findOne("device", params);
  }

  setDevice(query, data) {
    mongoDB.updateOne("device", query, data);
  }

  async changeStatusDisabledDevices(query, toUpdate) {
    return await mongoDB.updateMany("device", query, toUpdate);
  }
}

module.exports = new Device();
