angular.module('myApp').controller('reportsController', function($scope, $http, $location, userService, reportService) {
    // Get user information, if none, redirect to login
    $scope.user = userService.get();

    if (!$scope.user.id) {
        $location.path('/login');
    }

    $scope.reportName = reportService.getName();
    $scope.rowsArray = reportService.getData();

    $scope.loadDashboard = function() {
        $location.path('/dashboard');
    }
});
