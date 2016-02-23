'use strict';

/**
* @ngdoc service
* @name torrentSubscribeFrontendApp.file
* @description
* # file
* Service in the torrentSubscribeFrontendApp.
*/
angular.module('torrentSubscribeFrontendApp')
.factory('authInterceptor', function ($rootScope, $q, $window, $sessionStorage) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
        config.headers['token'] = $sessionStorage.user_token || '';
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
        console.log('not logged in')
      }
      return response || $q.when(response);
    }
  };
});

angular.module('torrentSubscribeFrontendApp')
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});


angular.module('torrentSubscribeFrontendApp')
.run( function($rootScope, $location, $sessionStorage, user) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        var token = $sessionStorage.user_token;
        if (!token) {
            $location.path('/login');
            return;
        }

        user.isLoggedIn(function(result) {
            if (!result.success)
                $location.path('/login');
        })
    });
});
