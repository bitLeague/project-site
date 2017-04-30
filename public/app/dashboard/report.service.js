(function() {
    'use strict';
    angular
        .module('myApp.dashboard')
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
