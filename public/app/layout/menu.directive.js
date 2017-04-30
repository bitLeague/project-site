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
            scope.user = userService.get();
            $q.when(userService.isAuthenticated()).then(function(data) {
                scope.user = data;
            });
            scope.logout = userService.logout;

            scope.$watch('user', function() {
                scope.user = userService.get();
            });
            scope.$on('bl.login', function() {
                $q.when(userService.get()).then(function(data) {
                    scope.user = data;
                });
            });

            scope.$on('bl.logout', function() {
                scope.user = {};
            });
        },
        templateUrl: '/public/app/layout/bl-menu-template.html'
    };
}
