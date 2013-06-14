/**
 *  jquery.gmapApi.js
 * 
 *  requirements:
 *  jQuery
 *  gmaps
 * 
 *  Display gmap, geolocate user and draw a route between the two position
 *  
 *
 *  @Author Alexandre Peyron
 *  @date 19/05/2013
 *  @version 0.1
 * 
 */

(function($, window, document, undefined) {

    'use_strict';

    $.GmapApi = function(options, element) {
        this.element = element;

        this.map = null;
        this.minimap = null;
        this.mapBounds = null;
        
        this.hyperlapse = null;

        // this.currentPosition = null;
        
        this.markerIcon = null;
        this.markerCircleIcon = null;
        this.markerLabelIcon = null;
        
        this.markersIcons = [];
        
        this.navigation = null;

        this.defaultPosition = [];

        this.position = [];


        this.tours = new Object();
        
        this.years = [];

        this.markers = [];
        this.markersMinimap = [];
        this.circles = [];
        this.lines = [];
        this.dashedlines = [];
        this.infosWindow = [];
        
        this.streetViewOverlay = [];
        
        this.animateInterval = null;
        
        this.panorama = null;
        
        this.streetViewPoint = [];
        

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
     *  styles                      {array}         Styles of the map
     *  markerIconImg               {string}        URL for marker image
     *  markerCircleIconImg         {string}        URL for circle marker
     *  isAnimated                  {boolean}       Animate lines    
     *  debugMode                   {boolean}       Debug mode
     *  
     */
    $.GmapApi.defaults = {
        minimap: null,
        hyperlapseId: null,
        hyperlapseLoading: null,
        zoomMin: 14,
        zoomMax: 0,
        zoom: 17,
        zoomControl: true,
        zoomControlOptions: {},
        panControl: true,
        panControlOptions: {},
        streetViewControl: true,
        streetViewControlOptions: {},
        mapTypeControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: null,
//        routeControlImageUrls: null,
//        geolocationIconUrl: null,
//        startNavigationButton: 'startGmapNavigation',
//        stopNavigationButton: 'stopGmapNavigation',
//        geolocationOptions: {
//            maximumAge: Infinity,
//            timeout: 60000,
//            enableHighAccuracy: true
//        },
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
        styles: null,
        stylesMinimap: null,
        markerIconImg: null,
        markerIconSize: [26, 26],
        markerIconAnchor: [0, 0],
        markerCircleIconImg: null,
        markerCircleIconSize: [26, 26],
        markerCircleIconAnchor: [13, 13],
        markerLabelIconImg: null,
        markerLabelIconSize: [67, 84],
        markersIcons: [],
        isAnimated: false,
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

            this.settings = $.extend(true, {}, $.GmapApi.defaults, options);

            this._initGmap();

            this._createImage();

            this._debug();
        },

        /**
         * _initGmap
         * 
         * @param {object} self
         */
        _initGmap: function() {
            var self = this;
            

            this.map = new google.maps.Map(document.getElementById(this.element.id),
            {
                mapTypeId: this.settings.mapTypeId,
                center: this.settings.center,
                mapTypeControl: this.settings.mapTypeControl,
                zoom: this.settings.zoom,
                zoomControl: this.settings.zoomControl,
                zoomControlOptions: this.settings.zoomControlOptions,
                panControl: this.settings.panControl,
                panControlOptions: this.settings.panControlOptions,
                streetViewControl: this.settings.streetViewControl,
                streetViewControlOptions: this.settings.streetViewControlOptions,
                styles: this.settings.styles
            });
            
            if(this.settings.minimap != null){
                this.minimap = new google.maps.Map(document.getElementById(this.settings.minimap),
                {
                    mapTypeId: this.settings.mapTypeId,
                    center: this.settings.center,
                    mapTypeControl: false,
                    panControl: false,
                    zoom: 11,
                    zoomControl: true,
                    zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.SMALL
                    },
                    styles: this.settings.stylesMinimap
                });
            }
            
            google.maps.event.addListener(this.map, "zoom_changed", function() { 
                var Z= self.map.getZoom();

                if (Z > self.settings.zoomMin) {
                    self.map.setZoom(self.settings.zoomMin);
                }
                else if (Z < self.settings.zoomMax) {
                    self.map.setZoom(self.settings.zoomMax);
                }
            });
            
            
            
        },
        
        
        /**
         * Getter for map
         */
        getMap: function(){
            return this.map;
        },
        
        /**
         * _createImage
         * 
         * Create all icon
         */
         _createImage: function() {
             var self = this;
         
            if(this.settings.markerIconImg != null){
                this.markerIcon = {
                    url: this.settings.markerIconImg,
                    size: new google.maps.Size(self.settings.markerIconSize[0], self.settings.markerIconSize[1]),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(self.settings.markerIconSize[0]/2, self.settings.markerIconSize[1]/2)
                };
            }
             
             
            if(this.settings.markerCircleIconImg != null){
                this.markerCircleIcon = {
                    url: this.settings.markerCircleIconImg,
                    size: new google.maps.Size(self.settings.markerCircleIconSize[0], self.settings.markerCircleIconSize[1]),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(self.settings.markerCircleIconSize[0]/2, self.settings.markerCircleIconSize[1]/2)
                };
            }
            
            if(this.settings.markerLabelIconImg != null){
                this.markerLabelIcon = {
                    url: this.settings.markerLabelIconImg,
                    size: new google.maps.Size(self.settings.markerLabelIconSize[0], self.settings.markerLabelIconSize[1]),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(self.settings.markerLabelIconSize[0] / 2, self.settings.markerLabelIconSize[1] - 10)
                };
            }
            
 
            $.each(self.settings.markersIcons, function(i, m){
                var marker = {
                    url: m.url,
                    size: new google.maps.Size(m.width, m.height),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(m.anchorX, m.anchorY)
                }; 
                
                self.markersIcons.push(marker);           
            });
  
         },
        
        
        /**
         * ClearMap
         * 
         * Delete all overlay on the map
         * 
         */
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


        /**
         * DisplayEtape
         */
        displayEtape: function(tour){
            for(var i = 0; i < tour['markers'].length; i++){
                var marker = tour['markers'][i];
                marker.setMap(this.map);
                
                this.mapBounds.extend(marker.getPosition());
            }

            for(var i = 0; i < tour['circles'].length; i++){
                var circle = tour['circles'][i];
                circle.setMap(this.map);
                
                this.mapBounds.extend(circle.getPosition());
            }

            for(var i = 0; i < tour['dashedlines'].length; i++){
                tour['dashedlines'][i].setMap(this.map);
            }

            for(var i = 0; i < tour['lines'].length; i++){
                tour['lines'][i].setMap(this.map);
            }

        },

        /**
         * CreateEtapes
         * 
         * Create etape from data
         * 
         */
        createEtapes: function(years, tours){
            var self = this;
            
            this.years = years;

            this.clearMap();
            
            this.mapBounds = new google.maps.LatLngBounds();
            
            var repositionne = false;
            
            var multiple = (years.length > 1)? true : false;

            $.each(years, function(key, year) {

                repositionne = true;
                
                
//                if(self.tours[year] != undefined){
//                    self.displayEtape(self.tours[year]);
//                    return true; //like break, for $.each
//                }
                
                self.tours[year] = new Object();
                self.tours[year]['markers'] = [];
                self.tours[year]['circles'] = [];
                self.tours[year]['lines'] = [];
                self.tours[year]['dashedlines'] = [];

                

                $.each(tours, function(i, tour) {

                    if(year == tour.year){
                        
                        var previousEtape;

                        self.tours[year]['year'] = year;

                        $.each(tour.legs, function(j, etape) {

                            if(etape.start.city == etape.finish.city){

//                                var circle = self.createCircle(etape.start.lat, etape.start.lng); 
                                var circle;
                                
                                if(multiple)
                                    circle = self.createMarker(etape.start.lat, etape.start.lng, etape.start.city, self.markersIcons[2]);
                                else
                                    circle = self.createMarkerCircle(etape.start.lat, etape.start.lng, etape.start.city);
                                
                                self.tours[year]['circles'].push(circle);
                                self.mapBounds.extend(circle.getPosition());
                            }
                            else{
                                var marker;
                                var markerIcon = (multiple)? self.markersIcons[2] : self.markersIcons[0]; 
                                
                                marker = self.createMarker(etape.start.lat, etape.start.lng, etape.start.city, markerIcon);
                                self.createInfoWindowTrace(marker, etape.start.city);
                                self.tours[year]['markers'].push(marker);
                                self.mapBounds.extend(marker.getPosition());
                                
                                marker = self.createMarker(etape.finish.lat, etape.finish.lng, etape.finish.city, markerIcon);
                                self.createInfoWindowTrace(marker, etape.finish.city);
                                self.tours[year]['markers'].push(marker);
                                self.mapBounds.extend(marker.getPosition());
                                
                                
                                var line;
                                var weight = (multiple)? 1 : 2;
                                var isOriented = (multiple)? false : true;
                                line = self.createLine(etape.start.lat, etape.start.lng, etape.finish.lat, etape.finish.lng, isOriented, weight);
//                                self.createInfoWindowTrace(line, etape.year, false);
                                self.tours[year]['lines'].push(line);           
                            }

                            if(!multiple){
                                if(previousEtape != undefined){
                                    if(etape.start.city != previousEtape.finish.city){


                                        var dashedline = self.createDashedLine(etape.start.lat, etape.start.lng, previousEtape.finish.lat, previousEtape.finish.lng);
                                        self.tours[year]['dashedlines'].push(dashedline);

                                    }
                                }
                            }

                            previousEtape = etape;

                        });
                    }
                });  
                

            });
            
            
            
            
            if(this.settings.isAnimated)
                this.animateLine();
            
            
            
            if(repositionne)
                self.map.fitBounds(this.mapBounds);
   
        },
        
        
        createInfoWindowTrace: function(object, data){
            var self = this;
            
            var contentString = '<p>'+ data +'</p>';

            var infowindow = new google.maps.InfoWindow({
                    content: contentString
            });

            self.infosWindow.push(infowindow);

            google.maps.event.addListener(object, 'mouseover', function() {
//                console.log('over qqch');
//                if(isMarker){
                    infowindow.open(self.map, this);
//                }
//                else{
//                    infowindow.open(self.map, new google.maps.LatLng(45.969968, 2.680664));
//                }
            });

            google.maps.event.addListener(object, 'mouseout', function() {
                infowindow.close();
            });
        },
        
        
        /**
         * changeOpacity
         *
         */
        changeOpacity: function(year){
            var self = this;
            
            if(self.years.length < 2)
                return;
            
            
            if($.inArray(year, self.years) == -1){
                return;
            }
            
            
            $.each(self.tours, function(i, tour){
                
                if(tour['year'] != year){
                    
                    for(var i = 0; i < tour['markers'].length; i++){
                        var marker = tour['markers'][i];
                        marker.setIcon(self.markersIcons[3]);
                    }

                    for(var i = 0; i < tour['circles'].length; i++){
                        var circle = tour['circles'][i];
                        circle.setIcon(self.markersIcons[3]);
                    }
                    
                    for(var i = 0; i < tour['lines'].length; i++){
                        var line = tour['lines'][i];
                        
                        line.setOptions({strokeOpacity: 0.2})
                    }
                    
                    
                }
            });
            
            
        },
        
        /**
         * changeOpacityBack
         *
         */
        changeOpacityBack: function(year){
            var self = this;
            
            if(self.years.length < 2)
                return;
            
            if($.inArray(year, self.years) == -1)
                return;
            
            $.each(self.tours, function(i, tour){
                
                    for(var i = 0; i < tour['markers'].length; i++){
                        var marker = tour['markers'][i];
                        marker.setIcon(self.markersIcons[2]);
                    }

                    for(var i = 0; i < tour['circles'].length; i++){
                        var circle = tour['circles'][i];
                        circle.setIcon(self.markersIcons[2]);
                    }
                
          
                    for(var i = 0; i < tour['lines'].length; i++){
                        var line = tour['lines'][i];
                        
                        line.setOptions({strokeOpacity: 1})
                    }
                    
                    
                
            });
        },
        
        

        /**
         * CreateMarker
         * 
         */
        createMarker: function(plat, plng, title, pMarkerIcon){
            var self = this;
            
            var markerIcon = pMarkerIcon;  
            if(markerIcon == undefined)
                markerIcon = self.markerIcon;
            
            
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(plat, plng),
                map: self.map,
                title: title,
                icon: markerIcon
            });

            this.markers.push(marker);

            return marker;

        },
        
        /**
         * CreateMarkerWithData
         * 
         * This marker have a label to display on the map (string, number)
         * 
         */
        createMarkerWithData: function(plat, plng, title, data){
            var self = this;
            
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(plat, plng),
                map: self.map,
                title: title,
                icon: self.markerLabelIcon,
                zIndex: 1
            });

            //MarkerLabel is an Object whitch extend google.maps.OverlayView
            var label = new MarkerLabel({
                map: self.map
            });

            label.set('zIndex', 7283);
            label.bindTo('position', marker, 'position');
            //label.bindTo('text', marker, 'position');
            label.set("text", data);
            
            
            this.markers.push(marker);

            return marker;

        },
        
        /**
         * CreateMarker
         * 
         * Marker with different icon
         * 
         */
        createMarkerCircle: function(plat, plng, title){
            var self = this;

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(plat, plng),
                map: self.map,
                title: title,
                icon: self.markerCircleIcon
            });

            this.circles.push(marker);

            return marker;

        },

        /**
         * CreateCircle
         * 
         * Zone Circle on the map
         * 
         */
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
                center: new google.maps.LatLng(plat, plng),
                radius: 20000
            };
            var circle = new google.maps.Circle(circleOptions);

            this.circles.push(circle);


            return circle;
        },

        /**
         * CreateLine
         * 
         */
        createLine: function(slat, slng, flat, flng, isOriented, weight){
            var self = this;
            
            var lineSymbol = null;
            if(isOriented){
                lineSymbol = {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                };
            }
            
            if(weight == undefined)
                weight = 2;
            
            
            var lineCoordinates = [
                new google.maps.LatLng(slat, slng),
                new google.maps.LatLng(flat, flng)
            ];


            var line = new google.maps.Polyline({
                strokeWeight: weight,
                strokeColor: '#eb7516',
                path: lineCoordinates,
                map: self.map,
                icons: [{
                    icon: lineSymbol,
                    offset: '50%'
                }]
            });

            this.lines.push(line);
            
            google.maps.event.addListener(line, 'mouseover', function() {
                
                console.log("over live");
//                myInfoWindow.open(mymap);
                // mymap represents the map you created using google.maps.Map
            });
            
            
            return line;
        },
        
        /**
         * AnimateLine
         * 
         * Animate Icon on the line
         * 
         */
        animateLine: function(){
            var self = this;

            var count = 0;
            self.animateInterval = window.setInterval(function() {
                count = (count + 1) % 200;

                $.each(self.lines, function(i){
                    var icons = self.lines[i].get('icons');
                    icons[0].offset = (count / 2) + '%';
                    self.lines[i].set('icons', icons);
                });
            }, 20);
            
          
        },

        /**
         * CreateDashedLine
         * 
         */
        createDashedLine: function(slat, slng, flat, flng){
            var self = this;

            var lineCoordinates = [
                new google.maps.LatLng(slat, slng),
                new google.maps.LatLng(flat, flng)
            ];

            var lineSymbol = {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                strokeWeight: 1,
                scale: 5
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
        
        /////////////////////////////////////////////////////////////////////
        // HOME
        
        /**
         * FindEtape
         * 
         * Find etape from data
         * 
         */
        findEtapesNear: function(lat, lng, address, data){
            var self = this;
            
            var SEARCH_LIMIT = 10;
            var BOUNDS_LIMIT = 3;
            
            var etapes = [];
            var bounds = new google.maps.LatLngBounds();

            var showInfo = false;
            address = address.split(',');

            for(var j = 0; j < this.markers.length; j++){
                this.markers[j].setMap(null);
            }
            
            self.markers = [];
            
            
            //First search (little size)
            var result = this._findEtapes(data, lat, lng, 0.02, 0.02);
            etapes = result;
            
            //Si pas de résultat proche, on met le marker de recherche
            if(etapes.length === 0){
                var m = this.createMarker(lat, lng, 'Ma recheche');
                bounds.extend(m.getPosition());
            }
            else{
                showInfo = true;
            }
            
          
            if(etapes.length < SEARCH_LIMIT){
                //Second search (middle size)
                result = this._findEtapes(data, lat, lng, 2, 2);

                etapes = this._mergeEtapes(etapes, result, lat, lng, SEARCH_LIMIT);
    
            }
            
            if(etapes.length == 0){
                //Third search (big size)
                result = this._findEtapes(data, lat, lng, 20, 20);

                etapes = this._mergeEtapes(etapes, result, lat, lng, SEARCH_LIMIT);
    
            }
            
            
            console.log("TOUTES LES RECHERCHES SONT FAITES");
            console.log("etapes.length : " + etapes.length);
            
            //TODO: //Third search (large size)
            
            
            
            
            //Redim map viewport
            for(var i = 0; i < etapes.length; i++){
                var etape = etapes[i];
                
                var marker = this.createMarkerWithData(etape.lat, etape.lng, etape.city, etape.count);

                var infowindow = this.createInfoWindowSearch(marker, etape);
                
                if(showInfo){
             
                    var thisRegex = new RegExp(address[0], 'gi');

                    if(thisRegex.test(etape.city) == true){
                        infowindow.open(self.map, marker);
                        showInfo = false;
                    }                    
                    
                }
                
                if(i < BOUNDS_LIMIT){
                    bounds.extend(marker.getPosition());
                }
                
                
                
            }
          
            if(etapes.length > 1)
                this.map.fitBounds(bounds);
            
        },
        
        
        createInfoWindowSearch: function(marker, data){
            var self = this;
            
            data.years.sort();
            
            var contentString = '<h3>'+ data.city +'</h3>';
            contentString += '<p>'+ data.count +' fois ville étape ';
            
            if(data.years.length > 1){
               contentString += 'entre '+ data.years[0] +' et ' + data.years[data.years.length-1] + '</p>'; 
            }
            else{
               contentString += 'en ' + data.years[0] + '</p>';
            }
            
            
            contentString += '<select class="selectYearSearch">';
            contentString  += '<option value="-1">Selectionnez une année</option>';
            
            for(var i = 0; i < data.years.length; i++){
                contentString  += '<option value="'+ data.years[i]+ '/'+ data.city +',' + data.country +'">'+ data.years[i] +'</option>';
            }
            
            contentString += '</select>';
            
            
            
            var infowindow = new google.maps.InfoWindow({
                    content: contentString
            });
            
             
            self.infosWindow.push(infowindow);
            
            google.maps.event.addListener(marker, 'click', function() {
                for(var i= 0; i <  self.infosWindow.length; i++){
                     self.infosWindow[i].close();
                }
                
                infowindow.open(self.map, this);
            });


            
            return infowindow;
    
        },
        
        /**
         * MergeEtape
         * 
         * merge result between two search
         * 
         */
        _mergeEtapes: function(etapes, results, lat, lng, SEARCH_LIMIT){
            
            var pointOri = new google.maps.LatLng(lat, lng);      
            
            for(var k = 0; k < results.length; k++){ 
                var point =  new google.maps.LatLng(results[k].lat, results[k].lng);           
                var distance = google.maps.geometry.spherical.computeDistanceBetween(pointOri, point);

                results[k].distance = distance;
            }
               
            
            
//            console.log("beforeSort =======");
//            console.log("lat : " + lat + '   lng : ' + lng);
//            
//            
//            
//            for(var i = 0; i < results.length; i++){      
//                console.log('Lat: ' + results[i].lat + '  Lng: ' + results[i].lng + "   " + results[i].city  );
//                
//           
//            }
//                      
//            console.log("==================");
//            
            results.sort(function(a,b){
                return (a.distance - b.distance);
            })
            
//            console.log("afterSort =======");
//            for(var i = 0; i < results.length; i++){      
//                console.log('Lat: ' + results[i].lat + '  Lng: ' + results[i].lng + " "+ results[i].distance  +"  " + results[i].city  );
//                
//           
//            }
//            
//            console.log("==================");
            
            
            
            for(var i = 0; i < results.length; i++){
                
                if(etapes.length >= SEARCH_LIMIT) {
                    break;
                }
                
                var result = results[i];
                
                var isMerged = false;
                
                for(var j = 0; j < etapes.length; j++){
                    var etape = etapes[j];
                    
                    if(etape.city == result.city){
                        
                        etape = (etape.count > result.count)? etape: result;
                        
                        isMerged = true;
                        console.log("je merge  : " + etape.city );
                    }  
                 
                }
                
                if(!isMerged){
                    etapes.push(result);
                    console.log("j'ajoute : " + result.city);
                }
                
                
//                console.log("!!etapes.lenght : "+ etapes.length);
//                if(etapes.length >= 3) {
//                    break;
//                }
                
            }
            
            
            return etapes;   
        },
        
        
        /**
         * FindEtape
         * 
         * Find etape from lat lng
         * 
         */
        _findEtapes: function(data, lat, lng, offsetLat, offsetLng){
          
            var result = [];
          
            var lastStart = null;
            var lastFinish = null;
            
            $.each(data, function(i, etape) {
                
                lastStart = null;
                
                var isNewCity = true;
                
                var startCity = etape.start.city;
                var startLat = etape.start.lat;
                var startLng = etape.start.lng;
                
                
                var finishCity = etape.finish.city;
                var finishLat = etape.finish.lat;
                var finishLng = etape.finish.lng;
                
                
               
             
                if( lat < (startLat*1 + offsetLat*1) && 
                    lat > (startLat*1 - offsetLat*1) && 
                    lng < (startLng*1 + offsetLng*1) &&
                    lng > (startLng*1 - offsetLng*1) &&
                    lastFinish != startCity){
                    
                    
                    
                    
                    isNewCity = true;
                    for(var v = 0; v < result.length; v++){
                        if(result[v].city == startCity){
                            result[v].count++;
                            result[v].years.push(etape.year);
                            lastStart = startCity;
                            isNewCity = false;
                        }
                        
                    }
                    
                    if(isNewCity){
                        var city = {city: startCity, country: etape.start.country, lat:startLat, lng: startLng, count: 1, years: [etape.year] }
                        result.push(city);
                        lastStart = startCity;
                    }
                    
                    
                    //console.log(etape.id + " : etape.start.city : " + etape.start.city);    
                    //console.log(etape.id + " : startCity : " + startCity);    
                }
                
                lastFinish = null;
                
                if( lat < (finishLat*1 + offsetLat*1) && 
                    lat > (finishLat*1 - offsetLat*1) && 
                    lng < (finishLng*1 + offsetLng*1) &&
                    lng > (finishLng*1 - offsetLng*1) &&
                    finishCity != lastStart){   //Pour les étapes qui commencent et finissent au même endroit
                    
                    
                    isNewCity = true;
                    for(var k = 0; k < result.length; k++){
                        if(result[k].city == finishCity){
                            result[k].count++;
                            result[k].years.push(etape.year);
                            lastFinish = finishCity;
                            isNewCity = false;
                        }  
                    }
                    
                    if(isNewCity){
                        var city2 = {city: finishCity, country: etape.finish.country, lat:finishLat, lng: finishLng, count: 1, years: [etape.year] }
                        result.push(city2);
                        lastFinish = finishCity;
                    }
                    
                      
                }
            });
            
            console.log("FIN RECHERCHE");
            console.log("result.length : " +result.length);

          
            return result;
        },
        
        
        /**
         * AddStreetViewPoint
         * 
         * Add marker with infoWindow from data
         * 
         */
        addStreetViewPoint: function(data, $container, callback){
            var self = this;
            
            var geocoder = new google.maps.Geocoder();
             
            $.each(data, function(i, streetViewPoint){
               
               
                var coords = streetViewPoint.coords;
                coords = coords.split(",");
                
                if(streetViewPoint.type == 'Street View'){
                    var sv = {};
                    sv.id = streetViewPoint.id;
                    sv.type = streetViewPoint.type;
                    sv.lat = coords[0];
                    sv.lng = coords[1];
                    sv.heading = streetViewPoint.heading;
                    
                    self.streetViewPoint.push(sv);
                }
                else{
                    
                    var points = streetViewPoint.url.split("#");
                    points = points[1].split(',');
                    
                    
                    
                    var hp = {};
                    hp.id = streetViewPoint.id;
                    hp.type = streetViewPoint.type;
                    hp.lookat = (streetViewPoint.lookat == 'on')? true : false;
                    hp.lookatLat = points[2];
                    hp.lookatLng = points[3];
                    hp.sLat = points[0];
                    hp.sLng = points[1];
                    hp.fLat = points[4];
                    hp.fLng = points[5];
                    hp.distance = streetViewPoint.distance;
                    hp.millis = streetViewPoint.millis;
                    hp.position = streetViewPoint.position;
                    
                    
                    
                    console.log(streetViewPoint.id + "lookat : " + hp.position);
                    
                    self.streetViewPoint.push(hp);
                }
                
                
                
                
               
                var marker;
                if(streetViewPoint.type == 'Street View'){
                    marker = self.createMarker(coords[0],coords[1], streetViewPoint.name, self.markersIcons[0]);
                }
                else{
                    marker = self.createMarker(coords[0],coords[1], streetViewPoint.name, self.markersIcons[1]);
                }
               
                var contentString = '';
               
               
                if(streetViewPoint.type == 'Street View'){
                    contentString = '<div id="contentInfo">'+
                    '<h1 id="firstHeading" class="firstHeading">'+ streetViewPoint.name +'</h1>'+
                        '<div id="bodyContent">'+
                            '<p>'+ streetViewPoint.excerpt +'</p>'+
                            '<span class="displayStreetView"><a href="/lieux-mythiques/'+ streetViewPoint.id +'/" data-type="'+ streetViewPoint.type +'" data-lat="'+ coords[0] +'" data-lng="'+ coords[01] +'" data-heading="'+ streetViewPoint.heading +'"  >Voir</a></span>' +
                        '</div>'+
                    '</div>';
                }
                else{
                    contentString = '<div id="contentInfo">'+
                    '<h1 id="firstHeading" class="firstHeading">'+ streetViewPoint.name +'</h1>'+
                        '<div id="bodyContent">'+
                            '<p>'+ streetViewPoint.excerpt +'</p>'+
                            '<span class="displayHyperlapse"><a href="/lieux-mythiques/'+ streetViewPoint.id +'/" data-type="'+ streetViewPoint.type +'" data-id="'+ streetViewPoint.id  +'"  >Voir Hyperlapse</a></span>' +
                        '</div>'+
                    '</div>';
                }
               
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
                
                
                var overlays = {id: streetViewPoint.id, infowindow: infowindow, marker:marker};
                
                self.streetViewOverlay.push(overlays);
               
                google.maps.event.addListener(marker, 'click', function() {
                    for(var i = 0; i < self.infosWindow.length; i++){
                        self.infosWindow[i].close();
                    }

                    infowindow.open(self.map, marker);
                    
                    self.map.setCenter(marker.position);
                });
                
                self.infosWindow.push(infowindow);
               
            });
            
            
//            $container.on('click', '.displayStreetView', function(e){
//               var data = $(this).data();  
//               
//               self.displayStreetView(data.lat, data.lng, data.heading);
//
//               return false;               
//            });
//            
//            $container.on('click', '.displayHyperlapse', function(e){
//               var data = $(this).data();  
//       
//               self.showStreetView(data.id);
//
//               return false;
//            });





//            var panoramaOptions = {
//                
//                visible: false,
//                enableCloseButton: true,
//                panControl: false
//            };
            
            
//            this.panorama = google.maps.StreetViewPanorama(self.element.id, panoramaOptions);
            
            this.panorama = this.map.getStreetView();
            this.panorama.setPosition(new google.maps.LatLng(0, 0));
            this.panorama.setPov({
                heading: 0,
                pitch: 0
            });
            
            
//            self.map.setStreetView(this.panorama);
            self.minimap.setStreetView(this.panorama);


            google.maps.event.addListener(self.panorama, "closeclick", function(){
               callback();
            });

            
            google.maps.event.addListener(self.panorama, "visible_changed", function() {
                if (self.panorama.getVisible()){
                    //moving the pegman around the map
                }else if(self.panorama.getVisible()){

                    self.minimap.setStreetView(self.panorama); 
                    self.minimap.setCenter(self.panorama.getPosition());
                    
                }
            });  


        },
        
        /**
         * displayStreetView
         * 
         */
        displayStreetView: function(lat, lng, heading){
            this.panorama = this.map.getStreetView();
            
            var center = new google.maps.LatLng(lat, lng);
            
            this.panorama.setPosition(center);
            this.panorama.setPov(({
                heading: heading*1,
                pitch: 0
            }));
            
            this.panorama.setVisible(true);
            
      
            this.minimap.setStreetView(this.panorama);
            this.minimap.setCenter(center);
            this.minimap.setZoom(14);
            
            //this.toggleStreetView(); 
        },
        
        
        /**
         * toggleStreetView
         * 
         */
        toggleStreetView: function () {
            var toggle = this.panorama.getVisible();
            
            this.panorama.setVisible(!toggle);
        },
        
        
        /**
         * showStreetView
         * 
         */
        showStreetView: function(id){
            var self = this;

            $.each(self.streetViewPoint, function(i, sv){
               
               
               
               if(id == sv.id){
                   
                   if(sv.type == "Street View"){
                       self.displayStreetView(sv.lat, sv.lng, sv.heading);
                   }
                   else{
                       self.generateHyperlapse(sv);
                   }
                   
               }
               
            });
            
        },
        
        
        /**
         * GenerateHyperlapse
         *
         */
        generateHyperlapse: function(data){
            var self = this;
            
            var zoneMap = $("#" + this.element.id);
            var zoneMinimap = $('#' + this.settings.minimap);
            var zoneH = $("#" + this.settings.hyperlapseId);
            
            var qualityWidth = 742*1.5;
            var qualityHeight = 500*1.5;
            
            var pWidth = 742;
            var pHeight = 500;
            
            var pano = document.getElementById(self.settings.hyperlapseId);
            
            
            zoneH.removeClass('hide');
        
            this.hyperlapse = new Hyperlapse(pano, {
                zoom: 2,
                lookat: new google.maps.LatLng(data.lookatLat, data.lookatLng),
                use_lookat: data.lookat,
                width: qualityWidth, 
                height: qualityHeight,
                elevation: 50,
//                fov: data.position,
                millis: data.millis,
                distance_between_points: data.distance,
                max_points: 100
            });
            
            
            this.hyperlapse.position.x = data.position;
            
            
            if(self.minimap != null){
                
                var bounds = new google.maps.LatLngBounds();
                
                self.clearMinimap();

                self.markersMinimap = [];

                var marker;
                
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.sLat, data.sLng),
                    map: self.minimap,
                    draggable: false,
                    title: 'PointA',
                    icon: self.markersIcons[2]
                });
                
                bounds.extend(marker.getPosition());

                self.markersMinimap.push(marker);
                
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.fLat, data.fLng),
                    map: self.minimap,
                    draggable: false,
                    title: 'PointB',
                    icon: self.markersIcons[3]
                });
                
                bounds.extend(marker.getPosition());
                
                self.markersMinimap.push(marker);
                
                if(data.lookat){
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data.lookatLat, data.lookatLng),
                        map: self.minimap,
                        draggable: false,
                        title: 'Point de vue',
                        icon: self.markersIcons[4]
                    });
                }
                
                
                
                
                
                self.minimap.fitBounds(bounds);
            }
            
            

            this.hyperlapse.onError = function(e) {
                console.log(e);
            };
            
            
            this.hyperlapse.onRouteProgress = function(e) {
                
                var marker = new google.maps.Marker({
                    position: e.point.location,
                    draggable: false,
                    icon: "/img/lieux/dot_marker.png",
                    map: self.minimap
                });
                   
                        
                        
                self.markersMinimap.push(marker);
            };
            

            this.hyperlapse.onRouteComplete = function(e) {
                self.hyperlapse.load();
            };
            
            this.hyperlapse.onLoadProgress = function(e) {
                
                if(self.settings.hyperlapseLoading)
                    self.settings.hyperlapseLoading(e.position+1, self.hyperlapse.length());
                
                
            };

            this.hyperlapse.onLoadComplete = function(e) {
                self.hyperlapse.setSize(pWidth, pHeight);
                
                
                self.hyperlapse.play();
            };

            // Google Maps API stuff here...
            var directions_service = new google.maps.DirectionsService();

            var route = {
                request:{
                    origin: new google.maps.LatLng(data.sLat, data.sLng),
                    destination: new google.maps.LatLng(data.fLat, data.fLng),
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                }
            };

            directions_service.route(route.request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    self.hyperlapse.generate( {route:response} );
                    
                } else {
                    console.log(status);
                }
            });
            
            
            var is_moving;
            var onPointerDownPointerX;
            var onPointerDownPointerY;
            var px;
            var py;
            var timerClick;
            var canPlayPause = true;
            
            pano.addEventListener( 'mousedown', function(e){
                    e.preventDefault();

                    is_moving = true;

                    onPointerDownPointerX = e.clientX;
                    onPointerDownPointerY = e.clientY;

                    px = self.hyperlapse.position.x;
                    py = self.hyperlapse.position.y;
                    
                    canPlayPause = true;
                    timerClick = setTimeout(function(){canPlayPause = false},200)

            }, false );


            pano.addEventListener( 'click', function(e){
                if(canPlayPause){
                    self.playPauseHyperlapse();
                }
                
                canPlayPause = true;
                
            });


            pano.addEventListener( 'mousemove', function(e){
                    e.preventDefault();
                    var f = self.hyperlapse.fov() / 500;

                    if ( is_moving ) {
                            var dx = ( onPointerDownPointerX - e.clientX ) * f;
                            var dy = ( e.clientY - onPointerDownPointerY ) * f;
                            self.hyperlapse.position.x = px + dx; // reversed dragging direction (thanks @mrdoob!)
                            self.hyperlapse.position.y = py + dy;

//                            o.position_x = hyperlapse.position.x;
//                            o.position_y = hyperlapse.position.y;
                    }

            }, false );

            pano.addEventListener( 'mouseup', function(){
                    is_moving = false;

//                    self.hyperlapse.position.x = px;
//                    hyperlapse.position.y = py;
                    
            }, false );

            
            
            
        },
        
        playPauseHyperlapse: function(){ 
            if(this.hyperlapse.isPlaying()){
                this.hyperlapse.pause();
            }
            else{
                this.hyperlapse.play();
            }
        },
        
        
        clearMinimap: function(){
            for(var i = 0; i < this.markersMinimap.lenght; i++){
                this.markerMinimap[i].setMap(null);
            }
        },
        
        
        stopStreetView: function(){
  
            var zoneMap = $("#" + this.element.id);
            var zoneMinimap = $('#' + this.settings.minimap);
            var zoneH = $("#" + this.settings.hyperlapseId);
            
            
            this.hyperlapse = null;
            
            zoneH.find('canvas').remove();
            
            zoneH.addClass('hide');
            
            zoneMap.width(742);
            zoneMap.height(500);
            
        },
        
        openInfoWindowPlace: function(id){
            var self = this;
          
            for(var i = 0; i < self.infosWindow.length; i++){
                self.infosWindow[i].close();
            }
          
            $.each(self.streetViewOverlay, function(i, overlay){
             
                if(id == overlay.id){
                    overlay.infowindow.open(self.map, overlay.marker);
                    
                    self.map.setCenter(overlay.marker.position);
                }
             
            });
          
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