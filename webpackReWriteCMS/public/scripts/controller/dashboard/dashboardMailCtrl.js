'use strict';
innerApp.controller('common_mail_ctrl', ["$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location", 'MdParse',"$modal",
    function ($rootScope, $scope, $routeParams, $popbox, $timeout, $location, MdParse,$modal) {
        $rootScope.global.right_sidebar_show_part = 0,
            $rootScope.global.right_sidebar_is_fold = true,
            $rootScope.global.title = '我的邮件',
            $rootScope.global.loading_done = true;
        //是否是管理员
        $scope.isManager=$rootScope.global.me.role==0 && $rootScope.global.me.name=="sys_manager";
        $scope.show_add_mail = false;
        $scope.page = 1;
        $scope.selectAll = false;
        $scope.current_type = 'all';
        $scope.entity = {};

        var o = $routeParams.pid;

        var find_project = function () {
            if (!_.isEmpty(o)) {
                $rootScope.load_project(o, function (t) {
                    _.isEmpty(t) || (
                        $rootScope.global.title = t.info.name + " | 邮件",
                            $scope.project = t,
                            $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok
//                    d()
                    );
                }, function (e) {
                    e.code === kzi.statuses.prj_error.not_found.code ? $location.path("/project/" + o + "/notfound") : wt.data.error(e)
                });
            }
        };
        find_project();

        $scope.isDESC = true;//排序方式，默认按降序排序
        $scope.currentPage = 1;//默认为首页
        $scope.data_count = 0;//总记录数
        $scope.user_name="";
        $scope.queryCondition =
        {
            isManager:$scope.isManager,//是否是管理员
            userName:"",//用户名
            pid: o,
            status: "",//邮件状态
            date: "",//发件时间
            to: "",//收件人
            template: "",//邮件所用模板
            isDESC: $scope.isDESC,//升序或降序
            page: $scope.currentPage,//当前页码
            size: 10//页面大小
        };

        $scope.filter_status =
            [
                {name: "全部状态", value: "all"}
                //,{name:"投递中",value:"MailInLine"}
                //,{name:"已投递",value:"MailSubmit"}
                ,{name:"已发送",value:"MailAccepted"}
                ,{name:"已送达",value:"MailSent"}
                ,{name: "已打开", value: "MailOpened"}
                ,{name: "已弹回", value: "MailBounced"}
                ,{name:"无效邮箱",value:"MailInvalid"}
                ,{name:"点击链接",value:"MailLinkClicked"}
                //,{name:"投递失败",value:"MailSendFailed"}
                //,{name:"额度已满",value:"MailQuotaNotEnough"}
        ];

        $scope.filter_date =
            [
                {name: "全部时间", value: "0"}
                , {name: "最近3天", value: "3"}
                , {name: "最近7天", value: "7"}
                , {name: "最近30天", value: "30"}
                , {name: "最近90天", value: "90"}
            ];

        $scope.filter_status_index = 0;
        $scope.filter_date_index = 0;

        /**
         * 根据邮件打开状态筛选邮件
         * @param index
         */
        $scope.choose_status_filter = function (index) {
            $scope.current_tab = 0;
            if (index != $scope.filter_status_index) {
                $scope.filter_status_index = index;
                $scope.queryCondition.status = $scope.filter_status[index].value;
                $scope.currentPage = 1;
                $scope.queryCondition.page = $scope.currentPage;
            }
        };

        /**
         * 根据日期筛选邮件
         * @param index
         */
        $scope.choose_date_filter = function (index) {
            if (index != $scope.filter_date_index) {
                $scope.filter_date_index = index;
                $scope.queryCondition.date = $scope.filter_date[index].value;
                $scope.currentPage = 1;
                $scope.queryCondition.page = $scope.currentPage;
            }
        };

        //切换排序顺序
        $scope.sortMails = function () {
            $scope.isDESC = !$scope.isDESC;
            $scope.queryCondition.isDESC = $scope.isDESC;
        };


        $scope.mails_count = [0, 0, 0];//0:所有邮件总数；1：所有已打开的邮件总数；2：所有已打开的邮件总数
        /**
         * 加载邮件列表
         * @param t
         */
        var loadMails = function (t) {
            $scope.part_loading_done = false;
            $rootScope.global.loading_done = false;
            wt.data.mail.get_mails($rootScope.global.me.uid, t,
                function (resp) {
                    $scope.data_count = resp.totalItems;
                    $scope.mails = resp.data;
                    _.each( $scope.mails,function(mail){
                        _.each( kzi.constant.mail_status_describe,function(mail_describe){
                            if(mail.mailStatus==mail_describe.name){
                                mail.status_describe=mail_describe.describe;
                            }
                        })
                    })

                },
                function () {
                    kzi.msg.error("数据加载失败！", function () {
                    });
                },
                function () {
                    $scope.part_loading_done = true;
                    $rootScope.global.loading_done = true;
                }
            );

            wt.data.mail.get_mail_groupcounts($rootScope.global.me.uid, t,
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

        $scope.$watch("queryCondition", function (queryCondition) {
            loadMails(queryCondition);
        }, true);

        ////缓存邮件收信人信息
        //var mail_tos = [];
        //
        ////显示或隐藏邮件收信人信息
        //$scope.mail_to = function (index, cid) {
        //    if (!_.isEmpty(cid)) {
        //        if (_.isEmpty(mail_tos[index]) || mail_tos[index].objectId != cid) {
        //            wt.data.task.get(null, cid,
        //                function (resp) {
        //                    mail_tos[index] = resp.data;
        //                },
        //                function () {
        //                    mail_tos[index] = {
        //                        "cid": "",
        //                        "name": $scope.mails[index].to.substr(0, $scope.mails[index].to.indexOf("<"))
        //                    };
        //                },
        //                function () {
        //                    $scope.entity = mail_tos[index];
        //                });
        //        } else {
        //            $scope.entity = mail_tos[index];
        //        }
        //        ;
        //        $("#customer" + index).removeClass("hide");
        //    }
        //    else {
        //        $("#customer" + index).addClass("hide");
        //        $scope.entity = null;
        //    }
        //    ;
        //};
        //
        ////缓存邮件模板信息
        //var mail_templates = [];
        ////显示或隐藏邮件模板信息
        //$scope.mail_template = function (index, templateId) {
        //    if (!_.isEmpty(templateId)) {
        //        if (_.isEmpty(mail_templates[index]) || mail_templates[index].template != templateId) {
        //            wt.data.template.get(null, templateId,
        //                function (resp) {
        //                    mail_templates[index] = {name: resp.data.name};
        //                },
        //                function () {
        //                    mail_templates[index] = {name: "已删除"}
        //                },
        //                function () {
        //                    $scope.entity = mail_templates[index];
        //                });
        //        } else {
        //            $scope.entity = mail_templates[index];
        //        }
        //        ;
        //        $("#template" + index).removeClass("hide");
        //    }
        //    else {
        //        $("#template" + index).addClass("hide");
        //        $scope.entity = null;
        //    }
        //    ;
        //};


        //进入收件人或模板发件历史
        $scope.mail_list = function (id, cmd, event) {
            event.stopPropagation();
            if (cmd == "to") {
                $scope.all_mails();
                $scope.queryCondition.to = id;
                $scope.mail_filter_name = _.isEmpty($scope.entity)?"已删除":$scope.entity.name;
            }
           cmd == "template" && ($scope.all_mails(), $scope.queryCondition.template = id, $scope.mail_filter_name = '模板' + $scope.entity.name);
        };

        $scope.all_mails = function () {
            $scope.queryCondition.userName = $scope.user_name;
            $scope.queryCondition.status = "";
            $scope.queryCondition.to = "",
            $scope.currentPage = 1;
            $scope.queryCondition.page = 1;
            $scope.queryCondition.isDESC = 1;
            $scope.queryCondition.template = "",
                $scope.mail_filter_name = "";
        };

        //监视分页操作
        $scope.$watch('currentPage', function (currentPage) {
            $scope.currentPage = currentPage;
            $scope.queryCondition.page = $scope.currentPage;
        }, true);

        $scope.js_set_mail_read = function (e, t) {
            wt.data.mail.set_read(t.mail_id, function () {
                t.is_read = true;
            });
        };

        $scope.js_open_mail_detail = function (e) {
            $rootScope.locator.to_email(e.pid, e.mail_id, false);
            wt.data.mail.set_read(e.mail_id, function () {
                e.is_read = true;
            });
        };

        $scope.$on(kzi.constant.event_names.on_mail_trash, function (t, i) {
            $scope.mails && ($scope.mails = _.reject($scope.mails, function (e) {
                return e.mail_id === i.mail_id;
            }));
        });

        var o = $routeParams.pid,
            r = 0,
            l = "last_reply_date";
        $scope.current_tab = 0;
        $scope.show_mail_list = false;

        $scope.js_show_mail_list = function () {
            $scope.show_mail_list = !$scope.show_mail_list;
        };
        var u = $rootScope.global.me;

        u.watched = !0,

            $scope.edit_mail = {
                subject: "",
                content: "",
                tasks: [],
                watchers: [u],
                display_name: $rootScope.global.me.name || $rootScope.global.me.display_name || "",
                email: $rootScope.global.me.email || ""
            };
//   var d = function (e) {
//       $scope.part_loading_done = !1,
//       wt.data.email.get_list(o, r, kzi.config.default_count, l, 1, $scope.current_tab, function (i)
//       {
//           i.data.length > 0 && (r = i.data[i.data.length - 1][l]), $scope.mails = _.isEmpty($scope.mails) ? i.data : $scope.mails.concat(i.data), $scope.has_more = i.data.length === kzi.config.default_count ? !0 : !1, angular.isFunction(e) && e(i.data), $scope.part_loading_done = !0
//       })
//   };

        $scope.clear = function () {
            $rootScope.global.right_sidebar_is_fold = true;
            $rootScope.global.right_sidebar_show_part = 0;
            $rootScope.selectedMails.length = 0;
            $scope.edit_mail.tasks.length = 0;
            _.each($scope.mails, function (mail) {
                mail.checked = false;
                var i = _.findWhere($rootScope.selectedMails, {
                    mail_id: mail.mail_id
                });
                i && ($rootScope.selectedMails = _.reject($rootScope.selectedMails, function (t) {
                    return t.mail_id === mail.mail_id
                }))
            })
        };

        $rootScope.$on("show_add_mail", function (event, i) {
            $scope.edit_mail.tasks.push(i.task);
            $scope.js_show_add_mail();
        });

        $scope.js_show_add_mail = function () {
            $scope.show_add_mail = !$scope.show_add_mail;
            $rootScope.global.right_sidebar_is_fold = $scope.show_add_mail;
            if ($scope.show_add_mail) {
                $rootScope.global.right_sidebar_show_part = 1;
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.$broadcast(kzi.constant.event_names.show_sidebar_tasks_filter, !0);
            }
            else {
                $scope.clear();
            }
            ;

            $rootScope.global.right_sidebar_is_fold ?
                kzi.localData.set("right_sidebar_is_fold", 1) :
                kzi.localData.set("right_sidebar_is_fold", 0);
        };

        $scope.js_watch_all = function (i, e) {
            wt.bus.mail.watch_alltask_members(i, e, o, function () {
            }, null, function () {
            });
        };

        $scope.js_remove_selected = function (selected, all) {
            var mids = [];
            _.each(selected, function (mail) {
                mids.push(mail.mail_id);
            });
            wt.data.mail.batch_delete(mids, function () {
            }, null, function () {
            });
        };

        $scope.js_pop_delete_mail = function (t, selected, all) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/common/pop_mail_delete.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, a) {
                        var mids = [];
                        _.each(selected, function (mail) {
                            mids.push(mail.mail_id);
                        });
                        e.popbox = t, e.js_sure_delete = function () {

                            wt.data.mail.batch_delete(mids, function () {
                                _.each(selected, function (mail) {
                                    a.scope.mails = _.reject(a.scope.mails, function (e) {
                                        return e.mail_id === mail.mail_id;
                                    });
                                });
                                selected.length = 0;
                                kzi.msg.success('邮件删除成功');
                            }), t.close();
                        }, e.js_close = function () {
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


        $scope.toggleAll = function (mails) {
            $scope.selectAll = !$scope.selectAll;
            if ($scope.selectAll) {
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.global.right_sidebar_show_part = 2;
                _.each(mails, function (mail) {
                    var o = _.findWhere($rootScope.selectedMails, {
                        mail_id: mail.mail_id
                    });
                    o || $rootScope.selectedMails.push(mail);
                    mail.checked = true;
                })
            } else {
                $scope.clear();
            }
        };

        $scope.toggle = function (e, event) {
            if (event) {
                event.stopPropagation();
            }
            ;
            e.checked = !e.checked;
            if (e.checked) {
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.global.right_sidebar_show_part = 2;
                $rootScope.selectedMails.push(e)
            } else {
                var i = _.findWhere($rootScope.selectedMails, {
                    mail_id: e.mail_id
                });
                i && ($rootScope.selectedMails = _.reject($rootScope.selectedMails, function (t) {
                    return t.mail_id === e.mail_id
                }));
                $scope.selectAll = false;
                if ($rootScope.selectedMails.length == 0) {
                    $scope.clear();
                }
            }
        };

        $scope.js_bash_delete_pop = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_delete_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        }, e.js_delete_task = function () {
                            n.project.tasks = _.reject(n.project.tasks, function (e) {
                                return e.tid == l
                            }), wt.data.task.trash(r, l, function () {
                                n.locator.hide_slide()
                            }), i.is_deleted = 1, t.close(), n.$broadcast(kzi.constant.event_names.on_task_trash, i), n.locator.hide_slide()
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: e
                        }
                    }
                }
            }).open()
        };

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


        $scope.js_cancel_edit_mail = function () {
            $scope.show_add_mail = !1,
                $scope.edit_mail.name = "",
                $scope.edit_mail.content = "",
                $scope.edit_mail.subject = "",
                $scope.edit_mail.watchers = [u],
                $scope.selectAll = false;
            $scope.clear();
        };

        $scope.js_show_template = function () {
            $scope.template = wt.bus.mail.getTemplate({mainCatalogCode: "0010", page: "1"});
        };

        $scope.js_mails_switch = function (e) {
            if(!$scope.part_loading_done){
                return false;
            }

            if ($scope.current_tab !== e) {
                switch (e) {
                    case 0:
                        $scope.queryCondition.status = "";
                        break;
                    case 1:
                        $scope.queryCondition.status = "isOpend";
                        break;
                    case 2:
                        $scope.queryCondition.status = "isNotOpend";
                        break;
                    default:
                        ;
                }
                $scope.clear();
                $scope.current_tab = e;
                $scope.selectAll = false;
            }
        };

        $scope.js_toggle_member = function (e) {
            wt.bus.mail.toggle_watcher_member(e, $scope.edit_mail, o);
        };

        $scope.js_toggle_task = function (e) {
            wt.bus.mail.toggle_task_member(e, $scope.edit_mail, o);
        };

        $scope.js_save_mail = function (mail_form) {
            //$scope.edit_mail.content=html2markdown($("#fa-editor-mail .edit-area").html());
            //$scope.edit_mail.content=$("#fa-editor-mail .edit-area").html();
            $scope.is_saving = !0;
            var n = _.pluck($scope.edit_mail.watchers, "uid");
            var m = _.pluck($scope.edit_mail.tasks, "tid");
            var content = MdParse($scope.edit_mail.content);
            $scope.is_saving = true;
            var from = $scope.edit_mail.display_name + "<" + $scope.edit_mail.email + ">";
            var templateId = $scope.edit_mail.template_id;
            wt.data.email.add(o, $scope.edit_mail.subject, content, n, m, from, templateId, function (i) {
                //$scope.mails = $scope.mails || [];
                //angular.forEach(i.data, function (mail) {
                //    $scope.mails.unshift(mail);
                //});
                loadMails($scope.queryCondition);
            }, null, function () {
                $scope.is_saving = !1;
                $scope.js_cancel_edit_mail();
                $rootScope.open_mail_prompt();
            });
        };

        $scope.js_show_mail_menu = function (i, a, s, r) {
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
        };
        $scope.show_mail_status_describe=function(){
            $modal.open({
                scope:$scope,
                templateUrl: '/view/modal/pop_mail_status_describe.html',
                controller: ['$scope',"$modalInstance", function($scope,$modalInstance){
                    $scope.close = function () {
                        $modalInstance.close();
                    }
                }]
            })
        };

        $scope.js_add_mail_watchers_pop = function (i, a) {
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
        };

        $scope.js_add_mail_tasks_pop = function (i, a) {
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
        },
