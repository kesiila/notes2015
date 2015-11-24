'use strict';
innerApp.controller('project_mail_ctrl', ["$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location","MdParse",
    function ($rootScope, $scope, $routeParams, $popbox, $timeout, $location,MdParse) {
        var o = $routeParams.pid,
            r = 0,
            l = "last_reply_date";
        $scope.current_tab = 0;
        // $rootScope.global.right_sidebar_is_fold = true;
        var u = $rootScope.global.me;
        u.watched = !0, $rootScope.global.loading_done = !0, $scope.edit_mail = {
            subject: "",
            content: "",
            tasks: [],
            watchers: [u],
            display_name: $rootScope.global.me && ($rootScope.global.me.name || $rootScope.global.me.display_name || ""),
            email: $rootScope.global.me && ($rootScope.global.me.email || "")
        };

        $scope.currentPage=1;
        $scope.queryCondition=
        {
            pid:o,
            status:"",//邮件状态
            date:"",//发件时间
            to:"",//收件人
            template:"",//邮件所用模板
            isDESC:$scope.isDESC,//升序或降序
            page: $scope.currentPage,//当前页码
            size: 10//页面大小
        };

        var d = function (e) {
            $scope.part_loading_done=false;
//            wt.data.email.get_list(o, r, kzi.config.default_count, l, 1, $scope.current_tab, function (i) {
//                i.data.length > 0 && (r = i.data[i.data.length - 1][l]), $scope.mails = _.isEmpty($scope.mails) ? i.data : $scope.mails.concat(i.data), $scope.has_more = i.data.length === kzi.config.default_count ? !0 : !1, angular.isFunction(e) && e(i.data), $scope.part_loading_done = !0
//            })

            wt.data.mail.get_mails($rootScope.global.me.uid, $scope.queryCondition,
                function(resp){$scope.data_count= resp.totalItems;$scope.mails =resp.data;},
                function(){ kzi.msg.error("数据加载失败！",function(){});},
                function(){$scope.part_loading_done=true;}
            );
            wt.data.mail.get_mail_groupcounts($rootScope.global.me.uid, e,
                function (resp) {
                    if(!_.isEmpty(resp.data)){
                        $scope.mails_count = resp.data;
                    }else{
                        $scope.mails_count = {"allCount":0,"openedCount":0,"notOpenedCount":0};
                    }
                },
                function () {},
                function () {$scope.part_loading_done = true;}
            );
        };
        $scope.$watch("queryCondition",function(queryCondition){d();},true);
        //监视分页操作
        $scope.$watch('currentPage',function(currentPage)
        {
            $scope.currentPage=currentPage;
            $scope.queryCondition.page=$scope.currentPage;
        },true);
        /**
         * 发新邮件
         */
        $rootScope.$on("show_add_mail", function (event, i) {
            $scope.edit_mail.tasks.push(i.task) ;
            $scope.js_show_add_mail();
        });
        $scope.js_toggle_template = function (e, es) {
            e.checked = !e.checked;
            $scope.edit_mail.name = e.summary;
            $scope.edit_mail.content = e.content;
            $scope.edit_mail.template_id = e.template_id;
            es && es.length > 0 && _.each(es, function (t) {
                if (t.template_id != e.template_id)
                    t.checked = false;
            })
        };

        //发送邮件
        $scope.js_save_mail = function (mail_form) {
            //$scope.edit_mail.content=html2markdown($("#fa-editor-mail .edit-area").html());
            //$scope.edit_mail.content=$("#fa-editor-mail .edit-area").html();
            $scope.is_saving = !0;
            var n = _.pluck($scope.edit_mail.watchers, "uid");
            var m = _.pluck($scope.edit_mail.tasks, "tid");
            var content = MdParse($scope.edit_mail.content);
            var from = $scope.edit_mail.display_name + "<" + $scope.edit_mail.email + ">";
            var template_id = $scope.edit_mail.template_id;
            wt.data.email.add(o, $scope.edit_mail.subject, content, n, m, from, template_id,function (i) {
                $scope.mails = $scope.mails || [];
                angular.forEach(i.data,function(mail){
                    $scope.mails.unshift(mail);
                });
                ;
                $scope.is_saving = !1;
                // 2 === $scope.current_tab ? n.indexOf($rootScope.global.me.uid) >= 0 && $scope.mails.unshift(i.data) : $scope.mails.unshift(i.data)
            }, function(res){
                console.log('error:'+res);
            }, function () {
                $scope.js_cancel_edit_mail();
                $rootScope.open_mail_prompt($scope.mails);
            });
        };
        $scope.js_show_mail_list = function () {
            $scope.show_mail_list = !$scope.show_mail_list;
        };

        $scope.js_show_add_mail = function () {
            $scope.show_add_mail = !$scope.show_add_mail;
            $rootScope.global.right_sidebar_is_fold = $scope.show_add_mail;
            if ($scope.show_add_mail) {
                $rootScope.global.right_sidebar_show_part = 1;
                $rootScope.global.right_sidebar_is_fold = false;
            } else {
                $rootScope.global.right_sidebar_show_part = 0;
                $rootScope.global.right_sidebar_is_fold = true;
            }
            ;
            $rootScope.global.right_sidebar_is_fold ? kzi.localData.set("right_sidebar_is_fold", 1) : kzi.localData.set("right_sidebar_is_fold", 0);
        };

        $scope.js_cancel_edit_mail = function () {
            $rootScope.global.right_sidebar_show_part = 0;
            $scope.show_add_mail = !1, $scope.edit_mail.name = "", $scope.edit_mail.content = "", $scope.edit_mail.watchers = [u]
        }, $scope.js_show_template = function () {
            $scope.template = wt.bus.mail.getTemplate({mainCatalogCode: "0010", page: "1"});
            ;
        },

        $scope.js_change_tab = function (e) {
            if ($scope.current_tab !== e && $scope.part_loading_done)
            {
                switch(e){
                    case 0:$scope.queryCondition.status="";
                        break;
                    case 1:$scope.queryCondition.status="isOpend";
                        break;
                    case 2:$scope.queryCondition.status="isNotOpend";
                        break;
                    default:;
                }
                $scope.current_tab = e;
            };
//            if ($scope.current_tab !== e) switch ($scope.current_tab = e, r = 0, $scope.mails = [], d(), e) {
//                case 0:
//                    break;
//                case 1:
//                    break;
//                case 2:
//                    break;
//                default:
//            }
        }, $scope.js_toggle_member = function (e) {
            wt.bus.mail.toggle_watcher_member(e, $scope.edit_mail, o)
        }, $scope.js_toggle_task = function (e) {
            wt.bus.mail.toggle_task_member(e, $scope.edit_mail, o)
        }, $scope.js_show_mail_menu = function (i, a, s, r) {
            i.stopPropagation(), $popbox.popbox({
                target: i,
                top: s,
                left: r,
                templateUrl: "/view/project/mail/pop_mail_action.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (t, i, n) {
                        t.popbox = i, t.step = 0, t.js_step = function (e) {
                            t.step = e
                        }, t.edit_mail = a, $rootScope.load_project_members(o, function (e) {
                            wt.bus.mail.set_scope_watcher_members(t, e.members, a.watchers)
                        }), t.js_delete_mail = function (e) {
                            t.is_deleting = !0, wt.data.email.trash(o, e.mail_id, function () {
                                t.is_deleting = !1, t.js_close(), n.scope.mails = _.reject(n.scope.mails, function (t) {
                                    return t.mail_id === e.mail_id
                                })
                            })
                        }, t.js_toggle_member = function (e) {
                            wt.bus.mail.toggle_watcher_member(e, a, o)
                        }, t.js_watch_all = function (e) {
                            wt.bus.mail.watch_all_members(t.members, e, o, function () {
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
        }, $scope.js_add_mail_watchers_pop = function (i, a) {
            $popbox.popbox({
                target: i,
                templateUrl: "/view/project/mail/pop_edit_mail_watchers.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (t, i) {
                        t.popbox = i, t.edit_mail = a, $rootScope.load_project_members(o, function (e) {
                            wt.bus.mail.set_scope_watcher_members(t, e.members, a.watchers)
                        }), t.js_toggle_member = function (e) {
                            wt.bus.mail.toggle_watcher_member(e, a, o)
                        }, t.js_watch_all = function (e) {
                            wt.bus.mail.watch_all_members(t.members, e, o, function () {
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
        }, $scope.js_add_mail_tasks_pop = function (i, a) {
            $popbox.popbox({
                target: i,
                templateUrl: "/view/project/mail/pop_edit_mail_tasks.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (t, i) {
                        t.popbox = i, t.edit_mail = a, $rootScope.load_tasks(o, function (e) {
                            wt.bus.mail.set_scope_task_members(t, e.tasks, a.tasks)
                        }), t.js_toggle_member = function (e) {
                            wt.bus.mail.toggle_task_member(e, a, o)
                        }, t.js_watch_all = function (e) {
                            wt.bus.mail.watch_alltask_members(t.tasks, e, o, function () {
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
                templateUrl: "/view/project/mail/pop_mails_more_menu.html",
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
                            t.selected_filter.is_selected = !1, i.is_selected = !0, t.selected_filter = i, t.js_close(), $rootScope.$broadcast(kzi.constant.event_names.filter_mails_by_sort, i.value)
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
            e ? $scope.show_add_mail_empty = !!e : $timeout(function () {
                $scope.show_add_mail_empty = !!e
            }, 400)
        }, $rootScope.load_project(o, function (i) {
            $rootScope.global.title = "邮件 | " + i.info.name, $scope.project = i, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok, d()
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path("/project/" + o + "/notfound") : wt.data.error(e)
        }), $scope.js_load_more = function () {
            d()
        }, $scope.$on(kzi.constant.event_names.filter_mails_by_sort, function (e, i) {
            _.isEmpty(i) || (l = i), r = 0, $scope.mails = null, d()
        }), $scope.$on(kzi.constant.event_names.on_mail_comment, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.mails, {
                    mail_id: i.mail_id
                });
                n && n.comment_count++
            }
        }), $scope.$on(kzi.constant.event_names.on_mail_trash, function (e, i) {
            _.isEmpty(i) || ($scope.mails = _.reject($scope.mails, function (e) {
                return e.mail_id === i.mail_id
            }))
        }), $scope.$on(kzi.constant.event_names.on_mail_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.mails, {
                    mail_id: i.mail_id
                });
                n && (n.name = i.name, n.summary = kzi.helper.substr(i.content, 60))
            }
        }), $scope.$on(kzi.constant.event_names.on_right_menu, function (e, i) {
            var n = kzi.helper.mouse_position(i),
                a = null,
                s = "mail-item";
            if ($(i.target).hasClass(s)) a = $(i.target).attr("mail-id");
            else {
                if (!($(i.target).parents("." + s).length > 0)) return;
                a = $(i.target).parents("." + s).attr("mail-id")
            }
            if (a) {
                var o = _.findWhere($scope.mails, {
                    mail_id: a
                });
                o && $scope.js_show_mail_menu(i, o, n.y, n.x)
            }
        })
    }
]).controller("mail_filter_ctrl", ["$scope", "$routeParams", "$rootScope",
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
            n.is_selected = !1, t.is_selected = !0, n = t, e.$emit(kzi.constant.event_names.filter_mails_by_sort, t.value)
        }
    }
]);


