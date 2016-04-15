'use strict';
innerApp.controller('entity_coupons_ctrl', [
    '$scope',
    '$rootScope',
    '$location',
    '$popbox',
    '$timeout',
    function ($scope, $rootScope, $location, $popbox, $timeout) {
        $scope.coupons = [];
        $scope.is_add = false;
        $scope.loading_done = false;
        $scope.coupon = {};
        $scope.xtype = '';

        var on_load_coupons=function(args)
        {
            _.isEmpty(args) || _.isEmpty(args.xid) || (_.isEmpty($scope.coupon.message) || xtype === args.xtype && xid === args.xid || ($scope.coupon = { message: '' }),
                xtype = args.xtype,
                xid = args.xid,
                coupon_id = args.coupon_id,
                $scope.xtype = xtype,
                $scope.coupons = [],
                wt.data.coupon.get_list(
                    {
                      userId:xid
                    },
                    function (response) {
                        $scope.loading_done = true;
                        $scope.coupons = response.data;
                        _.each($scope.coupons, function (e) {
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

        var xtype, xid, coupon_id;
        $scope.$on(kzi.constant.event_names.load_item_coupons,
            function (event, args) {
                on_load_coupons(args);
        });

        $scope.js_repeat_done = function () {
            if (!_.isEmpty($scope.coupons)) {
                var t = $scope.coupons[$scope.coupons.length - 1];
                coupon_id && $timeout(function () {
                    var e = '#coupon_item_' + coupon_id;
                    coupon_id === t.cid ? $('#new_coupon_' + xtype).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', 'bottom') : $(e).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', e);
                }, 250);
            }
        };
        
        $scope.js_to_coupon = function(){
            var o = '#new_coupon_' + $scope.xtype;
            $(o).parents('.mCustomScrollbar').eq(0).mCustomScrollbar('scrollTo', o);
            $timeout(function(){
                var e = $(o).find('textarea')[0];
                e.focus();
            })
        };
        var u = function () {
            return $('#' + xtype + '_tab_module .coupon_edit_wrap');
        };
    }
]);