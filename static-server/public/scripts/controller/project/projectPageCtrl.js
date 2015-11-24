'use strict';
innerApp.controller('project_page_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function ($scope, $routeParams, $rootScope, $popbox, $location) {
        var s = $routeParams.pid;
        $scope.pid = s, $scope.current_tab = 1, $scope.js_show_menu = function (t, a, o, r) {
            t.stopPropagation(), $popbox.popbox({
                target: t,
                top: o,
                left: r,
                templateUrl: '/view/project/page/pop_page_action.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, n) {
                        e.popbox = t, e.step = 0, e.js_step = function (t) {
                            e.step = t;
                        }, e.page = a, '' === a.parent_id && (e.show_sub_menu = true), $rootScope.load_project_members(s, function (t) {
                            _.isEmpty(e.members) && (e.members = wt.bus.watch.get_scope_watcher_members(t.members, a.watchers));
                        }), e.js_delete_page = function (t) {
                            e.is_deleting = true, wt.data.page.trash(s, t.page_id, function () {
                                e.is_deleting = false, e.js_close(), n.scope.pages = _.reject(n.scope.pages, function (e) {
                                    return e.page_id === t.page_id;
                                });
                            });
                        }, e.js_toggle_member = function (e) {
                            wt.bus.page.toggle_watcher_member(e, a, s);
                        }, e.js_watch_all = function (t) {
                            wt.bus.page.watch_all_members(e.members, t, s, function () {
                            }, null, function () {
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
        }, $scope.js_add_subpage_pop = function (t) {
            t.stopPropagation(), $popbox.popbox({
                target: t,
                templateUrl: '/view/project/page/pop_parents_page.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, i) {
                        e.popbox = t, e.pages = _.where(i.scope.cached_pages, { parent_id: '' }), e.js_close = function () {
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
        };
        var o = function () {
            'grid' === $scope.view_type ? ($scope.pages = _.where($scope.cached_pages, { parent_id: '' }), _.each($scope.pages, function (t) {
                var i = [], n = _.where($scope.cached_pages, { parent_id: t.page_id });
                _.each(n, function (e) {
                    i.push(e);
                }), t.sub_pages = _.sortBy(i, function (e) {
                    return e.create_date;
                });
            })) : $scope.pages = $scope.cached_pages;
        };
        $scope.set_view_type = function (t) {
            kzi.localData.set('page_list_view_type', t), $scope.view_type = t, o();
        }, $scope.js_change_tab = function (t) {
            if ($scope.current_tab !== t)
                switch ($scope.current_tab = t, t) {
                case 1:
                    _.each($scope.cached_pages, function (e) {
                        e.is_hide = false;
                    });
                    break;
                case 2:
                    _.each($scope.cached_pages, function (e) {
                        e.is_hide = e.owner.uid === $rootScope.global.me.uid ? false : true;
                    });
                    break;
                case 3:
                    _.each($scope.cached_pages, function (e) {
                        var t = _.findWhere(e.watchers, { uid: $rootScope.global.me.uid });
                        e.is_hide = t ? false : true;
                    });
                }
        }, $rootScope.load_project(s, function (t) {
            $rootScope.global.title = '文档 | ' + t.info.name, $scope.project = t, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok, wt.data.page.get_all(s, function (t) {
                $scope.cached_pages = t.data, $rootScope.global.loading_done = true;
                var n = kzi.localData.get('page_list_view_type');
                _.isUndefined(n) || _.isNull(n) ? ($scope.view_type = 'grid', kzi.localData.set('page_list_view_type', $scope.view_type)) : $scope.view_type = n, o();
            });
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + s + '/notfound') : wt.data.error(e);
        }), $scope.js_show_more_menu = function (t) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/page/pop_pages_more_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.email = s + kzi.constant.mail.domain, e.step = 0, e.js_step = function (t) {
                            e.step = t;
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
        }, $scope.$on(kzi.constant.event_names.on_right_menu, function (t, i) {
            var n = kzi.helper.mouse_position(i), a = null, s = 'page-item-mark';
            if ($(i.target).hasClass(s))
                a = $(i.target).attr('page-id');
            else {
                if (!($(i.target).parents('.' + s).length > 0))
                    return;
                a = $(i.target).parents('.' + s).attr('page-id');
            }
            if (a) {
                var o = _.findWhere($scope.pages, { page_id: a });
                o && $scope.js_show_menu(i, o, n.y, n.x);
            }
        });
    }
]);

innerApp.controller('project_page_add_edit_ctrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$routeParams',
    '$popbox',
    function (e, t, i, n, a) {
        var s = n.pid, o = n.page_id, r = n.parent_page_id;
        t.pid = s, e.global.loading_done = false;
        var l = null;
        _.isEmpty(o) ? (t.page = {
            name: '',
            content: '',
            message: '',
            placeholder: '新建文档的简短说明（可选）'
        }, _.isEmpty(r) ? r = '' : t.page.message = '', t.is_add = true, l = angular.copy(t.page)) : (wt.data.page.get(s, o, function (n) {
            t.page = n.data, t.page.placeholder = '此次修改的简短说明（可选）', t.page.message = '', l = angular.copy(t.page), e.global.loading_done = true, e.global.title = '编辑文档 | ' + t.page.name, wt.data.page.locked(s, o), t.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
                var t = '/project/' + s + '/page';
                i.path(t);
            });
        }), t.is_add = false), t.$on('$locationChangeStart', function (e) {
            if (t.save_success !== true) {
                _.isEmpty(t.page.name) && (t.page.name = ''), _.isEmpty(t.page.content) && (t.page.content = ''), _.isEmpty(t.page.message) && (t.page.message = '');
                var a = false;
                (l.name !== t.page.name || l.content !== t.page.content || l.message !== t.page.message) && (a = true), a && (window.confirm('当前文档还没有保存,确定要退出编辑页面么？') || e.preventDefault()), wt.data.page.unlocked(s, o);
            }
        }), t.js_save_page = function (n, a) {
            if (!_.isEmpty(t.page) && !n.$invalid)
                if (t.is_saving = true, t.is_add)
                    wt.data.page.add(s, t.page.name, t.page.content, t.page.message, r, function (n) {
                        a ? (kzi.msg.success('添加文档成功!'), t.is_add = false, t.page = n.data, t.page.placeholder = '此次修改的简短说明（可选）', t.page.message = '', l = angular.copy(t.page), e.global.title = '编辑文档 | ' + t.page.name) : (t.save_success = true, i.path('/project/' + s + '/page'));
                    }, null, function () {
                        t.is_saving = false, t.is_saving_continue = false;
                    });
                else {
                    _.isUndefined(t.page.is_notify) && (t.page.is_notify = false);
                    var o = 1;
                    a && (o = 0), wt.data.page.update(s, t.page.page_id, t.page.name, t.page.content, t.page.message, t.page.is_notify, o, function () {
                        a ? (kzi.msg.success('更新文档成功!'), t.page.message = '', l = angular.copy(t.page), e.global.title = '编辑文档 | ' + t.page.name) : (t.save_success = true, i.path('/project/' + s + '/page'));
                    }, null, function () {
                        t.is_saving = false, t.is_saving_continue = false;
                    });
                }
        }, t.js_cancel_edit = function () {
            t.is_add ? history.go(-1) : i.path('/project/' + s + '/page');
        }, t.js_pop_delete = function (e) {
            a.popbox({
                target: e,
                templateUrl: '/view/common/pop_delete_confirm.html',
                controller: [
                    '$rootScope',
                    '$scope',
                    'popbox',
                    function (e, t, n) {
                        t.popbox = n, t.js_close = function () {
                            n.close();
                        }, t.delete_message = '确认要删除此文档吗？<br/>文删除后会放在回收站，可以在回收站选择恢复或者彻底删除。', t.delete_title = '确认删除', t.js_sure_delete = function () {
                            t.is_deleting = true, wt.data.page.trash(s, o, function () {
                                i.path('/project/' + s + '/page');
                            }, null, function () {
                                t.is_deleting = false;
                            });
                        };
                    }
                ]
            }).open();
        }, e.load_project(s, function (i) {
            t.is_add && (e.global.loading_done = true, e.global.title = '添加文档 | ' + i.info.name), t.project = i, t.permission = 1 === t.project.info.archived ? kzi.constant.permission.project_archived : 2 === t.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok;
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? i.path('/project/' + s + '/notfound') : wt.data.error(e);
        });
    }
]);

innerApp.controller('project_page_versions_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function (e, t, i) {
        var s = t.pid, o = t.page_id;
        e.pid = s, i.global.loading_done = false, i.load_project(s, function (t) {
            e.project = t, e.permission = e.project.info.archived === kzi.constant.archived.yes ? kzi.constant.permission.project_archived : kzi.constant.permission.ok, wt.data.page.get(s, o, function (t) {
                e.page = t.data, i.global.title = '文档历史版本 | ' + e.page.name, t.data.is_deleted === kzi.constant.trash.yes && (e.permission = kzi.constant.permission.entity_deleted), wt.data.page.get_versions(s, o, function (t) {
                    i.global.loading_done = true, e.page_versions = t.data;
                });
            }, function (t) {
                i.global.loading_done = true, t.code === kzi.statuses.page_error.not_found.code ? e.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
            });
        }, null);
    }
]);