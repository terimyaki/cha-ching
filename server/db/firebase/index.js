var Promise = require('bluebird');
var Firebase = Promise.promisifyAll(require('firebase'));

//Utility Functions
function createItemsKey (type, key) {
	return type + '-' + key;
}

function createUserId(uid){
	return uid.split(':')[1];
}

//Firebase Ref Generators Related
function fbRefCreate(){
	return new Firebase('https://pricetab.firebaseIO.com');
}

function fbLinkRefCreate(){
	return new Firebase('https://pricetab.firebaseIO.com/link');
}

function fbUserRefCreate(){
	return new Firebase('https://pricetab.firebaseIO.com/user');
}

function fbLinkRefByIdCreate(type, key){
	return new Firebase('https://pricetab.firebaseIO.com/link/' + type + '/' + key);
}

function fbUserRefByIdCreate(userId){
	return new Firebase('https://pricetab.firebaseIO.com/user/' + userId);
}

function fbUserLinkRefCreate(userID, type, key, option){
	if(option) return new Firebase('https://pricetab.firebaseIO.com/user/' + userID + '/items/' + createItemsKey(type, key) + '/' + option);
	else return new Firebase('https://pricetab.firebaseIO.com/user/' + userID + '/items/' + createItemsKey(type, key));

}

//Link Related
function createOrUpdateLink(type, key, updateFunc, onCompleteFunc){
	fbLinkRefByIdCreate(type, key).transaction(updateFunc, onCompleteFunc);
}

function updateLinkHistory(type, key, linkScrape, cb){
	fbLinkRefByIdCreate(type, key + '/linkHistory').push().setWithPriority(linkScrape, linkScrape.scrapeDate, cb);
}

function deleteLink(type, key){

}

function getLinks(cb){
	fbLinkRefCreate().once('value', cb);
}

//User Related
//CRUD
function userCreate(email, password, cb){
	fbRefCreate().createUser({
		email: email,
		password: password
	}, cb);
}

function userDelete(email, password, cb){
	fbRefCreate().removeUser({
		email : email,
		password : password
	}, cb);
}

function userRead(uid, cb){
	fbUserRefByIdCreate(uid).once('value', function(snapshot){
		cb(snapshot.val());
	});
}
//Auth Related
function userAuthWithPassword(email, password, cb){
	fbRefCreate().authWithPassword({
		email: email,
		password : password
	}, cb);
}

function userDeserializeAuth(token, cb){
	fbRefCreate().authWithCustomToken(token, cb);
}

//Extra Info
function userUpdate(email, password, update){

}

function updateComments(user, type, key, comment){

}

function updateAlerts(user, type, key, alerts){

}

function createUserLinkEntry(userId, type, key, information, cb){
	fbUserLinkRefCreate(userId, type, key).set(information, cb);
}

function removeUserLinkEntry(userId, userLink, cb){
	var type = userLink.split('-')[0];
	var key = userLink.split('-')[1];
	fbUserLinkRefCreate(userId, type, key).remove(cb);
}

module.exports = {
	userCreate : userCreate,
	userRead : userRead,
	userDelete : userDelete,
	userAuthWithPassword : userAuthWithPassword,
	userDeserializeAuth : userDeserializeAuth,
	fbUserRefByIdCreate : fbUserRefByIdCreate,
	createOrUpdateLink: createOrUpdateLink,
	updateLinkHistory: updateLinkHistory,
	createUserLinkEntry : createUserLinkEntry,
	removeUserLinkEntry : removeUserLinkEntry,
	createUserId: createUserId,
	createItemsKey : createItemsKey,
	getLinks : getLinks
};

