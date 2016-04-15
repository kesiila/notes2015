'use strict';
innerApp.controller('videos_ctrl', ["$http", "$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location",
    function ($http, $rootScope, $scope, $routeParams, $popbox, $timeout, $location) {
        //初始化数据
        var init = function () {
            $rootScope.global.title = "视频管理";
            $rootScope.global.loading_done = false;

            // 获取类别
            $scope.static_tabs = [
                {format: '', name: '全部'},
                {format: 'VIDEO', name: '视频'},
                {format: 'AUDIO', name: '音频'}
            ];

            $scope.static_formats = [
                {value: 'VIDEO', name: '视频'},
                {value: 'AUDIO', name: '音频'}
            ];

            $scope.currentPage = 1;
            $scope.itemsPerPage = 20;
            $scope.totalItems = 0;
            $scope.DESC = true;

            $scope.default_tab = $scope.static_tabs[0];
            $scope.current_tab = $scope.default_tab;

            //查询参数集
            $scope.queryCondition = {
                format: $scope.default_tab.format,
                page: $scope.currentPage,
                sortKey: 'create_date',
                DESC: $scope.DESC,//排序方式，默认按降序排序
                size: 20,
                status: -1,
                statusPositive: false
            };

            // 隐藏和显示添加界面
            $scope.is_create = false;

            $scope.new_element = {
                title: '',
                profile: '',
                content: '',
                authorName: '',
                link: '',
                format: '',
                image: ''
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
        };

        init();

        // Tab切换
        $scope.selectByTab = function (tab) {
            $scope.current_tab = tab;
            $scope.queryCondition.format = tab.format;
        };

        //切换排序顺序
        $scope.sort = function () {
            $scope.DESC = !$scope.DESC;
            $scope.queryCondition.DESC = $scope.DESC;
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
            wt.data.video.get_all_page(
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
        };

        // 打开新建表单
        $scope.show_add_form = function () {
            $scope.new_element.title = "";
            $scope.new_element.content = "";
            $scope.new_element.profile = "";
            $scope.new_element.authorName = "";
            $scope.new_element.link = "";
            $scope.new_element.format = "";
            $scope.new_element.image = "";
            $scope.is_create = !$scope.is_create;
        };

        // 关闭新建表单
        $scope.cancelForm = function () {
            $scope.new_element.title = "";
            $scope.new_element.content = "";
            $scope.new_element.profile = "";
            $scope.new_element.authorName = "";
            $scope.new_element.link = "";
            $scope.new_element.format = "";
            $scope.new_element.image = "";
            $scope.is_create = false;
        };

        function isValidated(video) {
            return video.title || video.content || video.profile || video.authorName || video.link || video.format;
        }

        $scope.save = function () {
            if (!isValidated($scope.new_element)) {
                kzi.msg.warn("标题、作者、格式、内容、作者简介、链接均不能为空！", function () {
                });
            } else {
                wt.data.video.create($scope.new_element, function () {
                        $scope.is_saving = true;
                        $scope.DESC = 1;
                        $scope.queryCondition.DESC = $scope.DESC;
                        $scope.cancelForm();
                        get_page($scope.queryCondition);
                    },
                    function () {
                        kzi.msg.error("视频保存失败！", function () {
                        });
                    },
                    function () {
                        kzi.msg.success("视频保存成功！", function () {
                        });
                        $scope.is_saving = false;
                    }
                );
            }
        };
    }]);
