'use strict';
app.directive('item', function (UserItemFactory, ItemFactory, FirebaseRefFactory, $firebaseObject) {
    return {
        restrict: 'E',
        replace : true,
        scope: {
        	item : '=',
            user: '='
        },
        templateUrl: 'js/common/directives/item/item.html',
        link : function(scope, element, attribute) {
            scope.info = $firebaseObject(FirebaseRefFactory.createLinkByIdRef(FirebaseRefFactory.generateLinkName(scope.item.$id)));

            scope.url = FirebaseRefFactory.generateLinkName(scope.item.$id);
            console.log(scope.item);
        	scope.removeMe = function(){
        		UserItemFactory.deleteLink(scope.user, scope.item.$id);
        	};
        }

    };
});

app.factory('ItemFactory', function($http){
    return {
        scrapeLink : function(category, key){
            return $http.put('/api/item/' + category + '/' + key).then(function(response){
                return response.data;
            });
        }
    };
});