//       $scope.js_show_more_menu = function (i) {
//       $popbox.popbox({
//           target: i,
//           templateUrl: "/view/project/mail/pop_mails_more_menu.html",
//           controller: ["$scope", "popbox", "pop_data",
//               function (t, i) {
//                   t.popbox = i, t.email = o + kzi.constant.mail.domain, t.step = 0, t.js_step = function (e) {
//                       t.step = e
//                   }, t.js_close = function () {
//                       i.close()
//                   }, t.selected_filter = null, t.filter_items = [{
//                       name: "按回复时间",
//                       value: "last_reply_date",
//                       is_selected: !1
//                   }, {
//                       name: "按分享时间",
//                       value: "create_date",
//                       is_selected: !1
//                   }], "last_reply_date" === l ? (t.filter_items[0].is_selected = !0, t.selected_filter = t.filter_items[0]) : (t.filter_items[1].is_selected = !0, t.selected_filter = t.filter_items[1]), t.js_select_filter = function (i) {
//                       t.selected_filter.is_selected = !1, i.is_selected = !0, t.selected_filter = i, t.js_close(), $rootScope.$broadcast(kzi.constant.event_names.filter_mails_by_sort, i.value)
//                   }
//               }
//           ],
//           resolve: {
//               pop_data: function () {
//                   return {
//                       scope: $scope
//                   }
//               }
//           }
//       }).open()
//   },
            $scope.js_slide_change = function (e) {
                e ? $scope.show_add_mail_empty = !!e : $timeout(function () {
                    $scope.show_add_mail_empty = !!e
                }, 400)
            },

