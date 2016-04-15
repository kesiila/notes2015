/**
 * Created by uyunge on 15-3-15.
 */
"use strict";
innerApp.controller('sideToolSetCtrl',['$scope', '$rootScope',function($scope, $rootScope){
    var vm = $scope.vm = {
        //js_extend_toggle : function (which_view) {
        //    vm.extend_or_not = which_view === 'expand' ? true : false;
        //},
        //changeContentView : function (which) {
        //    vm.step = which;
        //}
    };
    vm.step = 0;

    vm.tag1 = {
        collectList: [],
        add: function (customer) {
           this.collectList.push(customer);
        },
        remove: function (customer) {
            this.collectList = _.reject(this.collectList, function (i) {
                return i["活动id"] = customer["活动id"];
            })
        },
        collect: function (customerList) {
            //  END TO END
            // 判断有些哪些活动已经被收藏了，避免加入工具栏列表后完成收藏前，用户在原本列表内收藏了活动。


            // 判断积分够不够

            //  往后台发请求收藏 列表里的活动
            //  Function::  List -> void
            //  wt.data.batch_collect
        }
    }

    $rootScope.$on(kzi.constant.event_names.add_to_list, function handle (event, data) {

    });
}]);