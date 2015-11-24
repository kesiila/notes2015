'use strict';
innerApp.controller('browse_task_ctrl', [
    '$scope',
    '$rootScope',
    function ($scope, $rootScope) {
        $rootScope.global.loading_done = true;
        $scope.current_tab = 0;
        var current_page = 1;
        var load = function (input,page) {
            input = input || "";
            var slected_tid = _.pluck($scope.edit_mail.tasks,"tid") || [];
            $scope.part_loading_done = false;
            wt.data.task.get_task_by_name(input, page, 20,function (response) {
                if (page>current_page) { //当入参的page值比当前的page大时表明加载更多页
                    current_page = page;
                    $scope.tasks = _.isEmpty($scope.tasks) ? response.data : $scope.tasks.concat(response.data);
                } else {
                    $scope.tasks = response.data;
                };
                $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
                //设置已选中活动的状态
                //将 每一个（forEach） 在 发送列表里的数组（filter）里的 活动状态 设为true；
                angular.forEach(_.filter($scope.tasks,function(task){
                    return slected_tid.indexOf(task.tid)>-1
                }),function(task){
                    task.watched = true;
                });
            }, null, function () {
                $scope.part_loading_done = true;
            });
        };
        //mailbox打开时加载第一次数据
/*        $rootScope.$on(kzi.constant.event_names.open_mail_box,function(){
            load("",current_page);
        })*/
        load("",current_page);
        $scope.js_get_task = function (input) {
            current_page = 1;
            load(input,current_page);
        };

        $scope.load_tasks_more = function () {
            load($scope.search_user_input,current_page+1);
        };
        $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            current_page = 1;
            $scope.tasks = [];
            $scope.last_date = 0;
            load($scope.search_user_input,current_page);
        };
    }
]);

innerApp.controller('filter_template_ctrl', [
    '$scope',
    '$rootScope',
    'wtPrompt',
    function ($scope, $rootScope,wtPrompt) {
        $rootScope.global.loading_done = true;
        $scope.current_tab = 0;
        //当前页码，用于加载更多
        var current_page = 1;
        /*
         筛选栏唯一的api请求
         input:关键字
         page:页码
         input->page->request
         */
        var load_templates = function (input,page) {
            input = input || "";
            $scope.part_loading_done = false;
            wt.data.template.get_template_by_name(input, page, 20,function (response) {
                if (page>current_page) { //当入参的page值比当前的page大时表明加载更多页
                    current_page = page;
                    $scope.templates = _.isEmpty($scope.templates) ? response.data : $scope.templates.concat(response.data);
                } else {
                    $scope.templates = response.data;
                };
                /*var defaultTemplateId = $scope.edit_mail.template_id;
                 var index_temp = 0 ;
                 var template = _.reject($scope.templates,function(i,index){
                 if(i.template_id == defaultTemplateId) {
                 i.watched = true;
                 index_temp = index;
                 return true;
                 }
                 })
                 $scope.templates.splice(index_temp,1);
                 $scope.templates.unshift(template);*/

                $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
                //还没有任何模板提示加创建模板
                /*            if (response.data.length == 0) {
                 wtPrompt.prompt.beforeSendEmail();
                 }*/
            }, null, function () {
                $scope.part_loading_done = true;
            });
        };
        //第一次默认加载
        load_templates("",current_page);
        //输入框的模糊查询
        $scope.js_get_template = function (input) {
            current_page = 1;
            load_templates(input,current_page);
        };
        //加载更多
        $scope.load_templates_more = function () {
            load_templates($scope.search_template_input,current_page+1);
        };
        //改变tab
        $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            current_page = 1;
            $scope.templates = [];
            $scope.last_date = 0;
            load_templates($scope.search_template_input,current_page);
        };
    }
]);

