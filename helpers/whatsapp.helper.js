const WhatsappBaileys = require("baileys");
const fs = require("fs");

module.exports = class {
  constructor() {
    this.client = new WhatsappBaileys();
    this.client.autoReconnect = false;
  }

  //FIRST CONNECTION WHATSAPP WEB
  firstConnectApi = async (path_file) => {
    return new Promise((resolve) => {
      this.client
        .connect()
        .then(([user, chats, contacts, unread]) => {
          const authInfo = this.client.base64EncodedAuthInfo();
          fs.writeFileSync(path_file, JSON.stringify(authInfo, null, "\t"));

          global.logger.info("Using account of: " + user.name);
          resolve({
            status: true,
            mensaje: "Connection successfully",
          });
        })
        .catch((err) => {
          global.logger.error(err);
          resolve({
            status: false,
            message: "Connecting error...",
          });
        });
    });
  };

  //CONNECT WHATSAPP
  connectApi = async (path_file) => {
    return new Promise((resolve) => {
      var authInfo = null;
      try {
        const file = fs.readFileSync(path_file); // load the closed session back if it exists
        authInfo = JSON.parse(file);
      } catch {
        return resolve({
          status: false,
          message: "Reading file error...",
        });
      }

      this.client
        .connect(authInfo)
        .then(([user, chats, contacts, unread]) => {
          const authInfo = this.client.base64EncodedAuthInfo();
          //fs.writeFileSync(path_file, JSON.stringify(authInfo, null, "\t"));

          global.logger.info("Using account of: " + user.name);
          resolve({
            status: true,
            mensaje: "Connection successfully",
          });
        })
        .catch((err) => {
          global.logger.error(err);
          resolve({
            status: false,
            message: "Connecting error with file...",
          });
        });
    });
  };

  //SEND MESSAGES
  sendMessage(toContact, message) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.client
          .sendTextMessage(toContact, message, {})
          .then(() => {
            const message = "Message sent to: " + toContact;
            global.logger.info(message);
            resolve({
              status: true,
              message: message,
            });
          })
          .catch((err) => {
            const message = "Message error to: " + toContact;
            global.logger.error(message);
            resolve({
              status: false,
              message: message,
            });
          });
      }, 500);
    });
  }
};
