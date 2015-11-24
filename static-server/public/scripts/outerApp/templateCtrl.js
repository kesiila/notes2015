"use strict";
innerApp.controller('templateCtrl', ["$http", "$rootScope", "$scope", "$popbox", "$timeout", "$location", "$window", "$routeParams", "$modal",
    function ($http, $rootScope, $scope, $popbox, $timeout, $location, $window, $routeParams, $modal) {
        $rootScope.global.title = "邮件模板";
        $rootScope.global.loading_done = false;
        $scope.header_menu = $rootScope.global.header_menu;
        var locationUrl=$location.path();
        //获取url传入的templateId；
        _.isEmpty($routeParams.template_id)
        ||
        ($rootScope.template_detail_id = $routeParams.template_id, $rootScope.load_comments_attrs = { pid: "", xid: $routeParams.template_id, xtype: kzi.constant.xtype.template, comment_id: 'template'});

        $rootScope.global.is_login || ($rootScope.global.return_path = $location.url());


        //点击发布后已发布的模板id数组
        $scope.published_array_sync = [];

        //视图切换
        $scope.list_gird_type = 'list';
        $scope.js_view_toggle = function (list_grid) {
            _.isEmpty(list_grid) || ($scope.list_gird_type = list_grid);
        };

        $scope.to_template_detailed = function (template) {
            if ($rootScope.global.is_login) {
                if ($rootScope.global.me.role != 0) {
                    $rootScope.template_req = $scope.queryCondition;

                    if ($scope.header_menu == "template_excellent") {
//                        $location.url("/template/excellent/" + template.template_id);
                        $window.open("/template/excellent/" + template.template_id);
                    }
                    else {
//                        $location.url("/template/" + template.template_id);
                        $window.open("/template/" + template.template_id);
                    }
                }
                else {
                    template.click_count += 1;
                    $rootScope.locator.to_template(template.pid, template.template_id, null);
                }
            }
            else {
                $rootScope.template_req = $scope.queryCondition;

                if ($scope.header_menu == "template_excellent") {
//                    $location.url("/template/excellent/" + template.template_id);
                    $window.open("/template/excellent/" + template.template_id);
                }
                else {
//                    $location.url("/template/" + template.template_id);
                    $window.open("/template/" + template.template_id);
                }
            }
        };


        $scope.all_count = 0;//所有模板总数
        //分类获取模板数量
        $scope.template_count = [];
        var get_templates_count = function () {
            wt.data.template.group_public($scope.queryCondition.f_type, function (rep) {
                    $scope.template_count = rep.data.rawResults.retval;
                    $scope.all_count = rep.data.count;
                    var i = 0;
                    var count_item = null;
                    for (; i < $scope.catalogs.length; i++) {
                        count_item = _.find($scope.template_count, function (e) {
                            return e.mainCatalogCode == $scope.catalogs[i].code;
                        });
                        $scope.catalogs[i].count = _.isEmpty(count_item) ? 0 : count_item.count;
                        count_item = null;
                    }
                },
                function () {
                    kzi.msg.error("加载数据失败！");
                },
                function () {
                }
            );
        };

        $scope.tempPage = $routeParams.page || 1;

        $scope.itemsPerPage = 10;
        $scope.totalItems = 0;
        $scope.children = [];
        $scope.isDESC = true;

        $scope.queryCondition = {};
        $scope.catalogs = [];

        $scope.hide_detail = function () {
            $rootScope.template_req = $scope.queryCondition;
            if ($scope.header_menu == "template") {
                $location.url("/template");
            }
            else {
                $location.url("/template/excellent");
            }
            ;
        };

        //初始化数据
        var init = function (template_catalogs) {
            $scope.catalogs = template_catalogs;

            if(!_.isEmpty($routeParams.type)){
                var type = _.findWhere($scope.catalogs, {"code": $routeParams.type});
                $scope.type_name = _.isEmpty(type) ? "" : type.cnName;
            }

            if (_.isEmpty($rootScope.template_req)) {
                $scope.queryCondition =
                {
                    page: $routeParams.page || 1 ,
                    size: 10,
                    orderKey: locationUrl.indexOf("excellent") >0 ?"collect_count" :  "publish_date" ,//默认按创建时间排序
                    isDESC: $scope.isDESC,//排序方式，默认按降序排序
                    mainCatalogCode: $routeParams.type || "" ,
                    f_type: locationUrl.indexOf("excellent")>0? "00" : "01",
                    author: '',
                    tagName: ''
                };
            }
            else {
                $scope.queryCondition = $rootScope.template_req;
            }

            $rootScope.template_req = null;
            get_templates_count();

            $scope.$watch('queryCondition', function (queryCondition, old) {
                _.isEmpty($routeParams.template_id) && old && load_data(queryCondition);
            }, true);
        };


        //获取模板二级分类
        if (_.isEmpty($rootScope.template_catalogs)) {
            $http.get('/json/templateCatalog.json').success(function (response) {
                $rootScope.template_catalogs = response.data;
                init($rootScope.template_catalogs);
            });
        }
        else {
            init($rootScope.template_catalogs);
        }
        ;


        //排序部分开始
        $scope.templateSort_filterItems =
            [
                {name: '按发布时间', value: 'publish_date', is_selected: true}
//                ,{name: '按更新时间',value: 'update_date',is_selected: false}
            ,
            {name: '按收藏数量', value: 'collect_count', is_selected: false}
            ,
            {name: '按评论数量', value: 'comment_count', is_selected: false}
        ];

        $scope.currentSortItem = $scope.header_menu == "template" ? $scope.templateSort_filterItems[0] : $scope.templateSort_filterItems[1];

        $scope.sortTemplateDates = function (item) {
            if ($scope.currentSortItem !== item) {
                $scope.currentSortItem.is_selected = false,
                    item.is_selected = true,
                    $scope.currentSortItem = item;
                $scope.queryCondition.orderKey = item.value;
            }
            else {
                $scope.isDESC = !$scope.isDESC;
                $scope.queryCondition.isDESC = $scope.isDESC ? '1' : '0';
            }

//            $scope.queryCondition.page=1;
//
//            $scope.currentPage = 1;
            $location.path($location.path()).search('page', 1);
        };
        //排序部分结束


        $scope.$watch('currentPage', function (currentPage) {
            $scope.pageNum = currentPage;
            //$scope.queryCondition.page = currentPage;
        });

        $scope.jumpToPage = function (pageNum) {
            if (/\D/.test(pageNum)) {
                kzi.msg.error("页码应该是数字", null);
                return false;
            }
            $scope.currentPage = pageNum;
        };

        $scope.$watch('itemsPerPage', function (itemsPerPage) {
            $scope.queryCondition.size = itemsPerPage;
        });

        //按模板分类查询话题列表
//        $scope.mainCatalogClick=function(mainCatalog)
//        {
//            $scope.queryCondition.mainCatalogCode=_.isEmpty(mainCatalog)?"":mainCatalog.code;
//
//            $scope.currentMainCatalog=mainCatalog;
//
//            _.isEmpty($rootScope.template_detail_id) || $scope.hide_detail();
//        };

        $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
//            load_data($scope.queryCondition);
            $scope.templates = _.filter($scope.templates, function (e) {
                return e.objectId != p.id;
            });
            $scope.totalItems -= 1;
        }, null);

        var load_data = function (queryCondition) {
            $rootScope.global.loading_done = false;
            $scope.currentPage = $scope.tempPage;
            $scope.queryCondition.page = $scope.tempPage;
            wt.data.template.public(queryCondition, function (response) {
                    $scope.templates = response.data;

                    $scope.totalItems = response.totalItems;

                    if ($scope.queryCondition.mainCatalogCode == '') {
                        $scope.all_count != $scope.totalItems && ($scope.all_count = $scope.totalItems, $scope.catalogs.length > 0 && get_templates_count());
                    }
                    else {
                        _.each($scope.catalogs, function (e) {
                            if (e.code == $scope.queryCondition.mainCatalogCode) {
                                var difference = $scope.totalItems - e.count;

                                e.count = $scope.totalItems;

                                $scope.all_count = $scope.all_count + difference;
                            }
                        });
                    }
                    ;
                },
                function () {
                    kzi.msg.error("加载数据失败！");
                },
                function () {
                    $rootScope.global.loading_done = true;
                    $scope.queryCondition.tagName = "";
                    $scope.currentPage = $routeParams.page || 1;
                }
            );
        };

        $scope.js_is_published_sync = function (id) {
            if (_.indexOf($scope.published_array_sync, id) > -1) {
                return 1;
            } else {
                return 0;
            }
        };

        $scope.go_to_inner_template = function () {
            $window.location.href = "/templates";
        }

        //收藏模板
        $scope.js_collect = function (template, event) {
            event.stopPropagation();

            if ($rootScope.need_login()) {
                wt.data.template.collect(
                    null,
                    template.objectId,
                    function () {
                        $scope.send_success = !0
                        template.collected = true;
                        template.collect_count++;
                        kzi.msg.success("收藏成功");
                    },
                    function () {
                        kzi.msg.error("收藏失败");
                    },
                    function () {
                    }
                );
            }
            ;

        };

//        //模板被收藏事件
//        $scope.$on("template_collect",function(event,objectId){
//            if (!_.isEmpty(objectId))
//            {
//                var n=_.findWhere($scope.templates,{objectId:objectId});
//                n && (n.collected=true);
//            };
//        });
        $scope.tagClick = function (tag) {
            var queryCondition = _.clone($scope.queryCondition);
            queryCondition.tagName = tag;
            load_data(queryCondition);
        }
    }]);

