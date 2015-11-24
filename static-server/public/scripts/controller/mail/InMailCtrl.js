"use strict";
innerApp.controller('in_mail_ctrl', [
    '$scope',
    '$rootScope',
    '$popbox',
    '$timeout',
    function ($scope, $rootScope, $popbox, $timeout) {
        $scope.mails = [], $scope.selectedTemplate={},$scope.is_add_mail = false, $scope.mails_loading_done = false, $scope.mail = {}, $scope.xtype = '';
        var o, r, l, c;
        $scope.$on(kzi.constant.event_names.load_mails, function (t, n) {
            if($rootScope.global.is_login==true){
                _.isEmpty(n.pid) || _.isEmpty(n.xid) || (_.isEmpty($scope.mail.message) || r === n.xtype && l === n.xid || ($scope.mail = { message: '' }), o = n.pid, r = n.xtype, l = n.xid, c = n.mail_id, $scope.xtype = r, $scope.mails_loading_done = false, $scope.mails = [], wt.data.mail.in_get_list(o, r, l, function (t) {
                    $scope.mails = t.data, _.each($scope.mails, function (e) {
                        e.files = _.each(e.files, function (e) {
                            e.icon = kzi.helper.build_file_icon(e);
                        });
                    }), $scope.mails_loading_done = true;
                }, function () {
                    $scope.mails_loading_done = true;
                }),$rootScope.load_project_members(o, function (t) {
                    var n = _.filter(t.members, function (e) {
                        return e.uid !== $rootScope.global.me.uid && 1 === e.status;
                    });
                    $scope.atwho_members = n, $timeout(function () {
                        $('#atwho-container').bind('mousedown', function (e) {
                            e.stopPropagation(), e.preventDefault();
                        });
                    });
                }));
            }
        }), $scope.$on(kzi.constant.event_names.on_task_complete, function (t, n) {
            n && n.tid === l && (0 === n.completed ? $scope.mails = _.reject($scope.mails, function (e) {
                return 3 === e.type;
            }) : 1 === n.completed && $scope.mails.push({
                cid: '-1',
                message: '完成了活动',
                create_date: new Date().getTime(),
                type: 3,
                format: 1,
                owner: _.pick($rootScope.global.me, 'uid', 'name', 'display_name', 'avatar')
            }));
        }), $scope.js_repeat_done = function () {
            if (!_.isEmpty($scope.mails)) {
                var t = $scope.mails[$scope.mails.length - 1];
                c && $timeout(function () {
                    var e = '#mail_item_' + c;
                    c === t.cid ? $('#new_mail_' + r).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', 'bottom') : $(e).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', e);
                }, 250);
            }
        }, $scope.js_save_mail = function () {
            var t = $scope.mail;
            t.fids = _.pluck(t.files, 'fid'), _.isEmpty(t.message) && _.isEmpty(t.fids) || t.is_saving || (t.is_saving = true, _.isEmpty(t.message) && (t.message = t.fids.length + '个附件，' + _.pluck(t.files, 'name')), wt.data.mail.in_publish(o, r, l, t.message,t.name, t.fids || '', function (t) {
                var n = t.data;
                n.owner = $rootScope.global.me, n.type = 1, _.isEmpty(n.files) || _.each(n.files, function (e) {
                    e.icon = kzi.helper.build_file_icon(e);
                }), $scope.mails.unshift(n),$scope.$parent.$parent.is_new_mail= false, 'tasks' === r ? $rootScope.$broadcast(kzi.constant.event_names.on_task_mail, { tid: l }) : 'posts' === r && $rootScope.$broadcast(kzi.constant.event_names.on_post_mail, { post_id: l });
            }, null, function () {
                t.is_saving = false, $scope.is_add_mail = false;
            }), t.name='',t.message = '', t.files = [], t.fids = []);
        }, $scope.js_pastefile_mail = function () {
        }, $scope.js_select_template = function () {
        	$scope.mail.name = $scope.selectedTemplate.summary;
        	$scope.mail.message = $scope.selectedTemplate.content;
        }, $scope.js_reply_mail = function (t) {
            var i = '回复 @' + t.owner.name + ' : ', n = i.length, a = '';
            a = t.raw_message.indexOf('>') >= 0 ? t.raw_message.replace(/\n *>/i, '\n >>') : t.raw_message, a = a.length > 40 ? '\n\n\n >' + a.substr(0, 40) + '...' : '\n\n\n >' + a, $scope.mail.message = i + a;
            var o = '#new_mail_' + $scope.xtype;
            $(o).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', o), $timeout(function () {
                var e = $(o).find('textarea')[0];
                if (e.focus(), document.selection) {
                    var t = e.createTextRange();
                    t.moveStart('character', n), t.collapse(), t.select();
                } else
                    'number' == typeof e.selectionStart && 'number' == typeof e.selectionEnd && (e.select(), e.selectionStart = e.selectionEnd = n);
            });
        };
        var u = function () {
            return $('#' + r + '_tab_module .mail_edit_wrap');
        };
        $scope.js_pop_delete_mail = function (t, n) {
            $popbox.popbox({
                target: t,
                templateUrl: '/view/common/pop_mail_delete.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    function (e, t, a) {
                        e.popbox = t, e.js_edit_mail = function () {
                            n.is_edit = true, 0 >= $('#div_mail_' + n.cid).find('.mail_edit_wrap').length && $('#div_mail_' + n.cid).append(u()), a.scope.mail = n, _.isEmpty(a.scope.mail.temp_message) && (a.scope.mail.temp_message = n.raw_message), t.close();
                        }, e.js_sure_delete = function () {
                            a.scope.mails = _.reject(a.scope.mails, function (e) {
                                return e.cid === n.cid;
                            }), wt.data.mail.del(o, n.cid, r, l, function () {
                                if ('tasks' === r) {
                                    var t = _.findWhere($rootScope.project.tasks, { tid: l });
                                    t && (t.badges.comment_count -= 1);
                                }
                            }), t.close();
                        }, e.js_close = function () {
                            t.close();
                        };
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
]);