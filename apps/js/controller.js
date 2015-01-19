angular.module('testApp')
	.controller('accountCtrl', [
		'permissions',
		'$scope',
		'$location',
		function(permissions,$scope,$location) {
			$scope.login = function(){
				permissions.authorize(true);
				$location.path('/user')
			}
		}
	])
	.controller('userCtrl',[
		function(){

		}
	])