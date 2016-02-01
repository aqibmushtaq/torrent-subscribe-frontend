'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('ClientCtrl', ['$scope', '$timeout', 'TorrentClient', function ($scope, $timeout, TorrentClient) {

    $scope.filterTerm = "";

    $scope.torrents = [];

    $scope.getClientTorrents = function() {
        TorrentClient.getAll(function(result) {
            $scope.torrents = [];
            Object.keys(result).forEach(function(key) {
                $scope.torrents.push(result[key]);
            });
            $timeout($scope.getClientTorrents, 1000);
        });
    };

    $scope.getClientTorrents();
}]);
