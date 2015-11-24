'use strict';
innerApp.controller('prj_member_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function ($scope, $routeParams, $rootScope, $popbox, $location) {
        var r = $routeParams.pid;
        $rootScope.pid = r, $scope.js_prj_member_pop = function (t, a) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/project/member/pop_user_menu.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t) {
                        e.popbox = t, e.step = 0, e.selected_member = a;
                        var s = 0;
                        _.each(e.project.members, function (e) {
                            e.role == kzi.constant.role.admin && s++;
                        }), e.can_change = a.role == kzi.constant.role.admin && 1 == s ? false : true, e.permission = 1 == e.project.info.archived ? kzi.constant.permission.project_archived : kzi.constant.permission.ok, e.js_step = function (t) {
                            e.step = t;
                        }, e.js_close = function () {
                            t.close();
                        }, e.js_delete_prj_member = function (t) {
                            $rootScope.refresh_cache.user.remove(t.uid), t.uid == $rootScope.global.me.uid && ($rootScope.refresh_cache.project.remove(r), $location.path('dashboard')), wt.data.project.del_member(r, t.uid), e.js_close();
                        };
                        var l = function (t, i) {
                            wt.data.project.set_member_role(r, e.selected_member.uid, t, function (n) {
                                e.selected_member.role = t, _.isFunction(i) && i(n);
                            });
                        };
                        e.js_set_user_as_admin = function () {
                            l(kzi.constant.role.admin, function () {
                                $rootScope.refresh_cache.project.add_admin(r, e.selected_member);
                            });
                        }, e.js_set_user_as_member = function () {
                            var t = e.selected_member.role;
                            l(kzi.constant.role.member, function () {
                                t && $rootScope.refresh_cache.project.remove_admin(r, e.selected_member);
                            });
                        }, e.js_add_user_as_guest = function () {
                            var t = e.selected_member.role;
                            l(kzi.constant.role.guest, function () {
                                t && $rootScope.refresh_cache.project.remove_admin(r, e.selected_member);
                            });
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {$scope: $scope};
                    }
                }
            }).open();
        }, $scope.draggable_options = {
            appendTo: $('#main'),
            helper: 'clone',
            zIndex: 2000,
            delay: 300,
            start: function (e, t) {
                t.helper.find('span.avatar-name').remove(), t.helper.find('span.status').remove(), t.helper.addClass('member-state-on-drag');
            },
            stop: function () {
            },
            drag: function () {
            }
        };
    }
]);

innerApp.controller('prj_info_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$compile',
    '$element',
    function (e, t, i, n) {

        e.js_show_sidebar_project_setting = function () {
            i.js_right_sidebar_toggle();
            if (!i.global.right_sidebar_is_fold) {
                i.$broadcast(kzi.constant.event_names.show_project_setting, !0);
            }
        }
        e.js_view_prj_info = function (t) {
            n.popbox({
                target: t,
                templateUrl: '/view/project/pop_project_info.html',
                controller: [
                    '$rootScope',
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, i) {
                        t.js_close = function () {
                            i.close();
                        };
                        t.js_show_project_setting = function () {
                            e.js_right_sidebar_toggle();
                            e.$broadcast(kzi.constant.event_names.show_project_setting, !0);
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {$scope: e};
                    }
                }
            }).open();
        };
    }
]);

innerApp.controller('prj_sidebar_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    '$timeout',
    '$popbox',
    function (e, t, i, n, a, s) {
        var o = t.pid, r = kzi.localData.get('right_sidebar_is_fold');
        i.global.right_sidebar_is_fold = 0 == r ? false : true,
            e.js_right_sidebar_toggle = function () {
                i.global.right_sidebar_is_fold = !i.global.right_sidebar_is_fold;
                i.global.right_sidebar_is_fold ?
                    kzi.localData.set('right_sidebar_is_fold', 1) :
                    kzi.localData.set('right_sidebar_is_fold', 0);
            }, e.js_change_prj_sidebar_view = function (t) {
            i.global.project_sidebar_view = t, 'chat' === t && e.$broadcast('init_project_chat_list', {});
        }, e.js_add_prj_member_pop = function (t) {
            s.popbox({
                target: t,
                templateUrl: '/view/project/member/pop_add_prj_member.html',
                controller: [
                    '$rootScope',
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, i) {
                        t.popbox = i, t.js_close = function () {
                            i.close();
                        }, t.step = 0, t.js_step = function (e) {
                            t.step = e;
                        };
                        var a = function () {
                            return _.isEmpty(t.show_members) ? (t.group_members = [], void 0) : (t.group_members = _.groupBy(t.show_members, function (e) {
                                return e.group_name;
                            }), void 0);
                        };
                        t.members_loading_done = false, e.load_team_members(e.project.info.team_id, function (i) {
                            t.unassigned_team_members = [], e.load_project(o, function (e) {
                                _.each(i.members, function (n) {
                                    if ('-1' == n.group_id)
                                        n.group_name = '未分组';
                                    else {
                                        var a = _.findWhere(i.groups, {group_id: n.group_id});
                                        n.group_name = null != a ? a.name : '未分组';
                                    }
                                    null == _.findWhere(e.members, {uid: n.uid}) && t.unassigned_team_members.push(n);
                                }), t.show_members = t.unassigned_team_members, t.members_loading_done = true;
                            });
                        }), t.js_add_user_as_admin = function () {
                            t.js_add_prj_member(t.selected_member, kzi.constant.role.admin), t.js_step(0);
                        }, t.js_add_user_as_member = function () {
                            t.js_add_prj_member(t.selected_member), t.js_step(0);
                        }, t.js_add_user_as_guest = function () {
                            t.js_add_prj_member(t.selected_member, kzi.constant.role.guest), t.js_step(0);
                        }, t.js_add_prj_member = function (i, n) {
                            i.assigned || (null == n && (n = kzi.constant.role.member), wt.data.project.add_member(o, i.uid, n, function (n) {
                                e.project.members.push(n.data), t.unassigned_team_members = _.reject(t.unassigned_team_members, function (e) {
                                    return e.uid == i.uid;
                                }), t.show_members = _.reject(t.show_members, function (e) {
                                    return e.uid == i.uid;
                                }), a();
                            }));
                        }, t.js_go_to_set_role = function (e, i) {
                            e.stopPropagation(), e.preventDefault(), t.selected_member = i, t.js_step(1);
                        }, t.js_search_user = function (e) {
                            !_.isEmpty(e) && e.trim().length > 0 ? (e = e.trim().toLowerCase(), t.show_members = _.filter(t.unassigned_team_members, function (t) {
                                return t.name.toLowerCase().indexOf(e) > -1 || t.display_name.toLowerCase().indexOf(e) > -1;
                            })) : t.show_members = t.unassigned_team_members, a();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {$scope: e};
                    }
                }
            }).open();
        }, e.js_view_all_activity = function () {
            i.global.right_isfold = true, n.path('/project/' + o + '/activity');
        };
    }
]);

