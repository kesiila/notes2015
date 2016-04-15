'use strict';
innerApp.controller('project_tasks_ctrl', [
    "$scope", "$routeParams", "$rootScope", "$popbox","$timeout",
    function ($scope, $routeParams, $rootScope, $popbox,$timeout) {
        var pid = $routeParams.pid,
            tid = $routeParams.team_id;
        var mock = $routeParams.mock || false;

        $scope.mock = mock;
        $scope.pid = pid, $scope.tid = tid;
        $rootScope.pid = pid, $rootScope.tid = tid;

        $rootScope.global.right_sidebar_show_part = 3;
        $rootScope.global.right_sidebar_is_fold = true;
        $rootScope.global.title = '我的活动';
        $rootScope.global.loading_done = true;

        $scope.project = {
            badges: {}
        }
        $scope.selectAll = false;
        $scope.show_completed = 0;
        $scope.my_task_view = 'date';
        $scope.team_id = 'all';
        $scope.current_type = 'tasks';
        kzi.localData.get('my_task_view') ? $scope.my_task_view = kzi.localData.get('my_task_view')
            : ($scope.my_task_view = 'date', kzi.localData.set('my_task_view', $scope.my_task_view));
        $rootScope.load_project(pid, function (i) {
            $rootScope.selectedTasks=[];
            $rootScope.global.title = "项目 | " + i.info.name, $scope.project = i,
                $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived
                    : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service
                    : kzi.constant.permission.ok
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path("/project/" + o + "/notfound") : wt.data.error(e)
        });
        var me = $rootScope.global.me;
        $scope.customer_status_index = 0;
        $scope.filter_customer_status =
            [
                {name: "筛选活动", value: "all"}
                ,{name: "已打开", value: "mail_opened"}
                ,{name: "未开发", value: "underdevelopment"}
                ,{name:"取消筛选",value:"move_filter"}
            ];
        var o = function () {
            var t = [];
            t = 'all' == $scope.team_id ?
                $scope.my_tasks_ori :
                _.where($scope.my_tasks_ori, {team_id: $scope.team_id});
            $scope.my_tasks = 'date' == $scope.my_task_view ? r(t) : l(t);
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

        var uu = $rootScope.global.me;
        $scope.edit_mail = {
            name: "",
            content: "",
            tasks: [],
            watchers: [uu]
        };

        $scope.show_mail_list = false;

        $scope.js_show_mail_list = function () {
            $scope.show_mail_list = !$scope.show_mail_list;
        }

        $scope.clear = function () {
            $rootScope.global.right_sidebar_is_fold = true;
            $rootScope.global.right_sidebar_show_part = 3;
            $rootScope.selectedTasks.length = 0;
            $scope.edit_mail.tasks = [];
            $scope.selectAll = false;
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

        $rootScope.global.right_sidebar_is_fold = true;
        $rootScope.global.right_sidebar_show_part = 3;

        $scope.js_cancel_edit_mail = function () {
            $rootScope.global.right_sidebar_show_part = 31,
                $scope.show_add_mail = !1, $scope.edit_mail.subject = "",
                $scope.edit_mail.content = "",
                $scope.edit_mail.watchers = [uu],
                $scope.clear();
        };
        $scope.js_remove_selected = function (selected, all) {
            wt.service.mail.batch_delete(i, e, c, function () {
            }, null, function () {
            });
        };

        $scope.js_send_mail = function (t) {
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
            //reset check input
            reset_checked_input();
        };
        //$scope.js_show_project_tasks_filter = function() {
        //    $scope.$broadcast(kzi.constant.event_names.show_project_tasks_filter);
        //};
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

        var reset_checked_input = function () {
            $scope.selectAll = false;
            _.each($scope.tasks, function (task) {
                if (task.checked) {
                    $scope.toggle(task, null);
                }
            })
        };

        $scope.js_toggle_task = function (e) {
            wt.bus.mail.toggle_task_member(e, $scope.edit_mail, pid)
        };

        $scope.js_toggle_template = function (e, es) {
            e.checked = !e.checked;
            $scope.edit_mail.name = e.name;
            $scope.edit_mail.content = e.content;
            es && es.length > 0 && _.each(es, function (t) {
                if (t.template_id != e.template_id)
                    t.checked = false;
            })
        };

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
            }
        };
        $scope.toggle = function (e, event) {
            event && event.stopPropagation();
            e.checked = !e.checked;
            if (e.checked) {
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.global.right_sidebar_show_part = 31;
                $rootScope.selectedTasks.push(e)
            } else {
                var i = _.findWhere($rootScope.selectedTasks, {
                    tid: e.tid
                });
                i && ($rootScope.selectedTasks = _.reject($rootScope.selectedTasks, function (t) {
                    return t.tid === e.tid
                }));
                $scope.selectAll = false;
                if ($rootScope.selectedTasks.length == 0) {
                    $scope.clear();
                }
            }
        };
        //批量删除用户
        $scope.batch_remove=function(t){
            $popbox.popbox({
                target: t,
                placement: 'bottom',
                templateUrl: "/view/project/task/pop_delete_select_task.html",
                controller: ["$scope", "popbox", "pop_data",   function ($scope, popbox, pop_data) {
                        $scope.popbox = popbox;
                        $scope.js_delete_select_task=function(){
                            var ids=[],cids=[],sids=[];
                            if(!_.isEmpty($rootScope.selectedTasks)){
                            _.each($rootScope.selectedTasks,function(task){
                                if(task.is_published==0){
                                    ids.push(task.tid);
                                }else  if(task.uid==$rootScope.global.me.uid){
                                    sids.push(task.tid);
                                }else{
                                    cids.push(task.tid);
                                }
                            });
                                //$scope.project.badges.task_count
                            wt.data.task.batch_remove($rootScope.project.info.pid,$rootScope.teams[0].team_id, ids, cids, sids,function () {
                                    kzi.msg.success("活动删除成功");
                                    $rootScope.$broadcast(kzi.constant.event_names.remove_customer_on_customer_list, {
                                        pid: $rootScope.project.info.pid,
                                        ids_count: ids.length ||0,
                                        cids_count: cids.length || 0,
                                        sids_count:sids.length||0
                                    });
                                    pop_data.scope.project.badges.task_count-=(ids.length+cids.length+sids.length);
                                    pop_data.scope.project.badges.private_task_count-=ids.length;
                                    pop_data.scope.project.badges.download_task_count-=cids.length;
                                    pop_data.scope.project.badges.share_task_count-=sids.length;
                                    pop_data.load_data( pop_data.scope.queryCondition);
                                    pop_data.scope.clear();
                                    $scope.js_close();
                                }, function () {
                                    kzi.msg.error("活动删除失败");
                                }, function () {
                                }
                            );
                        }
                        }
                        $scope.js_close = function () {
                            popbox.close()
                        };
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            load_data: load_data
                        }
                    }
                }
            }).open()
        };
        $scope.js_move = function (t, selectTasks) {
            $popbox.popbox({
                target: t,
                templateUrl: "/view/project/task/pop_movep_task.html",
                controller: ["$scope", "popbox", "pop_data", "$timeout",
                    function ($scope, popbox, pop_data, $timeout) {
                        $scope.popbox = popbox;
                        $scope.collect_task = {};

                        //筛选器--默认显示上一次选择的组
                        function tmp(projects, pid) {
                            var afterFilter = _.filter(projects, function (i) {
                                return i.pid === pid
                            });
                            if (afterFilter.length === 1) return afterFilter[0];
                            if (afterFilter.length === 0) return projects[0];
                            if (afterFilter.length > 1) throw new Error("有两个组具有相同的pid");
                        }

                        if (_.isEmpty($scope.projects) && $scope.global.is_login) {
                            $scope.reload_projects(function (ee_projects) {
                                if (_.isEmpty(ee_projects)) {
                                    $scope.projects = _.filter(ee_projects, function (i) {
                                        return i.pid != pop_data.scope.pid;
                                    });
                                }
                                $scope.collect_task.project = tmp(ee_projects, $rootScope.batch_move__current_project_pid);
                            });
                        }

                        _.isEmpty($scope.projects) || ($scope.collect_task.project = tmp($scope.projects, $rootScope.batch_move__current_project_pid));
                        $scope.js_close = function () {
                            popbox.close()
                        };
                        $scope.js_move_task = function () {
                            var private_ids = [],share_ids=[] ,download_ids=[];
                            var tids=[];
                            var from_pid = selectTasks[0].pid;
                            _.each(selectTasks, function (task) {
                                if(task.is_published==0){
                                    private_ids.push(task.tid);
                                    tids.push(task.tid);
                                }else  if(task.uid==$rootScope.global.me.uid){
                                    share_ids.push(task.tid);
                                    tids.push(task.tid);
                                }else{
                                    download_ids.push(task.tid);
                                }
                            });
                            wt.data.task.batch_move($scope.collect_task.project.pid, from_pid, $scope.collect_task.project.team_id, tids, download_ids, function () {
                                $rootScope.$broadcast(kzi.constant.event_names.on_task_batch_move, {
                                    form_pit: selectTasks[0].pid,
                                    to_pid: $scope.collect_task.project.pid,
                                    all_count: selectTasks.length,
                                    private_count:private_ids.length ||0,
                                    download_count:download_ids.length ||0,
                                    share_count:share_ids.length ||0
                                });
                                pop_data.scope.project.badges.task_count-=selectTasks.length;
                                pop_data.scope.project.badges.private_task_count-=private_ids.length;
                                pop_data.scope.project.badges.download_task_count-=download_ids.length;
                                pop_data.scope.project.badges.share_task_count-=share_ids.length;
                                pop_data.load_data(pop_data.scope.queryCondition);
//                                if (i && i.length === pop_data.scope.queryCondition.itemsPerPage) {
//                                    pop_data.load_data(pop_data.scope.queryCondition)
//                                } else {
//                                    _.each(i, function (task) {
//                                        $rootScope.$broadcast(kzi.constant.event_names.on_task_trash, task);
//                                    });
//                                    i.length = 0;
//                                }
                                $rootScope.batch_move__current_project_pid = $scope.collect_task.project.pid;
                                pop_data.scope.clear();
                                $scope.send_success = !0;
                                $timeout($scope.js_close, 2000);
                            }, function error() {

                            }, function () {
                            })
                        }
                    }
                ],
                resolve: {
                    pop_data: function () {
                        return {
                            scope: $scope,
                            load_data: load_data
                        }
                    }
                }
            }).open()
        };

        $scope.js_task_view_toggle = function (t) {
            $scope.my_task_view = t, o(), kzi.localData.set('my_task_view', t);
        };

        $scope.js_show_completed_toggle = function (t) {
            $scope.show_completed = t;
            wt.utility.load_data_by_page(loadData, $scope);
        };

        $scope.js_filter_task = function (t) {
            $scope.team_id = t, o();
        };

        $scope.js_complete_task = function (e, t) {
            e.stopPropagation();
            if (t.completed == -1 || t.completed == 1) {
                wt.data.task.start(pid, t.tid,
                    function (response) {
                        kzi.msg.success("活动进入交易流程，请在交易墙跟踪开发！");
                        t.entry_id = t.pid + "-step_one";
                        $rootScope.$broadcast(kzi.constant.event_names.on_task_start, t);
                    },
                    function () {

                    },
                    function () {

                    });
            } else if (t.completed == 0) {
                wt.data.task.complete(pid, t.tid,
                    function (response) {
                        kzi.msg.success("活动交易完成，退出交易流程.");
                        $rootScope.$broadcast(kzi.constant.event_names.on_task_complete, t);
                        t.entry_id = "0";

                    },
                    function () {

                    },
                    function () {

                    });
            }
        };
        $scope.$on(kzi.constant.event_names.on_tasks_labels_update, function (event, parm) {
            var project_labels=parm;
            $scope.tasks = _.map($scope.tasks, function(task){
                task.labels = _.chain(task.labels)
                    .map(function(label) {
                        label.desc = _.find(project_labels,function(project_label){
                            return project_label.name == label.name;
                        }).desc;
                        return label;
                    })
                    .filter(function(label) {
                        return !!label.desc.trim();
                    })
                    .value();
                return task;
            });
        });
        $scope.$on(kzi.constant.event_names.on_task_update, function (t, n) {
            n && (_.isEmpty($scope.tasks) || _.each($scope.tasks, function (e) {
                if (!_.isEmpty($scope.tasks)) {
                    var t = _.findWhere($scope.tasks, {tid: n.tid});
                    _.isEmpty(t) || (t.name = n.name,
                        t.desc = n.desc,
                        t.pos = n.pos,
                        t.tags = n.tags,
                        t.completed = n.completed,
                        t.expire_date = n.expire_date,
                        t.badges = n.badges,
                        t.labels = n.labels,
                        t.members = n.members,
                        t.watchers = n.watchers,
                        t.todos = n.todos,
                        t.address = n.address,
                        t.email = n.email,
                        t.position = n.position,
                        t.website = n.website,
                        t.products = n.products,
                        t.mobile = n.mobile,
                        t.phone = n.phone,
                        t.fax = n.fax,
                        t.msn = n.msn,
                        t.skype = n.skype,
                        t.facebook = n.facebook,
                        t.linkedin = n.linkedin,
                        t.qq = n.qq,
                        t.weixin = n.weixin,

                        t.mainIndustryCode = n.mainIndustryCode,
                        t.mainIndustryCnName = n.mainIndustryCnName,
                        t.subIndustryCode = n.subIndustryCode,
                        t.subIndustryCnName = n.subIndustryCnName,

                        t.zoneCode = n.zoneCode,
                        t.zoneCnName = n.zoneCnName,
                        t.countryCode = n.countryCode,
                        t.countryCnName = n.countryCnName,
                        t.company = n.company
                    );
                }
            }), $rootScope.locator.show_prj && $rootScope.refresh_cache.task.update_full(n));
        });

        $scope.$on(kzi.constant.event_names.on_task_start, function (t, i) {
            var tt = _.findWhere($scope.tasks, {
                tid: i.tid
            });
            tt && (tt.completed = 0);
        });

        $scope.$on(kzi.constant.event_names.on_task_complete, function (t, i) {
            var tt = _.findWhere($scope.tasks, {
                tid: i.tid
            });
            tt && (tt.completed = 1, tt.entry_id = "0", $rootScope.refresh_cache.task.update_full(i));
        });

        $rootScope.$on(kzi.constant.event_names.on_task_share, function (t, i) {
//            $scope.load(1);
            load_data($scope.queryCondition);
            $rootScope.teams[0].private_task_count -= 1;
            $rootScope.teams[0].share_task_count += 1;

//            i && (_.isEmpty($scope.tasks) || ($scope.tasks = _.reject($scope.tasks, function (e) {
//                return e.tid === i;
//            })), $rootScope.teams[0].private_task_count -= 1,
//                $rootScope.teams[0].share_task_count += 1);
        });

//        $scope.$on(kzi.constant.event_names.on_task_share, function (t, i) {
//            if (i && !_.isEmpty($scope.tasks)) {
//                switch ($scope.queryCondition.type) {
//                    case 0:
//                        _.each($scope.tasks, function (task) {
//                            if (task.tid == i) {
//                                task.is_published = "1";
//                                return;
//                            }
//                        });
//                        break;
//                    case 1:
//                        $scope.tasks = _.reject($scope.tasks, function (task) {
//                            return task.tid == i;
//                        });
//                        break;
//                    default :
//                        break;
//                }
//                ;
//                $scope.project.badges.private_task_count -= 1;
//                $scope.project.badges.share_task_count += 1;
//            }
//        });

        //删除活动事件
        $scope.$on(kzi.constant.event_names.entity_del, function (event, p) {
            $scope.tasks = _.filter($scope.tasks, function (e) {
                return e.objectId != p.id;
            });
            $rootScope.teams[0].task_count --;
            $rootScope.teams && _.forEach($rootScope.teams[0].projects,function(project){
               if(project.pid === $scope.pid) {
                   project.badges.task_count--;

               }
            })
            $scope.project.badges.task_count--;
            switch($scope.queryCondition.type) {
                case 1 :
                    $scope.project.badges.private_task_count--;
                    $rootScope.teams[0].private_task_count--;
                    break;
                case 2 :
                    $scope.project.badges.share_task_count--;
                    $rootScope.teams[0].share_task_count--;
                    break;
                case 3 :
                    $scope.project.badges.download_task_count--;
                    $rootScope.teams[0].download_task_count--;
                    break;
                default: break;
            }
            $scope.totalItems -= 1;
        }, null);


        $rootScope.$on(kzi.constant.event_names.on_task_trash, function (t, i) {
            i && (_.isEmpty($scope.tasks) || ($scope.tasks = _.reject($scope.tasks, function (e) {
                return e.tid === i.tid;
            }))

//                $scope.project.badges.task_count -=1,
//
//                i.is_published || ($scope.project.badges.private_task_count -=1),
//
//                i.is_published &&(i.uid==$rootScope.global.me.uid?$scope.project.badges.share_task_count-=1:$scope.project.badges.download_task_count-=1)

            );
        });

        /*refactor*/
        $scope.show_add_customer = false;
        $scope.js_add_task_pop = function (t) {
            $scope.show_add_customer = !$scope.show_add_customer;
        };


        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.itemsPerPage = 20;

        var init_type = $routeParams.type;
        $scope.task_filters= {
            texts: "",
            labels: [],
            zoneCode:"",
            countryCode:"",
            date: "" //这里时间是多长时间未联系，-1是未开发的活动
        }
        $scope.queryCondition = {
            type: _.isEmpty(init_type) ? 3 : init_type,        //0全部，1私有，2分享，3收藏
            currentPage: 1,
            itemsPerPage: 20,
            isDESC: 1,//默认倒序排序
            isOpen:0,//默认是0，打开为1 ，未打开为-1
            task_filters: $scope.task_filters
        };
        $scope.sort = function () {
            $scope.queryCondition.isDESC = !$scope.queryCondition.isDESC;
        };
        $scope.$on(kzi.constant.event_names.on_project_tasks_filter,
            function(event,project_tasks_filter){
                $scope.queryCondition.task_filters=project_tasks_filter;
            }
        );
        $scope.$on(kzi.constant.event_names.project_clear_task_filter,
            function () {
                $scope.queryCondition.task_filters={
                    texts: "",
                    labels: [],
                    zoneCode:"",
                    countryCode:"",
                    date: "" //这里时间是多长时间未联系，
                }
            });
        $scope.js_show_project_tasks_filter = function() {
            if($scope.customer_status_index==0){
                $scope.$broadcast(kzi.constant.event_names.show_project_tasks_filter);
            }
        }
        /**
         * 根据邮件打开状态筛选活动
         */
        $scope.choose_filter_customer_status = function (index) {
            if (index != $scope.customer_status_index) {
                $scope.customer_status_index = index;
            }
            if(index==1){
                $scope.queryCondition.isOpen=1;
            }else if(index==2){
                $scope.queryCondition.task_filters.date=-1;
                $scope.queryCondition.isOpen=0;
                $scope.$broadcast(kzi.constant.event_names.project_tasks_filter_underdevelopment);
            }else if(index==3){
                var type=$scope.queryCondition.type;
                $scope.task_filters= {
                    texts: "",
                    labels: [],
                    zoneCode:"",
                    countryCode:"",
                    date: "" //这里时间是多长时间未联系，-1是未开发的活动
                }
                $scope.queryCondition = {
                    type: type,        //0全部，1私有，2分享，3收藏
                    currentPage: 1,
                    itemsPerPage: 20,
                    isDESC: 1,//默认倒序排序
                    isOpen:0,//默认是0，打开为1 ，未打开为-1
                    task_filters: $scope.task_filters
                };
                $scope.$broadcast(kzi.constant.event_names.project_clear_task_filter);
            }else{
                $scope.$broadcast(kzi.constant.event_names.show_project_tasks_filter);
                $scope.queryCondition.isOpen=0;
                $scope.queryCondition.task_filters.date=0;
            }
        };
        var load_data = function (queryCondition) {
            $scope.part_loading_done = false;
            wt.data.task.xtype = "programs";
            //判断是否有过滤条件
            var have_task_filters=true;
            if(queryCondition.task_filters.date=="" && queryCondition.task_filters.zoneCode==""
                && queryCondition.task_filters.countryCode=="" && queryCondition.isOpen=="0" && queryCondition.task_filters.labels.length<=0){
                 have_task_filters=false;
            }
            wt.data.task.get_for_private(
                tid,//teamId
                pid,//pid
                queryCondition.type,
                queryCondition.currentPage,
                queryCondition.itemsPerPage,
                queryCondition.isDESC,
                queryCondition.isOpen,
                queryCondition.sortKey,
                queryCondition.task_filters.zoneCode,
                queryCondition.task_filters.countryCode,
                queryCondition.task_filters.date==""?"0":queryCondition.task_filters.date,
                queryCondition.task_filters.labels,
                function (response) {
                    $scope.totalItems = response.totalItems;
                    $scope.tasks = response.data;
                    if ($scope.queryCondition.type == 0) {
                        $scope.project.badges.task_count = $scope.totalItems;
                            if(!have_task_filters){
                            $rootScope.teams[0].projects = _.map($rootScope.teams[0].projects, function (e) {
                                if (pid == e.pid) {
                                    e.badges.task_count = 1 * $scope.totalItems;
                                }
                                return e;
                            });
                        }
                    } else if ($scope.queryCondition.type == 1) {
                        $scope.project.badges.private_task_count = $scope.totalItems
                    } else if ($scope.queryCondition.type == 2) {
                        $scope.project.badges.share_task_count = $scope.totalItems
                    } else if ($scope.queryCondition.type == 3) {
                        $scope.project.badges.download_task_count = $scope.totalItems
                    };
                },
                function () {
                },
                function () {
                    $scope.part_loading_done = true;
                }
            );
        };
        $scope.$on(kzi.constant.event_names.load_teams_projects_sucess, function (event, info) {
            var pid = $scope.pid = $routeParams.pid || ($rootScope.projects[0] && $rootScope.projects[0].pid) || '';
            $scope.project.badges = _.filter($rootScope.projects,function(project){
                return project.pid === pid;
            })[0].badges;
        });
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
        $scope.switch_tasks_project = function (type) {
            //加载第一页数据
            if ($scope.queryCondition.currentPage != 1) {
                $scope.queryCondition.currentPage = 1;
            }
            $scope.queryCondition.type = type;
            if (type === 1) {
                $rootScope.global.right_sidebar_item = 'share';
            } else {
                $rootScope.global.right_sidebar_item = "";
            }

            $rootScope.selectedTasks = [];
            $scope.selectAll = false;
        };

        /**
         * 批量分享活动
         * @param event
         */
        $scope.customer_batch_share_project = function (event) {
            $popbox.popbox({
                target: event,
                templateUrl: "/view/common/pop_batch_share_task.html",
                controller: ["$scope", "popbox", "pop_data","$timeout",
                    function ($scope, popbox, pop_data,$timeout) {
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
                            ;
                        };
                        /**
                         * 切换到私有活动标签页
                         */
                        $scope.to_choose_private_customers = function () {
                            pop_data.scope.switch_tasks_project(1);
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
                            },
                            pid: pid,
                            tid: tid
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

//        //监听分享
//        $scope.$on(kzi.constant.event_names.on_task_move, function (event, customer, n) {
//            var list = _.where($scope.tasks, {objectId: customer.objectId});
//            if (list.length > 0) {
//                var customer = list[0];
//                customer.is_published = true;
//            }
//        });

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
                $scope.project.badges.task_count++;
                $scope.project.badges.private_task_count++;
                $rootScope.teams[0].private_task_count++;
                $rootScope.teams[0].task_count++;
            }
            $rootScope.teams && _.forEach($rootScope.teams[0].projects,function(project){
                if(project.pid === $scope.pid) {
                    project.badges.task_count++;
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
        $scope.one_key_batch_send = function () {
            $scope.is_querying = true;
            $rootScope.reload_projects(function success(i) {
                var crt_prjs = i.filter(function (i) {
                    return i.pid === pid;
                })
                var obj = {
                    from: 'groupBatchSend',
                    projectInfos: [{
                        pid: pid,
                        name: crt_prjs[0].name,
                        type: 0,
                        rejectTaskIds: []
                    }],
                    tasks: []
                }
                $rootScope.locator.show_slide = false;
                $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj);
            }, function error() {

            }, function then() {
                $scope.is_querying = false;
            })
            return 0;
        }
    }]);
