//<![CDATA[

/**StalkBook is an object for interfacing with the google maps API
It allows the position to be set by lat,lng and by String (i.e wellington, nz).
We can set a marker to a given lat,lng.

To use this:
there must be an element with id=map (i.e <div id="map"></div>)
This will be the location of the map.
*/
var StalkBook = {
  minZoom: 15,
  locality: "Wellington, New Zealand",
  geocoder: new GClientGeocoder(),
  map: undefined,
  markerFunc: undefined,
  typeImages: new Array(5),
  
  /*
  Loads up the map requires map element. Define interfaces here.
  */
  load: function() {
    if (GBrowserIsCompatible()) {
      StalkBook.map=new GMap2(document.getElementById("map"));
      StalkBook.map.addControl(new GLargeMapControl());
	  StalkBook.map.addControl(new GMapTypeControl());
	  
	  StalkBook.typeImages[0]= new GIcon();
	  StalkBook.typeImages[0].image = "./images/map/home.png";
      StalkBook.typeImages[0].shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
	  StalkBook.typeImages[0].iconSize = new GSize(25, 25);
	  StalkBook.typeImages[0].shadowSize = new GSize(22, 20);
  	  StalkBook.typeImages[0].iconAnchor = new GPoint(6, 20);
	  StalkBook.typeImages[0].infoWindowAnchor = new GPoint(5, 1);
	  StalkBook.typeImages[0].type="Home";
	 
	  StalkBook.typeImages[1]= new GIcon();
	  StalkBook.typeImages[1].image = "./images/map/eat.png";
      StalkBook.typeImages[1].shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
	  StalkBook.typeImages[1].iconSize = new GSize(25, 25);
	  StalkBook.typeImages[1].shadowSize = new GSize(22, 20);
  	  StalkBook.typeImages[1].iconAnchor = new GPoint(6, 20);
	  StalkBook.typeImages[1].infoWindowAnchor = new GPoint(5, 1);
	  StalkBook.typeImages[1].type="Eat";	  
      
      StalkBook.geocoder.getLatLng(StalkBook.locality,function(point){
		StalkBook.map.setCenter(point, 12);
      });

      StalkBook.map.enableScrollWheelZoom();

      GEvent.addListener(StalkBook.map, "dblclick", function(marker, point) {
        if (StalkBook.map.getZoom() > StalkBook.minZoom){
            if(StalkBook.markerFunc)StalkBook.markerFunc(point);            
        }
      })
    }
  },


/*
Add marker at a given point defined by latitude(lat) and longitude(lng) also takes an 
optional html formated string(str) that will be displayed when the marker is clicked, 
as well as an optional type which changes the marker image to what is associated to the 
given type.
*/
  
  addMarkerByLatLng: function(lat, lng, info, type){
    var point= new GLatLng(lat, lng);
	StalkBook.addMarker(point,info,type);
  },
  
/*
Add marker at a given point defined by a GLatLng(point) also takes an 
optional html formated string(str) that will be displayed when the 
marker is clicked, as well as an optional type which changes the 
marker image to what is associated to the given type.
*/
  addMarker: function(point, info,type){
    var marker = new GMarker(point);
    if(type){
	  	for (i=0;i<StalkBook.typeImages.length;i++){	
	  		if(StalkBook.typeImages[i].type==type){
  				marker = new GMarker(point, StalkBook.typeImages[i]);
  				break;
  			}
  		}
  	}
    if(info.name){
		GEvent.addListener(marker, "click", function(){
			marker.openInfoWindowHtml("<b>Name:</b> " + info.name + "<br/><br/><b>Description</b><br/>" + info.desc);
		});
	}
  	StalkBook.map.addOverlay(marker);
  },
    
/*
Centers position to a given point, defined by latitude(lat) and longitude(lng). 
This has an optional zoom parameter. This can be between 1-17 possibly more 
for areas with more detail.
*/  
  setPositionXY: function(lat, lng, zoom){
    if(!zoom){zoom=StalkBook.map.getZoom();}
    var point=new GLatLng(lat,lng,true);
  	StalkBook.map.setCenter(point, zoom);
  },
  
 /*
 Centers position to a place defined by a string. This has an optional zoom 
 parameter. This can be between 1-17 possibly more for areas with more detail.
 */
  setPositionString: function(location, zoom, type){
    if(!zoom){zoom=StalkBook.map.getZoom();}
  	StalkBook.geocoder.getLatLng(location,function(point){
		StalkBook.map.setCenter(point,zoom);
    });
  },
  
  
 /*
 Converts a GLatLng to a point object.
 */ 
  gPointtoPoint: function(latlngpoint) {
  	var point = {
  	  lat: latlngpoint.lat(),
  	  lng: latlngpoint.lng()
    };
    return point;
  },
  
  
  /*
  Function that takes a callback function to be executed when a the map is 
  double clicked. i.e. When a marker needs added.
  */
  setMarkerFunction: function(func){
  	StalkBook.markerFunc=func;
  }
  
};
//]]>