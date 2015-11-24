"use strict";
innerApp.controller('dashboard_ctrl', [
    '$scope',
    '$rootScope',
//    'Webdis',
    function ($scope, $rootScope, Webdis) {
        function c(e, t) {
            if (e.expire_date > 0 && t.expire_date > 0) {
                var i = new Date().getTime();
                return e.expire_date === t.expire_date ? 0 : e.expire_date > i && i > t.expire_date ? -1 : i > e.expire_date && t.expire_date > i ? 1 : e.expire_date > i && t.expire_date > i ? e.expire_date > t.expire_date ? 1 : -1 : e.expire_date > t.expire_date ? -1 : 1;
            }
            return e.expire_date > 0 && 0 === t.expire_date ?
                -1 :
                0 === e.expire_date && t.expire_date > 0 ?
                    1 :
                    e.create_date > t.create_date ? -1 : 1;
        }

//        Webdis.subscribe('my-channel', function (data, channel) {
//            console.log('Message received on channel ' + channel + ': ' + data);
//        }, $scope);

        $rootScope.global.title = '最新动态';
        $scope.current_tab = 'feeds';
        $scope.feeds = [];
        $rootScope.global.loading_done = true;
        var getFeeds = function () {
            $scope.part_loading_done = false;
            wt.data.activity.get_feeds('all', 0, 1, function (t) {
                $scope.feeds = t.data;
            }, null, function () {
                $scope.part_loading_done = true;
            });
        }, getMails = function () {
            $scope.part_loading_done = false;
            wt.data.mail.get_list(1, 'all', function (t) {
                $scope.mails = t.data;
            }, null, function () {
                $scope.part_loading_done = true;
            });
        }, getTasks = function () {
            $scope.part_loading_done = false;
            wt.data.task.get_for_me(
                    function (t) {
                        $rootScope.global.loading_done = true;
                        $scope.uncompeleted_tasks = t.data.sort(c);
                        $scope.uncompeleted_tasks = $scope.uncompeleted_tasks.slice(0, 20);
                    }, null, function () {
                        $scope.part_loading_done = true;
                    });
        }, u = function () {
            wt.data.event.get_today_events(function (t) {
                $scope.today_events = t.data;
            });
        }, d = function () {
            wt.data.task.get_for_user_overview(function (t) {
                $scope.overview = t.data;
            }, null, function () {
            });
        };
        $scope.js_change_tab = function (currentTab) {
            $scope.current_tab !== currentTab &&
            ($scope.current_tab = currentTab, kzi.localData.set('dashboard_tab', $scope.current_tab),
                    'my_tasks' === currentTab ? getTasks() : 'feeds' === currentTab && getFeeds(), 'mail' === currentTab && getMails());
        };
        $scope.js_set_mail_read = function (e, t) {
            wt.data.mail.set_read(t.mail_id, function () {
                t.is_read = true;
            });
        };
        $scope.js_open_mail_detail = function (e) {
            $rootScope.locator.to_mail(e.mail_id);
            wt.data.mail.set_read(e.mail_id, function () {
                e.is_read = true;
            });
        };
        var p = function () {
            $scope.current_tab = kzi.localData.get('dashboard_tab'), $scope.current_tab || ($scope.current_tab = 'feeds');
        }, f = function () {
            var t = new Date();
            $scope.show_date = '今天是 ' + kzi.util.getWeekday(t) + '，' + t.format('yyyy年MM月dd日');
            var i = t.getHours();
            6 > i ? $scope.hi_greetings = '夜深了，注意休息' : 9 > i ? $scope.hi_greetings = '早上好，喝杯茶吧！' : 11 > i ? $scope.hi_greetings = '上午好！' : 12 > i ? $scope.hi_greetings = '吃过午饭了么？' : 14 > i ? $scope.hi_greetings = '下午好！准备工作了？' : 17 > i ? $scope.hi_greetings = '下午好！起来运动一下' : 19 > i ? $scope.hi_greetings = '傍晚好！' : 22 > i ? $scope.hi_greetings = '还没下班，辛苦了' : 24 > i && ($scope.hi_greetings = '夜深了，注意休息'), 'feeds' === $scope.current_tab ? getFeeds() : 'my_tasks' === $scope.current_tab && getTasks(), 'mail' === $scope.current_tab && getMails(), d(), u();
        };
        p();
        f();
        $scope.$on(kzi.constant.event_names.on_task_update, function (t, n) {
            if (n) {
                if (!_.isEmpty($scope.uncompeleted_tasks)) {
                    var a = _.findWhere($scope.uncompeleted_tasks, { tid: n.tid });
                    _.isEmpty(a) || (a.name = n.name,
                        a.desc = n.desc,
                        a.pos = n.pos,
                        a.completed = n.completed,
                        a.expire_date = n.expire_date,
                        a.badges = n.badges,
                        a.labels = n.labels,
                        a.members = n.members,
                        a.watchers = n.watchers,
                        a.todos = n.todos,

                        t.name = n.name,
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
                        t.company = n.company,
                        t.desc = n.desc);
                }
                $rootScope.refresh_cache.task.update_full(n);
            }
        });
        $scope.$on(kzi.constant.event_names.on_task_trash, function (t, i) {
            i && (_.isEmpty($scope.uncompeleted_tasks) || ($scope.uncompeleted_tasks = _.reject($scope.uncompeleted_tasks, function (e) {
                return e.tid === i.tid;
            })));
        });
        $scope.$on(kzi.constant.event_names.on_task_complete, function (t, i) {
            if (i && !_.isEmpty($scope.uncompeleted_tasks)) {
                var n = _.findWhere($scope.uncompeleted_tasks, { tid: i.tid });
                n && (n.completed = i.completed);
            }
        });
        $scope.$on(kzi.constant.event_names.on_event_update, function (t, i) {
            if ($scope.today_events) {
                var n = _.findWhere($scope.today_events, { event_id: i.event_id });
                n && (n.name = i.name, n.start.date = i.start.date, n.end.date = i.end.date);
            }
        });
        $scope.$on(kzi.constant.event_names.on_event_trash, function (t, i) {
            $scope.today_events && ($scope.today_events = _.reject($scope.today_events, function (e) {
                return e.event_id === i.event_id;
            }));
        });
        $scope.$on(kzi.constant.event_names.on_mail_trash, function (t, i) {
            $scope.mails && ($scope.mails = _.reject($scope.mails, function (e) {
                return e.mail_id === i.mail_id;
            }));
        });
    }
]);

