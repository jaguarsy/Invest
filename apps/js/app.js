"use strict"

var permission,
	app = angular.module('testApp', ['ngRoute', 'ngCookies']);

app.run([function() {

	}])
	.config([
		'$routeProvider',
		'$locationProvider',
		function($routeProvider, $locationProvider, $httpProvider) {
			$routeProvider
				.when('/', {
					templateUrl: 'apps/views/list.html',
					controller: 'accountCtrl',
					resolve: {
						permission: function(permissions, $location) {
							if (!permissions.isAuthorized()) {
								$location.path('/login');
							}
						}
					}
				})
				.when('/login', {
					templateUrl: 'apps/views/login.html',
					controller: 'accountCtrl',
					resolve: {
						permission: function(permissions, $location) {
							if (permissions.isAuthorized()) {
								$location.path('/');
							}
						}
					}
				})
				.when('/register', {
					templateUrl: 'apps/views/register.html',
					controller: 'accountCtrl'
				})
				.when('/user', {
					templateUrl: 'apps/views/user.html',
					controller: 'userCtrl'
				})
				.when('/usershow/:id', {
					templateUrl: 'apps/views/usershow.html',
					controller: 'usershowCtrl'
				})
				.when('/userlist', {
					templateUrl: 'apps/views/userlist.html',
					controller: 'userlistCtrl'
				})
				.when('/project', {
					templateUrl: 'apps/views/project.html',
					controller: 'projectCtrl'
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