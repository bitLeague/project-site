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
            $q.when(userService.isAuthenticated()).then(function(data) {
                scope.user = data;
            });
            scope.logout = userService.logout;

            scope.$on('bl.login', function() {
                console.log("HI", userService.get());
                scope.user = userService.get();
            });

            scope.$on('bl.logout', function() {
                scope.user = {};
            });
        },
        templateUrl: '/public/app/layout/bl-menu-template.html'
    };
}