innerApp.controller('search_result_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    function ($scope, $routeParams, $rootScope, $location) {
        $rootScope.global.title = '搜索结果',
            $scope.keywords = $routeParams.keywords,
            $scope.query = {
                type: 'all',
                page: 1,
                size: 20
            },
            $scope.part_loading_done = {
                all: true,
                mail: true,
                task: true,
                template: true,
                file: true,
                post: true
            },
            $scope.has_more = {
                all: false,
                mail: false,
                task: false,
                template: false,
                file: false,
                post: false
            };
        //fn : obj -> obj
        var init_all_property_to_false = function (obj) {
            for (var key in obj) {
                obj[key] = false;
            }
            return obj;
        };
        $scope.js_change_tab = function (t) {
            $scope.currentPage = 1;
            $scope.js_filter_result(t);
        }
        $scope.js_filter_result = function (t) {
            $scope.query.type = t;
            $scope.query.page = 1;
            $scope.query.size = 20;
            $scope.current_type = t,
                    'all' == $scope.current_type ?
                $scope.show_empty = _.isEmpty($scope.tasks) && _.isEmpty($scope.files) && _.isEmpty($scope.posts) && _.isEmpty($scope.pages) && _.isEmpty($scope.mails) ? true : false : 'task' == $scope.current_type ? $scope.show_empty = _.isEmpty($scope.tasks) ? true : false : 'file' == $scope.current_type ? $scope.show_empty = _.isEmpty($scope.files) ? true : false : 'post' == $scope.current_type ? $scope.show_empty = _.isEmpty($scope.posts) ? true : false : 'page' == $scope.current_type ? $scope.show_empty = _.isEmpty($scope.pages) ? true : false : 'mail' == $scope.current_type && ($scope.show_empty = _.isEmpty($scope.mails) ? true : false);
        };
        var load_data = function (query) {
            return _.isEmpty($scope.keywords) ? ($scope.js_filter_result($scope.current_type), void 0) :
                ($scope.loading_result = true,
                    init_all_property_to_false($scope.has_more),
                    $scope.part_loading_done[$scope.current_type] = false,
                    wt.data.search_all('all', encodeURI($scope.keywords), query.type, query.page, query.size, function (t) {
                        $scope.totalItems = t.totalItems;
                        $scope.itemsPerPage = query.size;
                        $scope.query.page = query.page;
                        _.chain(t.data).pairs().each(function (item) {
                            var types = item[0].split(''),
                                type = '';
                            types.pop();
                            type = types.join('');
                            if (item[1].length == query.size) {
                                $scope.has_more[type] = true
                            }
                            $scope[item[0]] = item[1];
                        });
                        $rootScope.load_projects(function () {
                            _.each($scope.files, function (e) {
                                if (e.type === kzi.constant.file_type.folder) {
                                    var t = _.findWhere($rootScope.projects, { pid: e.pid });
                                    t && (e.project_name = t.name);
                                }
                            });
                        });
                        $scope.js_filter_result($scope.current_type);
                    }, null, function () {
                        $scope.part_loading_done[$scope.current_type] = true,
                            $scope.loading_result = false;
                    }), void 0);
        };
        $scope.js_search = function () {
            $scope.keywords.length > 0 && load_data($scope.query);
        }, $scope.js_show_file = function (e) {
            e.type === kzi.constant.file_type.file ? $rootScope.locator.to_file(e.pid, e.fid, true) : $location.path('/project/' + e.pid + '/folder/' + e.fid).search({});
        };
        $scope.js_load_more = function (type) {
            $scope.query.type = type;
            $scope.query.page = $scope.query.page + 1;
            $scope.current_type = type,
                load_data($scope.query);
        }
        var r = function () {
            $rootScope.global.loading_done = true, $scope.current_type = 'all', load_data($scope.query);
        };
        r();
        $scope.$watch(function () {
            return $scope.currentPage;
        }, function (newValue, oldValue) {
            if ($scope.current_type != 'all' && (newValue > 1 || oldValue > 1)) {
                $scope.query.page = newValue;
                load_data($scope.query);
            }
        });
    }
]);

