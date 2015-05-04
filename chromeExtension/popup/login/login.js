app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        templateUrl: '/popup/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {
        console.log(true);
        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('login');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

});