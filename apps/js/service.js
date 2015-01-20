angular.module('testApp')
	.factory('permissions', function($rootScope) {
		var isAuthorized;
		return {
			authorize: function(permission) {
				isAuthorized = permission;
				$rootScope.$broadcast('permissionsChanged')
			},
			isAuthorized: function() {
				return isAuthorized;
			}
		};
	})
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
							headers: {
								Authorization: 'Basic YmVlcDpib29w'
							}
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