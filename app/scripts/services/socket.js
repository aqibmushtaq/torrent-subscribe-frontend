'use strict';

/**
* @ngdoc service
* @name torrentSubscribeFrontendApp.socket
* @description
* # socket
* Service in the torrentSubscribeFrontendApp.
*/
angular.module('torrentSubscribeFrontendApp')
.service('socket', function () {
    var api = {};
    var socket = io.connect();

    api.on = function (eventName, callback) {
        socket.on(eventName, callback);
    };

    return api;
});
