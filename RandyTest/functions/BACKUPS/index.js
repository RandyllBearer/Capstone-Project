'use strict';

// REQUIREMENTS
process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const yelp = require('yelp-fusion');
const request = require('request');


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
		app.tell("Finding italian near you...");
	}
  
	// ACTION MAP
	let actionMap = new Map();
	actionMap.set(VAGUE_SEARCH, vague_search);
	app.handleRequest(actionMap);
});