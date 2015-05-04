var CronJob = require('cron').CronJob;
var scraper = require('./scrapers');
var db = require('./db/firebase');

module.exports = function () {
	// var demo = new CronJob('* * * * * *', function() {
	//   console.log('You will see this message every second');
	// }, null, true, 'America/Los_Angeles');

	var scrape = new CronJob('00 03 * * * *', function(){
		db.getLinks(function(snapshot){
			var sets = snapshot.val();
			var links = [];
			for(var set in sets){
				var link = Object.keys(sets[set]);
				var results = link.map(function(el){
					return {
						type: set,
						key : el,
						url : sets[set][el].url
					};
				});
				links = links.concat(results);
			}
			links.forEach(function(el){
				scraper(el.url).then(function(linkInfo){
					db.updateLinkHistory(el.type, el.key, linkInfo.linkInfo, function(){
						console.log(el.type, el.key, 'is done');
					});
				});
			});
		});
	}, null, true, 'America/Los_Angeles');

};