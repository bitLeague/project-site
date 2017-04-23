var app = angular.module('myApp', ['ngRoute', 'chart.js', 'mgcrea.ngStrap']);
app.controller('myCtrl', function($scope, $http, $location, userService, $sce) {

    $scope.alert = {
        "title": "Holy guacamole!",
        "content": $sce.trustAsHtml("HI"),
        "type": "info"
    };
    $scope.submit = function() {
        console.log('clicked submit');
        $http({
            url: '/register',
            method: 'POST',
            data: $scope.data
        }).then(function(httpResponse) {
            console.log('response:', httpResponse);
            if (httpResponse.data.status == "success") {
                userService.set({
                    "username": httpResponse.data.user,
                    "id": httpResponse.data.id,
                    "cash": httpResponse.data.cash,
                    "bitcoin": httpResponse.data.bitcoin,
                    "gains": httpResponse.data.gains
                });
                $location.path('/dashboard');
            } else if (httpResponse.data.error) {
                $scope.errorMessage = httpResponse.data.error;
            }
        })
    }

    $scope.login = function() {
        console.log('clicked submit');
        $http({
            url: '/login',
            method: 'POST',
            data: $scope.data
        }).then(function(httpResponse) {
            console.log('response:', httpResponse);
            if (httpResponse.data.status == "success") {
                userService.set({
                    "username": httpResponse.data.user,
                    "id": httpResponse.data.id,
                    "cash": httpResponse.data.cash,
                    "bitcoin": httpResponse.data.bitcoin,
                    "gains": httpResponse.data.gains
                });
                $location.path('/dashboard');
            } else if (httpResponse.data == "fail") {
                $scope.errorMessage = 'Invalid username or password';
            }
        })
    }

    $scope.loadregistration = function() {
        $location.path('/register');
    }
});

