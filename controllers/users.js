var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/user.js');

module.exports.controller = (app) => {

    var logger = app.get('logger');
    var directories = app.get('deluge-directories');

    app.get('/api/users', (req, res) => {
        User.find({}, function(err, users) {
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

        var bcrypt = require('bcrypt');
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        var user = new User({
            username: username,
            password: hash,
            email: email
        });

        user.save((err) => {
            return res.json({
                success: !err,
                message: err
            });
        })
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

        // find the user
        User.findOne({
            username: username
        }, (err, user) => {
            if (err)
                throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {
                if (!bcrypt.compareSync(password, user.password)) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    // create a token if user is found and password is right
                    var token = jwt.sign(user, app.get('config').secret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });
    });

};
