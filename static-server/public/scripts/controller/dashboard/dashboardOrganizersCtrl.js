'use strict';
innerApp.controller('organizers_ctrl', ["$http", "$rootScope", "$scope",
    "$routeParams", "$popbox", "$timeout",
    "$location", "baiduMapService", "MdParse",
    function ($http, $rootScope, $scope, $routeParams, $popbox, $timeout,
              $location, baiduMapService, MdParse) {
        //初始化数据
        var init = function () {
            $rootScope.global.title = "机构管理";
            $rootScope.global.loading_done = false;
            //获取类别
            $http.get('/api/codes/organizer/all').success(function (response) {
                response.data.push({code: 'ad_mobile_organizerhot', cnName: '移动热门主办方位'});
                $scope.types = response.data;
            });
            $scope.currentPage = 1;
            $scope.itemsPerPage = 20;
            $scope.totalItems = 0;
            $scope.isDESC = true;
            $scope.defaultType = {cnName: '全部', code: '0'};
            $scope.type = {cnName: '全部', code: '0'};
            $scope.current_type = $scope.defaultType;
            //查询参数集
            $scope.queryCondition = {
                code: $scope.defaultType.code,
                page: $scope.currentPage,
                sortKey: 'create_date',
                isDESC: $scope.isDESC,//排序方式，默认按降序排序
                size: 20,
                status: -1,
                statusPositive: false
            };
            $scope.sortItems = [
                {name: '按中文名称', value: 'cnName', is_selected: true}
                , {name: '按英文名称', value: 'enName', is_selected: false}
                , {name: '按创建时间', value: 'create_date', is_selected: false}
            ];
            $scope.currentSortItem = $scope.sortItems[0];
            //隐藏和显示添加活动界面
            $scope.is_create = false;
            $scope.new_element = {
                name: '',
                title: '',
                cnName: '',
                enName: '',
                email: '',
                address: '',
                poi: '',
                contact: '',
                company: '',
                code: '',
                code_name: '',
                code_scale: '',
                code_scale_name: '',
                code_ad: '',
                code_ad_name: '',
                code_address: '',
                code_address_1: '',
                code_address_name_1: '',
                code_address_2: '',
                code_address_name_2: '',
                code_address_3: '',
                code_address_name_3: '',
                code_address_4: '',
                code_address_name_4: '',
                typeName: '',
                desc: '',
                status: 0
            };
            //default opts
            $scope.mapOptions = _.extend(_.clone(baiduMapService.default_options), {
                address: $scope.new_element.address || '',
                clickCallBack: function (event) {
                    $scope.new_element.poi = baiduMapService.makePoi(event) || $scope.new_element.poi;
                    $scope.$apply();
                }
            });
            /*
             搜索框
             */
            $scope.searchInput = {
                keyword: undefined,
                search: function (keyword) {
                    var queryCondition = _.clone($scope.queryCondition);
                    queryCondition.keywords = keyword;
                    get_page(queryCondition);
                }
            };
        };
        init();


        //按类型分类选择
        $scope.selectByType = function (type) {
            $scope.current_type = type;
            $scope.queryCondition.sortKey = type.code === 'ad_mobile_organizerhot' ? 'position' : 'create_date';
            $scope.queryCondition.code = type.code;
        };
        $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
            $scope.items = _.filter($scope.items, function (e) {
                return e.eid != p.eid;
            });
            $scope.totalItems -= 1;
        }, null);
        //切换排序顺序
        $scope.sort = function () {
            $scope.isDESC = !$scope.isDESC;
            $scope.queryCondition.isDESC = $scope.isDESC;
        };
        $scope.$watch('currentPage', function (currentPage) {
            $scope.pageNum = currentPage;
            $scope.queryCondition.page = currentPage;
        });
        $scope.$watch('queryCondition', function (queryCondition) {
            get_page(queryCondition);
        }, true);
        var get_page = function (queryCondition) {
            $rootScope.global.loading_done = false;
            wt.data.organizer.get_all_page(
                queryCondition,
                function (response) {
                    $scope.items = response.data;
                    $scope.totalItems = response.totalItems;
                    $rootScope.global.loading_done = true;
                },
                function () {
                    kzi.msg.error("加载数据失败！", function () {
                    });
                },
                function () {
                    $rootScope.global.loading_done = true;
                }
            );
        }


        $scope.show_add_form = function () {
            $scope.new_element.name = "";
            $scope.new_element.title = "";
            $scope.new_element.cnName = "";
            $scope.new_element.enName = "";
            $scope.new_element.email = "";
            $scope.new_element.contact = "";
            $scope.new_element.desc = "";
            $scope.new_element.code = "";
            $scope.new_element.poi = "";
            $scope.new_element.address = "";
            $scope.new_element.code_name = "";
            $scope.new_element.code_scale = "";
            $scope.new_element.code_scale_name = "";
            $scope.new_element.code_ad = "";
            $scope.new_element.code_ad_name = "";
            $scope.new_element.code_address = "";
            $scope.new_element.code_address_1 = "";
            $scope.new_element.code_address_name_1 = "";
            $scope.new_element.code_address_2 = "";
            $scope.new_element.code_address_name_2 = "";
            $scope.new_element.code_address_3 = "";
            $scope.new_element.code_address_name_3 = "";
            $scope.new_element.code_address_4 = "";
            $scope.new_element.code_address_name_4 = "";
            $scope.is_create = !$scope.is_create;
        };

        $scope.cancelForm = function () {
            $scope.new_element.name = "";
            $scope.new_element.title = "";
            $scope.new_element.cnName = "";
            $scope.new_element.enName = "";
            $scope.new_element.email = "";
            $scope.new_element.contact = "";
            $scope.new_element.desc = "";
            $scope.new_element.code = "";
            $scope.new_element.poi = "";
            $scope.new_element.address = "";
            $scope.new_element.code_name = "";
            $scope.new_element.code_ad = "";
            $scope.new_element.code_ad_name = "";
            $scope.new_element.code_scale = "";
            $scope.new_element.code_scale_name = "";
            $scope.new_element.code_address = "";
            $scope.new_element.code_address_1 = "";
            $scope.new_element.code_address_name_1 = "";
            $scope.new_element.code_address_2 = "";
            $scope.new_element.code_address_name_2 = "";
            $scope.new_element.code_address_3 = "";
            $scope.new_element.code_address_name_3 = "";
            $scope.new_element.code_address_4 = "";
            $scope.new_element.code_address_name_4 = "";
            $scope.is_create = false;
        };

        $scope.save = function () {
            if (!$scope.new_element.title) {
                kzi.msg.error("请输入机构名称！", function () {
                });
            }
            else if (!$scope.new_element.code) {
                kzi.msg.error("请选择机构分类！", function () {
                });
            }
            else {
                $scope.new_element.cnName = $scope.new_element.title;
                //$scope.new_element.desc = MdParse($scope.new_element.desc);
                if (!_.isEmpty($scope.new_element.code_address_4)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_4;
                } else if (!_.isEmpty($scope.new_element.code_address_3)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_3;
                } else if (!_.isEmpty($scope.new_element.code_address_2)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_2;
                } else if (!_.isEmpty($scope.new_element.code_address_1)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_1;
                }
                $scope.is_saving = true;
                wt.data.organizer.create($scope.new_element, function () {
                        kzi.msg.success("机构保存成功！", function () {
                        });
                        $scope.isDESC = 1;
                        $scope.queryCondition.isDESC = $scope.isDESC;
                        $scope.cancelForm();
                        $rootScope.reload_organizers();
                        get_page($scope.queryCondition);
                    },
                    function () {
                        kzi.msg.error("机构保存失败！", function () {
                        });
                    },
                    function () {
                        $scope.is_saving = false;
                    });
            }
        };

        //修改机构事件
        $scope.$on(kzi.constant.event_names.on_organizer_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, {organizer_id: i.organizer_id});
                _.extend(n, i);
            }
        });

        //删除机构事件
        $scope.$on(kzi.constant.event_names.on_organizer_trash, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, i);
                n && ($scope.items = _.without($scope.items, n));
            }
            ;
        });

        //删除评论事件
        $scope.$on(kzi.constant.event_names.on_organizer_comment_del, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, {organizer_id: i});
                n && n.comment_count--;
            }
            ;
        });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_organizer_comment, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, i);
                n && n.comment_count++;
            }
            ;
        });

        /**
         接受发布机构的广播
         */
        $scope.$on(kzi.constant.event_names.on_organizer_publish, function (e, i) {
            if (!_.isEmpty(i)) {
                var entity = _.findWhere($scope.items, {eid: i});
                entity.status = 1;
            }
        });

        $scope.$watch("current_type", function(newV) {
            if(newV && newV.code == 'ad_mobile_organizerhot') {
                $scope.todo_sort_options.disabled = false;
            } else {
                $scope.todo_sort_options.disabled = true;
            }
        })

        $scope.todo_sort_options = {
            placeholder: "todo-placeholder",
            helper: "clone",
            scroll: true,
            revert: 10,
            dropOnEmpty: !0,
            tolerance: "pointer",
            distance: "4",
            delay: "75",
            disabled: true, //dsiabled when default
            start: function (e, t) {
                $(".todo-placeholder").css({
                    height: t.item.outerHeight() + 10,
                    width: t.item.css("width")
                })
            },
            stop: function (t, i) {
                var eid = i.item.attr("todo-id"),
                    a = _.findWhere($scope.items, {
                        eid: eid
                    }),
                    s = i.item.next().attr("todo-id"),
                    o = i.item.prev().attr("todo-id"),
                    final_position = 0;
                if (_.isEmpty(s)) {
                    var c = _.findWhere($scope.items, {
                        eid: o
                    });
                    final_position = c.position / 2 + 1
                } else if (_.isEmpty(o)) {
                    var u = _.findWhere($scope.items, {
                        eid: s
                    });
                    final_position = u.position + kzi.config.default_pos + 1
                } else {
                    var c = _.findWhere($scope.items, {
                            eid: o
                        }),
                        u = _.findWhere($scope.items, {
                            eid: s
                        });
                    final_position = (c.position + u.position) / 2 + 1
                }
                if (a.position !== final_position) {
                    a.position = final_position;
                    wt.data.organizer.update_position(a.eid, final_position, function () {
                        resort();
                    });
                }
                function resort() {
                    if (!_.isEmpty($scope.items)) {
                        $scope.items = _.chain($scope.items)
                            .sortBy(function (item) {
                                return item.position;
                            }).reduceRight(function (acc, item) {
                                acc.push(item);
                                return acc;
                            }, []).value();
                    }

                }
            }
        }
    }]);