innerApp.controller("prj_sidebar_new_ctrl", ["$scope", "$routeParams",
    "$rootScope", "$location",
    "$timeout", "$popbox", "$filter",
    function ($scope, $routeParams, $rootScope, $location) {
        var pid = $routeParams.pid;
        $scope.pid = pid;
        $scope.step = 0;
        $scope.bodyOpen = false;
        $scope.add_member_url = "/join" + pid;
        $scope.create_by_mail = pid + kzi.constant.mail.domain;
        $scope.member_inviting = !1;
        $scope.email_validation_error = !1;
        $scope.data = {};
        $scope.data.invite_email = "";
        $scope.prj_colors = kzi.constant.prj_colors;
        $scope.prj_icons = kzi.constant.prj_icons;
        $scope.visibilities = [{
            id: kzi.constant.prj_visibility.private,
            name: "私有项目"
        }, {
            id: kzi.constant.prj_visibility.protected,
            name: "团队可见"
        }, {
            id: kzi.constant.prj_visibility.public,
            name: "公开项目"
        }];
        $scope.data = {};
        $scope.data.transfer_to_tid = void 0;
        $scope.flashing_success = !1;
        $scope.transfer_to_teams = _.filter($rootScope.teams, function (e) {
            return 1 === e.curr_role || "-1" === e.team_id || e.permission & $rootScope.global.team_module.add_project
        });
        $scope.js_change_prj_sidebar_view = function (t) {
            $rootScope.global.project_sidebar_view = t;
            "chat" === t && $scope.$broadcast("init_project_chat_list", {})
        };
        //(1 === t &&
        //($scope.labels_is_set = _.filter($scope.$parent.$parent.project.info.labels, function (e) {
        //    return "" != e.desc
        //}),
        //    $scope.labels_is_filter = $scope.$parent.$parent.task_filters,
        //    $scope.task_filter_text =_.isEmpty($scope.$parent.$parent.task_filters)?"":
        //        ( _.isArray($scope.$parent.$parent.task_filters.texts) ? $scope.$parent.$parent.task_filters.texts.join(" ") : "")
        //    , $rootScope.load_project_members($rootScope.project.info.pid, function (t) {
        //    $scope.assigned_team_members = wt.bus.member.get_normal_members(t.members)
        //})),
        $scope.js_step = function (t, n) {
            n && $(n.target.parentElement).hasClass("disabled") || (1 === t &&
            ($scope.labels_is_set = _.filter($scope.$parent.$parent.project.info.labels, function (e) {
                return "" != e.desc
            }),
                $scope.labels_is_filter = $scope.$parent.$parent.task_filters,
                $scope.task_filter_text =_.isEmpty($scope.$parent.$parent.task_filters)?"":
                    ( _.isArray($scope.$parent.$parent.task_filters.texts) ? $scope.$parent.$parent.task_filters.texts.join(" ") : "")
               ), 2 === t && _.each(kzi.constant.labels, function (t) {
                var i = _.findWhere($scope.$parent.$parent.project.info.labels, {
                    name: t.name
                });
                i && ($scope[t.name] = i.desc)
            }), 9 === t && _.each(kzi.constant.entries, function (t) {
                var i = _.findWhere($scope.$parent.$parent.project.info.entries, {
                    name: t.name
                });
                i && ($scope[t.name] = i.desc)
            }), 6 === t && ($rootScope.global.right_sidebar_is_fold = false, $scope.loading_team_members = !0, -1 == $rootScope.project.info.team_id ? ($scope.loading_team_members = !1, $scope.is_individual_project = !0) : ($scope.is_individual_project = !1, $rootScope.load_team_members($rootScope.project.info.team_id, function (t) {
                $scope.unassigned_team_members = [], $scope.unassigned_team_visitors = [], $rootScope.load_project(pid, !0, function (i) {
                    _.each(t.members, function (t) {
                        _.findWhere(i.members, {
                            uid: t.uid
                        }) || (t.role === kzi.constant.role.guest ? $scope.unassigned_team_visitors.push(t) : $scope.unassigned_team_members.push(t))
                    })
                }), $scope.loading_team_members = !1
            }))), 31 === t && ($scope.project.info.new_name = $scope.project.info.name, $scope.project.info.new_desc = $scope.project.info.desc, $scope.project.info.new_visibility = $scope.project.info.visibility), 32 === t && ($scope.project.info.new_bg = $scope.project.info.bg, $scope.project.info.new_pic = $scope.project.info.pic),
                $scope.step = t)
        };
        $scope.js_goto_prj_setting = function () {
            4 !== $rootScope.project.info.curr_role && $scope.js_step(3)
        };
        $scope.js_label_is_filter = function (t) {
            return   -1 ===_.indexOf($scope.prj_task_filters.labels, t) ? false:true;
            //return -1 !== _.indexOf(_.pluck($scope.labels_is_filter.labels, "name"), t) ? !0 : void 0
        };
        $scope.js_member_is_filter = function (t) {
            return -1 !== _.indexOf(_.pluck($scope.labels_is_filter.members, "uid"), t) ? !0 : void 0
        };
        $scope.js_watch_project = function (e) {
            kzi.msg.error(e + "关注失败, 服务器端无接口.")
        };
        $scope.isMemberFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && (e.role === kzi.constant.role.admin || e.role === kzi.constant.role.member)
            }
        };
        $scope.isGuestFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && e.role == kzi.constant.role.guest
            }
        };
        $scope.isStatusPendingFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.pending
            }
        };
        $scope.js_filter_text = function () {
            var t = {},
                i = $scope.$parent.$parent.task_filters;
            if (_.isEmpty(this.task_filter_text)) i.texts = "", $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, t);
            else {
                var n = this.task_filter_text.toLowerCase().replace("，", ",").replace("　", ",").replace(" ", ",").replace("  ", ",");
                i.texts = n.split(","), $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, t)
            }
        };
        $scope.js_filter_label = function (t) {
            var t = _.pick(t, "desc", "name"),
                i = t.name;
            -1 === _.indexOf($scope.prj_task_filters.labels, i) ? $scope.prj_task_filters.labels.push(i): $scope.prj_task_filters.labels.splice(_.indexOf($scope.prj_task_filters.labels, i), 1);
            //    n = $scope.$parent.$parent.task_filters,
            //    a = _.pluck(n.labels, "name");
            //-1 === _.indexOf(a, i) ? n.labels.push(t) : n.labels.splice(_.indexOf(a, i), 1),
                $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, $scope.prj_task_filters);
        };
        $scope.js_filter_member = function (t) {
            var t = _.pick(t, "uid", "name", "display_name", "desc", "avatar"),
                i = t.uid,
                n = $scope.$parent.$parent.task_filters,
                a = _.pluck(n.members, "uid");
            -1 === _.indexOf(a, i) ? n.members.push(t) : n.members.splice(_.indexOf(a, i), 1), $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        };
        $scope.prj_task_filters= {
            texts: "",
            labels: [],
            zoneCode:"",
            countryCode:"",
            date: "", //这里时间是多长时间内有人预约的课程
            expired_status: "all", /* all, expired, unexpired */
            status: "all", /* all, -1, 0, 1*/
            order_status: "all", /* all, order, unorder*/
            keywords: ""
        };
        $scope.js_filter_expired_status = function (status) {
            if($scope.prj_task_filters.expired_status === status) {
                $scope.prj_task_filters.expired_status = "all";
            } else {
                $scope.prj_task_filters.expired_status = status;
            }
        };
        $scope.js_filter_keywords = function (keywords) {
            $scope.prj_task_filters.keywords = keywords;
        }
        $scope.js_filter_date = function (t) {
            if($scope.prj_task_filters.date==t){
                $scope.prj_task_filters.date="";
            } else {
                $scope.prj_task_filters.date=t;
            }
        };
        $scope.js_filter_status = function (status) {
            if($scope.prj_task_filters.status === status) {
                $scope.prj_task_filters.status = "all";
            } else {
                $scope.prj_task_filters.status = status;
            }
        };
        $scope.js_filter_order_status = function (status /* all, order, unorder*/) {
            if($scope.prj_task_filters.order_status == status) {
                $scope.prj_task_filters.order_status = "all";
            } else {
                $scope.prj_task_filters.order_status = status;
            }
        }
        var i = true;
        $scope.$watch('prj_task_filters', function () {
            if(!i) {
                $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, $scope.prj_task_filters);
            }
            i = false;
        },true);
        $scope.js_add_prj_member = function (t, n) {
            n || (n = kzi.constant.role.member), wt.data.project.add_member(pid, t.uid, n, function (n) {
                kzi.msg.success("添加成员成功！"), $rootScope.project.members.push(n.data), $scope.unassigned_team_members = _.reject($scope.unassigned_team_members, function (e) {
                    return e.uid === t.uid
                }), $scope.unassigned_team_visitors = _.reject($scope.unassigned_team_visitors, function (e) {
                    return e.uid === t.uid
                })
            })
        };
        $scope.js_add_user_as_member = function (t) {
            $scope.js_add_prj_member(t, kzi.constant.role.member)
        };
        $scope.js_invite_member = function (t) {
            return _.isEmpty(t) || $scope.member_inviting ? ($scope.email_validation_error = !0, void 0) : ($scope.email_validation_error = !1, $scope.member_inviting = !0, wt.data.project.invite_member(pid, t, function (t) {
                _.findWhere($rootScope.project.members, {
                    uid: t.data.uid
                }) || $rootScope.project.members.push(t.data), $scope.add_done = !0, $scope.shouldBeOpen = !1, $scope.data.invite_email = "", t.data.status === kzi.constant.status.ok && ($scope.unassigned_team_members = _.reject($scope.unassigned_team_members, function (e) {
                    return e.uid === t.data.uid
                }))
            }, null, function () {
                $scope.member_inviting = !1
            }), void 0)
        };
        $scope.clear_alert = function () {
            $scope.add_done === !0 && ($scope.add_done = !1, $scope.shouldBeOpen = !1)
        };
        $scope.js_set_lables = function (t, i, n, a, s, r) {
            var l = [{
                name: "blue",
                desc: t
            }, {
                name: "green",
                desc: i
            }, {
                name: "orange",
                desc: n
            }, {
                name: "purple",
                desc: a
            }, {
                name: "red",
                desc: s
            }, {
                name: "yellow",
                desc: r
            }];
            $scope.is_save_ing = !0, wt.data.project.set_labels(pid, l, function () {
                $scope.$parent.$parent.project.info.labels = l
            }, null, function () {
                $rootScope.$broadcast(kzi.constant.event_names.on_tasks_labels_update, l),
                $rootScope.$broadcast(kzi.constant.event_names.on_proj_ladels_update,
                    {
                        pid: $scope.pid,
                        labels:l
                    } ),
                kzi.msg.success("组内标记成功保存"), $scope.is_save_ing = !1, $scope.js_step(0)
            })
        };
        $scope.js_set_entries = function (t, ii, n, a, s, r) {
            var l = [{
                name: "step_one",
                desc: t
            }, {
                name: "step_two",
                desc: ii
            }, {
                name: "step_three",
                desc: n
            }, {
                name: "step_four",
                desc: a
            }, {
                name: "step_five",
                desc: s
            }, {
                name: "step_six",
                desc: r
            }];
            $scope.is_save_ing = !0, wt.data.project.set_entries(pid, l, function () {
                $rootScope.reload_entries(pid)
            }, null, function () {
                kzi.msg.success("交易墙模板成功保存"), $scope.is_save_ing = !1, $scope.js_step(0)
            })
        };
        $scope.js_toggle_step_body = function () {
            $scope.bodyOpen = !$scope.bodyOpen
        };
        $scope.js_prj_update = function () {
            if($scope.project.info.name === "未分组活动") {
                kzi.msg.warn("系统分组，不可更改");
                $scope.project.info.new_name = "未分组活动";
                $scope.project.info.new_desc = $scope.project.info.desc;
                return undefined;
            }
            if ($scope.project.info.new_name != $scope.project.info.name ||
                $scope.project.info.new_desc != $scope.project.info.desc ||
                $scope.project.info.new_visibility != $scope.project.info.visibility) {
                $scope.is_prj_saveing = !0;
                $scope.project.name = $scope.project.new_name;
                $scope.project.desc = $scope.project.new_desc;
                _.isEmpty($scope.project.desc) && ($scope.project.desc = "");
                wt.data.project.update(pid,
                    $scope.project.info.new_name,
                    $scope.project.info.new_desc,
                    function () {
                        $rootScope.refresh_cache.project.update(pid, $scope.project.info.new_name, $scope.project.info.new_desc);
                        kzi.msg.success("修改项目基本信息成功");
                    }, function () {
                        kzi.msg.error("修改项目基本信息失败")
                    }, function () {
                        $scope.is_prj_saveing = !1;
                        $scope.js_step(3);
                        $rootScope.js_right_sidebar_toggle();
                    }
                )
            }
        };
        $scope.js_prj_archive = function () {
            $scope.is_archiving = !0;
            wt.data.project.archive(pid, function () {
                $scope.project.info.archived = 1;
                $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid === pid
                });
                if($rootScope.project && $rootScope.project.info.pid === pid && $rootScope.project.info) {
                    $rootScope.project.info.archived = 1, $rootScope.project.info.permission = kzi.constant.prj_module.view;
                }
                kzi.msg.success("归档项目成功");
                $scope.js_step(3);
            }, null, function () {
                $scope.is_archiving = !1
            })
        };
        $scope.js_prj_unarchive = function () {
            $scope.is_unarchiving = !0;
            wt.data.project.unarchive(pid, function () {
                $scope.project.info.archived = 0;
                if($rootScope.project && $rootScope.project.info.pid === pid && $rootScope.project.info) {
                    $rootScope.project.info.archived = 0;
                }
                kzi.msg.success("激活项目成功");
                $scope.js_step(3);
                $rootScope.reload_projects(function (e) {
                    if ($rootScope.project.info && $rootScope.project.info.pid === pid) {
                        var t = _.findWhere(e, {
                            pid: pid
                        });
                        t && ($rootScope.project.info.permission = t.permission)
                    }
                })
            }, null, function () {
                $scope.is_unarchiving = !1
            })
        };
        $scope.js_color_select = function (t) {
            $scope.project.info.new_bg = t
        };
        $scope.js_prj_set_logo = function () {
            if($scope.project.info.new_bg !== $scope.project.bg || $scope.project.info.new_pic !== $scope.project.pic){
                $scope.is_logo_saving = !0;
                wt.data.project.set_logo(pid, $scope.project.info.new_bg, $scope.project.info.new_pic, function () {
                    kzi.msg.success("设置项目标识成功");
                    $rootScope.refresh_cache.project.set_logo(pid, $scope.project.info.new_bg, $scope.project.info.new_pic)
                }, function () {
                    kzi.msg.success("设置项目标识失败")
                }, function () {
                    $scope.is_logo_saving = !1
                })
            }
        };
        $scope.js_icon_select = function (t) {
            $scope.project.info.new_pic = t
        };
        $scope.js_autoarchive_is_open = function () {
            return !0
        };
        $scope.js_show_done_task = function () {
            return !0
        };
        $scope.prj_del = function () {
//            t === e.project.info.name ? (e.is_deleting = !0, wt.data.project.del(o, function() {
//                i.projects = _.reject(i.projects, function(e) {
//                    return e.pid === o
//                }), n.path("/dashboard")
//            }, null, function() {
//                e.is_deleting = !1
//            })) : kzi.msg.warn("输入项目名字错误！请确认你要删除的项目！")

                $scope.project.info.pid.indexOf("-SYSTEM") == -1 &&
                ($scope.is_deleting = !0,
                    wt.data.project.del(pid, function () {
                            kzi.msg.success("群组删除成功！", function () {
                            });
                            $rootScope.projects = _.reject($rootScope.projects, function (e) {
                                return e.pid === pid;
                            }), $location.path("/dashboard");
                        },
                        function (rsp) {
                            if (rsp.code == 5013) {
                                kzi.msg.error("系统默认群组不可删除！", function () {
                                });
                            }
                            else {
                                kzi.msg.error("群组删除失败！", function () {
                                });
                            }
                        },
                        function () {
                            $scope.is_deleting = !1;
                        }
                    ))
            };
        $scope.js_prj_unnotify = function () {
                $scope.project.info.is_notify = 0;
            wt.data.project.set_prefs(pid, "is_notify", 0, function () {
                }, function () {
                    $scope.project.info.is_notify = 1
                })
            };
        $scope.js_prj_notify = function () {
            $scope.project.info.is_notify = 1;
            wt.data.project.set_prefs(pid, "is_notify", 1, function () {
            }, function () {
                $scope.project.info.is_notify = 0
            })
        };
        $scope.js_prj_quit = function (t) {
            t === $scope.project.info.name ? ($scope.is_quiting = !0, wt.data.project.member_leave(pid, function () {
                $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid == pid
                }), $location.path("/dashboard")
            }, null, function () {
                $scope.is_quiting = !1
            })) : kzi.msg.warn("输入项目名字错误！请确认你要退出的项目！")
        };
        $scope.js_view_all_activity = function () {
            $rootScope.global.right_isfold = !0;
            $location.path("/project/" + pid + "/activity")
        };
        $scope.ready_email_invite = function () {
            $scope.member_inviting = !1;
            $scope.add_done = !1;
            $scope.add_done = !1;
            $scope.data.invite_email = "";
        };
        $scope.select_add_member_url = function () {
            function e(e) {
                var t;
                document.selection ? (t = document.body.createTextRange(), t.moveToElementText(document.getElementById(e)), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(document.getElementById(e)), window.getSelection().addRange(t))
            }

            e("add_member_url")
        };
        $scope.clear_task_filters = function () {
            $scope.prj_task_filters= {
                texts: "",
                labels: [],
                zoneCode:"",
                countryCode:"",
                date: "", //这里时间是多长时间内有人预约的课程
                expired_status: "all", /* all, expired, unexpired */
                status: "all", /* all, -1, 0, 1*/
                order_status: "all", /* all, order, unorder*/
                keywords: ""
            };
        };
        $scope.js_toggle_autoarchive = function () {
            var e = 1;
            e = 1 === $rootScope.project.info.auto_archived ? 0 : 1, wt.data.project.set_prefs(pid, "auto_archived", e, function () {
                $rootScope.project.info.auto_archived = e
            })
        };
        $scope.js_toggle_show_done_task_in_event = function () {
            var e = 1;
            e = 1 === $rootScope.project.info.show_completed ? 0 : 1, wt.data.project.set_prefs(pid, "show_completed", e, function () {
                $rootScope.project.info.show_completed = e
            })
        };
        $scope.set_transfer_to = function (t) {
            $scope.data.transfer_to_tid = t
        };
        $scope.transfer = function () {
            var t = $scope.data.transfer_to_tid;
            if (!_.isEmpty(t)) {
                var n = $rootScope.project.info.pid;
                wt.data.project.transfer(n, t, function () {
                    $rootScope.refresh_cache.project.shift(n, t), kzi.msg.success("项目移动成功")
                }, function () {
                    kzi.msg.error("项目移动失败")
                }, function () {
                })
            }
        };

        $scope.$on(kzi.constant.event_names.project_tasks_filter_underdevelopment, function () {
            $scope.prj_task_filters.date="-1";
        });
        $scope.$on(kzi.constant.event_names.project_clear_task_filter, function () {
            $scope.prj_task_filters= {
                texts: "",
                labels: [],
                zoneCode:"",
                countryCode:"",
                date: "" //这里时间是多长时间未联系，
            }
        });
        $scope.$on(kzi.constant.event_names.show_project_tasks_filter, function () {
            $rootScope.global.right_sidebar_is_fold = !1;
            $scope.js_step(1)
        });
        $scope.$on(kzi.constant.event_names.show_project_workflow, function () {
            $rootScope.global.right_sidebar_is_fold = !1;
            $scope.js_step(9)
        });
        $scope.$on(kzi.constant.event_names.show_project_setting, function () {
            $rootScope.global.right_sidebar_is_fold = !1;
            $scope.js_step(3)
        });
        $scope.$on(kzi.constant.event_names.show_project_setting_identify, function () {
            $rootScope.global.right_sidebar_is_fold = !1;
            $scope.js_step(32)
        })
    }
]);


