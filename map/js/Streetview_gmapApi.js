var gmap,
    map,
    mapId,
    mapTypeId,
    startlat,
    startlng,
    allPlaces,
    toursSelecteur,
    dataLoaded,
    gmapInit;


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
        toursSelecteur = $('#toursSelecteur');



        
        
        loadData();
        
        
        google.maps.event.addDomListener(window, 'load', initializeGmap);

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
            styles: mapStyleTrace
        };

        gmap = map.gmapApi(mapOptions);
        
        gmapInit = true;
        
        
        
        $("#toggleStreeView").on('click', function(){
            gmap.toggleStreetView();
        });
        
        
        
}


function loadData(){
    
    
    $.getJSON('data/places.json', function(data) {
        
    
        allPlaces = data;
        
        console.log("gmapInit : " + gmapInit);
        
        if(gmapInit)
            gmap.addStreetViewPoint(allPlaces);

    });
    
    
    
    
}




















