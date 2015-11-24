'use strict';
innerApp.controller('tasks_ctrl', [
    "$scope", "$routeParams", "$rootScope", "$popbox", "$window",
    function ($scope, $routeParams, $rootScope, $popbox, $window) {
        $rootScope.global.right_sidebar_show_part = 3;
        $rootScope.global.right_sidebar_is_fold = true;
        $rootScope.global.title = '我的活动';
        $rootScope.global.loading_done = true;
        $scope.show_add_customer = false;
        $scope.selectAll = false;
        $scope.show_completed = 0;
        $scope.my_task_view = 'date';
        $scope.team_id = 'all';
        $scope.current_type = 'tasks';
        kzi.localData.get('my_task_view') ? $scope.my_task_view = kzi.localData.get('my_task_view') : ($scope.my_task_view = 'date', kzi.localData.set('my_task_view', $scope.my_task_view));

        $rootScope.$watch("teams", function (teams) {
            if (teams.length > 0) {
                $scope.currentTeamId = teams[0].team_id;
            }
        })

        var me = $rootScope.global.me;

        $scope.edit_mail = {
            name: "",
            content: "",
            tasks: [],
            watchers: [me]
        };

        var o = function () {
            var t = [];
            t = 'all' == $scope.team_id ?
                $scope.my_tasks_ori :
                _.where($scope.my_tasks_ori, {team_id: $scope.team_id});
            $scope.my_tasks = 'date' == $scope.my_task_view ? r(t) : l(t);
        };
        //beita add
        $scope.task_status_index = 0;
        $scope.filter_task_status =
            [
                {name: "筛选活动", value: "all"}
                , {name: "已打开", value: "mail_opened"}
                , {name: "未开发", value: "underdevelopment"}
                , {name: "取消筛选", value: "move_filter"}
            ];
        /**
         * 根据邮件打开状态筛选活动
         */
        $scope.choose_filter_task_status = function (index) {
            if (index != $scope.task_status_index) {
                $scope.task_status_index = index;
            }
            if (index == 1) {
                $scope.queryCondition.isOpen = 1;
            } else if (index == 2) {
                $scope.queryCondition.task_filters.date = -1;
                $scope.queryCondition.isOpen = 0;
                $scope.$broadcast(kzi.constant.event_names.project_tasks_filter_underdevelopment);
            } else if (index == 3) {
                var type = $scope.queryCondition.type;
                $scope.task_filters = {
                    texts: "",
                    labels: [],
                    zoneCode: "",
                    countryCode: "",
                    date: "" //这里时间是多长时间未联系，-1是未开发的活动
                }
                $scope.queryCondition = {
                    type: type,        //0全部，1私有，2分享，3收藏
                    currentPage: 1,
                    itemsPerPage: 20,
                    isDESC: 1,//默认倒序排序
                    isOpen: 0,//默认是0，打开为1 ，未打开为-1
                    task_filters: $scope.task_filters
                };
                $scope.$broadcast(kzi.constant.event_names.project_clear_task_filter);
            } else {
                $scope.$broadcast(kzi.constant.event_names.show_project_tasks_filter);
                $scope.queryCondition.isOpen = 0;
                $scope.queryCondition.task_filters.date = 0;
            }
        };

        var r = function (e) {
            var dateGroup = {
                today: [],
                tomorrow: [],
                week: [],
                nextweek: [],
                month: [],
                due: [],
                other: []
            };
            var today = moment();
            var tomorrow = moment().add('days', 1);
            var thisweek = moment().endOf('week').add('days', 1);
            var nextweek = moment().add('days', 7).endOf('week').add('days', 1);
            var thismonth = moment().endOf('month');
            _.each(e, function (e) {
                var expire_date = moment(e.expire_date);
                expire_date.isSame(today, 'day') ? dateGroup.today.push(e) : expire_date.isSame(tomorrow, 'day') ? dateGroup.tomorrow.push(e) : expire_date > moment && thisweek > expire_date ? dateGroup.week.push(e) : expire_date > moment && nextweek > expire_date ? dateGroup.nextweek.push(e) : expire_date > moment && thismonth > expire_date ? dateGroup.month.push(e) : moment > expire_date && expire_date > 0 ? dateGroup.due.push(e) : dateGroup.other.push(e);
            });
            var r = [];
            return _.isEmpty(dateGroup.today) || r.push({
                phase: '今天',
                tasks: dateGroup.today
            }), _.isEmpty(dateGroup.tomorrow) || r.push({
                phase: '明天',
                tasks: dateGroup.tomorrow
            }), _.isEmpty(dateGroup.week) || r.push({
                phase: '本周',
                tasks: dateGroup.week
            }), _.isEmpty(dateGroup.nextweek) || r.push({
                phase: '下周',
                tasks: dateGroup.nextweek
            }), _.isEmpty(dateGroup.month) || r.push({
                phase: '本月',
                tasks: dateGroup.month
            }), _.isEmpty(dateGroup.due) || r.push({
                phase: '已过期',
                tasks: dateGroup.due
            }), _.isEmpty(dateGroup.other) || r.push({
                phase: '其它',
                tasks: dateGroup.other
            }), r;
        };
        var l = function (e) {
            for (var t = _.uniq(_.pluck(e, 'pid')), i = [], n = 0; t.length > n; n++) {
                var a = {tasks: _.where(e, {pid: t[n]})};
                _.isEmpty(a.tasks) || (a.project = a.tasks[0].project, i.push(a));
            }
            return i;
        };

        $scope.show_mail_list = false;

        $scope.js_show_mail_list = function () {
            $scope.show_mail_list = !$scope.show_mail_list;
        }
        $scope.js_cancel_edit_mail = function () {
            $scope.show_add_mail = !1, $scope.edit_mail.name = "", $scope.edit_mail.content = "", $scope.edit_mail.watchers = [me], $scope.clear();
            ;
        };
        $scope.js_remove_selected = function (selected, all) {
            wt.service.mail.batch_delete(i, e, o, function () {
            }, null, function () {
            });
        };
        $scope.js_watch_all = function (i, e) {
            wt.bus.mail.watch_alltask_members(i, e, o, function () {
            }, null, function () {
            });
        };

        $scope.clear = function () {
            $rootScope.global.right_sidebar_is_fold = true;
            $rootScope.global.right_sidebar_show_part = 3;
            $rootScope.selectedTasks = [];
            $scope.edit_mail.tasks = [];
            _.each($scope.tasks, function (task) {
                task.checked = false;
                var i = _.findWhere($rootScope.selectedTasks, {
                    tid: task.tid
                });
                i && ($rootScope.selectedTasks = _.reject($rootScope.selectedTasks, function (t) {
                    return t.tid === task.tid;
                }));
            });
        };

        $scope.js_show_add_mail = function () {
            $rootScope.global.right_sidebar_is_fold = false;
            var tasks = $rootScope.selectedTasks;
            angular.forEach(tasks, function (task) {
                task.watched = true;
            });
            var obj = {
                tasks: tasks
            };
            $rootScope.js_right_sidebar_toggle();
            $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj);
            //reset check input
            reset_checked_input();
            $rootScope.global.right_sidebar_is_fold ? kzi.localData.set("right_sidebar_is_fold", 1) : kzi.localData.set("right_sidebar_is_fold", 0);
        };

        $scope.js_add_task_pop = function (t) {
            $scope.show_add_customer = !$scope.show_add_customer;
        };

//        $scope.js_toggle_template = function (e, es) {
//            e.checked = !e.checked;
//            $scope.edit_mail.name = e.name;
//            $scope.edit_mail.content = e.content;
//            es && es.length > 0 && _.each(es, function (t) {
//                if (t.template_id != e.template_id)
//                    t.checked = false;
//            })
//        };

        $scope.toggleAll = function (tasks) {
            $scope.selectAll = !$scope.selectAll;
            if ($scope.selectAll) {
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.global.right_sidebar_show_part = 31;
                _.each(tasks, function (task) {
                    var o = _.findWhere($rootScope.selectedTasks, {
                        tid: task.tid
                    });
                    o || $rootScope.selectedTasks.push(task);
                    task.checked = true;
                })
            } else {
                $scope.clear();
                $rootScope.global.right_sidebar_is_fold = true;
                $rootScope.global.right_sidebar_show_part = 3;
                _.each(tasks, function (task) {
                    task.checked = false;
                    var i = _.findWhere($rootScope.selectedTasks, {
                        tid: task.tid
                    });
                    i && ($rootScope.selectedTasks = _.reject($rootScope.selectedTasks, function (t) {
                        return t.tid === task.tid
                    }))
                })
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
                $rootScope.global.right_sidebar_show_part = 31;
                $rootScope.selectedTasks.push(e)
                if ($rootScope.selectedTasks.length == $scope.tasks.length) {
                    $scope.selectAll = true;
                }
            } else {
                var i = _.findWhere($rootScope.selectedTasks, {
                    tid: e.tid
                });
                $scope.selectAll = false;
                i && ($rootScope.selectedTasks = _.reject($rootScope.selectedTasks, function (t) {
                    return t.tid === e.tid;
                }));
                if ($rootScope.selectedTasks.length == 0) {
                    $scope.clear();
                }
            }
        };

        $scope.js_task_view_toggle = function (t) {
            $scope.my_task_view = t, o(), kzi.localData.set('my_task_view', t);
        };

        $scope.js_filter_task = function (t) {
            $scope.team_id = t, o();
        };

        $scope.js_complete_task = function (e, t) {
            e.stopPropagation(),
                t.completed = 0 == t.completed ? 1 : 0, $rootScope.refresh_cache.task.complete(t.tid, t.completed), $rootScope.$broadcast(kzi.constant.event_names.on_task_complete, t);
        };


        $scope.js_send_mail = function (t) {
            var templates = [];
            t.checked = false;
            var tasks = [];
            tasks.push(t);
            angular.forEach(tasks, function (task) {
                task.watched = true;
            });
            var obj = {
                tasks: tasks,
                templates: templates
            };
            $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj);
            //reset check input
            reset_checked_input();
        };
        var reset_checked_input = function () {
            $scope.selectAll = false;
            _.each($scope.tasks, function (task) {
                if (task.checked) {
                    $scope.toggle(task, null);
                }
            })
        };
//        $scope.$on(kzi.constant.event_names.on_task_update, function (t, n) {
//            n && (_.isEmpty($scope.my_tasks) || _.each($scope.my_tasks, function (e) {
//                if (!_.isEmpty(e.tasks)) {
//                    var t = _.findWhere(e.tasks, { tid: n.tid });
//                    _.isEmpty(t) || (t.name = n.name, t.desc = n.desc, t.pos = n.pos, t.completed = n.completed, t.expire_date = n.expire_date, t.badges = n.badges, t.labels = n.labels, t.members = n.members, t.watchers = n.watchers, t.todos = n.todos);
//                }
//            }), $rootScope.locator.show_prj && $rootScope.refresh_cache.task.update_full(n));
//        });

        $scope.$on(kzi.constant.event_names.on_task_update, function (t, n) {

            if (!_.isEmpty(n)) {
                var t = _.findWhere($scope.tasks, {tid: n.tid});
                t && (t.name = n.name, t.desc = n.desc, t.pos = n.pos, t.completed = n.completed,
                    t.company = n.company, t.countryCnName = n.countryCnName, t.subIndustryCnName = n.subIndustryCnName,
                    t.expire_date = n.expire_date, t.badges = n.badges, t.labels = n.labels,
                    t.members = n.members, t.watchers = n.watchers, t.todos = n.todos);
            }
            ;
            $rootScope.locator.show_prj && $rootScope.refresh_cache.task.update_full(n);
        });

        $rootScope.$on(kzi.constant.event_names.on_task_share, function (t, i) {
            load_data($scope.queryCondition);
            $rootScope.teams[0].private_task_count -= 1;
            $rootScope.teams[0].share_task_count += 1;

//            i && (_.isEmpty($scope.tasks) || ($scope.tasks = _.reject($scope.tasks, function (e) {
//                return e.tid === i;
//            })), $rootScope.teams[0].private_task_count -= 1,
//                $rootScope.teams[0].share_task_count += 1);
        });

//        $rootScope.$on(kzi.constant.event_names.on_task_trash, function (t, i) {
//            i && (_.isEmpty($scope.tasks) || ($scope.tasks = _.reject($scope.tasks, function (e) {
//                return e.tid === i.tid;
//            })), i.is_published?$rootScope.teams[0].share_task_count -=1:$rootScope.teams[0].private_task_count -=1,
//            		$rootScope.teams[0].task_count -=1);
//        });

        $rootScope.$on(kzi.constant.event_names.on_task_trash, function (t, i) {
            i && (_.isEmpty($scope.tasks) || ($scope.tasks = _.reject($scope.tasks, function (e) {
                return e.tid === i.tid;
            })),
                $rootScope.teams[0].task_count -= 1,

            i.is_published || ($rootScope.teams[0].private_task_count -= 1),

            i.is_published && (i.uid == $rootScope.global.me.uid ? $rootScope.teams[0].share_task_count -= 1 : $rootScope.teams[0].download_task_count -= 1))
        });


        /*refactor*/
        $scope.task_filters = {
            texts: "",
            labels: [],
            zoneCode: "",
            countryCode: "",
            date: "" //这里时间是多长时间未联系，
        }
        $scope.$on(kzi.constant.event_names.on_project_tasks_filter,
            function (event, project_tasks_filter) {
                $scope.queryCondition.task_filters = project_tasks_filter;
            }
        );

        $scope.js_show_project_tasks_filter = function () {
            $scope.$broadcast(kzi.constant.event_names.show_project_tasks_filter);
        }
        $scope.pid = null;

        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;

        $scope.queryCondition = {
            type: _.isEmpty($routeParams.type) ? 3 : $routeParams.type,        //0全部，1私有，2分享，3收藏
            currentPage: 1,
            itemsPerPage: 20,
            isDESC: 1,//默认倒序排序
            isOpen: 0,//默认是0，打开为1 ，未打开为-1
            task_filters: $scope.task_filters
        };
        $scope.$on(kzi.constant.event_names.project_clear_task_filter,
            function () {
                $scope.queryCondition.task_filters = {
                    texts: "",
                    labels: [],
                    zoneCode: "",
                    countryCode: "",
                    date: "" //这里时间是多长时间未联系，
                }
            });

        $scope.taskSort_filterItems =
            [
                {name: '按创建时间', value: 'create_date'}
                ,
                {name: '按分享时间', value: 'publish_date'}
                ,
                {name: '按收藏时间', value: 'collectors.collect_date'}
            ];

        $scope.index = 0;

        $scope.task_sort = function (index) {

            if (index == '-1' || index == $scope.index) {
                $scope.queryCondition.isDESC = !$scope.queryCondition.isDESC;
            }
            else {
                $scope.queryCondition.sortKey = $scope.taskSort_filterItems[index].value;
                $scope.queryCondition.isDESC = 1, $scope.index = index;
            }
            ;
        };
        // task :Task -> type :String
        function getCustomerType(task) {
            if (task.is_published == 0) {
                return 'private';
            } else if (task.uid == $rootScope.global.me.uid) {
                return 'share';
            } else {
                return 'download';
            }
        }

        //删除活动事件
        $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
            var delete_task = _.find($scope.tasks, function (e) {
                return e.objectId == p.id;
            });
            $scope.tasks = _.filter($scope.tasks, function (e) {
                return e.objectId != p.id;
            });
            var pid = delete_task.pid;
            $rootScope.teams[0].task_count--;
            _.forEach($rootScope.teams[0].projects, function (e) {
                if (pid == e.pid) {
                    e.badges.task_count--;
                    switch (getCustomerType(delete_task)) {
                        case 'private' :
                            e.badges.private_task_count--;
                            $rootScope.teams[0].private_task_count--;
                            break;
                        case 'share' :
                            e.badges.share_task_count--;
                            $rootScope.teams[0].share_task_count--;
                            break;
                        case 'download' :
                            e.badges.download_task_count--;
                            $rootScope.teams[0].download_task_count--;
                            break;
                        default:
                            break;
                    }
                }
            });
            $scope.totalItems -= 1;
        }, null);
        $scope.count = {
            task_count: 0,
            private_task_count: 0,
            share_task_count: 0,
            download_task_count: 0
        };
        //加载数据
        var load_data = function (queryCondition) {
            $scope.part_loading_done = false;
            wt.data.task.xtype = "programs";
            //判断是否有过滤条件
            var have_task_filters = true;//有过滤条件
            if (queryCondition.task_filters.date == "" && queryCondition.task_filters.zoneCode == ""
                && queryCondition.task_filters.countryCode == ""
                && queryCondition.isOpen == "0"
                && queryCondition.task_filters.labels.length <= 0) {
                have_task_filters = false;//无过滤条件
            }
            wt.data.task.get_for_private(
                $scope.currentTeamId,//teamId
                "",//pid
                queryCondition.type,
                queryCondition.currentPage,
                queryCondition.itemsPerPage,
                queryCondition.isDESC,
                queryCondition.isOpen,
                queryCondition.sortKey,
                queryCondition.task_filters.zoneCode,
                queryCondition.task_filters.countryCode,
                queryCondition.task_filters.date == "" ? "0" : queryCondition.task_filters.date,
                queryCondition.task_filters.labels,
                function (response) {
                    $scope.totalItems = response.totalItems;
                    $scope.tasks = response.data;
                    if (have_task_filters) {
                        if ($scope.queryCondition.type == 0) {
                            $scope.count.task_count = $scope.totalItems
                        } else if ($scope.queryCondition.type == 1) {
                            $scope.count.private_task_count = $scope.totalItems
                        } else if ($scope.queryCondition.type == 2) {
                            $scope.count.share_task_count = $scope.totalItems
                        } else if ($scope.queryCondition.type == 3) {
                            $scope.count.download_task_count = $scope.totalItems
                        }
                    } else {
                        $scope.count = {
                            task_count: $rootScope.teams[0].task_count,
                            private_task_count: $rootScope.teams[0].private_task_count,
                            share_task_count: $rootScope.teams[0].share_task_count,
                            download_task_count: $rootScope.teams[0].download_task_count
                        };
                        if ($scope.queryCondition.type == 0) {
                            $rootScope.teams[0].task_count = $scope.totalItems
                        } else if ($scope.queryCondition.type == 1) {
                            $rootScope.teams[0].private_task_count = $scope.totalItems
                        } else if ($scope.queryCondition.type == 2) {
                            $rootScope.teams[0].share_task_count = $scope.totalItems
                        } else if ($scope.queryCondition.type == 3) {
                            $rootScope.teams[0].download_task_count = $scope.totalItems
                        }
                    }
                },
                function () {
                },
                function () {
                    $scope.part_loading_done = true;
                }
            );
        };

        $scope.$watch('queryCondition', function (queryCondition) {

            $rootScope.teams.length == 0 && $rootScope.load_common_data_in();

            load_data(queryCondition);
        }, true);

        //翻页
        $scope.$watch('currentPage', function (currentPage) {
            $scope.pageNum = currentPage;
            $scope.queryCondition.currentPage = currentPage;
            $scope.selectAll = false;
        })

        //跳转到某页
        $scope.jumpToPage = function (pageNum) {
            if (/\D/.test(pageNum)) {
                kzi.msg.error("页码格式错误", null);
                return false;
            } else if (pageNum > $scope.numPages || pageNum < 1) {
                $scope.currentPage = 1;
                $scope.pageNum = 1;
            } else {
                $scope.currentPage = pageNum;
            }
            $scope.selectAll = false;
        }


        $scope.$watch("itemsPerPage", function (itemsPerPage) {
            $scope.queryCondition.itemsPerPage = itemsPerPage;
            $scope.selectAll = false;
        });

        //切换标签页
        $scope.switch_tasks = function (type) {
            if ($scope.part_loading_done) {
                //加载第一页数据
                if ($scope.queryCondition.currentPage != 1) {
                    $scope.queryCondition.currentPage = 1;
                }
                $scope.queryCondition.type = type;

                $rootScope.selectedTasks = [];
                $scope.selectAll = false;
            }
        };

        /**
         * 活动批量分享
         * @param event
         */
        $scope.customer_batch_share = function (event) {
            $popbox.popbox({
                target: event,
                templateUrl: "/view/common/pop_batch_share_task.html",
                controller: ["$scope", "popbox", "pop_data", "$timeout",
                    function ($scope, popbox, pop_data, $timeout) {
                        $scope.count = {all: 0, validate: 0, invalidate: 0};
                        $scope.tasks_is_sharing = false;
                        $scope.share_success = false;
                        $scope.result_code = 0;
                        $scope.canshare = pop_data.scope.queryCondition.type * 1 === 1;
                        var customerIdList = [];

                        if ($rootScope.selectedTasks && $rootScope.selectedTasks.length > 0) {
                            $scope.count.all = $rootScope.selectedTasks.length;
                            customerIdList = _.pluck(_.filter($rootScope.selectedTasks, function (task) {
                                if (task.is_published < 1 && task.isValid) {
                                    return true;
                                } else {
                                    $scope.count.invalidate++;
                                    return false;
                                }
                            }), 'objectId');
                            $scope.count.validate = $scope.count.all - $scope.count.invalidate;
                        }

                        $scope.customer_batch_share = function () {
                            if ($scope.count.validate > 0) {
                                $scope.tasks_is_sharing = true;
                                wt.data.task.batch_share(
                                    {'list': customerIdList},
                                    function () {
                                        $scope.result_code = 200;
                                        $timeout($scope.js_close, 5000);
                                    },
                                    function (data) {
                                        $scope.result_code = data.code;
                                    },
                                    function () {
                                        $scope.share_success = true;
                                        pop_data.load_data(pop_data.scope.queryCondition)
                                        pop_data.scope.selectAll = false;
                                        $scope.tasks_is_sharing = false;
                                        customerIdList = [];
                                        $rootScope.selectedTasks = [];
                                    }
                                );
                            }
                        };
                        /**
                         * 切换到私有活动标签页
                         */
                        $scope.to_choose_private_customers = function () {
                            pop_data.scope.switch_tasks(1);
                            popbox.close();
                        };
                        $scope.js_close = function () {
                            popbox.close();
                        }
                    }],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            load_data: function () {
                                var args = [].slice.call(arguments, 0, 1)
                                return load_data(args[0])
                            }
                        };
                    }
                }
            }).open();
        }

        $rootScope.$watch("projects", function (projects) {
            if (projects.length > 0) {
                $scope.currentProjectId = projects[0].pid;
            }
        })


        //监听活动移动
        $scope.$on(kzi.constant.event_names.on_task_move, function (event, customer) {
//            var list = _.where($scope.tasks, {objectId: customer.objectId});
//            if (list.length > 0) {
//                var customer = list[0];
//                customer.is_published = true;
//            }
            load_data($scope.queryCondition);
        });

        var clearCustomer = function () {
            $scope.newCustomer = {
                name: '',
                company: '',
                email: '',
                phone: '',
                website: ''
            };
        }

        //监听创建
        $scope.$on('customer_add', function (event, customer) {
            //切换到私有标签页
            if ($scope.queryCondition.type != 1) {
                $scope.queryCondition.type = 1
            }
            {
                $scope.tasks.unshift(customer);
                $scope.totalItems++;
                $rootScope.teams[0].private_task_count++;
                $rootScope.teams[0].task_count++;
            }
            var pid = $scope.pid = $routeParams.pid || ($rootScope.projects[0] && $rootScope.projects[0].pid) || '';
            $rootScope.teams && _.forEach($rootScope.teams[0].projects, function (project) {
                if (project.pid === pid) {
                    project.badges.task_count++;
                    project.badges.private_task_count++;
                }
            })
            clearCustomer();
            $scope.show_add_customer = false;
        });
        //监听取消
        $scope.$on('customer_cancel', function (event, args) {
            $scope.show_add_customer = args;
            clearCustomer();
        });
    }
]);

