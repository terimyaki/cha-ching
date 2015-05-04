'use strict';
app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, FirebaseRefFactory, $firebaseObject) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {

            scope.items = [
                { label: 'Home', state: 'home' },
                { label: 'List', state: 'list', auth: true}
                // { label: 'Members Only', state: 'membersOnly', auth: true }
            ];

            scope.user = null;
            scope.userInfo = null;

            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };

            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    if(user) {
                        scope.user = user.user;
                        scope.userInfo = $firebaseObject(FirebaseRefFactory.createUserByIdRef(scope.user.uid));
                    }
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});