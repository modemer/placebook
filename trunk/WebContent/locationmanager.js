var locationManager;

function LocationManager () {	
	this.load = function () {
		/* get location element from document */
		this.location = document.getElementById("location");
		
		/* add close button to location */
		var close = document.createElement("A");
		close.className="closeButton";
		close.href="javascript:locationManager.hide()";
		close.innerHTML="<span>[close]</span>";
		this.location.appendChild(close);
		
		/* add title to location */
		this.title = document.createElement("H4");
		this.location.appendChild(this.title);
		
		/* create location pane content */
		var content = document.createElement("DIV");
		{
			content.className = "content";
			
			/* create description etc */
			this.description = document.createElement("DIV");
			this.joinButton = document.createElement("A");
			{
				/* initialise div */
				var div = document.createElement("DIV");
				div.className = "item first";
				div.appendChild(document.createElement("H5"));
				div.firstChild.textContent="Description";
				
				/* add description field */
				div.appendChild(this.description);
				
				/* add join button */
				this.joinButton.className="join locationButton";
				this.joinButton.href="javascript:locationManager.join()";
				this.joinButton.innerHTML = "Join this Location";
				div.appendChild(this.joinButton);
				content.appendChild(div);
			}
			
			/* create user component */
			this.users = document.createElement("UL");
			{
				/* initialise div */
				var div = document.createElement("DIV");
				div.className = "item users";
				div.appendChild(document.createElement("H5"));
				div.firstChild.textContent="Locals";
				
				/* add users element */
				div.appendChild(this.users);
				
				/* add to location pane */
				content.appendChild(div);
			}
			
			/* create comment component */
			this.comments = document.createElement("UL");
			this.addCommentButton = document.createElement("A");
			this.addCommentForm = document.createElement("DIV");
			{
				/* initialise div */
				var div = document.createElement("DIV");
				div.className = "item comments";
				div.appendChild(document.createElement("H5"));
				div.firstChild.textContent="Comments";
				
				div.appendChild(this.comments);
				
				this.addCommentButton.className = "addComment locationButton";
				this.addCommentButton.href = "javascript:locationManager.addComment()";
				this.addCommentButton.innerHTML = "Add a Comment";
				this.showElement(this.addCommentButton);
				div.appendChild(this.addCommentButton);
				
				this.addCommentForm.className = "locationForm form";
				var title = document.createElement("H5");
				title.className = "title";
				title.innerHTML = user.name;
				this.addCommentForm.appendChild(title);
				
				var text = document.createElement("TEXTAREA");
				text.className = "locationPane comments";
				text.onblur = function () {
					window.setTimeout(
						function () {locationManager.clearComment();},
						100
					);
				};
				this.addCommentForm.appendChild(text);
				
				var button = document.createElement("A");
				button.className = "locationButton submitComment";
				button.href = "javascript:locationManager.submitComment()";
				button.innerHTML = "Submit Comment";
				this.addCommentForm.appendChild(button);

				this.hideElement(this.addCommentForm);
				div.appendChild(this.addCommentForm);
				
				/* add to location pane */
				content.appendChild(div);
			}
			
			this.photos = document.createElement("UL");
			{
				var div = document.createElement("DIV");
				div.className = "item photos";
				div.appendChild(document.createElement("H5"));
				div.firstChild.textContent = "Photos";
				
				div.appendChild(this.photos);
				
				var addPhoto = document.createElement("A");
				addPhoto.className = "addPhoto locationButton";
				addPhoto.href = "javascript:locationManager.addPhoto()";
				addPhoto.innerHTML = "Add a Photo";
				div.appendChild(addPhoto);
				
				/* add to location pane */
				content.appendChild(div);
			}
		}
		/* add content to location pane */
		this.location.appendChild(content);
	};
	this.setLocation = function (point) {
		async.retrieveLocation(point, function (req) { locationManager.callback(req); });
	};
	this.callback = function (request) {
		var response = eval('(' + request.responseText + ')');
		this.req = request;
		if (window.test) {
			test.output(request.responseText);
		}

		this.coordinates = response.coordinates;
		this.title.innerHTML = response.locationName;
		this.users.innerHTML="";
		this.comments.innerHTML = "";
		this.photos.innerHTML = "";
		
		var descText = response.description;
		var htmlText = "";
		var paragraphs = new Array();
		paragraphs = descText.split("\n");
		for(var i = 0; i < paragraphs.length; i++){
			htmlText = htmlText + "<p>" + paragraphs[i] + "</p>";			
		}
		this.description.innerHTML = htmlText;
		
		this.joinButton.style.display="block";
		
		if (response.users && response.users.length > 0) {
			for(var i = 0; i < response.users.length; i++) {
				this.joinUser(response.users[i]);
			}
			this.users.lastChild.className = "last";	
		}
		
		if (response.comments && response.comments.length > 0) {
			for (var i = 0; i < response.comments.length; i++) {
				this.createComment(response.comments[i]);
			}
		}
		
		if (response.photos && response.photos.length > 0) {
			for (var i = 0; i < response.photos.length; i++) {
				var container = document.createElement("DL");
				var user = document.createElement("DT");
				user.innerHTML = response.photos[i].user.name;
				var date = document.createElement("DD");
				date.innerHTML = response.photos[i].date;
				var description = document.createElement;
				description.innerHTML = response.photos[i].description; 
			}
		}
		
		this.show();
	};
	this.createComment = function (comment) {
		var container = document.createElement("DL");
		var head = document.createElement("DT");
		if (comment.user.pic) {
			var pic = document.createElement("IMG");
			pic.className = "profilePic";
			pic.src = comment.user.pic;
			head.appendChild(pic);
		} 
		var user = document.createElement("A");
		user.innerHTML=comment.user.name;
		user.href="http://www.facebook.com/profile.php?id="+comment.user.user;
		user.className="user";
		head.appendChild(user);
		var date = document.createElement("SMALL");
		var d = new Date(Date.parse(comment.date));
		date.innerHTML = DateFormat.format(d);
		head.appendChild(date);
		container.appendChild(head);
		var text = document.createElement("DD");
		text.innerHTML=comment.text;
		var li = document.createElement("LI");
		container.appendChild(text);
		li.appendChild(container);
		this.comments.appendChild(li);
	};
	
	this.joinUser = function(u) {

		if (u.user == user.user) {
			this.joinButton.style.display="none";
		}
		
		var text = document.createElement("A");
		text.innerHTML = u.name;
		text.href = "http://www.facebook.com/profile?id="+u.user;
		var li = document.createElement("LI");
		li.appendChild(text);
		li.user = u.user;
		this.users.insertBefore(li, this.users.firstChild);

	};
	
	this.show = function () {
		this.showElement(this.location);
		if (document.getElementById("map")) {
			document.getElementById("map").className="thin";
		}
	}
	this.hide = function () {
		this.hideElement(this.location);
		if (document.getElementById("map")) {
			document.getElementById("map").className="";
		}
	}
	this.join = function () {
		async.joinLocation(user.user, this.coordinates, function (req) {});
		this.joinUser(user);
	}
	this.addComment = function() {
		// add a comment to this location
		this.hideElement(this.addCommentButton);
		this.showElement(this.addCommentForm);
		this.addCommentForm.childNodes[1].focus();
	}
	this.submitComment = function() {
		// send comment to the server
		var comment = this.addCommentForm.childNodes[1].value;
		if (comment != null) {
			async.addComment(user.user, this.coordinates, comment, function(req) {});
			this.createComment({user: user, text: comment, date: new Date()});
		}
		this.clearComment();
	}
	this.clearComment = function() {
		this.hideElement(this.addCommentForm);
		this.addCommentForm.childNodes[1].value = "";
		this.showElement(this.addCommentButton);
	}
	this.addPhoto = function() {
		// add a photo to this location
		var filename = prompt("Enter photo filename");
		async.addPhoto(user.user, this.coordinates, filename, function(req) {});
	}
	this.showElement = function(element) {
		element.className += " show";
		element.className = element.className.replace(/hide/g,'');
	}
	this.hideElement = function(element, class) {
		element.className += " hide";
		element.className = element.className.replace(/show/g,'');
	}
};

var DateFormat = {
	months: ["January", "Febuary", "March", "April", "May", "June", "July",
				"August", "September", "October", "November", "December" ],
	days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
	format: function(date) {
		var str = "at " + date.getHours()%12 + ":" + date.getMinutes();
		str += (date.getHours()>12)?"pm":"am";
		str += " on " + this.months[date.getMonth()];
		str += " " + date.getDate();
		var d = date.getDate();
		if (d%10 == 1) {
			str+="st";
		}
		else if (d%10 == 2) {
			str+="nd";
		}
		else if (d%10 == 3) {
			str+="rd";
		}
		else {
			str+="th";
		}
		str += ", " + date.getFullYear();
		return str;
	}
};

hooks.addHook(function () { locationManager = new LocationManager(); });
hooks.addHook(function () { locationManager.load(); });
