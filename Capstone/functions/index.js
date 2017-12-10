//Things to work on
//allow for users to break out of vague/random search loops
//handle negative permissions
//handle negative confirmations
//allow for last statement to be repeated
//have the display of restaurants include the categories of food
//cut down on API calls in loops

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
const DIRECT_SEARCH = 'direct_search';
const RANDOM_SEARCH = 'random_search';
const REPEAT_PRICE = "repeat_price";
const REPEAT_ADDRESS = "repeat_address";
const REPEAT_NAME = "repeat_name";
const REPEAT_CITY = "repeat_city";
const REPEAT_RATING = "repeat_rating";
const REPEAT_PHONE = "repeat_phone";

// PARAMETERS
var RESTAURANT_ARGUMENT = 'null';
var TERM_ARGUMENT = 'terms';

//GLOBAL VARIABLES
var COORDINATES = null;
var LATITUDE = 'null';
var LONGITUDE = 'null';
var RESTAURANT = 'null';
var TERM = 'null';
var I = 0;

//HANDLER FLAGS
var flagVagueSearch = false;
var flagDirectSearch = false;
var flagRandomSearch = false;

//RANDOM SEARCH
var randomSearchAlreadyCalledAPI = false;	//not yet used
var selectedBusiness = null;

//Business Logic
exports.Capstone = functions.https.onRequest((request, response) => {
	const app = new App({request, response});
	// console.log('Request body: ' + JSON.stringify(request.body));
	// console.log("EEEEEEEEEE: " + app.getDeviceLocation().coordinates.latitude);
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

  /* 
  First callback function: This function retrieves Yelp's official list of categories from the Yelp API
  */
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

  /*
  Second callback function: retrieves all restaurant categories and adds them to the 'restaurants' entity. This function also
  uses Dialogflow develop access token to update entities
  */
  function callback2(error, response, body) {
		var json_form = [];
		var json_elem;
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			// console.log("HELLO");
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

	/*
	Third callback function: This function is used for debugging.
	*/
	function callback3(error, response, body) {
		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			console.log(info);
		} else{
			console.error(response.statusCode);
		}
	}

	//execute the setup for entities
	req(options, callback);


	//------------------- INTENT FUNCTIONS --------------------
	
	/*
	Vague Search: The main function for the vague search implementation. This function sets up the preliminaries, as well as flagging the search type
	as a vague search. Then, it sends the program to the permission function to make sure the user wants to continue with the search.
	*/
	function vague_search(app){
		RESTAURANT = app.getArgument(RESTAURANT_ARGUMENT);
		console.log("\n\nRESTAURANT = " + RESTAURANT);
		flagVagueSearch = true;
		I = 0;

		//get user location
		app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
	}

	/*
	Direct Search: The main function for the direct search implementation This function sets up the preliminaries, as well as flagging the search type
	as a direct search. Then, it sends the program to the permission function to make sure the user wants to continue with the search.
	*/
	function direct_search(app){
		TERM = app.getArgument(TERM_ARGUMENT);
		console.log("DDDDDDDDDDDDDD" + TERM);
		flagDirectSearch = true;
		I = 0;

		//get user location
		app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
	}

	/*
	Random Search: The main function for the randon search implementation This function sets up the preliminaries, as well as flagging the search type
	as a random search. Then, it sends the program to the permission function to make sure the user wants to continue with the search.
	*/
	function random_search(app){
		console.log("DDDDDDDDDDDDDDD Initiating random_search");
		flagRandomSearch = true;
		I = 0;
		
		//get user location
		app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
	}
	
	//------------------ HANDLERS --------------------
	
	/*
	Actions Intent Permission: This function is called whenever we are asking for permission for location. If permission is not granted, the search
	will not continue.
	*/
	function actions_intent_PERMISSION(app){
		if(app.isPermissionGranted()){
			COORDINATES = app.getDeviceLocation().coordinates;
			LATITUDE = COORDINATES.latitude;
			LONGITUDE = COORDINATES.longitude;
			console.log('FOUND COORDINATES!');	//TEST

			if(flagVagueSearch == true){
				flagVagueSearch = false;
				vague_search_logic(app);
			}

			if(flagDirectSearch == true){
				flagDirectSearch = false;
				direct_search_logic(app);
			}
			
			if(flagRandomSearch == true){
				flagRandomSearch = false;
				random_search_logic(app);
			}
			
		 }
	}
	
	/*
	Actions Intent Confirmation: This function is called whenever we are asking for permissions
	*/
	function actions_intent_CONFIRMATION(app){
		if(app.getUserConfirmation() == true){
			
			if(flagVagueSearch == true){
				flagVagueSearch = false;
				display_business(app);
			}
			
			//if user likes random suggested, display more information
			if(flagRandomSearch == true ){
				flagRandomSearch = false;
				display_business(app);
			}
			
			
		}else{
			
			if(flagVagueSearch == true){
				flagVagueSearch = false;
				vague_search_logic(app);
			}
			
			//if user doesn't like random suggested, random suggest another
			if(flagRandomSearch == true ){
				flagRandomSearch = false;
				random_search_logic(app);
			}
			
		}
	}
	
	//----------------------- LOGIC --------------------------

	/*
	Vague Search Logic: Implements the actual logic for vague_search.
	*/
	function vague_search_logic(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';

		//for now, we have the location set to the University of Pittsburgh
		//sort_by defaults to best match, but I feel that distance might be a more important factor
		//NEED TO FINE TUNE THIS SEARCH FEATURE
		const searchRequest = {
			term: RESTAURANT,
			//categories: RESTAURANT,
			latitude: LATITUDE,
			longitude: LONGITUDE,
			limit: 50,
			sort_by: 'distance'
		};

		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

			client.search(searchRequest).then(response => {
				
				//jsonBody returned the top results (based on sort_by, defaulted to at most 20 results)
				selectedBusiness = response.jsonBody.businesses[I];

				//ask if this was a good choice
				flagVagueSearch = true;
				if(I < 49){
					I = I + 1;
				}else{
					app.tell("Sorry, but there are no other options available");
				}
				app.askForConfirmation("Does " + selectedBusiness.name + " at " + selectedBusiness.location.address1 + " sound good?");
			
			});	
		}).catch(e => {
			console.log(e);
		});
	}

	/*
	Direct Search Logic: Implements the actual logic for direct_search
	*/
	function direct_search_logic(app){
		// var currentTerm = app.getArgument(TERM_ARGUMENT);
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';

		//for now, we have the location set to the University of Pittsburgh
		//sort_by defaults to best match, but I feel that distance might be a more important factor

		console.log(TERM);	//TEST

		//NEED TO FINE TUNE THIS SEARCH FEATURE
		const searchRequest = {
			term: TERM,
			categories: "restaurants",
			latitude: LATITUDE,
			longitude: LONGITUDE,
			sort_by: 'distance'
		};

		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

		  client.search(searchRequest).then(response => {
			//jsonBody returned the top results (based on sort_by, defaulted to at most 20 results)
			var firstResult = response.jsonBody.businesses[0];
			var secondResult = response.jsonBody.businesses[1];
			const VAGUE_SEARCH = 'vague_search';


			//NEED TO CYCLE THROUGH OTHER RESULTS
			//app.ask(is this good?)
			flagDirectSearch = true;
			selectedBusiness = firstResult;
			display_business(app);
		  });
		}).catch(e => {
		  console.log(e);
		});
		
	}
	
	/*
	Random Search Logic: Implements the actual logic for random_search
	*/
	function random_search_logic(app){
		const clientId = 'SuUImjxWmD1bwsYVIrDknQ';
		const clientSecret = 'MoWJYPz4DuNtJSGcAyYLQJYe1A9k8z2lISjx3LTcTjJteBisuaQjCb8uFowh2s6a';
		
		const searchRequest = {
			term: 'restaurants',
			latitude: LATITUDE,
			longitude: LONGITUDE,
			limit: 50,
			sort_by: 'best_match'
		};
		
		//contact api
		yelp.accessToken(clientId, clientSecret).then(response => {
		  const client = yelp.client(response.jsonBody.access_token);

			client.search(searchRequest).then(response => {
				//jsonBody returned the best_match 'restaurants' 50 locations
				//get a random index to sort results
				var randomInt = Math.floor(Math.random() * 49);
					
				//choose a resultant business
				selectedBusiness = response.jsonBody.businesses[randomInt];
					
				//ask if this was a good choice
				flagRandomSearch = true;
				app.askForConfirmation("Does " + selectedBusiness.name + " at " + selectedBusiness.location.address1 + " sound good?");
				
			});
		}).catch(e => {
		  console.log(e);
		});
	}
	
	//printout selectedBusiness details
	function display_business(app){
		price = selectedBusiness.price;
		if(price.length == 1){
			price = "cheap";
		}else if(price.length == 2){
			price = "moderately cheap";
		}else if(price.length == 3){
			price = "moderately expensive";
		}else{
			price = "expensive";
		}
		
		let sentence1 = "Okay, describing " + selectedBusiness.name + " now.\n";
		let sentence2 = selectedBusiness.name + " located at " + selectedBusiness.location.address1 + " " + selectedBusiness.location.city + "\n";
		let sentence3 = "Price is " + selectedBusiness.price + " Average Rating is " + selectedBusiness.rating + "\n";
		let sentence4 = "Phone number is " + selectedBusiness.display_phone + "\n";
		
		app.ask(sentence1 + sentence2 + sentence3 + sentence4 + ", would you like anything repeated?");
		
	}
	
	//-------- repeats -----------
	
	//repeat price of selectedBusiness
	function repeat_price(app){
		if(selectedBusiness == null){
			app.ask("Please search for a business before asking for details.");
		}else{
			var price = selectedBusiness.price;
			if(price.length == 1){
				price = "cheap";
			}else if(price.length == 2){
				price = "moderately cheap";
			}else if(price.length == 3){
				price = "moderately expensive";
			}else{
				price = "expensive";
			}
			app.ask("Average price of " + selectedBusiness.name + " is " + price );
		}
		
	}
	
	function repeat_address(app){
		if(selectedBusiness == null){
			app.ask("Please search for a business before asking for details.");
		}else{
			app.ask("Address of " + selectedBusiness.name + " is " + selectedBusiness.location.address1 );	
		}
		
	}
	
	function repeat_name(app){
		if(selectedBusiness == null){
			app.ask("Please search for a business before asking for details.");
		}else{
			app.ask("Name of business is " + selectedBusiness.name );
		}
	
	}
	
	function repeat_city(app){
		if(selectedBusiness == null){
			app.ask("Please search for a business before asking for details.");
		}else{
			app.ask(selectedBusiness.name + " is located in " + selectedBusiness.city );
		}
		
	}
	
	function repeat_rating(app){
		if(selectedBusiness == null){
			app.ask("Please search for a business before asking for details.");
		}else{
			app.ask("Average rating of " + selectedBusiness.name + " is " + selectedBusiness.rating );
		}
		
	}
	
	function repeat_phone(app){
		if(selectedBusiness == null){
			app.ask("Please search for a business before asking for details.");
		}else{
			app.ask("Phone number of " + selectedBusiness.name + " is " + selectedBusiness.display_phone );
		}
		
	}
	
	//repeat address of selectedBusiness

	// ACTION MAP
	let actionMap = new Map();
	actionMap.set(VAGUE_SEARCH, vague_search);
	actionMap.set(DIRECT_SEARCH, direct_search);
	actionMap.set(RANDOM_SEARCH, random_search);
	actionMap.set(REPEAT_PRICE, repeat_price);
	actionMap.set(REPEAT_ADDRESS, repeat_address);
	actionMap.set(REPEAT_NAME, repeat_name);
	actionMap.set(REPEAT_CITY, repeat_city);
	actionMap.set(REPEAT_RATING, repeat_rating);
	actionMap.set(REPEAT_PHONE, repeat_phone);
	actionMap.set('actions_intent_PERMISSION', actions_intent_PERMISSION);
	actionMap.set('actions_intent_CONFIRMATION', actions_intent_CONFIRMATION);
	app.handleRequest(actionMap);
	
});