innerApp.controller("common_sidebar_ctrl", ["$scope", "$routeParams", "$rootScope", "$location", "$timeout", "$popbox", "$filter",
    function (e, t, i, n) {
        e.mail_sidebar_view = "task";
        var o = t.pid;
        e.prj_task_filters= {
            texts: "",
            labels: [],
            zoneCode:"",
            countryCode:"",
            date: "" //这里时间是多长时间未联系，
        };
        e.js_filter_date = function (t) {
            if(e.prj_task_filters.date==t){
                e.prj_task_filters.date="";
            }else{
                e.prj_task_filters.date=t;
            }
        };
        e.flag=true;
        e.$watch('prj_task_filters', function () {
            if(!e.flag) {
                e.$emit(kzi.constant.event_names.on_project_tasks_filter, e.prj_task_filters);
            }
            e.flag=false;
        },true);
        e.clear_task_filters = function () {
            e.prj_task_filters= {
                texts: "",
                labels: [],
                zoneCode:"",
                countryCode:"",
                date: "" //这里时间是多长时间未联系，
            }
            i.$broadcast(kzi.constant.event_names.project_clear_task_filter, null)
        };

        e.pid = o, e.step = 0,
            e.bodyOpen = (i.global.right_sidebar_show_part == 1 || i.global.right_sidebar_show_part == 3) ? true : false,
            e.add_member_url = "/join" + o,
            e.create_by_mail = o + kzi.constant.mail.domain, e.member_inviting = !1, e.email_validation_error = !1, e.data = {}, e.data.invite_email = "", e.prj_colors = kzi.constant.prj_colors, e.prj_icons = kzi.constant.prj_icons, e.visibilities = [{
            id: kzi.constant.prj_visibility.private,
            name: "私有项目"
        }, {
            id: kzi.constant.prj_visibility.protected,
            name: "团队可见"
        }, {
            id: kzi.constant.prj_visibility.public,
            name: "公开项目"
        }], e.data = {}, e.data.transfer_to_tid = void 0, e.flashing_success = !1, e.transfer_to_teams = _.filter(i.teams, function (e) {
            return 1 === e.curr_role || "-1" === e.team_id || e.permission & i.global.team_module.add_project
        }), e.js_change_prj_sidebar_view = function (t) {
            i.global.project_sidebar_view = t, "chat" === t && e.$broadcast("init_project_chat_list", {})
        }, e.js_step = function (t, n) {
            n && $(n.target.parentElement).hasClass("disabled") || (1 === t && (e.labels_is_set = false), 2 === t && _.each(kzi.constant.labels, function (t) {
                e.mail_sidebar_view = "task";
                var i = _.findWhere(e.$parent.$parent.project.info.labels, {
                    name: t.name
                });
                i && (e[t.name] = i.desc);
            }), 3 === t && _.each(kzi.constant.labels, function (t) {
                e.mail_sidebar_view = "template";
            }), 6 === t && (i.global.right_sidebar_is_fold = false, e.loading_team_members = !0, -1 == i.project.info.team_id ? (e.loading_team_members = !1, e.is_individual_project = !0) : (e.is_individual_project = !1, i.load_team_members(i.project.info.team_id, function (t) {
                e.unassigned_team_members = [], e.unassigned_team_visitors = [], i.load_project(o, !0, function (i) {
                    _.each(t.members, function (t) {
                        _.findWhere(i.members, {
                            uid: t.uid
                        }) || (t.role === kzi.constant.role.guest ? e.unassigned_team_visitors.push(t) : e.unassigned_team_members.push(t))
                    })
                }), e.loading_team_members = !1
            }))), 31 === t && (e.project.info.new_name = e.project.info.name, e.project.info.new_desc = e.project.info.desc, e.project.info.new_visibility = e.project.info.visibility), 32 === t && (e.project.info.new_bg = e.project.info.bg, e.project.info.new_pic = e.project.info.pic), e.step = t)
        }, e.js_goto_prj_setting = function () {
            4 !== i.project.info.curr_role && e.js_step(3)
        }, e.js_label_is_filter = function (t) {
            return -1 !== _.indexOf(_.pluck(e.labels_is_filter.labels, "name"), t) ? !0 : void 0
        }, e.js_member_is_filter = function (t) {
            return -1 !== _.indexOf(_.pluck(e.labels_is_filter.members, "uid"), t) ? !0 : void 0
        }, e.js_watch_project = function (e) {
            kzi.msg.error(e + "关注失败, 服务器端无接口.")
        }, e.isMemberFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && (e.role === kzi.constant.role.admin || e.role === kzi.constant.role.member)
            }
        }, e.isGuestFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && e.role == kzi.constant.role.guest
            }
        }, e.isStatusPendingFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.pending
            }
        }, e.js_filter_text = function () {
            var t = {},
                i = e.$parent.$parent.task_filters;
            if (_.isEmpty(this.task_filter_text)) i.texts = "", e.$emit(kzi.constant.event_names.on_project_tasks_filter, t);
            else {
                var n = this.task_filter_text.toLowerCase().replace("，", ",").replace("　", ",").replace(" ", ",").replace("  ", ",");
                i.texts = n.split(","), e.$emit(kzi.constant.event_names.on_project_tasks_filter, t)
            }
        }, e.js_filter_label = function (t) {
            var t = _.pick(t, "desc", "name"),
                i = t.name,
                n = e.$parent.$parent.task_filters,
                a = _.pluck(n.labels, "name");
            -1 === _.indexOf(a, i) ? n.labels.push(t) : n.labels.splice(_.indexOf(a, i), 1), e.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, e.js_filter_member = function (t) {
            var t = _.pick(t, "uid", "name", "display_name", "desc", "avatar"),
                i = t.uid,
                n = e.$parent.$parent.task_filters,
                a = _.pluck(n.members, "uid");
            -1 === _.indexOf(a, i) ? n.members.push(t) : n.members.splice(_.indexOf(a, i), 1), e.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, e.js_add_prj_member = function (t, n) {
            n || (n = kzi.constant.role.member), wt.data.project.add_member(o, t.uid, n, function (n) {
                kzi.msg.success("添加成员成功！"), i.project.members.push(n.data), e.unassigned_team_members = _.reject(e.unassigned_team_members, function (e) {
                    return e.uid === t.uid
                }), e.unassigned_team_visitors = _.reject(e.unassigned_team_visitors, function (e) {
                    return e.uid === t.uid
                })
            })
        }, e.js_add_user_as_member = function (t) {
            e.js_add_prj_member(t, kzi.constant.role.member)
        }, e.js_invite_member = function (t) {
            return _.isEmpty(t) || e.member_inviting ? (e.email_validation_error = !0, void 0) : (e.email_validation_error = !1, e.member_inviting = !0, wt.data.project.invite_member(o, t, function (t) {
                _.findWhere(i.project.members, {
                    uid: t.data.uid
                }) || i.project.members.push(t.data), e.add_done = !0, e.shouldBeOpen = !1, e.data.invite_email = "", t.data.status === kzi.constant.status.ok && (e.unassigned_team_members = _.reject(e.unassigned_team_members, function (e) {
                    return e.uid === t.data.uid
                }))
            }, null, function () {
                e.member_inviting = !1
            }), void 0)
        }, e.clear_alert = function () {
            e.add_done === !0 && (e.add_done = !1, e.shouldBeOpen = !1)
        }
            , e.js_toggle_step_body = function () {
            e.js_toggle_step_body = 0;
            e.bodyOpen = !e.bodyOpen
        }, e.js_prj_update = function () {
            (e.project.info.new_name != e.project.info.name || e.project.info.new_desc != e.project.info.desc || e.project.info.new_visibility != e.project.info.visibility) && (e.is_prj_saveing = !0, e.project.name = e.project.new_name, e.project.desc = e.project.new_desc, _.isEmpty(e.project.desc) && (e.project.desc = ""), wt.data.project.update(o, e.project.info.new_name, e.project.info.new_desc, e.project.info.new_visibility, function () {
                i.refresh_cache.project.update(o, e.project.info.new_name, e.project.info.new_desc, e.project.info.new_visibility), kzi.msg.success("修改项目基本信息成功")
            }, function () {
                kzi.msg.error("修改项目基本信息失败")
            }, function () {
                e.is_prj_saveing = !1
            }))
        }, e.js_prj_archive = function () {
            e.is_archiving = !0, wt.data.project.archive(o, function () {
                e.project.info.archived = 1, i.projects = _.reject(i.projects, function (e) {
                    return e.pid === o
                }), i.project && i.project.info.pid === o && i.project.info && (i.project.info.archived = 1, i.project.info.permission = kzi.constant.prj_module.view), kzi.msg.success("归档项目成功"), e.js_step(3)
            }, null, function () {
                e.is_archiving = !1
            })
        }, e.js_prj_unarchive = function () {
            e.is_unarchiving = !0, wt.data.project.unarchive(o, function () {
                e.project.info.archived = 0, i.project && i.project.info.pid === o && i.project.info && (i.project.info.archived = 0), kzi.msg.success("激活项目成功"), e.js_step(3), i.reload_projects(function (e) {
                    if (i.project.info && i.project.info.pid === o) {
                        var t = _.findWhere(e, {
                            pid: o
                        });
                        t && (i.project.info.permission = t.permission)
                    }
                })
            }, null, function () {
                e.is_unarchiving = !1
            })
        }, e.js_color_select = function (t) {
            e.project.info.new_bg = t
        }, e.js_prj_set_logo = function () {
            (e.project.info.new_bg !== e.project.bg || e.project.info.new_pic !== e.project.pic) && (e.is_logo_saving = !0, wt.data.project.set_logo(o, e.project.info.new_bg, e.project.info.new_pic, function () {
                kzi.msg.success("设置项目标识成功"), i.refresh_cache.project.set_logo(o, e.project.info.new_bg, e.project.info.new_pic)
            }, function () {
                kzi.msg.success("设置项目标识失败")
            }, function () {
                e.is_logo_saving = !1
            }))
        }, e.js_icon_select = function (t) {
            e.project.info.new_pic = t
        }, e.js_autoarchive_is_open = function () {
            return !0
        }, e.js_show_done_task = function () {
            return !0
        }, e.js_prj_del = function (t) {
            t === e.project.info.name ? (e.is_deleting = !0, wt.data.project.del(o, function () {
                i.projects = _.reject(i.projects, function (e) {
                    return e.pid === o
                }), n.path("/dashboard")
            }, null, function () {
                e.is_deleting = !1
            })) : kzi.msg.warn("输入项目名字错误！请确认你要删除的项目！")
        }, e.js_prj_unnotify = function () {
            e.project.info.is_notify = 0, wt.data.project.set_prefs(o, "is_notify", 0, function () {
            }, function () {
                e.project.info.is_notify = 1
            })
        }, e.js_prj_notify = function () {
            e.project.info.is_notify = 1, wt.data.project.set_prefs(o, "is_notify", 1, function () {
            }, function () {
                e.project.info.is_notify = 0
            })
        }, e.js_prj_quit = function (t) {
            t === e.project.info.name ? (e.is_quiting = !0, wt.data.project.member_leave(o, function () {
                i.projects = _.reject(i.projects, function (e) {
                    return e.pid == o
                }), n.path("/dashboard")
            }, null, function () {
                e.is_quiting = !1
            })) : kzi.msg.warn("输入项目名字错误！请确认你要退出的项目！")
        }, e.js_view_all_activity = function () {
            i.global.right_isfold = !0, n.path("/project/" + o + "/activity")
        }, e.ready_email_invite = function () {
            e.member_inviting = !1, e.add_done = !1, e.add_done = !1, e.data.invite_email = ""
        }, e.select_add_member_url = function () {
            function e(e) {
                var t;
                document.selection ? (t = document.body.createTextRange(), t.moveToElementText(document.getElementById(e)), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(document.getElementById(e)), window.getSelection().addRange(t))
            }

            e("add_member_url")
        },  e.js_toggle_show_done_task_in_event = function () {
            var e = 1;
            e = 1 === i.project.info.show_completed ? 0 : 1, wt.data.project.set_prefs(o, "show_completed", e, function () {
                i.project.info.show_completed = e
            })
        }, e.set_transfer_to = function (t) {
            e.data.transfer_to_tid = t
        }, e.transfer = function () {
            var t = e.data.transfer_to_tid;
            if (!_.isEmpty(t)) {
                var n = i.project.info.pid;
                wt.data.project.transfer(n, t, function () {
                    i.refresh_cache.project.shift(n, t), kzi.msg.success("项目移动成功")
                }, function () {
                    kzi.msg.error("项目移动失败")
                }, function () {
                })
            }
        }, e.$on(kzi.constant.event_names.project_tasks_filter_underdevelopment, function () {
                e.prj_task_filters.date="-1";
            });
        e.$on(kzi.constant.event_names.project_clear_task_filter, function () {
            e.prj_task_filters= {
                texts: "",
                labels: [],
                zoneCode:"",
                countryCode:"",
                date: "" //这里时间是多长时间未联系，
            }
        }),e.$on(kzi.constant.event_names.show_project_tasks_filter, function () {
            i.global.right_sidebar_is_fold = !1, e.js_step(1)
        }), e.$on(kzi.constant.event_names.show_project_setting, function () {
            i.global.right_sidebar_is_fold = !1, e.js_step(3)
        }), e.$on(kzi.constant.event_names.show_project_setting_identify, function () {
            i.global.right_sidebar_is_fold = !1, e.js_step(32)
        }), e.$on(kzi.constant.event_names.show_sidebar_tasks_filter, function () {
            i.global.right_sidebar_is_fold = !1, e.js_step(2)
        }), e.js_close = function () {
            i.showSidebar = false;
        };
    }
]);

