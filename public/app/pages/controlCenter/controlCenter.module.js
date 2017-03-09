/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.controlCenter', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('controlCenter', {
          url: '/controlCenter',
          templateUrl: 'app/pages/controlCenter/controlCenter.html',
          title: 'Control Center',
          sidebarMeta: {
            icon: 'ion-ios-game-controller-a',
            order: 1,
          },
        });
  }

})();
