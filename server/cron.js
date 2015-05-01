var CronJob = require('cron').CronJob;

module.exports = function () {
	var scrape = new CronJob('* * * * * *', function() {
	  console.log('You will see this message every second');
	}, null, true, 'America/Los_Angeles');
};