innerApp.controller('prj_chat_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    'socket',
    '$timeout',
    '$element',
    function (e, t, i, n, a, s) {
        var o = i.pid;
        t.input_message = '', t.js_insert_emoji = function (e) {
            t.input_message = t.input_message + e;
        }, t.messages = [];
        var r = function (e) {
            var t = null, i = moment();
            _.each(e, function (e) {
                i.isSame(moment(e.create_date), 'day') || (e.show_date = true), t ? moment(e.create_date) > moment(t).add('minute', 5) && (e.show_time = true, t = e.create_date) : (t = e.create_date, e.show_time = true);
            });
        };
        t.$on('socket_chat', function (e, i) {
            t.messages.push(i), r(t.messages), a(function () {
                $('.prj-chat-panel').children().mCustomScrollbar('scrollTo', 'bottom');
            }, 500);
        }), t.js_send_message = function () {
            _.isEmpty(t.input_message) || (n.emit('chat', {
                from: e.global.me.uid,
                to: o,
                type: 1,
                body: {
                    type: 1,
                    content: t.input_message
                }
            }, function () {
            }), t.input_message = '');
        }, t.js_navigate_detail = function (t, i) {
            t.stopPropagation(), t.preventDefault(), e.locator.to_file(i.pid, i.fid, false);
        };
        var l = function () {
            t.loading_chat_done = false, e.load_project_init_chat(o, function (i) {
                _.each(i.messages, function (t) {
                    t.is_me = t.from.uid === e.global.me.uid ? true : false;
                }), wt.bus.chat.set_messages_for_file(i.messages, o), t.messages = _.sortBy(i.messages, function (e) {
                    return e.create_date;
                }), r(t.messages), i.total_count > 5 && (t.has_more_chat = true), a(function () {
                    $('.prj-chat-panel').children().mCustomScrollbar('scrollTo', 'bottom');
                }, 500);
            }, null, function () {
                t.loading_chat_done = true, a(function () {
                    $('.prj-chat-panel').children().mCustomScrollbar('scrollTo', 'bottom');
                }, 200);
            }), e.load_project_members(o, function (i) {
                var n = _.filter(i.members, function (t) {
                    return t.uid !== e.global.me.uid && 1 === t.status;
                });
                t.atwho_members = n, a(function () {
                    $('#atwho-container').bind('mousedown', function (e) {
                        e.stopPropagation(), e.preventDefault();
                    });
                });
            });
        };
        t.$on('init_project_chat_list', function () {
            l();
        }), t.js_change_message = function () {
            var e = 200;
            t.input_message.length > e ? (t.limit_error = true, t.input_message = t.input_message.substr(0, e), a(function () {
                $('.prj-chat-panel').children().mCustomScrollbar('scrollTo', 'bottom');
            })) : t.limit_error = false;
        }, e.global.right_sidebar_is_fold || 'chat' !== e.global.project_sidebar_view || l(), t.file_upload_option = {
            previewMaxWidth: 77,
            previewMaxHeight: 77,
            url: [
                kzi.config.wtbox(),
                '?pid=' + o,
                '&token=' + kzi.get_cookie('sid')
            ].join(''),
            formData: {
                target: 'prj',
                type: 'chat',
                pid: o
            },
            addCallback: function () {
                a(function () {
                    $('.chat-messages-list').mCustomScrollbar('update'), s.children('.mCustomScrollbar').mCustomScrollbar('scrollTo', 'bottom');
                }, 150);
            },
            successCallback: function (t) {
                t.data && n.emit('chat', {
                    from: e.global.me.uid,
                    to: o,
                    type: 1,
                    body: {
                        type: 3,
                        content: {
                            fid: t.data.fid,
                            name: t.data.name,
                            ext: t.data.ext,
                            size: t.data.size,
                            path: t.data.path
                        }
                    }
                }, function () {
                });
            }
        }, t.js_chat_upload_files = function (e) {
            $(e.target).next('input[type=file]').click();
        }, t.global_fileupload_queue = function () {
            return e.upload_queue.get_chat(o);
        };
    }
]);

