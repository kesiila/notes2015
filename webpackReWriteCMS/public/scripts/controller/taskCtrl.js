"use strict";
innerApp.controller("entity_task_ctrl", ["$scope", "$element", "$routeParams", "$rootScope", "$location", "$popbox", "$timeout", '$modal', 'isLengthOKFilter', "$window", "wtPrompt", "$http", "googleIP",
    function ($scope, $element, $routeParams, $rootScope, $location, $popbox, $timeout, $modal, isLengthOKFilter, $window, wtPrompt, $http, googleIP) {
        //改变热门状态
        $scope.js_hot = function (entity) {
            if (!_.isEmpty(entity)) {
                var value = entity.isHot == 0 ? 1 : 0;

                wt.data.hot(entity.objectId, "customer", value, function () {
                    kzi.msg.success("操作成功！");
                    entity.isHot = value;
                }, function () {
                    kzi.msg.error("操作失败！");
                }, function () {
                });
            }
        };
        function m() {
            $scope.permission === kzi.constant.permission.ok
            && $rootScope.project.info.curr_role !== kzi.constant.role.guest
            && ($scope.pop_member_options = [
                {
                    name: "从活动移除",
                    ongoing: "移除中...",
                    click: function (t, i, a, s) {
                        a.assigned = !0;
                        wt.bus.member.set_task_member_toggle(pid, $scope.task, a, function () {
                            a.setting_toggle_member = !1;
                            $rootScope.$broadcast(kzi.constant.event_names.on_task_update, $scope.task);
                            a.assigned = !1;
                        }, null, s);
                    }
                }
            ])
        }

        function h() {
            $scope.permission === kzi.constant.permission.ok
            && ($scope.pop_watcher_options = [
                {
                    name: "取消关注",
                    ongoing: "取消中...",
                    click: function (t, i, n, a) {
                        wt.bus.watch.unwatch(pid, $scope.task, kzi.constant.xtype.task, $scope.task.tid, n, function () {
                        }, null, a);
                    }
                }
            ])
        }

        var pid, l;
        //显示与隐藏描述栏
        $scope.show_desc = false;
        $scope.toggle_desc = function () {
            $scope.show_desc = $scope.show_desc ? false : true;
        };
        $scope.token = kzi.get_cookie("sid");
        $scope.is_new_mail = false;
        $scope.detailed = false;
        var c, u = function (e, t, i) {
                var a = t.temp_name,
                    s = kzi.config.default_pos;
                if (!_.isEmpty(e.todos)) {
                    var o = _.max(e.todos, function (e) {
                        return e.pos
                    });
                    s = o.pos + kzi.config.default_pos
                }
                t.temp_name = "", wt.data.task.add_todo(pid, l, a, s, function (t) {
                    e.todos.push(t.data), e = d(e), $rootScope.$broadcast(kzi.constant.event_names.on_task_update, e)
                }, null, function () {
                    _.isFunction(i) && i()
                })
            },
            d = function (e) {
                var t = _.size(e.todos),
                    i = _.size(_.where(e.todos, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.todo_checked_count = i, e.badges.todo_count = t, e
            },
            p = function () {
                _.isEmpty($scope.task.todos) || ($scope.task.todos = _.sortBy($scope.task.todos, function (e) {
                    return e.pos
                }))
            },
            f = function () {
                $scope.todo_sort_options = {
                    containment: ".task-todos",
                    placeholder: "todo-placeholder",
                    helper: "clone",
                    revert: 10,
                    dropOnEmpty: !0,
                    tolerance: "pointer",
                    distance: "4",
                    delay: "75",
                    disabled: !1,
                    start: function (e, t) {
                        $(".todo-placeholder").css({
                            height: t.item.outerHeight() + 10,
                            width: t.item.css("width")
                        })
                    },
                    stop: function (t, i) {
                        var n = i.item.attr("todo-id"),
                            a = _.findWhere($scope.task.todos, {
                                todo_id: n
                            }),
                            s = i.item.next().attr("todo-id"),
                            o = i.item.prev().attr("todo-id"),
                            l = 0;
                        if (_.isEmpty(s)) {
                            var c = _.findWhere($scope.task.todos, {
                                todo_id: o
                            });
                            l = c.pos / 2 + 1
                        } else if (_.isEmpty(o)) {
                            var u = _.findWhere($scope.task.todos, {
                                todo_id: s
                            });
                            l = u.pos + kzi.config.default_pos + 1
                        } else {
                            var c = _.findWhere($scope.task.todos, {
                                    todo_id: o
                                }),
                                u = _.findWhere($scope.task.todos, {
                                    todo_id: s
                                });
                            l = (c.pos + u.pos) / 2 + 1
                        }
                        a.pos !== l && (a.pos = l, wt.data.task.update_todo_pos(pid, $scope.task.tid, a.todo_id, l, function () {
                            p()
                        }))
                    }
                }
            };
        var c1, u1 = function (e, t, i) {
            var a = t.temp_name,
                s = kzi.config.default_pos;
            if (!isLengthOKFilter(a, 16)) {
                kzi.msg.warn("标签名称长度不能大于8个~", function () {
                })
                return this;
            }
            if (!_.isEmpty(e.tags)) {
                var o = _.max(e.tags, function (e) {
                    return e.pos
                });
                s = o.pos + kzi.config.default_pos
            }
            t.temp_name = "";
            var names = [];
            _.each(e.tags, function (tag) {
                if (tag.name) {
                    names.push(tag.name);
                }
            });
            if (names.indexOf(a) == -1) {
                wt.data.task.add_tag(pid, l, a, s, function (t) {
                    e.tags = e.tags || [];
                    e.tags.push(t.data), e = d1(e), $rootScope.$broadcast(kzi.constant.event_names.on_task_update, e)
                }, null, function () {
                    _.isFunction(i) && i()
                })
            } else {
                kzi.msg.warn("标签已存在~", function () {
                })
            }
        }, d1 = function (e) {
            var t = _.size(e.tags),
                i = _.size(_.where(e.tags, {
                    checked: 1
                }));
            return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
        }, p1 = function () {
            _.isEmpty($scope.task.tags) || ($scope.task.tags = _.sortBy($scope.task.tags, function (e) {
                return e.pos
            }))
        }, f1 = function () {
            $scope.tag_sort_options = {
                containment: ".task-tags",
                placeholder: "tag-placeholder",
                helper: "clone",
                revert: 10,
                dropOnEmpty: !0,
                tolerance: "pointer",
                distance: "4",
                delay: "75",
                disabled: !1,
                start: function (e, t) {
                    $(".tag-placeholder").css({
                        height: t.item.outerHeight() + 10,
                        width: t.item.css("width")
                    })
                },
                stop: function (t, i) {
                    var n = i.item.attr("tag-id"),
                        a = _.findWhere($scope.task.tags, {
                            tag_id: n
                        }),
                        s = i.item.prev().attr("tag-id"),
                        o = i.item.next().attr("tag-id"),
                        l = 0;
                    if (_.isEmpty(s)) {
                        var c = _.findWhere($scope.task.tags, {
                            tag_id: o
                        });
                        l = c.pos / 2 + 1
                    } else if (_.isEmpty(o)) {
                        var u = _.findWhere($scope.task.tags, {
                            tag_id: s
                        });
                        l = u.pos + kzi.config.default_pos + 1
                    } else {
                        var c = _.findWhere($scope.task.tags, {
                                tag_id: o
                            }),
                            u = _.findWhere($scope.task.tags, {
                                tag_id: s
                            });
                        l = (c.pos + u.pos) / 2 + 1
                    }
                    a.pos !== l && (a.pos = l, wt.data.task.update_tag_pos(pid, $scope.task.tid, a.tag_id, l, function () {
                        p1()
                    }))
                }
            }
        };

        $scope.task = {}, $scope.$on(kzi.constant.event_names.on_slide_hide, function () {
            var n = {
                tid: $scope.task.tid
            };
            if ($scope.task.xtype == kzi.constant.xtype.task) {
                _.isEmpty($scope.task.temp_name) || (n.temp_name = $scope.task.temp_name),
                _.isEmpty($scope.task.temp_desc) || (n.temp_desc = $scope.task.temp_desc),
                _.isEmpty($scope.task.temp_title) || (n.temp_title = $scope.task.temp_title),
                _.isEmpty($scope.task.temp_enName) || (n.temp_enName = $scope.task.temp_enName),
                _.isEmpty($scope.task.temp_cnName) || (n.temp_cnName = $scope.task.temp_cnName),
                _.isEmpty($scope.task.temp_imageUrl) || (n.temp_imageUrl = $scope.task.temp_imageUrl),
                _.isEmpty($scope.task.temp_url) || (n.temp_url = $scope.task.temp_url),
                _.isEmpty($scope.task.temp_organizer_id) || (n.temp_organizer_id = $scope.task.temp_organizer_id),
                    $scope.task = n
            } else if ($scope.task.xtype == kzi.constant.xtype.reward) {
                _.isEmpty($scope.task.temp_name) || (n.temp_name = $scope.task.temp_name),
                _.isEmpty($scope.task.temp_score) || (n.temp_score = $scope.task.temp_score),
                _.isEmpty($scope.task.temp_desc) || (n.temp_desc = $scope.task.temp_desc)
            } else {
                _.isEmpty($scope.task.temp_name) || (n.temp_name = $scope.task.temp_name),
                _.isEmpty($scope.task.temp_desc) || (n.temp_desc = $scope.task.temp_desc)
            }
        }), $scope.get_task_labels = function (pid, task) {
            var project_info = _.find($rootScope.teams[0].projects, function (project) {
                return project.pid === pid;
            });
            if (project_info) {
                var project_labels = project_info.labels;
                task.labels = _.chain(task.labels)
                    .map(function (label) {
                        label.desc = _.find(project_labels, function (project_label) {
                            return project_label.name == label.name;
                        }).desc;
                        return label;
                    })
                    .filter(function (label) {
                        if (!_.isEmpty(label.desc)) {
                            return !!label.desc.trim();
                        } else {
                            return false;
                        }
                    })
                    .value();
            }
            ;
            return task;
        },

        /**
         * 加载数据 init
         */
            $scope.$on(kzi.constant.event_names.on_task_update, function (e, task) {
                _.extend($scope.task, task);
            });
        $scope.$on(kzi.constant.event_names.load_entity_task, function (t, i) {
            $scope.is_email_checking = false;
            pid = $scope.pid = i.pid;
            l = i.tid;
            $scope.select_tab_comment();
            $scope.section_loading_done = !1;
            $scope.is_show_more = !1;
            $rootScope.load_task(pid, l, function (t, program) {
                $scope.permission =  kzi.constant.permission.ok;
                $scope.task_exist = true;
                $scope.project = t;
                $scope.task.xtype = program.xtype;
                program.is_lesson = _.chain(program.tags).filter(function (i) {
                        return i.tag_id === "program_type_lesson"
                    }).value().length > 0;
                $scope.task = program;
                $rootScope.$broadcast(kzi.constant.event_names.entity_loading_done, {
                    pid: $scope.pid,
                    xid: i.tid,
                    xtype: "task",
                    entity: $scope.task
                });
                $scope.task && $scope.task.tid === program.tid && $scope.task.xtype == kzi.constant.xtype.task &&
                (_.isEmpty($scope.task.temp_name) || (program.temp_name = $scope.task.temp_name),
                _.isEmpty($scope.task.temp_title) || (program.temp_title = $scope.task.temp_title),
                _.isEmpty($scope.task.temp_enName) || (program.temp_enName = $scope.task.temp_enName),
                _.isEmpty($scope.task.temp_cnName) || (program.temp_cnName = $scope.task.temp_cnName),
                _.isEmpty($scope.task.temp_imageUrl) || (program.temp_imageUrl = $scope.task.temp_imageUrl),
                _.isEmpty($scope.task.temp_url) || (program.temp_url = $scope.task.temp_url),
                _.isEmpty($scope.task.temp_organizer_id) || (program.temp_organizer_id = $scope.task.temp_organizer_id),
                _.isEmpty($scope.task.temp_desc) || (program.temp_desc = $scope.task.temp_desc)),

                $scope.task && $scope.task.tid === program.tid && $scope.task.xtype == kzi.constant.xtype.reward &&
                (_.isEmpty($scope.task.temp_name) || (program.temp_name = $scope.task.temp_name),
                _.isEmpty($scope.task.temp_score) || (program.temp_score = $scope.task.temp_score),
                _.isEmpty($scope.task.temp_desc) || (program.temp_desc = $scope.task.temp_desc)),
                    $scope.task = program,
                !$rootScope.global.is_outter && ($scope.task = $scope.get_task_labels($scope.pid, $scope.task));
                $scope.task.email = ($scope.task.email || "").indexOf("***") > -1 ? "查看邮箱" : $scope.task.email,
                    wt.data.task.xtype = program.xtype,
                    $scope.detailed = true;
                    $timeout(function () {
                        $scope.task = d(program);
                        p();
                    }),
                    !$scope.$$phase, _.isEmpty(program.files) ? wt.data.file.get_attach_list(pid, $scope.task.xtype, l, function (e) {
                    e.data && e.data.length > 0 && (_.each(e.data, function (e) {
                        e.icon = kzi.helper.build_file_icon(e)
                    }), program.files = e.data)
                }, null, function () {
                    $scope.section_loading_done = !0
                }) : (_.each(program.files, function (e) {
                    e.icon = kzi.helper.build_file_icon(e)
                }), $scope.section_loading_done = !0), $scope.$broadcast(kzi.constant.event_names.load_mails, {
                    pid: pid,
                    xid: l,
                    xtype: _.isEmpty($scope.task.xtype) ? kzi.constant.xtype.task : $scope.task.xtype,
                    mail_id: i.mail_id
                }), $scope.$broadcast(kzi.constant.event_names.load_comments, {
                    pid: pid,
                    xid: l,
                    xtype: _.isEmpty($scope.task.xtype) ? kzi.constant.xtype.task : $scope.task.xtype,
                    comment_id: i.comment_id
                })
            }, function (t) {
                $scope.task_exist = false;
                $scope.section_loading_done = !0;
                t.code == kzi.statuses.task_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
            })
        });
        $scope.js_show_more = function () {
            $scope.is_show_more = !0;
        };
        $scope.js_move = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_move_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        }, $rootScope.load_tasks(pid, function (t) {
                            _.isEmpty(t.entries) || (e.entries = t.entries, e.tasks = t.tasks, _.each(e.entries, function (e) {
                                e.move_selected = e.entry_id === i.entry_id ? 1 : 0
                            }))
                        }), e.js_move_to = function (a) {
                            if (_.each(e.entries, function (e) {
                                    e.move_selected = 0
                                }), a.move_selected = 1, a) {
                                var s = kzi.config.default_pos,
                                    o = _.where(e.tasks, {
                                        entry_id: a.entry_id
                                    });
                                null !== o && o.length > 0 && (s = _.max(o, function (e) {
                                        return e.pos
                                    }).pos + kzi.config.default_pos + 1);
                                var c = i.entry_id;
                                wt.data.task.move(pid, l, i.entry_id, a.entry_id, s, function () {
                                }), $rootScope.locator.show_prj && $rootScope.refresh_cache.task.move(l, i.entry_id, a.entry_id, s), i.entry_id = a.entry_id, i.entry_name = a.name, $rootScope.$broadcast(kzi.constant.event_names.on_task_move, i, c)
                            }
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
        }, $scope.js_publish = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_publish_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function ($scope, popbox, pop_data) {
                        $scope.popbox = popbox, $scope.js_close = function () {
                            popbox.close()
                        };
                        $rootScope.load_tasks(pid, function (t) {
                            _.isEmpty(t.entries) || ($scope.entries = t.entries, $scope.tasks = t.tasks, _.each($scope.entries, function (e) {
                                e.move_selected = e.entry_id === i.entry_id ? 1 : 0
                            }))
                        });
                        $scope.js_move_to = function (a) {
                            if (_.each($scope.entries, function (e) {
                                    e.move_selected = 0
                                }), a.move_selected = 1, a) {
                                var s = kzi.config.default_pos,
                                    o = _.where($scope.tasks, {
                                        entry_id: a.entry_id
                                    });
                                null !== o && o.length > 0 && (s = _.max(o, function (e) {
                                        return e.pos
                                    }).pos + kzi.config.default_pos + 1);
                                var entry_id = i.entry_id;
                                wt.data.task.move(pid, l, i.entry_id, a.entry_id, s, function () {
                                    pop_data.scope.task.is_published = true;
                                });
                                $rootScope.locator.show_prj && $rootScope.refresh_cache.task.move(l, i.entry_id, a.entry_id, s), i.entry_id = a.entry_id, i.entry_name = a.name, i.is_published = 1, $rootScope.$broadcast(kzi.constant.event_names.on_task_move, i, entry_id)
                            }
                            popbox.close()
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
        }, $scope.js_show_copy = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_copy_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t;
                        e.new_task = wt.bus.task.get_copy_task(i);
                        e.js_copy_task = function (t) {
                            _.isEmpty(t.name) || (e.is_copying = !0, wt.data.task.copy_task(pid, t.tid, t.name, 0, t.keep_comments, t.keep_members, t.keep_labels, t.keep_attachments, t.keep_todos, t.keep_watchers, function (i) {
                                e.js_close();
                                var a = _.findWhere($rootScope.project.tasks, {
                                    tid: t.tid
                                });
                                a || $rootScope.project.tasks.push(t), $rootScope.$broadcast("socket_message_task_add", {
                                    task: i.data
                                })
                            }, null, function () {
                                e.is_copying = !1
                            }))
                        };
                        e.js_close = function () {
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
        $scope.js_untrash =  function (t, task) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_untrash_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (scope, t) {
                        scope.task = task;
                        scope.popbox = t;
                        scope.js_close = function () {
                            t.close();
                        };
                        scope.js_untrash_task = function () {
                            $rootScope.untrash_entity(task.eid, task.uid, "task" ,function () {
                                $rootScope.locator.hide_slide();
                                scope.close();
                                kzi.msg.success('成功恢复到待审核状态!');
                                $rootScope.$broadcast(kzi.constant.event_names.on_program_untrash,{
                                    eid: task.eid
                                });
                            });
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
        $scope.js_trash = function (t, task) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_delete_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (scope, t) {
                        scope.task = task;
                        scope.popbox = t;
                        scope.js_close = function () {
                            t.close();
                        };
                        scope.js_delete_task = function () {
                            $rootScope.del_entity(task.eid, task.uid, "task", false ,function () {
                               $rootScope.$broadcast(kzi.constant.event_names.on_program_trash, task);
                                $rootScope.locator.hide_slide();
                                t.close();
                            });

                        }
                        scope.js_delete_group = function (task) {
                            wt.data.task.trash_by_group("", task.groupId, function () {}, function () {}, function () {});
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

        $scope.js_sync_image = function (event, task) {
            $popbox.popbox({
                target: event,
                templateUrl: "/view/project/task/pop_sync_image_url.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (scope, t) {
                        scope.task = task;
                        scope.popbox = t;
                        scope.is_saving = false;
                        scope.js_close = function () {
                            t.close();
                        };
                        scope.js_ensure = function (task) {
                           $scope.is_saving = true;
                           wt.data.task.sync_image_url(task.eid, function (resp) {
                               scope.is_saving = false;
                               scope.js_close();
                               kzi.msg.success(makeMsg(resp.totalItems),function () {});
                            });
                        }

                        function makeMsg(count) {
                            return "同步成功~";
                           if(count == 0) {
                              return "没有相同的课程~";
                           } else {
                               return ["同步成功",count,"条课程~"].join("");
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
        $scope.js_trash_group = function (t, task) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_delete_task_group.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (scope, t) {
                        scope.task = task;
                        scope.popbox = t;
                        scope.js_close = function () {
                            t.close();
                        };
                        scope.js_delete_group = function (task) {
                            if(_.isEmpty(task.groupId)) {
                                $rootScope.del_entity(task.eid, task.uid, "task", false ,function () {
                                    $rootScope.$broadcast(kzi.constant.event_names.on_program_trash, task);
                                    $rootScope.locator.hide_slide();
                                    t.close();
                                });
                            } else if(!_.isEmpty(task.groupId)) {
                                wt.data.task.trash_by_group("", task.groupId, function (resp) {
                                    $rootScope.$broadcast(kzi.constant.event_names.on_program_trash_group, task);
                                    $rootScope.locator.hide_slide();
                                    t.close();
                                }, function () {
                                    kzi.msg.error("删除失败！");
                                }, function () {
                                });
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
        $scope.js_add_program = function (target, task) {
            $rootScope.$broadcast(kzi.constant.event_names.on_program_add_with_old,task);
            $rootScope.locator.hide_slide();
        };

        /**
         * 举报活动
         * @param event
         * @param task
         */
        $scope.js_report_task = function (event, task) {
            event.stopPropagation();
            $modal.open({
                templateUrl: '/view/modal/report.html',
                controller: ['$scope', '$rootScope', '$location', '$modalInstance', function ($scope, $rootScope, $location, $modalInstance) {
                    $scope.title = "活动";
                    $scope.name = $rootScope.global.me && $rootScope.global.me.display_name;
                    $scope.email = $rootScope.global.me && $rootScope.global.me.email;
                    $scope.categoryList = [{"type": 1, "value": "邮箱地址有误"}, {"type": 2, "value": "行业信息有误"}, {
                        "type": 3,
                        "value": "产品信息有误"
                    }, {"type": 4, "value": "其他"}];
                    $scope.category = $scope.categoryList[0];
                    $scope.content = "";
                    $scope.type1 = false;
                    $scope.type2 = false;
                    $scope.type3 = false;
                    $scope.type4 = false;
                    $scope.error_msg = "";
                    $scope.close = function () {
                        $modalInstance.close();
                    };

                    $scope.js_submit = function () {
                        var type = "";
                        $scope.type1 && (type += $scope.categoryList[0].type + ";");
                        $scope.type2 && (type += $scope.categoryList[1].type + ";");
                        $scope.type3 && (type += $scope.categoryList[2].type + ";");
                        $scope.type4 && (type += $scope.categoryList[3].type + ";");

                        if (type == "" && $scope.content == "") {
                            $scope.error_msg = "请至少选择一项举报原因或填写举报详情！";
                        } else {
                            wt.data.report.report("customer", {
                                    "message": $scope.content,
                                    "oid": task.objectId,
                                    "reportType": type
                                },
                                function (resp) {
                                    if (!_.isEmpty(resp) && 200 == resp.code) {
                                        kzi.msg.success("非常感谢您的反馈，我们将尽快处理，欢迎常来棒呆~");
                                    }
                                },
                                function () {
                                },
                                function () {
                                    $modalInstance.close();
                                }
                            );
                        }
                    }
                }]
            });
        };
        /**
         * 分享单个活动
         * @param target
         * @param program
         */
        $scope.js_task_share = function (event, program) {
            event.stopPropagation();
            $popbox.popbox({
                target: event,
                templateUrl: "/view/common/pop_publish_entity.html",
                controller: ["$scope", "popbox", "pop_data", "$timeout", "$rootScope",
                    function ($scope, popbox, pop_data, $timeout, $rootScope) {
                        $scope.popbox = popbox;
                        $scope.is_publishing = false;
                        $scope.publish_success = false;
                        $scope.result_code = 0;
                        $scope.entity = "活动";

                        $scope.js_publish_entity = function (publish_entity_form) {
                            $scope.is_publishing = true;
                            wt.data.task.publish(program.pid, program.eid,
                                function () {
                                    $scope.result_code = 200;
                                    program.status = 1;
                                    $rootScope.$broadcast(kzi.constant.event_names.on_program_publish, program.eid);
                                    $timeout($scope.js_close, 2000);
                                }, function (resp) {
                                    $scope.result_code = resp.code;
                                }, function () {
                                    $scope.is_publishing = false;
                                    $scope.publish_success = true;
                                }
                            );
                        };
                        $scope.js_close = function () {
                            popbox.close()
                        };
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
        };
        /**
         * 收藏单个活动
         * @param target
         * @param customer
         */
        $scope.js_task_collect = function (target, customer) {
            target.stopPropagation();
            if ($rootScope.global.is_outter && $rootScope.need_login('/customer')) {
                $popbox.popbox({
                    target: target,
                    placement: 'right',
                    templateUrl: "/view/common/pop_collect_task.html",
                    controller: ["$scope", "popbox", "pop_data", "$rootScope",
                        function ($scope, popbox, pop_data, $rootScope) {
                            $scope.popbox = popbox;
                            $scope.selectedCount = 1;
//                            $scope.isFree = _.isEmpty(customer.email);
//                            $scope.haveScore = $rootScope.global.me.score >= 10;
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
                                $scope.is_save_ing = true;
//                                ($scope.isFree || $rootScope.global.me.score * 1-10>=0)//免费的，或者积分足够
//                                && (
                                wt.data.task.collect(
                                    $scope.collect_task.project.pid,
                                    true,
                                    customer.objectId,
                                    function (resp) {
                                        $scope.send_success = true;
                                        if (!_.isEmpty(resp)) {
                                            customer.email = resp.data.email;
                                            customer.phone = resp.data.phone;
                                            customer.collected = true;
                                        }
                                        //收藏成功发送广播讲今天收藏的活动数+1
                                        $rootScope.$broadcast(kzi.constant.event_names.public_customer_colloct_success, null);
                                    }, function (resp) {
                                        if (!_.isEmpty(resp)) {
                                            var code = resp.code;
                                            if (2005 == code) {
                                                kzi.msg.error("未登录或活动不存在！");
                                            }
                                            else if (500 == code) {
                                                kzi.msg.error("后台错误，收藏失败！");
                                            }
                                        }
                                    }, function () {
                                        $scope.is_save_ing = true;
                                        customer.checked = false;
                                        $rootScope.selectedTasks = _.reject($rootScope.selectedTasks, function (i) {
                                            return i.tid == customer.tid;
                                        })
                                        $rootScope.$broadcast(kzi.constant.event_names.public_customer_colloct, {
                                            tid: customer.tid
                                        });
                                    })
                            };
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
        $scope.search_email = function (task) {
            function search(url) {
                if (!_.isEmpty(googleIP.ip)) {
                    window.open(googleIP.ip + url);
                } else {
                    kzi.msg.warn("搜索服务暂不可用，请刷新一下再试一次！");
                }
            };
            function url_for_email(url) {
                var website = task.website;
                if (!_.isEmpty(website)) {
                    website.indexOf("www.") == -1 || (website = website.substr(website.indexOf("www.") + 4 * 1));
                    website.indexOf("http://") == -1 || (website = website.substr(website.indexOf("http://") + 7 * 1));
                    website.indexOf("/") == -1 || (website = website.substr(0, website.indexOf("/")));
                    url = url + "%22email * * " + website + "%22";
                }
                !_.isEmpty(task.company) && (url = url + "%20OR%20intext:%22" + task.company + "%22%2B%22email * *%22");
                !_.isEmpty(task.name) && (url = url + "%20OR%20intext:%22" + task.name + "%22%2B%22email * *%22");
                return url;
            };
            var url = '';
            url = url_for_email(url);
            if (url.indexOf("%20OR%20") == 0) {
                url = url.substr(url.indexOf("%20OR%20") + 8 * 1);
            }
            search("/?gws_rd=ssl#q=" + url);
        }
        $scope.js_mail = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_mail_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        }, e.js_mail_task = function () {
                            wt.data.task.mail(pid, l, function () {
                                e.send_success = !0
                            }), $rootScope.$broadcast(kzi.constant.event_names.on_task_mail, i)
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
        $scope.js_archive = function () {
            $rootScope.project.tasks = _.reject($rootScope.project.tasks, function (e) {
                return e.tid == l
            }), wt.data.task.archive(pid, l, function () {
                $rootScope.locator.hide_slide()
            }), $scope.task.archived = 1, $rootScope.$broadcast(kzi.constant.event_names.on_task_trash, $scope.task), $rootScope.locator.hide_slide()
        };
        $scope.js_complete_task = function (t) {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.completed ? (t.completed = 0, wt.data.task.uncomplete(pid, l, function () {
                $rootScope.$broadcast(kzi.constant.event_names.on_task_complete, t)
            })) : (t.completed = 1, wt.data.task.complete(pid, l, function () {
                $rootScope.$broadcast(kzi.constant.event_names.on_task_complete, t)
            })))
        };
        $scope.$on(kzi.constant.event_names.on_task_complete, function (t, i) {
            _.isEmpty(i) || i.tid === $scope.task.tid && ($scope.task.completed = i.completed)
        });

        /**
         * 监听活动分享事件
         */
        $rootScope.$on(kzi.constant.event_names.on_task_share, function (t, i) {
            _.isEmpty(i) || i !== $scope.task.tid || ($scope.task.is_published = 1)
        });

        $scope.$on(kzi.constant.event_names.on_task_comment, function (t, i) {
            _.isEmpty(i) || i.tid !== $scope.task.tid || ($scope.task.badges.comment_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, $scope.task))
        });
        $scope.$on(kzi.constant.event_names.on_task_mail, function (t, i) {
            _.isEmpty(i) || i.tid !== $scope.task.tid || ($scope.task.badges.mail_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, $scope.task))
        });
        $scope.$on(kzi.constant.event_names.on_task_badges_file, function (t, i) {
            i && "task" === i.type && $scope.task.tid === i.file.formData.tid && (_.isArray($scope.task.files) ? $scope.task.files.push(i.file) : $scope.task.files = [i.file], _.isArray($scope.task.files) && ($scope.task.badges.file_count = $scope.task.files.length))
        });
        $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
            $rootScope.locator.type !== kzi.constant.entity_type.task || _.isEmpty($scope.task) || $scope.js_show_editor($scope.task)
        });
        $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
            $rootScope.locator.type === kzi.constant.entity_type.task && (_.isEmpty($scope.task) || $scope.task.is_edit !== !0 ? $rootScope.locator.show_slide === !0 && $rootScope.locator.hide_slide() : $scope.js_cancel_editor($scope.task))
        });
        $scope.js_show_more = function (t) {
            t.is_showmore = !0
        };
        $scope.js_hide_more = function (t) {
            t.is_showmore = !1
        };
        $scope.js_show_part_1 = function (t) {
            t.show_part = 1
        };
        $scope.js_show_part_2 = function (t) {
            t.show_part = 2
        };
        $scope.js_show_part_3 = function (t) {
            t.show_part = 3
        };
        $scope.js_show_part_4 = function (t) {
            t.show_part = 4
        };
        $scope.js_show_part_5 = function (t) {
            t.show_part = 5
        };
        $scope.js_show_part_6 = function (t) {
            t.show_part = 6
        };
        $scope.js_show_part_7 = function (t) {
            t.show_part = 7
        };
        $scope.js_show_part_8 = function (t) {
            t.show_part = 8
        };
        $scope.js_show_part_9 = function (t) {
            t.show_part = 9,
                $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                    xtype: "task",
                    xid: $scope.task.tid
                })
        };
        $scope.js_show_mail_editor = function (t) {
            $rootScope.load_project_templates(t.pid, function (t) {
                var n = [];
                _.each(t.templates, function (e) {
                    var t = _.findWhere(i.templates, {
                        template_id: e.template_id
                    });
                    e.assigned = t ? 1 : 0, n.push(e)
                }), $scope.templates = n
            });
            var tasks = [];
            tasks.push(t);
            var obj = {
                tasks: tasks,
                templates: $scope.templates
            };
            /*fixme todo
             should close slide  window
             */
            $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj);
            t.show_part = 3;
            $scope.is_new_mail = !$scope.is_new_mail;
        };
        $scope.js_hide_mail_editor = function (t) {
            $scope.is_new_mail = false;
        };
        $scope.js_show_editor = function (t) {
            if ($scope.permission === kzi.constant.permission.ok && t.xtype == kzi.constant.xtype.task) {
                t.is_edit = !0;
                _.isEmpty(t.temp_name) && (t.temp_name = t.name);
                _.isEmpty(t.temp_enName) && (t.temp_enName = t.enName);
                _.isEmpty(t.temp_cnName) && (t.temp_cnName = t.cnName);
                _.isEmpty(t.temp_title) && (t.temp_title = t.title);
                _.isEmpty(t.temp_maxAge) && (t.temp_maxAge = t.maxAge);
                _.isEmpty(t.temp_minAge) && (t.temp_minAge = t.minAge);
                _.isEmpty(t.temp_organizer_id) && (t.temp_organizer_id = t.organizer_id);
                _.isEmpty(t.temp_imageUrl) && (t.temp_imageUrl = t.imageUrl);
                _.isEmpty(t.temp_url) && (t.temp_url = t.url);
                _.isEmpty(t.temp_desc) && (t.temp_desc = t.desc);
                _.isEmpty(t.temp_fee) && (t.temp_fee = t.fee); //费用
                _.isEmpty(t.temp_quota) && (t.temp_quota = t.quota); //名额
                _.isEmpty(t.temp_isDescMarkDown) && (t.temp_isDescMarkDown = t.isDescMarkDown + "" || "1"); //简介是否是markdown
            }
            $scope.permission === kzi.constant.permission.ok && t.xtype == kzi.constant.xtype.reward &&
                // $scope.permission === kzi.constant.permission.ok &&
            (t.is_edit = !0,
            _.isEmpty(t.temp_name) && (t.temp_name = t.name),
            _.isEmpty(t.temp_score) && (t.temp_score = t.score),
            _.isEmpty(t.temp_desc) && (t.temp_desc = t.desc));

        };
        $scope.js_cancel_editor = function (e) {
            if (e.xtype == kzi.constant.xtype.task) {
                e.is_edit = !1,
                    e.temp_desc = "",
                    e.temp_organizer_id = "",
                    e.temp_imageUrl = "",
                    e.temp_url = "",
                    e.temp_title = "",
                    e.temp_cnName = "",
                    e.temp_enName = "",
                    e.temp_name = ""
            } else if (e.xtype == kzi.constant.xtype.reward) {
                e.is_edit = !1,
                    e.temp_desc = "",
                    e.temp_score = "",
                    e.temp_name = ""
            }
        };
        $scope.js_set_update = function (e, t) {
            if (t.is_saving !== !0) {
                if (_.isEmpty(t.temp_name)) t.temp_name = t.name;
                if (t.xtype == kzi.constant.xtype.task) {
                    t.is_saving = !0;
                    wt.data.task.update(pid, l, t, function (response) {
                        t.is_edit = !1;
                        t.name = t.temp_name;
                        t.enName = t.temp_enName;
                        t.cnName = t.temp_enName;
                        t.title = t.temp_title;
                        t.imageUrl = t.temp_imageUrl;
                        t.url = t.temp_url;
                        t.organizer_id = t.temp_organizer_id;
                        t.desc = t.temp_desc;
                        t.maxAge = t.temp_maxAge;
                        t.minAge = t.temp_minAge;
                        t.quota = t.temp_quota;
                        t.isDescMarkDown = t.temp_isDescMarkDown;
                        t.temp_quota = null;
                        t.temp_maxAge = null;
                        t.temp_minAge = null;
                        t.temp_name = null;
                        t.temp_enName = null;
                        t.temp_enName = null;
                        t.temp_title = null;
                        t.temp_imageUrl = null;
                        t.temp_url = null;
                        t.temp_organizer_id = null;
                        t.temp_desc = null;
                        t.temp_quota = null;
                        $rootScope.$broadcast(kzi.constant.event_names.on_program_update, t);
                    }, function (resp) {
                        if ("7026" == resp.code) {
                            kzi.msg.error("邮箱无效，修改失败！")
                        }
                        else if ("7034" == resp.code) {
                            kzi.msg.error("无信息修改！")
                        }
                        ;
                    }, function () {
                        t.is_saving = !1
                    })
                } else if (t.xtype == kzi.constant.xtype.reward) {
                    t.is_saving = !0, wt.data.reward.update(pid, l, t, function (response) {
                        t.is_edit = !1,
                            t.name = t.temp_name,
                            t.score = t.temp_score,
                            t.desc = t.temp_desc,
                            t.temp_name = null,
                            t.temp_score = null,
                            t.temp_desc = null,
                            $rootScope.$broadcast(kzi.constant.event_names.on_task_update, t)
                    }, null, function () {
                        t.is_saving = !1
                    })
                }
            }
        };
        $scope.js_show_date_setter = function ($event, task) {
            function updateTaskByStartEndDate(obj /* { start_date:...,end_date:...}*/) {
                wt.data.task.set_date(l, obj.start_date, obj.end_date, function () {
                    task.startDate = obj.start_date;
                    task.endDate = obj.end_date;
                    $rootScope.$broadcast(kzi.constant.event_names.on_task_update, task);
                })
            }

            $popbox.popbox({
                target: $event,
                templateUrl: '/view/directive/dateList/pop_add_date.html',
                controller: 'pop_new_date_select_ctrl',
                resolve: {
                    pop_data: function () {
                        return {
                            save_success: true,
                            process: updateTaskByStartEndDate,
                            scope: $scope
                        };
                    }
                }
            }).open();
        };
        $scope.js_show_datepicker = function (t, i, start) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/common/pop_datepicker.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        if (start) {
                            i.date_temp = i.startDate ? moment(i.startDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
                        } else {
                            i.date_temp = i.endDate ? moment(i.endDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
                        }
                        ;
                        e.popbox = t, e.task = i, e.js_close = function () {
                            t.close()
                        }, e.js_today = function () {
                            var t = moment().format("YYYY-MM-DD");
                            e.set_date(t, start)
                        }, e.js_tomorrow = function () {
                            var t = moment().add("days", 1).format("YYYY-MM-DD");
                            e.set_date(t, start)
                        }, e.js_week = function () {
                            var t = moment().endOf("week").add("days", 1).format("YYYY-MM-DD");
                            e.set_date(t, start)
                        }, e.js_next_week = function () {
                            var t = moment().add("days", 7).endOf("week").add("days", 1).format("YYYY-MM-DD");
                            e.set_date(t, start)
                        }, e.js_month = function () {
                            var t = moment().endOf("month").format("YYYY-MM-DD");
                            e.set_date(t, start)
                        }, e.js_set_date = function (t) {
                            e.set_date(t, start)
                        }, e.js_cancel_date = function () {
                            if (start) {
                                i.startDate = 0;
                                wt.data.task.set_start(l, 0, function () {
                                });
                            } else {
                                i.endDate = 0;
                                wt.data.task.set_end(l, 0, function () {
                                });
                            }
                            ;
                            i.badges.expire_date = 0, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i), t.close()
                        }, e.js_cancel_expire = function () {
                            i.expire_date = 0, i.badges.expire_date = 0, wt.data.task.set_expire(pid, l, 0, function () {
                            }), $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i), t.close()
                        }, e.set_date = function (e, start) {
                            var a = moment(e).endOf("day").valueOf();
                            if (start) {
                                wt.data.task.set_start(l, a, function () {
                                    i.startDate = a, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i), t.close()
                                })
                            } else {
                                wt.data.task.set_end(l, a, function () {
                                    i.endDate = a, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i), t.close()
                                })
                            }
                        }, e.set_expire = function (e) {
                            var a = moment(e).endOf("day").valueOf();
                            wt.data.task.set_expire(pid, l, a, function () {
                                i.expire_date = a, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i), t.close()
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
        /*            $scope.search_email_from_google = function (task) {

         $window.open("/tools/search?company_name=" + task.company + "&company_web=" + task.website + "&contacts=" + task.name + "&tab_type=email");
         };*/

        /**
         * 检测邮箱地址
         * @param t
         */
        $scope.js_check_mail = function (t) {
            var successFunc = function (resp) {
                if ('0' == resp.data) {
                    kzi.msg.success("有效邮箱！");
                    $scope.task.mailStatus == 0;
                    $scope.task.isFree = false;
                } else if ('-1' == resp.data) {
                    kzi.msg.error("邮箱已在黑名单中！");
                    $scope.task.mailStatus == 1;
                    $scope.task.isFree = true;
                } else if ('00' == resp.data) {
                    kzi.msg.success("邮箱已在白名单中！");
                    $scope.task.mailStatus == 0;
                    $scope.task.isFree = false;
                } else if ('1' == resp.data) {
                    kzi.msg.error("邮箱无效，现已加入黑名单！");
                    $scope.task.mailStatus == 1;
                    $scope.task.isFree = true;
                }
                ;
                $scope.task.needCheckEmail = false;
            };
            if (!_.isEmpty(t.email) && kzi.validator.isEmail(t.email)) {
                $scope.is_email_checking = true;
                wt.data.email.check(t.email, successFunc,
                    function () {
                        kzi.msg.error("检测失败，请稍后重试，或联系管理员！");
                    },
                    function () {
                        $scope.is_email_checking = false;
                    });
            }
            ;
        };

        /**
         * 查看邮箱地址（要扣积分）
         * @param t
         */
        $scope.js_get_mail = function (target) {
            target.stopPropagation();
            if ($rootScope.need_login('/customer')) {
                $popbox.popbox({
                    target: target,
                    placement: 'right',
                    templateUrl: "/view/common/pop_pay_email.html",
                    controller: ["$scope", "popbox", "pop_data", "$rootScope",
                        function ($scope, popbox, pop_data, $rootScope) {
                            $scope.popbox = popbox;
                            $scope.send_success = false;
                            $scope.errcode = 0;

                            $scope.js_close = function () {
                                popbox.close()
                            };

                            $scope.js_see_email = function () {
                                var score = 1 * $rootScope.scoreConfig.collectCustomer + 1 * $rootScope.global.me.score;
                                if (score < 0) {
                                    $scope.errcode = 2100;
                                } else {
                                    $scope.paing = true;
                                    wt.data.task.pay_for_email(pop_data.scope.task.objectId,
                                        function (resp) {
                                            pop_data.scope.task = resp.data;
                                            $rootScope.setScore(score);
                                            $scope.send_success = true;
                                            pop_data.scope.task.collected = 1;
                                            $scope.js_close();
                                        },
                                        function (resp) {
                                            if ("2100" == resp.code) {
                                                $scope.errcode = 2100;
                                                $rootScope.setScore(resp.data);
                                            } else {
                                                $scope.errcode = 500;
                                            }
                                            ;
                                        },
                                        function () {
                                            $scope.paing = false;
                                        });
                                }
                            };
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
        };

        $scope.js_send_mail = function (t) {
            if ($rootScope.need_login('/customer')) {
                var tasks = [];
                tasks.push(t);
                angular.forEach(tasks, function (task) {
                    task.watched = true;
                });

                var obj = {
                    tasks: tasks,
                    templates: $scope.templates
                };
                if (!$rootScope.global.is_outter && $rootScope.global.is_outter) {
                    $window.open('/template/generator_test?customer_id=' + t.objectId || '');
                } else {
                    $rootScope.locator.show_slide = false;
                    $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj)
                }
            }
        };
        $scope.js_show_todo = function (e) {
            e.is_todo_edit = !0, e.is_add_todo_edit = !0
        };
        $scope.js_cancel_todo_editor = function (e) {
            e.is_todo_edit = !1
        };
        $scope.js_show_todo_editor = function (t) {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.is_todo_edit = !0, c = t.name)
        };
        $scope.js_show_add_todo_editor = function (e) {
            e.is_add_todo_edit = !0
        };
        $scope.js_cancel_add_todo_editor = function (e) {
            e.is_add_todo_edit = !1
        };
        $scope.js_add_todo = function (e, t) {
            return _.isUndefined(t) || _.isUndefined(t.temp_name) || _.isEmpty(t.temp_name) ? (e.is_add_todo_edit = !1, void 0) : (t.is_saving = !0, u(e, t, function () {
                t.is_saving = !1
            }), void 0)
        };
        $scope.js_keyup_add_todo = function (t, i) {
            var a = t.which;
            return 13 === a ? (t.stopPropagation(), t.preventDefault(), setTimeout(function () {
                $(t.target).parents(".new-todo-control").find("button[data-loading-text]").click()
            }, 50), void 0) : 27 === a ? ($scope.js_cancel_add_todo_editor(i), void 0) : void 0
        };
        $scope.js_save_todo = function (e, t) {
            return _.isEmpty(t.name) ? (t.is_todo_edit = !1, t.name = c, void 0) : (t.is_saving = !0, wt.data.task.update_todo(pid, l, t.todo_id, t.name, t.pos, function () {
            }, null, function () {
                t.is_saving = !1, t.is_todo_edit = !1
            }), c = t.name, void 0)
        };
        $scope.js_keyup_todo = function (t, i, n) {
            var a = event.which || event.keyCode;
            return 13 === a ? ($scope.js_save_todo(null, n), void 0) : (27 === a && $scope.js_cancel_todo_editor(n), void 0)
        };
        $scope.js_show_tag = function (e) {
            e.is_tag_edit = !0, e.is_add_tag_edit = !0
        };
        $scope.js_cancel_tag_editor = function (e) {
            e.is_tag_edit = !1
        };
        $scope.js_show_tag_editor = function (t) {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.is_tag_edit = !0, c = t.name)
        };
        $scope.js_show_add_tag_editor = function (e) {
            e.is_add_tag_edit = !0
        };
        $scope.js_cancel_add_tag_editor = function (e) {
            e.is_add_tag_edit = !1
        };
        $scope.js_add_tag = function (e, t) {
            return _.isUndefined(t) || _.isUndefined(t.temp_name) || _.isEmpty(t.temp_name) ? (e.is_add_tag_edit = !1, void 0) : (t.is_saving = !0, u1(e, t, function () {
                t.is_saving = !1
            }), void 0)
        };
        $scope.js_keyup_add_tag = function (t, i) {
            var a = t.which;
            return 13 === a ? (t.stopPropagation(), t.preventDefault(), setTimeout(function () {
                $(t.target).parents(".new-tag-control").find("button[data-loading-text]").click()
            }, 50), void 0) : 27 === a ? ($scope.js_cancel_add_tag_editor(i), void 0) : void 0
        };
        $scope.js_save_tag = function (e, t) {
            return _.isEmpty(t.name) ? (t.is_tag_edit = !1, t.name = c, void 0) : (t.is_saving = !0, wt.data.task.update_tag(pid, l, t.tag_id, t.name, t.pos, function () {
            }, null, function () {
                t.is_saving = !1, t.is_tag_edit = !1
            }), c = t.name, void 0)
        };
        $scope.js_keyup_tag = function (t, i, n) {
            var a = event.which || event.keyCode;
            return 13 === a ? ($scope.js_save_tag(null, n), void 0) : (27 === a && $scope.js_cancel_tag_editor(n), void 0)
        };
        $scope.js_remove_label = function (t) {
            $scope.task.labels = _.reject($scope.task.labels, function (e) {
                return e.name === t.name
            });
            wt.data.task.del_labels(pid, l, t.name, function () {
            });
            $rootScope.$broadcast(kzi.constant.event_names.on_task_update, $scope.task)
        };
        $scope.js_del_tag = function (e, t) {
            e.tags = _.reject(e.tags, function (e) {
                return e.tag_id === t.tag_id
            });
            wt.data.task.del_tag(pid, l, t.tag_id, function () {
            });
            e = d1(e);
            t.is_tag_edit = !1;
            $rootScope.$broadcast(kzi.constant.event_names.on_task_update, e);
        };
        $scope.js_del_todo = function (e, t) {
            e.todos = _.reject(e.todos, function (e) {
                return e.todo_id === t.todo_id
            });
            wt.data.task.del_todo(pid, l, t.todo_id, function () {
            });
            e = d(e);
            t.is_todo_edit = !1;
            $rootScope.$broadcast(kzi.constant.event_names.on_task_update, e);
        };
        $scope.js_complete_todo = function (t, i) {
            if ($scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest) {
                var a = i.todo_id;
                i.checked ? (i.checked = 0, wt.data.task.uncomplete_todo(pid, l, a, function () {
                })) : (i.checked = 1, wt.data.task.complete_todo(pid, l, a, function () {
                })), t = d(t), $rootScope.$broadcast(kzi.constant.event_names.on_task_update, t)
            }
        };
        $scope.js_assign_member = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_assign_member.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, a) {
                        e.popbox = t, $rootScope.load_project_members(pid, function (t) {
                            var n = [];
                            _.each(t.members, function (e) {
                                if (1 == e.status && e.role !== kzi.constant.role.guest) {
                                    var t = _.findWhere(i.members, {
                                        uid: e.uid
                                    });
                                    e.assigned = t ? 1 : 0, n.push(e)
                                }
                            }), e.members = n
                        }), e.js_toggle_member = function (e) {
                            e.setting_toggle_member !== !0 && (e.setting_toggle_member = !0, wt.bus.member.set_task_member_toggle(pid, a.scope.task, e, function () {
                                e.setting_toggle_member = !1, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i)
                            }))
                        }, e.js_close = function () {
                            t.close()
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            members: $scope.members
                        }
                    }
                }
            }).open()
        };
        $scope.js_assign_template = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_assign_template.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, a) {
                        e.popbox = t, $rootScope.load_project_templates(pid, function (t) {
                            var n = [];
                            _.each(t.templates, function (e) {
                                var t = _.findWhere(i.templates, {
                                    template_id: e.template_id
                                });
                                e.assigned = t ? 1 : 0, n.push(e)
                            }), e.templates = n
                        }), e.js_mail_task = function () {
                            wt.data.task.mail(pid, l, function () {
                                e.send_success = !0
                            }), $rootScope.$broadcast(kzi.constant.event_names.on_task_mail, i)
                        },
                            e.js_toggle_template = function (e) {
                                e.setting_toggle_template !== !0 && (e.setting_toggle_template = !0, wt.bus.template.set_task_template_toggle(pid, a.scope.task, e, function () {
                                    e.setting_toggle_template = !1, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i)
                                }))
                            }, e.js_close = function () {
                            t.close()
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            templates: $scope.templates
                        }
                    }
                }
            }).open()
        };
        $scope.js_watch_task = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_watch_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.task = i, $rootScope.load_project_members(pid, function (t) {
                            var n = [];
                            _.each(t.members, function (e) {
                                if (1 == e.status) {
                                    var t = _.findWhere(i.watchers, {
                                        uid: e.uid
                                    });
                                    e.is_watch = t ? 1 : 0, n.push(e)
                                }
                            }), e.members = n
                        }), e.js_toggle_watch = function (e) {
                            if (e.is_watch) {
                                var t = _.findWhere(i.watchers, {
                                    uid: e.uid
                                });
                                t && (i.watchers = _.reject(i.watchers, function (t) {
                                    return t.uid === e.uid
                                })), e.is_watch = 0, wt.data.unwatch(pid, kzi.constant.xtype.task, i.tid, e.uid, function () {
                                })
                            } else {
                                var t = _.findWhere(i.watchers, {
                                    uid: e.uid
                                });
                                t || (i.watchers.push(e), e.is_watch = 1, wt.data.watch(pid, kzi.constant.xtype.task, i.tid, e.uid, function () {
                                }))
                            }
                        }, e.js_watch_all = function () {
                            if (i.watchers.length !== e.members) {
                                var n = _.pluck(e.members, "uid");
                                wt.data.watch_batch(pid, kzi.constant.xtype.task, i.tid, n, function () {
                                    i.watchers = e.members
                                }), _.each(e.members, function (e) {
                                    e.is_watch = 1
                                })
                            }
                            t.close()
                        }, e.js_close = function () {
                            t.close()
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            members: $scope.members
                        }
                    }
                }
            }).open()
        };
        $scope.js_assign_label = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_assign_label.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, a) {
                        e.popbox = t, e.step = 0, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.labels = wt.bus.project.label.load(i, a.scope.project.info.labels),
                            e.js_toggle_label = function (e) {
                                if (e.assigned) {
                                    var t = _.findWhere(a.scope.task.labels, {
                                        name: e.name
                                    });
                                    t && (a.scope.task.labels = _.reject(a.scope.task.labels, function (t) {
                                        return t.name == e.name
                                    })), e.assigned = 0, wt.data.task.del_labels(pid, l, e.name, function () {
                                    })
                                } else {
                                    var t = _.findWhere(a.scope.task.labels, {
                                        name: e.name
                                    });
                                    t || (a.scope.task.labels.push(e), e.assigned = 1, wt.data.task.set_labels(pid, l, e.name, function () {
                                    }))
                                }
                                $rootScope.$broadcast(kzi.constant.event_names.on_task_update, a.scope.task)
                            }, e.js_goto_set_labels = function () {
                            _.each(kzi.constant.labels, function (t) {
                                var i = _.findWhere(a.scope.project.info.labels, {
                                    name: t.name
                                });
                                i && (e[t.name] = i.desc)
                            }), e.step = 1
                        }, e.js_set_lables = function (t, n, s, o, l, c) {
                            var u = [
                                {
                                    name: "blue",
                                    desc: t
                                },
                                {
                                    name: "green",
                                    desc: n
                                },
                                {
                                    name: "orange",
                                    desc: s
                                },
                                {
                                    name: "purple",
                                    desc: o
                                },
                                {
                                    name: "red",
                                    desc: l
                                },
                                {
                                    name: "yellow",
                                    desc: c
                                }
                            ];
                            e.is_save_ing = !0, wt.data.project.set_labels(pid, u, function () {
                                a.scope.project.info.labels = u, e.labels = wt.bus.project.label.load(i, u), e.step = 0,
                                    _.each(a.scope.task.labels, function (lable) {
                                        _.each(u, function (u_lable) {
                                            if (lable.name == u_lable.name && lable.desc != u_lable.desc) {
                                                lable.desc = u_lable.desc;
                                            }
                                        })
                                    }),
                                    //保存改后发广播，将对应的地方都改了
                                    $rootScope.$broadcast(kzi.constant.event_names.on_tasks_labels_update, u),
                                    //更改teams中对应分组的ladels
                                    $rootScope.$broadcast(kzi.constant.event_names.on_proj_ladels_update,
                                        {
                                            pid: a.scope.task.pid,
                                            labels: u
                                        })
                            }, null, function () {
                                e.is_save_ing = !1
                            })
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            labels: $scope.project.info.labels
                        }
                    }
                }
            }).open()
        };
        $scope.js_assign_tag = function (t, i, tagtype) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/common/pop_assign_tag.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, a) {
                        e.popbox = t;
                        e.step = 0;
                        e.tagtype = tagtype;
                        e.js_step = function (t) {
                            e.step = t
                        };
                        e.js_close = function () {
                            t.close()
                        };
                        e.tags = wt.bus.task.load_tags(i, a.tags);
                        e.js_toggle_tag = function (e) {
                            if (e.assigned) {
                                var t = _.findWhere(a.scope.task.tags, {
                                    tag_id: e.tag_id
                                });
                                t && (a.scope.task.tags = _.reject(a.scope.task.tags, function (t) {
                                    return t.tag_id == e.tag_id
                                }));
                                e.assigned = 0;
                                wt.data.task.del_tag(pid, l, e.tag_id, function () {
                                });
                            } else {
                                var t = _.findWhere(a.scope.task.tags, {
                                    tag_id: e.tag_id
                                });
                                if (!t) {
                                    a.scope.task.tags.push(e);
                                    e.assigned = 1;
                                    wt.data.task.add_tag_new(pid, l, e.tag_id, function () {
                                    });
                                }
                            }
                            $rootScope.$broadcast(kzi.constant.event_names.on_task_update, a.scope.task);
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            tags: $rootScope.tags
                        }
                    }
                }
            }).open()
        };
        $scope.js_assign_project = function (t, i, projecttype) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_assign_project.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, a) {
                        e.popbox = t, e.step = 0, e.projecttype = projecttype, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.projects = wt.bus.task.load_projects(i, a.projects),
                            e.js_toggle_project = function (e) {
                                if (e.assigned) {
                                    var t = _.findWhere(a.scope.task.projects, {
                                        pid: e.pid
                                    });
                                    t && (a.scope.task.projects = _.reject(a.scope.task.projects, function (t) {
                                        return t.pid == e.pid
                                    })), e.assigned = 0, wt.data.task.del_project(pid, l, e.pid, function () {
                                    })
                                } else {
                                    var t = _.findWhere(a.scope.task.projects, {
                                        pid: e.pid
                                    });
                                    if (!t) {
                                        a.scope.task.projects = a.scope.task.projects || [];
                                        a.scope.task.projects.push(e);
                                        e.assigned = 1;
                                        wt.data.task.add_project(pid, l, e.pid, function () {
                                        })
                                    }
                                }
                                $rootScope.$broadcast(kzi.constant.event_names.on_task_update, a.scope.task)
                            }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            projects: $rootScope.projects
                        }
                    }
                }
            }).open()
        };
        $scope.js_show_attach = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/file/pop_attach.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.task = i, e.prj_files_loaded = !1, $rootScope.load_files(pid, "", function (t) {
                            e.prj_files_loaded = !0;
                            var i = _.where(t.files, {
                                folder_id: ""
                            });
                            e.files = i
                        }), e.js_attach = function (t) {
                            if (1 == t.type) e.step = 1, e.prj_files_loaded = !1, e.sub_files = [], $rootScope.load_files(pid, t.fid, function (i) {
                                e.prj_files_loaded = !0;
                                var n = _.where(i.files, {
                                    folder_id: t.fid
                                });
                                e.sub_files = n
                            });
                            else {
                                _.isEmpty(i.files) && (i.files = []);
                                var a = _.findWhere(i.files, {
                                    fid: t.fid
                                });
                                a || (i.files.push(t), wt.data.file.attach(pid, "programs", l, t.fid, function () {
                                    i.badges.file_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i)
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
        $scope.js_show_template = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/template/pop_template.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.task = i, e.prj_templates_loaded = !1, $rootScope.load_templates(pid, "", function (t) {
                            e.prj_templates_loaded = !0;
                            e.files = t.templates
                        }), e.js_attach = function (t) {
                            if (1 == t.type) e.step = 1, e.prj_files_loaded = !1, e.sub_files = [], $rootScope.load_files(pid, t.fid, function (i) {
                                e.prj_files_loaded = !0;
                                var n = _.where(i.files, {
                                    folder_id: t.fid
                                });
                                e.sub_files = n
                            });
                            else {
                                _.isEmpty(i.files) && (i.files = []);
                                var a = _.findWhere(i.files, {
                                    fid: t.fid
                                });
                                a || (i.files.push(t), wt.data.file.attach(pid, "programs", l, t.fid, function () {
                                    i.badges.file_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_task_update, i)
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
        $scope.js_show_entry_menu = function (t, i) {
            t.stopPropagation(), $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_unarchive_task.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        }, $rootScope.load_tasks(i.pid, function (t) {
                            e.entries = t.entries, _.each(e.entries, function (e) {
                                e.selected = 0
                            })
                        }), e.js_unarchive_task = function (a) {
                            _.each(e.entries, function (e) {
                                e.selected = 0
                            }), a.selected = 1, wt.data.task.unarchive(i.pid, i.tid, a.entry_id, function () {
                                $rootScope.project.entries = [], $rootScope.project.tasks = []
                            }), t.close(), $rootScope.$broadcast(kzi.constant.event_names.on_task_unarchived, i), $rootScope.locator.hide_slide()
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
        $scope.$watch("task", function (t) {
            t && !_.isEmpty(t) && ($scope.file_upload_option = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "task",
                    pid: t.pid,
                    tid: t.tid
                }
            }, $scope.file_upload_option_comment = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "comment",
                    pid: t.pid,
                    tid: t.tid,
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
                return $rootScope.upload_queue.get_task(t.pid, t.tid)
            }, $scope.global_fileupload_queue_mail = function () {
                return $rootScope.upload_queue.get_mail_task(t.pid, t.tid)
            }, $scope.global_fileupload_queue_comment = function () {
                return $rootScope.upload_queue.get_comment_task(t.pid, t.tid)
            })
        });
        $scope.js_goto_file = function (e, t) {
            var a = $rootScope.pid;
            _.isEmpty(a) ? $rootScope.locator.to_file(e, t, !0) : $rootScope.locator.to_file(e, t, !1)
        };
        $scope.js_del_attachment = function (t, i) {
            $scope.task.badges.file_count--;
            var a = _.findWhere($scope.task.files, {
                fid: i.fid
            });
            a && ($scope.task.files = _.reject($scope.task.files, function (e) {
                return e.fid == i.fid
            })), wt.data.file.detach(pid, "programs", l, i.fid), $rootScope.$broadcast(kzi.constant.event_names.on_task_update, $scope.task)
        };
        $scope.select_tab_comment = function () {
            $scope.tab_active.tab_activity_active = !1, $scope.tab_active.tab_comment_active = !0
        };
        $scope.select_tab_activity = function () {
            $scope.tab_active.tab_activity_active = !0, $scope.tab_active.tab_comment_active = !1, $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                xtype: "task",
                xid: $scope.task.tid
            })
        };
        $scope.js_close = function () {
            $rootScope.locator.show_slide = !1
        };
        $scope.tab_active = {};
        $scope.select_tab_comment();
    }
]);

innerApp.controller('item_program_ctrl', [
    '$scope',
    function ($scope) {
        var i = null, n = null;
        var a = 0, s = function (e) {
            $scope.loading = true, wt.data.program.get_for_item(n, i, a, kzi.config.default_count, function (t) {
                t.data.length > 0 && (a = t.data[t.data.length - 1].published), angular.isFunction(e) && e(t.data);
            }, null, function () {
                $scope.loading = false;
            });
        };
        $scope.js_load_more = function () {
            wt.utility.program.load_programs(s, $scope);
        };
        $scope.$on(kzi.constant.event_names.reload_item_programs, function (e, o) {
            a = 0, n = o.xtype, i = o.xid, $scope.programs = null, wt.utility.program.load_programs(s, $scope);
        });
    }
]);

innerApp.controller('signer_ctrl', [
    '$scope', '$popbox', 'wtMockFactory',
    function ($scope, $popbox, wtMockFactory) {
        var Signer = wtMockFactory.Signer;
        var Owner = wtMockFactory.Owner;

        $scope.queryCondition = {
            page: 1,
            size: 20,
            sort_key: 'create_date'
        };

        function getAllSigners(users) {
            return _.chain(users).filter(function (user) {
                return ["order", "cancel", "signer", "admin_cancel"].indexOf(user.role) > -1;
            }).map(function (userRef) {
                return {
                    owner: userRef
                }
            }).value();
        }

        function getSignerInfo(query) {
            $scope.is_querying = true;
            $scope.signers_loading_done = false;
            $scope.items = getAllSigners($scope.task.users);
            //need add this method
            false && wt.data.program.get_all_signer(queryCondition,
                function success(resp) {
                    $scope.items = resp.data || [];
                }, function then(resp) {

                }, function error(resp) {
                    $scope.is_querying = false;
                    $scope.signers_loading_done = true;
                });
        }

        function pop_ensure(target, programId, uid) {
            $popbox.popbox({
                target: target,
                templateUrl: "/view/entity/program/pop_ensure_signer.html",
                controller: ["$scope", "popbox", "pop_data",
                    function ($scope, popbox, pop_data) {
                        $scope.popbox = popbox;
                        $scope.result_code = 0;
                        $scope.js_close = function () {
                            popbox.close()
                        };
                        $scope.ensure_success = false;
                        $scope.ensure = function () {
                            $scope.is_querying = true;
                            wt.data.task.confirm(programId, uid, function (resp) {
                                    $scope.result_code = 200;
                                    kzi.msg.success("确认成功~");
                                },
                                function (resp) {
                                    $scope.result_code = resp.code;
                                },
                                function () {
                                    $scope.is_query = false;
                                    $scope.ensure_success = true;
                                });
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

        function pop_cancel(target, programId, uid) {
            $popbox.popbox({
                target: target,
                templateUrl: "/view/entity/program/pop_cancel_signer.html",
                controller: ["$scope", "popbox", "pop_data",
                    function ($scope, popbox, pop_data) {
                        $scope.popbox = popbox;
                        $scope.js_close = function () {
                            popbox.close()
                        };
                        $scope.ensure_success = false;
                        $scope.ensure_cancel = function () {
                            $scope.is_querying = true;
                            wt.data.task.cancel(programId, uid, function (resp) {
                                    kzi.msg.success("取消成功~");
                                },
                                function () {
                                },
                                function () {
                                    $scope.is_query = false;
                                    $scope.ensure_success = true;
                                });
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

        $scope.actions = {
            pop_ensure: pop_ensure,
            pop_cancel: pop_cancel
        }

        getSignerInfo({});
        $scope.signers_loading_done = true;
        //$scope.items = [
        //    new Signer(new Owner("mockOne"), 'mock_msg_one', new Date().getTime(), 1),
        //    new Signer(new Owner("mockTwo"), 'mock_msg_two', new Date().getTime(), 1)
        //];
    }
]);
