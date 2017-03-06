(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .service('dashboardInformationsSystemService', ['$http',dashboardInformationsSystemService]);

  /** @ngInject */
  function dashboardInformationsSystemService($http) {
    this.getLogGroundStation=function(){
      return $http.get('/groundStation/informations');
    }
  }
})();
