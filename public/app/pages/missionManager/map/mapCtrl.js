(function () {
  'use strict';

  angular.module('BlurAdmin.pages.missionManager')
      .controller('mapCtrl', mapCtrl);

  /** @ngInject */
  function mapCtrl($timeout, $scope, mapService) {

    function init() {

      for(var j=0; j<$scope.missionsPlanned.length; j++){

      console.log($scope.missionsPlanned[j].missionDescription);

      var mapCanvas = document.getElementById('google-maps-' + $scope.missionsPlanned[j]._id);

      console.log('google-maps-' + $scope.missionsPlanned[j]._id);

      var mapOptions = {
        center: new google.maps.LatLng($scope.missionsPlanned[j].missionMapPoints[0].lat, $scope.missionsPlanned[j].missionMapPoints[0].lng),
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(mapCanvas, mapOptions);

      for(var i= 0; i < $scope.missionsPlanned[j].missionMapPoints.length; i++){
       var marker = new google.maps.Marker({
          position : new google.maps.LatLng($scope.missionsPlanned[j].missionMapPoints[i].lat, $scope.missionsPlanned[j].missionMapPoints[i].lng),
          map: map
        })
      }
    }
  }

    //get missions planned
      mapService.getMissionsPlanned()
        .success(function(missionsPlanned){
          $scope.missionsPlanned = missionsPlanned;
          for(var i=0; i<missionsPlanned.length;i++){
            if(!missionsPlanned[i].missionDescription){
              $scope.missionsPlanned[i].displayDescription = "display:none";
              console.log("none");
            }
          }
        })
        .error(function(error){
          console.log(error);
        })

    $timeout(function(){
      init();
    }, 100);
  }})();
