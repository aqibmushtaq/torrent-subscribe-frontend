'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:MainCtrl
* @description
* # MainCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('MainCtrl', ['$scope', '$location', 'user',
function ($scope, $location, user) {
    $scope.pages = [
        {title: "Home", path: "/"},
        {title: "Download list", path: "/client"},
        {title: "Free space", path: "/freespace"},
        {title: "Files", path: "/files"}
    ];

    $scope.currentPage = $location.path();

    $scope.go = function(path) {
        $location.path(path);
    };

    $scope.isCurrent = function(page) {
        return page === $location.path();
    }

    $scope.isLoggedIn = user.getIsLoggedIn;
    $scope.logout = function() {
        $location.path('/login');
        user.logout();
    };

}]);
