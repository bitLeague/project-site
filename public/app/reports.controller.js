angular.module('myApp').controller('reportsController', function($scope, $http, $location, userService, reportService) {
    // Get user information, if none, redirect to login

    $scope.reportName = reportService.getName();
    if ($scope.reportName === "Full Leaderboard") {
        $scope.reportGridOptions = {
            columnDefs: [{
                field: 'username',
                displayName: "User"
            }, {
                field: 'gains',
                displayName: "Gains",
                cellFilter: 'currency',
                filterCellFiltered: true
            } ]
        };
        $scope.reportGridOptions.data = reportService.getData();
        $scope.reportData = reportService.getData();
    } else if ($scope.reportName === "System's Recent Transactions") {
        $scope.reportGridOptions = {
            columnDefs: [{
                field: 'username',
                displayName: "User"
            }, {
                field: 'time',
                displayName: "Date",
                cellFilter: 'date',
                filterCellFiltered: true
            }, {
                field: 'action',
                displayName: "Action"
            }, {
                field: 'price',
                displayName: "Price",
                cellFilter: 'currency',
                filterCellFiltered: true
            }, {
                field: 'quantity',
                displayName: "Qty"
            }, {
                field: 'type',
                displayName: "Type"
            }, {
                field: 'status',
                displayName: "Status"
            }, ]
        };
        $scope.reportGridOptions.data = reportService.getData();
        $scope.reportData = reportService.getData();
    } else { // default to Your Transactions
        $scope.reportGridOptions = {
            columnDefs: [{
                field: 'time',
                displayName: "Date",
                cellFilter: 'date',
                filterCellFiltered: true
            }, {
                field: 'action',
                displayName: "Action"
            }, {
                field: 'price',
                displayName: "Price",
                cellFilter: 'currency',
                filterCellFiltered: true
            }, {
                field: 'quantity',
                displayName: "Qty"
            }, {
                field: 'type',
                displayName: "Type"
            }, {
                field: 'status',
                displayName: "Status"
            }, ]
        };
        $scope.reportGridOptions.data = reportService.getData();
        $scope.reportData = reportService.getData();
    }
    $scope.loadDashboard = function() {
        $location.path('/dashboard');
    }

    $scope.downloadCSV = reportService.downloadCSV;
});
