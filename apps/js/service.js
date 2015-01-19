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
	});