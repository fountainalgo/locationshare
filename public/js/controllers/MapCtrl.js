angular.module('MapCtrl', []).controller('LocationController', function($scope,$http,Account) {
    $scope.getProfile = function() {
      Account.getProfile()
        .success(function(data) {
          $scope.user = data;
        })
        .error(function(error) {
            console.log(error);
        });
    };
	$scope.getProfile();    
	$scope.openInfo=function(){	
		var locationData = {};
		navigator.geolocation.getCurrentPosition(function(position) {
				console.log("Debug",$scope.user)
				var geocoder = new google.maps.Geocoder();
				var currLatLong= new google.maps.LatLng(position.coords.latitude, position.coords.longitude )
				geocoder.geocode( {'latLng': currLatLong},function(results,status){
					if(status==="OK"){
						locationData.lat = position.coords.latitude;
						locationData.lon = position.coords.longitude;
						locationData.address = results[0].formatted_address;
						locationData._id = $scope.user._id
						console.log(locationData);
						return $http.put('/api/currentlocation', locationData);
					}
				})
		})
	}

});