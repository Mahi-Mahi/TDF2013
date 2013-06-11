var gmap,
    map,
    mapId,
    mapTypeId,
    startlat,
    startlng,
    allEtapes,
    searchInput;


$(document).ready(function(){

        //Config Gmap
        gmap = null;
        mapId = 'mapPreview';
        mapTypeId = google.maps.MapTypeId.ROADMAP;
        startlat = 47.754098;
        startlng = 3.669434;

        //Data
        allEtapes = null;

        //Elements
        map = $("#" + mapId);

        searchInput = $('#inputGeoloc');


        google.maps.event.addDomListener(window, 'load', initializeGmap);
        
        loadData();
        
        
        autocomplete_init();

});


function initializeGmap() {
       
        var mapOptions = {
            mapTypeId: mapTypeId,
            center: new google.maps.LatLng(startlat, startlng),
            zoom: 6,
            zoomControl : true,
            zoomControlOpt: {
                style : 'SMALL',
                position: 'TOP_LEFT'
            },
            markerIconImg: '../img/point-simple-ombre.png',
            styles: mapStyleSearch
        };

        gmap = map.gmapApi(mapOptions);
}


function loadData(){
    
    
    $.getJSON('data/legs.json', function(data) {

        allEtapes = data;

    });
}


function autocomplete_init() {
    
    
    if ($('#gmapInputAddress').length) {
        
        var input = document.getElementById('gmapInputAddress');
        var gMapAutocomplete = new google.maps.places.Autocomplete(input);
        
        input.className = '';
        gMapAutocomplete.bindTo('bounds', map);

        
        google.maps.event.addListener(gMapAutocomplete, 'place_changed', function() {

            var place = gMapAutocomplete.getPlace();
            
            if (!place.geometry) {
              input.className = 'notfound';
              return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                
                gmap.getMap().fitBounds(place.geometry.viewport);
            } else {
                gmap.getMap().setCenter(place.geometry.location);
                gmap.getMap().setZoom(17);  // Why 17? Because it looks good.
            }


            gmap.findEtapesNear(place.geometry.location.lat(), place.geometry.location.lng(), allEtapes);


//            var address = '';
//            if (place.address_components) {
//              address = [
//                (place.address_components[0] && place.address_components[0].short_name || ''),
//                (place.address_components[1] && place.address_components[1].short_name || ''),
//                (place.address_components[2] && place.address_components[2].short_name || '')
//              ].join(' ');
//            }

        });
        
        
        $('#gmapFormSearch').submit(function() {
            return false;
        });
        
        
        $("#gmapInputAddress").bind('keydown', function(e) {
            console.log("e.keyCode : " + e.keyCode);
            
            if(e.keyCode == 13) {
                
                console.log("entrée");
                
                //geocode_lookup( 'address', $('#gmaps-input-address').val(), true );

//                $('#gmapInputAddress').autocomplete("disable")
            } 
            else {
//                $('#gmapInputAddress').autocomplete("enable")
            }
        });
        

        

        
    }

 


//    if ($('#gmapInputAddress').length) {
//
//       // var gMapAutocomplete = new google.maps.places.Autocomplete(document.getElementById('gmapInputAddress'));
//
//        $('#gmapInputAddress').on('blur', function() {
//            
//            
//            console.log("blur");
//            
////            GMaps.geocode({
////                address: $('#search_location').val(),
////                callback: function(results, status) {
////
////                    if (status === 'OK') {
////                        $('#search_latitude').val(results[0].geometry.location.lat());
////                        $('#search_longitude').val(results[0].geometry.location.lng());
////
////                    }
////
////
////                }
////
////            });
//        });
//    }
    
    
    
    
}









