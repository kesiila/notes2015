"use strict";
var innerApp = angular.module("innerApp", ["ngRoute",
    "ngSanitize",
    "ui.calendar",
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
    "angularBMap",
    'baiduMap',
    "adamgoose.webdis",
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
                $window.location.href = "/signin";
            }
            return $q.reject(rejection);
        }
    };
});

innerApp.config(["pagerConfig", function (pagerConfig) {
    pagerConfig.itemsPerPage = 20;
    pagerConfig.previousText = '上一条';
    pagerConfig.nextText = '下一条';
}]);

innerApp.config(['angularBMapProvider', function (angularBMapProvider) {
	angularBMapProvider.setDefaultPosition(121.49576, 31.240998);//设置默认中心点
}]);

innerApp.config(['WebdisProvider', function (WebdisProvider) {
    // Your Webdis Host
    WebdisProvider.setHost('127.0.0.1');
    //WebdisProvider.setHost('183.129.245.8');
    // Your Webdis Port (7379 by default)
    WebdisProvider.setPort(7379);
}]);

innerApp.config(["$httpProvider", function ($httpProvider) {
    delete $httpProvider.defaults.headers.common["X-Requested-With"];
    $httpProvider.interceptors.push('authInterceptor');
}]);

innerApp.config(["fileUploadProvider", "$sceDelegateProvider",
    function (fileuploadProvider, $sceDeleageProvider) {
        angular.extend(fileuploadProvider.defaults, {
            pasteZone: null,
            drapZone: null,
            disableImageResize: true,
            minFileSize: 0,
            maxFileSize: 1e8,
            maxNumberOfFiles: 10,
            autoUpload: true,
            messages: {
                maxNumberOfFiles: "超过文件最大数",
                acceptFileTypes: "文件格式不支持",
                maxFileSize: "文件太大",
                minFileSize: "文件太小"
            }
        });
        $sceDeleageProvider.resourceUrlWhitelist([kzi.config.box_url(), kzi.config.box_url_regex(), kzi.config.wtbox_url])
    }
]);

innerApp.config(function ($sceProvider) {
    $sceProvider.enabled(false);
});

