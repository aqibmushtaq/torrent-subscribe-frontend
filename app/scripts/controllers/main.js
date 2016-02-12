'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.pages = [
        {title: "Home", path: "/"},
        {title: "Download list", path: "/client"},
        {title: "Free space", path: "/freespace"}
    ];

    $scope.currentPage = $location.path();

    $scope.go = function(path) {
        $location.path(path);
    };

    $scope.isCurrent = function(page) {
        return page === $location.path();
    }
}]);
