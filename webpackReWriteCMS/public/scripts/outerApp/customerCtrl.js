"use strict";

innerApp.controller('customerCtrl',
    ['$scope', '$rootScope', '$window', '$popbox', '$modal', '$http', '$timeout', '$routeParams', '$location','$q',
        function ($scope, $rootScope, $window, $popbox, $modal, $http, $timeout, $routeParams, $location, $q) {
            $rootScope.global.title = '找活动';
            $rootScope.global.loading_done = false;
            $rootScope.global.return_path = '/customer';
            $scope.show_group = false;//隐藏行业选择
            $scope.show_search_setting = false;//隐藏推荐设置
            $rootScope.global.header_menu = 'customer';

            $scope.currentPage = 1;
            $scope.itemsPerPage = 30;
            $scope.totalItems = 0;
            $scope.customer_can_be_collected = [];

            $scope.collectedTasks = [];
            /**
             * 点击列表查看活动详情
             * @param event
             * @param customer
             */
            $scope.show_customer_info = function (event, customer) {
                event.stopPropagation();
//                $("#"+customer.tid+" a")[0].click();
                $rootScope.locator.to_task(customer.pid, customer.tid, null);
            };

//            //处理公海活动页面动态列表部分
//            $scope.dynamics = [];
//
//            //动态列表滚动
//            var listLoop = function (list_id, time) {
//                var loop = function (list_id, time) {
//                    var list = $(list_id);
//
//                    if (list.children().length > 1) {
//                        list.prepend(list.children().last());//向下滚动
//                        $timeout(function () {
//                            loop(list_id, time)
//                        }, time);
//                    }
//                    ;
//                };
//
//                $timeout(function () {
//                    loop(list_id, time)
//                }, time);
//            };
//
//            //请求并加载动态数据
//            var loadTaskDynamics = function () {
//                $http.get("/api/dynamic/customers").success(function (resp) {
//
//                    !_.isEmpty(resp) && !_.isEmpty(resp.data) && ($scope.dynamics = resp.data);
//
//                    $timeout(function () {
//                        loadTaskDynamics();
//                    }, 1000 * 60);
////                    $scope.dynamics.length>=10 && listLoop("#task-dynamics",2000);
//                });
//            };
//            loadTaskDynamics();//

            //获取url传递的参数
            var url_parem = null;

            if (!_.isEmpty($routeParams.cid) && !_.isEmpty($routeParams.f_code) && !_.isEmpty($routeParams.s_code)) {
                url_parem = {cid: $routeParams.cid, f_code: $routeParams.f_code, s_code: $routeParams.s_code};
            }
            ;


            /**
             * 选择是否免费
             */
            $scope.ifFree = function () {
                $scope.queryCondition.isFree = !$scope.queryCondition.isFree;
                if ($scope.queryCondition.isFree) {
                    $scope.queryCondition.isHaveEmail = false;
                }
            };
            /**
             * 选择是否有邮箱
             */
            $scope.ifHaveEmail = function () {
                $scope.queryCondition.isHaveEmail = !$scope.queryCondition.isHaveEmail;
                if ($scope.queryCondition.isHaveEmail) {
                    $scope.queryCondition.isFree = false;
                }
            };

            $scope.ifHaveContacts = function () {
                $scope.queryCondition.isHaveContacts = !$scope.queryCondition.isHaveContacts;
                }

            //筛选条件
            $scope.queryCondition = {
                page: 1,
                size: 20,
                isHide: false,
                isHaveContacts: true,
                isHaveEmail: true,
                isFree: false,
                diffDays: "",
                startDate: "",
                endDate: "",
                subIndustryCode: "",
                mainIndustryCode: "",
                countryCode: "",
                zoneCode: "",
                orderKey: "publish_date",//默认按创建时间排序
                isDESC: "1",//排序方式，默认按降序排序
                keywords: $routeParams.keywords,
                tagName: ""
            };

            $scope.keywords = $scope.queryCondition.keywords;

            //日期筛选列表
            $scope.dateSelectList = [
                {
                    name: '全部',
                    diffdays: 0,
                    count: -1,
                    isActive: true
                },
                {
                    name: '最近三天',
                    diffdays: -3,
                    isActive: false
                },
                {
                    name: '最近一周',
                    diffdays: -7,
                    isActive: false
                },
                {
                    name: '最近三个月',
                    diffdays: -90,
                    isActive: false
                },
                {
                    name: '最近半年',
                    diffdays: -180,
                    isActive: false
                }
            ];

            //每页显示多少条
            $scope.$watch('itemsPerPage', function (itemsPerPage) {
                $scope.queryCondition.size = itemsPerPage;
            });

            //列表点击主行业
            $scope.clickMainIndustry = function (event, customer) {
                event.stopPropagation();
                $scope.queryCondition.mainIndustryCode = customer.mainIndustryCode;
                $scope.currentMainIndustryName = customer.mainIndustryCnName;
                $scope.currentSubIndustryName = '';
            }

            //列表点击国家
            $scope.clickCountry = function (event, customer) {
                event.stopPropagation();
                $scope.queryCondition.countryCode = customer.countryCode;
                $scope.currentZoneName = customer.zoneCnName;
                $scope.currentCountryName = customer.countryCnName;
            }

            //列表点击产品
            $scope.clickProduct = function (event, productName) {
                event.stopPropagation();
                $scope.queryCondition.keywords = productName;
                $scope.keywords = productName;
            }

            //按日期筛选
            $scope.selectTime = "更新时间";
            $scope.showDateSelectDiv = false;
            $scope.dateSelectClick = function (currentDateSelect) {

                if ($scope.queryCondition.diffDays != currentDateSelect.diffdays) {
                    angular.forEach($scope.dateSelectList, function (dateSelect) {
                        dateSelect.isActive = false;
                    })
                    currentDateSelect.isActive = true;
                    $scope.queryCondition.diffDays = currentDateSelect.diffdays;
                    $scope.selectTime = currentDateSelect.name;
                }

                $scope.showDateSelectDiv = false;
            };
            $scope.hideDateSelect = function () {
                $scope.showDateSelectDiv == true && $timeout(function () {
                    $scope.showDateSelectDiv = false;
                }, 200);
            };

            //翻页
            $scope.$watch('currentPage', function (currentPage) {
                $scope.pageNum = currentPage;
                $scope.queryCondition.page = currentPage;
            })

            //跳转到某页
            $scope.jumpToPage = function (pageNum) {
                if (/\D/.test(pageNum)) {
                    kzi.msg.error("页码应该是数字", null);
                    return false;
                } else if (pageNum > $scope.numPages || pageNum < 1) {
                    $scope.currentPage = 1;
                    $scope.pageNum = 1;
                } else {
                    $scope.currentPage = pageNum;
                }
            };

            //清空查询关键词
            $scope.clear_key_words = function () {

                if (!_.isEmpty($scope.queryCondition.keywords)) {
                    $scope.keywords = "";
                    $scope.queryCondition.keywords = "";
                    $scope.have_search_setting == false && ($scope.currentMainIndustryName = "");
                }
                ;

                $scope.have_search_setting == true &&
                (
                    $scope.have_search_setting = false,
                        $scope.isHide = false, $scope.queryCondition.isHide = false,
                        $scope.isHaveContacts = false, $scope.queryCondition.isHaveContacts = false,
                        $scope.isHaveEmail = false, $scope.queryCondition.isHaveEmail = false
                );
            };

            $scope.is_google = '0';

            /**
             * 搜谷歌
             */
            $scope.to_google_search = function () {
                _.isEmpty($scope.keywords) && ($scope.keywords = "");
                $window.open("/tools/search?key=" + $scope.keywords);
            };

            //查询
            $scope.setKeywords = function () {

                if ($scope.is_google == '1') {
                    $scope.to_google_search();
                }
                else {
                    $scope.have_search_setting = false;
                    $scope.show_search_setting = false;

                    $scope.industry_group.main_code = "";
                    $scope.queryCondition.mainIndustryCode = "";

                    $scope.industry_group.s_code = "";
                    $scope.queryCondition.subIndustryCode = "";
                    $scope.currentSubIndustryName = "";
                    $scope.show_group = false;
                    $scope.queryCondition.keywords = $scope.keywords;
                    if (_.isEmpty($scope.keywords)) {
                        $scope.currentMainIndustryName = "";
                    }
                    ;
                }
                ;
            };

            //删除活动事件
            $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
//                load_data($scope.queryCondition);
                $scope.customers = _.filter($scope.customers, function (e) {
                    return e.objectId != p.id;
                });
//                $scope.customers= _.filter($scope.customers,function(e){return e.objectId!= p.id;});
                $scope.totalItems -= 1;

            }, null);

            //加载数据
            var load_data = function (queryCondition) {
                $rootScope.global.loading_done = false;
                $scope.selectAll = false;

//                if(!_.isEmpty(url_parem))
//                {
//                    queryCondition.mainIndustryCode=url_parem.f_code;
//                    queryCondition.subIndustryCode=url_parem.s_code;
//                };

                wt.data.customer.get_customers_by_condition(queryCondition,
                    function (response) {
                        $scope.totalItems = response.totalItems;
                        _.isEmpty($scope.keywords) || ($scope.currentMainIndustryName = $scope.keywords);
                        if (!_.isEmpty(url_parem)) {
                            var cc = null;

                            if (response.data.length > 0) {
                                cc = _.find(response.data, function (e) {
                                    return e.objectId == url_parem.cid;
                                });

                                if (!_.isEmpty(cc)) {
                                    var index = _.indexOf(response.data, cc);

                                    response.data[index] = response.data[0];

                                    response.data[0] = cc;
                                }
                                else {
                                    wt.data.task.get(null, url_parem.cid, function (resp) {
                                        cc = resp.data;
                                        $scope.customers[0] = cc;
                                    }, null, null);
                                }
                                ;
                            }
                            else {
                                wt.data.task.get(null, url_parem.cid, function (resp) {
                                    cc = resp.data;
                                    $scope.customers = [cc];
                                }, null, null);
                            }
                            ;

                            $scope.currentMainIndustryName = cc.mainIndustryCnName;

                            $scope.currentSubIndustryName = cc.subIndustryCnName;

                            $rootScope.locator.to_task(cc.pid, cc.tid, null);

                            $rootScope.locator.show_detail_task_id = cc.objectId;

                            cc = null;

                            url_parem = null;

                            $routeParams.href = "/customer";
                        }
                        ;

                        $scope.customers = response.data;
                        $scope.customerNames = _.pluck($scope.customers, "name");
                        _.each($scope.customers, function (customer) {
                            if (customer.products && customer.products != '') {
                                customer.productList = customer.products.split(",");
                            }
                        });
                    },
                    function () {
                        kzi.msg.error("加载失败！");
                    },
                    function () {
                        $rootScope.global.loading_done = true;
                        $rootScope.selectedTasks = [];
                        $scope.industry_group.show_help = false;
                        $scope.customer_can_be_collected = _.reject($scope.customers, function (customer) {
                            return customer.collected == 1;
                        })
                    }
                )
            };
            $scope.$watch('queryCondition', function (queryCondition, oldCondition) {

                //弹窗切换主行业
                if (queryCondition.mainIndustryCode !== oldCondition.mainIndustryCode) {
                    queryCondition.subIndustryCode = "";
                    queryCondition.subIndustryCnName = "";
                }
                ;
                //弹窗切换地区
                if (queryCondition.zoneCode !== oldCondition.zoneCode) {
                    queryCondition.countryCode = "";
                    queryCondition.countryCode = "";
                }
                ;

                //切换条件，跳转到第一页
                if (queryCondition.page == oldCondition.page && queryCondition.page != 1) {
                    $scope.currentPage = 1;
                } else {
                    load_data(queryCondition);
                }
            }, true);

            //排序
            $scope.sortItems = [
                {name: '按发布时间', value: 'publish_date'}
                // ,{name: '按更新时间',value: 'update_date'}
                ,
//                {name: '按公司名称', value: 'company'}
//                ,
//                {name: '按收藏数量', value: 'badges_collect_count'}
//                ,
                {name: '按评论数量', value: 'badges_comment_count'}
            ];

            $scope.currentSortItem = $scope.sortItems[0];

            //筛选栏逻辑控制
            $scope.sortByItem = function (item) {
                if (item.value != $scope.queryCondition.orderKey) {
                    $scope.queryCondition.orderKey = item.value;
                    $scope.currentSortItem = item;
                    $scope.queryCondition.isDESC = "1";
                } else {
                    $scope.currentSortItem = item;
                    $scope.queryCondition.isDESC = !$scope.queryCondition.isDESC;
                }
                $scope.currentPage = 1;
            };

            $scope.change_sort = function () {
                $scope.queryCondition.isDESC = !$scope.queryCondition.isDESC;
            };

            //登陆检测
            var isLoginDetect = function () {
                if ($rootScope.global.is_login == false) {
                    $modal.open({
                        templateUrl: '/view/modal/signin.html',
                        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.close = function () {
                                $modalInstance.close();
                            }
                        }]
                    });
                    return false;
                } else {
                    return true;
                }
            }

            $scope.js_pop_batch_collect = function (target) {

                function areTheyCollected (customerList) {
                    var deferred = $q.defer();
                    wt.data.task.detect_collect(_.chain(customerList).pluck("tid").value(), function (response) {
                        var collectedTasks = response.data || [];
                        deferred.resolve(collectedTasks);
                    }, function(){
                    }, function(){} );
                    return deferred.promise;
                }

                if ($rootScope.need_login('/customer')) {
                    areTheyCollected($scope.selectedTasks).then(function success(collectedTasks) {
                        $popbox.popbox({
                            target: target,
                            templateUrl: "/view/common/pop_collect_task.html",
                            controller: ["$scope", "popbox", "pop_data",
                                function ($scope, popbox, pop_data) {

                                    $scope.statistics_info = {
                                        all: function () {
                                            return $rootScope.selectedTasks.length;
                                        },
                                        collected: function () {
                                            return collectedTasks.length;
                                        }
                                    }

                                    var customerIdList = _.difference(_.pluck($rootScope.selectedTasks,"tid"),
                                                                        _.pluck(collectedTasks, "tid"));

                                    if (_.isEmpty($scope.projects) && $scope.global.is_login) {
                                        $scope.reload_projects(function (ee_projects) {
                                            _.isEmpty(ee_projects) || ($scope.projects = ee_projects);
                                            $scope.selected_project = ee_projects[0];
                                        });
                                    }

                                    $scope.js_collect_task = function () {
                                        wt.data.task.batch_collect(
                                            $scope.selected_project.pid,
                                            $scope.isFree,
                                            {'list': customerIdList},
                                            function (e) {
                                                kzi.msg.success(["成功收藏了",customerIdList.length,"位活动!"]);
                                                $modal.open({
                                                    template: '<i class="icon-remove icon-large icon-close" ng-click="close()"></i><div class="text-center bg-warning" style="padding:20px"><h3>收藏成功</h3><a class="btn btn-success" href="/tasks" target="_blank">查看已收藏的数据</a></div>',
                                                    size: 'sm',
                                                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance)
                                                    {
                                                        $scope.close = function ()
                                                        {
                                                            $modalInstance.close();
                                                        };
                                                    }]
                                                });
                                            },
                                            null, function () {
                                                $rootScope.selectedTasks = [];
                                                $scope.is_save_ing = false;
                                            });
                                    }


                                    $scope.js_close = function () {
                                        popbox.close()
                                    };
                                }],
                            resolve: {
                                pop_data: function () {
                                    return {
                                        scope: $scope
                                    };
                                }
                            }
                        }).open();
                    })
                }
            }

            /**
             * 批量收藏活动 -- 需要积分的收藏
             * @param target
             */
            $scope.js_batch_collect = function (target) {
                //if ($scope.selectAll == true && $rootScope.selectedTasks.length == 0) {
                //    kzi.msg.warn('本页全部活动已收藏，请点击下页');
                //    return;
                //}
                if ($rootScope.selectedTasks.length == 0) {
                    kzi.msg.warn('请先选择一个活动');
                    return;
                }
                if ($rootScope.need_login('/customer')) {
                    $popbox.popbox({
                        target: target,
                        templateUrl: "/view/common/pop_collect_task.html",
                        controller: ["$scope", "popbox", "pop_data",
                            function ($scope, popbox, pop_data) {

                                $scope.isFree = pop_data.scope.queryCondition.isFree;
                                $scope.popbox = popbox;
                                $scope.selectedCount = $rootScope.selectedTasks.length;
                                $scope.haveScore = 1 * $rootScope.global.me.score + 1 * $scope.selectedCount * $rootScope.scoreConfig.collectCustomer >= 0;
                                $scope.collect_task = {};
                                if (_.isEmpty($scope.projects) && $scope.global.is_login) {
                                    $scope.reload_projects(function (ee_projects) {
                                        _.isEmpty(ee_projects) || ($scope.projects = ee_projects);
                                        $scope.collect_task.project = ee_projects[0];
                                    });
                                }

                                _.isEmpty($scope.projects) || ($scope.collect_task.project = $scope.projects[0]);

                                $scope.js_close = function () {
                                    popbox.close()
                                };

                                /**
                                 * 公海收藏一个活动
                                 */
                                var collect_one_task = function (customerIdList) {
                                    $scope.is_save_ing = true;
                                    wt.data.task.batch_collect(
                                        $scope.collect_task.project.pid,
                                        $scope.isFree,
                                        {'list': customerIdList},
                                        function (e) {
                                            $rootScope.updatescore(-10 * $scope.selectedCount, "成功收藏" + ($scope.selectedCount) + "位活动,花费" + (10 * $scope.selectedCount) + "积分");
                                            angular.forEach(pop_data.scope.customers, function (customer) {
                                                if (_.indexOf(customerIdList, customer.objectId) >= 0) {
                                                    customer.collected = true;
                                                    customer.checked = false;
                                                }
                                            });
                                            $scope.js_close();
                                        },
                                        function (e) {
                                            var msg = "";
                                            switch (e.code) {
                                                case 2005:
                                                    msg = "没有登录,无权限操作!";
                                                    break;
                                                case 2007:
                                                    msg = "获取用户错误!";
                                                    break;
                                                case 2100:
                                                    msg = "积分不足，操作失败!";
                                                    break;
                                                default:
                                                    msg = "操作失败!";
                                            }
                                            kzi.msg.error(msg);
                                        }, function () {
                                            $rootScope.selectedTasks = [];
                                            $scope.is_save_ing = false;
                                        });
                                };

                                $scope.js_collect_task = function () {
                                    var flag = true;
                                    //不是免费收藏且积分不足
                                    if (!$scope.isFree && !$scope.haveScore) {
                                        kzi.msg.error("积分不足，收藏失败！", function () {
                                        });
                                        flag = false;
                                    }
                                    ;

                                    if (flag) {
                                        var customerIdList = [];
                                        angular.forEach($rootScope.selectedTasks, function (customer) {
                                            customerIdList.push(customer.objectId);
                                        });
                                        collect_one_task(customerIdList);
                                    }
                                    ;
                                }
                            }],
                        resolve: {
                            pop_data: function () {
                                return {
                                    scope: $scope
                                };
                            }
                        }
                    }).open();
                }
                ;

            };

            //列表收藏
            $scope.js_collect = function (target, customer) {
                target.stopPropagation();
                if ($rootScope.need_login('/customer')) {
                    $popbox.popbox({
                        target: target,
                        placement: 'right',
                        templateUrl: "/view/common/pop_collect_task.html",
                        controller: ["$scope", "popbox", "pop_data",
                            function ($scope, popbox, pop_data) {
                                $scope.popbox = popbox;
                                $scope.selectedCount = 1;
                                $scope.collect_task = {};
                                if (_.isEmpty($scope.projects) && $scope.global.is_login) {
                                    $scope.reload_projects(function (ee_projects) {
                                        _.isEmpty(ee_projects) || ($scope.projects = ee_projects);
                                        $scope.collect_task.project = ee_projects[0];
                                    });
                                }
                                ;

                                _.isEmpty($scope.projects) || ($scope.collect_task.project = $scope.projects[0]);
                                $scope.js_close = function () {
                                    popbox.close()
                                };
                                $scope.js_collect_task = function () {
                                    if (1 * $rootScope.global.me.score + 1 * $rootScope.scoreConfig.collectCustomer < 0) {
                                        kzi.msg.error("积分不足，收藏失败！", function () {
                                        });
                                    }
                                    else {
                                        wt.data.task.collect(
                                            $scope.collect_task.project.pid,
                                            customer.objectId,
                                            function (e) {
                                                $scope.send_success = !0
                                                customer.collected = true;
                                                $rootScope.updatescore(-10, "成功收藏一位活动,消耗10积分");

                                                $scope.js_close();
                                            }, function (e) {
                                                var msg = "";
                                                switch (e.code) {
                                                    case 2005:
                                                        msg = "没有登录,无权限操作!";
                                                        break;
                                                    case 2007:
                                                        msg = "获取用户错误!";
                                                        break;
                                                    case 2100:
                                                        msg = "积分不足，操作失败!";
                                                        $rootScope.setScore(e.data);
                                                        break;
                                                    default:
                                                        msg = "操作失败!";
                                                }
                                                kzi.msg.error(msg);
                                            },
                                            function () {
                                                customer.checked = false;
                                                $rootScope.selectedTasks = _.reject($rootScope.selectedTasks, function (i) {
                                                    return i.tid == customer.tid;
                                                })
                                                /*                $rootScope.$broadcast(kzi.constant.event_names.public_customer_colloct)*/
                                            });
                                    }
                                    ;
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
                    }).open();
                }
                ;
            };

            //点击我的活动
            $scope.go_to_inner_customer = function () {
                $window.location.href = "/tasks";
            };

            //分享活动
            $scope.go_to_inner_customer_shared = function () {
                $window.location.href = "/tasks?type=1";
            };


            //单选
            $scope.toggle = function (event, customer) {
                event.stopPropagation();
                customer.checked = !customer.checked;
                if (customer.checked) {
                    $rootScope.selectedTasks.push(customer)
                } else {
                    $rootScope.selectedTasks = _.reject($rootScope.selectedTasks,
                        function(i){return customer.tid == i.tid;});
                }
            };

            //全选
            $scope.toggleAll = function () {
                $scope.selectAll = !$scope.selectAll;
                $rootScope.selectedTasks = [];
                if ($scope.selectAll) {
                    _.forEach($scope.customers, function (i) {
                        i.checked = true;
                    });
                    $rootScope.selectedTasks = _.clone($scope.customers);
                } else {
                    _.forEach($scope.customers, function(i) {
                        i.checked = false;
                    })
                    $rootScope.selectedTasks = [];
                }
            };
            //活动被收藏后更新状态
            $scope.$on(kzi.constant.event_names.public_customer_colloct, function (event, i) {
                if ($scope.queryCondition.isHide) {
                    load_data($scope.queryCondition);
                } else {
                    _.each($scope.customers, function (customer) {
                        if (customer.tid === i.tid) {
                            customer.collected = 1;
                        }
                        ;
                    })
                }
                ;
                $scope.customer_can_be_collected = _.reject($scope.customers, function (customer) {
                    return customer.collected == 1;
                })
            });
            //活动被评论后更新状态
            $scope.$on(kzi.constant.event_names.on_task_update, function (t, n) {
                n && (_.isEmpty($scope.customers) || _.each($scope.customers, function (e) {
                    e.tid == n.tid && (e.badges = n.badges);
                }));
            });

//            $scope.$on("show_customer_list", function (t, n)
//            {
//                $scope.queryCondition.mainIndustryCode = n.f_code;
//
//                $scope.queryCondition.subIndustryCode= n.s_code;
//
//                $scope.show_group=n.show_group;
//            });

            $scope.toShareCustomer = function () {
                $location.url("/tasks?type=1");
            };

            $scope.tagclick = function (tagName) {
                var queryCondition = _.clone($scope.queryCondition)
                queryCondition.tagName = tagName;
                load_data(queryCondition);
            };
            /*            //产品标签列表部分
             $scope.vm = {
             productTagsList:[],
             moreTags:false
             };
             $scope.$on("product_show_more",function(e,v){
             $scope.vm.productTagsList = v.tags;
             if(v.flag){
             $scope.vm.moreTags = true;
             } else {
             $scope.vm.moreTags = false;
             }
             })*/

            /* 推荐设置滑窗控制开始 */
            $scope.search_setting = {
                is_setting_success: true,//设置成功
                is_saved: false,//已保存
                show_add_block: false,
                toggle_add_block: function (bool) {
                    this.show_add_block = bool ? true : false;
                },
                //显示或隐藏设置滑窗
                show_setting: function () {

                    if ($rootScope.need_login("/customer")) {
                        $scope.show_group = false;
                        $scope.show_search_setting = !$scope.show_search_setting;
                    }
                    ;
                },

                //显示行业信息
//                show_industrys:function(){$("#search_setting_industry_div").show();},
                //选择主行业
//                choose_m_industry:function(){},
                //选择二级行业
//                choose_s_industry:function(){},


                product_keys: [],
                product_key: "",
                //添加产品关键字
                add_product_key: function () {
                    if (!_.isEmpty($scope.search_setting.product_key)) {
                        $scope.search_setting.product_keys.push($scope.search_setting.product_key),
                            $scope.search_setting.product_key = "";
                    }
                    ;
                    $scope.search_setting.toggle_add_block(false);
                },
                //删除产品关键字
                del_product_key: function (index) {
                    if (index >= 0 && $scope.search_setting.product_keys.length > index) {
                        $scope.search_setting.product_keys.splice(index, 1);
                    }
                    ;
                },

                //保存设置
                save_setting: function () {

                    $scope.search_setting.add_product_key();

                    var str = _.reduceRight($scope.search_setting.product_keys, function (a1, a2) {
                        return a2 + "/kdd/" + a1
                    }, "");

                    str = str.substring(0, str.length - 5);

                    wt.data.user.save_search_setting($window.sessionStorage.getItem("uid"), {"proKeys": str},
                        function () {
                            $scope.search_setting.is_saved = true;
                            $scope.search_setting.is_setting_success = true;

                            var reg = new RegExp("/kdd/", "g");
                            $scope.keywords = str.replace(reg, " ");

                            $scope.queryCondition.keywords = $scope.keywords;

                            $window.sessionStorage.setItem("search_setting", str);
                        }, function () {
                            $scope.search_setting.is_saved = true;
                            $scope.search_setting.is_setting_success = false;
                        }, function () {
                            $timeout(function () {
                                $scope.show_search_setting = false;
                                $scope.search_setting.is_saved = false;
                            }, 2000);
                        });
                },
                //初始化数据
                init: function () {

                    var setting = $window.sessionStorage.getItem("search_setting");

                    if (!_.has($routeParams, 'key')) {
                        if (!_.isEmpty(setting)) {
                            $scope.search_setting.product_keys = setting.split("/kdd/");
                            var reg = new RegExp("/kdd/", "g");
                            $scope.keywords = setting.replace(reg, " ");
                        }
                        else {
                            init();
                        }
                        ;

//                        $scope.isHide=true;$scope.queryCondition.isHide=true;//为收藏
                        $scope.isHaveContacts = true;
                        $scope.queryCondition.isHaveContacts = true;//有联系人
                        $scope.isHaveEmail = true;
                        $scope.queryCondition.isHaveEmail = true;//有邮箱
                        $scope.have_search_setting = true;
                    }
                    else {
                        $scope.keywords = $routeParams.key;
                        $scope.currentMainIndustryName = $scope.keywords;
                        $scope.have_search_setting = false;
                    }
                    ;

                    $scope.queryCondition.keywords = $scope.keywords;
                }
            };

            var init = function () {
                //用户信息里的行业信息

                var param = $window.sessionStorage.getItem('mainIndustryCode');

                if (!_.isEmpty(param) && param != "null" && param != "undefined") {
                    $scope.queryCondition.mainIndustryCode = param;

                    param = $window.sessionStorage.getItem('mainIndustryName');

                    if (!_.isEmpty(param) && param != "null" && param != "undefined") {
                        $scope.currentMainIndustryName = param;

                        param = $window.sessionStorage.getItem('subIndustryCode');

                        if (!_.isEmpty(param) && param != "null" && param != "undefined") {
                            $scope.queryCondition.subIndustryCode = param;

                            param = $window.sessionStorage.getItem('subIndustryName');

                            if (!_.isEmpty(param) && param != "null" && param != "undefined") {
                                $scope.currentSubIndustryName = param;
                            }
                            else {
                                $scope.currentMainIndustryName = "未分类";
                            }
                        }
                    }
                    else {
                        $scope.currentMainIndustryName = "未分类";
                    }
                }
                ;
            };

//            $rootScope.global.is_login && $scope.search_setting.init();
            /* 推荐设置滑窗控制结束 */


            $scope.industry_group = function () {
            };
            $scope.industry_group.part_loading_done = false;
            $scope.industry_group.get_industry_count = false;
            $scope.industry_group.main = [];
            $scope.industry_group.second = [];
            $scope.industry_group.main_code = $scope.queryCondition.mainIndustryCode;
            $scope.industry_group.s_code = $scope.queryCondition.subIndustryCode;

            // 初始化数据
            $rootScope.getGroupCustomerCountDone.then(function () {
                $http.get('/json/industry.json').success(function (result) {
                    $scope.industry_group.main = getCount($rootScope.global.customers_count, result.data);
                    $scope.industry_group.part_loading_done = true;
                });
            });

            var count = 0;

            $scope.industry_group.toIndustrys = function () {

                if (!$scope.industry_group.get_industry_count) {
                    $scope.industry_group.main = getCount($rootScope.global.customers_count, $scope.industry_group.main);
                }

                $scope.show_search_setting = false;
                $scope.show_group = !$scope.show_group;

                if (count == 0 && $scope.industry_group.main.length > 0 && !_.isEmpty($scope.industry_group.s_code) && !_.isEmpty($scope.industry_group.main_code)) {
                    var industry = _.find($scope.industry_group.main, function (e) {
                        return e.code = $scope.industry_group.main_code;
                    });

                    show_second(industry);
                    count += 1;
                }
                ;
            };

            var show_second = function (industry) {

                if (!_.isEmpty(industry)) {
                    $scope.industry_group.s_all_count = industry.count;
                    $scope.industry_group.main_code = industry.code;
                    $scope.industry_group.f_name = industry.cnName;

                    var customers_count = _.findWhere($rootScope.global.customers_count, {key: industry.code});
                    _.isEmpty(customers_count) || ($scope.industry_group.second = getCount(customers_count.children, industry.children));
                }
                else {
                    $scope.industry_group.s_all_count = 0;
                    $scope.industry_group.main_code = "",
                        $scope.industry_group.f_name = "";
                }
            };

            //导航点击主行业
            $scope.clickMain = function () {
                $scope.queryCondition.subIndustryCode = '';
                $scope.currentSubIndustryName = '';
                $scope.industry_group.s_code = "";

//                if(count==0)
//                {
//                    var industry= _.find($scope.industry_group.main,function(e){return e.code=$scope.industry_group.main_code;});
//
//                    show_second(industry);
//                    count+=1;
//                };
//
//                $scope.show_group=true;
            };

            $scope.industry_group.showSecond = function (e) {
                $scope.clear_key_words();
                $scope.industry_group.s_code = "";
                $scope.queryCondition.subIndustryCode = "";
                $scope.currentSubIndustryName = "";
                $scope.industry_group.second = [];

                show_second(e);

                $scope.queryCondition.mainIndustryCode = $scope.industry_group.main_code;
                $scope.currentMainIndustryName = $scope.industry_group.f_name;
            };

            //导航点击全部
            $scope.industry_group.toAllCustomerList = function () {
                $scope.clear_key_words();
                $scope.industry_group.main_code = "";
                $scope.queryCondition.mainIndustryCode = $scope.industry_group.main_code;
                $scope.currentMainIndustryName = "";

                $scope.industry_group.s_code = "";
                $scope.queryCondition.subIndustryCode = "";
                $scope.currentSubIndustryName = "";
                $scope.industry_group.s_all_count = 0;

                $scope.show_group = false;
            };

            $scope.industry_group.toS_undefined = function () {
                $scope.industry_group.s_code = $scope.industry_group.main_code;
                $scope.industry_group.s_name = "未分类";
                $scope.queryCondition.subIndustryCode = $scope.industry_group.s_code;
                $scope.currentSubIndustryName = $scope.industry_group.s_name;
                $scope.show_group = false;
            };

            $scope.industry_group.toCustomerList = function (industry) {
                _.isEmpty(industry) || ($scope.industry_group.s_code = industry.code, $scope.industry_group.s_name = industry.cnName);
                _.isEmpty(industry) && ($scope.industry_group.s_code = "", $scope.industry_group.s_name = "全部");

                $scope.queryCondition.subIndustryCode = $scope.industry_group.s_code;
                $scope.currentSubIndustryName = $scope.industry_group.s_name;
                $scope.show_group = false;
            };

            var getCount = function (customers_count, industrys) {
                if (!_.isEmpty(industrys)) {
                    if (!_.isEmpty(customers_count)) {
                        var group_count = null;

                        $scope.industry_group.s_undefined_count = $scope.industry_group.s_all_count;

                        for (var i = 0; i < industrys.length; i++) {
                            group_count = _.findWhere(customers_count, {key: industrys[i].code});

                            industrys[i].count = _.isEmpty(group_count) ? 0 : group_count.value;

                            $scope.industry_group.s_undefined_count -= industrys[i].count;
                            group_count = null;
                        }
                        ;
                        $scope.industry_group.get_industry_count = true;
                    }
                    else {
                        for (var i = 0; i < industrys.length; i++) {
                            industrys[i].count = 0;
                        }
                        ;
                    }
                    ;
                }
                ;
                return industrys;
            };



            $scope.js_send_mail__batch = function () {
                var customerList = _.filter($scope.customers,function (i) { return i.checked});

                if($rootScope.need_login('/customer')){
                    var obj = {
                        tasks: customerList,
                        templates: $scope.templates
                    };

                    if(customerList.length == 0) {
                        kzi.msg.warn("批量发送至少需要选择一个活动！");
                        return undefined;
                    }

                    if(!$rootScope.global.is_outter && $rootScope.global.is_outter) {
                        $window.open('/template/generator_test?customer_id='+ t.objectId || '');
                    } else {
                        $rootScope.locator.show_slide = false;
                        $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj)
                    }
                }
            };
        }]);
