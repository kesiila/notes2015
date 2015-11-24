'use strict';
innerApp.controller('tasks_ctrl_bak', [
    "$scope", "$routeParams", "$rootScope", "$popbox",
    function ($scope, $routeParams, $rootScope, $popbox) {
        $rootScope.global.right_sidebar_show_part = 3;
        $rootScope.global.right_sidebar_is_fold = true;
        $rootScope.global.title = '我的活动';
        $rootScope.global.loading_done = true;

        $scope.selectAll = false;
        $scope.show_completed = 0;
        $scope.my_task_view = 'date';
        $scope.team_id = 'all';
        $scope.current_type = 'tasks';
        kzi.localData.get('my_task_view') ? $scope.my_task_view = kzi.localData.get('my_task_view') : ($scope.my_task_view = 'date', kzi.localData.set('my_task_view', $scope.my_task_view));

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
                _.where($scope.my_tasks_ori, { team_id: $scope.team_id });
            $scope.my_tasks = 'date' == $scope.my_task_view? r(t) : l(t);
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
            var today=moment();
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
                var a = { tasks: _.where(e, { pid: t[n] }) };
                _.isEmpty(a.tasks) || (a.project = a.tasks[0].project, i.push(a));
            }
            return i;
        };

        $scope.show_mail_list = false;

        $scope.js_show_mail_list = function () {
        	$scope.show_mail_list = !$scope.show_mail_list;
        }

        /*等同于$scope.teams=$rootScope.teams*/
        $rootScope.load_teams(
            function (teams) {
                $scope.teams = teams;
            },
            null,
            function () {
            }
        );

        $scope.js_toggle_task = function (e) {
            wt.bus.mail.toggle_task_member(e, $scope.edit_mail, "")
        };

        $scope.js_cancel_edit_mail = function () {
            $scope.show_add_mail = !1, $scope.edit_mail.name = "", $scope.edit_mail.content = "", $scope.edit_mail.watchers = [me], $scope.clear();;
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
         	 $rootScope.selectedTasks.length = 0;
         	 $scope.edit_mail.tasks.length = 0;
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
            $scope.show_add_mail = !$scope.show_add_mail;
            $rootScope.global.right_sidebar_is_fold = $scope.show_add_mail;
            if ($scope.show_add_mail) {
                wt.bus.mail.watch_alltask_members($rootScope.selectedTasks, $scope.edit_mail, o, function () {
                }, null, function () {
                });
                $rootScope.global.right_sidebar_show_part = 32;
                $rootScope.global.right_sidebar_is_fold = false;
            } else {
                $rootScope.global.right_sidebar_show_part = 31;
                $rootScope.global.right_sidebar_is_fold = false;
            }
            ;
            $rootScope.global.right_sidebar_is_fold ? kzi.localData.set("right_sidebar_is_fold", 1) : kzi.localData.set("right_sidebar_is_fold", 0);
        };

        $scope.show_add_customer=false;
        $scope.js_add_task_pop = function (t) {
            $scope.show_add_customer = !$scope.show_add_customer;
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
                    var o = _.findWhere( $rootScope.selectedTasks, {
                        tid: task.tid
                    });
                    o || $rootScope.selectedTasks.push(task);
                    task.checked = true;
                })
            } else {
            	 $scope.clear();
/*                $rootScope.global.right_sidebar_is_fold = true;
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
*/            }
        };
        $scope.toggle = function (e) {
            e.checked = !e.checked;
            if (e.checked) {
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.global.right_sidebar_show_part = 31;
                $rootScope.selectedTasks.push(e)
                if($rootScope.selectedTasks.length == $scope.tasks.length){
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
                if ($rootScope.selectedTasks.length ==0) {
         		   $scope.clear();
         	   }
            }
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
            e.stopPropagation(),
            t.completed = 0 == t.completed ? 1 : 0, $rootScope.refresh_cache.task.complete(t.tid, t.completed), $rootScope.$broadcast(kzi.constant.event_names.on_task_complete, t);
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

            if(!_.isEmpty(n))
            {
                var t = _.findWhere($scope.tasks, { tid: n.tid });
                t && (t.name = n.name, t.desc = n.desc, t.pos = n.pos, t.completed = n.completed, t.expire_date = n.expire_date, t.badges = n.badges, t.labels = n.labels, t.members = n.members, t.watchers = n.watchers, t.todos = n.todos);
            };
            $rootScope.locator.show_prj && $rootScope.refresh_cache.task.update_full(n);
        });



        $rootScope.$on(kzi.constant.event_names.on_task_share, function (t, i) {
            i && (_.isEmpty($scope.tasks) || ($scope.tasks = _.reject($scope.tasks, function (e) {
                return e.tid === i;
            })), $rootScope.teams[0].private_task_count -=1,
            $rootScope.teams[0].share_task_count +=1);
        });

