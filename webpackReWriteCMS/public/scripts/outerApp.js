"use strict";
var innerApp = angular.module("innerApp", ["ngRoute",
    "ngSanitize",
    "ui.highlight",
    "ui.bootstrap",
    "ui.select2",
    "ui.bootstrap.popbox",
    "blueimp.fileupload",
    //"wt.tagCloud",
    "wt.new.editor",
    "wt.service",
    "wt.bus",
    "wt.filter",
    "wt.directive",
    "wt.template",
    "mgcrea.ngStrap"
]);


innerApp.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                // handle the case where the user is not authenticated
                //$window.location.href = "/signin";
            }
            //return $q.reject(rejection);
        }
    };
});

innerApp.config(["$httpProvider", "fileUploadProvider", "$sceDelegateProvider",
    function ($httpProvider, fileuploadProvider, $sceDeleageProvider) {
        $httpProvider.interceptors.push('authInterceptor'),
            //delete $httpProvider.defaults.headers.common["X-Requested-With"];
            angular.extend(fileuploadProvider.defaults, {
                pasteZone: null,
                drapZone: null,
                disableImageResize: true,
                minFileSize: 0,
                maxFileSize: 1e8,
                maxNumberOfFiles: 100,
                autoUpload: true,
                messages: {
                    maxNumberOfFiles: "超过文件最大数",
                    acceptFileTypes: "文件格式不支持",
                    maxFileSize: "文件太大",
                    minFileSize: "文件太小"
                }
            });
        $sceDeleageProvider.resourceUrlWhitelist([kzi.config.box_url(), kzi.config.box_url_regex(), kzi.config.wtbox_url, "self", 'http://www.bonday.cn/*'])
    }
]);

innerApp.config(function ($sceProvider) {
    $sceProvider.enabled(false);
});

