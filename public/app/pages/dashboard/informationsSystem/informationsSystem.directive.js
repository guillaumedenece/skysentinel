/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .directive('dashboardInformationsSystem', dashboardInformationsSystem);

  /** @ngInject */
  function dashboardInformationsSystem() {
    return {
      restrict: 'E',
      controller: 'informationsSystemCtrl',
      templateUrl: 'app/pages/dashboard/informationsSystem/informationsSystem.html'
    };
  }
})();
