'use strict';
innerApp.controller('account_settings_ctrl', [
    '$rootScope',
    '$scope',
    '$sce',
    '$window',
    function ($rootScope, $scope, $sce, $window) {
        $rootScope.global.title = '基本设置';
        $scope.current_menu = 'settings';
        $scope.current_tab = 'basic';
        $scope.email_step = 1;
        $scope.upload_enabled = true;
        $scope.token = kzi.get_cookie('sid');
        $scope.part_loading_done = false;
        $scope.action_url = $rootScope.global.config.box_url() + '?pid=avatar&token=' + $rootScope.global.me.token;

        $sce.trustAsUrl($scope.action_url);
        $scope.change_tab = function (e) {
            $scope.current_tab !== e && ($scope.current_tab = e, $scope.send_success = false,
                $scope.update_user_success = false, $scope.change_pwd_success = false);
        },


            $scope.part_loading_done = true;

        var uid = $rootScope.global.me.uid;

        var init = function () {
            wt.data.user.get_info(uid, function (result) {
                $scope.user_info = result.data;
                $scope.email = result.data.email;
                $scope.reply_email = result.data.reply_email;
                $scope.display_name = result.data.display_name;
                $scope.companyName = result.data.companyName;
                $scope.currentMainIndustryCode = result.data.f_tradecode;
                $scope.currentSubIndustryCode = result.data.s_tradeCode;
                $scope.currentMainIndustryName = result.data.f_tradename;
                $scope.currentSubIndustryName = result.data.s_tradename;

            }, function () {
                kzi.msg.error('个人信息获取失败！');
            }, null);
        }
        //初始化用户数据，填进页面
        init();

        //修改用户信息部分
        $scope.js_user_update = function () {
            if ($scope.display_name == $scope.user_info.display_name && $scope.companyName == $scope.user_info.companyName) {
                $scope.info_err = "新信息和原信息一致！";
            }
            else {
                ($scope.display_name != $rootScope.global.me.display_name || $scope.companyName != $rootScope.global.me.companyName)
                &&
                (
                    wt.data.user.update(uid, $scope.display_name, $scope.companyName, function () {
                        $scope.update_user_success = true;
                        kzi.msg.success('修改个人资料成功！');
                        $scope.user_info.display_name = $scope.display_name;
                        $scope.user_info.companyName = $scope.companyName;
                        /***************************** 同步session内的信息 **********************************************/
                        $rootScope.global.me.display_name = $scope.display_name;
                        $rootScope.global.me.companyName = $scope.companyName;
                        window.sessionStorage.display_name = $scope.display_name;
                        window.sessionStorage.companyName = $scope.companyName;
                    }, function () {
                        kzi.msg.error('修改个人资料失败！');
                    }, null),
                        $rootScope.refresh_cache.user.update($rootScope.global.me.uid, $scope.display_name, $scope.companyName));
            }

        };


        //修改登录密码部分
        $scope.pwd_err = null;//修改密码区域错误信息

        $scope.oddPwd = null;
        $scope.pwd1 = null;
        $scope.pwd2 = null;

        //清空修改密码区域错误信息
        $scope.clearPwdErr = function () {
            $scope.pwd_err = null;
        };

        //检查两次密码是否一致
        $scope.checkTPwd = function () {
            ($scope.pwd_err = ($scope.pwd1.length < 6 || $scope.pwd2.length < 6) ? "密码长度不能低于6位！" : null)
            ||
            ($scope.pwd_err = ($scope.pwd1 != null && $scope.pwd2 != null) && ($scope.pwd1 != $scope.pwd2) ? "两次输入的密码不一致！" : null);
        };

        //修改登录密码
        $scope.user_change_pwd = function () {
            wt.data.user.change_pwd(uid, md5($scope.oddPwd), md5($scope.pwd1), function () {
                $scope.pwd_err = null;
                kzi.msg.success('登录密码修改成功！');
            }, function () {
                $scope.pwd_err = '原密码输入错误';
            }, function () {
                $scope.is_changing_pwd = false;
            });
        };

        //修改用户行业信息
        $scope.user_change_trade = function () {
            wt.data.user.change_trade(uid, $scope.currentMainIndustryCode, $scope.currentSubIndustryCode, function () {
                kzi.msg.success('所在行业信息修改成功！');
                $scope.user_info.f_tradecode = $scope.currentMainIndustryCode;
                $scope.user_info.s_tradeCode = $scope.currentSubIndustryCode == null ? $scope.currentMainIndustryCode : $scope.currentSubIndustryCode;
                $window.sessionStorage.mainIndustryCode = $scope.currentMainIndustryCode;
                $window.sessionStorage.subIndustryCode = $scope.currentSubIndustryCode == null ? $scope.currentMainIndustryCode : $scope.currentSubIndustryCode;
            }, function () {
                kzi.msg.error('所在行业信息修改失败！');
            }, function () {
                $scope.is_changing_pwd = false;
            });
        };

        //修改用户邮件地址
        $scope.user_change_email = function (type) {
            var e = type ? $scope.email : $scope.reply_email;
            wt.data.user.change_email(uid, e, type, function () {
                kzi.msg.success('邮件地址修改成功！');
                type == 1 ? ($scope.user_info.email = e, window.sessionStorage.email = e, $rootScope.global.me.email = e)
                    : ($scope.user_info.reply_email = e, window.sessionStorage.reply_email = e, $rootScope.global.me.reply_email = e);
            }, function (res) {

                var msg = res.code == 2021 ? '邮箱地址已被占用，请更换！' : '程序异常，邮件地址修改失败！';

                kzi.msg.error(msg);
            }, function () {
                $scope.is_changing_pwd = false;
            });
        };


        $scope.avatar_upload_option = {
            processstart: function () {
                $scope.upload_enabled = false;
            },
            process: function (e, t) {
                var i = 0;
                _.isEmpty(t.files) || (i = t.files[0].size), $('[name=file_upload]').fileupload({
                    formData: {
                        size: i,
                        target: 'avatar'
                    }
                });
            },
            processfail: function (e, i) {
                !_.isEmpty(i.files) && i.files.error && _.each(i.files, function (e) {
                    e.error && kzi.msg.error(e.error);
                }), $scope.upload_enabled = true;
            },
            done: function (i, n) {
                if (200 != n.result.code) {
                    var a = '上传头像失败，请重新再试！';
                    return n.result.code == kzi.statuses.file_error.generate_thumbnail_error.code && (a = '生成缩略图失败，请重新再试！'), kzi.msg.error(a), $scope.upload_enabled = true, void 0;
                }
                if (!_.isEmpty(n.result.files)) {
                    var s = n.result.files[0];
                    s && !s.error && ($rootScope.global.me.avatar = s.url,
                        $rootScope.refresh_cache.user.avatar($rootScope.global.me.uid, s.url),
                        wt.data.user.set_avatar(s.url, function () {
                        }));
                }
                $scope.upload_enabled = true;
            },
            acceptFileTypes: /(\.|\/)(jpe?g|png)$/i,
            maxNumberOfFiles: 100,
            imageMaxWidth: 180,
            imageMaxHeight: 180,
            imageCrop: true
        };

        $rootScope.global.loading_done = true;
    }
]);

