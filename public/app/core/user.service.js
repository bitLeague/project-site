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
            if (response.data.user) {
                return response.data.user;
            } else {
                var openPaths = ['/', '/login', '/register'];
                var indexOfCurrent = openPaths.indexOf($location.path());
                if(indexOfCurrent < 0){
                    $location.path('/');
                }
            }
        });
    }

    function logout() {
        userData = {};
        $rootScope.$broadcast('bl.logout');
        $http.get('/logout').then(function(response) {
            $location.path('/');
        });
    }

    function set(data) {
        userData = data;
        $rootScope.$broadcast('bl.login');
        return $q.when(userData);
    }
}
