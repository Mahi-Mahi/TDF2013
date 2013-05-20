/**
 *  jquery.gmapApi.js
 * 
 *  requirements:
 *  jQuery
 *  gmaps
 * 
 *  Display gmap, geolocate user and draw a route between the two position
 *  
 *  @todo test realtime position when moving, change route when datas is reloaded
 *  
 *  @Author Anthony Tison
 *  @date 23/04/2013
 *  @version 0.1
 * 
 */

(function($, window, document, undefined) {

    'use_strict';

    $.GmapApi = function(options, element) {
        this.element = element;

        this.map = null;

        // this.currentPosition = null;

        // this.isGeolocated = false;

        // this.geolocationIcon = null;
        
        this.navigation = null;

        this.defaultPosition = [];

        this.position = [];


        this.tours = new Object();

        this.markers = [];
        this.circles = [];
        this.lines = [];
        this.dashedlines = [];

        this._init(options);
    };

    /**
     * Default settings
     * 
     * zoom                         {integer}       Default zoom index
     * zoomControl                  {boolean}       Show zoom control
     * zoomControlOpt               {array}         Zoom control options
     *      style                   {integer}       Zoom control style
     *      position                {integer}       Zoom control position
     * routeControlImageUrls        {array}         Array with route control images
     * geolocationIconUrl           {string}        Geolocation image url
     * startNavigationButton        {string}        Start navigation button
     * stopNavigationButton         {string}        Stop navigation button
     * controlStyle                 {array}         Control css style array
     *      margin                  {string}        margin
     *      padding                 {string}        padding
     *      border                  {string}        border
     *      background              {string}        background
     *      width                   {string}        width
     * geolocationOptions           {array}         Geolocation html5 feature options
     *      maximumAge              {string}        MaximumAge put location in cache
     *      timeout                 {integer}       Geolocation is timeout after x millisec
     *      enableHighAccuracy      {boolean}       More precise position becauche of the GPS
     *  message                     {array}         Array of different messages
     *      geolocate_failed        {string}        Geolocate failed message
     *      not_compatible          {string}        Not compatible browser message
     *  debugMode                   {boolean}       Debug mode
     *  
     */
    $.GmapApi.defaults = {
        zoom: 17,
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: null,
        routeControlImageUrls: null,
        geolocationIconUrl: null,
        startNavigationButton: 'startGmapNavigation',
        stopNavigationButton: 'stopGmapNavigation',
        geolocationOptions: {
            maximumAge: Infinity,
            timeout: 60000,
            enableHighAccuracy: true
        },
        controlStyle: {
            margin: '5px',
            padding: '1px 6px',
            border: 'solid 1px #717B87',
            background: '#fff',
            width: '34px'
        },
        message: {
            geolocate_failed: 'Geolocation failed: ',
            not_compatible: 'Your browser does not support geolocation',
            today: 'today',
            lastUpdate: 'last update'
        },
        debugMode: true
    };

    $.fn.gmapApi = function(options) {
        var instance = $.data(this, 'search');
        if (typeof options === 'string') {
            var args = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                instance[ options ].apply(instance, args);
            });
        }
        else {
            this.each(function() {
                instance ? instance._init() : instance = $.data(this, 'gmapApi', new $.GmapApi(options, this));
            });

        }
        return instance;
    };

    $.GmapApi.prototype = {
        /**
         * Init plugin
         */
        _init: function(options) {

            var self = this;

            this.settings = $.extend(true, {}, $.GmapApi.defaults, options);

            // this._initDefaultPosition();

            this._initGmap();

            // this._createImage();

            // this._geolocate();

            this._debug();
        },
        /**
         * _initDefaultPosition
         */
        // _initDefaultPosition: function() {
        //     this.defaultPosition = {
        //         latitude: $(this.element).attr('data-lat'),
        //         longitude: $(this.element).attr('data-lng'),
        //         location: $(this.element).attr('data-location'),
        //         title: $(this.element).attr('data-title')
        //     };
        // },
        /**
         * _initGmap
         * 
         * @param {object} self
         */
        _initGmap: function() {

            this.map = new google.maps.Map( document.getElementById(this.element.id),
            {
                mapTypeId: this.settings.mapTypeId,
                center: this.settings.center,
                zoom: this.settings.zoom,
                zoomControl: this.settings.zoomControl,
                zoomControlOpt: this.settings.zoomControlOpt
            });

        },

        clearMap: function(){

            for(var i = 0; i < this.lines.length; i++){
                this.lines[i].setMap(null);
            }

            for(var i = 0; i < this.dashedlines.length; i++){
                this.dashedlines[i].setMap(null);
            }

            for(var i = 0; i < this.circles.length; i++){
                this.circles[i].setMap(null);
            }

            for(var i = 0; i < this.markers.length; i++){
                this.markers[i].setMap(null);
            }
        },

        displayEtape: function(tour){
            for(var i = 0; i < tour['markers'].length; i++){
                tour['markers'][i].setMap(this.map);
            }

            for(var i = 0; i < tour['circles'].length; i++){
                tour['circles'][i].setMap(this.map);
            }

            for(var i = 0; i < tour['dashedlines'].length; i++){
                tour['dashedlines'][i].setMap(this.map);
            }

            for(var i = 0; i < tour['lines'].length; i++){
                tour['lines'][i].setMap(this.map);
            }

        },

        createEtapes: function(years, etapes){
            var self = this;

            this.clearMap();

            $.each(years, function(key, year) {
                console.log(year);

                console.log("self.tours[year] : " + self.tours[year]);

                if(self.tours[year] != undefined){
                    self.displayEtape(self.tours[year]);
                    return true; //like break
                }

                console.log("create new year : " + year);
                self.tours[year] = new Object();
                self.tours[year]['markers'] = [];
                self.tours[year]['circles'] = [];
                self.tours[year]['lines'] = [];
                self.tours[year]['dashedlines'] = [];

                var previousEtape;

                $.each(etapes, function(key2, etape) {
                    if(year == etape.year){
                        //console.log(etape.id);
                        // console.log("--------");
                        // console.log(etape.start.city);
                        // console.log(etape.finish.city);

                        if(etape.start.city == etape.finish.city){

                            var circle = self.createCircle(etape.start.lat, etape.start.lng);
                            self.tours[year]['circles'].push(circle);

                        }
                        else{
                            var marker;
                            marker = self.createMarker(etape.start.lat, etape.start.lng, etape.start.city);
                            self.tours[year]['markers'].push(marker);

                            marker = self.createMarker(etape.finish.lat, etape.finish.lng, etape.finish.city);
                            self.tours[year]['markers'].push(marker);

                            var line = self.createLine(etape.start.lat, etape.start.lng, etape.finish.lat, etape.finish.lng);
                            self.tours[years]['lines'].push(line);           
                        }

                        if(previousEtape != undefined){
                            if(etape.start.city != previousEtape.finish.city){
                                var dashedline = self.createDashedLine(etape.start.lat, etape.start.lng, previousEtape.finish.lat, previousEtape.finish.lng);
                                self.tours[years]['dashedlines'].push(dashedline);

                            }
                        }
                        
                        

                        previousEtape = etape;
                    }
                });  
            });
        },

        createMarker: function(plat, plng, title){
            var self = this;

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(plng, plat),
                map: self.map,
                title: title
            });

            this.markers.push(marker);

            return marker;

        },

        createCircle: function(plat, plng){
            var self = this;

            var circleOptions = {
                clickable: false,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: self.map,
                center: new google.maps.LatLng(plng, plat),
                radius: 20000
            };
            var circle = new google.maps.Circle(circleOptions);

            this.circles.push(circle);


            return circle;
        },

        createLine: function(slat, slng, flat, flng){
            var self = this;

            var lineCoordinates = [
                new google.maps.LatLng(slng, slat),
                new google.maps.LatLng(flng, flat)
            ];


            var line = new google.maps.Polyline({
                path: lineCoordinates,
                map: self.map
            });

            this.lines.push(line);

            return line;
        },

        createDashedLine: function(slat, slng, flat, flng){
            var self = this;

            var lineCoordinates = [
                new google.maps.LatLng(slng, slat),
                new google.maps.LatLng(flng, flat)
            ];

            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 4
            };

            var line = new google.maps.Polyline({
                path: lineCoordinates,
                strokeOpacity: 0,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
                map: self.map
            });

            this.dashedlines.push(line);

            return line;

        },


        /**
         * _createImage
         * 
         * Create geolocation icon
         */
        // _createImage: function() {

        //     this.geolocationIcon = {
        //         url: this.settings.geolocationIconUrl,
        //         // This marker is 20 pixels wide by 32 pixels tall.
        //         size: new google.maps.Size(14, 14),
        //         // The origin for this image is 0,0.
        //         origin: new google.maps.Point(0, 0),
        //         // The anchor for this image is the base of the flagpole at 0,32.
        //         anchor: new google.maps.Point(0, 0)
        //     };
        // },
        /**
         * _geolocate
         */
        // _geolocate: function() {
        //     var self = this;

        //     GMaps.geolocate({
        //         success: function(position) {
        //             self.isGeolocated = true;

        //             self.currentPosition = position;
        //             self.map.setCenter(position.coords.latitude, position.coords.longitude);

        //             self.map.addMarker({
        //                 lat: position.coords.latitude,
        //                 lng: position.coords.longitude
        //             });
        //         },
        //         error: function(error) {
        //             alert(self.settings.message.geolocate_failed + error.message);
        //         },
        //         not_supported: function() {
        //             alert(self.settings.message.not_compatible);
        //         },
        //         always: function() {
        //             setTimeout(
        //                     function() {
        //                         self._geoCodeMap();
        //                     }, 200);
        //         }
        //     });
        // },
        /**
         * _geoCodeMap
         * 
         * Add marker to current position
         * 
         */
        // _geoCodeMap: function() {
        //     var self = this;

        //     GMaps.geocode({
        //         address: this.defaultPosition.location,
        //         callback: function(results, status) {

        //             if (status === 'OK') {

        //                 self.map.removeMarkers();

        //                 var title = self.defaultPosition.title;

        //                 var latlng = results[0].geometry.location;
        //                 self.map.setCenter(latlng.lat(), latlng.lng());
        //                 self.map.addMarker({
        //                     lat: latlng.lat(),
        //                     lng: latlng.lng(),
        //                     infoWindow: {
        //                         content: title + '<br>' + results[0].formatted_address
        //                     }

        //                 });

        //                 if (self.isGeolocated) {
        //                     self.map.cleanRoute();

        //                     self.map.addMarker({
        //                         lat: self.currentPosition.coords.latitude,
        //                         lng: self.currentPosition.coords.longitude
        //                     });

        //                     $('.ccGmap').remove();

        //                     if (null !== self.settings.routeControlImageUrls) {
        //                         self._addRouteControl('walking', latlng.lat(), latlng.lng());
        //                         self._addRouteControl('bicycling', latlng.lat(), latlng.lng());
        //                         self._addRouteControl('driving', latlng.lat(), latlng.lng());

        //                         self._drawNewRoute('walking', latlng.lat(), latlng.lng());
        //                     }
        //                 }
        //             }
        //         }
        //     });
        // },
        /**
         * _navigateOnMap
         * 
         * Geolocate user in real time
         */
        _navigateOnMap: function(self, newPosition) {

            self.map.addMarker({
                lat: newPosition.coords.latitude,
                lng: newPosition.coords.longitude,
                icon: self.geolocationIcon
            });
        },
        /**
         * _drawNewRoute
         * 
         * Draw route from point destination to location
         * 
         * @param {string} travelMode
         * @param {string} latitude
         * @param {string} longitude
         */
        _drawNewRoute: function(travelMode, latitude, longitude) {
            this.map.drawRoute({
                origin: [this.currentPosition.coords.latitude, this.currentPosition.coords.longitude],
                destination: [latitude, longitude],
                travelMode: travelMode
                        //strokeColor: '#131540',
                        //strokeOpacity: 1,
                        //strokeWeight: 1
            });
        },
        /**
         * _addRouteControl
         * 
         * Create travel buttons : bicycling, walking and driving
         * 
         * @param {string} travelMode
         * @param {string} latitude
         * @param {string} longitude
         */
        _addRouteControl: function(travelMode, latitude, longitude) {
            var self = this;

            this.map.addControl({
                position: 'top_right',
                content: '<img src="' + this.settings.routeControlImageUrls[travelMode] + '">',
                classes: ['control_' + travelMode + ' ccGmap'],
                style: this.settings.controlStyle,
                events: {
                    click: function() {
                        self.map.cleanRoute();
                        self._drawNewRoute(travelMode, latitude, longitude);
                    }
                }
            });
        },
        /**
         * _startNavigation
         * 
         * Start navigation 
         */
        _startNavigation: function() {
            if (navigator.geolocation) {
                var self = this;

                this.navigation = navigator.geolocation.watchPosition(
                        function(position) {
                            self._navigateOnMap(self, position);

                        }
                );
            }
        },
        /**
         * _stopNavigation
         * 
         * Stop navigation
         */
        _stopNavigation: function(){
          if(navigator.geolocation){
              navigator.geolocation.clearWatch(this.navigation);
          }  
        },
        /**
         * _events
         */
        _events: function(){
          if(navigator.geolocation){
            $('#' + this.settings.startGmapNavigation).on('click', function(){
                self._startNavigation();
            }); 

            $('#' + this.settings.stopGmapNavigation).on('click', function(){
                self._stopNavigation();
            });   
          }
        },
        /**
         * _debug
         * 
         * Debug mode
         */
        _debug: function() {

            if (this.settings.debugMode) {
                var debugDatas = '';

                if (!$(this.selector + '_debug').length) {
                    $(this.selector).parents().find('body').append('<div id="' + this.selector + '_debug" class="gmapApiDebug">' + debugDatas + '</div>')
                } else {
                    $(this.selector + '_debug').html(debugDatas);
                }
            }

        }
    };
})(jQuery, window, document, undefined );