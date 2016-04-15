'use strict';
innerApp.controller('template_ctrl', ["$http", "$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location", "$modal", "templateNewGeneratorInfo", "$window", "projectsInfo",
    function ($http, $rootScope, $scope, $routeParams, $popbox, $timeout, $location, $modal, templateGeneratorInfo, $window, projectsInfo) {
        $rootScope.global.title = "我的模板";

        $rootScope.global.loading_done = true;//不显示正在加载

        var o = $routeParams.pid, l = "last_reply_date";

        var u = $rootScope.global.me;

        //获取模板类别
        $http.get('/json/templateCatalog.json').success(function (response) {
            $scope.catalogs = response.data;
        });
        //获取模板类别结束

        //根据模板内容分类筛选模板部分
        $scope.tab0 = {"code": "0", "cnName": "全部"};//默认显示全部类别

        $scope.current_tab = $scope.tab0;//默认显示全部类别

        $scope.chooseTempByContentType = function (e) {
            if ($scope.current_tab != e) {
                $scope.current_tab = e;
                $scope.queryCondition.code = e.code;
            }
            ;
        };

        $scope.isDESC = "1";
        //根据模板内容分类筛选模板部分结束

        //点击发布后已发布的模板id数组
        $scope.published_array_sync = [];
        u.watched = !0, $rootScope.global.loading_done = !0, $scope.edit_template = {
            name: "",
            summary: "",
            content: "",
            watchers: [u]
        };


        //视图切换
        var type1 = kzi.localData.get('template_list_type');
        $scope.industry_view_type = type1 ? type1 : 'orginal';

        var type = kzi.localData.get('project_list_type');
        $scope.list_grid_type = type ? type : 'list';
        $scope.js_view_toggle = function (list_grid, industry_view) {
            if (list_grid) {
                $scope.list_grid_type = list_grid;
                kzi.localData.set('project_list_type', list_grid);
            }
            if (industry_view) {
                //按行业分类展示 和 按原始分类 切换后，重置条件
                $scope.tabSwitch(0);
                $scope.industry_view_type = industry_view;
                kzi.localData.set('template_list_type', industry_view);
            }
        };

//        $scope.list_grid_type = '1';
//
//        $scope.js_view_toggle = function ()
//        {
//            $scope.list_grid_type=!$scope.list_grid_type;
//        };


        $scope.js_show_add_template = function () {
            $location.url('/templates/add"');
            false && ($scope.show_add_template = !$scope.show_add_template);
        };

        $scope.js_cancel_edit_template = function () {
            $scope.show_add_template = !1,
                $scope.edit_template.name = "",
                $scope.edit_template.summary = "",
                $scope.edit_template.mainCatalogCode = "",
                $scope.edit_template.mainCatalogCnName = "",
                $scope.edit_template.subCatalogCode = "",
                $scope.edit_template.subCatalogCnName = "",
                $scope.edit_template.content = "",
                $scope.edit_template.watchers = [u]
        };


        $scope.js_toggle_member = function (e) {
            wt.bus.template.toggle_watcher_member(e, $scope.edit_template, o)
        };

        $scope.edit_template.f_type = '01';

        $scope.js_save_template = function (catalog, thenFn, setAsDefaultAndThen) {
            if (_.isEmpty($scope.edit_template.name)) {
                kzi.msg.error("请输入模板名称");
            }
            else if (_.isEmpty($scope.edit_template.summary)) {
                kzi.msg.error("请输入模板标题");
            }
            else if (_.isEmpty($scope.edit_template.content)) {
                kzi.msg.error("请输入模板内容");
            }
            else {
                $scope.is_saving = !0;
                var n = _.pluck($scope.edit_template.watchers, "uid");
                var pid = $routeParams.pid || projectsInfo.defaultPid;
                $scope.edit_template.mainCatalogCode = catalog.code;
                $scope.edit_template.mainCatalogCnName = catalog.cnName;
                wt.data.template.add(pid, $scope.edit_template.f_type, $scope.edit_template.name, $scope.edit_template.mainCatalogCode, $scope.edit_template.mainCatalogCnName, $scope.edit_template.subCatalogCode, $scope.edit_template.subCatalogCnName, $scope.edit_template.summary, $scope.edit_template.content, n,
                    function (i) {
                        $scope.templates.unshift(i.data);
                        $scope.edit_template.content = i.data.content;
                        $scope.rtnTemplate = i.data;
                        angular.isFunction(thenFn) && thenFn.call();
                        angular.isFunction(setAsDefaultAndThen) && setAsDefaultAndThen.call(null, $scope.rtnTemplate);
                    }, null, function () {
                        $scope.is_saving = !1;
                        $scope.js_cancel_edit_template();
                        $scope.newTemplate.wantToShare && wt.data.template.share(null, $scope.rtnTemplate.template_id, "");
                        /*  $scope.tabSwitch(1); */
                    });
            }
        };

        $scope.js_show_template_menu = function (i, a, s, r) {
            i.stopPropagation(), $popbox.popbox({
                target: i,
                top: s,
                left: r,
                templateUrl: "/view/project/template/pop_template_action.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (t, i, n) {
                        t.popbox = i, t.step = 0, t.js_step = function (e) {
                            t.step = e
                        }, t.edit_template = a, $rootScope.load_project_members(o, function (e) {
                            wt.bus.template.set_scope_watcher_members(t, e.members, a.watchers)
                        }), t.js_delete_template = function (e) {
                            t.is_deleting = !0, wt.data.template.trash(o, e.template_id, function () {
                                t.is_deleting = !1, t.js_close(), n.scope.templates = _.reject(n.scope.templates, function (t) {
                                    return t.template_id === e.template_id
                                })
                            })
                        }, t.js_toggle_member = function (e) {
                            wt.bus.template.toggle_watcher_member(e, a, o)
                        }, t.js_watch_all = function (e) {
                            wt.bus.template.watch_all_members(t.members, e, o, function () {
                            }, null, function () {
                                t.js_close()
                            })
                        }, t.js_close = function () {
                            i.close()
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
            }).open()
        }, $scope.js_add_template_watchers_pop = function (i, a) {
            $popbox.popbox({
                target: i,
                templateUrl: "/view/project/template/pop_edit_template_watchers.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (t, i) {
                        t.popbox = i, t.edit_template = a, $rootScope.load_project_members(o, function (e) {
                            wt.bus.template.set_scope_watcher_members(t, e.members, a.watchers)
                        }), t.js_toggle_member = function (e) {
                            wt.bus.template.toggle_watcher_member(e, a, o)
                        }, t.js_watch_all = function (e) {
                            wt.bus.template.watch_all_members(t.members, e, o, function () {
                            }, null, function () {
                            })
                        }, t.js_close = function () {
                            i.close()
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
            }).open()
        }, $scope.js_show_more_menu = function (i) {
            $popbox.popbox({
                target: i,
                templateUrl: "/view/project/template/pop_templates_more_menu.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (t, i) {
                        t.popbox = i, t.email = o + kzi.constant.mail.domain, t.step = 0, t.js_step = function (e) {
                            t.step = e
                        }, t.js_close = function () {
                            i.close()
                        }, t.selected_filter = null, t.filter_items = [
                            {
                                name: "按回复时间",
                                value: "last_reply_date",
                                is_selected: !1
                            },
                            {
                                name: "按分享时间",
                                value: "publish_date",
                                is_selected: !1
                            }
                        ], "last_reply_date" === l ? (t.filter_items[0].is_selected = !0, t.selected_filter = t.filter_items[0]) : (t.filter_items[1].is_selected = !0, t.selected_filter = t.filter_items[1]), t.js_select_filter = function (i) {
                            t.selected_filter.is_selected = !1, i.is_selected = !0, t.selected_filter = i, t.js_close(), $rootScope.$broadcast(kzi.constant.event_names.filter_templates_by_sort, i.value)
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
            }).open()
        }, $scope.js_slide_change = function (e) {
            e ? $scope.show_add_template_empty = !!e : $timeout(function () {
                $scope.show_add_template_empty = !!e
            }, 400)
        }, $scope.$on(kzi.constant.event_names.on_template_trash, function (e, i) {
            _.isEmpty(i) || ($scope.templates = _.reject($scope.templates, function (e) {
                return e.template_id === i.template_id
            }))
        }), $scope.$on(kzi.constant.event_names.on_template_share, function (e, i) {
            if (i && $scope.templates) {
                _.each($scope.templates, function (temp) {
                    if (temp.template_id == i) {
                        temp.is_published = "1";
                    }
                })
            }
            ;

            if ($scope.type == 1) {
                $scope.templates = _.reject($scope.templates, function (temp) {
                    return temp.template_id == i;
                })
            }
        }),

            //删除评论事件
            $scope.$on(kzi.constant.event_names.comment_del, function (e, i) {
                if (!_.isEmpty(i)) {
                    var n = _.findWhere($scope.templates, {objectId: i});
                    n && (n.comment_count--);
                }
                ;
            });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_template_comment, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.templates, {objectId: i.template_id});
                n && n.comment_count++;
            }
            ;
        });
        $scope.$on(kzi.constant.event_names.on_template_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.templates, {
                    template_id: i.template_id
                });
                n && (n.name = i.name,
                    n.summary = i.summary,
                    n.mainCatalogCode = i.mainCatalogCode,
                    n.mainCatalogCnName = i.mainCatalogCnName,
                    n.subCatalogCode = i.subCatalogCode,
                    n.subCatalogCnName = i.subCatalogCnName,
                    n.content = i.content)
            }
        })

        /*refactor*/
        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;
        $scope.totalItems = 0;

        $scope.queryCondition =
        {
            type: _.isEmpty($routeParams.type) ? 0 : $routeParams.type,//分享收藏分类
            page: 1,
            code: '0',//模板分类编码
            isDESC: "1",//排序方式，默认按降序排序
            orderKey: 'create_date',
            size: 20
        };
        $scope.temp_sortItems =
            [
                {name: '按创建时间', value: 'create_date', is_selected: true}
                ,
                {name: '按分享时间', value: 'publish_date', is_selected: false}
                ,
                {name: '按收藏时间', value: 'collectors.collect_date', is_selected: false}
//                ,{name: '按评论数量',value: 'comment_count',is_selected: false}
        ];

        $scope.temp_current_sortItem = $scope.temp_sortItems[0];

        $scope.type = 0;

        //0全部, 1私有,2分享,3收藏
        $scope.tabSwitch = function (type) {
            $scope.type = type;
            $scope.queryCondition.type = type;
            $scope.queryCondition.isDESC = $scope.isDESC;

            if (type == 0 || type == 1) {
                $scope.temp_current_sortItem = $scope.temp_sortItems[0];
            }
            else {
                $scope.temp_current_sortItem = $scope.temp_sortItems[type - 1];
            }

            $scope.isDESC = true;
            $scope.queryCondition.isDESC = $scope.isDESC;
        };

        //切换排序顺序
        $scope.sortTemplatesDates = function () {
            $scope.isDESC = $scope.isDESC == '1' ? '0' : '1';
            $scope.queryCondition.isDESC = $scope.isDESC;
        }


        //开发信变量设置
        $scope.newTemplate = {};
        $scope.newTemplate.tabs = {};
        $scope.newTemplate.tabs.current_tab = 'writeByMyself';
        $scope.newTemplate.changeTab = function (type) {
            $scope.newTemplate.wantToShare = false
            $scope.newTemplate.tabs.current_tab = type;
            if (type == 'writeByGenerator') {
                $scope.js_template_get_one();
            } else {
                $scope.edit_template.content = '';
            }
        };

        $scope.variables = {
            customer_now: '',
            create_time: '',
            company_name: '',
            inspection_certificate: '',
            product_certification: '',
            company_products: '',
            QS: ''
        }
        getCompanyInfo();
        function getCompanyInfo() {
            if ($rootScope.global.is_login) {
                wt.data.user.get_company_info(function (res) {
                    if (res.data) {
                        $scope.variables.customer_now = res.data.customerNow || "";
                        $scope.variables.create_time = res.data.buildDate || "";
                        $scope.variables.company_name = res.data.displayname || "";
                        $scope.variables.inspection_certificate = res.data.inspectionCertificate || "";
                        $scope.variables.product_certification = res.data.productCertification || "";
                        $scope.variables.company_products = res.data.products || "";
                        $scope.variables.QS = res.data.qualitySystem || "";
                        $scope.variables.prodcutivePower = res.data.prodcutivePower || "";
                    }
                }, function error() {

                }, function then() {
                    $rootScope.global.loading_done = true;
                    $scope.part_loading_done = true;
                })
            }
        }

        var company_info;

        function reGetBeforeSaveCompanyInfo() {
            company_info = {
                name: $scope.variables.name,
                displayname: $scope.variables.company_name,
                type: $scope.variables.type,
                size: $scope.variables.size,
                industry_1: $scope.variables.mainIndustryCode,
                industry_2: $scope.variables.subIndustryCode,
                address: $scope.variables.address,
                website: $scope.variables.website,
                description: $scope.variables.description,

                products: $scope.variables.company_products,
                buildDate: $scope.variables.create_time,
                customerNow: $scope.variables.customer_now,
                productCertification: $scope.variables.product_certification,
                qualitySystem: $scope.variables.QS,
                inspectionCertificate: $scope.variables.inspection_certificate,
                prodcutivePower: $scope.variables.prodcutivePower
            }
        }

        $scope.is_save_ing = false;
        $scope.save_company_info = function (fn) {
            if (!$scope.variables.company_name || !$scope.variables.company_products) {
                return 0;
            }
            reGetBeforeSaveCompanyInfo();
            $scope.is_save_ing = true;
            wt.data.user.save_company_info(company_info, function (res) {
                if (res.data.company) {
                    $scope.variables.customer_now = res.data.company.customerNow || "";
                    $scope.variables.create_time = res.data.company.buildDate || "";
                    $scope.variables.company_name = res.data.company.displayname || "";
                    $scope.variables.inspection_certificate = res.data.company.inspectionCertificate || "";
                    $scope.variables.product_certification = res.data.company.productCertification || "";
                    $scope.variables.company_products = res.data.company.products || "";
                    $scope.variables.QS = res.data.company.qualitySystem || "";
                    $scope.variables.prodcutivePower = res.data.company.prodcutivePower || "";
                }
            }, function () {
                debugger;
            }, function () {
                $scope.is_save_ing = false;
                angular.isFunction(fn) && fn.call();
                setContent();
            });
        }
        $scope.js_template_get_one = function () {
            reGet();
            var isCompanyInfoAllEmpty = !$scope.variables.company_products || !$scope.variables.company_name;
            if (isCompanyInfoAllEmpty) {
                $scope.edit_template.content = templateGeneratorInfo.generate()
            } else {
                setContent();
            }
        }
        function setContent() {
            reGet();
            var invalidate = _.chain(mapVO).filter(function (obj) {
                return obj.text === ''
            })
                .map(function (obj) {
                    return obj.reg
                }).value() || [];
            var str = templateGeneratorInfo.generate([], function (item) {
                return _.chain(invalidate).reduce(function (mem, reg) {
                    return mem || reg.test(item);
                }, false).value()
            });
            $scope.edit_template.content = map(str, mapVO);
        }

        var mapVO = [];

        function reGet() {
            mapVO = [
                {
                    reg: /\[公司名称\]/g,
                    text: $scope.variables.company_name
                },
                {
                    reg: /\[公司产品\]/g,
                    text: $scope.variables.company_products
                },
                {
                    reg: /\[创建时间\]/g,
                    text: $scope.variables.create_time
                },
                {
                    reg: /\[现有活动\]/g,
                    text: $scope.variables.customer_now
                },
                {
                    reg: /\[产品认证\]/g,
                    text: $scope.variables.product_certification
                },
                {
                    reg: /\[质量体系\]/g,
                    text: $scope.variables.QS
                },
                {
                    reg: /\[验厂证书\]/g,
                    text: $scope.variables.inspection_certificate
                },
                {
                    reg: /\[年生产量\]/g,
                    text: $scope.variables.prodcutivePower
                },
                {
                    reg: /\[季度产量\]/g,
                    text: $scope.variables.prodcutivePower
                },
                {
                    reg: /\[月生产量\]/g,
                    text: $scope.variables.prodcutivePower
                },
                {
                    reg: /\[发件人\]/g,
                    text: $rootScope.global.me.displayname || $rootScope.global.me.name || '[发件人]'
                }
            ]
        }

        var company_info = {

        }

        // str -> map -> str
        function mapWithVar(str, map) {
            str = str || '';
            if (map.text !== '') {
                str = str.replace(map.reg, map.text);
            }
            return str;
        }

        function transBack(str) {
            str = str || '';
            str = str.replace(/`/g, '');
            return str;
        }

        function map(str, maps) {
            for (var i = 0, l = maps.length; i < l; i++) {
                str = mapWithVar(str, maps[i]);
            }
            return str;
        }

//        $scope.setVarBtnSelected = false;
        $scope.js_set_template_variables = function () {
            getCompanyInfo();
            $modal.open({
                scope: $scope,
                templateUrl: '/view/modal/pop_template_generator_variables.html',
                controller: ['$scope', '$modalInstance', function (scope, $modalInstance) {
                    scope.outterScope = scope.$parent;
//                    scope.outterScope.setVarBtnSelected = true
                    scope.close = function () {
                        $modalInstance.close();
                        /*                        scope.outterScope.setVarBtnSelected = false;*/
                    }
                    scope.submit = function () {
                        scope.outterScope.save_company_info(scope.close);
                    }
                }]
            })
        }
        $scope.pop_save_template = function () {
            $modal.open({
                scope: $scope,
                templateUrl: '/view/modal/pop_and_complete_save_template.html',
                controller: ['$scope', '$modalInstance', function (scope, $modalInstance) {
                    scope.outterScope = scope.$parent;
                    scope.catalogs = scope.outterScope.catalogs;
                    scope.currentCatalog = scope.catalogs[0];
                    scope.modal = {
                        set_as_default: false
                    };
                    scope.close = function () {
                        $modalInstance.close();
                    }
                    scope.set_template_catalog = function (catalog) {
                        scope.currentCatalog = catalog;
                    }
                    scope.save_template = function (catalog) {
                        var set_as_default = scope.modal.set_as_default;
                        scope.outterScope.js_save_template(catalog, scope.close, function setDefaultAndThen(template) {
                            $modal.open({
                                scope: scope.outterScope,
                                templateUrl: '/view/modal/pop_and_complete_generator_end.html',
                                controller: ['$scope', '$modalInstance', '$rootScope', function (scope, $modalInstance, $rootScope) {
                                    scope.outterScope = scope.$parent;
                                    if (set_as_default == true) {
                                        scope.outterScope.js_set_as_default(template, true);
                                    }
                                    scope.close = function () {
                                        $modalInstance.close();
                                    }
                                    scope.develop_now = function () {
                                        scope.close();
                                        scope.outterScope.js_cancel_edit_template();
                                        $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, {tasks: [], template: template});
                                    }
                                }]
                            })
                        });
                    }
                }]
            })
        }

        $scope.js_set_as_default = function (template, withoutPrompt) {
            wt.data.user.update_defualt_template(template.template_id, function (res) {
                if (!withoutPrompt) {
                    kzi.msg.success("设置成功", function () {
                    });
                }
                $scope.defaultTemplate = template.template_id;
            }, function () {
            }, function () {
                $window.sessionStorage.defaultTemplate = template.template_id;
            });
        }
        //排序部分开始
//        $scope.isDESC=1;
//
//        $scope.templateSort_filterItems =
//            [
//               // {name: '按创建时间',value: 'publish_date',is_selected: true},
//                {name: '按评论数',value: 'comment_count',is_selected: false}
//            ];
//
//        var n = $scope.templateSort_filterItems[0];
//
//        $scope.sortTemplateDates=function(item)
//        {
//            if(item)
//            {
//                n.is_selected = false,
//                    item.is_selected = true,
//                    n = item;
//                $scope.queryCondition.orderKey=item.value;
//            }
//            else
//            {
//                $scope.isDESC=!$scope.isDESC;
//                $scope.queryCondition.isDESC=$scope.isDESC?'1':'0';
//            }
//            $scope.currentPage=1;
//            $scope.queryCondition.page = 1;
//        };

        //排序部分结束


        $scope.$watch('currentPage', function (currentPage) {
            $scope.pageNum = currentPage;
            $scope.queryCondition.page = currentPage;
        })

        $scope.jumpToPage = function (pageNum) {
            if (/\D/.test(pageNum)) {
                kzi.msg.error("页码格式不正确", null);
                return false;
            } else if (pageNum > $scope.numPages || pageNum < 1) {
                $scope.currentPage = 1;
                $scope.pageNum = 1;
            } else {
                $scope.currentPage = pageNum;
            }
            $scope.currentPage = pageNum;
        };

        $scope.$watch('itemsPerPage', function (itemsPerPage) {
            $scope.queryCondition.size = itemsPerPage;
        });

        $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
//                load_data($scope.queryCondition);
            $scope.templates = _.filter($scope.templates, function (e) {
                return e.objectId != p.id;
            });
            $scope.totalItems -= 1;
        }, null);

        var load_data = function (queryCondition) {
            $rootScope.global.loading_done = false;
            $scope.part_loading_done = false;
            wt.data.template.private(
                queryCondition,
                function (response) {
                    $scope.templates = response.data;
                    $scope.totalItems = response.totalItems;
                },
                function (response) {
                    kzi.msg.error("加载数据失败！");
                },
                function () {
                    $rootScope.global.loading_done = true;
                    $scope.part_loading_done = true;
                }
            )
        };

        $scope.$watch('queryCondition', function (queryCondition) {
            load_data(queryCondition);
        }, true)
    }
])

;

innerApp.controller('entity_template_ctrl', ["$scope", "$routeParams", "$rootScope", "$location", "$popbox", "$window",
    function ($scope, $routeParams, $rootScope, $location, $popbox, $window) {
        var pid, template_id;
        $scope.defaultTemplate = $window.sessionStorage.defaultTemplate || '';
        $scope.token = kzi.get_cookie("sid");

        //改变热门状态
        $scope.js_hot = function (entity) {
            if (!_.isEmpty(entity)) {
                var value = entity.isHot == 0 ? 1 : 0;

                wt.data.hot(entity.objectId, "template", value, function () {
                    kzi.msg.success("操作成功！");
                    entity.isHot = value;
                }, function () {
                    kzi.msg.error("操作失败！");
                }, function () {
                });
            }
        };

        $scope.$on(
            kzi.constant.event_names.load_entity_template,
            function (event, args) {
                if ($scope.upload_enabled = !0, !_.isEmpty(args.template_id)) {
                    template_id = args.template_id;
                    $scope.select_tab_comment();
                    $scope.section_loading_done = false;
                    wt.data.template.get(pid,
                        template_id,
                        function (response) {
                            $scope.section_loading_done = !0;
                            response.data.template_id && (
                                $scope.template = response.data,
                                    $scope.$broadcast(kzi.constant.event_names.load_comments, {
                                        pid: pid,
                                        xid: template_id,
                                        xtype: kzi.constant.xtype.template,
                                        comment_id: args.comment_id
                                    }),
                                    $rootScope.$broadcast(kzi.constant.event_names.entity_loading_done, {
                                        pid: pid,
                                        xid: template_id,
                                        xtype: "template",
                                        entity: $scope.template
                                    }),
                                    1 == response.data.is_deleted && ($scope.permission = kzi.constant.permission.entity_deleted),
                                    $scope.set_pop_watcher_options()
                                );
                            $scope.section_loading_done = true;
                        },
                        function (response) {
                            response.code == kzi.statuses.template_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(response)
                        }
                    )
                }
            });
        $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
            $rootScope.locator.type !== kzi.constant.entity_type.template || _.isEmpty($scope.template) || $scope.js_show_editor($scope.template)
        });
        $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
            $rootScope.locator.type === kzi.constant.entity_type.template && (_.isEmpty($scope.template) || $scope.template.is_edit !== !0 ? $rootScope.locator.show_slide === !0 && $rootScope.locator.hide_slide() : $scope.js_cancel_editor())
        });
        $scope.js_show_editor = function (e) {
            (e.owner.uid === $rootScope.global.me.uid || $rootScope.global.me.role == 0) && (e.is_edit = !0,
                _.isEmpty(e.temp_mainCatalogCode) && (e.temp_mainCatalogCode = e.mainCatalogCode),
                _.isEmpty(e.temp_mainCatalogCnName) && (e.temp_mainCatalogCnName = e.mainCatalogCnName),
                _.isEmpty(e.temp_subCatalogCode) && (e.temp_subCatalogCode = e.subCatalogCode),
                _.isEmpty(e.temp_subCatalogCnName) && (e.temp_subCatalogCnName = e.subCatalogCnName),
                _.isEmpty(e.temp_name) && (e.temp_name = e.name),
                _.isEmpty(e.temp_summary) && (e.temp_summary = e.summary),
                _.isEmpty(e.temp_content) && (e.temp_content = e.content))
        };
        $scope.js_set_as_default = function (template, withoutPrompt) {
            wt.data.user.update_defualt_template(template.template_id, function (res) {
                if (!withoutPrompt) {
                    kzi.msg.success("设置成功", function () {
                    });
                }
                $scope.defaultTemplate = template.template_id;
            }, function () {
            }, function () {
                $window.sessionStorage.defaultTemplate = template.template_id;
            });
        }
        $scope.js_cancel_editor = function (e) {
            e.is_edit = !1,
                e.temp_mainCatalogCode = null,
                e.temp_mainCatalogCnName = null,
                e.temp_subCatalogCode = null,
                e.temp_subCatalogCnName = null,
                e.temp_name = null,
                e.temp_summary = null,
                e.temp_content = null
        };
        $scope.$on(kzi.constant.event_names.on_template_comment, function (t, i) {
            _.isEmpty(i) || i.template_id === $scope.template.template_id && $scope.template.comment_count++;
        });
        //删除评论事件
        $scope.$on(kzi.constant.event_names.comment_del, function (e, i) {
            _.isEmpty(i) || i === $scope.template.template_id && $scope.template.comment_count--;
        });
        $scope.$on(kzi.constant.event_names.on_template_share, function (e, i) {
            if (!_.isEmpty(i)) {
                $scope.template.is_published = "1";
            }
        }),
            $scope.js_update_template = function (t) {
                $scope.is_setting_content = !0,
                    _.isEmpty(t.temp_name) && (t.temp_name = t.name),
                    _.isEmpty(t.temp_summary) && (t.temp_summary = t.summary),
                    _.isEmpty(t.temp_mainCatalogCode) && (t.temp_mainCatalogCode = t.mainCatalogCode),
                    _.isEmpty(t.temp_mainCatalogCnName) && (t.temp_mainCatalogCnName = t.mainCatalogCnName),
                    _.isEmpty(t.temp_subCatalogCode) && (t.temp_subCatalogCode = t.subCatalogCode),
                    _.isEmpty(t.temp_subCatalogCnName) && (t.temp_subCatalogCnName = t.subCatalogCnName),
                    _.isEmpty(t.temp_content) && (t.temp_content = t.content),
                    wt.data.template.update(pid, t.f_type, t.template_id, t.temp_name, t.temp_mainCatalogCode, t.temp_mainCatalogCnName, t.temp_subCatalogCode, t.temp_subCatalogCnName, t.temp_summary, t.temp_content, function (res) {
                        var r = res.data;
                        t.name = r.name,
                            t.f_type = r.f_type,
                            t.summary = r.summary,
                            t.mainCatalogCode = r.mainCatalogCode,
                            t.mainCatalogCnName = r.mainCatalogCnName,
                            t.subCatalogCode = r.subCatalogCode,
                            t.subCatalogCnName = r.subCatalogCnName,
                            t.content = r.content,
                            t.is_edit = !1
                    }, null, function () {
                        $scope.is_setting_content = !1, $rootScope.$broadcast(kzi.constant.event_names.on_template_update, t)
                    })
            };
        //copy from task
        var c; // todo
        $scope.js_show_tag = function (e) {
            e.is_tag_edit = !0, e.is_add_tag_edit = !0
        }, $scope.js_cancel_tag_editor = function (e) {
            e.is_tag_edit = !1
        }, $scope.js_show_tag_editor = function (t) {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.is_tag_edit = !0, c = t.name)
        }, $scope.js_show_add_tag_editor = function (e) {
            e.is_add_tag_edit = !0
        }, $scope.js_cancel_add_tag_editor = function (e) {
            e.is_add_tag_edit = !1
        }, $scope.js_add_tag = function (e, t) {
            return _.isUndefined(t) || _.isUndefined(t.temp_name) || _.isEmpty(t.temp_name) ? (e.is_add_tag_edit = !1, void 0) : (t.is_saving = !0, u1(e, t, function () {
                t.is_saving = !1
            }), void 0)
        }, $scope.js_keyup_add_tag = function (t, i) {
            var a = t.which;
            return 13 === a ? (t.stopPropagation(), t.preventDefault(), setTimeout(function () {
                $(t.target).parents(".new-tag-control").find("button[data-loading-text]").click()
            }, 50), void 0) : 27 === a ? ($scope.js_cancel_add_tag_editor(i), void 0) : void 0
        }, $scope.js_save_tag = function (e, t) {
            return _.isEmpty(t.name) ? (t.is_tag_edit = !1, t.name = c, void 0) : (t.is_saving = !0, wt.data.task.update_tag(r, l, t.tag_id, t.name, t.pos, function () {
            }, null, function () {
                t.is_saving = !1, t.is_tag_edit = !1
            }), c = t.name, void 0)
        }, $scope.js_keyup_tag = function (t, i, n) {
            var a = event.which || event.keyCode;
            return 13 === a ? ($scope.js_save_tag(null, n), void 0) : (27 === a && $scope.js_cancel_tag_editor(n), void 0)
        }, $scope.js_del_tag = function (e, t) {
            e.tags = _.reject(e.tags, function (e) {
                return e.tag_id === t.tag_id
            }), wt.data.task.del_tag(r, l, t.tag_id, function () {
            }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, e)
        };
        //<-end
        $scope.del_template = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/template/pop_delete_template.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.template = n, e.js_close = function () {
                            t.close()
                        }, e.js_del_template = function () {
                            $rootScope.del_entity(n.objectId, n.uid, "template");
                            e.js_close();
                            $rootScope.locator.hide_slide();
//                                    wt.data.template.trash(pid, n.template_id, function () {
//                                        e.js_close(), $rootScope.locator.hide_slide(), $rootScope.$broadcast(kzi.constant.event_names.on_template_trash, {
//                                            template_id: n.template_id
//                                        })
//                                    })
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
            }).open()
        };
        $scope.js_collect = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/template/pop_collect_template.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, s) {
                        e.popbox = t;
                        e.collect_template = {};
                        if (_.isEmpty(e.projects) && e.global.is_login) {
                            e.reload_projects(function (ee_projects) {
                                _.isEmpty(ee_projects) || (e.projects = ee_projects);
                                e.collect_task.project = ee_projects[0];
                            });
                        }
                        ;

                        _.isEmpty(e.projects) || (e.collect_template.project = e.projects[0]);

                        e.js_close = function () {
                            t.close()
                        };
                        e.js_collect_template = function () {
                            wt.data.template.collect(s.scope.template.pid, template_id, function () {
                                e.send_success = !0
                            })
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
            }).open()
        };

        $scope.js_collect = function (template) {
            wt.data.template.collect(
                null,
                template.objectId,
                function () {
                    $scope.send_success = !0
                    template.collected = true;
                    kzi.msg.success("收藏成功");
                    $rootScope.$broadcast("template_collect", template.objectId);
                })
        }

        $scope.js_share = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/template/pop_share_template.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.template = i, e.js_close = function () {
                            t.close()
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
            }).open()
        };
        $scope.set_pop_watcher_options = function () {
            $scope.permission === kzi.constant.permission.ok && ($scope.pop_watcher_options = [
                {
                    name: "取消关注",
                    ongoing: "取消中...",
                    click: function (t, i, n, a) {
                        wt.bus.watch.unwatch(pid, $scope.template, kzi.constant.xtype.template, $scope.template.template_id, n, function () {
                        }, null, a)
                    }
                }
            ])
        };
        $scope.js_show_template_watch_pop = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/template/pop_edit_template_watchers.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.edit_template = n, $rootScope.load_project_members(pid, function (t) {
                            wt.bus.template.set_scope_watcher_members(e, t.members, n.watchers)
                        }), e.js_toggle_member = function (e) {
                            wt.bus.template.toggle_watcher_member(e, n, pid)
                        }, e.js_watch_all = function () {
                            wt.bus.template.watch_all_members(e.members, n, pid, function () {
                            }, null, function () {
                                e.js_close()
                            })
                        }, e.js_close = function () {
                            t.close()
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
            }).open()
        };
        $scope.js_show_attach = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/file/pop_attach.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.template = n, e.prj_files_loaded = !1, $rootScope.load_files(pid, "", function (t) {
                            e.prj_files_loaded = !0;
                            var i = _.where(t.files, {
                                folder_id: ""
                            });
                            e.files = i
                        }), e.js_attach = function (t) {
                            if (1 == t.type) e.step = 1, e.prj_files_loaded = !1, $rootScope.load_files(pid, t.fid, function (i) {
                                e.prj_files_loaded = !0;
                                var n = _.where(i.files, {
                                    folder_id: t.fid
                                });
                                e.sub_files = n
                            });
                            else {
                                _.isEmpty(n.files) && (n.files = []);
                                var a = _.findWhere(n.files, {
                                    fid: t.fid
                                });
                                a || (n.files.push(t), wt.data.file.attach(pid, "templates", template_id, t.fid, function () {
                                }))
                            }
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
            }).open()
        };
        $scope.js_trigger_upload = function (e) {
            $(e.target).parents(".btn-group").eq(0).find("input[type=file]").click()
        };
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
        $scope.$on(kzi.constant.event_names.on_file_add, function (t, i) {
            i && "template" === i.type && $scope.template.template_id === i.file.formData.template_id && (_.isArray($scope.template.files) ? $scope.template.files.push(i.file) : $scope.template.files = [i.file])
        });
        $scope.js_goto_file = function (e, n) {
            var a = $routeParams.pid;
            _.isEmpty(a) ? $rootScope.locator.to_file(e, n, !0) : $rootScope.locator.to_file(e, n, !1)
        };
        $scope.js_del_attachment = function (t, i) {
            var n = _.findWhere($scope.template.files, {
                fid: i.fid
            });
            n && ($scope.template.files = _.reject($scope.template.files, function (e) {
                return e.fid == i.fid
            })), wt.data.file.detach(pid, "templates", template_id, i.fid)
        };
        $scope.select_tab_comment = function () {
            $scope.tab_activity_active = !1, $scope.tab_comment_active = !0
        };
        $scope.select_tab_activity = function () {
            $scope.tab_activity_active = !0, $scope.tab_comment_active = !1, $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                xtype: "template",
                xid: $scope.template.template_id
            })
        };
        $scope.js_close = function () {
            $rootScope.locator.show_slide = !1
        }
    }]);
