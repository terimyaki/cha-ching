var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

//requirer the scrapers
var scrapeAmazon = require('./amazon.js');
var scrapeBGW = require('./bgw.js');

function scrapeSite(link){
	return request(link).spread(function(response, htmlText){

		var scrapeSet = [
			{host: 'www.amazon.com', name: 'amazon', scrapeBox : scrapeAmazon},
			{host: 'boardgamewarehouse.com', name: 'boardGameWarehouse', scrapeBox : scrapeBGW}
		];

		var setToUse = scrapeSet.filter(function(el){
			return response.request.uri.host === el.host;
		})[0];

		var type = setToUse.name;
		var scraper = setToUse.scrapeBox.scraper;
		var key = setToUse.scrapeBox.pathParser(response.request.uri.pathname);

		return scraper(type, key, link, htmlText);
	})
	.catch(function(err){
		throw new Error(err);
	});
}

module.exports = scrapeSite;
