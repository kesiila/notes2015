'use strict';
innerApp.controller('project_post_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$popbox',
    '$timeout',
    '$location',
    function ($rootScope, $scope, $routeParams, $popbox, $timeout, $location) {
        var o = $routeParams.pid, r = 0, l = 'last_reply_date';
        $scope.current_tab = 0;
        var u = $rootScope.global.me;
        u.watched = true, $rootScope.global.loading_done = true, $scope.edit_post = {
            name: '',
            content: '',
            watchers: [u]
        };
        var d = function (e) {
            $scope.sort=!$scope.sort;
            $scope.part_loading_done = false, wt.data.post.get_list(o, r, kzi.config.default_count, l, 1, $scope.current_tab, function (i) {
                i.data.length > 0 && (r = i.data[i.data.length - 1][l]), $scope.posts = _.isEmpty($scope.posts) ? i.data : $scope.posts.concat(i.data), $scope.has_more = i.data.length === kzi.config.default_count ? true : false, angular.isFunction(e) && e(i.data), $scope.part_loading_done = true;
            });
        };
        $scope.js_show_add_post = function () {
            $scope.show_add_post = !$scope.show_add_post;
        }, $scope.js_cancel_edit_post = function () {
            $scope.show_add_post = false, $scope.edit_post.name = '', $scope.edit_post.content = '', $scope.edit_post.watchers = [u];
        },

        $scope.js_change_tab = function (e) {
            if ($scope.current_tab !== e)
                switch ($scope.current_tab = e, r = 0, $scope.posts = [], d(), e) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    default:
                }
        }, $scope.js_toggle_member = function (e) {
            wt.bus.post.toggle_watcher_member(e, $scope.edit_post, o);
        }, $scope.js_save_post = function () {
            $scope.is_saving = true;
            var n = _.pluck($scope.edit_post.watchers, 'uid');

            wt.data.post.create(o, $scope.edit_post.name,$scope.edit_post.content, $scope.edit_post.type, n, function (i)
            {
                $scope.is_saving = false, 2 === $scope.current_tab ? n.indexOf($rootScope.global.me.uid) >= 0 && $scope.posts.unshift(i.data) : $scope.posts.unshift(i.data);
            }, null, function () {
                $scope.js_cancel_edit_post();
            });
        }, $scope.js_show_post_menu = function (i, a, s, r) {
            i.stopPropagation(), $popbox.popbox({
                target: i,
                top: s,
                left: r,
                templateUrl: '/view/project/post/pop_post_action.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (t, i, n) {
                        t.popbox = i, t.step = 0, t.js_step = function (e) {
                            t.step = e;
                        }, t.edit_post = a, $rootScope.load_project_members(o, function (e) {
                            wt.bus.post.set_scope_watcher_members(t, e.members, a.watchers);
                        }), t.js_delete_post = function (e) {
                            t.is_deleting = true, wt.data.post.trash(o, e.post_id, function () {
                                t.is_deleting = false, t.js_close(), n.scope.posts = _.reject(n.scope.posts, function (t) {
                                    return t.post_id === e.post_id;
                                });
                            });
                        }, t.js_toggle_member = function (e) {
                            wt.bus.post.toggle_watcher_member(e, a, o);
                        }, t.js_watch_all = function (e) {
                            wt.bus.post.watch_all_members(t.members, e, o, function () {
                            }, null, function () {
                                t.js_close();
                            });
                        }, t.js_close = function () {
                            i.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.js_add_post_watchers_pop = function (i, a) {
            $popbox.popbox({
                target: i,
                templateUrl: '/view/project/post/pop_edit_post_watchers.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (t, i) {
                        t.popbox = i, t.edit_post = a, $rootScope.load_project_members(o, function (e) {
                            wt.bus.post.set_scope_watcher_members(t, e.members, a.watchers);
                        }), t.js_toggle_member = function (e) {
                            wt.bus.post.toggle_watcher_member(e, a, o);
                        }, t.js_watch_all = function (e) {
                            wt.bus.post.watch_all_members(t.members, e, o, function () {
                            }, null, function () {
                            });
                        }, t.js_close = function () {
                            i.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.js_show_more_menu = function (i) {
            $popbox.popbox({
                target: i,
                templateUrl: '/view/project/post/pop_posts_more_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (t, i) {
                        t.popbox = i, t.email = o + kzi.constant.mail.domain, t.step = 0, t.js_step = function (e) {
                            t.step = e;
                        }, t.js_close = function () {
                            i.close();
                        }, t.selected_filter = null, t.filter_items = [
                            {
                                name: '按回复时间',
                                value: 'last_reply_date',
                                is_selected: false
                            },
                            {
                                name: '按分享时间',
                                value: 'create_date',
                                is_selected: false
                            }
                        ], 'last_reply_date' === l ? (t.filter_items[0].is_selected = true, t.selected_filter = t.filter_items[0]) : (t.filter_items[1].is_selected = true, t.selected_filter = t.filter_items[1]), t.js_select_filter = function (i) {
                            t.selected_filter.is_selected = false, i.is_selected = true, t.selected_filter = i, t.js_close(), $rootScope.$broadcast(kzi.constant.event_names.filter_posts_by_sort, i.value);
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.js_slide_change = function (e) {
            e ? $scope.show_add_post_empty = !!e : $timeout(function () {
                $scope.show_add_post_empty = !!e;
            }, 400);
        }, $rootScope.load_project(o, function (i) {
            $rootScope.global.title = '问答 | ' + i.info.name, $scope.project = i, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok, d();
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + o + '/notfound') : wt.data.error(e);
        }), $scope.js_load_more = function () {
            d();
        }, $scope.$on(kzi.constant.event_names.filter_posts_by_sort, function (e, i) {
            _.isEmpty(i) || (l = i), r = 0, $scope.posts = null, d();
        }), $scope.$on(kzi.constant.event_names.on_post_comment, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.posts, { post_id: i.post_id });
                n && n.comment_count++;
            }
        }), $scope.$on(kzi.constant.event_names.on_post_trash, function (e, i) {
            _.isEmpty(i) || ($scope.posts = _.reject($scope.posts, function (e) {
                return e.post_id === i.post_id;
            }));
        }), $scope.$on(kzi.constant.event_names.on_post_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.posts, { post_id: i.post_id });
                n && (n.name = i.name, n.summary = kzi.helper.substr(i.content, 60));
            }
        }), $scope.$on(kzi.constant.event_names.on_right_menu, function (e, i) {
            var n = kzi.helper.mouse_position(i), a = null, s = 'post-item';
            if ($(i.target).hasClass(s))
                a = $(i.target).attr('post-id');
            else {
                if (!($(i.target).parents('.' + s).length > 0))
                    return;
                a = $(i.target).parents('.' + s).attr('post-id');
            }
            if (a) {
                var o = _.findWhere($scope.posts, { post_id: a });
                o && $scope.js_show_post_menu(i, o, n.y, n.x);
            }
        });
    }
]);

innerApp.controller('post_filter_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    function (e) {
        var n = null;
        e.filter_items = [
            {
                name: '按分享时间',
                value: 'create_date',
                is_selected: true
            },
            {
                name: '按回复时间',
                value: 'last_reply_date',
                is_selected: false
            }
        ], n = e.filter_items[0], e.js_select_filter = function (t) {
            n.is_selected = false, t.is_selected = true, n = t, e.$emit(kzi.constant.event_names.filter_posts_by_sort, t.value);
        };
    }
]);