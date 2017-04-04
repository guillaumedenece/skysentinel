(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .directive('missionManagerMap', missionManagerMap);

  /** @ngInject */
  function missionManagerMap() {
    return {
      restrict: 'E',
      controller: 'mapCtrl'
      // templateUrl: 'app/pages/missionManager/map/map.html'
    };
  }
})();
