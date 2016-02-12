'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:SearchCtrl
* @description
* # SearchCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('SearchCtrl', ['$scope', '$compile', 'Torrents', function ($scope, $compile, Torrents) {

    $scope.searchTerm = "";

    $scope.torrent = {};
    $scope.torrents = [];
    $scope.updatelist = function() {
        Torrents.query($scope.searchTerm, function(data) {
            $scope.torrents = data.results;
        });
    };

    $scope.addTorrent = function(torrent) {
        $scope.torrent = torrent;
        var dialogScope = $scope.$new();
        dialogScope.torrent = $scope.torrent;
        angular.element('#modal-area').html($compile('<add-torrent-modal />')(dialogScope));
    };

}]);