//       $scope.js_load_more = function () {
//       d()
//   },
//       $scope.$on(kzi.constant.event_names.filter_mails_by_sort, function (e, i) {
//       _.isEmpty(i) || (l = i), r = 0, $scope.mails = null, d()
//   }),
            $scope.$on(kzi.constant.event_names.on_mail_comment, function (e, i) {
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
        });
    }
]);

//innerApp.controller('mail_opened_ctrl', [
//                                  '$scope',
//                                  '$rootScope',
//                                  function ($scope, $rootScope) {
//                                      $rootScope.global.title = '已打开邮件', $rootScope.global.loading_done = true, $scope.page = 1, $scope.current_type = 'opened';
//                                      var o = function (t) {
//                                          $scope.part_loading_done = false, wt.data.mail.get_list(t, 'opened', function (t) {
//                                              $scope.mails = _.isEmpty($scope.mails) ? t.data : $scope.mails.concat(t.data), 20 > t.data.length && ($scope.has_no_more = true);
//                                          }, null, function () {
//                                              $scope.part_loading_done = true;
//                                          });
//                                      };
//                                      o($scope.page), $scope.js_load_more_mails = function () {
//                                          $scope.page++, o($scope.page);
//                                      }, $scope.js_set_mail_read = function (e, t) {
//                                          wt.data.mail.set_read(t.mail_id, function () {
//                                              t.is_read = true;
//                                          });
//                                      }, $scope.js_open_mail_detail = function (e) {
//                                          $rootScope.locator.to_email(e.pid,e.mail_id,false), wt.data.mail.set_read(e.mail_id, function () {
//                                              e.is_read = true;
//                                          });
//                                      }, $scope.$on(kzi.constant.event_names.on_mail_trash, function (t, i) {
//                                          $scope.mails && ($scope.mails = _.reject($scope.mails, function (e) {
//                                              return e.mail_id === i.mail_id;
//                                          }));
//                                      });
//                                  }
//                              ]);
//
//innerApp.controller('mail_replied_ctrl', [
//                                         '$scope',
//                                         '$rootScope',
//                                         function ($scope, $rootScope) {
//                                             $rootScope.global.title = '已回复邮件', $rootScope.global.loading_done = true, $scope.page = 1, $scope.current_type = 'replied';
//                                             var o = function (t) {
//                                                 $scope.part_loading_done = false, wt.data.mail.get_list(t, 'replied', function (t) {
//                                                     $scope.mails = _.isEmpty($scope.mails) ? t.data : $scope.mails.concat(t.data), 20 > t.data.length && ($scope.has_no_more = true);
//                                                 }, null, function () {
//                                                     $scope.part_loading_done = true;
//                                                 });
//                                             };
//                                             o($scope.page), $scope.js_load_more_mails = function () {
//                                                 $scope.page++, o($scope.page);
//                                             }, $scope.js_set_mail_read = function (e, t) {
//                                                 wt.data.mail.set_read(t.mail_id, function () {
//                                                     t.is_read = true;
//                                                 });
//                                             }, $scope.js_open_mail_detail = function (e) {
//                                                 $rootScope.locator.to_email(e.pid,e.mail_id,false), wt.data.mail.set_read(e.mail_id, function () {
//                                                     e.is_read = true;
//                                                 });
//                                             }, $scope.$on(kzi.constant.event_names.on_mail_trash, function (t, i) {
//                                                 $scope.mails && ($scope.mails = _.reject($scope.mails, function (e) {
//                                                     return e.mail_id === i.mail_id;
//                                                 }));
//                                             });
//                                         }
//                                     ]);