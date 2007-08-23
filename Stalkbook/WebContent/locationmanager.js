var locationManager;

function LocationManager () {
	this.load = function () {
		this.location = document.getElementById("location");
		this.title = document.createElement("H4");
		this.description = document.createElement("DIV");
		this.users = document.createElement("UL");
		this.comments = document.createElement("UL");
		
		var close = document.createElement("A");
		close.className="closeButton";
		close.href="javascript:locationManager.hide()";
		close.innerHTML="<span>[close]</span>";
		
		var join = document.createElement("A");
		join.className="join locationButton";
		join.href="javascript:locationManager.join()";
		join.innerHTML="Join this Location";
		
		var content = document.createElement("DIV");
		content.className = "content";
		var inner = document.createElement("DIV");
		inner.className = "inner";
		
		var ddiv = document.createElement("DIV");
		ddiv.className = "item first";
		ddiv.appendChild(document.createElement("H5"));
		ddiv.firstChild.textContent="Description";
		ddiv.appendChild(this.description);
		ddiv.appendChild(join);
		
		var udiv = document.createElement("DIV");
		udiv.className = "item users";
		udiv.appendChild(document.createElement("H5"));
		udiv.firstChild.textContent="Users";
		udiv.appendChild(this.users);
		
		var cdiv = document.createElement("DIV");
		cdiv.className = "item comments";
		cdiv.appendChild(document.createElement("H5"));
		cdiv.firstChild.textContent="Comments";
		cdiv.appendChild(this.comments);
		
		this.location.appendChild(close);
		this.location.appendChild(this.title);
		this.location.appendChild(content);
		content.appendChild(ddiv);
		content.appendChild(udiv);
		content.appendChild(cdiv);
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
		
		var descText = response.description;
		var htmlText = "";
		var paragraphs = new Array();
		paragraphs = descText.split("\n");
		for(var i = 0; i < paragraphs.length; i++){
			htmlText = htmlText + "<p>" + paragraphs[i] + "</p>";			
		}
		this.description.innerHTML = htmlText;
		
		if (response.users) {
			for (var i = 0; i < response.users.length; i++) {
				var text = document.createTextNode(response.users[i].name);
				var li = document.createElement("LI");
				li.appendChild(text);
				this.users.appendChild(li);
				if (i == response.users.length-1) {
					li.className = "last";
				}
			}
		}
		
		if (response.comments) {
			for (var i = 0; i < response.comments.length; i++) {
				var container = document.createElement("DL");
				var user = document.createElement("DT");
				user.innerHTML=response.comments[i].user.name;
				var text = document.createElement("DD");
				text.innerHTML=response.comments[i].text;
				var li = document.createElement("LI");
				container.appendChild(user);
				container.appendChild(text);
				li.appendChild(container);
				this.comments.appendChild(li);
			}
		}
		
		this.show();
	};
	this.show = function () {
		this.location.className="show";
		if (document.getElementById("map")) {
			document.getElementById("map").className="thin";
		}
	}
	this.hide = function () {
		this.location.className="";
		if (document.getElementById("map")) {
			document.getElementById("map").className="";
		}
	}
	this.join = function () {
		async.joinLocation(user.user, this.coordinates, function (req) {});
	}
};

hooks.addHook(function () { locationManager = new LocationManager(); });
hooks.addHook(function () { locationManager.load(); });
