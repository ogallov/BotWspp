const WhatsAppHelper = require("../../helpers/whatsapp.helper");
const shortid = require("shortid");
class Notification {
  constructor() {}

  /**
   *
   */
  recieve_notification(req, res) {
    console.log("recieve OK");
    res.send("Hello World!");
    const url =
      "https://api.whatsapp.com/send?phone=+573176181717&text=My%20text";

    const axios = require("axios").default;

    const configReq = {
      method: "get",
      url: url,
    };
    axios(configReq)
      .then((response) => {
        // handle success
        //console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
      })
      .catch(function (error) {
        // handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      })
      .finally(function () {
        // always executed
        console.log("always");
      });
  }

  /** */
  async connect_wapp_web(req, res) {
    const WhatsApp = new WhatsAppHelper();
    const path_name = "./sessions/auth_info_" + shortid.generate() + ".json";
    //save in bd path_name
    const resp = await WhatsApp.firstConnectApi(path_name);
    let status = 200;
    if (!resp.status) status = 417;
    res.status(status).json(resp);
  }

  async send_message(req, res) {
    const WhatsApp = new WhatsAppHelper();
    const resp = await WhatsApp.connectApi("./sessions/auth_info_3.json");
    let status = 200;
    if (!resp.status) {
      return res.status(417).json(resp);
    }
    WhatsApp.sendMessage(`${req.body.phone}@s.whatsapp.net`, req.body.body);
  }

  /*send_message(req, res) {
    console.log(req.body.body);
    Whatsapp.sendMessage(req, res);
  }*/

  get_data_ws(req, res) {
    const url = "http://swapi.dev/api/species/1/";

    const axios = require("axios").default;

    const configReq = {
      method: "get",
      url: url,
    };
    axios(configReq)
      .then((response) => {
        // handle success
        console.log(response.data);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
      })
      .catch(function (error) {
        // handle error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      })
      .finally(function () {
        // always executed
        console.log("always");
      });
  }
}

module.exports = Notification;
