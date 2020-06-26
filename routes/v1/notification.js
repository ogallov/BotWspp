class Notification {
  constructor() {}

  /**
   *
   */
  recieve_notification(req, res) {
    console.log("recieve OK");
    res.send("Hello World!");
  }
}

module.exports = Notification;
