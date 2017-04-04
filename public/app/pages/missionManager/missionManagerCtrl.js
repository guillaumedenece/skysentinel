
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .controller('missionManagerCtrl',  missionManagerCtrl);

  /** @ngInject */
  function missionManagerCtrl($http, $timeout, $scope, missionManagerService){

    // get missions planned
      missionManagerService.getMissionsPlanned()
        .success(function(missionsPlanned){
          $scope.missionsPlanned = missionsPlanned;
        })
        .error(function(error){
          console.log(error);
        })

    }
  })();
