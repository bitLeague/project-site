(function() {
    'use strict';
    angular.module('myApp', [
        /*
         * Order is not important. Angular makes a
         * pass to register all of the modules listed
         * and then when app.dashboard tries to use app.data,
         * its components are available.
         */

        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */
        'myApp.core',
        /*
         * Feature areas
         */
        'myApp.dashboard'
    ]) 
    .factory('userService', function() {
        var userData = {};

        function set(data) {
            userData = data;
        }

        function get() {
            return userData;
        }

        return {
            set: set,
            get: get
        }
    })
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

    .factory('reportService', function() {
        var reportName;
        var reportData = [];

        function set(name, data) {
            reportName = name;
            reportData = data;
        }

        function getData() {
            return reportData;
        }

        function getName() {
            return reportName;
        }
        return {
            set: set,
            getData: getData,
            getName: getName
        }
    });
})();
