app.config(function ($stateProvider) {

    $stateProvider.state('item', {
        url: '/item',
        templateUrl: 'js/item/item.html',
        controller: 'ItemCtrl'
    });

});

app.controller('ItemCtrl', function($scope, ItemFactory, $firebaseObject){

	var ref = new Firebase('https://pricetab.firebaseIO.com/link');
	$scope.syncObject = $firebaseObject(ref);

	$scope.results = undefined;

	$scope.$watch('syncObject', function(newValue, oldValue){
		$scope.results = newValue;
	});

	$scope.link = undefined;
	$scope.alert = {
		supply : false,
		price : false,
		priceThreshold : 0
	};

	$scope.addLink = function(link, alert){
		var submission = {
			link : link,
			alert : alert
		};
		ItemFactory.addLink(submission).then(function(data){
			$scope.results = data;
		});
	};
});

app.factory('ItemFactory', function($http){
	return {
		addLink : function(item){
			return $http.post('/api/item', item).then(function(response){
				return response.data;
			});
		},
		deleteLink : function(id){
			return $http.delete('/api/item/' + id).then(function(response){
				return response.data;
			});
		},
		getLinkList : function(){
			return $http.get('/api/user').then(function(response){
				return response.data;
			});
		}

	};
});