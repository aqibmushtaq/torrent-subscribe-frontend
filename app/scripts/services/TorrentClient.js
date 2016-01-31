'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.service:TorrentClient
* @description
* # TorrentClient
* Service for torrent client
*/
angular.module('torrentSubscribeFrontendApp')
.service('TorrentClient', function ($resource, appConstants) {

    var api = {};

    var torrentResource = $resource(appConstants.clientHost + "/torrent",
        { magnet_link : '@magnet_link' },
        {
            save : {method:'POST'},
            get : {method:'GET'}
        }
    );

    api.add = function(magnetLink, callback) {
        torrentResource.save({'magnet_link': magnetLink}, function(data) {
            callback(angular.fromJson(data));
        });
    };

    api.getAll = function(callback) {
        torrentResource.get(function(data) {
            callback(angular.fromJson(data));
        });
    };

    return api;
});