innerApp.run(["$rootScope", "$rootElement", "$location", "$route",
    "rest", "data", "bus", "utility", "socket", "$routeParams",
    "$modal", "$window", "$timeout", "$http", "$document", "$q",
    function ($rootScope, $rootElement, $location, $route,
              rest, data, bus, utility, socket, $routeParams,
              $modal, $window, $timeout, $http, $document,$q) {
        wt.rest = rest,
            wt.data = data,
            wt.bus = bus,
            wt.utility = utility;
        var m = false, h = null;

        //将多处需要使用的资源数据配置为全局的，避免多次请求
        $rootScope.scoreConfig = kzi.constant.score.config;
        $rootScope.allPostTypes = [];

//        $http.get('/json/scorerule.json').success(function (res) {
//            $rootScope.scoreConfig = res.score;
//        });

        $http.get('/json/manager/postType.json').success(function (res) {
            $rootScope.allPostTypes = res.data;
        });

        //设置用户登录信息
        $rootScope.setLoginInfo = function (loginInfo) {
            if (!_.isEmpty(loginInfo)) {
                $window.sessionStorage.token = loginInfo.token;

                _.isEmpty(loginInfo.setting) || $window.sessionStorage.setItem("search_setting", loginInfo.setting.proKeys);

                var userInfo = loginInfo.session;

                if (!_.isEmpty(userInfo)) {
                    $window.sessionStorage.uid = userInfo.uid;//用户id
                    $window.sessionStorage.role = userInfo.role;//用户权限等级
                    $window.sessionStorage.name = userInfo.name;//用户登录帐号
                    $window.sessionStorage.email = userInfo.email || "";//注册邮箱地址
                    $window.sessionStorage.mainIndustryCode = userInfo.f_tradecode;//一级行业编号
                    $window.sessionStorage.subIndustryCode = userInfo.s_tradeCode;//二级行业编号

                    $window.sessionStorage.mainIndustryName = userInfo.f_tradename;//一级行业编号
                    $window.sessionStorage.subIndustryName = userInfo.s_tradename;//二级行业编号

                    $window.sessionStorage.score = userInfo.score;//用户积分
                    $window.sessionStorage.reply_email = userInfo.reply_email || "";//回复邮件地址
                    $window.sessionStorage.display_name = userInfo.display_name;//昵称
                    $window.sessionStorage.companyName = userInfo.companyName;//公司名称
                    $window.sessionStorage.defaultTemplate = userInfo.defaultTemplate;//默认模板
                    $window.sessionStorage.firstLoad = userInfo.first_load;
                }
                loginInfo = null;
                userInfo = null;
            }
        };

        $rootScope.global = {
            config: kzi.config,
            title: "",
            me: wt.me || {},
            is_login: !_.isUndefined(wt.me) && !_.isEmpty(wt.me.uid),
            loading_init: true,
            loading_done: false,
            header_menu: "index",
            right_isfold: true,
            is_outter: true,
            show_msg: false,
            right_sidebar_is_fold: true,
            right_sidebar_is_show: true,
            right_sidebar_show_part: 0,
            project_iconmenu: "task",
            project_sidebar_view: "member",
            project_sidebar_foldview: "module",
            calendar_sidebar_view: "event",
            calendar_fold: true,
            loaded_notice_count: false,
            customers_count: [],
            all_customers_count: 0,
            wohoo_show: false
        };

        /**
         * 修改积分显示
         * @param score 为正数，表示增加积分；为负数，表示减去积分
         * @param reason
         */
        $rootScope.updatescore = function (score, reason) {
            var score_temp = $rootScope.global.me.score * 1 + 1*score;
            if (score_temp >= 0) {
                $rootScope.setScore(score_temp);
                _.isEmpty(reason) || kzi.msg.success(reason, null);
            }
            else {
                kzi.msg.error("积分修改失败，请刷新页面！");
            }
        };

        /**
         * 设置积分
         * @param score
         */
        $rootScope.setScore = function (score) {
            window.sessionStorage.score = 1*score;
            $rootScope.global.me.score = 1*score;
        };

        /**
         * 获取用户积分
         */
        var getScore = function () {
            $http.get('/api/user/score').success(function (resp) {
                if (!_.isEmpty(resp) && resp.code == 200) {
                    $rootScope.setScore(resp.data);
                }
            });
        };
        $rootScope.global.is_login && getScore();

        //top_sidebar
        $rootScope.own_statistics={
                task_collect:0,
                mail_send:0 ,
                mail_all:0,
                mail_open:0,
                task_all:0,
                task_no_send:0
        }
        var getStatistics=function() {
            wt.data.user.get_developing_statistics(function success(resp) {
                if (!_.isEmpty(resp) && resp.code == 200) {
                    $rootScope.own_statistics = {
                        task_collect: resp.data.task_collect,
                        mail_send: resp.data.mail_send_today,
                        mail_all: resp.data.mail_all,
                        mail_open: resp.data.mail_open,
                        task_all: resp.data.task_all,
                        task_no_send: resp.data.task_no_send
                    }
                }
            })
        };
        $rootScope.global.is_login&& getStatistics();
        $rootScope.$on(kzi.constant.event_names.public_customer_colloct_success,function(){
            $rootScope.own_statistics.task_collect++;
            $rootScope.own_statistics.task_all++;
            $rootScope.own_statistics.task_no_send++;
        });
        $rootScope.$on(kzi.constant.event_names.public_customer_send_mail_success,function(event, parm){
            $rootScope.own_statistics.mail_send+=parm.mail_count;
            $rootScope.own_statistics.mail_all+=parm.mail_count;
        });

        $rootScope.getGroupCustomerCountDone = (function () {
                $http.get('/api/tasks/group/customers').success(function (res) {
                    $rootScope.global.customers_count = res.data;
                    $rootScope.global.all_customers_count = res.totalItems;
                    deferred.resolve();
                });
            var deferred = new $q.defer();
            return deferred.promise;
        }).call(this);


        //管理员删除操作
        $rootScope.del_entity = function (entity_id, uid, entity_type) {
            if (!_.isEmpty(entity_id) && !_.isEmpty(entity_type)) {
                var successFunc = function () {
                    kzi.msg.success("删除成功！", function () {
                    });
                    $rootScope.$broadcast(kzi.constant.event_names.entity_del, {"id": entity_id})
                };
                var errorFunc = function (resp) {
                    var err_msg = "删除失败！";
                    switch (resp.code) {
                        case 1005:
                            err_msg = "无权限操作！";
                            break;
                        default:
                            break;
                    }
                    kzi.msg.error(err_msg, function () {
                    });
                };
                var thenFunc = function () {
                };

                switch (entity_type) {
                    case "post":
                        wt.data.post.del("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "template":
                        wt.data.template.del("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "task":
                        wt.data.task.del("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    default:
                        break;
                }
                ;
            }
            ;
        };

        $rootScope.skip = function (url) {
            window.open(url);
        };

        //todo 需添加已发送的邮件信息
        $rootScope.open_mail_prompt = function (mails) {
            $rootScope.show_mail_prompt = true;
            $timeout(function () {
                $rootScope.show_mail_prompt = false;
            }, 5000);
        };

        $rootScope.cascading_queue = [];
        $rootScope.need_login = function (url) {
            if (!$rootScope.global.is_login) {
                $modal.open({
                    templateUrl: '/view/modal/signin.html',
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.close();
                        };
                        $scope.to_signup = function () {
                            $modalInstance.close();
                            $timeout(function () {
                                window.location.href = "/signup";
                            }, 100);
                        };
                        $scope.to_forgot = function () {
                            $modalInstance.close();
                            $timeout(function () {
                                window.location.href = "/forgot";
                            }, 100);
                        };
                    }]
                });
                _.isEmpty(url) || ($rootScope.global.return_path = url);
            }
            ;

            return $rootScope.global.is_login;
        };

        $rootScope.pid = "";
        $rootScope.notice_count = 0;

        $rootScope.selectedTasks = [];
        $rootScope.selectedMails = [];
        $rootScope.selectedTemplates = [];

        $rootScope.showSidebar = false;
        $rootScope.teams = [];
        $rootScope.projects = [];
        $rootScope.project = {
            info: {},
            members: [],
            entries: [],
            tasks: [],
            files: [],
            posts: [],
            templates: [],
            pages: [],
            events: [],
            feeds: [],
            currentEntry: null,
            currentTask: null,
            entryIndex: 0,
            taskIndex: 0
        };
        $rootScope.industry = {
            mainIndustry: "全部",
            current_subIndustry: "全部",
            selected: [],
            searched: false,
            cancel: {
                sub: {
                    flag: false,
                    index: 0
                },
                main: {
                    flag: false
                }
            }
        };
        $rootScope.has_collect = {};
        $rootScope.template = {
            info: {},
            members: [],
            entries: [],
            tasks: [],
            files: [],
            posts: [],
            templates: [],
            pages: [],
            events: [],
            feeds: [],
            currentEntry: null,
            currentTask: null,
            entryIndex: 0,
            taskIndex: 0
        };

        $rootScope.js_right_sidebar_toggle = function () {
            $rootScope.global.right_sidebar_is_fold = !$rootScope.global.right_sidebar_is_fold,
                $rootScope.global.right_sidebar_is_fold ? kzi.localData.set("right_sidebar_is_fold", 1) : kzi.localData.set("right_sidebar_is_fold", 0)
        };
        $rootScope.locator = {
            hide_slide: function () {
                $rootScope.locator.show_slide = false;
                $rootScope.locator.show_detail_task_id = null;
                $rootScope.locator.show_detail_post_id = null;
                $rootScope.locator.show_detail_event_id = null;
                $rootScope.locator.show_detail_file_id = null;
                $rootScope.locator.show_detail_page_id = null;
                $rootScope.locator.show_detail_mail_id = null;
                $rootScope.$broadcast(kzi.constant.event_names.on_slide_hide);
            },
            to_project: function (e, i) {
                $rootScope.locator.hide_slide();
                i = _.isUndefined(i) ? "" : "/" + i, $location.path("/project/" + e + i);
            },
//            to_customer: function (pid, tid, show_prj, comment_id) {
//                $rootScope.locator.show_detail_task_id = tid;
//                $rootScope.locator.type = "public_customer";
//                $rootScope.locator.show_slide = true;
//                $rootScope.locator.show_prj = show_prj;
//                $rootScope.$broadcast(kzi.constant.event_names.load_entity_task, {
//                    pid: pid,
//                    tid: tid,
//                    comment_id: comment_id
//                })
//            },
            to_task: function (e, i, n, a) {
                $rootScope.locator.show_detail_task_id = i;
                $rootScope.locator.type = "task";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_task, {
                    pid: e,
                    tid: i,
                    comment_id: a
                })
            },
            to_event: function (e, i, n, a) {
                $rootScope.locator.type = "event";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_detail_event_id = i;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_event, {
                    pid: e,
                    event_id: i,
                    comment_id: a
                })
            },
            to_file: function (e, i, n, a) {
                $rootScope.locator.type = "file";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_detail_file_id = i;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_file, {
                    pid: e,
                    fid: i,
                    comment_id: a
                })
            },
            to_post: function (e, i, n, a) {
                $rootScope.locator.type = "post";
                $rootScope.locator.show_detail_post_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_post, {
                    pid: e,
                    post_id: i,
                    comment_id: a
                })
            },
            to_template: function (e, i, n, a) {
                $rootScope.locator.type = "template";
                $rootScope.locator.show_detail_template_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_template, {
                    pid: e,
                    template_id: i,
                    comment_id: a
                })
            },
            to_email: function (e, i, n) {
                $rootScope.locator.type = "mail";
                $rootScope.locator.show_detail_mail_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_mail, {
                    pid: e,
                    mail_id: i
                })
            },
            to_page: function (e, i, n, a) {
                $rootScope.locator.type = "page";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_detail_page_id = i;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_page, {
                    pid: e,
                    page_id: i,
                    comment_id: a
                })
            },
            to_mail: function (e, i) {
                $rootScope.locator.type = "mail";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_detail_mail_id = e;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_mail, {
                    mail_id: e,
                    comment_id: i
                })
            },
            to_entity: function (e, i, n, a) {
                switch (i.etype) {
                    case kzi.constant.entity_type.task:
                        $rootScope.locator.to_task(e, i.eid, n, a);
                        break;
                    case kzi.constant.entity_type.file:
                        $rootScope.locator.to_file(e, i.eid, n, a);
                        break;
                    case kzi.constant.entity_type.post:
                        $rootScope.locator.to_post(e, i.eid, n, a);
                        break;
                    case kzi.constant.entity_type.mail:
                        $rootScope.locator.to_mail(e, i.eid, n, a);
                        break;
                    case kzi.constant.entity_type.template:
                        $rootScope.locator.to_template(e, i.eid, n, a);
                        break;
                    case kzi.constant.entity_type.page:
                        $rootScope.locator.to_page(e, i.eid, n, a);
                        break;
                    case kzi.constant.entity_type.event:
                        $rootScope.locator.to_event(e, i.eid, n, a);
                        break;
                    default:
                }
            }
        };
        $rootScope.upload_queue = {
            get_queue: function () {
                if ("object" == typeof $("#global_file_upload").scope().queue) {
                    var e = $("#global_file_upload").scope().queue;
                    return e.length
                }
            },
            _get_queue: function (e, t, i) {
                var n = [];
                try {
                    if ("object" == typeof $("#global_file_upload").scope().queue) {
                        var a = $("#global_file_upload").scope().queue;
                        n = _.filter(a, function (n) {
                            var a = true;
                            if (_.isUndefined(n.formData)) return a = false;
                            if (!_.isEmpty(n.ext)) return a = false;
                            if (n.formData.type !== t) a = false;
                            else if (n.formData.pid !== e) a = false;
                            else switch (t) {
                                    case "task":
                                        n.formData.tid !== i.tid && (a = false);
                                        break;
                                    case "post":
                                        n.formData.post_id !== i.post_id && (a = false);
                                        break;
                                    case "template":
                                        n.formData.template_id !== i.template_id && (a = false);
                                        break;
                                    case "file":
                                        n.formData.fid !== i.fid && (a = false);
                                        break;
                                    case "project":
                                        n.formData.folder_id !== i.folder_id && (a = false);
                                        break;
                                    case "comment":
                                        _.isUndefined(i.tid) || n.formData.tid === i.tid || (a = false), _.isUndefined(i.event_id) || n.formData.event_id === i.event_id || (a = false), _.isUndefined(i.post_id) || n.formData.post_id === i.post_id || (a = false), _.isUndefined(i.page_id) || n.formData.page_id === i.page_id || (a = false)
                                }
                            return a
                        })
                    }
                    return n
                } catch (s) {
                    return n
                }
            },
            get_chat: function (e) {
                return this._get_queue(e, "chat")
            },
            get_task: function (e, t) {
                return this._get_queue(e, "task", {
                    tid: t
                })
            },
            get_event: function (e, t) {
                return this._get_queue(e, "event", {
                    event_id: t
                })
            },
            get_post: function (e, t) {
                return this._get_queue(e, "post", {
                    post_id: t
                })
            },
            get_template: function (e, t) {
                return this._get_queue(e, "template", {
                    template_id: t
                })
            },
            get_file: function (e, t) {
                var i = this._get_queue(e, "file", {
                    fid: t
                });
                return i.length > 0 && (i = [i[i.length - 1]]), i
            },
            get_project: function (e, t) {
                return this._get_queue(e, "project", {
                    folder_id: t
                })
            },
            get_comment_task: function (e, t) {
                return this._get_queue(e, "comment", {
                    tid: t
                })
            },
            get_mail_task: function (e, t) {
                return this._get_queue(e, "mail", {
                    tid: t
                })
            },
            get_comment_event: function (e, t) {
                return this._get_queue(e, "comment", {
                    event_id: t
                })
            },
            get_comment_post: function (e, t) {
                return this._get_queue(e, "comment", {
                    post_id: t
                })
            },
            get_comment_template: function (e, t) {
                return this._get_queue(e, "comment", {
                    template_id: t
                })
            },
            get_comment_mail: function (e, t) {
                return this._get_queue(e, "comment", {
                    mail_id: t
                })
            },
            get_comment_page: function (e, t) {
                return this._get_queue(e, "comment", {
                    page_id: t
                })
            },
            get_comment_file: function (e, t) {
                var i = this._get_queue(e, "comment", {
                    fid: t
                });
                return i.length > 0 && (i = [i[i.length - 1]]), i
            }
        };
        $rootScope.returnToSignin = function () {
            $rootScope.global.is_login = false;
            $rootScope.locator.hide_slide();
            $window.location.href = "/signin";
        };
        $rootScope.login = function (name, paw, s, o, r, l) {
            wt.data.signin(name, paw, function (i) {
                $rootScope.global.me = i.data.session;
                $rootScope.global.is_login = true;
                wt.socket.emit("online"),
                $rootScope.clear_project();
                $rootScope.teams = [];
                $rootScope.projects = [];
                $rootScope.global.loaded_notice_count = false;
                null !== s && $location.path(s);
                angular.isFunction(o) && o(i);
            }, r, l);
        };

        /**
         * 用户退出登录
         * @param i
         */
        $rootScope.logout = function (i) {
            $rootScope.global.is_login = false,
                delete $rootScope.global.me,
                wt.utility.clear_login_info();
            wt.data.signout(function () {
                wt.socket.emit("offline"), i || ($window.location.href = "/")
            }, null, null)
        };


        $rootScope.auth = function (i, n) {
            wt.data.auth(function (e) {
                200 === e.code ? ($rootScope.global.me = e.data.session,
                    $rootScope.global.me.role = "1",
                    $rootScope.global.is_login = true,
                    null !== i && "function" == typeof i && i()) : (delete $rootScope.global.me,
                    $rootScope.global.is_login = false,
                    null !== n && "function" == typeof n && n())
            })
        };
        $rootScope.load_teams = function (loadTeams, loadFailFunction, loadComplete) {
            var s = $rootScope.teams;
            if (s && s.length > 0) {
                angular.isFunction(loadTeams) && loadTeams(s);
                angular.isFunction(loadComplete) && loadComplete();
            } else {
                wt.data.team.get_list(function (eleven) {
                    $rootScope.teams = eleven.data;
                    angular.isFunction(loadTeams) && loadTeams(eleven.data);
                }, loadFailFunction, loadComplete)
            }
        };
        $rootScope.load_team = function (team_id, loadSuccessCallback, loadFailCallback) {
            wt.data.team.get(team_id, function (response) {
                angular.isFunction(loadSuccessCallback) && loadSuccessCallback(response.data)
            }, loadFailCallback)
        };
        $rootScope.load_team_from_cache = function (e, i) {
            var n = null;
            $rootScope.teams && $rootScope.teams.length > 0 && (n = _.findWhere($rootScope.teams, {
                team_id: e
            }));
            angular.isFunction(i) && i(n)
        };
        $rootScope.load_projects = function (first, second, third) {
            var s = $rootScope.projects;
            if (_.isEmpty(s)) {
                wt.data.project.get_all("active", function (eleven) {
                    $rootScope.projects = eleven.data;
                    $rootScope.sort_projects();
                    angular.isFunction(first) && first($rootScope.projects);
                    $rootScope.$broadcast(kzi.constant.event_names.load_teams_projects_sucess);
                    $rootScope.global.loading_init = false;
                }, second, third)
            } else {
                angular.isFunction(first) && first(s);
                angular.isFunction(third) && third();
            }
        };
        $rootScope.reload_projects = function (i, n, a) {
            wt.data.project.get_all("active", function (e) {
                $rootScope.projects = e.data, $rootScope.sort_projects();
                angular.isFunction(i) && i($rootScope.projects)
            }, n, a)
        };
        $rootScope.sort_projects = function () {
            $rootScope.projects = _.sortBy($rootScope.projects, function (e) {
                return e.pos
            })
        };
        $rootScope.load_project = function (i, n, a, s) {
            var o = $rootScope.project;
            if (o && o.info && o.info.pid == i && o.members && o.members.length > 0) {
                n(o), _.isFunction(s) && s()
            } else {
                $rootScope.project.members = [];
                $rootScope.project.entries = [];
                $rootScope.project.tasks = [];
                $rootScope.project.files = [];
                $rootScope.project.posts = [];
                $rootScope.project.pages = [];
                $rootScope.project.events = [];
                $rootScope.project.feeds = [];
                $rootScope.project.init_chat = null;
                $rootScope.project.currentEntry = null;
                $rootScope.project.currentTask = null;
                $rootScope.project.entryIndex = 0;
                $rootScope.project.taskIndex = 0;
                if (i) {
                    wt.data.project.get(i, function (e) {
                        $rootScope.project.info = e.data.info;
                        $rootScope.project.members = e.data.members;
                        n($rootScope.project)
                    }, a, s)
                }
            }
        };
        $rootScope.load_project_from_cache = function (e, i) {
            var n = null;
            $rootScope.projects && $rootScope.projects.length > 0 && (n = _.findWhere($rootScope.projects, {
                pid: e
            })), angular.isFunction(i) && i(n)
        };
        $rootScope.load_tasks = function (i, n, a, s) {
            $rootScope.load_project(i, function (o) {
                o.entries && o.entries.length > 0 ? (n(o), _.isFunction(s) && s()) : wt.data.entry.get_list(i, function (e) {
                    var i = _.sortBy(e.data.entries, function (e) {
                            return e.pos
                        }),
                        a = e.data.tasks;
                    $rootScope.project.entries = i, $rootScope.project.tasks = a, n(o)
                }, a, s)
            }, function (e) {
                _.isFunction(a) && a(e), _.isFunction(s) && s(e)
            })
        };
        $rootScope.load_task = function (i, n, a, s) {
            $rootScope.load_project(i, function (t) {
                if (t.tasks && t.tasks.length > 0) {
                    var o = _.findWhere(t.tasks, {
                        tid: n
                    });
                    o ? a(t, o) : wt.data.task.get(i, n, function (e) {
                        a(t, e.data)
                    }, s)
                } else wt.data.task.get(i, n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };
        $rootScope.load_reward = function (i, n, a, s) {
            $rootScope.load_project(i, function (t) {
                if (t.tasks && t.tasks.length > 0) {
                    var o = _.findWhere(t.tasks, {
                        tid: n
                    });
                    o ? a(t, o) : wt.data.reward.get(i, n, function (e) {
                        a(t, e.data)
                    }, s)
                } else wt.data.reward.get(i, n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };
        $rootScope.reload_entries = function (i) {
            wt.data.entry.get_list(i, function (e) {
                var i = _.sortBy(e.data.entries, function (e) {
                        return e.pos
                    }),
                    n = e.data.tasks;
                $rootScope.project.entries = i, $rootScope.project.tasks = n, $rootScope.$broadcast("socket_message_entry_list", null)
            })
        };
        $rootScope.sort_entries = function () {
            var e = $rootScope.project.entries;
            null != e && (e = _.sortBy(e, function (e) {
                return e.pos
            }), $rootScope.project.entries = e)
        };
        $rootScope.load_file_db = function (i, n, a, s, o) {
            wt.data.file.get_list(i, n, function (e) {
                $rootScope.folder = {
                    folder_id: e.data.folder.folder_id,
                    name: e.data.folder.name
                }, _.each(e.data.files, function (e) {
                    e.icon = kzi.helper.build_file_icon(e);
                    var i = _.findWhere($rootScope.project.files, {
                        fid: e.fid
                    });
                    i || $rootScope.project.files.push(e)
                }), a($rootScope.project)
            }, s, o)
        };
        $rootScope.load_files = function (e, i, n, a, s) {
            $rootScope.load_project(e, function (o) {
                if (o.files.length > 0) {
                    var r = _.findWhere(o.files, {
                        folder_id: i
                    });
                    r ? (n(o), _.isFunction(s) && s()) : $rootScope.load_file_db(e, i, n, a, s)
                } else $rootScope.project.files = [], $rootScope.load_file_db(e, i, n, a, s)
            }, a)
        };
        $rootScope.load_file = function (i, n, a, s) {
            $rootScope.load_project(i, function (o) {
                if (o.files && o.files.length > 0) {
                    var r = _.findWhere($rootScope.project.files, {
                        fid: n
                    });
                    r ? a(o, r) : wt.data.file.get(i, n, function (e) {
                        var t = e.data;
                        t.icon = kzi.helper.build_file_icon(t), a(o, t)
                    }, s)
                } else wt.data.file.get(i, n, function (e) {
                    var t = e.data;
                    t.icon = kzi.helper.build_file_icon(t), a(o, t)
                }, s)
            }, s)
        };
        $rootScope.load_project_feeds = function (i, n, a, s) {
            _.isEmpty($rootScope.project.info) || ($rootScope.project.info.pid !== i || _.isEmpty($rootScope.project.feeds) ? wt.data.activity.get_prj_feed(i, function (e) {
                $rootScope.project.feeds = e.data, _.isFunction(n) && n($rootScope.project.feeds)
            }, a, s) : (_.isFunction(n) && n($rootScope.project.feeds), _.isFunction(s) && s()))
        };
        $rootScope.load_project_init_chat = function (i, n, a, s) {
            _.isEmpty($rootScope.project) || ($rootScope.project.info && $rootScope.project.info.pid === i && !_.isEmpty($rootScope.project.init_chat) ? (_.isFunction(n) && n($rootScope.project.init_chat), _.isFunction(s) && s()) : wt.data.project.get_chat_list(i, 1, 5, function (e) {
                $rootScope.project.init_chat = e.data, _.isFunction(n) && n($rootScope.project.init_chat)
            }, a, s))
        };
        $rootScope.clear_project_init_chat = function () {
            $rootScope.project.init_chat = null
        };
        $rootScope.clear_project_feeds = function () {
            $rootScope.project.feeds = []
        };
        $rootScope.clear_project = function () {
            $rootScope.project.info = {}, $rootScope.project.members = [], $rootScope.project.entries = [], $rootScope.project.tasks = [], $rootScope.project.files = [], $rootScope.project.posts = [], $rootScope.project.pages = [], $rootScope.project.events = [], $rootScope.project.feeds = [], $rootScope.project.init_chat = null, $rootScope.project.currentEntry = null, $rootScope.project.currentTask = null, $rootScope.project.entryIndex = 0, $rootScope.project.taskIndex = 0
        };
        $rootScope.load_project_members = function (i, n, a) {
            $rootScope.load_project(i, function (a) {
                _.isEmpty(a.members) ? ($rootScope.project.members = [], wt.data.project.get_members(i, function (e) {
                    $rootScope.project.members = e.data, angular.isFunction(n) && n($rootScope.project)
                })) : angular.isFunction(n) && n(a)
            }, a)
        };
        $rootScope.load_project_templates = function (i, n, a) {
            $rootScope.load_project(i, function (a) {
                _.isEmpty(a.templates) ? ($rootScope.project.templates = [], wt.data.project.get_templates(i, function (e) {
                    $rootScope.project.templates = e.data, angular.isFunction(n) && n($rootScope.project)
                })) : angular.isFunction(n) && n(a)
            }, a)
        };
        $rootScope.load_team_members = function (t, i, n, a) {
            wt.data.team.get_team_members(t, function (e) {
                angular.isFunction(i) && i(e.data)
            }, n, a)
        };
        $rootScope.reload_team_members = function (t, i, n, a) {
            wt.data.team.get_team_members(t, function (e) {
                angular.isFunction(i) && i(e.data)
            }, n, a)
        };
        $rootScope.load_unread_notices = function (i) {
            $rootScope.global.loaded_notice_count !== true && ($rootScope.global.loaded_notice_count = true, wt.data.notice.unread(function (e) {
                $rootScope.notice_count = 0, _.each(e.data, function (e) {
                    $rootScope.notice_count += e.count
                }), angular.isFunction(i) && i($rootScope.notice_count)
            }, function () {
                $rootScope.global.loaded_notice_count = false
            }))
        };
        var g = function (e) {
                var t = _.size(e.todos),
                    i = _.size(_.where(e.todos, {
                        checked: 1
                    }));
                t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.todo_checked_count = i, e.badges.todo_count = t
            },
            v = function (e, t) {
                _.each(e, function (e) {
                    e.projects = _.where(t, {
                        team_id: e.team_id
                    })
                })
            };
        $rootScope.refresh_cache = {
            team: {
                dismiss: function (e) {
                    $rootScope.teams = _.reject($rootScope.teams, function (t) {
                        return t.team_id === e
                    });
                    $rootScope.projects = _.reject($rootScope.projects, function (t) {
                        return t.team_id === e
                    })
                },
                leave: function (e) {
                    $rootScope.teams = _.reject($rootScope.teams, function (t) {
                        return t.team_id === e
                    });
                    $rootScope.projects = _.reject($rootScope.projects, function (t) {
                        return t.team_id === e
                    })
                }
            },
            project: {
                add: function (e) {
                    var i = _.findWhere($rootScope.projects, {
                        pid: e.pid
                    });
                    i || $rootScope.projects.push(e)
                },
                update: function (e, i, n) {
                    e == $rootScope.project.info.pid && ($rootScope.project.info.name = i, $rootScope.project.info.desc = n);
                    var a = _.findWhere($rootScope.projects, {
                        pid: e
                    });
                    a && (a.name = i, a.desc = n)
                },
                set_logo: function (e, i, n) {
                    e == $rootScope.project.info.pid && ($rootScope.project.info.bg = i, $rootScope.project.info.pic = n);
                    var a = _.findWhere($rootScope.projects, {
                        pid: e
                    });
                    a && (a.bg = i, a.pic = n)
                },
                remove: function (e) {
                    $rootScope.projects && $rootScope.projects.length > 0 && ($rootScope.projects = _.reject($rootScope.projects, function (t) {
                        return t.pid == e
                    }))
                },
                add_admin: function (e, i) {
                    if ($rootScope.projects && $rootScope.projects.length > 0) {
                        var n = _.findWhere($rootScope.projects, {
                            pid: e
                        });
                        if (n) {
                            var a = _.findWhere(n.admins, {
                                uid: i.uid
                            });
                            a || n.admins.push(i)
                        }
                    }
                },
                remove_admin: function (e, i) {
                    if ($rootScope.projects && $rootScope.projects.length > 0) {
                        var n = _.findWhere($rootScope.projects, {
                            pid: e
                        });
                        n && (n.admins = _.reject(n.admins, function (e) {
                            return e.uid == i.uid
                        }))
                    }
                }
            },
            task: {
                add: function (e) {
                    var i = _.findWhere($rootScope.project.tasks, {
                        tid: e.tid
                    });
                    i || $rootScope.project.tasks.push(e)
                },
                update_full: function (e) {
                    var i = _.findWhere($rootScope.project.tasks, {
                        tid: e.tid
                    });
                    i && (i.name = e.name, i.desc = e.desc, i.pos = e.pos, i.completed = e.completed, i.is_expire = e.is_expire, i.expire_date = e.expire_date, i.badges = e.badges, i.labels = e.labels, i.members = e.members, i.watchers = e.watchers, i.todos = e.todos)
                },
                update: function (e, i, n) {
                    var a = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    a && (a.name = i, a.desc = n)
                },
                trash: function (e) {
                    $rootScope.project.tasks = _.reject($rootScope.project.tasks, function (t) {
                        return t.tid == e
                    })
                },
                move: function (e, i, n, a) {
                    var s = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (s) {
                        s.pos = a, s.entry_id = n;
                        var o = _.findWhere($rootScope.project.entries, {
                            entry_id: n
                        });
                        if (o) {
                            _.isEmpty(o.tasks) ? (o.tasks = [], o.tasks.push(s)) : o.tasks.push(s);
                            var r = _.findWhere($rootScope.project.entries, {
                                entry_id: i
                            });
                            r && (r.tasks = _.reject(r.tasks, function (t) {
                                return t.tid == e
                            }), r.tasks = _.sortBy(r.tasks, function (e) {
                                return e.pos
                            }), o.tasks = _.sortBy(o.tasks, function (e) {
                                return e.pos
                            }))
                        }
                    }
                },
                complete: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    n && (n.completed = i)
                },
                set_expire: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    n && (n.expire_date = i, n.badges.expire_date = i)
                },
                assign: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (n) {
                        var a = _.findWhere(n.members, {
                            uid: i.uid
                        });
                        a || (n.members.push(i), i.assigned = 1)
                    }
                },
                unassign: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (n) {
                        var a = _.findWhere(n.members, {
                            uid: i.uid
                        });
                        a && (n.members = _.reject(n.members, function (e) {
                            return e.uid == i.uid
                        })), i.assigned = 0
                    }
                },
                set_labels: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (n) {
                        var a = _.findWhere(n.labels, {
                            name: i.name
                        });
                        a || (n.labels.push(i), i.assigned = 1)
                    }
                },
                del_labels: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (n) {
                        var a = _.findWhere(n.labels, {
                            name: i.name
                        });
                        a && (n.labels = _.reject(n.labels, function (e) {
                            return e.name == i.name
                        })), i.assigned = 0
                    }
                },
                watch: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (n) {
                        var a = _.findWhere(n.watchers, {
                            uid: i.uid
                        });
                        a || (n.watchers.push(i), i.is_watch = 1)
                    }
                },
                unwatch: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (n) {
                        var a = _.findWhere(n.watchers, {
                            uid: i.uid
                        });
                        a && (n.watchers = _.reject(n.watchers, function (e) {
                            return e.uid == i.uid
                        })), i.is_watch = 0
                    }
                },
                add_todo: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (n) {
                        var a = _.findWhere(n.todos, {
                            todo_id: i.todo_id
                        });
                        a || (n.todos.push(i), g(n))
                    }
                },
                update_todo: function (e, i, n) {
                    var a = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (a) {
                        var s = _.findWhere(a.todos, {
                            todo_id: i
                        });
                        s && (s.name = n)
                    }
                },
                del_todo: function (e, i) {
                    var n = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    n && (n.todos = _.reject(n.todos, function (e) {
                        return e.todo_id === i
                    }), g(n))
                },
                change_todo_pos: function (e, i, n) {
                    var a = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (a) {
                        var s = _.findWhere(a.todos, {
                            todo_id: i
                        });
                        s && (s.pos = n)
                    }
                },
                complete_todo: function (e, i, n) {
                    var a = _.findWhere($rootScope.project.tasks, {
                        tid: e
                    });
                    if (a) {
                        var s = _.findWhere(a.todos, {
                            todo_id: i
                        });
                        s && (s.checked = n, g(a))
                    }
                }
            },
            entry: {
                add: function (e) {
                    var i = _.findWhere($rootScope.project.entries, {
                        entry_id: e.entry_id
                    });
                    i || $rootScope.project.entries.push(e)
                },
                move: function (e, i, n, a) {
                    var s = _.findWhere($rootScope.project.entries, {
                        entry_id: a
                    });
                    if (s) {
                        var o = _.findWhere($rootScope.project.tasks, {
                            tid: e
                        });
                        o.pos = i, n != a && (o.entry_id = a)
                    }
                },
                del: function (e) {
                    var i = _.findWhere($rootScope.project.entries, {
                        entry_id: e
                    });
                    i && ($rootScope.project.entries = _.reject($rootScope.project.entries, function (t) {
                        return t.entry_id === e
                    }), $rootScope.project.tasks = _.reject($rootScope.project.tasks, function (t) {
                        return t.entry_id === e
                    }))
                }
            },
            file: {
                add: function (e) {
                    if (_.isEmpty($rootScope.project.files)) $rootScope.load_files(e.pid, "", function () {
                        var n = _.findWhere($rootScope.project.files, {
                            fid: e.fid
                        });
                        n || $rootScope.project.files.push(e)
                    });
                    else {
                        var i = _.findWhere($rootScope.project.files, {
                            fid: e.fid
                        });
                        i || $rootScope.project.files.push(e)
                    }
                },
                del: function (e) {
                    $rootScope.project.files = _.reject($rootScope.project.files, function (t) {
                        return t.fid === e
                    })
                }
            },
            user: {
                avatar: function (e, i) {
                    if ($rootScope.projects && $rootScope.projects.length > 0 && _.each($rootScope.projects, function (t) {
                        if (t.admins && t.admins.length > 0) {
                            var n = _.findWhere(t.admins, {
                                uid: e
                            });
                            n && (n.avatar = i)
                        }
                    }), $rootScope.project && $rootScope.project.members && $rootScope.project.members.length > 0) {
                        var n = _.findWhere($rootScope.project.members, {
                            uid: e
                        });
                        n && (n.avatar = i), $rootScope.project.tasks && $rootScope.project.tasks.length > 0 && _.each($rootScope.project.tasks, function (t) {
                            if (t.members && t.members.length > 0) {
                                var n = _.findWhere(t.members, {
                                    uid: e
                                });
                                n && (n.avatar = i)
                            }
                        })
                    }
                    $rootScope.global.me.avatar = i
                },
                update: function (e, i, n) {
                    if ($rootScope.project && $rootScope.project.members && $rootScope.project.members.length > 0) {
                        var a = _.findWhere($rootScope.project.members, {
                            uid: e
                        });
                        a && (a.display_name = i, a.desc = n), $rootScope.project.tasks && $rootScope.project.tasks.length > 0 && _.each($rootScope.project.tasks, function (t) {
                            if (t.members && t.members.length > 0) {
                                var a = _.findWhere(t.members, {
                                    uid: e
                                });
                                a && (a.display_name = i, a.desc = n)
                            }
                        })
                    }
                    $rootScope.global.me.display_name = i, $rootScope.global.me.desc = n
                },
                remove: function (e) {
                    $rootScope.project && $rootScope.project.members && $rootScope.project.members.length > 0 && ($rootScope.project.members = _.reject($rootScope.project.members, function (t) {
                        return t.uid == e
                    }), $rootScope.project.tasks && $rootScope.project.tasks.length > 0 && (_.each($rootScope.project.tasks, function (i) {
                        i.members && i.members.length > 0 && ($rootScope.project.members = _.reject($rootScope.project.members, function (t) {
                            return t.uid == e
                        }))
                    }), $rootScope.$broadcast("socket_message_project_member_remove", {
                        uid: e
                    })))
                }
            }
        };
        $rootScope.load_common_data_in = function (loadTeamsAndProjects, loadFailCallback, loadComplete) {
            $rootScope.load_teams(function (teams) {
                    $rootScope.load_projects(function (projects) {
                        v(teams, projects);
                        if (_.isFunction(loadTeamsAndProjects)) {
                            loadTeamsAndProjects({
                                teams: teams,
                                projects: projects
                            })
                        }
                        ;
                    }, loadFailCallback, loadComplete);
                },
                function () {
                    _.isFunction(loadFailCallback) && loadFailCallback(), _.isFunction(loadComplete) && loadComplete();
                }),
                $rootScope.load_unread_notices(function () {
                    $rootScope.global.loaded_notice_count = true;
                })
        };
        $rootScope.reload_common_data_in = function (loadTeamsAndProjects, loadFailCallBack, loadComplete) {
            $rootScope.teams = [];
            $rootScope.projects = [];
            $rootScope.global.loaded_notice_count = false;
            $rootScope.load_common_data_in(loadTeamsAndProjects, loadFailCallBack, loadComplete)
        };
        $rootScope.$on(kzi.constant.event_names.emit_filter_activity_by_type, function (e, i) {
            $rootScope.$broadcast(kzi.constant.event_names.filter_activity_by_type, {
                data: i
            })
        });
        $rootScope.$on(kzi.constant.event_names.emit_filter_watch_by_type, function (e, i) {
            $rootScope.$broadcast(kzi.constant.event_names.filter_watch_by_type, {
                data: i
            })
        });
        $rootScope.$on(kzi.constant.event_names.on_file_add, function (e, i) {
            if (i && "task" === i.type) {
                var n = _.findWhere($rootScope.project.tasks, {
                    tid: i.file.formData.tid
                });
                n ? (_.isArray(n.files) ? n.files.push(i.file) : n.files = [i.file], _.isArray(n.files) && (n.badges.file_count = n.files.length)) : $rootScope.$broadcast(kzi.constant.event_names.on_task_badges_file, i)
            }
        });
        $rootScope.$on("$routeChangeStart", function (event, args) {
            //changed by czhang
            if ($window.sessionStorage.token) {
                $rootScope.global.is_login = true;
            } else {
                $rootScope.global.is_login = false;
            }
            if (args.need_load == true) {
                $rootScope.global.loading_done = false;
            } else {
                $rootScope.global.loading_done = true;
            }
            if (args.is_outter == true) {
                $rootScope.global.is_outter = true;
            } else {
                $rootScope.global.is_outter = false;
                args && args.$$route && "projects_ctrl" == args.$$route.controller || $rootScope.load_common_data_in();
            }
            kzi.console.group("RouteChange：" + $location.$$absUrl);
            kzi.console.time("$routeChange");
            kzi.console.log("$routeChangeStart");
            if (args.$$route) {
                $rootScope.global.header_menu = args.$$route.header_menu;
                $rootScope.global.project_iconmenu = args.$$route.project_iconmenu ? args.$$route.project_iconmenu : "task";
            }
            if (!$rootScope.global.is_login && !args.is_outter && !/^\/signin/g.test($location.$$path)) {
                var url = "/signin?return_url=" + $location.$$path;
                $location.url(url);
            }
        });
        $rootScope.$on("$routeChangeSuccess", function () {
            $rootScope.global.is_outter !== true && $rootScope.locator.show_slide === true && $rootScope.locator.hide_slide(), kzi.console.timeEnd("$routeChange"), kzi.console.log("$routeChangeSuccess"), kzi.console.groupEnd("RouteChange：" + $location.$$absUrl)
        }),
            $rootScope.$on("$routeChangeError", function () {
                kzi.console.timeEnd("$routeChange"), kzi.console.log("$routeChangeError"), kzi.console.groupEnd("RouteChange：" + $location.$$absUrl)
            }),
            $rootScope.$on("$routeUpdate", function () {
                kzi.console.timeEnd("$routeChange"), kzi.console.log("$routeUpdate"), kzi.console.groupEnd("RouteChange：" + $location.$$absUrl)
            }),
            $rootScope.$on("$locationChangeSuccess", function () {
                $window.scrollTo(0, 0);
                $rootScope.actualLocation = $location.path()
            });
        socket.on("message:notice_new", function (e) {
            $rootScope.notice_count++, $rootScope.$broadcast(kzi.constant.event_names.notice_new, e.notice);
            var i = kzi.localData.get(kzi.config.desk_notify_key);
            if (1 == i && e && e.notice) {
                var n = e.notice;
                if ("task_assign" == n.template) window.DesktopNotify.wt_show("/img/wt-logo.png", "新活动", n.sender.display_name + " 给你分配了新的活动 " + n.data.entity.name, function () {
                    $rootScope.locator.to_task(n.filter.prj, n.data.entity.eid, false)
                });
                else if ("task_complete" == n.template) window.DesktopNotify.wt_show("/img/wt-logo.png", "活动完成", n.sender.display_name + " 完成了活动 " + n.data.entity.name, function () {
                    $rootScope.locator.to_task(n.filter.prj, n.data.entity.eid, false)
                });
                else if ("metion_at_comment" == n.template) {
                    var a = "";
                    "task" == n.data.target.etype ? (a = "活动", window.DesktopNotify.wt_show("/img/wt-logo.png", "提到你", n.sender.display_name + " 在" + a + n.data.target.name + " 提到你 " + n.data.entity.name, function () {
                        $rootScope.locator.to_task(n.filter.prj, n.data.target.eid, false)
                    })) : "file" == n.data.target.etype ? (a = "文件", window.DesktopNotify.wt_show("/img/wt-logo.png", "提到你", n.sender.display_name + " 在" + a + n.data.target.name + " 提到你 " + n.data.entity.name, function () {
                        $rootScope.locator.to_file(n.filter.prj, n.data.target.eid, false)
                    })) : "post" == n.data.target.etype ? (a = "问答", window.DesktopNotify.wt_show("/img/wt-logo.png", "提到你", n.sender.display_name + " 在" + a + n.data.target.name + " 提到你 " + n.data.entity.name, function () {
                        $rootScope.locator.to_post(n.filter.prj, n.data.target.eid, false)
                    })) : "page" == n.data.target.etype ? (a = "文档", window.DesktopNotify.wt_show("/img/wt-logo.png", "提到你", n.sender.display_name + " 在" + a + n.data.target.name + " 提到你 " + n.data.entity.name, function () {
                        $rootScope.locator.to_page(n.filter.prj, n.data.target.eid, false)
                    })) : "event" == n.data.target.etype && (a = "事件")
                }
            }
        });
        var b = function (e, i) {
            if (i && !e) {
                var n = _.findWhere($rootScope.projects, {
                    pid: i
                });
                n && (e = n.team_id)
            }
            e && $rootScope.$broadcast("socket_message_team_projects", {
                team_id: e,
                pid: i
            })
        };
        socket.on("message:project_list", function (i) {
            i.uid != $rootScope.global.me.uid && (b(i.team_id, i.pid), wt.data.project.get_all("active", function (e) {
                $rootScope.projects = e.data, $rootScope.sort_projects(), $rootScope.$broadcast("socket_message_project_list", null)
            }))
        });
        socket.on("message:project_single", function (i) {
            var n = _.findWhere($rootScope.projects, {
                pid: i.pid
            });
            (n || $rootScope.project && i.pid === $rootScope.project.info.pid) && i.uid !== $rootScope.global.me.uid && wt.data.project.get(i.pid, function (e) {
                $rootScope.project && i.pid === $rootScope.project.info.pid && ($rootScope.project.info = e.data.info, b($rootScope.project.info.team_id, i.pid)), n && (n.name = e.data.info.name, n.desc = e.data.info.desc, n.archived = e.data.info.archived, n.pic = e.data.info.pic, n.bg = e.data.info.bg, n.curr_role = e.data.info.curr_role, b(i.team_id, i.pid))
            })
        });
        socket.on("message:project_members", function (i) {
            $rootScope.project && i.pid == $rootScope.project.info.pid && i.uid != $rootScope.global.me.uid && ($rootScope.project.members = null, wt.data.project.get_members(i.pid, function (e) {
                var i = e.data;
                $rootScope.project.members = i
            }))
        });
        socket.on("message:member_single", function (e) {
            if (e) {
                var i = _.findWhere($rootScope.project.members, {
                    uid: e.uid
                });
                i && (i.online = e.state)
            }
        });
        socket.on("message:entry_list", function (e) {
            $rootScope.project && e.pid == $rootScope.project.info.pid && e.uid != $rootScope.global.me.uid && $rootScope.reload_entries(e.pid)
        });
        socket.on("message:task_single", function (i) {
            if ($rootScope.project && i.pid == $rootScope.project.info.pid && i.uid != $rootScope.global.me.uid) {
                var n = _.findWhere($rootScope.project.tasks, {
                    tid: i.tid
                });
                n ? wt.data.task.get(i.pid, i.tid, function (e) {
                    if (n.name = e.data.name, n.desc = e.data.desc, n.pos = e.data.pos, n.completed = e.data.completed, n.expire_date = e.data.expire_date, n.badges = e.data.badges, n.labels = e.data.labels, n.members = e.data.members, n.watchers = e.data.watchers, n.todos = e.data.todos, i.moved) {
                        var a = n.entry_id;
                        n.entry_id = e.data.entry_id, $rootScope.$broadcast("socket_message_task_move", {
                            from_entry_id: a,
                            task: e.data
                        })
                    }
                }) : wt.data.task.get(i.pid, i.tid, function (e) {
                    var n = e.data,
                        a = _.findWhere($rootScope.project.tasks, {
                            tid: i.tid
                        });
                    a || $rootScope.project.tasks.push(n), $rootScope.$broadcast("socket_message_task_add", {
                        task: n
                    })
                })
            }
        });
        socket.on("message:task_delete", function (e) {
            $rootScope.project && e.pid == $rootScope.project.info.pid && e.uid != $rootScope.global.me.uid && ($rootScope.project.tasks = _.reject($rootScope.project.tasks, function (t) {
                return t.tid == e.tid
            }), $rootScope.$broadcast("socket_message_task_delete", {
                tid: e.tid
            }))
        });
        socket.on("chat", function (i) {
            $rootScope.project && $rootScope.project.info && $rootScope.project.init_chat && $rootScope.project.info.pid == i.to && (i.from === $rootScope.global.me.uid ? (i.from = $rootScope.global.me, i.is_me = true) : $rootScope.load_project_members(i.to, function (e) {
                i.from = _.findWhere(e.members, {
                    uid: i.from
                }), i.is_me = false
            }), wt.bus.chat.set_message_for_file(i, i.to), $rootScope.project.init_chat.messages.push(i), $rootScope.$broadcast("socket_chat", i))
        }),
            function (t) {
                wt.socket = t.connect(kzi.config.socket_url());
                var i = null;
                $window.onblur = function () {
                    i = setTimeout(function () {
                        wt.socket.emit("leave")
                    }, 9e5)
                }, $window.onfocus = function () {
                    wt.socket.socket.connecting, wt.socket.emit("online"), clearTimeout(i)
                }
            }(io);

        Heyoffline !== void 0 && new Heyoffline({
            text: {
                title: "掉线了?",
                content: "请确认网络是否连通,否则会造成当前工作丢失.",
                button: "好的,我知道了."
            }
        });
        $window.onbeforeunload = function () {
            if ($("#global_file_upload").scope() && $("#global_file_upload").scope().queue) {
                return $("#global_file_upload").scope().queue.length > 0 ? "您的上传队列中还有文件，退出该页面将丢失上传进度。" : void 0
            }
        };
        var y = function () {
            return m === true ? (h.close(), void 0) : (m = true, h = $modal.open({
                backdrop: true,
                keyboard: true,
                backdropClick: true,
                templateUrl: "/view/common/shortcutkey_dialog.html",
                controller: ["$scope",
                    function (e) {
                        var t = $routeParams.pid;
                        e.pid = _.isEmpty(t) ? "all" : t
                    }
                ]
            }), h.open().then(function () {
                m = false
            }), void 0)
        };
        $rootScope.js_shortcut_key_dialog = function () {
            y()
        };
        $rootScope.js_shift_cutover = function (e) {
            var i = $routeParams.pid;
            _.isEmpty(i) || $rootScope.global.is_outter === true || m !== true && (e === kzi.constant.keyASCIIs.T ? $location.path("project/" + i + "/task") : e === kzi.constant.keyASCIIs.C ? $location.path("project/" + i + "/post") : e === kzi.constant.keyASCIIs.F ? $location.path("project/" + i + "/file") : e === kzi.constant.keyASCIIs.D ? $location.path("project/" + i + "/page") : e === kzi.constant.keyASCIIs.A ? $location.path("project/" + i + "/activity") : e === kzi.constant.keyASCIIs.E ? $location.path("project/" + i + "/event") : e === kzi.constant.keyASCIIs.R ? $location.path("project/" + i + "/trash") : e === kzi.constant.keyASCIIs.G && $location.path("project/" + i + "/graph"))
        };
        $rootScope.js_shortcut_key = function (e) {
            $rootScope.global.is_outter !== true && ((e === kzi.constant.keyASCIIs.QuestionMark || e === kzi.constant.keyASCIIs.Slash) && y(), m !== true && (e === kzi.constant.keyASCIIs.E ? $rootScope.$broadcast(kzi.constant.event_names.shortcut_key_to_edit) : e === kzi.constant.keyASCIIs.ESC ? ($rootScope.global.show_slide_menu === true && ($rootScope.global.show_slide_menu = false), $rootScope.$broadcast(kzi.constant.event_names.shortcut_key_to_cancel)) : e === kzi.constant.keyASCIIs.Key96 && $rootScope.$broadcast(kzi.constant.event_names.shortcut_key_left_menu_toggle, null), $.inArray(e, kzi.constant.entry_shortcut_keys) > -1 && $rootScope.$broadcast(kzi.constant.event_names.shortcut_key_to_task, e)))
        };
        $("body").bind("drop dragover", function (e) {
            e.preventDefault()
        });
        $($window).bind("blur.dragfile", function () {
            $(".dragfile-hover").removeClass("dragfile-hover")
        });
        kzi.localData.remove("wooho_show_version"), kzi.config.wohoo_show_version > kzi.localData.get("wohoo_show_version") ? ($rootScope.global.wohoo_show = true, $timeout(function () {
            $(".wohoo-inner").addClass("in")
        }, 2e3)) : $rootScope.global.wohoo_show = false;
        var w = ["right_click_trigger", "entry_header"];
        document.oncontextmenu = function (e) {
            e = e || window.event;
            var i = true;
            return _.each(w, function (n) {
                ($(e.target).hasClass(n) || $(e.target).parents("." + n).length > 0) && ($rootScope.$broadcast(kzi.constant.event_names.on_right_menu, e), i = false)
            }), i
        };
        $(document).bind("selectstart", function (e) {
            var t = true;
            return _.each(w, function (i) {
                ($(e.target).hasClass(i) || $(e.target).parents("." + i).length > 0) && (t = false)
            }), t
        });
        //绑定页面切换事件
        // Get Browser-Specifc Prefix
        function getBrowserPrefix() {
            // Check for the unprefixed property.
            if ('hidden' in document) {
                return null;
            }
            // All the possible prefixes.
            var browserPrefixes = ['moz', 'ms', 'o', 'webkit'];
            for (var i = 0; i < browserPrefixes.length; i++) {
                var prefix = browserPrefixes[i] + 'Hidden';
                if (prefix in document) {
                    return browserPrefixes[i];
                }
            }
            // The API is not supported in browser.
            return null;
        }

        // Get Browser Specific Hidden Property
        function hiddenProperty(prefix) {
            if (prefix) {
                return prefix + 'Hidden';
            } else {
                return 'hidden';
            }
        }

        // Get Browser Specific Visibility State
        function visibilityState(prefix) {
            if (prefix) {
                return prefix + 'VisibilityState';
            } else {
                return 'visibilityState';
            }
        }

        // Get Browser Specific Event
        function visibilityEvent(prefix) {
            if (prefix) {
                return prefix + 'visibilitychange';
            } else {
                return 'visibilitychange';
            }
        }

        var prefix = getBrowserPrefix();
        var hidden = hiddenProperty(prefix);
        var visibilityState = visibilityState(prefix);
        var visibilityEvent = visibilityEvent(prefix);
        document.addEventListener(visibilityEvent, function () {
            if (!document[hidden] && $rootScope.global.is_login) //当前页面是活动页面
            {
                $rootScope.global.me.score = 1*window.sessionStorage.score;//用户积分
            }
//            else {
//            // The page is hidden.
//            // $rootScope.$broadcast(kzi.constant.event_names.visibility_change,'hidden');
//            }
        });

//        $rootScope.$watch(function(){
//            return   window.location.href;
//        },function(){
//            window.scrollTo(0,0);
//            console.log("urlgaibian");
//        },true);
    }
]);
