/**
  * Module dependencies.
  */
var express = require('express');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var request = require('request');
var log4js = require('log4js');
var config = require('./config')();
var nodeDeluge = require('node-deluge');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
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

// Connect to DB
mongoose.connect(config.mongo.url);

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

app.set('config', config);

// all environments
app.set('port', config.port || 3001);
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
app.use(function(req, res, next) {
    if (!req.path.startsWith('/api') || req.path.startsWith('/api/p/')) {
        next();
        return;
    }

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});
app.use(express.static(path.join(__dirname, 'app')));
app.use(app.router);
app.use(function(req, res) {
  res.sendfile(__dirname + '/app/index.html');
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

var server = app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    logger.debug('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);
app.set('io', io);

// Attach routes
fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app);
    }
});
