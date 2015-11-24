"use strict";
innerApp.controller('public_post_ctrl', ["$rootScope", "$scope", "$window", "$http", "$routeParams", "$location",
    function ($rootScope, $scope, $window, $http, $routeParams, $location) {

        $rootScope.global.title = "问答";
        $rootScope.global.loading_done = false;

        $scope.header_menu = $rootScope.global.header_menu;

        $scope.to_post_detailed = function (post) {
            if ($rootScope.global.is_login) {
                $rootScope.global.me.role == 0 && (post.click_count += 1, $rootScope.locator.to_post(post.pid, post.post_id, null));

                $rootScope.global.me.role == 0 || ($rootScope.post_req = $scope.req, $window.open("/" + $scope.header_menu + "/" + post.post_id));
            }
            else {
                $rootScope.post_req = $scope.req;
//                $location.url("/"+$scope.header_menu+"/"+post.post_id);
                $window.open("/" + $scope.header_menu + "/" + post.post_id);
            }
        };

        //获取url传入的postID；
        _.isEmpty($routeParams.post_id) || ($rootScope.post_detail_id = $routeParams.post_id, $rootScope.load_comments_attrs = {
            pid: "",
            xid: $routeParams.post_id,
            xtype: kzi.constant.xtype.post,
            comment_id: 'post'
        });

        $rootScope.global.is_login || ($rootScope.global.return_path = $location.url());

        $scope.hide_detail = function () {
            $rootScope.post_req = $scope.req;
            $location.url("/" + $scope.header_menu);
        };

        //排序操作开始
        $scope.postSort_filterItems =
            [
                {name: '按回复时间', value: 'last_reply_date', is_selected: $scope.header_menu != "post"}
                , {name: '按评论数量', value: 'comment_count', is_selected: false}
                , {name: '按收藏数量', value: 'collect_count', is_selected: $scope.header_menu == "post"}
            ];

        $scope.currentSortItem = $scope.header_menu == "post" ? $scope.postSort_filterItems[2] : $scope.postSort_filterItems[0];

        //默认参数
        $scope.orderkey = $scope.currentSortItem.value;//默认按回复时间排序
        $scope.req = {};
        $scope.post_count = [];
        $scope.posts = [];//默认文章列表为空
        $scope.total_count = "0";//默认文章数量为0

        $scope.classify_show_name = "";
        $scope.isDESC = true;//排序方式，默认按降序排序

        if ($routeParams.page) {
            $scope.tempPage = $routeParams.page;
        } else {
            $scope.tempPage = 1;
        }

        if ($routeParams.type) {
            $scope.current_code = $routeParams.type;
        } else {
            $scope.current_code = '0';
        }

        //获取问答各个分类的数量
        var get_post_count = function () {
            $http.get('/api/posts/' + $scope.req.f_type + '/group').success(function (rep) {

                $scope.post_count = rep.data.rawResults.retval;

                $scope.post_all_count = rep.data.count;

                var i = 0;

                var count_item = null;

                for (; i < $scope.postTypes.length; i++) {
                    count_item = _.find($scope.post_count, function (e) {
                        return e.s_type == $scope.postTypes[i].code;
                    });

                    $scope.postTypes[i].count = _.isEmpty(count_item) ? 0 : count_item.count;

                    count_item = null;
                }
                ;
            });
        };

        //初始化数据
        var init = function (post_types) {
            $scope.postTypes = post_types[0].children;

            if (_.isEmpty($rootScope.post_req)) {
                $scope.req = {
                    f_type: $scope.header_menu == "post" ? post_types[0].code : post_types[1].code,
                    orderKey: $scope.orderkey,
                    isDESC: $scope.isDESC,
                    page: 1,
                    size: 10,
                    tagName: ""
                };
            }
            else {
                $scope.req = $rootScope.post_req;
            }
            ;

            if ($routeParams.type) {
                $scope.req.s_type = $routeParams.type;
            } else {
                $scope.req.s_type = '0';
            }
            $rootScope.post_req = null;

            $scope.current_code = $scope.req.s_type;

            if ($scope.current_code != '0') {
                var n = _.where($scope.postTypes, {code: $scope.current_code});
                _.isEmpty(n) || ($scope.classify_show_name = n[0].cnName);
            }
            ;
            get_post_count();
        };

        if (_.isEmpty($rootScope.allPostTypes)) {
            $http.get('/json/manager/postType.json').success(function (res) {
                $rootScope.allPostTypes = res.data;
                init($rootScope.allPostTypes);
            });
        }
        else {
            init($rootScope.allPostTypes);
        }
        ;

        //按话题分类查询话题列表
//        $scope.select_posts=function(postType)
//        {
//            _.isEmpty(postType)?($scope.current_code="0",$scope.classify_show_name="全部"):($scope.current_code=postType.code,$scope.classify_show_name=postType.cnName);
//
//            $scope.req.s_type = $scope.current_code;
//
//            _.isEmpty($rootScope.post_detail_id) || $scope.hide_detail();
//        };


        $scope.change_sort = function () {
            $scope.isDESC = !$scope.isDESC;
            $scope.req.isDESC = $scope.isDESC ? '1' : '0';
            $location.path($location.path()).search('page', 1);
        };

        $scope.sortPostDates = function (item) {
            if ($scope.currentSortItem !== item) {
                $scope.currentSortItem.is_selected = false,
                    item.is_selected = true,
                    $scope.currentSortItem = item;
                $scope.req.orderKey = item.value;
            }
            else {
                $scope.isDESC = !$scope.isDESC;
                $scope.req.isDESC = $scope.isDESC ? '1' : '0';
            }
//            $scope.req.page=1;
//            $scope.currentPage = 1;
            $location.path($location.path()).search('page', 1);
        };
        //排序操作结束

        //删除问答事件
        $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
//            load_data($scope.req);
            $scope.posts = _.filter($scope.posts, function (e) {
                return e.objectId != p.id;
            });
            $scope.total_count -= 1;
        }, null);

        $scope.add_post =
        {
            show_add_new_post: false,

            /**
             * 显示或隐藏添加问答界面
             */
            show_add_post: function () {
                $scope.add_post.cancelForm();//清空各个输入框

                //添加问答界面原本是隐藏的，并且已登录，就显示，否则隐藏
                !$scope.add_post.show_add_new_post ?
                    ($rootScope.need_login() && ($scope.add_post.show_add_new_post = true))
                    :
                    ($scope.add_post.show_add_new_post = false, $scope.add_post.show_types = false);
            },

            data: {
                title: "",
                f_type: "01",
                s_type: "",
                s_typename: "",
                is_published: 1,
                content: ''
            },

            cancelForm: function () {
                $scope.add_post.data.title = "";
                $scope.add_post.data.content = "";
                $scope.add_post.data.s_type = "";
                $scope.add_post.data.s_typename = "";
            },

            s_type_index: 0,

            choose_s_type: function (index) {
                $scope.add_post.s_type_index = index;
                $scope.add_post.data.s_type = $scope.postTypes[index].code;
                $scope.add_post.data.s_typename = $scope.postTypes[index].cnName;
                $scope.add_post.show_types = false;
            },

            show_types: false,

            show_s_type: function () {
                $scope.add_post.show_types = true;
            },

            clear_warming: function (id) {
                $("#" + id).css("border", "1px solid #ccc");
            },

            add: function () {
                if (_.isEmpty($scope.add_post.data.title)) {
                    kzi.msg.error("请输入问答名称！", function () {
                    });
                    $("#post_title").css("border", "1px solid #d84c31");
                }
                else if (_.isEmpty($scope.add_post.data.s_type)) {
                    kzi.msg.error("请选择问答分类！", function () {
                    });
                    $("#post_type").css("border", "1px solid #d84c31");
                }
                else if (_.isEmpty($scope.add_post.data.content)) {
                    kzi.msg.error("请输入问答内容！", function () {
                    });
                    $("#post_content").css("border", "1px solid #d84c31");
                }
                else {
                    $scope.is_saving = true;

                    wt.data.post.create("", $scope.add_post.data, function () {
                            kzi.msg.success("问题提交成功！", function () {
                            });
                            $scope.isDESC = true;
                            $scope.req.isDESC = $scope.isDESC;
                            $scope.req.orderKey = "publish_date";
//                            $scope.select_posts({code:$scope.add_post.data.s_type,cnName:$scope.add_post.data.s_typename});
//                            $scope.add_post.data.f_type=="00" && ($rootScope.post_req=$scope.req,$location.url("/post"));
                            $scope.add_post.show_add_post();

                        },
                        function () {
                            kzi.msg.error("问题提交失败！", function () {
                            });
                        },
                        function () {
                            $scope.is_saving = false;
                        }
                    );
                }
                ;
            }
        };

        var load_data = function (req) {
            $scope.part_loading_done = !1;
            $scope.currentPage = $scope.tempPage;
            $scope.req.page = $scope.tempPage;
//            if($scope.req.page!=$scope.tempPage){
//                $scope.req.page=$scope.tempPage;
//            }else{
//                return;
//            }
            wt.data.post.getPageListPost(req, function (i) {
                    $scope.posts = i.data;
                    $scope.total_count = i.totalItems;

                    if ($scope.req.s_type == '0') {
                        $scope.post_all_count != $scope.total_count && ($scope.post_all_count = $scope.total_count, get_post_count());
                    }
                    else {
                        _.each($scope.postTypes, function (e) {
                            if (e.code == req.s_type) {
                                var difference = $scope.total_count - e.count;

                                e.count = $scope.total_count;

                                $scope.post_all_count = $scope.post_all_count + difference;

                                $scope.post_all_count > 0 ? $scope.post_all_count : 0;
                            }
                        });
                    }
                    ;

                    if ($scope.posts.length > 0) {
                        for (var i = 0; i < $scope.posts.length; i++) {
                            var type = _.findWhere($scope.postTypes, {"code": $scope.posts[i].s_type});

                            $scope.posts[i].typeName = _.isEmpty(type) ? "" : type.cnName;
                        }
                    }
                }, function () {
                    kzi.msg.error('加载数据失败~', function () {
                    });
                    $scope.part_loading_done = !0;
                },
                function () {
                    $scope.part_loading_done = true;
                    $rootScope.global.loading_done = true;
                    $scope.req.tagName = "";
                });
        };


        $scope.$watch("req", function (req) {
            _.isEmpty($routeParams.post_id) && load_data(req);
        }, true);

        //监视分页操作
//        $scope.$watch('currentPage',function(newValue,oldValue){
//            $scope.req.page=newValue;
//        });

        //收藏问答
        $scope.post_collect = function (post) {
            if ($rootScope.need_login()) {
                wt.data.post.collect(post.post_id, function () {
                        post.collected = 1;
                        kzi.msg.success('关注成功!~', function () {
                        });
                        post.collect_count++;
                    }, function () {
                        kzi.msg.error('关注失败!~', function () {
                        });
                        $scope.part_loading_done = !0;
                    },
                    function () {
                        $scope.part_loading_done = !0;
//                        $rootScope.global.loading_done = !0;
                    });
            }
            ;
        };

        $scope.toMyPosts = function () {
            $window.location.href = "/posts";
        };

        //收藏问答结束事件
        $scope.$on(kzi.constant.event_names.on_post_collect, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.posts, i);
                n && (n.collect_count++, n.collected = 1);
            }
            ;
        });
        $scope.tagClick = function (tag) {
            var req = _.clone($scope.req);
            req.tagName = tag;
            load_data(req);
        }
    }]);


