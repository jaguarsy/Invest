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

			$scope.register = function() {
				httplib.post('AuthApi/register', {
					"UserName": $scope.username,
					"Email": $scope.email,
					"Password": $scope.password,
					"ConfirmPassword": $scope.cpassword
				}, false, function(data, status) {
					$scope.message = status;
					$('#registerAlert').modal();
					$location.path('/login');
				})
			}

			$scope.login = function() {
				httplib.get('AuthApi/login?UserName=' + $scope.account + '&Password=' + $scope.password,
					false,
					function(data) {
						if (data.token) {
							permissions.authorize(data.token, $scope.account);
							$location.path('/')
						}
					})
			}
		}
	])
	.controller('userCtrl', [
		'httplib',
		'permissions',
		'$scope',
		function(httplib, permissions, $scope) {
			httplib.get('TabIndustry', true, function(data) {
				$scope.industry = data;
				httplib.get('CommonUserDetail?account=' + permissions.getAccount(),
					true,
					function(data) {
						$scope.user = data;
					})
			})

			$scope.submit = function(){
				httplib.put('CommonUserDetail',
					$scope.user,
					true,
					function(data) {
						console.log(data)
					})
			}
		}
	])
	.controller('usershowCtrl', [
		'$routeParams',
		function($routeParams) {
			console.log($routeParams.id)
		}
	])
	.controller('userlistCtrl', [function() {}])
	.controller('listCtrl', [
		'permissions',
		function(permissions) {
			// alert(permissions.getToken())
		}
	])