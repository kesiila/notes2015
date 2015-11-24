"use strict";

innerApp.controller('statistics_ctrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.global.title = '最新动态';
    $rootScope.global.loading_done = true;
    var vm = $scope.vm = {};

    vm.js_load_data = function () {

    }

    function statusCalculator (src) {
        function getStatusCount(statusArray) {
            return _.chain(src)
                .filter(function (item) {
                    return _.indexOf(statusArray, item.status) > -1;
                })
                .map(function (item) {
                    return item.count
                })
                .reduce(function (acc,i) {
                    return acc + Number(i);
                },0)
                .value();
        }

        function getStatusCountRerverse(statusArray) {
            return _.chain(src)
                .filter(function (item) {
                    return !( _.indexOf(statusArray, item.status) > -1 );
                })
                .map(function (item) {
                    return item.count
                })
                .reduce(function (acc,i) {
                    return acc + Number(i);
                },0)
                .value();
        }

        return {
            getStatusCount: getStatusCount,
            getStatusCountReverse:  getStatusCountRerverse
        }
    }

    function getFeeds() {
        $scope.part_loading_done = false;
        wt.data.activity.get_feeds('all', 0, 1, function (t) {
            $scope.feeds = t.data;
        }, null, function () {
            $scope.part_loading_done = true;
        });
    }

    getFeeds();

    function greeting() {
        var now = new Date();
        $scope.show_date = '今天是 ' + kzi.util.getWeekday(now) + '，' + now.format('yyyy年MM月dd日');
        var hour = now.getHours();
        if (hour < 6) {
            $scope.hi_greetings = '夜深了，注意休息';
        } else if (hour < 9) {
            $scope.hi_greetings = '早上好，喝杯茶吧！';
        } else if (hour < 11) {
            $scope.hi_greetings = '上午好！';
        } else if (hour < 12) {
            $scope.hi_greetings = '吃过午饭了么？';
        } else if (hour < 14) {
            $scope.hi_greetings = '下午好！准备工作了？';
        } else if (hour < 17) {
            $scope.hi_greetings = '下午好！起来运动一下';
        } else if (hour < 19) {
            $scope.hi_greetings = '傍晚好！';
        } else if (hour < 22) {
            $scope.hi_greetings = '还没下班，辛苦了';
        } else if (hour < 24) {
            $scope.hi_greetings = '夜深了，注意休息';
        }
    };
    greeting();

    vm.js_load_data();
}]);