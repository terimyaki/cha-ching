'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function($scope){
	$scope.slideshow = [
		'/images/intro.jpeg',
		'/images/clothes.jpeg',
		'/images/rulers.jpeg',
		'/images/cups.jpeg',
		'/images/clothes-1.jpeg',
		'/images/tech.jpeg',
		'/images/camera.jpeg',
		'/images/chairs.jpeg'
	];

	$("#slideshow > div:gt(0)").hide();

	setInterval(function() { 
	  $('#slideshow > div:first')
	    .fadeOut(1000)
	    .next()
	    .fadeIn(1000)
	    .end()
	    .appendTo('#slideshow');
	},  3000);
});