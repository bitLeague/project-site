(function() {
    'use strict';
    angular
        .module('myApp.dashboard')
        .factory('reportService', function($http, $alert) {
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
                    console.log("DATA", httpResponse.data);
                    doDownload(httpResponse.data);
                    var myAlert = $alert({animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Success!', content: reportName + ' report has been downloaded.', placement: 'top', type: 'success', show: true});
                }).catch(function(response) {
                    var myAlert = $alert({animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Oops!', content: reportName + ' report couldn\'t be downloaded.', placement: 'top', type: 'danger', show: true});
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