innerApp.controller('account_twofactor_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '两步验证', $scope.current_menu = 'twofactor', $scope.part_loading_done = false, $rootScope.global.loading_done = true, $scope.from_index = 1, $scope.two_step = 0, $scope.input = {};
        var r = function () {
            $scope.recovery_codes = null, wt.data.account.get_recovery_codes(function (e) {
                $scope.recovery_codes = e.data;
            });
        };
        $scope.js_two_step = function (e) {
            $scope.two_step !== e && ($scope.two_step = e, 3 === e && ($scope.twofactor_secret || ($scope.twofactor_secret = null, $scope.qrcode_html = null, $scope.loading_twofactor_secret_done = false, wt.data.account.get_twofactor_secret(function (e) {
                $scope.twofactor_secret = e.data;
            }, null, function () {
                $scope.loading_twofactor_secret_done = true;
            }))));
        }, $scope.js_user_change_pwd = function (e, i, n) {
            $scope.is_changing_pwd = true, wt.data.user.change_pwd(i, n, function () {
                $scope.change_pwd_success = true;
            }, function () {
                e.$errors.unshift('原密码输入错误');
            }, function () {
                $scope.is_changing_pwd = false;
            });
        }, $scope.js_enable_twofactor = function () {
            return _.isEmpty($scope.input.factor) ? ($scope.input.enable_twofactor_errors = '动态验证码不能为空', void 0) : ($scope.is_enable_twofactoring = true, wt.data.account.enable_twofactor($scope.input.factor, function () {
                $scope.account_basic.twofactor_enabled = 1, r(), $scope.js_two_step(0), $scope.twofactor_secret = null, $scope.input.enable_twofactor_errors = '';
            }, function (e) {
                $scope.input.enable_twofactor_errors = e.code === kzi.statuses.user_error.twofactor_match_error.code ? '输入动态验证码不正确,请重新再试！' : '开启验证失败,请重新再试！';
            }, function () {
                $scope.is_enable_twofactoring = false;
            }), void 0);
        }, $scope.js_twofactor_focus = function () {
            $scope.input.enable_twofactor_errors = '';
        }, $scope.js_disable_twofactor = function () {
            $scope.is_disable_twofactoring = true, wt.data.account.disable_twofactor(function () {
                $scope.account_basic.twofactor_enabled = 0;
            }, function () {
                $scope.input.enable_twofactor_errors = '关闭两步验证失败,请重新再试！';
            }, function () {
                $scope.is_disable_twofactoring = false;
            });
        }, wt.data.account.get_basic(function (e) {
            $scope.account_basic = e.data, $scope.account_basic.twofactor_enabled && r();
        }, null, function () {
            $scope.part_loading_done = true;
        });
    }
]);

innerApp.controller('account_message_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '消息设置', $scope.current_menu = 'message', $scope.part_loading_done = false, $rootScope.global.loading_done = true, $scope.js_desk_notice = function (e) {
            $scope.desk_notice !== e && ($scope.desk_notice = e, kzi.localData.set(kzi.config.desk_notify_key, e), kzi.msg.success('更改设置成功')), 1 === $scope.desk_notice ? window.DesktopNotify.wt_show('/img/wt-logo.png', '提醒', '你打开了桌面提醒功能', function () {
            }) : window.DesktopNotify.wt_show('/img/wt-logo.png', '提醒', '你关闭了桌面提醒功能', function () {
            });
        }, $scope.js_email_notice = function (i) {
            $scope.notice_by_email !== i && wt.data.user.set_user_prefs($rootScope.global.me.uid, 'notice_by_email', i, function () {
                kzi.msg.success('更改设置成功');
            });
        }, $scope.js_smart_notice = function (i) {
            $scope.notice_for_smart !== i && wt.data.user.set_user_prefs($rootScope.global.me.uid, 'notice_for_smart', i, function () {
                kzi.msg.success('更改设置成功');
            });
        }, wt.data.account.get_basic(function (e) {
            $scope.notice_by_email = _.find(e.data.prefs, function (e) {
                return 'notice_by_email' === e.key;
            }).value, $scope.notice_for_smart = _.find(e.data.prefs, function (e) {
                return 'notice_for_smart' === e.key;
            }).value;
        }, null, function () {
            $scope.part_loading_done = true;
        }), $scope.desk_notice = kzi.localData.get(kzi.config.desk_notify_key), _.isEmpty($scope.desk_notice) && ($scope.desk_notice = 1, kzi.localData.set(kzi.config.desk_notify_key, 1));
    }
]);

