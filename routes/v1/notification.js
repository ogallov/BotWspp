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
}

module.exports = Notification;
