'use strict';
innerApp.controller('myPost_ctrl', ["$http","$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location",
function ($http,$rootScope, $scope, $routeParams, $popbox, $timeout, $location)
{
        $rootScope.global.title = "我的问答";

        var pid;

        $scope.$on(kzi.constant.event_names.load_teams_projects_sucess,function(e,i){
            pid = $routeParams.pid || $rootScope.projects[0].pid ;
        })
        //初始化数据
        var init=function()
        {
            $rootScope.global.loading_done=false;

            if($rootScope.allPostTypes.length==0)
            {
                $http.get('/json/manager/postType.json').success(function(res)
                {
                    $rootScope.allPostTypes = res.data;
                });
            }

            $scope.currentPage = 1;
            $scope.itemsPerPage = 20;
            $scope.totalItems = 0;

            $scope.contentType=0;
            $scope.areaType=_.isEmpty($routeParams.type) ? 0 : $routeParams.type;        //0全部，1私有，2分享，3收藏

            $scope.isDESC=1;

            $scope.class_view_type=0;

            $scope.queryCondition.contentType=0;
            $scope.queryCondition.areaType=$scope.areaType;
            $scope.queryCondition.page=1;
            $scope.queryCondition.isDESC=1;

            $rootScope.global.loading_done = true;
        };

        $scope.postType0={cnName:'全部',type:'0'};

        $scope.current_type=$scope.postType0;

        //查询参数集
        $scope.queryCondition = {
            contentType: 0,
            areaType: $scope.areaType,
            page: $scope.currentPage,
            orderKey :'create_date',
            isDESC:$scope.isDESC,//排序方式，默认按降序排序
            size: 20
        };

        init();

        //按问答内容分类选择
        $scope.choosePostByType=function(postType)
        {
            $scope.current_type=postType;

            $scope.queryCondition.contentType=postType.type;
        };

        $scope.myPostSortItems=[
            {name: '按创建时间',value: 'create_date',is_selected: true}
            ,{name: '按分享时间',value: 'publish_date',is_selected: false}
            ,{name: '按收藏时间',value: 'collectors.collect_date',is_selected: false}
        ];

        $scope.currentMyPostSortItem=$scope.myPostSortItems[0];

        //0全部, 1私有,2分享,3收藏
        $scope.postSwitch=function(type)
        {
            if($scope.queryCondition.areaType==type)
            {
                findDate($scope.queryCondition);
            }else
            {
                $scope.areaType=type;

                $scope.queryCondition.areaType=type;

                if(type==0 || type==1)
                {
                    $scope.currentMyPostSortItem=$scope.myPostSortItems[0];
                }
                else
                {
                    $scope.currentMyPostSortItem=$scope.myPostSortItems[type-1];
                }

                $scope.queryCondition.orderKey=$scope.currentMyPostSortItem.value;

                $scope.isDESC=1;
                $scope.queryCondition.isDESC=$scope.isDESC;
            };
        };

        $scope.$on(kzi.constant.event_names.entity_del,function(event,p){
//            findDate($scope.queryCondition);
            $scope.posts= _.filter($scope.posts,function(e){return e.objectId!= p.id;});
            $scope.totalItems-=1;
        }, null);

        //切换排序顺序
        $scope.sortMyPostsDates=function()
        {
            $scope.isDESC=!$scope.isDESC;
            $scope.queryCondition.isDESC=$scope.isDESC;
        };

        $scope.$watch('currentPage', function (currentPage) {
            $scope.pageNum=currentPage;
            $scope.queryCondition.page = currentPage;
        });

        $scope.$watch('queryCondition',function(queryCondition){
            findDate(queryCondition);
        },true);

        var findDate=function(queryCondition)
        {
            $rootScope.global.loading_done=false;
            wt.data.post.getMyPageListPost(
                queryCondition,
                function(response)
                {
                    $scope.posts=response.data;

                    if($scope.posts.length>0)
                    {
                        for(var i=0;i<$scope.posts.length;i++)
                        {
                            var type=_.where($rootScope.allPostTypes,{"code":$scope.posts[i].f_type});

                            if(type.length>0)
                            {
                                var cc=type[0].children;
                                type=_.where(cc,{"code":$scope.posts[i].s_type});
                                if(type.length>0)
                                {
                                    $scope.posts[i].typeName=type[0].cnName;
                                }
                                else
                                {
                                    $scope.posts[i].typeName="全部";
                                }
                            }
                            else
                            {
                                $scope.posts[i].typeName="全部";
                            }
                        }
                    }
                    $scope.totalItems = response.totalItems;
                },
                function(){kzi.msg.error("加载数据失败！",function(){});},
                function(){$rootScope.global.loading_done=true;}
            );
        }


        //隐藏和显示添加活动界面
        $scope.is_creat_post=false;

//        $scope.show_add_post = function ()
//        {
//            $scope.addPost.title="";
//            $scope.addPost.content="";
//            $scope.addPost.f_type="";
//            $scope.addPost.f_typename="";
//            $scope.addPost.s_type="";
//            $scope.addPost.s_typename="";
//            $scope.is_creat_post = !$scope.is_creat_post;
//        };

    $scope.show_add_post = function ()
    {
        $scope.addPost.title="";
        $scope.addPost.content="";
        $scope.addPost.f_type="01";
        $scope.addPost.s_type="";
        $scope.addPost.s_typename="";
        $scope.is_creat_post = !$scope.is_creat_post;
    };

        $scope.addPost=
        {
            is_published:0,
            title:'',
            f_type:'',
            s_type:'',
            content:''
        };

//        $scope.cancelForm=function()
//        {
//            $scope.addPost.title="";
//            $scope.addPost.content="";
//            $scope.addPost.f_type="";
//            $scope.addPost.f_typename="";
//            $scope.addPost.s_type="";
//            $scope.addPost.s_typename="";
//            $scope.is_creat_post=false;
//        };

        $scope.cancelForm=function()
        {
            $scope.addPost.title="";
            $scope.addPost.content="";
            $scope.addPost.f_type="01";
            $scope.addPost.s_type="";
            $scope.addPost.s_typename="";
            $scope.is_creat_post=false;
        };

        $scope.add_post=function()
        {
            if(!$scope.addPost.title)
            {
                kzi.msg.error("请输入问答名称！",function(){});
            }
            else if(!$scope.addPost.s_type)
            {
                kzi.msg.error("请选择问答分类！",function(){});
            }
            else if(!$scope.addPost.content)
            {
                kzi.msg.error("请输入问答内容！",function(){});
            }
            else
            {
                $scope.is_saving=true;

                wt.data.post.create(pid, $scope.addPost, function ()
                    {
                        kzi.msg.success("问答保存成功！",function(){});

                        $scope.isDESC=1;
                        $scope.queryCondition.isDESC=$scope.isDESC;

                        $scope.cancelForm();

                        $scope.postSwitch(1);
                    },
                    function(){kzi.msg.error("话题保存失败！",function(){});},
                    function (){$scope.is_saving=false;});
            }
        };

        //修改话题事件
        $scope.$on(kzi.constant.event_names.on_post_update, function (e, i) {
            if (!_.isEmpty(i)) {
                var n = _.findWhere($scope.posts, { post_id: i.post_id });
                n && (n.name = i.name, n.typeName= i.s_typeName, n.summary = kzi.helper.substr(i.content, 60));
            }
        });

        //分享话题事件
        $scope.$on(kzi.constant.event_names.on_post_share,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.posts, { post_id: i });

                n && $scope.areaType==1 ? findDate($scope.queryCondition) : n.is_published = 1;
            };
        });

        //删除话题事件
        $scope.$on(kzi.constant.event_names.on_post_trash,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.posts, i);
//                n && ($scope.posts=_.without($scope.posts, n));
                n && findDate($scope.queryCondition);
            };
        });

        //删除评论事件
        $scope.$on(kzi.constant.event_names.comment_del,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.posts, {post_id:i});
                n && n.comment_count--;
            };
        });

        //添加评论事件
        $scope.$on(kzi.constant.event_names.on_post_comment,function(e, i){
            if (!_.isEmpty(i))
            {
                var n = _.findWhere($scope.posts, i);
                n && n.comment_count++;
            };
        });

}]);