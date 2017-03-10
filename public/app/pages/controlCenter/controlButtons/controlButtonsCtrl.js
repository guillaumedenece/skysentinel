
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.controlCenter')
      .controller('controlButtonsCtrl',  controlButtonsCtrl);

  /** @ngInject */
  function controlButtonsCtrl($http, $timeout, $scope, controlCenterControlButtonsService){
    
    $scope.executeGroundStationAction = function(deviceTarget, action){
      controlCenterControlButtonsService.executeGroundStationAction(deviceTarget, action)
        .success(function(data){
        })
        .error(function(error){
          console.log(error)
        })
        return $timeout(function() {}, 500);
    }

    $scope.executeDroneAction = function(commandType, action){
      controlCenterControlButtonsService.executeDroneAction(commandType, action)
        .success(function(data){
        })
        .error(function(error){
          console.log(error)
        })
        return $timeout(function() {}, 500);
    }
  }
} )();
