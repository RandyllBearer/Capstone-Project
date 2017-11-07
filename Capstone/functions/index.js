'use strict';

// REQUIREMENTS
process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const yelp = require('yelp-fusion');
const req = require('request');

//GLOBALS
global.access_token = 'hi';


// ACTIONS
const VAGUE_SEARCH = 'vague_search';

// PARAMETERS
var RESTAURANT_ARGUMENT = 'restaurants';

//GLOBAL VARIABLES
var COORDINATES;
var LATITUDE = '40.440625';
var LONGITUDE = '-79.995886';


exports.Capstone = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  // console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));


  //ENTITIES SETUP
  //First, acquire client access token
  var options = {

    url: 'https://api.yelp.com/oauth2/token',
    method: 'POST',
    form: {
  		grant_type: 'client_credentials',
  		client_id: 'SuUImjxWmD1bwsYVIrDknQ',
  		client_secret: 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a'
  	}
  };
  var yelp_token;

  //First callback function: retrieves Yelp's official list of categories
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      yelp_token = info.access_token;
      options = {
        url: 'https://www.yelp.com/developers/documentation/v3/all_category_list/categories.json',
        method: 'GET',
        headers: {
             'Authorization': "Bearer "+ yelp_token,
             'Content-Type': 'application/json'
           },
      };

      //now that we have the categories, we must filter only restaurants
      req(options, callback2);
    }
  }


  //Second callback function: retrieves all restaurant categories and adds them to the 'restaurants' entity
  //Uses Dialogflow develop access token to update entities
  function callback2(error, response, body) {
    var json_form = [];
    var json_elem;
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);

      json_elem = {
        "entries": [],
        "name": "restaurants"
      };
      for (var i = 0; i < info.length; i++){
        if(info[i].parents.includes('restaurants')){
          var elem_name = info[i].title;
          if (elem_name.includes(" (New)")){
            elem_name = elem_name.replace(" (New)", "");
          }
          if (elem_name.includes(" (Traditional)")){
            elem_name = elem_name.replace(" (Traditional)", "");
          }
          var new_entry = {
            "synonyms": [
              elem_name.toLowerCase()
            ],
            "value": elem_name
          }
          json_elem["entries"].push(new_entry);
        }
      }
      json_form.push(json_elem);
      var options = {
        url: 'https://api.dialogflow.com/v1/entities?v=20150910',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer 54ad48a6f12244eea822e0598defc515',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json_form)
      };
      req(options, callback3);
    }
  }

  //for debugging
  function callback3(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log(info);
    } else{
      console.error(response.statusCode);
    }
  }

	function actions_intent_PERMISSION(app){
		if(app.isPermissionGranted()){
			COORDINATES = app.getDeviceLocation().coordinates;
			LATITUDE = COORDINATES.latitude;
			LONGITUDE = COORDINATES.longitude;
			console.log('FOUND COORDINATES!');	//TEST
		 }
		 
		let rest = app.getArgument(RESTAURANT_ARGUMENT);
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';

		//for now, we have the location set to the University of Pittsburgh
		//sort_by defaults to best match, but I feel that distance might be a more important factor
		const searchRequest = {
			term: rest,
			categories: 'restaurants, All',
			latitude: LATITUDE,
			longitude: LONGITUDE,
			sort_by: 'distance'
		};
		
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
		//jsonBody returned the top results (based on sort_by, defaulted to at most 20 results)
			var firstResult = response.jsonBody.businesses[0];

			app.tell("I found some " + rest + " places near you. How does " + firstResult.name + " sound?");
		  });
		}).catch(e => {
		  console.log(e);
		});
	}
  
  //execute the setup for entities
  req(options, callback);

	// FUNCTIONS
	function vague_search(app){
		
		//get user location
		app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
		
		let rest = app.getArgument(RESTAURANT_ARGUMENT);
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';

		//for now, we have the location set to the University of Pittsburgh
		//sort_by defaults to best match, but I feel that distance might be a more important factor
			const searchRequest = {
		  term: rest,
		  categories: 'restaurants, All',
		  latitude: '40.440625',
		  longitude: '-79.995886',
		  sort_by: 'distance'
			};
		
		
		
			yelp.accessToken(clientId, clientSecret).then(response => {
			  const client = yelp.client(response.jsonBody.access_token);

			  client.search(searchRequest).then(response => {
			//jsonBody returned the top results (based on sort_by, defaulted to at most 20 results)
				var firstResult = response.jsonBody.businesses[0];

				app.tell("I found some " + rest + " places near you. How does " + firstResult.name + " sound?");
			  });
			}).catch(e => {
			  console.log(e);
			});


	}

	// ACTION MAP
	let actionMap = new Map();
	actionMap.set(VAGUE_SEARCH, vague_search);
	actionMap.set('actions_intent_PERMISSION', actions_intent_PERMISSION);
	app.handleRequest(actionMap);
});
