angular.module('testApp')
	.directive('investTitle', [
		'$location',
		function($location) {
			function link(scope, element, attrs) {
				var path = {
					'/': '项目列表',
					'/login': '用户登录',
					'/register': '用户注册',
					'/user': '用户资料',
					'/usershow': '个人资料',
					'/userlist': '名片列表',
					'/project': '创建项目',
					'/setting': '设置'
				};
				scope.$on('$locationChangeSuccess', function() {
					element.text(path[$location.url()])
				});
			}

			return {
				link: link
			}
		}
	])
	.directive('investShow', [
		'permissions',
		function(permissions) {
			function link(scope, element, attrs) {
				function toggle() {
					if (permissions.isAuthorized()) {
						element.removeClass('hidden')
					} else {
						element.addClass('hidden')
					}
				}
				toggle()

				scope.$on('$locationChangeSuccess', function() {
					toggle();
				})
			}

			return {
				link: link
			}
		}
	])