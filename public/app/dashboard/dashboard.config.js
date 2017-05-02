angular
    .module('myApp.dashboard')
    .config(function($routeProvider) {
        $routeProvider
            .when('/dashboard', {
                controller: 'dashboardController',
                templateUrl: '/public/app/dashboard/dashboard.html',
                resolve: {
                    userData: function(userService) {
                        return userService.isAuthenticated();
                    }
                }
            })
    });
