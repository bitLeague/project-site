angular
    .module('myApp')
    .controller('myCtrl', function($scope, $http, $location, userService, utilities) {

        $scope.submit = function() {
            console.log('clicked submit');
            $http({
                url: '/register',
                method: 'POST',
                data: $scope.data
            }).then(function(httpResponse) {
                console.log('response:', httpResponse.data.error);
                if (httpResponse.data.status == "success") {
                    userService.set({
                        "username": httpResponse.data.user,
                        "id": httpResponse.data.id,
                        "cash": httpResponse.data.cash,
                        "bitcoin": httpResponse.data.bitcoin,
                        "gains": httpResponse.data.gains
                    });
                    $location.path('/dashboard');
                } else {
                    $scope.errorMessage = httpResponse.data.error;
                }
            })
        }

        $scope.login = function() {
            $scope.errorMessage = '';
            console.log('clicked login submit');
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
                    }).then(function(data){
                        console.log("User data?", data);
                        // utilities.createCookie('bitleague', httpResponse.data.user, 8000);
                        $location.path('/dashboard');
                    })
                    
                } else {
                    $scope.errorMessage = httpResponse.data.error || "There was an error";
                }
            })
        }
    });
