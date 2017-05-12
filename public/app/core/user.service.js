angular
    .module('myApp.core')
    .factory('userService', userService);

userService.$inject = ['$rootScope', '$q', '$http', '$location', 'utilities'];

function userService($rootScope, $q, $http, $location, utilities) {
    var userData = {};

    return {
        get: get,
        isAuthenticated: isAuthenticated,
        logout: logout,
        set: set

    }

    function get() {
        return $q.when(userData);
    }

    // Checks if usercookie exists and returns userData on success. Redirects to login on failure
    function isAuthenticated() {
        //if (userData.id) return userData;
        return $http.get('/verifyAuth').then(function(response) {
            console.log("Is auth", response.data.user);
            if(response.data.user){
                return response.data.user;
            } else {
                $location.path('/login');
            }
        });
        // var userCookie = utilities.getCookie('bitleague');

        // if (userCookie) {
        //     return $http({
        //         url: '/getUser',
        //         method: 'POST',
        //         data: { user: userCookie }
        //     }).then(function(httpResponse) {
        //         if (httpResponse.data.status == "success") {
        //             userData = {
        //                 "username": httpResponse.data.user,
        //                 "id": httpResponse.data.id,
        //                 "cash": httpResponse.data.cash,
        //                 "bitcoin": httpResponse.data.bitcoin,
        //                 "gains": httpResponse.data.gains
        //             };
        //             $rootScope.$broadcast('bl.login');
        //             return userData;
        //         } else if (httpResponse.data == "fail") {
        //             console.log("failed to load user with cookie");
        //             $location.path('/login');
        //         }
        //     });
        // }
    }

    function logout() {
        userData = {};
        utilities.deleteCookie('bitleague');
        $rootScope.$broadcast('bl.logout');
        $location.path('/');
    }

    function set(data) {
        userData = data;
        $rootScope.$broadcast('bl.login');
        return $q.when(userData);
    }
}
