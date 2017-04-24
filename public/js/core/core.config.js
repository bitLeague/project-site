// Define routes for the module.
angular.module('myApp.core').config(function($routeProvider) {
    $routeProvider
        .when('/dashboard', {
            controller: 'dashboardController',
            templateUrl: '/public/dashboard.html'
        })
        .when('/reports', {
            controller: 'reportsController',
            templateUrl: '/public/reports.html'
        })
        .when('/login', {
            controller: 'myCtrl',
            templateUrl: '/public/login.html'
        })
        .when('/register', {
            controller: 'myCtrl',
            templateUrl: '/public/register.html'
        })
        .otherwise({
            redirectTo: '/login'
        });
});