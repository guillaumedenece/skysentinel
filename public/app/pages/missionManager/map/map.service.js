(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .service('mapService', ['$http',mapService]);

  /** @ngInject */
  function mapService($http) {

    this.getMissionsPlanned=function(){
          console.log("requete missionsPlanned");
          return $http.get('/missions/missionManager/getMissionsPlanned');
      }
    }
})();
