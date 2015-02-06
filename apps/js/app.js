"use strict"

var permission,
	app = angular.module('testApp', ['ngRoute', 'ngCookies']);

app.run([function() {

	}])
	.config([
		'$routeProvider',
		'$locationProvider',
		'$httpProvider',
		function($routeProvider, $locationProvider, $httpProvider) {
			$httpProvider.interceptors.push("redirectService");

			$routeProvider
				.when('/', {
					templateUrl: 'apps/views/list.html',
					controller: 'listCtrl',
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
				.when('/setting', {
					templateUrl: 'apps/views/setting.html',
					controller: 'settingCtrl'
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
				.when('/project/:id', {
					templateUrl: 'apps/views/project.html',
					controller: 'projectCtrl'
				})
				.when('/myproject', {
					templateUrl: 'apps/views/myproject.html',
					controller: 'myProjectCtrl'
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