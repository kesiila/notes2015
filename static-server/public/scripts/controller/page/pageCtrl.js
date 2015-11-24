'use strict';
innerApp.controller('entity_page_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    '$popbox',
    function ($scope, $routeParams, $rootScope, $location, $popbox) {
        var s, o;
        $scope.token = kzi.get_cookie('sid'), $scope.$on(kzi.constant.event_names.on_slide_hide, function () {
            $scope.page = {};
        }), $scope.page = {}, $scope.$on(kzi.constant.event_names.load_entity_page, function (t, n) {
            _.isEmpty(n.pid) || _.isEmpty(n.page_id) || (s = n.pid, o = n.page_id, $scope.select_tab_comment(), $scope.section_loading_done = false, $rootScope.load_project(s, function (t) {
                $scope.project = t, $scope.permission = $scope.project.info.archived === kzi.constant.archived.yes ? kzi.constant.permission.project_archived : kzi.constant.permission.ok, wt.data.page.get(s, o, function (t) {
                    $scope.page = t.data, $scope.section_loading_done = true, t.data.is_deleted === kzi.constant.trash.yes && ($scope.permission = kzi.constant.permission.entity_deleted), $scope.$broadcast(kzi.constant.event_names.load_comments, {
                        pid: s,
                        xid: o,
                        xtype: kzi.constant.xtype.page,
                        comment_id: n.comment_id
                    }), $scope.set_pop_watcher_options();
                }, function (t) {
                    $rootScope.global.loading_done = true, t.code === kzi.statuses.page_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
                });
            }, null));
        }), $scope.set_pop_watcher_options = function () {
            $scope.permission === kzi.constant.permission.ok && ($scope.pop_watcher_options = [{
                    name: '取消关注',
                    ongoing: '取消中...',
                    click: function (t, i, n, a) {
                        wt.bus.watch.unwatch(s, $scope.page, kzi.constant.xtype.page, $scope.page.page_id, n, function () {
                        }, null, a);
                    }
                }]);
        }, $scope.js_show_page_watch_pop = function (t) {
            var n = $scope.page;
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/common/pop_edit_watchers.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.xEntity = n, $rootScope.load_project_members(s, function (t) {
                            _.isEmpty(e.members) && (e.members = wt.bus.watch.get_scope_watcher_members(t.members, n.watchers));
                        }), e.js_toggle_member = function (e) {
                            wt.bus.page.toggle_watcher_member(e, n, s);
                        }, e.js_watch_all = function () {
                            wt.bus.page.watch_all_members(e.members, n, s, function () {
                            }, null, function () {
                                e.js_close();
                            });
                        }, e.js_close = function () {
                            t.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.js_show_trash = function (t) {
            var i = $scope.page;
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/page/pop_delete_page.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close();
                        }, e.js_delete = function () {
                            wt.data.page.trash(s, i.page_id, function () {
                                e.js_close();
                            }), $location.path('/project/' + s + '/page');
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.js_share = function (t) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/page/pop_share_page.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.$watch('page', function (t) {
            t && ($scope.file_upload_option_comment = {
                url: [
                    kzi.config.wtbox(),
                    '?pid=' + t.pid,
                    '&token=' + kzi.get_cookie('sid')
                ].join(''),
                formData: {
                    target: 'prj',
                    type: 'comment',
                    pid: t.pid,
                    post_id: t.page_id,
                    successCallback: function (e) {
                        var t = angular.element('.comment-list:visible').scope().comment;
                        _.isEmpty(t.files) && (t.files = []), e.data.icon = kzi.helper.build_file_icon(e.data), t.files.push(_.omit(e.data, 'watchers'));
                    }
                }
            }, $scope.pastefile_option_comment = { upload_option: $scope.file_upload_option_comment }, $scope.global_fileupload_queue_comment = function () {
                return $rootScope.upload_queue.get_comment_page(t.pid, t.page_id);
            });
        }), $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
            if ($scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && $rootScope.locator.type === kzi.constant.entity_type.page) {
                var a = '/project/' + s + '/page/' + o + '/edit';
                $location.path(a);
            }
        }), $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
            $rootScope.locator.show_slide === true && $rootScope.locator.hide_slide();
        }), $scope.js_goto_page = function (e, n) {
            var a = $routeParams.pid;
            _.isEmpty(a) ? $rootScope.locator.to_page(e, n, true) : $rootScope.locator.to_page(e, n, false);
        }, $scope.select_tab_comment = function () {
            $scope.tab_activity_active = false, $scope.tab_comment_active = true;
        }, $scope.select_tab_activity = function () {
            $scope.tab_activity_active = true, $scope.tab_comment_active = false, $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                xtype: 'page',
                xid: $scope.page.page_id
            });
        }, $scope.js_close = function () {
            $rootScope.locator.show_slide = false;
        };
    }
]);