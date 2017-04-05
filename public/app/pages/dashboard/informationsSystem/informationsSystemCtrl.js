
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('informationsSystemCtrl',  informationsSystemCtrl);

  /** @ngInject */
  function informationsSystemCtrl($http, $scope, dashboardInformationsSystemFactorySocket, dashboardInformationsSystemService){

    dashboardInformationsSystemService.getLogGroundStation()
      .success(function(informations){
        $scope.doorState = informations[0].doorState;
        $scope.elevatorState = informations[0].elevatorState;
        $scope.weatherInfos =new Object();
        $scope.weatherInfos.rain = informations[0].weatherInfos.rain
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
        if(informations[0].landed){
          if(informations[0].idMission == "none"){
            $scope.drone.state = "Landed";
          }
          else{
            $scope.drone.state = "Launching mission";
          }
        }
        else{
          $scope.drone.state = "In Flight"
        }

        if(informations[0].idMission == "none"){
          $scope.drone.idMission = "No mission loaded";
        }
        else{
          $scope.drone.idMission = informations[0].idMission;
        }
        $scope.drone.batteryLevel = informations[0].batteryLevel;
        $scope.drone.position = informations[0].position;

        $scope.stateDroneImage = "launch"

        switch ($scope.drone.state) {
          case "Launching mission":
              $scope.drone.stateImage = 'launch-dashboard'
            break;
          case "In Flight":
              $scope.drone.stateImage = ''
            break;
          case "Landed":
              $scope.drone.stateImage = ''
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

      })
      .error(function(error){
        console.log(error);
      })

      dashboardInformationsSystemFactorySocket.on('logGroundStation',function(log){
        $scope.doorState = log.doorState;
        $scope.elevatorState = log.elevatorState;
        $scope.weatherInfos =new Object();
        $scope.weatherInfos.rain = log.weatherInfos.rain
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

        console.log("log drone received " + log.time);


        $scope.drone = new Object();
        if(log.landed){
          if(log.idMission == "none"){
            $scope.drone.state = "Landed";
          }
          else{
            $scope.drone.state = "Launching mission";
          }
        }
        else{
          $scope.drone.state = "In Flight"
        }

        if(log.idMission == "none"){
          $scope.drone.idMission = "No mission loaded";
        }
        else{
          $scope.drone.idMission = log.idMission;
        }
        $scope.drone.batteryLevel = log.batteryLevel;
        $scope.drone.position = log.position;

        $scope.stateDroneImage = "launch"

        switch ($scope.drone.state) {
          case "Launching mission":
              $scope.drone.stateImage = 'launch-dashboard'
            break;
          case "In Flight":
              $scope.drone.stateImage = ''
            break;
          case "Landed":
              $scope.drone.stateImage = ''
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

      }
  }
} )();
