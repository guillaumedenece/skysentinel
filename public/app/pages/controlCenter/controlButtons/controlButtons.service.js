(function () {
  'use strict';

  angular.module('BlurAdmin.pages.controlCenter')
      .service('controlCenterControlButtonsService', ['$http',controlCenterControlButtonsService]);

  /** @ngInject */
  function controlCenterControlButtonsService($http) {

    this.executeGroundStationAction=function(deviceTarget, action){
      switch (deviceTarget) {
        case "door":
            return $http.get('/groundStation/actions/door/' + action);
          break;
        case "wheel":
          return $http.get('/groundStation/actions/wheel/' + action);
        break;
        case "system":
          return $http.get('/groundStation/actions/system/' + action);
        break;
        case "elevator":
          return $http.get('/groundStation/actions/elevator/' + action);
        break;
        default:
          console.log("the device target doesn't exist on the groundStation");
      }
    }

    this.executeDroneAction=function(commandType, action){
      switch (commandType) {
        case "mission":
          return $http.get('/drone/actions/mission/' + action);
        break;
        case "control":
          return $http.get('/drone/actions/control/' + action);
        break;
        default:
          console.log("the device target doesn't exist on the drone");
      }
    }
  }
})();
