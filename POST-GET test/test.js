'use strict';

var Yelp = require('yelp-fusion');
var request = require('request');
global.access_token = 'hi';

//Get security token
request.post(
	'https://api.yelp.com/oauth2/token',
	{ form: {
		grant_type: 'client_credentials',
		client_id: 'SuUImjxWmD1bwsYVIrDknQ',
		client_secret: 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a'
	}},
	function(error, response, body){
		if(!error && response.statusCode == 200){
			let jsonContent = JSON.parse(body);
			access_token = jsonContent.access_token;
			console.log('Access_Token1: ' + access_token);
			
			//do a basic search
			request.get({
				url: 'https://api.yelp.com/v3/businesses/search',
				qs:{
					term: 'italian',
					location: '90210'
				},
				headers: {
					'Authorization': 'Bearer ' + access_token
				}
			}, function(error, response, body){
				var jsonContent = JSON.parse(body);
				var firstBusiness = jsonContent.businesses[0];
				console.log('FIRST BUSINESS ID: ' + firstBusiness.id);
				
				
			});
			
			
			
		}
	}
);

//https://stormpath.com/blog/talking-to-oauth2-services-with-nodejs



