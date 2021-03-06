const WhatsAppHelper = require("../../helpers/whatsapp.helper");
const shortID = require("shortid");
const deviceDao = require("../../dao/device");
const fs = require("fs");
const request = require("request");
const urlNotification = "http://198.50.191.65/wpp/api.php/notfications";
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
    try {
      fs.unlinkSync("./sessions/" + activeDevice.name + ".json");

      //notification error devices
      const dataNotification = {
        id: activeDevice._id,
        deviceName: activeDevice.name,
        message:
          "Error sending message with this device, check it connnection with network",
      };

      notificationCompanyURL(urlNotification, dataNotification, 10000);
    } catch (err) {
      global.logger.info("Error deleting file: ", activeDevice.name);
    }

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
      try {
        fs.unlinkSync("./sessions/" + activeDevice.name + ".json");

        //notification error devices
        const dataNotification = {
          id: activeDevice._id,
          deviceName: activeDevice.name,
          message:
            "Error sending message with this device, check it connnection with network",
        };

        notificationCompanyURL(urlNotification, dataNotification, 10000);
      } catch (err) {
        global.logger.info("Error deleting file: ", activeDevice.name);
      }
      status = 417;
    } else {
      activeDevice.status = "disabled";
      deviceDao.setDevice(query, activeDevice);
    }

    res.status(status).json(resp);
  }
};

const notificationCompanyURL = async (API_URL, dataNotification, timeout) => {
  return new Promise((resolve) => {
    request.post(
      {
        url: API_URL,
        timeout: timeout ? timeout : 5000,
        json: dataNotification,
      },
      (err, httpResponse, body) => {
        if (err) {
          return resolve({});
        }
        try {
          let newBody = {};
          newBody.statusCode = httpResponse.statusCode;
          newBody.body = body;
          resolve(newBody);
        } catch (e) {
          logger.error(
            "Error getting data URL: " + API_URL + " with body=" + body,
            e
          );
          resolve({});
        }
      }
    );
  });
};
