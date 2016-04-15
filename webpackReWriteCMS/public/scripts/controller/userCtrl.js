"use strict";
innerApp.controller("user_ctrl", ["$rootScope", "$location", "$scope", "$popbox",
    function ($rootScope, $location, $scope, $popbox) {
        $scope.$on('$locationChangeSuccess', function () {
            is_index();
        });
        function is_index() {
            if ($location.path() === "/") {
                $scope.is_index = true;
            } else {
                $scope.is_index = false;
            }
        };
        is_index();

        $scope.login = function () {
            $rootScope.global.return_path = $location.$$path;
            $location.path("/signin");
        };
        $scope.signup = function () {
            $location.path("/signup");
        };
        $scope.js_pop_user_setting = function (n) {
            $popbox.popbox({
                target: n,
                templateUrl: "/view/user/pop_user_setting.html",
                controller: ["$scope", "popbox",
                    function ($scope, popbox) {
                        $scope.popbox = popbox;
                        $scope.step = 0;
                        $scope.js_step = function (i) {
                            3 === i && $rootScope.load_teams(function (teams) {
                                $scope.teams = teams
                            });
                            $scope.step = i
                        };
                        $scope.js_close = function () {
                            popbox.close()
                        };
                        $scope.goto_shortcuts = function () {
                            $rootScope.js_shortcut_key_dialog();
                            popbox.close()
                        };
                        $scope.js_user_logout = function () {
                            $rootScope.logout();
                            popbox.close()
                        };
                        $scope.to_share = function () {
                            window.location.href = "/share";
                        };
                        $scope.to_account_settings = function () {
                            window.location.href = "/account_settings";
                        };
                        $scope.to_charge = function () {
                            window.location.href = "/account_charge";
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
        }
    }
]);

innerApp.controller("user_login_ctrl", ["$rootScope", "$scope", "$routeParams", "$location", "$window",
    function ($rootScope, $scope, $routeParams, $location, $window) {
        $rootScope.global.title = "登录";
        var name = kzi.helper.get_query("name");
        $scope.ifSignup = !1;
        $scope.status = {
            message: "",
            code: 0
        };
        $scope.is_login_ing = false;

//        return_url && "" !== return_url ? $scope.return_path = return_url : null !== $rootScope.global.return_path && ($scope.return_path = $rootScope.global.return_path, $rootScope.global.return_path = null);
        var return_url = kzi.helper.get_query("return_url");
        !_.isEmpty(return_url) ? $scope.return_path = return_url : (!_.isEmpty($rootScope.global.return_path) && ($scope.return_path = $rootScope.global.return_path, $rootScope.global.return_path = null));

        var redirect = function () {
            $window.location.href = _.isEmpty($scope.return_path) ? "/dashboard" : $scope.return_path;
        };

        $rootScope.global.is_login && redirect();

        name && ($scope.login_name = name);

        $scope.signin = function (form) {

//            if($window.localStorage.getItem("login_kdd")){
//                kzi.msg.error("已有账号登陆棒呆，请先退出在再录！");
//                return false;
//            }

            $scope.is_login_ing = !0;
            $scope.status =
            {
                message: "",
                code: 0
            };

            $rootScope.login($scope.login_name, md5($scope.login_password), null,
                function (rsp) {
                    var user = rsp.data;
//                    $window.localStorage.setItem("login_kdd", "true");
                    $rootScope.setLoginInfo(user);
                    user.session.twofactor_enabled ? $scope.status.code = 1 : redirect();
                },
                function (e) {
                    if (2001 === e.code) {
                        form.$errors.unshift("此帐号用户不存在！");
                        $scope.ifSignup = !0;
                    }
                    else if (2002 === e.code) {
                        form.$errors.unshift("登录密码错误！");
                    }
                    else if (2031 === e.code) {
                        form.$errors.unshift("帐号未激活！请登录您的注册邮箱，完成激活操作！");
                    }
                    else if (2032 === e.code) {
                        form.$errors.unshift("帐号被冻结，有任何疑问请联系管理员！");
                    }
//                    else if (2033 === e.code) {
//                        form.$errors.unshift("帐号被禁用，有任何疑问请联系管理员！");
//                    }
                    else {
                        form.$errors.unshift("似乎服务器出小差了，请重新提交登录！");
                    }
                },
                function () {
                    $scope.is_login_ing = false;
                });


            $scope.js_signin_twofactor = function (form) {
                $scope.is_signfactoing = !0, wt.data.user.signin_twofactor($scope.factor, $scope.login_name, $scope.login_password, function () {
                    redirect();
                }, function () {
                    form.$errors.unshift("输入的动态验证码不正确，请重新输入。");
                }, function () {
                    $scope.is_signfactoing = !1;
                });
            },
                $scope.js_signin_recovery = function (form) {
                    $scope.is_signrecoverying = !0, wt.data.user.signin_recovery($scope.recovery_code, $scope.login_name, $scope.login_password, function () {
                        redirect();
                    }, function () {
                        form.$errors.unshift("输入的安全码不正确或者已经使用，请重新输入。");
                    }, function () {
                        $scope.is_signrecoverying = !1;
                    });
                };
        };
    }
]);

innerApp.controller("user_signup_ctrl", ["$rootScope", "$scope", "$routeParams", "$location", "$window", "$timeout",
    function ($rootScope, $scope, $routeParams, $location, $window, $timeout) {
        $scope.agree_terms = 0;

        $scope.ifAgreeTerms = function () {
            $scope.agree_terms = !$scope.agree_terms;
        };

        $scope.signup_name = $routeParams.user || "";
        $scope.signup_email = $routeParams.email || "";

        //从请求链接中获取推荐人信息
        var recommend = $routeParams.recommendby;

        if (recommend)//链接中存在推荐人，将其放入本地缓存
        {
            $window.sessionStorage.recommend = recommend;
        }
        else//链接中不存在推荐人，去本地缓存中查
        {
            recommend = $window.sessionStorage.recommend;
        }
        ;

        $scope.recommend = recommend || "";

//        $scope.customer_num_by_industry=function(){
//            console.log($scope.currentMainIndustryCode+"；"+$scope.currentSubIndustryCode);
//        };

        $scope.signup_type = 1,
            $rootScope.global.title = "注册",
            $scope.show_signup = !0,
            $rootScope.global.is_login && ($window.location.href = _.isEmpty($scope.return_path) ? "/dashboard" : $scope.return_path),
            $scope.js_submit = function (form) {
                $scope.is_registering = !0;

                var jsonObject = {
                    name: $scope.signup_name,//用户帐号
                    email: $scope.signup_email,//注册邮箱
                    password: md5($scope.signup_password),
                    recommend: $scope.recommend,//推荐人
                    role: "1",
                    team_name: $scope.signup_team_name,//公司名称
                    f_tradecode: $scope.currentMainIndustryCode,//一级行业编码
                    s_tradeCode: $scope.currentSubIndustryCode == null ? $scope.currentMainIndustryCode : $scope.currentSubIndustryCode//二级行业编码
                };

                var redirect = function () {
                    $window.location.href = _.isEmpty($scope.return_path) ? "/dashboard" : $scope.return_path;
//                      $window.location.href ="/page/guide.html";
                };


                wt.data.signup(jsonObject,

                    function (rsp) {
                        $scope.show_signup = !1;//隐藏注册表单
                        $scope.signup_success = !0;//提示注册成功

                        var isActived = rsp.data.ifActivate;

                        if (isActived == 'Activated')//不需激活，直接登录
                        {
                            $scope.ifActived = false;
                            var user = rsp.data;
                            $rootScope.setLoginInfo(user);
                            user.session.twofactor_enabled ? $scope.status.code = 1 : $timeout(redirect(), 2000);
                        }
                        else//需要激活，跳到登录页面
                        {
                            $scope.ifActived = true;
                            $scope.team_id = form.data.team_id;
                            $timeout(function () {
                                $window.location.href = "/signin";
                            }, 2000);
                        }
                        ;
                    },
                    function (res) {
                        if (2022 == res.code) {
                            form.$errors.unshift("用户名已存在!");
                        }
                        else if (2002 == res.code) {
                            form.$errors.unshift("注册邮箱已被使用!");
                        }
                        else {
                            form.$errors.unshift("注册失败，请稍后再试!");
                        }
                    }, function () {
                        $scope.is_registering = !1;
                    }
                );
            };

        $scope.js_goto_team = function () {
            $window.location.href = "/dashboard";
        };
    }
]);

innerApp.controller("activeCtrl", ["$rootScope", "$scope", function (e, t) {
    e.global.title = "帐号激活";
    e.global.loading_done = true;
    setTimeout(function () {
        $window.location.href = "/signin";
    }, 2000);
}]);

innerApp.controller("user_forgot_ctrl", ["$rootScope", "$scope", function ($rootScope, $scope) {
    $rootScope.global.title = "忘记密码",
        $scope.send_success = !1,
        $scope.js_forget_password = function (e) {
            $scope.is_sending = !1,
                wt.data.user.forgot_pwd(
                    $scope.forget_email,
                    function () {
                        $scope.send_success = 1;
                    },
                    function (req) {
                        var err_msg = "";
                        switch (req.code) {
                            case 2001:
                                err_msg = "该邮箱地址不存在，请重新输入";
                                break;
                            case 2016:
                                err_msg = "邮件发送失败，请稍后重试";
                                break;
                            default:
                                err_msg = "服务器在梦游，请稍后重试";
                                break;
                        }
                        ;
                        e.$errors.unshift(err_msg);
                        $('input[name="forget_email"]').addClass("error"), void 0;
                    },
                    function () {
                        $scope.is_sending = 1;
                    }
                );
        }
}]);

innerApp.controller("user_password_reset_ctrl", ["$rootScope", "$scope", "$routeParams", "$http", "$location", "$window",
    function ($rootScope, $scope, $routeParams, $http, $location, $window) {
        $scope.send_success = false;
        var o = $window.location.search.substring($window.location.search.indexOf("token=") + 6);
        _.isEmpty(o) && ($scope.invalid_input = true), $scope.js_reset_password = function (e) {
            $scope.invalid_input || e.$invalid || ($scope.is_resetting = true, wt.data.user.reset_pwd(o, $scope.reset_password, function () {
                $scope.reset_success = true
            }, function () {
                e.$errors.unshift("重置失败，请重新再试")
            }, function () {
                $scope.is_resetting = false
            }))
        }, $scope.js_go_to_team = function () {
            $scope.reset_success && $rootScope.login($scope.signup_name, $scope.signup_password, null, function (e) {
                $location.path("/teams/" + e.data.team_id)
            }, null)
        }
    }
]);

innerApp.controller("user_email_reset_ctrl", ["$rootScope", "$scope", "$window",
    function ($rootScope, $scope, $window) {
        var n = $window.location.search.substring($window.location.search.indexOf("token=") + 6);
        _.isEmpty(n) ? $scope.invalid_input = true : ($scope.is_resetting = true, wt.data.user.reset_email(n, function (i) {
            $scope.reset_success = true, $scope.new_email = i.data, e.logout(true)
        }, function () {
            $scope.invalid_input = true
        }, function () {
            $scope.is_resetting = false
        }))
    }
]);

innerApp.controller("user_public_ctrl", ["$rootScope", "$scope", "$location",
    function (e, t, i) {
        e.global.title = "首页",
            t.js_goto_index = function () {
                i.url("/index");
            },
            t.js_goto_template = function () {
                i.url("/template");
            },
            t.js_goto_study = function () {
                i.url("/post");
            },
            t.js_goto_customer = function () {
                i.url("/customer");
            },
            t.js_goto_club = function () {
                i.url("/club");
            }
        var vm = t.vm = {};
    }
]);

innerApp.controller("home_share_ctrl", ["$rootScope", "$scope", "$http",
    function ($rootScope, $scope, $http) {
        $rootScope.global.title = "推荐给好友";

        $scope.share_desc = "";
        $scope.share_email = "";
        $scope.share_msg = "";

        var init = function () {
            var reg = new RegExp("name", "g");

            $http.get("/files/invitation_letter.txt").success(function (data) {
                $scope.share_desc = data.replace(reg, $rootScope.global.me.name);
            });

            $http.get("/files/share_msg.txt").success(function (data) {
                $scope.share_msg = data.replace(reg, $rootScope.global.me.name);
            });
        };

        init();

        $scope.clear_err_info = function (e) {
            e.$errors = [];
        };

        $scope.send_share_email = function (e) {
            if (!$scope.share_email) {
                e.$errors.unshift("请输入邮箱地址");
            }
            else if (!kzi.validator.isEmail($scope.share_email)) {
                e.$errors.unshift('邮箱格式输入不正确');
            }
            else if (!$scope.share_desc) {
                e.$errors.unshift("请输入邮件内容");
            }
            else {
                $scope.is_sending = !0;
                var data = {name: $scope.share_email, content: $scope.share_desc};
                wt.data.user.invitation(data, function () {
                    kzi.msg.success("邀请成功", function () {
                    });
                }, function () {
                    e.$errors.unshift('邀请失败，请重新再试');
                }, function () {
                    $scope.is_sending = !1;
                });
            }
        };

    }
]);