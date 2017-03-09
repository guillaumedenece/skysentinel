
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.controlCenter')
      .directive('controlCenterControlButtons', controlCenterControlButtons);

  /** @ngInject */
  function controlCenterControlButtons() {
    return {
      restrict: 'E',
      controller: 'controlButtonsCtrl',
      templateUrl: 'app/pages/controlCenter/controlButtons/controlButtons.html'
    };
  }
})();
