'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('ClientCtrl', ['$scope', '$timeout', 'TorrentClient',
function ($scope, $timeout, TorrentClient) {

    $scope.filterTerm = "";

    $scope.torrents = [];

    $scope.getClientTorrents = function() {
        TorrentClient.getAll(function(result) {
            $scope.torrents = result;
            TorrentClient.onChange(onTorrentChange);
        });
    };

    var onTorrentChange = function(changedTorrents) {
        if (!changedTorrents) {
            return;
        }
        changedTorrents.forEach(function(changedTorrent) {
            var torrentIndex = _.findIndex($scope.torrents, {id: changedTorrent.id});
            // new torrent
            if (torrentIndex < 0) {
                $scope.torrents.push(changedTorrent);
                return;
            }

            // changed torrent
            $scope.torrents[torrentIndex] = changedTorrent;
            $scope.$apply();
        });
    };

    $scope.getClientTorrents();
}]);
