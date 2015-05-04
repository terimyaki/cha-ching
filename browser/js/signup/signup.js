app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function ($scope, AuthService, $state, UserFactory) {

    $scope.user = {
    	name : undefined,
    	email : undefined,
    	password: undefined,
    };

    $scope.confirm = undefined;

    $scope.createUser = function(user){
    	UserFactory.createUser(user).then(function(data){
    		$state.go('home');
    	});
    };

    $scope.confirmPassword = function(p1, p2){
    	return p1 === p2;
    };

    $scope.deleteUser = function(user){
    	UserFactory.deleteUser(user).then(function(data){
    		$state.go('home');
    	});
    };
});

app.factory('UserFactory', function($http){

	return {
		createUser : function(user){
			return $http.post('api/user', user).then(function(response){
				return response.data;
			});
		},
		deleteUser : function(user){
			var config = {
				params : user
			};
			return $http.delete('api/user', config).then(function(response){
				return response.data;
			});
		},
		updateEmail : function(user){

		},
		updatePassword : function(user){

		},
		updateName : function(userId, name){

		}
	};
});