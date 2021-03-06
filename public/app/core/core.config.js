// Define routes for the module.
angular.module('myApp.core').config(function($routeProvider, $qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $routeProvider
        .when('/reports', {
            controller: 'reportsController',
            templateUrl: '/public/reports.html',
            resolve: {
                userData: function(userService) {
                    return userService.isAuthenticated();
                }
            }
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
            redirectTo: '/'
        });
});