app.controller('dashboardController', function($scope, $http, $location, userService, tickerService, reportService) {
    // Get user information, if none, redirect to login
    $scope.user = userService.get();

    if (!$scope.user.id) {
        $location.path('/login');
    }

    $scope.getTicker = function() {
        $http({
            url: '/ticker',
            method: 'POST'
        }).then(function(httpResponse) {

            if (httpResponse.data.status != "fail") {
                var tickerJson = angular.fromJson(httpResponse.data.body);

                tickerService.set({
                    "bid": tickerJson.bid,
                    "ask": tickerJson.ask,
                    "high": tickerJson.high,
                    "low": tickerJson.low,
                    "volume": tickerJson.volume,
                    "last": tickerJson.last
                });
            } else {
                // in case ticker api fails, fill in static data
                tickerService.set({
                    "bid": 1219.37,
                    "ask": 1220.03,
                    "high": 1229.00,
                    "low": 1198.02,
                    "volume": 3418.96841667,
                    "last": 1220.46
                });
            }
            $scope.ticker = tickerService.get();
        })
    }

    $scope.getChartData = function() {
        $http({
            url: '/chart',
            method: 'POST'
        }).then(function(httpResponse) {
            $scope.labels = [];
            $scope.data = [
                []
            ]; // Assign empty array to first index for chart js
            // Need to add defined check
            angular.forEach(httpResponse.data.bpi, function(value, key) {
                $scope.labels.push(key);
                $scope.data[0].push(value);
            });

        })
    }

    $scope.buy = function() {
        if (($scope.quantity * $scope.ticker.bid) < $scope.user.cash) {

            $http({
                url: '/buy',
                method: 'POST',
                data: { "quantity": $scope.quantity, "bid": $scope.ticker.bid, "id": $scope.user.id, "cash": $scope.user.cash, "bitcoin": $scope.user.bitcoin }
            }).then(function(httpResponse) {
                console.log('response:', httpResponse);
                if (httpResponse.data.status == "success") {
                    userService.set({
                        "username": $scope.user.username,
                        "id": $scope.user.id,
                        "cash": httpResponse.data.cash,
                        "bitcoin": httpResponse.data.bitcoin,
                        "gains": httpResponse.data.gains
                    });
                    $scope.user = userService.get();
                    $scope.orders();
                    $scope.leaders();
                } else if (httpResponse.data == "fail") {
                    alert("Error: We could not process that order.");
                }
            })
        } else {
            alert("You don't have enough cash to complete this order. Please adjust the quantity.");
        }
    }

    $scope.sell = function() {
        if ($scope.quantity <= $scope.user.bitcoin) {

            $http({
                url: '/sell',
                method: 'POST',
                data: { "quantity": $scope.quantity, "ask": $scope.ticker.ask, "id": $scope.user.id, "cash": $scope.user.cash, "bitcoin": $scope.user.bitcoin }
            }).then(function(httpResponse) {
                console.log('response:', httpResponse);
                if (httpResponse.data.status == "success") {
                    userService.set({
                        "username": $scope.user.username,
                        "id": $scope.user.id,
                        "cash": httpResponse.data.cash,
                        "bitcoin": httpResponse.data.bitcoin,
                        "gains": httpResponse.data.gains
                    });
                    $scope.user = userService.get();
                    $scope.orders();
                    $scope.leaders();
                } else if (httpResponse.data == "fail") {
                    alert("Error: We could not process that order.");
                }
            })
        } else {
            alert("You cannot sell more Bitcoins than you currently have.");
        }
    }

    $scope.orders = function() {
        $http({
            url: '/orders',
            method: 'POST',
            data: { "id": $scope.user.id }
        }).then(function(httpResponse) {
            console.log('response:', httpResponse);
            if (httpResponse.data.status == "success") {
                $scope.ordersArray = httpResponse.data.orders;
            } else if (httpResponse.data == "nothing") {
                $scope.ordersArray = [];
            }
        })
    }

    $scope.leaders = function() {
        $http({
            url: '/leaders',
            method: 'POST'
        }).then(function(httpResponse) {
            console.log('response:', httpResponse);
            if (httpResponse.data.status == "success") {
                $scope.leadersArray = httpResponse.data.leaders;
            } else if (httpResponse.data == "nothing") {
                $scope.leadersArray = [];
            }
        })
    }

    $scope.userTransactionReport = function() {
        $http({
            url: '/usertransactionreport',
            method: 'POST',
            data: { "id": $scope.user.id }
        }).then(function(httpResponse) {
            console.log('response:', httpResponse);
            if (httpResponse.data.status == "success") {
                reportService.set("", []);
                reportService.set("Your Transactions", httpResponse.data.orders);
            } else if (httpResponse.data == "nothing") {
                reportService.set("Your Transactions", []);
            }
            $location.path('/reports');
        })
    }

    $scope.systemTransactionReport = function() {
        $http({
            url: '/systemtransactionreport',
            method: 'POST'
        }).then(function(httpResponse) {
            console.log('response:', httpResponse);
            if (httpResponse.data.status == "success") {
                reportService.set("", []);
                reportService.set("System's Recent Transactions", httpResponse.data.orders);
            } else if (httpResponse.data == "nothing") {
                reportService.set("System's Recent Transactions", []);
            }
            $location.path('/reports');
        })
    }

    $scope.leaderboardReport = function() {
        $http({
            url: '/leadersreport',
            method: 'POST',
        }).then(function(httpResponse) {
            console.log('response:', httpResponse);
            if (httpResponse.data.status == "success") {
                reportService.set("", []);
                reportService.set("Full Leaderboard", httpResponse.data.leaders);
            } else if (httpResponse.data == "nothing") {
                reportService.set("Full Leaderboard", []);
            }
            $location.path('/reports');
        })
    }

    $scope.logOut = function() {
        $location.path('/login');
    }

    $scope.getTicker();
    $scope.getChartData();
    $scope.orders();
    $scope.leaders();

    setInterval(function() {
        $scope.getTicker();
        $scope.ticker = tickerService.get();
    }, 10000);

    $scope.onClick = function(points, evt) {
        console.log(points, evt);
    };
    $scope.options = {
        elements: { line: { tension: 0 } }
    };
    $scope.series = ["US$"];

    // End chart test
});

app.controller('reportsController', function($scope, $http, $location, userService, reportService) {
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

app.factory('reportService', function() {
    var reportName;
    var reportData = [];

    function set(name, data) {
        reportName = name;
        reportData = data;
    }

    function getData() {
        return reportData;
    }

    function getName() {
        return reportName;
    }
    return {
        set: set,
        getData: getData,
        getName: getName
    }
});

// Define routes for the module.
app.config(function($routeProvider) {
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
