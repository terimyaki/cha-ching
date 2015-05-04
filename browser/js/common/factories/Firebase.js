app.factory('FirebaseRefFactory', function(){
	return {
		createUserByIdRef : function(userId, option){
			if(option) return new Firebase('https://pricetab.firebaseIO.com/user/' + userId + '/' + option);
			else return new Firebase('https://pricetab.firebaseIO.com/user/' + userId);
		},
		createLinkByIdRef : function(itemLink){
			return new Firebase('https://pricetab.firebaseIO.com/link/' + itemLink);
		},
		generateLinkName : function(itemKey){
			return itemKey.split('-').join('/');
		}
	};
});
