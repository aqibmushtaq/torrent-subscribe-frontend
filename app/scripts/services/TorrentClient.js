'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.service:TorrentClient
* @description
* # TorrentClient
* Service for torrent client
*/
angular.module('torrentSubscribeFrontendApp')
.service('TorrentClient', ['$resource', 'constants', 'socket',
function ($resource, constants, socket) {

    var api = {};

    var torrentResource = $resource(constants.clientHost + "/api/torrent",
        { magnet_link : '@magnet_link' , type : '@type' },
        {
            save : {method:'POST'},
            get : {method:'GET', isArray: true}
        }
    );

    api.add = function(magnetLink, type, callback) {
        torrentResource.save({'magnet_link': magnetLink, 'type' : type}, function(data) {
            if (callback)
                callback(angular.fromJson(data));
        });
    };

    api.getAll = function(callback) {
        torrentResource.get(function(data) {
            if (callback)
                callback(angular.fromJson(data));
        });
    };

    api.onChange = function (callback) {
        socket.on('torrent_changed', function(data) {
            callback(angular.fromJson(data));
        });
    }

    return api;
}]);
