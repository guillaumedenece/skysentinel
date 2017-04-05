/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionHistory', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('missionHistory', {
          url: '/missionHistory',
          templateUrl: 'app/pages/missionHistory/missionHistory.html',
          title: 'Mission History',
          sidebarMeta: {
            icon: 'ion-ios-calendar-outline',
            order: 5,
          },
        });
  }

})();
