(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
      .filter('batteryPurcentageFilter', [batteryPurcentageFilter]);

  /** @ngInject */
  function batteryPurcentageFilter() {
    return function(input, minVoltage, maxVoltage){
      if(isNaN(input)){
        return input;
      }
      else{

        if(input < 0){
          return "No battery"
        }

        else{
          var actualMinVoltage = minVoltage || 9.9;
          var actualMaxVoltage = maxVoltage || 12.6;
          var purcentageBattery = ((input - actualMinVoltage)/(actualMaxVoltage - actualMinVoltage)) * 100;

          if(purcentageBattery < 0){
            purcentageBattery = 0;
          }
          else if(purcentageBattery > 100){
            purcentageBattery = 100;
          }

          return 'Level: ' + Math.round(purcentageBattery) + '%';
        }
      }
    }
  }
})();
