'use strict';
innerApp.controller('team_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$popbox',
    function ($rootScope, $scope, $routeParams, $popbox) {
        var o = $routeParams.team_id;
        $scope.team_id = o, $scope.current_menu = o, $scope.delete_member = function (i, n, a, s) {
            wt.data.team.del_member(o, i.uid, function (a) {
                $scope.members = _.reject($scope.members, function (e) {
                    return e.uid === i.uid;
                }), $rootScope.refresh_cache.user.remove(i.uid), _.isFunction(n) && n(a);
            }, a, s);
        }, $scope.uninvite_member = function (i, n, a, s) {
            wt.data.team.uninvite_member(o, i.uid, function (a) {
                $scope.members = _.reject($scope.members, function (e) {
                    return e.uid === i.uid;
                }), $rootScope.refresh_cache.user.remove(i.uid), _.isFunction(n) && n(a);
            }, a, s);
        }, $scope.js_show_member_menu = function (e, i) {
            $popbox.popbox({
                target: e,
                templateUrl: '/view/team/pop_member_menu.html',
                controller: 'team_member_pop_menu_ctrl',
                resolve: {
                    pop_data: function () {
                        return {
                            $scope: $scope,
                            parameters: i,
                            team: $scope.current_team
                        };
                    }
                }
            }).open();
        }, $scope.js_star_toggle = function (t, i) {
            wt.bus.project.set_star_toggle(i, function () {
                var t = _.findWhere($rootScope.projects, { pid: i.pid });
                t.is_star = i.is_star;
            }), t.preventDefault(), t.stopPropagation();
        };
        var r = function () {
            $rootScope.load_team_from_cache(o, function (i) {
                i && ($scope.current_team = i), $rootScope.load_team(o, function (i) {
                    $scope.current_team = i.info, $scope.team_projects = i.projects, $scope.members = i.members, $rootScope.global.loading_done = true, $rootScope.global.title = i.info.name;
                }, function (i) {
                    i.code === kzi.statuses.team_error.not_found.code ? ($rootScope.global.title = '团队未找到', $scope.permission = kzi.constant.permission.team_not_found) : i.code === kzi.statuses.error.permission_deny.code ? ($rootScope.global.title = '不是当前团队成员', $scope.permission = kzi.constant.permission.team_not_found) : wt.data.error(i);
                });
            });
        };
        r(), $scope.$on('socket_message_team_projects', function (e, t) {
            t.team_id === o && r();
        });
    }
]);

