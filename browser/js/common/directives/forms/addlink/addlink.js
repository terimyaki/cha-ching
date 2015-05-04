'use strict';
app.directive('addlinkform', function (UserItemFactory) {
    return {
        restrict: 'E',
        scope: {
            user: '='
        },
        templateUrl: 'js/common/directives/forms/addlink/addlink.html',
        link : function(scope, element, attribute) {

            scope.link = undefined;
            scope.comment = undefined;
            scope.alert = {
                supply : false,
                price : false,
                priceThreshold : 0
            };

        	scope.addLink = function(){
                var submission = {
                    id : scope.user,
                    link : scope.link,
                    comment: scope.comment,
                    alert : scope.alert
                };
                UserItemFactory.addLink(submission).then(function(data){
                    scope.link = undefined;
                    scope.comment = undefined;
                    scope.alert = {
                        supply : false,
                        price : false,
                        priceThreshold : 0
                    };
                });
            };
        }

    };
});