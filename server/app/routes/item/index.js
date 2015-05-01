var router = require('express').Router();
module.exports = router;

//import firebase
var Firebase = require('firebase');
var LinkModel = new Firebase('https://pricetab.firebaseIO.com/link');

// import scraper
var scraper = require('../../../scrapers');

function linkFirebaseSet (type, key){
	return new Firebase('https://pricetab.firebaseIO.com/link/' + type + '/' + key);
}

function ifRefExist(ref){
	ref.once('value', function(snapshot){
		return snapshot.exists();
	});
}

function updateHistory(ref, newInfo, cb){
	ref.setWithPriority(newInfo, newInfo.scrapeDate, cb);
}

//This will be for user to add/delete links that need to be tracked
router.post('/', function(req, res, next){
	scraper(req.body.link).then(function(linkInfo){
		var linkFire = linkFirebaseSet(linkInfo.type, linkInfo.key);

		if(!ifRefExist(linkFire)){
			//Creates a new entry
			linkFire.set({
				name : linkInfo.linkInfo.name,
				dateAdded : Date.now(),
				alert : req.body.alert
			}, function(error){
				if(error) return next(error);
				var linkFireHistory = linkFirebaseSet(linkInfo.type, linkInfo.key + '/linkHistory').push();
				linkFireHistory.set(linkInfo.linkInfo, function(error){
					if(error) return next(error);
					res.json(linkInfo);
				});
			});
		} else {
			console.log('this entry already exists');
			res.json(linkInfo);
		}
	});
});

router.put('/', function(req, res, next){
	scraper(req.body.link).then(function(linkInfo){
		var linkFireHistory = linkFirebaseSet(linkInfo.type, linkInfo.key + '/linkHistory').push();
		updateHistory(linkFireHistory, linkInfo.linkInfo, function(error){
			if(error) return next(error);
			res.json(linkInfo);
		});
	});
});
router.delete('/:id', function(req, res, next){
	// var linkFire = linkFirebaseSet()
});