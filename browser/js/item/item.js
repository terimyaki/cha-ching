app.config(function ($stateProvider) {

    $stateProvider.state('item', {
        url: '/item/:group/:id',
        templateUrl: 'js/item/item.html',
        controller: 'ItemCtrl'
    });

});

app.controller('ItemCtrl', function($scope, ItemFactory, $firebaseObject, $stateParams, FirebaseRefFactory, AuthService, AUTH_EVENTS, $rootScope){

	var ref = FirebaseRefFactory.createLinkByIdRef($stateParams.group + '/' + $stateParams.id);
	$scope.results = $firebaseObject(ref);
	$scope.userLink = undefined;
    $scope.dateAdded = undefined;

	var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
        	if(user){
        		$scope.user = user.user;
				$scope.userLink = $firebaseObject(FirebaseRefFactory.createUserByIdRef($scope.user.uid, 'items/' + $stateParams.group + '-' + $stateParams.id));
                $scope.dateAdded = new Date($scope.userLink.dateAdded);
        	}
        });
    };

    var removeUser = function () {
        $scope.user = null;
    };

    setUser();

	$rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
	$rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
	$rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

});