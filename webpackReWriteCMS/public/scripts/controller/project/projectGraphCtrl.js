'use strict';
innerApp.controller('project_graph_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    function ($scope, $routeParams, $rootScope, $location) {
        var l = $routeParams.pid, c = 800, u = 450, d = -10;
        $scope.step = 1, $scope.js_step = function (t) {
            $scope.step = t;
        }, moment.lang(kzi.config.lang);
        var p = function (e) {
                var t = {
                        render: 'members_task_graph',
                        data: [
                            {
                                name: '已完成',
                                value: _.pluck(e, 'completed'),
                                color: kzi.config.colors.completed
                            },
                            {
                                name: '私有',
                                value: _.pluck(e, 'uncompleted'),
                                color: kzi.config.colors.uncompleted
                            }
                        ],
                        labels: _.pluck(e, 'display_name'),
                        label: {
                            textAlign: 'right',
                            textBaseline: 'middle',
                            rotate: -30
                        },
                        width: c,
                        height: u,
                        background_color: '#fbfbfb',
                        border: 0,
                        bar_space: 20,
                        sub_option: { border: { width: 0 } },
                        decimalsnum: 0,
                        legend: {
                            enable: true,
                            row: 1,
                            column: 'max',
                            valign: 'top',
                            background_color: null,
                            offsetx: d,
                            offsety: -5,
                            border: false
                        },
                        coordinate: {
                            background_color: 0,
                            axis: { color: '#e1e1e1' },
                            scale: {
                                scale_enable: false,
                                start_scale: 0
                            },
                            width: '80%',
                            height: '80%'
                        }
                    };
                new iChart.ColumnStacked2D(t).draw();
            }, m = function (e) {
                var t = {
                        render: 'labels_task_graph',
                        data: [
                            {
                                name: '已完成',
                                value: _.pluck(e, 'completed'),
                                color: kzi.config.colors.completed
                            },
                            {
                                name: '私有',
                                value: _.pluck(e, 'uncompleted'),
                                color: kzi.config.colors.uncompleted
                            }
                        ],
                        labels: _.pluck(e, 'label_desc'),
                        label: {
                            textAlign: 'right',
                            textBaseline: 'middle',
                            rotate: -30
                        },
                        width: c,
                        height: u,
                        background_color: '#fbfbfb',
                        border: 0,
                        bar_space: 20,
                        sub_option: { border: { width: 0 } },
                        decimalsnum: 0,
                        legend: {
                            enable: true,
                            row: 1,
                            column: 'max',
                            valign: 'top',
                            background_color: null,
                            offsetx: d,
                            offsety: -5,
                            border: false
                        },
                        coordinate: {
                            background_color: 0,
                            axis: { color: '#e1e1e1' },
                            scale: {
                                scale_enable: false,
                                start_scale: 0
                            },
                            width: '80%',
                            height: '80%'
                        }
                    };
                new iChart.ColumnStacked2D(t).draw();
            }, h = function (e) {
                var t = {
                        render: 'entry_task_graph',
                        data: [
                            {
                                name: '已完成',
                                value: _.pluck(e, 'completed'),
                                color: kzi.config.colors.completed
                            },
                            {
                                name: '私有',
                                value: _.pluck(e, 'uncompleted'),
                                color: kzi.config.colors.uncompleted
                            }
                        ],
                        labels: _.pluck(e, 'name'),
                        label: {
                            textAlign: 'right',
                            textBaseline: 'middle',
                            rotate: -30
                        },
                        width: c,
                        height: u,
                        background_color: '#fbfbfb',
                        border: 0,
                        bar_space: 20,
                        sub_option: { border: { width: 0 } },
                        decimalsnum: 0,
                        legend: {
                            enable: true,
                            row: 1,
                            column: 'max',
                            valign: 'top',
                            background_color: null,
                            offsetx: d,
                            offsety: -5,
                            border: false
                        },
                        coordinate: {
                            background_color: 0,
                            axis: { color: '#e1e1e1' },
                            scale: {
                                scale_enable: false,
                                start_scale: 0
                            },
                            width: '80%',
                            height: '80%'
                        }
                    };
                new iChart.ColumnStacked2D(t).draw();
            }, g = function (e) {
                var t = {
                        render: 'pulse_member_graph',
                        data: [
                            {
                                name: '已完成',
                                value: _.pluck(e, 'completed'),
                                color: kzi.config.colors.completed
                            },
                            {
                                name: '已过期',
                                value: _.pluck(e, 'expired'),
                                color: kzi.config.colors.expired
                            }
                        ],
                        labels: _.pluck(e, 'display_name'),
                        label: {
                            textAlign: 'right',
                            textBaseline: 'middle',
                            rotate: -30
                        },
                        width: c,
                        height: u,
                        background_color: '#fbfbfb',
                        border: 0,
                        bar_space: 20,
                        sub_option: { border: { width: 0 } },
                        decimalsnum: 0,
                        legend: {
                            enable: true,
                            row: 1,
                            column: 'max',
                            valign: 'top',
                            background_color: null,
                            offsetx: d,
                            offsety: -5,
                            border: false
                        },
                        coordinate: {
                            background_color: 0,
                            axis: { color: '#e1e1e1' },
                            scale: {
                                scale_enable: false,
                                start_scale: 0
                            },
                            width: '80%',
                            height: '80%'
                        }
                    };
                new iChart.ColumnStacked2D(t).draw();
            }, v = function (e) {
                var t = [
                        {
                            name: '完成',
                            value: _.pluck(e, 'completed'),
                            color: kzi.config.colors.completed,
                            line_width: 3
                        },
                        {
                            name: '新增',
                            value: _.pluck(e, 'created'),
                            color: kzi.config.colors.created,
                            line_width: 3
                        }
                    ], i = new iChart.LineBasic2D({
                        render: 'pulse_weekly_graph',
                        data: t,
                        width: c,
                        height: u,
                        background_color: '#fbfbfb',
                        border: 0,
                        bar_space: 20,
                        sub_option: { border: { width: 0 } },
                        legend: {
                            enable: true,
                            row: 1,
                            column: 'max',
                            valign: 'top',
                            background_color: null,
                            offsetx: d,
                            offsety: -5,
                            border: false
                        },
                        coordinate: {
                            background_color: 0,
                            axis: { color: '#e1e1e1' },
                            scale: [
                                {
                                    scale_enable: false,
                                    position: 'left'
                                },
                                {
                                    position: 'bottom',
                                    scale_enable: false,
                                    labels: [
                                        '周日',
                                        '周一',
                                        '周二',
                                        '周三',
                                        '周四',
                                        '周五',
                                        '周六'
                                    ]
                                }
                            ],
                            width: '80%',
                            height: '80%'
                        }
                    });
                i.draw();
            }, b = function (e) {
                for (var t = [], i = 0; e.length > i; i++)
                    t.push({
                        name: e[i].display_name,
                        value: e[i].completed,
                        color: kzi.config.colors.completed
                    });
                var n = {
                        render: 'daily_task_graph',
                        data: t,
                        width: c,
                        height: u,
                        coordinate: {
                            scale: {
                                position: 'left',
                                scale_enable: false,
                                start_scale: 0
                            },
                            background_color: 0,
                            axis: { color: '#e1e1e1' },
                            width: '80%',
                            height: '80%'
                        },
                        label: {
                            textAlign: 'right',
                            textBaseline: 'middle',
                            rotate: -30
                        },
                        background_color: '#fbfbfb',
                        border: 0,
                        bar_space: 20,
                        sub_option: { border: { width: 0 } },
                        legend: { enable: false }
                    };
                new iChart.Column2D(n).draw();
            }, y = function () {
                $scope.tab_index = 1, $scope.part_loading_done = false, wt.data.graph.overview(l, function (t) {
                    t.data.overview.percentage = parseInt(100 * (t.data.overview.completed / (t.data.overview.completed + t.data.overview.uncompleted))), $scope.overview = t.data.overview, p(t.data.members), _.isEmpty(t.data.labels) ? $scope.hide_overview_labels_task_graph = true : (m(t.data.labels), $scope.hide_overview_labels_task_graph = false), _.isEmpty(t.data.entries) ? $scope.hide_overview_entry_task_graph = true : (h(t.data.entries), $scope.hide_overview_entry_task_graph = false);
                }, null, function () {
                    $scope.part_loading_done = true;
                });
            }, w = function () {
                $scope.tab_index = 4, $scope.disable_pulse_next = $scope.pulse_end > moment() ? true : false, $scope.pulse_graph_date = $scope.pulse_start.format('YYYY年MM月DD日') + ' - ' + $scope.pulse_end.format('MM月DD日'), $scope.part_loading_done = false, wt.data.graph.get_pulse(l, $scope.pulse_start.valueOf(), $scope.pulse_end.valueOf(), function (t) {
                    $scope.weekly_overview = t.data.overview, g(t.data.members), v(t.data.weekly);
                }, null, function () {
                    $scope.part_loading_done = true;
                });
            }, k = function () {
                $scope.tab_index = 8, $scope.part_loading_done = false;
                var t = $scope.daily_start, n = $scope.daily_end;
                $scope.disable_daily_next = n > moment() ? true : false, wt.data.graph.get_daily(l, t.valueOf(), n.valueOf(), function (t) {
                    $scope.daily_overview = t.data.overview, b(t.data.members), $scope.daily_members = t.data.members, $scope.daily_completed_tasks = t.data.completed, $scope.daily_created_tasks = t.data.created;
                }, null, function () {
                    $rootScope.global.loading_done = true, $scope.part_loading_done = true;
                });
            };
        $scope.js_change_tab = function (t) {
            $scope.tab_index = t;
        }, $scope.js_to_overview = function () {
            $scope.graph_type = 'overview', kzi.localData.set('prj_graph_view_type', $scope.graph_type), y();
        }, $scope.js_to_pulse = function () {
            $scope.graph_type = 'pulse', kzi.localData.set('prj_graph_view_type', $scope.graph_type), $scope.pulse_start = moment().startOf('week').add('days'), $scope.pulse_end = moment().endOf('week').add('days'), w();
        }, $scope.to_pulse_next_week = function () {
            $scope.pulse_end > moment() || $scope.part_loading_done && ($scope.pulse_start = $scope.pulse_start.add('days', 7), $scope.pulse_end = $scope.pulse_end.add('days', 7), w());
        }, $scope.to_pulse_prev_week = function () {
            $scope.part_loading_done && ($scope.pulse_start = $scope.pulse_start.add('days', -7), $scope.pulse_end = $scope.pulse_end.add('days', -7), w());
        }, $scope.js_to_daily = function () {
            $scope.graph_type = 'daily', kzi.localData.set('prj_graph_view_type', $scope.graph_type), $scope.daily_start = moment().startOf('day'), $scope.daily_end = moment().endOf('day'), k();
        }, $scope.js_to_next_daily = function () {
            $scope.daily_end > moment() || $scope.part_loading_done && ($scope.daily_start = $scope.daily_start.add('days', 1), $scope.daily_end = $scope.daily_end.add('days', 1), k());
        }, $scope.js_to_prev_daily = function () {
            $scope.part_loading_done && ($scope.daily_start = $scope.daily_start.add('days', -1), $scope.daily_end = $scope.daily_end.add('days', -1), k());
        };
        var x = function () {
            c = $('.centerpanel').width() - 350;
            var t = kzi.localData.get('prj_graph_view_type');
            switch (_.isEmpty(t) && (t = 'overview'), t) {
            case 'overview':
                $scope.js_to_overview();
                break;
            case 'pulse':
                $scope.js_to_pulse();
                break;
            case 'daily':
                $scope.js_to_daily();
                break;
            default:
            }
        };
        $rootScope.load_project(l, function (t) {
            $rootScope.global.title = '简报 | ' + t.info.name, $rootScope.global.loading_done = true, $scope.project = t, x(), $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok;
        }, function (e) {
            e.code == kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + l + '/notfound') : wt.data.error(e);
        });
        var j = function (t) {
                var i = null;
                return _.isEmpty($scope.daily_completed_tasks) || (i = _.findWhere($scope.daily_completed_tasks, { tid: t })), i;
            }, C = function (t) {
                var i = null;
                return _.isEmpty($scope.daily_created_tasks) || (i = _.findWhere($scope.daily_created_tasks, { tid: t })), i;
            }, D = function () {
                if (!_.isEmpty($scope.daily_members) && (_.each($scope.daily_members, function (e) {
                        e.completed = 0;
                    }), !_.isEmpty($scope.daily_completed_tasks))) {
                    var t = [];
                    _.each($scope.daily_completed_tasks, function (e) {
                        var i = _.pluck(e.members, 'uid');
                        t = t.concat(i);
                    }), _.each($scope.daily_members, function (e) {
                        _.each(t, function (t) {
                            t === e.uid && (e.completed = e.completed + 1);
                        });
                    }), b($scope.daily_members);
                }
            }, E = function (t, i) {
                if ('completed' === t) {
                    if (!_.isEmpty(i.members)) {
                        var n = _.pluck(i.members, 'uid');
                        _.each($scope.daily_members, function (e) {
                            _.contains(n, e.uid) && (e.completed = e.completed + 1);
                        });
                    }
                } else if ('uncompleted' === t && !_.isEmpty(i.members)) {
                    var n = _.pluck(i.members, 'uid');
                    _.each($scope.daily_members, function (e) {
                        _.contains(n, e.uid) && (e.completed = e.completed - 1);
                    });
                }
                b($scope.daily_members);
            };
        $scope.$on(kzi.constant.event_names.on_task_update, function (e, t) {
            if (t) {
                var n = j(t.tid), a = C(t.tid);
                _.isEmpty(n) || (n.name = t.name,
                    n.desc = t.desc,
                    n.pos = t.pos,
                    n.completed = t.completed,
                    n.expire_date = t.expire_date,
                    n.badges = t.badges,
                    n.labels = t.labels,
                    n.members.length != t.members.length && (n.members = t.members, D()),
                    n.watchers = t.watchers,
                    n.todos = t.todos),
                    _.isEmpty(a) || (a.name = t.name,
                    a.desc = t.desc,
                    a.pos = t.pos,
                    a.completed = t.completed,
                    a.expire_date = t.expire_date,
                    a.badges = t.badges,
                    a.labels = t.labels,
                    a.members = t.members,
                    a.watchers = t.watchers,
                    a.todos = t.todos,

                    a.name = t.temp_name,
                    a.address = t.temp_address,
                    a.email = t.temp_email,
                    a.position = t.temp_position,
                    a.website = t.temp_website,
                    a.products = t.temp_products,
                    a.mobile = t.temp_mobile,
                    a.phone = t.temp_phone,
                    a.fax = t.temp_fax,
                    a.msn = t.temp_msn,
                    a.skype = t.temp_skype,
                    a.facebook = t.temp_facebook,
                    a.linkedin = t.temp_linkedin,
                    a.qq = t.temp_qq,
                    a.weixin = t.temp_weixin,

                    a.mainIndustryCode = t.temp_mainIndustryCode,
                    a.mainIndustryCnName = t.temp_mainIndustryCnName,
                    a.subIndustryCode = t.temp_subIndustryCode,
                    a.subIndustryCnName = t.temp_subIndustryCnName,

                    a.zoneCode = t.temp_zoneCode,
                    a.zoneCnName = t.temp_zoneCnName,
                    a.countryCode = t.temp_countryCode,
                    a.countryCnName = t.temp_countryCnName,
                    a.company = t.temp_company,
                    a.desc = t.temp_desc),
                    $rootScope.locator.show_prj && $rootScope.refresh_cache.task.update_full(t);
            }
        }), $scope.$on(kzi.constant.event_names.on_task_trash, function (t, i) {
            if (i && !i.archived) {
                var n = j(i.tid);
                _.isEmpty(n) || E('uncompleted', i), $scope.daily_completed_tasks = _.reject($scope.daily_completed_tasks, function (e) {
                    return e.tid == i.tid;
                }), $scope.daily_created_tasks = _.reject($scope.daily_created_tasks, function (e) {
                    return e.tid == i.tid;
                });
            }
        }), $scope.$on(kzi.constant.event_names.on_task_complete, function (t, i) {
            if (i) {
                var n = j(i.tid), a = C(i.tid);
                i.completed || (_.isEmpty(n) || (n.completed = i.completed, $scope.daily_completed_tasks = _.reject($scope.daily_completed_tasks, function (e) {
                    return e.tid == i.tid;
                }), E('uncompleted', i)), _.isEmpty(a) || (a.completed = i.completed)), i.completed && (_.isEmpty(a) && (a = i), a.completed = i.completed, $scope.daily_completed_tasks.push(i), E('completed', i));
            }
        });
    }
]);