innerApp.controller('team_member_invite_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    function (e, t, i, n) {
        e.global.title = '邀请团队成员';
        var s = i.team_id;
        t.current_menu = s, t.invite_members = [], t.invite_member_roles = kzi.constant.get_member_roles();
        var o = {
                role: kzi.constant.role.member,
                email: ''
            };
        _.each([
            1,
            2,
            3
        ], function (e) {
            var i = angular.copy(o);
            i.input_name = 'member_email' + e, t.invite_members.push(i);
        }), t.js_add_invite_member = function () {
            var e = angular.copy(o);
            e.input_name = 'member_email' + (t.invite_members.length + 1), t.invite_members.push(e);
        }, t.js_delete_member = function (e, i) {
            e.preventDefault(), t.invite_members = _.reject(t.invite_members, function (e) {
                return e.index === i.index;
            });
        }, t.js_email_focus = function (e) {
            e.$errors = [];
        }, t.js_invite_members = function (i) {
            if (_.findWhere(t.invite_members, { email: void 0 }))
                return i.$errors.unshift('邮箱格式输入不正确'), void 0;
            var a = _.filter(t.invite_members, function (e) {
                    return e.email && '' !== e.email;
                }), o = '', r = 0;
            if (_.each(a, function (e) {
                    var t = e.email.toLowerCase() + ',';
                    o.indexOf(t) >= 0 ? (i.$errors.unshift('邀请邮箱地址不能重复'), r = 1) : o += t;
                }), !r) {
                if (_.isEmpty(a))
                    return i.$errors.unshift('请至少输入一个邀请成员'), void 0;
                var l = false;
                if (_.each(a, function (e) {
                        return kzi.validator.isEmail(e.email) ? void 0 : (i.$errors.unshift('邮箱格式输入不正确'), l = true, void 0);
                    }), !l) {
                    if (t.current_team.member_count + a.length > t.current_team.sub.quota) {
                        var c = '当前团队的可用配额只有：' + (t.current_team.sub.quota - t.current_team.member_count) + '人';
                        if (t.current_team.is_owner)
                            if (t.current_team.edition === kzi.constant.team.edition.business) {
                                var u = '/teams/' + t.current_team.team_id + '/admin/quota';
                                c = c + ', 现在 <a href="' + u + '">修改团队配额</a>';
                            } else {
                                var d = '/teams/' + t.current_team.team_id + '/upgrade';
                                c = c + ', 现在 <a href="' + d + '">升级成商业版</a>';
                            }
                        else
                            c = c + ', 请联系团队负责人 ' + t.current_team.owner.display_name;
                        return i.$errors.unshift(c), void 0;
                    }
                    t.is_sending = true;
                    var p = t.invite_message, f = [];
                    wt.data.team.invite_member(s, a, p, f, function () {
                        e.global.loading_done = false, e.reload_team_members(s, function () {
                            n.path('/teams/' + s);
                        }, null, function () {
                            e.global.loading_done = true;
                        });
                    }, function () {
                        i.$errors.unshift('邀请失败，请重新再试');
                    }, function () {
                        t.is_sending = false;
                    });
                }
            }
        }, t.js_invite_enter = function (e, i) {
            t.js_invite_members(i);
        }, t.js_cancel_invite = function () {
            n.path('/teams/' + s);
        }, e.load_team_from_cache(s, function (i) {
            i && (t.current_team = i), e.load_team(s, function (i) {
                e.global.loading_done = true, t.current_team = i.info;
            }, function (i) {
                i.code === kzi.statuses.team_error.not_found.code ? (e.global.title = '团队未找到', t.permission = kzi.constant.permission.team_not_found) : i.code === kzi.statuses.error.permission_deny.code ? (e.global.title = '不是当前团队成员', t.permission = kzi.constant.permission.team_not_found) : wt.data.error(i);
            });
        });
    }
]);

