/* global console */ (function() {

	var TDF_Home = function() {

		this.init = function() {
			console.log("TDF_Home.init");
		};

		this.render = function() {
			console.log("TDF_Home.render");

			var data = {};
			for(var elt in TDF.routes) {
				// console.log(elt);
				// console.log(TDF.routes[elt]);
				data[elt] = {link: TDF.routes[elt]};
			}

			console.log(data);


			var directives = {
				link: {
					href: function() {
						console.log(this);
						return this.link;
					}
				}
			};

			console.log(directives);
			jQuery('.templates .home').render(data, directives);

		};

		this.init();

	};

	var TDF_Winners = function() {

		this.init = function() {
			console.log("TDF_Winners.init");
		};

		this.render = function() {
			console.log("TDF_Winners.render");
		};

	};


	var TDF = window.TDF || {};

	TDF.setRoutes = function() {
		this.routes = {
			home: '/',
			search: '/recherche/',
			city: '/ville/',
			tours: '/tours',
			streetview: '/lieux-mythiques/',
			fight: '/duels-de-legendes/',
			winners: '/vainqueurs/'
		};
	};

	TDF.Route = function() {

		console.log("Route");

		/*

		/
		/recherche/
		/recherche/pari/
		/ville/paris/
		/tours/
		/tours/1954/
		/tours/1954,1975/
		/tours/1954,1975/bordeaux/
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
			console.log("/home");
			TDF.render('home');
		});

		// Map
		Path.map("/recherche/(:city_name/)").to(function() {
			if (this.params['city_name'] === undefined) {
				console.log("/recherche");
				TDF.render('search');
			} else {
				console.log("/recherche : " + this.params['city_name']);
				TDF.render('search', {
					city_name: this.params['city_name']
				});
			}
		});

		// City
		Path.map("/ville/:city_id/)").to(function() {
			console.log("/city : " + this.params['city_id']);
			TDF.render('city', {
				city_id: this.params['city_id']
			});
		});

		// Tours
		Path.map("/tours/(:years/)(:city_id/)").to(function() {
			if (this.params['years'] === undefined) {
				console.log("/tours");
				TDF.render('tours');
			} else {
				if (this.params['city_id'] === undefined) {
					console.log("/tours : " + this.params['years']);
					TDF.render('tours', {
						years: this.params['years']
					});
				} else {
					console.log("/tours : " + this.params['years'] + " / " + this.params['city_id']);
					TDF.render('tours', {
						years: this.params['years'],
						city_id: this.params['city_id']
					});
				}
			}
		});

		// StreetView
		Path.map("/lieux-mythiques/)(:place_id/)").to(function() {
			if (this.params['place_id'] === undefined) {
				console.log("/StreetView");
				TDF.render('streetview');
			} else {
				console.log("/StreetView : " + this.params['place_id']);
				TDF.render('streetview', {
					place_id: this.params['place_id']
				});
			}
		});

		// Fight
		Path.map("/duels-de-legendes/(:legend_one/)(:legend_two/)").to(function() {
			if (this.params['legend_one'] === undefined) {
				console.log("/fight");
				TDF.render('fight');
			} else {
				if (this.params['legend_two'] === undefined) {
					console.log("/fight : " + this.params['legend_one']);
					TDF.render('fight', {
						legend_one: this.params['legend_one']
					});
				} else {
					console.log("/fight : " + this.params['legend_one'] + " / " + this.params['legend_two']);
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
				console.log("/winners");
				TDF.render('winners');
			} else {
				console.log("/winners : " + this.params['winner_id']);
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

	TDF.currentRoute = function() {

		console.log(this.routes);

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

	TDF.render = function(module, args) {
		args = (typeof args === "undefined") ? {} : args;
		console.log("render(" + module);
		console.log(args);

		// instantiate module if undefined
		if (typeof this.modules[module] === "undefined") {
			switch (module) {
				case 'home':
					this.modules[module] = new TDF_Home();
					break;
				case 'winners':
					this.modules[module] = new TDF_Winners();
					break;
			}
		}


		this.modules[module].render();


	};

	TDF.init = function() {

		console.log('init');

		TDF.setRoutes();
		TDF.Route();

		this.modules = {};

		// render current module

		TDF.currentRoute();

		// render other modules

	};


	// Document Ready
	jQuery(document).ready(function() {

		console.log(TDF.Winners);
		TDF.init();

	});


})();