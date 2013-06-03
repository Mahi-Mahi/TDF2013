var gmap,
    map,
    mapId,
    mapTypeId,
    startlat,
    startlng,
    allEtapes,
    toursSelecteur;


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
            },
            markerIconImg: '../img/point-simple-ombre.png',
            markerCircleIconImg: '../img/point-boucle-ombre.png',
            styles: mapStyle
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

                options.push('<option value="' + etape.year + '">' + etape.year + '</option>');

                toursSelecteur.html(options.join(''));
            }    
        });

        initSelecteur();
    });
}


function initSelecteur(){
    
        toursSelecteur.on('change', function(){
            var years = $(this).val();

            console.log("changeSelecteur: " + years);

            gmap.createEtapes(years, allEtapes);

        });
    
    
}















