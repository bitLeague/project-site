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
                    "id" : httpResponse.data.id,
                    "cash" : httpResponse.data.cash,
                    "bitcoin" : httpResponse.data.bitcoin,
                    "gains" : httpResponse.data.gains
                });
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
                    "id" : httpResponse.data.id,
                    "cash" : httpResponse.data.cash,
                    "bitcoin" : httpResponse.data.bitcoin,
                    "gains" : httpResponse.data.gains
                });
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

app.controller('dashboardController', function($scope,$http,$location,userService,tickerService) {
    $scope.user = userService.get();
    
    if(!$scope.user.id){
        $location.path('/login');
    }
    
    $scope.getTicker= function(){
        $http({
            url: '/ticker',
            method: 'POST'
        }).then(function (httpResponse) {

            if(httpResponse.data.status != "fail"){
                var tickerJson = angular.fromJson(httpResponse.data.body);
                
                tickerService.set({"bid" : tickerJson.bid,
                    "ask" : tickerJson.ask,
                    "high" : tickerJson.high,
                    "low" : tickerJson.low,
                    "volume" : tickerJson.volume,
                    "last" : tickerJson.last
                });
            }else{
                // in case ticker api fails, fill in static data
                tickerService.set({"bid" : 1219.37,
                    "ask" : 1220.03,
                    "high" : 1229.00,
                    "low" : 1198.02,
                    "volume" : 3418.96841667,
                    "last" : 1220.46
                });
            }
            $scope.ticker = tickerService.get();
        })
    }

    $scope.getChartData= function(){
        $http({
            url: 'http://api.coindesk.com/v1/bpi/historical/close.json',
            method: 'GET'
        }).then(function (httpResponse) {
            $scope.chartData = httpResponse.data.bpi;
        })
    }

    $scope.buy= function(){
        if(($scope.quantity * $scope.ticker.bid) < $scope.user.cash){

            $http({
                url: '/buy',
                method: 'POST',
                data: {"quantity": $scope.quantity, "bid": $scope.ticker.bid, "id": $scope.user.id, "cash": $scope.user.cash, "bitcoin": $scope.user.bitcoin}
            }).then(function (httpResponse) {
                console.log('response:', httpResponse);
                if(httpResponse.data.status == "success"){
                    userService.set({"username" : $scope.user.username,
                        "id" : $scope.user.id,
                        "cash" : httpResponse.data.cash,
                        "bitcoin" : httpResponse.data.bitcoin,
                        "gains" : httpResponse.data.gains
                    });
                    $scope.user = userService.get();
                }else if(httpResponse.data == "fail"){
                    alert("Error: We could not process that order.");
                }
            })
        }else{
            alert("You don't have enough cash to complete this order. Please adjust the quantity.");
        }
    }

    $scope.getTicker();
    $scope.getChartData();

    setInterval(function(){ 
        $scope.getTicker();
        $scope.ticker = tickerService.get();    
    }, 10000);
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

app.factory('tickerService', function() {
    var tickerData = {};
    
    function set(data) {
        tickerData = data;
    }
    function get() {
        return tickerData;
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