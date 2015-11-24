"use strict";
innerApp.controller("inbox_ctrl", ["$scope", "$routeParams", "$rootScope", "$location", "$popbox", "$timeout",
    function ($scope, $routeParams, $rootScope, $location, $popbox, $timeout) {
        var vm = $scope.vm = {
                read_notices: [],
                unread_notices: [],
                pending_notices: [],
                tab: "unread"
            },
            o = 0,
            l = function () {
                vm.part_loading_done = !1;
                wt.data.notice.get_list("all", o, kzi.config.default_count, 1, function (e) {
                    _.isEmpty(e.data) || (o = e.data[e.data.length - 1].published, vm.read_notices = _.isEmpty(vm.read_notices) ? e.data : vm.read_notices.concat(e.data)), kzi.config.default_count > e.data.length && (vm.has_no_more = !0)
                }, null, function () {
                    vm.part_loading_done = !0
                })
            },
            c = function () {
                vm.part_loading_done = !0;
                wt.data.notice.get_list("all", 0, "all", 0, function (e) {
                    vm.unread_notices = e.data, $rootScope.notice_count !== vm.unread_notices.length && ($rootScope.notice_count = vm.unread_notices.length)
                }, null, function () {
                    vm.part_loading_done = !0
                })
            },
            d = function () {
                return vm.loading_pending_done ? (vm.pending_notices = _.reject(vm.pending_notices, function (e) {
                    return !e.is_pending
                }), void 0) : (vm.part_loading_done = !1,
                    wt.data.notice.get_pending_list(function (e) {
                        vm.pending_notices = e.data, vm.loading_pending_done = !0
                    }, null, function () {
                        vm.part_loading_done = !0
                    }), void 0)
            };
        $scope.js_load_more_notice = function () {
            l()
        }, $scope.js_switch_tab = function (e) {
            e !== vm.tab && (vm.tab = e, "unread" === vm.tab ? _.isEmpty(vm.unread_notices) || (vm.unread_notices = _.reject(vm.unread_notices, function (e) {
                return 1 === e.is_read
            })) : "read" === vm.tab ? 0 === o && l() : "pending" === vm.tab && d())
        }, $scope.$on("wtInboxTriggerSuccess", function (t, i) {
            i ? c() : $timeout(function () {
                vm.tab = "", $scope.js_switch_tab("unread")
            })
        });
        var u = function () {
            c()
        };
        u(), $scope.$on(kzi.constant.event_names.notice_new, function (e, t) {
            vm.unread_notices.unshift(t)
        }), $scope.js_show_slide_detail = function (t, i) {
            $scope.js_set_notice_read(null, i)
        }, $scope.js_toggle_notice_pending = function (e, t) {
            e.stopPropagation();
            var n = t.is_pending ? 0 : 1;
            wt.data.notice.update_pending(t.nid, n, function () {
                var a = _.findWhere(vm.unread_notices, {
                    nid: t.nid
                });
                a && (a.is_pending = n, n || (a.is_read = 1, $rootScope.notice_count >= 1 && $rootScope.notice_count--)), a = _.findWhere(vm.read_notices, {
                    nid: t.nid
                }), a && (a.is_pending = n), a = _.findWhere(vm.pending_notices, {
                    nid: t.nid
                }), a && (a.is_pending = n, n || (a.is_read = 1)), n && vm.loading_pending_done && vm.pending_notices.push(t)
            })
        }, $scope.js_handle_all_notice = function () {
            vm.set_allhandleing || (vm.set_allhandleing = !0, wt.data.notice.set_allhandle(function () {
                _.each(vm.pending_notices, function (e) {
                    var t = _.findWhere(vm.unread_notices, {
                        nid: e.nid
                    });
                    t && (t.is_pending = 0, t.is_read || (t.is_read = 1, $rootScope.notice_count >= 1 && $rootScope.notice_count--)), t = _.findWhere(vm.read_notices, {
                        nid: e.nid
                    }), t && (t.is_pending = 0)
                }), vm.pending_notices = []
            }, null, function () {
                vm.set_allhandleing = !1
            }))
        }, $scope.js_set_notice_read = function (e, t) {
            _.isEmpty(e) || e.stopPropagation(), 0 === t.is_read && (t.is_read = 1, wt.data.notice.set_read(t.nid, function () {
                _.isEmpty(vm.read_notices) || _.findWhere(vm.read_notices, {
                    nid: t.nid
                }) || vm.read_notices.unshift(t), t.is_read = 1, $rootScope.notice_count >= 1 && $rootScope.notice_count--
            }, function () {
                t.is_read = 0, kzi.msg.error("标记消息为已读失败!")
            }))
        }, $scope.js_set_all_notice_read = function () {
            !vm.setting_all_notice_read && vm.part_loading_done && (vm.setting_all_notice_read = !0, wt.data.notice.set_allread("all", function () {
                if (!_.isEmpty(vm.unread_notices)) {
                    var e = 0;
                    _.each(vm.unread_notices, function (t) {
                        1 !== t.is_read && (t.is_read = 1, e++, _.isEmpty(vm.read_notices) || _.findWhere(vm.read_notices, {
                            nid: t.nid
                        }) || vm.read_notices.unshift(t))
                    }), vm.unread_notices = [], $rootScope.notice_count = $rootScope.notice_count >= e ? $rootScope.notice_count - e : 0
                }
                vm.setting_all_notice_read = !1
            }, function () {
                vm.setting_all_notice_read = !1
            }))
        }
    }
])