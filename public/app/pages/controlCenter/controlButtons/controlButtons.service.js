(function () {
  'use strict';

  angular.module('BlurAdmin.pages.controlCenter')
      .service('controlCenterControlButtonsService', ['$http',controlCenterControlButtonsService]);

  /** @ngInject */
  function controlCenterControlButtonsService($http) {
    this.executeDoorAction=function(action){
      return $http.get('/groundStation/actions/door/' + action);
    }
  }
})();
