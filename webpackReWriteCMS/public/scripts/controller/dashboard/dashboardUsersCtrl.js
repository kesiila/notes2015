'use strict';
innerApp.controller('users_ctrl', ["$http", "$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location",
    function ($http, $rootScope, $scope, $routeParams, $popbox, $timeout, $location) {
        //初始化数据
        var init = function () {
            $rootScope.global.title = "用户管理";
            $rootScope.global.loading_done = false;
            //获取类别
            $http.get('/api/codes/user/all').success(function (response) {
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
                orderKey: 'create_date',
                isDESC: $scope.isDESC,//排序方式，默认按降序排序
                //status: -1,
                //statusPositive: false,
                size: 20
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
                display_name: '',
                mobile: '',
                email: '',
                password: '',
                status : 1,
                avatar: '',
                code: '',
                typeName: '',
                desc: '',
                organizer_id: ''
            };
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

            $rootScope.load_organizers();
        };

        init();

        //按类型分类选择
        $scope.selectByType = function (type) {
            $scope.current_type = type;
            $scope.queryCondition.code = type.code;
        };


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
            wt.data.user.get_all_page(
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
            $scope.new_element.mobile = "";
            $scope.new_element.email = "";
            $scope.new_element.password = "";
            $scope.new_element.display_name= '',
            $scope.new_element.avatar = "";
            $scope.new_element.desc = "";
            $scope.new_element.code = "";
            $scope.new_element.typeName = "";
            $scope.new_element.organizer_id = "";
            $scope.is_create = !$scope.is_create;
        };


        $scope.cancelForm = function () {
            $scope.new_element.name = "";
            $scope.new_element.mobile = "";
            $scope.new_element.email = "";
            $scope.new_element.display_name= '',
            $scope.new_element.password = "";
            $scope.new_element.avatar = "";
            $scope.new_element.desc = "";
            $scope.new_element.code = "";
            $scope.is_create = false;
            $scope.new_element.organizer_id = "";
            $scope.new_element.typeName = "";
        };

        function isValidatedInput(inputJson) {
            /**
             * 用户名不能为空
             */
            if (_.isEmpty(inputJson.name)) {
                kzi.msg.error("缺少必要的用户名称", function () {
                });
                return false;
            }
            /**
             * 密码不能为空
             */
            if (_.isEmpty(inputJson.password)) {
                kzi.msg.error("密码不能为空", function () {
                });
                return false;
            }
            /**
             * 密码至少6位
             */
            if(_.size(inputJson.password) < 6) {
                kzi.msg.error("密码至少为6位", function () {})
                return false;
            }
            /**
             * 缺少用户类型
             */
            if (_.isEmpty(inputJson.code)) {
                kzi.msg.error("必须选择一个用户类型", function () {
                });
                return false;
            }
            /**
             * 缺少机构名称
             */
            if (_.isEqual(inputJson.code, "user_official") && _.isEmpty(inputJson.organizer_id)) {
                kzi.msg.error("设置为机构用户时缺少机构名称~", function () {
                })
                return false;
            }
            return true;
        }

        /**
         * 修正传入对象的状态
         * @param inputJson
         */
        function fixInputJson(inputJson) {
            /**
             * 未选择机构用户，同时具有机构id时，将机构id设置为空字符串
             */
            if (!_.isEqual(inputJson.code, "user_official") && !_.isEmpty(inputJson.organizer_id)) {
              inputJson.organizer_id = "";
            }
        }

        $scope.save = function () {
            if (isValidatedInput($scope.new_element)) {
                fixInputJson($scope.new_element);
                wt.data.user.create($scope.new_element, function () {
                        $scope.is_saving = true;
                        kzi.msg.success("用户保存成功！", function () {
                        });
                        $scope.cancelForm();
                        get_page($scope.queryCondition);
                    },
                    function () {
                        kzi.msg.error("用户保存失败！", function () {
                        });
                    },
                    function () {
                        $scope.is_saving = false;
                    });
            }
        };

        //修改用户事件
        $scope.$on(kzi.constant.event_names.on_user_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, {user_id: i.user_id});
                n && (n.name = i.name, n.typeName = i.s_typeName, n.summary = kzi.helper.substr(i.content, 60));
            }
        });

        //删除用户事件
        $scope.$on(kzi.constant.event_names.on_user_trash, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, i);
                n && ($scope.items = _.without($scope.items, n));
            }
            ;
        });

        //删除评论事件
        $scope.$on(kzi.constant.event_names.on_user_comment_del, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, {user_id: i});
                n && n.comment_count--;
            }
        });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_user_comment, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, i);
                n && n.comment_count++;
            }
        });

    }]);