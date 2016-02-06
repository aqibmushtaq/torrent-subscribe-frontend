'use strict';

/**
* @ngdoc filter
* @name torrentSubscribeFrontendApp.filter:date
* @function
* @description
* # date
* Filter in the torrentSubscribeFrontendApp.
*/
angular.module('torrentSubscribeFrontendApp')
.filter('date', function () {
    return function (seconds) {
        if (typeof seconds != "number") {
            seconds = parseInt(seconds);
            if (isNaN(seconds)) {
                return "-"
            }
        }
        if (seconds == 0) {
            return "-";
        }
        return moment().set('s', seconds).fromNow();
    };
});
