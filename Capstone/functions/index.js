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
const VAGUE_SEARCH_PIZZA = 'vague_search_pizza';
const VAGUE_SEARCH_MEXICAN = 'vague_search_mexican';
const VAGUE_SEARCH_JAPANESE = 'vague_search_japanese';
const VAGUE_SEARCH_SUSHI = 'vague_search_sushi';
const VAGUE_SEARCH_CHICKEN_WINGS = 'vague_search_chicken_wings';

// PARAMETERS
var CATEGORY_ARGUMENT = 'category';


exports.Capstone = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));
  
	// FUNCTIONS
	function vague_search(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
		  categories: CATEGORY_ARGUMENT +",restaurants",
		  location: 'pittsburgh, pa'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			const firstResult = response.jsonBody.businesses[0];
			const prettyJson = JSON.stringify(firstResult, null, 4);
			console.log(firstResult.id);
			app.tell(firstResult.id);
			console.log(CATEGORY_ARGUMENT);
		  });
		}).catch(e => {
		  console.log(e);
		});
		
		
	}
	
	function vague_search_chicken_wings(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
		  categories: CATEGORY_ARGUMENT,
		  location: 'pittsburgh, pa'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			const firstResult = response.jsonBody.businesses[0];
			const prettyJson = JSON.stringify(firstResult, null, 4);
			console.log(firstResult.id);
			app.tell(firstResult.id);
			console.log(CATEGORY_ARGUMENT);
		  });
		}).catch(e => {
		  console.log(e);
		});
	}
	
	function vague_search_mexican(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
		  categories: CATEGORY_ARGUMENT +",restaurants",
		  location: 'pittsburgh, pa'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			const firstResult = response.jsonBody.businesses[0];
			const prettyJson = JSON.stringify(firstResult, null, 4);
			console.log(firstResult.id);
			app.tell(firstResult.id);
			console.log(CATEGORY_ARGUMENT);
		  });
		}).catch(e => {
		  console.log(e);
		});
	}
	
	function vague_search_pizza(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
		  categories: CATEGORY_ARGUMENT +",restaurants",
		  location: 'pittsburgh, pa'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			const firstResult = response.jsonBody.businesses[0];
			const prettyJson = JSON.stringify(firstResult, null, 4);
			console.log(firstResult.id);
			app.tell(firstResult.id);
			console.log(CATEGORY_ARGUMENT);
		  });
		}).catch(e => {
		  console.log(e);
		});
	}
	
	function vague_search_japanese(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
		  categories: CATEGORY_ARGUMENT+",restaurants",
		  location: 'pittsburgh, pa'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			const firstResult = response.jsonBody.businesses[0];
			const prettyJson = JSON.stringify(firstResult, null, 4);
			console.log(firstResult.id);
			app.tell(firstResult.id);
			console.log(CATEGtaORY_ARGUMENT);
		  });
		}).catch(e => {
		  console.log(e);
		});
	}
	
	function vague_search_sushi(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
		  categories: CATEGORY_ARGUMENT+",japanese",
		  location: 'pittsburgh, pa'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			const firstResult = response.jsonBody.businesses[0];
			const prettyJson = JSON.stringify(firstResult, null, 4);
			console.log(firstResult.id);
			app.tell(firstResult.id);
			console.log(CATEGORY_ARGUMENT);
		  });
		}).catch(e => {
		  console.log(e);
		});
	}
  
	// ACTION MAP
	let actionMap = new Map();
	actionMap.set(VAGUE_SEARCH, vague_search);
	actionMap.set(VAGUE_SEARCH_PIZZA, vague_search_pizza);
	actionMap.set(VAGUE_SEARCH_MEXICAN, vague_search_mexican);
	actionMap.set(VAGUE_SEARCH_JAPANESE, vague_search_japanese);
	actionMap.set(VAGUE_SEARCH_SUSHI, vague_search_sushi);
	actionMap.set(VAGUE_SEARCH_CHICKEN_WINGS, vague_search_chicken_wings);
	app.handleRequest(actionMap);
});