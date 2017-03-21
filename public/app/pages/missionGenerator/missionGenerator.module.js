/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionGenerator', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('missionGenerator', {
          url: '/missionGenerator',
          templateUrl: 'app/pages/missionGenerator/missionGenerator.html',
          title: 'Mission generator',
          sidebarMeta: {
            icon: 'ion-map',
            order: 3,
          },
        });
  }

})();
