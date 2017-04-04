(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .controller('mapCtrl', mapCtrl);

  /** @ngInject */
  function mapCtrl($timeout, $scope, mapService) {

    $scope.init = function(mission) {

      console.log(mission);

      var marker = new Array();

      var mapCanvas = document.getElementById('google-maps')//-' + mission._id);
      var mapOptions = {
        center: new google.maps.LatLng(mission.missionWayPoints[0].lat, mission.missionWayPoints[0].lng),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(mapCanvas, mapOptions);

      for(var i= 0; i < mission.missionWayPoints.length; i++){
       marker = new google.maps.Marker({
          position : new google.maps.LatLng(mission.missionWayPoints[i].lat, mission.missionWayPoints[i].lng),
          map: map
        })
        console.log(i + " lat: " + mission.missionWayPoints[i].lat + " long :" +  mission.missionWayPoints[i].lng);
      }

      // var marker = new google.maps.Marker({
      //   position : new google.maps.LatLng(44.5403, -78.5463),
      //   map: map
      // })
    }

    //get missions planned
      mapService.getMissionsPlanned()
        .success(function(missionsPlanned){
          $scope.missionsPlanned = missionsPlanned;
        })
        .error(function(error){
          console.log(error);
        })

    // $timeout(function(){
    //   initialize();
    // }, 100);
  }

})();
