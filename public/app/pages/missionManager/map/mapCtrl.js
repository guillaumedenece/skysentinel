(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .controller('mapCtrl', mapCtrl);

  /** @ngInject */
  function mapCtrl($timeout, $scope) {

    $scope.init = function(test){
      $scope.hello = test;
    }

    function initialize() {
      var mapCanvas = document.getElementById('google-maps');
      var mapOptions = {
        center: new google.maps.LatLng(44.5403, -78.5463),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(mapCanvas, mapOptions);

      var marker = new google.maps.Marker({
        position : new google.maps.LatLng(44.5403, -78.5463),
        map: map
      })
    }

    $timeout(function(){
      initialize();
    }, 100);
  }

})();
