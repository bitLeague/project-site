var app = angular.module('myApp', ['ngRoute']);
 app.controller('myCtrl', function($scope,$http,$location) {
 
$scope.submit= function(){
    console.log('clicked submit');
    $http({
        url: 'http://localhost:8080/register',
        method: 'POST',
        data: $scope.data
    }).then(function (httpResponse) {
        console.log('response:', httpResponse);
        if(httpResponse.data = "success"){
        	$location.path('/dashboard');
        }
    })
   }
 });

 // Define routes for the module.
app.config(function ($routeProvider) {
    $routeProvider
    .when('/dashboard', {
        controller: 'myCtrl',
        templateUrl: '/views/dashboard.html'
    })
    .when('/register', {
        controller: 'myCtrl',
        templateUrl: '/views/register.html'
    })
    .otherwise({
        redirectTo: '/register'
    });
});