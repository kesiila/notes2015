"use strict";
angular.module("wt.bus", ["ngResource"])
    .factory("bus", ["$http",
    function () {
        return {
            common: {
                load_tags: function (e, t) {
                    var i = _.filter(t, function (e) {
                        return "" !== e.tag_id
                    });
                    return _.each(i, function (t) {
                        var i = _.findWhere(e.tags, {
                            tag_id: t.tag_id
                        });
                        t.assigned = i ? 1 : 0
                    }), i
                }
            },
            user: {
                get: function () {
                }
            },
            team: {},
            project: {
                set_star_toggle: function (e, t, i, n) {
                    1 != e.archived && (e.is_star === kzi.constant.star.no ? (e.is_star = kzi.constant.star.yes, wt.data.project.set_prefs(e.pid, "is_star", kzi.constant.star.yes, function (e) {
                        _.isFunction(t) && t(e)
                    }, function () {
                        e.is_star = kzi.constant.star.no
                    }, n)) : (e.is_star = kzi.constant.star.no, wt.data.project.set_prefs(e.pid, "is_star", kzi.constant.star.no, function (i) {
                        e.is_star = kzi.constant.star.no, _.isFunction(t) && t(i)
                    }, function () {
                        e.is_star = kzi.constant.star.yes
                    }, n)))
                },
                calculate_prj_pos: function (e, t) {
                    var i = 0;
                    return i = _.isEmpty(e) && !_.isEmpty(t) ? t.pos / 2 + 1 : _.isEmpty(t) && !_.isEmpty(e) ? e.pos + kzi.config.default_pos + 1 : _.isEmpty(t) || _.isEmpty(e) ? kzi.config.default_pos : (t.pos + e.pos) / 2 + 1
                },
                label: {
                    load: function (e, t) {
                        var i = _.filter(t, function (e) {
                            return "" !== e.desc
                        });
                        return _.each(i, function (t) {
                            var i = _.findWhere(e.labels, {
                                name: t.name
                            });
                            t.assigned = i ? 1 : 0
                        }), i
                    },
                    set_labels: function (e, t, i, n, a, s, o, r, l, c) {
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
                                desc: n
                            },
                            {
                                name: "purple",
                                desc: a
                            },
                            {
                                name: "red",
                                desc: s
                            },
                            {
                                name: "yellow",
                                desc: o
                            }
                        ];
                        wt.data.project.set_labels(e, u, function () {
                            r(u)
                        }, l, c)
                    }
                },
                entry: {
                    load: function (e, t) {
                        var i = _.filter(t, function (e) {
                            return "" !== e.desc
                        });
                        return _.each(i, function (t) {
                            var i = _.findWhere(e.entries, {
                                name: t.name
                            });
                            t.assigned = i ? 1 : 0
                        }), i
                    },
                    set_labels: function (e, t, i, n, a, s, o, r, l, c) {
                        var u = [
                            {
                                name: "step_one",
                                desc: t
                            },
                            {
                                name: "step_two",
                                desc: i
                            },
                            {
                                name: "step_three",
                                desc: n
                            },
                            {
                                name: "step_four",
                                desc: a
                            },
                            {
                                name: "step_five",
                                desc: s
                            },
                            {
                                name: "step_six",
                                desc: o
                            }
                        ];
                        wt.data.project.set_entries(e, u, function () {
                            r(u)
                        }, l, c)
                    }
                },
                get_member_projects: function (e) {
                    var t = [];
                    return _.each(e, function (e) {
                        e.curr_role !== kzi.constant.role.guest && t.push(e)
                    }), t
                }
            },
            entry: {
                calculate_copy_entry_pos: function (e, t) {
                    for (var i = 0; e.length > i; i++)
                        if (e[i].entry_id === t.entry_id) {
                            if (e.length > i + 1) {
                                var n = e[i + 1].pos;
                                return (n + t.pos) / 2 + 1
                            }
                            return t.pos + kzi.config.default_pos + 1
                        }
                    return t.pos + kzi.config.default_pos + 1
                },
                calculate_entry_pos: function (e, t) {
                    var i = kzi.config.default_pos;
                    if (!_.isEmpty(e))
                        if (t) {
                            var n = _.min(e, function (e) {
                                return e.pos
                            });
                            _.isEmpty(n) || (i = n.pos / 2 + 1)
                        } else {
                            var a = _.max(e, function (e) {
                                return e.pos
                            });
                            _.isEmpty(a) || (i = a.pos + kzi.config.default_pos + 1)
                        }
                    return i
                },
                batch_assign_member: function (e, t, i, n, a, s) {
                    wt.data.entry.batch_assign(e, t.entry_id, i.uid, function (e) {
                        i.assigned_all = 1, _.each(t.tasks, function (e) {
                            if (_.isEmpty(e.members)) e.members = [i];
                            else {
                                var t = _.any(e.members, function (e) {
                                    return e.uid == i.uid
                                });
                                t || e.members.push(i)
                            }
                        }), _.isFunction(n) && n(e)
                    }, a, s)
                },
                batch_set_label: function (e, t, i, n, a, s) {
                    wt.data.entry.batch_set_label(e, t.entry_id, i.name, function (e) {
                        _.each(t.tasks, function (e) {
                            if (_.isEmpty(e.labels)) e.labels = [i];
                            else {
                                var t = _.any(e.labels, function (e) {
                                    return e.name == i.name
                                });
                                t || e.labels.push(i)
                            }
                        }), _.isFunction(n) && n(e)
                    }, a, s)
                }
            },
            task: {
                load_tags: function (e, t) {
                    var i = _.filter(t, function (e) {
                        return "" !== e.tag_id
                    });
                    return _.each(i, function (t) {
                        var i = _.findWhere(e.tags, {
                            tag_id: t.tag_id
                        });
                        t.assigned = i ? 1 : 0
                    }), i
                },
                load_projects: function (e, t) {
                    var i = _.filter(t, function (e) {
                        return "" !== e.pid
                    });
                    return _.each(i, function (t) {
                        var i = _.findWhere(e.projects, {
                            pid: t.pid
                        });
                        t.assigned = i ? 1 : 0
                    }), i
                },
                calculate_task_pos: function (e, t) {
                    var i = kzi.config.default_pos;
                    return t ? _.isEmpty(e.tasks) || (i = _.min(e.tasks, function (e) {
                        return e.pos
                    }).pos / 2 + 1) : _.isEmpty(e.tasks) || (i = _.max(e.tasks, function (e) {
                        return e.pos
                    }).pos + kzi.config.default_pos + 1), i
                },
                calculate_copy_task_pos: function (e, t) {
                    for (var i = 0; e.tasks.length > i; i++)
                        if (e.tasks[i].tid === t.tid) {
                            if (e.tasks.length > i + 1) {
                                var n = e.tasks[i + 1].pos;
                                return (n + t.pos) / 2 + 1
                            }
                            return t.pos + kzi.config.default_pos + 1
                        }
                    return t.pos + kzi.config.default_pos + 1
                },
                set_toggle_label: function (e, t, i) {
                    if (i.assigned) {
                        var n = _.findWhere(t.labels, {
                            name: i.name
                        });
                        n && (t.labels = _.reject(t.labels, function (e) {
                            return e.name === i.name
                        })), i.assigned = 0, _.isEmpty(t.tid) || wt.data.task.del_labels(e, t.tid, i.name, function () {
                        })
                    } else {
                        var n = _.findWhere(t.labels, {
                            name: i.name
                        });
                        n || (t.labels.push(i), i.assigned = 1, _.isEmpty(t.tid) || wt.data.task.set_labels(e, t.tid, i.name, function () {
                        }))
                    }
                },
                get_copy_task: function (e) {
                    var t = {
                        name: e.name,
                        tid: e.tid,
                        entry_id: e.entry_id,
                        pos: e.pos,
                        comment_count: e.badges.comment_count,
                        file_count: e.badges.file_count,
                        todo_count: e.badges.todo_count,
                        member_count: e.members.length,
                        watcher_count: e.watchers.length,
                        label_count: e.labels.length
                    }, i = !1;
                    return t.comment_count > 0 ? (t.keep_comments = !0, i = !0) : t.keep_comments = !1, t.file_count > 0 ? (t.keep_attachments = !0, i = !0) : t.keep_attachments = !1, t.todo_count > 0 ? (t.keep_todos = !0, i = !0) : t.keep_todos = !1, t.member_count > 0 ? (t.keep_members = !0, i = !0) : t.keep_members = !1, t.watcher_count > 0 ? (t.keep_watchers = !0, i = !0) : t.keep_watchers = !1, t.label_count > 0 ? (t.keep_labels = !0, i = !0) : t.keep_labels = !1, t.show_keeps = i, t
                },
                set_is_show_data: function (e, t) {
                    return _.each(e, function (e) {
                        var i = moment(e.update_date).format("YYYY-MM-DD");
                        i === t ? e.is_show_date = !1 : (e.is_show_date = !0, t = i)
                    }), t
                }
            },
            file: {},
            event: {
                event_to_calEvent: function (e, t) {
                    var i = {
                        id: e.event_id,
                        title: e.name,
                        allDay: 0,
                        start: e.start.date.toString().substring(0, 10),
                        end: e.end.date.toString().substring(0, 10),
                        url: "",
                        editable: !0,
                        textColor: "#fff",
                        borderColor: "#fbfbfb",
                        className: "cal_event slide-trigger",
                        backgroundColor: t,
                        extend: {
                            xtype: kzi.constant.xtype.event,
                            pid: e.pid,
                            end: e.end.date
                        }
                    };
                    return i
                }
            },
            comment: {},
            calendar: {},
            post: {
                set_scope_watcher_members: function (e, t, i) {
                    if (_.isEmpty(e.members)) {
                        var n = [],
                            a = _.pluck(i, "uid");
                        _.each(t, function (e) {
                            e.status === kzi.constant.status.ok && (e.watched = _.contains(a, e.uid) ? !0 : !1, n.push(e))
                        }), e.members = n
                    }
                },
                toggle_watcher_member: function (e, t, i) {
                    e.watched ? (e.watched = !1, _.isEmpty(t.post_id) ? t.watchers = _.reject(t.watchers, function (t) {
                        return t.uid === e.uid
                    }) : wt.data.unwatch(i, kzi.constant.xtype.post, t.post_id, e.uid, function () {
                        t.watchers = _.reject(t.watchers, function (t) {
                            return t.uid === e.uid
                        })
                    })) : _.isEmpty(t.post_id) ? (e.watched = !0, t.watchers.push(e)) : wt.data.watch(i, kzi.constant.xtype.post, t.post_id, e.uid, function () {
                        e.watched = !0, t.watchers.push(e)
                    })
                },
                watch_all_members: function (e, t, i, n, a, s) {
                    if (t.watchers.length !== e.length)
                        if (_.isEmpty(t.post_id)) _.each(e, function (e) {
                            e.watched = !0
                        }), t.watchers = e, _.isFunction(n) && n(), _.isFunction(s) && s();
                        else {
                            var o = _.pluck(e, "uid");
                            wt.data.watch_batch(i, kzi.constant.xtype.post, t.post_id, o, function () {
                                t.watchers = e, _.isFunction(n) && n()
                            }, a, s)
                        }
                }
            },
            template: {
                set_task_template_toggle: function (e, t, i, n, a, s) {
                    if (i.assigned) {
                        var o = _.findWhere(t.templates, {
                            template_id: i.template_id
                        });
                        if (_.isEmpty(t.tid)) return i.assigned = 0, o && (t.templates = _.reject(t.templates, function (e) {
                            return e.template_id === i.template_id
                        })), void 0;
                        wt.data.task.del_templates(e, t.tid, i.template_id, function (e) {
                            o && (t.templates = _.reject(t.templates, function (e) {
                                return e.template_id === i.template_id
                            })), i.assigned = 0, _.isFunction(n) && n(e)
                        }, a, s)
                    } else {
                        var o = _.findWhere(t.templates, {
                            template_id: i.template_id
                        });
                        if (_.isEmpty(t.tid)) return i.assigned = 1, o || t.templates.push(i), void 0;
                        o || wt.data.task.set_templates(e, t.tid, i.template_id, function (e) {
                            o = _.findWhere(t.templates, {
                                template_id: i.template_id
                            }), o || (t.templates = [], t.templates.push(i), i.assigned = 1, _.isFunction(n) && n(e))
                        }, a, s)
                    }
                },
                set_scope_watcher_members: function (e, t, i) {
                    if (_.isEmpty(e.members)) {
                        var n = [],
                            a = _.pluck(i, "uid");
                        _.each(t, function (e) {
                            e.status === kzi.constant.status.ok && (e.watched = _.contains(a, e.uid) ? !0 : !1, n.push(e))
                        }), e.members = n
                    }
                },
                toggle_watcher_member: function (e, t, i) {
                    e.watched ? (e.watched = !1, _.isEmpty(t.template_id) ? t.watchers = _.reject(t.watchers, function (t) {
                        return t.uid === e.uid
                    }) : wt.data.unwatch(i, kzi.constant.xtype.template, t.template_id, e.uid, function () {
                        t.watchers = _.reject(t.watchers, function (t) {
                            return t.uid === e.uid
                        })
                    })) : _.isEmpty(t.template_id) ? (e.watched = !0, t.watchers.push(e)) : wt.data.watch(i, kzi.constant.xtype.template, t.template_id, e.uid, function () {
                        e.watched = !0, t.watchers.push(e)
                    })
                },
                watch_all_members: function (e, t, i, n, a, s) {
                    if (t.watchers.length !== e.length)
                        if (_.isEmpty(t.template_id)) _.each(e, function (e) {
                            e.watched = !0
                        }), t.watchers = e, _.isFunction(n) && n(), _.isFunction(s) && s();
                        else {
                            var o = _.pluck(e, "uid");
                            wt.data.watch_batch(i, kzi.constant.xtype.template, t.template_id, o, function () {
                                t.watchers = e, _.isFunction(n) && n()
                            }, a, s)
                        }
                }
            },
            mail: {
                selected_customers: [],
                set_scope_watcher_members: function (e, t, i) {
                    if (_.isEmpty(e.members)) {
                        var n = [],
                            a = _.pluck(i, "uid");
                        _.each(t, function (e) {
                            e.status === kzi.constant.status.ok && (e.watched = _.contains(a, e.uid) ? !0 : !1, n.push(e))
                        }), e.members = n
                    }
                },
                set_scope_task_members: function (e, t, i) {
                    if (_.isEmpty(e.tasks)) {
                        var n = [],
                            a = _.pluck(i, "tid");
                        _.each(t, function (e) {
                            (e.watched = _.contains(a, e.tid) ? !0 : !1, n.push(e))
                        }), e.tasks = n
                    }
                },
                toggle_watcher_member: function (e, t, i) {
                    e.watched ? (e.watched = !1, _.isEmpty(t.mail_id) ? t.watchers = _.reject(t.watchers, function (t) {
                        return t.uid === e.uid
                    }) : wt.data.unwatch(i, kzi.constant.xtype.mail, t.mail_id, e.uid, function () {
                        t.watchers = _.reject(t.watchers, function (t) {
                            return t.uid === e.uid
                        })
                    })) : _.isEmpty(t.mail_id) ? (e.watched = !0, t.watchers.push(e)) : wt.data.watch(i, kzi.constant.xtype.mail, t.mail_id, e.uid, function () {
                        e.watched = !0, t.watchers.push(e)
                    })
                },
                toggle_task_member: function (e, t, i) {
                    e.watched ? (e.watched = !1, _.isEmpty(t.mail_id) ? t.tasks = _.reject(t.tasks, function (t) {
                        return t.tid === e.tid
                    }) : wt.data.unwatch(i, kzi.constant.xtype.mail, t.mail_id, e.tid, function () {
                        t.tasks = _.reject(t.tasks, function (t) {
                            return t.tid === e.tid
                        })
                    })) : _.isEmpty(t.mail_id) ? (e.watched = !0, t.tasks.push(e)) : wt.data.watch(i, kzi.constant.xtype.mail, t.mail_id, e.tid, function () {
                        e.watched = !0, t.tasks.push(e)
                    });
                },
                watch_alltask_members: function (e, t, i, n, a, s) {
                    if (t.tasks.length !== e.length)
                        if (_.isEmpty(t.mail_id)) _.each(e, function (e) {
                            e.watched = !0
                        }), t.tasks = e, _.isFunction(n) && n(), _.isFunction(s) && s();
                        else {
                            var o = _.pluck(e, "tid");
                            wt.data.watch_batch(i, kzi.constant.xtype.mail, t.mail_id, o, function () {
                                t.tasks = e, _.isFunction(n) && n()
                            }, a, s)
                        }
                },
                watch_all_members: function (e, t, i, n, a, s) {
                    if (t.watchers.length !== e.length)
                        if (_.isEmpty(t.mail_id)) _.each(e, function (e) {
                            e.watched = !0
                        }), t.watchers = e, _.isFunction(n) && n(), _.isFunction(s) && s();
                        else {
                            var o = _.pluck(e, "uid");
                            wt.data.watch_batch(i, kzi.constant.xtype.mail, t.mail_id, o, function () {
                                t.watchers = e, _.isFunction(n) && n()
                            }, a, s)
                        }
                }
            },
            page: {
                toggle_watcher_member: function (e, t, i) {
                    e.watched ? (e.watched = !1, _.isEmpty(t.page_id) ? t.watchers = _.reject(t.watchers, function (t) {
                        return t.uid === e.uid
                    }) : wt.data.unwatch(i, kzi.constant.xtype.page, t.page_id, e.uid, function () {
                        t.watchers = _.reject(t.watchers, function (t) {
                            return t.uid === e.uid
                        })
                    })) : _.isEmpty(t.page_id) ? (e.watched = !0, t.watchers.push(e)) : wt.data.watch(i, kzi.constant.xtype.page, t.page_id, e.uid, function () {
                        e.watched = !0, t.watchers.push(e)
                    })
                },
                watch_all_members: function (e, t, i, n, a, s) {
                    if (t.watchers.length !== e.length)
                        if (_.isEmpty(t.page_id)) _.each(e, function (e) {
                            e.watched = !0
                        }), t.watchers = e, _.isFunction(n) && n(), _.isFunction(s) && s();
                        else {
                            var o = _.pluck(e, "uid");
                            wt.data.watch_batch(i, kzi.constant.xtype.page, t.page_id, o, function () {
                                t.watchers = e, _.each(e, function (e) {
                                    e.watched = !0
                                }), _.isFunction(n) && n()
                            }, a, s)
                        }
                }
            },
            activity: {},
            notice: {},
            invite: {},
            feedback: {},
            watch: {
                get_scope_watcher_members: function (e, t) {
                    var i = [],
                        n = _.pluck(t, "uid");
                    return _.each(e, function (e) {
                        e.status === kzi.constant.status.ok && (e.watched = _.contains(n, e.uid) ? !0 : !1, i.push(e))
                    }), i
                },
                mail_convert_post_watch_toggle: function (e, t, i, n, a, s) {
                    if (!i.watched) {
                        var o = _.findWhere(t.watchers, {
                            uid: i.uid
                        });
                        return i.watched = !0, o || t.watchers.push(i), _.isFunction(n) && n(), _.isFunction(s) && s(), void 0
                    }
                    var o = _.findWhere(t.watchers, {
                        uid: i.uid
                    });
                    i.watched = !1, o && (t.watchers = _.reject(t.watchers, function (e) {
                        return e.uid === i.uid
                    })), _.isFunction(n) && n(), _.isFunction(s) && s()
                },
                unwatch: function (e, t, i, n, a, s, o, r) {
                    wt.data.unwatch(e, i, n, a.uid, function (e) {
                        var i = _.findWhere(t.watchers, {
                            uid: a.uid
                        });
                        i && (t.watchers = _.reject(t.watchers, function (e) {
                            return e.uid === a.uid
                        })), a.is_watch = 0, _.isFunction(s) && s(e)
                    }, o, r)
                }
            },
            member: {
                set_task_member_toggle: function (e, t, i, n, a, s) {
                    if (i.assigned) {
                        var o = _.findWhere(t.members, {
                            uid: i.uid
                        });
                        if (_.isEmpty(t.tid)) return i.assigned = 0, o && (t.members = _.reject(t.members, function (e) {
                            return e.uid === i.uid
                        })), void 0;
                        wt.data.task.unassign(e, t.tid, i.uid, function (e) {
                            o && (t.members = _.reject(t.members, function (e) {
                                return e.uid === i.uid
                            })), i.assigned = 0, _.isFunction(n) && n(e)
                        }, a, s)
                    } else {
                        var o = _.findWhere(t.members, {
                            uid: i.uid
                        });
                        if (_.isEmpty(t.tid)) return i.assigned = 1, o || t.members.push(i), void 0;
                        o || wt.data.task.assign(e, t.tid, i.uid, function (e) {
                            o = _.findWhere(t.members, {
                                uid: i.uid
                            }), o || (t.members.push(i), i.assigned = 1, _.isFunction(n) && n(e))
                        }, a, s)
                    }
                },
                get_normal_members: function (e) {
                    var t = [];
                    return _.each(e, function (e) {
                        e.status === kzi.constant.status.ok && (e.role === kzi.constant.role.admin || e.role === kzi.constant.role.member) && t.push(e)
                    }), t
                },
                set_event_attendees_toggle: function (e, t, i, n, a, s) {
                    if (i.assigned) {
                        var o = _.findWhere(t.attendees, {
                            uid: i.uid
                        });
                        if (_.isEmpty(t.event_id)) return i.assigned = 0, o && (t.attendees = _.reject(t.attendees, function (e) {
                            return e.uid === i.uid
                        })), _.isFunction(n) && n(), _.isFunction(s) && s(), void 0;
                        wt.data.event.attendee_remove(e, t.event_id, i.uid, function (e) {
                            o && (t.attendees = _.reject(t.attendees, function (e) {
                                return e.uid === i.uid
                            })), i.assigned = 0, _.isFunction(n) && n(e)
                        }, a, s)
                    } else {
                        var o = _.findWhere(t.attendees, {
                            uid: i.uid
                        });
                        if (_.isEmpty(t.event_id)) return i.assigned = 1, o || t.attendees.push(i), _.isFunction(n) && n(), _.isFunction(s) && s(), void 0;
                        o || wt.data.event.attendee_add(e, t.event_id, i.uid, function (e) {
                            o = _.findWhere(t.attendees, {
                                uid: i.uid
                            }), o || (t.attendees.push(i), i.assigned = 1, _.isFunction(n) && n(e))
                        }, a, s)
                    }
                }
            },
            chat: {
                set_is_show_data: function (e) {
                    var t = null;
                    _.each(e, function (e) {
                        var i = moment(e.create_date).format("YYYY-MM-DD日");
                        i === t ? e.is_show_date = !1 : (e.is_show_date = !0, t = i)
                    })
                },
                set_message_for_file: function (e, t) {
                    3 == e.body.type && (e.body.content.type = 0, e.body.content.icon = kzi.helper.build_file_icon(e.body.content), e.body.content.pid = t, e.body.content.isImg = -1 == kzi.constant.get_file_icon(e.body.content) ? !0 : !1)
                },
                set_messages_for_file: function (e, t) {
                    _.each(e, function (e) {
                        wt.bus.chat.set_message_for_file(e, t)
                    })
                }
            },
            mail_template: {
                getTemplateCatalog: function (successFunc) {
                    $http.get('/json/templateCatalog.json').success(successFunc);
                },
                getTemplateListByMainCatalog: function (requestOption, successFunc) {
                    var url = apiBaseUrl + '/api/public/template/list';
                    $http.get(url, {
                        'params': requestOption
                    }).success(successFunc)
                },
                getTemplateById: function (templateId, successFunc) {
                    var url = apiBaseUrl + '/api/public/template/get';
                    $http.get(url, {
                        'params': {
                            'templateId': templateId
                        }
                    }).success(successFunc);
                },
                saveTemplate: function (template, successFunc) {
                    var url = apiBaseUrl + '/api/public/template/save';
                    $http.post(url, template).success(successFunc);
                }
            }
        }
    }
]);
