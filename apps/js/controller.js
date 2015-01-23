angular.module('testApp')
	.controller('IndexCtrl', [
		'permissions',
		'$location',
		'$scope',
		function(permissions, $location, $scope) {
			$scope.logout = function() {
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
		function(permissions, $scope, $location, httplib) {
			var $alert = $('#alert'),
				$loading = $('#loading');


			$scope.register = function() {
				httplib.post('AuthApi/register', {
					UserName: $scope.username,
					Email: $scope.email,
					Password: $scope.password,
					ConfirmPassword: $scope.cpassword
				}, false, function(data, status) {
					$scope.message = (status == '200' ? '注册成功！点击确定后登录。' : '注册失败！');
					$alert.modal();
					login($scope.username, $scope.password);
				})
			}

			var login = function(username, password) {
				$loading.modal('open')
				httplib.get('AuthApi/login?UserName=' + username + '&Password=' + password,
					false,
					function(data) {
						if (data.token) {
							permissions.authorize(data.token, username);
							$loading.modal('close')
							$location.path('/')
						}
					})
			}

			$scope.login = function() {
				login($scope.account, $scope.password);
			}
		}
	])
	.controller('userCtrl', [
		'httplib',
		'permissions',
		'$scope',
		'$location',
		function(httplib, permissions, $scope, $location) {
			var $alert = $('#alert'),
				$loading = $('#loading');

			httplib.get('TabIndustry', true, function(data, status) {
				$scope.industry = data;
				if (status == '401') {
					permissions.unauthorize();
					$location.path('/login')
				}
				httplib.get('CommonUserDetail?account=' + permissions.getAccount(),
					true,
					function(data) {
						$scope.user = data;
					})
			})

			$scope.submit = function() {
				httplib.put('CommonUserDetail/' + $scope.user.Id,
					$scope.user,
					true,
					function(data, status) {
						$scope.message = (status == '204' ? '修改成功！' : '修改失败！');
						$alert.modal();
					})
			}
		}
	])
	.controller('usershowCtrl', [
		'$routeParams',
		'$scope',
		'httplib',
		function($routeParams, $scope, httplib) {
			httplib.get('CommonUserDetail/' + $routeParams.id,
				true,
				function(data) {
					console.log(data)
					//$scope.user = data;
				})
		}
	])
	.controller('userlistCtrl', [function() {}])
	.controller('listCtrl', [
		'permissions',
		function(permissions) {
			// alert(permissions.getToken())
		}
	])
	.controller('projectCtrl', [function() {}])