angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'NerdCtrl', 'NerdService', 'GeekCtrl', 'MapCtrl','ngMap','satellizer','GeekService','LoginCtrl']).config(function($authProvider) {
	$authProvider.facebook({
	  clientId:'935029729873089'
	});
})