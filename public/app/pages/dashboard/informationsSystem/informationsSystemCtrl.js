
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('informationsSystemCtrl',  informationsSystemCtrl);

  /** @ngInject */
  function informationsSystemCtrl($http, $scope, dashboardInformationsSystemFactorySocket, dashboardInformationsSystemService){

    var map;
    var dronePosition;

    dashboardInformationsSystemService.getLogGroundStation()
      .success(function(informations){
        $scope.doorState = informations[0].doorState;
        $scope.elevatorState = informations[0].elevatorState;
        $scope.weatherInfos =new Object();
        if(informations[0].weatherInfos.rain){
          $scope.weatherInfos.rain = "Yes"
        }
        else{
          $scope.weatherInfos.rain = "No"
        }
        $scope.weatherInfos.wind = informations[0].weatherInfos.wind
        $scope.weatherInfos.humidity = informations[0].weatherInfos.humidity
        $scope.weatherInfos.temperature = informations[0].weatherInfos.temperature
        $scope.batteriesInfos = new Array()
        for(var i=0; i<4; i++)
        {
          $scope.batteriesInfos[i] = new Object()
          $scope.batteriesInfos[i].batterySlot = informations[0].batteriesInfos[i].batterySlot
          $scope.batteriesInfos[i].batteryVoltage = informations[0].batteriesInfos[i].batteryVoltage
        }

        $scope.boxInfos = new Object()
        $scope.boxInfos.humidity = informations[0].boxInfos.humidity
        $scope.boxInfos.temperature = informations[0].boxInfos.temperature
        $scope.boxInfos.pressure = (informations[0].boxInfos.pressure)/100

        imageManager();

        console.log($scope.doorState);
        console.log($scope.doorImage);
      })
      .error(function(error){
        console.log("Impossible de récupérer log de la ground Station" + error);
      })

    dashboardInformationsSystemService.getLogDrone()
      .success(function(informations){

        $scope.drone = new Object();

        var mapCanvas = document.getElementById('google-maps-drone-location');
        var mapOptions = {
          center: new google.maps.LatLng(informations.position.latitude,informations.position.longitude),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
        $scope.drone.mapLocationDisplay = "display:none"

        if(informations.landed){
          if(informations.idMission == "none"){
            $scope.drone.state = "Landed";
          }
          else{
            $scope.drone.state = "Launching mission";
          }
          dronePosition = new google.maps.Marker({
             position : new google.maps.LatLng(0, 0),
             map: map
           })
        }
        //if the drone is flying
        else{
          $scope.drone.state = "In Flight"
          $scope.drone.mapLocationDisplay = "display:block"
          dronePosition = new google.maps.Marker({
             position : new google.maps.LatLng(informations.position.latitude, informations.position.longitude),
             map: map
           })
        }

        if(informations.idMission == "none"){
          $scope.drone.missionTitle = "No mission loaded";
        }
        else{
          $scope.drone.missionTitle = informations.missionTitle;
        }
        $scope.drone.batteryLevel = informations.batteryLevel;
        $scope.drone.position = informations.position;

        imageManager();

      })
      .error(function(error){
        console.log(error);
      })

      dashboardInformationsSystemFactorySocket.on('logGroundStation',function(log){
        $scope.doorState = log.doorState;
        $scope.elevatorState = log.elevatorState;
        $scope.weatherInfos =new Object();
        if(log.weatherInfos.rain){
          $scope.weatherInfos.rain = "Yes"
        }
        else{
          $scope.weatherInfos.rain = "No";
        }

        $scope.weatherInfos.wind = log.weatherInfos.wind
        $scope.weatherInfos.humidity = log.weatherInfos.humidity
        $scope.weatherInfos.temperature = log.weatherInfos.temperature
        $scope.batteriesInfos = new Array()
        for(var i=0; i<4; i++)
        {
          $scope.batteriesInfos[i] = new Object()
          $scope.batteriesInfos[i].batterySlot = log.batteriesInfos[i].batterySlot
          $scope.batteriesInfos[i].batteryVoltage = log.batteriesInfos[i].batteryVoltage
          console.log(JSON.stringify($scope.batteriesInfos[i]))
        }

        $scope.boxInfos = new Object()
        $scope.boxInfos.humidity = log.boxInfos.humidity
        $scope.boxInfos.temperature = log.boxInfos.temperature
        $scope.boxInfos.pressure = (log.boxInfos.pressure)/100

        imageManager();

      })

      dashboardInformationsSystemFactorySocket.on('logDrone',function(log){

        $scope.drone = new Object();

        console.log("live log drone:" + JSON.stringify(log));

        if(log.landed){
          if(log.idMission == "none"){
            $scope.drone.state = "Landed";
          }
          else{
            $scope.drone.state = "Launching mission";
          }
          $scope.drone.mapLocationDisplay = "display:none"
        }
        else{
          $scope.drone.state = "In Flight"
          $scope.drone.mapLocationDisplay = "display:block"
          dronePosition.setMap(null);
          dronePosition = new google.maps.Marker({
             position : new google.maps.LatLng(log.position.latitude, log.position.longitude),
             map: map
           })
        }

        if(log.idMission == "none"){
          $scope.drone.idMission = "No mission loaded";
        }
        else{
          $scope.drone.idMission = log.idMission;
        }
        $scope.drone.batteryLevel = log.batteryLevel;
        $scope.drone.position = log.position;
        $scope.drone.missionTitle = log.missionTitle;

        imageManager();

      })

      dashboardInformationsSystemFactorySocket.on('connect',function(message){
        console.log("connected to the server via socket.io");
      });

      function imageManager(){
        switch($scope.doorState){
          case "open":
            $scope.doorImage = 'openBox'
            break;

          case "close":
            $scope.doorImage = 'closeBox'
            break;

          case "opening":
            $scope.doorImage = 'openingBox'
            break;

          case "closing":
            $scope.doorImage = 'closingBox'
            break;

          default:
            $scope.doorImage = ''
        }

        for(var i = 0; i < 4; i++){
          if($scope.batteriesInfos[i].batteryVoltage < 0){
            $scope.batteriesInfos[i].batteryImage = "noBattery"
          }
          else if($scope.batteriesInfos[i].batteryVoltage < (9.9 + 0.54 * 1)){
            $scope.batteriesInfos[i].batteryImage = "batteryLow"
          }
          else if($scope.batteriesInfos[i].batteryVoltage < (9.9 + 0.54 * 2)){
            $scope.batteriesInfos[i].batteryImage = "batteryMedium"
          }
          else if($scope.batteriesInfos[i].batteryVoltage < (9.9 + 0.54 * 3)){
            $scope.batteriesInfos[i].batteryImage = "batteryAverage"
          }
          else if($scope.batteriesInfos[i].batteryVoltage < (9.9 + 0.54 * 4)){
            $scope.batteriesInfos[i].batteryImage = "batteryHigh"
          }
          else {
            $scope.batteriesInfos[i].batteryImage = "batteryFull"
          }
        }

        switch ($scope.drone.state) {
          case "Launching mission":
              $scope.drone.stateImage = 'drone-launch'
            break;
          case "In Flight":
              $scope.drone.stateImage = 'drone-fly'
            break;
          case "Landed":
              $scope.drone.stateImage = 'drone-land'
            break;
          default:
            $scope.drone.stateImage = ''
        }

        if($scope.drone.batteryLevel < 0){
          $scope.drone.batteryImage = "noBattery"
        }
        else if($scope.drone.batteryLevel < (9.9 + 0.54 * 1)){
          $scope.drone.batteryImage = "batteryLow"
        }
        else if($scope.drone.batteryLevel < (9.9 + 0.54 * 2)){
          $scope.drone.batteryImage = "batteryMedium"
        }
        else if($scope.drone.batteryLevel < (9.9 + 0.54 * 3)){
          $scope.drone.batteryImage = "batteryAverage"
        }
        else if($scope.drone.batteryLevel < (9.9 + 0.54 * 4)){
          $scope.drone.batteryImage = "batteryHigh"
        }
        else {
          $scope.drone.batteryImage = "batteryFull"
        }
      }

      // function initMapDroneLocation(){
      //   var mapCanvas = document.getElementById('google-maps-drone-location');
      //   var mapOptions = {
      //     center: new google.maps.LatLng(informations.position.latitude,informations.position.longitude),
      //     zoom: 16,
      //     mapTypeId: google.maps.MapTypeId.ROADMAP
      //   };
      //   var map = new google.maps.Map(mapCanvas, mapOptions);
      //   $scope.drone.mapLocationDisplay = "display:none"
      // }
      //
      // $timeout(function(){
      //   initMapDroneLocation();
      // }, 1000);
  }
} )();
