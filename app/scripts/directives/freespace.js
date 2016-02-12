'use strict';

/**
* @ngdoc directive
* @name torrentSubscribeFrontendApp.directive:freeSpace
* @description
* # freeSpace
*/
angular.module('torrentSubscribeFrontendApp')
.directive('freeSpace', function ($timeout, Freespace) {
    return {
        templateUrl: 'scripts/directives/freespace.html',
        restrict: 'E',
        link: function postLink(scope, element, attrs) {
            var getFreespace = function() {
                Freespace.get(function(directories) {
                    scope.directories = directories;
                });
                $timeout(getFreespace, 10000);
            };
            getFreespace();
        }
    };
});
