(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .controller('mapCtrl', mapCtrl);

  /** @ngInject */
  function mapCtrl($timeout, $scope) {

    $scope.init = function(mission) {

      var marker = new Array();

      var mapCanvas = document.getElementById('google-maps');
      var mapOptions = {
        center: new google.maps.LatLng(44.5403, -78.5463),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(mapCanvas, mapOptions);

      for(var i= 0; i < mission.missionWayPoints.length; i++){
        marker[i] = new google.maps.Marker({
          position : new google.maps.LatLng(mission.missionWayPoints[i].lat, mission.missionWayPoints[i].lng),
          map: map
        })
      }

      var marker = new google.maps.Marker({
        position : new google.maps.LatLng(44.5403, -78.5463),
        map: map
      })
    }

    // $timeout(function(){
    //   initialize();
    // }, 100);
  }

})();
