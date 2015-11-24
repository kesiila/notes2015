'use strict';
innerApp.controller('admin_ctrl', ["$rootScope", "$scope", "$routeParams", "$popbox", "$timeout", "$location", 'MdParse',"$modal",
    function ($rootScope, $scope, $routeParams, $popbox, $timeout, $location, MdParse,$modal) {
        if ($rootScope.global.me.name != 'sys_manager' ||  $rootScope.global.me.role!=0 ) {
            window.location.href = "/";
            kzi.msg.error("权限不足！");
        }
        $rootScope.global.title = '后台';
        $rootScope.global.loading_done = true;
        var vm = $scope.vm = {};
        vm.user_info={
            user_name:'',
            user_id:''
        };
        vm.endDate=new Date();
        vm.startDate= (function (i) {
            i.setMinutes(0);
            i.setHours(0);
            return i;
        }).call(this,new Date());
        //new Date(new Date(new Date().setMinutes(0)).setHours(0));
        vm.name_or_email='';
        vm.select_tab='mail';
        vm.mail_status =
            [
                {name: "全部状态", value: "all",count:0,mails:[]}
                ,{name:"投递中",value:"MailInLine",count:0,mails:[]}
                ,{name:"已投递",value:"MailSubmit",count:0,mails:[]}
                ,{name:"已发送",value:"MailAccepted",count:0,mails:[]}
                ,{name:"已送达",value:"MailSent",count:0,mails:[]}
                ,{name: "已打开", value: "MailOpened",count:0,mails:[]}
                ,{name: "已弹回", value: "MailBounced",count:0,mails:[]}
                ,{name:"无效邮箱",value:"MailInvalid",count:0,mails:[]}
                ,{name:"点击链接",value:"MailLinkClicked",count:0,mails:[]}
                ,{name:"投递失败",value:"MailSendFailed",count:0,mails:[]}
                ,{name:"额度已满",value:"MailQuotaNotEnough",count:0,mails:[]}
                ,{name:"其他",value:"other",count:0,mails:[]}
            ];
        vm.customer={
            addCustomerCount:0,
            shareCustomerCount:0,
            collectCustomerCount:0,
            allCustomerCount:0
        }
        vm.template={
            addTemplateCount:0,
            shareTemplateCount:0,
            collectTemplateCount:0,
            allTemplateCount:0
        }
        vm.score_status=[
            {name: "全部", value: "all",count:0}
            ,{name:"注册奖励1000积分",value:"1000",count:0}
            ,{name:"每日签到奖励50积分",value:"50",count:0}
            ,{name:"消耗10积分行为(以前是收藏用户10积分,现在是查看邮箱10积分)",value:"-10",count:0}
            ,{name:"奖励2积分的行为",value:"2",count:0}
        ]
        vm.js_load_data = function () {
            $rootScope.global.loading_done = false;
            if(vm.select_tab=='mail'){
                wt.data.admin.get_mail_status(vm.user_info.user_id,vm.startDate.getTime(),vm.endDate.getTime(),
                    function success(response) {
                        vm.mail_overview = response.data;
                        _.each( vm.mail_status,function(status){
                            status.count=0;
                            if(status.value=="all"){
                                status.count=vm.mail_overview.mail_detail.rawResults.count;
                                return;
                            }
                            _.each(  vm.mail_overview.mail_detail.rawResults.retval,function(mail){
                                if( mail.status==null && status.value=='other'){
                                    status.count=mail.count;
                                    return;
                                }
                                if(mail.status==status.value){
                                    status.count=mail.count;
                                    return;
                                }
                            })
                        })
                    },
                    function error() {
                        kzi.msg.error('a error has occurred !');
                    },
                    function then() {
                        $rootScope.global.loading_done = true;
                    }
                )
            }else if(vm.select_tab=='customer'){
                wt.data.admin.get_customer_status(vm.user_info.user_id,vm.startDate.getTime(),vm.endDate.getTime(),
                    function success(response) {
                        vm.customer_overview = response.data;
                        vm.customer.addCustomerCount=response.data.addCustomerCount;
                        vm.customer.shareCustomerCount=response.data.shareCustomerCount;
                        vm.customer.collectCustomerCount=response.data.collectCustomerCount;
                        vm.customer.allCustomerCount=response.data.shareCustomerCount+response.data.addCustomerCount+response.data.collectCustomerCount;
                    },
                    function error() {
                        kzi.msg.error('a error has occurred !');
                    },
                    function then() {
                        $rootScope.global.loading_done = true;
                    }
                )
            }else if(vm.select_tab=='score'){
                wt.data.admin.get_score_status(vm.user_info.user_id,vm.startDate.getTime(),vm.endDate.getTime(),
                    function success(response) {
                        vm.score_overview = response.data;
                        _.each( vm.score_status,function(status){
                            status.count=0;
                            if(status.value=="all"){
                                status.count=vm.score_overview.score_detail.rawResults.count;
                                return;
                            }
                            _.each(  vm.score_overview.score_detail.rawResults.retval,function(score_info){
                                if(score_info.score==status.value){
                                    status.count=score_info.count;
                                }
                            })
                        })
                    },
                    function error() {
                        kzi.msg.error('a error has occurred !');
                    },
                    function then() {
                        $rootScope.global.loading_done = true;
                    }
                )
            }else if(vm.select_tab=='template'){
                wt.data.admin.get_template_status(vm.user_info.user_id,vm.startDate.getTime(),vm.endDate.getTime(),
                    function success(response) {
                        vm.template_overview = response.data;
                        vm.template.addTemplateCount=response.data.addTemplateCount;
                        vm.template.shareTemplateCount=response.data.shareTemplateCount;
                        vm.template.collectTemplateCount=response.data.collectTemplateCount;
                        vm.template.allTemplateCount=response.data.shareTemplateCount+response.data.addTemplateCount+response.data.collectTemplateCount;
                    },
                    function error() {
                        kzi.msg.error('a error has occurred !');
                    },
                    function then() {
                        $rootScope.global.loading_done = true;
                    }
                )
            }
        };
        vm.js_load_data();

        //获取某人信息
        vm.js_get_user=function(){
            if(vm.name_or_email==''){
                vm.user_list=[];
                vm.user_info.user_id='';
                vm.user_info.user_name='';
                vm.js_load_data();
                return;
            }
            var successFunc=function success(response) {
                if(response.data !=''){
                    vm.user_list=response.data;
                    vm.user_info.user_id= vm.user_list[0].objectId;
                    vm.user_info.user_name=vm.user_list[0].display_name;
                    vm.js_load_data();
                }else{
                    alert("未找到该用户");
                }
            };
            if(_.indexOf(vm.name_or_email,'@') >-1){
                wt.data.admin.get_user_byemail(vm.name_or_email, successFunc,
                    function error() {
                        kzi.msg.error('a error has occurred !');
                    },
                    function then() {
                    }
                )
            }else{
                wt.data.admin.get_user_byname(vm.name_or_email,successFunc,
                    function error() {
                        kzi.msg.error('a error has occurred !');
                    },
                    function then() {
                    }
                )
            }

        }
        //改变tab
        vm.js_select_tab=function(module){
            vm.select_tab=module;
            vm.js_load_data();
        }

    }
]);