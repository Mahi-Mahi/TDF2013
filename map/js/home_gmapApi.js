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
            }
        };

        gmap = map.gmapApi(mapOptions);
}


function loadData(){
    
    
    $.getJSON('data/data-all.json', function(data) {

        allEtapes = data;

        var currentYear = 0;
        var options = [];

        $.each(data, function(num, etape) {

            if(currentYear != etape.year){
                currentYear = etape.year;

            }    
        });
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
            
            console.log("place : " + place.geometry);
            console.log("place : " + place.geometry.location.lat());
            console.log("place : " + place.geometry.location.lng());
            
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


//            var address = '';
//            if (place.address_components) {
//              address = [
//                (place.address_components[0] && place.address_components[0].short_name || ''),
//                (place.address_components[1] && place.address_components[1].short_name || ''),
//                (place.address_components[2] && place.address_components[2].short_name || '')
//              ].join(' ');
//            }

        });

        

        
    }

 
    
    $('#gmapFormSearch').on('validated', function(){
    
        console.log("validate");
        
        
        return false;
        
        //$(this).submit();
    });
    
    
    $('#gmapInputAddress').on('keyup', function(e) {
        var code = e.which;

        if (13 === code) {
            
            return false;
        }
    });

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
    
    
    
    
    /*
    $("#gmapInputAddress").autocomplete({
  
        // source is the list of input options shown in the autocomplete dropdown.
        // see documentation: http://jqueryui.com/demos/autocomplete/
        source: function(request,response) {
  
            // the geocode method takes an address or LatLng to search for
            // and a callback function which should process the results into
            // a format accepted by jqueryUI autocomplete
            geocoder.geocode( {'address': request.term }, function(results, status) {
                response($.map(results, function(item) {
                    return {
                        label: item.formatted_address, // appears in dropdown box
                        value: item.formatted_address, // inserted into input element when selected
                        geocode: item                  // all geocode data
                    }
                }));
            })
        },
  
        // event triggered when drop-down option selected
        select: function(event,ui){
            update_ui(  ui.item.value, ui.item.geocode.geometry.location )
            update_map( ui.item.geocode.geometry )
        }
    });
  
        // triggered when user presses a key in the address box
    $("#gmaps-input-address").bind('keydown', function(event) {
        if(event.keyCode == 13) {
            geocode_lookup( 'address', $('#gmaps-input-address').val(), true );
  
            // ensures dropdown disappears when enter is pressed
            $('#gmaps-input-address').autocomplete("disable")
        } 
        else {
            // re-enable if previously disabled above
            $('#gmaps-input-address').autocomplete("enable")
        }
    });
    
    */
  }















