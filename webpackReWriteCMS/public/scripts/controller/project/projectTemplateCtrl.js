'use strict';
innerApp.controller('project_template_ctrl', ["$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location", "$http",
    function ($rootScope, $scope, $routeParams, $popbox, $timeout, $location,$http) {
        var pid = $routeParams.pid,
            r = 0,
            l = "last_reply_date";
        var u = $rootScope.global.me;

        $rootScope.load_project(pid, function (i) {
            $rootScope.global.title = "模板 | " + i.info.name, $scope.project = i, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path("/project/" + o + "/notfound") : wt.data.error(e)
        });

        //加载分类
        $http.get('/json/templateCatalog.json').success(function(i){
           $scope.catalogs = i.data;
        });
        $scope.current_filter_type = 'my_all';
        $scope.current_tab = 0;
        u.watched = !0, $rootScope.global.loading_done = !0;
            $scope.edit_template = {
            name: "",
            summary: "",
            content: "",
            watchers: [u]
        };
        //默认视图的显示
        $scope.current_filter_type = 'my_all';
        $scope.current_tab = 0;
        var reqObj = {
            type: "",
            code: "",
            page: 1,
            size: "",
            pid:$routeParams.pid
        };
        var type1 = kzi.localData.get('template_list_type');
        var type = kzi.localData.get('project_list_type');
        $scope.industry_view_type = type1 ? type1 : 'orginal';
        $scope.list_grid_type = type ? type : 'list';
        //视图切换
        $scope.js_view_toggle = function (list_grid, industry_view) {
            if (list_grid) {
                $scope.list_grid_type = list_grid;
                kzi.localData.set('project_list_type', list_grid);
            }
            if (industry_view) {
                //按行业分类展示 和 按原始分类 切换后，重置条件
                $scope.js_change_tab(0, null);
                $scope.js_filter_template('my_all');
                $scope.industry_view_type = industry_view;
                kzi.localData.set('template_list_type', industry_view);
            }
        };
        //查询函数
        var load_data = function (req) {
            $scope.part_loading_done = !1;
            $rootScope.global.loading_done = !1;
            wt.data.template.get_private_classify(req, function (i) {
                    $scope.templates = i.data? i.data:[];
                }, null,
                function () {
                    $scope.part_loading_done = !0;
                    $rootScope.global.loading_done = !!1;
                });
        };

        $scope.$on(kzi.constant.event_names.entity_del,function(event,p){
            $scope.templates= _.filter($scope.templates,function(e){return e.objectId!= p.id;});
        }, null);

        //筛选条件
        $scope.js_filter_template = function (type) {
            $scope.current_filter_type = type;
            switch (type) {
                case 'my_all':
                    reqObj.type = 0;
                    break;
                case 'my_create':
                    reqObj.type = 1;
                    break;
                case 'my_share':
                    reqObj.type = 2;
                    break;
                case 'my_download':
                    reqObj.type = 3;
                    break;
            }
            ;
            load_data(reqObj);
        }
//        var d = function (e) {
//            $scope.part_loading_done = !1;
//            wt.data.template.get_list(o, r, kzi.config.default_count, l, 1, $scope.current_tab, function (i) {
//                i.data.length > 0 && (r = i.data[i.data.length - 1][l]);
//                $scope.templates = _.isEmpty($scope.templates) ?
//                    i.data :
//                    $scope.templates.concat(i.data);
//                $scope.templates = i.data;
//                $scope.has_more = i.data.length === kzi.config.default_count ? !0 : !1;
//                angular.isFunction(e) && e(i.data);
//                $scope.part_loading_done = !0;
//            })
//        };
        //显示新建模板
        $scope.js_show_add_template = function () {
            $scope.show_add_template = !$scope.show_add_template
        },
            //取消正在新建的模板，清空form表单
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
        },
            //默认分类里的 分类选择
            $scope.js_change_tab = function (e, code) {
            if ($scope.current_tab !== e) {
                $scope.current_tab = e;
                if(code){
                    reqObj.code = code;
                } else {
                    reqObj.code = "";
                };
                load_data(reqObj);
            }
        };
        //第一次加载数据
        load_data(reqObj);
        $scope.js_toggle_member = function (e) {
            wt.bus.template.toggle_watcher_member(e, $scope.edit_template, o)
        },

            $scope.edit_template.f_type='01';
            $scope.js_save_template = function () {

                if(_.isEmpty($scope.edit_template.name))
                {
                    kzi.msg.error("请输入模板名称");
                }
                else if(_.isEmpty($scope.edit_template.mainCatalogCode))
                {
                    kzi.msg.error("请选择模板分类");
                }
                else if(_.isEmpty($scope.edit_template.summary))
                {
                    kzi.msg.error("请输入模板标题");
                }
                else if(_.isEmpty($scope.edit_template.content))
                {
                    kzi.msg.error("请输入模板内容");
                }
                else
                {
                    $scope.is_saving = !0;
                    var n = _.pluck($scope.edit_template.watchers, "uid");
                    wt.data.template.add(pid, $scope.edit_template.f_type,$scope.edit_template.name, $scope.edit_template.mainCatalogCode, $scope.edit_template.mainCatalogCnName, $scope.edit_template.subCatalogCode, $scope.edit_template.subCatalogCnName, $scope.edit_template.summary, $scope.edit_template.content, n, function (i) {
                        $scope.is_saving = !1, 2 === $scope.current_tab ? n.indexOf($rootScope.global.me.uid) >= 0 && $scope.templates.unshift(i.data) : $scope.templates.unshift(i.data)
                    }, null, function () {
                        $scope.js_cancel_edit_template()
                    });
                }

        }, $scope.js_show_template_menu = function (i, a, s, r) {
            i.stopPropagation(), $popbox.popbox({
                target: i,
                top: s,
                left: r,
                templateUrl: "/view/project/template/pop_template_action.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (t, i, n) {
                        t.popbox = i, t.step = 0, t.js_step = function (e) {
                            t.step = e
                        }, t.edit_template = a, $rootScope.load_project_members(pid, function (e) {
                            wt.bus.template.set_scope_watcher_members(t, e.members, a.watchers)
                        }), t.js_delete_template = function (e) {
                            t.is_deleting = !0, wt.data.template.trash(pid, e.template_id, function () {
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
                        t.popbox = i, t.edit_template = a, $rootScope.load_project_members(pid, function (e) {
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
                                value: "create_date",
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
        },
/*            $rootScope.load_project(o, function (i) {
            $rootScope.global.title = "模板 | " + i.info.name
                , $scope.project = i
                , $scope.permission = 1 == $scope.project.info.archived ?
                kzi.constant.permission.project_archived :
                    2 == $scope.project.info.team.status ?
                        kzi.constant.permission.team_stop_service :
                        kzi.constant.permission.ok
                , d()
        },function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ?
                $location.path("/project/" + o + "/notfound") :
                wt.data.error(e)
        })*/
         /*   , $scope.js_load_more = function () {
            d()
        }*/
            /*, $scope.$on(kzi.constant.event_names.filter_templates_by_sort, function (e, i) {
            _.isEmpty(i) || (l = i), r = 0, $scope.templates = null, d()
        }), */

                //删除评论事件
                $scope.$on(kzi.constant.event_names.comment_del,function(e, i){
                    if (!_.isEmpty(i))
                    {
                        var n = _.findWhere($scope.templates, {objectId:i});
                        n && (n.comment_count--);
                    };
                });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_template_comment,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.templates, {objectId: i.template_id});
                n && n.comment_count++;
            };
        });
            $scope.$on(kzi.constant.event_names.on_template_share, function (e, i) {
                $scope.js_filter_template('my_share');
            }),


                $scope.$on(kzi.constant.event_names.on_template_trash, function (e, i) {
            _.isEmpty(i) || ($scope.templates = _.reject($scope.templates, function (e) {
                return e.template_id === i.template_id;
            }))
        }),
                $scope.$on(kzi.constant.event_names.on_template_update, function (e, i)
                {
                    if (!_.isEmpty(i)) {
                        var n = _.findWhere($scope.templates, {
                            template_id: i.template_id
                        });
                        n && (n.name = i.name,n.mainCatalogCnName= i.mainCatalogCnName, n.summary = kzi.helper.substr(i.content, 60));
                    }
                }),
                $scope.$on(kzi.constant.event_names.on_right_menu, function (e, i) {
            var n = kzi.helper.mouse_position(i),
                a = null,
                s = "template-item";
            if ($(i.target).hasClass(s)) a = $(i.target).attr("template-id");
            else {
                if (!($(i.target).parents("." + s).length > 0)) return;
                a = $(i.target).parents("." + s).attr("template-id")
            }
            if (a) {
                var o = _.findWhere($scope.templates, {
                    template_id: a
                });
                o && $scope.js_show_template_menu(i, o, n.y, n.x)
            }
        })
    }
]).controller("template_filter_ctrl", ["$scope", "$routeParams", "$rootScope",
        function (e) {
            var n = null;
            e.filter_items = [
                {
                    name: "按分享时间",
                    value: "create_date",
                    is_selected: !0
                },
                {
                    name: "按回复时间",
                    value: "last_reply_date",
                    is_selected: !1
                }
            ], n = e.filter_items[0], e.js_select_filter = function (t) {
                n.is_selected = !1, t.is_selected = !0, n = t, e.$emit(kzi.constant.event_names.filter_templates_by_sort, t.value)
            }
        }
    ]);