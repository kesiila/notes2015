'use strict';
innerApp.controller('feed_all_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '全部动态', $rootScope.global.loading_done = true, $scope.current_tab = 0;
        var a = 1, s = function () {
                $rootScope.part_loading_done = false, wt.data.activity.get_feeds('all', $scope.current_tab, a, function (e) {
                    _.isEmpty(e.data) ? $scope.feeds = [] : (a += 1, $scope.feeds = _.isEmpty($scope.feeds) ? e.data : $scope.feeds.concat(e.data)), $scope.has_more = kzi.config.default_count > e.data.length ? false : true;
                }, null, function () {
                    $rootScope.part_loading_done = true;
                });
            };
        s(), $scope.load_feeds_more = function () {
            s();
        }, $scope.js_change_tab = function (e) {
            $scope.current_tab = e, a = 1, $scope.feeds = [], s();
        };
    }
]);

innerApp.controller('activity_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    function ($rootScope, $scope, $routeParams) {
        $rootScope.global.title = '活动';
        var team_id = $routeParams.team_id, a = null, s = {
                pid: 'all',
                name: '全部群组',
                selected: true
            };
        $rootScope.load_team(
                team_id,
                function (team) {
                    $rootScope.global.loading_done = true;
                    $scope.projects = [];
                    $scope.projects.push(s);
                    _.each(team.projects, function (project) {
                        project.selected = false;
                        $scope.projects.push(project);
                    });
                    a = $scope.projects[0];
                },
                function (e) {
                    e.code == kzi.statuses.team_error.not_found.code ? $scope.permission = kzi.constant.permission.team_not_found : wt.data.error(e);
                }
        );
        $scope.js_select_prj = function (e) {
            a.pid !== e.pid && (a.selected = false, e.selected = true, a = e, $scope.$broadcast(kzi.constant.event_names.filter_activity_by_prj, { pid: a.pid }));
        };
    }
]);

innerApp.controller('team_activity_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    function ($rootScope, $scope, $routeParams) {
        $scope.tpl_prefix = 'user_';
        var n = 0, a = 'all', s = 'all', o = $routeParams.team_id, r = function (t) {
                $rootScope.global.loading_done = false, wt.data.activity.get_for_teams(o, a, s, n, kzi.config.default_count, function (i) {
                    i.data.length > 0 && (n = i.data[i.data.length - 1].published), angular.isFunction(t) && t(i.data), $rootScope.global.loading_done = true;
                });
            };
        $scope.js_load_more = function (e) {
            $scope.eventTarget = e.target, wt.utility.activity.load_activities(r, $scope, function () {
                $($scope.eventTarget).button('reset');
            });
        }, $scope.$on(kzi.constant.event_names.filter_activity_by_prj, function (e, i) {
            _.isEmpty(i.pid) || (a = i.pid), n = 0, $scope.activities = null, wt.utility.activity.load_activities(r, $scope);
        }), $scope.$on(kzi.constant.event_names.filter_activity_by_type, function (e, i) {
            s = i.data, n = 0, $scope.activities = null, wt.utility.activity.load_activities(r, $scope);
        }), wt.utility.activity.load_activities(r, $scope);
    }
]);

innerApp.controller('item_activity_ctrl', [
    '$scope',
    function ($scope) {
        var i = null, n = null;
        $scope.tpl_prefix = 'item_';
        var a = 0, s = function (e) {
                $scope.loading_activity = true, wt.data.activity.get_for_item(n, i, a, kzi.config.default_count, function (t) {
                    t.data.length > 0 && (a = t.data[t.data.length - 1].published), angular.isFunction(e) && e(t.data);
                }, null, function () {
                    $scope.loading_activity = false;
                });
            };
        $scope.js_load_more = function () {
            wt.utility.activity.load_activities(s, $scope);
        }, $scope.$on(kzi.constant.event_names.reload_item_activities, function (e, o) {
            a = 0, n = o.xtype, i = o.xid, $scope.activities = null, wt.utility.activity.load_activities(s, $scope);
        });
    }
]);

innerApp.controller('project_activity_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    function ($scope, $routeParams, $rootScope, $location) {
        var s = $routeParams.pid;
        $rootScope.pid = s, $scope.tpl_prefix = 'project_';
        var o = 0, r = 'all', l = function (t) {
                $scope.loading_activity = true, wt.data.activity.get_for_project(s, r, o, kzi.config.default_count, function (i) {
                    i.data.length > 0 && (o = i.data[i.data.length - 1].published), angular.isFunction(t) && t(i.data), $scope.loading_activity = false;
                });
            };
        $scope.js_to_graph = function (e) {
            kzi.localData.set('prj_graph_view_type', e), $location.path('/project/' + s + '/graph');
        }, $rootScope.load_project(s, function (t) {
            $rootScope.global.title = '活动 | ' + t.info.name, $scope.project = t, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok, $rootScope.global.loading_done = true, wt.utility.activity.load_activities(l, $scope);
        }, function (e) {
            e.code == kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + s + '/notfound') : wt.data.error(e);
        }), $scope.js_load_more = function (t) {
            $scope.eventTarget = t.target, wt.utility.activity.load_activities(l, $scope, function () {
                $($scope.eventTarget).button('reset');
            });
        }, $scope.$on(kzi.constant.event_names.filter_activity_by_type, function (t, i) {
            r = i.data, o = 0, $scope.activities = null, wt.utility.activity.load_activities(l, $scope);
        });
    }
]);

innerApp.controller('my_activity_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    function ($rootScope, $scope, $routeParams) {
        var n = $routeParams.team_id;
        $scope.tpl_prefix = 'user_';
        var a = 0, s = 'all', o = function (t) {
                $rootScope.global.loading_done = false, wt.data.activity.forme(n, s, a, kzi.config.default_count, function (i) {
                    i.data.length > 0 && (a = i.data[i.data.length - 1].published), angular.isFunction(t) && t(i.data), $rootScope.global.loading_done = true;
                });
            };
        $scope.js_load_more = function () {
            $scope.eventTarget = event.target, wt.utility.activity.load_activities(o, $scope, function () {
                $($scope.eventTarget).button('reset');
            });
        }, $scope.$on(kzi.constant.event_names.filter_activity_by_type, function (e, i) {
            s = i.data, a = 0, $scope.activities = null, wt.utility.activity.load_activities(o, $scope);
        }), wt.utility.activity.load_activities(o, $scope);
    }
]);

innerApp.controller('filter_activity_ctrl', [
    '$scope',
    function ($scope) {
        $scope.filter_items = [
            {
                type: 'all',
                display_name: '全部',
                selected: true
            },
            {
                type: 'task',
                display_name: '活动'
            },
            {
                type: 'post',
                display_name: '话题'
            },
            {
                type: 'file',
                display_name: '文件'
            },
            {
                type: 'page',
                display_name: '文档'
            },
            {
                type: 'event',
                display_name: '日程'
            }
        ], $scope.selected_item = $scope.filter_items[0], $scope.js_select_filter_item = function (e) {
            e.type !== $scope.selected_item.type && ($scope.selected_item.selected = false, e.selected = true, $scope.selected_item = e, $scope.$emit(kzi.constant.event_names.emit_filter_activity_by_type, $scope.selected_item.type));
        };
    }
]);