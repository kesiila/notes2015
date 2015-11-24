"use strict";
(function(kzi){
    function statues() {
        var status = this,
            i = null,
            statusType = null,
            a = null;
        status.build_status = function (statusCode) {
            for (var key in statusCode){
                status[key] = statusCode[key];
            }
            status[key].type = "statusType"
        };
        status.getMsgByCode = function (t) {
            var i = status.getStatusByCode(t);
            return null != i && null != i.msg ? i.msg : "未知错误，错误码：[" + t + "]，请联系管理员。"
        };
        status.getStatusByCode = function (t) {
            if (null == i) {
                i = {};
                for (var n = status.getStatuses(), a = 0; n.length > a; a++) {
                    var s = n[a];
                    if (null != i[s.code]) throw new Error("有重复的Code(" + s.code + ").");
                    i[s.code] = s
                }
            }
            return i[t]
        };
        status.getStatuses = function () {
            if (null == a) {
                a = [], statusType = status.getStatusTypes();
                for (var i = 0; statusType.length > i; i++) {
                    var s = statusType[i];
                    for (var o in s) {
                        var r = s[o];
                        r.hasOwnProperty("code") && "object" == typeof r && null != r.code && a.push(new t(r.code, r.msg))
                    }
                }
            }
            return a
        };
        status.getStatusTypes = function () {
            if (null == statusType) {
                statusType = [];
                for (var e in this) {
                    var t = this[e];
                    this.hasOwnProperty(e) && e.length > 0 && "_" != e[0] && "object" == typeof t && "statusType" === t.type && statusType.push(t)
                }
            }
            return statusType
        }
    }
    function t(e, t) {
        this.code = e, this.msg = t, this.toString = function () {
            return this.code
        }
    }
    kzi.statuses = new statues;
    kzi.statuses.ok = 200;
    kzi.statuses.invalid_input = 401;
    kzi.statuses.not_found = 404;
    kzi.statuses.build_status({
        error: {
            sig: {
                code: 1001,
                msg: "错误的签名"
            },
            ver: {
                code: 1002,
                msg: "错误的接口版本号"
            },
            err_client_ver: {
                code: 1003,
                msg: "错误的接口版本号"
            },
            invalid_token: {
                code: 1004,
                msg: "无效的访问令牌"
            },
            permission_deny: {
                code: 1005,
                msg: "无权限访问"
            },
            server_error: {
                code: 500,
                msg: "服务端错误"
            },
            bad_req:{
                code:400,
                msg:"请求语法错误"
            },
                unknown: {
                code: 404,
                msg: "找不到资源"
            }
        },
        user_error: {
            not_found: {
                code: 2001,
                msg: "用户不存在"
            },
            invalid_user: {
                code: 2002,
                msg: "错误的用户"
            },
            login_err: {
                code: 2003,
                msg: "用户登录的时候出现异常"
            },
            invalid_userinfo: {
                code: 2004,
                msg: "用户登录失败，用户名或密码错"
            },
            not_login: {
                code: 2005,
                msg: "没有登录,无权限访问"
            },
            signup_error: {
                code: 2006,
                msg: "登录错误"
            },
            get_user_error: {
                code: 2007,
                msg: "获取用户错误"
            },
            search_user_error: {
                code: 2008,
                msg: "搜索用户错误"
            },
            update_user_error: {
                code: 2009,
                msg: "更新用户错误"
            },
            update_avatar_error: {
                code: 2010,
                msg: "更新头像错误"
            },
            change_pwd_error: {
                code: 2011,
                msg: "修改密码错误"
            },
            check_email_error: {
                code: 2012,
                msg: "检查邮箱错误"
            },
            check_name_error: {
                code: 2013,
                msg: "检查用户名错误"
            },
            invalid_pwd_error: {
                code: 2014,
                msg: "验证密码错误"
            },
            email_not_exist: {
                code: 2015,
                msg: "邮件不存在"
            },
            forgot_apply_error: {
                code: 2016,
                msg: "重置密码错误"
            },
            invalid_token_error: {
                code: 2017,
                msg: "无效的身份"
            },
            prefs_get_error: {
                code: 2018,
                msg: "获取个性化设置错误"
            },
            prefs_set_error: {
                code: 2019,
                msg: "设置个性化设置错误"
            },
            invalid_name_error: {
                code: 2020,
                msg: "用户名无效"
            },
            email_has_exist: {
                code: 2021,
                msg: "邮箱地址已经存在"
            },
            name_has_exist: {
                code: 2022,
                msg: "用户名已经存在"
            },
            change_email_error: {
                code: 2023,
                msg: "修改邮箱地址失败"
            },
            email_match_error: {
                code: 2024,
                msg: "邮箱地址匹配失败"
            },
            get_secret_error: {
                code: 2025,
                msg: "获取验证密钥失败"
            },
            enable_twofactor_error: {
                code: 2026,
                msg: "启动验证失败"
            },
            disable_twofactor_error: {
                code: 2027,
                msg: "禁用验证失败"
            },
            twofactor_match_error: {
                code: 2028,
                msg: "验证匹配错误"
            },
            recovery_match_error: {
                code: 2029,
                msg: "验证匹配错误"
            },
            update_trade_error: {
                code: 2030,
                msg: "修改行业信息错误"
            },
            account_not_active: {
                code: 2031,
                msg: "帐号未激活"
            },
            account_frozen: {
                code: 2032,
                msg: "帐号已冻结"
            },
            account_waste: {
                code: 2033,
                msg: "帐号已废弃"
            }

        },
        team_error: {
            not_found: {
                code: 4001,
                msg: "团队不存在"
            },
            invalid_team: {
                code: 4002,
                msg: "错误的用户"
            },
            user_team_error: {
                code: 4003,
                msg: "用户团队错误"
            },
            create_team_error: {
                code: 4004,
                msg: "创建团队错误"
            },
            update_team_error: {
                code: 4005,
                msg: "团队更新错误"
            },
            del_team_error: {
                code: 4006,
                msg: "删除团队错误"
            },
            member_add_error: {
                code: 4007,
                msg: "添加会员错误"
            },
            member_get_error: {
                code: 4008,
                msg: "获取会员错误"
            },
            member_remove_error: {
                code: 4009,
                msg: "移除会员错误"
            },
            member_role_error: {
                code: 4010,
                msg: "会员角色错误"
            },
            member_group_error: {
                code: 4011,
                msg: "会员分组错误"
            },
            group_add_error: {
                code: 4012,
                msg: "添加团队成员分组错误"
            },
            group_remove_error: {
                code: 4013,
                msg: "移除团队成员分组错误"
            },
            group_update_error: {
                code: 4014,
                msg: "更新团队成员分组错误"
            },
            group_get_error: {
                code: 4015,
                msg: "获取团队成员分组错误"
            },
            trans_team_error: {
                code: 4016,
                msg: "转换团队错误"
            },
            get_team_error: {
                code: 4017,
                msg: "获取团队错误"
            },
            update_logo_error: {
                code: 4018,
                msg: "更新团队logo错误"
            },
            set_current_error: {
                code: 4019,
                msg: "设置当前团队正确"
            },
            member_invite_error: {
                code: 4020,
                msg: "邀请成员错误"
            },
            member_uninvite_error: {
                code: 4021,
                msg: "取消邀请成员错误"
            },
            member_projects_error: {
                code: 4022,
                msg: "获取成员群组错误"
            }
        },
        prj_error: {
            not_found: {
                code: 5001,
                msg: "群组不存在"
            },
            invalid_prj: {
                code: 5002,
                msg: "错误的群组"
            },
            user_prj_error: {
                code: 5003,
                msg: "用户群组错误"
            },
            create_prj_error: {
                code: 5004,
                msg: "创建群组错误"
            },
            prj_name_exist: {
                code: 5005,
                msg: "同一团队下的群组名重复"
            },
            prj_activity_error: {
                code: 5006,
                msg: "获取群组活动错误"
            },
            update_prj_error: {
                code: 5007,
                msg: "群组更新错误"
            },
            update_prj_pic_error: {
                code: 5008,
                msg: "群组封面更新错误"
            },
            remove_only_admin_error: {
                code: 5009,
                msg: "只有一个管理员用户，不允许从群组移除成员。"
            },
            add_member_error: {
                code: 5010,
                msg: "添加群组成员错误"
            },
            remove_member_error: {
                code: 5011,
                msg: "移除群组成员错误"
            },
            close_prj_error: {
                code: 5012,
                msg: "关闭群组失败"
            },
            del_sys_prj: {
                code: 5013,
                msg: "默认分组不可删除"
            }
        },
        entry_error: {
            not_found: {
                code: 6001,
                msg: "列表不存在"
            },
            invalid_entry: {
                code: 6002,
                msg: "错误的列表"
            },
            create_entry_error: {
                code: 6003,
                msg: "创建列表错误"
            },
            update_entry_error: {
                code: 6004,
                msg: "列表更新错误"
            },
            get_entry_error: {
                code: 6005,
                msg: "获取列表错误"
            },
            trash_entry_error: {
                code: 6006,
                msg: "回收列表错误"
            },
            del_entry_error: {
                code: 6007,
                msg: "删除列表错误"
            },
            archive_entry_error: {
                code: 6008,
                msg: "列表存档错误"
            },
            pos_entry_error: {
                code: 6009,
                msg: "还原列表错误"
            }
        },
        task_error: {
            not_found: {
                code: 7001,
                msg: "活动不存在"
            },
            invalid_task: {
                code: 7002,
                msg: "错误的活动"
            },
            create_task_error: {
                code: 7003,
                msg: "创建活动错误"
            },
            update_task_error: {
                code: 7004,
                msg: "活动更新错误"
            },
            task_activity_error: {
                code: 7005,
                msg: "获取活动活动错误"
            },
            task_add_user_error: {
                code: 7006,
                msg: "添加活动成员错误"
            },
            get_task_list_error: {
                code: 7007,
                msg: "获取活动错误"
            },
            get_task_items_error: {
                code: 7008,
                msg: "加载活动条目列表失败"
            },
            get_task_attachments_error: {
                code: 7009,
                msg: "加载活动条目附件失败"
            },
            task_del_user_error: {
                code: 7010,
                msg: "移除活动成员失败"
            },
            add_task_item_error: {
                code: 7011,
                msg: "添加活动条目失败"
            },
            change_task_item_status_error: {
                code: 7012,
                msg: "修改活动条目状态失败"
            },
            del_task_item_error: {
                code: 7013,
                msg: "移除活动条目失败"
            },
            update_task_item_error: {
                code: 7014,
                msg: "更新活动条目失败"
            },
            del_comment_error: {
                code: 7015,
                msg: "删除评论失败"
            },
            update_task_tag_error: {
                code: 7016,
                msg: "定义活动标签失败"
            },
            todo_update_error: {
                code: 7017,
                msg: "更新TODO错误"
            },
            todo_checked_error: {
                code: 7018,
                msg: "完成检查项错误"
            },
            todo_unchecked_error: {
                code: 7019,
                msg: "设置检查项错误"
            },
            todo_position_error: {
                code: 7020,
                msg: "todo_position_error"
            },
            watcher_add_error: {
                code: 7021,
                msg: "watcher_add_error"
            },
            watcher_remove_error: {
                code: 7022,
                msg: "watcher_remove_error"
            },
            share_task_error: {
                code: 7023,
                msg: "分享活动错误"
            },
            task_ispublished: {
                code: 7024,
                msg: "活动已分享"
            },
            task_info_err: {
                code: 7025,
                msg: "活动公司名，联系人和邮件都为空"
            },
            task_email_err: {
                code: 7026,
                msg: "活动邮件无效"
            },
            get_tasks_forme_error: {
                code: 7033,
                msg: "获取我的活动错误"
            }
        },
        file_error: {
            not_found: {
                code: 8001,
                msg: "找不到文件"
            },
            invalid_file: {
                code: 8002,
                msg: "文件无效"
            },
            create_file_error: {
                code: 8003,
                msg: "创建文件错误"
            },
            update_file_error: {
                code: 8004,
                msg: "上次文件错误"
            },
            trash_file_error: {
                code: 8005,
                msg: "回收文件错误"
            },
            del_file_error: {
                code: 8006,
                msg: "删除文件错误"
            },
            get_file_error: {
                code: 8007,
                msg: "获取文件错误"
            },
            get_list_error: {
                code: 8008,
                msg: "获取文件列表错误"
            },
            version_new_error: {
                code: 8009,
                msg: "上次新版本错误"
            },
            version_get_error: {
                code: 8010,
                msg: "获取新版本错误"
            },
            get_attach_error: {
                code: 8011,
                msg: "获取附件错误"
            },
            attach_file_error: {
                code: 8012,
                msg: "关联附件错误"
            },
            detach_file_error: {
                code: 8013,
                msg: "取消附件关联错误"
            },
            get_targets_error: {
                code: 8014,
                msg: "获取标签错误"
            },
            generate_thumbnail_error: {
                code: 8308,
                msg: "获取标签错误"
            }
        },
        comment_error: {
            not_found: {
                code: 20001,
                msg: "找不到评论"
            },
            add_error: {
                code: 20002,
                msg: "添加评论错误"
            },
            update_error: {
                code: 20003,
                msg: "更新评论错误"
            },
            delete_error: {
                code: 20004,
                msg: "删除评论错误"
            },
            get_error: {
                code: 20005,
                msg: "获取评论错误"
            }
        },
        watch_error: {
            not_found: {
                code: 21001,
                msg: "找不到关注"
            },
            add_error: {
                code: 21002,
                msg: "添加关注错误"
            },
            remove_error: {
                code: 21003,
                msg: "移除关注错误"
            },
            get_watcher_error: {
                code: 21004,
                msg: "获取关注错误"
            },
            get_watch_forme_error: {
                code: 21005,
                msg: "移除关注错误"
            }
        },
        post_error: {
            not_found: {
                code: 9001,
                msg: "问答不存在"
            },
            share_err: {
                code: 9002,
                msg: "问答分享失败"
            },
            update_err: {
                code: 9003,
                msg: "问答修改失败"
            },
            praised_err:{
                code:9004,
                msg:"已经赞过"
            }
        },
        page_error: {
            not_found: {
                code: 10001,
                msg: "文档不存在"
            }
        },
        upload_error: {
            upload_error: {
                code: 22001,
                msg: "上传错误"
            }
        },
        notice_error: {
            get_unread_error: {
                code: 23001,
                msg: "获取未读通知错误"
            },
            get_list_error: {
                code: 23002,
                msg: "获取通知列表错误"
            },
            set_all_read_error: {
                code: 23003,
                msg: "设置通知已读错误"
            }
        },
        activity_error: {
            get_list_error: {
                code: 24001,
                msg: "获取活动列表错误"
            }
        },
        invite_error: {
            invalid_invite_code: {
                code: 25001,
                msg: "邀请错误"
            },
            accept_invite_code: {
                code: 25002,
                msg: "接受邀请错误"
            },
            join_invite_code: {
                code: 25003,
                msg: "补充资料并接受邀请错误"
            },
            refuse_invite_code: {
                code: 25004,
                msg: "拒绝邀请错误"
            },
            get_invite_code: {
                code: 25005,
                msg: "获取邀请码错误"
            },
            get_new_invite_code: {
                code: 25006,
                msg: "获取最新邀请码错误"
            }
        },
        others: {
            invalid_input: {
                code: 401,
                msg: "输入格式不正确"
            }
        }
    })
})(kzi);