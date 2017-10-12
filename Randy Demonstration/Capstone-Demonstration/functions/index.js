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
	
	function vagueSearch(app){
		app.tell('Iron Born Pizza 54 21st St Pittsburgh, PA 15222');
	}
	
	//Don't forget to pass in Yelp
	function directSearch(app){
		app.tell('Piada 3600 Forbes Ave Pittsburgh, PA 15213');
	}
	
	
  let actionMap = new Map();
  actionMap.set(DIRECT_SEARCH, directSearch);
  actionMap.set(VAGUE_SEARCH, vagueSearch);
  app.handleRequest(actionMap);
});
