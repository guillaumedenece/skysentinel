(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .service('missionManagerService', ['$http',missionManagerService]);

  /** @ngInject */
  function missionManagerService($http) {
    
    this.getMissionsPlanned=function(){
          console.log("requete missionsPlanned");
          return $http.get('/missions/missionManager/getMissionsPlanned');
      }
    }
})();
