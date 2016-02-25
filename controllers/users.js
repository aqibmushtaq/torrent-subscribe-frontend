var _ = require('lodash');
var UserDB = require('../db/user.js');
var User = require('../models/user.js');
var jwt = require('jsonwebtoken');

module.exports.controller = (app) => {

    var logger = app.get('logger');
    var directories = app.get('deluge-directories');

    app.get('/api/users', (req, res) => {
        UserDB.find({}, function(err, users) {
            res.json(users);
        });
    });

    app.post('/api/p/users/token', (req, res) => {
        jwt.verify(req.body.token, app.get('config').secret, function(err, decoded) {
            return res.status(200).json({
                success: !err,
                message: 'Not logged in.'
            });
        });
    });

    app.post('/api/users/create', (req, res) => {
        // ensure the user making the request is an admin
        var token = req.headers['token'];
        UserDB.findOne({
            token: token,
            admin: true
        }, (err, user) => {
            if (err)
                throw err;
            if (!user) {
                // check if maint user
                var maintUserObj = new User(app, app.get('config').maint_user);
                if (maintUserObj.getToken() != token) {
                    return res.json({
                        success: false,
                        message: 'You\'re not an admin'
                    });
                }
            }

            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;

            if (!username)
                return res.json({
                    success: false,
                    message: 'Enter your username'
                });
            if (!password)
                return res.json({
                    success: false,
                    message: 'Enter your password'
                });
            if (!email)
                return res.json({
                    success: false,
                    message: 'Enter your email address'
                });

            var mockUser = {
                username: username,
                password: password,
                email: email
            };
            var userObj = new User(app, mockUser);
            userObj.create((err) => {
                return res.json({
                    success: !err,
                    message: err
                });
            });
        });
    });

    app.post('/api/p/users/authenticate', (req, res) => {

        var username = req.body.username;
        var password = req.body.password;

        if (!username)
            return res.json({
                success: false,
                message: 'Enter your username'
            });
        if (!password)
            return res.json({
                success: false,
                message: 'Enter your password'
            });

        var maintUserObj = new User(app, app.get('config').maint_user);
        if (maintUserObj.authenticate(password)) {
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: maintUserObj.getToken()
            });
            return;
        }

        // find the user
        UserDB.findOne({
            username: username
        }, (err, user) => {
            if (err)
                throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: 'No user found'
                });
                return;
            }

            var userobj = new User(app, user);
            if (!userobj.authenticate(password)) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
                return;
            }

            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: userobj.getToken()
            });
        });
    });

};
