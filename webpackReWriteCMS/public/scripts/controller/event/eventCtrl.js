'use strict';
innerApp.controller("entity_event_ctrl", ["$scope", "$element", "$routeParams", "$rootScope", "$location", "$popbox", function (e, t, i, n, a, s) {
    var r, o;
    e.pid = "", e.token = kzi.get_cookie("sid"), e.event = {}, e.temp_event = {}, e.eventTitleInputFocus = !1, e.repeat_intervals = kzi.constant.event_repeat_intervals, e.update = {}, e.update.options_for_recurring_event = [
        {
            key: kzi.constant.event_update_type.one,
            desc: "只应用于当前日程"
        },
        {
            key: kzi.constant.event_update_type.follow_up,
            desc: "应用于当前和之后所有日程"
        }
    ], e.update.option = e.update.options_for_recurring_event[1];
    var l = function () {
            e.temp_event = {
                event_id: e.event.event_id,
                name: e.event.name,
                summary: e.event.summary,
                location: e.event.location,
                start_date: moment(e.event.start.date).format("YYYY-MM-DD"),
                end_date: moment(e.event.end.date).format("YYYY-MM-DD"),
                start_hour: moment(e.event.start.date).format("HH"),
                start_minute: moment(e.event.start.date).format("mm"),
                end_hour: moment(e.event.end.date).format("HH"),
                end_minute: moment(e.event.end.date).format("mm")
            }
        },
        c = function () {
            e.temp_event = {}
        },
        d = function () {
            e.event.show_start_date = kzi.util.datetimeToDTW(e.event.start.date), e.event.show_end_date = kzi.util.datetimeToDTW(e.event.end.date)
        };
    e.$on(kzi.constant.event_names.on_slide_hide, function () {
        n.locator.type === kzi.constant.entity_type.event && (e.$broadcast(kzi.constant.event_names.clear_comment_activity, {
            pid: r,
            xid: o,
            xtype: kzi.constant.xtype.event
        }), e.event = e.event.is_edit ? {
            is_edit: e.event.is_edit,
            event_id: e.event.event_id
        } : {})
    }), e.$on(kzi.constant.event_names.load_entity_event, function (t, i) {
        _.isEmpty(i.pid) || _.isEmpty(i.event_id) || (r = e.pid = i.pid, o = i.event_id, e.temp_event.event_id !== i.event_id && (e.temp_event.name = ""), e.section_loading_done = !1, n.load_event_new(r, o, function (t, a) {
            e.project = t, e.event && e.event.is_edit && e.event.event_id === a.event_id && (a.is_edit = e.event.is_edit), e.event = a, e.new_repeat_interval = _.findWhere(e.repeat_intervals, {
                key: e.event.recurrence
            }), e.section_loading_done = !0, e.entity_permission = t.info.permission || 31, n.global.prj_module.view & e.entity_permission && a.is_deleted && (e.entity_permission = kzi.constant.prj_permission.viewer), d(), e.set_pop_attendee_options(), e.$broadcast(kzi.constant.event_names.select_comment_tab, {
                pid: r,
                xid: o,
                xtype: kzi.constant.xtype.event,
                comment_id: i.comment_id
            }), e.event.is_edit === !0 && (e.eventTitleInputFocus = !0)
        }, function (t) {
            e.section_loading_done = !0, t.code === kzi.statuses.event_error.not_found.code ? (e.entity_not_found_msg = "你访问的日程不存在或者被彻底删除。", e.entity_permission = kzi.constant.prj_permission.deny) : t.code === kzi.statuses.error.permission_deny.code ? e.entity_permission = kzi.constant.prj_permission.deny : (e.entity_permission = kzi.constant.prj_permission.deny, wt.data.error(i))
        }))
    }), e.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
        n.locator.type !== kzi.constant.entity_type.event || _.isEmpty(e.event) || (e.event.is_edit ? e.js_cancel_editor(e.event) : e.js_show_editor(e.event))
    }), e.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
        n.locator.type === kzi.constant.entity_type.event && (_.isEmpty(e.event) || e.event.is_edit !== !0 ? n.locator.show_slide === !0 && n.locator.hide_slide() : e.js_cancel_editor(e.event))
    }), e.js_show_trash = function (t, i) {
        s.popbox({
            target: t,
            templateUrl: "/view/project/event/pop_delete_event.html",
            controller: ["$scope", "popbox", "pop_data", function (e, t) {
                e.popbox = t, e.is_repeat_event = 0 !== i.recurrence, e.del = {}, e.del.del_option = 1, e.js_close = function () {
                    t.close()
                }, e.js_delete_event = function () {
                    e.is_deleting = !0, wt.data.event.trash(r, i.event_id, e.del.del_option, function (a) {
                        n.locator.hide_slide(), i.is_deleted = 1;
                        var s = _.findWhere(n.projects, {
                            pid: i.pid
                        });
                        s && (s.is_calendar = a.data.is_calendar), n.$broadcast(kzi.constant.event_names.on_event_trash, i, e.del.del_option), t.close()
                    }, null, function () {
                        e.is_deleting = !1
                    })
                }
            }],
            resolve: {
                pop_data: function () {
                    return {
                        scope: e
                    }
                }
            }
        }).open()
    };
    var u = function () {
        var t = e.temp_event.start_date,
            i = e.temp_event.start_minute,
            n = e.temp_event.start_hour;
        t >= e.temp_event.end_date ? (e.temp_event.end_date = e.temp_event.start_date, e.temp_event.start_hour >= e.temp_event.end_hour ? (e.temp_event.end_hour = e.temp_event.start_hour, e.temp_event.start_minute >= e.temp_event.end_minute && (e.temp_event.end_minute = e.temp_event.start_minute), e.end_minute_sections = _.filter(kzi.constant.all_minute_sections, function (e) {
            return e >= i
        }), e.end_hour_sections = _.filter(kzi.constant.all_hour_sections, function (e) {
            return e >= n
        })) : (e.end_hour_sections = _.filter(kzi.constant.all_hour_sections, function (e) {
            return e >= n
        }), e.end_minute_sections = kzi.constant.all_minute_sections)) : (e.end_hour_sections = kzi.constant.all_hour_sections, e.end_minute_sections = kzi.constant.all_minute_sections)
    };
    e.start_date_options = {
        default_date: moment(e.temp_event.start_date).format("YYYY-MM-DD"),
        set_date: function (t) {
            e.temp_event.start_date = moment(t).format("YYYY-MM-DD"), e.start_date_options.default_date = e.temp_event.start_date, e.end_date_options.min_date = moment(e.temp_event.start_date).format("YYYY-MM-DD")
        }
    }, e.end_date_options = {
        default_date: moment(e.temp_event.end_date).format("YYYY-MM-DD"),
        min_date: moment(e.temp_event.start_date).format("YYYY-MM-DD"),
        set_date: function (t) {
            e.temp_event.end_date = moment(t).format("YYYY-MM-DD"), e.end_date_options.default_date = e.temp_event.end_date, u()
        }
    }, e.start_hour_sections = kzi.constant.all_hour_sections, e.start_minute_sections = kzi.constant.all_minute_sections, e.$watch("[temp_event.start_date,temp_event.start_hour,temp_event.start_minute]", function () {
        u(), e.start_date_options.default_date = moment(e.temp_event.start_date).format("YYYY-MM-DD"), e.end_date_options.default_date = moment(e.temp_event.end_date).format("YYYY-MM-DD"), e.end_date_options.min_date = moment(e.temp_event.start_date).format("YYYY-MM-DD")
    }, !0), e.$watch("temp_event.end_hour", function () {
        u()
    }, !0), e.js_show_editor = function (t) {
        n.global.prj_module.crud & e.entity_permission && (t.is_edit = !0, _.isEmpty(e.temp_event.name) && l(), e.eventTitleInputFocus = !0)
    }, e.js_cancel_editor = function (e) {
        e.is_edit = !1, c()
    }, e.js_set_update = function (t, i, a) {
        if (i.is_saving !== !0) {
            if (_.isEmpty(a.name)) return a.name = i.name, void 0;
            i.is_saving = !0;
            wt.data.event.update(r, i.event_id, a.name,
                a.summary, a.location, a.start_date,
                    a.start_hour + ":" + a.start_minute,
                a.end_date, a.end_hour + ":" + a.end_minute,
                e.update.option.key,
                function () {
                    i.is_edit = !1, i.name = a.name, i.summary = a.summary, i.location = a.location, i.start.date = a.start_date + " " + a.start_hour + ":" + a.start_minute, i.end.date = a.end_date + " " + a.end_hour + ":" + a.end_minute, c(), n.$broadcast(kzi.constant.event_names.on_event_update, i, e.update.option.key), d()
                }, null, function () {
                    i.is_saving = !1
                })
        }
    }, e.js_toggle_member = function (e, t, i) {
        t.setting_toggle_member !== !0 && (t.setting_toggle_member = !0, wt.bus.member.set_event_attendees_toggle(r, i, t, function () {
            n.$broadcast(kzi.constant.event_names.on_event_update, i)
        }, null, function () {
            t.setting_toggle_member = !1
        }))
    }, e.js_attendee_all = function (e, t, i, n) {
        wt.bus.member.event_attend_all(r, i, t, null, null, n)
    }, e.set_pop_attendee_options = function () {
        e.pop_attendee_options = n.global.prj_module.crud & e.entity_permission ? [
            {
                name: "移除",
                ongoing: "移除中...",
                click: function (t, i, a, s) {
                    a.assigned = !0, wt.bus.member.set_event_attendees_toggle(r, e.event, a, function () {
                        a.assigned = !1, n.$broadcast(kzi.constant.event_names.on_event_update, e.event)
                    }, null, function () {
                        a.setting_toggle_member = !1, s()
                    })
                }
            }
        ] : null
    }, e.js_trigger_upload = function (e) {
        $(e.target).parents(".btn-group").eq(0).find("input[type=file]").click()
    }, e.$watch("event", function (t) {
        t && !_.isEmpty(t) && (e.file_upload_option = {
            url: [kzi.config.box_url(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
            formData: {
                target: "prj",
                type: "event",
                pid: t.pid,
                event_id: t.event_id
            }
        }, e.file_upload_option_comment = {
            url: [kzi.config.box_url(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
            formData: {
                target: "prj",
                type: "comment",
                pid: t.pid,
                event_id: t.event_id,
                successCallback: function (e) {
                    var t = angular.element(".comment-list:visible").scope().comment;
                    _.isEmpty(t.files) && (t.files = []), e.data.icon = kzi.helper.build_file_icon(e.data), t.files.push(_.omit(e.data, "watchers"))
                }
            }
        }, e.dragfile_option = {
            upload_option: e.file_upload_option
        }, e.pastefile_option_comment = {
            upload_option: e.file_upload_option_comment
        }, e.uploadlink_option = {
            url: [kzi.config.box_url(), "uploadbylink", "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
            formData: e.file_upload_option.formData
        }, e.global_fileupload_queue = function () {
            return n.upload_queue.get_event(t.pid, t.event_id)
        }, e.global_fileupload_queue_comment = function () {
            return n.upload_queue.get_comment_event(t.pid, t.event_id)
        })
    }), e.$on(kzi.constant.event_names.on_pastefile_to_event, function (t, i, n) {
        var a = {
            type: 2,
            ext: 2
        };
        n.icon = kzi.constant.get_file_icon(a), n.name = "[" + wt.me.display_name + "]" + moment().format("YYYY-MM-DD hh:mm:ss a") + "-粘贴上传.png", $("#global_file_upload").fileupload("add", {
            url: e.file_upload_option.url,
            formData: e.file_upload_option.formData,
            files: n
        })
    }), e.js_uploadbylink_uploading = !1, e.js_uploadbylink = function (t) {
        if (_.isEmpty(e.uploadlink_url) || !kzi.validator.isUrl(e.uploadlink_url)) return kzi.msg.warn("链接错误，请检查链接有效性"), $(t.target).prev().focus(), void 0;
        e.js_uploadbylink_uploading = !0;
        var i = _.extend({
            link: escape(e.uploadlink_url)
        }, e.uploadlink_option.formData);
        wt.data.file.uploadlink(e.uploadlink_option.url, i, function (i) {
            8100 == i.code && kzi.msg.warn("链接上传失败，链接文件太大"), 200 == i.code && n.file_new_upload(i, function () {
                e.uploadlink_url = "", $(t.target).parents(".open").removeClass("open"), kzi.msg.info("链接文件上传成功")
            })
        }, function () {
            kzi.msg.warn("链接上传失败，请检查链接有效性")
        }, function () {
            e.js_uploadbylink_uploading = !1
        })
    }, e.$on(kzi.constant.event_names.on_file_add, function (t, i) {
        i && "event" === i.type && e.event.event_id === i.file.formData.event_id && (_.isArray(e.event.files) ? e.event.files.push(i.file) : e.event.files = [i.file])
    }), e.js_goto_file = function (e, t) {
        var a = i.pid;
        _.isEmpty(a) ? n.locator.to_file(e, t, !0) : n.locator.to_file(e, t, !1)
    }, e.js_del_attachment = function (t, i) {
        var n = _.findWhere(e.event.files, {
            fid: i.fid
        });
        n && (e.event.files = _.reject(e.event.files, function (e) {
            return e.fid === i.fid
        })), wt.data.file.detach(r, kzi.constant.xtype.event, e.event.event_id, i.fid)
    }, e.js_close = function () {
        n.locator.show_slide = !1
    }
}]);