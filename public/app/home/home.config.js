angular
    .module('myApp.home')
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: '/public/app/home/home.html'
            })
    });
