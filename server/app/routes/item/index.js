var router = require('express').Router();
module.exports = router;

//import firebase methods
var db = require('../../../db/firebase');

// import scraper
var scraper = require('../../../scrapers');

//This will be for user to add/delete links that need to be tracked
router.post('/', function(req, res, next){
	console.log(req.body);
	scraper(req.body.link).then(function(linkInfo){
		//Checks to see if the ref already exists
		db.createOrUpdateLink(linkInfo.type, linkInfo.key, function(currentData){
			//Update Function
			if(currentData === null) {
				return {
					name : linkInfo.name,
					image : linkInfo.image,
					url : linkInfo.url
				};
			}
		}, function(error, committed, snapshot){
			//On completion Function
			if(error) return next(error);
			else if(committed) db.updateLinkHistory(linkInfo.type, linkInfo.key, linkInfo.linkInfo);
			db.createUserLinkEntry(req.body.id, linkInfo.type, linkInfo.key, {
				dateAdded : Date.now(),
				comment:req.body.comment,
				alert : req.body.alert
			}, function(error){
				if(error) return next(error);
				res.status(200);
			});
		});
	});
});

router.delete('/', function(req, res, next){
	db.removeUserLinkEntry(req.query.id, req.query.link, function(error){
		if(error) return next(error);
		res.status(200);
	});
});