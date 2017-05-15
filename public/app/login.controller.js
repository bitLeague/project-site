angular
    .module('myApp')
    .controller('myCtrl', function($scope, $http, $location, userService, utilities) {

        $scope.submit = function() {
            $http({
                url: '/register',
                method: 'POST',
                data: $scope.data
            }).then(function(httpResponse) {
                if (httpResponse.data.status == "success") {
                    console.log("REGISTERED!")
                    userService.set({
                        "username": httpResponse.data.user,
                        "id": httpResponse.data.id,
                        "cash": httpResponse.data.cash,
                        "bitcoin": httpResponse.data.bitcoin,
                        "gains": httpResponse.data.gains
                    }).then(function(data) {
                        console.log("Go to dashboard?");
                        $location.path('/dashboard');
                    });
                } else {
                    $scope.errorMessage = httpResponse.data.error || "There was an error";
                }
            })
        }

        $scope.login = function() {
            $scope.errorMessage = '';
            $http({
                url: '/login',
                method: 'POST',
                data: $scope.data
            }).then(function(httpResponse) {
                if (httpResponse.data.status == "success") {
                    userService.set({
                        "username": httpResponse.data.user,
                        "id": httpResponse.data.id,
                        "cash": httpResponse.data.cash,
                        "bitcoin": httpResponse.data.bitcoin,
                        "gains": httpResponse.data.gains
                    }).then(function(data) {
                        $location.path('/dashboard');
                    });

                } else {
                    $scope.errorMessage = httpResponse.data.error || "There was an error";
                }
            })
        }
    });