//        $rootScope.$on(kzi.constant.event_names.on_task_trash, function (t, i) {
//            i && (_.isEmpty($scope.tasks) || ($scope.tasks = _.reject($scope.tasks, function (e) {
//                return e.tid === i.tid;
//            })), i.is_published?$rootScope.teams[0].share_task_count -=1:$rootScope.teams[0].private_task_count -=1,
//            		$rootScope.teams[0].task_count -=1);
//        });


        /*refactor*/
        $scope.currentPage=1;
        $scope.itemsPerPage=20;
        $scope.totalItems=0;
        //0全部，1私有，2分享，3收藏
        $scope.type=0;
        $scope.isDESC=1;//默认倒序排序

        $scope.sortTastDates=function()
        {
        	$scope.isDESC=!$scope.isDESC;
        	loadData();
        }

        var loadData = function () {
            $scope.part_loading_done = false;
            $rootScope.global.loading_done = false;
            wt.data.task.get_for_private($rootScope.teams[0].team_id,"",
                $scope.type,
                $scope.currentPage,
                $scope.itemsPerPage,
                $scope.isDESC,
                function (response) {
                    $scope.totalItems=response.totalItems;
                    $rootScope.global.loading_done = true;
                    $scope.tasks = response.data;

                    switch($scope.type)
                    {
                        case 0:$rootScope.teams[0].task_count = $scope.totalItems;break;
                        case 1:$rootScope.teams[0].private_task_count = $scope.totalItems;break;
                        case 2:$rootScope.teams[0].share_task_count = $scope.totalItems;break;
                        case 3:$rootScope.teams[0].download_task_count = $scope.totalItems;break;
                        default :;
                    };

//                    if ($scope.type==0) {
//                    	$rootScope.teams[0].task_count = $scope.totalItems
//                    } else if($scope.type==1) {
//                    	$rootScope.teams[0].private_task_count = $scope.totalItems
//                    } else if($scope.type==2) {
//                    	$rootScope.teams[0].share_task_count = $scope.totalItems
//                    } else if($scope.type==3) {
//                    	$rootScope.teams[0].download_task_count = $scope.totalItems
//                    }
                },
                null,
                function () {
                    $scope.part_loading_done = true;
                    $rootScope.global.loading_done = true;
                }
            );
        };

        $scope.jumpToPage=function(pageNum){
            if (/\D/.test(pageNum)) {
                kzi.msg.error("页码应该是数字", null);
                return false;
            }
            $scope.currentPage=pageNum;
        };

        $scope.$watch("currentPage",function(){
            $scope.pageNum=$scope.currentPage;
            loadData();
        });

//        $scope.$watch("itemsPerPage",function(){
//            loadData();
//        });

        //切换标签页
        $scope.load=function(type){
            $scope.selectAll=false;
            $scope.type=type;
            //加载第一页数据
            if($scope.currentPage!=1){
                $scope.currentPage=1;
            }else{
                loadData();
            }
        }

        //批量分享
        $scope.js_batch_share=function(){
            var customerIdList=[];
            angular.forEach($rootScope.selectedTasks,function(customer){
                customerIdList.push(customer.objectId);
            });
            wt.data.task.batch_share(
                {'list':customerIdList},
                function ()
                {
                    $rootScope.selectedTasks.length=0;
                    var count=customerIdList.length;
                    $rootScope.updatescore(kzi.constant.score.config.shareCustomer * count, "成功分享" + count + "位活动，系统赠送" + kzi.constant.score.config.shareCustomer * count + "积分！");
//                    $rootScope.updatescore($rootScope.scoreConfig.shareCustomer*customerIdList.length,"成功分享"+customerIdList.length+"位活动，系统赠送"+$rootScope.scoreConfig.shareCustomer*customerIdList.length+"积分！");
                    //跳转到分享页
                    $scope.load(2);
                },
                function () {kzi.msg.error('分享失败！',function(){});},
                function () {customerIdList=[];$scope.selectedCustomers=[];}
            );
        }

        $rootScope.$watch("projects",function(projects){
            if(projects.length>0){
                $scope.currentProjectId=projects[0].pid;
            }
        })


        //监听分享
        $scope.$on(kzi.constant.event_names.on_task_move, function (event, customer, n) {
            var list=_.where($scope.tasks,{objectId:customer.objectId});
            if(list.length>0){
                var customer=list[0];
                customer.is_published=true;
            }
        })

        //监听创建
        $scope.$on('customer_add',function(event,customer){
           $scope.tasks.unshift(customer);
//            $rootScope.teams[0].private_task_count++;
//            $rootScope.teams[0].task_count++;
        });
        
        var clearCustomer=function(){
            $scope.newCustomer={
                name:'',
                company:'',
                email:'',
                phone:'',
                website:''
            };
        }
        clearCustomer();
        //创建活动
        $scope.js_add_customer=function(){
            wt.data.task.add(
                $scope.currentProjectId,
                $scope.newCustomer,
                function(response){
                    kzi.msg.success("保存成功！",function(){});
                    $rootScope.$broadcast('customer_add',response.data);
                },
                function(){

                },
                function(){

                }
            )
        }

        $scope.js_cancel_add=function(){
            clearCustomer();
            $scope.show_add_customer=false;
        }

        $scope.$watch('copyStr',function(copyStr){
//            console.log(copyStr.split('\n'));
    /*        console.log(copyStr);*/
        })

    }
]);

//innerApp.controller('add_customer_ctrl',['$rootScope','$scope',function($rootScope,$scope){
//    var clearCustomer=function(){
//        $scope.newCustomer={
//            name:'',
//            company:'',
//            email:'',
//            phone:'',
//            website:''
//        };
//    }
//    clearCustomer();
//    //创建活动
//    $scope.js_add_customer=function(){
//        wt.data.task.add(
//            $scope.currentProjectId,
//            $scope.newCustomer,
//            function(response){
//                kzi.msg.success("保存成功！");
//                $rootScope.$broadcast('customer_add',response.data);
//            },
//            function(){
//
//            },
//            function(){
//
//            }
//        )
//    }
//
//    $scope.js_cancel_add=function(){
//        clearCustomer();
//        $scope.show_add_customer=false;
//    }
//
//    $scope.$watch('copyStr',function(copyStr){
//        console.log(copyStr.split('\n'));
///*        console.log(copyStr);*/
//    })
//}]);
