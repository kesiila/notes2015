'use strict';
innerApp.controller('team_admin_summary_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    function ($rootScope, $scope, $routeParams, $location) {
        $rootScope.global.title = '团队设置';
        var o = $routeParams.team_id;
        $scope.team_id = o, $scope.current_menu = 'summary', $rootScope.global.loading_done = true, wt.data.team.summary(o, function (e) {
            $scope.team = e.data.info, $scope.name = $scope.team.name, $scope.desc = $scope.team.desc, $scope.sub = e.data.sub;
            var i = 100 * $scope.team.member_count /10, n = 100 * $scope.team.invite_count /10;
            $scope.member_stacked = [
                {
                    value: i,
                    type: 'success'
                },
                {
                    value: n,
                    type: 'warning'
                }
            ];
            var a = 100 * $scope.team.active_count / $scope.team.project_count, s = 100 * $scope.team.archived_count / $scope.team.project_count;
            $scope.project_stacked = [
                {
                    value: a,
                    type: 'success'
                },
                {
                    value: s,
                    type: 'info'
                }
            ], $scope.part_loading_done = true;
        }, function () {
            $location.path('/teams/' + o);
        });
    }
]);

innerApp.controller('team_admin_basic_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n, a, s) {
        e.global.title = '团队设置';
        var o = i.team_id;
        t.team_id = o, t.current_menu = 'basic', t.dismiss_step = 1, t.transfer_step = 1, e.global.loading_done = true, wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.name = t.team.name, t.desc = t.team.desc, t.sub = e.data.sub, t.part_loading_done = true;
        }, function () {
            n.path('/teams/' + o);
        }), t.js_set_team = function (i, n, a, s) {
            a || (a = ''), s || (s = ''), (t.team.name !== n || t.team.desc !== a || t.team.url !== s) && (t.is_team_saveing = true, wt.data.team.update(o, n, a, s, function (i) {
                t.team.name = i.data.name, t.team.desc = i.data.desc, t.team.url = i.data.url;
                var r = _.findWhere(e.teams, { team_id: o });
                r && (r.name = n, r.desc = a, r.url = s), kzi.msg.success('修改团队基本信息成功！');
            }, function () {
                kzi.msg.error('修改团队基本信息失败！');
            }, function () {
                t.is_team_saveing = false;
            }));
        }, t.js_transfer_pop = function (i) {
            s.popbox({
                target: i,
                placement: 'bottom',
                templateUrl: '/view/team/pop_transfer_team.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (t, i, n) {
                        t.popbox = i, t.step = 0, t.js_step = function (e) {
                            t.step = e;
                        }, t.members_loading_done = false, t.team_members = null, e.load_team_members(o, function (i) {
                            t.team_members = _.reject(i.members, function (t) {
                                return t.uid === e.global.me.uid || t.status === kzi.constant.status.pending;
                            });
                        }, function () {
                            t.members_loading_done = true;
                        }, function () {
                            t.members_loading_done = true;
                        }), t.js_to_transfer = function () {
                            t.members_loading_done = false, t.team_members = null, e.load_team_members(o, function (i) {
                                t.team_members = _.reject(i.members, function (t) {
                                    return t.uid === e.global.me.uid || t.status === kzi.constant.status.pending;
                                });
                            }, function () {
                                t.members_loading_done = true;
                            }, function () {
                                t.members_loading_done = true;
                            });
                        }, t.js_to_transfer_confirm = function (e) {
                            t.selected_member = e, n.scope.selected_member = e, n.scope.js_transfer_step(2), i.close();
                        }, t.js_close = function () {
                            i.close();
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: t };
                    }
                }
            }).open();
        }, t.js_dismiss_step = function (e) {
            t.dismiss_step = e;
        }, t.js_transfer_step = function (e) {
            t.transfer_step = e;
        }, t.js_dismiss = function (i, a) {
            t.is_dismissing !== true && a === i && (t.is_dismissing = true, wt.data.team.dismiss(o, function () {
                e.refresh_cache.team.dismiss(o), n.path('dashboard');
            }, null, function () {
                t.is_dismissing = false;
            }));
        }, t.js_transfer = function () {
            t.is_transferring = true, wt.data.team.transfer(o, t.selected_member.uid, function () {
                t.team.is_owner = 0, t.team.owner = t.selected_member, n.path('/teams/' + o);
            }, null, function () {
                t.is_transferring = false;
            });
        };
    }
]);

