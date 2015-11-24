'use strict';
innerApp.controller('project_chats_ctrl', [
    '$rootScope',
    '$scope',
    '$routeParams',
    '$location',
    function ($rootScope, $scope, $routeParams, $location) {
        var o = $routeParams.pid, r = function (e) {
                $scope.chat = null, $scope.loading_chat_done = false, wt.data.project.get_chat_list(o, e, kzi.config.default_count, function (i) {
                    $scope.chat = i.data, wt.bus.chat.set_is_show_data($scope.chat.messages), wt.bus.chat.set_messages_for_file($scope.chat.messages, o), (1 === e || '1' === e) && ($scope.chats_pagination_opts = {
                        totalCount: i.data.total_count,
                        opts: {
                            callback: function (e) {
                                r(e + 1);
                            }
                        }
                    });
                }, null, function () {
                    $scope.loading_chat_done = true;
                });
            };
        $rootScope.load_project(o, function (i) {
            $rootScope.global.title = '聊天 | ' + i.info.name, $rootScope.global.loading_done = true, $scope.project = i, $scope.permission = 1 == $scope.project.info.archived ? kzi.constant.permission.project_archived : 2 == $scope.project.info.team.status ? kzi.constant.permission.team_stop_service : kzi.constant.permission.ok, r(1);
        }, function (e) {
            e.code === kzi.statuses.prj_error.not_found.code ? $location.path('/project/' + o + '/notfound') : wt.data.error(e);
        });
    }
]);