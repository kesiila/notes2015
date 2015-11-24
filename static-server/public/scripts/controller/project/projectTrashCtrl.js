'use strict';
innerApp.controller('project_trash_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function ($scope, $routeParams, $rootScope, $popbox, $location) {
        var o = $routeParams.pid;
        $rootScope.pid = o;
        var r = [];
        $scope.filter_type = 0, $scope.filter_type_text = '全部', $rootScope.load_project(o, function (t) {
            $rootScope.global.title = '回收站 | ' + t.info.name, $scope.project = t, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok, wt.data.project.get_trash(o, function (t) {
                $rootScope.global.loading_done = true, $scope.wtobjs = t.data, r = t.data;
            });
        }, function (e) {
            e.code == kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + o + '/notfound') : wt.data.error(e);
        }), $scope.js_filter = function (t) {
            0 == t ? ($scope.wtobjs = r, $scope.filter_type = 0, $scope.filter_type_text = '全部') : 1 == t ? ($scope.wtobjs = _.filter(r, function (e) {
                return 'task' == e.entity.etype || 'entry' == e.entity.etype;
            }), $scope.filter_type = 1, $scope.filter_type_text = '活动') : 2 == t ? ($scope.wtobjs = _.filter(r, function (e) {
                return 'post' == e.entity.etype;
            }), $scope.filter_type = 2, $scope.filter_type_text = '问答') : 3 == t ? ($scope.wtobjs = _.filter(r, function (e) {
                return 'file' == e.entity.etype;
            }), $scope.filter_type = 3, $scope.filter_type_text = '文件') : 4 == t && ($scope.wtobjs = _.filter(r, function (e) {
                return 'page' == e.entity.etype;
            }), $scope.filter_type = 4, $scope.filter_type_text = '文档');
        }, $scope.js_show_trash_menu = function (t, a) {
            $popbox.popbox({
                target: t,
                placement: 'bottom',
                templateUrl: '/view/project/trash/pop_trash_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, n) {
                        e.popbox = t, e.entity = a.entity, e.project = n.scope.project, e.permission = n.scope.permission, e.step = 0, e.js_step = function (t) {
                            e.step = t;
                        }, e.js_close = function () {
                            t.close();
                        }, $rootScope.load_tasks(o, function (t) {
                            e.entries = t.entries, _.each(e.entries, function (e) {
                                e.selected = 0;
                            });
                        }), e.js_restore = function () {
                            if ('entry' == a.entity.etype) {
                                var e = a.entity.eid;
                                wt.data.entry.untrash(o, e, function () {
                                    $rootScope.project.entries = [], $rootScope.project.tasks = [], n.scope.wtobjs = _.reject(n.scope.wtobjs, function (t) {
                                        return t.entity.eid === e;
                                    });
                                });
                            } else if ('folder' === a.entity.etype || 'file' == a.entity.etype) {
                                var s = a.entity.eid;
                                wt.data.file.untrash(o, s, function () {
                                    $rootScope.project.files = [], n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid === s;
                                    });
                                });
                            } else if ('post' === a.entity.etype) {
                                var r = a.entity.eid;
                                wt.data.post.untrash(o, r, function () {
                                    $rootScope.project.files = [], n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid === r;
                                    });
                                });
                            } else if ('page' === a.entity.etype) {
                                var l = a.entity.eid;
                                wt.data.page.untrash(o, l, function () {
                                    $rootScope.project.files = [], n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid === l;
                                    });
                                });
                            } else if ('event' === a.entity.etype) {
                                var c = a.entity.eid;
                                wt.data.event.untrash(o, c, function () {
                                    n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid === c;
                                    });
                                });
                            }
                            t.close();
                        }, e.js_restore_task = function (s) {
                            if (_.each(e.entries, function (e) {
                                    e.selected = 0;
                                }), s.selected = 1, s) {
                                var r = a.entity.eid;
                                wt.data.task.untrash(o, s.entry_id, r, function () {
                                    $rootScope.project.entries = [], $rootScope.project.tasks = [], n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid == r;
                                    });
                                }), t.close();
                            }
                        }, e.js_destory = function () {
                            if ('task' == a.entity.etype) {
                                var e = a.entity.eid;
                                wt.data.task.del(o, e, function () {
                                    n.scope.wtobjs = _.reject(n.scope.wtobjs, function (t) {
                                        return t.entity.eid == e;
                                    });
                                });
                            } else if ('entry' == a.entity.etype) {
                                var i = a.entity.eid;
                                wt.data.entry.del(o, i, function () {
                                    n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid == i;
                                    });
                                });
                            } else if ('folder' == a.entity.etype || 'file' == a.entity.etype) {
                                var s = a.entity.eid;
                                wt.data.file.del(o, s, function () {
                                    n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid == s;
                                    });
                                });
                            } else if ('post' === a.entity.etype) {
                                var r = a.entity.eid;
                                wt.data.post.del(o, r, function () {
                                    n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid === r;
                                    });
                                });
                            } else if ('page' === a.entity.etype) {
                                var l = a.entity.eid;
                                wt.data.page.del(o, l, function () {
                                    n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid === l;
                                    });
                                });
                            } else if ('event' === a.entity.etype) {
                                var c = a.entity.eid;
                                wt.data.event.del(o, c, function () {
                                    n.scope.wtobjs = _.reject(n.scope.wtobjs, function (e) {
                                        return e.entity.eid === c;
                                    });
                                });
                            }
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
        }, $scope.js_clear_trash = function (t) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/trash/pop_empty_trash.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, n) {
                        e.popbox = t, e.js_close = function () {
                            t.close();
                        }, e.js_empty_trash = function () {
                            $rootScope.global.loading_done = false, wt.data.project.clear_trash(o, function () {
                                $rootScope.global.loading_done = true, n.scope.wtobjs = [];
                            }), t.close();
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
    }
]);