innerApp.controller("mailbox_sidebar_ctrl", ["$scope", "$routeParams", "$rootScope", "$location", "$timeout", "$popbox", "$filter",
    function ($scope, $routeParams, $rootScope, $location) {
        $scope.mail_sidebar_view = "task";
        var o = $routeParams.pid;
        $scope.js_toggle_task = function (e) {
            wt.bus.mail.toggle_task_member(e, $scope.edit_mail, "")
        };
        $scope.js_toggle_template = function (e, es) {
            e.checked = !e.checked;
            $scope.edit_mail.name = e.name;
            $scope.edit_mail.content = e.content;
            es && es.length > 0 && _.each(es, function (t) {
                if (t.template_id != e.template_id)
                    t.checked = false;
            })
        };

        $scope.pid = o, $scope.step = 0,
            $scope.bodyOpen = ($rootScope.global.right_sidebar_show_part == 1 || $rootScope.global.right_sidebar_show_part == 3) ? true : false,
            $scope.add_member_url = "/join" + o,
            $scope.create_by_mail = o + kzi.constant.mail.domain, $scope.member_inviting = !1, $scope.email_validation_error = !1, $scope.data = {}, $scope.data.invite_email = "", $scope.prj_colors = kzi.constant.prj_colors, $scope.prj_icons = kzi.constant.prj_icons, $scope.visibilities = [{
            id: kzi.constant.prj_visibility.private,
            name: "私有项目"
        }, {
            id: kzi.constant.prj_visibility.protected,
            name: "团队可见"
        }, {
            id: kzi.constant.prj_visibility.public,
            name: "公开项目"
        }], $scope.data = {}, $scope.data.transfer_to_tid = void 0, $scope.flashing_success = !1, $scope.transfer_to_teams = _.filter($rootScope.teams, function (e) {
            return 1 === e.curr_role || "-1" === e.team_id || e.permission & $rootScope.global.team_module.add_project
        }), $scope.js_change_prj_sidebar_view = function (t) {
            $rootScope.global.project_sidebar_view = t, "chat" === t && $scope.$broadcast("init_project_chat_list", {})
        }, $scope.js_step = function (t, n) {
            n && $(n.target.parentElement).hasClass("disabled") || (1 === t && ($scope.labels_is_set = _.filter($scope.$parent.$parent.project.info.labels, function (e) {
                return "" != e.desc
            }), $scope.labels_is_filter = $scope.$parent.$parent.task_filters, $scope.task_filter_text = _.isArray($scope.$parent.$parent.task_filters.texts) ? $scope.$parent.$parent.task_filters.texts.join(" ") : "", $rootScope.load_project_members($rootScope.project.info.pid, function (t) {
                $scope.assigned_team_members = wt.bus.member.get_normal_members(t.members)
            })), 2 === t && _.each(kzi.constant.labels, function (t) {
                $scope.mail_sidebar_view = "task";
                var i = _.findWhere($scope.$parent.$parent.project.info.labels, {
                    name: t.name
                });
                i && ($scope[t.name] = i.desc)
            }), 3 === t && _.each(kzi.constant.labels, function (t) {
                $scope.mail_sidebar_view = "template";
            }), 6 === t && ($rootScope.global.right_sidebar_is_fold = false, $scope.loading_team_members = !0, -1 == $rootScope.project.info.team_id ? ($scope.loading_team_members = !1, $scope.is_individual_project = !0) : ($scope.is_individual_project = !1, $rootScope.load_team_members($rootScope.project.info.team_id, function (t) {
                $scope.unassigned_team_members = [], $scope.unassigned_team_visitors = [], $rootScope.load_project(o, !0, function (i) {
                    _.each(t.members, function (t) {
                        _.findWhere(i.members, {
                            uid: t.uid
                        }) || (t.role === kzi.constant.role.guest ? $scope.unassigned_team_visitors.push(t) : $scope.unassigned_team_members.push(t))
                    })
                }), $scope.loading_team_members = !1
            }))), 31 === t && ($scope.project.info.new_name = $scope.project.info.name, $scope.project.info.new_desc = $scope.project.info.desc, $scope.project.info.new_visibility = $scope.project.info.visibility), 32 === t && ($scope.project.info.new_bg = $scope.project.info.bg, $scope.project.info.new_pic = $scope.project.info.pic), $scope.step = t)
        }, $scope.js_goto_prj_setting = function () {
            4 !== $rootScope.project.info.curr_role && $scope.js_step(3)
        }, $scope.js_label_is_filter = function (t) {
            return -1 !== _.indexOf(_.pluck($scope.labels_is_filter.labels, "name"), t) ? !0 : void 0
        }, $scope.js_member_is_filter = function (t) {
            return -1 !== _.indexOf(_.pluck($scope.labels_is_filter.members, "uid"), t) ? !0 : void 0
        }, $scope.js_watch_project = function (e) {
            kzi.msg.error(e + "关注失败, 服务器端无接口.")
        }, $scope.isMemberFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && (e.role === kzi.constant.role.admin || e.role === kzi.constant.role.member)
            }
        }, $scope.isGuestFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && e.role == kzi.constant.role.guest
            }
        }, $scope.isStatusPendingFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.pending
            }
        }, $scope.js_filter_text = function () {
            var t = {},
                i = $scope.$parent.$parent.task_filters;
            if (_.isEmpty(this.task_filter_text)) i.texts = "", $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, t);
            else {
                var n = this.task_filter_text.toLowerCase().replace("，", ",").replace("　", ",").replace(" ", ",").replace("  ", ",");
                i.texts = n.split(","), $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, t)
            }
        }, $scope.js_filter_label = function (t) {
            var t = _.pick(t, "desc", "name"),
                i = t.name,
                n = $scope.$parent.$parent.task_filters,
                a = _.pluck(n.labels, "name");
            -1 === _.indexOf(a, i) ? n.labels.push(t) : n.labels.splice(_.indexOf(a, i), 1), $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, $scope.js_filter_member = function (t) {
            var t = _.pick(t, "uid", "name", "display_name", "desc", "avatar"),
                i = t.uid,
                n = $scope.$parent.$parent.task_filters,
                a = _.pluck(n.members, "uid");
            -1 === _.indexOf(a, i) ? n.members.push(t) : n.members.splice(_.indexOf(a, i), 1), $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, $scope.js_filter_date = function (t) {
            var i = $scope.$parent.$parent.task_filters;
            i.date = i.date === t ? "" : t, $scope.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, $scope.js_add_prj_member = function (t, n) {
            n || (n = kzi.constant.role.member), wt.data.project.add_member(o, t.uid, n, function (n) {
                kzi.msg.success("添加成员成功！"), $rootScope.project.members.push(n.data), $scope.unassigned_team_members = _.reject($scope.unassigned_team_members, function (e) {
                    return e.uid === t.uid
                }), $scope.unassigned_team_visitors = _.reject($scope.unassigned_team_visitors, function (e) {
                    return e.uid === t.uid
                })
            })
        }, $scope.js_add_user_as_member = function (t) {
            $scope.js_add_prj_member(t, kzi.constant.role.member)
        }, $scope.js_invite_member = function (t) {
            return _.isEmpty(t) || $scope.member_inviting ? ($scope.email_validation_error = !0, void 0) : ($scope.email_validation_error = !1, $scope.member_inviting = !0, wt.data.project.invite_member(o, t, function (t) {
                _.findWhere($rootScope.project.members, {
                    uid: t.data.uid
                }) || $rootScope.project.members.push(t.data), $scope.add_done = !0, $scope.shouldBeOpen = !1, $scope.data.invite_email = "", t.data.status === kzi.constant.status.ok && ($scope.unassigned_team_members = _.reject($scope.unassigned_team_members, function (e) {
                    return e.uid === t.data.uid
                }))
            }, null, function () {
                $scope.member_inviting = !1
            }), void 0)
        }, $scope.clear_alert = function () {
            $scope.add_done === !0 && ($scope.add_done = !1, $scope.shouldBeOpen = !1)
        }, $scope.js_set_lables = function (t, i, n, a, s, r) {
            var l = [{
                name: "blue",
                desc: t
            }, {
                name: "green",
                desc: i
            }, {
                name: "orange",
                desc: n
            }, {
                name: "purple",
                desc: a
            }, {
                name: "red",
                desc: s
            }, {
                name: "yellow",
                desc: r
            }];
            $scope.is_save_ing = !0, wt.data.project.set_labels(o, l, function () {
                $scope.$parent.$parent.project.info.labels = l
            }, null, function () {
                kzi.msg.success("标签成功保存"), $scope.is_save_ing = !1, $scope.js_step(0)
            })
        }, $scope.js_toggle_step_body = function () {
            $scope.js_toggle_step_body = 0;
            $scope.bodyOpen = !$scope.bodyOpen
        }, $scope.js_prj_update = function () {
            ($scope.project.info.new_name != $scope.project.info.name || $scope.project.info.new_desc != $scope.project.info.desc || $scope.project.info.new_visibility != $scope.project.info.visibility) && ($scope.is_prj_saveing = !0, $scope.project.name = $scope.project.new_name, $scope.project.desc = $scope.project.new_desc, _.isEmpty($scope.project.desc) && ($scope.project.desc = ""), wt.data.project.update(o, $scope.project.info.new_name, $scope.project.info.new_desc, $scope.project.info.new_visibility, function () {
                $rootScope.refresh_cache.project.update(o, $scope.project.info.new_name, $scope.project.info.new_desc, $scope.project.info.new_visibility), kzi.msg.success("修改项目基本信息成功")
            }, function () {
                kzi.msg.error("修改项目基本信息失败")
            }, function () {
                $scope.is_prj_saveing = !1
            }))
        }, $scope.js_prj_archive = function () {
            $scope.is_archiving = !0, wt.data.project.archive(o, function () {
                $scope.project.info.archived = 1, $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid === o
                }), $rootScope.project && $rootScope.project.info.pid === o && $rootScope.project.info && ($rootScope.project.info.archived = 1, $rootScope.project.info.permission = kzi.constant.prj_module.view), kzi.msg.success("归档项目成功"), $scope.js_step(3)
            }, null, function () {
                $scope.is_archiving = !1
            })
        }, $scope.js_prj_unarchive = function () {
            $scope.is_unarchiving = !0, wt.data.project.unarchive(o, function () {
                $scope.project.info.archived = 0, $rootScope.project && $rootScope.project.info.pid === o && $rootScope.project.info && ($rootScope.project.info.archived = 0), kzi.msg.success("激活项目成功"), $scope.js_step(3), $rootScope.reload_projects(function (e) {
                    if ($rootScope.project.info && $rootScope.project.info.pid === o) {
                        var t = _.findWhere(e, {
                            pid: o
                        });
                        t && ($rootScope.project.info.permission = t.permission)
                    }
                })
            }, null, function () {
                $scope.is_unarchiving = !1
            })
        }, $scope.js_color_select = function (t) {
            $scope.project.info.new_bg = t
        }, $scope.js_prj_set_logo = function () {
            ($scope.project.info.new_bg !== $scope.project.bg || $scope.project.info.new_pic !== $scope.project.pic) && ($scope.is_logo_saving = !0, wt.data.project.set_logo(o, $scope.project.info.new_bg, $scope.project.info.new_pic, function () {
                kzi.msg.success("设置项目标识成功"), $rootScope.refresh_cache.project.set_logo(o, $scope.project.info.new_bg, $scope.project.info.new_pic)
            }, function () {
                kzi.msg.success("设置项目标识失败")
            }, function () {
                $scope.is_logo_saving = !1
            }))
        }, $scope.js_icon_select = function (t) {
            $scope.project.info.new_pic = t
        }, $scope.js_autoarchive_is_open = function () {
            return !0
        }, $scope.js_show_done_task = function () {
            return !0
        }, $scope.js_prj_del = function (t) {
            t === $scope.project.info.name ? ($scope.is_deleting = !0, wt.data.project.del(o, function () {
                $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid === o
                }), $location.path("/dashboard")
            }, null, function () {
                $scope.is_deleting = !1
            })) : kzi.msg.warn("输入项目名字错误！请确认你要删除的项目！")
        }, $scope.js_prj_unnotify = function () {
            $scope.project.info.is_notify = 0, wt.data.project.set_prefs(o, "is_notify", 0, function () {
            }, function () {
                $scope.project.info.is_notify = 1
            })
        }, $scope.js_prj_notify = function () {
            $scope.project.info.is_notify = 1, wt.data.project.set_prefs(o, "is_notify", 1, function () {
            }, function () {
                $scope.project.info.is_notify = 0
            })
        }, $scope.js_prj_quit = function (t) {
            t === $scope.project.info.name ? ($scope.is_quiting = !0, wt.data.project.member_leave(o, function () {
                $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid == o
                }), $location.path("/dashboard")
            }, null, function () {
                $scope.is_quiting = !1
            })) : kzi.msg.warn("输入项目名字错误！请确认你要退出的项目！")
        }, $scope.js_view_all_activity = function () {
            $rootScope.global.right_isfold = !0, $location.path("/project/" + o + "/activity")
        }, $scope.ready_email_invite = function () {
            $scope.member_inviting = !1, $scope.add_done = !1, $scope.add_done = !1, $scope.data.invite_email = ""
        }, $scope.select_add_member_url = function () {
            function e(e) {
                var t;
                document.selection ? (t = document.body.createTextRange(), t.moveToElementText(document.getElementById(e)), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(document.getElementById(e)), window.getSelection().addRange(t))
            }

            e("add_member_url")
        }, $scope.clear_task_filters = function () {
            this.task_filter_text = "", $scope.$emit(kzi.constant.event_names.project_clear_task_filter, null)
        }, $scope.js_toggle_autoarchive = function () {
            var e = 1;
            e = 1 === $rootScope.project.info.auto_archived ? 0 : 1, wt.data.project.set_prefs(o, "auto_archived", e, function () {
                $rootScope.project.info.auto_archived = e
            })
        }, $scope.js_toggle_show_done_task_in_event = function () {
            var e = 1;
            e = 1 === $rootScope.project.info.show_completed ? 0 : 1, wt.data.project.set_prefs(o, "show_completed", e, function () {
                $rootScope.project.info.show_completed = e
            })
        }, $scope.set_transfer_to = function (t) {
            $scope.data.transfer_to_tid = t
        }, $scope.transfer = function () {
            var t = $scope.data.transfer_to_tid;
            if (!_.isEmpty(t)) {
                var n = $rootScope.project.info.pid;
                wt.data.project.transfer(n, t, function () {
                    $rootScope.refresh_cache.project.shift(n, t), kzi.msg.success("项目移动成功")
                }, function () {
                    kzi.msg.error("项目移动失败")
                }, function () {
                })
            }
        }, $scope.$on(kzi.constant.event_names.show_project_tasks_filter, function () {
            $rootScope.global.right_sidebar_is_fold = !1, $scope.js_step(1)
        }), $scope.$on(kzi.constant.event_names.show_project_setting, function () {
            $rootScope.global.right_sidebar_is_fold = !1, $scope.js_step(3)
        }), $scope.$on(kzi.constant.event_names.show_project_setting_identify, function () {
            $rootScope.global.right_sidebar_is_fold = !1, $scope.js_step(32)
        }), $scope.js_close = function () {
            $rootScope.showSidebar = false;
        }
    }
]);

