'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.service:TorrentClient
* @description
* # TorrentClient
* Service for torrent client
*/
angular.module('torrentSubscribeFrontendApp')
.service('TorrentClient', function ($resource, constants) {

    var api = {};

    var torrentResource = $resource(constants.clientHost + "/api/torrent",
        { magnet_link : '@magnet_link' , type : '@type' },
        {
            save : {method:'POST'},
            get : {method:'GET'}
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

    return api;
});
