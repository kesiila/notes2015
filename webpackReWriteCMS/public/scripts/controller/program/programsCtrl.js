'use strict';
innerApp.controller('entity_programs_ctrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$popbox',
    '$timeout',
    function ($scope, $rootScope, $location, $popbox, $timeout) {
        $scope.programs = [];
        $scope.is_add = false;
        $scope.loading_done = false;
        $scope.program = {};
        $scope.xtype = '';

        var on_load_programs=function(args){
            _.isEmpty(args) || _.isEmpty(args.xid) || (_.isEmpty($scope.program.message) || xtype === args.xtype && xid === args.xid || ($scope.program = { message: '' }),
                xtype = args.xtype,
                xid = args.xid,
                program_id = args.program_id,
                $scope.xtype = xtype,
                $scope.programs = [],
                wt.data.program.get_list(
                    {
                      userId:xid
                    },
                    function (response) {
                        $scope.loading_done = true;
                        $scope.programs = response.data;
                        _.each($scope.programs, function (e) {
                            e.files = _.each(e.files, function (e) {
                                e.icon = kzi.helper.build_file_icon(e);
                            });
                        });
                    },
                    function () {
                        kzi.msg.error("加载失败！",function(){});
                        $scope.loading_done = true;
                    },
                    function () {
                        $scope.loading_done = true;
                    }
                )
                );
            args=null;
        };

        var xtype, xid, program_id;
        $scope.$on(kzi.constant.event_names.load_item_programs,
            function (event, args) {
                on_load_programs(args);
        });

        $scope.js_repeat_done = function () {
            if (!_.isEmpty($scope.programs)) {
                var t = $scope.programs[$scope.programs.length - 1];
                program_id && $timeout(function () {
                    var e = '#program_item_' + program_id;
                    program_id === t.cid ? $('#new_program_' + xtype).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', 'bottom') : $(e).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', e);
                }, 250);
            }
        };
        
        $scope.js_to_program = function(){
            var o = '#new_program_' + $scope.xtype;
            $(o).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', o);
            $timeout(function(){
                var e = $(o).find('textarea')[0];
                e.focus();
            })
        };
        var u = function () {
            return $('#' + xtype + '_tab_module .program_edit_wrap');
        };
    }
]);