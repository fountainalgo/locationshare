angular.module('LoginCtrl',[]).controller('LoginController', function($scope, $auth) {
    $scope.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
          /*$alert({
            content: 'You have successfully logged in',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
          console.log("You have successfully logged in");
        })
        .catch(function(response) {
          /*$alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
          console.log(response.data.message)
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          /*$alert({
            content: 'You have successfully logged in',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
        console.log("You have successfully logged in")

        })
        .catch(function(response) {
          /*$alert({
            content: response.data ? response.data.message : response,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
            console.log("Debug",response,response.data ? response.data.message : response);
        });
    };
  });

angular.module('LoginCtrl')
  .controller('LogoutController', function($auth) {
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
      .then(function() {
        /*$alert({
          content: 'You have been logged out',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });*/
      console.log('You have been logged out');
      });
  });
angular.module('LoginCtrl')
  .controller('ProfileController', function($scope, $auth, Account) {

    /**
     * Get user's profile information.
     */
    $scope.getProfile = function() {
      Account.getProfile()
        .success(function(data) {
          console.log(data);
          $scope.user = data;
        })
        .error(function(error) {
            console.log(error);
        });
    };


    /**
     * Update user's profile information.
     */
    $scope.updateProfile = function() {
      Account.updateProfile({
        displayName: $scope.user.displayName,
        email: $scope.user.email
      }).then(function() {
        /*$alert({
          content: 'Profile has been updated',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });*/
        console.log('Profile has been updated');
      });
    };

    /**
     * Link third-party provider.
     */
    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          /*$alert({
            content: 'You have successfully linked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
          console.log('You have successfully linked ' + provider + ' account')
        })
        .then(function() {
          $scope.getProfile();
        })
        .catch(function(response) {
          /*$alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
        console.log(response.data.message)
        });
    };

    /**
     * Unlink third-party provider.
     */
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          /*$alert({
            content: 'You have successfully unlinked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
          console.log('You have successfully unlinked ' + provider + ' account')
        })
        .then(function() {
          $scope.getProfile();
        })
        .catch(function(response) {
          /*$alert({
            content: response.data ? response.data.message : 'Could not unlink ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });*/
          console.log(response.data ? response.data.message : 'Could not unlink ' + provider + ' account')
        });
    };

    $scope.getProfile();

  });

 