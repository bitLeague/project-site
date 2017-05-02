(function() {
    'use strict';
    angular
        .module('myApp.dashboard')
        .factory('tickerService', function() {
        var tickerData = {};

        function set(data) {
            tickerData = data;
        }

        function get() {
            return tickerData;
        }

        return {
            set: set,
            get: get
        }
    })
})();
