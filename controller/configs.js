/**
 * Configs Controller
 * - Fetch and Update configurations used by front end
 * - Per platform (android, ios, web)
 */

var mongoose = require("mongoose"),
  Config = mongoose.model("config"),
  restify = require("restify");

exports.getConfig = function (req, res, next) {
  var requestedPlatform = req.params.platform;
  Config.findOne({ platform: requestedPlatform })
    .exec(function (err, config) {
      if (err) {
        return next(new restify.InternalError(err));
      } else if (!config) {
        return next(new restify.ResourceNotFoundError("Platform config not found"));
      }
      res.send(config);
      return next();
    });
};

exports.addConfig = function (req, res, next) {
  var configuration = req.params;
  var newConfig = new Config(configuration);
  newConfig.save(function (err, config) {
    if (err) {
      if (err.code === 11000) {
        err = "Configuration for platform already exists";
        return next(new restify.InvalidArgumentError(err));
      }
      console.log(err);
      return next(new restify.InternalError());
    } else {
      res.send(config);
      return next();
    }
  });
};

exports.updateConfig = function (req, res, next) {
  var platform = req.params.platform;
  var updatedConfig = req.params;
  Config.findOneAndUpdate({ platform: platform },
    updatedConfig,
    function (err, config) {
      if (err) {
        console.log(err);
        return next(new restify.Error(err));
      }
      if (!doc) {
        return next(new restify.ResourceNotFoundError("Platform " + platform + " not found"));
      }

      res.send(config);
      return next();
    });
};