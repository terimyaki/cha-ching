'use strict';
var router = require('express').Router();
module.exports = router;

//import firebase methods
var db = require('../../../db/firebase');

// import scraper
var scraper = require('../../../scrapers');

router.get('/', function(req, res, next){
	console.log('what up dawg');
});

router.post('/', function(req, res, next){
	console.log(req.body);
	console.log(' you are in the extension ');
	var link = {
		id: req.body.id,
		link: req.body.link,
		comment :req.body.comment,
		alert : {
			supply : req.body.hasOwnProperty('supply') ? true : false,
			price : req.body.hasOwnProperty('price') ? true : false,
			priceThreshold : req.body.priceThreshold
		}
	};
	scraper(link.link).then(function(linkInfo){
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
			db.createUserLinkEntry(link.id, linkInfo.type, linkInfo.key, {
				dateAdded : Date.now(),
				comment:link.comment,
				alert : link.alert
			}, function(error){
				if(error) return next(error);
				res.status(200);
			});
		});
	});
});

router.delete('/:url', function(req, res, next){

});