innerApp.controller('team_admin_billing_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'billing';
        var o = i.team_id;
        t.team_id = o, wt.data.team.summary(o, function (i) {
            t.team = i.data.info, t.sub = i.data.sub, e.global.loading_done = true, wt.data.team.get_billings(o, 1, function (e) {
                t.billings = e.data.billings;
            });
        }, function () {
            n.path('/teams/' + o);
        });
    }
]);

innerApp.controller('team_admin_payment_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'payment';
        var o = i.team_id;
        t.team_id = o;
        var r = function (e) {
            t.payments = null, wt.data.team.get_payments(o, e, function (i) {
                t.payments = i.data.payments, (1 === e || '1' === e) && (t.payments_pagination_opts = {
                    totalCount: i.data.total_count,
                    opts: {
                        callback: function (e) {
                            r(e + 1);
                        }
                    }
                });
            });
        };
        wt.data.team.summary(o, function (i) {
            t.team = i.data.info, t.sub = i.data.sub, e.global.loading_done = true, r(1);
        }, function () {
            n.path('/teams/' + o);
        }), t.js_cancel_payment = function (e) {
            t.payments = _.reject(t.payments, function (t) {
                return t.pay_id === e.pay_id;
            }), wt.data.team.cancel_payment(o, e.pay_id, function () {
            });
        };
    }
]);

innerApp.controller('team_admin_members_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n, a, s) {
        e.global.title = '团队设置', t.current_menu = 'members';
        var o = i.team_id;
        t.team_id = o, e.global.loading_done = true, wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub;
            var i = 100 * t.team.member_count / t.sub.quota, n = 100 * t.team.invite_count / t.sub.quota;
            t.stacked = [
                {
                    value: i,
                    type: 'success'
                },
                {
                    value: n,
                    type: 'warning'
                }
            ], wt.data.team.get_account_members(o, function (e) {
                t.account_members = e.data;
            }, null, function () {
                t.part_loading_done = true;
            });
        }, function () {
            n.path('/teams/' + o);
        }), t.delete_member = function (i, n, a, s) {
            wt.data.team.del_member(o, i.uid, function (a) {
                t.account_members = _.reject(t.account_members, function (e) {
                    return e.uid === i.uid;
                }), e.refresh_cache.user.remove(i.uid), _.isFunction(n) && n(a);
            }, a, s);
        }, t.uninvite_member = function (i, n, a, s) {
            wt.data.team.uninvite_member(o, i.uid, function (a) {
                t.account_members = _.reject(t.account_members, function (e) {
                    return e.uid === i.uid;
                }), e.refresh_cache.user.remove(i.uid), _.isFunction(n) && n(a);
            }, a, s);
        }, t.js_show_member_menu = function (e, i, n) {
            s.popbox({
                target: e,
                templateUrl: '/view/team/pop_member_menu.html',
                controller: 'team_member_pop_menu_ctrl',
                resolve: {
                    pop_data: function () {
                        return {
                            $scope: t,
                            parameters: i,
                            team: n
                        };
                    }
                }
            }).open();
        };
    }
]);

innerApp.controller('team_admin_change_quota_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'members';
        var o = i.team_id;
        t.team_id = o, e.global.loading_done = true, wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, t.team_quota = e.data.sub.quota, t.part_loading_done = true;
        }, function () {
            n.path('/teams/' + o);
        }), t.js_change_team_quota = function () {
            return null == t.team_quota || isNaN(t.team_quota) ? (t.change_quota_error = '团队成员配额必须为数字', void 0) : t.team.member_count + t.team.invite_count > t.team_quota ? (t.change_quota_error = '团队成员配额必须大于或者等于当前团队成员数', void 0) : (t.is_changing = true, wt.data.team.change_subscription(o, t.team_quota, function (e) {
                e.data === kzi.constant.subscription.step.pay_online ? n.path('/teams/' + o + '/pay') : n.path('/teams/' + o + '/admin/summary');
            }, null, function () {
                t.is_changing = false;
            }), void 0);
        }, t.js_team_quota_focus = function () {
            t.change_quota_error = null;
        };
    }
]);

