'use strict';

/**
* @ngdoc service
* @name torrentSubscribeFrontendApp.user
* @description
* # user
* Service in the torrentSubscribeFrontendApp.
*/
angular.module('torrentSubscribeFrontendApp')
.service('user', function ($resource, constants, $sessionStorage) {
    var isLoggedIn = false;
    var api = {};

    var loginResource = $resource(constants.clientHost + '/api/p/users/authenticate', {},
        { username : '@username' , password : '@password' }
    );

    api.login = function(username, password, callback) {
        loginResource.save({'username': username, 'password': password}, function(data) {
            var result = angular.fromJson(data);
            if (result.success)
                api.setUserToken(result.token);
            callback(result);
        });
    };

    var tokenResource = $resource(constants.clientHost + '/api/p/users/token', {},
        { token : '@token' }
    );

    api.isLoggedIn = function(callback) {
        var token = $sessionStorage.user_token;
        tokenResource.save({'token': token}, function(data) {
            var result = angular.fromJson(data);
            isLoggedIn = result.success;
            callback(result);
        });
    };

    api.getIsLoggedIn = function () {
        return isLoggedIn;
    };

    api.logout = function() {
        isLoggedIn = false;
        api.setUserToken('');
    };

    api.setUserToken = function (token) {
        $sessionStorage.user_token = token;
    };

    api.getUserToken = function (token) {
        return $sessionStorage.user_token;
    };

    return api;
});
