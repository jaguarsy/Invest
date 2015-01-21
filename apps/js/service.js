angular.module('testApp')
	.factory('permissions', [
		'$rootScope',
		'$cookies',
		function($rootScope, $cookies) {
			return {
				authorize: function(token) {
					$cookies.token = token;
					$rootScope.$broadcast('permissionsChanged')
				},
				isAuthorized: function() {
					return $cookies.token != undefined;
				},
				getToken: function() {
					return $cookies.token;
				},
				unauthorize: function(){
					delete $cookies.token;
				}
			};
		}
	])
	.factory('httplib', [
		'$http',
		function($http) {
			var api = 'http://adcp.shu.edu.cn:8081/api/';
			return {
				http: function(method, url, callback, data) {
					$http({
							method: "POST",
							url: api + url,
							//withCredentials: true,
							data: data,
							// headers: {
							// 	Authorization: 'Basic YmVlcDpib29w'
							// }
						})
						.success(function(data, status) {
							callback(data, status);
						})
				},
				post: function(url, data, callback) {
					this.http('POST', url, data, callback);
				},
				get: function(url, callback) {
					this.http('GET', url, callback);
				},
				put: function(url, data, callback) {
					this.http('PUT', url, data, callback);
				},
				delete: function(url, data, callback) {
					this.http('DELETE', url, data, callback);
				}
			}
		}
	])