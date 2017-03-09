
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('informationsSystemCtrl',  informationsSystemCtrl);

  /** @ngInject */
  function informationsSystemCtrl($http, $scope, dashboardInformationsSystemFactorySocket, dashboardInformationsSystemService){

    dashboardInformationsSystemService.getLogGroundStation()
      .success(function(informations){
        $scope.doorState = informations[0].doorState;
        if($scope.doorState == "open")
        {
          $scope.doorImage = 'openBox'
        }
        else if($scope.doorState == "close")
        {
          $scope.doorImage = 'closeBox'
        }
        console.log($scope.doorState);
        console.log($scope.doorImage);
      })
      .error(function(error){
        console.log("Impossible de récupérer log de la ground Station" + error);
      })

      dashboardInformationsSystemFactorySocket.on('logGroundStation',function(log){
        $scope.doorState = log.doorState;
        if($scope.doorState == "open")
        {
          $scope.doorImage = 'openBox'
        }
        else if($scope.doorState == "close")
        {
          $scope.doorImage = 'closeBox'
        }
      })

      dashboardInformationsSystemFactorySocket.on('connect',function(message){
        console.log("connected to the server via socket.io");
      });

  }
} )();