innerApp.controller('account_projects_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '群组管理', $scope.current_menu = 'projects', wt.data.account.get_projects(function (i) {
            $scope.account_projects = i.data, $rootScope.global.loading_done = true;
        }, null, function () {
            $rootScope.global.loading_done = true;
        });
    }
]);

innerApp.controller('account_teams_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '团队管理', $scope.current_menu = 'teams', $scope.part_loading_done = false, $rootScope.global.loading_done = true, wt.data.account.get_teams(function (e) {
            $scope.account_teams = e.data;
        }, null, function () {
            $scope.part_loading_done = true;
        });
    }
]);

innerApp.controller('account_security_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '安全日志', $scope.part_loading_done = false, $rootScope.global.loading_done = true, $scope.current_menu = 'security', $scope.from_index = 1, $scope.two_step = 0, $scope.input = {};
        var r = function (e) {
            $scope.account_histories = [], $scope.part_loading_done = false, wt.data.account.get_security(e, function (i) {
                $scope.account_histories = i.data.histories, $scope.from_index = (e - 1) * kzi.config.default_count + 1, (1 === e || '1' === e) && ($scope.totalCount = i.data.totalCount, $scope.security_pagination_opts = {
                    totalCount: i.data.total_count,
                    opts: {
                        callback: function (e) {
                            r(e + 1);
                        }
                    }
                });
            }, null, function () {
                $scope.part_loading_done = true;
            });
        };
        $scope.js_two_step = function (e) {
            $scope.two_step !== e && ($scope.two_step = e, 3 === e && ($scope.twofactor_secret || ($scope.twofactor_secret = null, $scope.qrcode_html = null, $scope.loading_twofactor_secret_done = false, wt.data.account.get_twofactor_secret(function (e) {
                $scope.twofactor_secret = e.data;
            }, null, function () {
                $scope.loading_twofactor_secret_done = true;
            }))));
        }, $scope.js_user_change_pwd = function (e, i, n) {
            $scope.is_changing_pwd = true, wt.data.user.change_pwd(i, n, function () {
                $scope.change_pwd_success = true;
            }, function () {
                e.$errors.unshift('原密码输入错误');
            }, function () {
                $scope.is_changing_pwd = false;
            });
        }, $scope.js_enable_twofactor = function () {
            return _.isEmpty($scope.input.factor) ? ($scope.input.enable_twofactor_errors = '动态验证码不能为空', void 0) : ($scope.is_enable_twofactoring = true, wt.data.account.enable_twofactor($scope.input.factor, function () {
                $scope.account_basic.twofactor_enabled = 1, load_recovery_codes(), $scope.js_two_step(0), $scope.twofactor_secret = null, $scope.input.enable_twofactor_errors = '';
            }, function (e) {
                $scope.input.enable_twofactor_errors = e.code === kzi.statuses.user_error.twofactor_match_error.code ? '输入动态验证码不正确,请重新再试！' : '开启验证失败,请重新再试！';
            }, function () {
                $scope.is_enable_twofactoring = false;
            }), void 0);
        }, $scope.js_twofactor_focus = function () {
            $scope.input.enable_twofactor_errors = '';
        }, $scope.js_disable_twofactor = function () {
            $scope.is_disable_twofactoring = true, wt.data.account.disable_twofactor(function () {
                $scope.account_basic.twofactor_enabled = 0;
            }, function () {
                $scope.input.enable_twofactor_errors = '关闭两步验证失败,请重新再试！';
            }, function () {
                $scope.is_disable_twofactoring = false;
            });
        }, r(1);
    }
]);

//我的积分ctrl
innerApp.controller('account_myscore_ctrl', [
    '$rootScope',
    '$scope', '$window', '$http',
    function ($rootScope, $scope, $window, $http) {
        $rootScope.global.title = '我的积分';
        $rootScope.global.loading_done = true;
        $scope.part_loading_done = true;

        $scope.current_menu = 'all';

        $scope.logs = [];


        //分页相关
        $scope.currentPage = 1;//当前页码
        $scope.itemsPerPage = 10;//页面最大记录数
        $scope.totalItems = 0;//总记录数

        //翻页
        $scope.$watch('currentPage', function (currentPage) {
            $scope.pageNum = currentPage;
            $scope.queryCondition.page = currentPage;
        });

        $scope.show_pay = false;

        //筛选条件
        $scope.queryCondition = {
            page: 1,
            size: 10,
            isAdd: 0,
            orderKey: "create_date",//默认按创建时间排序
            isDESC: "1"//排序方式，默认按降序排序
        };

        //切换数据排序顺序
        $scope.sortScoreDates = function () {
            $scope.queryCondition.isDESC = !$scope.queryCondition.isDESC;
        };

        //查询我全部积分明细
        $scope.MyAll = function () {
            $scope.queryCondition.isAdd = 0;

            $scope.current_menu = 'all';
            $scope.currentPage = 1;
            $scope.queryCondition.isDESC = 1;
        };

        //查询我的收入明细
        $scope.MyIncome = function () {
            $scope.queryCondition.isAdd = 1;

            $scope.current_menu = 'income';
            $scope.currentPage = 1;
            $scope.queryCondition.isDESC = 1;
        };

        //查询我的支出明细
        $scope.MyPay = function () {
            $scope.queryCondition.isAdd = -1;

            $scope.current_menu = 'pay';
            $scope.currentPage = 1;
            $scope.queryCondition.isDESC = 1;
        };
        //跳转到积分规则
        $scope.toScoreRule = function () {
            $window.location.href = "/scorerule";
        };

        //查询数据
        $scope.$watch('queryCondition', function (queryCondition) {
            if ($rootScope.global.is_login == true) {
                $scope.part_loading_done = false;
                wt.data.scoreLog.getScoreLogs(queryCondition, successFunc, errorFunc, thenFunc);
            }
            ;
        }, true);

        var successFunc = function (result) {
            $scope.logs = result.data;
            $scope.totalItems = result.totalItems;
        };

        var errorFunc = function () {
            kzi.msg.error("数据加载失败！", function () {
            });
        };

        var thenFunc = function () {
            $scope.part_loading_done = true;
        };

        //获取积分规则
        $scope.score_rules = [];

//        var get_rule = function () {
//            $scope.part_loading_done = false;
//            $http.get("/json/scorerule.json").success(function (data) {
//                $scope.rules = data.rules;
//                $scope.part_loading_done = true;
//            });
//        };

        //查询如何获取积分
        $scope.GetScore = function () {
            $scope.score_rules.length == 0 && ($scope.score_rules = kzi.constant.score.rules);
            $scope.current_menu = 'get_score';
        };


        //去获取积分
        $scope.to_get_score = function (url) {
            window.location.href = url;
        };

    }
]);

