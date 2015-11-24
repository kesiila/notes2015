'use strict';
innerApp.controller('project_event_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$document',
    '$timeout',
    '$location',
    function ($scope, $routeParams, $rootScope, $popbox, $document, $timeout, $location) {
        function v() {
            var t = $scope.myCalendar.fullCalendar('getView');
            $('#calendar_title').html(t.title);
            var i = new Date(t.start).getTime(), n = new Date(t.end).getTime(), a = new Date().getTime();
            i > a || a > n ? $('#calendar_today').css('visibility', 'visible') : $('#calendar_today').css('visibility', 'hidden');
        }
        var l = $routeParams.pid;
        $scope.member_id = 'all', $scope.calendar_view = 'month', $scope.is_show_add = false;
        var d, p, c = '', u = null, f = function () {
                $scope.myCalendar.fullCalendar('refetchEvents');
            }, m = function () {
                $scope.myCalendar.fullCalendar('removeEvents', []), $scope.is_show_add = false, c = '';
            }, h = function (e, t, i, n, a) {
                u && d === e && p === t ? (_.isFunction(i) && i(u), _.isFunction(a) && a()) : wt.data.event.get_list(l, 0, 1, e, t, function (n) {
                    d = e, p = t, u = n.data, _.isFunction(i) && i(n.data);
                }, n, a);
            };
        $rootScope.load_project(l, function (t) {
            $rootScope.global.title = '日历 | ' + t.info.name, $scope.project = t, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok;
        }, function (e) {
            e.code == kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + l + '/notfound') : wt.data.error(e);
        }), $scope.calendarEventSources = [{
                events: function (t, n, a) {
                    var t = Math.round(t.getTime()), n = Math.round(n.getTime());
                    $rootScope.load_tasks(l, function (i) {
                        var s = _.filter(i.tasks, function (e) {
                                return e.expire_date = kzi.util.dateToTimestamp(e.expire_date), e.expire_date >= t && n >= e.expire_date;
                            }), o = [], r = false;
                        _.each(s, function (t) {
                            if ('all' != $scope.member_id) {
                                var i = _.findWhere(t.members, { uid: $scope.member_id });
                                r = i ? true : false;
                            } else
                                r = true;
                            if (r) {
                                var n = {
                                        id: t.tid,
                                        title: t.name,
                                        allDay: false,
                                        start: (t.expire_date + '').substring(0, 10),
                                        url: '',
                                        editable: true,
                                        textColor: '#333',
                                        extend: {
                                            expire_date: t.expire_date,
                                            badges: t.badges,
                                            pid: t.pid,
                                            xtype: kzi.constant.xtype.task
                                        }
                                    };
                                1 == t.completed ? (n.className = 'cal_task_completed slide-trigger', 1 == $scope.project.info.show_completed && o.push(n)) : (n.className = 'cal_task_uncompleted slide-trigger', o.push(n));
                            }
                        }), h(t, n, function (t) {
                            o = o.concat(t), $scope.is_show_add && $scope.project.info.curr_role !== kzi.constant.role.guest && o.unshift({
                                id: '-1',
                                title: '  + 新建活动',
                                allDay: true,
                                start: (c + '').substring(0, 10),
                                url: '',
                                editable: false,
                                className: 'cal_task_add',
                                textColor: '#aaa'
                            }), a(o);
                        });
                    });
                }
            }], $scope.calendarConfig = {
            header: false,
            height: kzi.util.heightNoHeader() - 95,
            editiable: true,
            droppable: true,
            titleFormat: {
                month: 'yyyy年MM月',
                week: 'yyyy年MM月d日 {\'&#8212;\' [ yyyy年][ MM月]d日}',
                day: 'yyyy年MM月d日 dddd'
            },
            firstDay: 0,
            weekMode: 'liquid',
            allDayText: '全天',
            axisFormat: 'HH:mm',
            timeFormat: '✓',
            monthNames: [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
            ],
            monthNamesShort: [
                '一月',
                '二月',
                '三月',
                '四月',
                '五月',
                '六月',
                '七月',
                '八月',
                '九月',
                '十月',
                '十一月',
                '十二月'
            ],
            dayNames: [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六'
            ],
            dayNamesShort: [
                '星期日',
                '星期一',
                '星期二',
                '星期三',
                '星期四',
                '星期五',
                '星期六'
            ],
            buttonText: {
                today: '今天',
                month: '月',
                agendaWeek: '周',
                agendaDay: '日'
            },
            defaultView: $scope.calendar_view,
            dayClick: function (t, i, n, a) {
                $scope.project.info.curr_role !== kzi.constant.role.guest && $scope.onDayClick(t, i, n, a);
            },
            loading: function (e) {
                v(), $rootScope.global.loading_done = e ? false : true;
            },
            eventClick: function (t, i, n) {
                $scope.onEventClick(t, i, n);
            },
            eventDrop: function (e, t) {
                if (0 !== t) {
                    var c = e.extend.pid;
                    if (e.extend.xtype === kzi.constant.xtype.task) {
                        var u = e.id, d = e.extend.expire_date, p = moment(d).add('days', t).endOf('day').valueOf();
                        wt.data.task.set_expire(c, u, p, function () {
                            if (e.extend.expire_date = p, e.extend.badges.expire_date = p, $rootScope.project.info && $rootScope.project.info.pid == c) {
                                var n = _.findWhere($rootScope.project.tasks, { tid: u });
                                n && (n.expire_date = p, n.badges.expire_date = p);
                            }
                        });
                    } else {
                        var f = moment(e.start), m = moment(e.extend.end).add('days', t);
                        wt.data.event.update_date(c, e.id, f.format('YYYY-MM-DD'), f.format('HH:mm'), m.format('YYYY-MM-DD'), moment(m).format('HH:mm'));
                    }
                }
            },
            windowResize: function () {
                $(this).fullCalendar('option', 'height', kzi.util.heightNoHeader() - 95);
            }
        };
        var g = function () {
            $timeout(function () {
                $('#calendar').fullCalendar('option', 'height', kzi.util.heightNoHeader() - 95);
            }, 25);
        };
        g(), $scope.$watch('$root.global.right_isfold', function () {
            $document.find('.prj_sidebar_panel').length > 0 && g();
        }), $scope.onEventClick = function (t, n) {
            if (n.preventDefault(), n.stopPropagation(), '-1' === t.id) {
                var o = new Date(t.start).getTime();
                $(n.target).hasClass('fc-event-title') ? $(n.target).addClass('js-popbox').attr('data-placement', 'right').attr('data-align', 'middle') : $(n.target).child('.fc-event-title').eq(0).addClass('js-popbox').attr('data-placement', 'right').attr('data-align', 'middle'), $timeout(function () {
                    $scope.js_show_task_pop(n, o);
                });
            } else
                t.extend.xtype === kzi.constant.xtype.task ? $rootScope.locator.to_task(t.extend.pid, t.id, false) : t.extend.xtype === kzi.constant.xtype.event && $timeout(function () {
                    $rootScope.locator.to_event(t.extend.pid, t.id, false);
                });
        }, $scope.onDayClick = function (t, a, s) {
            if ($rootScope.global.loading_done) {
                var r = kzi.helper.mouse_position(s);
                $(s.currentTarget).attr('data-placement', 'right'), $(s.currentTarget).attr('data-align', 'top'), $(s.currentTarget).addClass('js-popbox'), $(s.currentTarget).attr('data-auto-adapt', 'true'), $popbox.popbox({
                    target: s,
                    templateUrl: '/view/project/event/pop_add_event.html',
                    controller: 'pop_new_event_ctrl',
                    top: r.y,
                    left: r.x,
                    resolve: {
                        pop_data: function () {
                            return {
                                save_success: function (t, i) {
                                    $scope.js_new_event_success(i.event);
                                },
                                scope: $scope,
                                start_date: t
                            };
                        }
                    }
                }).open();
            }
        }, $scope.changeView = function (t) {
            t !== $scope.calendar_view && ($scope.myCalendar.fullCalendar('changeView', t), $scope.calendar_view = t, v(), m(), f());
        }, $scope.prev = function () {
            $scope.myCalendar.fullCalendar('prev'), v();
        }, $scope.next = function () {
            $scope.myCalendar.fullCalendar('next'), v();
        }, $scope.today = function () {
            $scope.myCalendar.fullCalendar('today'), v();
        }, $scope.$on(kzi.constant.event_names.on_task_update, function (e, t) {
            m(), f(), $rootScope.locator.show_prj && $rootScope.refresh_cache.task.update_full(t);
        }), $scope.$on(kzi.constant.event_names.on_task_trash, function () {
            m(), f();
        }), $scope.$on(kzi.constant.event_names.on_task_complete, function () {
            m(), f();
        }), $scope.$on(kzi.constant.event_names.shortcut_key_to_task, function (t, i) {
            if ($scope.permission === kzi.constant.permission.ok)
                switch (i) {
                case kzi.constant.keyASCIIs.I:
                case kzi.constant.keyASCIIs.N:
                    $('#btn_new_event').click();
                    break;
                default:
                }
        }), $scope.$on(kzi.constant.event_names.on_event_update, function (e, t) {
            if (u) {
                var i = _.findWhere(u, { id: t.event_id });
                i && (i.title = t.name, i.start = moment(t.start.date).valueOf().toString().substring(0, 10), i.end = moment(t.end.date).valueOf().toString().substring(0, 10));
            }
            m(), f();
        }), $scope.$on(kzi.constant.event_names.on_event_trash, function (e, t) {
            u && (u = _.reject(u, function (e) {
                return e.id === t.event_id;
            })), m(), f();
        }), $scope.js_new_event_success = function (e) {
            if (e.start.date >= d && p >= e.start.date) {
                var t = _.findWhere($rootScope.projects, { pid: e.pid });
                if (t) {
                    var n = wt.bus.event.event_to_calEvent(e, t.bg);
                    u && (u.push(n), m(), f()), t.is_calendar || (t.is_calendar = 1);
                } else
                    u = null, m(), f();
            }
        }, $scope.js_show_task_pop = function (t, a) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/task/pop_add_task_entry.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.step = 0, e.js_step = function (t) {
                            e.step = t;
                        }, e.new_task = { expire_date: moment().format('YYYY-MM-DD') }, null != a && (e.new_task.expire_date = moment(a).format('YYYY-MM-DD')), e.loading_entries = true, $rootScope.load_tasks(l, function (t) {
                            e.entries = t.entries, _.isEmpty(e.entries) || (e.new_task.entry = e.entries[0]);
                        }, null, function () {
                            e.loading_entries = false;
                        }), e.js_set_expire_date = function (t) {
                            switch (t) {
                            case 'today':
                                e.new_task.expire_date = moment().format('YYYY-MM-DD');
                                break;
                            case 'tomorrow':
                                e.new_task.expire_date = moment().add('days', 1).format('YYYY-MM-DD');
                                break;
                            case 'week':
                                e.new_task.expire_date = moment().endOf('week').add('days', 1).format('YYYY-MM-DD');
                                break;
                            case 'next_week':
                                e.new_task.expire_date = moment().add('days', 7).endOf('week').add('days', 1).format('YYYY-MM-DD');
                                break;
                            case 'month':
                                e.new_task.expire_date = moment().endOf('month').format('YYYY-MM-DD');
                            }
                            e.js_step(0);
                        }, e.js_open_add_entry = function (t) {
                            e.is_from_task = t, e.step = 1;
                        }, e.js_add_task = function (t, n) {
                            if (e.is_saving_task !== true && !_.isEmpty(n.name) && !_.isEmpty(n.entry)) {
                                e.is_saving_task = true;
                                var a = wt.bus.task.calculate_task_pos(n.entry, false), s = moment(n.expire_date).endOf('day').valueOf();
                                wt.data.task.add_full(l, n.entry.entry_id, n.name, a, [], [], s, function (t) {
                                    n.entry.tasks || (n.entry.tasks = []), n.entry.tasks.push(t.data), $rootScope.refresh_cache.task.add(t.data), e.js_close(), m(), f();
                                }, null, function () {
                                    e.is_saving_task = false;
                                });
                            }
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
        }, $scope.js_show_more_menu = function (t) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/event/pop_event_more_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, n) {
                        e.popbox = t, e.step = 0, e.js_step = function (t) {
                            e.step = t;
                        }, e.js_close = function () {
                            t.close();
                        }, e.member_id = n.scope.member_id, $rootScope.load_project_members(l, function (t) {
                            var n = [], a = {};
                            _.each(wt.bus.member.get_normal_members(t.members), function (e) {
                                e.uid !== $rootScope.global.me.uid ? n.push(e) : a = e;
                            }), e.members = n, e.self = a;
                        }), e.js_change_member = function (t) {
                            m(), n.scope.member_id = t, e.member_id = t, f();
                        }, e.js_prefs_show_completed = function () {
                            var t = 1;
                            t = 1 == $rootScope.project.info.show_completed ? 0 : 1, $rootScope.project.info.show_completed = t, wt.data.project.set_prefs(l, 'show_completed', t), e.step = 0, m(), f();
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

innerApp.controller('pop_new_event_ctrl', [
    '$rootScope',
    '$scope',
    'popbox',
    '$routeParams',
    'pop_data',
    function ($rootScope, $scope, popbox, $routeParams, pop_data) {
        var pid = $routeParams.pid;
        var save_success = pop_data.save_success;
        var outScope = pop_data.scope;
        $scope.popbox = popbox;
        $scope.step = 0;
        $scope.js_close = function () {
            popbox.close();
        };
        $scope.js_step = function (step) {
            $scope.step = step;
        };
        var l = moment().format('HH');
        var c = moment().format('mm');
        var u = kzi.constant.all_hour_sections;
        var d = kzi.constant.all_minute_sections;
        var p = function () {
            $scope.start_hour_sections = u;
            $scope.start_minute_sections = d;
            var e = c.substring(0, 1) + '0';
            $scope.new_event.start_minute = e;
            $scope.new_event.end_minute = e;
        };
        var f = function () {
            var e = $scope.new_event.start_date;
            var i = $scope.new_event.start_hour;
            var n = $scope.new_event.start_minute;
            var a = $scope.new_event.end_date;
            e >= a ? ($scope.new_event.end_date = e, i >= $scope.new_event.end_hour ? ($scope.new_event.end_hour = i, n >= $scope.new_event.end_minute && ($scope.new_event.end_minute = n), $scope.end_minute_sections = _.filter(d, function (e) {
                return e >= n ? true : void 0;
            })) : $scope.end_minute_sections = d, $scope.end_hour_sections = _.filter(u, function (e) {
                return e >= i ? true : void 0;
            })) : ($scope.end_hour_sections = u, $scope.end_minute_sections = d);
        };
        var m = moment();
        pop_data.start_date && (m = moment(pop_data.start_date), l = '09', c = '00');
        $scope.new_event = {
            start_date: m.format('YYYY-MM-DD'),
            end_date: m.format('YYYY-MM-DD'),
            start_hour: l,
            start_minute: c,
            end_hour: m.format('HH'),
            end_minute: c,
            attendees: [$rootScope.global.me]
        }; pid ? ($scope.new_event.pid = pid, $scope.show_project_select = false) : ($rootScope.load_projects(function (e) {
            $scope.selected_projects = wt.bus.project.get_member_projects(e), _.isEmpty($scope.selected_projects) || ($scope.new_event.pid = $scope.selected_projects[0].pid, $scope.new_event.original_pid = $scope.new_event.pid);
        }), $scope.show_project_select = true);
        p();
        $scope.$watch('[new_event.start_date,new_event.start_hour,new_event.start_minute]', function () {
            f();
        }, true);
        f();
        $scope.js_to_set_date = function (e) {
            $scope.current_date_type = e;
            if('start_date' === e) {
                $scope.current_date = $scope.new_event.start_date;
                $scope.min_date = null;
                $scope.set_date_title = '设置开始时间'
            } else {
                $scope.current_date = $scope.new_event.end_date;
                $scope.min_date = $scope.new_event.start_date;
                $scope.set_date_title = '设置结束时间';
            }
            $scope.js_step(1);
        };
        $scope.js_set_date = function (e) {
            e = moment(e).format('YYYY-MM-DD');
            if('start_date' === $scope.current_date_type) {
                $scope.new_event.start_date = e;
                p(moment(e));
            } else {
                $scope.new_event.end_date = e;
                f();
            }
            $scope.js_step(0);
        };
        $scope.js_change_project = function () {
            $scope.new_event.pid !== $scope.new_event.original_pid && ($scope.new_event.original_pid = $scope.new_event.pid, $scope.new_event.attendees = [$rootScope.global.me]);
        };
        $scope.js_to_attendee = function () {
            $scope.members = [], $scope.loading_members = true, $rootScope.load_project_members($scope.new_event.pid, function (e) {
                var i = [];
                _.each(e.members, function (e) {
                    if (1 === e.status && e.role !== kzi.constant.role.guest) {
                        var n = _.findWhere($scope.new_event.attendees, { uid: e.uid });
                        e.assigned = n ? 1 : 0, i.push(e);
                    }
                }), $scope.members = i, $scope.loading_members = false;
            }, function () {
                $scope.loading_members = false;
            }), $scope.js_step(2);
        };
        $scope.js_toggle_member = function (e) {
            e.setting_toggle_member !== true && (e.setting_toggle_member = true, wt.bus.member.set_event_attendees_toggle(pid, $scope.new_event, e, function () {
            }, null, function () {
                e.setting_toggle_member = false;
            }));
        };
        $scope.js_save_event = function () {
            if (!_.isEmpty($scope.new_event.name)) {
                $scope.new_event.is_saving = true;
                var n = _.pluck($scope.new_event.attendees, 'uid'), a = $scope.new_event.end_date, s = $scope.new_event.end_hour + ':' + $scope.new_event.end_minute, l = $scope.new_event.location, c = $scope.new_event.start_hour + ':' + $scope.new_event.start_minute;
                $scope.new_event.show_end_date || (a = $scope.new_event.start_date, s = c), $scope.new_event.show_location || (l = null), wt.data.event.add($scope.new_event.pid, $scope.new_event.name, l, n, $scope.new_event.start_date, c, a, s, function (e) {
                    $scope.js_close(), _.isFunction(save_success) && save_success(outScope, {
                        event: e.data,
                        popbox: popbox
                    });
                }, null, function () {
                    $scope.new_event.is_saving = false;
                });
            }
        };
    }
]);
innerApp.controller('pop_new_date_select_ctrl', [
    '$rootScope',
    '$scope',
    'popbox',
    '$routeParams',
    'pop_data',
    function ($rootScope, $scope, popbox, $routeParams, pop_data) {
        function makeDefaultEvent() {
            return {
                start_date: moment().format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD'),
                start_hour: moment().format('HH'),
                end_hour: moment().format('HH'),
                start_minute: moment().format('mm'),
                end_minute: moment().format('mm')
            }
        }
        $scope.js_close = function () {
            popbox.close();
        };
        $scope.js_step = function (step) {
            $scope.step = step;
        }
        var l = moment().format('HH');
        var c = moment().format('mm');
        var HOUR_SECTIONS = kzi.constant.all_hour_sections;
        var MIN_SECTIONS = kzi.constant.all_minute_sections;
        function setSection () {
            var humanize_minute = moment().format('mm').substring(0, 1) + '0';
            $scope.start_hour_sections = HOUR_SECTIONS;
            $scope.start_minute_sections = MIN_SECTIONS;
            $scope.new_event.start_minute = humanize_minute;
            $scope.new_event.end_minute = humanize_minute;
        };

        function resetSections() {
            var start_date = $scope.new_event.start_date;
            var start_hour = $scope.new_event.start_hour;
            var start_minute = $scope.new_event.start_minute;
            var end_date = $scope.new_event.end_date;
            if (start_date >= end_date) {
                $scope.new_event.end_date = start_date;
                if (start_hour >= $scope.new_event.end_hour) {
                    $scope.new_event.end_hour = start_hour;
                    start_minute >= $scope.new_event.end_minute && ($scope.new_event.end_minute = start_minute);
                    $scope.end_minute_sections = _.filter(MIN_SECTIONS, function (e) {
                        return e >= start_minute;
                    })
                } else {
                    $scope.end_minute_sections = MIN_SECTIONS;
                }
                $scope.end_hour_sections = _.filter(HOUR_SECTIONS, function (e) {
                    return e >= start_hour;
                })
            } else {
                $scope.end_hour_sections = HOUR_SECTIONS;
            }
            $scope.end_minute_sections = MIN_SECTIONS;
        };
        $scope.js_to_set_date = function (e) {
            $scope.current_date_type = e;
            if ('start_date' === e) {
                $scope.current_date = $scope.new_event.start_date;
                $scope.min_date = null;
                $scope.set_date_title = '设置开始时间';
            } else {
                $scope.current_date = $scope.new_event.end_date;
                $scope.min_date = $scope.new_event.start_date;
                $scope.set_date_title = '设置结束时间';
            }
            $scope.js_step(1);
        };
        $scope.js_set_date = function (e) {
            e = moment(e).format('YYYY-MM-DD');
            if ('start_date' === $scope.current_date_type) {
                $scope.new_event.start_date = e;
                setSection(moment(e));
            } else {
                $scope.new_event.end_date = e;
                resetSections();
            }
            $scope.js_step(0);
        };
        function add () {
            return _.reduce(_.toArray(arguments),function(acc,item) {
                return acc + item;
            },0);
        }
        function makeStartDate () {
            return add(new Date($scope.new_event.start_date).getTime(),
                    $scope.new_event.start_hour * 3600 * 1000,
                    $scope.new_event.start_minute * 60 * 1000,
                    - 8 * 3600 * 1000
            );
        }
        function makeEndDate () {
            return add(new Date($scope.new_event.end_date).getTime(),
                  $scope.new_event.end_hour * 3600 * 1000,
                  $scope.new_event.end_minute * 60 * 1000,
                - 8 * 3600 * 1000
            );
        }

        function checker (/*funcs*/) {
            var args = _.toArray(arguments);
           return function (state,thenCallables, failCallables) {
               var passed = _.reduce(args,function (acc,arg) {
                     return acc && arg.call(null,state);
                  },true);
              [].forEach.call(passed ? thenCallables : failCallables,
                  function (func) {
                      func.call(null, state);
                  });
            }
        }

        $scope.addDate = function () {
            var dateChecker = checker(function(obj) {
                return obj.start_date <= obj.end_date;
            });
            var processOnClickEnter = pop_data.process;
            dateChecker({
                start_date: makeStartDate(),
                end_date: makeEndDate()},
                [processOnClickEnter, $scope.js_close],
                [function () {kzi.msg.warn("开始时间不应早于结束时间~");}]
            );
        };
        $scope.new_event = makeDefaultEvent();
        setSection();
        resetSections();
    }]);