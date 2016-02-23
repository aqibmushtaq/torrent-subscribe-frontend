'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:LoginCtrl
* @description
* # LoginCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('LoginCtrl', ['$scope', 'user', '$sessionStorage', '$location',
function ($scope, user, $sessionStorage, $location) {

    $scope.username = '';
    $scope.password = '';
    $scope.message = '';

    $scope.login = function () {
        user.login($scope.username, $scope.password, function (result) {
            if (!result.success) {
                $scope.message = result.message;
                return;
            }

            $scope.message = '';
            $location.path("/");
        });
    };

}]);