innerApp.controller('account_scorerule_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '积分规则';
        $scope.part_loading_done = false;
        $rootScope.global.loading_done = true;
        $scope.current_menu = 'scorerule';
        $scope.part_loading_done = true;
    }
]);

/**
 * 失效邮箱设置
 */
innerApp.controller('invalid_email_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        if ($rootScope.global.me.name != 'sys_manager') {
            window.location.href = "/";
            kzi.msg.error("权限不足！");
        }
        $rootScope.global.title = '设置邮箱 黑/白 名单';
        $scope.mail_list = "请输入邮箱，每个邮箱独占一行";
        $scope.check_email = "";
        $scope.current_menu = 'invalid_mails';
        $rootScope.global.loading_done = true;
        $scope.part_loading_done = true;

        $scope.set_mind_info = function () {
            _.isEmpty($scope.mail_list) && ($scope.mail_list = "请输入邮箱，每个邮箱独占一行");
        };
        $scope.clear_set_mails = function () {
            ($scope.mail_list == "请输入邮箱，每个邮箱独占一行") && ($scope.mail_list = "");
        };

        /**
         * 设置邮件黑名单
         */
        $scope.set_invalid_mails = function (iswhite) {
            ($scope.mail_list.indexOf("@") > 0 && !_.isEmpty($scope.mail_list)) && (
                $scope.is_setting = true,
                    wt.data.email.set_invalid_mails($scope.mail_list,
                        iswhite,
                        function () {
                            kzi.msg.success("设置成功！", null);
                            $scope.mail_list = "请输入邮箱，每个邮箱独占一行";
                        },
                        function () {
                            kzi.msg.error("设置失败！", null);
                        },
                        function () {
                            $scope.is_setting = false;
                        })
            );
        };

        $scope.isUpload = false;

        $scope.blacks = {
            url: '/api/mails/blackMailList/import',
            add: function (event, data) {
                var fileName = data.files[0].name;
                if (fileName.indexOf(".txt") < 0) {
                    kzi.msg.error("请上传txt文件!");
                    return;
                } else {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },
            start: function (event) {
                $scope.part_loading_done = false;
            },
            done: function (event, data) {
                $scope.part_loading_done = true;
                if (data.result.code == 200) {
                    kzi.msg.success("数据导入成功！");
                } else {
                    kzi.msg.error("数据导入失败！");
                }
            }
        };
        $scope.whites = {
            url: '/api/mails/whiteMailList/import',
            add: function (event, data) {
                var fileName = data.files[0].name;
                if (fileName.indexOf(".txt") < 0) {
                    kzi.msg.error("请上传txt文件!");
                    return;
                } else {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },
            start: function (event) {
                $scope.part_loading_done = false;
            },
            done: function (event, data) {
                $scope.part_loading_done = true;
                if (data.result.code == 200) {
                    kzi.msg.success("数据导入成功！");
                } else {
                    kzi.msg.error("数据导入失败！");
                }
            }
        };


        /**
         * 选择上传黑名单文件
         */
        $scope.import_black_file = function () {
            $("#import_black")[0].click();
            $("#import_black").bind("change", function () {
                $("#import_black_form")[0].submit();
            });
        };

        /**
         * 选择上传白名单文件
         */
        $scope.import_white_file = function () {
            $("#import_white")[0].click();
            $("#import_white").bind("change", function () {
                $("#import_white_form")[0].submit();
            });
        };

        /**
         * 从黑名单中移除邮件
         */
        $scope.removeBlackMailList = function () {
            !_.isEmpty($scope.check_email) && (
                $scope.is_moveing = true,
                    wt.data.email.removeBlackMailList($scope.check_email,
                        function (resp) {
                            "0" == resp.data && kzi.msg.success("成功移出黑名单！");
                            "1" == resp.data && kzi.msg.success("邮箱不在黑名单中！");
                        },
                        function () {
                            kzi.msg.error("移出失败，请稍候重试！", null);
                        },
                        function () {
                            $scope.is_moveing = false;
                        })
            );
        };

        /**
         * 检查邮箱是否有效（无效就加入黑名单，并修改所有该邮件的活动的邮件状态为1，不能分享，不能发邮件）
         */
        $scope.email_validate = function () {
            var successFunc = function (resp) {
                if ('0' == resp.data) {
                    kzi.msg.success("有效邮箱！");
                } else if ('-1' == resp.data) {
                    kzi.msg.error("邮箱已在黑名单中！");
                } else if ('500' == resp.data) {
                    kzi.msg.error("网络原因，邮箱验证失败！");
                } else if ('00' == resp.data) {
                    kzi.msg.success("邮箱已在白名单中！");
                } else if ('1' == resp.data) {
                    kzi.msg.error("邮箱无效，现已加入黑名单！");
                }
                ;
            };
            !_.isEmpty($scope.check_email) && (
                $scope.is_checking = true,
                    wt.data.email.check($scope.check_email, successFunc,
                        function () {
                            kzi.msg.error("检测失败，请稍后重试，或联系管理员！");
                        },
                        function () {
                            $scope.is_checking = false;
                        })
            );
        };
    }
]);

