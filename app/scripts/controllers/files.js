'use strict';

/**
* @ngdoc function
* @name torrentSubscribeFrontendApp.controller:FilesCtrl
* @description
* # FilesCtrl
* Controller of the torrentSubscribeFrontendApp
*/
angular.module('torrentSubscribeFrontendApp')
.controller('FilesCtrl', ['$scope', 'file',
function ($scope, file) {

    $scope.tree = {};
    $scope.currentNode = {};
    $scope.currentNodeChildren = {};
    $scope.path = '';

    $scope.directories = [];
    $scope.currentDirectory = '';


    $scope.setPath = function (path) {
        $scope.path = path;
        if ($scope.path == '') {
            $scope.currentNode = $scope.tree;
        } else {
            $scope.currentNode = getNodeByPath(path);
        }
        setChildren($scope.currentNode);
    };

    $scope.up = function () {
        var pathArr =  $scope.path.split('/');
        if (pathArr.length > 0) {
            $scope.path = _.take(pathArr, pathArr.length - 1).join('/');
        }
        $scope.setPath($scope.path);
    };

    $scope.getDownloadLink = function (path) {
        return file.getDownloadLink(path, $scope.currentDirectory);
    };

    var getNodeByPath = function (path) {
        var node = $scope.tree;
        path.split('/').forEach(function(step) {
            node = node.children.filter(function(child) {
                return child.name == step;
            })[0];
        });
        return node;
    };

    var setChildren = function (currentNode) {
        if (!_.hasIn(currentNode, 'children')) {
            $scope.currentNodeChildren = {};
        }
        $scope.currentNodeChildren = currentNode.children.map(function(child) {
            return _.omit(child, 'children');
        });
    };

    $scope.updateListing = function () {
        file.getTree($scope.currentDirectory , function(tree) {
            $scope.tree = tree;
            $scope.currentNode = tree;
            setChildren(tree);
        });
    };

    file.getDirectories(function(directories) {
        $scope.directories = directories;
        $scope.currentDirectory = directories[0];
        $scope.updateListing();
    });

}]);
