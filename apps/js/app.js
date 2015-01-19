"use strict"

var app = angular.module('testApp', ['ngRoute']),
	permission;

app.run(['permissions', function(permissions) {
		permissions.authorize(permission)
	}])
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'apps/views/user.html',
					controller: 'accountCtrl',
					resolve: {
						permission: function(permissions,$location) {
							if(!permissions.isAuthorized()){
								$location.path('/login');
							}
						}
					}
				})
				.when('/login', {
					templateUrl: 'apps/views/login.html',
					controller: 'accountCtrl'
				})
				.when('/register', {
					templateUrl: 'apps/views/register.html',
					controller: 'accountCtrl'
				})
				.when('/user', {
					templateUrl: 'apps/views/user.html',
					controller: 'userCtrl'
				})
		}
	])

angular.element(document).ready(function() {
	// $.get('/api/UserPermission', function(data) {
	// 	permission = data;
	// 	angular.bootstrap(document, ['App']);
	// });
	permission = false;
	angular.bootstrap(document, ['testApp']);
});