'use strict';

/**
 * @ngdoc overview
 * @name torrentSubscribeFrontendApp
 * @description
 * # torrentSubscribeFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('torrentSubscribeFrontendApp', [
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'constants'
  ]).config( [
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|magnet):/);
    }
]).config(function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/', {
    templateUrl: 'views/main.html',
    controller: 'SearchCtrl',
  })
  .when('/client', {
    templateUrl: 'views/client.html',
    controller: 'ClientCtrl'
  });

  // configure html5 to get links working on jsfiddle
  $locationProvider.html5Mode(true);
});
