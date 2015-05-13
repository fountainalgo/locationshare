angular.module('LoginCtrl')
  .factory('Account', function($http) {
    return {
      getProfile: function() {
        console.log("I am in");
        return $http.get('/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      }
    };
  });