'use strict';

/**
* @ngdoc service
* @name torrentSubscribeFrontendApp.file
* @description
* # file
* Service in the torrentSubscribeFrontendApp.
*/
angular.module('torrentSubscribeFrontendApp')
.service('file', function ($resource, constants) {

    var api = {};

    var fileResource = $resource(
        constants.clientHost + '/api/files',
        { directoy_type : '@directoy_type' }
    );

    api.getTree = function(directoyType, callback) {
        fileResource.get({'directory_type': directoyType}, function(data) {
            if (callback)
                callback(angular.fromJson(data));
        });
    };

    var directoriesResource = $resource(
        constants.clientHost + '/api/files/directories',
        {},
        {get : {method:'GET', isArray: true}}
    );

    api.getDirectories = function(callback) {
        directoriesResource.get(function(data) {
            if (callback)
                callback(angular.fromJson(data));
        });
    };

    api.getDownloadLink = function (file, directoryType) {
        return '/api/files/download?path=' + file + '&directory_type=' + directoryType;
    };

    return api;

});