innerApp.controller('main_panel_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    '$popbox',
    function ($scope, $routeParams, $rootScope, $location, $popbox) {
        $scope.expand_left_menu = function () {
            $rootScope.global.left_panel_is_fold = false;
            $rootScope.global.left_panel_is_fold ? kzi.localData.set("left_panel_is_fold", 1) :
                kzi.localData.set("left_panel_is_fold", 0)
        };
        $scope.cms_menu_is_expand = true;
        $scope.sys_menu_is_expand = true;
        $scope.trade_menu_is_expand = true;
        $scope.star_team = {
            team_id: -1,
            expand: false
        }, $scope.current_pid = '';
        var o = kzi.localData.get('left_panel_is_fold');
        $scope.global.left_panel_is_fold = 'true' == o ? true : false;
        $scope.js_left_panel_toggle = function () {
            $rootScope.global.left_panel_is_fold = !$rootScope.global.left_panel_is_fold,
                $rootScope.global.left_panel_is_fold ? kzi.localData.set("left_panel_is_fold", 1) :
                    kzi.localData.set("left_panel_is_fold", 0)
        }
        var r = function (e) {
            $popbox.popbox({
                target: e,
                templateUrl: '/view/common/pop_star_projects.html',
                controller: [
                    '$scope',
                    'popbox',
                    function (e, t) {
                        e.popbox = t, e.js_close = function () {
                            t.close();
                        }, e.js_to_project = function (e) {
                            $location.path('/project/' + e.pid), t.close();
                        };
                    }
                ]
            }).open();
        };
        $scope.js_set_current_prj = function (t) {
            $scope.current_pid = t.pid;
        };
        $scope.js_section_expand_toggle = function (t, i) {
            return $scope.left_panel_is_fold === true
                ? (-1 === t.team_id && r(i), void 0)
                : (-1 != t.team_id && i && !$(i.target).hasClass('icon-angle')
                && $location.path('/teams/' + t.team_id),
                    $scope.current_team.team_id === t.team_id
                ? ($scope.current_team.expand = !$scope.current_team.expand, void 0)
                : ($scope.current_team.expand = false,
                $scope.current_team = t,
                t.expand = true,
                void 0)
                );
        };
        $scope.$on(kzi.constant.event_names.shortcut_key_left_menu_toggle, function () {
            $scope.js_left_panel_toggle();
        });
        var l = function () {
            if ('team' === $rootScope.global.header_menu) {
                var n = $routeParams.team_id, a = _.findWhere($rootScope.teams, { team_id: n });
                if (!a)
                    return;
                $scope.current_team ? ($scope.current_team.team_id !== n || $scope.current_team.team_id === n && !$scope.current_team.expand) && $scope.js_section_expand_toggle(a) : (a.expand = true, $scope.current_team = a);
            } else
                $scope.star_team.expand = true, $scope.current_team = $scope.star_team;
        };
        $scope.$on(kzi.constant.event_names.load_teams_projects_sucess, function () {
            l();
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            if ('team' === $rootScope.global.header_menu)
                l();
            else if ('project' === $rootScope.global.header_menu) {
                if ('project' === $rootScope.global.header_menu) {
                    var o = $routeParams.pid;
                    _.isEmpty(o) || ($scope.current_pid = o);
                }
            } else
                $scope.current_pid = '';
        });
        //added by fastlane
        $scope.isActive = true;
        $scope.js_add_enter = function (event, name) {
            if (event.keyCode !== 13) return;
            if (name) $scope.js_add_prj(name);
            event.target.value = '';
            $scope.isActive = true;
        };
        $scope.js_add_new = function (event) {
            $scope.isActive = false;
            var get_focus = function () {
                var input1 = $(event.target)[0].parentElement.parentElement;
                var input2 = $(input1)[0].previousElementSibling;
                var $input = $(input2).find("input");
                $input.focus();
            };
            setTimeout(function () {
                    get_focus();
                }, 100
            );
        };
        $scope.js_add_blur = function (event) {
            event.target.value = '';
            $scope.isActive = true;
        };
        $scope.js_add_prj = function (name) {
            $scope.is_saving_project = true,
                wt.data.project.create($scope.current_team.team_id, name, "", function (response) {
//                    t.data.curr_role = 1,
//                    t.data.is_star = 0;
                    $rootScope.projects.push(response.data);
                    var current_href = "/project/" + response.data.pid + "?team=" + $scope.current_team.team_id;
                    $location.url(current_href);
                }, null, function () {
                    $scope.is_saving_project = false;
                })
        };
        $scope.js_del_prj = function (pid) {
            wt.data.project.del(pid, null, null, null);
        };
        $scope.js_update_prj = function (pid, name) {
            wt.data.project.update(pid, name, null, null, null, null);
        };

        $scope.rename_project = function (team, project) {
            if (project.newName == project.name) {
                return;
            }
            if (typeof(project.newName) == "undefined" || project.newName == "") {
                project.newName = project.name;
                return;
            }
            for (var i in team.projects) {
                if (team.projects[i].name == project.newName) {
                    project.newName = project.name;
                    return;
                }
            }
            wt.data.project.update(project.pid, project.newName, "", function (response) {
                project.name = project.newName;
            }, null, function () {
                $scope.is_saving_project = false;
                project.renameActive = false;
            })
        }

        //新建项目
        $scope.projectName = "";
        $scope.add_project = function (team) {
            if (typeof(team.newProjectName) == "undefined" || team.newProjectName == "") {
                return;
            }
            for (var i in team.projects) {
                if (team.projects[i].name == team.newProjectName) {
                    return;
                }
            }
            wt.data.project.create(team.team_id, team.newProjectName, "", function (response) {
                $rootScope.projects.push(response.data);
                var current_href = "/project/" + response.data.pid + "?team=" + team.team_id;
                $location.url(current_href);
            }, null, function () {
                team.isAdd = false;
                $scope.is_saving_project = false;
                team.newProjectName = "";
            })
        }
    }
]);