innerApp.controller('team_member_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$timeout',
    '$popbox',
    function (e, t, i, n, a, s, o) {
        e.global.title = '团队成员';
        var r = i.team_id;
        t.selected_team_group = null, t.team_id = r, t.team_groups = [], t.team_group = {};
        var l = function (e) {
                _.each(angular.copy(e), function (e) {
                    e.is_selected = false, e.is_all = false;
                });
            }, c = function (i, n) {
                o.popbox({
                    target: i,
                    templateUrl: '/view/member/add_edit_team_group.html',
                    controller: [
                        '$scope',
                        'popbox',
                        'pop_data',
                        function (t, i, n) {
                            t.popbox = i, n.operation === kzi.constant.operation.update ? (t.team_group = angular.copy(n.team_group), t.title = '修改分组名称') : n.operation === kzi.constant.operation.add ? (t.team_group = {}, t.title = '新建分组') : (t.team_group = n.team_group, t.title = '确认删除分组', t.is_remove_action = true), t.js_close = function () {
                                i.close();
                            }, t.js_input_group_keydown = function () {
                                t.input_group_name_invalid() || t.js_save_team_group();
                            }, t.js_save_team_group = function () {
                                n.operation === kzi.constant.operation.update ? wt.data.team.update_group(r, t.team_group.group_id, t.team_group.name, function () {
                                    n.scope.team_group.name = t.team_group.name, t.js_close();
                                }, null, function () {
                                    t.group_saving = false;
                                }) : n.operation === kzi.constant.operation.add ? wt.data.team.add_group(r, t.team_group.name, function (i) {
                                    e.team.groups.push(i.data), t.js_close();
                                }, null, function () {
                                    t.group_saving = false;
                                }) : wt.data.team.del_group(r, t.team_group.group_id, function () {
                                    e.team.groups = _.reject(e.team.groups, function (e) {
                                        return e.group_id == t.team_group.group_id;
                                    }), t.js_close();
                                }, null, function () {
                                    t.group_saving = false;
                                });
                            };
                        }
                    ],
                    resolve: {
                        pop_data: function () {
                            return {
                                team_group: t.team_group,
                                team_groups: t.team_groups,
                                operation: n,
                                scope: t
                            };
                        }
                    }
                }).open();
            };
        t.js_select_team_group = function (i) {
            _.each(t.team_groups, function (e) {
                e.is_selected = e.group_id === i.group_id ? true : false;
            }), t.selected_team_group = i, wt.utility.team.filter_members_by_selected_group(e.team.members, i);
        }, t.js_add_group_pop = function (e) {
            e.stopPropagation(), e.preventDefault(), t.js_open_group_action_menu(e, null, true);
        }, t.js_edit_group_pop = function (e, i) {
            e.stopPropagation(), e.preventDefault(), t.team_group = i, c(e, kzi.constant.operation.update);
        }, t.js_delete_group = function (e, i) {
            e.stopPropagation(), e.preventDefault(), t.team_group = i, c(e, kzi.constant.operation.remove);
        }, t.js_open_group_action_menu = function (i, n, a) {
            o.popbox({
                target: i,
                templateUrl: '/view/member/pop_operate_member_group.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (t, i, n) {
                        t.popbox = i, t.js_close = function () {
                            i.close();
                        }, t.step = 0, t.js_step = function (e) {
                            t.step = e;
                        }, t.js_to_add_group = function () {
                            t.team_group = {}, t.is_add = true, t.title = '新建分组';
                        }, t.js_to_edit_group = function () {
                            t.team_group = angular.copy(n.team_group), t.title = '修改分组名称', t.is_add = false;
                        }, t.js_save_team_group = function () {
                            1 != n.is_add ? wt.data.team.update_group(r, t.team_group.group_id, t.team_group.name, function () {
                                n.team_group.name = t.team_group.name;
                                var a = _.findWhere(e.team.groups, { group_id: t.team_group.group_id });
                                null != a && (a.name = t.team_group.name), t.js_close();
                            }, null, function () {
                                t.group_saving = false;
                            }) : wt.data.team.add_group(r, t.team_group.name, function (i) {
                                e.team.groups.push(i.data), n.scope.team_groups.push(i.data), t.js_close();
                            }, null, function () {
                                t.group_saving = false;
                            });
                        }, t.js_delete_team_group = function () {
                            wt.data.team.del_group(r, t.team_group.group_id, function () {
                                e.team.groups = _.reject(e.team.groups, function (e) {
                                    return e.group_id == t.team_group.group_id;
                                }), n.scope.team_groups = _.reject(n.scope.team_groups, function (e) {
                                    return e.group_id == t.team_group.group_id;
                                }), t.js_close();
                            });
                        }, t.js_input_group_enter = function (e, i) {
                            t.input_group_name_invalid(i) || (t.group_saving = true, t.js_save_team_group());
                        }, t.input_group_name_invalid = function (e) {
                            return 1 != n.is_add ? e.$invalid || t.team_group.name == n.team_group.name : e.$invalid;
                        }, 1 == n.is_add ? (t.js_to_add_group(), t.js_step(1)) : t.js_to_edit_group();
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: t,
                            team_group: n,
                            is_add: a
                        };
                    }
                }
            }).open(), i.preventDefault(), i.stopPropagation();
        }, t.js_invite_member_pop = function (i) {
            o.popbox({
                target: i,
                templateUrl: '/view/member/pop_invite_team_member.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (t, i, n) {
                        t.popbox = i, t.js_close = function () {
                            i.close();
                        }, t.invite_members = [], t.invite_member_roles = kzi.constant.get_member_roles();
                        var a = {
                                role: kzi.constant.role.member,
                                email: ''
                            };
                        _.each([
                            1,
                            2,
                            3
                        ], function (e) {
                            var i = angular.copy(a);
                            i.input_name = 'member_email' + e, t.invite_members.push(i);
                        }), t.js_add_invite_member = function () {
                            var e = angular.copy(a);
                            e.input_name = 'member_email' + (t.invite_members.length + 1), t.invite_members.push(e);
                        }, t.js_delete_member = function (e, i) {
                            e.preventDefault(), t.invite_members = _.reject(t.invite_members, function (e) {
                                return e.index === i.index;
                            });
                        }, t.js_email_focus = function (e) {
                            e.$errors = [];
                        }, t.js_invite_members = function (i) {
                            var a = _.filter(t.invite_members, function (e) {
                                    return null !== e.email && '' !== e.email;
                                });
                            if (_.isEmpty(a))
                                return i.$errors.unshift('请至少输入一个邀请成员'), void 0;
                            var s = false;
                            if (_.each(a, function (e) {
                                    return kzi.validator.isEmail(e.email) ? void 0 : (i.$errors.unshift('邮箱格式输入不正确'), s = true, void 0);
                                }), !s) {
                                t.is_sending = true;
                                var o = t.invite_message;
                                wt.data.team.invite_member(r, a, o, function () {
                                    t.js_close(), e.global.loading_done = false, e.reload_team_members(r, function () {
                                        n.scope.reset_groups_members();
                                    }, null, function () {
                                        e.global.loading_done = true;
                                    });
                                }, function () {
                                    i.$errors.unshift('邀请失败，请重新再试');
                                }, function () {
                                    t.is_sending = false;
                                });
                            }
                        }, t.js_invite_enter = function (e, i) {
                            t.js_invite_members(i);
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: t };
                    }
                }
            }).open();
        }, t.add_ungrouped_members = function (e) {
            var i = _.findWhere(t.team_groups, { group_id: '-1' });
            return null == e || 0 == e.length ? (null != i && (t.team_groups = _.reject(t.team_groups, function (e) {
                return e.group_id == i.group_id;
            })), void 0) : (null == i ? t.team_groups.unshift({
                group_id: '-1',
                name: '未分组',
                is_all: false,
                is_selected: false,
                hidden_in_group_menu: true,
                members: e
            }) : i.members = e, void 0);
        }, t.reset_groups_members = function () {
            wt.utility.team.set_default_team_members(e.team.members), _.each(t.team_groups, function (t) {
                t.members = _.where(e.team.members, { group_id: t.group_id });
            });
            var i = _.where(e.team.members, { group_id: '-1' });
            t.add_ungrouped_members(i);
        }, t.member_draggable_options = {
            helper: 'clone',
            placeholder: 'wt-placeholder',
            containment: '.rightpanel',
            hoverClass: 't-member-state-on-draggable',
            zIndex: 2000,
            delay: 300,
            start: function (e, t) {
                t.helper.addClass('t-member-state-on-draggable');
            }
        }, t.group_droppable_options = {
            accept: '.card-item',
            hoverClass: 'group-state-member-over',
            drop: function (e, t) {
                var i = $(e.target).attr('file-id'), n = t.helper.attr('file-id');
                _.isEmpty(i) || _.isEmpty(n);
            }
        }, e.load_team(r, function () {
            e.load_team_members(r, function (i) {
                e.global.loading_done = true, null != e.team.groups && (null != i.groups && (t.team_groups = angular.copy(i.groups)), l(t.team_groups)), t.reset_groups_members(), t.team_groups.unshift({
                    group_id: 'all',
                    name: '全部',
                    is_all: true,
                    is_selected: true
                });
            });
        }, function (i) {
            i.code == kzi.statuses.team_error.not_found.code ? (e.global.title = '团队未找到', t.permission = kzi.constant.permission.team_not_found) : wt.data.error(i);
        });
    }
]);

