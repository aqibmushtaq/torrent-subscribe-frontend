'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.service:Torrents
* @description
* # Torrents
* Service for torrents
*/
angular.module('torrentSubscribeFrontendApp')
.service('Torrents', function ($resource, constants) {

    var api = {};

    var searchResource = $resource(constants.searchHost + '/search', {},
        { q : '@q' }
    );

    api.query = function(term, callback) {
        searchResource.get({'q': term}, function(data) {
            callback(angular.fromJson(data));
        });
    };

    return api;
});
