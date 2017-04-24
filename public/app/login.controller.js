angular
.module('myApp')
.controller('myCtrl', function($scope, $http, $location, userService) {
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