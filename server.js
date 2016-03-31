//Modules
var restify = require('restify');
var loadash = require('lodash');
var db = require("./db.js");
var bunyan = require('bunyan');
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
app.get('/', function(req, res) {
    res.sendFile('path-to-file');
});

var app = restify.createServer({name: 'Elancurry'});
var routes = require('./route');
var error = require('./errors.js');



app.use(restify.acceptParser(app.acceptable));
app.use(restify.queryParser());
app.use(restify.bodyParser());

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

app.get('/testclient', function (req, res, next) {
  require('fs').sendFile(__dirname + '/views/index.html', function (err, data) {
    if (err) {
      next(err);
      return;
    }

    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(data);
    next();
  });
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
