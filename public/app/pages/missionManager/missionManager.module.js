/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('missionManager', {
          url: '/missionManager',
          templateUrl: 'app/pages/missionManager/missionManager.html',
          title: 'Mission Manager',
          sidebarMeta: {
            icon: 'ion-ios-speedometer-outline',
            order: 4,
          },
        });
  }

})();
