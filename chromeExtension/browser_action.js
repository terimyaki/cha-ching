var f = new Firebase('https://pricetab.firebaseIO.com/user/6');
var name = undefined;

function fbLinkRefCreate(typeKey){
	return new Firebase('https://pricetab.firebaseIO.com/link/' + typeKey);
}

function itemsList(list){
	$('#itemsList').html('');
	for(var item in list){
		var link = item.split('-').join('/');
		fbLinkRefCreate(link).on('value', function(s){
			var itemInfo = s.val();
			createHtml(list[item], itemInfo);
		});
	}
}

function createAlerts(alerts, product){
	var line = '<ul>';
	var red = 'style="color:red;"';
	var green = 'style="color:green;"';
	var style = red;
	if(alerts.supply) {
		if(product.availability.indexOf('In') > -1) style = green;
		else style = red;
		line += ' <li id="supply" ' + style + '>Tracking Supply. </li>';
	}
	if(alerts.price) {
		if(product.currentPrice <= alerts.priceThreshold) style = green;
		else style = red;
		line += '<li id="price" ' + style + '>Tracking Price will alert when price is below: ' + alerts.priceThreshold + '</li>';
	}
	return line += '</ul>';
}

function createHtml(userLink, linkInfo){
	var name = '<h3>' + linkInfo.name + '</h3>';
	var url = '<a href=' + linkInfo.url +'>' + linkInfo.url + '</a>';
	var dateAdd = '<p> You added this on: ' + new Date(userLink.dateAdded) +'</p>';
	var comment = '<p> Your comment: ' + userLink.comment +'</p>';
	var linkHistoryHeader = '<h5>Link History</h5><ul>';
	var currentStats = linkInfo.linkHistory[Object.keys(linkInfo.linkHistory).pop()];
	var currentHTML = '<p> The Price is Now : ' + currentStats.currentPrice + ', Availability : ' + currentStats.availability + '</p>';
	var alertHeader = '<h5>Alerts Set Up</h5>';
	var alertHTML = createAlerts(userLink.alert, currentStats);
	$('#itemsList').append('<div><hr />' + name + url + dateAdd + comment + alertHeader + alertHTML + linkHistoryHeader + currentHTML + '</div>');
}

f.on('value', function(s) {
	var profile = s.val();
	name = profile.name;
	console.log(profile.items);
	itemsList(profile.items);
	$('#greeting').text('Hi, ' + name);
	$('#contents').html(JSON.stringify(s.val(), null, 4));
});

// $('#loginContainer').show();
$('#addItemContainer').hide();
// $('#listContainer').hide();

$('#connect').on('click', function(e){
	//gets the current tab's url
	chrome.tabs.query({active: true, 'lastFocusedWindow' : true}, function(tabs){
		var url = tabs[0].url;
		$('#url').val(url);
		$('#addItemContainer').toggle('slow');
	});
});

// $('#addItem').submit(function(e){
// 	//sends a request to the server
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('POST', 'http://localhost:2222/api/extension', true);
// 	xhr.send();
// });

// $('#login').submit(function(e){
// 	//sends a request to the server
// 	$.ajax()
// 	e.preventDefault();
// });