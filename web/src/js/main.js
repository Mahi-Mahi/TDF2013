/* global console */
(function() {

	var TDF = window.TDF || {};

	TDF.Route = function() {

		console.log("Route");

		var setPageBackground = function() {
			console.log('setPageBackground');
		};

		// home
		Path.root("/");

		// Fight
		Path.map("/").to(function() {
			console.log("/home");
		}).enter(setPageBackground);

		// Fight
		Path.map("/fight").to(function() {
			console.log("/fight");
		}).enter(setPageBackground);

		// Winners
		Path.map("/winners").to(function() {
			console.log("/winners");
		}).enter(setPageBackground);

		Path.rescue(function(){
			console.log("404: Route Not Found : " + document.location.pathname);
		});

		Path.history.listen(true);

		jQuery(document).on('click', 'a', function(event) {
			if (!jQuery(this).hasClass()) {
				event.preventDefault();
				Path.history.pushState({}, "", jQuery(this).attr("href"));
			}
		});

	};

	TDF.currentRoute = function() {
		var route = null;

		if (document.location.pathname.length > 1) {
			route = document.location.pathname.replace(/\/$/, '');
		}
		if (document.location.hash.length > 1) {
			route = document.location.hash.replace(/^#/, '').replace(/\/$/, '');
		}

		if ( route === null ) {
			return;
		}

		console.log("currentRoute : " + route);

		Path.history.pushState({}, "", route);

	};

	TDF.init = function() {

		console.log('init');

		TDF.Route();

		console.log("currentRoute");

		TDF.currentRoute();

	};

	// Document Ready
	jQuery(document).ready(function() {

		TDF.init();

	});


})();