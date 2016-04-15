'use strict';
innerApp.controller('entity_mail_ctrl', ["$scope", "$routeParams", "$rootScope", "$location", "$popbox",
    function ($scope, $routeParams, $rootScope, $location, $popbox) {
        var pid, mail_id;
        //是否是管理员
        $scope.isManager=$rootScope.global.me.role==0 && $rootScope.global.me.name=="sys_manager";
        $scope.token = kzi.get_cookie("sid");
        $scope.mail = {};
        $scope.mail_exist=true;
        $scope.$on(kzi.constant.event_names.load_entity_mail, function (event, args) {
            if ($scope.upload_enabled = !0,  !_.isEmpty(args.mail_id)) {
                pid = args.pid || $rootScope.teams[0].projects[0].pid;
                mail_id = args.mail_id;
                $scope.select_tab_comment();
                $scope.section_loading_done = !1;
                var mail = null;
                if(!_.isEmpty($scope.mail)){
                    mail = {mail_id: $scope.mail.mail_id,is_edit: $scope.mail.is_edit},
                    _.isEmpty($scope.mail.temp_name) || (mail.temp_name = $scope.mail.temp_name),
                    _.isEmpty($scope.mail.temp_content) || (mail.temp_content = $scope.mail.temp_content)
                }

                    $rootScope.load_project(pid, function (t) {
                        $scope.project = t,
                        $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : kzi.constant.permission.ok,
                        wt.data.email.get_email(pid, mail_id, function (t) {
                            $scope.mail_exist=true;
                        mail && mail.mail_id === t.data.mail_id && (t.data.temp_name = mail.temp_name,
                                t.data.temp_content = mail.temp_content,
                                t.data.is_edit = mail.is_edit),

                            $scope.mail = t.data,
                            $scope.$broadcast(kzi.constant.event_names.load_comments, {
                                pid: pid,
                                xid: mail_id,
                                xtype: kzi.constant.xtype.mail,
                                comment_id: args.comment_id
                            }),
                            1 == t.data.is_deleted && ($scope.permission = kzi.constant.permission.entity_deleted),
                            $scope.set_pop_watcher_options();
                            $scope.section_loading_done = !0;
                    }, function (t) {
                        if(t.code == "7001"){
                            $scope.mail_exist=false;
                        }
                    },function(){$scope.section_loading_done = !0})
                }, null)
            }
        }),

        $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
            $rootScope.locator.type !== kzi.constant.entity_type.mail || _.isEmpty($scope.mail) || $scope.js_show_editor($scope.mail)
        }), $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
            $rootScope.locator.type === kzi.constant.entity_type.mail && (_.isEmpty($scope.mail) || $scope.mail.is_edit !== !0 ? $rootScope.locator.show_slide === !0 && $rootScope.locator.hide_slide() : $scope.js_cancel_editor())
        }), $scope.js_show_editor = function (e) {
            e.owner.uid === $rootScope.global.me.uid && (e.is_edit = !0, _.isEmpty(e.temp_name) && (e.temp_name = e.name), _.isEmpty(e.temp_content) && (e.temp_content = e.content))
        }, $scope.js_cancel_editor = function (e) {
            e.is_edit = !1, e.temp_name = null, e.temp_content = null
        }, $scope.$on(kzi.constant.event_names.on_mail_comment, function (t, i) {
            _.isEmpty(i) || i.mail_id === $scope.mail.mail_id && $scope.mail.comment_count++
        }), $scope.js_update_mail = function (t) {
            $scope.is_setting_content = !0, _.isEmpty(t.temp_name) && (t.temp_name = t.name), wt.data.mail.update(pid, t.mail_id, t.temp_name, t.temp_content, function () {
                t.name = t.temp_name, t.content = t.temp_content, t.is_edit = !1
            }, null, function () {
                $scope.is_setting_content = !1, $rootScope.$broadcast(kzi.constant.event_names.on_mail_update, t)
            })
        },

            $scope.mail_reply=function(t){
                $rootScope.locator.hide_slide();
                $rootScope.load_project_templates(t.pid, function (t) {
                    var n = [];
                    _.each(t.templates, function (e) {
                        var t = _.findWhere(i.templates, {
                            template_id: e.template_id
                        });
                        e.assigned = t ? 1 : 0, n.push(e)
                    }), $scope.templates = n
                });
                t.checked = false;
                var tasks = [];
                tasks.push(t);
                angular.forEach(tasks, function (task) {
                    task.watched = true;
                });
                var obj = {
                    tasks: tasks,
                    templates: $scope.templates
                };
                $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj);
            };


            $scope.js_send_mail = function (cid) {

                wt.data.task.get("",cid,function(resp){
                    $rootScope.locator.hide_slide();
                    var task=resp.data;
                    task.watched=true;
                    $rootScope.$broadcast("show_add_mail",{task:task});
                },null,null);
            };

            $scope.js_trash = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/mail/pop_delete_mail.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.mail = n, e.js_close = function () {
                            t.close()
                        }, e.js_del_mail = function () {
                            wt.data.mail.trash(n.mail_id, function () {
                                e.js_close(),
                                    $rootScope.locator.hide_slide(),
                                    $rootScope.$broadcast(kzi.constant.event_names.on_mail_trash, {
                                    mail_id: n.mail_id
                                })
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
        }, $scope.js_share = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/mail/pop_share_mail.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.mail = i, e.js_close = function () {
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
        }, $scope.set_pop_watcher_options = function () {
            $scope.permission === kzi.constant.permission.ok && ($scope.pop_watcher_options = [
                {
                    name: "取消关注",
                    ongoing: "取消中...",
                    click: function (t, i, n, a) {
                        wt.bus.watch.unwatch(pid, $scope.mail, kzi.constant.xtype.mail, $scope.mail.mail_id, n, function () {
                        }, null, a)
                    }
                }
            ])
        }, $scope.js_show_mail_watch_pop = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/mail/pop_edit_mail_watchers.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.edit_mail = n, $rootScope.load_project_members(pid, function (t) {
                            wt.bus.mail.set_scope_watcher_members(e, t.members, n.watchers)
                        }), e.js_toggle_member = function (e) {
                            wt.bus.mail.toggle_watcher_member(e, n, pid)
                        }, e.js_watch_all = function () {
                            wt.bus.mail.watch_all_members(e.members, n, pid, function () {
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
        }, $scope.js_show_attach = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/file/pop_attach.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.mail = n, e.prj_files_loaded = !1, $rootScope.load_files(pid, "", function (t) {
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
                                a || (n.files.push(t), wt.data.file.attach(pid, "mails", mail_id, t.fid, function () {
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
        }, $scope.js_trigger_upload = function (e) {
            $(e.target).parents(".btn-group").eq(0).find("input[type=file]").click()
        }, $scope.$watch("mail", function (t) {
            t && ($scope.file_upload_option = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "mail",
                    pid: t.pid,
                    mail_id: t.mail_id
                }
            }, $scope.file_upload_option_comment = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "comment",
                    pid: t.pid,
                    mail_id: t.mail_id,
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
                return $rootScope.upload_queue.get_mail(t.pid, t.mail_id)
            }, $scope.global_fileupload_queue_comment = function () {
                return $rootScope.upload_queue.get_comment_mail(t.pid, t.mail_id)
            })
        }), $scope.$on(kzi.constant.event_names.on_file_add, function (t, i) {
            i && "mail" === i.type && $scope.mail.mail_id === i.file.formData.mail_id && (_.isArray($scope.mail.files) ? $scope.mail.files.push(i.file) : $scope.mail.files = [i.file])
        }), $scope.js_goto_file = function (e, n) {
            var a = $routeParams.pid;
            _.isEmpty(a) ? $rootScope.locator.to_file(e, n, !0) : $rootScope.locator.to_file(e, n, !1)
        }, $scope.js_del_attachment = function (t, i) {
            var n = _.findWhere($scope.mail.files, {
                fid: i.fid
            });
            n && ($scope.mail.files = _.reject($scope.mail.files, function (e) {
                return e.fid == i.fid
            })), wt.data.file.detach(pid, "mails", mail_id, i.fid)
        }, $scope.select_tab_comment = function () {
            $scope.tab_activity_active = !1, $scope.tab_comment_active = !0
        }, $scope.select_tab_activity = function () {
            $scope.tab_activity_active = !0, $scope.tab_comment_active = !1, $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                xtype: "mail",
                xid: $scope.mail.mail_id
            })
        }, $scope.js_close = function () {
            $rootScope.locator.show_slide = !1
        }
    }
]);