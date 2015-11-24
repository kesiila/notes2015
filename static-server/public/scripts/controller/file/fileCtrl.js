'use strict';
innerApp.controller('entity_file_ctrl', [
    '$scope',
    '$rootScope',
    '$popbox',
    function ($scope,$rootScope, $popbox) {
        var s, o;
        $scope.token = kzi.get_cookie('sid'), $scope.version_loading_done = true, $scope.file = {}, $scope.$on(kzi.constant.event_names.load_entity_file, function (t, n) {
            _.isEmpty(n.pid) || _.isEmpty(n.fid) || ($scope.file = {}, s = n.pid, o = n.fid, $scope.select_tab_comment(), $scope.section_loading_done = false, $scope.is_show_version = false, $rootScope.load_file(s, o, function (t, i) {
                $scope.project = t, $scope.file = i, i.is_img = -1 == kzi.constant.get_file_icon(i) ? true : false, $scope.permission = 1 === $scope.project.info.archived ? kzi.constant.permission.project_archived : 1 === i.is_deleted ? kzi.constant.permission.entity_deleted : kzi.constant.permission.ok, $scope.$broadcast(kzi.constant.event_names.load_comments, {
                    pid: s,
                    xid: o,
                    xtype: kzi.constant.xtype.file,
                    comment_id: n.comment_id
                }), $scope.set_pop_watcher_options(), wt.data.file.get_target(s, o, function (t) {
                    $scope.file.link_count = 0, _.isEmpty(t.data.tasks) || ($scope.file.link_count = t.data.tasks.length), _.isEmpty(t.data.posts) || ($scope.file.link_count += t.data.posts.length), _.isEmpty(t.data.templates) || ($scope.file.link_count += t.data.templates.length), _.isEmpty(t.data.events) || ($scope.file.link_count += t.data.events.length), $scope.file.tasks = t.data.tasks, $scope.file.posts = t.data.posts, $scope.file.events = t.data.events;
                }, null, function () {
                    $scope.section_loading_done = true;
                });
            }, function (t) {
                $scope.section_loading_done = true, t.code === kzi.statuses.file_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
            }));
        }), $scope.$watch('file', function (t) {
            t && ($scope.file_upload_new_option = {
                previewMaxWidth: 540,
                previewMaxHeight: 400,
                url: [
                    kzi.config.wtbox(),
                    '?pid=' + t.pid,
                    '&token=' + kzi.get_cookie('sid')
                ].join(''),
                formData: {
                    target: 'prj',
                    type: 'file',
                    pid: t.pid,
                    fid: t.fid
                }
            }, $scope.file_upload_option_comment = {
                previewMaxWidth: 540,
                previewMaxHeight: 400,
                url: [
                    kzi.config.wtbox(),
                    '?pid=' + t.pid,
                    '&token=' + kzi.get_cookie('sid')
                ].join(''),
                formData: {
                    target: 'prj',
                    type: 'comment',
                    pid: t.pid,
                    fid: t.fid,
                    successCallback: function (e) {
                        var t = angular.element('.comment-list:visible').scope().comment;
                        _.isEmpty(t.files) && (t.files = []), e.data.icon = kzi.helper.build_file_icon(e.data), t.files.push(_.omit(e.data, 'watchers'));
                    }
                }
            }, $scope.dragfile_option = { upload_option: $scope.file_upload_new_option }, $scope.pastefile_option_comment = { upload_option: $scope.file_upload_option_comment }, $scope.global_fileupload_queue = function () {
                return $rootScope.upload_queue.get_file(t.pid, t.fid);
            }, $scope.global_fileupload_queue_comment = function () {
                return $rootScope.upload_queue.get_comment_file(t.pid, t.fid);
            });
        }), $scope.$on(kzi.constant.event_names.on_file_add, function (t, i) {
            i && 'file' === i.type && $scope.file.fid === i.file.formData.fid && ($scope.file.icon = i.file.icon, $scope.file.path = i.file.path, $scope.file.size = i.file.size, $scope.file.update_date = i.file.update_date, $scope.file.update_user = i.file.update_user, $scope.file.dt = new Date().getTime());
        }), $scope.js_watch_file = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/file/pop_watch_file.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.file = n, $rootScope.load_project_members(s, function (t) {
                            var i = [];
                            _.each(t.members, function (e) {
                                if (1 === e.status) {
                                    var t = _.findWhere(n.watchers, { uid: e.uid });
                                    e.is_watch = t ? 1 : 0, i.push(e);
                                }
                            }), e.members = i;
                        }), e.js_toggle_watch = function (e) {
                            if (e.is_watch) {
                                var t = _.findWhere(n.watchers, { uid: e.uid });
                                t && (n.watchers = _.reject(n.watchers, function (t) {
                                    return t.uid === e.uid;
                                })), e.is_watch = 0, wt.data.unwatch(s, kzi.constant.xtype.file, n.fid, e.uid, function () {
                                });
                            } else {
                                var t = _.findWhere(n.watchers, { uid: e.uid });
                                t || (n.watchers.push(e), e.is_watch = 1, wt.data.watch(s, kzi.constant.xtype.file, n.fid, e.uid, function () {
                                }));
                            }
                        }, e.js_watch_all = function () {
                            if (n.watchers.length !== e.members) {
                                var i = _.pluck(e.members, 'uid');
                                wt.data.watch_batch(s, kzi.constant.xtype.file, n.fid, i, function () {
                                    n.watchers = e.members;
                                }), _.each(e.members, function (e) {
                                    e.is_watch = 1;
                                });
                            }
                            t.close();
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
        }, $scope.set_pop_watcher_options = function () {
            $scope.permission === kzi.constant.permission.ok && ($scope.pop_watcher_options = [{
                    name: '取消关注',
                    ongoing: '取消中...',
                    click: function (t, i, n, a) {
                        wt.bus.watch.unwatch(s, $scope.file, kzi.constant.xtype.file, $scope.file.fid, n, function () {
                        }, null, a);
                    }
                }]);
        }, $scope.js_move = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/file/pop_move_file.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.file = n, e.js_close = function () {
                            t.close();
                        }, $rootScope.load_files(s, '', function () {
                            var t = _.where($rootScope.project.files, { type: 1 });
                            e.folders = t, n.folder_id && (e.folders.unshift({
                                fid: '',
                                name: '根目录'
                            }), e.folders = _.reject(e.folders, function (e) {
                                return e.fid === n.folder_id;
                            })), e.folders_loading_done = true;
                        }), e.js_move_to = function (a) {
                            _.each(e.folders, function (e) {
                                e.selected = 0;
                            }), a && wt.data.file.move(s, o, n.folder_id, a.fid, function () {
                                a.selected = 1, n.folder_id = a.fid, n.folder_name = a.name, t.close(), $rootScope.$broadcast(kzi.constant.event_names.on_file_move, n);
                            });
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.js_trash = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/file/pop_delete_file.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.file = n, e.js_close = function () {
                            t.close();
                        }, e.js_del_file = function () {
                            e.is_deleting || (e.is_deleting = true, wt.data.file.trash(s, o, function () {
                                $rootScope.refresh_cache.file.del(o), t.close(), $rootScope.locator.hide_slide(), $rootScope.$broadcast(kzi.constant.event_names.on_file_trash, { fid: o });
                            }, null, function () {
                                e.is_deleting = false;
                            }));
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.js_share = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/file/pop_share_file.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.file = i, e.js_close = function () {
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
        }, $scope.js_show_versions = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/file/pop_show_versions.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.file = i, e.js_close = function () {
                            t.close();
                        }, e.file_version_loaded = false, wt.data.file.get_versions(i.pid, i.fid, function (t) {
                            _.each(t.data, function (e) {
                                e.icon = kzi.helper.build_file_icon(e), e.fid = o, e.pid = s;
                            }), t.data.reverse(), e.file_version_loaded = true, e.versions = t.data;
                        });
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        }, $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
            $rootScope.locator.type !== kzi.constant.entity_type.file || _.isEmpty($scope.file) || $scope.js_show_editor($scope.file);
        }), $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
            $rootScope.locator.type === kzi.constant.entity_type.file && (_.isEmpty($scope.file) || $scope.file.is_edit !== true ? $rootScope.locator.show_slide === true && $rootScope.locator.hide_slide() : $scope.js_cancel_editor($scope.file));
        }), $scope.js_show_editor = function (t) {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.is_edit = true, _.isEmpty(t.temp_name) && (t.temp_name = t.name), _.isEmpty(t.temp_desc) && (t.temp_desc = t.desc));
        }, $scope.js_cancel_editor = function (e) {
            e.is_edit = false, e.temp_name = null, e.temp_desc = null;
        }, $scope.js_set_update = function (e, t) {
            return t.is_edit = false, _.isEmpty(t.temp_name) ? (t.temp_name = t.name, void 0) : (wt.data.file.update(s, o, t.temp_name, t.temp_desc, function () {
                t.name = t.temp_name, t.desc = t.temp_desc, t.temp_name = null, t.temp_desc = null, $(e.target).button('reset');
            }), void 0);
        }, $scope.select_tab_comment = function () {
            $scope.tab_activity_active = false, $scope.tab_comment_active = true;
        }, $scope.select_tab_activity = function () {
            $scope.tab_activity_active = true, $scope.tab_comment_active = false, $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                xtype: 'file',
                xid: $scope.file.fid
            });
        }, $scope.js_close = function () {
            $rootScope.locator.show_slide = false;
        };
    }
]);