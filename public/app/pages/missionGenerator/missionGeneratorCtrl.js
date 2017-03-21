
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionGenerator')
      .controller('missionGeneratorCtrl',  missionGeneratorCtrl);

  /** @ngInject */
  function missionGeneratorCtrl($scope){

    $scope.today = new Date();

  }

} )();
