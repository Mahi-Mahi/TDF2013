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
		Path.map("/duels-de-legendes/(:fighter_one/)(:fighter_two/)(:step/)").to(function() {
			if (this.params['fighter_one'] === undefined) {
				TDF.render('fight');
			} else {
				if (this.params['fighter_two'] === undefined) {
					TDF.render('fight', {
						fighter_one: this.params['fighter_one']
					});
				} else {
					if (this.params['step'] === undefined) {
						TDF.render('fight', {
							fighter_one: this.params['fighter_one'],
							fighter_two: this.params['fighter_two']
						});
					} else {
						TDF.render('fight', {
							fighter_one: this.params['fighter_one'],
							fighter_two: this.params['fighter_two'],
							step: this.params['step']
						});
					}
				}
			}
		});

		// Winners
		Path.map("/vainqueurs/:filter1/:val1/:filter2/:val2/:filter3/:val3/:filter4/:val4/(:winner_id/)").to(function() {
			var filters = {};
			filters[this.params['filter1']] = this.params['val1'];
			filters[this.params['filter2']] = this.params['val2'];
			filters[this.params['filter3']] = this.params['val3'];
			filters[this.params['filter4']] = this.params['val4'];
			if (this.params['winner_id'] === undefined) {
				TDF.render('winners', {
					filters: filters
				});
			} else {
				TDF.render('winners', {
					filters: filters,
					winner_id: this.params['winner_id']
				});
			}
		});
		Path.map("/vainqueurs/:filter1/:val1/:filter2/:val2/:filter3/:val3/(:winner_id/)").to(function() {
			var filters = {};
			filters[this.params['filter1']] = this.params['val1'];
			filters[this.params['filter2']] = this.params['val2'];
			filters[this.params['filter3']] = this.params['val3'];
			filters[this.params['filter4']] = this.params['val4'];
			if (this.params['winner_id'] === undefined) {
				TDF.render('winners', {
					filters: filters
				});
			} else {
				TDF.render('winners', {
					filters: filters,
					winner_id: this.params['winner_id']
				});
			}
		});
		Path.map("/vainqueurs/:filter1/:val1/:filter2/:val2/(:winner_id/)").to(function() {
			var filters = {};
			filters[this.params['filter1']] = this.params['val1'];
			filters[this.params['filter2']] = this.params['val2'];
			filters[this.params['filter3']] = this.params['val3'];
			filters[this.params['filter4']] = this.params['val4'];
			if (this.params['winner_id'] === undefined) {
				TDF.render('winners', {
					filters: filters
				});
			} else {
				TDF.render('winners', {
					filters: filters,
					winner_id: this.params['winner_id']
				});
			}
		});
		Path.map("/vainqueurs/:filter1/:val1/(:winner_id/)").to(function() {
			var filters = {};
			filters[this.params['filter1']] = this.params['val1'];
			filters[this.params['filter2']] = this.params['val2'];
			filters[this.params['filter3']] = this.params['val3'];
			filters[this.params['filter4']] = this.params['val4'];
			if (this.params['winner_id'] === undefined) {
				TDF.render('winners', {
					filters: filters
				});
			} else {
				TDF.render('winners', {
					filters: filters,
					winner_id: this.params['winner_id']
				});
			}
		});
		Path.map("/vainqueurs/(:winner_id/)").to(function() {
			var filters = {};
			if (this.params['winner_id'] === undefined) {
				TDF.render('winners', {
					filters: filters
				});
			} else {
				TDF.render('winners', {
					filters: filters,
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

	my.loadTemplate = function(module, step) {

		if (!step) {
			step = '';
		}

		if (!$inner.hasClass(module.name + step)) {

			var $content = jQuery('#template-' + module.name + step);

			if ($content.find('header').length) {
				var $header = $content.find('header');
				$header.html(jQuery('#template-header').html());
				$header.find('.active').removeClass('active');
				$header.find('.' + module.name + step).addClass('active');
			}

			if ($content.find('footer').length) {
				var $footer = $content.find('footer');
				$footer.html(jQuery('#template-footer').html());
			}

			for (var route in TDF.routes) {
				$content.find('.' + route + ' .link').attr('href', TDF.routes[route]);
			}

			var content = $content.html();

			jQuery('#inner').html(content).attr('class', module.name + step);

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

		/*
		// GTAB
        searchInput = $('#inputGeoloc');

        autocomplete_init();
		*/

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

		/*
		$main.on('submit', '.search #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});
		*/

		/*
		// GTAB

        //Elements
        map = $("#" + mapId);

        searchInput = $('#inputGeoloc');


        // google.maps.event.addDomListener(window, 'load', initializeGmap);

        loadData();
        // allEtapes => TDF.Data.legs


		*/

	};

	my.render = function(args) {

		TDF.loadTemplate(this);

		$main.find('#search').val(args.city_name);

		/*
		// GTAB
		initializeGmap();
		autocomplete_init();
		*/
		// gmap.api('search', args);

	};

	my.initializeGmap = function() {

	};

	my.autocomplete_init = function() {

	};

	return my;
}());


TDF.Traces = (function() {

	var my = {};

	my.name = 'traces';
	my.base_url = '/traces/';

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

		if (my.args.years === undefined) {
			my.args.years = [];
		} else {
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
				items = items + '<li><input type="checkbox" class="checkbox" name="years[]" value="' + year + '" id="checkyear-' + year + '"><label for="checkyear-' + year + '">' + year + '</label></li>';
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
				Path.history.pushState({}, "", my.base_url + years.join(',') + '/');
			});


			var slide_width = $main.find('.timeline-zoom ul').width() - $main.find('.timeline-zoom').width();
			$main.find(".timeline .slider").slider({
				slide: function(ui, event) {
					$main.find('.timeline-zoom').scrollLeft(Math.round(slide_width * event.value / 100));
				}
			});

			for (stat in stats) {
				$main.find("." + stat + " .min .val").html(stats[stat].min.val);
				$main.find("." + stat + " .min .year").html(stats[stat].min.year);
				$main.find("." + stat + " .min").attr('href', my.base_url + stats[stat].min.year + '/');
				$main.find("." + stat + " .max .val").html(stats[stat].max.val);
				$main.find("." + stat + " .max .year").html(stats[stat].max.year);
				$main.find("." + stat + " .max").attr('href', my.base_url + stats[stat].max.year + '/');
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
			if (parseInt(i, 10) > -1) {
				year = my.args.years[i];
				if (!my.traces[year]) {
					this.addYear(year);
					// check the timeline
					$main.find('#checkyear-' + year).prop('checked', true);
					$main.find('#squareyear-' + year).addClass('trace');
				}
			}
		}

		my.display();

	};

	my.display = function() {

		/*
		// GTAB
		gmap.createEtapes(my.args.years, TDF.Data.traces);
		*/

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
			$main.find('#traces-years').attr('class', 'triple').html('<em>' + my.args.years.length + ' tours entre </em>' + [my.args.years[0], my.args.years[my.args.years.length - 1]].map(function(elt) {
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
			$main.find('.traces-right').removeClass('disabled');

			trace = TDF.Data.traces[my.args.years[0]];

			if (trace.winner_id !== 'n.a.') {
				$main.find('.winner .winner-status').html('Vainqueur');
				$main.find('.winner .name').html('<a href="/vainqueurs/' + trace.winner_id + '/">' + trace.winner_first_name + ' ' + trace.winner_last_name + '</a>');
				$main.find('.winner .winner-pic').attr('src', '/img/vainqueurs/portraits/' + trace.winner_id + '_small.png');
				$main.find('.winner .flag img').attr('src', '/img/drapeaux/' + trace.winner_country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_big.png');
			} else {
				$main.find('.winner .name').text('');
				$main.find('.winner .flag img').attr('src', '/img/pix.gif');
			}
			$main.find('.winner .total_time').text("en " + trace.winner_total_time);
			$main.find('.winner .average_speed').text(trace.winner_avg_speed + " de moyenne");

			if (trace.second_id) {
				$main.find('.second .name').html('<a href="/vainqueurs/' + trace.second_id + '/">' + trace.second_name + '</a>');
			} else {
				$main.find('.second .name').text(trace.second_name);
			}
			$main.find('.second .pos').html('2<sup>e</sup>');
			$main.find('.second .flag img').attr('src', '/img/drapeaux/' + trace.second_country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_big.png');
			$main.find('.second .ahead_of_second').text("à " + trace.ahead_of_2nd);

			if (trace.third_id) {
				$main.find('.third .name').html('<a href="/vainqueurs/' + trace.third_id + '/">' + trace.third_name + '</a>');
			} else {
				$main.find('.third .name').text(trace.third_name);
			}
			$main.find('.third .pos').html('3<sup>e</sup>');
			$main.find('.third .flag img').attr('src', '/img/drapeaux/' + trace.third_country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_big.png');
			$main.find('.third .ahead_of_third').text("à " + trace.ahead_of_3rd);

		} else {
			$main.find('.traces-right').addClass('disabled');

			$main.find('.winner .name').html('');
			$main.find('.winner .flag img').attr('src', '/img/pix.gif');
			$main.find('.winner .total_time').html('');
			$main.find('.winner .average_speed').html('');

			$main.find('.second .name').html('');
			$main.find('.second .pos').html('');
			$main.find('.second .flag img').attr('src', '/img/pix.gif');
			$main.find('.second .ahead_of_second').html('');

			$main.find('.third .name').html('');
			$main.find('.third .pos').html('');
			$main.find('.third .flag img').attr('src', '/img/pix.gif');
			$main.find('.third .ahead_of_third').html('');

		}

	};

	return my;

}());

TDF.Winners = (function() {

	var my = {};

	my.name = 'winners';
	my.base_url = '/vainqueurs/';

	my.init = function() {

		$main.on('change', '.winners #nationality', function() {
			Path.history.pushState({}, "", my.getQueryString());
		});

		$main.on('keyup', '.winners #winner_search', function() {
			Path.history.pushState({}, "", my.getQueryString());
		});

	};

	my.getQueryString = function() {
		var query_string = my.base_url;

		if ($main.find('#nationality').val()) {
			query_string = query_string + 'nationalite/' + $main.find('#nationality').val() + '/';
		}

		if ($main.find('#winner_search').val()) {
			query_string = query_string + 'recherche/' + $main.find('#winner_search').val() + '/';
		}

		var win_age = $main.find(".filters .age .slider").slider('values');
		var win_age_default = $main.find(".filters .age .slider").slider('option');
		if (win_age[0] > win_age_default.min || win_age[1] < win_age_default.max) {
			query_string = query_string + 'age_victoire/' + $main.find(".filters .age .slider").slider('values').join(',') + '/';
		}

		var nb_wins = $main.find(".filters .nb_wins .slider").slider('values');
		var nb_wins_default = $main.find(".filters .nb_wins .slider").slider('option');
		if (nb_wins[0] > nb_wins_default.min || nb_wins[1] < nb_wins_default.max) {
			query_string = query_string + 'nb_victoires/' + $main.find(".filters .nb_wins .slider").slider('values').join(',') + '/';
		}

		my.fixUrl(query_string);

		if (my.args.winner_id) {
			query_string = query_string + my.args.winner_id + '/';
		}

		return query_string;
	};

	my.fixUrl = function(query_string) {

		// replace urls
		$main.find('.winner').each(function() {
			jQuery(this).find('a').attr('href', query_string + jQuery(this).data('winner-id') + '/');
		});
		jQuery('#close').attr('href', query_string + jQuery(this).data('winner-id') + '/');

	};

	my.render = function(args) {
		my.args = args;

		var winner_id, winner, winners_list = [],
			content;

		var youngest_win = null,
			oldest_win = null,
			max_wins = null,
			countries = [];

		var liify = function(elt) {
			return '<li>' + elt + '</li>';
		};

		if (TDF.loadTemplate(this)) {

			var $template = jQuery('#template-winner');
			for (winner_id in TDF.Data.winners) {
				winner = TDF.Data.winners[winner_id];
				content = $template.html()
					.replace(':winner_url', '/vainqueurs/' + winner_id + '/')
					.replace(/:winner_id/g, winner_id)
					.replace(':nb_wins', winner.wins.length)
					.replace(':portrait_url', '/img/vainqueurs/portraits/' + winner.id + '_small.png')
					.replace(':win_ages', winner.wins_age.join(','))
					.replace(':country', winner.country)
					.replace(':name', winner.first_name + ' ' + winner.last_name)
					.replace(':safename', winner.id.replace('-', ' '))

				.replace(':flag_url', '/img/drapeaux/' + winner.country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_small.png')

				.replace(':wins', winner.wins.map(liify).join(''));

				winners_list.push(content);

				if (winner.wins_age.min() < youngest_win || youngest_win === null) {
					youngest_win = winner.wins_age.min();
				}
				if (winner.wins_age.max() > oldest_win || oldest_win === null) {
					oldest_win = winner.wins_age.max();
				}
				if (winner.wins.length > max_wins || max_wins === null) {
					max_wins = winner.wins.length;
				}

				if (jQuery.inArray(winner.country, countries) < 0) {
					countries.push(winner.country);
				}

			}

			$main.find('.winners_list ul').html(winners_list.join(' '));

			$main.find(".filters .age .slider").slider({
				min: youngest_win,
				max: oldest_win,
				range: true,
				step: 1,
				values: [youngest_win, oldest_win],
				slide: function() {
					Path.history.pushState({}, "", my.getQueryString());
				}
			});

			$main.find(".filters .nb_wins .slider").slider({
				min: 1,
				max: max_wins,
				range: true,
				step: 1,
				values: [1, max_wins],
				slide: function() {
					Path.history.pushState({}, "", my.getQueryString());
				}
			});

			$main.find('.filters #nationality').append(countries.sort().map(function(elt) {
				return '<option value="' + elt + '" ' + (my.args.filters.nationalite === elt ? 'SELECTED' : '') + '>' + elt + '</option>';
			})).selectbox();

			$main.find('.filters #winner_search').val(my.args.filters.recherche);
			Path.history.pushState({}, "", my.getQueryString());
		}

		this.display();
		this.filter();

	};

	my.display = function() {

		var winner = TDF.Data.winners[my.args.winner_id];

		var $winner = $main.find('#winner');

		$main.find('.winner-active').removeClass('winner-active');
		if (winner) {
			$main.find('.' + winner.id).addClass('winner-active');
		}

		if (winner === undefined) {
			$winner.slideUp();
		} else {

			$winner.find('.portrait').attr('src', '/img/vainqueurs/portraits/' + winner.id + '_big.png');
			$winner.find('.name').html('<em>' + winner.first_name + '</em> <strong>' + winner.last_name + '</strong>');
			$winner.find('.flag img').attr('src', '/img/drapeaux/' + winner.country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_big.png');
			$winner.find('.birth').text(winner.birthyear + ' - ' + (winner.deathyear === undefined ? '' : winner.deathyear));
			$winner.find('.bio').html(winner.bio);
			$winner.find('.duel').attr('href', '/duels-de-legendes/' + winner.id + '/');

			var tour, year, winner_tours = [],
				bulle = '',
				pos_title;
			var $template = jQuery('#template-winner-tour');
			var years = [];

			for (year in winner.years) {
				years.push(parseInt(year, 10));
			}

			var visible_tours = 16,
				nb_tours = years.max() - years.min();
			var i;

			for (i = 0; i < Math.floor((visible_tours - nb_tours) / 2); i++) {
				winner_tours.push('<li class="empty"></li>');
			}

			for (year = years.min(); year <= years.max(); year++) {

				if (winner.years[year]) {
					tour = winner.years[year];
					if (parseInt(tour.position, 10) === 1) {
						bulle = 'Vainqueur en ' + year + '<br />' +
							' en ' + TDF.Data.traces[year].winner_total_time.replace(/"/, "''") + '<br />' +
							' (' + TDF.Data.traces[year].winner_avg_speed + ') <br />' +
							" à l'age de " + (year - winner.birthyear) + " ans";
						pos_title = 'Victoire finale';
					} else {
						bulle = tour.position + '<exp>e</exp> en ' + year;
						switch (tour.position) {
							default: pos_title = tour.position;
							break;
							case 'Abandon':
								pos_title = 'A';
								break;
							case 'Elimination':
								pos_title = 'E';
								break;
						}
					}
					winner_tours.push(
						$template.html()
						.replace(/:pos_title/g, pos_title)
						.replace(/:pos/g, tour.position.replace(' ', '-'))
						.replace(/:hpos/g, parseInt(tour.position, 10) ? Math.round(tour.position / TDF.Data.traces[year].nb_concurrents * 100) + 'px' : '40px')
						.replace(':wins', "<div>Victoire d'étape</div>".repeat(tour.nb_wins))
						.replace(':bulle', bulle)
						.replace(/:year/g, year));
				} else {
					winner_tours.push('<li class="' + year + '"><div class="not">X</div><div class="year">' + year + '</div></li>');
				}
			}

			for (i = 0; i < Math.ceil((visible_tours - nb_tours) / 2); i++) {
				winner_tours.push('<li class="empty"></li>');
			}

			$winner.find('.tours').html(winner_tours.join(' '));

			$winner.slideDown();
		}

	};

	my.filter = function() {

		jQuery(".winners_list .winner").stop().data('show', true);

		if (my.args.filters.nationalite) {
			console.log("filter nationality : " + my.args.filters.nationalite);
			$main.find('.winners_list .winner').each(function() {
				jQuery(this).data('show', jQuery(this).data('country') === my.args.filters.nationalite);
			});
		}

		if (my.args.filters.age_victoire) {
			console.log("filter age victoire : " + my.args.filters.age_victoire);
			var win_ages, filter_age = my.args.filters.age_victoire.split(/,/);
			$main.find('.winners_list .winner').each(function() {
				win_ages = jQuery(this).data('win-ages').toString().split(/,/);
				jQuery(this).data('show', (win_ages.min() <= filter_age[1] && win_ages.max() >= filter_age[0]));
			});
		}

		if (my.args.filters.nb_victoires) {
			console.log("filter nb_victoires : " + my.args.filters.nb_victoires);
			var nb_wins, filter_nb_wins = my.args.filters.nb_victoires.split(/,/);
			$main.find('.winners_list .winner').each(function() {
				nb_wins = jQuery(this).data('nb-wins').toString().split(/,/);
				jQuery(this).data('show', (nb_wins.min() <= filter_nb_wins[1] && nb_wins.max() >= filter_nb_wins[0]));
			});
		}

		if (my.args.filters.recherche) {
			console.log("filter search : " + my.args.filters.recherche);
			$main.find('.winners_list .winner').each(function() {
				var re = new RegExp(my.args.filters.recherche, 'i');
				jQuery(this).data('show', jQuery(this).find('.name').text().match(re) !== null);
			});
		}

		var duration = 500;
		jQuery(".winners_list .winner:data(show)").stop().css({
			display: 'inline-block'
		}).animate({
			width: '162px'
		}, duration, function() {});
		jQuery(".winners_list .winner").not(":data(show)").stop().animate({
			width: '0px'
		}, duration, function() {
			jQuery(this).css({
				display: 'none'
			});
		});

	};

	return my;
}());

TDF.Fight = (function() {

	var my = {};

	my.name = 'fight';
	my.base_url = '/duels-de-legendes/';

	my.init = function() {
		$main.on('click', '.fight-home .start', function() {
			my.fight('start');
		});

	};

	my.render = function(args) {
		my.args = args;

		var $fighter, fighter;

		if (my.args.step !== undefined) {
			my.fight();
			return;
		}



		if (TDF.loadTemplate(this, '-home')) {}

		if (my.args.fighter_one !== 'selector') {
			if (TDF.Data.fighters[my.args.fighter_one]) {
				fighter = TDF.Data.fighters[my.args.fighter_one];
				$fighter = $main.find('.fighter_one');
				$fighter.data('id', my.args.fighter_one);
				$fighter.find('.name').html('<span>' + fighter.first_name + '</span> ' + fighter.last_name);
			}
		}

		if (my.args.fighter_two !== 'selector') {
			if (TDF.Data.fighters[my.args.fighter_two]) {
				fighter = TDF.Data.fighters[my.args.fighter_two];
				$fighter = $main.find('.fighter_two');
				$fighter.data('id', my.args.fighter_two);
				$fighter.find('.name').html('<span>' + fighter.first_name + '</span> ' + fighter.last_name);
			}
		}

		if (my.args.fighter_one === 'selector') {
			my.showSelector('fighter_one');
		} else {
			if (my.args.fighter_two === 'selector') {
				my.showSelector('fighter_two');
			} else {
				my.hideSelector();
			}
		}

		$main.find('.fighter_one a').attr('href', my.base_url + 'selector/' + (my.args.fighter_two ? my.args.fighter_two + '/' : ''));
		$main.find('.fighter_two a').attr('href', my.base_url + (my.args.fighter_one ? my.args.fighter_one + '/' : '') + 'selector/');

		if (my.args.fighter_one && my.args.fighter_two) {
			$main.find('.start').attr('href', my.getQueryString() + 'start/');
		}

	};

	my.getQueryString = function() {
		var query_string = my.base_url;

		if (my.args.fighter_one) {
			query_string = query_string + my.args.fighter_one + '/';
		}

		if (my.args.fighter_two) {
			query_string = query_string + my.args.fighter_two + '/';
		}

		return query_string;

	};

	my.hideSelector = function() {
		$main.find('.selector').html('');
	};

	my.showSelector = function(side) {

		$main.find('.selector').html(jQuery('.templates #template-fight-selector').html());

		var fighter, fighter_id, content, winners_list = [],
			legends_list = [];
		var $template = jQuery('#template-winner');

		var url_fighter_one, url_fighter_two;
		switch (side) {
			case 'fighter_one':
				url_fighter_one = '';
				url_fighter_two = my.args.fighter_two ? '' : '';
				break;
			case 'fighter_two':
				url_fighter_one = my.args.fighter_one + '/';
				url_fighter_two = '';
				break;
		}

		var current_selector = '.' + (side === 'fighter_one' ? 'fighter_two' : 'fighter_one');
		var current_id = $main.find(current_selector).data('id');
		for (fighter_id in TDF.Data.fighters) {

			if (fighter_id === current_id) {
				continue;
			}
			fighter = TDF.Data.fighters[fighter_id];
			content = $template.html()
				.replace(':winner_url', my.base_url + url_fighter_one + fighter_id + '/' + url_fighter_two)
				.replace(/:winner_id/g, fighter_id)
				.replace(':portrait_url', '/img/vainqueurs/portraits/' + fighter_id + '_small.png')
				.replace(':name', fighter.first_name + ' ' + fighter.last_name)
				.replace(':safename', '')
				.replace(':flag_url', '/img/drapeaux/' + (fighter.country ? fighter.country.replace(' ', '-').replace('É', 'e').toLowerCase() : '') + '_small.png');

			if (fighter.winner) {
				winners_list.push(content);
			}
			if (fighter.legend) {
				legends_list.push(content);
			}

		}

		$main.find('.selector .legends ul').html(legends_list.join(' '));
		$main.find('.selector .winners ul').html(winners_list.join(' '));
	};

	my.fight = function() {

		var fighter_one = TDF.Data.fighters[my.args.fighter_one];
		var fighter_two = TDF.Data.fighters[my.args.fighter_two];

		if (!$inner.hasClass('fight-start')) {
			$inner.html(jQuery('.templates #template-fight-start').html());
			$inner.attr('class', 'fight-start');
		}
		$inner.find('.next').text("Épreuve Suivante");

		var $fighter_one = $main.find('.fighter_one');
		var $fighter_two = $main.find('.fighter_two');

		$fighter_one.find('.name').html(fighter_one.first_name + ' ' + fighter_one.last_name);
		$fighter_two.find('.name').html(fighter_two.first_name + ' ' + fighter_two.last_name);

		// calcul des positions relatives

		var steps = [];
		steps[0] = [0, 0];

		for (var i = 1; i < 6; i++) {
			steps[i] = [
				steps[i - 1][0] + (fighter_one.steps[i] - fighter_two.steps[i]),
				steps[i - 1][1] + (fighter_two.steps[i] - fighter_one.steps[i])
			];
		}
		steps[6] = [0, 0];
		steps[7] = [fighter_one.is_doped ? -1000 : fighter_one.score, fighter_two.is_doped ? -1000 : fighter_two.score];

		var ratio = 3.12;
		var max_space = 400;

		var step_title, step_class, fighter_one_result, fighter_two_result, diff = [];

		if (!isNaN(parseInt(my.args.step, 10))) {
			my.args.step = parseInt(my.args.step, 10);
		}

		switch (my.args.step) {
			default:
			case 0:
			case 'start':
				my.args.step = 0;
				$fighter_one.css({
					'margin-left': (max_space / 2) + 'px'
				});
				$fighter_two.css({
					'margin-left': (max_space / 2) + 'px'
				});
				$inner.find('.next').text("Top Départ");
				$inner.find('.next').attr('href', my.getQueryString() + (my.args.step + 1) + '/');
				break;
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 'finish':
			case 'results':
				switch (my.args.step) {
					case 1:
						step_class = "nb_legs";
						step_title = "Nombre d'étapes remportées";
						fighter_one_result = fighter_one.nb_leg_wins + " étape" + (fighter_one.nb_leg_wins > 1 ? 's' : '');
						fighter_two_result = fighter_two.nb_leg_wins + " étape" + (fighter_two.nb_leg_wins > 1 ? 's' : '');
						break;
					case 2:
						step_class = "pct_leading";
						step_title = "Temps passé en tête du général";
						fighter_one_result = fighter_one.pct_leading + "% de son meilleur tour";
						fighter_two_result = fighter_two.pct_leading + "% de son meilleur tour";
						break;
					case 3:
						step_class = "average_speed";
						step_title = "Meilleur vitesse moyenne";
						fighter_one_result = fighter_one.average_speed + " km/h";
						fighter_two_result = fighter_two.average_speed + " km/h";
						break;
					case 4:
						step_class = "ahead_of_second";
						step_title = "Meilleure avance sur le deuxième";
						fighter_one_result = fighter_one.ahead_of_second;
						fighter_two_result = fighter_two.ahead_of_second;
						break;
					case 5:
						step_class = "nb_wins";
						step_title = "Nombre de tours gagnés";
						fighter_one_result = fighter_one.nb_wins + " victoire" + (fighter_one.nb_wins > 1 ? 's' : '');
						fighter_two_result = fighter_two.nb_wins + " victoire" + (fighter_two.nb_wins > 1 ? 's' : '');
						break;
					case 6:
						step_class = "doping";
						step_title = "contrôle antidopage";
						fighter_one_result = fighter_one.is_doped ? "<strong>Convaincu de dopage</strong>" : "Aucun dopage connu";
						fighter_two_result = fighter_two.is_doped ? "<strong>Convaincu de dopage</strong>" : "Aucun dopage connu";
						break;
					case 7:
					case 'finish':
					case 'results':
						step_title = "Bilan de la source" + '<br />' + '<a href="' + (my.getQueryString() + 'results/') + '" class="show-results">Les résultats</a>';
						step_class = 'finish';
						if (my.args.step === 'results') {

							my.showResults();

						}

						break;
				}
				diff[0] = ((steps[my.args.step][0] / ratio / 2 * max_space) + (max_space / 2));
				diff[1] = ((steps[my.args.step][1] / ratio / 2 * max_space) + (max_space / 2));
				// console.log(steps);
				// console.log(diff);
				// console.log([fighter_one.score, fighter_two.score]);
				$fighter_one.animate({
					'margin-left': diff[0] + 'px'
				});
				$fighter_two.animate({
					'margin-left': diff[1] + 'px'
				});
				$inner.find('.title div').html("Épreuve N°" + my.args.step + '<br />' + step_title).attr('class', step_class);
				$fighter_one.find('.result').html(fighter_one_result);
				$fighter_two.find('.result').html(fighter_two_result);
				$inner.find('.next').attr('href', my.getQueryString() + (my.args.step + 1) + '/');

				break;
		}
	};

	my.showResults = function() {
		$main.find('.results').html(jQuery('.templates #template-fight-results').html());

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

	my.init = function(callback) {

		// traces
		jQuery.getJSON('/data/json/tours.json', function(json, textStatus) {
			console.log(textStatus);
			my.traces = json;

			// winners
			jQuery.getJSON('/data/json/winners.json', function(json, textStatus) {
				console.log(textStatus);
				my.winners = json;

				// fighters
				jQuery.getJSON('/data/json/fighters.json', function(json, textStatus) {
					console.log(textStatus);
					my.fighters = json;
					callback();
				});

			});

		});

	};

	return my;
}());

// Document Ready
jQuery(document).ready(function() {
	TDF.Data.init(TDF.init);
});