innerApp.controller('team_member_pop_menu_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$timeout',
    'popbox',
    'pop_data',
    function (e, t, i, n, a, s, o) {
        var r = i.team_id;
        t.current_team = o.team, t.popbox = s, t.selected_member = o.parameters, t.js_close = function () {
            s.close();
        }, t.step = 0, t.js_step = function (e) {
            2 === e && (t.loading_unique_admin_prjs_done = false, wt.data.project.get_unique_admin_prjs(r, t.selected_member.uid, function (e) {
                t.unique_admin_prjs = e.data;
            }, null, function () {
                t.loading_unique_admin_prjs_done = true;
            })), t.step = e;
        }, t.js_set_group = function (i, n) {
            i && n && (e.global.loading_done = false, wt.data.team.set_group(r, i.uid, n.group_id, function () {
                i.group_id = n.group_id, wt.utility.team.filter_members_by_selected_group(e.team.members, o.$scope.selected_team_group), o.$scope.reset_groups_members(), t.js_close(), e.global.loading_done = true;
            }, function () {
                e.global.loading_done = true;
            }));
        }, t.js_delete_member = function (i) {
            e.is_deleting_member = true, o.$scope.delete_member(i, function () {
                t.js_close();
            }, function () {
                kzi.msg.error('删除成员出错，请重新再试！');
            }, function () {
                e.is_deleting_member = false;
            });
        }, t.js_cancel_invite = function (i) {
            e.is_canceling_invite = true, o.$scope.uninvite_member(i, function () {
                t.js_close();
            }, function () {
                kzi.msg.error('取消成员邀请出错，请重新再试！');
            }, function () {
                e.is_canceling_invite = false;
            });
        }, t.js_view_member_auth = function () {
            e.global.loading_done = false, wt.data.team.get_member_projects(r, t.selected_member.uid, function (i) {
                t.member_projects_auth = i.data, e.global.loading_done = true;
            }, function () {
                e.global.loading_done = true;
            });
        };
        var l = function (e) {
            wt.data.team.set_role(r, t.selected_member.uid, e, function () {
                t.selected_member.role = e;
            }, function () {
            });
        };
        if (t.js_set_user_as_admin = function () {
                l(kzi.constant.role.admin);
            }, t.js_set_user_as_member = function () {
                l(kzi.constant.role.member);
            }, t.selected_member.status === kzi.constant.status.pending && _.isEmpty(t.selected_member.invite_url) && o.team.curr_role === kzi.constant.role.admin) {
            var c = kzi.config.root_url + '/join?code=';
            wt.data.invite.get_invite_code(r, t.selected_member.uid, function (e) {
                t.selected_member.invite_url = c + e.data.invite_id;
            });
        }
        t.js_view_invite_code = function () {
            t.js_step(6);
        };
    }
]);

