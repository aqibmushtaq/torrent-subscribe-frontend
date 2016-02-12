'use strict';

/**
* @ngdoc service
* @name torrentSubscribeFrontendApp.freespace
* @description
* # freespace
* Service in the torrentSubscribeFrontendApp.
*/
angular.module('torrentSubscribeFrontendApp')
.service('Freespace', function ($resource, constants) {
    var api = {};

    var freespaceResource = $resource(constants.clientHost + '/api/system/space');

    api.get = function(callback) {
        freespaceResource.get(function(data) {
            if (callback)
                callback(angular.fromJson(data.result));
        });
    };

    return api;
});
