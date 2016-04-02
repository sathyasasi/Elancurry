//Modules
var restify = require('restify');
var loadash = require('lodash');
var db = require("./db.js");
var bunyan = require('bunyan');
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');


var app = restify.createServer({name: 'Elancurry'});
var routes = require('./route');
var error = require('./errors.js');

app.use(restify.acceptParser(app.acceptable));
app.use(restify.queryParser());
app.use(restify.bodyParser());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Create a bunyan based logger
var log = bunyan.createLogger({
  name: 'ElancurryAPI',
  streams: [
    {
      level: 'debug',
      stream: process.stdout
    }
  ],
  serializers: bunyan.stdSerializers
});

// Attach the logger to the restify server
app.log = log;
 // Emitted after a route has finished all the handlers
app.on('after', function (req, res, route, error) {
  req.log.debug("%s %s", req.method, req.url);
  req.log.debug("%s %s", req.headers['Authorization'], req.headers['user-agent']);
  req.log.debug(req.params);
  req.log.debug("%d %s", res.statusCode, res._data ? res._data.length : null);
});

log.info("Starting up the server");
log.info("Connecting to MongoDB");

function start(cb) {
  cb = cb || function(err){
    if(err){
      throw err;
    }
  };
  var m = db.connect(function (err) {
    if (err) {
      throw err;
      process.exit(-1);
    }

    // Initialize the database
    db.init(function (err) {
      if (err) {
       log.info("Error initializing DB");
        process.exit(-1);
      }
      app.use(function(req, res, next){
        req.db = m;
        next();
      });
      require("./route")(app);

      app.listen(process.env.PORT || 3000, function (err) {
        log.info(" %s listening at %s", app.name, app.url);
        cb(err);
      });
    });
  });
}
if (module.parent) {
  module.exports = exports = start;
} else {
  start();
}

module.exports.cleanup = function() {
    log.info("Worker PID#" + process.pid + " stop accepting new connections");
    app.close(function (err) {
      log.info("Worker PID#" + process.pid + " shutting down!!!");
      process.send({cmd: 'suicide'});
    });
}