innerApp.run(["$rootScope", "$rootElement", "$location", "$route", "rest", "data", "bus",
    "utility", "socket", "$routeParams", "$modal", "$window", "$timeout", "$http","$popbox",
    "angularBMap",
    function ($rootScope, $rootElement, $location, $route, rest, data, bus, utility,
              socket, $routeParams, $modal, $window, $timeout, $http, $popbox,angularBMap) {
        wt.rest = rest,
            wt.data = data,
            wt.bus = bus,
            wt.utility = utility;
        var m = false, h = null;
        angularBMap.geoLocation();
        angularBMap.geoLocationAndCenter();
        $rootScope.global = {
            config: kzi.config,
            title: "",
            me: wt.me,
            is_login: !_.isUndefined(wt.me) && !_.isEmpty(wt.me.uid),
            loading_init: true,
            loading_done: false,
            header_menu: "index",
            right_isfold: true,
            is_outter: false,
            show_msg: false,
            left_panel_is_fold: false,
            right_sidebar_is_fold: true,
            right_sidebar_is_show: true,
            right_sidebar_show_part: 0,
            right_sidebar_item: '',
            project_iconmenu: "task",
            project_sidebar_view: "member",
            project_sidebar_foldview: "module",
            calendar_sidebar_view: "event",
            calendar_fold: true,
            loaded_notice_count: false,
            show_inbox: false,
            show_searchbox: false,
            show_scorebox: false,
            show_generatorbox: false,
            show_mailbox: false,
            wohoo_show: false,
            boxshow_type: '',
            team_module: kzi.constant.team_module,
            prj_module: kzi.constant.prj_module
        };

        //将多处需要使用的资源数据配置为全局的，避免多次请求
        $rootScope.scoreConfig = kzi.constant.score.config;
        $rootScope.allPostTypes = [];


        $http.get('/json/manager/postType.json').success(function (res) {
            $rootScope.allPostTypes = res.data;
        });


        $rootScope.pid = "";
        $rootScope.notice_count = 0;
        
        $rootScope.tags = [];

        $rootScope.selectedTasks = [];
        $rootScope.selectedMails = [];
        $rootScope.selectedTemplates = [];
        $rootScope.send_mail_info = {
            tasks: [],
            templates: []
        };

        $rootScope.teams = [];
        $rootScope.projects = [];
        $rootScope.organizers = [];
        $rootScope.goodss = [];
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


        $rootScope.jsonformat = function jsonStringify(data,space){
            var seen=[];
            return JSON.stringify(data,function(key,val){
                if(!val||typeof val !=='object'){
                    return val;
                }
                if(seen.indexOf(val)!==-1){
                    return '[Circular]';
                }
                seen.push(val);
                return val;
            },space);

        };

        /**
         *  从回收站移出来
         */
        $rootScope.untrash_entity = function (entity_id, uid, entity_type, successFunc, errorFunc, thenFunc) {
            if (!_.isEmpty(entity_id) && !_.isEmpty(entity_type)) {
                switch (entity_type) {
                    case "post":
                        wt.data.post.untrash("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "user":
                        wt.data.user.untrash("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "goods":
                        wt.data.goods.untrash("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "organizer":
                        wt.data.organizer.untrash("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "template":
                        wt.data.template.untrash("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "task":
                        wt.data.task.untrash("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    default:
                        break;
                }
            }
        };

        /**
         * 管理员删除操作（移动到回收站/彻底删除）
         */
        $rootScope.del_entity = function (entity_id, uid, entity_type, destory/* 是否彻底删除*/, success, error, then) {
            if (!_.isEmpty(entity_id) && !_.isEmpty(entity_type)) {
                var successFunc = _.isFunction(success) ? success : function () {
                    kzi.msg.success("删除成功！", function () {
                    });
                    $rootScope.$broadcast(kzi.constant.event_names.entity_del, {"id": entity_id})
                };
                var errorFunc = _.isFunction(error) ? error : function (resp) {
                    var err_msg = "删除失败！";
                    switch (resp.code) {
                        case 2038:
                            err_msg = "无权限操作！";
                            break;
                    }
                    kzi.msg.error(err_msg);
                };
                var thenFunc = _.isFunction(then) ? then : function () {};

                var del_or_trash = destory ? "del" : "trash";
                switch (entity_type) {
                    case "post":
                        wt.data.post[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "user":
                        wt.data.user[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "goods":
                        wt.data.goods[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "organizer":
                        wt.data.organizer[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "template":
                        wt.data.template[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "task":
                        wt.data.task[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "project":
                        wt.data.project[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    case "article":
                        wt.data.article[del_or_trash]("", entity_id, successFunc, errorFunc, thenFunc);
                        break;
                    default:
                        break;
                }
            }
        };

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

        $rootScope.locator = {
            hide_slide: function () {
                $rootScope.locator.show_slide = false;
                $rootScope.locator.show_detail_feed_id = null;
                $rootScope.locator.show_detail_task_id = null;
                $rootScope.locator.show_detail_project_id = null;
                $rootScope.locator.show_detail_user_id = null;
                $rootScope.locator.show_detail_organizer_id = null;
                $rootScope.locator.show_detail_goods_id = null;
                $rootScope.locator.show_detail_order_id = null;
                $rootScope.locator.show_detail_coupon_id = null;
                $rootScope.locator.show_detail_post_id = null;
                $rootScope.locator.show_detail_event_id = null;
                $rootScope.locator.show_detail_file_id = null;
                $rootScope.locator.show_detail_page_id = null;
                $rootScope.locator.show_detail_mail_id = null;
                $rootScope.$broadcast(kzi.constant.event_names.on_slide_hide);
            },
            to_project: function (e, i) {
                $rootScope.locator.hide_slide();
                $location.path("/project/" + e);
            },
            to_project_slide: function (pid,comment_id) {
                $rootScope.locator.show_detail_project_id = pid;
                $rootScope.locator.type = "project";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = true;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_project, {
                    pid: pid,
                    project_id: pid,
                    comment_id: comment_id
                })
            },
            to_task: function (pid, tid, show_prj, comment_id) {
                $rootScope.locator.show_detail_task_id = tid;
                $rootScope.locator.type = "task";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = show_prj;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_task, {
                    pid: pid,
                    tid: tid,
                    comment_id: comment_id
                })
            },
            to_reward: function (e, i, n, a) {
                $rootScope.locator.show_detail_reward_id = i;
                $rootScope.locator.type = "reward";
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = n;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_reward, {
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
            to_organizer: function (e, i, n, a) {
                $rootScope.locator.type = "organizer";
                $rootScope.locator.show_detail_organizer_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = false;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_organizer, {
                    pid: e,
                    organizer_id: i,
                    comment_id: a
                })
            },
            to_goods: function (e, i, n, a) {
                $rootScope.locator.type = "goods";
                $rootScope.locator.show_detail_goods_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = false;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_goods, {
                    pid: e,
                    goods_id: i,
                    comment_id: a
                })
            },
            to_order: function (e, i, n, a) {
                $rootScope.locator.type = "order";
                $rootScope.locator.show_detail_order_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = false;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_order, {
                    pid: e,
                    order_id: i,
                    comment_id: a
                })
            },
            to_article:  function (e, i, n, a) {
                $rootScope.locator.type = "article";
                $rootScope.locator.show_detail_article_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = false;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_article, {
                    pid: e,
                    article_id: i,
                    comment_id: a
                })
            },
            to_video: function (e, i, n, a) {
                $rootScope.locator.type = "video";
                $rootScope.locator.show_detail_video_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = false;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_video, {
                    pid: e,
                    video_id: i,
                    comment_id: a
                })
            },
            to_coupon: function (e, i, n, a) {
                $rootScope.locator.type = "coupon";
                $rootScope.locator.show_detail_coupon_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = false;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_coupon, {
                    pid: e,
                    coupon_id: i,
                    comment_id: a
                })
            },
            to_user: function (e, i, n, a) {
                $rootScope.locator.type = "user";
                $rootScope.locator.show_detail_user_id = i;
                $rootScope.locator.show_slide = true;
                $rootScope.locator.show_prj = false;
                $rootScope.$broadcast(kzi.constant.event_names.load_entity_user, {
                    user_id: i,
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
                        $rootScope.locator.to_email(e, i.eid, n, a);
                        break;
                    case "mails":
                        $rootScope.locator.to_email(e, i.eid, n, a);
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
                                    case "organizer":
                                        n.formData.organizer_id !== i.organizer_id && (a = false);
                                        break;
                                    case "goods":
                                        n.formData.goods_id !== i.goods_id && (a = false);
                                        break;
                                    case "order":
                                        n.formData.order_id !== i.order_id && (a = false);
                                        break;
                                    case "coupon":
                                        n.formData.coupon_id !== i.coupon_id && (a = false);
                                        break;
                                    case "user":
                                        n.formData.user_id !== i.user_id && (a = false);
                                        break;
                                    case "template":
                                        n.formData.template_id !== i.template_id && (a = false);
                                        break;
                                    case "file":
                                        n.formData.fid !== i.fid && (a = false);
                                        break;
                                    case "project":
                                    	n.formData.pid !== i.pid && n.formData.folder_id !== i.folder_id && (a = false);
                                        break;
                                    case "article":
                                        n.formData.article_id !== i.article_id && (a = false);
                                        break;
                                    case "comment":
                                        _.isUndefined(i.tid) || n.formData.tid === i.tid || (a = false),
                                            _.isUndefined(i.event_id) || n.formData.event_id === i.event_id || (a = false),
                                            _.isUndefined(i.post_id) || n.formData.post_id === i.post_id || (a = false),
                                            _.isUndefined(i.organizer_id) || n.formData.organizer_id === i.organizer_id || (a = false),
                                            _.isUndefined(i.goods_id) || n.formData.goods_id === i.goods_id || (a = false),
                                            _.isUndefined(i.order_id) || n.formData.order_id === i.order_id || (a = false),
                                            _.isUndefined(i.coupon_id) || n.formData.coupon_id === i.coupon_id || (a = false),
                                            _.isUndefined(i.page_id) || n.formData.page_id === i.page_id || (a = false)
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
            get_organizer: function (e, t) {
                return this._get_queue(e, "organizer", {
                    organzier_id: t
                })
            },
            get_goods: function (e, t) {
                return this._get_queue(e, "goods", {
                    organzier_id: t
                })
            },
            //get_project: function (e, t) {
            //    return this._get_queue(e, "project", {
            //        pid: t
            //    })
            //},
            get_order: function (e, t) {
                return this._get_queue(e, "order", {
                    order_id: t
                })
            },
            get_coupon: function (e, t) {
                return this._get_queue(e, "coupon", {
                    coupon_id: t
                })
            },
            get_user: function (e, t) {
                return this._get_queue(e, "user", {
                    user_id: t
                })
            },
            get_article: function (e, t) {
                return this._get_queue(e, "article", {
                    eid: t
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
                    id: t
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
            get_comment_project: function (e, t) {
                return this._get_queue(e, "comment", {
                    pid: t
                })
            },
            get_comment_organizer: function (e, t) {
                return this._get_queue(e, "comment", {
                    organizer_id: t
                })
            },
            get_comment_article: function (e, t) {
                return this._get_queue(e, "comment", {
                    eid: t
                })
            },
            get_comment_goods: function (e, t) {
                return this._get_queue(e, "goods", {
                    goods_id: t
                })
            },
            get_comment_order: function (e, t) {
                return this._get_queue(e, "order", {
                    order_id: t
                })
            },
            get_comment_coupon: function (e, t) {
                return this._get_queue(e, "coupon", {
                    coupon_id: t
                })
            },
            get_comment_user: function (e, t) {
                return this._get_queue(e, "user", {
                    user_id: t
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
                wt.socket.emit("online");
                    $rootScope.clear_project();
                $rootScope.teams = [];
                    $rootScope.projects = [];
                    $rootScope.global.loaded_notice_count = false;
                    null !== s && $location.path(s);
                    angular.isFunction(o) && o(i)
            }, r, l)
        };
        /**
         * 用户退出登录
         * @param i
         */
        $rootScope.logout = function (i) {
            $rootScope.global.is_login = false;
                delete $rootScope.global.me;
                wt.utility.clear_login_info();
            wt.data.signout(function () {
                wt.socket.emit("offline");
                i || ($window.location.href = "/")
            }, null, null)
        };
        //监听组内标签设置
        $rootScope.$on(kzi.constant.event_names.on_proj_ladels_update, function(event, parm){
            var pid=parm.pid,labels=parm.labels;
            _.forEach($rootScope.teams[0].projects, function (e) {
                if (pid == e.pid) {
                    e.labels=labels;
                }
            });
        })
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
        $rootScope.load_teams = function (loadProjects, second, third) {
            var teams = $rootScope.teams;
            if (teams && teams.length > 0) {
                angular.isFunction(loadProjects) && loadProjects(teams);
                angular.isFunction(third) && third();
            } else {
                    wt.data.team.get_list(function (response) {
                        $rootScope.teams = response.data;
                        $rootScope.$broadcast(kzi.constant.event_names.teams_loading_done, 1);
                        angular.isFunction(loadProjects) && loadProjects(response.data);
                    }, second, third);
            }
        };
        $rootScope.load_team = function (first, second, third) {
            wt.data.team.get(first, function (eleven) {
                angular.isFunction(second) && second(eleven.data)
            }, third)
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
                    $rootScope.projects = [].filter.call(eleven.data, function (project) {
                        return project.status != -1;
                    });
                    _.map($rootScope.projects, function (project) {
                        return project.bg = "#3c8cad"
                    })
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

        $rootScope.load_tags = function (first, second, third) {
            var s = $rootScope.tags;
            if (_.isEmpty(s)) {
                wt.data.tag.get_all(function (eleven) {
                    $rootScope.tags = eleven.data;
                }, second, third)
            } else {
                angular.isFunction(first) && first(s);
                angular.isFunction(third) && third();
            }
        };

        $rootScope.load_organizers = function (first, second, third) {
            var s = $rootScope.organizers;
            if (_.isEmpty(s)) {
                wt.data.organizer.get_all("children", function (resp) {
                    $rootScope.organizers = resp.data;
                    $rootScope.sort_projects();
                    angular.isFunction(first) && first($rootScope.organizers);
                }, second, third);

                wt.data.organizer.get_all("parent", function (resp) {
                    $rootScope.organizers_parent = resp.data;
                }, null, null);

            } else {
                angular.isFunction(first) && first(s);
                angular.isFunction(third) && third();
            }
        };

        $rootScope.load_goodss = function (first, second, third) {
            var s = $rootScope.goodss;
            if (_.isEmpty(s)) {
                wt.data.goods.get_all("active", function (eleven) {
                    $rootScope.goodss = eleven.data;
                    angular.isFunction(first) && first($rootScope.organizers);
                }, second, third)
            } else {
                angular.isFunction(first) && first(s);
                angular.isFunction(third) && third();
            }
        };

        $rootScope.reload_organizers = function (i, n, a) {
            wt.data.organizer.get_all("active", function (e) {
                $rootScope.organizers = e.data;
                angular.isFunction(i) && i($rootScope.organizers)
            }, n, a)
        };

        $rootScope.reload_projects = function (i, n, a) {
            wt.data.project.get_all("active", function (e) {
                $rootScope.projects = e.data;
                $rootScope.sort_projects();
                angular.isFunction(i) && i($rootScope.projects)
            }, n, a)
        };
        $rootScope.sort_projects = function () {
            $rootScope.projects = _.sortBy($rootScope.projects, function (e) {
                return e.pos
            })
        };
        var t = $rootScope;
        t.load_project_new = function (i, n, a, s, r) {
            var o = t.project;
            o &&
            o.info &&
            o.info.pid === i
            && o.members
            && o.members.length > 0
                ? (a(o), _.isFunction(r) && r()) :
                (n && (t.project.members = [],
                    t.project.entries = [],
                    t.project.tasks = [],
                    t.project.files = [],
                    t.project.posts = [],
                    t.project.pages = [],
                    t.project.events = [],
                    t.project.feeds = [],
                    t.project.init_chat = null,
                    t.project.currentEntry = null,
                    t.project.currentTask = null,
                    t.project.entryIndex = 0,
                    t.project.taskIndex = 0),
                    wt.data.project.get(i, function (e) {
                        n ? (t.project.info = e.data.info,
                            t.project.members = e.data.members,
                            a(t.project))
                            : a(e.data)
                    }, s, r))
        }

        $rootScope.load_project = function (i, n, a, s) {
            var o = $rootScope.project;
            if (o && o.info && o.info.pid == i && o.members && o.members.length > 0) {
                n(o);
                _.isFunction(s) && s()
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
                        $rootScope.project.badges = e.data.badges;
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
            }));
            angular.isFunction(i) && i(n)
        };
        $rootScope.load_tasks = function (i, n, a, s) {
            $rootScope.load_project(i, function (o) {
                o.entries && o.entries.length > 0 ?
                    (n(o), _.isFunction(s) && s()) :
                    wt.data.entry.get_list(i, function (e) {
                        var i = _.sortBy(e.data.entries, function (e) {
                                return e.pos
                            }),
                            a = e.data.tasks;
                        $rootScope.project.entries = i;
                        $rootScope.project.tasks = a;
                        n(o)
                    }, a, s);
            }, function (e) {
                _.isFunction(a) && a(e), _.isFunction(s) && s(e)
            })
        };
        $rootScope.load_rewards = function (i, n, a, s) {
            $rootScope.load_project(i, function (o) {
                o.entries && o.entries.length > 0 ?
                    (n(o), _.isFunction(s) && s()) :
                    wt.data.reward_entry.get_list(i, function (e) {
                        var i = _.sortBy(e.data.reward_entries, function (e) {
                                return e.pos
                            }),
                            a = e.data.rewards;
                        $rootScope.project.entries = i;
                        $rootScope.project.tasks = a;
                        n(o);
                    }, a, s);
            }, function (e) {
                _.isFunction(a) && a(e);
                _.isFunction(s) && s(e);
            })
        };
        $rootScope.load_task = function (i, n, a, s) {
            wt.data.task.xtype = "programs";
            wt.data.task.get(i, n, function (e) {
                a(t, e.data);
            }, s);
            false && $rootScope.load_project(i, function (t) {
                if (t.tasks && t.tasks.length > 0) {
                    var o = _.findWhere(t.tasks, {
                        tid: n
                    });
                    if (o) {
                        a(t, o);
                    } else {
                        wt.data.task.get(i, n, function (e) {
                            a(t, e.data);
                        }, s);
                    }
                } else {
                    wt.data.task.get(i, n, function (e) {
                        a(t, e.data);
                    }, s);
                }
            }, s);
        };

        $rootScope.load_goods = function (i, n, a, s) {
            $rootScope.load_project(i, function (t) {
            	wt.data.goods.get(i, n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_order = function (i, n, a, s) {
            $rootScope.load_project("project_default", function (t) {
            	wt.data.order.get("project_default", n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_article = function (i, n, a, s) {
            $rootScope.load_project("project_default", function (t) {
                wt.data.article.get("project_default", n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_video = function (i, n, a, s) {
            $rootScope.load_project("project_default", function (t) {
                wt.data.video.get("project_default", n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_coupon = function (i, n, a, s) {
            $rootScope.load_project("project_default", function (t) {
            	wt.data.coupon.get("project_default", n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_user = function (i, n, a, s) {
            $rootScope.load_project("project_default", function (t) {
            	wt.data.user.get("project_default", n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_organizer = function (i, n, a, s) {
            $rootScope.load_project(i, function (t) {
            	wt.data.organizer.get(i, n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_project_new = function (i, n, a, s) {
            $rootScope.load_project("project_default", function (t) {
            	wt.data.project.get_new(n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        $rootScope.load_post = function (i, n, a, s) {
            $rootScope.load_project("project_default", function (t) {
            	wt.data.post.get("project_default", n, function (e) {
                    a(t, e.data)
                }, s)
            }, s)
        };

        //add two new function (load_event_new and load_project_new) just for calendar
        $rootScope.load_event_new = function (i, n, a, s) {
            $rootScope.load_project_new(i, !1, function (t) {
                wt.data.event.get(i, n, function (e) {
                    _.isFunction(a) && a(t, e.data)
                }, s)
            }, s)
        };
        $rootScope.load_event = function (i, n, a, s) {
            $rootScope.load_project(i, !1, function (t) {
                wt.data.event.get(i, n, function (e) {
                    _.isFunction(a) && a(t, e.data)
                }, s)
            }, s)
        };
        $rootScope.reload_entries = function (i) {
            wt.data.entry.get_list(i, function (e) {
                var i = _.sortBy(e.data.entries, function (e) {
                        return e.pos
                    }),
                    n = e.data.tasks;
                $rootScope.project.entries = i;
                $rootScope.project.tasks = n;
                $rootScope.$broadcast("socket_message_entry_list", null)
            })
        };
        $rootScope.sort_entries = function () {
            var e = $rootScope.project.entries;
            null != e && (e = _.sortBy(e, function (e) {
                return e.pos
            }), $rootScope.project.entries = e)
        };
        $rootScope.reload_reward_entries = function (i) {
            wt.data.reward_entry.get_list(i, function (e) {
                var i = _.sortBy(e.data.reward_entries, function (e) {
                        return e.pos
                    }),
                    n = e.data.rewards;
                $rootScope.project.entries = i;
                $rootScope.project.tasks = n;
                $rootScope.$broadcast("socket_message_entry_list", null)
            })
        };
        $rootScope.sort_reward_entries = function () {
            var e = $rootScope.project.reward_entries;
            null != e && (e = _.sortBy(e, function (e) {
                return e.pos
            }), $rootScope.project.reward_entries = e)
        };

        $rootScope.load_file_db = function (i, n, a, s, o) {
            wt.data.file.get_list(i, n, function (e) {
                $rootScope.folder = {
                    folder_id: e.data.folder.folder_id,
                    name: e.data.folder.name
                };
                _.each(e.data.files, function (e) {
                    e.icon = kzi.helper.build_file_icon(e);
                    var i = _.findWhere($rootScope.project.files, {
                        fid: e.fid
                    });
                    i || $rootScope.project.files.push(e)
                });
                a($rootScope.project)
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
            if(!_.isEmpty($rootScope.project.info)) {
                $rootScope.project.info.pid !== i ||
                _.isEmpty($rootScope.project.feeds) ?
                    wt.data.activity.get_prj_feed(i, function (e) {
                    $rootScope.project.feeds = e.data, _.isFunction(n) && n($rootScope.project.feeds)
                }, a, s) :
                    (_.isFunction(n) && n($rootScope.project.feeds), _.isFunction(s) && s())
            }
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
            $rootScope.project.info = {};
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
        };
        $rootScope.load_project_members = function (i, n, a) {
            $rootScope.load_project(i, function (a) {
                _.isEmpty(a.members) ? ($rootScope.project.members = [], wt.data.project.get_members(i, function (e) {
                    $rootScope.project.members = e.data;
                    angular.isFunction(n) && n($rootScope.project)
                })) : angular.isFunction(n) && n(a)
            }, a)
        };
        $rootScope.load_project_templates = function (i, n, a) {
            $rootScope.load_project(i, function (a) {
                _.isEmpty(a.templates) ? ($rootScope.project.templates = [], wt.data.project.get_templates(i, function (e) {
                    $rootScope.project.templates = e.data;
                    angular.isFunction(n) && n($rootScope.project)
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
            $rootScope.global.loaded_notice_count !== true && ($rootScope.global.loaded_notice_count = true)
        };
        $rootScope.js_right_sidebar_toggle = function () {
            $rootScope.global.right_sidebar_is_fold = !$rootScope.global.right_sidebar_is_fold,
                $rootScope.global.right_sidebar_is_fold ?
                    kzi.localData.set("right_sidebar_is_fold", 1) :
                    kzi.localData.set("right_sidebar_is_fold", 0);
        };
        var g = function (e) {
                var t = _.size(e.todos),
                    i = _.size(_.where(e.todos, {
                        checked: 1
                    }));
                t > 0 ?
                    (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) :
                    e.percentage = 0, e.badges.todo_checked_count = i, e.badges.todo_count = t;
            },
            v = function (e, t) {
                _.each(e, function (e) {
                    e.projects = _.where(t, {
                        team_id: e.team_id
                    })
                });
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
                has_collected: function (task, status) {
                    wt.data.task.isCollected(task.tid, function (res) {
                        status = res.data;
                    })
                },
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
                        a && (a.display_name = i, a.companyName = n),
                            $rootScope.project.tasks && $rootScope.project.tasks.length > 0 && _.each($rootScope.project.tasks, function (t) {
                            if (t.members && t.members.length > 0) {
                                var a = _.findWhere(t.members, {
                                    uid: e
                                });
                                a && (a.display_name = i, a.companyName = n)
                            }
                        })
                    }
                    $rootScope.global.me.display_name = i, $rootScope.global.me.companyName = n
                },
                updateEmail: function (e, i, n) {
                    if ($rootScope.project && $rootScope.project.members && $rootScope.project.members.length > 0) {
                        var a = _.findWhere($rootScope.project.members, {
                            uid: e
                        });
                        a && (a.email = i, a.reply_email = n),
                            $rootScope.project.tasks && $rootScope.project.tasks.length > 0 && _.each($rootScope.project.tasks, function (t) {
                            if (t.members && t.members.length > 0) {
                                var a = _.findWhere(t.members, {
                                    uid: e
                                });
                                a && (a.email = i, a.reply_email = n)
                            }
                        })
                    }
                    $rootScope.global.me.email = i, $rootScope.global.me.reply_email = n;
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

        $rootScope.load_common_data_in = function (first, second, third) {
        	$rootScope.load_tags();
        	$rootScope.load_organizers();
        	$rootScope.load_goodss();
            $rootScope.load_teams(function (team) {
                    $rootScope.load_projects(function (project) {
                        v(team, project);
                        if (_.isFunction(first)) {
                            first({
                                teams: team,
                                projects: project
                            })
                        }
                        ;
                    }, second, third);
                },
                function () {
                    _.isFunction(second) && second(), _.isFunction(third) && third();
                }),
                $rootScope.load_unread_notices(function () {
                    $rootScope.global.loaded_notice_count = true;
                })
        };
        $rootScope.reload_common_data_in = function (e, i, n) {
            $rootScope.teams = [];
            $rootScope.projects = [];
            $rootScope.global.loaded_notice_count = false;
            $rootScope.load_common_data_in(e, i, n)
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
            //if(args.$$route.need_admin && $rootScope.global.me.role != 0) {
            //    $window.location.href ="/";
            //    $rootScope.preventDefault();
            //}
            $rootScope.global.loading_done = null == args.need_load || 1 == args.need_load ? false : true,
                args.is_outter ? $rootScope.global.is_outter = true : ($rootScope.global.is_outter = false,
                    args && args.$$route && "projects_ctrl" == args.$$route.controller || $rootScope.load_common_data_in()),
                kzi.console.group("RouteChange：" + $location.$$absUrl);
                kzi.console.time("$routeChange");
                kzi.console.log("$routeChangeStart"),
                args.$$route && ($rootScope.global.header_menu = args.$$route.header_menu,
                $rootScope.global.project_iconmenu = args.$$route.project_iconmenu ? args.$$route.project_iconmenu : "task"),
                    $rootScope.global.is_login || args.is_outter === true ? args.is_outter === true : /^\/signin/g.test($location.$$path) || (window.location.href = "/signin?return_url=" + $location.$$path)
        });
        $rootScope.$on("$routeChangeSuccess", function () {
            $rootScope.global.is_outter !== true && $rootScope.locator.show_slide === true && $rootScope.locator.hide_slide(), kzi.console.timeEnd("$routeChange"), kzi.console.log("$routeChangeSuccess"), kzi.console.groupEnd("RouteChange：" + $location.$$absUrl)
        });
            $rootScope.$on("$routeChangeError", function () {
                kzi.console.timeEnd("$routeChange"), kzi.console.log("$routeChangeError"), kzi.console.groupEnd("RouteChange：" + $location.$$absUrl)
            });
            $rootScope.$on("$routeUpdate", function () {
                kzi.console.timeEnd("$routeChange"), kzi.console.log("$routeUpdate"), kzi.console.groupEnd("RouteChange：" + $location.$$absUrl)
            });
            $rootScope.$on("$locationChangeSuccess", function () {
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

        false && Webdis.subscribe('my-channel', function (data, channel) {
            console.log('Message received on channel ' + channel + ': ' + data);
            $rootScope.notice_count++;
            kzi.msg.warn(data, function () {
            })
        }, $rootScope);

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
        var k = function () {
            return h === !0 ? (m && m.close(), void 0) : (h = !0,
                m = l.open({templateUrl: "/ycjs/tpl/common/shortcutkey_dialog.html",
                    controller: ["$scope", "$modalInstance", function (e) {
                        var i = o.pid;
                        e.pid = _.isEmpty(i) ? "all" : i
                    }], size: "lg", resolve: {}}),
                m.result.then(function () {
                    h = !1, m = null
                }, function () {
                    h = !1, m = null
                }),
                void 0)
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

        if ($rootScope.global.is_login) {
            $rootScope.load_projects();
        }
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
            if (!document[hidden]) //当前页面是活动页面
            {
                $rootScope.global.me.score = 1 * window.sessionStorage.score;//用户积分
            }
//            else {
//                // The page is hidden.
//                // $rootScope.$broadcast(kzi.constant.event_names.visibility_change,'hidden');
//            }
        });

    }
]);