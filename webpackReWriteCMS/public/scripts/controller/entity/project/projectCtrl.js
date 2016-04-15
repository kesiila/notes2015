"use strict";
innerApp.controller("entity_project_ctrl",
    ["$scope", "$element", "$routeParams", "$rootScope", "$location",
        "$popbox", "$timeout", '$modal', 'isLengthOKFilter',
        "$window", "wtPrompt", "$http", "googleIP", "angularBMap", "baiduMapService",
        function ($scope, $element, $routeParams, $rootScope, $location,
                  $popbox, $timeout, $modal, isLengthOKFilter,
                  $window, wtPrompt, $http, googleIP, angularBMap, baiduMapService) {
            function m() {
                if($scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest) {
                    $scope.pop_member_options = [
                        {
                            name: "从项目移除",
                            ongoing: "移除中...",
                            click: function (t, i, a, s) {
                                a.assigned = !0;
                                wt.bus.member.set_project_member_toggle(r, $scope.project, a, function () {
                                    a.setting_toggle_member = !1;
                                    $rootScope.$broadcast(kzi.constant.event_names.on_project_update, $scope.project);
                                    a.assigned = !1;
                                }, null, s);
                            }
                        }
                    ];
                }
            }

            function h() {
                if($scope.permission === kzi.constant.permission.ok) {
                    $scope.pop_watcher_options = [
                        {
                            name: "取消关注",
                            ongoing: "取消中...",
                            click: function (t, i, n, a) {
                                wt.bus.watch.unwatch(r, $scope.project, kzi.constant.xtype.project, $scope.project.project_id, n, function () {
                                }, null, a);
                            }
                        }
                    ]
                }
            }

            var r, l;
            // 显示与隐藏描述栏
            $scope.token = kzi.get_cookie("sid");
            var c, u = function (e, t, i) {
                var a = t.temp_name,
                    s = kzi.config.default_pos;
                if (!_.isEmpty(e.todos)) {
                    var o = _.max(e.todos, function (e) {
                        return e.pos
                    });
                    s = o.pos + kzi.config.default_pos;
                }
                t.temp_name = "", wt.data.project.add_todo(r, l, a, s, function (t) {
                    e.todos.push(t.data), e = d(e), $rootScope.$broadcast(kzi.constant.event_names.on_project_update, e)
                }, null, function () {
                    _.isFunction(i) && i()
                })
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
                    wt.data.project.add_tag(r, l, a, function (t) {
                        e.tags = e.tags || [];
                        e.tags.push(t.data)
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
                _.isEmpty($scope.project.tags) || ($scope.project.tags = _.sortBy($scope.project.tags, function (e) {
                    return e.pos
                }))
            }, f1 = function () {
                $scope.tag_sort_options = {
                    containment: ".project-tags",
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
                            a = _.findWhere($scope.project.tags, {
                                tag_id: n
                            }),
                            s = i.item.prev().attr("tag-id"),
                            o = i.item.next().attr("tag-id"),
                            l = 0;
                        if (_.isEmpty(s)) {
                            var c = _.findWhere($scope.project.tags, {
                                tag_id: o
                            });
                            l = c.pos / 2 + 1
                        } else if (_.isEmpty(o)) {
                            var u = _.findWhere($scope.project.tags, {
                                tag_id: s
                            });
                            l = u.pos + kzi.config.default_pos + 1
                        } else {
                            var c = _.findWhere($scope.project.tags, {
                                    tag_id: o
                                }),
                                u = _.findWhere($scope.project.tags, {
                                    tag_id: s
                                });
                            l = (c.pos + u.pos) / 2 + 1
                        }
                        a.pos !== l && (a.pos = l, wt.data.project.update_tag_pos(r, $scope.project.project_id, a.tag_id, l, function () {
                            p1()
                        }))
                    }
                }
            };

            $scope.project = {};
            $scope.$on(kzi.constant.event_names.on_slide_hide, function () {
                var n = {
                    project_id: $scope.project.project_id
                };
                _.isEmpty($scope.project.temp_name) || (n.temp_name = $scope.project.temp_name);
                _.isEmpty($scope.project.temp_desc) || (n.temp_desc = $scope.project.temp_desc);
                _.isEmpty($scope.project.temp_title) || (n.temp_title = $scope.project.temp_title);
                _.isEmpty($scope.project.temp_enName) || (n.temp_enName = $scope.project.temp_enName);
                _.isEmpty($scope.project.temp_cnName) || (n.temp_cnName = $scope.project.temp_cnName);
                _.isEmpty($scope.project.temp_imageUrl) || (n.temp_imageUrl = $scope.project.temp_imageUrl);
                _.isEmpty($scope.project.temp_url) || (n.temp_url = $scope.project.temp_url);
                _.isEmpty($scope.project.temp_address) || (n.temp_contact = $scope.project.temp_address);
                _.isEmpty($scope.project.temp_poi) || (n.temp_contact = $scope.project.temp_poi);
                _.isEmpty($scope.project.temp_contact) || (n.temp_contact = $scope.project.temp_contact);
                _.isEmpty($scope.project.temp_email) || (n.temp_email = $scope.project.temp_email);
                $scope.project = n;
            });
            /**
             * 加载数据 init
             */
            $scope.$on(kzi.constant.event_names.load_entity_project, function (t, i) {
                (r = $scope.pid = i.pid, l = i.project_id, $scope.select_tab_comment(),
                    $scope.section_loading_done = !1,
                    $scope.is_show_more = !1,
                    $rootScope.load_project_new(r, l, function (t, n) {
                        $scope.mapOptions = _.extend(_.clone(baiduMapService.default_options), {
                            //address: '',
                            //clickCallBack: function (event) {
                            //    //$scope.new_element.poi = baiduMapService.makePoi(event) || $scope.new_element.poi;
                            //    $scope.$apply();
                            //}
                            center: {
                                longitude: baiduMapService.poiToLng(n.poi),
                                latitude: baiduMapService.poiToLat(n.poi)
                            },
                            markers: [{
                                longitude: baiduMapService.poiToLng(n.poi),
                                latitude: baiduMapService.poiToLat(n.poi),
                                icon: 'img/mappiont.png',
                                width: 49,
                                height: 60,
                                title: n.address || '',
                                content: n.desc || ''
                            }]
                        });
                        $scope.project_exist = true;
                        $scope.project = t;
                        $rootScope.$broadcast(kzi.constant.event_names.entity_loading_done, {
                            pid: $scope.pid,
                            xid: i.project_id,
                            xtype: "project",
                            entity: $scope.project
                        });
                        $scope.project && $scope.project.project_id === n.project_id &&
                        (_.isEmpty($scope.project.temp_name) || (n.temp_name = $scope.project.temp_name),
                        _.isEmpty($scope.project.temp_title) || (n.temp_title = $scope.project.temp_title),
                        _.isEmpty($scope.project.temp_enName) || (n.temp_enName = $scope.project.temp_enName),
                        _.isEmpty($scope.project.temp_cnName) || (n.temp_cnName = $scope.project.temp_cnName),
                        _.isEmpty($scope.project.temp_imageUrl) || (n.temp_imageUrl = $scope.project.temp_imageUrl),
                        _.isEmpty($scope.project.temp_url) || (n.temp_url = $scope.project.temp_url),
                        _.isEmpty($scope.project.temp_address) || (n.temp_address = $scope.project.temp_address),
                        _.isEmpty($scope.project.temp_poi) || (n.temp_poi = $scope.project.temp_poi),
                        _.isEmpty($scope.project.temp_contact) || (n.temp_contact = $scope.project.temp_contact),
                        _.isEmpty($scope.project.temp_email) || (n.temp_email = $scope.project.temp_email),
                        _.isEmpty($scope.project.temp_desc) || (n.temp_desc = $scope.project.temp_desc));
                        1 == $scope.project.info.archived
                            ? $scope.permission = kzi.constant.permission.project_archived :
                            1 == n.archived
                                ? $scope.permission = kzi.constant.permission.entity_archived
                                : 1 == n.is_deleted ? $scope.permission = kzi.constant.permission.entity_deleted :
                                ($scope.permission = kzi.constant.permission.ok, $scope.project.info.curr_role !== kzi.constant.role.guest),
                            h(),
                            m(), $timeout(function () {
                            $scope.project = n
                        }),
                            !$scope.$$phase, _.isEmpty(n.files) ? wt.data.file.get_attach_list(r, "projects", l, function (e) {
                            e.data && e.data.length > 0 && (_.each(e.data, function (e) {
                                e.icon = kzi.helper.build_file_icon(e)
                            }), n.files = e.data)
                        }, null, function () {
                            $scope.section_loading_done = !0
                        }) : (_.each(n.files, function (e) {
                            e.icon = kzi.helper.build_file_icon(e)
                        }), $scope.section_loading_done = !0), $scope.$broadcast(kzi.constant.event_names.load_comments, {
                            pid: r,
                            xtype: "projects",
                            xid: l,
                            comment_id: i.comment_id
                        })
                    }, function (t) {
                        $scope.project_exist = false;
                        $scope.section_loading_done = !0;
                        t.code == kzi.statuses.project_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
                    }))
            }), $scope.js_show_more = function () {
                $scope.is_show_more = !0
            }, $scope.js_publish = function (t, i) {
                $popbox.popbox({
                    target: t,
                    templateUrl: "/view/project/pop_publish_project.html",
                    controller: ["$scope", "popbox", "pop_data",
                        function ($scope, popbox, pop_data) {
                            $scope.popbox = popbox, $scope.js_close = function () {
                                popbox.close()
                            };
                            $rootScope.load_projects(r, function (t) {
                                _.isEmpty(t.entries) || ($scope.entries = t.entries, $scope.projects = t.projects, _.each($scope.entries, function (e) {
                                    e.move_selected = e.entry_id === i.entry_id ? 1 : 0
                                }))
                            });
                            $scope.js_move_to = function (a) {
                                if (_.each($scope.entries, function (e) {
                                        e.move_selected = 0
                                    }), a.move_selected = 1, a) {
                                    var s = kzi.config.default_pos,
                                        o = _.where($scope.projects, {
                                            entry_id: a.entry_id
                                        });
                                    null !== o && o.length > 0 && (s = _.max(o, function (e) {
                                            return e.pos
                                        }).pos + kzi.config.default_pos + 1);
                                    var entry_id = i.entry_id;
                                    wt.data.project.move(r, l, i.entry_id, a.entry_id, s, function () {
                                        pop_data.scope.project.is_published = true;
                                    });
                                    $rootScope.locator.show_prj && $rootScope.refresh_cache.project.move(l, i.entry_id, a.entry_id, s), i.entry_id = a.entry_id, i.entry_name = a.name, i.is_published = 1, $rootScope.$broadcast(kzi.constant.event_names.on_project_move, i, entry_id)
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
            }, $scope.js_trash = function (t, i) {
                $popbox.popbox({
                    target: t,
                    templateUrl: "/view/project/pop_delete_project.html",
                    controller: ["$scope", "popbox", "pop_data",
                        function (e, t) {
                            e.project = i;
                            e.popbox = t;
                            e.js_close = function () {
                                t.close();
                            };
                            e.js_delete_project = function () {
                                $rootScope.del_entity(i.eid, i.uid, "project");
                                $rootScope.$broadcast(kzi.constant.event_names.on_project_trash, {eid: i.eid});
                                 $rootScope.locator.hide_slide();
                                 t.close();
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
            /**
             * 分享单个活动
             *
             * @param target
             * @param project
             */
            $scope.js_project_share = function (event, project) {
                event.stopPropagation();
                $popbox.popbox({
                    target: event,
                    templateUrl: "/view/common/pop_share_project.html",
                    controller: ["$scope", "popbox", "pop_data", "$timeout", "$rootScope",
                        function ($scope, popbox, pop_data, $timeout, $rootScope) {
                            $scope.popbox = popbox;
                            $scope.is_sharing = false;
                            $scope.share_success = false;
                            $scope.result_code = 0;
                            $scope.score = kzi.constant.score.config.shareCustomer;

                            // 标记是否可以分享
                            $scope.project_can_share = project.isValid == true;

                            $scope.project_share = function () {
                                $scope.is_sharing = true;
                                wt.data.project.batch_share({'list': [project.objectId]},
                                    function () {
                                        $scope.result_code = 200;
                                        $rootScope.$broadcast(kzi.constant.event_names.on_project_share, project.objectId);
                                        $timeout($scope.js_close, 2000);
                                    }, function (resp) {
                                        $scope.result_code = resp.code;
                                    }, function () {
                                        $scope.is_sharing = false;
                                        $scope.share_success = true;
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
            $scope.js_archive = function () {
                $rootScope.project.projects = _.reject($rootScope.project.projects, function (e) {
                    return e.project_id == l
                });
                wt.data.project.archive(r, l, function () {
                    $rootScope.locator.hide_slide()
                });
                $scope.project.archived = 1;
                $rootScope.$broadcast(kzi.constant.event_names.on_project_trash, $scope.project);
                $rootScope.locator.hide_slide();
            };
            $scope.js_complete_project = function (t) {
                $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.completed ? (t.completed = 0, wt.data.project.uncomplete(r, l, function () {
                    $rootScope.$broadcast(kzi.constant.event_names.on_project_complete, t)
                })) : (t.completed = 1, wt.data.project.complete(r, l, function () {
                    $rootScope.$broadcast(kzi.constant.event_names.on_project_complete, t)
                })))
            };
            $scope.$on(kzi.constant.event_names.on_project_complete, function (t, i) {
                _.isEmpty(i) || i.project_id === $scope.project.project_id && ($scope.project.completed = i.completed)
            });

            /**
             * 监听活动分享事件
             */
            $rootScope.$on(kzi.constant.event_names.on_project_share, function (t, i) {
                _.isEmpty(i) || i !== $scope.project.project_id || ($scope.project.is_published = 1)
            });

            $scope.$on(kzi.constant.event_names.on_project_comment, function (t, i) {
                _.isEmpty(i) || i.project_id !== $scope.project.project_id || ($scope.project.badges.comment_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, $scope.project))
            });
            $scope.$on(kzi.constant.event_names.on_project_mail, function (t, i) {
                _.isEmpty(i) || i.project_id !== $scope.project.project_id || ($scope.project.badges.mail_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, $scope.project))
            });
            $scope.$on(kzi.constant.event_names.on_project_badges_file, function (t, i) {
                i && "project" === i.type && $scope.project.project_id === i.file.formData.project_id && (_.isArray($scope.project.files) ? $scope.project.files.push(i.file) : $scope.project.files = [i.file], _.isArray($scope.project.files) && ($scope.project.badges.file_count = $scope.project.files.length))
            });
            $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
                $rootScope.locator.type !== kzi.constant.entity_type.project || _.isEmpty($scope.project) || $scope.js_show_editor($scope.project)
            });
            $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
                $rootScope.locator.type === kzi.constant.entity_type.project && (_.isEmpty($scope.project) || $scope.project.is_edit !== !0 ? $rootScope.locator.show_slide === !0 && $rootScope.locator.hide_slide() : $scope.js_cancel_editor($scope.project))
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
            $scope.js_show_part_6 = function (i, t) {
                var markers = [
                    {loc: '121.389646,31.251581'}];
                angularBMap.drawMarkersAndSetOnclick(markers, function () {
                    $scope.js_assign_tag(i, t, 'group')
                }).then(function (result) {
                    console.log('111兴趣点添加完成');
                }, function (err) {
                    console.log(err);
                }, function (progress) {
                    console.log(progress);
                });
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
                        xid: $scope.project.project_id
                    })
            };
            $scope.js_show_editor = function (t) {
                $scope.permission === kzi.constant.permission.ok &&
                (t.is_edit = !0,
                _.isEmpty(t.temp_name) && (t.temp_name = t.name),
                _.isEmpty(t.temp_enName) && (t.temp_enName = t.enName),
                _.isEmpty(t.temp_cnName) && (t.temp_cnName = t.cnName),
                _.isEmpty(t.temp_title) && (t.temp_title = t.title),
                _.isEmpty(t.temp_imageUrl) && (t.temp_imageUrl = t.imageUrl),
                _.isEmpty(t.temp_desc) && (t.temp_desc = t.desc));
            };
            $scope.js_cancel_editor = function (e) {
                e.is_edit = !1;
                e.temp_desc = "";
                e.temp_imageUrl = "";
                e.temp_title = "";
                e.temp_cnName = "";
                e.temp_enName = "";
                e.temp_name = "";
            };
            $scope.js_set_update = function (e, t) {
                if (t.is_saving !== !0) {
                    if (_.isEmpty(t.temp_name)) t.temp_name = t.name;
                    t.is_saving = !0;
                    wt.data.project.update(l, t.temp_title, t.temp_desc, t.temp_imageUrl, function (response) {
                        t.is_edit = !1;
                        t.title = t.temp_title;
                        t.imageUrl = t.temp_imageUrl;
                        t.desc = t.temp_desc;
                        t.temp_name = null;
                        t.temp_title = null;
                        t.temp_desc = null;
                        $rootScope.$broadcast(kzi.constant.event_names.on_project_update, t);
                    }, function (resp) {
                        if ("7034" == resp.code) {
                            kzi.msg.error("无信息修改！");
                        }
                    }, function () {
                        t.is_saving = !1;
                    })
                }
            };
            $scope.js_show_datepicker = function (t, i, start) {
                $popbox.popbox({
                    target: t,
                    templateUrl: "/view/common/pop_datepicker.html",
                    controller: ["$scope", "popbox", "pop_data",
                        function ($scope, popbox) {
                            if (start) {
                                i.date_temp = i.startDate ? moment(i.startDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
                            } else {
                                i.date_temp = i.endDate ? moment(i.endDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
                            }
                            ;
                            $scope.popbox = popbox;
                            $scope.project = i;
                            $scope.js_close = function () {
                                popbox.close();
                            };
                            $scope.js_today = function () {
                                var t = moment().format("YYYY-MM-DD");
                                $scope.set_date(t, start);
                            };
                            $scope.js_tomorrow = function () {
                                var t = moment().add("days", 1).format("YYYY-MM-DD");
                                $scope.set_date(t, start);
                            };
                            $scope.js_week = function () {
                                var t = moment().endOf("week").add("days", 1).format("YYYY-MM-DD");
                                $scope.set_date(t, start);
                            };
                            $scope.js_next_week = function () {
                                var t = moment().add("days", 7).endOf("week").add("days", 1).format("YYYY-MM-DD");
                                $scope.set_date(t, start);
                            }, $scope.js_month = function () {
                                var t = moment().endOf("month").format("YYYY-MM-DD");
                                $scope.set_date(t, start)
                            }, $scope.js_set_date = function (t) {
                                $scope.set_date(t, start)
                            }, $scope.js_cancel_date = function () {
                                if (start) {
                                    i.startDate = 0;
                                    wt.data.project.set_start(l, 0, function () {
                                    });
                                } else {
                                    i.endDate = 0;
                                    wt.data.project.set_end(l, 0, function () {
                                    });
                                }
                                ;
                                i.badges.expire_date = 0, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, i), popbox.close()
                            }, $scope.js_cancel_expire = function () {
                                i.expire_date = 0, i.badges.expire_date = 0, wt.data.project.set_expire(r, l, 0, function () {
                                }), $rootScope.$broadcast(kzi.constant.event_names.on_project_update, i), popbox.close()
                            }, $scope.set_date = function (e, start) {
                                var a = moment(e).endOf("day").valueOf();
                                if (start) {
                                    wt.data.project.set_start(l, a, function () {
                                        i.startDate = a, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, i), popbox.close()
                                    })
                                } else {
                                    wt.data.project.set_end(l, a, function () {
                                        i.endDate = a, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, i), popbox.close()
                                    })
                                }
                            }, $scope.set_expire = function (e) {
                                var a = moment(e).endOf("day").valueOf();
                                wt.data.project.set_expire(r, l, a, function () {
                                    i.expire_date = a, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, i), popbox.close()
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
                return _.isEmpty(t.name) ? (t.is_tag_edit = !1, t.name = c, void 0) : (t.is_saving = !0, wt.data.project.update_tag(r, l, t.tag_id, t.name, t.pos, function () {
                }, null, function () {
                    t.is_saving = !1, t.is_tag_edit = !1
                }), c = t.name, void 0)
            };
            $scope.js_keyup_tag = function (t, i, n) {
                var a = event.which || event.keyCode;
                return 13 === a ? ($scope.js_save_tag(null, n), void 0) : (27 === a && $scope.js_cancel_tag_editor(n), void 0)
            };
            $scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                }), wt.data.project.remove_tag(r, l, t.tag_id, function () {
                }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, e)
            };
            $scope.js_assign_member = function (t, i) {
                $popbox.popbox({
                    target: t,
                    templateUrl: "/view/project/project/pop_assign_member.html",
                    controller: ["$scope", "popbox", "pop_data",
                        function (e, t, a) {
                            e.popbox = t, $rootScope.load_project_members(r, function (t) {
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
                                e.setting_toggle_member !== !0 && (e.setting_toggle_member = !0, wt.bus.member.set_project_member_toggle(r, a.scope.project, e, function () {
                                    e.setting_toggle_member = !1, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, i)
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
            $scope.js_watch_project = function (t, i) {
                $popbox.popbox({
                    target: t,
                    templateUrl: "/view/project/project/pop_watch_project.html",
                    controller: ["$scope", "popbox", "pop_data",
                        function (e, t) {
                            e.popbox = t, e.project = i, $rootScope.load_project_members(r, function (t) {
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
                                    })), e.is_watch = 0, wt.data.unwatch(r, kzi.constant.xtype.project, i.project_id, e.uid, function () {
                                    })
                                } else {
                                    var t = _.findWhere(i.watchers, {
                                        uid: e.uid
                                    });
                                    t || (i.watchers.push(e), e.is_watch = 1, wt.data.watch(r, kzi.constant.xtype.project, i.project_id, e.uid, function () {
                                    }))
                                }
                            }, e.js_watch_all = function () {
                                if (i.watchers.length !== e.members) {
                                    var n = _.pluck(e.members, "uid");
                                    wt.data.watch_batch(r, kzi.constant.xtype.project, i.project_id, n, function () {
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
            $scope.js_assign_tag = function (t, i, tagtype) {
                $popbox.popbox({
                    target: t,
                    templateUrl: "/view/common/pop_assign_tag.html",
                    controller: ["$scope", "popbox", "pop_data",
                        function (e, t, a) {
                            if (_.isEmpty(tagtype)) tagtype = 'project';
                            e.popbox = t, e.step = 0, e.tagtype = tagtype, e.js_step = function (t) {
                                e.step = t
                            }, e.js_close = function () {
                                t.close()
                            }, e.tags = wt.bus.common.load_tags(i, a.tags),
                                e.js_toggle_tag = function (e) {
                                    if (e.assigned) {
                                        var t = _.findWhere(a.scope.project.tags, {
                                            tag_id: e.tag_id
                                        });
                                        t && (a.scope.project.tags = _.reject(a.scope.project.tags, function (t) {
                                            return t.tag_id == e.tag_id
                                        })), e.assigned = 0, wt.data.project.remove_tag(r, l, e.tag_id, function () {
                                        })
                                    } else {
                                        var t = _.findWhere(a.scope.project.tags, {
                                            tag_id: e.tag_id
                                        });
                                        t || (a.scope.project.tags.push(e), e.assigned = 1, wt.data.project.add_tag_new(r, l, e.tag_id, function () {
                                        }))
                                    }
                                    ;
                                    $rootScope.$broadcast(kzi.constant.event_names.on_project_update, a.scope.project)
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
                            }, e.project = i, e.prj_files_loaded = !1, $rootScope.load_files(r, "", function (t) {
                                e.prj_files_loaded = !0;
                                var i = _.where(t.files, {
                                    folder_id: ""
                                });
                                e.files = i
                            }), e.js_attach = function (t) {
                                if (1 == t.type) e.step = 1, e.prj_files_loaded = !1, e.sub_files = [], $rootScope.load_files(r, t.fid, function (i) {
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
                                    a || (i.files.push(t), wt.data.file.attach(r, "projects", l, t.fid, function () {
                                        i.badges.file_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_project_update, i)
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
                t.stopPropagation();
                $popbox.popbox({
                    target: t,
                    templateUrl: "/view/project/project/pop_unarchive_project.html",
                    controller: ["$scope", "popbox", "pop_data",
                        function (e, t) {
                            e.popbox = t, e.js_close = function () {
                                t.close()
                            }, $rootScope.load_projects(i.pid, function (t) {
                                e.entries = t.entries, _.each(e.entries, function (e) {
                                    e.selected = 0
                                })
                            }), e.js_unarchive_project = function (a) {
                                _.each(e.entries, function (e) {
                                    e.selected = 0
                                }), a.selected = 1, wt.data.project.unarchive(i.pid, i.project_id, a.entry_id, function () {
                                    $rootScope.project.entries = [], $rootScope.project.projects = []
                                }), t.close(), $rootScope.$broadcast(kzi.constant.event_names.on_project_unarchived, i), $rootScope.locator.hide_slide()
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
            $scope.$watch("project", function (t) {
                if (t && !_.isEmpty(t)) {
                    $scope.file_upload_option = {
                        url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                        formData: {
                            target: "prj",
                            type: "project",
                            pid: t.pid,
                            project_id: t.project_id
                        }
                    };
                    $scope.file_upload_option_comment = {
                        url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                        formData: {
                            target: "prj",
                            type: "comment",
                            pid: t.pid,
                            project_id: t.project_id,
                            successCallback: function (e) {
                                var t = angular.element(".comment-list:visible").scope().comment;
                                _.isEmpty(t.files) && (t.files = []), e.data.icon = kzi.helper.build_file_icon(e.data), t.files.push(_.omit(e.data, "watchers"))
                            }
                        }
                    };
                    $scope.dragfile_option = {
                        upload_option: $scope.file_upload_option
                    };
                    $scope.pastefile_option_comment = {
                        upload_option: $scope.file_upload_option_comment
                    };
                    $scope.global_fileupload_queue = function () {
                        return $rootScope.upload_queue.get_project(t.pid, t.project_id)
                    };
                    $scope.global_fileupload_queue_mail = function () {
                        return $rootScope.upload_queue.get_mail_project(t.pid, t.project_id)
                    };
                    $scope.global_fileupload_queue_comment = function () {
                        return $rootScope.upload_queue.get_comment_project(t.pid, t.project_id)
                    };
                }
            });
            $scope.$on(kzi.constant.event_names.on_file_add, function (t, i) {
                i && 'project' === i.type && $scope.project.project_id === i.file.formData.project_id && (_.isArray($scope.project.files) ? $scope.project.files.push(i.file) : $scope.project.files = [i.file]);
            });
            $scope.js_goto_file = function (e, t) {
                var a = $rootScope.pid;
                _.isEmpty(a) ? $rootScope.locator.to_file(e, t, !0) : $rootScope.locator.to_file(e, t, !1);
            };
            $scope.js_del_attachment = function (t, i) {
                $scope.project.badges.file_count--;
                var a = _.findWhere($scope.project.files, {
                    fid: i.fid
                });
                a && ($scope.project.files = _.reject($scope.project.files, function (e) {
                    return e.fid == i.fid
                }));
                wt.data.file.detach(r, "projects", l, i.fid);
                $rootScope.$broadcast(kzi.constant.event_names.on_project_update, $scope.project);
            };
            $scope.select_tab_comment = function () {
                $scope.tab_active.tab_activity_active = !1;
                $scope.tab_active.tab_comment_active = !0;
            };
            $scope.select_tab_activity = function () {
                $scope.tab_active.tab_activity_active = !0;
                $scope.tab_active.tab_comment_active = !1;
                $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                    xid: $scope.project.project_id
                })
            };
            $scope.js_close = function () {
                $rootScope.locator.show_slide = !1
            };
            $scope.tab_active = {};
            $scope.select_tab_comment();
        }
]);
