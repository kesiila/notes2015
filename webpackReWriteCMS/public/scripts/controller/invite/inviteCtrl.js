'use strict';
innerApp.controller('join_ctrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$window',
    function ($rootScope, $scope,$location, $window) {
        var o = kzi.helper.get_query('code');
        $scope.loading_done = false, $scope.get_invite_info = function () {
            return _.isEmpty(o) ? ($scope.invalid_invite = true, void 0) : (wt.data.invite.get(o, function (i) {
                return i.data ? ($scope.invite = i.data, $scope.invite.has_signup ? ($scope.user_name = $scope.invite.to.name, $scope.email = $scope.invite.to.email, _.isEmpty($rootScope.global.me) ? $window.location.href = 'signin?name=' + $scope.email + '&return_url=' + $window.location.pathname + $window.location.search : $rootScope.global.me.uid === i.data.to.uid ? wt.data.invite.accept(o, function () {
                    $scope.join_success = true, $scope.show_join = false, $scope.loading_done = true;
                }, function () {
                    $scope.show_join = true, $scope.loading_done = true;
                }) : ($scope.invalid_user = true, $scope.loading_done = true)) : ($scope.loading_done = true, $scope.show_join = true), void 0) : ($scope.invalid_invite = true, $scope.loading_done = true, void 0);
            }), void 0);
        }, $scope.js_exit_signin = function () {
            $rootScope.logout(true, function () {
                $window.location.href = '/signin?name=' + $scope.email + '&return_url=' + $window.location.pathname + $window.location.search;
            });
        }, $scope.js_join = function (i) {
            $scope.is_joining = true, wt.data.invite.join(o, $scope.user_name, $scope.display_name, $scope.password, function () {
                $rootScope.login($scope.user_name, $scope.password, null, function () {
                    $scope.join_success = true, $scope.show_join = false;
                }, null, function () {
                    $scope.is_joining = false;
                });
            }, function () {
                i.$errors.unshift('加入失败,请重新输入');
            }, function () {
                $scope.is_joining = false;
            });
        }, $scope.js_enter_team = function (e) {
            $location.path('/teams/' + e).search({});
        }, $scope.js_refuse_invite = function () {
            wt.data.invite.refuse(o, function () {
            });
        }, $scope.get_invite_info();
    }
]);