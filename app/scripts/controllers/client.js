'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('ClientCtrl', ['$scope', 'TorrentClient', function ($scope, TorrentClient) {

    $scope.filterTerm = "";

    $scope.torrents = [];

    $scope.getClientTorrents = function() {
        TorrentClient.getAll(function(result) {
            $scope.clientTorrents = [];
            Object.keys(result).forEach(function(key) {
                $scope.torrents.push(result[key]);
            });
        });
    };

}]);