innerApp.controller('detail_template_ctrl', [ '$scope', '$rootScope', '$popbox',
    function ($scope, $rootScope, $popbox) {

        $scope.template = {};

        var load_template_detail = function (post_id) {
            _.isEmpty(post_id) || (wt.data.template.get('', post_id, function (t) {
                    $scope.template = getTYpeName(t.data);
                    $rootScope.global.title = $scope.template.name;
                }, function (t) {
                    t.code == kzi.statuses.post_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
                }, function () {
                    $rootScope.global.loading_done = true;
                }
            ));
        };

        load_template_detail($rootScope.template_detail_id);

        //管理员删除问答
        $scope.del_template = function (t, n) {
            $popbox.popbox({
                target: t,
                placement: 'right',
                templateUrl: '/view/common/pop_post_delete.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    '$rootScope',
                    function (e, t, a, $rootScope) {
                        e.popbox = t,

                            e.entity_type = "模板";

                        e.js_sure_delete = function () {
                            $rootScope.template_req = $scope.queryCondition;
                            $rootScope.del_entity(n.objectId, n.uid, "template");
                            t.close();
                        },
                            e.js_close = function () {
                                t.close();
                            };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return { scope: $scope };
                    }
                }
            }).open();
        };

        //点赞
        $scope.praise = function (template) {
            if ($rootScope.need_login()) {
                template.praised == 1 && kzi.msg.error("已赞过，不能重复点赞！", function () {
                });

                if (!_.isEmpty(template) && template.praised == 0) {
                    wt.data.template.praise(template.template_id, function () {
                        kzi.msg.success("谢谢您的点赞！", function () {
                        });
                        template.praiser_count += 1;
                        template.praised = 1;
                    }, function (resp) {
                        var err = "程序异常，点赞失败！";
                        switch (resp.code) {
                            case 9004:
                                err = "不能重复点赞！";
                                break;
                            case 2005:
                                err = "请先登录！";
                                break;
                            default:
                                break;
                        }
                        ;
                        kzi.msg.error(err, function () {
                        });
                    }, function () {
                    });
                }
                ;
            }
        };


        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_template_comment, function (t, i) {
            _.isEmpty(i) || i.template_id === $scope.template.template_id && $scope.template.comment_count++;
        });

        //删除评论事件
        $scope.$on(kzi.constant.event_names.comment_del, function (t, i) {
            _.isEmpty(i) || i === $scope.template.template_id && $scope.template.comment_count--;
        });

        //根据分类编码获取分类名称
        var getTYpeName = function (template) {
            var type = _.findWhere($rootScope.template_catalogs, {"code": template.mainCatalogCode});

            template.type_name = _.isEmpty(type) ? "" : type.cnName;

            return template;
        };

        $scope.token = kzi.get_cookie('sid');
        $scope.$watch("template", function (t) {
            t && ($scope.file_upload_option = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "template",
                    pid: t.pid,
                    template_id: t.template_id
                }
            }, $scope.file_upload_option_comment = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "comment",
                    pid: t.pid,
                    template_id: t.template_id,
                    successCallback: function (e) {
                        var t = angular.element(".comment-list:visible").scope().comment;
                        _.isEmpty(t.files) && (t.files = []), e.data.icon = kzi.helper.build_file_icon(e.data), t.files.push(_.omit(e.data, "watchers"))
                    }
                }
            }, $scope.dragfile_option = {
                upload_option: $scope.file_upload_option
            }, $scope.pastefile_option_comment = {
                upload_option: $scope.file_upload_option_comment
            }, $scope.global_fileupload_queue = function () {
                return $rootScope.upload_queue.get_template(t.pid, t.template_id)
            }, $scope.global_fileupload_queue_comment = function () {
                return $rootScope.upload_queue.get_comment_template(t.pid, t.template_id)
            })
        });

    }
]);