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
			var $dimmer = $('.am-dimmer'),
				$friendPrompt = $('#addfriendprompt');

			$dimmer.hide();

			var renderList = function(page, size) {
				httplib.get('TabProject?page=' + page + '&pagesize=' + size,
					true,
					function(data, status) {
						$scope.project = data;
					})
			}

			var init = function() {
				var page = 1,
					pageSize = 100;

				renderList(1, pageSize);
			}

			init();
			$scope.addFriend = function(userid) {
				$friendPrompt.modal({
					relatedTarget: this,
					onConfirm: function(e) {
						httplib.post('TabFpUserRelation', {
							ResponseFpUserId: userid,
							RequestMessage: e.data || '',
							RequestFpUserId: 0
						}, true, function(data, status) {

						})
					}
				});
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

			$scope.user = {};
			httplib.get('TabIndustry', true, function(data, status) {
				$scope.industry = data;
				$scope.user.IndustryId = data[0].Id;
			})

			httplib.get('TabPersonLocation', true, function(data, status) {
				$scope.locations = data;
				$scope.user.PersonLocationId = data[0].Id;
			})

			httplib.get('CommonUserDetail?account=' + permissions.getAccount(),
				true,
				function(data) {
					$scope.user = data;
				})

			$('#birthday').datepicker({
				format: 'yyyy-mm-dd'
			}).
			on('changeDate.datepicker.amui', function(event) {
				$scope.user.BirthDay = event.target.value;
			});

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
		function($routeParams, $scope, httplib) {}
	])
	.controller('userlistCtrl', [
		'$scope',
		'httplib',
		function($scope, httplib) {

			httplib.get('TabFpUserRelation',
				true,
				function(data) {
					// console.log(data)
				})

			var getUsers = function() {
				httplib.get('TabFpUserRelation',
					true,
					function(data) {
						$scope.list = data;
					})
			}
		}
	])
	.controller('projectCtrl', [
		'$scope',
		'$location',
		'httplib',
		'$routeParams',
		function($scope, $location, httplib, $routeParams) {
			var $confirm = $('#confirm'),
				id = $routeParams.id;

			$scope.project = {};
			httplib.get('TabIndustry', true, function(data) {
				$scope.industry = data;
				$scope.project.IndustryId = data[0].Id;
			})

			httplib.get('TabProjectState', true, function(data) {
				$scope.ProjectStates = data;
				$scope.project.ProjectStateId = data[0].Id;
			})

			httplib.get('TabPersonLocation', true, function(data) {
				$scope.locations = data;
				$scope.project.TabPersonLocation = data[0].PersonLocationText;
			})

			httplib.get('TabCompanyNature', true, function(data) {
				$scope.natures = data;
				$scope.project.CompanyNatureId = data[0].Id;
			})

			if (id) {
				httplib.get('TabProject/' + id, true, function(data) {
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