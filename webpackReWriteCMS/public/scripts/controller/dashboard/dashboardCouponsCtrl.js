'use strict';
innerApp.controller('coupons_ctrl', ["$http","$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location",
function ($http,$rootScope, $scope, $routeParams, $popbox, $timeout, $location)
{
        //初始化数据
        var init=function()
        {
        	
            $rootScope.global.title = "优惠券管理";
            $rootScope.global.loading_done=false;

            //获取类别
            $http.get('/api/codes/coupon/all').success(function (response) {
                $scope.types = response.data;
            });
            
            $scope.currentPage = 1;
            $scope.itemsPerPage = 20;
            $scope.totalItems = 0;
            $scope.isDESC = true;

            $scope.defaultType={cnName:'全部',code:'0'};
            $scope.type={cnName:'全部',code:'0'};
            $scope.current_type=$scope.defaultType;

            //查询参数集
            $scope.queryCondition = {
            	code:$scope.defaultType.code,
                page: $scope.currentPage,
                couponKey :'create_date',
                isDESC:$scope.isDESC,//排序方式，默认按降序排序
                size: 20
            };

            $scope.sortItems=[
                {name: '按中文名称',value: 'cnName',is_selected: true}
                ,{name: '按英文名称',value: 'enName',is_selected: false}
                ,{name: '按创建时间',value: 'create_date',is_selected: false}
            ];

            $scope.currentSortItem=$scope.sortItems[0];
            
            //隐藏和显示添加活动界面
            $scope.is_create=false;
            
            $scope.new_element=
            {
                name:'',
                title:'',
                user_id:'',
                goods_id:'',
                goods_title:'',
                count:1,
                code:'',
                typeName:'',
                code_ad:'',
                code_ad_name:'',
                desc:''
            };

        };

        init();

        //按类型分类选择
        $scope.selectByType=function(type)
        {
            $scope.current_type=type;
            $scope.queryCondition.code=type.code;
        };


        $scope.$on(kzi.constant.event_names.entity_del,function(event,p){
            $scope.items= _.filter($scope.items,function(e){return e.id!= p.id;});
            $scope.totalItems-=1;
        }, null);

        //切换排序顺序
        $scope.sort=function()
        {
            $scope.isDESC=!$scope.isDESC;
            $scope.queryCondition.isDESC=$scope.isDESC;
        };

        $scope.$watch('currentPage', function (currentPage) {
            $scope.pageNum=currentPage;
            $scope.queryCondition.page = currentPage;
        });

        $scope.$watch('queryCondition',function(queryCondition){
            get_page(queryCondition);
        },true);

        var get_page=function(queryCondition)
        {
            $rootScope.global.loading_done=false;
            wt.data.coupon.get_all_page(
                queryCondition,
                function(response)
                {
                    $scope.items=response.data;
                    $scope.totalItems = response.totalItems;
                    $rootScope.global.loading_done=true;
                },
                function(){kzi.msg.error("加载数据失败！",function(){});},
                function(){$rootScope.global.loading_done=true;}
            );
        }


        $scope.show_add_form = function ()
        {
        	$scope.new_element.name="";
        	$scope.new_element.title="";
        	$scope.new_element.user_id="";
        	$scope.new_element.goods_id="";
        	$scope.new_element.goods_title="";
        	$scope.new_element.count=1;
        	$scope.new_element.desc="";
        	$scope.new_element.code="";
        	$scope.new_element.code_ad="";
        	$scope.new_element.code_ad_name="";
        	$scope.is_create = !$scope.is_create;
        };

        $scope.cancelForm=function()
        {
        	$scope.new_element.name="";
        	$scope.new_element.title="";
        	$scope.new_element.user_id="";
        	$scope.new_element.goods_id="";
        	$scope.new_element.goods_title="";
        	$scope.new_element.count=1;
        	$scope.new_element.desc="";
        	$scope.new_element.code="";
        	$scope.new_element.code_ad="";
        	$scope.new_element.code_ad_name="";
            $scope.is_create=false;
        };

        $scope.save=function()
        {
            if(!$scope.new_element.goods_id)
            {
                kzi.msg.error("请选择商品！",function(){});
            }
            else
            {
                wt.data.coupon.create($scope.new_element, function ()
                    {
                    	$scope.is_saving=true;
                        kzi.msg.success("优惠券保存成功！",function(){});
                        $scope.isDESC=1;
                        $scope.queryCondition.isDESC=$scope.isDESC;
                        $scope.cancelForm();
                        get_page($scope.queryCondition);
                    },
                    function(){kzi.msg.error("优惠券保存失败！",function(){});},
                    function (){$scope.is_saving=false;});
            }
        };

        //修改优惠券事件
        $scope.$on(kzi.constant.event_names.on_coupon_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, { coupon_id: i.coupon_id });
                n && (n.name = i.name, n.typeName= i.s_typeName, n.summary = kzi.helper.substr(i.content, 60));
            }
        });

        //删除优惠券事件
        $scope.$on(kzi.constant.event_names.on_coupon_trash,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.items, i);
                n && ($scope.items=_.without($scope.items, n));
            };
        });

        //删除评论事件
        $scope.$on(kzi.constant.event_names.on_coupon_comment_del,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.items, {coupon_id:i});
                n && n.comment_count--;
            };
        });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_coupon_comment,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.items, i);
                n && n.comment_count++;
            };
        });

}]);