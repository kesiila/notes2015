'use strict';
innerApp.controller('projects_ctrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$rootParams',
    function ($scope, $rootScope, $location,$rootParams) {
        var c;
        $rootScope.global.title = '群组';
        $scope.current_menu = 'all';
        $scope.view_type = 'grid';
        var o = kzi.localData.get('project_list_type');
        $scope.view_type = o ? o : 'grid';
        $scope.js_view_toggle = function (t) {
            $scope.view_type = t;
            kzi.localData.set('project_list_type', t);
        };
        $scope.js_star_toggle = function (e, t) {
            wt.bus.project.set_star_toggle(t, function () {
                var e = _.findWhere($rootScope.projects, { pid: t.pid });
                e.is_star = t.is_star;
            });
            e.preventDefault();
            e.stopPropagation();
        };
        var r = function () {
            $scope.projects = _.sortBy($scope.projects, function (e) {
                return e.pos;
            });
            $rootScope.sort_projects();
        };
        var setTeamProjects = function (teams, projects) {
            _.each(teams, function (team) {
                team.projects = _.where(projects, { team_id: team.team_id });
            });
        };
        $scope.set_project_sort_options = function () {
            $scope.project_sort_options = {
                containment: '.projects-panel',
                placeholder: 'project-placeholder',
                helper: 'clone',
                revert: 10,
                dropOnEmpty: true,
                tolerance: 'pointer',
                distance: '4',
                delay: '75',
                disabled: false,
                accept: '.project-item',
                start: function (e, t) {
                    t.item.addClass('project-picked-up');
                    $('.project-placeholder').css({
                        height: t.item.css('height'),
                        width: t.item.css('width')
                    });
                },
                stop: function (t, i) {
                    i.item.removeClass('project-picked-up');
                    var n = i.item.attr('project-id'), a = i.item.prev().attr('project-id'), s = i.item.next().attr('project-id'), o = null, l = null;
                    if (_.isEmpty(s) || (o = _.findWhere($scope.projects, { pid: s })), _.isEmpty(a) || (l = _.findWhere($scope.projects, { pid: a })), o || l) {
                        var c = wt.bus.project.calculate_prj_pos(l, o),
                            u = _.findWhere($scope.projects, { pid: n });
                        u.pos = c;
                        wt.data.project.prj_position(n, c, function () {
                            r();
                        });
                    }
                }
            };
        };
        c = function () {
            $rootScope.load_common_data_in(
                function (commondata) {
                    $scope.teams = commondata.teams;
                    $scope.projects = commondata.projects;
                    setTeamProjects($scope.teams, $scope.projects);
                    $scope.set_project_sort_options();
                },
                null,
                function () {
                    $rootScope.global.loading_done = true;
                });
        };
        c();
        $scope.js_goto_project = function (e, t) {
            $location.path('/project/' + t.pid);
        };
        $scope.$on('socket_message_project_list', function () {
            c();
        });
    }
]);

innerApp.controller('projects_archive_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    '$popbox',
    '$timeout',
    function (e, t, i, n) {
        i.global.title = '归档群组', e.js_goto_project = function (e, t) {
            n.path('/project/' + t.pid);
        };
        i.load_common_data_in(function (commonData) {
            e.teams = commonData.teams, wt.data.project.get_all('archive', function (t) {
                e.archived_projects = t.data;
            }, null, function () {
                i.global.loading_done = true;
            });
        }, function () {
            i.global.loading_done = true;
        }, function () {
        });
    }
]);

