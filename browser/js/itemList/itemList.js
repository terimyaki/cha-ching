app.config(function ($stateProvider) {

    $stateProvider.state('list', {
        url: '/list',
        templateUrl: 'js/itemList/itemList.html',
        controller: 'ItemListCtrl',
        data: {
            authenticate: true
        }
    });

});

app.controller('ItemListCtrl', function($scope, UserItemFactory, $firebaseArray, AuthService, $rootScope, AUTH_EVENTS, FirebaseRefFactory){

	var ref = new Firebase('https://pricetab.firebaseIO.com/link');
	$scope.results = undefined; 
	
	// var modal = UIkit.modal('#addlink');
	$scope.formshow = false;

	$scope.toggleAddLinkForm = function(){
		$scope.formshow = !$scope.formshow;
		// console.log('i am clicked', modal);
		// modal.show();
	};

	// $scope.scrapeMe = function(category, key){
	// 	UserItemFactory.scrapeMe(category, key);
	// };

	// $scope.addComment = function(category, key, comment){
	// 	UserItemFactory.addComment(category, key, comment);
	// };

	// $scope.changeAlert = function(category, key, update){
	// 	UserItemFactory.changeAlert(category, key, update);
	// };

	var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
        	if(user){
        		$scope.user = user.user;
				$scope.results = $firebaseArray(FirebaseRefFactory.createUserByIdRef($scope.user.uid, 'items'));
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

app.factory('UserItemFactory', function($http){
	return {
		addLink : function(submission){
			return $http.post('/api/user/item', submission).then(function(response){
				return response.data;
			});
		},
		deleteLink : function(userId, userLinkName){
			var config = {
				params : {
					id : userId,
					link : userLinkName
				}
			};
            return $http.delete('/api/user/item/', config).then(function(response){
                return response.data;
            });
        },
		getLinkList : function(){
			return $http.get('/api/user').then(function(response){
				return response.data;
			});
		},
		addComment : function(category, key, comment){
			return $http.put('/api/item/' + category + '/' + key, comment).then(function(response){
				return response.data;
			});
		},
		getLink : function(category, key){
			return $http.get('/api/item/' + category + '/' + key).then(function(response){
				return response.data;
			});
		},
		changeAlert : function(category, key, update){
			return $http.put('/api/item/' + category + '/' + key, update).then(function(response){
				return response.data;
			});
		},


	};
});