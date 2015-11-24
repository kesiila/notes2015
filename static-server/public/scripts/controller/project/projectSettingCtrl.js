'use strict';
innerApp.controller('project_setting_ctrl', [
    '$scope',
    '$routeParams',
    '$rootScope',
    '$location',
    function ($scope, $routeParams, $rootScope, $location) {
        var s = $routeParams.pid;
        $rootScope.pid = s, $scope.js_step = function (t) {
            2 == t && ($scope.project.new_name = $scope.project.info.name, $scope.project.new_desc = $scope.project.info.desc), $scope.step = t;
        };
        $rootScope.load_project(s, function (t) {
            $rootScope.global.loading_done = true, $rootScope.global.title = '群组设置 | ' + t.info.name, $scope.project = t, 1 == $scope.project.info.archived ? $scope.project.info.curr_role === kzi.constant.role.admin ? ($scope.permission = kzi.constant.permission.project_archived, $scope.step = 7) : ($scope.permission = kzi.constant.permission.project_archived, $scope.step = 4) : 2 == $scope.project.info.team.status ? ($scope.permission = kzi.constant.permission.team_stop_service, $scope.project.info.curr_role === kzi.constant.role.admin ? $scope.js_step(2) : $scope.js_step(1)) : ($scope.permission = kzi.constant.permission.ok, $scope.project.info.curr_role === kzi.constant.role.admin ? $scope.js_step(2) : $scope.js_step(1)), $scope.prj_colors = kzi.constant.prj_colors, $scope.prj_icons = kzi.constant.prj_icons, $scope.project.old_bg = $scope.project.info.bg, $scope.project.old_pic = $scope.project.info.pic, $scope.project.admins = _.where($scope.project.members, { role: 1 });
        }, function (e) {
            e.code == kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + s + '/notfound') : wt.data.error(e);
        }), $scope.js_prj_unnotify = function () {
            $scope.project.info.is_notify = 0, wt.data.project.set_prefs(s, 'is_notify', 0, function () {
            }, function () {
                $scope.project.info.is_notify = 1;
            });
        }, $scope.js_prj_notify = function () {
            $scope.project.info.is_notify = 1, wt.data.project.set_prefs(s, 'is_notify', 1, function () {
            }, function () {
                $scope.project.info.is_notify = 0;
            });
        }, $scope.js_prj_update = function () {
            alert('here');
            ($scope.project.new_name != $scope.project.name || $scope.project.new_desc != $scope.project.desc) && ($scope.is_prj_saveing = true, $scope.project.name = $scope.project.new_name, $scope.project.desc = $scope.project.new_desc, _.isEmpty($scope.project.desc) && ($scope.project.desc = ''), wt.data.project.update(s, $scope.project.name, $scope.project.desc, function () {
                $rootScope.refresh_cache.project.update(s, $scope.project.name, $scope.project.desc), kzi.msg.success('修改群组基本信息成功');
            }, function () {
                kzi.msg.error('修改群组基本信息失败');
            }, function () {
                $scope.is_prj_saveing = false;
            }));
        }, $scope.js_prj_archive = function () {
            $scope.is_archiving = true, wt.data.project.archive(s, function () {
                $scope.project.info.archived = 1, $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid == s;
                }), $rootScope.project && $rootScope.project.info.pid == s && $rootScope.project.info && ($rootScope.project.info.archived = 1), kzi.msg.success('归档群组成功'), $scope.step = 7;
            }, null, function () {
                $scope.is_archiving = false;
            });
        }, $scope.js_prj_unarchive = function () {
            $scope.is_unarchiving = true, wt.data.project.unarchive(s, function () {
                $scope.project.info.archived = 0, $rootScope.project && $rootScope.project.info.pid == s && $rootScope.project.info && ($rootScope.project.info.archived = 0), kzi.msg.success('激活群组成功'), $scope.step = 5, $rootScope.reload_projects();
            }, null, function () {
                $scope.is_unarchiving = false;
            });
        }, $scope.js_prj_quit = function (t) {
            t == $scope.project.info.name ? ($scope.is_quiting = true, wt.data.project.member_leave(s, function () {
                $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid == s;
                }), $location.path('dashboard');
            }, null, function () {
                $scope.is_quiting = false;
            })) : kzi.msg.warn('输入群组名字错误！请确认你要退出的群组！');
        }, $scope.js_prj_del = function (t) {
            t == $scope.project.info.name ? ($scope.is_deleting = true, wt.data.project.del(s, function () {
                $rootScope.projects = _.reject($rootScope.projects, function (e) {
                    return e.pid == s;
                }), $location.path('dashboard');
            }, null, function () {
                $scope.is_deleting = false;
            })) : kzi.msg.warn('输入群组名字错误！请确认你要删除的群组！');
        }, $scope.js_color_select = function (t) {
            $scope.project.info.bg = t;
        }, $scope.js_icon_select = function (t) {
            $scope.project.info.pic = t;
        }, $scope.js_prj_set_logo = function () {
            ($scope.project.info.bg != $scope.project.old_bg || $scope.project.info.pic != $scope.project.old_pic) && ($scope.is_logo_saving = true, wt.data.project.set_logo(s, $scope.project.info.bg, $scope.project.info.pic, function () {
                kzi.msg.success('设置群组标识成功'), $rootScope.refresh_cache.project.set_logo(s, $scope.project.info.bg, $scope.project.info.pic);
            }, function () {
                kzi.msg.success('设置群组标识失败');
            }, function () {
                $scope.is_logo_saving = false;
            }));
        };
    }
]);

innerApp.controller('project_notfound_ctrl', [
    '$rootScope',
    function (e) {
        e.global.title = '群组不存在';
    }
]);