/**
 * 谷歌地址管理
 */
innerApp.controller('google_ips_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        if ($rootScope.global.me.name != 'sys_manager') {
            window.location.href = "/";
            kzi.msg.error("权限不足！");
        }
        $rootScope.global.title = '谷歌搜索ip地址管理';
        $scope.ips = "请输入谷歌搜索ip，每个ip独占一行";
        $scope.current_menu = 'google_ips';
        $scope.ip_list = [];//

        $scope.init = function () {
            $scope.part_loading_done = false;
            wt.data.google.show_ips(
                function (resp) {
                    $scope.ip_list = resp.data;
                },
                function () {
                    kzi.msg.error("数据加载失败，请刷新重试！");
                },
                function () {
                    $rootScope.global.loading_done = true;
                    $scope.part_loading_done = true;
                }
            );
        };
        $scope.init();

        $scope.set_mind_info = function () {
            _.isEmpty($scope.ips) && ($scope.ips = "请输入谷歌搜索ip，每个ip独占一行");
        };
        $scope.clear_set_ips = function () {
            ($scope.ips == "请输入谷歌搜索ip，每个ip独占一行") && ($scope.ips = "");
        };


        /**
         * 添加ip
         */
        $scope.set_invalid_ips = function () {
            !_.isEmpty($scope.ips) && (
                $scope.is_setting = true,
                    wt.data.google.add_ips($scope.ips,
                        function () {
                            $scope.init();
                            kzi.msg.success("添加成功！");
                            $scope.ips = "请输入谷歌搜索ip，每个ip独占一行"
                        },
                        function () {
                            kzi.msg.error("添加失败！");
                        },
                        function () {
                            $scope.is_setting = false;
                        })
            );
        };

        /**
         * 移除ip
         */
        $scope.remove_ip = function (index) {
            wt.data.google.remove_ip($scope.ip_list[index],
                function () {
                    kzi.msg.success("移除成功！");
                    $scope.ip_list = _.without($scope.ip_list, $scope.ip_list[index]);
                },
                function () {
                    kzi.msg.error("移除失败！");
                },
                function () {
                }
            );
        };

        /**
         * 检查ip是否有效(打开新标签页)
         */
        $scope.ip_validate = function (index) {
            var ip = $scope.ip_list[index];
            if (ip.indexOf("http://") == -1) {
                ip = "http://" + ip;
            }
            window.open(ip);
        };
    }
]);

/**
 * 管理员管理用户
 */
innerApp.controller('user_manager', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        if ($rootScope.global.me.name != 'sys_manager') {
            window.location.href = "/";
            kzi.msg.error("权限不足！");
        }
        $rootScope.global.loading_done = true;
        $scope.part_loading_done = true;
        $rootScope.global.title = '用户管理';
        $scope.current_menu = 'user_manager';
        $scope.user = {};
        $scope.user_name = null;
        $scope.can_update = false;//标记是否能修改用户状态(存在用户信息时才能修改)
        $scope.show_user = false;
        $scope.account_status = "";

        /**
         * 根据用户名查找用户
         * @param name
         */
        $scope.find_user_by_name = function () {
            if (!_.isEmpty($scope.user_name)) {
                $scope.part_loading_done = false;
                $scope.show_user = false;
                wt.data.user.get_by_name($scope.user_name,
                    function (resp) {
                        $scope.user = resp.data;

                        switch ($scope.user.ifActivate) {
                            case "Activated":
                                $scope.account_status = "已激活";
                                break;
                            case "UnActivated":
                                $scope.account_status = "未激活";
                                break;
                            case "Frozen":
                                $scope.account_status = "已冻结";
                                break;
                            case "Waste":
                                $scope.account_status = "已废弃";
                                break;
                            default :
                                $scope.account_status = "未知";
                        }
                        ;

                        $scope.show_user = true;
                        $scope.can_update = true;
                    },
                    function () {
                    },
                    function () {
                        $scope.part_loading_done = true;
                    }
                );
            }
        };

        /**
         * 设置用户帐户状态（冻结或解冻）
         * @param status：0:激活用户；1：冻结用户
         */
        $scope.set_user_status = function (status) {

            if (!_.isEmpty($scope.user) && !_.isEmpty($scope.user.objectId)) {
                $scope.can_update = false;
                status == 0 ? $scope.is_update0 = true : $scope.is_update1 = true;
                wt.data.user.update_account_status($scope.user.objectId, status,
                    function () {
                        if (status == 0) {
                            kzi.msg.success("用户账户已激活!");
                            $scope.account_status = "已激活";
                        } else {
                            kzi.msg.success("用户账户已冻结!");
                            $scope.account_status = "已冻结";
                        }
                        ;
                    },
                    function () {
                        kzi.msg.error("修改失败！");
                    },
                    function () {
                        $scope.can_update = true;
                        $scope.is_update0 = false;
                        $scope.is_update1 = false;
                    }
                );
            }
            ;
        };
    }
]);

/**
 * 管理员根据行业群发邮件
 */
