angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider,$stateProvider, $urlRouterProvider, $authProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/nerds', {
			templateUrl: 'views/nerd.html',
			controller: 'NerdController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		})
		.when('/location', {
			templateUrl: 'views/location.html',
			controller: 'LocationController',
	        resolve: {
	          authenticated: function($q, $location, $auth) {
	            var deferred = $q.defer();

	            if (!$auth.isAuthenticated()) {
	              $location.path('/login');
	            } else {
	              deferred.resolve();
	            }

	            return deferred.promise;
	          }
	        }				
		})		
		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginController'	
		})
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupController'
      })
      .when('/logout', {
        template: null,
        controller: 'LogoutController'
      })
		.when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileController',
        resolve: {
          authenticated: function($q, $location, $auth) {
            var deferred = $q.defer();

            if (!$auth.isAuthenticated()) {
              $location.path('/login');
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        }
      }); 
		$locationProvider.html5Mode(true);

}]);