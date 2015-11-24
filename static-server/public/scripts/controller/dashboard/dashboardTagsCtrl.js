'use strict';
innerApp.controller('tags_ctrl', ["$http","$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location",
function ($http,$rootScope, $scope, $routeParams, $popbox, $timeout, $location)
{
        //初始化数据
        var init=function()
        {
        	
            $rootScope.global.title = "标签管理";
            $rootScope.global.loading_done=false;

            //获取类别
            $http.get('/api/codes/tag/all').success(function (response) {
                $scope.types = response.data;
            });
            
            var vm = $scope.vm = {};
            vm.option1 = {
              allowClear:true
            };
            vm.option2 = {
              'multiple': true,
              'simple_tags': true,
              'tags': ['tag1', 'tag2', 'tag3', 'tag4']
            };
            
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
                orderKey :'create_date',
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
            $scope.parent_url = '/api/codes/tag/all';
            $scope.new_element=
            {
                name:'',
                cnName:'',
                enName:'',
                imageUrl:'',
                url:'',
                parent:'',
                type:'',
                typename:'',
                code_address_1:'',
                code_address_name_1:'',
                code_address_2:'',
                code_address_name_2:'',
                code_address_3:'',
                code_address_name_3:'',
                code_address_4:'',
                code_address_name_4:'',
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
            wt.data.tag.get_all_page(
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
        	$scope.new_element.cnName="";
        	$scope.new_element.enName="";
        	$scope.new_element.parent="";
        	$scope.new_element.url="";
        	$scope.new_element.imageUrl="";
        	$scope.new_element.desc="";
        	$scope.new_element.type="";
        	$scope.new_element.code_address="";
        	$scope.new_element.code_address_1="";
        	$scope.new_element.code_address_name_1="";
        	$scope.new_element.code_address_2="";
        	$scope.new_element.code_address_name_2="";
        	$scope.new_element.code_address_3="";
        	$scope.new_element.code_address_name_3="";
        	$scope.new_element.code_address_4="";
        	$scope.new_element.code_address_name_4="";
        	$scope.is_create = !$scope.is_create;
        };

        $scope.cancelForm=function()
        {
        	$scope.new_element.name="";
        	$scope.new_element.cnName="";
        	$scope.new_element.enName="";
        	$scope.new_element.url="";
        	$scope.new_element.imageUrl="";
        	$scope.new_element.parent="";
        	$scope.new_element.desc="";
        	$scope.new_element.type="";
        	$scope.new_element.code_address="";
        	$scope.new_element.code_address_1="";
        	$scope.new_element.code_address_name_1="";
        	$scope.new_element.code_address_2="";
        	$scope.new_element.code_address_name_2="";
        	$scope.new_element.code_address_3="";
        	$scope.new_element.code_address_name_3="";
        	$scope.new_element.code_address_4="";
        	$scope.new_element.code_address_name_4="";
            $scope.is_create=false;
        };

        $scope.save=function()
        {
            if(!$scope.new_element.name)
            {
                kzi.msg.error("请输入标签名称！",function(){});
            }
            else if(!$scope.new_element.type)
            {
                kzi.msg.error("请选择标签分类！",function(){});
            }
            else
            {
            	if (!_.isEmpty($scope.new_element.code_address_4)) {
                	$scope.new_element.parent=$scope.new_element.code_address_4;
            	} else if (!_.isEmpty($scope.new_element.code_address_3)) {
            		$scope.new_element.parent=$scope.new_element.code_address_3;
            	} else if (!_.isEmpty($scope.new_element.code_address_2)) {
            		$scope.new_element.parent=$scope.new_element.code_address_2;
            	} else if (!_.isEmpty($scope.new_element.code_address_1)) {
            		$scope.new_element.parent=$scope.new_element.code_address_1;
            	} 
                wt.data.tag.create($scope.new_element, function ()
                    {
                    	$scope.is_saving=true;
                        kzi.msg.success("标签保存成功！",function(){});
                        $scope.isDESC=1;
                        $scope.queryCondition.isDESC=$scope.isDESC;
                        $scope.cancelForm();
                        get_page($scope.queryCondition);
                    },
                    function(){kzi.msg.error("标签保存失败！",function(){});},
                    function (){$scope.is_saving=false;});
            }
        };

        //修改标签事件
        $scope.$on(kzi.constant.event_names.on_tag_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.items, { tag_id: i.tag_id });
                n && (n.name = i.name, n.typeName= i.s_typeName, n.summary = kzi.helper.substr(i.content, 60));
            }
        });

        //删除标签事件
        $scope.$on(kzi.constant.event_names.on_tag_trash,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.items, i);
                n && ($scope.items=_.without($scope.items, n));
            };
        });

        //删除评论事件
        $scope.$on(kzi.constant.event_names.on_tag_comment_del,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.items, {tag_id:i});
                n && n.comment_count--;
            };
        });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_tag_comment,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.items, i);
                n && n.comment_count++;
            };
        });

}]);