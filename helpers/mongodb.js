const mongoose = require("mongoose");
const db = mongoose.connection;
const fs = require("fs");
const models = {};
const { DB_HOST, NAME_DATABASE } = require("../config");

class MongoDB {
  constructor() {
    fs.readdirSync(__dirname.replace("helpers", "models")).forEach((file) => {
      let moduleName = file.split(".")[0];
      models[moduleName] = require(__dirname.replace("helpers", "models") +
        "/" +
        moduleName);
    });

    db.on("error", (error) => {
      global.logger.error("Connection mongo error", error);
    });

    db.once("open", () => {
      global.logger.debug(
        "Connection successfully to mongo. DB: " + NAME_DATABASE
      );
    });

    mongoose.connect("mongodb://" + DB_HOST + "/" + NAME_DATABASE, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });

    mongoose.Promise = global.Promise;
  }

  objectId(_id) {
    return mongoose.mongo.ObjectID.createFromHexString(_id);
  }

  save(collection, data) {
    return new Promise((resolve) => {
      models[collection](data).save((err, item) => {
        if (err)
          global.logger.error(
            "Error saving on: " + collection + " error: " + err.message
          );
        resolve(err ? {} : item || {});
      });
    });
  }

  findOne(collection, query = {}) {
    if (!collection) return global.logger.error("Find needs a colletion");

    return new Promise((resolve) => {
      models[collection]
        .findOne(query.query || {}, query.fields || {})
        .lean()
        .sort(query.sort || {})
        .limit(query.limit || 0)
        .exec((err, doc) => {
          if (err)
            global.logger.error(
              "Error on findOne, collection: " +
                collection +
                " query: " +
                query.query,
              err.message
            );
          return resolve(err ? {} : doc || {});
        });
    });
  }

  updateOne(collection, query, data) {
    return new Promise(function (resolve) {
      models[collection].updateOne(query, data, (err, response) => {
        resolve(err ? {} : response || {});
      });
    });
  }

  updateMany(collection, query, toUpdate) {
    return new Promise(function (resolve) {
      models[collection].updateMany(query, toUpdate, (err, response) => {
        resolve(err ? [] : response || []);
      });
    });
  }
}
module.exports = new MongoDB();
