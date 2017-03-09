
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.controlCenter')
      .controller('controlButtonsCtrl',  controlButtonsCtrl);

  /** @ngInject */
  function controlButtonsCtrl($http, $timeout, $scope, controlCenterControlButtonsService){
    $scope.executeDoorAction = function(action){

      controlCenterControlButtonsService.executeDoorAction(action)
        .success(function(data){
        })
        .error(function(error){
          console.log(error)
        })
        return $timeout(function() {}, 1000);
    }
  }
} )();
