const WhatsappBaileys = require("baileys");
const fs = require("fs");

module.exports = class {
  constructor() {
    this.client = new WhatsappBaileys();
  }

  //FIRST CONNECTION WHATSAPP WEB
  firstConnectApi = async (path_file) => {
    return new Promise((resolve) => {
      var authInfo = null;
      this.client
        .connect()
        .then(([user, chats, contacts, unread]) => {
          const authInfo = this.client.base64EncodedAuthInfo();
          fs.writeFileSync(path_file, JSON.stringify(authInfo, null, "\t"));

          global.logger.info("Using account of: " + user.name);
          resolve({
            status: true,
            mensaje: "Connection successfull",
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
      } catch {}

      this.client
        .connect(authInfo)
        .then(([user, chats, contacts, unread]) => {
          const authInfo = this.client.base64EncodedAuthInfo();
          fs.writeFileSync(path_file, JSON.stringify(authInfo, null, "\t"));

          global.logger.info("Using account of: " + user.name);
          resolve({
            status: true,
            mensaje: "Connection successfull",
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

  //ENVIAR MENSAJES
  /*sendMessage = async (req, res) => {
    const options = {
      quoted: null,
      timestamp: new Date(),
    };
    this.client
      .sendTextMessage(
        `${req.body.phone}@s.whatsapp.net`,
        req.body.body,
        options
      )
      .then(res.jsonp({ mensaje: "Notificación enviada" }));
  };*/

  sendMessage(toContact, message, messageID) {
    let delay = 0.25;

    /*setTimeout(
      () =>
        this.client.updatePresence(toContact, WhatsAppWeb.Presence.available),
      delay * 1000
    );
    delay += 0.25;
    setTimeout(
      () => this.client.sendReadReceipt(toContact, messageID),
      delay * 1000
    );
    delay += 0.5;
    setTimeout(
      () =>
        this.client.updatePresence(toContact, WhatsAppWeb.Presence.composing),
      delay * 1000
    );*/

    delay += 1.75;
    setTimeout(
      () =>
        this.client
          .sendTextMessage(toContact, message, {})
          .then(console.log("Notificación enviada"))
          .catch((err) => console.log(err)),
      delay * 1000
    );
  }
};
