var lat= 47.229607;
var lng= -1.464797;
var myLatLng= {lat, lng};

var homeLatIni= 47.230110;
var homeLngIni= -1.464834;

//var pt1Lat= 47.229723;
//var pt1Lng= -1.465526;

var pt2Lat= 47.229487;
var pt2Lng= -1.464158;

var homeAlt = 0;
var newLat=0;
var newLng=0;
var longueurDist=88;
var largeurDist=72;
var heading= 2.5066;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initMap() {
    var homeIcon = new google.maps.MarkerImage("app/pages/missionGenerator/pinRouge.png", null, null, null, new google.maps.Size(50,50));
    var greenIcon = new google.maps.MarkerImage("app/pages/missionGenerator/pinVert.png", null, null, null, new google.maps.Size(50,50));
    var blueIcon = new google.maps.MarkerImage("app/pages/missionGenerator/pinBleu.png" , null, null, null, new google.maps.Size(50,50));

    var inputLat = document.getElementById('inputLat');
    var inputLong = document.getElementById('inputLong');
    var inputHaut = document.getElementById('inputHaut');
    var elevator = new google.maps.ElevationService;
    var homeLabel = new google.maps.InfoWindow();

    //Init Map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat, lng},
        zoom: 18,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });
    map.setTilt(0);

    //Init Home
    //var homeIcon = 'ressources/pin.svg';
    var home = new google.maps.Marker({
        position: new google.maps.LatLng(homeLatIni, homeLngIni),
        map: map,
        title: 'Home',
        icon: homeIcon,
        draggable: true
    });

    homeLatLng=home.getPosition();
    displayLocationElevation(homeLatLng, elevator);
    setTimeout(function(){
        homeLabel.setContent('<h5>Home Position</h5><ul>' + '<li>Lat: ' + home.getPosition().lat().toFixed(6) + '</li>'
                             + '<li>Long: ' + home.getPosition().lng().toFixed(6) + '</li>'
                             + '<li>Alt: ' + homeAlt + '</li></ul>');
        homeLabel.open(map, home);

    }, 2000);


     //Init point 2
    var point2 = new google.maps.Marker({
        position: new google.maps.LatLng(pt2Lat, pt2Lng),
        map: map,
        title: 'Point 2',
        //icon: homeIcon,
        draggable: true,
        icon: blueIcon
    });
    var longueurXY = [
        {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
        {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
    ];
    var longueur = new google.maps.Polyline({
        path: longueurXY,
        geodesic: false,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    longueur.setMap(map);
    var longueurLabel = new google.maps.InfoWindow({
        content: 'Longueur: ' + longueurDist + '<br/>Angle: ' + heading
    });
    longueurLabel.open(map, point2);

    //Init Heading
    heading = (Math.PI/180 * google.maps.geometry.spherical.computeHeading(home.getPosition(), point2.getPosition())).toFixed(4);
    document.getElementById('inputAngle').value = heading;
    longueurLabel.setContent('Longueur: ' + longueurDist
                             + '<br/>Angle: ' + heading
                            );

    //Init Point 1 auto
    var pt1LatLng = google.maps.geometry.spherical.computeOffset(home.getPosition(), largeurDist, (180/Math.PI)*heading+90);
    var point1 = new google.maps.Marker({
        //position: new google.maps.LatLng(pt1Lat, pt1Lng),
        position: pt1LatLng,
        map: map,
        title: 'Point 1',
        //icon: homeIcon,
        draggable: true,
        icon: greenIcon
    });
    var largeurXY = [
        {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
        {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
    ];
    var largeur = new google.maps.Polyline({
        path: largeurXY,
        geodesic: false,
        strokeColor: '#008000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    largeur.setMap(map);
    var largeurLabel = new google.maps.InfoWindow({
        content: 'Largeur: ' + largeurDist
    });
    largeurLabel.open(map, point1);

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //HOME Bouge
    google.maps.event.addListener(home, 'drag', function() {
        homeLatLng=home.getPosition();
        document.getElementById('inputLat').value = homeLatLng.lat().toFixed(6);
        document.getElementById('inputLong').value = homeLatLng.lng().toFixed(6);
        //displayLocationElevation(homeLatLng, elevator);
        homeLabel.setContent('<h5>Home Position :</h5><ul>' + '<li>Lat: ' + home.getPosition().lat().toFixed(6) + '</li>'
                             + '<li>Long: ' + home.getPosition().lng().toFixed(6) + '</li>'
                             + '<li>Alt: ' + homeAlt + '</li></ul>');

        //bouge point 1
        var newLatLng1 = google.maps.geometry.spherical.computeOffset(home.getPosition(), largeurDist, (180/Math.PI)*heading + 90);

        point1.setPosition(newLatLng1);

        largeurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
        ];
        largeur.setPath(largeurXY);

        var newLatLng2 = google.maps.geometry.spherical.computeOffset(home.getPosition(), longueurDist, (180/Math.PI)*heading);

        point2.setPosition(newLatLng2);

        longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);

        //Actualisation segment longueur
        /*longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);
        longueurDist = google.maps.geometry.spherical.computeDistanceBetween(home.getPosition(), point2.getPosition()).toFixed(2);
        heading = (Math.PI/180 * google.maps.geometry.spherical.computeHeading(home.getPosition(), point2.getPosition())).toFixed(4);
        longueurLabel.setContent('Longueur: ' + longueurDist
                                 +'<br/>Angle: ' + heading);
        document.getElementById('inputHaut').value = longueurDist;
        document.getElementById('inputAngle').value = heading;
        */
    });

    //Home fini de bouger
    google.maps.event.addListener(home, 'dragend', function (){
        displayLocationElevation(homeLatLng, elevator);
        setTimeout(function(){
            homeLabel.setContent('<h5>Home Position :</h5><ul>' + '<li>Lat: ' + home.getPosition().lat().toFixed(6) + '</li>'
                                 + '<li>Long: ' + home.getPosition().lng().toFixed(6) + '</li>'
                                 + '<li>Alt: ' + homeAlt + '</li></ul>');
        }, 200);
    });

    //Point 1 bouge
    google.maps.event.addListener(point1, 'drag', function () {
        largeurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
        ];
        largeur.setPath(largeurXY);

        largeurDist = google.maps.geometry.spherical.computeDistanceBetween(home.getPosition(), point1.getPosition()).toFixed(2);
        largeurLabel.setContent('Largeur: ' + largeurDist);
        document.getElementById('inputLarg').value = largeurDist;


        var newLatLng2 = google.maps.geometry.spherical.computeOffset(home.getPosition(), largeurDist, (180/Math.PI)*heading + 90);

        point1.setPosition(newLatLng2);

        largeurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
        ];
        largeur.setPath(largeurXY);



    });


    //Point 2 bouge MASTER
    google.maps.event.addListener(point2, 'drag', function () {

        longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);
        heading = (Math.PI/180 * google.maps.geometry.spherical.computeHeading(home.getPosition(), point2.getPosition())).toFixed(4);
        longueurDist = google.maps.geometry.spherical.computeDistanceBetween(home.getPosition(), point2.getPosition()).toFixed(2);

        //print
        document.getElementById('inputHaut').value = longueurDist;
        document.getElementById('inputAngle').value = heading;
        longueurLabel.setContent('Longueur: ' + longueurDist
                                 + '<br/>Angle: ' + heading
                                );

        var newLatLng1 = google.maps.geometry.spherical.computeOffset(home.getPosition(), largeurDist, (180/Math.PI)*heading + 90);

        point1.setPosition(newLatLng1);

        longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);
        longueurLabel.setContent('Longueur: ' + longueurDist
                                 + '<br/>Angle: ' + heading
                                );
        largeurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
        ];
        largeur.setPath(largeurXY);


    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*ENTRE CLAVIER*/
    //Latitude
    google.maps.event.addDomListener(inputLat, 'input', function() {
        var newLat = document.getElementById('inputLat').value;
        var newLng = home.getPosition().lng();
        home.setPosition(new google.maps.LatLng(newLat, newLng));
        homeLabel.setContent('<h5>Home Position :</h5><ul>' + '<li>Lat: ' + home.getPosition().lat() + '</li>'
                             + '<li>Long: ' + home.getPosition().lng() + '</li>'
                             + '<li>Alt: ' + homeAlt + '</li></ul>');
        //Actualiser segment largeur
        largeurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
        ];
        largeur.setPath(largeurXY);
        largeurDist = google.maps.geometry.spherical.computeDistanceBetween(home.getPosition(), point1.getPosition()).toFixed(2);
        largeurLabel.setContent('Largeur: ' + largeurDist);
        document.getElementById('inputLarg').value = largeurDist;


        //Actualisation segment longueur
        longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);
        longueurDist = google.maps.geometry.spherical.computeDistanceBetween(home.getPosition(), point2.getPosition()).toFixed(2);
        heading = (Math.PI/180 * google.maps.geometry.spherical.computeHeading(home.getPosition(), point2.getPosition())).toFixed(4);
        longueurLabel.setContent('Longueur: ' + longueurDist
                                 +'<br/>Angle: ' + heading);
        document.getElementById('inputHaut').value = longueurDist;
        document.getElementById('inputAngle').value = heading;
    });


    //Longitude
    google.maps.event.addDomListener(inputLong, 'input', function() {
        var newLng = document.getElementById('inputLong').value;
        var newLat = home.getPosition().lat();
        home.setPosition(new google.maps.LatLng(newLat, newLng));
        homeLabel.setContent('<h5>Home Position :</h5><ul>' + '<li>Lat: ' + home.getPosition().lat() + '</li>'
                             + '<li>Long: ' + home.getPosition().lng() + '</li>'
                             + '<li>Alt: ' + homeAlt + '</li></ul>');
        //Actualiser segment largeur
        largeurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
        ];
        largeur.setPath(largeurXY);
        largeurDist = google.maps.geometry.spherical.computeDistanceBetween(home.getPosition(), point1.getPosition()).toFixed(2);
        largeurLabel.setContent('Largeur: ' + largeurDist);
        document.getElementById('inputLarg').value = largeurDist;

        //Actualisation segment longueur
        longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);
        longueurDist = google.maps.geometry.spherical.computeDistanceBetween(home.getPosition(), point2.getPosition()).toFixed(2);
        heading = (Math.PI/180 * google.maps.geometry.spherical.computeHeading(home.getPosition(), point2.getPosition())).toFixed(4);
        longueurLabel.setContent('Longueur: ' + longueurDist
                                 +'<br/>Angle: ' + heading);
        document.getElementById('inputHaut').value = longueurDist;
        document.getElementById('inputAngle').value = heading;
    });
    //Altitude
    google.maps.event.addDomListener(inputAltHome, 'input', function() {
        homeAlt = document.getElementById('inputAltHome').value;
        homeLabel.setContent('<h5>Home Position: </h5><ul>' + '<li>Lat: ' + home.getPosition().lat() + '</li>'
                             + '<li>Long: ' + home.getPosition().lng() + '</li>'
                             + '<li>Alt: ' + homeAlt + '</li></ul>');
    });

    //Point 2 - longueur - Ancre
    google.maps.event.addDomListener(inputHaut, 'input', function() {
        longueurDist = document.getElementById('inputHaut').value;
        var newLatLng2 = google.maps.geometry.spherical.computeOffset(home.getPosition(), longueurDist, (180/Math.PI)*heading);
        point2.setPosition(newLatLng2);
        longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);
        longueurLabel.setContent('Longueur: ' + longueurDist
                                 + '<br/>Angle: ' + heading
                                );
    });

    //Angle
    google.maps.event.addDomListener(inputAngle, 'input', function() {
        heading = document.getElementById('inputAngle').value;
        var newLatLngA = google.maps.geometry.spherical.computeOffset(home.getPosition(), longueurDist, (180/Math.PI)*heading);
        var newLatLng2 = google.maps.geometry.spherical.computeOffset(home.getPosition(), largeurDist, (180/Math.PI)*heading + 90);

        point2.setPosition(newLatLngA);
        point1.setPosition(newLatLng2);

        longueurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point2.getPosition().lat(), lng: point2.getPosition().lng()}
        ];
        longueur.setPath(longueurXY);
        longueurLabel.setContent('Longueur: ' + longueurDist
                                 + '<br/>Angle: ' + heading
                                );

        largeurXY = [
            {lat: home.getPosition().lat(), lng: home.getPosition().lng()},
            {lat: point1.getPosition().lat(), lng: point1.getPosition().lng()}
        ];
        largeur.setPath(largeurXY);
    });
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //Ouverture fenêtre quand on clique dessus
    point1.addListener('click', function (){
        largeurLabel.open(map, point1);
    });
    point2.addListener('click', function (){
        longueurLabel.open(map, point2);
    })
    home.addListener('click', function (){
        homeLabel.open(map, home);
    })

}//fin initmap

function displayLocationElevation(location, elevator) {
    // Initiate the location request
    elevator.getElevationForLocations({
        'locations': [location]
    }, function(results, status) {
        if (status === google.maps.ElevationStatus.OK) {
            // Retrieve the first result
            if (results[0]) {
                // Open the infowindow indicating the elevation at the clicked position.
                document.getElementById('inputAltHome').value = results[0].elevation.toFixed(2);
                homeAlt = results[0].elevation.toFixed(2);
                //infowindow.setContent('The elevation at this point <br>is ' + results[0].elevation + ' meters.');
            } else {
                console.log('No results found');
            }
        } else {
            console.log('Elevation service failed due to: ' + status);
        }
    });
}
