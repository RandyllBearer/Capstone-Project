'use strict';

process.env.DEBUG = 'actions-on-google:*';
const DialogflowApp = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const yelp = require('yelp-fusion');

// Dialogflow Actions
const DIRECT_SEARCH = 'direct_search';
const VAGUE_SEARCH = 'vague_search';

// Action Parameters
const RESTAURANT_ARGUMENT = 'restaurant';
const TERM_ARGUMENT = 'term';

exports.CapstoneDemonstration = functions.https.onRequest((request, response) => {
	const app = new DialogflowApp({request, response});
	
	function vagueSearch(app,yelp){
		//0authentication2
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		//REQUEST
		let vagueTerm = app.getArgument(TERM_ARGUMENT);
		const searchRequest = {
			term: vagueTerm;
			location: 'Pittsburgh, pa'
		}
		
		//Get Security Access Token
		const token = yelp.accessToken(clientId, clientSecret).then(response => {
			console.log(response.jsonBody.access_token);
		}).catch(e =>{
			app.tell('ERROR: Caught Exception e');
		});
		
		//Perform Search
		const client = yelp.client(token);
		
		client.search(searchRequest).then(response => {
			let responseString = response.jsonBody.businesses[0].name + ' ' + response.jsonBody.businesses[0].location.address1;
			app.tell(responseString);
		}).catch(f => {
			app.tell('ERROR: Caught Exception f');
		});
		
		
		app.tell('Failed Search');
	}
	
	function directSearch(app, yelp){
		//0authentication2
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		//REQUEST
		let restaurant = app.getArgument(RESTAURANT_ARGUMENT);
		const searchRequest = {
			term: restaurant,
			location: 'Pittsburgh, pa'
		};
		
		//Get Security Access Token
		const token = yelp.accessToken(clientId, clientSecret).then(response => {
			console.log(response.jsonBody.access_token);
		}).catch(e =>{
			app.tell('ERROR: Caught Exception e');
		});
		
		//Perform Search
		const client = yelp.client(token);
		
		client.search(searchRequest).then(response => {
			let responseString = response.jsonBody.businesses[0].name + ' ' + response.jsonBody.businesses[0].location.address1;
			app.tell(responseString);
		}).catch(f => {
			app.tell('ERROR: Caught Exception f');
		});
		
		
		app.tell('Failed Search');
	}
	
	
  let actionMap = new Map();
  actionMap.set(DIRECT_SEARCH, directSearch);
  actionMap.set(VAGUE_SEARCH, vagueSearch);
  app.handleRequest(actionMap);
});
