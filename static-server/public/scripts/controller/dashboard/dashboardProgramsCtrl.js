'use strict';
innerApp.controller('programs_ctrl', ["$http", "$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location",
    function ($http, $rootScope, $scope, $routeParams, $popbox, $timeout, $location) {
        //初始化数据
        var init = function () {
            $rootScope.global.title = "活动管理";
            $rootScope.global.loading_done = false;

            //获取类别
            $http.get('/api/codes/program_type/all').success(function (response) {
                response.data.push({code: 'ad_mobile_homeplay', cnName: 'banner位'});
                $scope.types = response.data;
            });

            $scope.currentPage = 1;
            $scope.itemsPerPage = 20;
            $scope.totalItems = 0;
            $scope.isDESC = true;

            $scope.defaultType = {cnName: '全部', code: 'program_type_activity'};
            $scope.type = {cnName: '全部', code: '0'};
            $scope.current_type = $scope.defaultType;

            //查询参数集
            $scope.queryCondition = {
                code: $scope.defaultType.code,
                page: $scope.currentPage,
                sortKey: 'create_date',
                isDESC: $scope.isDESC,//排序方式，默认按降序排序
                size: 20,
                keywords: "",
                status: -1,
                statusPositive: false,
                userOrderDays: 10,
                expiredStatus: "all",
                orderStatus: "all",
                queryType: "cms"
            };

            $scope.view_program_index = 0;
            $scope.view_program_condition =
                [
                    {name: "活动类型", value: "program_type"}
                    , {name: "活动主题", value: "program"}
                    , {name: "活动地区", value: "address"}
                    , {name: "活动目录", value: "category"}
                    , {name: "适宜年龄", value: "age"}
                ];
            $scope.view_program_status = [
                {name: "回收站", value: "-1"},
                {name: "待审核", value: "0"},
                {name: "已公开", value: "1"}
            ];

            $scope.switch_view_program_condition = function (index) {
                if ($scope.view_program_index != index) {
                    $scope.view_program_index = index;
                    $http.get('/api/codes/' + $scope.view_program_condition[$scope.view_program_index].value + '/all').success(function (response) {
                        $scope.types = response.data;
                    });
                }
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
                date_list: [],
                name: '',
                title: '',
                url: '',
                pid: '',
                project_name: '',
                organizer_id: '',
                organizer_name: '',
                imageUrl: '',
                status: 0,
                code_age: '',
                code_ad: '',
                code_address: '',
                code_type: '',
                code_program_type: '',
                code_program_type_name: '',
                code_stay: '',
                code_category: '',
                code_group: '',
                code_organizer: '',
                type: 0,
                code_age_name: '',
                code_ad_name: '',
                code_address_1: '',
                code_address_name_1: '',
                code_address_2: '',
                code_address_name_2: '',
                code_address_3: '',
                code_address_name_3: '',
                code_address_4: '',
                code_address_name_4: '',
                code_type_name: '',
                code_stay_name: '',
                code_category_name: '',
                code_group_name: '',
                desc: ''
            };

        };

        init();

        //按类型分类选择
        $scope.selectByType = function (type) {
            $scope.current_type = type;
            $scope.queryCondition.sortKey = type.code === 'ad_mobile_homeplay' ? 'position' : 'create_date';
            $scope.queryCondition.code = type.code;
        };

        function mergeCondition (dst, src /* Not Null*/) {
            var duplicate = _.clone(dst);

            /**
             * 按过期未过去筛选
             * all, expired, unexpired
             */
            if(src.keywords != duplicate.keywords) {
                duplicate.keywords = src.keywords;
            }

            if (src.expired_status == "all") {
                duplicate.expiredStatus = "all";
            } else {
                duplicate.expiredStatus = src.expired_status;
            }
            /**
             * 全部，回收站，审核，发布 的参数设置
             * all, -1, 0, 1
             */
            if( src.status == "all") {
                duplicate.status = -1;
                duplicate.statusPositive = false;
            } else {
                duplicate.status = src.status;
                duplicate.statusPositive = true;
            }
            /**
             * 是否有人预约
             * all, ordered, unordered
             */
            if(src.order_status == "all") {
                duplicate.orderStatus = "all";
            } else {
                duplicate.orderStatus = src.order_status;
            }

            return duplicate;
        }

        /**
         * this event comes from the right slide
         * Handle Function :: event , argsObj -> ()
         * where argsObj
         *          = {
                        texts: "",
                        labels: [],
                        zoneCode:"",
                        countryCode:"",
                        date: "", //这里时间是多长时间内有人预约的课程
                        expired_status: "all", // all, expired, unexpired
                        status: "all", // all, -1, 0, 1
                        order_status: "all" // all, ordered, unordered
                    };
         **/
        $scope.$on(kzi.constant.event_names.on_project_tasks_filter,
            function(event,project_tasks_filter){
                if(project_tasks_filter != null) {
                    $scope.queryCondition = mergeCondition($scope.queryCondition,project_tasks_filter);
                    //get_page($scope.queryCondition);
                }
            }
        );


        $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
            $scope.items = _.filter($scope.items, function (e) {
                return e.id != p.id;
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
            wt.data.program.get_all_page(
                queryCondition,
                function (response) {
                    _.forEach(response.data, function (item) {
                        item.position = item.position || 0;
                    });
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
            $scope.new_element.date_list = [];
            $scope.new_element.name = "";
            $scope.new_element.title = "";
            $scope.new_element.url = "";
            $scope.new_element.imageUrl = "";
            $scope.new_element.status = 0;
            $scope.new_element.type = 0;
            $scope.new_element.desc = "";
            $scope.new_element.pid = "";
            $scope.new_element.project_name = "";
            $scope.new_element.organizer_id = "";
            $scope.new_element.organizer_name = "";
            $scope.new_element.code_type = "";
            $scope.new_element.code_program_type = "";
            $scope.new_element.code_program_type_name = "";
            $scope.new_element.code_age = "";
            $scope.new_element.code_ad = "";
            $scope.new_element.code_address = "";
            $scope.new_element.code_stay = "";
            $scope.new_element.code_category = "";
            $scope.new_element.code_group = "";
            $scope.new_element.code_organizer = "";
            $scope.new_element.code_address_1 = "";
            $scope.new_element.code_address_name_1 = "";
            $scope.new_element.code_address_2 = "";
            $scope.new_element.code_address_name_2 = "";
            $scope.new_element.code_address_3 = "";
            $scope.new_element.code_address_name_3 = "";
            $scope.new_element.code_address_4 = "";
            $scope.new_element.code_address_name_4 = "";

            $scope.new_element.code_type_name = "";
            $scope.new_element.code_age_name = "";
            $scope.new_element.code_ad_name = "";
            $scope.new_element.code_address_name = "";
            $scope.new_element.code_stay_name = "";
            $scope.new_element.code_category_name = "";
            $scope.new_element.code_group_name = "";
            $scope.new_element.code_organizer_name = "";
            $scope.is_create = !$scope.is_create;
        };

        $scope.cancelForm = function () {
            $scope.new_element.maxAge = 0;
            $scope.new_element.minAge = 0;
            $scope.new_element.date_list = [];
            $scope.new_element.name = "";
            $scope.new_element.title = "";
            $scope.new_element.url = "";
            $scope.new_element.imageUrl = "";
            $scope.new_element.status = 0;
            $scope.new_element.type = 0;
            $scope.new_element.desc = "";
            $scope.new_element.pid = "";
            $scope.new_element.project_name = "";
            $scope.new_element.organizer_id = "";
            $scope.new_element.organizer_name = "";
            $scope.new_element.code_type = "";
            $scope.new_element.code_program_type = "";
            $scope.new_element.code_program_type_name = "";
            $scope.new_element.code_age = "";
            $scope.new_element.code_ad = "";
            $scope.new_element.code_address = "";
            $scope.new_element.code_address_1 = "";
            $scope.new_element.code_address_name_1 = "";
            $scope.new_element.code_address_2 = "";
            $scope.new_element.code_address_name_2 = "";
            $scope.new_element.code_address_3 = "";
            $scope.new_element.code_address_name_3 = "";
            $scope.new_element.code_address_4 = "";
            $scope.new_element.code_address_name_4 = "";
            $scope.new_element.code_stay = "";
            $scope.new_element.code_category = "";
            $scope.new_element.code_group = "";
            $scope.new_element.code_organizer = "";
            $scope.new_element.code_type_name = "";
            $scope.new_element.code_age_name = "";
            $scope.new_element.code_ad_name = "";
            $scope.new_element.code_address_name = "";
            $scope.new_element.code_stay_name = "";
            $scope.new_element.code_category_name = "";
            $scope.new_element.code_group_name = "";
            $scope.new_element.code_organizer_name = "";
            $scope.is_create = false;
        };

        function Checker(/*funcs*/) {
            var args = _.toArray(arguments);
            return function (state) {
                return _.reduce(args, function (acc, func) {
                    return acc && func.call(null, state);
                }, true);
            }
        }

        function isNumber(mayBeNotNumber) {
            return !_.isNaN(mayBeNotNumber * 1);
        }


        $scope.save = function () {
            if (!$scope.new_element.title) {
                kzi.msg.error("请输入活动名称！", function () {
                });
            }
            else {
                if (!_.isEmpty($scope.new_element.code_address_4)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_4;
                } else if (!_.isEmpty($scope.new_element.code_address_3)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_3;
                } else if (!_.isEmpty($scope.new_element.code_address_2)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_2;
                } else if (!_.isEmpty($scope.new_element.code_address_1)) {
                    $scope.new_element.code_address = $scope.new_element.code_address_1;
                }
                /**
                 * true: 未通过
                 * false: 通过验证
                 */
                var addProgramCheck = Checker(function (state) {
                        var ret = state.code_program_type === "program_type_lesson" && _.isEmpty(state.date_list);
                        state.crt_status = ret;
                        return ret;
                    }, function (state) {
                        var ret = state.crt_status;
                        ret && kzi.msg.warn("新建课程时必须设置起止时间！");
                        return true;
                    },
                    function (state) {
                        var ret = (state.maxAge && !isNumber(state.maxAge) ) || ( state.minAge && !isNumber(state.minAge) );
                        state.crt_status = ret;
                        return ret;
                    },
                    function (state) {
                        state.crt_status && kzi.msg.warn("所填年龄必须为数字!");
                        return true;
                    },
                    function (state) {
                        var ret = state.maxAge && state.minAge && state.maxAge * 1 < state.minAge * 1;
                        state.crt_status = ret;
                        return ret;
                    }, function (state) {
                        var ret = state.crt_status;
                        ret && kzi.msg.warn("最大年龄必须大于等于最小年龄");
                        return true;
                    });
                if (addProgramCheck(_.clone($scope.new_element))) {
                    return undefined;
                } else {
                    $scope.is_saving = true;
                    wt.data.program.create($scope.new_element, $scope.new_element.pid, function () {
                            kzi.msg.success("活动保存成功！", function () {
                            });
                            $scope.isDESC = 1;
                            $scope.queryCondition.isDESC = $scope.isDESC;
                            $scope.cancelForm();
                            get_page($scope.queryCondition);
                        },
                        function () {
                            kzi.msg.error("活动保存失败！", function () {
                            });
                        },
                        function () {
                            $scope.is_saving = false;
                        }
                    );
                }
            }
        };

        //更新活动事件
        $scope.$on(kzi.constant.event_names.on_program_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, {eid: i.eid});
                _.extend(n, i);
            }
        });

        //删除活动事件
        $scope.$on(kzi.constant.event_names.on_program_trash, function (e, i) {
            if (!_.isEmpty(i)) {
                $scope.items = _.filter($scope.items, function (item) {
                    return item.eid != i.eid;
                });
            }
        });

        $scope.$on(kzi.constant.event_names.on_program_trash_group, function (e, i) {
            if (!_.isEmpty(i)) {
                $scope.items = _.filter($scope.items, function (item) {
                    return item.groupId != i.groupId;
                });
            }
        })

        //删除评论事件
        $scope.$on(kzi.constant.event_names.on_program_comment_del, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, {program_id: i});
                n && n.comment_count--;
            }
            ;
        });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_program_comment, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, i);
                n && n.comment_count++;
            }
            ;
        });

        //发布活动事件
        $scope.$on(kzi.constant.event_names.on_program_publish, function (e, i) {
            if (!_.isEmpty(i)) {
               var n = _.findWhere($scope.items, {eid: i});
                n.status = 1;
            }
        });

        function extendProgramForm(programForm, newProgram) {
            var tags = newProgram.tags || [];

            function extendProgramTypeTag(programForm) {
                var programTypeTag = _.findWhere(tags, {type: kzi.constant.tag_type.program_type});
                programForm.code_program_type = programTypeTag.tag_id;
            }

            function extendAddressTag(programForm) {
                var addressTags = _.filter(tags, function (tag) { return tag.type == kzi.constant.tag_type.address});
                var parentTag = _.findWhere(addressTags, {parent: -1}) || "";

                function findChild(parent) {
                    return _.findWhere(addressTags, {parent: parent.tag_id}) || "";
                }

                function findFinalChild(parent) {
                    var children = findChild(parent);
                    while (children) {
                        children = findChild(children);
                    }
                    return children;
                }

                programForm.code_address = _.isEmpty(parentTag) ? "" : findFinalChild(parentTag) ;
                programForm.code_address_1 = _.isEmpty(parentTag) ? "" : parentTag.tag_id;
                programForm.code_address_name_1 = _.isEmpty(parentTag) ? "" : parentTag.name;
            }

            extendAddressTag(programForm);
            extendProgramTypeTag(programForm);

        }



        function show_editor_with_program (program) {
            $scope.is_create = !$scope.is_create;
            _.extend($scope.new_element, program);
            extendProgramForm($scope.new_element, program);
            $scope.new_element.status = 0;
            return ;
            $scope.new_element.date_list = [];
            $scope.new_element.name = "";
            $scope.new_element.title = "";
            $scope.new_element.url = "";
            $scope.new_element.imageUrl = "";
            $scope.new_element.status = 0;
            $scope.new_element.type = 0;
            $scope.new_element.desc = "";
            $scope.new_element.pid = "";
            $scope.new_element.project_name = "";
            $scope.new_element.organizer_id = "";
            $scope.new_element.organizer_name = "";
            $scope.new_element.code_type = "";
            $scope.new_element.code_program_type = "";
            $scope.new_element.code_program_type_name = "";
            $scope.new_element.code_age = "";
            $scope.new_element.code_ad = "";
            $scope.new_element.code_address = "";
            $scope.new_element.code_stay = "";
            $scope.new_element.code_category = "";
            $scope.new_element.code_group = "";
            $scope.new_element.code_organizer = "";
            $scope.new_element.code_address_1 = "";
            $scope.new_element.code_address_name_1 = "";
            $scope.new_element.code_address_2 = "";
            $scope.new_element.code_address_name_2 = "";
            $scope.new_element.code_address_3 = "";
            $scope.new_element.code_address_name_3 = "";
            $scope.new_element.code_address_4 = "";
            $scope.new_element.code_address_name_4 = "";

            $scope.new_element.code_type_name = "";
            $scope.new_element.code_age_name = "";
            $scope.new_element.code_ad_name = "";
            $scope.new_element.code_address_name = "";
            $scope.new_element.code_stay_name = "";
            $scope.new_element.code_category_name = "";
            $scope.new_element.code_group_name = "";
            $scope.new_element.code_organizer_name = "";
            $scope.is_create = !$scope.is_create;
        }

        $scope.$on(kzi.constant.event_names.on_program_add_with_old, function (e, i) {
            show_editor_with_program(i);
        });

        $scope.$watch("current_type", function(newV) {
            if(newV && newV.code == kzi.constant.ad_tag_enums.AD_MOBILE_HOMEPLAY) {
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
                    wt.data.task.update_position(a.eid, a, function () {
                        resort();
                    });
                }
                function resort() {
                    if (!_.isEmpty($scope.items)) {
                        $scope.items = _.chain($scope.items)
                            .sortBy(function (item) {
                                return item.position;
                            })
                            .reduceRight(function (acc, item) {
                                acc.push(item);
                                return acc;
                            }, []).value();
                    }

                }
            }
        }
    }]);