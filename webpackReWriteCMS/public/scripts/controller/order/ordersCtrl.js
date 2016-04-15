'use strict';
innerApp.controller('entity_orders_ctrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$popbox',
    '$timeout',
    function ($scope, $rootScope, $location, $popbox, $timeout) {
        $scope.orders = [];
        $scope.is_add = false;
        $scope.loading_done = false;
        $scope.order = {};
        $scope.xtype = '';

        var on_load_orders=function(args)
        {
            _.isEmpty(args) || _.isEmpty(args.xid) || (_.isEmpty($scope.order.message) || xtype === args.xtype && xid === args.xid || ($scope.order = { message: '' }),
                xtype = args.xtype,
                xid = args.xid,
                order_id = args.order_id,
                $scope.xtype = xtype,
                $scope.orders = [],
                wt.data.order.get_list(
                    {
                      userId:xid
                    },
                    function (response) {
                        $scope.loading_done = true;
                        $scope.orders = response.data;
                        _.each($scope.orders, function (e) {
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

        var xtype, xid, order_id;
        $scope.$on(kzi.constant.event_names.load_item_orders,
            function (event, args) {
                on_load_orders(args);
        });

        $scope.js_repeat_done = function () {
            if (!_.isEmpty($scope.orders)) {
                var t = $scope.orders[$scope.orders.length - 1];
                order_id && $timeout(function () {
                    var e = '#order_item_' + order_id;
                    order_id === t.cid ? $('#new_order_' + xtype).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', 'bottom') : $(e).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', e);
                }, 250);
            }
        };
        
        $scope.js_to_order = function(){
            var o = '#new_order_' + $scope.xtype;
            $(o).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', o);
            $timeout(function(){
                var e = $(o).find('textarea')[0];
                e.focus();
            })
        };
        var u = function () {
            return $('#' + xtype + '_tab_module .order_edit_wrap');
        };
    }
]);