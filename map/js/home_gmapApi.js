var gmap,
    map,
    mapId,
    mapTypeId,
    startlat,
    startlng,
    allEtapes,
    searchInput;


$(document).ready(function(){

        console.log("plop");

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

