innerApp.controller('team_admin_projects_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'projects';
        var o = i.team_id;
        t.team_id = o, e.global.loading_done = true, wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub;
            var i = 100 * t.team.active_count / t.team.project_count, n = 100 * t.team.archived_count / t.team.project_count;
            t.stacked = [
                {
                    value: i,
                    type: 'success'
                },
                {
                    value: n,
                    type: 'info'
                }
            ], wt.data.team.get_account_projects(o, function (e) {
                t.account_projects = e.data;
            }, null, function () {
                t.part_loading_done = true;
            });
        }, function () {
            n.path('/teams/' + o);
        });
    }
]);

innerApp.controller('team_admin_security_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'security';
        var o = i.team_id;
        t.team_id = o, e.global.loading_done = true;
        var r = function (e) {
                _.isEmpty(e) || _.each(e, function (e) {
                    switch (e.template) {
                    case 'team_member_add':
                        e.verb_display = '添加团队成员 ( ' + e.member.display_name + ' )';
                        break;
                    case 'team_member_remove':
                        e.verb_display = '移除团队成员 ( ' + e.member.display_name + ' )';
                        break;
                    case 'team_upgrade':
                        e.verb_display = '升级团队到商业版';
                        break;
                    case 'team_degrade':
                        e.verb_display = '降级团队到免费版';
                        break;
                    case 'project_member_add':
                        e.verb_display = '添加群组成员 ( ' + e.project.name + ' | ' + e.member.display_name + ' )';
                        break;
                    case 'project_member_remove':
                        e.verb_display = '移除群组成员 ( ' + e.project.name + ' | ' + e.member.display_name + ' )';
                        break;
                    case 'project_add':
                        e.verb_display = '添加群组 (' + e.project.name + ' )';
                        break;
                    case 'project_delete':
                        e.verb_display = '删除群组 (' + e.project.name + ' )';
                    }
                });
            }, l = function (e) {
                t.security_histories = null, t.loading_histories_done = false, wt.data.team.get_security_histories(o, e, function (i) {
                    r(i.data.histories), t.histories = i.data.histories, (1 === e || '1' === e) && (t.totalCount = i.data.totalCount, t.security_pagination_opts = {
                        totalCount: i.data.total_count,
                        opts: {
                            callback: function (e) {
                                l(e + 1);
                            }
                        }
                    });
                }, null, function () {
                    t.loading_histories_done = true, t.part_loading_done = true;
                });
            };
        wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, l(1);
        }, function () {
            n.path('/teams/' + o);
        });
    }
]);

innerApp.controller('team_admin_export_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'export';
        var o = i.team_id;
        t.team_id = o, e.global.loading_done = true;
        var r = function (e) {
            t.bulkexports = null, t.part_loading_done = false, wt.data.team.get_bulk_export(o, e, function (i) {
                t.bulkexports = i.data.bulkexports, (1 === e || '1' === e) && (t.totalCount = i.data.totalCount, t.exports_pagination_opts = {
                    totalCount: i.data.total_count,
                    opts: {
                        callback: function (e) {
                            r(e + 1);
                        }
                    }
                });
            }, null, function () {
                t.part_loading_done = true;
            });
        };
        wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, r(1);
        }, function () {
            n.path('/teams/' + o);
        }, function () {
        }), t.js_export_data = function () {
            t.bulk_exporting = true, wt.data.team.bulk_export(o, function () {
                t.bulk_export_success = true, r(1);
            }, null, function () {
                t.bulk_exporting = false;
            });
        };
    }
]);

innerApp.controller('team_admin_consultant_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'consultant';
        var o = i.team_id;
        t.team_id = o, e.global.loading_done = true, wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, t.part_loading_done = true;
        }, function () {
            n.path('/teams/' + o);
        });
    }
]);

