"use strict";
innerApp.controller("entity_video_ctrl", ["$scope", "$element", "$routeParams", "$rootScope", "$location", "$popbox", "$timeout", '$modal', 'isLengthOKFilter', "$window", "wtPrompt", "$http", "googleIP",
    function ($scope, $element, $routeParams, $rootScope, $location, $popbox, o, $modal, isLengthOKFilter, $window, wtPrompt, $http, googleIP) {

        function m() {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && ($scope.pop_member_options = [{
                name: "从视频移除",
                ongoing: "移除中...",
                click: function (t, i, a, s) {
                    a.assigned = !0, wt.bus.member.set_video_member_toggle(r, $scope.video, a, function () {
                        a.setting_toggle_member = !1, $rootScope.$broadcast(kzi.constant.event_names.on_video_update, $scope.video), a.assigned = !1
                    }, null, s)
                }
            }
            ])
        }

        function h() {
            $scope.permission === kzi.constant.permission.ok && ($scope.pop_watcher_options = [
                {
                    name: "取消关注",
                    ongoing: "取消中...",
                    click: function (t, i, n, a) {
                        wt.bus.watch.unwatch(r, $scope.video, kzi.constant.xtype.video, $scope.video.eid, n, function () {
                        }, null, a)
                    }
                }
            ])
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
                s = o.pos + kzi.config.default_pos
            }
            t.temp_name = "", wt.data.video.add_todo(r, l, a, s, function (t) {
                e.todos.push(t.data), e = d(e), $rootScope.$broadcast(kzi.constant.event_names.on_video_update, e)
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
                wt.data.video.add_tag(r, l, a, function (t) {
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
            return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.er.tag_checked_count = i, e.counter.tag_count = t, e
        }, p1 = function () {
            _.isEmpty($scope.video.tags) || ($scope.video.tags = _.sortBy($scope.video.tags, function (e) {
                return e.pos
            }))
        }, f1 = function () {
            $scope.tag_sort_options = {
                containment: ".video-tags",
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
                        a = _.findWhere($scope.video.tags, {
                            tag_id: n
                        }),
                        s = i.item.prev().attr("tag-id"),
                        o = i.item.next().attr("tag-id"),
                        l = 0;
                    if (_.isEmpty(s)) {
                        var c = _.findWhere($scope.video.tags, {
                            tag_id: o
                        });
                        l = c.pos / 2 + 1
                    } else if (_.isEmpty(o)) {
                        var u = _.findWhere($scope.video.tags, {
                            tag_id: s
                        });
                        l = u.pos + kzi.config.default_pos + 1
                    } else {
                        var c = _.findWhere($scope.video.tags, {
                                tag_id: o
                            }),
                            u = _.findWhere($scope.video.tags, {
                                tag_id: s
                            });
                        l = (c.pos + u.pos) / 2 + 1
                    }
                    a.pos !== l && (a.pos = l, wt.data.video.update_tag_pos(r, $scope.video.eid, a.tag_id, l, function () {
                        p1()
                    }))
                }
            }
        };

        $scope.video = {};
        $scope.$on(kzi.constant.event_names.on_slide_hide, function () {
            var n = {
                eid: $scope.video.eid
            };
            _.isEmpty($scope.video.temp_name) || (n.temp_name = $scope.video.temp_name),
            _.isEmpty($scope.video.temp_desc) || (n.temp_desc = $scope.video.temp_desc),
            _.isEmpty($scope.video.temp_title) || (n.temp_title = $scope.video.temp_title),
            _.isEmpty($scope.video.temp_enName) || (n.temp_enName = $scope.video.temp_enName),
            _.isEmpty($scope.video.temp_cnName) || (n.temp_cnName = $scope.video.temp_cnName),
            _.isEmpty($scope.video.temp_imageUrl) || (n.temp_imageUrl = $scope.video.temp_imageUrl),
            _.isEmpty($scope.video.temp_url) || (n.temp_url = $scope.video.temp_url),
            _.isEmpty($scope.video.temp_price) || (n.temp_price = $scope.video.temp_price),
            _.isEmpty($scope.video.temp_count) || (n.temp_count = $scope.video.temp_count),
                $scope.video = n
        });

        function mapEntityToTempEntity(tempEntity, entity) {
            for (var key in entity) {
                if (key.indexOf('temp') === -1)
                    tempEntity[toTempKey(key)] = entity[key];
            }
            function toTempKey(key) {
                return 'temp_' + key;
            }
        }

        function resetEntityTemp(entity) {
            for (var key in entity) {
                if (key.indexOf('temp') > -1)
                    entity[key] = '';
            }
        }

        function mapTempEntityToEntity(entity, tempEntity) {
            for (var key in tempEntity) {
                if (key.indexOf('temp') > -1)
                    entity[toRawKey(key)] = entity[key];
            }
            function toRawKey(key) {
                return key.slice(5);
            }
        }

        /**
         * 加载数据 init
         */
        $scope.$on(kzi.constant.event_names.load_entity_video, function (t, i) {

            $scope.static_formats = [
                {value: 'VIDEO', name: '视频'},
                {value: 'AUDIO', name: '音频'}
            ];

            r = $scope.pid = i.pid || "project_default";
            l = i.video_id;
            $scope.video.xtype = "videos";
            $scope.select_tab_comment();
            $scope.section_loading_done = !1;
            $scope.is_show_more = !1;
            $rootScope.load_video(r, l, function (t, entity) {
                $scope.video_exist = true;
                $scope.project = t;
                $rootScope.$broadcast(kzi.constant.event_names.entity_loading_done, {
                    pid: $scope.pid,
                    xid: i.eid,
                    xtype: "video",
                    entity: $scope.video
                });
                if ($scope.video && $scope.video.eid === entity.eid) {
                    mapEntityToTempEntity($scope.video, entity);
                }
                $scope.video.authorName = entity.author.name;
                $scope.video.image = entity.images[0];
                1 == $scope.project.info.archived
                    ? $scope.permission = kzi.constant.permission.project_archived
                    : 1 == entity.archived
                    ? $scope.permission = kzi.constant.permission.entity_archived
                    : 1 == entity.is_deleted
                    ? $scope.permission = kzi.constant.permission.entity_deleted
                    : ($scope.permission = kzi.constant.permission.ok, $scope.project.info.curr_role !== kzi.constant.role.guest)
                    , h(), m(),
                    o(function () {
                        $scope.video = entity
                    }),
                    !$scope.$$phase,
                    _.isEmpty(entity.files)
                        ? wt.data.file.get_attach_list(r, "videos", l, function (e) {
                        e.data && e.data.length > 0 && (_.each(e.data, function (e) {
                            e.icon = kzi.helper.build_file_icon(e)
                        }), entity.files = e.data)
                    }, null, function () {
                        $scope.section_loading_done = !0
                    })
                        : (_.each(entity.files, function (e) {
                        e.icon = kzi.helper.build_file_icon(e)
                    }),
                        $scope.section_loading_done = !0),
                    $scope.$broadcast(kzi.constant.event_names.load_comments, {
                        pid: r,
                        xtype: "videos",
                        xid: l,
                        comment_id: i.comment_id
                    })
            }, function (t) {
                $scope.video_exist = false;
                $scope.section_loading_done = !0;
                t.code == kzi.statuses.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
            })
        });
        $scope.js_show_more = function () {
            $scope.is_show_more = !0
        };
        $scope.js_publish = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/video/pop_publish_video.html",
                controller: ["$scope", "popbox", "pop_data",
                    function ($scope, popbox, pop_data) {
                        $scope.popbox = popbox, $scope.js_close = function () {
                            popbox.close()
                        };
                        $scope.js_move_to = function (a) {
                            if (_.each($scope.entries, function (e) {
                                    e.move_selected = 0
                                }), a.move_selected = 1, a) {
                                var s = kzi.config.default_pos,
                                    o = _.where($scope.videos, {
                                        entry_id: a.entry_id
                                    });
                                null !== o && o.length > 0 && (s = _.max(o, function (e) {
                                        return e.pos
                                    }).pos + kzi.config.default_pos + 1);
                                var entry_id = i.entry_id;
                                wt.data.video.move(r, l, i.entry_id, a.entry_id, s, function () {
                                    pop_data.scope.video.is_published = true;
                                });
                                $rootScope.locator.show_prj && $rootScope.refresh_cache.video.move(l, i.entry_id, a.entry_id, s), i.entry_id = a.entry_id, i.entry_name = a.name, i.is_published = 1, $rootScope.$broadcast(kzi.constant.event_names.on_video_move, i, entry_id)
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
        };
        $scope.js_trash = function (t, entity) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/common/pop_delete_confirm.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (scope, popbox) {
                        scope.video = entity;
                        scope.popbox = popbox;
                        scope.delete_title = "删除视频";
                        scope.js_close = function () {
                            popbox.close()
                        };
                        scope.js_sure_delete = function () {
                            $rootScope.del_entity(entity.eid, entity.uid || "", "video", false, function () {
                                $rootScope.locator.hide_slide();
                                popbox.close();
                                $rootScope.$broadcast(kzi.constant.event_names.on_video_trash, {eid: entity.eid});
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
        $scope.js_archive = function () {
            $rootScope.project.videos = _.reject($rootScope.project.videos, function (e) {
                return e.eid == l
            }), wt.data.video.archive(r, l, function () {
                $rootScope.locator.hide_slide()
            }), $scope.video.archived = 1, $rootScope.$broadcast(kzi.constant.event_names.on_video_trash, $scope.video), $rootScope.locator.hide_slide()
        };
        $scope.js_complete_video = function (t) {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.completed ? (t.completed = 0, wt.data.video.uncomplete(r, l, function () {
                $rootScope.$broadcast(kzi.constant.event_names.on_video_complete, t)
            })) : (t.completed = 1, wt.data.video.complete(r, l, function () {
                $rootScope.$broadcast(kzi.constant.event_names.on_video_complete, t)
            })))
        };

        $scope.$on(kzi.constant.event_names.on_video_comment, function (t, i) {
            _.isEmpty(i) || i.eid !== $scope.video.eid || ($scope.video.counter.commentedQty += 1, $rootScope.$broadcast(kzi.constant.event_names.on_video_update, $scope.video))
        });
        $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
            $rootScope.locator.type !== kzi.constant.entity_type.video || _.isEmpty($scope.video) || $scope.js_show_editor($scope.video)
        });
        $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
            $rootScope.locator.type === kzi.constant.entity_type.video && (_.isEmpty($scope.video) || $scope.video.is_edit !== !0 ? $rootScope.locator.show_slide === !0 && $rootScope.locator.hide_slide() : $scope.js_cancel_editor($scope.video))
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
                    xid: $scope.video.eid
                })
        };
        $scope.js_show_editor = function (video) {
            if ($scope.permission === kzi.constant.permission.ok) {
                video.is_edit = !0,
                    mapEntityToTempEntity($scope.video, video);
            }
        };
        $scope.js_cancel_editor = function (entity) {
            entity.is_edit = !1;
            resetEntityTemp(entity);
        };
        $scope.js_set_update = function (e, entity) {
            if (entity.is_saving !== !0) {
                if (_.isEmpty(entity.temp_name)) entity.temp_name = entity.name;
                entity.is_saving = !0,
                    wt.data.video.update(l, entity, function (response) {
                        entity.is_edit = !1;
                        mapTempEntityToEntity(entity, entity);
                        $scope.js_cancel_editor(entity);
                        $rootScope.$broadcast(kzi.constant.event_names.on_video_update, response.data);
                    }, function (resp) {
                    }, function () {
                        entity.is_saving = !1
                    })
            }
        };

        $scope.js_video_share = function (event, video) {
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
                        $scope.entity = "资讯";

                        $scope.js_publish_entity = function (publish_entity_form) {
                            $scope.is_publishing = true;
                            wt.data.video.publish(video.pid, video.eid,
                                function () {
                                    $scope.result_code = 200;
                                    video.status = 1;
                                    $rootScope.$broadcast(kzi.constant.event_names.on_video_publish, video.eid);
                                    kzi.msg.success('发布成功~');
                                }, function (resp) {
                                    $scope.result_code = resp.code;
                                }, function () {
                                    $scope.js_close();
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
            return _.isEmpty(t.name) ? (t.is_tag_edit = !1, t.name = c, void 0) : (t.is_saving = !0, wt.data.video.update_tag(r, l, t.tag_id, t.name, t.pos, function () {
            }, null, function () {
                t.is_saving = !1, t.is_tag_edit = !1
            }), c = t.name, void 0)
        }, $scope.js_keyup_tag = function (t, i, n) {
            var a = event.which || event.keyCode;
            return 13 === a ? ($scope.js_save_tag(null, n), void 0) : (27 === a && $scope.js_cancel_tag_editor(n), void 0)
        }, $scope.js_del_tag = function (e, t) {
            e.tags = _.reject(e.tags, function (e) {
                return e.tag_id === t.tag_id
            }), wt.data.video.remove_tag(r, l, t.tag_id, function () {
            }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_video_update, e)
        }, $scope.js_assign_member = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/video/pop_assign_member.html",
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
                            e.setting_toggle_member !== !0 && (e.setting_toggle_member = !0, wt.bus.member.set_video_member_toggle(r, a.scope.video, e, function () {
                                e.setting_toggle_member = !1, $rootScope.$broadcast(kzi.constant.event_names.on_video_update, i)
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
        }, $scope.js_watch_video = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/video/pop_watch_video.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.video = i, $rootScope.load_project_members(r, function (t) {
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
                                })), e.is_watch = 0, wt.data.unwatch(r, kzi.constant.xtype.video, i.eid, e.uid, function () {
                                })
                            } else {
                                var t = _.findWhere(i.watchers, {
                                    uid: e.uid
                                });
                                t || (i.watchers.push(e), e.is_watch = 1, wt.data.watch(r, kzi.constant.xtype.video, i.eid, e.uid, function () {
                                }))
                            }
                        }, e.js_watch_all = function () {
                            if (i.watchers.length !== e.members) {
                                var n = _.pluck(e.members, "uid");
                                wt.data.watch_batch(r, kzi.constant.xtype.video, i.eid, n, function () {
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
        }, $scope.js_assign_tag = function (t, i, tagtype) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/common/pop_assign_tag.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, a) {
                        if (_.isEmpty(tagtype)) tagtype = 'video';
                        e.popbox = t, e.step = 0, e.tagtype = tagtype, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.tags = wt.bus.common.load_tags(i, a.tags),
                            e.js_toggle_tag = function (e) {
                                if (e.assigned) {
                                    var t = _.findWhere(a.scope.video.tags, {
                                        tag_id: e.tag_id
                                    });
                                    t && (a.scope.video.tags = _.reject(a.scope.video.tags, function (t) {
                                        return t.tag_id == e.tag_id
                                    })), e.assigned = 0, wt.data.video.remove_tag(r, l, e.tag_id, function () {
                                    })
                                } else {
                                    var t = _.findWhere(a.scope.video.tags, {
                                        tag_id: e.tag_id
                                    });
                                    t || (a.scope.video.tags.push(e), e.assigned = 1, wt.data.video.add_tag_new(r, l, e.tag_id, function () {
                                    }))
                                }
                                $rootScope.$broadcast(kzi.constant.event_names.on_video_update, a.scope.video)
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
        $scope.js_trigger_upload = function (e) {
            $(e.target).parents(".btn-group").eq(0).find("input[type=file]").click()
        };
        //$scope.$watch("video", function (t) {
        //    var pid = t.pid || "project_default";
        //    if (t && !_.isEmpty(t)) {
        //        $scope.file_upload_option = {
        //            url: [kzi.config.wtbox(), "?pid=" + pid, "&token=" + kzi.get_cookie("sid")].join(""),
        //            formData: {
        //                target: "prj",
        //                type: "video",
        //                pid: pid || "project_default",
        //                eid: t.eid
        //            }
        //        };
        //        $scope.file_upload_option_comment = {
        //            url: [kzi.config.wtbox(), "?pid=" + pid, "&token=" + kzi.get_cookie("sid")].join(""),
        //            formData: {
        //                target: "prj",
        //                type: "comment",
        //                pid: pid,
        //                eid: t.eid,
        //                successCallback: function (e) {
        //                    var t = angular.element(".comment-list:visible").scope().comment;
        //                    _.isEmpty(t.files) && (t.files = []);
        //                    e.data.icon = kzi.helper.build_file_icon(e.data);
        //                    t.files.push(_.omit(e.data, "watchers"));
        //                }
        //            }
        //        };
        //        $scope.dragfile_option = {
        //            upload_option: $scope.file_upload_option
        //        };
        //        $scope.pastefile_option_comment = {
        //            upload_option: $scope.file_upload_option_comment
        //        };
        //
        //        $scope.global_fileupload_queue = function () {
        //            return $rootScope.upload_queue.get_video(t.pid, t.eid)
        //        };
        //        $scope.global_fileupload_queue_mail = function () {
        //            return $rootScope.upload_queue.get_mail_task(t.pid, t.eid)
        //        };
        //        $scope.global_fileupload_queue_comment = function () {
        //            return $rootScope.upload_queue.get_comment_task(t.pid, t.eid)
        //        };
        //    }
        //});
        //$scope.$on(kzi.constant.event_names.on_file_add, function (t, i) {
        //    i && 'video' === i.type && $scope.video.eid === i.file.formData.eid && (_.isArray($scope.video.files) ? $scope.video.files.push(i.file) : $scope.video.files = [i.file]);
        //});
        $scope.js_goto_file = function (e, t) {
            var a = $rootScope.pid;
            _.isEmpty(a) ? $rootScope.locator.to_file(e, t, !0) : $rootScope.locator.to_file(e, t, !1)
        };
        $scope.select_tab_comment = function () {
            $scope.tab_active.tab_activity_active = !1, $scope.tab_active.tab_comment_active = !0
        };
        $scope.select_tab_activity = function () {
            $scope.tab_active.tab_activity_active = !0;
            $scope.tab_active.tab_comment_active = !1;
            $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                xid: $scope.video.eid
            })
        };
        $scope.js_close = function () {
            $rootScope.locator.show_slide = !1
        };
        $scope.tab_active = {};
        $scope.select_tab_comment();
    }
]);
