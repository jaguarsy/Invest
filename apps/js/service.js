angular.module('testApp')
	.factory('permissions', [
		'$rootScope',
		'$cookies',
		'$http',
		function($rootScope, $cookies, $http) {
			return {
				authorize: function(token, acount) {
					$cookies.token = token;
					$cookies.account = acount;
					$rootScope.$broadcast('permissionsChanged')
				},
				isAuthorized: function() {
					return $cookies.token != undefined;
				},
				getToken: function() {
					return $cookies.token;
				},
				getAccount: function() {
					return $cookies.account;
				},
				unauthorize: function() {
					delete $cookies.token;
					delete $cookies.account;
				}
			};
		}
	])
	.factory('httplib', [
		'$http',
		'permissions',
		function($http, permissions) {
			var api = 'http://adcp.shu.edu.cn:8081/api/',
				headers;
			return {
				http: function(method, url, auth, callback, data, errorCallback) {
					if (auth) {
						headers = {
							'Authorization': 'Bearer ' + permissions.getToken()
						};
					}
					$http({
							method: method,
							url: api + url,
							//withCredentials: true,
							data: data,
							headers: headers
						})
						.success(function(data, status) {
							callback(data, status);
						})
						.error(function(data, status) {
							if (!errorCallback) return;
							errorCallback(data, status);
						})
				},
				post: function(url, data, auth, callback, error) {
					this.http('POST', url, auth, callback, data, error);
				},
				get: function(url, auth, callback, error) {
					this.http('GET', url, auth, callback, undefined, error);
				},
				put: function(url, data, auth, callback, error) {
					this.http('PUT', url, auth, callback, data, error);
				},
				delete: function(url, data, auth, callback, error) {
					this.http('DELETE', url, auth, callback, data, error);
				}
			}
		}
	])
	.factory('investlib', [
		'$location',
		function($location) {
			return {
				open: function(url) {
					$location.path(url);
				}
			}
		}
	])