innerApp.controller('team_admin_pay_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    '$timeout',
    function (e, t, i, n, a, s, o) {
        e.global.title = '团队设置', t.current_menu = 'payment';
        var l = i.team_id;
        t.team_id = l, e.global.loading_done = true, wt.data.team.summary(l, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, wt.data.team.payment(l, function (e) {
                t.payment_no = e.data, t.part_loading_done = true;
            }), t.pay_amounts = [
                {
                    amount: 12 * 10 * t.sub.quota,
                    month_count: 12,
                    display_time: '一年',
                    presentation: 0
                },
                {
                    amount: 6 * 10 * t.sub.quota,
                    month_count: 6,
                    display_time: '半年',
                    presentation: 0
                },
                {
                    amount: 3 * 10 * t.sub.quota,
                    month_count: 3,
                    display_time: '3个月',
                    presentation: 0
                },
                {
                    amount: 10 * t.sub.quota,
                    month_count: 1,
                    display_time: '1个月',
                    presentation: 0
                }
            ];
        }, function () {
            n.path('/teams/' + l);
        }), t.js_selected_amount = function (e, i) {
            t.selected_amount = e, i.$errors = [];
        }, t.js_pay = function (e) {
            if (_.isEmpty(t.selected_amount))
                return e.$errors = ['请选择充值金额！'], void 0;
            var i = r.dialog({
                    backdrop: true,
                    keyboard: true,
                    backdropClick: false,
                    templateUrl: '/view/common/pay_dialog.html',
                    controller: [
                        '$scope',
                        function (e) {
                            e.js_pay_complete = function () {
                                i.close(), n.path('teams/' + l + '/admin/payment');
                            }, e.js_pay_exception = function () {
                                i.close(), n.path('teams/' + l + '/admin/payment');
                            };
                        }
                    ]
                });
            i.open();
        };
    }
]);

innerApp.controller('team_admin_pay_coupon_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    '$timeout',
    function (e, t, i, n) {
        e.global.title = '团队设置', e.global.loading_done = true, t.current_menu = 'payment';
        var l = i.team_id;
        t.team_id = l, wt.data.team.summary(l, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, t.part_loading_done = true;
        }, function () {
            n.path('/teams/' + l);
        }), t.js_redeem_coupon_focus = function () {
            t.redeem_coupon_error = null;
        }, t.js_redeem_coupon = function () {
            return _.isEmpty(t.coupon_code) ? (t.redeem_coupon_error = '请输入代金券序列号', void 0) : (t.is_redeeming = true, wt.data.team.redeem_coupon(l, t.coupon_code, function () {
                n.path('/teams/' + l + '/admin/payment');
            }, function () {
                t.redeem_coupon_error = '代金券已经使用或者不存在，请重新输入！';
            }, function () {
                t.is_redeeming = false;
            }), void 0);
        };
    }
]);

innerApp.controller('team_admin_upgrade_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'summary';
        var o = i.team_id;
        t.team_id = o, e.global.loading_done = true, wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, t.part_loading_done = true;
        }, function () {
            n.path('/teams/' + o);
        }), t.js_upgrade_team = function () {
            return null == t.team_quota || isNaN(t.team_quota) ? (t.upgrade_error = '团队成员配额必须为数字', void 0) : t.team.member_count + t.team.invite_count > t.team_quota ? (t.upgrade_error = '团队成员配额必须大于或者等于当前团队成员数', void 0) : (t.is_upgrading = true, wt.data.team.upgrade(o, t.team_quota, function (e) {
                e.data === kzi.constant.subscription.step.pay_online ? n.path('/teams/' + o + '/pay') : n.path('/teams/' + o + '/admin/summary');
            }, null, function () {
                t.is_upgrading = false;
            }), void 0);
        }, t.js_team_quota_focus = function () {
            t.upgrade_error = null;
        };
    }
]);

innerApp.controller('team_admin_degrade_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    '$http',
    '$popbox',
    function (e, t, i, n) {
        e.global.title = '团队设置', t.current_menu = 'summary', e.global.loading_done = true;
        var o = i.team_id;
        t.team_id = o, wt.data.team.summary(o, function (e) {
            t.team = e.data.info, t.sub = e.data.sub, t.team_quota = e.data.quota, t.team.member_count + t.team.invite_count > 10 && (t.degrade_disabled = true, t.degrade_error = '您当前团队的成员人数已经大于免费版的最高配额10人，删除成员后后才能降级成免费版'), t.part_loading_done = true;
        }, function () {
            n.path('/teams/' + o);
        }), t.js_degrade_team = function () {
            t.is_degrading = true, wt.data.team.degrade(o, function () {
                n.path('/teams/' + o + '/admin/summary');
            }, function () {
                t.degrade_error = '降级失败，请重新再试';
            }, function () {
                t.is_degrading = false;
            });
        };
    }
]);