innerApp.controller('batch_email_send_ctrl', [
    '$rootScope',
    '$scope', '$http', 'MdParse',
    function ($rootScope, $scope, $http, MdParse) {
        if ($rootScope.global.me.name != 'sys_manager') {
            window.location.href = "/";
            kzi.msg.error("权限不足！");
        }
        $rootScope.global.loading_done = true;
        $scope.part_loading_done = true;
        $rootScope.global.title = '邮件群发';
        $scope.current_menu = 'batch_email_send';
        $scope.is_saving = false;
        $scope.choose_addressee_count = 0;
        $scope.isUpload = false;

        $scope.new_mail = {
            //邮件标题
            "name": "",
            //邮件内容
            "content": "",
            //发件人
            "from": $rootScope.global.me.reply_email || $rootScope.global.me.email,
            //收件人一级行业
            "mainIndustryCode": "",
            mainIndustryCnName: "",
            //收件人二级行业
            subIndustryCnName: "",
            "subIndustryCode": "",
            "industryCode": ""
        };

        /**
         * 上传排除邮件列表
         * @type {{url: string, add: add, start: start, done: done}}
         */
        $scope.upload_exclude_list = {
            url: '/api/file//emailFilter/upload',
            add: function (event, data) {
                var fileName = data.files[0].name;
                if (fileName.indexOf(".txt") < 0) {
                    kzi.msg.error("请上传txt文件!");
                    return;
                } else {
                    data.process().done(function () {
                        data.submit();
                    });
                }
            },
            start: function (event) {
                $scope.isUpload = true;
            },
            done: function (event, data) {
                if (data.result.code == 200) {
                    kzi.msg.success("数据导入成功！");
                } else {
                    kzi.msg.error("数据导入失败！");
                }
                $scope.isUpload = false;
            }
        };

        /**
         * 取消并清空编辑邮件
         */
        $scope.cancel_edit_mail = function () {
            $scope.new_mail.name = "";
            $scope.new_mail.content = "";
            $scope.new_mail.mainIndustryCode = "";
            $scope.new_mail.mainIndustryCnName = "";
            $scope.new_mail.subIndustryCnName = "";
            $scope.new_mail.subIndustryCode = "";
            $scope.new_mail.industryCode = "";
            $scope.choose_addressee_count = 0;
        };

        /**
         * 确认选择收件人
         */
        $scope.choose_addressee = function () {

            if (_.isEmpty($scope.new_mail.mainIndustryCode)) {
                kzi.msg.error("请先选择活动行业!", null);
//                $("#industry").css("border","1px solid d84c31");
            } else {
                var industry = _.isEmpty($scope.new_mail.subIndustryCode) ? $scope.new_mail.mainIndustryCode : $scope.new_mail.subIndustryCode;
                var is_main = _.isEmpty($scope.new_mail.subIndustryCode);
                $http.get('/api/tasks/industry/count?industry=' + industry + '&ismain=' + is_main)
                    .success(function (res) {
                        $scope.choose_addressee_count = res.totalItems;
                    });
            }
        };

        /**
         * 保存邮件
         */
        $scope.sys_send_email = function () {
            if (_.isEmpty($scope.new_mail.mainIndustryCode)) {
                kzi.msg.error("请选择活动行业!", null);
            }
            else if (_.isEmpty($scope.new_mail.from) || !kzi.validator.isEmail($scope.new_mail.from)) {
                kzi.msg.error("请正确填写发件人邮箱!", null);
            }
            else if (_.isEmpty($scope.new_mail.name)) {
                kzi.msg.error("请填写邮件标题!", null);
            }
            else if (_.isEmpty($scope.new_mail.content)) {
                kzi.msg.error("请填写邮件内容!", null);
            }
            else {
                $scope.is_saving = true;
                $scope.new_mail.industryCode = _.isEmpty($scope.new_mail.subIndustryCode) ? $scope.new_mail.mainIndustryCode : $scope.new_mail.subIndustryCode;
                $scope.new_mail.is_main = _.isEmpty($scope.new_mail.subIndustryCode);

                $scope.new_mail.content = MdParse($scope.new_mail.content);

                wt.data.email.sys_batch_send($scope.new_mail,
                    function () {
                        $scope.cancel_edit_mail();
                        $rootScope.open_mail_prompt();
                    },
                    function () {
                        kzi.msg.error("发送失败！", null)
                    },
                    function () {
                        $scope.is_saving = false;
                    }
                );
            }
        };
    }
]);

/**
 * 举报信息列表控制
 */
