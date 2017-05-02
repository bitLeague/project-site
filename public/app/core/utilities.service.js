angular
    .module('myApp.core')
    .factory('utilities', utilities);

utilities.$inject = [];

function utilities() {
    return {
        createCookie: createCookie,
        deleteCookie: deleteCookie,
        getCookie: getCookie
    };

    function createCookie(name, value, min) {
        var expires = "";
        if (min) {
            var date = new Date();
            date.setTime(date.getTime() + (min * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function deleteCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }
}
