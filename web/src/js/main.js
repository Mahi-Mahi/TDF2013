/* global console */

var $main, $inner;

var TDF = (function() {

	var my = {};


	// var TDF = window.TDF || {};

	my.setRoutes = function() {
		this.routes = {
			home: '/',
			search: '/recherche/',
			city: '/ville/',
			traces: '/traces/',
			streetview: '/lieux-mythiques/',
			fight: '/duels-de-legendes/',
			winners: '/vainqueurs/'
		};
	};

	my.Route = function() {

		/*

		/
		/recherche/
		/recherche/pari/
		/ville/paris/
		/traces/
		/traces/1954/
		/traces/1954,1975/
		/traces/1954,1975/bordeaux/
		/lieux-mythiques/
		/lieux-mythiques/mont-saint-michel/
		/duels-de-legendes/
		/duels-de-legendes/alberto-contador/richard-virenque/
		/vainqueurs/
		/vainqueurs/greg-lemon/

		/sources-et-methodologies/

		/credits/

		*/

		// Home
		Path.root("/");
		Path.map("/").to(function() {
			TDF.render('home');
		});

		// Map
		Path.map("/recherche/(:city_name/)").to(function() {
			if (this.params['city_name'] === undefined) {
				TDF.render('search');
			} else {
				TDF.render('search', {
					city_name: this.params['city_name']
				});
			}
		});

		// City
		Path.map("/ville/:city_id/)").to(function() {
			TDF.render('city', {
				city_id: this.params['city_id']
			});
		});

		// Traces
		Path.map("/traces/(:years/)(:city_id/)").to(function() {
			if (this.params['years'] === undefined) {
				TDF.render('traces');
			} else {
				if (this.params['city_id'] === undefined) {
					TDF.render('traces', {
						years: this.params['years']
					});
				} else {
					TDF.render('traces', {
						years: this.params['years'],
						city_id: this.params['city_id']
					});
				}
			}
		});

		// StreetView
		Path.map("/lieux-mythiques/(:place_id/)").to(function() {
			if (this.params['place_id'] === undefined) {
				TDF.render('streetview');
			} else {
				TDF.render('streetview', {
					place_id: this.params['place_id']
				});
			}
		});

		// Fight
		Path.map("/duels-de-legendes/(:legend_one/)(:legend_two/)").to(function() {
			if (this.params['legend_one'] === undefined) {
				TDF.render('fight');
			} else {
				if (this.params['legend_two'] === undefined) {
					TDF.render('fight', {
						legend_one: this.params['legend_one']
					});
				} else {
					TDF.render('fight', {
						legend_one: this.params['legend_one'],
						legend_two: this.params['legend_two']
					});
				}
			}
		});

		// Winners
		Path.map("/vainqueurs/(:winner_id/)").to(function() {
			if (this.params['winner_id'] === undefined) {
				TDF.render('winners');
			} else {
				TDF.render('winners', {
					winner_id: this.params['winner_id']
				});
			}
		});

		Path.rescue(function() {
			console.log("404: Route Not Found : " + document.location.pathname);
		});

		Path.history.listen(true);

		jQuery(document).on('click', 'a', function(event) {
			if (!jQuery(this).hasClass('external')) {
				event.preventDefault();
				Path.history.pushState({}, "", jQuery(this).attr("href"));
			}
		});

	};

	my.currentRoute = function() {

		var route = null;

		if (document.location.pathname.length > 1) {
			route = document.location.pathname.replace(/\/$/, '');
		}
		if (document.location.hash.length > 1) {
			route = document.location.hash.replace(/^#/, '').replace(/\/$/, '');
		}

		if (route === null) {
			return;
		}

		console.log("currentRoute : " + route);

		//  Path.history.pushState({}, "", route);

	};

	my.loadTemplate = function(module) {

		if ( ! $inner.hasClass(module.name) ) {

			var $content = jQuery('#template-' + module.name);

			if ( $content.find('header').length ) {
				var $header = $content.find('header');
				$header.html(jQuery('#template-header').html());
				$header.find('.active').removeClass('active');
				$header.find('.' + module.name).addClass('active');
			}

			for (var route in TDF.routes) {
				$content.find('.' + route + ' .link').attr('href', TDF.routes[route]);
			}

			var content = $content.html();

			jQuery('#inner').html(content).attr('class', module.name);

		}

	};

	my.render = function(module, args) {
		args = (typeof args === "undefined") ? {} : args;
		console.log("render(" + module);
		console.log(args);

		// instantiate module if undefined
		if (typeof this.modules[module] === "undefined") {
			switch (module) {
				case 'home':
					this.modules[module] = TDF.Home;
					break;
				case 'search':
					this.modules[module] = TDF.CitySearch;
					break;
				case 'traces':
					this.modules[module] = TDF.Traces;
					break;
				case 'winners':
					this.modules[module] = TDF.Winners;
					break;
				case 'fight':
					this.modules[module] = TDF.Fight;
					break;
				case 'streetview':
					this.modules[module] = TDF.StreetView;
					break;
			}
			this.modules[module].init();
		}

		this.modules[module].render(args);

	};

	my.init = function() {
		console.log("TDF.init");
		$main = jQuery('#main');
		$inner = jQuery('#inner');

		this.setRoutes();
		this.Route();

		this.modules = {};

		// render current module

		this.currentRoute();

		// render other modules

	};

	return my;

}());


TDF.Home = (function() {

	var my = {};

	my.name = 'home';

	my.init = function() {
		console.log("Home.init");

		// Set handler ( only on first init )

		$main.on('submit', '.home #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});

	};

	my.render = function() {
		console.log("Home.render");

		TDF.loadTemplate(this);

	};


	return my;
}());



TDF.CitySearch = (function() {

	var my = {};

	my.name = 'search';

	my.init = function() {
		console.log("CitySearch.init");

		$main.on('submit', '.search #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});

	};

	my.render = function(args) {
		console.log("CitySearch.render");

		TDF.loadTemplate(this);

		$main.find('#search').val(args.city_name);

		console.log("gmap.api('search', args);");
		// gmap.api('search', args);

	};

	return my;

}());


TDF.Traces = (function() {

	var my = {};

	my.name = 'traces';

	my.init = function() {
		console.log("Traces.init");

		$main.on('submit', '.traces #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});

	};

	my.render = function(args) {
		console.log("Traces.render");

		TDF.loadTemplate(this);

		$main.find('#search').val(args.city_name);

		console.log("gmap.api('search', args);");
		// gmap.api('search', args);

	};

	return my;

}());


TDF.Winners = (function() {

	var my = {};

	my.name = 'winners';

	my.init = function() {
		console.log("Winners.init");
	};

	my.render = function() {
		console.log("Winners.render");
		TDF.loadTemplate(this);
	};

	return my;

}());

TDF.Fight = (function() {

	var my = {};

	my.name = 'fight';

	my.init = function() {
		console.log("Fight.init");
	};

	my.render = function() {
		console.log("Fight.render");
		TDF.loadTemplate(this);
	};

	return my;

}());

TDF.StreetView = (function() {

	var my = {};

	my.name = 'streetview';

	my.init = function() {
		console.log("StreetView.init");
	};

	my.render = function() {
		console.log("StreetView.render");
		TDF.loadTemplate(this);
	};

	return my;

}());



// Document Ready
jQuery(document).ready(function() {

	TDF.init();

});
