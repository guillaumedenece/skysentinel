
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
