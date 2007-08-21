/**
 *  StalkCoordinator
 *
 * Handles the communication between the Tomcat webserver
 * and the Google Maps interface object (reg gmapIO.js)
*/

function StalkCoordinator () {
	this.username = undefined;	// the current user's Facebook name
	this.homeloc = undefined;	// user's home location -- where the map will centre when loaded
	this.default_zoom = 15;	// default zoom level

	/* Called when webpage first loaded -- sets up the map to the default */
	this.load = function() {
		// load the map
		StalkBook.load();
		
		// Set the callback function for StalkBook to call when adding
		// a new marker
		StalkBook.addMarkerFunction(stalkCoordinator.addMarker);
		
		// get the user's Facebook name & home location
		this.setUsername(User.username);
		this.setHomeLocation(User.homeLocation);

		// tell the map to centre on the user's home location
		StalkBook.setPositionXY(this.homeloc.x, this.homeloc.y, this.default_zoom);

		for (var i = 0; i < User.locations.length; i++) {
			var location = User.locations[i];
			StalkBook.addMarkerByLatLng(location.x, location.y, location.name);
		}
	};
	
	this.setUsername = function(name) {
		stalkCoordinator.username = name;
	};
	
	this.setHomeLocation = function(location) {
		stalkCoordinator.homeloc = location;
	};
	
	this.asyncCallback = function(req) {
		// alert(req.readystate + ", " + req.status);
	};
	
	/* A new marker has been added to the map */
	this.addMarker = function(latlng) {
		// add this new marker to the database under the user name
		var point = {
			x: latlng.lat(),
			y: latlng.lng()
		};
	
		var markerName = prompt("Enter marker text");
		if (markerName == undefined) return;
		if (markerName == "") { 
			markerName = "My marker"; 
		}
		
		var markerDesc = prompt("Enter description");
		if (markerDesc == ""){
			markerDesc = "Desc";
		}

		StalkBook.addMarker(latlng, {name: markerName, desc: markerDesc});
		
		async.submitPoint(stalkCoordinator.username, markerText, point, function(req){stalkCoordinator.asyncCallback(req)});
		// alert("Marker added at " + latlng.lat() + ", " + latlng.lng()); // debugging
	};
};

var stalkCoordinator = new StalkCoordinator();
