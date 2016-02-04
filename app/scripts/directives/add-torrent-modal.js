'use strict';

/**
* @ngdoc directive
* @name torrentSubscribeFrontendApp.directive:addTorrentModal
* @description
* # addTorrentModal
*/
angular.module('torrentSubscribeFrontendApp')
.directive('addTorrentModal', ['TorrentClient', function (TorrentClient) {
    return {
        templateUrl: 'scripts/directives/add-torrent-modal-dialog.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            scope.close = function() {
                scope.$destroy();
                element.parent().empty();
            };
            scope.download = function() {
                TorrentClient.add(scope.torrent.magnetLink, scope.type);
                scope.close();
            };
        }
    };
}]);
