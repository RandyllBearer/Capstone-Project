'use strict';

process.env.DEBUG = 'actions-on-google:*';
const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const yelp = require('yelp-fusion');

// Dialogflow Actions
const DIRECT_SEARCH = 'direct_search';

// Action Parameters
const RESTAURANT_ARGUMENT = 'restaurant';

exports.CapstoneDemonstration = functions.https.onRequest((request, response) => {
	const app = new DialogflowApp({request, response});
	
	function directSearch(app, yelp){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		//REQUEST (Defaulting to Taco Bell in San Fransico)
		const searchRequest = {
			term:'Taco Bell',
			location: 'san francisco, ca'
		};
		
		/*
		yelp.accessToken(clientId, clientSecret).then(response => {
			const client = yelp.client(response.jsonBody.access_token);

			client.search(searchRequest).then(response => {
				const firstResult = response.jsonBody.businesses[0];
				const prettyJson = JSON.stringify(firstResult, null, 4);
			});
		}).catch(e => {
			console.log(e);
		});
		*/
		
		app.tell(clientId);
	}
	
	
  let actionMap = new Map();
  actionMap.set(DIRECT_SEARCH, directSearch);
  app.handleRequest(actionMap);
});