innerApp.controller('detail_post_ctrl', ['$scope', '$rootScope', '$popbox',
    function ($scope, $rootScope, $popbox) {
        $scope.detail_loading_done = false;

        $scope.post = {};

        var load_post_detail = function (post_id) {
            _.isEmpty(post_id) || (wt.data.post.get('', post_id, function (t) {
                    $scope.detail_loading_done = true;

                    $scope.post = getTYpeName(t.data);
                    $rootScope.global.title = $scope.post.name;
                }, function (t) {
                    t.code == kzi.statuses.post_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
                }, function () {
                    $scope.detail_loading_done = true;
                    $rootScope.global.loading_done = !0;
                }
            ));
        };

        load_post_detail($rootScope.post_detail_id);

        //管理员删除问答
        $scope.del_post = function (t, post) {
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

                            e.entity_type = "问答";

                        e.sure_delete = function () {
                            $rootScope.post_req = $scope.req;
                            $rootScope.del_entity(post.objectId, post.uid, 'post');
                            t.close();
                        },
                            e.js_close = function () {
                                t.close();
                            };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {scope: $scope};
                    }
                }
            }).open();
        };

        //点赞
        $scope.praise = function (post) {
            if ($rootScope.need_login()) {
                post.praised == 1 && kzi.msg.error("已赞过，不能重复点赞！", function () {
                });

                if (!_.isEmpty(post) && post.praised == 0) {
                    wt.data.post.praise(post.post_id, function () {
                        kzi.msg.success("谢谢您的点赞！", function () {
                        });
                        post.praiser_count += 1;
                        post.praised = 1;
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
        $scope.$on(kzi.constant.event_names.on_post_comment, function (t, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.posts, i);
                n && n.comment_count++;
            }
            ;
        });

        //删除评论事件
        $scope.$on(kzi.constant.event_names.comment_del, function (t, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.posts, {post_id: i});
                n && n.comment_count--;
            }
            ;
        });

        //根据分类编码获取分类名称
        var getTYpeName = function (post) {
            var type = _.findWhere($rootScope.allPostTypes[0].children, {"code": post.s_type});

            post.type_name = _.isEmpty(type) ? "" : type.cnName;

            return post;
        };

        $scope.token = kzi.get_cookie('sid');

        $scope.$watch('post', function (t) {
            t && ($scope.file_upload_option = {
                url: [
                    kzi.config.wtbox(),
                    '?pid=' + t.pid,
                    '&token=' + kzi.get_cookie('sid')
                ].join(''),
                formData: {
                    target: 'prj',
                    type: 'post',
                    pid: t.pid,
                    post_id: t.post_id
                }
            }, $scope.file_upload_option_comment = {
                url: [
                    kzi.config.wtbox(),
                    '?pid=' + t.pid,
                    '&token=' + kzi.get_cookie('sid')
                ].join(''),
                formData: {
                    target: 'prj',
                    type: 'comment',
                    pid: t.pid,
                    post_id: t.post_id,
                    successCallback: function (e) {
                        var t = angular.element('.comment-list:visible').scope().comment;
                        _.isEmpty(t.files) && (t.files = []), e.data.icon = kzi.helper.build_file_icon(e.data), t.files.push(_.omit(e.data, 'watchers'));
                    }
                }
            }, $scope.dragfile_option = {upload_option: $scope.file_upload_option}, $scope.pastefile_option_comment = {upload_option: $scope.file_upload_option_comment}, $scope.global_fileupload_queue = function () {
                return $rootScope.upload_queue.get_post(t.pid, t.post_id);
            }, $scope.global_fileupload_queue_comment = function () {
                return $rootScope.upload_queue.get_comment_post(t.pid, t.post_id);
            });
        });
    }
]);