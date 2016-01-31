'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('MainCtrl', ['$scope', 'Torrents', 'TorrentClient', function ($scope, Torrents, TorrentClient) {

    $scope.searchTerm = "arrow";

    $scope.torrents = [];
    $scope.updatelist = function() {
        Torrents.query($scope.searchTerm, function(data) {
            $scope.torrents = data.results;
        });
    };

    $scope.addTorrent = function(magnetLink) {
        TorrentClient.add(magnetLink, function(result) {
            console.log(">>>added torrent: " + result);
        });
    };
}]);
