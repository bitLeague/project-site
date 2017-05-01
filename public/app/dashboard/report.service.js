(function() {
    'use strict';
    angular
        .module('myApp.dashboard')
        .factory('reportService', function($http) {
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

            // Super ugly download csv methods
            function downloadCSV(data) {
                $http({
                    url: '/api/v1/json-to-csv',
                    method: 'POST',
                    data: data
                }).then(function(httpResponse) {
                    doDownload(httpResponse.data);
                });
            }

            function doDownload(csv) {
                window.URL = window.URL || window.webkitURL;

                var contentType = 'text/csv';

                var csvFile = new Blob([csv], { type: contentType });

                var a = document.createElement('a');
                a.download = encodeURIComponent(reportName.toLowerCase().replace(/\s/g, '-').replace(/[^\w\-]/gi, '')) + '.csv';
                a.href = window.URL.createObjectURL(csvFile);
                a.textContent = 'Download CSV';
                a.style = "display:none";

                a.dataset.downloadurl = [contentType, a.download, a.href].join(':');

                document.body.appendChild(a);
                a.click();
            }
            return {
                set: set,
                downloadCSV: downloadCSV,
                getData: getData,
                getName: getName
            }
        });
})();
