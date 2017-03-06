
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .controller('informationsSystemCtrl', informationsSystemCtrl);

  /** @ngInject */
  function informationsSystemCtrl($http, $scope, dashboardInformationsSystemService){

    // $scope.log.door = new Object();
    $scope.test = "test en dur"
    console.log($scope.test);

    dashboardInformationsSystemService.getLogGroundStation()
      .success(function(informations){
        $scope.log = informations[0].doorState;
        console.log($scope.log);
      })
      .error(function(error){
        console.log("Impossible de récupérer log de la ground Station" + error);
      })
  }
} )();
