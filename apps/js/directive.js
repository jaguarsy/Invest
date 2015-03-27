angular.module('testApp')
	.directive('investTitle', [
		'$location',
		function ($location) {
		    function link(scope, element, attrs) {
		        var path = {
		            '^\/$': '所有项目',
		            '^\/login$': '用户登录',
		            '^\/register$': '用户注册',
		            '^\/user$': '用户资料',
		            '^\/usershow$': '个人资料',
		            '^\/usershow\/\\d+$': '详细信息',
		            '^\/userlist$': '我的人脉',
		            '^\/allusers$': '人脉圈',
		            '^\/project$': '创建项目',
		            '^\/project\/\\d+$': '项目详情',
		            '^\/project\/edit\/\\d+$': '修改项目',
		            '^\/setting$': '设置',
		            '^\/myproject$': '我的项目'
		        };

		        var getTitle = function (url) {
		            for (var key in path) {
		                var re = new RegExp(key)
		                if (re.test(url)) {
		                    return path[key];
		                }
		            }
		        }

		        scope.$on('$locationChangeSuccess', function () {
		            var title = getTitle($location.url())
		            element.text(title)
		        });
		    }

		    return {
		        link: link
		    }
		}
	])
	.directive('investShow', [
		'permissions',
		function (permissions) {
		    function link(scope, element, attrs) {
		        function toggle() {
		            if (permissions.isAuthorized()) {
		                element.removeClass('hidden')
		            } else {
		                element.addClass('hidden')
		            }
		        }
		        toggle()

		        scope.$on('$locationChangeSuccess', function () {
		            toggle();
		        })
		    }

		    return {
		        link: link
		    }
		}
	])
	.directive('backButton', function () {
	    return {
	        restrict: 'A',

	        link: function (scope, element, attrs) {
	            element.bind('click', goBack);

	            function goBack() {
	                history.back();
	                scope.$apply();
	            }
	        }
	    }
	})
	.directive('changeSelect', ['$interval', function ($interval) {
	    return {

	        link: function (scope, element, attrs) {
	            var stop;

	            scope.$watch(attrs.ngModel, function (value) {
	                if (!value) return;
	                // stop = $interval(function() {
	                // 		console.log(value)
	                // 	if (!scope.$$phase) {
	                // 		$interval.cancel(stop);
	                // 	}
	                // }, 100);
	            });
	        }
	    }
	}])
    .directive('commafy', [function () {

        //设置千分位
        var commafy = function (num) {
            if ((num + "").trim() == "") {
                return "";
            }
            if (isNaN(num)) {
                return "";
            }
            num = num + "";
            if (/^.*\..*$/.test(num)) {
                varpointIndex = num.lastIndexOf(".");
                varintPart = num.substring(0, pointIndex);
                varpointPart = num.substring(pointIndex + 1, num.length);
                intPart = intPart + "";
                var re = /(-?\d+)(\d{3})/
                while (re.test(intPart)) {
                    intPart = intPart.replace(re, "$1,$2")
                }
                num = intPart + "." + pointPart;
            } else {
                num = num + "";
                var re = /(-?\d+)(\d{3})/
                while (re.test(num)) {
                    num = num.replace(re, "$1,$2")
                }
            }
            return num;
        }

        //去除千分位
        var delcommafy = function (num) {
            if ((num + "").trim() == "") {
                return "";
            }
            num = num.toString().replace(/,/gi, '');
            return num;
        }

        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.ngModel, function (value) {
                    if (!value) return;
                    element.val(commafy(delcommafy(value)))
                })
            }
        }

    }])