innerApp.controller('add_customer_ctrl', ['$rootScope', '$location', '$scope', '$routeParams', function ($rootScope, $location, $scope, $routeParams) {
    var clearCustomer = function () {
        $scope.newCustomer = {
            name: '',
            company: '',
            email: '',
            mainIndustryCode: '',
            mainIndustryCnName: '',
            subIndustryCnName: '',
            subIndustryCode: '',
            zoneCode: '',
            zoneCnName: '',
            countryCnName: '',
            countryCode: '',
            phone: '',
            website: ''
        };
    }

    clearCustomer();
    //创建活动
    $scope.js_add_customer = function () {
        var pid = $routeParams.pid || ($rootScope.projects[0] && $rootScope.projects[0].pid) || '';
        if ($scope.newCustomer.subIndustryCode == null) {
            $scope.newCustomer.subIndustryCode = $scope.newCustomer.mainIndustryCode;
            $scope.newCustomer.subIndustryCnName = $scope.newCustomer.subIndustryCnName;
        }
        if ($scope.newCustomer.countryCode == null) {
            $scope.newCustomer.countryCode = $scope.newCustomer.zoneCode;
            $scope.newCustomer.countryCnName = $scope.newCustomer.zoneCnName;
        }
        $scope.is_save_ing = true;
        wt.data.task.add(
            pid,
            $scope.newCustomer,
            function (response) {
                clearCustomer();
                $scope.copyStr = '';
                kzi.msg.success("保存成功！");
                $rootScope.$broadcast('customer_add', response.data);
            },
            function () {

            },
            function () {
                $scope.is_save_ing = false;
            }
        )
    };

    $scope.js_cancel_add = function () {
        clearCustomer();
        $scope.copyStr = '';
        $rootScope.$broadcast('customer_cancel', false);
    }

    $scope.placeholder = "智能匹配，请将联系人信息拷贝到此处\r\n支持键值对格式，键名不区分中英文，每个活动属性需换行\r\n(示例数据)\r\n公司名称:ALBERTA LTD\r\n联系人:Debbie Jacklin\r\n电话:403 294 9002\r\n邮箱:info@dkbeautysystems.ca\r\n地址:4025 4 St Se Calgary, AB T2G 2W4, Canada\r\n网站:http://www.dkbeautysystems.ca\r\n国家:美国\r\n";

    $scope.$watch('copyStr', function (copyStr) {
        if (copyStr && copyStr != "") {
            var infoArray = copyStr.split(/\n/);
            var objArray = [];
            _.each(infoArray, function (info) {
                var array = info.split(/:|：/);
                var obj = {};
                obj.key = array[0];
                obj.value = array[1];
                //网址特殊处理
                if (obj.value == "http" && array.length > 2) {
                    obj.value = "http:" + array[2];
                }
                objArray.push(obj);
            });
            var systemFieldList = kzi.constant.systemFieldList;
            _.each(objArray, function (obj) {
                _.each(systemFieldList, function (field) {
                    var key = obj.key;
                    if (field.pattern.test(key)) {
                        var systemKey = field.value;
                        switch (systemKey) {
                            case 'company':
                                $scope.newCustomer.company = obj.value;
                                break;
                            case 'name':
                                $scope.newCustomer.name = obj.value;
                                break;
                            case 'email':
                                $scope.newCustomer.email = obj.value;
                                break;
                            case 'phone':
                                $scope.newCustomer.phone = obj.value;
                                break;
                            case 'website':
                                $scope.newCustomer.website = obj.value;
                                break;
                        }
                    }
                })
            })
        }
    })
}]);