innerApp.controller('project_filter_template_ctrl', [
    '$scope',
    '$rootScope',
    'wtPrompt',
    function ($scope, $rootScope,wtPrompt) {
        $rootScope.global.loading_done = true;
        $scope.current_tab = 0;
        //当前页码，用于加载更多
        var current_page = 1;
        /*
         筛选栏唯一的api请求
         input:关键字
         page:页码
         input->page->request
         */
        var load_templates = function (input,page) {
            input = input || "";
            $scope.part_loading_done = false;
            wt.data.template.get_template_by_name(input, page, 20,function (response) {
                if (page>current_page) { //当入参的page值比当前的page大时表明加载更多页
                    current_page = page;
                    $scope.templates = _.isEmpty($scope.templates) ? response.data : $scope.templates.concat(response.data);
                } else {
                    $scope.templates = response.data;
                };
                $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
            }, null, function () {
                $scope.part_loading_done = true;
            });
        };
        //第一次默认加载
        load_templates("",current_page);
        //输入框的模糊查询
        $scope.js_get_template = function (input) {
            current_page = 1;
            load_templates(input,current_page);
        };
        //加载更多
        $scope.load_templates_more = function () {
            load_templates($scope.search_template_input,current_page+1);
        };
        //改变tab
        $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            current_page = 1;
            $scope.templates = [];
            $scope.last_date = 0;
            load_templates($scope.search_template_input,current_page);
        };
    }
]);


innerApp.controller('public_task_ctrl', [
    '$scope',
    '$rootScope',
    function ($scope, $rootScope) {
        $rootScope.global.title = '活动统计';
        $rootScope.global.loading_done = true;
        $scope.current_tab = 4;
        var page = 1;
        var load = function () {
            $scope.part_loading_done = false;
            wt.data.task.get_all_list_old($scope.current_tab, page, function (response) {
                var last_date = $scope.last_date;
                _.each(response.data, function (obj) {
                    var create_date = moment(obj.create_date).format('YYYY-MM-DD');
                    if (create_date === last_date) {
                        obj.is_show_date = false;
                    } else {
                        obj.is_show_date = true;
                        last_date = create_date
                    }
                    ;
                });
                $scope.last_date = last_date;
                if (_.isEmpty(response.data)) {
                    $scope.tasks = []
                } else {
                    page += 1;
                    $scope.tasks = _.isEmpty($scope.tasks) ? response.data : $scope.tasks.concat(response.data);
                }
                ;
                $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
            }, null, function () {
                $scope.part_loading_done = true;
            });
        };
        load();
        $scope.load_tasks_more = function () {
            load();
        };
        $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            page = 1;
            $scope.tasks = [];
            $scope.last_date = 0;
            load();
        };
    }
]);

innerApp.controller('browse_template_ctrl', [
    '$scope',
    '$rootScope',
    function ($scope, $rootScope) {
        $rootScope.global.title = '模板统计';
        $rootScope.global.loading_done = true;
        $scope.current_tab = 0;
        var page = 1;
        $scope.templates = [];
        var load = function () {
            $rootScope.part_loading_done = false;
            wt.data.template.get_all_list($scope.current_tab, page, function (response) {
                _.isEmpty(response.data) ?
                    $scope.templates = [] :
                    (page += 1, $scope.templates = _.isEmpty($scope.templates) ? response.data : $scope.templates.concat(response.data)), $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
            }, null, function () {
                $rootScope.part_loading_done = true;
            });
        };
        load();
        $scope.load_templates_more = function () {
            load();
        };
        $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            page = 1;
            $scope.templates = [];
            load();
        };
        $scope.js_get_template = function () {
            $scope.search_template_input = $scope.search_template_input || "";
            wt.data.template.get_template_by_name($scope.search_template_input,1,20,function(res){
                $scope.templates = res.data;
            },function(){

            },function(){

            })
        }
    }
]);

