if (!window.console) {
	window.console = {};
}
if (!window.console.log) {
	window.console.log = function() {};
}

var liify = function(elt) {
	return '<li>' + elt + '</li>';
};

// EXTEND JQUERY SCROLLTO
jQuery.fn.extend({
	scrollTo: function(speed, easing) {
		return this.each(function() {
			var targetOffset = jQuery(this).offset().top;
			jQuery("html,body").animate({
				scrollTop: targetOffset
			}, speed, easing);
		});
	}
});

/* global console */
/* global $LAB */
/* global google  */
/* global mapStyleTrace */
/* global mapStyleSearch */
/* global addthis */
/* global ga */
/* global eStat_id */
/* global eStat_tag */
/* global xt_med */

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

		var url;
		var hash_prefix = "";

		// Home
		Path.root(hash_prefix + "/");
		Path.map(hash_prefix + "/").to(function() {
			TDF.render('home');
		});

		// Map
		Path.map(hash_prefix + "/recherche/(:city_name/)").to(function() {
			if (this.params['city_name'] === undefined) {
				TDF.render('search');
			} else {
				TDF.render('search', {
					city_name: decodeURIComponent(this.params['city_name'])
				});
			}
		});

		// City
		Path.map(hash_prefix + "/ville/:city/").to(function() {
			TDF.render('city', {
				city: decodeURIComponent(this.params['city'])
			});
		});

		// Traces
		Path.map(hash_prefix + "/traces/(:years/)(:city/)").to(function() {
			if (this.params['years'] === undefined) {
				TDF.render('traces');
			} else {
				if (this.params['city'] === undefined) {
					if (this.params['years'].match(/^[\d\,]+$/)) {
						TDF.render('traces', {
							years: this.params['years']
						});

					} else {
						TDF.render('traces', {
							city: decodeURIComponent(this.params['years'])
						});
					}
				} else {
					TDF.render('traces', {
						years: this.params['years'],
						city: decodeURIComponent(this.params['city'])
					});
				}
			}
		});

		// StreetView
		Path.map(hash_prefix + "/lieux-mythiques/(:place_id/)").to(function() {
			if (this.params['place_id'] === undefined) {
				TDF.render('streetview');
			} else {
				TDF.render('streetview', {
					place_id: this.params['place_id']
				});
			}
		});

		// Fight
		Path.map(hash_prefix + "/duels-de-legendes/(:fighter_one/)(:fighter_two/)(:step/)").to(function() {
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
		Path.map(hash_prefix + "/vainqueurs/:filter1/:val1/:filter2/:val2/:filter3/:val3/:filter4/:val4/(:winner_id/)").to(function() {
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
		Path.map(hash_prefix + "/vainqueurs/:filter1/:val1/:filter2/:val2/:filter3/:val3/(:winner_id/)").to(function() {
			var filters = {};
			filters[this.params['filter1']] = this.params['val1'];
			filters[this.params['filter2']] = this.params['val2'];
			filters[this.params['filter3']] = this.params['val3'];
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
		Path.map(hash_prefix + "/vainqueurs/:filter1/:val1/:filter2/:val2/(:winner_id/)").to(function() {
			var filters = {};
			filters[this.params['filter1']] = this.params['val1'];
			filters[this.params['filter2']] = this.params['val2'];
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
		Path.map(hash_prefix + "/vainqueurs/:filter1/:val1/(:winner_id/)").to(function() {
			var filters = {};
			filters[this.params['filter1']] = this.params['val1'];
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
		Path.map(hash_prefix + "/vainqueurs/(:winner_id/)").to(function() {
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
			console.log("404: Route Not Found : '" + document.location.pathname + "'");
			// Path.history.pushState({}, "", "#" + document.location.pathname);
			Path.history.pushState({}, "", "/");
		});

		Path.history.listen(true);

		window.onpopstate = function(event) {
			event.preventDefault();
			return false;
		};

		jQuery(document).on('click', 'a', function(event) {
			if (!jQuery(this).hasClass('external') && !jQuery(this).hasClass("sbSelector") && !jQuery(this).hasClass("sbFocus")) {
				event.preventDefault();
				url = jQuery(this).attr("href");
				Path.history.pushState({}, "", url);
				return false;
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
				$header.find('.' + module.name).addClass('active');
			}

			if ($content.find('footer').length) {
				var $footer = $content.find('footer');
				$footer.html(jQuery('#template-footer').html());
				// TO UPDATE
				$footer.find('.colorbox:first').colorbox({
					width: 490,
					height: 500
				});
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

		if (this.modules === undefined) {
			this.modules = {};
		}

		// instantiate module if undefined
		if (this.modules[module] === undefined) {
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
			this.modules[module].init(args);
		} else {
			this.modules[module].render(args);
		}

		// ga('create', 'UA-7571900-21', 'radiofrance.fr');
		ga('send', 'pageview', {
			'page': document.location.pathname
		});

		my.tracking();

	};

	my.tracking = function() {

		switch (document.location.pathname) {
			case '/':
				my.estat_track("100_tours_de_france", "homepage", "homepage", "homepage");
				xt_med('F', '73', '100_tours_de_france::homepage::homepage::homepage', '');
				break;
			case '/recherche/':
				my.estat_track("100_tours_de_france", "recherche", "recherche", "recherche");
				xt_med('F', '73', '100_tours_de_france::recherche::recherche::recherche', '');
				break;
			case '/traces/':
				my.estat_track("100_tours_de_france", "traces", "traces", "traces");
				xt_med('F', '73', '100_tours_de_france::traces::traces::traces', '');
				break;
			case '/vainqueurs/':
				my.estat_track("100_tours_de_france", "vainqueurs", "vainqueurs", "vainqueurs");
				xt_med('F', '73', '100_tours_de_france::vainqueurs::vainqueurs::vainqueurs', '');
				break;
			case '/duels-de-legendes/':
				my.estat_track("100_tours_de_france", "duels-de-legendes", "duels-de-legendes", "duels-de-legendes");
				xt_med('F', '73', '100_tours_de_france::duels-de-legendes::duels-de-legendes::duels-de-legendes', '');
				break;
			case '/lieux-mythiques/':
				my.estat_track("100_tours_de_france", "lieux-mythiques", "lieux-mythiques", "lieux-mythiques");
				xt_med('F', '73', '100_tours_de_france::lieux::lieux::lieux', '');
				break;
		}
	};

	my.estat_track = function(niv1, niv2, niv3, niv4) {
		eStat_id.niveau(1, niv1);
		eStat_id.niveau(2, niv2);
		eStat_id.niveau(3, niv3);
		eStat_id.niveau(4, niv4);
		eStat_tag.post("ml");
	};

	my.init = function() {
		$LAB
			.script('/js/lib/jquery.colorbox.js')
			.wait(function() {
			my.start();
		});
	};

	my.start = function() {

		$main = jQuery('#main');
		$inner = jQuery('#inner');

		my.setRoutes();
		my.Route();

		my.modules = {};

		// only for #/dummy/ url
		my.currentRoute();

	};

	my.setShares = function(url, text) {

		text = text.replace(/via /, '');

		addthis.toolbox('#addthis-share', {}, {
			url: 'http://' + document.location.hostname + url,
			title: text
		});

		/*
		jQuery('.share .twitter a').attr('href', 'https://twitter.com/intent/tweet?via=RFnvx&text='+encodeURIComponent(text)+'&hashtags='+hashtags+'&url='+encodeURIComponent(document.location.href));
		twttr.widgets.load();

		var res = gapi.plus.render('gplus-share', {
			href: document.location.href,
			annotation: 'inline'
		});
		*/
	};

	return my;

}());


TDF.Home = (function() {

	var my = {};

	my.name = 'home';

	my.base_url = '/';
	my.share_text = "Explorez les #données des 100 Tours de France : tracés, vainqueurs, lieux mythiques... #appli #data #TDF via @RFnvx";

	my.init = function() {
		// Set handler ( only on first init )
		$LAB
			.script('/js/lib/jquery-placeholder.js')
			.script('/js/lib/jcarousellite.js')
			.wait(function() {
			my.start();
		});
	};

	my.start = function() {
		$main.on('submit', '.home #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});
		my.render();
	};

	my.render = function() {

		TDF.loadTemplate(my);

		//Plus d'autocomplete sur la Home (pour le moment)

		//my.autocomplete_init();

		TDF.setShares(my.base_url, my.share_text);

		jQuery('input').placeholder();

		jQuery('#carrousel-home-search-inner').jCarouselLite({
			vertical: true,
			auto: 10000,
			speed: 800
		});

	};



	my.autocomplete_init = function() {

		// Overrides the default autocomplete filter function to search only from the beginning of the string
		jQuery.ui.autocomplete.filter = function(array, term) {
			var matcher = new RegExp("^" + jQuery.ui.autocomplete.escapeRegex(term), "i");
			return jQuery.grep(array, function(value) {
				return matcher.test(value.label || value.value || value);
			});
		};

		if (jQuery('#search').length) {

			jQuery("#search").autocomplete({
				minLength: 1,
				source: TDF.Data.cities,
				open: function() {
					jQuery(".ui-autocomplete:visible").css({
						top: "+=4",
						left: "-=10"
					});
				},
				messages: {
					noResults: '',
					results: function() {}
				}
			});

			/*
			var input = document.getElementById('search');
			var gMapAutocomplete = new google.maps.places.Autocomplete(input);
			input.className = '';

			input.className = '';

			google.maps.event.addListener(gMapAutocomplete, 'place_changed', function() {

				var place = gMapAutocomplete.getPlace();

				if (!place.geometry) {
					input.className = 'notfound';
					return;
				}



			});

			jQuery(input).bind('keydown', function(e) {
				if (e.keyCode === 13) {


				} else {

				}
			});
				*/

		}

	};

	return my;
}());


TDF.CitySearch = (function() {

	var my = {};

	my.name = 'search';

	my.share_text = "Explorez les #données des 100 Tours de France : tracés, vainqueurs, lieux mythiques... #appli #data #TDF via @RFnvx";
	my.share_hashtags = "appli,data,TDF";

	my.gmapApi = null;

	my.init = function(args) {
		my.args = args;
		$LAB
			.script('/js/lib/jquery.gmapApi.js')
			.script('/js/lib/gmap.infobox.js')
			.script('/js/lib/map-marker-label.js')
			.script('/js/lib/map-style.js')
			.script('/js/lib/jquery-ui.js')
			.script('/js/lib/jquery-ui-touchpunch.js')
			.wait(function() {
			my.start();
		});
	};

	my.start = function() {

		/*
		$main.on('submit', '.search #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});
		*/
		TDF.Data.load('cities', 'cities', function() {
			TDF.Data.load('legs', 'legs', TDF.CitySearch.render);
		});

	};

	my.render = function(args) {
		if (args !== undefined) {
			my.args = args;
		}

		if (TDF.loadTemplate(my)) {}

		$main.find('#search').val(my.args.city_name);

		my.autocomplete_init();

		my.initializeGmap();

	};

	my.initializeGmap = function() {

		//Config Gmap
		var mapId = 'gmap-search';
		var mapTypeId = google.maps.MapTypeId.ROADMAP;
		var startlat = 47.754098;
		var startlng = 3.669434;
		var zoom = 5;

		var map = $inner.find("#" + mapId);


		var mapOptions = {
			mapTypeId: mapTypeId,
			center: new google.maps.LatLng(startlat, startlng),
			mapTypeControl: false,
			panControl: false,
			streetViewControl: false,
			zoom: zoom,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},
			markerIconImg: '/img/recherche/recherche_pin.png',
			markerIconSize: [58, 70],
			markerLabelIconImg: '/img/recherche/recherche_pin_nearby.png',
			styles: mapStyleSearch
		};
		my.gmapApi = map.gmapApi(mapOptions);
	};

	my.autocomplete_init = function() {

		function geocoding() {
			//                        searchInput.autocomplete( "close" );

			var address = searchInput.val();

			geocoder.geocode({
				'address': address
			}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					my.gmapApi.findEtapesNear(results[0].geometry.location.lat(), results[0].geometry.location.lng(), address, TDF.Data.legs);
				} else {
					console.log('Geocode was not successful for the following reason: ' + status);
				}
			});

		}

		var searchInput = $main.find('#search');
		var form = $main.find('#city_search');
		var geocoder = new google.maps.Geocoder();


		// Overrides the default autocomplete filter function to search only from the beginning of the string
		jQuery.ui.autocomplete.filter = function(array, term) {
			var matcher = new RegExp("^" + jQuery.ui.autocomplete.escapeRegex(term), "i");
			return jQuery.grep(array, function(value) {
				return matcher.test(value.label || value.value || value);
			});
		};
		searchInput.autocomplete({
			minLength: 1,
			source: TDF.Data.cities,
			messages: {
				noResults: '',
				results: function() {}
			},
			appendTo: '#city_search',
			select: function() {
				geocoding();
			}
		});

		if (searchInput.val().length > 0) {
			geocoding();
		}

		form.submit(function() {

			geocoding();

			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			searchInput.autocomplete('destroy');
			my.autocomplete_init();
			searchInput.autocomplete('close');
			return false;
		});

		searchInput.bind('keydown', function(e) {
			if (e.keyCode === 13) {
				//                            geocoding();
			} else {

			}
		});

		$main.on('change', '.selectYearSearch', function(event) {
			event.preventDefault();

			var data = jQuery(this).val();

			if (data === -1) {
				return false;
			}

			Path.history.pushState({}, "", '/traces/' + data + '/');

		});

	};

	return my;
}());


TDF.Traces = (function() {

	var my = {};

	my.name = 'traces';
	my.base_url = '/traces/';

	my.data = null;
	my.args = null;

	my.share_text = "Découvrez les tracés des 100 éditions du Tour de France dans une #carte interactive #appli #data #TDF via @RFnvx";

	my.city_years = [];
	my.city_slider_set = false;

	my.state = null;
	my.state_interval = null;

	my.last_click = null;

	my.gmapApi = null;

	my.init = function(args) {
		console.log("Traces.init");
		my.args = args;
		$LAB
			.script('/js/lib/jquery.gmapApi.js')
			.script('/js/lib/gmap.infobox.js')
			.script('/js/lib/map-marker-label.js')
			.script('/js/lib/map-style.js')
			.script('/js/lib/jquery-ui.js')
			.script('/js/lib/jquery-ui-touchpunch.js')
			.wait(function() {
			TDF.Data.load('cities', 'cities', function() {
				TDF.Data.load('traces', 'tours', function() {
					TDF.Data.load('legs', 'legs', function() {
						jQuery(TDF.Data.legs).each(function(i, leg) {
							TDF.Data.traces[leg.year].legs.push(leg);
						});
						my.start();
					});
				});
			});
		});
	};

	my.start = function() {
		console.log("Traces.start");

		$main.on('submit', '.traces #city_search', function(event) {
			event.preventDefault();
			Path.history.pushState({}, "", '/recherche/' + $main.find('#search').val() + '/');
			return false;
		});

		$main.on('click', '.traces #select-all', function() {
			if (my.state === null) {
				if (jQuery(this).prop('checked')) {
					$inner.find('#multi-select').prop('checked', true);
					$inner.find('.timeline-zoom .checkbox').prop('checked', true);
					var years = [];
					$main.find('.traces .timeline-zoom .checkbox:checked').each(function() {
						years.push(jQuery(this).val());
					});
					Path.history.pushState({}, "", my.base_url + years.join(',') + '/');

				} else {
					Path.history.pushState({}, "", my.base_url + (my.last_clicked ? my.last_clicked : '2013') + '/');
				}
			}
		});

		$main.on('click', '.traces #multi-select', function() {
			if (my.state === null && !my.state_interval) {
				if (!my.last_clicked) {
					my.last_clicked = 2013;
				}
				if (jQuery(this).prop('checked')) {
					jQuery('.traces #start-pause').addClass('opaque');
					my.gmapApi.setMultiple(true);
					// Path.history.pushState({}, "", my.base_url + my.args.years.join(',') + '/');
				} else {
					jQuery('.traces #start-pause').removeClass('opaque');
					my.gmapApi.setMultiple(false);
					Path.history.pushState({}, "", my.base_url + my.last_clicked + '/');
				}
			}
		});

		$main.on('click', '.traces .map-toolbox .city .title span', function() {
			if (my.state === null) {
				jQuery(this).hide();
				jQuery('.traces .map-toolbox form').show().find('#search').focus();
			}
		});

		// Click on timeline
		$main.on('click', '.traces .timeline-zoom span', function() {
			if (my.state === null || my.state_interval) {
				if ($main.find("#multi-select:checked").length) {
					if (jQuery(this).prev('input').prop('checked')) {
						jQuery(this).prev('input').prop('checked', false);
						jQuery(this).parent('li').removeClass('trace');
					} else {
						jQuery(this).prev('input').prop('checked', true);
						my.last_clicked = jQuery(this).prev('input.checkbox').val();
						jQuery(this).parent('li').addClass('trace');
					}
					var years = [];
					$main.find('.traces .timeline-zoom .checkbox:checked').each(function() {
						years.push(jQuery(this).val());
					});
					Path.history.pushState({}, "", my.base_url + years.join(',') + '/' + (my.args.city ? my.args.city + '/' : ''));
				} else {
					Path.history.pushState({}, "", my.base_url + jQuery(this).prev('input').val() + '/' + (my.args.city ? my.args.city + '/' : ''));
				}
			}
		});

		$main.on('mouseenter', '.traces .timeline-zoom span', function() {
			if (my.state === null) {
				var year = jQuery(this).text();
				my.gmapApi.changeOpacity(year);
			}
		});

		// mouseleave
		$main.on('mouseleave', '.traces .timeline-zoom span', function() {
			if (my.state === null) {
				var year = jQuery(this).text();
				my.gmapApi.changeOpacityBack(year);
			}
		});

		$main.on('click', '.traces #start-pause', function() {
			var play_speed = 1000;
			if (my.args.years.length < 2) {
				if (my.state === null) {
					jQuery('.traces #multi-select').prop('disabled', 'disabled');
					jQuery('.traces #select-all').prop('disabled', 'disabled');
					jQuery('.traces #start-pause').addClass('active');
					if (jQuery('.timeline-zoom input:checked').val() === '2013') {
						jQuery('.timeline-zoom li:first span').click();
					} else {
						// jQuery('.timeline-zoom input:checked').parent().next().find('span').click();
					}
					if (jQuery('.timeline-zoom input:checked').parent().next().length) {
						my.state_interval = setInterval(function() {
							if (jQuery('.timeline-zoom input:checked').parent().next().length) {
								jQuery('.timeline-zoom input:checked').parent().next().find('span').click();
							} else {
								jQuery('.traces #start-pause').removeClass('active');
								jQuery('.traces #multi-select').prop('disabled', '');
								jQuery('.traces #select-all').prop('disabled', '');
								clearTimeout(my.state_interval);
								my.state = my.state_interval = null;
							}
						}, play_speed);
						my.state = 'playing';
					} else {
						jQuery('.traces #start-pause').removeClass('active');
						jQuery('.traces #multi-select').prop('disabled', '');
						jQuery('.traces #select-all').prop('disabled', '');
						clearTimeout(my.state_interval);
						my.state = my.state_interval = null;
					}
				} else {
					jQuery('.traces #start-pause').removeClass('active');
					jQuery('.traces #multi-select').prop('disabled', '');
					jQuery('.traces #select-all').prop('disabled', '');
					clearTimeout(my.state_interval);
					my.state = my.state_interval = null;
				}
			}
		});

		TDF.Traces.render();
	};


	my.autocomplete_init = function() {
		console.log("Traces.autocomplete_init");

		var searchInput = $main.find('#search');
		var form = $main.find('#city_search');

		jQuery.ui.autocomplete.filter = function(array, term) {
			var matcher = new RegExp("^" + jQuery.ui.autocomplete.escapeRegex(term), "i");
			return jQuery.grep(array, function(value) {
				return matcher.test(value.label || value.value || value);
			});
		};

		searchInput.autocomplete({
			minLength: 1,
			source: TDF.Data.cities,
			open: function() {
				jQuery(".ui-autocomplete:visible").css({
					top: "+=4",
					left: "-=33"
				});
			},
			messages: {
				noResults: '',
				results: function() {}
			},
			select: function(event, ui) {
				my.city_slider_set = false;
				Path.history.pushState({}, "", my.base_url + my.args.years.join(',') + '/' + ui.item.value.split(',')[0] + '/'); // my.args.years.join(',') + '/' +
			}
		});

		if (searchInput.val().length > 0) {}

		form.submit(function() {
			my.city_slider_set = false;
			Path.history.pushState({}, "", my.base_url + my.args.years.join(',') + '/' + $main.find('#search').val() + '/');
			searchInput.autocomplete('destroy');
			my.autocomplete_init();
			searchInput.autocomplete('close');
			return false;
		});

		searchInput.bind('keydown', function(e) {
			if (e.keyCode === 13) {
				my.city_slider_set = false;
				Path.history.pushState({}, "", my.base_url + my.args.years.join(',') + '/' + $main.find('#search').val() + '/');
				searchInput.autocomplete('destroy');
				my.autocomplete_init();
				searchInput.autocomplete('close');
			}
		});

	};


	my.initializeGmap = function() {
		console.log("Traces.initializeGmap");
		//Config Gmap
		var mapId = 'gmap-traces';
		var mapTypeId = google.maps.MapTypeId.ROADMAP;
		var startlat = 47.754098;
		var startlng = 3.669434;
		var zoom = 5;

		var map = $inner.find("#" + mapId);

		var mapOptions = {
			mapTypeId: mapTypeId,
			center: new google.maps.LatLng(startlat, startlng),
			mapTypeControl: false,

			panControl: false,
			streetViewControl: false,
			zoomMin: 8,
			zoomMax: 4,

			zoom: zoom,
			zoomControl: true,
			zoomControlOptions: {
				position: google.maps.ControlPosition.TOP_LEFT,
				style: google.maps.ZoomControlStyle.SMALL
			},
			markerIconImg: '/img/traces/solo-pointeur-ombre.png',
			markerCircleIconImg: '/img/traces/solo-pointeur-boucle-ombre.png',
			markersIcons: [{
					url: "/img/traces/solo-pointeur-ombre.png",
					width: 21,
					height: 21,
					anchorX: 21 / 2,
					anchorY: 21 / 2
				}, {
					url: "/img/traces/solo-pointeur-boucle-ombre.png",
					width: 21,
					height: 25,
					anchorX: 21 / 2,
					anchorY: 21 / 2
				}, {
					url: "/img/traces/multi-pointeur.png",
					width: 7,
					height: 7,
					anchorX: 7 / 2,
					anchorY: 7 / 2
				}, {
					url: "/img/traces/multi-pointeur-transparent.png",
					width: 1,
					height: 1,
					anchorX: 1,
					anchorY: 1
				}, {
					url: "/img/traces/pointeur-villeetape-ombre.png",
					width: 25,
					height: 25,
					anchorX: 25 / 2,
					anchorY: 25 / 2
				}
			],
			styles: mapStyleTrace
		};

		my.gmapApi = map.gmapApi(mapOptions);
		console.log("Traces.initializeGmap : END");
	};

	my.getCityTraces = function(city) {
		var years = [];
		city = city.toLowerCase().split(/,/)[0];
		jQuery(TDF.Data.legs).each(function(idx, leg) {
			if (leg.start.city.toLowerCase() === city || leg.finish.city.toLowerCase() === city) {
				years.push(leg.year);
			}
		});
		return years.getUnique().sort();
	};

	my.render = function(args) {
		console.log("Traces.render");

		if (args !== undefined) {
			my.args = args;
		}

		if (my.args.years === undefined) {
			if (my.args.city === undefined) {
				my.args.years = [2013];
				my.city_years = [];
				$main.find('#search').val('');
			} else {
				my.city_years = my.args.years = my.getCityTraces(my.args.city);
			}
		} else {
			my.args.years = my.args.years.split(/,/);
			if (my.args.city === undefined) {
				my.city_years = [];
				$main.find('#search').val('');
			} else {
				my.city_years = my.getCityTraces(my.args.city);
			}
		}

		if (TDF.loadTemplate(my)) {

			var $timeline = $main.find('.timeline-zoom ul');
			var $squares = $main.find('.timeline ul');
			var items = '',
				squares = '';

			var stat;
			my.stats = {
				total_length: null,
				nb_legs: null,
				nb_concurrents: null,
				nb_finishers: null
			};
			var trace;

			for (stat in my.stats) {
				my.stats[stat] = {
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
				items = items + '<li><input type="checkbox" class="checkbox" name="years[]" value="' + year + '" id="checkyear-' + year + '"><span id="span-checkyear-' + year + '">' + year + '</span></li>';
				squares = squares + '<li id="squareyear-' + year + '" data-year="' + year + '">' + year + '</li>';

				trace = TDF.Data.traces[year];

				for (stat in my.stats) {
					if (trace[stat] > my.stats[stat].max.val || my.stats[stat].max.val == null) {
						my.stats[stat].max.val = trace[stat];
						my.stats[stat].max.year = year;
					}
					if ((trace[stat] < my.stats[stat].min.val && trace[stat] > 0) || my.stats[stat].min.val == null) {
						my.stats[stat].min.val = trace[stat];
						my.stats[stat].min.year = year;
					}
				}

			}
			$timeline.append(items);
			$squares.append(squares);

			var slide_width = $main.find('.timeline-zoom ul').width() - $main.find('.timeline-zoom').width();

			var slider_default = (jQuery("#squareyear-" + my.args.years.min()).prevAll().length) + 1;

			$main.find(".timeline .slider").slider({
				value: slider_default,
				slide: function(event, ui) {
					$main.find('.timeline-zoom').scrollLeft(Math.round(slide_width * ui.value / 100));
				},
				create: function() {
					$main.find('.timeline-zoom').scrollLeft(Math.round(slide_width * slider_default / 100));
				}
			});

			for (stat in my.stats) {
				$main.find("." + stat + " .min .val").html(my.stats[stat].min.val);
				$main.find("." + stat + " .min .year").html(my.stats[stat].min.year);
				$main.find("." + stat + " .min").attr('href', my.base_url + my.stats[stat].min.year + '/');
				$main.find("." + stat + " .max .val").html(my.stats[stat].max.val);
				$main.find("." + stat + " .max .year").html(my.stats[stat].max.year);
				$main.find("." + stat + " .max").attr('href', my.base_url + my.stats[stat].max.year + '/');
			}

			$main.find('#multi-select').prop('checked', (my.args.years.length > 1));

			my.initializeGmap();
			my.autocomplete_init();

		}

		$main.find('.timeline li.etape').removeClass('etape');
		$main.find('.timeline-zoom li.etape').removeClass('etape');
		jQuery(my.city_years).each(function(idx, year) {
			$main.find('#span-checkyear-' + year).parent('li').addClass('etape');
			$main.find('#squareyear-' + year).addClass('etape');
		});
		$main.find('.timeline li.active').removeClass('active');
		$main.find('.timeline-zoom li.active').removeClass('active');
		jQuery(my.args.years).each(function(idx, year) {
			$main.find('#span-checkyear-' + year).parent('li').addClass('active');
			$main.find('#squareyear-' + year).addClass('trace');
		});

		if (my.args.city === undefined) {
			$main.find('.map-container .city .title').hide();
			$main.find('.map-container .city form').show();
		} else {
			$main.find('.map-container .city .title').html('<span>' + my.args.city + '</span>' + '<a href="' + my.base_url + my.args.years.join(',') + '/" class="close-city">Fermer</a>').show();
			$main.find('.map-container .city form').hide();
			$main.find('.map-container .back').attr('href', '/recherche/' + my.args.city + '/');
		}

		my.setYears();

		TDF.setShares(my.base_url, my.share_text);

		console.log("Traces.render END");


	};

	my.setYears = function() {
		console.log("Traces.setYears");
		var year;

		$main.find('.timeline li').removeClass('trace');
		$main.find('.timeline-zoom input').prop('checked', false);

		for (var i in my.args.years) {
			year = my.args.years[i];
			if (parseInt(year, 10) > -1) {
				$main.find('#checkyear-' + year).prop('checked', true);
				$main.find('#squareyear-' + year).addClass('trace');
			}
		}

		my.display();

	};

	my.display = function() {
		console.log("Traces.display");

		my.gmapApi.createEtapes(my.args.years, my.args.city, TDF.Data.traces);

		var slider_default;
		var slide_width = $main.find('.timeline-zoom ul').width() - $main.find('.timeline-zoom').width();
		if (my.city_slider_set === false && my.city_years.length > 0) {
			slider_default = (jQuery("#squareyear-" + my.city_years.max()).prevAll().length + 1);
			my.city_slider_set = true;
		} else {
			slider_default = (jQuery("#squareyear-" + my.args.years.min()).prevAll().length + 1);
		}
		$main.find(".timeline .slider").slider({
			value: slider_default
		});
		$main.find('.timeline-zoom').scrollLeft(Math.round(slide_width * slider_default / 100));

		// $main.find('.map-container .back').attr('href', my.base_url + (my.args.city ? my.args.city + '/' : ''));

		/*
		// GTAB
		gmap.createEtapes(my.args.years, TDF.Data.traces);
		*/

		// tell the map
		// gmap.API('traces', my.traces);

		// display the infos
		if (my.args.years.length === 1) {
			$main.find('#traces-years').attr('class', 'single').html(my.args.years.join(','));
			jQuery('.traces-left-stats').find('small').css('visibility', 'hidden');
		}
		if (my.args.years.length === 2) {
			$main.find('#traces-years').attr('class', 'double').html(my.args.years.map(function(elt) {
				return '<span>' + elt + '</span>';
			}).join(' '));
			jQuery('.traces-left-stats').find('small').css('visibility', 'visible');
		}
		if (my.args.years.length > 2) {
			$main.find('#traces-years').attr('class', 'triple').html('<em>' + my.args.years.length + ' tours entre </em>' + [my.args.years[0], my.args.years[my.args.years.length - 1]].map(function(elt) {
				return '<span>' + elt + '</span>';
			}).join(' '));
			jQuery('.traces-left-stats').find('small').css('visibility', 'visible');
		}

		// Stats

		var total_length = 0,
			nb_legs = 0,
			nb_concurrents = 0,
			nb_finishers = 0;
		var trace;

		jQuery(my.args.years).each(function(idx, year) {
			trace = TDF.Data.traces[year];
			total_length += trace.total_length;
			nb_legs += trace.nb_legs;
			nb_concurrents += trace.nb_concurrents;
			nb_finishers += trace.nb_finishers;
		});

		total_length = Math.round(total_length / my.args.years.length);
		nb_legs = Math.round(nb_legs / my.args.years.length);
		nb_concurrents = Math.round(nb_concurrents / my.args.years.length);
		nb_finishers = Math.round(nb_finishers / my.args.years.length);

		var line_length = 129;

		$main.find(".total_length .current").html(total_length);
		$main.find(".total_length .line").css({
			width: Math.round((total_length - my.stats['total_length'].min.val) / (my.stats['total_length'].max.val - my.stats['total_length'].min.val) * line_length) + 'px'
		});

		$main.find(".nb_legs .current").html(nb_legs);
		$main.find(".nb_legs .line").css({
			width: Math.round((nb_legs - my.stats['nb_legs'].min.val) / (my.stats['nb_legs'].max.val - my.stats['nb_legs'].min.val) * line_length) + 'px'
		});

		$main.find(".nb_concurrents .current").html(nb_concurrents);
		$main.find(".nb_concurrents .line").css({
			width: Math.round((nb_concurrents - my.stats['nb_concurrents'].min.val) / (my.stats['nb_concurrents'].max.val - my.stats['nb_concurrents'].min.val) * line_length) + 'px'
		});

		$main.find(".nb_finishers .current").html((my.args.years.length === 0 || my.args.years[0] === 2013 || my.args.years[0] === '2013') ? 'N.C.' : nb_finishers + " à l'arrivée");
		$main.find(".nb_finishers .line").css({
			width: Math.round((nb_finishers - my.stats['nb_finishers'].min.val) / (my.stats['nb_finishers'].max.val - my.stats['nb_finishers'].min.val) * line_length) + 'px'
		});

		// Winners
		if (my.args.years.length === 1 && parseInt(my.args.years[0], 10) !== 2013) {
			$main.find('.traces-right').removeClass('disabled');

			trace = TDF.Data.traces[my.args.years[0]];

			if (trace.winner_id !== 'n.a.') {
				$main.find('.winner .winner-status').html('Vainqueur');
				$main.find('.winner .name').html('<a href="/vainqueurs/' + trace.winner_id + '/">' + trace.winner_first_name + ' ' + trace.winner_last_name + '</a>');
				$main.find('.winner .winner-pic').attr('src', '/img/vainqueurs/portraits/' + trace.winner_id + '_small.png');
				$main.find('.winner .flag img').attr('src', '/img/drapeaux/' + trace.winner_country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_big.png');
				$main.find('.winner .total_time').html("en " + trace.winner_total_time.format_time(true));
				$main.find('.winner .average_speed').text(trace.winner_avg_speed + " km/h de moyenne");
			} else {
				$main.find('.traces-right').addClass('disabled');
				$main.find('.winner .name').addClass('no-winner').html('Lance Armstrong<br />Déclassé');
				$main.find('.winner .flag img').attr('src', '/img/pix.gif');
				$main.find('.winner .total_time').html('');
				$main.find('.winner .average_speed').html('');
				$main.find('.winner .winner-pic').attr('src', '/img/traces/vainqueur_silhouette.png');
				$main.find('.winner .winner-status').html('');
			}

			if (trace.second_id) {
				$main.find('.second .name').html('<a href="/vainqueurs/' + trace.second_id + '/">' + trace.second_name + '</a>');
			} else {
				$main.find('.second .name').text(trace.second_name);
			}
			$main.find('.second .pos').html('2<sup>e</sup>');
			$main.find('.second .flag img').attr('src', '/img/drapeaux/' + trace.second_country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_big.png');
			$main.find('.second .ahead_of_second').text(trace.ahead_of_2nd.format_time(false, "à "));

			if (trace.third_id) {
				$main.find('.third .name').html('<a href="/vainqueurs/' + trace.third_id + '/">' + trace.third_name + '</a>');
			} else {
				$main.find('.third .name').text(trace.third_name);
			}
			$main.find('.third .pos').html('3<sup>e</sup>');
			$main.find('.third .flag img').attr('src', '/img/drapeaux/' + trace.third_country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_big.png');
			$main.find('.third .ahead_of_third').text(trace.ahead_of_3rd.format_time(false, "à "));

		} else {
			$main.find('.traces-right').addClass('disabled');

			$main.find('.winner .winner-pic').attr('src', '/img/traces/vainqueur_silhouette.png');
			$main.find('.winner .winner-status').html('');

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

		console.log("Traces.display END");

	};

	return my;

}());

TDF.Winners = (function() {

	var my = {};

	my.name = 'winners';
	my.base_url = '/vainqueurs/';

	my.share_text = "Comparez les palmarès des 58 vainqueurs du Tour de France #appli #data #TDF via @RFnvx";

	my.init = function(args) {
		console.log("Winners.init");
		my.args = args;
		$LAB
			.script('/js/lib/jquery-ui.js')
			.script('/js/lib/jquery-ui-touchpunch.js')
			.script('/js/lib/jquery-selectbox.js')
			.wait(function() {
			TDF.Data.load('traces', 'tours', function() {
				TDF.Data.load('legs', 'legs', function() {
					jQuery(TDF.Data.legs).each(function(i, leg) {
						TDF.Data.traces[leg.year].legs.push(leg);
					});
					TDF.Data.load('winners', 'winners', function() {
						my.start();
					});
				});
			});
		});
	};

	my.start = function() {
		console.log("Winners.start");

		$main.on('change', '.winners #nationality', function() {
			Path.history.pushState({}, "", my.getQueryString());
		});

		$main.on('keyup', '.winners #winner_search', function() {
			Path.history.pushState({}, "", my.getQueryString());
		});
		$main.on('click', '.winners .reset', function() {
			$main.find('.filters #nationality').selectbox('change', '');
			$main.find('.filters #nationality').selectbox('detach');
			$main.find('.filters #nationality').selectbox('attach');

			$main.find('#winner_search').val('');

			var age = $main.find(".filters .age .slider");
			age.slider('option', 'values', [age.slider('option', 'min'), age.slider('option', 'max')]);
			age.find(".ui-slider-handle:eq(0)").html('<span>' + age.slider('option', 'min') + '</span>');
			age.find(".ui-slider-handle:eq(1)").html('<span>' + age.slider('option', 'max') + '</span>');

			var nb_wins = $main.find(".filters .nb_wins .slider");
			nb_wins.slider('option', 'values', [nb_wins.slider('option', 'min'), nb_wins.slider('option', 'max')]);
			nb_wins.find(".ui-slider-handle:eq(0)").html('<span>' + nb_wins.slider('option', 'min') + '</span>');
			nb_wins.find(".ui-slider-handle:eq(1)").html('<span>' + nb_wins.slider('option', 'max') + '</span>');
		});

		var tmp = [];
		for (var i in TDF.Data.winners) {
			tmp.push(TDF.Data.winners[i]);
		}
		my.sorted_winners = tmp.sort(function(a, b) {
			if (a.wins.max() < b.wins.max()) {
				return 1;
			}
			if (a.wins.max() > b.wins.max()) {
				return -1;
			}
			return 0;
		});

		my.render();

	};

	my.getQueryString = function() {
		var query_string = my.base_url;

		if ($main.find('#nationality option[selected]').length) {
			var nationality = $main.find('#nationality option[selected]').attr('value');
			if (nationality && nationality !== undefined) {
				query_string = query_string + 'nationalite/' + nationality + '/';
			}
		}

		if ($main.find('#winner_search').val().length) {
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
		$main.find('#close').attr('href', query_string);
		$main.find('.reset').attr('href', my.base_url + (my.args.winner_id ? my.args.winner_id + '/' : ''));

	};

	my.render = function(args) {
		console.log("Winners.renders");
		if (args !== undefined) {
			my.args = args;
		}

		var winners_list = [],
			content;

		var youngest_win = null,
			oldest_win = null,
			max_wins = null,
			countries = [];

		if (TDF.loadTemplate(my)) {

			var $template = jQuery('#template-winner');
			jQuery(my.sorted_winners).each(function(idx, winner) {
				content = $template.html()
					.replace(':winner_url', '/vainqueurs/' + winner.id + '/')
					.replace(/:winner_id/g, winner.id)
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

			});

			$main.find('.winners_list ul').html(winners_list.join(' '));
			/*
			$main.find('.winners_list').jScrollPane({
				mouseWheelSpeed: '2',
				maintainPosition: false,
				autoReinitialise: true,
				animateScroll: true
			});
	*/

			var filters = {};

			if (my.args.filters.age_victoire) {
				filters.age = my.args.filters.age_victoire.split(/,/);
			} else {
				filters.age = [youngest_win, oldest_win];
			}
			$main.find(".filters .age .slider").slider({
				min: youngest_win,
				max: oldest_win,
				range: true,
				step: 1,
				values: [parseInt(filters.age[0], 10), parseInt(filters.age[1], 10)],
				change: function() {
					Path.history.pushState({}, "", my.getQueryString());
				},
				slide: function(event, ui) {
					Path.history.pushState({}, "", my.getQueryString());
					jQuery(this).find(".ui-slider-handle:eq(0)").html('<span>' + ui.values[0] + '</span>');
					jQuery(this).find(".ui-slider-handle:eq(1)").html('<span>' + ui.values[1] + '</span>');
				},
				create: function() {
					var values = jQuery(this).slider('values');
					jQuery(this).find(".ui-slider-handle:eq(0)").html('<span>' + values[0] + '</span>');
					jQuery(this).find(".ui-slider-handle:eq(1)").html('<span>' + values[1] + '</span>');
				}
			});

			if (my.args.filters.nb_victoires) {
				filters.wins = my.args.filters.nb_victoires.split(/,/);
			} else {
				filters.wins = [1, max_wins];
			}

			$main.find(".filters .nb_wins .slider").slider({
				min: 1,
				max: max_wins,
				range: true,
				step: 1,
				values: [parseInt(filters.wins[0], 10), parseInt(filters.wins[1], 10)],
				change: function() {
					Path.history.pushState({}, "", my.getQueryString());
				},
				slide: function(event, ui) {
					jQuery(this).find(".ui-slider-handle:eq(0)").html('<span>' + ui.values[0] + '</span>');
					jQuery(this).find(".ui-slider-handle:eq(1)").html('<span>' + ui.values[1] + '</span>');
					Path.history.pushState({}, "", my.getQueryString());
				},
				create: function() {
					var values = jQuery(this).slider('values');
					jQuery(this).find(".ui-slider-handle:eq(0)").html('<span>' + values[0] + '</span>');
					jQuery(this).find(".ui-slider-handle:eq(1)").html('<span>' + values[1] + '</span>');
				}
			});

			$main.find('.filters #nationality').append(countries.sort().map(function(elt) {
				return '<option value="' + elt + '" ' + (my.args.filters.nationalite === elt ? 'SELECTED' : '') + '>' + elt + '</option>';
			})).selectbox();

			$main.find('.filters #winner_search').val(my.args.filters.recherche);
			Path.history.pushState({}, "", my.getQueryString());
		}

		my.display();
		my.filter();

		TDF.setShares(my.base_url, my.share_text);

	};

	my.display = function() {
		console.log("Winners.display");

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
			$winner.find('.birth').text((winner.deathyear === undefined ? "né en " + winner.birthyear : winner.birthyear + ' - ' + winner.deathyear));
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

			var suppl_years = Math.floor((visible_tours - nb_tours) / 2);
			for (i = 0; i < suppl_years; i++) {
				winner_tours.push('<li class="empty"><div class="year">' + (years.min() - suppl_years + i) + '</div></li>');
			}

			for (year = years.min(); year <= years.max(); year++) {

				if (winner.years[year]) {
					tour = winner.years[year];
					if (parseInt(tour.position, 10) === 1) {
						bulle = 'Vainqueur en ' + year + "  " +
							' en ' + TDF.Data.traces[year].winner_total_time.replace(/"/, "''") + ' ' +
							' (' + TDF.Data.traces[year].winner_avg_speed + ' km/h)  ' +
							" à l'age de " + (year - winner.birthyear) + " ans";
						pos_title = 'Victoire finale';
					} else {
						bulle = '';
						switch (tour.position) {
							default: pos_title = tour.position;
							bulle = tour.position + (parseInt(tour.position, 10) > 0 ? 'e ' : '') + ' en ' + year;
							break;
							// pos_title = 'A';
							// break;
							case 'Abandon':
							case 'Déclasse':
							case 'Déclassé':
							case 'Disqualifie':
							case 'Disqualifié':
							case 'Elimination':
							case 'Elimine':
							case 'Eliminé':
							case 'Forfait':
								tour.position = 'Elimine';
								pos_title = 'X';
								bulle = '';
								break;
						}
					}
					winner_tours.push(
						$template.html()
						.replace(/:pos_title/g, pos_title)
						.replace(/:pos/g, tour.position.replace(' ', '-'))
						.replace(/:hpos/g, parseInt(tour.position, 10) ? Math.round(tour.position / TDF.Data.traces[year].nb_concurrents * 100) + 'px' : '40px')
						.replace(':wins', ("<div class='" + winner.id + "'>Victoire d'étape</div>").repeat(tour.nb_wins))
						.replace(':bulle', bulle)
						.replace(/:year/g, year));
				} else {
					winner_tours.push('<li class="' + year + '"><div class="not">X</div><div class="year">' + year + '</div></li>');
				}
			}

			suppl_years = Math.ceil((visible_tours - nb_tours) / 2);
			for (i = 0; i < suppl_years; i++) {
				winner_tours.push('<li class="empty"><div class="year">' + (years.max() + i + 1) + '</div></li>');
			}

			$winner.find('.tours').html(winner_tours.join(' '));
			$winner.slideDown('slow', function() {
				$inner.find(".tours li[title]").tooltip({
					position: {
						my: "left+5 center",
						at: "right center"
					}
				});
			});
		}
	};

	my.filter = function() {
		console.log("Winners.filter");

		jQuery(".winners_list .winner").stop().data('show', true);

		if (my.args.filters.nationalite) {
			$main.find('.winners_list .winner').each(function() {
				jQuery(this).data('show', jQuery(this).data('country') === my.args.filters.nationalite);
			});
		}

		if (my.args.filters.age_victoire) {
			var win_ages, filter_age = my.args.filters.age_victoire.split(/,/);
			$main.find('.winners_list .winner:data(show)').each(function() {
				win_ages = jQuery(this).data('win-ages').toString().split(/,/);
				jQuery(this).data('show', (win_ages.min() <= filter_age[1] && win_ages.max() >= filter_age[0]));
			});
		}

		if (my.args.filters.nb_victoires) {
			var nb_wins, filter_nb_wins = my.args.filters.nb_victoires.split(/,/);
			$main.find('.winners_list .winner:data(show)').each(function() {
				nb_wins = jQuery(this).data('nb-wins').toString().split(/,/);
				jQuery(this).data('show', (nb_wins.min() <= filter_nb_wins[1] && nb_wins.max() >= filter_nb_wins[0]));
			});
		}

		if (my.args.filters.recherche) {
			$main.find('.winners_list .winner:data(show)').each(function() {
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
			jQuery('#header').scrollTo(1000);
		});
		if (jQuery(".winners_list .winner:data(show)").length === 0) {
			jQuery(".winners_list .no-results").fadeIn();
		} else {
			jQuery(".winners_list .no-results").hide();
		}
		if (jQuery(window).scrollTop() !== 0) {
			jQuery('#main').scrollTo(500);
		}
	};

	return my;
}());

TDF.Fight = (function() {

	var my = {};

	my.name = 'fight';
	my.base_url = '/duels-de-legendes/';

	my.share_text = "Si Bernard Hinault défiait Lance Armstrong, qui gagnerait ? La réponse ici ! #cyclisme #appli #data #TDF via @RFnvx";

	my.steps = null;

	my.init = function(args) {
		console.log("Fight.init");
		my.args = args;
		$LAB
			.script('/js/lib/jquery-ui.js')
			.script('/js/lib/jquery-ui-touchpunch.js')
			.script('/js/lib/jquery-tabify.js')
			.wait(function() {
			TDF.Data.load('fighters', 'fighters', function() {
				TDF.Data.load('winners', 'winners', function() {
					my.start();
				});
			});
		});
	};

	my.start = function() {
		console.log("Fight.start");

		$main.on('click', '.fight-home .start', function() {
			my.fight('start');
		});

		$main.on('click', '.next', function(event) {
			if (jQuery(':animated').length) {
				event.preventDefault();
				return false;
			}
		});

		$main.on('click', '.fight-home .random', function(event) {
			console.log("click random");
			event.preventDefault();
			var fighter_id;
			do {
				fighter_id = my.sorted_fighters[Math.floor(Math.random() * my.sorted_fighters.length)].id;
			} while (fighter_id === my.args.fighter_one && fighter_id === my.args.fighter_two);
			// $main.find('.selector .legends .winner a').eq(Math.round(Math.random() * $main.find('.selector .legends .winner a').length)).click();
			var url;
			if (jQuery(this).parent('.fighter').data('fighter') === 'fighter_one') {
				url = fighter_id + '/' + (my.args.fighter_two ? my.args.fighter_two + '/' : '');
			}
			if (jQuery(this).parent('.fighter').data('fighter') === 'fighter_two') {
				url = (my.args.fighter_one ? my.args.fighter_one + '/' : '') + fighter_id + '/';
			}
			Path.history.pushState({}, "", my.base_url + url);
			return false;
		});


		var tmp = [];
		for (var i in TDF.Data.fighters) {
			tmp.push(TDF.Data.fighters[i]);
		}
		my.sorted_fighters = tmp.sort(function(a, b) {
			if (a.nb_wins === 0 && b.nb_wins > 0) {
				return -1;
			}
			if (a.nb_wins > 0 && b.nb_wins === 0) {
				return 1;
			}
			if (TDF.Data.winners[a.id] === undefined) {
				return -1;
			}
			if (TDF.Data.winners[b.id] === undefined) {
				return -1;
			}
			if (TDF.Data.winners[a.id].wins.max() < TDF.Data.winners[b.id].wins.max()) {
				return 1;
			}
			if (TDF.Data.winners[a.id].wins.max() > TDF.Data.winners[b.id].wins.max()) {
				return -1;
			}
			return 0;
		});

		my.render();

	};

	my.render = function(args) {
		console.log("Fight.render");
		if (args !== undefined) {
			my.args = args;
		}

		var $fighter, fighter, fighter_data;

		if (my.args.step !== undefined) {
			TDF.setShares(my.base_url, my.share_text);
			my.fight();
			return;
		}

		if (TDF.loadTemplate(this, '-home')) {}

		if (my.args.fighter_one && my.args.fighter_one !== 'selector') {
			if (TDF.Data.fighters[my.args.fighter_one]) {
				fighter = TDF.Data.fighters[my.args.fighter_one];
				fighter_data = TDF.Data.winners[my.args.fighter_one];

				$fighter = $main.find('.fighter_one');
				$fighter.data('id', my.args.fighter_one);
				$fighter.find('.name').html('<em>' + fighter.first_name + '</em> <span> ' + fighter.last_name + '</span>');
				$inner.find('#fighter_one_pic img').attr('src', '/img/vainqueurs/portraits/' + my.args.fighter_one + '_big.png');
				$fighter.find('.flag img').attr('src', '/img/drapeaux/' + (fighter.country ? fighter.country.replace(' ', '-').replace('É', 'e').toLowerCase() : '') + '_big.png');
				$fighter.find('.flag').css('display', 'block');
				$fighter.find('.bio').css('display', 'block').html((fighter_data ? 'participe entre ' + fighter_data.period.join(' et ') : '') + (fighter.nb_wins ? ' - ' + fighter.nb_wins + ' victoire' + (fighter.nb_wins > 1 ? 's' : '') : ''));
				$fighter.find('.random').hide();
				$fighter.find('.choose-fighter').text('Changer de coureur');
			}
		} else {
			$fighter = $main.find('.fighter_one');
			$fighter.data('id', '');
			$fighter.find('.name').html('<strong>Coureur n°1</strong>');
			$inner.find('#fighter_one_pic img').attr('src', '/img/duels/fighter-default.png');
			$fighter.find('.flag img').attr('src', '');
			$fighter.find('.flag').css('display', 'none');
			$fighter.find('.bio').css('display', 'none').html('');
			$fighter.find('.random').show();
		}

		if (my.args.fighter_two && my.args.fighter_two !== 'selector') {
			if (TDF.Data.fighters[my.args.fighter_two]) {
				fighter = TDF.Data.fighters[my.args.fighter_two];
				fighter_data = TDF.Data.winners[my.args.fighter_two];

				$fighter = $main.find('.fighter_two');
				$fighter.data('id', my.args.fighter_two);
				$fighter.find('.name').html('<em>' + fighter.first_name + '</em> <span> ' + fighter.last_name + '</span>');
				$inner.find('#fighter_two_pic img').attr('src', '/img/vainqueurs/portraits/' + my.args.fighter_two + '_big.png');
				$fighter.find('.flag img').attr('src', '/img/drapeaux/' + (fighter.country ? fighter.country.replace(' ', '-').replace('É', 'e').toLowerCase() : '') + '_big.png');
				$fighter.find('.flag').css('display', 'block');
				$fighter.find('.bio').css('display', 'block').html(TDF.Data.winners[my.args.fighter_one] ? fighter.nb_wins + ' victoire' + (fighter.nb_wins > 1 ? 's' : '') : '');
				$fighter.find('.bio').html((fighter_data ? 'participe entre ' + fighter_data.period.join(' et ') : '') + (fighter.nb_wins ? ' - ' + fighter.nb_wins + ' victoire' + (fighter.nb_wins > 1 ? 's' : '') : ''));
				$fighter.find('.choose-fighter').text('Changer de coureur');
				$fighter.find('.random').hide();
			}
		} else {
			$fighter = $main.find('.fighter_two');
			$fighter.data('id', '');
			$fighter.find('.name').html('<strong>Coureur n°2</strong>');
			$inner.find('#fighter_two_pic img').attr('src', '/img/duels/fighter-default.png');
			$fighter.find('.flag img').attr('src', '');
			$fighter.find('.flag').css('display', 'none');
			$fighter.find('.bio').css('display', 'none').html('');
			if (my.args.fighter_one && my.args.fighter_one !== 'selector') {
				$fighter.find('.choose-fighter').show();
				$fighter.find('.choose-fighter-notice').hide();
				$fighter.find('.random').show();
			} else {
				$fighter.find('.choose-fighter').hide();
				$fighter.find('.choose-fighter-notice').show();
				$fighter.find('.random').hide();
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

		jQuery('.selector-inner').find('.close').attr('href', my.getQueryString()).on('click', function() {
			jQuery('.selector-inner').hide();
		});

		$main.find('.fighter_one a').attr('href', my.base_url + 'selector/' + (my.args.fighter_two ? my.args.fighter_two + '/' : ''));
		$main.find('.fighter_two a').attr('href', my.base_url + (my.args.fighter_one ? my.args.fighter_one + '/' : '') + 'selector/');

		if (my.args.fighter_one && my.args.fighter_two) {
			$main.find('.start').attr('href', my.getQueryString() + 'start/');
			$main.find('.start').css({
				visibility: 'visible'
			});
		} else {
			$main.find('.start').css({
				visibility: 'hidden'
			});
		}

		TDF.setShares(my.base_url, my.share_text);
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
		$main.find('.selector').hide();
		$main.find('.selector-inner').html('');
	};

	my.showSelector = function(side) {

		$main.find('.selector-inner').html(jQuery('.templates #template-fight-selector').html());
		$main.find('.selector').show();

		var content, winners_list = [],
			legends_list = [];
		var $template = jQuery('#template-winner');

		var url_fighter_one, url_fighter_two;

		if (!my.args.fighter_one || my.args.fighter_one === 'selector') {
			url_fighter_one = '';
		} else {
			url_fighter_one = my.args.fighter_one + '/';
		}
		if (!my.args.fighter_two || my.args.fighter_two === 'selector') {
			url_fighter_two = '';
		} else {
			url_fighter_two = my.args.fighter_two + '/';
		}

		var current_selector = '.' + (side === 'fighter_one' ? 'fighter_two' : 'fighter_one');
		var current_id = $main.find(current_selector).data('id');
		jQuery(my.sorted_fighters).each(function(i, fighter) {
			if (fighter.id !== current_id) {
				// fighter = TDF.Data.fighters[fighter_id];
				content = $template.html()
					.replace(':winner_url', my.base_url + url_fighter_one + fighter.id + '/' + url_fighter_two)
					.replace(/:winner_id/g, fighter.id)
					.replace(':portrait_url', '/img/vainqueurs/portraits/' + fighter.id + '_small.png')
					.replace(':name', fighter.first_name + ' ' + fighter.last_name)
					.replace(':safename', '')
					.replace(':wins', TDF.Data.winners[fighter.id] ? TDF.Data.winners[fighter.id].wins.map(liify).join('') : '')
					.replace(':flag_url', '/img/drapeaux/' + (fighter.country ? fighter.country.replace(' ', '-').replace('É', 'e').toLowerCase() : '') + '_small.png');

				if (fighter.winner) {
					winners_list.push(content);
				}
				if (fighter.legend) {
					legends_list.push(content);
				}
			}

		});

		$main.find('.selector .legends ul').html(legends_list.join(' '));
		$main.find('.selector .winners ul').html(winners_list.join(' '));

		$inner.find('.tabs').tabify();
	};

	my.fight = function() {
		console.log("Fight.fight");

		var fighter_one = TDF.Data.fighters[my.args.fighter_one];
		var fighter_two = TDF.Data.fighters[my.args.fighter_two];

		// calcul des positions relatives

		my.steps = [];
		my.steps[0] = [0, 0];

		for (var i = 1; i < 6; i++) {
			my.steps[i] = [
				my.steps[i - 1][0] + (fighter_one.steps[i] - fighter_two.steps[i]),
				my.steps[i - 1][1] + (fighter_two.steps[i] - fighter_one.steps[i])
			];
		}
		my.steps[6] = my.steps[5];
		// my.steps[7] = [fighter_one.is_doped ? -1000 : fighter_one.score, fighter_two.is_doped ? -1000 : fighter_two.score];
		my.steps[7] = [fighter_one.is_doped ? -1000 : my.steps[6][0], fighter_two.is_doped ? -1000 : my.steps[6][1]];

		if (my.steps[7][0] < my.steps[7][1]) {
			Path.history.pushState({}, "", my.base_url + my.args.fighter_two + '/' + my.args.fighter_one + '/start/');
			return;
		}

		if (TDF.loadTemplate(this, '-start')) {

		}

		$inner.attr('class', 'fight-start');

		$inner.find('.next').text("Épreuve Suivante");

		var $fighter_one = $main.find('.fighters .fighter_one');
		var $fighter_two = $main.find('.fighters .fighter_two');

		$fighter_one.attr('class', 'fighter fighter_one');
		$fighter_two.attr('class', 'fighter fighter_two');

		$fighter_one.find('.name').html(fighter_one.first_name + ' ' + fighter_one.last_name);
		$fighter_two.find('.name').html(fighter_two.first_name + ' ' + fighter_two.last_name);

		$fighter_one.addClass(fighter_one.epoque);
		$fighter_two.addClass(fighter_two.epoque);

		// définition des attributs : a été en jaune, a gagné le tour
		if (fighter_one.steps[2] > 0) {
			$fighter_one.addClass('yellow');
		}
		if (fighter_one.steps[5] > 0) {
			$fighter_one.addClass('has_won');
		}
		if (fighter_two.steps[2] > 0) {
			$fighter_two.addClass('yellow');
		}
		if (fighter_two.steps[5] > 0) {
			$fighter_two.addClass('has_won');
		}

		var ratio = 3.12;
		var max_space = 500;
		var fighter_width = 84;

		var step_title, step_class, fighter_one_result, fighter_two_result, diff = [];

		if (!isNaN(parseInt(my.args.step, 10))) {
			my.args.step = parseInt(my.args.step, 10);
		}
		$inner.attr('class', 'fight-start step-' + my.args.step);

		var step_duration = 2000;

		switch (my.args.step) {
			default:
			case 0:
			case 'start':
				my.args.step = 0;
				fighter_one_result = '';
				fighter_two_result = '';

				$fighter_one.find('.result').html(fighter_one_result);
				$fighter_two.find('.result').html(fighter_two_result);

				$fighter_one.find('.fighter-infos').slideDown();
				$fighter_two.find('.fighter-infos').slideDown();

				// $inner.find('.fight-container > .title').slideDown();


				// ANIM OUT NEXT
				$inner.find('.background .beef-car').stop().animate({
					left: '+=1000'
				}, step_duration * 0.25, 'linear');
				$inner.find('.foreground .lady-left').stop().fadeOut(step_duration * 0.25);
				$inner.find('.foreground .lady-right').stop().fadeOut(step_duration * 0.25);
				$inner.find('.forescape .public-left-1, .forescape .public-right-1').stop().animate({
					left: '+=1000'
				}, step_duration * 0.25, 'linear');

				// ANIM IN
				$fighter_one.stop().animate({
					'margin-left': (((max_space / 2) - fighter_width) - 80) + 'px'
				}, 1500, 'easeOutCubic');
				$fighter_two.stop().animate({
					'margin-left': (((max_space / 2) - fighter_width) - 80) + 'px'
				}, 1500, 'easeOutCubic');

				$inner.find('.landscape').css({
					left: '0px'
				});

				$inner.find('.background .fanion').css({
					display: 'none',
					left: '20px'
				}).stop().delay(step_duration * 0.25).fadeIn(step_duration * 0.75);
				$inner.find('.background .archeback-0').css({
					left: '616px'
				});

				$inner.find('.foreground .archefore-0').css({
					left: '617px'
				});
				$inner.find('.forescape .public-left-0').css({
					display: 'none',
					left: '20px'
				}).stop().delay(step_duration * 0.25).fadeIn(step_duration * 0.75);
				$inner.find('.forescape .public-right-0').css({
					display: 'none',
					left: '690px'
				}).stop().delay(step_duration * 0.25).fadeIn(step_duration * 0.75);

				$inner.find('.next').text("Top Départ").attr('href', my.getQueryString() + (my.args.step + 1) + '/');
				$inner.find('.prev').hide();
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
						step_title = "<strong>étapes du Tour remportées</strong>";
						fighter_one_result = fighter_one.nb_leg_wins + " étape" + (fighter_one.nb_leg_wins > 1 ? 's' : '');
						fighter_two_result = fighter_two.nb_leg_wins + " étape" + (fighter_two.nb_leg_wins > 1 ? 's' : '');

						// ANIM OUT PREV
						$inner.find('.background .fanion').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.background .archeback-0').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.foreground .archefore-0').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .public-left-0, .forescape .public-right-0').stop().animate({
							left: '-1000px'
						}, step_duration * 0.25, 'linear');

						// ANIM OUT NEXT
						$inner.find('.sky .clouds-2').stop().animate({
							left: '+=1000'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .yellow-car').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .green').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');

						// ANIM IN
						$inner.find('.background .beef-car').stop().delay(step_duration * 0.25).animate({
							left: '714px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .lady-left').stop().show().delay(step_duration * 0.25).animate({
							left: '310px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .lady-right').stop().show().delay(step_duration * 0.5).animate({
							left: '646px'
						}, step_duration * 0.5, 'linear');

						$inner.find('.forescape .public-left-1').stop().delay(step_duration * 0.25).animate({
							left: '20px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.forescape .public-right-1').stop().delay(step_duration * 0.25).animate({
							left: '690px'
						}, step_duration * 0.75, 'linear');

						break;
					case 2:
						step_class = "pct_leading";
						step_title = "<strong>Temps passé<br>en tête du général</strong>";
						fighter_one_result = fighter_one.pct_leading + "% de son meilleur tour";
						fighter_two_result = fighter_two.pct_leading + "% de son meilleur tour";

						// ANIM OUT PREV
						$inner.find('.background .beef-car').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.foreground .lady-left').stop().animate({
							left: '-=1000'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .lady-right').stop().animate({
							left: '-=1000'
						}, step_duration * 0.75, 'linear');
						$inner.find('.forescape .public-left-1, .forescape .public-right-1').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						// ANIM OUT NEXT
						$inner.find('.sky .clouds-3').stop().animate({
							left: '+=1000'
						}, step_duration * 0.75, 'linear');
						$inner.find('.background .radar').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .panneaux').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.foreground .green-3').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						// ANIM IN
						$inner.find('.sky .clouds-2').stop().animate({
							left: '270px'
						}, step_duration * 1.0, 'linear');
						$inner.find('.foreground .yellow-car').stop().delay(step_duration * 0.25).animate({
							left: '40px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.forescape .green').stop().delay(step_duration * 0.25).animate({
							left: '650px'
						}, step_duration * 0.75, 'linear');
						setTimeout(function() {
							$inner.find('.fighters .fighter_one, .fighters .fighter_two').addClass('yellow_active');
						}, step_duration * 0.65);

						break;
					case 3:
						step_class = "average_speed";
						step_title = "<strong>Meilleur vitesse moyenne</strong>";
						fighter_one_result = fighter_one.average_speed.toString().replace('.', ',') + " km/h";
						fighter_two_result = fighter_two.average_speed.toString().replace('.', ',') + " km/h";

						// ANIM OUT PREV
						$inner.find('.sky .clouds-2').stop().animate({
							left: '-=1000'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .yellow-car').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .green').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');

						// ANIM OUT NEXT
						$inner.find('.middleground .followers').stop().animate({
							left: '+=1000'
						}, step_duration * 0.5, 'linear');
						$inner.find('.forescape .trees-4').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						// ANIM IN
						$inner.find('.sky .clouds-3').stop().animate({
							left: '300px'
						}, step_duration * 1.0, 'linear');
						$inner.find('.background .radar').stop().delay(step_duration * 0.25).animate({
							left: '690px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .green-3').stop().delay(step_duration * 0.25).animate({
							left: '200px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.forescape .panneaux').stop().delay(step_duration * 0.25).animate({
							left: '0px'
						}, step_duration * 0.75, 'linear');

						break;
					case 4:
						step_class = "ahead_of_second";
						step_title = "<strong>Meilleure avance<br /> sur le deuxième</strong>";
						fighter_one_result = fighter_one.ahead_of_2nd.format_time() ? fighter_one.ahead_of_2nd.format_time() : "0 min. (jamais vainqueur)";
						fighter_two_result = fighter_two.ahead_of_2nd.format_time() ? fighter_two.ahead_of_2nd.format_time() : "0 min. (jamais vainqueur)";

						// ANIM OUT PREV
						$inner.find('.sky .clouds-3').stop().animate({
							left: '-=1000'
						}, step_duration * 0.75, 'linear');
						$inner.find('.background .radar').stop().animate({
							left: '-=1000'
						}, step_duration * 0.5, 'linear');
						$inner.find('.forescape .panneaux').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');

						// ANIM OUT NEXT
						$inner.find('.background .archeback-5').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.foreground .archefore-5').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .trees-5').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');

						// ANIM IN
						$inner.find('.middleground .followers').stop().delay(step_duration * 0.25).animate({
							left: '0px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .green-3').stop().delay(step_duration * 0).animate({
							left: '-800px'
						}, step_duration * 1.0, 'linear');
						$inner.find('.forescape .trees-4').stop().delay(step_duration * 0).animate({
							left: '200px'
						}, step_duration * 1.0, 'linear');

						break;
					case 5:
						step_class = "nb_wins";
						step_title = "<strong>Nombre <br>de tours gagnés</strong>";
						fighter_one_result = fighter_one.nb_wins + (fighter_one.nb_wins > 1 ? ' victoires finales' : ' victoire finale');
						fighter_two_result = fighter_two.nb_wins + (fighter_two.nb_wins > 1 ? ' victoires finales' : ' victoire finale');

						// ANIM OUT PREV
						$inner.find('.middleground .followers').stop().animate({
							left: '-=1000'
						}, step_duration * 0.5, 'linear');
						$inner.find('.foreground .green-3').stop().animate({
							left: '-=1000'
						}, step_duration * 0.5, 'linear');
						$inner.find('.forescape .trees-4').stop().animate({
							left: '-=1000'
						}, step_duration * 0.5, 'linear');
						// ANIM OUT NEXT
						$inner.find('.background .doping-car').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.middleground .doping-doctor').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .cops-right').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');

						// ANIM IN
						$inner.find('.background .archeback-5').stop().delay(step_duration * 0.25).animate({
							left: '16px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.foreground .archefore-5').stop().delay(step_duration * 0.25).animate({
							left: '17px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.forescape .trees-5').stop().delay(step_duration * 0).animate({
							left: '0px'
						}, step_duration * 1.0, 'linear');
						setTimeout(function() {
							$inner.find('.fighters .fighter_one, .fighters .fighter_two').addClass('has_won_active');
						}, step_duration * 0.45);

						break;
					case 6:
						step_class = "doping";
						step_title = "<strong>contrôle <br>antidopage</strong>";
						fighter_one_result = fighter_one.is_doped ? "<strong>Éliminé du Tour pour dopage</strong>" : "Jamais pris pour dopage<br /> sur le Tour";
						fighter_two_result = fighter_two.is_doped ? "<strong>Éliminé du Tour pour dopage</strong>" : "Jamais pris pour dopage<br /> sur le Tour";
						$inner.find('.next').text("Résultat");

						// ANIM OUT PREV
						$inner.find('.background .archeback-5').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.foreground .archefore-5').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .trees-5').stop().animate({
							left: '-=1000'
						}, step_duration * 0.5, 'linear');
						// ANIM OUT NEXT
						$inner.find('.forescape .public-left-7, .forescape .public-right-7').stop().animate({
							left: '+=1000'
						}, step_duration * 0.25, 'linear');
						// ANIM IN
						$inner.find('.background .doping-car').stop().delay(step_duration * 0.25).animate({
							left: '480px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.middleground .doping-doctor').stop().delay(step_duration * 0.25).animate({
							left: '670px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.forescape .cops-right').stop().delay(step_duration * 0.25).animate({
							left: '730px'
						}, step_duration * 0.75, 'linear');

						break;
					case 7:
					case 'results':
						step_title = "<strong>Bilan de la course</strong>" + '<br />' + '<a href="' + (my.getQueryString() + 'results/') + '" class="show-results">Voir les résultats</a>';
						step_class = 'finish';
						fighter_one_result = " ";
						fighter_two_result = " ";
						if (my.args.step === 'results') {
							my.showResults();
							my.args.step = 7;
						}

						// ANIM OUT PREV
						$inner.find('.background .doping-car').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.middleground .doping-doctor').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						$inner.find('.forescape .cops-right').stop().animate({
							left: '-=1000'
						}, step_duration * 0.25, 'linear');
						// ANIM IN
						$inner.find('.forescape .public-left-7').stop().delay(step_duration * 0.25).animate({
							left: '20px'
						}, step_duration * 0.75, 'linear');
						$inner.find('.forescape .public-right-7').stop().delay(step_duration * 0.25).animate({
							left: '690px'
						}, step_duration * 0.75, 'linear');

						break;
				}

				diff[0] = ((my.steps[my.args.step][0] / ratio / 2 * max_space) + (max_space / 2) - fighter_width);
				diff[1] = ((my.steps[my.args.step][1] / ratio / 2 * max_space) + (max_space / 2) - fighter_width);

				$fighter_one.stop().animate({
					'margin-left': diff[0] + 'px'
				}, step_duration, 'linear');
				$fighter_two.stop().animate({
					'margin-left': diff[1] + 'px'
				}, step_duration, 'linear');

				$inner.find('.landscape').stop().animate({
					'left': '-' + (my.args.step * 770) + 'px'
				}, step_duration, 'linear');

				$inner.find('.fight-container > .title').slideUp();
				setTimeout(function() {
					$inner.find('.fight-container > .title').slideDown();
				}, step_duration);

				$fighter_one.find('.fighter-infos').slideUp();
				$fighter_one.find('.result').html(fighter_one_result);
				setTimeout(function() {
					$fighter_one.find('.fighter-infos').slideDown();
				}, step_duration);

				$fighter_two.find('.fighter-infos').slideUp();
				$fighter_two.find('.result').html(fighter_two_result);
				setTimeout(function() {
					$fighter_two.find('.fighter-infos').slideDown();
				}, step_duration);

				/*
				$fighter_two.find('.result').html(fighter_two_result);
				$fighter_two.find('.fighter-infos').show();
				*/

				if (my.args.step === 7 || my.args.step === 'results') {
					if (fighter_one.score > fighter_two.score) {
						$fighter_one.addClass('winner');
					}
					if (fighter_one.score < fighter_two.score) {
						$fighter_two.addClass('winner');
						$fighter_two.find('.name').remove();
					}
					if (fighter_one.score === fighter_two.score) {
						$fighter_one.find('.name').html('');
						$fighter_one.find('.result').html('<div class="result-heading">Ex-aequo</div><div class="name">' + fighter_one.first_name + ' ' + fighter_one.last_name + '<br />' + fighter_two.first_name + ' ' + fighter_two.last_name + '</div>' +
							'<div class="share-result"><span>Partager ce résultat</span> ' + my.shareBlock() + '</div>');
						$fighter_two.find('.fighter-infos').hide();
					}

					if (fighter_one.is_doped && fighter_two.is_doped) {
						$main.find('.fighters').addClass('doped-fighters').html('<div class="fighter-infos"><div class="results"><div class="result-heading">Aucun vainqueur</div><div class="name">pour cause de dopage</div></div>' +
							'<div class="share-result"><span>Partager ce résultat</span>' + my.shareBlock() + '</div></div>');
					}
					if (jQuery('.fighter.winner').length === 1) {
						$fighter_one.find('.fighter-infos').hide().find('.result').html(my.winner_result(fighter_one));
						setTimeout(function() {
							$fighter_one.find('.fighter-infos').fadeIn();
						}, 1000);
						$fighter_two.find('.fighter-infos').hide();
					}
				}

				$inner.find('.title div').html(step_title).attr('class', step_class);

				if (my.args.step < 7) {
					$inner.find('.prev').attr('href', my.getQueryString() + (my.args.step - 1) + '/').show();
					$inner.find('.next').attr('href', my.getQueryString() + (my.args.step + 1) + '/');
				} else {
					$inner.find('.next').hide();
					setTimeout(function() {
						$inner.find('.next').attr('href', my.base_url).text("Nouvelle Course").fadeIn();
						$inner.find('.prev').hide();
					}, 2000);
				}

				break;
		}
	};

	my.winner_result = function(fighter) {
		var wins = [];
		if (TDF.Data.winners[fighter.id]) {
			wins = TDF.Data.winners[fighter.id].wins;
		}
		var res = '<div class="result-heading">vainqueur</div>';
		res = res + '<div class="name">' + fighter.first_name + ' ' + fighter.last_name + '</div>';
		switch (wins.length) {
			case 0:
				break;
			case 1:
				res = res + '<a class="traces" href="/traces/' + wins.join(',') + '/">Le tracé de sa victoire</a>';
				break;
			default:
				res = res + '<a class="traces" href="/traces/' + wins.join(',') + '/">Le tracé de ses victoires</a>';
				break;
		}
		res = res + '<div class="share-result"><span>Partager sa victoire</span> ' + my.shareBlock() + '</div>';
		return res;
	};

	my.shareBlock = function() {
		var fighter_one = TDF.Data.fighters[my.args.fighter_one];
		var fighter_two = TDF.Data.fighters[my.args.fighter_two];
		var shareUrl = document.location.href.replace(/\/[^\/]+\/$/, '/');
		var shareText = 'Historique ! ' + fighter_one.last_name + ' a battu ' + fighter_two.last_name + ' dans un duel de légendes du Tour de France - via @RFnvx';
		var res = '<a href="http://www.facebook.com/sharer.php?s=100&p[url]=' + encodeURIComponent(shareUrl) + '&p[title]=' + encodeURIComponent(shareText) + '" class="external facebook">Facebook</a>';
		res += '<a href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(shareText) + '" class="external twitter">Twitter</a>';
		res += '<a href="https://plus.google.com/share?url=' + encodeURIComponent(shareUrl) + '" class="external gplus">Google+</a>';
		return res;
	};


	my.showResults = function() {

		var $results = $main.find('.results').html(jQuery('.templates #template-fight-results').html());

		my.fillResults($results.find('.fighter_one'), TDF.Data.fighters[my.args.fighter_one]);
		my.fillResults($results.find('.fighter_two'), TDF.Data.fighters[my.args.fighter_two]);

		jQuery(['nb_leg_wins', 'pct_leading', 'average_speed', 'ahead_of_2nd', 'nb_wins']).each(function(i, step) {
			var res = $results.find('.result_fighter .' + step);
			var a = parseFloat(jQuery(res[0]).data('score'));
			var b = parseFloat(jQuery(res[1]).data('score'));
			if (a > b) {
				$results.find('.fighter_one .' + step).addClass('active');
			} else {
				if (a < b) {
					$results.find('.fighter_two .' + step).addClass('active');
				}
			}
		});
		/*
		if (!TDF.Data.fighters[my.args.fighter_one].is_doped) {
			if (my.steps[7][0] > my.steps[7][1] || TDF.Data.fighters[my.args.fighter_two].is_doped) {
				$results.find('.fighter_one .winner').addClass('active');
			}
		}
		*/
		if (jQuery('.result-heading').text() === 'vainqueur') {
			$results.find('.fighter_one .winner').addClass('active');
		}

		$results
			.show()
			.find('.close').attr('href', my.getQueryString() + '7/')
			.on('click', function() {
			jQuery('.results').html('').hide();
		});


	};

	my.fillResults = function(fighter, data) {
		fighter.find('.name').html(data.first_name + '<strong>' + data.last_name + '</strong>');
		fighter.find('.flag img').attr('src', '/img/drapeaux/' + data.country.replace(' ', '-').replace('É', 'e').toLowerCase() + '_small.png');
		fighter.find('.portrait img').attr('src', '/img/vainqueurs/portraits/' + data.id + '_small.png');
		fighter.find('.nb_leg_wins').html(data.nb_leg_wins).data('score', data.steps[1]);
		fighter.find('.pct_leading').html(data.pct_leading + "%<br><small> en " + data.pct_leading_year + '<small>').data('score', data.steps[2]);
		fighter.find('.average_speed').html(data.average_speed + " km/h").data('score', data.steps[3]);
		fighter.find('.ahead_of_2nd').html(data.ahead_of_2nd + "<br><small> en " + data.ahead_of_2nd_year + '<small>').data('score', data.steps[4]);
		fighter.find('.nb_wins').html(data.nb_wins).data('score', data.steps[5]);
		fighter.find('.doping').html(data.is_doped ? '<small>Éliminé du Tour pour dopage</small>' : '<small>Jamais pris pour dopage sur le Tour</small>').addClass(data.is_doped ? 'active' : '');
	};

	return my;
}());

TDF.StreetView = (function() {

	var my = {};

	my.name = 'streetview';
	my.base_url = '/lieux-mythiques/';

	my.share_text = "Parcourez les routes mythiques du Tour de France #streetview #appli #data #TDF via @RFnvx";

	my.gmapApi = null;

	my.init = function(args) {
		console.log("streetView.init");
		my.args = args;
		$LAB
			.script('/js/lib/jquery.gmapApi.js')
			.script('/js/lib/gmap.infobox.js')
			.script('/js/lib/map-marker-label.js')
			.script('/js/lib/map-style.js')
			.script('/js/lib/GSVPano.js')
			.script('/js/lib/three.js')
			.script('/js/lib/Hyperlapse.js')
			.wait(function() {
			TDF.Data.load('places', 'places', function() {
				my.start();
			});
		});
	};

	my.start = function() {
		console.log("streetView.start");

		var tmp = [];
		for (var i in TDF.Data.places) {
			tmp.push(TDF.Data.places[i]);
		}
		my.sorted_places = tmp.sort(function(a, b) {
			return a.name.localeCompare(b.name);
		});

		$main.on('click', '.streetview .streetview-list a', function(event) {
			event.preventDefault();
			// my.gmapApi.stopStreetView();
			// my.gmapApi.showStreetView(jQuery(this).data('id'));
			my.gmapApi.openInfoWindowPlace(jQuery(this).data('id'));
			return false;
		});

		my.render();
	};

	my.initializeGmap = function() {
		console.log("streetView.initializeGmap");

		if (my.gmapApi) {
			my.gmapApi.stopStreetView();
		}


		//Config Gmap
		var mapId = 'gmap-streetview';
		var mapTypeId = google.maps.MapTypeId.ROADMAP;
		var startlat = 45.969968;
		var startlng = 2.680664;
		//		var startlat = 47.754098;
		//		var startlng = 3.669434;
		var zoom = 6;

		var map = $inner.find("#" + mapId);


		var mapOptions = {
			minimap: "minimap",
			hyperlapseId: "gmap-hyperlapse",
			hyperlapseLoading: my.hyperlapseLoading,
			hyperlapseOnFrame: my.hyperlapseOnFrame,
			mapTypeId: mapTypeId,
			center: new google.maps.LatLng(startlat, startlng),
			mapTypeControl: false,
			panControl: false,
			streetViewControl: false,
			zoomMin: 8,
			zoomMax: 6,
			zoom: zoom,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL
			},
			markersIcons: [{
					url: "/img/lieux/pin-photo.png",
					width: 23,
					height: 32,
					anchorX: 11,
					anchorY: 32
				}, {
					url: "/img/lieux/lieux_pin_hyperlapse.png",
					width: 23,
					height: 32,
					anchorX: 11,
					anchorY: 32
				}, {
					url: "/img/lieux/lieux_hyperlapse_pinA.png",
					width: 51,
					height: 51,
					anchorX: 51 / 2,
					anchorY: 51 / 2
				}, {
					url: "/img/lieux/lieux_hyperlapse_pinB.png",
					width: 51,
					height: 51,
					anchorX: 51 / 2,
					anchorY: 51 / 2
				}, {
					url: "/img/lieux/lieux_hyperlapse_pointer.png",
					width: 58,
					height: 57,
					anchorX: 58 / 2,
					anchorY: 57 / 2
				}, {
					url: "/img/traces/multi-pointeur-transparent.png",
					width: 1,
					height: 1,
					anchorX: 1,
					anchorY: 1
				}, {
					url: "/img/lieux/pointeur-hyperlapse-minimap.png",
					width: 29,
					height: 29,
					anchorX: 29 / 2,
					anchorY: 29 / 2
				}
			],
			styles: mapStyleTrace,
			stylesMinimap: mapStyleSearch
		};

		my.gmapApi = map.gmapApi(mapOptions);

		my.gmapApi.addStreetViewPoint(TDF.Data.places, $inner, my.onCloseStreetView);

	};

	my.onCloseStreetView = function() {
		Path.history.pushState({}, "", my.base_url);
	};


	my.hyperlapseLoading = function(current, total) {
		var loader = jQuery('#hyperlapseTimeline .loader');
		var textLoader = jQuery('#hyperlapseTextLoader');
		var aide = jQuery("#hyperlapseTimeline .aide");

		textLoader.show();
		aide.hide();

		var widthMaxLoader = 636;

		var currentWidth = (widthMaxLoader * current) / total;

		loader.width(currentWidth);

		if (current === total) {
			textLoader.hide();
			aide.show();
		}
	};

	my.hyperlapseOnFrame = function(position, total) {
		var cursor = jQuery('#hyperlapseTimeline .playerCursor');

		var positionMax = 636;

		var currentPosition = ((positionMax * position) / total) + 22;

		cursor.stop().animate({
			left: currentPosition
		}, 200);

	};

	my.render = function(args) {
		console.log("streetView.render");
		if (args !== undefined) {
			my.args = args;
		}

		if (TDF.loadTemplate(my)) {
			var places_list = [],
				$template, content = '';
			$template = jQuery('#template-streetview-place');
			jQuery(my.sorted_places).each(function(idx, place) {
				content = $template.html()
					.replace(':place_id', place.id)
					.replace(':place_url', my.base_url + place.id + '/')
					.replace(':place_type', place.type === 'Hyperlapse' ? 'hyperlapse' : 'streetview')
					.replace(':place_title', place.name)
					.replace(':place_pic', '/img/streetview/thumbnails/' + place.id + '.jpg');
				places_list.push(content);
			});
			$inner.find('.streetview-list').html(places_list.join(' '));
			/*
			$inner.find('.streetview-list-container').jScrollPane({
				mouseWheelSpeed: '2',
				maintainPosition: false
			});
			*/
		}

		my.initializeGmap();

		var duration = 500;
		if (my.args.place_id !== undefined && TDF.Data.places[my.args.place_id] !== undefined) {

			$inner.find('.detail .title').html(TDF.Data.places[my.args.place_id].name);
			$inner.find('.detail .desc').html(TDF.Data.places[my.args.place_id].text);
			if (TDF.Data.places[my.args.place_id].type === 'Hyperlapse') {
				$inner.find('.detail .hyperlapse-desc').show();
			} else {
				$inner.find('.detail .hyperlapse-desc').hide();
			}
			$inner.find('.container').stop().animate({
				left: '-258px'
			}, duration);

			my.gmapApi.showStreetView(my.args.place_id);

			// my.gmapApi.openInfoWindowPlace(my.args.place_id);

		} else {
			$inner.find('.container').stop().animate({
				left: '0px'
			}, duration);

			my.gmapApi.stopStreetView();
		}

		TDF.setShares(my.base_url, my.share_text);

	};

	return my;
}());

TDF.Data = (function() {

	var my = {};

	my.name = 'data';

	my.load = function(data, file, callback) {
		console.log("Data.load(" + data);

		if (my[data] === undefined) {
			jQuery.getJSON('/data/json/' + file + '.json', function(json, textStatus) {
				console.log(textStatus);
				my[data] = json;
				callback();
			});
		} else {
			callback();
		}

	};

	return my;
}());

jQuery(window).load(function() {
	/*
	if (document.location.pathname !== '/') {
		document.location.href = '/#' + document.location.pathname;
	}
	*/
	TDF.init();
});