"use strict";
innerApp.controller("task_list_ctrl", ["$scope", "$routeParams", "$rootScope", "$popbox", "$location", "$timeout", function ($scope, $routeParams, $rootScope, $popbox, $location, $timeout) {
    function w(t) {
        var i = null;
        return _.isEmpty($scope.entries) ? null : (_.each($scope.entries, function (e) {
            e.entry_id === t && (i = e)
        }), i)
    }

    function k(e) {
        if (0 == e.length) return null;
        var t = e.attr("entry-id");
        return null == t || "" == t ? null : w(t)
    }

    function x(e, t, i, n) {
        e.pos = n, t.entry_id !== i.entry_id && (e.entry_id = i.entry_id, e.entry_name = i.name, _.isEmpty(i.tasks) ? i.tasks = [e] : i.tasks.push(e), t.tasks = _.reject(t.tasks, function (t) {
            return t.tid === e.tid
        }), t.tasks = _.sortBy(t.tasks, function (e) {
            return e.pos
        })), i.tasks = _.sortBy(i.tasks, function (e) {
            return e.pos
        })
    }

    function j(e, t, i, n, a, s) {
        x(t, i, n, a), wt.data.task.move(e, t.tid, i.entry_id, n.entry_id, a, function () {
            _.isFunction(s) && s()
        })
    }

    function B() {
        $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && ($scope.pop_member_options = [
            {
                name: "从活动移除",
                ongoing: "移除中...",
                click: function (t, n, a, s, o) {
                    o && (a.assigned = true, wt.bus.member.set_task_member_toggle(c, o, a, function () {
                        a.setting_toggle_member = false, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, $scope.task), a.assigned = false
                    }, null, s))
                }
            }
        ])
    }

    function V() {
        $scope.entries_sort_options = {
            appendTo: $(".layout_content_main"),
            containment: ".layout_content_main",
            placeholder: "wt-entry-placeholder",
            helper: "clone",
            revert: 10,
            dropOnEmpty: true,
            tolerance: "pointer",
            distance: "4",
            delay: "75",
            handle: ".entry_header",
            disabled: false,
            accept: ".entry",
            over: function (e, t) {
                t.placeholder.parents(".mCSB_container").not(".mCS_no_scrollbar") && $.each(t.placeholder.parents(".mCustomScrollbar"), function () {
                    if ($(this).data("horizontalScroll")) {
                        var t = $(this).offset().left,
                            i = $(this).width(),
                            n = $(".wt-entry-placeholder").width(),
                            a = $(".wt-entry-placeholder").position().left;
                        t + n + 50 > e.pageX && $(this).mCustomScrollbar("scrollTo", a - n - 100), e.pageX + n / 2 > t + i && $(this).mCustomScrollbar("scrollTo", a + n + 50)
                    }
                })
            },
            start: function (e, t) {
                t.item.addClass("picked-up"), $(".wt-entry-placeholder").css({
                    height: t.item.css("height"),
                    width: t.item.outerWidth()
                })
            },
            stop: function (e, t) {
                t.item.removeClass("picked-up");
                var i = k(t.item),
                    n = t.item.attr("entry-id"),
                    a = k(t.item.prev()),
                    s = k(t.item.next()),
                    o = 0;
                o = null == a ? s.pos / 2 + 1 : null == s ? a.pos + kzi.config.default_pos + 1 : (s.pos + a.pos) / 2 + 1, i.pos !== o && (i.pos = o, wt.data.entry.change_pos(c, n, o, function () {
                    v()
                }))
            }
        }
    }

    function X() {
        $scope.tasks_sort_options = {
            appendTo: $(".layout_content_main"),
            helper: "clone",
            revert: 10,
            containment: ".layout_content_main",
            connectWith: ".entry-tasks",
            placeholder: "wt-task-placeholder",
            tolerance: "pointer",
            dropOnEmpty: true,
            delay: "75",
            over: function (e, t) {
                t.placeholder.parents(".mCSB_container").not(".mCS_no_scrollbar") && $.each(t.placeholder.parents(".mCustomScrollbar"), function () {
                    var t = $(this).offset().top,
                        i = $(this).offset().left,
                        n = $(this).height(),
                        a = $(this).width(),
                        s = $(this).find(".wt-task-placeholder").position().top,
                        o = $(this).find(".wt-task-placeholder").height(),
                        r = $(this).find(".wt-task-placeholder").width();
                    if ($(this).data("horizontalScroll")) {
                        var l = $(".wt-task-placeholder").parents(".entry").position().left;
                        i + r / 2 > e.pageX && $(this).mCustomScrollbar("scrollTo", l - r), e.pageX + r / 2 > i + a && $(this).mCustomScrollbar("scrollTo", l + r)
                    } else o > e.pageY - t && $(this).mCustomScrollbar("scrollTo", s - 20), o > t + n - e.pageY && $(this).mCustomScrollbar("scrollTo", s + 20)
                })
            },
            start: function (e, t) {
                $(".wt-task-placeholder").css({
                    height: t.item.outerHeight()
                }), t.item.addClass("picked-up")
            },
            stop: function (e, t) {
                t.item.removeClass("picked-up")
            },
            update: function (t, i) {
                $scope.$apply(function () {
                    var t = i.item.attr("task-id"),
                        n = _.findWhere($scope.project.tasks, {
                            tid: t
                        }),
                        a = 0,
                        s = i.item.prev().attr("task-id"),
                        o = i.item.next().attr("task-id");
                    if (_.isEmpty(s) && _.isEmpty(o)) a = kzi.config.default_pos;
                    else if (_.isEmpty(s)) {
                        var r = _.findWhere($scope.project.tasks, {
                            tid: o
                        });
                        a = parseInt(r.pos) / 2 + 1
                    } else if (_.isEmpty(o)) {
                        var l = _.findWhere($scope.project.tasks, {
                            tid: s
                        });
                        a = l.pos + kzi.config.default_pos + 1
                    } else {
                        var r = _.findWhere($scope.project.tasks, {
                                tid: o
                            }),
                            l = _.findWhere($scope.project.tasks, {
                                tid: s
                            });
                        a = (r.pos + l.pos) / 2 + 1
                    }
                    var u = i.item.parents(".entry").attr("entry-id"),
                        d = _.findWhere($scope.entries, {
                            entry_id: u
                        }),
                        p = _.findWhere($scope.entries, {
                            entry_id: n.entry_id
                        });
                    (u !== p.entry_id || a !== n.pos) && d && (u !== p.entry_id && i.item.remove(), j(c, n, p, d, a))
                })
            }
        }
    }

    function G() {
        $scope.member_drop_options = {
            accept: ".avatar",
            over: function () {
            },
            out: function () {
            },
            hoverClass: "task-state-member-over",
            drop: function (t, n) {
                var a = t.pageX;
                if (!(a > $(".slide-content").offset().left || a > $(".layout_right_sidebar").offset().left)) {
                    var s = $(t.target).attr("task-id");
                    $scope.$apply(function () {
                        _.each($scope.entries, function (e) {
                            _.each(e.tasks, function (e) {
                                if (e.tid == s) {
                                    n.helper.context.title;
                                    var a = $(n.helper.context).attr("member-id");
                                    if (null == e.members) e.members = [];
                                    else {
                                        var o = _.findWhere(e.members, {
                                            uid: a
                                        });
                                        if (null != o) return
                                    }
                                    $rootScope.load_project_members(c, function (t) {
                                        var i = _.findWhere(t.members, {
                                            uid: a
                                        });
                                        e.members.unshift(i), wt.data.task.assign(c, e.tid, a, function () {
                                        })
                                    })
                                }
                            })
                        })
                    })
                }
            }
        }
    }

    var c = $routeParams.pid,
        u = $routeParams.tid,
        p = 0,
        f = false,
        m = null,
        h = null,
        g = false;
    $rootScope.pid = c, $scope.filter_turn_on = false, $scope.new_task = {
        members: [],
        expire_date: null,
        labels: []
    };
    
    $rootScope.reload_entries($rootScope.pid);

    $scope.view_type = 'list';
    $scope.js_view_toggle = function (t) {
        //kzi.msg.success('视图切换'+t);
        $scope.view_type = t;
    };

    $scope.current_tab = '0';
    $scope.js_change_tab = function (e) {
        $scope.current_tab = e;
    };
    var v = function () {
        _.isEmpty($scope.entries) || ($scope.entries = _.sortBy($scope.entries, function (e) {
            return e.pos
        }), $rootScope.project.entries = $scope.entries)
    }, b = function (e) {
        $timeout(function () {
            var t = "#task_main_" + e;
            $(t).parents(".mCustomScrollbar").eq(0).mCustomScrollbar("scrollTo", t)
        })
    }, y = function (e) {
        $timeout(function () {
            var t = "#entry_main_" + e;
            $(t).parents(".mCustomScrollbar").last().mCustomScrollbar("scrollTo", t)
        })
    }, C = {
        texts: [],
        labels: [],
        members: [],
        date: ""
    }, S = function (e, t) {
        var i = true;
        if (t && t.texts.length > 0 && (i = false, _.each(t.texts, function (t) {
            t.length > 0 && e.name.toLowerCase().indexOf(t.trim()) > -1 && (i = true)
        })), i && t.labels.length > 0 && (_.isEmpty(e.labels) ? i = false : (i = false, _.each(t.labels, function (t) {
            var n = _.any(e.labels, function (e) {
                return e.name === t.name
            });
            n && (i = true)
        }))), i && t.members.length > 0 && (_.isEmpty(e.members) ? i = false : (i = false, _.each(t.members, function (t) {
            var n = _.any(e.members, function (e) {
                return e.uid == t.uid
            });
            n && (i = true)
        }))), i) {
            var n = moment(),
                a = moment(e.expire_date);
            if ("today" === t.date) {
                var s = a.isSame(n, "day");
                i = s ? true : false
            } else if ("tomorrow" === t.date) {
                var o = a.isSame(n.add("days", 1), "day");
                i = o ? true : false
            } else if ("week" === t.date) {
                var r = moment().endOf("week").add("days", 1),
                    l = moment().startOf("week").add("days", 1);
                i = a >= l && r >= a ? true : false
            } else if ("nextweek" == t.date) {
                var r = moment().endOf("week").add("days", 8),
                    l = moment().startOf("week").add("days", 8);
                i = a >= l && r >= a ? true : false
            } else if ("month" == t.date) {
                var c = moment().endOf("month"),
                    u = moment().startOf("month");
                i = a >= u && c >= a ? true : false
            } else if ("due" == t.date) {
                var s = a.isSame(n, "day");
                i = !s && e.expire_date && n > a && a > 0 ? true : false
            }
        }
        e.is_filter = i ? false : true
    }, D = function () {
        _.isEmpty($scope.entries) || ($scope.filter_turn_on = C.texts.length > 0 || C.labels.length > 0 || C.members.length > 0 || C.date.length > 0 ? true : false, _.each($scope.entries, function (e) {
            _.isEmpty(e.tasks) || _.each(e.tasks, function (e) {
                S(e, C)
            })
        }))
    }, E = function (t, i) {
        if (_.isEmpty($scope.filter_turn_on)) {
            var n = true;
            if ("assign_me" === $scope.current_filter_type) n = _.any(t.members, function (e) {
                return e.uid === i.uid
            });
            else if ("my_watch" === $scope.current_filter_type) n = _.any(t.watchers, function (e) {
                return e.uid === i.uid
            });
            else if ("my_create" === $scope.current_filter_type) n = i.uid === t.uid;
            else if (C.texts.length > 0 || C.labels.length > 0 || C.members.length > 0 || C.date.length > 0) return S(t, C), void 0;
            t.is_filter = n ? false : true
        }
    }, T = function (t) {
        _.isEmpty($scope.entries) || _.each($scope.entries, function (e) {
            _.isEmpty(e.tasks) || _.each(e.tasks, function (e) {
                var i = true;
                _.isEmpty(t) || (i = _.any(e.members, function (e) {
                    return e.uid == t.uid
                })), e.is_filter = i ? false : true
            })
        })
    }, z = function (t) {
        _.isEmpty($scope.entries) || _.each($scope.entries, function (e) {
            _.isEmpty(e.tasks) || _.each(e.tasks, function (e) {
                var i = true;
                _.isEmpty(t) || (i = _.any(e.watchers, function (e) {
                    return e.uid == t.uid
                })), e.is_filter = i ? false : true
            })
        })
    }, M = function (t) {
        _.isEmpty($scope.entries) || _.each($scope.entries, function (e) {
            _.isEmpty(e.tasks) || _.each(e.tasks, function (e) {
                var i = true;
                _.isEmpty(t) || (i = t.uid === e.uid), e.is_filter = i ? false : true
            })
        })
    }, P = function () {
        C.texts = [], C.labels = [], C.members = [], C.date = "", D()
    }, A = function (t) {
        var n = null;
        _.each(t.tasks, function (e) {
            e.is_filter = false, e.selected = false, u === e.tid && (n = e)
        }), _.each(t.entries, function (e) {
            var i = _.where(t.tasks, {
                entry_id: e.entry_id
            });
            i && (e.tasks || (e.tasks = []), e.tasks = i)
        }), $scope.entries = t.entries, _.each($scope.entries, function (e) {
            e.tasks = _.sortBy(e.tasks, function (e) {
                return e.pos
            })
        }), $rootScope.global.loading_done = true, n && $timeout(function () {
            $rootScope.locator.to_task(c, n.tid, false)
        }), _.isEmpty($scope.filter_turn_on) && ("assign_me" === $scope.current_filter_type ? T($rootScope.global.me) : "my_watch" === $scope.current_filter_type ? z($rootScope.global.me) : "my_create" === $scope.current_filter_type ? M($rootScope.global.me) : (C.texts.length > 0 || C.labels.length > 0 || C.members.length > 0 || C.date.length > 0) && D())
    }, O = function () {
        $scope.new_task.temp_name = "", $scope.new_task.members = [], $scope.new_task.labels = [], $scope.new_task.expire_date = null
    }, I = function (t, n, a, s) {
        if (!_.isUndefined(t) && !_.isUndefined(t.temp_name) && !_.isEmpty(t.temp_name)) {
            $scope.is_task_adding = true;
            var o = n.entry_id,
                r = wt.bus.task.calculate_task_pos(n, a),
                u = [],
                d = [];
            _.isEmpty(t.members) || (u = _.pluck(t.members, "uid")), _.isEmpty(t.labels) || (d = _.pluck(t.labels, "name")), wt.data.task.add_full(c, o, t.temp_name, r, u, d, t.expire_date, function (e) {
                n.tasks || (n.tasks = []), a ? n.task_top_focus = true : n.task_bottom_focus = true, e.data.entry_name = n.name, a ? n.tasks.unshift(e.data) : n.tasks.push(e.data);
                var t = _.findWhere($rootScope.project.tasks, {
                    tid: e.data.tid
                });
                t || ($rootScope.project.tasks = $rootScope.project.tasks ||[],$rootScope.project.tasks.push(e.data))
            }, null, function () {
                _.isFunction(s) && s(), $scope.is_task_adding = false, 0 == a && $timeout(function () {
                    var e = $("#entry_main_" + n.entry_id).eq(0).find(".mCustomScrollbar");
                    e.mCustomScrollbar("scrollTo", "bottom")
                })
            }), O()
        }
    };
    $scope.task_filters = C;
    $scope.$on(kzi.constant.event_names.on_project_tasks_filter,
        function () {
            D()
        });
    $scope.$on(kzi.constant.event_names.project_clear_task_filter,
        function () {
            e.filter_texts = [], e.filter_labels = [], e.filter_members = [], e.filter_date = "", e.task_filter_text = "", P()
        });


    $scope.$on("socket_message_entry_list", function () {
        A($rootScope.project)
    }), $scope.$on("socket_message_task_move", function () {
        A($rootScope.project)
    }), $scope.$on("socket_message_task_add", function (t, n) {
        var a = _.findWhere($scope.entries, {
            entry_id: n.task.entry_id
        });
        if (a) {
            var s = _.findWhere(a.tasks, {
                tid: n.task.tid
            });
            s || (E(n.task, $rootScope.global.me), a.tasks.push(n.task), a.tasks = _.sortBy(a.tasks, function (e) {
                return e.pos
            }))
        }
    }), $scope.$on("socket_message_task_delete", function (t, i) {
        _.each($scope.entries, function (e) {
            var t = _.findWhere(e.tasks, {
                tid: i.tid
            });
            t && (e.tasks = _.reject(e.tasks, function (e) {
                return e.tid === i.tid
            }))
        })
    }), $scope.$on("socket_message_project_member_remove", function (t, i) {
        _.each($scope.entries, function (e) {
            e.tasks && e.tasks.length > 0 && _.each(e.tasks, function (e) {
                e.members && e.members.length > 0 && (e.members = _.reject(e.members, function (e) {
                    return e.uid == i.uid
                }))
            })
        })
    });
    var F = function () {
        if (!_.isEmpty($scope.entries)) {
            $rootScope.project.entryIndex = 0;
            for (var t = 0; $scope.entries.length > t; t++)
                if (!_.isEmpty($scope.entries[t].tasks)) {
                    $rootScope.project.entryIndex = t, $rootScope.project.currentEntry = $scope.entries[t], $rootScope.project.currentTask = $rootScope.project.currentEntry.tasks[0], $rootScope.project.taskIndex = 0, $rootScope.project.currentTask.selected = true;
                    break
                }
        }
    }, N = function () {
        $timeout(function () {
            $(".task-selected").parents(".mCustomScrollbar").eq(0).mCustomScrollbar("scrollTo", ".task-selected")
        })
    }, H = function () {
        $timeout(function () {
            $(".entry-selected").parents(".mCustomScrollbar").last().mCustomScrollbar("scrollTo", ".entry-selected")
        })
    }, L = function (e) {
        _.isEmpty($rootScope.project.currentEntry) || ($rootScope.project.currentEntry.selected = false), $rootScope.project.currentEntry = e, $rootScope.project.currentEntry.selected = true
    }, R = function (e) {
        _.isEmpty($rootScope.project.currentTask) || ($rootScope.project.currentTask.selected = false), $rootScope.project.currentTask = e, $rootScope.project.currentTask.selected = true
    }, q = function () {
        _.isEmpty($rootScope.project.currentEntry) || ($rootScope.project.currentEntry.selected = false, $rootScope.project.entryIndex = 0, $rootScope.project.currentEntry = null), _.isEmpty($rootScope.project.currentTask) || ($rootScope.project.currentTask.selected = false, $rootScope.project.taskIndex = 0, $rootScope.project.currentTask = null)
    }, W = function (t) {
        if ($scope.entries.length > t + 1) {
            var n = $scope.entries[t + 1];
            _.isEmpty(n.tasks) ? W(t + 1) : ($rootScope.project.entryIndex = t + 1, L(n), $rootScope.project.taskIndex = 0, R(n.tasks[0]), H(), N())
        }
    }, Y = function (t, n) {
        if (t > 0) {
            var a = $scope.entries[t - 1];
            _.isEmpty(a.tasks) ? Y(t - 1) : ($rootScope.project.entryIndex = t - 1, L(a), $rootScope.project.taskIndex = n === true ? a.tasks.length - 1 : 0, R(a.tasks[$rootScope.project.taskIndex]), H(), N())
        }
    }, U = function (t) {
        var n = 0;
        $rootScope.project.currentEntry && $rootScope.project.currentEntry.entry_id === t.entry_id || _.each($scope.entries, function (e) {
            e.entry_id === t.entry_id && (L(e), $rootScope.project.entryIndex = n), n++
        }), n = 0, _.each($rootScope.project.currentEntry.tasks, function (e) {
            e.tid === t.tid && (R(e), $rootScope.project.taskIndex = n), n++
        })
    };
    $scope.$on(kzi.constant.event_names.shortcut_key_to_task, function (t, n) {
        if ($scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest) {
            g = true;
            var a = [kzi.constant.keyASCIIs.A, kzi.constant.keyASCIIs.L, kzi.constant.keyASCIIs.D, kzi.constant.keyASCIIs.W, kzi.constant.keyASCIIs.M];
            if (!(f === true && 0 > $.inArray(n, a))) switch (n) {
                case kzi.constant.keyASCIIs.VK_DOWN:
                case kzi.constant.keyASCIIs.J:
                    _.isEmpty($rootScope.project.currentTask) ? F() : $rootScope.project.currentEntry.tasks.length > $rootScope.project.taskIndex + 1 ? ($rootScope.project.taskIndex++, R($rootScope.project.currentEntry.tasks[$rootScope.project.taskIndex]), N()) : _.isEmpty($rootScope.project.currentEntry) ? F() : W($rootScope.project.entryIndex);
                    break;
                case kzi.constant.keyASCIIs.VK_UP:
                case kzi.constant.keyASCIIs.K:
                    _.isEmpty($rootScope.project.currentTask) ? F() : $rootScope.project.taskIndex > 0 ? ($rootScope.project.taskIndex--, R($rootScope.project.currentEntry.tasks[$rootScope.project.taskIndex]), N()) : _.isEmpty($rootScope.project.currentEntry) ? F() : Y($rootScope.project.entryIndex, true);
                    break;
                case kzi.constant.keyASCIIs.VK_LEFT:
                    _.isEmpty($rootScope.project.currentEntry) ? F() : Y($rootScope.project.entryIndex, false);
                    break;
                case kzi.constant.keyASCIIs.VK_RIGHT:
                    _.isEmpty($rootScope.project.currentEntry) ? F() : W($rootScope.project.entryIndex);
                    break;
                case kzi.constant.keyASCIIs.ENTER:
                    _.isEmpty($rootScope.project.currentTask) || ($rootScope.global.show_slide_menu && ($rootScope.global.show_slide_menu = false), $rootScope.locator.to_task(c, $rootScope.project.currentTask.tid, false));
                    break;
                case kzi.constant.keyASCIIs.I:
                    $("#btn_new_task").click();
                    break;
                case kzi.constant.keyASCIIs.N:
                    $("#btn_new_entry").click();
                    break;
                case kzi.constant.keyASCIIs.M:
                    if (!_.isEmpty($rootScope.project.currentTask)) {
                        var s = "icon_action_task_" + $rootScope.project.currentTask.tid;
                        p = 1, $("#" + s).click()
                    }
                    break;
                case kzi.constant.keyASCIIs.L:
                    if (!_.isEmpty($rootScope.project.currentTask)) {
                        var s = "icon_action_task_" + $rootScope.project.currentTask.tid;
                        p = 2, $("#" + s).click()
                    }
                    break;
                case kzi.constant.keyASCIIs.D:
                    if (!_.isEmpty($rootScope.project.currentTask)) {
                        var s = "icon_action_task_" + $rootScope.project.currentTask.tid;
                        p = 3, $("#" + s).click()
                    }
                    break;
                case kzi.constant.keyASCIIs.W:
                    if (!_.isEmpty($rootScope.project.currentTask)) {
                        var s = "icon_action_task_" + $rootScope.project.currentTask.tid;
                        p = 4, $("#" + s).click()
                    }
                    break;
                case kzi.constant.keyASCIIs.A:
                    if (!_.isEmpty($rootScope.project.currentTask)) {
                        var s = "icon_action_task_" + $rootScope.project.currentTask.tid;
                        p = 40, $("#" + s).click()
                    }
                    break;
                case kzi.constant.keyASCIIs.C:
                    if (!_.isEmpty($rootScope.project.currentTask)) {
                        var s = "task_check_" + $rootScope.project.currentTask.tid;
                        $("#" + s).click()
                    }
                    break;
                case kzi.constant.keyASCIIs.VK_SPACE:
                    if (!_.isEmpty($rootScope.project.currentTask)) {
                        var o = _.findWhere($rootScope.project.currentTask.members, {
                            uid: $rootScope.global.me.uid
                        });
                        o ? (o.assigned = 1, wt.bus.member.set_task_member_toggle(c, $rootScope.project.currentTask, o)) : wt.bus.member.set_task_member_toggle(c, $rootScope.project.currentTask, $rootScope.global.me)
                    }
                    break;
                case kzi.constant.keyASCIIs.VK_LessThan:
                    if (!_.isEmpty($rootScope.project.currentEntry) && !_.isEmpty($rootScope.project.currentTask) && $rootScope.project.entryIndex > 0) {
                        var r = $scope.entries[$rootScope.project.entryIndex - 1],
                            l = kzi.config.default_pos;
                        _.isEmpty(r.tasks) || (l = _.max(r.tasks, function (e) {
                            return e.pos
                        }).pos + kzi.config.default_pos + 1), delete $rootScope.project.currentTask.$$hashKey, j(c, $rootScope.project.currentTask, $rootScope.project.currentEntry, r, l, function () {
                            $rootScope.project.entryIndex = $rootScope.project.entryIndex - 1, L(r), $rootScope.project.taskIndex = r.tasks.length - 1, H(), N()
                        })
                    }
                    break;
                case kzi.constant.keyASCIIs.VK_GreaterThan:
                    if (!_.isEmpty($rootScope.project.currentEntry) && !_.isEmpty($rootScope.project.currentTask) && $scope.entries.length > $rootScope.project.entryIndex + 1) {
                        var r = $scope.entries[$rootScope.project.entryIndex + 1],
                            l = kzi.config.default_pos;
                        _.isEmpty(r.tasks) || (l = _.max(r.tasks, function (e) {
                            return e.pos
                        }).pos + kzi.config.default_pos + 1), delete $rootScope.project.currentTask.$$hashKey, j(c, $rootScope.project.currentTask, $rootScope.project.currentEntry, r, l, function () {
                            $rootScope.project.entryIndex = $rootScope.project.entryIndex + 1, L(r), $rootScope.project.taskIndex = r.tasks.length - 1, H(), N()
                        })
                    }
                    break;
                default:
            }
        }
    }), $scope.js_mouseover_entries_panel = function (e) {
        if (g !== true && !f) {
            var t = $(e.target),
                n = "";
            if (t.length > 0 && (n = t.attr("task-id"), _.isEmpty(n) && (t = t.parents(".task_style"), n = t.attr("task-id")), !_.isEmpty(n))) {
                var a = _.findWhere($rootScope.project.tasks, {
                    tid: n
                });
                U(a)
            }
        }
    }, $scope.js_mousemove_entries_panel = function () {
        g === true && (g = false)
    }, $scope.js_mouseleave_task = function (e, t) {
        if (!_.isEmpty($rootScope.project.currentTask) && $rootScope.project.currentTask.tid === t.tid) {
            if (f) return;
            q()
        }
    }, $rootScope.load_project_from_cache(c, function (t) {
        $scope.project = {
            info: t
        }, $rootScope.global.title = "活动 | " + $scope.project.name, $rootScope.load_tasks(c, function (t) {
            t.info.pid === c && ($rootScope.global.title = "活动 | " + t.info.name, $rootScope.global.loading_done = true, $scope.project = t, 1 == $scope.project.info.archived ? $scope.permission = kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? $scope.permission = kzi.constant.permission.team_stop_service : ($scope.permission = kzi.constant.permission.ok, $scope.project.info.curr_role !== kzi.constant.role.guest && (V(), X(), G())), B(), A(t), q())
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path("/project/" + c + "/notfound") : wt.data.error(e)
        })
    });
    $scope.js_add_task_pop = function (t) {
        $popbox.popbox({
            target: t,
            templateUrl: "/view/project/task/pop_add_task.html",
            controller: ["$scope", "popbox", "pop_data",
                function ($scope, popbox, pop_data) {
                    $scope.popbox = popbox;
                    $scope.new_task = {};
                    $scope.entries = pop_data.entries;
                    _.isEmpty($scope.entries) || ($scope.new_task.entry = $scope.entries[0]);
                    $scope.js_to_add_entry_pop = function () {
                        $scope.js_close(), $("#btn_new_entry").click()
                    };
                    $scope.js_add_task = function (t, n) {
                        if ($scope.is_save_ing !== true && !_.isEmpty(n.temp_name)) {
                            $scope.is_save_ing = true;
                            var a = wt.bus.task.calculate_task_pos(n.entry, false);
                            wt.data.task.add_simple(c, n.entry.entry_id, n, a, function (t) {
                                n.entry.tasks || (n.entry.tasks = []), t.data.entry_name = n.entry.name, n.entry.tasks.unshift(t.data);
                                var a = _.findWhere($rootScope.project.tasks, {
                                    tid: t.data.tid
                                });
                                var z = function(){
                                    $rootScope.project.tasks = $rootScope.project.tasks || [];
                                    $rootScope.project.tasks.unshift(t.data)
                                }
                                a || z(), $scope.js_close(), b(t.data.tid), y(n.entry.entry_id)
                            }, null, function () {
                                $scope.is_save_ing = false
                            })
                        }
                    };
                    $scope.js_close = function () {
                        popbox.close()
                    }
                }
            ],
            resolve: {
                pop_data: function () {
                    return {
                        scope: $scope,
                        entries: $scope.entries
                    }
                }
            }
        }).open()
    }, $scope.js_add_entry_pop = function (t) {
        $popbox.popbox({
            target: t,
            templateUrl: "/view/project/task/pop_add_entry.html",
            controller: ["$scope", "popbox", "pop_data",
                function (e, t, i) {
                    e.popbox = t, e.js_add_entry = function (n, a) {
                        if (e.is_save_ing !== true) {
                            e.is_save_ing = true;
                            var s = wt.bus.entry.calculate_entry_pos(i.scope.entries, true);
                            wt.data.entry.add(c, a, s, function (e) {
                                e.data.tasks = [], i.entries.unshift(e.data), v(), t.close(), $timeout(function () {
                                    y(e.data.entry_id)
                                }, 100)
                            }, null, function () {
                                e.is_save_ing = false
                            })
                        }
                    }, e.js_close = function () {
                        t.close()
                    }
                }
            ],
            resolve: {
                pop_data: function () {
                    return {
                        scope: $scope,
                        entries: $scope.entries
                    }
                }
            }
        }).open()
    }, $scope.js_add_entry = function (t) {
        if (!_.isEmpty(t) && $scope.is_adding_entry !== true) {
            $scope.is_adding_entry = true;
            var i = wt.bus.entry.calculate_entry_pos($scope.entries, false);
            wt.data.entry.add(c, t, i, function (t) {
                _.isEmpty($scope.entries) && ($scope.entries = []), t.data.tasks = [], $scope.entries.push(t.data), v(), $scope.entry_name = ""
            }, null, function () {
                $scope.is_adding_entry = false
            })
        }
    }, $scope.js_add_task = function (e, t, i, n) {
        I(t, i, n, function () {
        })
    }, $scope.js_show_entry_menu = function (t, i, a, s) {
        var o = i.entry_id;
        $popbox.popbox({
            target: t,
            top: a,
            left: s,
            templateUrl: "/view/project/task/pop_entry_menu.html",
            controller: ["$rootScope", "$scope", "popbox", "pop_data",
                function (e, t, n, a) {
                    t.popbox = n, t.entry_name = i.name, t.entry = i, t.step = 0, t.js_step = function (e) {
                        t.step = e
                    }, t.js_close = function () {
                        n.close()
                    }, t.js_change_name = function (e, i) {
                        t.is_save_ing = true, wt.data.entry.update(c, o, i, function () {
                            a.entry.name = i
                        }, null, function () {
                            t.is_save_ing = false, n.close()
                        })
                    }, t.js_archive_entry = function () {
                        a.scope.entries = _.reject(a.scope.entries, function (e) {
                            return e.entry_id === i.entry_id
                        }), e.refresh_cache.entry.del(i.entry_id), wt.data.entry.archive(c, o, function () {
                        }), n.close()
                    }, t.js_del_entry = function () {
                        a.scope.entries = _.reject(a.scope.entries, function (e) {
                            return e.entry_id === i.entry_id
                        }), e.refresh_cache.entry.del(i.entry_id), wt.data.entry.trash(c, o, function () {
                        }), n.close()
                    }, t.js_archived_all = function () {
                        a.entry.tasks = _.reject(a.entry.tasks, function (e) {
                            return 1 == e.completed
                        }), e.project.tasks = _.reject(e.project.tasks, function (e) {
                            return 1 == e.completed && e.entry_id == o
                        }), wt.data.task.archived_all(c, o, function () {
                        }), n.close()
                    }, t.js_top_open_add_task_composer = function () {
                        i.task_top_enabled = true, i.task_top_focus = true;
                        var t = $($(".popbox").scope().popbox._target).parents(".entry").children(".mCustomScrollbar");
                        t.mCustomScrollbar("scrollTo", 0), n.close()
                    };
                    var s = function () {
                        e.load_project_members(c, function (e) {
                            var n = wt.bus.member.get_normal_members(e.members);
                            _.each(n, function (e) {
                                var t = false,
                                    n = false;
                                _.each(i.tasks, function (i) {
                                    var a = _.pluck(i.members, "uid");
                                    _.contains(a, e.uid) ? t = true : n = true
                                }), e.assigned_all = t && !n ? 1 : 0
                            }), t.members = n
                        })
                    };
                    t.js_to_move = function () {
                        t.js_step(7), t.entries = _.reject(a.scope.entries, function (e) {
                            return e.entry_id === i.entry_id
                        })
                    }, t.js_to_assign = function () {
                        t.js_step(8), s()
                    }, t.js_to_set_label = function () {
                        t.js_step(9), t.labels = _.filter(a.scope.project.info.labels, function (e) {
                            return "" !== e.desc
                        })
                    }, t.js_to_set_labels = function () {
                        _.each(kzi.constant.labels, function (e) {
                            var i = _.findWhere(a.scope.project.info.labels, {
                                name: e.name
                            });
                            i && (t[e.name] = i.desc)
                        }), t.step = 9.1
                    }, t.js_move_to = function (e) {
                        wt.data.entry.batch_move(c, i.entry_id, e.entry_id, function () {
                            var n = 0;
                            _.isEmpty(e.tasks) || (n = _.max(e.tasks, function (e) {
                                return e.pos
                            })), _.each(i.tasks, function (t) {
                                n = n + kzi.config.default_pos + 1, t.pos = n, t.entry_id = e.entry_id
                            }), e.tasks = e.tasks.concat(i.tasks), i.tasks = []
                        }, null, function () {
                        }), n.close()
                    }, t.js_toggle_member = function (e) {
                        e.assigned_all || (wt.bus.entry.batch_assign_member(c, i, e), t.step = 6)
                    }, t.js_watcher_entry_toggle = function () {
                        i.is_watched ? wt.data.entry.unwatch_entry(c, i.entry_id, function () {
                        }) : wt.data.entry.watch_entry(c, i.entry_id, function () {
                        }), i.is_watched = !i.is_watched
                    }, t.js_toggle_label = function (e) {
                        wt.bus.entry.batch_set_label(c, i, e, null, null, function () {
                        }), t.step = 6
                    }, t.js_set_expire = function (e) {
                        var n = moment(e).endOf("day").valueOf();
                        wt.data.entry.batch_set_expire(c, i.entry_id, n, function () {
                            _.each(i.tasks, function (e) {
                                e.expire_date = n
                            })
                        }), t.step = 6
                    }, t.js_set_expire_date = function (e) {
                        switch (e) {
                            case "today":
                                t.expire_date = moment().format("YYYY-MM-DD");
                                break;
                            case "tomorrow":
                                t.expire_date = moment().add("days", 1).format("YYYY-MM-DD");
                                break;
                            case "week":
                                t.expire_date = moment().endOf("week").add("days", 1).format("YYYY-MM-DD");
                                break;
                            case "next_week":
                                t.expire_date = moment().add("days", 7).endOf("week").add("days", 1).format("YYYY-MM-DD");
                                break;
                            case "month":
                                t.expire_date = moment().endOf("month").format("YYYY-MM-DD")
                        }
                        t.js_set_expire(t.expire_date)
                    }, t.js_set_lables = function (e, i, n, s, o, r) {
                        t.is_save_ing = true, wt.bus.project.label.set_labels(c, e, i, n, s, o, r, function (e) {
                            a.scope.project.info.labels = e, t.labels = _.filter(a.scope.project.info.labels, function (e) {
                                return "" !== e.desc
                            }), t.step = 9
                        }, null, function () {
                            t.is_save_ing = false
                        })
                    }, t.js_to_copy_entry = function () {
                        t.new_entry = {
                            name: i.name,
                            entry_id: i.entry_id,
                            pos: i.pos
                        }, t.js_step(12)
                    }, t.js_copy_entry = function (i) {
                        if (!_.isEmpty(i.name)) {
                            var n = wt.bus.entry.calculate_copy_entry_pos(a.entries, i);
                            t.is_copying = true, wt.data.entry.copy_entry(c, i.entry_id, i.name, n, function (i) {
                                a.entries.push(i.data), v(), e.reload_entries(c), t.js_close()
                            }, null, function () {
                                t.is_copying = false
                            })
                        }
                    }
                }
            ],
            resolve: {
                pop_data: function () {
                    return {
                        scope: $scope,
                        entries: $scope.entries,
                        entry: i
                    }
                }
            }
        }).open()
    }, $scope.js_show_task_menu = function (t, a, s, o, r) {
        return t.stopPropagation(), f && s.tid === m ? (h.close(), void 0) : (s.tid && U(s), h = $popbox.popbox({
            target: t,
            top: o,
            left: r,
            templateUrl: "/view/project/task/pop_task_menu.html",
            controller: ["$scope", "popbox", "pop_data",
                function (e, t, n) {
                    e.popbox = t, f = true, m = s.tid, e.step = p, e.js_step = function (t) {
                        e.step = t
                    }, e.js_close = function () {
                        t.close()
                    };
                    var o = false;
                    _.isEmpty(s.tid) && (o = true), e.is_add_task = o, $rootScope.load_project_members(c, function (t) {
                        var i = [],
                            n = [];
                        _.each(t.members, function (e) {
                            if (1 == e.status) {
                                if (e.role === kzi.constant.role.admin || e.role === kzi.constant.role.member) {
                                    var t = _.findWhere(s.members, {
                                        uid: e.uid
                                    });
                                    e.assigned = t ? 1 : 0, i.push(e)
                                }
                                var a = _.findWhere(s.watchers, {
                                    uid: e.uid
                                });
                                e.is_watch = a ? 1 : 0, n.push(e)
                            }
                        }), e.members = i, e.watchers = n
                    }), e.js_toggle_member = function (e) {
                        wt.bus.member.set_task_member_toggle(c, s, e)
                    }, e.js_toggle_watch = function (e) {
                        if (e.is_watch) {
                            var t = _.findWhere(s.watchers, {
                                uid: e.uid
                            });
                            t && (s.watchers = _.reject(s.watchers, function (t) {
                                return t.uid === e.uid
                            })), e.is_watch = 0, wt.data.unwatch(c, "programs", s.tid, e.uid, function () {
                            })
                        } else {
                            var t = _.findWhere(s.watchers, {
                                uid: e.uid
                            });
                            t || (s.watchers.push(e), e.is_watch = 1, wt.data.watch(c, "programs", s.tid, e.uid, function () {
                            }))
                        }
                    }, e.js_watch_all = function () {
                        if (s.watchers.length !== e.members) {
                            var i = _.pluck(e.members, "uid");
                            wt.data.watch_batch(c, kzi.constant.xtype.task, s.tid, i, function () {
                                s.watchers = e.members
                            }), _.each(e.members, function (e) {
                                e.is_watch = 1
                            })
                        }
                        t.close()
                    }, e.labels = wt.bus.project.label.load(s, n.scope.project.info.labels), e.js_toggle_label = function (e) {
                        wt.bus.task.set_toggle_label(c, s, e)
                    }, e.js_goto_set_labels = function () {
                        _.each(kzi.constant.labels, function (t) {
                            var i = _.findWhere(n.scope.project.info.labels, {
                                name: t.name
                            });
                            i && (e[t.name] = i.desc)
                        }), e.step = 21
                    }, e.js_set_lables = function (t, i, a, o, r, l) {
                        var u = [
                            {
                                name: "blue",
                                desc: t
                            },
                            {
                                name: "green",
                                desc: i
                            },
                            {
                                name: "orange",
                                desc: a
                            },
                            {
                                name: "purple",
                                desc: o
                            },
                            {
                                name: "red",
                                desc: r
                            },
                            {
                                name: "yellow",
                                desc: l
                            }
                        ];
                        e.is_save_ing = true, wt.data.project.set_labels(c, u, function () {
                            n.scope.project.info.labels = u, e.labels = wt.bus.project.label.load(s, u), e.step = 2
                        }, null, function () {
                            e.is_save_ing = false
                        })
                    }, s.expire_date_temp = s.expire_date ? moment(s.expire_date).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"), e.task = s, e.js_close = function () {
                        t.close()
                    }, e.js_today = function () {
                        s.expire_date = moment().format("YYYY-MM-DD"), e.set_expire(s.expire_date)
                    }, e.js_tomorrow = function () {
                        s.expire_date = moment().add("days", 1).format("YYYY-MM-DD"), e.set_expire(s.expire_date)
                    }, e.js_week = function () {
                        s.expire_date = moment().endOf("week").add("days", 1).format("YYYY-MM-DD"), e.set_expire(s.expire_date)
                    }, e.js_next_week = function () {
                        s.expire_date = moment().add("days", 7).endOf("week").add("days", 1).format("YYYY-MM-DD"), e.set_expire(s.expire_date)
                    }, e.js_month = function () {
                        s.expire_date = moment().endOf("month").format("YYYY-MM-DD"), e.set_expire(s.expire_date)
                    }, e.js_set_expire = function (t) {
                        e.set_expire(t)
                    }, e.js_cancel_expire = function () {
                        o ? (s.expire_date = null, s.expire_date_temp = null) : (s.expire_date_temp = null, s.expire_date = 0, s.badges.expire_date = 0, wt.data.task.set_expire(c, s.tid, 0, function () {
                        })), t.close()
                    }, e.set_expire = function (i) {
                        var n = moment(i).endOf("day").valueOf();
                        o ? (s.expire_date = n, e.js_step(0)) : (wt.data.task.set_expire(c, s.tid, n, function () {
                        }), s.badges.expire_date = n, s.expire_date = n, 0 !== p ? t.close() : e.js_step(0))
                    }, e.entries = n.scope.entries, _.each(e.entries, function (e) {
                        e.move_selected = e.entry_id === s.entry_id ? 1 : 0
                    }), e.js_move_to = function (i) {
                        if (_.each(e.entries, function (e) {
                            e.move_selected = 0
                        }), i.move_selected = 1, i) {
                            var n = kzi.config.default_pos;
                            _.isEmpty(i.tasks) || (n = _.max(i.tasks, function (e) {
                                return e.pos
                            }).pos + kzi.config.default_pos + 1), j(c, s, a, i, n), t.close()
                        }
                    }, e.js_del_task = function () {
                        a.tasks = _.reject(a.tasks, function (e) {
                            return e.tid == s.tid
                        }), $rootScope.project.tasks = _.reject($rootScope.project.tasks, function (e) {
                            return e.tid == s.tid
                        }), wt.data.task.trash(c, s.tid, function () {
                        }), t.close()
                    }, e.js_archive_task = function () {
                        a.tasks = _.reject(a.tasks, function (e) {
                            return e.tid == s.tid
                        }), $rootScope.project.tasks = _.reject($rootScope.project.tasks, function (e) {
                            return e.tid == s.tid
                        }), wt.data.task.archive(c, s.tid, function () {
                        }), t.close()
                    }, e.js_to_copy_task = function () {
                        e.new_task = wt.bus.task.get_copy_task(e.task), e.js_step(31)
                    }, e.js_copy_task = function (t, n) {
                        if (!_.isEmpty(n.name)) {
                            e.is_copying = true;
                            var a = w(n.entry_id),
                                s = wt.bus.task.calculate_copy_task_pos(a, n);
                            wt.data.task.copy_task(c, n.tid, n.name, s, n.keep_comments, n.keep_members, n.keep_labels, n.keep_attachments, n.keep_todos, n.keep_watchers, function (t) {
                                e.js_close(), $rootScope.refresh_cache.task.add(t.data), a.tasks.push(t.data), a.tasks = _.sortBy(a.tasks, function (e) {
                                    return e.pos
                                })
                            }, null, function () {
                                e.is_copying = false
                            })
                        }
                    }, e.prj_files_loading = false, e.js_to_select_files = function () {
                        e.js_step(41), e.prj_files_loading = true, $rootScope.load_files(c, "", function (t) {
                            var i = _.where(t.files, {
                                folder_id: ""
                            });
                            e.files = i
                        }, null, function () {
                            e.prj_files_loading = false
                        })
                    }, e.js_attach = function (t) {
                        if (1 == t.type) e.step = 42, e.prj_files_loading = true, $rootScope.load_files(c, t.fid, function (i) {
                            e.prj_files_loading = false;
                            var n = _.where(i.files, {
                                folder_id: t.fid
                            });
                            e.sub_files = n
                        });
                        else {
                            if (e.file_attaching) return;
                            if (s.files || (s.files = []), _.contains(s.fids, t.fid)) return;
                            e.file_attaching = true, s.files.length > 0 && s.files.push(t), wt.data.file.attach(c, "programs", s.tid, t.fid, function () {
                                s.badges.file_count += 1
                            }, null, function () {
                                e.file_attaching = false
                            })
                        }
                    }, e.file_upload_option = {
                        url: [kzi.config.wtbox(), "?pid=" + s.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                        formData: {
                            target: "prj",
                            type: "task",
                            pid: s.pid,
                            tid: s.tid
                        },
                        addCallback: function () {
                            e.js_close()
                        }
                    }, e.js_to_upload_files = function (e) {
                        $(e.target).next("input[type=file]").click()
                    }
                }
            ],
            resolve: {
                pop_data: function () {
                    return {
                        scope: $scope,
                        entries: $scope.entries,
                        entry: a
                    }
                }
            }
        }), h.open().then(function () {
            p = 0, f = false, m = null
        }), void 0)
    }, $scope.js_show_project_tasks_filter = function() {
    	$scope.filter_turn_on || $scope.$broadcast(kzi.constant.event_names.show_project_tasks_filter),
    	$scope.current_filter_type = ""
    }, $scope.js_show_project_workflow = function() {
    	$scope.filter_turn_on || $scope.$broadcast(kzi.constant.event_names.show_project_workflow),
    	$scope.current_filter_type = ""
    }, $scope.js_open_task_detail = function (e, t) {
        $rootScope.locator.to_task(t.pid, t.tid, false)
    }, $scope.js_show_assign_me_tasks = function () {
        P(), "assign_me" == $scope.current_filter_type ? (T(null), $scope.filter_turn_on = false, $scope.current_filter_type = null) : ($scope.current_filter_type = "assign_me", $scope.filter_turn_on = true, T($rootScope.global.me))
    }, $scope.js_show_my_watch_tasks = function () {
        P(), "my_watch" === $scope.current_filter_type ? (z(null), $scope.filter_turn_on = false, $scope.current_filter_type = null) : ($scope.current_filter_type = "my_watch", $scope.filter_turn_on = true, z($rootScope.global.me))
    }, $scope.js_show_my_create_tasks = function () {
        P(), "my_create" === $scope.current_filter_type ? (M(null), $scope.filter_turn_on = false, $scope.current_filter_type = null) : ($scope.current_filter_type = "my_create", $scope.filter_turn_on = true, M($rootScope.global.me))
    }, $scope.js_filter_pop = function (t) {
        $scope.current_filter_type = null, $popbox.popbox({
            target: t,
            templateUrl: "/view/project/task/pop_task_filter.html",
            controller: ["$scope", "popbox", "pop_data",
                function (e, t) {
                    e.popbox = t, $rootScope.load_project_members(c, function (t) {
                        _.isEmpty(t.members) || (e.members = wt.bus.member.get_normal_members(t.members)), _.isEmpty(t.info.labels) || (e.labels = _.filter(t.info.labels, function (e) {
                            return "" !== e.desc
                        }))
                    }), e.task_filters = C, C.texts.length > 0 && (e.task_filter_text = C.texts.toString()), e.js_filter_label = function (e) {
                        -1 === _.indexOf(C.labels, e) ? C.labels.push(e) : C.labels.splice(_.indexOf(C.labels, e), 1), D()
                    }, e.js_filter_member = function (e) {
                        -1 === _.indexOf(C.members, e) ? C.members.push(e) : C.members.splice(_.indexOf(C.members, e), 1), D()
                    }, e.js_filter_date = function (e) {
                        C.date = C.date === e ? "" : e, D()
                    }, e.$watch("task_filter_text", function (t, i) {
                        if (_.isEmpty(t)) e.task_filters.texts = [];
                        else {
                            var n = t.toLowerCase().replace("，", ",").replace("　", ",").replace(" ", ",").replace("  ", ",");
                            e.task_filters.texts = n.split(",")
                        }
                        t !== i && D()
                    }), e.js_clear = function () {
                        e.filter_texts = [], e.filter_labels = [], e.filter_members = [], e.filter_date = "", e.task_filter_text = "", P()
                    }, e.js_close = function () {
                        t.close()
                    }
                }
            ],
            resolve: {
                pop_data: function () {
                    return {
                        scope: $scope
                    }
                }
            }
        }).open()
    }, $scope.js_show_more_menu = function (t) {
        $popbox.popbox({
            target: t,
            templateUrl: "/view/project/task/pop_entry_menu.html",
            controller: ["$scope", "popbox", "pop_data",
                function (e, t, n) {
                    e.popbox = t, e.email = c + kzi.constant.mail.domain, e.step = 0, e.js_step = function (t) {
                        e.step = t, 4 === t && _.each(kzi.constant.labels, function (t) {
                            var i = _.findWhere(n.scope.project.info.labels, {
                                name: t.name
                            });
                            i && (e[t.name] = i.desc)
                        })
                    }, e.js_set_lables = function (i, a, s, o, r, l) {
                        var u = [
                            {
                                name: "blue",
                                desc: i
                            },
                            {
                                name: "green",
                                desc: a
                            },
                            {
                                name: "orange",
                                desc: s
                            },
                            {
                                name: "purple",
                                desc: o
                            },
                            {
                                name: "red",
                                desc: r
                            },
                            {
                                name: "yellow",
                                desc: l
                            }
                        ];
                        e.is_save_ing = true, wt.data.project.set_labels(c, u, function () {
                            n.scope.project.info.labels = u, t.close()
                        }, null, function () {
                            e.is_save_ing = false
                        })
                    }, e.js_close = function () {
                        t.close()
                    }, e.js_prefs_auto_archived = function () {
                        var t = 1;
                        t = 1 == $rootScope.project.info.auto_archived ? 0 : 1, $rootScope.project.info.auto_archived = t, wt.data.project.set_prefs(c, "auto_archived", t), e.step = 0
                    }, e.js_archive_all_entry = function () {
                        wt.data.entry.archive_all(c, function (t) {
                            e.entries = _.reject(e.entries, function (e) {
                                return _.contains(t.data, e.entry_id)
                            })
                        })
                    }, e.js_archived_all = function () {
                        _.each(n.scope.entries, function (e) {
                            e.tasks = _.reject(e.tasks, function (e) {
                                return 1 == e.completed
                            })
                        }), $rootScope.project.tasks = _.reject($rootScope.project.tasks, function (e) {
                            return 1 == e.completed
                        }), wt.data.task.archived_all(c, "all", function () {
                        }), t.close()
                    }
                }
            ],
            resolve: {
                pop_data: function () {
                    return {
                        scope: $scope
                    }
                }
            }
        }).open()
    }, $scope.js_open_add_task_composer = function (e, t) {
        this.entry.entry_id, this.task_name = "", t.task_bottom_enabled = true, t.task_bottom_focus = true
    }, $scope.js_cancel = function (e, t) {
        e.task_bottom_enabled = false, e.task_top_enabled = false, t && O()
    }, $scope.js_complete_task = function (e, t) {
        e.stopPropagation();
        if (t.completed == -1 || t.completed == 1) {
        	wt.data.task.start(t.pid, t.tid,
            function(response){
                kzi.msg.success("活动进入交易流程，请在交易墙跟踪开发！");
                t.entry_id=t.pid+"-step_one";
        		$rootScope.$broadcast(kzi.constant.event_names.on_task_start, t);
            },
            function(){

            },
            function(){

            });
        } else if (t.completed == 0) {
        	wt.data.task.complete(t.pid, t.tid,
                    function(response){
                        kzi.msg.success("活动交易完成，退出交易流程.");
                		$rootScope.$broadcast(kzi.constant.event_names.on_task_complete, t);
                        t.entry_id="0";

                    },
                    function(){

                    },
                    function(){

                    });
        }
    }, $scope.js_show_member = function (t, a, s) {
        $scope.permission == kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.stopPropagation(), $popbox.popbox({
            target: t,
            templateUrl: "/view/project/task/pop_task_member.html",
            controller: ["$scope", "popbox",
                function (e, t) {
                    e.popbox = t, e.member = s, e.js_close = function () {
                        t.close()
                    }, e.js_remove_member = function () {
                        var e = _.findWhere(a.members, {
                            uid: s.uid
                        });
                        e && (a.members = _.reject(a.members, function (e) {
                            return e.uid === s.uid
                        })), s.assigned = 0, _.isEmpty(a.tid) || wt.data.task.unassign(c, a.tid, s.uid, function () {
                        }), t.close()
                    }
                }
            ]
        }).open())
    }, $scope.$on(kzi.constant.event_names.on_task_trash, function (t, i) {
        if (i) {
            var n = _.findWhere($scope.entries, {
                entry_id: i.entry_id
            });
            n && (n.tasks = _.reject(n.tasks, function (e) {
                return e.tid == i.tid
            }))
        }
    }),$rootScope.$on(kzi.constant.event_names.on_task_complete, function (t, i) {
    	$rootScope.reload_entries($rootScope.pid);
    }),$rootScope.$on(kzi.constant.event_names.on_task_start, function (t, i) {
    	$rootScope.reload_entries($rootScope.pid);
    }), $scope.$on(kzi.constant.event_names.on_task_move, function (t, i, n) {
        if (i) {
            var a = _.findWhere($scope.entries, {
                entry_id: n
            });
            a && (a.tasks = _.reject(a.tasks, function (e) {
                return e.tid == i.tid
            }));
            var s = _.findWhere($scope.entries, {
                entry_id: i.entry_id
            });
            s && (s.tasks= s.tasks||[],s.tasks.unshift(i))
        }
    }), $scope.$on(kzi.constant.event_names.on_right_menu, function (t, n) {
        if ($scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest) {
            var a = kzi.helper.mouse_position(n),
                s = null,
                o = null;
            if ($(n.target).hasClass("task") ? s = $(n.target).attr("task-id") : $(n.target).parents(".task").length > 0 ? s = $(n.target).parents(".task").attr("task-id") : $(n.target).parents(".entry").length > 0 && (o = $(n.target).parents(".entry").attr("entry-id")), s) {
                var r = _.findWhere($scope.project.tasks, {
                        tid: s
                    }),
                    o = r.entry_id,
                    l = _.findWhere($scope.entries, {
                        entry_id: o
                    });
                $scope.js_show_task_menu(n, l, r, a.y, a.x)
            } else {
                var l = _.findWhere($scope.entries, {
                    entry_id: o
                });
                $scope.js_show_entry_menu(n, l, a.y, a.x)
            }
        }
    })
    $scope.js_import = function () {

    }
}]);