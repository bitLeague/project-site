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
        return userData;
    }

    // Checks if usercookie exists and returns userData on success. Redirects to login on failure
    function isAuthenticated() {
        if (userData.id) return userData;
        var userCookie = utilities.getCookie('bitleague');

        if (userCookie) {
            console.log("Cookie found. Attempting to load user");
            return $http({
                url: '/getUser',
                method: 'POST',
                data: { user: userCookie }
            }).then(function(httpResponse) {
                console.log('Get user response:', httpResponse);
                if (httpResponse.data.status == "success") {
                    userData = {
                        "username": httpResponse.data.user,
                        "id": httpResponse.data.id,
                        "cash": httpResponse.data.cash,
                        "bitcoin": httpResponse.data.bitcoin,
                        "gains": httpResponse.data.gains
                    };
                    console.log("Userdata in isAuthenticated", userData);
                    $rootScope.$broadcast('bl.login');
                    return userData;
                } else if (httpResponse.data == "fail") {
                    console.log("failed to load user with cookie");
                    $location.path('/login');
                }
            });
        }
    }

    function logout() {
        console.log("delete cookie and user data");
        userData = {};
        utilities.deleteCookie('bitleague');
        $rootScope.$broadcast('bl.logout');
        $location.path('/');
    }

    function set(data) {
        $rootScope.$broadcast('bl.login');
        userData = data;
    }
}
