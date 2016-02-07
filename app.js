/**
  * Module dependencies.
  */
var express = require('express');
var http = require('http');
var https = require('https');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var request = require('request');
var async = require('async');
var log4js = require('log4js');
var config = require('./config')();
var nodeDeluge = require('node-deluge');
var app = express();

// Setup the logger
log4js.configure({
  "appenders": [
      {type: "console", category: "console"},
      {type: "file", filename: 'logs/server.log', maxLogSize: 104857600, backups: 100}
    ]
});
var logger = log4js.getLogger(config.logLevel);
app.set('logger', logger);

app.set('deluge-directories', config.deluge.directories);

// Setup deluge
var deluge = require('deluge')(config.deluge.jsonUrl, config.deluge.password);
app.set('deluge', deluge);

// Setup node-deluge
var nodeDelugeSignIn = () => {
    logger.info("logging into node-deluge");
    app.set('node-deluge', nodeDeluge(config.deluge.hostname, config.deluge.password, config.deluge.port));
};
nodeDelugeSignIn();
setInterval(nodeDelugeSignIn, 3600000);

// all environments
app.set('port', config.port || 3001);
app.set('async', async);
app.set('request', request);
app.use(function(req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  logger.info('[%s] %s %s', ip, req.method, req.url);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  next();
});

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'app')));
app.use(function(req, res) {
  res.sendfile(__dirname + '/app/index.html');
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Attach routes
fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app);
    }
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    logger.debug('Express server listening on port ' + app.get('port'));
});
