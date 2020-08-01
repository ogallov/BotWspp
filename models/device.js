const mongoose = require("mongoose");

const device = new mongoose.Schema({
  name: {
    type: String,
    default: null,
    unique: true,
  },
  status: {
    type: String,
    default: "enabled", //disabled, canceled
  },
  date_created: {
    type: Date,
    default: new Date(),
  },
});
module.exports = mongoose.model("devices", device);
