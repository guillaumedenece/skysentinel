(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .controller('mapCtrl', mapCtrl);

  /** @ngInject */
  function mapCtrl($timeout, $scope, mapService) {

    $scope.init = function(mission) {

      $timeout(function(mission){
        console.log(mission);

        var marker = new Array();

        console.log('google-maps-' + mission._id);

        var mapCanvas = document.getElementById('google-maps-' + mission._id);
        var mapOptions = {
          center: new google.maps.LatLng(mission.missionMapPoints[0].lat, mission.missionMapPoints[0].lng),
          zoom: 11,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);

        for(var i= 0; i < mission.missionMapPoints.length; i++){
         marker = new google.maps.Marker({
            position : new google.maps.LatLng(mission.missionMapPoints[i].lat, mission.missionMapPoints[i].lng),
            map: map
          })
          console.log(i + " lat: " + mission.missionMapPoints[i].lat + " long :" +  mission.missionMapPoints[i].lng);
        }
      },100);

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