innerApp.controller('team_add_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function (e, t, i, n, a) {
        i.global.loading_done = true, i.global.title = '新建团队', e.js_add_team = function (t, n, s) {
            e.is_saving_team !== true && (e.is_saving_team = true, wt.data.team.add(n, s, function (e) {
                i.teams.push(e.data), a.path('/teams/' + e.data.team_id);
            }, null, function () {
                e.is_saving_team = false;
            }));
        }, e.js_cancel = function () {
            window.history.go(-1);
        };
    }
]);

innerApp.controller('team_setting_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function (e, t, i, n, a) {
        var s = t.team_id;
        e.js_set_current_menu = function (t) {
            e.current_menu = t;
        }, i.load_team(s, function (t) {
            var n = t.info;
            e.team = n, e.name = n.name, e.url = n.url, e.desc = n.desc, e.members = t.members, i.global.title = t.info.name, wt.data.project.get_unique_admin_prjs(s, i.global.me.uid, function (t) {
                e.unique_admin_prjs = t.data;
            }, null, function () {
                i.global.loading_done = true;
            });
        }, function (t) {
            i.global.loading_done = true, t.code == kzi.statuses.team_error.not_found.code ? (i.global.title = '团队未找到', e.permission = kzi.constant.permission.team_not_found) : t.code === kzi.statuses.error.permission_deny.code ? (i.global.title = '不是当前团队成员', e.permission = kzi.constant.permission.team_not_found) : wt.data.error(t);
        }), e.js_quit_team = function (t, n, s) {
            e.is_quiting !== true && s === n && (e.is_quiting = true, wt.data.team.leave(e.team.team_id, function () {
                i.refresh_cache.team.leave(e.team.team_id), a.path('dashboard');
            }, null, function () {
                e.is_quiting = false;
            }));
        };
    }
]);

innerApp.controller('free_apply_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$popbox',
    '$location',
    function (e, t, i) {
        i.global.title = '申请公益版', e.team_type = 1, e.team_desc = '', i.load_teams(function (t) {
            e.owner_teams = _.filter(t, function (e) {
                return e.is_owner;
            }), i.global.loading_done = true;
        }), e.js_free_apply = function () {
            e.is_applying !== true && (e.apply_success = true, e.is_applying = true, wt.data.team.commonweal_apply(e.selected_team.team_id, e.team_type, e.team_desc, function () {
                e.apply_success = true;
            }, null, function () {
                e.is_saving_team = false;
            }));
        };
    }
]);