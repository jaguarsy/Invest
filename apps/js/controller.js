angular.module('testApp')
	.controller('IndexCtrl', [
		function() {}
	])
	.controller('accountCtrl', [
		'permissions',
		'$scope',
		'$location',
		'httplib',
		function(permissions, $scope, $location, httplib) {
			var $alert = $('#alert'),
				$confirm = $('#confirm'),
				$loading = $('#loading');


			$scope.register = function() {
				if ($scope.password != $scope.cpassword) {
					$scope.message = '两次输入的密码不同';
					$alert.modal();
					return;
				}

				httplib.post('AuthApi/register', {
					UserName: $scope.username,
					Email: $scope.email,
					Password: $scope.password,
					ConfirmPassword: $scope.cpassword
				}, false, function(data, status) {
					if (status == 200) {
						$confirm.modal({
							relatedTarget: this,
							onConfirm: function() {
								$confirm.modal('close');
								login($scope.username, $scope.password);
							},
							onCancel: function() {
								$confirm.modal('close');
							}
						});
					} else {
						$scope.message = '注册失败！';
						$alert.modal();
					}
				}, function(data, status) {
					$scope.message = data.Message;
					$alert.modal();
				})
			}

			var login = function(username, password) {
				$loading.modal('open')
				httplib.get('AuthApi/login?UserName=' + username + '&Password=' + password,
					false,
					function(data, status) {
						$loading.modal('close')
						if (data.token) {
							permissions.authorize(data.token, username);
							$location.path('/')
						}
					},
					function(data, status) {
						$loading.modal('close')
						$scope.message = "用户名或密码错误。";
						$alert.modal();
					})
			}

			$scope.login = function() {
				login($scope.account, $scope.password);
			}
		}
	])
	.controller('settingCtrl', [
		'permissions',
		'$location',
		'$scope',
		function(permissions, $location, $scope) {
			var $confirm = $('#confirm');

			$scope.logout = function() {
				$confirm.modal({
					onConfirm: function() {
						$confirm.modal('close');
						permissions.unauthorize();
						$location.path('/');
						$scope.$apply();
					}
				});
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
				$confirm = $('#confirm'),
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

			$scope.cancel = function() {
				$confirm.modal({
					onConfirm: function() {
						$confirm.modal('close');
						$location.path('/setting');
						$scope.$apply();
					}
				});
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
	.controller('projectCtrl', [
		'$scope',
		'$location',
		function($scope, $location) {
			var $confirm = $('#confirm');

			$scope.cancel = function() {
				$confirm.modal({
					onConfirm: function() {
						$confirm.modal('close');
						$location.path('/setting');
						$scope.$apply();
					}
				});
			}
		}
	])