innerApp.controller('reports_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        if ($rootScope.global.me.name != 'sys_manager') {
            window.location.href = "/";
            kzi.msg.error("权限不足！");
        }
        $rootScope.global.loading_done = true;
        $scope.part_loading_done = false;
        $scope.show_report_infos = false;
        $rootScope.global.title = '举报信息';
        $scope.current_menu = 'report';
        $scope.current_title = '活动';
        $scope.queryCondition = {
            "orderKey": "lastReportTime",
            "otype": "customer",
            "isDESC": true
        };

        /**
         * 排序关键字
         * @type {Array}
         */
        $scope.sort_orders = [
            {"key": "lastReportTime", "value": "举报时间"},
            {"key": "reportCount", "value": "举报数量"}
        ];
        $scope.sort_index = 0;
        /**
         * 排序操作
         * @param index
         */
        $scope.sort_reports = function (index) {
            if ($scope.sort_index == index || index == '-1') {
                $scope.queryCondition.isDESC = !$scope.queryCondition.isDESC;
            } else {
                $scope.sort_index = index;
                $scope.queryCondition.orderKey = $scope.sort_orders[index].key;
                $scope.queryCondition.isDESC = true;
            }
            ;
        };

        $scope.report_objects = [];
        $scope.choose_report_type = function (type) {
            $scope.queryCondition.otype = type;
            $scope.queryCondition.orderKey = "lastReportTime";
            $scope.queryCondition.isDESC = true;
            switch (type) {
                case "customer":
                    $scope.current_title = '活动';
                    break;
                case "template":
                    $scope.current_title = '模板';
                    break;
                case "post":
                    $scope.current_title = '问答';
                    break;
                case "comment":
                    $scope.current_title = '评论';
                    break;
            }
        };

        var loadData = function () {
            $scope.part_loading_done = false;
            wt.data.report.getReportObjects(
                $scope.queryCondition,
                function (resp) {
                    $scope.report_objects = resp.data;
                },
                function () {
                    kzi.msg.error("数据加载失败！");
                },
                function () {
                    $scope.part_loading_done = true;
                }
            );
        };
        loadData();
        $scope.$watch("queryCondition", function () {
            loadData()
        }, true);

        /**
         * 举报详情列表控制
         * @param object
         */
        $scope.report_list = {

            report_infos: [],

            report_object: "",

            disposed_count: 0,

            queryCondition: {"isDisposed": false, "objectId": ""},

            /**
             * 显示某一被举报对象的举报详情
             * @param object
             */
            show_report_list: function (object) {
                if (!_.isEmpty(object)) {
                    $scope.report_list.queryCondition.objectId = object.objectId;
                    $scope.report_list.report_object = object;
                }
                ;
            },

            /**
             * 加载特定举报对象的全部举报信息
             */
            load_report_list: function () {
                $scope.part_loading_done = false;
                wt.data.report.getReportInfos($scope.report_list.queryCondition,
                    function (resp) {
                        $scope.report_list.report_infos = resp.data;

                        $scope.report_list.report_infos = _.map($scope.report_list.report_infos, function (e) {
                            var type = e.reportType + "";
                            e.type_name = "";
                            if (type.indexOf("1") >= 0)
                                e.type_name += "邮箱地址有误 ";
                            if (type.indexOf("2") >= 0)
                                e.type_name += "行业信息有误 ";
                            if (type.indexOf("3") >= 0)
                                e.type_name += "产品信息有误 ";
                            if (type.indexOf("4") >= 0)
                                e.type_name += "其他";
                            return e;
                        });

                        $scope.show_report_infos = true;
                    },
                    function () {
                        kzi.msg.error("数据加载失败！");
                    },
                    function () {
                        $scope.part_loading_done = true;
                    }
                );
            },

            /**
             * 隐藏举报详情列表
             */
            hide_report_list: function () {

                $scope.report_objects = _.map($scope.report_objects, function (e) {
                    if (e.objectId == $scope.report_list.queryCondition.objectId) {
                        e.disposedCount += $scope.report_list.disposed_count;
                    }
                    return e;
                });
                $scope.show_report_infos = false;
                $scope.report_list.queryCondition.objectId = "";
                $scope.report_list.report_object = null;
            },

            /**
             * 显示被举报对象详情
             */
            show_object: function () {
                $rootScope.locator.to_task($scope.report_list.report_object.pid, $scope.report_list.report_object.tid, null)
            },

            disposed: function (object, type) {
                $scope.part_loading_done = false;
                wt.data.report.disposed(object.objectId, type,
                    function () {
                        $scope.report_list.report_infos = _.without($scope.report_list.report_infos, object);
                        $scope.report_list.disposed_count += 1;
                    },
                    function () {
                        kzi.msg.error("处理失败，请稍后重试！");
                    },
                    function () {
                        $scope.part_loading_done = true;
                    }
                );
            }
        };
        $scope.$watch("report_list.queryCondition", function () {
            !_.isEmpty($scope.report_list.queryCondition.objectId) && $scope.report_list.load_report_list();
        }, true);
    }
]);

innerApp.controller('account_apps_ctrl', [
    '$rootScope',
    '$scope',
    function ($rootScope, $scope) {
        $rootScope.global.title = '应用中心', $scope.current_menu = 'apps', $scope.part_loading_done = false, $rootScope.global.loading_done = true, wt.data.account.get_apps(function (e) {
            $scope.account_apps = e.data;
        }, null, function () {
            $scope.part_loading_done = true;
        });
        var r = function (e) {
            $scope.account_apps = _.reject($scope.account_apps, function (t) {
                return t.app_id === e.app_id;
            });
        };
        $scope.js_pop_decommissioning = function (e) {
            s.popbox({
                target: event,
                templateUrl: '/view/account/pop_decommissioning_confirm.html',
                controller: [
                    '$rootScope',
                    '$scope',
                    'popbox',
                    function (t, i, n) {
                        i.popbox = n, i.js_close = function () {
                            n.close();
                        }, i.js_decommissioning = function () {
                            i.is_decommissioning = true, wt.data.account.decommissioning_app(e.app_id, function () {
                                r(e), n.close();
                            }, null, function () {
                                i.is_decommissioning = false;
                            });
                        };
                    }
                ]
            }).open();
        };
    }
]);

