angular
    .module('myApp.layout')
    .directive('blMenu', blMenu);
blMenu.$inject = ['$q', 'userService'];

function blMenu($q, userService) {
    return {
        restrict: 'E',
        scope: {

        },
        link: function(scope, element, attrs) {
            $q.when(userService.isAuthenticated()).then(function(user) {
                scope.user = user;
            });
            scope.logout = userService.logout;

            scope.$on('bl.login', function() {
                $q.when(userService.isAuthenticated()).then(function(user) {
                    console.log("LOGIN", user);
                    scope.user = user;
                    console.log("LOGIN scope", scope.user);
                });
            });

            scope.$on('bl.logout', function() {
                scope.user = {};
            });
        },
        templateUrl: '/public/app/layout/bl-menu-template.html'
    };
}
