angular.module('testApp')
	.controller('IndexCtrl', [
		function() {}
	])
	.controller('accountCtrl', [
		'permissions',
		'$scope',
		'httplib',
		'investlib',
		function(permissions, $scope, httplib, investlib) {
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
						if (data.token) {
							permissions.authorize(data.token, username);
							//$location.path('/')
							investlib.open('/')
							$loading.modal('close')
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
	.controller('listCtrl', [
		'httplib',
		'$scope',
		function(httplib, $scope) {
			var $dimmer = $('.am-dimmer');

			$dimmer.hide();

			var renderList = function(page, size) {
				httplib.get('TabProject?page=' + page + '&pagesize=' + size,
					true,
					function(data, status) {
						$scope.project = data.ResultList;
					})
			}

			var init = function() {
				var page = 1,
					pageSize = 10;

				renderList(1, pageSize);
			}

			init();
			$scope.addFriend = function(project) {
				httplib.post('TabFpUserRelation',
					true, {},
					function(data, status) {
						$scope.project = data;
					})
			}
		}
	])
	.controller('settingCtrl', [
		'investlib',
		'$scope',
		'permissions',
		function(investlib, $scope, permissions) {
			var $confirm = $('#logout-confirm'),
				$settingbar = $('#setting-bar')

			$scope.close = function() {
				$settingbar.offCanvas('close');
			}

			$scope.logout = function() {
				$confirm.modal({
					onConfirm: function() {
						$confirm.modal('close');
						$settingbar.offCanvas('close');
						permissions.unauthorize();
						investlib.open('/login')
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
				if (status == 401) {
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
						$scope.message = (status == 204 ? '修改成功！' : '修改失败！');
						$alert.modal({
							onConfirm: function() {
								if (status != 204) return;
								$alert.modal('close');
								$location.path('/setting');
								$scope.$apply();
							}
						});
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
	.controller('projectCtrl', [
		'$scope',
		'$location',
		'httplib',
		'$routeParams',
		function($scope, $location, httplib, $routeParams) {
			var $confirm = $('#confirm'),
				id = $routeParams.id;

			if (id) {
				httplib.get('TabProject/' + id, true, function(data, status) {
					$scope.project = data;
				})
			}

			$scope.submit = function() {
				if (id) {
					httplib.put('TabProject/' + id, $scope.project,
						true,
						function(data, status) {
							$location.path('/myproject');
						})
				} else {
					//$scope.project.UserId = 
					httplib.post('TabProject', $scope.project,
						true,
						function(data, status) {
							if (status == 201)
								$location.path('/myproject');
						})
				}
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
	.controller('myProjectCtrl', [
		'$scope',
		'httplib',
		function($scope, httplib) {
			httplib.get('TabProject', true, function(data, status) {
				$scope.list = data;
			})
		}
	])