innerApp.controller('project_add_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function (e, t, i) {
        i.global.title = '新建群组';
        var s = t.team_id;
        e.current_menu = s ? s : 'all', e.is_add_team = false, i.load_teams(function (t) {
            e.owner_teams = _.where(t, { curr_role: 1 });
            var i = _.findWhere(e.owner_teams, { team_id: s });
            e.current_team = i ? i : {
                team_id: '',
                name: '点击选择团队'
            };
        }, null, function () {
            i.global.loading_done = true;
        }), e.js_add_prj = function (t, n, a) {
            return _.isEmpty(e.current_team.team_id) ? (t.$errors.unshift('请选择一个团队'), void 0) : (a && null !== a || (a = ''), e.is_saving_project = true, wt.data.project.create(e.current_team.team_id, n, a, function (t) {
                t.data.curr_role = 1, t.data.is_star = 0;
                var n = _.findWhere(i.projects, { pid: t.data.pid });
                n || i.projects.push(t.data), e.js_cancel();
            }, null, function () {
                e.is_saving_project = false;
            }), void 0);
        }, e.js_open_add_team = function () {
            e.is_add_team = true;
        }, e.js_cancel_add_team = function () {
            e.is_add_team = false;
        }, e.js_add_team = function (t, n) {
            e.is_saving_team = true, wt.data.team.add(n, '', function (t) {
                e.owner_teams.push(t.data);
                var n = _.findWhere(i.teams, { team_id: t.data.team_id });
                n || i.teams.push(t.data), e.current_team = t.data, e.is_add_team = false;
            }, null, function () {
                e.is_saving_team = false;
            });
        }, e.js_change_team = function (t, i) {
            t.$errors = [], e.current_team = i;
        }, e.js_cancel = function () {
            window.history.go(-1);
        };
    }
]);

innerApp.controller('project_archive_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$compile',
    '$location',
    function (e, t, i, n, a, s) {
        var o = t.pid, r = 1;
        i.pid = o, e.archived_view = 'task';
        var l = function () {
            _.isEmpty(e.entries) && (i.global.loading_done = false, wt.data.entry.get_archived_list(o, function (t) {
                e.entries = t.data, i.global.loading_done = true;
            }));
        }, c = function () {
            i.loading_tasks = true, wt.data.task.get_archived_list(o, r, kzi.config.default_count, function (t) {
                e.last_date = wt.bus.task.set_is_show_data(t.data, e.last_date), _.isEmpty(t.data) ? e.tasks = [] : (r += 1, e.tasks = _.isEmpty(e.tasks) ? t.data : e.tasks.concat(t.data)), kzi.config.default_count > t.data.length && (e.has_no_more = true);
            }, null, function () {
                i.loading_tasks = false;
            });
        }, u = function () {
            'task' !== e.archived_view && l();
        };
        e.js_archive_view_toggle = function (t) {
            e.archived_view = t, u();
        }, e.load_archived_tasks_more = function () {
            c();
        }, e.$on(kzi.constant.event_names.on_task_unarchived, function (t, i) {
            var n = _.findWhere(e.tasks, { tid: i.tid });
            e.tasks = _.reject(e.tasks, function (e) {
                return e.tid === n.tid;
            }), n.is_show_date && (e.last_date = wt.bus.task.set_is_show_data(e.tasks, e.last_date));
        }), e.js_unarchive_entry = function (t, n) {
            wt.data.entry.unarchive(o, n, function () {
                e.entries = _.reject(e.entries, function (e) {
                    return e.entry_id === n;
                }), i.project.entries = [], i.project.tasks = [];
            });
        }, e.js_show_entry_menu = function (t, a) {
            t.stopPropagation(), n.popbox({
                target: t,
                templateUrl: '/view/project/task/pop_unarchive_task.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, n) {
                        e.popbox = t, e.js_close = function () {
                            t.close();
                        }, i.load_tasks(o, function (t) {
                            e.entries = t.entries, _.each(e.entries, function (e) {
                                e.selected = 0;
                            });
                        }), e.js_unarchive_task = function (s) {
                            _.each(e.entries, function (e) {
                                e.selected = 0;
                            }), s.selected = 1, wt.data.task.unarchive(o, a.tid, s.entry_id, function () {
                                i.project.entries = [], i.project.tasks = [], n.scope.tasks = _.reject(n.scope.tasks, function (e) {
                                    return e.tid === a.tid;
                                }), a.is_show_date && (n.scope.last_date = wt.bus.task.set_is_show_data(n.scope.tasks, e.last_date));
                            }), t.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: e };
                    }
                }
            }).open();
        }, i.load_project(o, function (t) {
            i.global.title = '归档活动 | ' + t.info.name, e.project = t, e.permission = 1 == e.project.info.archived ? kzi.constant.permission.project_archived : 2 == e.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok, i.global.loading_done = true, c();
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? s.path('/project/' + o + '/notfound') : wt.data.error(e);
        });
    }
]);