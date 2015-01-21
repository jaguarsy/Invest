angular.module('testApp')
	.controller('IndexCtrl',[
		'permissions',
		'$location',
		'$scope',
		function(permissions,$location,$scope){
			$scope.logout = function(){
				permissions.unauthorize();
				$location.path('/login')
			}
		}
	])
	.controller('accountCtrl', [
		'permissions',
		'$scope',
		'$location',
		'httplib',
		'$http',
		function(permissions, $scope, $location, httplib, $http) {

			$scope.register = function() {
				// httplib.post('AuthApi/register', {
				// 		model: {
				// 			UserName: "test",
				// 			Email: "test@email.com",
				// 			Password: "test123"
				// 		}
				// 	}, function(data, status) {
				// 		$scope.message = data;
				// 		$('#registerAlert').modal();
				// 	})
				// $.post('http://adcp.shu.edu.cn:8081/api/AuthApi/register', {
				// 	model: {
				// 		UserName: "test",
				// 		Email: "test@email.com",
				// 		Password: "test123"
				// 	}
				// }, function(data, status) {
				// 	console.log(data, status);
				// })
				// $http.post('http://adcp.shu.edu.cn:8081/api/AuthApi/register', {
				// 	model: {
				// 		UserName: "test",
				// 		Email: "test@email.com",
				// 		Password: "test123"
				// 	}
				// })
				// .success(function(data){console.log(data)})
			}

			$scope.login = function() {
				$.get('http://adcp.shu.edu.cn:8081/api/AuthApi/login?UserName=Admin&Password=qaz123', function(data, status) {
					if (data.token) {
						permissions.authorize(data.token);
						$location.path('/')
					}
				})
			}
		}
	])
	.controller('userCtrl', [
		function() {

		}
	])
	.controller('usershowCtrl', [function() {}])
	.controller('userlistCtrl', [function() {}])
	.controller('listCtrl', [
		'permissions',
		function(permissions) {
			// alert(permissions.getToken())
		}
	])