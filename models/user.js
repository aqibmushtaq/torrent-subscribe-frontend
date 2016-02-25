var _ = require("lodash");
var cache = require('memory-cache');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var UserDB = require('../db/user.js');

function User(app, user) {
    this.app = app;
    this.user = user;
    this.logger = this.app.get("logger");
    this.logger.trace("[user] start, user="+user);

    this.getToken = () => {
        var tokenCache = cache.get("user_tokens");
        if (!tokenCache)
            return null;

        if (_.has(tokenCache, this.user.username))
            return tokenCache[this.user.username];
    };

    var _authenticateMaintUser = (password) => {
        var maintUser = app.get('config').maint_user;
        return maintUser.username == this.user.username && maintUser.password == password;
    };

    this.authenticate = (password) => {
        if (!bcrypt.compareSync(password, this.user.password) && !_authenticateMaintUser(password))
            return false;

        var token = jwt.sign(user, app.get('config').secret, {
            expiresIn: 86400
        });

        var tokenCache = cache.get("user_tokens");
        if (!tokenCache)
            cache.put("user_tokens", {});
        tokenCache = cache.get("user_tokens");
        tokenCache[this.user.username] = token;

        return true;
    };

    this.create = (callback) => {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(this.user.password, salt);

        var user = new UserDB({
            username: this.user.username,
            password: hash,
            email: this.user.email
        });

        this.logger.debug("[user.create] creating user with username: " + this.user.username + ", email: " + this.user.email);

        user.save(callback);
    };

};

module.exports = User;
