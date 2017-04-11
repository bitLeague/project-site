var app = angular.module('myApp', ['ngRoute']);
app.controller('myCtrl', function($scope,$http,$location,userService) {

    $scope.submit= function(){
        console.log('clicked submit');
        $http({
            url: '/register',
            method: 'POST',
            data: $scope.data
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
            if(httpResponse.data.status == "success"){
                userService.set({"username" : httpResponse.data.user,
                "id" : httpResponse.data.id});
                $location.path('/dashboard');
            }
        })
    }

    $scope.login= function(){
        console.log('clicked submit');
        $http({
            url: '/login',
            method: 'POST',
            data: $scope.data
        }).then(function (httpResponse) {
            console.log('response:', httpResponse);
            if(httpResponse.data.status == "success"){
                userService.set({"username" : httpResponse.data.user,
                "id" : httpResponse.data.id});
                $location.path('/dashboard');
            }else if(httpResponse.data == "fail"){
                $scope.errorMessage = 'Invalid username or password';
            }
        })
    }

    $scope.loadregistration= function(){
        $location.path('/register');
    }
 });

app.controller('dashboardController', function($scope,$http,$location,userService) {
    $scope.user = userService.get();
});

app.factory('userService', function() {
    var userData = {};
    
    function set(data) {
        userData = data;
    }
    function get() {
        return userData;
    }

    return {
        set: set,
        get: get
    }
});

 // Define routes for the module.
app.config(function ($routeProvider) {
    $routeProvider
    .when('/dashboard', {
        controller: 'dashboardController',
        templateUrl: '/views/dashboard.html'
    })
    .when('/login', {
        controller: 'myCtrl',
        templateUrl: '/views/login.html'
    })
    .when('/register', {
        controller: 'myCtrl',
        templateUrl: '/views/register.html'
    })
    .otherwise({
        redirectTo: '/login'
    });
});