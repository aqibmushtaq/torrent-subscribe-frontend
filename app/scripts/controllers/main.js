'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:SearchCtrl
* @description
* # SearchCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('SearchCtrl', ['$scope', 'Torrents', 'TorrentClient', function ($scope, Torrents, TorrentClient) {

    $scope.searchTerm = "";

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
