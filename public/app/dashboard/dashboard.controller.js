angular
    .module('myApp.dashboard')
    .controller('dashboardController', function($scope, $http, $location, $alert, userService, tickerService, reportService, utilities, userData) {
        $scope.user = userData;


        function initDashboard() {
            $scope.getTicker();
            $scope.getChartData();
            $scope.orders();
            $scope.leaders();

            // setInterval(function() {
            //     $scope.getTicker();
            //     $scope.ticker = tickerService.get();
            // }, 10000);
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
                    console.log('buy response:', httpResponse);
                    if (httpResponse.data.status == "success") {
                        $scope.user = {
                            "username": $scope.user.username,
                            "id": $scope.user.id,
                            "cash": httpResponse.data.cash,
                            "bitcoin": httpResponse.data.bitcoin,
                            "gains": httpResponse.data.gains
                        };
                        userService.set($scope.user);
                        $scope.orders();
                        $scope.leaders();
                        var myAlert = $alert({ animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Success!', content: 'You bought bitcoins.', placement: 'top', type: 'success', show: true });
                        $scope.quantity = '';
                    } else if (httpResponse.data == "fail") {
                        var myAlert = $alert({ animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Oops!', content: 'We could not process that order.', placement: 'top', type: 'danger', show: true });
                    }
                })
            } else {
                var myAlert = $alert({ animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Oops!', content: 'You don\'t have enough cash to complete this order. Please adjust the quantity.', placement: 'top', type: 'danger', show: true });
            }
        }

        $scope.sell = function() {
            if ($scope.quantity <= $scope.user.bitcoin) {

                $http({
                    url: '/sell',
                    method: 'POST',
                    data: { "quantity": $scope.quantity, "ask": $scope.ticker.ask, "id": $scope.user.id, "cash": $scope.user.cash, "bitcoin": $scope.user.bitcoin }
                }).then(function(httpResponse) {
                    if (httpResponse.data.status == "success") {
                        $scope.user = {
                            "username": $scope.user.username,
                            "id": $scope.user.id,
                            "cash": httpResponse.data.cash,
                            "bitcoin": httpResponse.data.bitcoin,
                            "gains": httpResponse.data.gains
                        };
                        userService.set($scope.user);
                        $scope.orders();
                        $scope.leaders();
                        var myAlert = $alert({ animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Success!', content: 'You sold bitcoins.', placement: 'top', type: 'success', show: true });
                        $scope.quantity = '';
                    } else if (httpResponse.data == "fail") {
                        var myAlert = $alert({ animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Oops!', content: 'Your order couldn\'t be processed', placement: 'top', type: 'danger', show: true });
                    }
                })
            } else {
                var myAlert = $alert({ animation: 'am-fade-and-slide-top', container: '#alert-box', duration: 3, title: 'Oops!', content: 'You don\'t have enough cash to complete this order. Please adjust the quantity.', placement: 'top', type: 'danger', show: true });
            }
        }

        $scope.orders = function() {
            $http({
                url: '/orders',
                method: 'POST',
                data: { "id": $scope.user.id }
            }).then(function(httpResponse) {
                $scope.orderGridOptions = {
                    columnDefs: [{
                        field: 'time',
                        displayName: "Date",
                        cellFilter: 'date',
                        filterCellFiltered: true
                    }, {
                        field: 'action',
                        displayName: "Action"
                    }, {
                        field: 'price',
                        displayName: "Price",
                        cellFilter: 'currency',
                        filterCellFiltered: true
                    }, {
                        field: 'quantity',
                        displayName: "Qty"
                    }, {
                        field: 'type',
                        displayName: "Type"
                    }, {
                        field: 'status',
                        displayName: "Status"
                    }, ]
                };
                $scope.orderGridOptions.data = httpResponse.data.orders;
            });
        }

        $scope.leaders = function() {
            $http({
                url: '/leaders',
                method: 'POST'
            }).then(function(httpResponse) {
                if (httpResponse.data.status == "success") {
                    $scope.leaderGridOptions = {
                        columnDefs: [{
                            field: 'username',
                            displayName: "User"
                        }, {
                            field: 'gains',
                            displayName: "Gains",
                            cellFilter: 'currency',
                            filterCellFiltered: true
                        }]
                    };
                    $scope.leaderGridOptions.data = httpResponse.data.leaders;
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
                if (httpResponse.data.status == "success") {
                    reportService.set("", []);
                    reportService.set("Full Leaderboard", httpResponse.data.leaders);
                } else if (httpResponse.data == "nothing") {
                    reportService.set("Full Leaderboard", []);
                }
                $location.path('/reports');
            })
        }

        $scope.logOut = userService.logout;

        $scope.onClick = function(points, evt) {
            console.log(points, evt);
        };
        $scope.options = {
            elements: { line: { tension: 0 } }
        };
        $scope.series = ["US$"];
        initDashboard();

        // End chart test
    });
