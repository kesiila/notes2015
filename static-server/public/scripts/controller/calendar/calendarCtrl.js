'use strict';
innerApp.controller('calendar_ctrl', [
    '$rootScope',
    '$scope',
    '$timeout',
    '$popbox',
    function ($rootScope, $scope, $timeout, $popbox) {
        function g() {
            var e = $scope.myCalendar.fullCalendar('getView');
            $('#calendar_title').html(e.title);
            var i = new Date(e.start).getTime(), n = new Date(e.end).getTime(), a = new Date().getTime();
            i > a || a > n ? $('#calendar_today').css('visibility', 'visible') : $('#calendar_today').css('visibility', 'hidden');
        }

        $rootScope.global.title = '日历';
        $scope.project_ids = [];
        $scope.filter_type = 'all';
        $scope.calendar_view = 'month';
        $scope.show_task_uid = $rootScope.global.me.uid;
        $scope.show_task_team_id = null;
        $scope.show_my_task = true;
        $scope.show_all_events = 1;
        $scope.current_team = {};
        $scope.show_completed_tasks = 1;
        var o, r, a = null, s = null;
        var l = function () {
            $scope.show_completed_tasks = 0 == kzi.localData.get('cale_show_completed_tasks') ? 0 : 1;
            $scope.show_all_events = 0 == kzi.localData.get('cale_show_all_events') ? 0 : 1;
            var e = kzi.localData.get('calendar_checked_project_ids');
            $scope.project_ids = null != e ? 'none' === e ? [] : e.split(',') : null;
            kzi.localData.get('calendar_view') ? $scope.calendar_view = kzi.localData.get('calendar_view') : kzi.localData.set('calendar_view', $scope.calendar_view);
        };
        var c = function () {
            $scope.calendar_teams = [];
            _.isEmpty($rootScope.teams) ? $rootScope.load_teams(function (e) {
                _.each(e, function (e) {
                    $scope.calendar_teams.push({
                        name: e.name,
                        team_id: e.team_id
                    });
                });
            }) : _.each($rootScope.teams, function (e) {
                $scope.calendar_teams.push({
                    name: e.name,
                    team_id: e.team_id
                });
            });
        };
        var u = function () {
            var e = _.filter($scope.projects, function (e) {
                return e.is_checked;
            }), i = _.pluck(e, 'pid');
            $scope.project_ids = i, _.isEmpty(i) ? kzi.localData.set('calendar_checked_project_ids', 'none') : kzi.localData.set('calendar_checked_project_ids', $scope.project_ids);
        };
        c();
        l();
        var d = function () {
            $scope.myCalendar.fullCalendar('refetchEvents');
        };
        var p = function () {
            $scope.myCalendar.fullCalendar('removeEvents', []);
        };
        var f = function (i) {
            return $scope.calendar_projects ? (i(), void 0) : ($rootScope.load_projects(function (e) {
                _.each(e, function (e) {
                    e.is_checked = null == $scope.project_ids ? true : 0 === $scope.project_ids.length ? false : _.contains($scope.project_ids, e.pid) ? true : false;
                }),
                    u(),
                    $scope.projects = e,
                    $scope.calendar_projects = _.filter($scope.projects, function (e) {
                        return 1 === e.is_calendar;
                    });
            }, null, function () {
                i();
            }), void 0);
        };
        var m = function (e, i, n, s, l) {
            if (a && o === e && r === i) {
                if (_.isFunction(n))
                    if ($scope.show_all_events)
                        n(a);
                    else {
                        var c = [];
                        _.each(a, function (e) {
                            e.extend.i_attended && c.push(e);
                        }), n(c);
                    }
                _.isFunction(l) && l();
            } else {
                var u = _.pluck($scope.projects, 'pid');
                wt.data.event.get_list(u, 1, 1, e, i, function (e) {
                    if (a = e.data, _.isFunction(n))
                        if ($scope.show_all_events)
                            n(a);
                        else {
                            var i = [];
                            _.each(a, function (e) {
                                e.extend.i_attended && i.push(e);
                            }), n(i);
                        }
                }, s, l);
            }
        };
        var h = function (i, n, a, l, c) {
            s && o === i && r === n ? (_.isFunction(a) && a(s), _.isFunction(c) && c()) : $scope.show_task_uid === $rootScope.global.me.uid && null === $scope.show_task_team_id ? wt.data.calendar.get_my_tasks('', 1, '', i, n, function (e) {
                s = e.data, _.isFunction(a) && a(e.data);
            }, l, c) : wt.data.calendar.get_my_tasks($scope.show_task_team_id, 1, $scope.show_task_uid, i, n, function (e) {
                s = e.data, _.isFunction(a) && a(e.data);
            }, l, c);
        };
        $scope.js_new_event_success = function (i) {
            var n = _.findWhere($rootScope.projects, { pid: i.pid });
            if (n) {
                var s = wt.bus.event.event_to_calEvent(i, n.bg);
                n.is_calendar
                || (n.is_calendar = 1, _.defaults(n, { is_checked: true }), $scope.calendar_projects.push(n), $scope.calendar_projects = _.sortBy($scope.calendar_projects, function (e) {
                    return e.pos;
                })), a && (a.push(s), p(), d());
            } else
                a = null;
            p();
            d();
        };
        $scope.onEventClick = function (t, i) {
            i.preventDefault();
            i.stopPropagation();
            t.extend && t.extend.xtype === kzi.constant.xtype.event ? $rootScope.locator.to_event(t.extend.pid, t.id, true) : $rootScope.locator.to_task(t.extend.pid, t.id, true);
        };
        $scope.$watch(function () {
         return $rootScope.global.loading_done;
        }, function (n, o) {
            $rootScope.global.loading_done = true;
        });
        $scope.onDayClick = function (i, s, a) {
            $rootScope.global.loading_done = true;
            if ($rootScope.global.loading_done) {
                var r = kzi.helper.mouse_position(s);
                $(s.currentTarget).attr('data-placement', 'right');
                $(s.currentTarget).attr('data-align', 'top');
                $(s.currentTarget).addClass('js-popbox');
                $(s.currentTarget).attr('data-auto-adapt', 'true');
                $popbox.popbox({
                    target: s,
                    templateUrl: '/view/project/event/pop_add_event.html',
                    controller: 'pop_new_event_ctrl',
                    top: r.y,
                    left: r.x,
                    resolve: {
                        pop_data: function () {
                            return {
                                save_success: function (e, i) {
                                    $scope.js_new_event_success(i.event);
                                },
                                scope: $scope,
                                start_date: i
                            };
                        }
                    }
                }).open();
            }
        };
        $scope.calendarEventSources = [
            {
                events: function (start, end, timezone, callback) {
                    var start = Math.round(start.getTime());
                    var end = Math.round(end.getTime());
                    f(function () {
                        'event' === $rootScope.global.calendar_sidebar_view ?
                            m(start, end, function (e) {
                                var s = _.filter($scope.calendar_projects, function (e) {
                                    return e.is_checked;
                                });
                                var l = _.pluck(s, 'pid');
                                var c = _.filter(e, function (e) {
                                    return _.contains(l, e.extend.pid);
                                });
                                callback(c);
                                o = start;
                                r = end;
                            }) : 'task' === $rootScope.global.calendar_sidebar_view && h(start, end, function (e) {
                            if ($scope.show_completed_tasks)
                                callback(e);
                            else {
                                var s = [];
                                _.each(e, function (e) {
                                    e.extend.completed || s.push(e);
                                }), callback(s);
                            }
                            o = start, r = end;
                        });
                    });
                }
            }
        ];
        $scope.calendarConfig = {
            header: false,
            height: kzi.util.heightNoHeader() - 95,
            editiable: true,
            droppable: true,
            titleFormat: {
                month: 'yyyy年MM月',
                week: 'yyyy年MM月d日 {&#8212; [ yyyy年][ MM月]d日}',
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
            dayClick: $scope.onDayClick,
            loading: function (t) {
                g();
                $rootScope.global.loading_done = t ? false : true;
            },
            eventClick: function (e, i, n) {
                $scope.onEventClick(e, i, n);
            },
            eventDrop: function (t, i) {
                if (0 !== i) {
                    var c = t.extend.pid;
                    if (t.extend.xtype === kzi.constant.xtype.task) {
                        var u = t.id, d = t.extend.expire_date, p = moment(d).add('days', i).endOf('day').valueOf();
                        wt.data.task.set_expire(c, u, p, function () {
                            if (t.extend.expire_date = p, t.extend.badges.expire_date = p, $rootScope.project.info && $rootScope.project.info.pid == c) {
                                var n = _.findWhere($rootScope.project.tasks, { tid: u });
                                n && (n.expire_date = p, n.badges.expire_date = p);
                            }
                        });
                    } else if (t.extend.xtype === kzi.constant.xtype.event) {
                        var f = moment(t.start), m = moment(t.extend.end).add('days', i);
                        wt.data.event.update_date(c, t.id, f.format('YYYY-MM-DD'), f.format('HH:mm'), m.format('YYYY-MM-DD'), moment(m).format('HH:mm'));
                    }
                }
            },
            windowResize: function () {
                $(this).fullCalendar('option', 'height', kzi.util.heightNoHeader() - 95);
            }
        };
        $scope.changeView = function (e) {
            $scope.myCalendar.fullCalendar('changeView', e);
            $scope.calendar_view = e;
            kzi.localData.set('calendar_view', e);
            g();
        };
        $scope.prev = function () {
            $scope.myCalendar.fullCalendar('prev'), g();
        };
        $scope.next = function () {
            $scope.myCalendar.fullCalendar('next'), g();
        };
        $scope.today = function () {
            $scope.myCalendar.fullCalendar('today'), g();
        };
        $scope.js_filter_calendar_toggle = function (e) {
            e.is_checked = e.is_checked ? false : true, u(), p(), d();
        };
        $scope.js_toggle_showall = function () {
            $scope.show_all_events = 1 == $scope.show_all_events ? 0 : 1, kzi.localData.set('cale_show_all_events', $scope.show_all_events), p(), d();
        };
        $scope.js_team_members_toggle = function (e) {
            if ($scope.current_team.team_id === e.team_id) {
                $scope.current_team.expand = !$scope.current_team.expand
            } else {
                $scope.current_team.expand = false;
                $scope.current_team = e;
                $scope.current_team.expand = true;
               if(_.isEmpty(e.members)) {
                   $scope.members_loading_done = false;
                   wt.data.team.get_team_members(e.team_id, function (t) {
                       e.members = wt.bus.member.get_normal_members(t.data.members);
                       _.each(e.members, function (t) {
                           t.team_id = e.team_id;
                       });
                   }, null, function () {
                       $scope.members_loading_done = true;
                   });
               }
            };
        };
        $scope.js_view_member_tasks = function (e, i) {
            $scope.show_task_uid = e.uid, $scope.show_task_team_id = i.team_id, $scope.show_my_task = false, s = null, p(), d();
        };
        $scope.js_view_my_tasks = function () {
            $scope.show_task_uid = $rootScope.global.me.uid, $scope.show_my_task = true, $scope.show_task_team_id = null, s = null, p(), d();
        };
        $scope.js_show_completed_tasks = function () {
            $scope.show_completed_tasks = $scope.show_completed_tasks ? 0 : 1, kzi.localData.set('cale_show_completed_tasks', $scope.show_completed_tasks), p(), d();
        };
        $scope.js_toggle_right = function () {
            $rootScope.global.calendar_fold = !$rootScope.global.calendar_fold, $timeout(function () {
                $('#calendar').fullCalendar('render');
            }, 220);
        };
        $scope.js_change_calendar_siderview = function (t) {
            $rootScope.global.calendar_sidebar_view !== t && ($rootScope.global.calendar_sidebar_view = t, p(), d());
        };
        $scope.$on(kzi.constant.event_names.on_task_update, function (e, t) {
            var i = _.findWhere(s, { id: t.tid });
            i && (i.title = t.name, i.start = t.expire_date.toString().substring(0, 10)), p(), d();
        });
        $scope.$on(kzi.constant.event_names.on_task_trash, function (e, t) {
            var i = _.findWhere(s, { id: t.tid });
            i && (s = _.reject(s, function (e) {
                return e.id === t.tid;
            })), p(), d();
        });
        $scope.$on(kzi.constant.event_names.on_task_complete, function (e, t) {
            var i = _.findWhere(s, { id: t.tid });
            i && (t.completed ? (i.className = 'cal_task_completed slide-trigger', i.extend.completed = 1) : (i.className = 'cal_task_uncompleted slide-trigger', i.extend.completed = 0)), p(), d();
        });
        $scope.$on(kzi.constant.event_names.on_event_update, function (t, i) {
            if (a) {
                var n = _.findWhere(a, { id: i.event_id });
                n && (n.title = i.name, n.start = moment(i.start.date).valueOf().toString().substring(0, 10), n.end = moment(i.end.date).valueOf().toString().substring(0, 10), n.extend.i_attended = _.findWhere(i.attendees, { uid: $rootScope.global.me.uid }) ? 1 : 0, p(), d());
            }
        });
        $scope.$on(kzi.constant.event_names.on_event_trash, function (e, i) {
            a && (a = _.reject(a, function (e) {
                return e.id === i.event_id;
            })), $scope.calendar_projects = _.filter($scope.projects, function (e) {
                return 1 === e.is_calendar;
            }), p(), d();
        });

        $timeout(function () {
            $('#calendar').fullCalendar('render');
        }, 420);
    }
]);


innerApp.controller("calendar_ctrl_Jan_20th",
    ["$rootScope","$scope", "$timeout", "$popbox",
        function ($rootScope, $scope, $timeout, $popbox) {
    function refreashCalendar() {
        var e = $scope.myCalendar.fullCalendar("getView");
        $("#calendar_title").html(e.title);
        var start_date = new Date(e.start).getTime();
        var end_date = new Date(e.end).getTime();
        var current_time = (new Date).getTime();
        if( current_time > end_date || start_date > current_time ) {
            $("#calendar_today").css("visibility", "visible")
        } else {
            $("#calendar_today").css("visibility", "hidden")
        }
    }

    $rootScope.global.title = "日历";
    $scope.project_ids = [];
    $scope.filter_type = "all";
    $scope.calendar_view = "month";
    $scope.show_task_uid = $rootScope.global.me.uid;
    $scope.show_task_team_id = null;
    $scope.show_my_task = !0;
    $scope.show_all_events = 1;
    $scope.current_team = {};
    $scope.show_completed_tasks = 1;
    var r;
    var o;
    var a = null;
    var s = null;
    //同步日历的状态
    var getCachedStatus = function () {
        $scope.show_completed_tasks = 0 == kzi.localData.get("cale_show_completed_tasks") ? 0 : 1;
        $scope.show_all_events = 0 == kzi.localData.get("cale_show_all_events") ? 0 : 1;
        var e = kzi.localData.get("calendar_checked_project_ids");
        $scope.project_ids = null != e ? "none" === e ? [] : e.split(",") : null;
        kzi.localData.get("calendar_view") ? $scope.calendar_view = kzi.localData.get("calendar_view") : kzi.localData.set("calendar_view", $scope.calendar_view);
        $scope.calendar_sidebar_view = kzi.localData.get("calendar_sidebar_view") ? kzi.localData.get("calendar_sidebar_view") : "event";
    };
    //过滤和转化team的格式
    var mapTeams = function () {
        $scope.calendar_teams = [];
        if(_.isEmpty($rootScope.teams)) { $rootScope.load_teams(function (e) {
            $scope.calendar_teams = _.chain(e)
                .filter(function (i) {
                   return i.team_id !== "-1";
                }).map(function(i){
                   return {
                       name: i.name,
                       team_id: i.team_id
                   }
                }).value();
            //_.each(refreashCalendar, function (refreashCalendar) {
            //    "-1" !== refreashCalendar.team_id && $scope.calendar_teams.push({
            //        name: refreashCalendar.name,
            //        team_id: refreashCalendar.team_id
            //    })
            //});
        })} else {
             $scope.calendar_teams = _.chain($rootScope.teams)
                .filter(function (i) {
                   return i.team_id !== "-1";
                }).map(function(i){
                   return {
                       name: i.name,
                       team_id: i.team_id
                   }
                }).value();
        }
    };
    mapTeams();
    //put pid of projects checked into localStorage
    var savePrjCheckedToLocalData = function () {
        var checkedPrjs = _.filter($scope.projects, function (e) {
            return e.is_checked
        });
        var pids = _.pluck(checkedPrjs, "pid");
        $scope.project_ids = pids;
        _.isEmpty(pids)
            ? kzi.localData.set("calendar_checked_project_ids", "none")
            : kzi.localData.set("calendar_checked_project_ids", $scope.project_ids);
    };
    getCachedStatus();
    var refetchEvents = function () {
        $scope.myCalendar.fullCalendar("refetchEvents");
    };
    var removeEvents = function () {
        $scope.myCalendar.fullCalendar("removeEvents", []);
    };
    // checked or not
    var updatePrjStatus = function (callback) {
        if ($scope.calendar_projects) {
           callback();
        } else {
           $rootScope.load_projects(function (e) {
            _.each(e, function (e) {
                //if($scope.project_ids == null || _.contains($scope.project_ids, refreashCalendar.pid)) {
                //    refreashCalendar.is_checked = true;
                //} else {
                //    refreashCalendar.is_checked = false;
                //}
                //refreashCalendar.is_checked = $scope.project_ids == null ;
                e.is_checked =
                    null == $scope.project_ids
                        ? !0
                        : 0 === $scope.project_ids.length
                            ? !1
                            : _.contains($scope.project_ids, e.pid) ? !0 : !1
            });
           savePrjCheckedToLocalData();
           $scope.projects = e;
           $scope.calendar_projects = _.filter($scope.projects, function (e) {
                return 1 === e.is_calendar
           });
        }, null, function () {
            callback();
        })
        };
        //TODO need to be removed
        false && ($rootScope.load_projects(function (e) {
            _.each(e, function (e) {
                e.is_checked = null == $scope.project_ids ? !0 : 0 === $scope.project_ids.length ? !1 : _.contains($scope.project_ids, e.pid) ? !0 : !1
            }), savePrjCheckedToLocalData(), $scope.projects = e, $scope.calendar_projects = _.filter($scope.projects, function (e) {
                return 1 === e.is_calendar
            })
        }, null, function () {
            callback()
        }), void 0)
    };
    var h = function (e, i, n, s, l) {
        if (_.isEmpty(a) || r !== e || o !== i) {
            var pids = _.pluck($scope.projects, "pid");
            wt.data.event.get_list(pids, 1, 1, e, i, function (e) {
                if (a = e.data, _.isFunction(n))
                    if ($scope.show_all_events)
                        n(a);
                    else {
                        var i = [];
                        _.each(a, function (e) {
                            e.extend.i_attended && i.push(e)
                        });
                        n(i);
                    }
            }, s, l);
        } else {
            if (_.isFunction(n))
                if ($scope.show_all_events)
                    n(a);
                else {
                    var c = [];
                    _.each(a, function (e) {
                        e.extend.i_attended && c.push(e)
                    }), n(c)
                }
            _.isFunction(l) && l();
        }
    };
    var fetchTasks = function (i, n, a, l, c) {
       if (s && r === i && o === n) {
            _.isFunction(a) && a(s);
           _.isFunction(c) && c() ;
       } else {
           if($scope.show_task_uid === $rootScope.global.me.uid && null === $scope.show_task_team_id) {
               false && wt.data.calendar.get_tasks_forme(1, i, n, function (e) {
                s = e.data;
                _.isFunction(a) && a(e.data);
               }, l, c);
           } else {
               wt.data.calendar.get_tasks($scope.show_task_team_id, 1,
                    $scope.show_task_uid, i, n,
                   function success (e) {
                        s = e.data; _.isFunction(a) && a(e.data);
                    }, l, c);}
       };
    };
    $scope.js_new_event_success = function (i) {
        i.forEach(function (i) {
            if (i.end.date >= r && o >= i.start.date) {
                var n = _.findWhere($rootScope.projects, {pid: i.pid});
                if (n) {
                    // hard code $popbox.bg to "#3c8cad"
                    var s = wt.bus.event.event_to_calEvent(i, "#3c8cad");
                    s.extend.i_attended = i.attendees && i.attendees.indexOf($rootScope.global.me.uid) >= 0 ? 1 : 0, n.is_calendar || (n.is_calendar = 1, _.defaults(n, {is_checked: !0}), $scope.calendar_projects.push(n), $scope.calendar_projects = _.sortBy($scope.calendar_projects, function (e) {
                        return e.pos
                    }));
                    a && (a.push(s), removeEvents(), refetchEvents());
                } else
                    a = null;
                    removeEvents();
                    refetchEvents();
            }
        })
    };
    $scope.onEventClick = function (t, i) {
        i.preventDefault();
        i.stopPropagation();
        if(t.extend) {
          if(t.extend.xtype === kzi.constant.xtype.event) {
            $rootScope.locator.to_event(t.extend.pid, t.id, !0)
          } else {
              $rootScope.locator.to_task(t.extend.pid, t.id, !0);
          }
        }
    };
    $scope.onDayClick = function (i, a, s) {
        if ($rootScope.global.loading_done) {
            var o = kzi.helper.mouse_position(s);
            $(s.currentTarget).attr("data-placement", "right");
            $(s.currentTarget).attr("data-align", "top");
            $(s.currentTarget).addClass("js-popbox");
            $(s.currentTarget).attr("data-auto-adapt", "true");
            $popbox.popbox({
                    target: s,
                    templateUrl: "/view/project/event/pop_add_event.html",
                    controller: "pop_new_event_ctrl",
                    top: o.y,
                    left: o.x,
                    resolve: {
                        pop_data: function () {
                            return {
                                save_success: function (e, i) {
                                    $scope.js_new_event_success(i.event)
                                },
                                scope: $scope,
                                start_date: i
                            };
                         }
                    }
            }).open();
        }
    };
    $scope.calendarEventSources = [
        {
            events: function (e, i, n) {
            var e = Math.round(e.getTime());
            var i = Math.round(i.getTime());
            updatePrjStatus(function () {
                if("event" === $scope.calendar_sidebar_view) {
                    h(e, i, function (a) {
                     var s = _.filter($scope.calendar_projects, function (e) {
                        return e.is_checked
                     });
                    var l = _.pluck(s, "pid");
                    var  c = _.filter(a, function (e) {
                            return _.contains(l, e.extend.pid)
                        });
                    n(c);
                    r = e;
                    o = i;
                 })
                } else if ( "task" === $scope.calendar_sidebar_view ) {
                    fetchTasks(e, i, function (a) {
                        if ($scope.show_completed_tasks)
                            n(a);
                        else {
                            var s = [];
                            _.each(a, function (e) {
                                e.extend.completed || s.push(e);
                            });
                            n(s);
                        }
                        r = e;
                        o = i;
                 })
                }
            })
          }
        }
    ];
    $scope.calendarConfig = {
        header: false,
        height: kzi.util.heightNoHeader() - 95,
        editiable: true,
        droppable: true,
        titleFormat: {
            month: "yyyy年MM月",
            week: "yyyy年MM月d日 {&#8212; [ yyyy年][ MM月]d日}",
            day: "yyyy年MM月d日 dddd"
        },
        firstDay: 0,
        weekMode: "liquid",
        allDayText: "全天",
        axisFormat: "HH:mm",
        timeFormat: "✓",
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        dayNamesShort: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        buttonText: {
            today: "今天",
            month: "月",
            agendaWeek: "周",
            agendaDay: "日"
        },
        defaultView: $scope.calendar_view,
        dayClick: $scope.onDayClick,
        loading: function (t) {
            refreashCalendar();
            //$rootScope.global.loading_done = t ? !1 : !0;
        },
        eventClick: function (e, i, n) {
            $scope.onEventClick(e, i, n);
        },
        eventDrop: function (t, i) {
            if (0 !== i) {
                var c = t.extend.pid;
                if (t.extend.xtype === kzi.constant.xtype.task) {
                    var d = t.id;
                    var u = t.extend.expire_date;
                    var p = moment(u).add("days", i).endOf("day").valueOf();
                    wt.data.task.set_expire(c, d, p, function () {
                        if (t.extend.expire_date = p, t.extend.badges.expire_date = p, $rootScope.project.info && $rootScope.project.info.pid == c) {
                            var n = _.findWhere($rootScope.project.tasks, {tid: d});
                            n && (n.expire_date = p, n.badges.expire_date = p)
                        }
                    });
                } else if (t.extend.xtype === kzi.constant.xtype.event) {
                    var f = moment(t.start);
                    var h = moment(t.extend.end).add("days", i);
                    wt.data.event.update_date(c, t.id, f.format("YYYY-MM-DD"), f.format("HH:mm"),
                        h.format("YYYY-MM-DD"), h.format("HH:mm"), function () {
                            t.extend.end = h.valueOf();
                        });
                }
            }
        },
        windowResize: function () {
            $(this).fullCalendar("option", "height", kzi.util.heightNoHeader() - 95);
        }
    };
    $scope.changeView = function (e) {
        $scope.myCalendar.fullCalendar("changeView", e);
        $scope.calendar_view = e;
        kzi.localData.set("calendar_view", e);
        //e();
    };
            $rootScope.global.loading_done = true;
    $scope.prev = function () {
        $scope.myCalendar.fullCalendar("prev");
        refreashCalendar();
    };
    $scope.next = function () {
        $scope.myCalendar.fullCalendar("next");
        refreashCalendar();
    };
    $scope.today = function () {
        $scope.myCalendar.fullCalendar("today");
        refreashCalendar();
    };
    $scope.js_filter_calendar_toggle = function (e) {
        e.is_checked = e.is_checked ? !1 : !0;
        savePrjCheckedToLocalData();
        e();
        refetchEvents();
    };
    $scope.js_toggle_showall = function () {
        $scope.show_all_events = 1 == $scope.show_all_events ? 0 : 1;
        kzi.localData.set("cale_show_all_events", $scope.show_all_events);
        removeEvents();
        refetchEvents();
    };
    $scope.js_team_members_toggle = function (e) {
        $scope.current_team.team_id === e.team_id
            ? $scope.current_team.expand = !$scope.current_team.expand
            : (
                $scope.current_team.expand = !1,
                $scope.current_team = e,
                $scope.current_team.expand = !0,
                _.isEmpty(e.members)
                    && (
                        $scope.members_loading_done = !1,
                        wt.data.team.get_team_members(e.team_id, function (t) {
                        e.members = wt.bus.member.get_normal_members(t.data.members);
                        _.each(e.members, function (t) {
                        t.team_id = e.team_id;
            })
        }, null, function () {
            $scope.members_loading_done = !0
        })))
    };
    $scope.js_view_member_tasks = function (e, i) {
        $scope.show_task_uid = e.uid;
        $scope.show_task_team_id = i.team_id;
        $scope.show_my_task = !1;
        s = null;
        e();
        refetchEvents();
    };
    $scope.js_view_my_tasks = function () {
        $scope.show_task_uid = $rootScope.global.me.uid;
        $scope.show_my_task = !0;
        $scope.show_task_team_id = null;
        s = null;
        removeEvents();
        refetchEvents();
    };
    $scope.js_show_completed_tasks = function () {
        $scope.show_completed_tasks = $scope.show_completed_tasks ? 0 : 1;
        kzi.localData.set("cale_show_completed_tasks", $scope.show_completed_tasks);
        removeEvents();
        refetchEvents();
    };
    $scope.js_toggle_right = function () {
        $rootScope.global.calendar_fold = !$rootScope.global.calendar_fold;
        $timeout(function () {
             $("#calendar").fullCalendar("render");
        }, 320);
    };
    $(".layout_content_sidebar").bind("transitionend", function () {
        $("#calendar").fullCalendar("render");
    });
    $scope.js_change_calendar_siderview = function (e) {
        if($scope.calendar_sidebar_view !== e) {
            $scope.calendar_sidebar_view = e;
            kzi.localData.set("calendar_sidebar_view", $scope.calendar_sidebar_view);
            e();
            refetchEvents();
        }
    };
    $scope.$on(kzi.constant.event_names.on_task_update, function (e, t) {
        var i = _.findWhere(s, {id: t.tid});
        if(i) {
            i.title = t.name;
            i.start = t.expire_date.toString().substring(0, 10);
            e();
            refetchEvents();
        }
    });
    $scope.$on(kzi.constant.event_names.on_task_trash, function (e, t) {
        var i = _.findWhere(s, {id: t.tid});
        if(i) {
            s = _.reject(s, function (e) {
                return e.id === t.tid;
            });
        }
        e();
        refetchEvents();
    });
    $scope.$on(kzi.constant.event_names.on_task_complete, function (e, t) {
        var i = _.findWhere(s, {id: t.tid});
        i && (t.completed ? (i.className = "cal_task_completed slide-trigger", i.extend.completed = 1) : (i.className = "cal_task_uncompleted slide-trigger", i.extend.completed = 0)), e(), refetchEvents()
    });
    $scope.$on(kzi.constant.event_names.on_event_update, function (t, i, n) {
        if (a) {
            var s = _.findWhere(a, {id: i.event_id});
            if (n === kzi.constant.event_update_type.one && s && (s.title = i.name, s.start = moment(i.start.date).valueOf().toString().substring(0, 10), s.end = moment(i.end.date).valueOf().toString().substring(0, 10), s.extend.i_attended = _.findWhere(i.attendees, {uid: $rootScope.global.me.uid}) ? 1 : 0, removeEvents(), refetchEvents()), n === kzi.constant.event_update_type.follow_up) {
                var l = new Date(i.start.date) - new Date(s.start), c = new Date(i.end.date) - new Date(i.start.date), d = new Date(s.start);
                l > 0 ? (a.forEach(function (e) {
                    var t = new Date(e.start);
                    e.extend.recurrence_id === i.recurrence_id && t >= d && (e.start = moment(e.start).add("milliseconds", l), e.end = moment(e.start).add("milliseconds", c), e.start = e.start.valueOf().toString().substring(0, 10), e.end = e.end.valueOf().toString().substring(0, 10))
                }), removeEvents(), refetchEvents()) : (a = [], h(r, o, function () {
                    removeEvents(), refetchEvents()
                }, null, function () {
                }))
            }
        }
    });
    $scope.$on(kzi.constant.event_names.on_event_trash, function (e, i, n) {
        if (a) {
            var s = parseInt(n);
            switch (s) {
                case kzi.constant.event_trash_type.one:
                    a = _.reject(a, function (e) {
                        return e.id === i.event_id
                    });
                    break;
                case kzi.constant.event_trash_type.follow_up:
                    a = _.reject(a, function (e) {
                        var t = new Date(e.start).getTime();
                        return t >= i.start.date && e.extend.recurrence_id === i.recurrence_id
                    });
                    break;
                case kzi.constant.event_trash_type.all:
                    a = _.reject(a, function (e) {
                        return e.extend.recurrence_id === i.recurrence_id
                    })
            }
        }
        $scope.calendar_projects = _.filter($scope.projects, function (e) {
            return 1 === e.is_calendar
        });
        e();
        refetchEvents();
    })
}]);