innerApp.controller('browse_public_template_ctrl1', [
    '$http',
    '$rootScope',
    '$scope',
    '$window',
    function ($rootScope, $scope, $window) {
        $rootScope.global.title = '公共模板',
            $scope.part_loading_done = false,
            $rootScope.global.loading_done = true,
            $scope.from_index = 1,
            $scope.input = {};
        $scope.current_uid = $window.sessionStorage ? $window.sessionStorage.uid : null;
        $scope.current_tab = 4;
        $scope.view_type = 'list';
        $scope.current_catalog = {
            cnName: "全部"
        };
        $scope.catalog = {
            all: {
                cnName: "全部",
                tab: 0
            },
            private: {
                cnName: "私有模板",
                tab: 1
            },
            download: {
                cnName: "下载模板",
                tab: 3
            }
        };

        $http.get('/json/templateCatalog.json').success(function (response) {
            $scope.catalogs = response.data;
        });

        $scope.js_view_toggle = function (type) {
            $scope.view_type = type;
        };
        $scope.js_template_collect = function (pid, template_id) {
            wt.data.template.collect(pid, template_id, function () {
                $scope.send_success = !0;
                kzi.msg.success("收藏成功", function () {
                    $(document).scope().global.show_msg = false
                });
            });
        };

        var r = function (e) {
            $scope.templates = [];
            $scope.part_loading_done = false;
            wt.data.template.get_public_list($scope.current_catalog.code, e, function (i) {
                $scope.templates = i.data.templates;
                $scope.from_index = (e - 1) * kzi.config.default_count + 1;
                (1 === e || '1' === e) &&
                ($scope.totalCount = i.data.totalCount, $scope.template_pagination_opts = {
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

        r(1);
        //去我的模板
        $scope.go_to_inner_template = function () {
            $window.location.href = "/templates";
        }
        $scope.select_catalog = function (selected_catalog) {
            $scope.current_catalog = selected_catalog;
            $scope.templates = [];
            r(1);
        };
        $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            $scope.templates = [];
            r(1);
        };
        var load = function (type, page) {
            $rootScope.part_loading_done = false;
            $rootScope.global.loading_done = false;
            wt.data.template.get_all_list(type, page, function (response) {
                _.isEmpty(response.data) ?
                    $scope.templates = [] :
                    (page += 1, $scope.templates = _.isEmpty($scope.templates) ? response.data : $scope.templates.concat(response.data)), $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
            }, null, function () {
                $rootScope.part_loading_done = true;
                $rootScope.global.loading_done = true;
            });
        };
        $scope.js_change_classify_tab = function (classify) {
            $scope.current_classify_tab = classify.tab;
            $scope.current_catalog = classify;
            $scope.templates = [];
            load(classify.tab, 1);
        };

    }
]);

innerApp.controller('browse_public_template_ctrl', [
    '$scope',
    '$rootScope',
    '$http',
    function ($scope, $rootScope, $http) {
        $rootScope.global.title = '公共模板';
        $rootScope.global.loading_done = true;
        $scope.current_tab = 4;
        $scope.current_catalog = {};

        $http.get('/json/templateCatalog.json').success(function (response) {
            $scope.catalogs = response.data;
        });

        var page = 1;
        $scope.templates = [];
        var load = function () {
            $rootScope.part_loading_done = false;
            wt.data.template.get_all_list($scope.current_tab, page, function (response) {
                _.isEmpty(response.data) ?
                    $scope.templates = [] :
                    (page += 1, $scope.templates = _.isEmpty($scope.templates) ? response.data : $scope.templates.concat(response.data)), $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
            }, null, function () {
                $rootScope.part_loading_done = true;
            });
        };
        load();
        $scope.load_templates_more = function () {
            load();
        };
        $scope.select_catalog = function (selected_catalog) {
            $scope.current_catalog = selected_catalog;
            page = 1;
            $scope.templates = [];
            load();
        };
        $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            page = 1;
            $scope.templates = [];
            load();
        };
    }
]);

innerApp.controller('browse_mail_ctrl', [
    '$scope',
    '$rootScope',
    function ($scope, $rootScope) {
        $rootScope.global.title = '邮件统计';
        $rootScope.global.loading_done = true;
        $scope.current_tab = 0;
        var page = 1;
        $scope.mails = [];
        var load = function () {
            $rootScope.part_loading_done = false;
            wt.data.email.get_all_list($scope.current_tab, page, function (response) {
                _.isEmpty(response.data) ? $scope.mails = [] : (page += 1, $scope.mails = _.isEmpty($scope.mails) ? response.data : $scope.mails.concat(response.data)), $scope.has_more = kzi.config.default_count > response.data.length ? false : true;
            }, null, function () {
                $rootScope.part_loading_done = true;
            });
        };
        load();
        $scope.load_mails_more = function () {
            load();
        }, $scope.js_change_tab = function (current_tab) {
            $scope.current_tab = current_tab;
            page = 1;
            $scope.mails = [];
            load();
        };
    }
]);

/*
 innerApp.controller('browse_file_ctrl', [
 '$scope',
 '$rootScope',
 function ($scope,$rootScope) {
 $rootScope.global.title = '发现文件';
 $rootScope.global.loading_done = true;
 $scope.current_tab = 0;
 var o = 1;
 var load = function () {
 $rootScope.part_loading_done = false, wt.data.file.get_all_list($scope.current_tab, o, function (t) {
 _.each(t.data, function (e) {
 e.icon = kzi.helper.build_file_icon(e);
 }), _.isEmpty(t.data) ? $scope.files = [] : (o += 1, $scope.files = _.isEmpty($scope.files) ? t.data : $scope.files.concat(t.data)), $scope.has_more = kzi.config.default_count > t.data.length ? false : true;
 }, null, function () {
 $rootScope.part_loading_done = true;
 });
 };
 load();
 $scope.load_files_more = function () {
 load();
 };
 $scope.js_change_tab = function (t) {
 $scope.current_tab = t, o = 1, $scope.files = [], load();
 };
 }
 ]);

 innerApp.controller('browse_post_ctrl', [
 '$scope',
 '$rootScope',
 function ($scope, $rootScope) {
 $rootScope.global.title = '发现话题';
 $rootScope.global.loading_done = true;
 $scope.current_tab = 0;
 var o = 1;
 $scope.posts = [];
 var load = function () {
 $rootScope.part_loading_done = false, wt.data.post.get_all_list($scope.current_tab, o, function (t) {
 _.isEmpty(t.data) ? $scope.posts = [] : (o += 1, $scope.posts = _.isEmpty($scope.posts) ? t.data : $scope.posts.concat(t.data)), $scope.has_more = kzi.config.default_count > t.data.length ? false : true;
 }, null, function () {
 $rootScope.part_loading_done = true;
 });
 };
 load();
 $scope.load_posts_more = function () {
 load();
 };
 $scope.js_change_tab = function (t) {
 $scope.current_tab = t, o = 1, $scope.posts = [], load();
 };
 }
 ]);



 innerApp.controller('browse_page_ctrl', [
 '$scope',
 '$rootScope',
 function ($scope,$routeScope) {
 $routeScope.global.title = '发现文档';
 $routeScope.global.loading_done = true;
 $scope.current_tab = 0;
 var o = 1;
 $scope.pages = [];
 var load = function () {
 $routeScope.part_loading_done = false, wt.data.page.get_all_list($scope.current_tab, o, function (t) {
 _.isEmpty(t.data) ? $scope.pages = [] : (o += 1, $scope.pages = _.isEmpty($scope.pages) ? t.data : $scope.pages.concat(t.data)), $scope.has_more = kzi.config.default_count > t.data.length ? false : true;
 }, null, function () {
 $routeScope.part_loading_done = true;
 });
 };
 load();
 $scope.load_pages_more = function () {
 load();
 };
 $scope.js_change_tab = function (t) {
 $scope.current_tab = t;
 o = 1;
 $scope.pages = [];
 load();
 };
 }
 ]);*/
