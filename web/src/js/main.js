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
		Path.map("/ville/:city_id/").to(function() {
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
			route = '/';
		} else {
			route = route + '/';
		}

		Path.history.pushState({}, "", route);
	};

	my.loadTemplate = function(module) {

		if (!$inner.hasClass(module.name)) {

			var $content = jQuery('#template-' + module.name);

			if ($content.find('header').length) {
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

			return true;
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

		$main = jQuery('#main');
		$inner = jQuery('#inner');

		my.setRoutes();
		my.Route();

		my.modules = {};

		// only for #/dummy/ url
		my.currentRoute();
	};

	return my;

}());


TDF.Home = (function() {

	var my = {};

	my.name = 'home';

	my.init = function() {
		// Set handler ( only on first init )

		$main.on('submit', '.home #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});

	};

	my.render = function() {

		TDF.loadTemplate(this);

	};

	return my;
}());


TDF.CitySearch = (function() {

	var my = {};

	my.name = 'search';

	my.init = function() {

		$main.on('submit', '.search #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});

	};

	my.render = function(args) {

		TDF.loadTemplate(this);

		$main.find('#search').val(args.city_name);

		// gmap.api('search', args);

	};

	return my;
}());


TDF.Traces = (function() {

	var my = {};

	my.name = 'traces';

	my.data = null;
	my.args = null;
	my.traces = {};

	my.init = function() {

		$main.on('submit', '.traces #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});

	};

	my.render = function(args) {

		my.args = args;

		if (my.args.years === undefined) {} else {
			my.args.years = my.args.years.split(/,/);
		}

		if (TDF.loadTemplate(this)) {

			var $timeline = $main.find('.timeline-zoom ul');
			var $squares = $main.find('.timeline ul');
			var items = '',
				squares = '';

			var stat, stats = {
					total_length: null,
					nb_legs: null,
					nb_concurrents: null,
					nb_finishers: null
				};
			var trace;

			for (stat in stats) {
				stats[stat] = {
					min: {
						value: null,
						year: null
					},
					max: {
						value: null,
						year: null
					}
				};
			}

			for (var year in TDF.Data.traces) {
				items = items + '<li><label for="checkyear-' + year + '"><input type="checkbox" class="checkbox" name="years[]" value="' + year + '" id="checkyear-' + year + '">' + year + '</label></li>';
				squares = squares + '<li id="squareyear-' + year + '" data-year="' + year + '">' + year + '</li>';

				trace = TDF.Data.traces[year];

				if (year < 2013) {
					for (stat in stats) {
						if (trace[stat] > stats[stat].max.val || stats[stat].max.val == null) {
							stats[stat].max.val = trace[stat];
							stats[stat].max.year = year;
						}
						if (trace[stat] < stats[stat].min.val || stats[stat].min.val == null) {
							stats[stat].min.val = trace[stat];
							stats[stat].min.year = year;
						}
					}
				}
			}
			$timeline.append(items);
			$squares.append(squares);

			// CLick on timeline
			$main.on('click', '.traces .timeline-zoom .checkbox', function() {
				var years = [];
				if ($main.find("#multi-select:checked").length) {
					$main.find('.traces .timeline-zoom .checkbox:checked').each(function() {
						years.push(jQuery(this).val());
					});
				} else {
					years.push(jQuery(this).val());
					$main.find('.traces .timeline-zoom .checkbox:checked').prop('checked', false);
					jQuery(this).prop('checked', true);
				}
				Path.history.pushState({}, "", '/traces/' + years.join(',') + '/');
			});


			var slide_width = $main.find('.timeline-zoom ul').width() - $main.find('.timeline-zoom').width();
			$main.find(".timeline .slider").slider({
				slide: function(ui, event) {
					console.log(Math.round(slide_width * event.value / 100));
					$main.find('.timeline-zoom').scrollLeft(Math.round(slide_width * event.value / 100));
				}
			});

			for (stat in stats) {
				$main.find("." + stat + " .min .val").html(stats[stat].min.val);
				$main.find("." + stat + " .min .year").html(stats[stat].min.year);
				$main.find("." + stat + " .min").attr('href', '/traces/' + stats[stat].min.year + '/');
				$main.find("." + stat + " .max .val").html(stats[stat].max.val);
				$main.find("." + stat + " .max .year").html(stats[stat].max.year);
				$main.find("." + stat + " .max").attr('href', '/traces/' + stats[stat].max.year + '/');
			}

			$main.find('#multi-select').prop('checked', (my.args.years.length > 1));

		}

		this.setYears();
	};

	my.addYear = function(year) {
		my.traces[year] = TDF.Data.traces[year];
	};

	my.removeYear = function(year) {
		delete my.traces[year];
	};

	my.setYears = function() {

		// put selected years in my.traces
		var i, year = null;
		for (year in TDF.Data.traces) {
			if (my.traces[year] && jQuery.inArray(year, my.args.years) < 0) {
				this.removeYear(year);
				$main.find('#squareyear-' + year).removeClass('trace');
			}
		}
		for (i in my.args.years) {
			year = my.args.years[i];
			if (!my.traces[year]) {
				this.addYear(year);
				// check the timeline
				$main.find('#checkyear-' + year).prop('checked', true);
				$main.find('#squareyear-' + year).addClass('trace');
			}
		}

		my.display();

	};

	my.display = function() {

		// tell the map
		// gmap.API('traces', my.traces);

		// display the infos
		if (my.args.years.length === 1) {
			$main.find('#traces-years').attr('class', 'single').html(my.args.years.join(','));
		}
		if (my.args.years.length === 2) {
			$main.find('#traces-years').attr('class', 'double').html(my.args.years.map(function(elt) {
				return '<span>' + elt + '</span>';
			}).join(' '));
		}
		if (my.args.years.length > 2) {
			$main.find('#traces-years').attr('class', 'double').html(my.args.years.length + ' tours entre ' + [my.args.years[0], my.args.years[my.args.years.length - 1]].map(function(elt) {
				return '<span>' + elt + '</span>';
			}).join(' '));
		}

		// Stats

		var total_length = 0,
			nb_legs = 0,
			nb_concurrents = 0,
			nb_finishers = 0;
		var trace, year;
		for (year in my.traces) {
			trace = my.traces[year];
			total_length += trace.total_length;
			nb_legs += trace.nb_legs;
			nb_concurrents += trace.nb_concurrents;
			nb_finishers += trace.nb_finishers;
		}

		total_length = Math.round(total_length / my.args.years.length);
		nb_legs = Math.round(nb_legs / my.args.years.length);
		nb_concurrents = Math.round(nb_concurrents / my.args.years.length);
		nb_finishers = Math.round(nb_finishers / my.args.years.length);

		$main.find(".total_length .current").html(total_length);
		$main.find(".nb_legs .current").html(nb_legs);
		$main.find(".nb_concurrents .current").html(nb_concurrents);
		$main.find(".nb_finishers .current").html(nb_finishers);

		// Winners

		if (my.args.years.length === 1) {
			$main.find('.right').removeClass('disabled');

			trace = my.traces[my.args.years[0]];

			if (trace.winner_id !== 'n.a.') {
				$main.find('.winner .name').html('<a href="/vainqueurs/' + trace.winner_id + '/">' + trace.winner_first_name + ' ' + trace.winner_last_name + '</a>');
				$main.find('.winner .flag div').attr('class', trace.winner_country);
			} else {
				$main.find('.winner .name').text('');
				$main.find('.winner #flag').attr('class', '');
			}
			$main.find('.winner .total_time').text("en " + trace.winner_total_time);
			$main.find('.winner .average_speed').text(trace.winner_avg_speed + " de moyenne");

			if (trace.second_id) {
				$main.find('.second .name').html('<a href="/vainqueurs/' + trace.second_id + '/">' + trace.second_name + '</a>');
			} else {
				$main.find('.second .name').text(trace.second_name);
			}
			$main.find('.second .pos').text('2e');
			$main.find('.second .flag div').attr('class', trace.winner_country);
			$main.find('.second .ahead_of_second').text("à " + trace.ahead_of_2nd);

			if (trace.third_id) {
				$main.find('.third .name').html('<a href="/vainqueurs/' + trace.third_id + '/">' + trace.third_name + '</a>');
			} else {
				$main.find('.third .name').text(trace.third_name);
			}
			$main.find('.third .pos').text('3e');
			$main.find('.third .flag div').attr('class', trace.third_country);
			$main.find('.third .ahead_of_third').text("à " + trace.ahead_of_3rd);

		} else {
			$main.find('.right').addClass('disabled');

			$main.find('.winner .name').text('');
			$main.find('.winner #flag').attr('class', '');
			$main.find('.winner .total_time').text('');
			$main.find('.winner .average_speed').text('');

			$main.find('.second .name').text('');
			$main.find('.second .pos').text('');
			$main.find('.second .flag div').attr('class', '');
			$main.find('.second .ahead_of_second').text('');

			$main.find('.third .name').text('');
			$main.find('.third .pos').text('');
			$main.find('.third .flag div').attr('class', '');
			$main.find('.third .ahead_of_third').text('');

		}

	};

	return my;

}());

/*
http://ghusse.github.io/jQRangeSlider/index.html
*/
TDF.Winners = (function() {

	var my = {};

	my.name = 'winners';

	my.init = function() {};

	my.render = function() {
		TDF.loadTemplate(this);
	};

	return my;
}());

TDF.Fight = (function() {

	var my = {};

	my.name = 'fight';

	my.init = function() {};

	my.render = function() {
		TDF.loadTemplate(this);
	};

	return my;
}());

TDF.StreetView = (function() {

	var my = {};

	my.name = 'streetview';

	my.init = function() {};

	my.render = function() {
		TDF.loadTemplate(this);
	};

	return my;
}());

TDF.Data = (function() {

	var my = {};

	my.name = 'data';

	my.traces = null;

	my.init = function(callback) {


		if (this.traces === null) {
			jQuery.getJSON('/data/json/tours.json', function(json, textStatus) {
				console.log(textStatus);
				my.traces = json;
				callback();
			});

		}

	};

	return my;
}());

// Document Ready
jQuery(document).ready(function() {

	TDF.Data.init(TDF.init);

});