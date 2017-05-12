angular
    .module('myApp.dashboard')
    .config(function($routeProvider) {
        $routeProvider
            .when('/dashboard', {
                controller: 'dashboardController',
                templateUrl: '/public/app/dashboard/dashboard.html',
                resolve: {
                    userData: function(userService) {
                        console.log("IS AUTH?", userService.isAuthenticated())
                        return userService.isAuthenticated();
                    }
                }
            })
    });
