(function () {
  'use strict';

  angular.module('BlurAdmin.pages.logs', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('logs', {
          url: '/logs',
          abstract: true,
          title: 'Logs',
          sidebarMeta: {
            icon: 'ion-settings',
            order: 500,
          },
        })
        .state('logs.logsGroundStation', {
          url: '/groundStation',
          title: 'Logs Ground Station',
          sidebarMeta: {
            order: 0,
          },
        })
        .state('logs.logsDrone', {
          url: '/drone',
          title: 'Logs Drone',
          sidebarMeta: {
            order: 100,
          },
        });
  }

})();
