
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionGenerator')
      .controller('missionGeneratorCtrl',  missionGeneratorCtrl);

  /** @ngInject */
  function missionGeneratorCtrl($scope){

    console.log("controller mission");

    $scope.today = function GetFormattedDate() {
      var todayTime = Date.now();
      var  month = format(todayTime .getMonth() + 1);
      var day = format(todayTime .getDate());
      var year = format(todayTime .getFullYear());
      console.log(year + "-" + month + "-" + day);
      return year + "-" + month + "-" + day;
    }

  }

} )();
