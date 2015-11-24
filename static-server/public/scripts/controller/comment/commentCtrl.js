'use strict';
innerApp.controller('comment_ctrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$popbox',
    '$timeout',
    function ($scope, $rootScope, $location, $popbox, $timeout) {
        $scope.comments = [];
        $scope.is_add_comment = false;
        $scope.comments_loading_done = false;
        $scope.comment = {};
        $scope.xtype = '';

        var on_load_comments=function(args) {
            _.isEmpty(args) || _.isEmpty(args.xid) || (_.isEmpty($scope.comment.message) || xtype === args.xtype && xid === args.xid || ($scope.comment = { message: '' }),
                xtype = args.xtype,
                xid = args.xid,
                comment_id = args.comment_id,
                $scope.xtype = xtype,
                $scope.comments = [],
                wt.data.comment.get_list(
                    null,
                    xtype,
                    xid,
                    function (response) {
                        $scope.comments_loading_done = true;
                        $scope.comments = response.data;
                        _.each($scope.comments, function (e) {
                            e.files = _.each(e.files, function (e) {
                                e.icon = kzi.helper.build_file_icon(e);
                            });
                        });
                    },
                    function () {
                        kzi.msg.error("评论加载失败！",function(){});
                        $scope.comments_loading_done = true;
                    },
                    function () {
                        $scope.comments_loading_done = true;
                    }
                )/*,
             $rootScope.load_project_members(
             pid,
             function (t) {
             var n = _.filter(t.members, function (e) {
             return e.uid !== $rootScope.global.me.uid && 1 === e.status;
             });
             $scope.atwho_members = n, $timeout(function () {
             $('#atwho-container').bind('mousedown', function (e) {
             e.stopPropagation(), e.preventDefault();
             });
             });
             })*/
                );
            args=null;
        };

        $scope.is_can_del=function(comment) {
            return comment.message.indexOf("创建了")==-1;
        }

        on_load_comments($rootScope.load_comments_attrs);

        var xtype, xid, comment_id;
        $scope.$on(kzi.constant.event_names.load_comments,
            function (event, args) {
                on_load_comments(args);
        });
        $scope.$on(kzi.constant.event_names.on_task_complete, function (t, n) {
            n && n.tid === xid && (0 === n.completed ? $scope.comments = _.reject($scope.comments, function (e) {
                return 3 === e.type;
            }) : 1 === n.completed && $scope.comments.push({
                cid: '-1',
                message: '完成了活动',
                create_date: new Date().getTime(),
                type: 3,
                format: 1,
                owner: _.pick($rootScope.global.me, 'uid', 'name', 'display_name', 'avatar')
            }));
        });
        $scope.js_repeat_done = function () {
            if (!_.isEmpty($scope.comments)) {
                var t = $scope.comments[$scope.comments.length - 1];
                comment_id && $timeout(function () {
                    var e = '#comment_item_' + comment_id;
                    comment_id === t.cid ? $('#new_comment_' + xtype).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', 'bottom') : $(e).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', e);
                }, 250);
            }
        };

        $scope.js_set_position = function (comment, position) {
           switch(position) {
               case "top" :
                    wt.data.comment.set_position(comment.eid, position,
                        function () { kzi.msg.success('成功设置为置顶')}, function () {} , function () {}) ;
                   break;
               case "middle" :
                   break;
               case "bottom":
                   break;
               default : break;
           }
        }
        $scope.js_save_comment = function () {
            var t = $scope.comment;
            t.fids = _.pluck(t.files, 'fid');
            _.isEmpty(t.message) && _.isEmpty(t.fids)
            || t.is_saving
            || (t.is_saving = true, _.isEmpty(t.message) && (t.message = t.fids.length + '个附件，' + _.pluck(t.files, 'name')),
            wt.data.comment.publish(null, xtype, xid, t.message, t.fids || '', function (t) {
                var n = t.data;
                n.owner = $rootScope.global.me, n.type = 1, _.isEmpty(n.files) || _.each(n.files, function (e) {
                    e.icon = kzi.helper.build_file_icon(e);
                }), $scope.comments.push(n);
                switch (xtype) {
                    case 'tasks':
                        $rootScope.$broadcast(kzi.constant.event_names.on_task_comment, { tid: xid });
                        break;
                    case 'posts':
                        $rootScope.$broadcast(kzi.constant.event_names.on_post_comment, { post_id: xid });
                        break;
                    case 'templates':
                        $rootScope.$broadcast(kzi.constant.event_names.on_template_comment, { template_id: xid });
                        break;
                    default :
                        break;
                }
            }, null, function () {
                t.is_saving = false, $scope.is_add_comment = false;
            }), t.message = '', t.files = [], t.fids = []);
        };
        $scope.js_pastefile_comment = function () {
        };
        $scope.js_reply_comment = function (t) {
            var i = '回复 @' + t.owner.name + ' : ', n = i.length, a = '';
            t.raw_message = t.message;
            a = t.raw_message.indexOf('>') >= 0 ? t.raw_message.replace(/\n *>/i, '\n >>') : t.raw_message, a = a.length > 40 ? '\n\n\n >' + a.substr(0, 40) + '...' : '\n\n\n >' + a, $scope.comment.message = i + a;
            var o = '#new_comment_' + $scope.xtype;
            $(o).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', o),
                $timeout(function () {
                var e = $(o).find('textarea')[0];
                if (e.focus(), document.selection) {
                    var t = e.createTextRange();
                    t.moveStart('character', n), t.collapse(), t.select();
                } else
                    'number' == typeof e.selectionStart && 'number' == typeof e.selectionEnd && (e.select(), e.selectionStart = e.selectionEnd = n);
            });
        };
        $scope.js_to_comment = function(){
            var o = '#new_comment_' + $scope.xtype;
            $(o).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', o);
            $timeout(function(){
                var e = $(o).find('textarea')[0];
                e.focus();
            })
        };
        var u = function () {
            return $('#' + xtype + '_tab_module .comment_edit_wrap');
        };
        $scope.js_pop_delete_comment = function (t, n) {
            $popbox.popbox({
                target: t,
                placement:'right',
                templateUrl: '/view/common/pop_comment_delete.html',
                controller: [
                    '$scope',
                    'popbox',
                    'pop_data',
                    '$rootScope',
                    function (e, t, a,$rootScope) {
                        e.popbox = t,

                        e.js_edit_comment = function () {
                            n.is_edit = true,
                            0 >= $('#div_comment_' + n.cid).find('.comment_edit_wrap').length && $('#div_comment_' + n.cid).append(u()),
                            a.scope.comment = n, _.isEmpty(a.scope.comment.temp_message) && (a.scope.comment.temp_message = n.raw_message),
                            t.close();
                        };
                         e.js_sure_delete = function () {
                            a.scope.comments = _.reject(a.scope.comments, function (e) {
                                return e.id === n.id;
                            }),

                            wt.data.comment.del( n.oid /*ownerId*/, xtype, n.id, function () {
                                $rootScope.$broadcast(kzi.constant.event_names.comment_del, xid);
                            },function(){},function(){}),
                            t.close();
                        },
                        e.js_close = function () {
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