innerApp.controller("global_file_ctrl", ["$rootScope", "$scope", "$popbox",
    function ($rootScope, $scope, $popbox) {
        $scope.options = {
            pasteZone: null,
            dropZone: null,
            url: kzi.config.wtbox(),
            done: function (event, data) {
                data.scope.$apply(function () {
                    if (200 === data.response().result.code) {
                        var i = data.response().result.files[0],
                            a = {};
                        switch (a.target = i.formData.target, a.type = i.formData.type || "project", a.file = {
                            pid: i.formData.pid,
                            name: i.fname,
                            ext: kzi.constant.get_ext(i.ext),
                            size: i.size,
                            path: i.url
                        }, i.formData.type) {
                            case "task":
                                a.ext = {
                                    tid: i.formData.tid
                                };
                                break;
                            case "post":
                                a.ext = {
                                    post_id: i.formData.post_id
                                };
                                break;
                            case "organizer":
                                a.ext = {
                                    organizer_id: i.formData.organizer_id
                                };
                                break;
                            case "goods":
                                a.ext = {
                                    goods_id: i.formData.goods_id
                                };
                                break;
                            case "order":
                                a.ext = {
                                    order_id: i.formData.order_id
                                };
                                break;
                            case "file":
                                a.ext = {
                                    fid: i.formData.fid
                                };
                                break;
                            case "event":
                                a.ext = {
                                    event_id: i.formData.event_id
                                };
                                break;
                            default:
                                a.ext = {
                                    folder_id: i.formData.folder_id
                                }
                        }
                        wt.data.file.new_upload(i.formData.pid, a, function (s) {
                            a.file = _.extend(a.file, i, s.data),
                                a.file.icon = kzi.helper.build_file_icon(a.file),
                                $rootScope.refresh_cache.file.add(a.file),
                                $rootScope.$broadcast(kzi.constant.event_names.on_file_add, a),
                                _.isFunction(i.formData.successCallback) && data.files[0].formData.successCallback(s), $scope.queue = _.reject($scope.queue, function (e) {
                                try {
                                    return "pending" === e.$state() ? !1 : e.$response().result.files[0] === data.response().result.files[0]
                                } catch (t) {
                                    return !1
                                }
                            })
                        }, null, function () {
                        })
                    } else data.files[0].error = "上传出错"
                })
            }
        }, $scope.js_pop_global_fileupload = function (e) {
            $popbox.popbox({
                target: e,
                templateUrl: "/view/header/pop_global_fileupload.html",
                controller: ["$scope", "popbox", "pop_data",
                    function (e, t, i) {
                        e.popbox = t, e.js_close = function () {
                            t.close()
                        }, e.pop_data = i, e.$watch("pop_data.scope.", function (e) {
                            0 === e && t.close()
                        })
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
        }
    }
]);

/*
 innerApp.controller('global_file_ctrl', [
 '$rootScope',
 '$scope',
 '$popbox',
 function ($rootScope, $scope, $popbox) {
 $scope.options = {
 pasteZone: null,
 dropZone: null,
 url: kzi.config.wtbox(),
 done: function (e, data) {
 $rootScope.$apply(function () {
 if (200 === data.response().result.code) {
 var file = data.response().result.files[0];
 var fileInfo = {};
 switch (fileInfo.target = file.formData.target, fileInfo.type = file.formData.type || 'project', fileInfo.file = {
 pid: file.formData.pid,
 name: file.fname,
 ext: kzi.constant.get_ext(file.ext),
 size: file.size,
 path: file.url
 }, file.formData.type) {
 case 'task':
 fileInfo.ext = { tid: file.formData.tid };
 break;
 case 'post':
 fileInfo.ext = { post_id: file.formData.post_id };
 break;
 case 'file':
 fileInfo.ext = { fid: file.formData.fid };
 break;
 case 'event':
 fileInfo.ext = { event_id: file.formData.event_id };
 break;
 default:
 fileInfo.ext = { folder_id: file.formData.folder_id };
 }
 wt.data.file.new_upload(
 file.formData.pid,
 fileInfo,
 function (response) {
 fileInfo.file = _.extend(fileInfo.file, file, response.data),
 fileInfo.file.icon = kzi.helper.build_file_icon(fileInfo.file),
 $rootScope.refresh_cache.file.add(fileInfo.file),
 $rootScope.$broadcast(kzi.constant.event_names.on_file_add, fileInfo),
 _.isFunction(data.files[0].formData.successCallback) && data.files[0].formData.successCallback(response);
 $scope.queue = _.reject($scope.queue, function (e) {
 try {
 return 'pending' === e.$state() ? false : e.$response().result.files[0] === data.response().result.files[0];
 } catch (t) {
 return false;
 }
 });
 },
 null,
 function () {
 }
 );
 } else
 data.files[0].error = '上传出错';
 });
 }
 };
 $scope.js_pop_global_fileupload = function (e) {
 $popbox.popbox({
 target: e,
 templateUrl: '/view/header/pop_global_fileupload.html',
 controller: [
 '$scope',
 'popbox',
 'pop_data',
 function (e, t, i) {
 e.popbox = t, e.js_close = function () {
 t.close();
 }, e.pop_data = i, e.$watch('pop_data.scope.', function (e) {
 0 === e && t.close();
 });
 }
 ],
 resolve: {
 pop_data: function () {
 return { scope: $scope };
 }
 }
 }).open();
 };
 }
 ]);*/
