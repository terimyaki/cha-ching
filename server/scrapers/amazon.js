'use strict';
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var cheerio = require('cheerio');

var scrapeAmazon = function(type, key, link, htmlText){
		var $ = cheerio.load(htmlText);
		
		var strikePrice = $('#listPriceValue').text();
		var currentPrice = $('.priceLarge').text();
		var availability = $('.availGreen').text().trim();
		var name = $('#btAsinTitle').text();
		var image = $('#main-image').attr('src');
		var url = $('link').filter(function(i,el){
			return $(this).attr('rel') === 'canonical';
		}).first().attr('href');
		if(url === undefined) url = link;

		return {
			type : type,
			key: key,
			image : image,
			url : url,
			name : name,
			linkInfo : {
				scrapeDate : Date.now(),
				currentPrice : currentPrice,
				strikePrice : strikePrice,
				availability : availability
			}
		};
};

var pathParser = function(pathname){
	return pathname.split('/').splice(-2,1)[0];
};

module.exports = {
	pathParser : pathParser,
	scraper : scrapeAmazon
};