'use strict';

// REQUIREMENTS
process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const yelp = require('yelp-fusion');
const request = require('request');

//GLOBALS
global.access_token = 'hi';


// ACTIONS
const VAGUE_SEARCH = 'vague_search';
// PARAMETERS
const CATEGORY_ARGUMENT = 'category';


exports.PittCapstone = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));
  
	// FUNCTIONS
	function vague_search(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
		  term:'Taco Bell',
		  location: 'san francisco, ca'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			const firstResult = response.jsonBody.businesses[0];
			const prettyJson = JSON.stringify(firstResult, null, 4);
			console.log(firstResult.id);
			app.tell(firstResult.id);
		  });
		}).catch(e => {
		  console.log(e);
		});
		
		
	}
  
	// ACTION MAP
	let actionMap = new Map();
	actionMap.set(VAGUE_SEARCH, vague_search);
	app.handleRequest(actionMap);
});