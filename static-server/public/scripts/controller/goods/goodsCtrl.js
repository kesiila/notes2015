"use strict";
innerApp.controller("entity_goods_ctrl", ["$scope", "$element", "$routeParams", "$rootScope", "$location", "$popbox", "$timeout", '$modal', 'isLengthOKFilter', "$window", "wtPrompt", "$http", "googleIP",
    function ($scope, $element, $routeParams, $rootScope, $location, $popbox, o, $modal, isLengthOKFilter, $window, wtPrompt, $http, googleIP) {

        function m() {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && ($scope.pop_member_options = [
                {
                    name: "从活动移除",
                    ongoing: "移除中...",
                    click: function (t, i, a, s) {
                        a.assigned = !0, wt.bus.member.set_goods_member_toggle(r, $scope.goods, a, function () {
                            a.setting_toggle_member = !1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, $scope.goods), a.assigned = !1
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
                        wt.bus.watch.unwatch(r, $scope.goods, kzi.constant.xtype.goods, $scope.goods.goods_id, n, function () {
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
            t.temp_name = "", wt.data.goods.add_todo(r, l, a, s, function (t) {
                e.todos.push(t.data), e = d(e), $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, e)
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
                wt.data.goods.add_tag(r, l, a, function (t) {
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
            _.isEmpty($scope.goods.tags) || ($scope.goods.tags = _.sortBy($scope.goods.tags, function (e) {
                return e.pos
            }))
        }, f1 = function () {
            $scope.tag_sort_options = {
                containment: ".goods-tags",
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
                        a = _.findWhere($scope.goods.tags, {
                            tag_id: n
                        }),
                        s = i.item.prev().attr("tag-id"),
                        o = i.item.next().attr("tag-id"),
                        l = 0;
                    if (_.isEmpty(s)) {
                        var c = _.findWhere($scope.goods.tags, {
                            tag_id: o
                        });
                        l = c.pos / 2 + 1
                    } else if (_.isEmpty(o)) {
                        var u = _.findWhere($scope.goods.tags, {
                            tag_id: s
                        });
                        l = u.pos + kzi.config.default_pos + 1
                    } else {
                        var c = _.findWhere($scope.goods.tags, {
                                tag_id: o
                            }),
                            u = _.findWhere($scope.goods.tags, {
                                tag_id: s
                            });
                        l = (c.pos + u.pos) / 2 + 1
                    }
                    a.pos !== l && (a.pos = l, wt.data.goods.update_tag_pos(r, $scope.goods.goods_id, a.tag_id, l, function () {
                        p1()
                    }))
                }
            }
        };

        $scope.goods = {}, $scope.$on(kzi.constant.event_names.on_slide_hide, function () {
            var n = {
                goods_id: $scope.goods.goods_id
            };
            _.isEmpty($scope.goods.temp_name) || (n.temp_name = $scope.goods.temp_name),
            _.isEmpty($scope.goods.temp_desc) || (n.temp_desc = $scope.goods.temp_desc),
            _.isEmpty($scope.goods.temp_title) || (n.temp_title = $scope.goods.temp_title),
            _.isEmpty($scope.goods.temp_enName) || (n.temp_enName = $scope.goods.temp_enName),
            _.isEmpty($scope.goods.temp_cnName) || (n.temp_cnName = $scope.goods.temp_cnName),
            _.isEmpty($scope.goods.temp_imageUrl) || (n.temp_imageUrl = $scope.goods.temp_imageUrl),
            _.isEmpty($scope.goods.temp_url) || (n.temp_url = $scope.goods.temp_url),
            _.isEmpty($scope.goods.temp_price) || (n.temp_price = $scope.goods.temp_price),
            _.isEmpty($scope.goods.temp_count) || (n.temp_count = $scope.goods.temp_count),
            _.isEmpty($scope.goods.temp_aging) || (n.temp_count = $scope.goods.temp_aging),
            $scope.goods = n          
        }),

        /**
		 * 加载数据 init
		 */
            $scope.$on(kzi.constant.event_names.load_entity_goods, function (t, i) {
                 (r = $scope.pid = i.pid, l = i.goods_id, $scope.select_tab_comment(),
                    $scope.section_loading_done = !1,
                    $scope.is_show_more = !1,
                    $rootScope.load_goods(r, l, function (t, n) {
                        $scope.goods_exist=true;
                        $scope.project = t,
                            $rootScope.$broadcast(kzi.constant.event_names.entity_loading_done, {
                                pid: $scope.pid,
                                xid: i.goods_id,
                                xtype: "goods",
                                entity: $scope.goods
                            });
                        $scope.goods && $scope.goods.goods_id === n.goods_id &&
                        (_.isEmpty($scope.goods.temp_name) || (n.temp_name = $scope.goods.temp_name),
                            _.isEmpty($scope.goods.temp_title) || (n.temp_title = $scope.goods.temp_title),
                            _.isEmpty($scope.goods.temp_enName) || (n.temp_enName = $scope.goods.temp_enName),
                            _.isEmpty($scope.goods.temp_cnName) || (n.temp_cnName = $scope.goods.temp_cnName),
                            _.isEmpty($scope.goods.temp_imageUrl) || (n.temp_imageUrl = $scope.goods.temp_imageUrl),
                            _.isEmpty($scope.goods.temp_url) || (n.temp_url = $scope.goods.temp_url),
                            _.isEmpty($scope.goods.temp_price) || (n.temp_price = $scope.goods.temp_price),
                            _.isEmpty($scope.goods.temp_count) || (n.temp_count = $scope.goods.temp_count),
                            _.isEmpty($scope.goods.temp_aging) || (n.temp_aging = $scope.goods.temp_aging),
                            _.isEmpty($scope.goods.temp_desc) || (n.temp_desc = $scope.goods.temp_desc)),
                                1 == $scope.project.info.archived ? $scope.permission = kzi.constant.permission.project_archived : 1 == n.archived ? $scope.permission = kzi.constant.permission.entity_archived : 1 == n.is_deleted ? $scope.permission = kzi.constant.permission.entity_deleted : ($scope.permission = kzi.constant.permission.ok, $scope.project.info.curr_role !== kzi.constant.role.guest), h(), m(), o(function () {
                                	$scope.goods = n
                        }),
                            !$scope.$$phase, _.isEmpty(n.files) ? wt.data.file.get_attach_list(r, "goodss", l, function (e) {
                            e.data && e.data.length > 0 && (_.each(e.data, function (e) {
                                e.icon = kzi.helper.build_file_icon(e)
                            }), n.files = e.data)
                        }, null, function () {
                            $scope.section_loading_done = !0
                        }) : (_.each(n.files, function (e) {
                            e.icon = kzi.helper.build_file_icon(e)
                        }), $scope.section_loading_done = !0), $scope.$broadcast(kzi.constant.event_names.load_comments, {
                            pid: r,
                            xtype:"goodss",
                            xid: l,
                            comment_id: i.comment_id
                        })
                    }, function (t) {
                        $scope.goods_exist=false;
                        $scope.section_loading_done = !0;
                        t.code == kzi.statuses.goods_error.not_found.code ? $scope.permission = kzi.constant.permission.entity_not_found : wt.data.error(t);
                    }))
            }), $scope.js_show_more = function () {
            $scope.is_show_more = !0
        }, $scope.js_publish = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/goods/pop_publish_goods.html",
                controller: ["$scope", "popbox", "pop_data",
                    function ($scope, popbox, pop_data) {
                        $scope.popbox = popbox, $scope.js_close = function () {
                            popbox.close()
                        };
                        $rootScope.load_goodss(r, function (t) {
                            _.isEmpty(t.entries) || ($scope.entries = t.entries, $scope.goodss = t.goodss, _.each($scope.entries, function (e) {
                                e.move_selected = e.entry_id === i.entry_id ? 1 : 0
                            }))
                        });
                        $scope.js_move_to = function (a) {
                            if (_.each($scope.entries, function (e) {
                                e.move_selected = 0
                            }), a.move_selected = 1, a) {
                                var s = kzi.config.default_pos,
                                    o = _.where($scope.goodss, {
                                        entry_id: a.entry_id
                                    });
                                null !== o && o.length > 0 && (s = _.max(o, function (e) {
                                    return e.pos
                                }).pos + kzi.config.default_pos + 1);
                                var entry_id = i.entry_id;
                                wt.data.goods.move(r, l, i.entry_id, a.entry_id, s, function () {
                                    pop_data.scope.goods.is_published = true;
                                });
                                $rootScope.locator.show_prj && $rootScope.refresh_cache.goods.move(l, i.entry_id, a.entry_id, s), i.entry_id = a.entry_id, i.entry_name = a.name, i.is_published = 1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_move, i, entry_id)
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
        }, $scope.js_buy = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/entity/goods/pop_buy_goods.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.goods = i;
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        },
                        e.js_confirm_buy_goods = function () {
                        	    
                        		wt.data.order.create("", function () {
                        		});
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
        }, $scope.js_trash = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/dashboard/goods/pop_delete_goods.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.goods = i;
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        },
                            e.js_delete_goods = function () {
                                $rootScope.del_entity(i.eid, i.uid, "goods");
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
		 * @param goods
		 */
        $scope.js_goods_share = function (event, goods) {
            event.stopPropagation();

            $popbox.popbox({
                target: event,
                templateUrl: "/view/common/pop_share_goods.html",
                controller: ["$scope", "popbox", "pop_data","$timeout","$rootScope",
                    function ($scope, popbox, pop_data,$timeout,$rootScope) {
                        $scope.popbox = popbox;
                        $scope.is_sharing=false;
                        $scope.share_success = false;
                        $scope.result_code=0;
                        $scope.score= kzi.constant.score.config.shareCustomer;


                        // 标记是否可以分享
                        $scope.goods_can_share=goods.isValid==true;

                        $scope.goods_share=function(){
                            $scope.is_sharing=true;
                            wt.data.goods.batch_share({'list': [goods.objectId]},
                                function () {
                                    $scope.result_code=200;
                                    $rootScope.$broadcast(kzi.constant.event_names.on_goods_share, goods.objectId);
                                    $timeout($scope.js_close,2000);
                                }, function (resp) {
                                    $scope.result_code = resp.code;
                                }, function () {
                                    $scope.is_sharing=false;
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
            $rootScope.project.goodss = _.reject($rootScope.project.goodss, function (e) {
                return e.goods_id == l
            }), wt.data.goods.archive(r, l, function () {
                $rootScope.locator.hide_slide()
            }), $scope.goods.archived = 1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_trash, $scope.goods), $rootScope.locator.hide_slide()
        }, $scope.js_complete_goods = function (t) {
            $scope.permission === kzi.constant.permission.ok && $rootScope.project.info.curr_role !== kzi.constant.role.guest && (t.completed ? (t.completed = 0, wt.data.goods.uncomplete(r, l, function () {
                $rootScope.$broadcast(kzi.constant.event_names.on_goods_complete, t)
            })) : (t.completed = 1, wt.data.goods.complete(r, l, function () {
                $rootScope.$broadcast(kzi.constant.event_names.on_goods_complete, t)
            })))
        }, $scope.$on(kzi.constant.event_names.on_goods_complete, function (t, i) {
            _.isEmpty(i) || i.goods_id === $scope.goods.goods_id && ($scope.goods.completed = i.completed)
        }),

        /**
		 * 监听活动分享事件
		 */
        $rootScope.$on(kzi.constant.event_names.on_goods_share, function (t, i) {
            _.isEmpty(i) || i !== $scope.goods.goods_id || ($scope.goods.is_published = 1)
        }),

        $scope.$on(kzi.constant.event_names.on_goods_comment, function (t, i) {
            _.isEmpty(i) || i.goods_id !== $scope.goods.goods_id || ($scope.goods.badges.comment_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, $scope.goods))
        }), $scope.$on(kzi.constant.event_names.on_goods_mail, function (t, i) {
            _.isEmpty(i) || i.goods_id !== $scope.goods.goods_id || ($scope.goods.badges.mail_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, $scope.goods))
        }), $scope.$on(kzi.constant.event_names.on_goods_badges_file, function (t, i) {
            i && "goods" === i.type && $scope.goods.goods_id === i.file.formData.goods_id && (_.isArray($scope.goods.files) ? $scope.goods.files.push(i.file) : $scope.goods.files = [i.file], _.isArray($scope.goods.files) && ($scope.goods.badges.file_count = $scope.goods.files.length))
        }), $scope.$on(kzi.constant.event_names.shortcut_key_to_edit, function () {
            $rootScope.locator.type !== kzi.constant.entity_type.goods || _.isEmpty($scope.goods) || $scope.js_show_editor($scope.goods)
        }), $scope.$on(kzi.constant.event_names.shortcut_key_to_cancel, function () {
            $rootScope.locator.type === kzi.constant.entity_type.goods && (_.isEmpty($scope.goods) || $scope.goods.is_edit !== !0 ? $rootScope.locator.show_slide === !0 && $rootScope.locator.hide_slide() : $scope.js_cancel_editor($scope.goods))
        }), $scope.js_show_more = function (t) {
            t.is_showmore = !0
        }, $scope.js_hide_more = function (t) {
            t.is_showmore = !1
        }, $scope.js_show_part_1 = function (t) {
            t.show_part = 1
        }, $scope.js_show_part_2 = function (t) {
            t.show_part = 2
        }, $scope.js_show_part_3 = function (t) {
            t.show_part = 3
        }, $scope.js_show_part_4= function (t) {
            t.show_part = 4
        }, $scope.js_show_part_5 = function (t) {
            t.show_part = 5
        }, $scope.js_show_part_6 = function (t) {
            t.show_part = 6
        }, $scope.js_show_part_7 = function (t) {
            t.show_part = 7
        }, $scope.js_show_part_8 = function (t) {
            t.show_part = 8
        }, $scope.js_show_part_9 = function (t) {
            t.show_part = 9,
                $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                    xid: $scope.goods.goods_id
                })
        }, $scope.js_show_editor = function (t) {
            // (goods.collected || (goods.uid ==global.me.uid))
            $scope.permission === kzi.constant.permission.ok  &&
                // $scope.permission === kzi.constant.permission.ok &&
            (t.is_edit = !0,
                _.isEmpty(t.temp_name) && (t.temp_name = t.name),
                _.isEmpty(t.temp_enName) && (t.temp_enName = t.enName),
                _.isEmpty(t.temp_cnName) && (t.temp_cnName = t.cnName),
                _.isEmpty(t.temp_title) && (t.temp_title = t.title),
                _.isEmpty(t.temp_price) && (t.temp_price = t.price),
                _.isEmpty(t.temp_count) && (t.temp_count = t.count),
                _.isEmpty(t.temp_aging) && (t.temp_aging = t.aging),
                _.isEmpty(t.temp_imageUrl) && (t.temp_imageUrl = t.imageUrl),
                _.isEmpty(t.temp_url) && (t.temp_url = t.url),
                _.isEmpty(t.temp_desc) && (t.temp_desc = t.desc));
        }, $scope.js_cancel_editor = function (e) {
            e.is_edit = !1,
            e.temp_desc = "",
            e.temp_price = 0,
            e.temp_count = 0,
            e.temp_aging = 0,
            e.temp_imageUrl = "",
            e.temp_url = "",
            e.temp_title = "",
            e.temp_cnName = "",
            e.temp_enName = "",
            e.temp_name = ""
        }, $scope.js_set_update = function (e, t) {
            if (t.is_saving !== !0) {
                if (_.isEmpty(t.temp_name)) t.temp_name = t.name;
                t.is_saving = !0,
                wt.data.goods.update(l, t, function (response) {
                    t.is_edit = !1,
                        t.name = t.temp_name,
                        t.enName = t.temp_enName,
                        t.cnName = t.temp_enName,
                        t.title = t.temp_title,
                        t.imageUrl = t.temp_imageUrl,
                        t.url = t.temp_url,
                        t.price = t.temp_price,
                        t.count = t.temp_count,
                        t.aging = t.temp_aging,
                        t.desc = t.temp_desc,
                        t.temp_name = null,
                        t.temp_enName = null,
                        t.temp_enName = null,
                        t.temp_title = null,
                        t.temp_imageUrl = null,
                        t.temp_url = null,
                        t.temp_price = 0,
                        t.temp_count = 0,
                        t.temp_aging = 0,
                        t.temp_desc = null;
                        $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, t)
                    $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, response.data);
                }, function(resp){
                    if("7026"==resp.code){kzi.msg.error("邮箱无效，修改失败！")}
                    else if("7034"==resp.code){kzi.msg.error("无信息修改！")};
                }, function () {
                    t.is_saving = !1
                })
            }
        }, $scope.js_show_datepicker = function (t, i, start) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/common/pop_datepicker.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        if (start) {
                        	i.date_temp = i.startDate ? moment(i.startDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
                        } else {
                        	i.date_temp = i.endDate ? moment(i.endDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
                        };
                        e.popbox = t, e.goods = i, e.js_close = function () {
                            t.close()
                        }, e.js_today = function () {
                            var t = moment().format("YYYY-MM-DD");
                            e.set_date(t,start)
                        }, e.js_tomorrow = function () {
                            var t = moment().add("days", 1).format("YYYY-MM-DD");
                            e.set_date(t,start)
                        }, e.js_week = function () {
                            var t = moment().endOf("week").add("days", 1).format("YYYY-MM-DD");
                            e.set_date(t,start)
                        }, e.js_next_week = function () {
                            var t = moment().add("days", 7).endOf("week").add("days", 1).format("YYYY-MM-DD");
                            e.set_date(t,start)
                        }, e.js_month = function () {
                            var t = moment().endOf("month").format("YYYY-MM-DD");
                            e.set_date(t,start)
                        }, e.js_set_date = function (t) {
                            e.set_date(t,start)
                        }, e.js_cancel_date = function () {
                        	if (start) {
                        		i.startDate = 0;
                        		 wt.data.goods.set_start(l, 0, function () {
                                 });
                        	} else {
                        		i.endDate = 0;
                       		 	wt.data.goods.set_end(l, 0, function () {
                             });
                        	};
                            i.badges.expire_date = 0, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, i), t.close()
                        }, e.js_cancel_expire = function () {
                            i.expire_date = 0, i.badges.expire_date = 0, wt.data.goods.set_expire(r, l, 0, function () {
                            }), $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, i), t.close()
                        }, e.set_date = function (e,start) {
                            var a = moment(e).endOf("day").valueOf();
                            if (start) {
                               wt.data.goods.set_start(l, a, function () {
                                  i.startDate = a, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, i), t.close()
                               })
                            } else {
                                wt.data.goods.set_end(l, a, function () {
                                    i.endDate = a, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, i), t.close()
                                 })
                            }
                        }, e.set_expire = function (e) {
                            var a = moment(e).endOf("day").valueOf();
                            wt.data.goods.set_expire(r, l, a, function () {
                                i.expire_date = a, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, i), t.close()
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
            return _.isEmpty(t.name) ? (t.is_tag_edit = !1, t.name = c, void 0) : (t.is_saving = !0, wt.data.goods.update_tag(r, l, t.tag_id, t.name, t.pos, function () {
            }, null, function () {
                t.is_saving = !1, t.is_tag_edit = !1
            }), c = t.name, void 0)
        }, $scope.js_keyup_tag = function (t, i, n) {
            var a = event.which || event.keyCode;
            return 13 === a ? ($scope.js_save_tag(null, n), void 0) : (27 === a && $scope.js_cancel_tag_editor(n), void 0)
        }, $scope.js_del_tag = function (e, t) {
            e.tags = _.reject(e.tags, function (e) {
                return e.tag_id === t.tag_id
            }), wt.data.goods.remove_tag(r, l, t.tag_id, function () {
            }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, e)
        }, $scope.js_assign_member = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/goods/pop_assign_member.html",
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
                            e.setting_toggle_member !== !0 && (e.setting_toggle_member = !0, wt.bus.member.set_goods_member_toggle(r, a.scope.goods, e, function () {
                                e.setting_toggle_member = !1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, i)
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
        }, $scope.js_watch_goods = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/goods/pop_watch_goods.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.goods = i, $rootScope.load_project_members(r, function (t) {
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
                                })), e.is_watch = 0, wt.data.unwatch(r, kzi.constant.xtype.goods, i.goods_id, e.uid, function () {
                                })
                            } else {
                                var t = _.findWhere(i.watchers, {
                                    uid: e.uid
                                });
                                t || (i.watchers.push(e), e.is_watch = 1, wt.data.watch(r, kzi.constant.xtype.goods, i.goods_id, e.uid, function () {
                                }))
                            }
                        }, e.js_watch_all = function () {
                            if (i.watchers.length !== e.members) {
                                var n = _.pluck(e.members, "uid");
                                wt.data.watch_batch(r, kzi.constant.xtype.goods, i.goods_id, n, function () {
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
        }, $scope.js_assign_tag = function (t, i,tagtype) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/common/pop_assign_tag.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, a) {
            	    if (_.isEmpty(tagtype)) tagtype='goods';
                        e.popbox = t, e.step = 0, e.tagtype= tagtype,e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.tags = wt.bus.common.load_tags(i, a.tags),
                        e.js_toggle_tag = function (e) {
                            if (e.assigned) {
                                var t = _.findWhere(a.scope.goods.tags, {
                                    tag_id: e.tag_id
                                });
                                t && (a.scope.goods.tags = _.reject(a.scope.goods.tags, function (t) {
                                    return t.tag_id == e.tag_id
                                })), e.assigned = 0, wt.data.goods.remove_tag(r, l, e.tag_id, function () {
                                })
                            } else {
                                var t = _.findWhere(a.scope.goods.tags, {
                                    tag_id: e.tag_id
                                });
                                t || (a.scope.goods.tags.push(e), e.assigned = 1, wt.data.goods.add_tag_new(r, l, e.tag_id, function () {
                                }))
                            };
                            $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, a.scope.goods)
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
        }, $scope.js_show_attach = function (t, i) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/file/pop_attach.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_step = function (t) {
                            e.step = t
                        }, e.js_close = function () {
                            t.close()
                        }, e.goods = i, e.prj_files_loaded = !1, $rootScope.load_files(r, "", function (t) {
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
                                a || (i.files.push(t), wt.data.file.attach(r, "goodss", l, t.fid, function () {
                                    i.badges.file_count += 1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, i)
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
        }, $scope.js_show_entry_menu = function (t, i) {
            t.stopPropagation(), $popbox.popbox({
                target: t,
                templateUrl: "/view/project/goods/pop_unarchive_goods.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        }, $rootScope.load_goodss(i.pid, function (t) {
                            e.entries = t.entries, _.each(e.entries, function (e) {
                                e.selected = 0
                            })
                        }), e.js_unarchive_goods = function (a) {
                            _.each(e.entries, function (e) {
                                e.selected = 0
                            }), a.selected = 1, wt.data.goods.unarchive(i.pid, i.goods_id, a.entry_id, function () {
                                $rootScope.project.entries = [], $rootScope.project.goodss = []
                            }), t.close(), $rootScope.$broadcast(kzi.constant.event_names.on_goods_unarchived, i), $rootScope.locator.hide_slide()
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
        }, $scope.$watch("goods", function (t) {
            t && !_.isEmpty(t) && ($scope.file_upload_option = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "goods",
                    pid: t.pid,
                    goods_id: t.goods_id
                }
            }, $scope.file_upload_option_comment = {
                url: [kzi.config.wtbox(), "?pid=" + t.pid, "&token=" + kzi.get_cookie("sid")].join(""),
                formData: {
                    target: "prj",
                    type: "comment",
                    pid: t.pid,
                    goods_id: t.goods_id,
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
                return $rootScope.upload_queue.get_goods(t.pid, t.goods_id)
            }, $scope.global_fileupload_queue_mail = function () {
                return $rootScope.upload_queue.get_mail_goods(t.pid, t.goods_id)
            }, $scope.global_fileupload_queue_comment = function () {
                return $rootScope.upload_queue.get_comment_goods(t.pid, t.goods_id)
            })
        }), $scope.$on(kzi.constant.event_names.on_file_add, function (t, i) {
            i && 'goods' === i.type && $scope.goods.goods_id === i.file.formData.goods_id && (_.isArray($scope.goods.files) ? $scope.goods.files.push(i.file) : $scope.goods.files = [i.file]);
        }), $scope.js_goto_file = function (e, t) {
            var a = $rootScope.pid;
            _.isEmpty(a) ? $rootScope.locator.to_file(e, t, !0) : $rootScope.locator.to_file(e, t, !1)
        }, $scope.js_del_attachment = function (t, i) {
            $scope.goods.badges.file_count--;
            var a = _.findWhere($scope.goods.files, {
                fid: i.fid
            });
            a && ($scope.goods.files = _.reject($scope.goods.files, function (e) {
                return e.fid == i.fid
            })), wt.data.file.detach(r, "goodss", l, i.fid), $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, $scope.goods)
        }, $scope.select_tab_comment = function () {
            $scope.tab_active.tab_activity_active = !1, $scope.tab_active.tab_comment_active = !0
        }, $scope.select_tab_activity = function () {
            $scope.tab_active.tab_activity_active = !0, $scope.tab_active.tab_comment_active = !1, $scope.$broadcast(kzi.constant.event_names.reload_item_activities, {
                xid: $scope.goods.goods_id
            })
        }, $scope.js_close = function () {
            $rootScope.locator.show_slide = !1
        }, $scope.tab_active = {}, $scope.select_tab_comment()
    }
]);
