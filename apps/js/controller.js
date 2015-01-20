angular.module('testApp')
	.controller('accountCtrl', [
		'permissions',
		'$scope',
		'$location',
		'httplib',
		'$http',
		function(permissions, $scope, $location, httplib, $http) {

			$scope.register = function() {
				// httplib.post('TabCompanyNature/1', {
				// 	username: $scope.username,
				// 	passowrd: $scope.password,
				// 	email: $scope.email
				// }, function(data, status) {
				// 	$scope.message = data;
				// 	$('#registerAlert').modal();
				// })
				// $.post('http://adcp.shu.edu.cn:8081/api/AuthApi/register', {
				// 	username: 'test',
				// 	passowrd: 'test',
				// 	email: 'test@123.com'
				// }, function(data, status) {
				// 	console.log(data, status);
				// })
			}

			$scope.login = function() {
				permissions.authorize(true);
				$location.path('/')
			}
		}
	])
	.controller('userCtrl', [
		function() {

		}
	])
	.controller('usershowCtrl',[function(){}])
	.controller('userlistCtrl',[function(){}])
	.controller('listCtrl',[function(){}])