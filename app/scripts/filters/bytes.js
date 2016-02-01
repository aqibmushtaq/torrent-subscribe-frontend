'use strict';

/**
 * @ngdoc filter
 * @name torrentSubscribeFrontendApp.filter:bytes
 * @function
 * @description
 * # bytes
 * Filter in the torrentSubscribeFrontendApp.
 */
angular.module('torrentSubscribeFrontendApp').filter('bytes', function() {
    return function(bytes, precision, speed) {
        if (bytes == "0" || bytes == 0)
            return "-"

        if (isNaN(parseFloat(bytes)) || !isFinite(bytes))
            return '-';

        if (typeof precision === 'undefined')
            precision = 1;

        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
        var number = Math.floor(Math.log(bytes) / Math.log(1024));

        var val = (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        if (speed) {
            val += "/s";
        }
        return val;
    }
});
