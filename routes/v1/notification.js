const WhatsAppHelper = require("../../helpers/whatsapp.helper");
const shortID = require("shortid");
const deviceDao = require("../../dao/device");
const fs = require("fs");
class Notification {
  constructor() {}

  /** */
  async connect_wapp_web(req, res) {
    const WhatsApp = new WhatsAppHelper();
    const deviceName = "auth_info_" + shortID.generate();
    const path_name = "./sessions/" + deviceName + ".json";
    const resp = await WhatsApp.firstConnectApi(path_name);
    let status = 200;
    if (res.status) {
      const myDevice = {
        name: deviceName,
        date_created: new Date(),
      };
      resp.device_name = deviceName;
      deviceDao.saveDevice(myDevice);
    }
    if (!resp.status) status = 417;
    res.status(status).json(resp);
  }

  async send_message(req, res) {
    ckeckingActiveDevice(0, req.body, res);
  }
}
module.exports = Notification;

const ckeckingActiveDevice = async (recursive, body, res) => {
  let activeDevice = await getActiveDevice();
  if (recursive && !activeDevice.name) {
    return res.status(417).json({
      status: false,
      message: "There are not active devices",
    });
  } else if (!activeDevice.name) {
    await deviceDao.changeStatusDisabledDevices(
      { status: "disabled" },
      { status: "enabled" }
    );
    setTimeout(() => {
      ckeckingActiveDevice(++recursive, body, res);
    }, 700);
  } else {
    sendMessage(activeDevice, body, res);
  }
};

const getActiveDevice = async () => {
  const query = { status: "enabled" },
    fields = { name: 1 };
  return await deviceDao.getActiveDevice(query, fields);
};

const sendMessage = async (activeDevice, body, res) => {
  const WhatsApp = new WhatsAppHelper();
  let resp = await WhatsApp.connectApi(
    "./sessions/" + activeDevice.name + ".json"
  );

  let status = 200;
  let query = { _id: activeDevice._id };

  if (!resp.status) {
    activeDevice.status = "canceled";
    deviceDao.setDevice(query, activeDevice);
    //fs.unlinkSync("./sessions/" + activeDevice.name + ".json");
    setTimeout(() => {
      ckeckingActiveDevice(0, body, res);
    }, 300);
  } else {
    resp = await WhatsApp.sendMessage(
      `${body.phone_number}@s.whatsapp.net`,
      body.message
    );

    if (!resp.status) {
      resp.device_name = activeDevice.name;
      activeDevice.status = "canceled";
      deviceDao.setDevice(query, activeDevice);
      status = 417;
    } else {
      activeDevice.status = "disabled";
      deviceDao.setDevice(query, activeDevice);
    }

    res.status(status).json(resp);
  }
};