innerApp.controller('company_info_ctrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $rootScope.global.title = '公司信息';
    $scope.current_menu = 'company_info';
    $scope.current_tab = 'basic';
    $scope.part_loading_done = false;
    $scope.variables = {
        customer_now: '',
        create_time: '',
        company_name: '',
        inspection_certificate: '',
        product_certification: '',
        company_products: '',
        QS: ''
    }

    if ($rootScope.global.is_login) {
        wt.data.user.get_company_info(function (res) {
            if (res.data) {
                $scope.variables.customer_now = res.data.customerNow || "";
                $scope.variables.create_time = res.data.buildDate || "";
                $scope.variables.company_name = res.data.displayname || "";
                $scope.variables.inspection_certificate = res.data.inspectionCertificate || "";
                $scope.variables.product_certification = res.data.productCertification || "";
                $scope.variables.company_products = res.data.products || "";
                $scope.variables.QS = res.data.qualitySystem || "";
                $scope.variables.prodcutivePower = res.data.prodcutivePower || "";
            }
        }, function error() {

        }, function then() {
            $rootScope.global.loading_done = true;
            $scope.part_loading_done = true;
        })
    }
    var company_info;

    function reGetBeforeSaveCompanyInfo() {
        company_info = {
            name: $scope.variables.name,
            displayname: $scope.variables.company_name,
            type: $scope.variables.type,
            size: $scope.variables.size,
            industry_1: $scope.variables.mainIndustryCode,
            industry_2: $scope.variables.subIndustryCode,
            address: $scope.variables.address,
            website: $scope.variables.website,
            description: $scope.variables.description,

            products: $scope.variables.company_products,
            buildDate: $scope.variables.create_time,
            customerNow: $scope.variables.customer_now,
            productCertification: $scope.variables.product_certification,
            qualitySystem: $scope.variables.QS,
            inspectionCertificate: $scope.variables.inspection_certificate,
            prodcutivePower: $scope.variables.prodcutivePower
        }
    }

    $scope.is_save_ing = false;
    $scope.save_company_info = function () {
        reGetBeforeSaveCompanyInfo();
        $scope.is_save_ing = true;
        wt.data.user.save_company_info(company_info, function (res) {
            if (res.data.company) {
                $scope.variables.customer_now = res.data.company.customerNow || "";
                $scope.variables.create_time = res.data.company.buildDate || "";
                $scope.variables.company_name = res.data.company.displayname || "";
                $scope.variables.inspection_certificate = res.data.company.inspectionCertificate || "";
                $scope.variables.product_certification = res.data.company.productCertification || "";
                $scope.variables.company_products = res.data.company.products || "";
                $scope.variables.QS = res.data.company.qualitySystem || "";
                $scope.variables.prodcutivePower = res.data.company.prodcutivePower || "";
            }
        }, function () {
            debugger;
        }, function () {
            $scope.is_save_ing = false;
            kzi.msg.success("保存成功~", function () {

            })
        });
    }

}]);

//订单列表页面
innerApp.controller('account_order_ctrl', [
    '$rootScope',
    '$scope', '$window', '$http',
    function ($rootScope, $scope, $window, $http) {
        $rootScope.global.title = '订单列表';
        var vm=$scope.vm= {};
        vm.tag={
            order_list:[],
            queryCondition : {
                currentPage:1,
                itemsPerPage:10
               },
            totalItems:0,
            load_data:function(queryCondition){
                $rootScope.global.loading_done = false;
                wt.data.order.get_order_list(this.queryCondition.currentPage,this.queryCondition.itemsPerPage, function (result) {
                    vm.tag.order_list=result.data;
                    vm.tag.totalItems=result.totalItems;
                }, function () {
                 }, function(){
                    $rootScope.global.loading_done = true;
                });
            },
            pageChanged: function () {
                this.load_data(this.queryCondition);
            }
         };
        vm.tag.load_data(vm.tag.queryCondition);
    }
]);
innerApp.controller('account_charge_ctrl',
    ["$rootScope", "$scope", "$routeParams", function ($rootScope, $scope,$routeParams) {
    $rootScope.global.title = '积分充值';
    var trade_no = $routeParams.out_trade_no;
    function Order() {
        this.out_trade_no = "";
        this.subject = "棒呆充值兑换积分" ;
        //单位为元。在存储时会转化为分来存。
        this.total_fee = 0;
        this.earn = 0;
    }

    function makeSubject (total_fee, earn) {
        return  "棒呆充值兑换积分-"
            + total_fee
            + "元"
            + "兑换"
            + earn
            + "积分";
    }

    function Amount(earn, pay) {
        this.earn = earn;
        this.pay  = pay;
    }

    function selectAmount ($index) {
        vm.state.crt_amount_index = $index;
    }
    var vm   = $scope.vm
        = {};
    vm.order      = new Order();
    vm.staticInfo = {
        amountList: [new Amount(3000, 30),
            new Amount(5500, 50),
            new Amount(12000, 100),
            new Amount(100, 0.01)
        ],
        user_email: $rootScope.global.me.email,
        user_score: $rootScope.global.me.score
    };
    vm.actions = {
        selectAmount: selectAmount
    };
    vm.state = {
        crt_amount_index: 0,
        step: 1,
        is_saving_order: false
    };

    $scope.add_new_order = function () {
        var selectedAmount = vm.staticInfo.amountList[vm.state.crt_amount_index];
        var            pay = selectedAmount.pay; // 需要转化为分后，再存储
        var           earn = selectedAmount.earn;
        var            uid = $rootScope.global.me.uid;
        var        subject = makeSubject(pay, earn);
        var        showUrl = null;
        var           body = null;
        var            pid = null;
        vm.state.is_saving_order = true;
        wt.data.order.add(uid, pay * 100, earn, subject, showUrl, body, pid, function (res) {
            if(res.data) {
                vm.order.out_trade_no  = res.data.objectId;
                vm.order.subject   = res.data.subject;
                //转化为元
                vm.order.total_fee =  res.data.total_fee/100;
                vm.order.earn      = res.data.earn;
                vm.state.step            = 2;
                vm.state.is_saving_order = false;
            }
        }, null, null);
    }
    //查询订单方法
    var load_order=function(trade_no){
        $rootScope.global.loading_done = false;
        wt.data.order.get_by_trade_no(trade_no, function (res) {
            if(res.data) {
                vm.order.out_trade_no  = res.data.objectId;
                vm.order.subject   = res.data.subject;
                vm.order.total_fee =  res.data.total_fee/100;
                vm.order.earn      = res.data.earn;
                vm.state.step            = 2;
                vm.state.is_saving_order = false;
            }
        }, function(){ kzi.msg.error("订单查询失败，建议重新下单");}, function(){
            $rootScope.global.loading_done = true;
        });
    }
    if(!_.isEmpty(trade_no)){
        vm.state.step            = 0;
        load_order(trade_no);
    }
}]);
