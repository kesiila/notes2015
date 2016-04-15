'use strict';
innerApp.controller('project_file_list_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    '$modal',
    '$popbox',
    function ($scope, $routeParams, $rootScope, $location, $modal, $popbox) {
        var pid = $routeParams.pid;
        var folder_id = $routeParams.folder_id || '';
        $rootScope.pid = pid;
        $scope.current_tab = null;
        _.isEmpty(folder_id) && ($rootScope.folder = { folder_id: folder_id });
        $scope.token = kzi.get_cookie('sid');
        var l = [];
        $scope.filter_type = 0;
        $scope.filter_type_text = '全部';
        $scope.upload_enabled = true;
        var c = function (t, n) {
            $rootScope.global.loading_done = false;
            wt.data.file.move(
                pid,
                t.fid,
                t.folder_id,
                n.fid,
                function () {
                        t.folder_id = n.fid;
                        $scope.files = _.reject($scope.files, function (e) {
                            return e.fid === t.fid;
                        });
                        $scope.switching_file_view_data();
                        $rootScope.global.loading_done = true;
                 }
            );
        };
        var u = function (t) {
            $scope.files = _.reject($scope.files, function (e) {
                return e.fid === t.fid || e.folder_id === t.fid;
            });
            $rootScope.refresh_cache.file.del(t.fid);
            $scope.switching_file_view_data();
        };
        $scope.switching_file_view_data = function () {
            'grid' === $scope.view_type ? ($scope.files_grid = $scope.files, $scope.files_list = []) : ($scope.files_grid = [], $scope.files_list = $scope.files);
        };
        $scope.set_view_type = function (t) {
            $scope.view_type = t, $scope.switching_file_view_data(), kzi.localData.set('file_list_view_type', t);
        };
        $scope.js_change_tab = function (t) {
            if ($scope.current_tab !== t)
                switch ($scope.current_tab = t, t) {
                case 0:
                    _.each($scope.files, function (e) {
                        e.is_hide = false;
                    });
                    break;
                case 1:
                    _.each($scope.files, function (e) {
                        e.is_hide = e.owner.uid === $rootScope.global.me.uid ? false : true;
                    });
                    break;
                case 2:
                    _.each($scope.files, function (e) {
                        e.is_hide = _.findWhere(e.watchers, { uid: $rootScope.global.me.uid }) ? false : true;
                    });
                    break;
                default:
                }
        };
        $scope.js_select_filter = function (t) {
            $scope.current_filter !== t && ($scope.current_filter = t, kzi.localData.set('files_filter_type', t), 'default' === t ? ($scope.files = _.sortBy($scope.files, function (e) {
                return -e.create_date;
            }), $scope.files = _.sortBy($scope.files, function (e) {
                return -e.type;
            })) : 'name' === t ? $scope.files = _.sortBy($scope.files, function (e) {
                return e.name;
            }) : 'update_date' === t ? $scope.files = _.sortBy($scope.files, function (e) {
                return -e.update_date;
            }) : 'create_date' === t && ($scope.files = _.sortBy($scope.files, function (e) {
                return -e.create_date;
            })));
        };
        $rootScope.load_files(pid, folder_id, function (t) {
            $rootScope.global.title = '文件 | ' + t.info.name;
            $rootScope.global.loading_done = true;
            $scope.project = t;
            $scope.permission = 1 === $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok;
            var n = [];
            if (folder_id) {
                n = _.where(t.files, { folder_id: folder_id });
                $scope.is_folder = true;
                var a = _.findWhere(t.files, { fid: folder_id });
                $scope.folder_name = a ? _.findWhere(t.files, { fid: folder_id }).name : $rootScope.folder.name;
            } else
                n = _.where(t.files, { folder_id: '' }), $scope.is_folder = false, $scope.folder_name = '文件';
            $scope.files = n, $scope.js_change_tab(0);
            var s = kzi.localData.get('file_list_view_type');
            $scope.view_type = _.isUndefined(s) || _.isNull(s) ? 'grid' : s;
            var o = kzi.localData.get('files_filter_type');
            o || (o = 'default'), $scope.js_select_filter(o);
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + pid + '/notfound') : wt.data.error(e);
        });
        $scope.js_filter_file = function (t) {
            switch ($scope.filter_type = t, t) {
            case 0:
                $scope.files = l, $scope.filter_type_text = '全部';
                break;
            case 1:
                $scope.files = _.filter(l, function (e) {
                    return 1 === e.is_watch;
                }), $scope.filter_type_text = '关注';
                break;
            case 2:
                $scope.files = _.filter(l, function (e) {
                    return e.ext === kzi.constant.exts.jpeg || e.ext === kzi.constant.exts.jpg || e.ext == kzi.constant.exts.gif || e.ext == kzi.constant.exts.png;
                }), $scope.filter_type_text = '图片';
                break;
            case 3:
                $scope.files = _.filter(l, function (e) {
                    return e.ext === kzi.constant.exts.doc || e.ext === kzi.constant.exts.xls || e.ext == kzi.constant.exts.ppt || e.ext == kzi.constant.exts.pdf || e.ext == kzi.constant.exts.docx || e.ext == kzi.constant.exts.xlsx || e.ext == kzi.constant.exts.pptx;
                }), $scope.filter_type_text = '文档';
                break;
            case 4:
                $scope.files = _.filter(l, function (e) {
                    return e.ext === kzi.constant.exts.zip || e.ext === kzi.constant.exts.rar;
                }), $scope.filter_type_text = '压缩';
                break;
            default:
                $scope.files = l;
            }
            $scope.set_view_type($scope.view_type);
        };
        $scope.js_show_more_menu = function (t) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/file/pop_file_more_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.email = pid + kzi.constant.mail.domain, e.step = 0, e.js_step = function (t) {
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
        };
        $scope.js_upload_file_pop = function () {
            $modal.open({
                backdrop: false,
                templateUrl: '/view/project/file/pop_upload.html',
                controller: function (e, t, n) {
                    e.title = '上传文件';
                    e.js_close = function (e) {
                        t.close(e);
                    };
                    e.js_ok = function () {
                        var a = [];
                        _.each(e.queue, function (e) {
                            if (!e.error) {
                                var t = {};
                                t.name = e.fname, t.ext = kzi.constant.get_ext(e.ext), t.size = e.size, t.path = e.url, t.icon = kzi.helper.build_file_icon(t), t.folder_id = folder_id, a.push(t);
                            }
                        }), wt.data.file.upload(pid, a, function (e) {
                            _.each(e.data, function (e) {
                                e.icon = kzi.helper.build_file_icon(e);
                                _.isEmpty(n.scope.files) && (n.scope.files = []);
                                n.scope.files.push(e);
                                $rootScope.refresh_cache.file.add(e);
                                n.scope.switching_file_view_data();
                            });
                        }), t.close();
                    };
                },
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        };
        $scope.js_trigger_upload = function (e) {
            $(e.target).parents('.btn-group').eq(0).find('input[type=file]').click();
        };
        $scope.file_upload_option = {
            previewMaxWidth: 100,
            previewMaxHeight: 110,
            url: [
                kzi.config.wtbox(),
                '?pid=' + pid,
                '&token=' + kzi.get_cookie('sid')
            ].join(''),
            formData: {
                target: 'prj',
                type: 'project',
                pid: pid,
                folder_id: folder_id
            }
        };
        $scope.$on(kzi.constant.event_names.on_file_add, function (t, i) {
            i && 'project' === i.type && ($scope.files.push(i.file), $scope.set_view_type($scope.view_type));
        });
        $scope.global_fileupload_queue = function () {
            return $rootScope.upload_queue.get_project(pid, folder_id);
        };
        $scope.js_add_folder_pop = function (t) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/file/pop_add_folder.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, n) {
                        e.popbox = t, e.js_close = function () {
                            t.close();
                        }, e.js_add_folder = function (a, s) {
                            _.isEmpty(s) || (e.is_save_ing = true, wt.data.file.add_folder(pid, s, function (e) {
                                e.data.icon = kzi.helper.build_file_icon(e.data), n.scope.files.push(e.data), $rootScope.project.files.push(e.data), t.close();
                            }, function () {
                            }, function () {
                                e.is_save_ing = false;
                            }));
                        }, e.js_keydown_folder_input = function (t) {
                            13 == t.keyCode && e.js_add_folder(e.name);
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
        $scope.js_show_menu = function (t, n, a, r) {
            t.stopPropagation(), 1 === n.type ? $popbox.popbox({
                target: t,
                top: a,
                left: r,
                templateUrl: '/view/project/file/pop_folder_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, i) {
                        e.popbox = t, e.folder = n, e.folder_name = n.name, e.folder_icons = kzi.constant.get_folder_icons, e.js_step = function (t) {
                            e.step = t;
                        }, e.js_close = function () {
                            t.close();
                        }, e.js_change_name = function (i, a) {
                            wt.data.file.update(pid, n.fid, a, '', function () {
                            }, null, function () {
                                e.is_save_ing = false;
                            }), n.name = a, t.close();
                        }, e.js_set_folder_icon = function (t) {
                            wt.data.file.update_ext(pid, n.fid, t.ext, function () {
                            }), e.folder.ext = t.ext, e.folder.icon = t.path;
                        }, e.js_del_folder = function () {
                            i.remove_file_and_refresh(n), wt.data.file.trash(pid, n.fid, function () {
                            }), t.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            remove_file_and_refresh: u
                        };
                    }
                }
            }).open() : $popbox.popbox({
                target: t,
                top: a,
                left: r,
                templateUrl: '/view/project/file/pop_file_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, a) {
                        e.popbox = t, e.file = n, e.js_step = function (t) {
                            e.step = t;
                        }, e.js_close = function () {
                            t.close();
                        };
                        var s = _.where($rootScope.project.files, { type: 1 });
                        e.folders = s, n.folder_id && (e.folders.unshift({
                            fid: '',
                            name: '根目录'
                        }), e.folders = _.reject(e.folders, function (e) {
                            return e.fid === n.folder_id;
                        })), e.js_del_file = function () {
                            a.remove_file_and_refresh(n), wt.data.file.trash(pid, n.fid, function () {
                            }), t.close();
                        }, $rootScope.load_project_members(pid, function (t) {
                            var i = [];
                            _.each(t.members, function (e) {
                                if (1 == e.status) {
                                    var t = _.findWhere(n.watchers, { uid: e.uid });
                                    e.is_watch = t ? 1 : 0, i.push(e);
                                }
                            }), e.members = i;
                        }), e.js_toggle_watch = function (e) {
                            if (e.is_watch) {
                                var t = _.findWhere(n.watchers, { uid: e.uid });
                                t && (n.watchers = _.reject(n.watchers, function (t) {
                                    return t.uid === e.uid;
                                })), e.is_watch = 0, wt.data.unwatch(pid, kzi.constant.xtype.file, n.fid, e.uid, function () {
                                });
                            } else {
                                var t = _.findWhere(n.watchers, { uid: e.uid });
                                t || (n.watchers.push(e), e.is_watch = 1, wt.data.watch(pid, kzi.constant.xtype.file, n.fid, e.uid, function () {
                                }));
                            }
                        }, e.js_watch_all = function () {
                            if (n.watchers.length !== e.members) {
                                var i = _.pluck(e.members, 'uid');
                                wt.data.watch_batch(pid, kzi.constant.xtype.file, n.fid, i, function () {
                                    n.watchers = e.members;
                                }), _.each(e.members, function (e) {
                                    e.is_watch = 1;
                                });
                            }
                            t.close();
                        }, e.js_move_to = function (e) {
                            e && c(n, e), t.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            remove_file_and_refresh: u
                        };
                    }
                }
            }).open();
        };
        $scope.js_navigate_detail = function (e, t) {
            e.stopPropagation(), e.preventDefault(), 0 === t.type ? $rootScope.locator.to_file(t.pid, t.fid, false) : ($rootScope.folder = {
                folder_id: t.fid,
                name: t.name
            }, $location.path('/project/' + pid + '/folder/' + t.fid));
        };
        $scope.js_navigate = function (t, a) {
            0 === a.type ? 'list' === $scope.view_type && $scope.js_navigate_detail(t, a) : ($rootScope.folder = {
                folder_id: a.fid,
                name: a.name
            }, $location.path('/project/' + pid + '/folder/' + a.fid));
        };
        $scope.file_draggable_options = {
            helper: 'clone',
            placeholder: 'wt-placeholder',
            containment: '.centerpanel',
            hoverClass: 'file-state-on-draggable',
            zIndex: 2000,
            delay: 300,
            start: function (e, t) {
                t.helper.addClass('file-state-on-draggable');
            },
            stop: function () {
            },
            drag: function () {
            }
        };
        $scope.folder_droppable_options = {
            accept: '.file-item',
            over: function () {
            },
            out: function () {
            },
            hoverClass: 'folder-state-file-over',
            drop: function (t, i) {
                var n = $(t.target).attr('file-id'), a = i.helper.attr('file-id');
                _.isEmpty(n) || _.isEmpty(a) || $scope.$apply(function () {
                    var t = _.findWhere($scope.files, { fid: a }), i = _.findWhere($scope.files, { fid: n });
                    c(t, i);
                });
            }
        };
        $scope.dragfile_option = { upload_option: $scope.file_upload_option }, $scope.$on(kzi.constant.event_names.on_file_trash, function (t, i) {
            i && ($scope.files = _.reject($scope.files, function (e) {
                return e.fid == i.fid;
            }), $scope.set_view_type($scope.view_type));
        });
        $scope.$on(kzi.constant.event_names.on_file_move, function (t, i) {
            i && ($scope.files = _.reject($scope.files, function (e) {
                return e.fid == i.fid;
            }), $scope.set_view_type($scope.view_type));
        });
        $scope.$on(kzi.constant.event_names.on_right_menu, function (t, i) {
            var n = kzi.helper.mouse_position(i), a = null, s = 'file-item-mark';
            if ($(i.target).hasClass(s))
                a = $(i.target).attr('file-id');
            else {
                if (!($(i.target).parents('.' + s).length > 0))
                    return;
                a = $(i.target).parents('.' + s).attr('file-id');
            }
            if (a) {
                var o = _.findWhere($scope.files, { fid: a });
                o && $scope.js_show_menu(i, o, n.y, n.x);
            }
        });
    }
]);