innerApp.controller("mailbox_sidebar_ctrl", ["$scope", "$routeParams", "$rootScope", "$location", "$timeout", "$popbox", "$filter",
    function (e, t, i, n) {
        e.mail_sidebar_view = "task";
        var o = t.pid;
        e.pid = o, e.step = 0,
            e.bodyOpen = (i.global.right_sidebar_show_part == 1 || i.global.right_sidebar_show_part == 3) ? true : false,
            e.add_member_url = "/join" + o,
            e.create_by_mail = o + kzi.constant.mail.domain, e.member_inviting = !1, e.email_validation_error = !1, e.data = {}, e.data.invite_email = "", e.prj_colors = kzi.constant.prj_colors, e.prj_icons = kzi.constant.prj_icons, e.visibilities = [{
            id: kzi.constant.prj_visibility.private,
            name: "私有项目"
        }, {
            id: kzi.constant.prj_visibility.protected,
            name: "团队可见"
        }, {
            id: kzi.constant.prj_visibility.public,
            name: "公开项目"
        }], e.data = {}, e.data.transfer_to_tid = void 0, e.flashing_success = !1, e.transfer_to_teams = _.filter(i.teams, function (e) {
            return 1 === e.curr_role || "-1" === e.team_id || e.permission & i.global.team_module.add_project
        }), e.js_change_prj_sidebar_view = function (t) {
            i.global.project_sidebar_view = t, "chat" === t && e.$broadcast("init_project_chat_list", {})
        }, e.js_step = function (t, n) {
            n && $(n.target.parentElement).hasClass("disabled") || (1 === t && (e.labels_is_set = _.filter(e.$parent.$parent.project.info.labels, function (e) {
                return "" != e.desc
            }), e.labels_is_filter = e.$parent.$parent.task_filters, e.task_filter_text = _.isArray(e.$parent.$parent.task_filters.texts) ? e.$parent.$parent.task_filters.texts.join(" ") : "", i.load_project_members(i.project.info.pid, function (t) {
                e.assigned_team_members = wt.bus.member.get_normal_members(t.members)
            })), 2 === t && _.each(kzi.constant.labels, function (t) {
                e.mail_sidebar_view = "task";
                var i = _.findWhere(e.$parent.$parent.project.info.labels, {
                    name: t.name
                });
                i && (e[t.name] = i.desc)
            }), 3 === t && _.each(kzi.constant.labels, function (t) {
                e.mail_sidebar_view = "template";
            }), 6 === t && (i.global.right_sidebar_is_fold = false, e.loading_team_members = !0, -1 == i.project.info.team_id ? (e.loading_team_members = !1, e.is_individual_project = !0) : (e.is_individual_project = !1, i.load_team_members(i.project.info.team_id, function (t) {
                e.unassigned_team_members = [], e.unassigned_team_visitors = [], i.load_project(o, !0, function (i) {
                    _.each(t.members, function (t) {
                        _.findWhere(i.members, {
                            uid: t.uid
                        }) || (t.role === kzi.constant.role.guest ? e.unassigned_team_visitors.push(t) : e.unassigned_team_members.push(t))
                    })
                }), e.loading_team_members = !1
            }))), 31 === t && (e.project.info.new_name = e.project.info.name, e.project.info.new_desc = e.project.info.desc, e.project.info.new_visibility = e.project.info.visibility), 32 === t && (e.project.info.new_bg = e.project.info.bg, e.project.info.new_pic = e.project.info.pic), e.step = t)
        }, e.js_step(3, null);
        e.js_goto_prj_setting = function () {
            4 !== i.project.info.curr_role && e.js_step(3)
        }, e.js_label_is_filter = function (t) {
            return -1 !== _.indexOf(_.pluck(e.labels_is_filter.labels, "name"), t) ? !0 : void 0
        }, e.js_member_is_filter = function (t) {
            return -1 !== _.indexOf(_.pluck(e.labels_is_filter.members, "uid"), t) ? !0 : void 0
        }, e.js_watch_project = function (e) {
            kzi.msg.error(e + "关注失败, 服务器端无接口.")
        }, e.isMemberFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && (e.role === kzi.constant.role.admin || e.role === kzi.constant.role.member)
            }
        }, e.isGuestFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.ok && e.role == kzi.constant.role.guest
            }
        }, e.isStatusPendingFilter = function () {
            return function (e) {
                return e.status === kzi.constant.status.pending
            }
        }, e.js_filter_text = function () {
            var t = {},
                i = e.$parent.$parent.task_filters;
            if (_.isEmpty(this.task_filter_text)) i.texts = "", e.$emit(kzi.constant.event_names.on_project_tasks_filter, t);
            else {
                var n = this.task_filter_text.toLowerCase().replace("，", ",").replace("　", ",").replace(" ", ",").replace("  ", ",");
                i.texts = n.split(","), e.$emit(kzi.constant.event_names.on_project_tasks_filter, t)
            }
        }, e.js_filter_label = function (t) {
            var t = _.pick(t, "desc", "name"),
                i = t.name,
                n = e.$parent.$parent.task_filters,
                a = _.pluck(n.labels, "name");
            -1 === _.indexOf(a, i) ? n.labels.push(t) : n.labels.splice(_.indexOf(a, i), 1), e.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, e.js_filter_member = function (t) {
            var t = _.pick(t, "uid", "name", "display_name", "desc", "avatar"),
                i = t.uid,
                n = e.$parent.$parent.task_filters,
                a = _.pluck(n.members, "uid");
            -1 === _.indexOf(a, i) ? n.members.push(t) : n.members.splice(_.indexOf(a, i), 1), e.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, e.js_filter_date = function (t) {
            var i = e.$parent.$parent.task_filters;
            i.date = i.date === t ? "" : t, e.$emit(kzi.constant.event_names.on_project_tasks_filter, {})
        }, e.js_add_prj_member = function (t, n) {
            n || (n = kzi.constant.role.member), wt.data.project.add_member(o, t.uid, n, function (n) {
                kzi.msg.success("添加成员成功！"), i.project.members.push(n.data), e.unassigned_team_members = _.reject(e.unassigned_team_members, function (e) {
                    return e.uid === t.uid
                }), e.unassigned_team_visitors = _.reject(e.unassigned_team_visitors, function (e) {
                    return e.uid === t.uid
                })
            })
        }, e.js_add_user_as_member = function (t) {
            e.js_add_prj_member(t, kzi.constant.role.member)
        }, e.js_invite_member = function (t) {
            return _.isEmpty(t) || e.member_inviting ? (e.email_validation_error = !0, void 0) : (e.email_validation_error = !1, e.member_inviting = !0, wt.data.project.invite_member(o, t, function (t) {
                _.findWhere(i.project.members, {
                    uid: t.data.uid
                }) || i.project.members.push(t.data), e.add_done = !0, e.shouldBeOpen = !1, e.data.invite_email = "", t.data.status === kzi.constant.status.ok && (e.unassigned_team_members = _.reject(e.unassigned_team_members, function (e) {
                    return e.uid === t.data.uid
                }))
            }, null, function () {
                e.member_inviting = !1
            }), void 0)
        }, e.clear_alert = function () {
            e.add_done === !0 && (e.add_done = !1, e.shouldBeOpen = !1)
        }, e.js_set_lables = function (t, i, n, a, s, r) {
            var l = [{
                name: "blue",
                desc: t
            }, {
                name: "green",
                desc: i
            }, {
                name: "orange",
                desc: n
            }, {
                name: "purple",
                desc: a
            }, {
                name: "red",
                desc: s
            }, {
                name: "yellow",
                desc: r
            }];
            e.is_save_ing = !0, wt.data.project.set_labels(o, l, function () {
                e.$parent.$parent.project.info.labels = l
            }, null, function () {
                kzi.msg.success("标签成功保存"), e.is_save_ing = !1, e.js_step(0)
            })
        }, e.js_toggle_step_body = function () {
            e.js_toggle_step_body = 0;
            e.bodyOpen = !e.bodyOpen
        }, e.js_prj_update = function () {
            (e.project.info.new_name != e.project.info.name || e.project.info.new_desc != e.project.info.desc || e.project.info.new_visibility != e.project.info.visibility) && (e.is_prj_saveing = !0, e.project.name = e.project.new_name, e.project.desc = e.project.new_desc, _.isEmpty(e.project.desc) && (e.project.desc = ""), wt.data.project.update(o, e.project.info.new_name, e.project.info.new_desc, e.project.info.new_visibility, function () {
                i.refresh_cache.project.update(o, e.project.info.new_name, e.project.info.new_desc, e.project.info.new_visibility), kzi.msg.success("修改项目基本信息成功")
            }, function () {
                kzi.msg.error("修改项目基本信息失败")
            }, function () {
                e.is_prj_saveing = !1
            }))
        }, e.js_prj_archive = function () {
            e.is_archiving = !0, wt.data.project.archive(o, function () {
                e.project.info.archived = 1, i.projects = _.reject(i.projects, function (e) {
                    return e.pid === o
                }), i.project && i.project.info.pid === o && i.project.info && (i.project.info.archived = 1, i.project.info.permission = kzi.constant.prj_module.view), kzi.msg.success("归档项目成功"), e.js_step(3)
            }, null, function () {
                e.is_archiving = !1
            })
        }, e.js_prj_unarchive = function () {
            e.is_unarchiving = !0, wt.data.project.unarchive(o, function () {
                e.project.info.archived = 0, i.project && i.project.info.pid === o && i.project.info && (i.project.info.archived = 0), kzi.msg.success("激活项目成功"), e.js_step(3), i.reload_projects(function (e) {
                    if (i.project.info && i.project.info.pid === o) {
                        var t = _.findWhere(e, {
                            pid: o
                        });
                        t && (i.project.info.permission = t.permission)
                    }
                })
            }, null, function () {
                e.is_unarchiving = !1
            })
        }, e.js_color_select = function (t) {
            e.project.info.new_bg = t
        }, e.js_prj_set_logo = function () {
            (e.project.info.new_bg !== e.project.bg || e.project.info.new_pic !== e.project.pic) && (e.is_logo_saving = !0, wt.data.project.set_logo(o, e.project.info.new_bg, e.project.info.new_pic, function () {
                kzi.msg.success("设置项目标识成功"), i.refresh_cache.project.set_logo(o, e.project.info.new_bg, e.project.info.new_pic)
            }, function () {
                kzi.msg.success("设置项目标识失败")
            }, function () {
                e.is_logo_saving = !1
            }))
        }, e.js_icon_select = function (t) {
            e.project.info.new_pic = t
        }, e.js_autoarchive_is_open = function () {
            return !0
        }, e.js_show_done_task = function () {
            return !0
        }, e.js_prj_del = function (t) {
            t === e.project.info.name ? (e.is_deleting = !0, wt.data.project.del(o, function () {
                i.projects = _.reject(i.projects, function (e) {
                    return e.pid === o
                }), n.path("/dashboard")
            }, null, function () {
                e.is_deleting = !1
            })) : kzi.msg.warn("输入项目名字错误！请确认你要删除的项目！")
        }, e.js_prj_unnotify = function () {
            e.project.info.is_notify = 0, wt.data.project.set_prefs(o, "is_notify", 0, function () {
            }, function () {
                e.project.info.is_notify = 1
            })
        }, e.js_prj_notify = function () {
            e.project.info.is_notify = 1, wt.data.project.set_prefs(o, "is_notify", 1, function () {
            }, function () {
                e.project.info.is_notify = 0
            })
        }, e.js_prj_quit = function (t) {
            t === e.project.info.name ? (e.is_quiting = !0, wt.data.project.member_leave(o, function () {
                i.projects = _.reject(i.projects, function (e) {
                    return e.pid == o
                }), n.path("/dashboard")
            }, null, function () {
                e.is_quiting = !1
            })) : kzi.msg.warn("输入项目名字错误！请确认你要退出的项目！")
        }, e.js_view_all_activity = function () {
            i.global.right_isfold = !0, n.path("/project/" + o + "/activity")
        }, e.ready_email_invite = function () {
            e.member_inviting = !1, e.add_done = !1, e.add_done = !1, e.data.invite_email = ""
        }, e.select_add_member_url = function () {
            function e(e) {
                var t;
                document.selection ? (t = document.body.createTextRange(), t.moveToElementText(document.getElementById(e)), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(document.getElementById(e)), window.getSelection().addRange(t))
            }

            e("add_member_url")
        }, e.clear_task_filters = function () {
            this.task_filter_text = "", e.$emit(kzi.constant.event_names.project_clear_task_filter, null)
        }, e.js_toggle_autoarchive = function () {
            var e = 1;
            e = 1 === i.project.info.auto_archived ? 0 : 1, wt.data.project.set_prefs(o, "auto_archived", e, function () {
                i.project.info.auto_archived = e
            })
        }, e.js_toggle_show_done_task_in_event = function () {
            var e = 1;
            e = 1 === i.project.info.show_completed ? 0 : 1, wt.data.project.set_prefs(o, "show_completed", e, function () {
                i.project.info.show_completed = e
            })
        }, e.set_transfer_to = function (t) {
            e.data.transfer_to_tid = t
        }, e.transfer = function () {
            var t = e.data.transfer_to_tid;
            if (!_.isEmpty(t)) {
                var n = i.project.info.pid;
                wt.data.project.transfer(n, t, function () {
                    i.refresh_cache.project.shift(n, t), kzi.msg.success("项目移动成功")
                }, function () {
                    kzi.msg.error("项目移动失败")
                }, function () {
                })
            }
        }, e.$on(kzi.constant.event_names.show_project_tasks_filter, function () {
            i.global.right_sidebar_is_fold = !1, e.js_step(1)
        }), e.$on(kzi.constant.event_names.show_project_setting, function () {
            i.global.right_sidebar_is_fold = !1, e.js_step(3)
        }), e.$on(kzi.constant.event_names.show_project_setting_identify, function () {
            i.global.right_sidebar_is_fold = !1, e.js_step(32)
        }), e.js_close = function () {
            i.showSidebar = false;
        };
    }
]);