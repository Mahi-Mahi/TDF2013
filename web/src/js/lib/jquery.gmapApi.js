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

        // this.currentPosition = null;
        
        this.markerIcon = null;
        this.markerCircleIcon = null;
        this.markerLabelIcon = null;
        
        this.markersIcons = [];
        
        this.navigation = null;

        this.defaultPosition = [];

        this.position = [];


        this.tours = new Object();

        this.markers = [];
        this.circles = [];
        this.lines = [];
        this.dashedlines = [];
        
        this.animateInterval = null;
        
        this.panorama = null;
        

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
        zoom: 17,
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
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

            this.map = new google.maps.Map(document.getElementById(this.element.id),
            {
                mapTypeId: this.settings.mapTypeId,
                center: this.settings.center,
                zoom: this.settings.zoom,
                zoomControl: this.settings.zoomControl,
                zoomControlOpt: this.settings.zoomControlOpt,
                styles: this.settings.styles
            });
            
            if(this.settings.minimap != null){
                this.minimap = new google.maps.Map(document.getElementById(this.settings.minimap),
                {
                    mapTypeId: this.settings.mapTypeId,
                    center: this.settings.center,
                    zoom: 11,
                    mapTypeControl: false,
                    zoomControl: this.settings.zoomControl,
                    zoomControlOpt: this.settings.zoomControlOpt
                });
            }
            
            
            
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

            this.clearMap();
            
            this.mapBounds = new google.maps.LatLngBounds();

            $.each(years, function(key, year) {

                
                if(self.tours[year] != undefined){
                    self.displayEtape(self.tours[year]);
                    return true; //like break, for $.each
                }
                
                self.tours[year] = new Object();
                self.tours[year]['markers'] = [];
                self.tours[year]['circles'] = [];
                self.tours[year]['lines'] = [];
                self.tours[year]['dashedlines'] = [];

                

                $.each(tours, function(key2, tour) {

                    if(year == tour.year){
                        
                        var previousEtape;

                        $.each(tour.legs, function(key2, etape) {

                            if(etape.start.city == etape.finish.city){

//                                var circle = self.createCircle(etape.start.lat, etape.start.lng); 
                                var circle = self.createMarkerCircle(etape.start.lat, etape.start.lng, etape.start.city);
                                self.tours[year]['circles'].push(circle);
                                self.mapBounds.extend(circle.getPosition());
                            }
                            else{
                                var marker;
                                marker = self.createMarker(etape.start.lat, etape.start.lng, etape.start.city);
                                self.tours[year]['markers'].push(marker);
                                self.mapBounds.extend(marker.getPosition());
                                
                                marker = self.createMarker(etape.finish.lat, etape.finish.lng, etape.finish.city);
                                self.tours[year]['markers'].push(marker);
                                self.mapBounds.extend(marker.getPosition());
                                
                                
                                var line;
                                line = self.createLine(etape.start.lat, etape.start.lng, etape.finish.lat, etape.finish.lng, true);
                                self.tours[year]['lines'].push(line);           
                            }

                            if(previousEtape != undefined){
                                if(etape.start.city != previousEtape.finish.city){
                                    var dashedline = self.createDashedLine(etape.start.lat, etape.start.lng, previousEtape.finish.lat, previousEtape.finish.lng);
                                    self.tours[year]['dashedlines'].push(dashedline);

                                }
                            }                

                            previousEtape = etape;

                        });
                    }
                });  
                
                self.map.fitBounds(this.mapBounds);
            });
            
            
            
            
            if(this.settings.isAnimated)
                this.animateLine();
            
            
            
            
            
            
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
        createLine: function(slat, slng, flat, flng, isOriented){
            var self = this;
            
            var lineSymbol = null;
            
            if(isOriented){
                lineSymbol = {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                };
            }
            
            var lineCoordinates = [
                new google.maps.LatLng(slat, slng),
                new google.maps.LatLng(flat, flng)
            ];


            var line = new google.maps.Polyline({
                strokeWeight: 2,
                strokeColor: '#333333',
                path: lineCoordinates,
                map: self.map,
                icons: [{
                    icon: lineSymbol,
                    offset: '50%'
                }]
            });

            this.lines.push(line);
            
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
                    repeat: '15px'
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
        findEtapesNear: function(lat, lng, data){
            var self = this;
            
            var etapes = [];
            var bounds = new google.maps.LatLngBounds();


            
            
            //First search (little size)
            var result = this._findEtapes(data, lat, lng, 0.05, 0.05);
            etapes = result;
            
            //Si pas de résultat proche, on met le marker de recherche
            if(etapes.length === 0){
                this.createMarker(lat, lng, 'Ma recheche');
            }
            
          
            if(etapes.length < 3){
                //Second search (middle size)
                result = this._findEtapes(data, lat, lng, 0.5, 0.5);
                
                console.log("Deuxieme recherche nb result  : " + result.length);
                
                etapes = this._mergeEtapes(etapes, result, lat, lng);
                
                
            }
            
            //TODO: //Third search (large size)
            
            
            //Redim map viewport
            for(var i = 0; i < etapes.length; i++){
                var etape = etapes[i];
                
                var marker = this.createMarkerWithData(etape.lat, etape.lng, etape.city, etape.count);
                console.log("createMarker : " + etape.city);
 
                bounds.extend(marker.getPosition());
                
            }
          
            if(etapes.length > 1)
                this.map.fitBounds(bounds);
            
        },
        
        /**
         * MergeEtape
         * 
         * merge result between two search
         * 
         */
        _mergeEtapes: function(etapes, results, lat, lng){
            
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
                
                if(etapes.length >= 3) {
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
//                    console.log("jajoute : " + result.city);
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
                            lastStart = startCity;
                            isNewCity = false;
                        }
                        
                    }
                    
                    if(isNewCity){
                        var city = {city: startCity, lat:startLat, lng: startLng, count: 1 }
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
                            lastFinish = finishCity;
                            isNewCity = false;
                        }  
                    }
                    
                    if(isNewCity){
                        var city2 = {city: finishCity, lat:finishLat, lng: finishLng, count: 1 }
                        result.push(city2);
                        lastFinish = finishCity;
                    }
                    
                    
                    
//                    console.log(etape.id + " : etape.finish.city : " + etape.finish.city);  
//                    console.log(etape.id + " : finishCity : " + finishCity);    
                }
            });

          
            return result;
        },
        
        
        /**
         * AddStreetViewPoint
         * 
         * Add marker with infoWindow from data
         * 
         */
        addStreetViewPoint: function(data, $container){
            var self = this;
            
            var geocoder = new google.maps.Geocoder();
             
            $.each(data, function(i, streetViewPoint){
               
               
                var coords = streetViewPoint.coords;
                coords = coords.split(",");
               
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
                            '<a href="#" class="displayStreetView" data-lat="'+ coords[0] +'" data-lng="'+ coords[01] +'" data-heading="'+ streetViewPoint.heading +'"  >Voir</a>' +
                        '</div>'+
                    '</div>';
                }
                else{
                    contentString = '<div id="contentInfo">'+
                    '<h1 id="firstHeading" class="firstHeading">'+ streetViewPoint.name +'</h1>'+
                        '<div id="bodyContent">'+
                            '<p>'+ streetViewPoint.excerpt +'</p>'+
                            '<a href="#" class="displayHyperlapse" data-lat="'+ coords[0] +'" data-lng="'+ coords[1] +'"  >Voir Hyperlapse</a>' +
                        '</div>'+
                    '</div>';
                }
               
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });
               
                google.maps.event.addListener(marker, 'click', function() {
                    console.log("click on maarker");
                    
                    infowindow.open(self.map, marker);
                });
               
               
//               for(var j in streetViewPoint){
//                   console.log(j + ' : ' + streetViewPoint[j]);
//               }
               
            });
            
            
//            $(document).on('click', '.displayStreetView', function(){
            $container.on('click', '.displayStreetView', function(e){
               console.log("click displayStreetView"); 
                
               var data = $(this).data();           
               self.displayStreetView(data.lat, data.lng, data.heading) 
               
               e.preventDefault();
               
               return false;
               
            });





//            var panoramaOptions = {
//                position: new google.maps.LatLng(0, 0),
//                pov: {
//                  heading: 0,
//                  pitch: 0
//                },
//                visible: false,
//                enableCloseButton: true,
//                panControl: true
//            };
            
            
            this.panorama = this.map.getStreetView();
            this.panorama.setPosition(new google.maps.LatLng(0, 0));
            this.panorama.setPov({
              heading: 0,
              pitch: 0
            });
            
            this.minimap.setStreetView(this.panorama);
            $("#" + self.settings.minimap).addClass("hide");

            
            //TODO: dynamiser "panoramaPreview"
//            this.panorama = new google.maps.StreetViewPanorama(document.getElementById(this.element.id), panoramaOptions);
//            this.map.setStreetView(this.panorama);
//
//
            google.maps.event.addListener(self.panorama, "visible_changed", function() {
                if (self.panorama.getVisible() && $("#" + self.settings.minimap).is(':visible')){
                    //moving the pegman around the map
                }else if(self.panorama.getVisible() && $("#" + self.settings.minimap).is(':hidden')){
                    
                    console.log("affiche minimap");
                    
                    $("#" + self.settings.minimap).removeClass("hide");
                    
                    
                    self.minimap.setCenter(self.panorama.getPosition());
                    
//                    $("#panoramaPreview").show();
//                    $("#mapPreview").removeClass('bigmap').addClass('minimap');
                    
                    
//                    self.map.setOptions({disableDefaultUI: true});
//                    self.map.setCenter(self.panorama.getPosition());
                    
                }
                google.maps.event.addListener(self.panorama, "closeclick", function() {
                    $("#" + self.settings.minimap).addClass("hide");
                    
                    
                    console.log("cache minimap");
                    
//                    $("#panoramaPreview").hide();  
//                    $("#mapPreview").removeClass('minimap').addClass('bigmap'); 
//                     
//                    
//                    self.map.setOptions({disableDefaultUI: false});
                });
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
                heading: heading,
                pitch: 0
            }));
            
            this.panorama.setVisible(true);
            
            
            this.minimap.setCenter(center);
            
            //this.toggleStreetView(); 
        },
        
        
        /**
         * toggleStreetView
         * 
         */
        toggleStreetView: function () {
            var toggle = this.panorama.getVisible();
            
            console.log("toggle : " + toggle);
            
            this.panorama.setVisible(!toggle);
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