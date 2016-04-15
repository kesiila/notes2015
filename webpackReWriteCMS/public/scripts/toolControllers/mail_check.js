/**
 * Created by Administrator on 2014/12/4 0004.
 */
"use strict";
innerApp.controller("mail_check_ctrl", ["$rootScope", "$location", "$scope","$alert","$timeout",
    function ($rootScope, $location, $scope,$alert,$timeout) {
        $rootScope.global.title = "邮箱验证";
        $rootScope.global.loading_done = true;
        var urlString = $location.path();
        if (urlString.indexOf('email-verify') > 0) {
            $rootScope.global.header_menu = "mail_check";
        }
        $scope.placeholder="请按以下格式验证邮箱:\r\n"+
                            "mambate@gmail.com\r\n"+
                            "maltron@msn.com\r\n" +
                            "mamet@speedy.com.pe\r\n" +
                            "mact.eqpt@nesma.net.sa\r\n" +
                            "macs@wol.co.za\r\n";
        $scope.email_input_focus = true;
        $scope.mail_status = "无效";
        $scope.mail_status_code = "-1";
        $scope.show_mail_status = false;
        $scope.mail_list = [];
        $scope.failure_mail_list=[];
        $scope.mail_info = {
            mail: "",
            mail_status_code:"",
            mail_status: ""
        };
        //批量邮箱
        $scope.batch_email_content='';
        //验证失败,重新验证
        //不支持验证此邮箱
        $scope.clear_email_input = function () {
            $scope.check_email = "";
            $scope.email_input_focus = true;
        }
        //表头
        $scope.excel_header="有效邮箱";
        //excel表内容
        $scope.excel_contents="";

        $scope.submit_hint=false;
        $scope.submit_hint_word='';
        $scope.export_input='one_export';
        $scope.effectiveEmailList=[];
        $scope.show_export_input=function(a){
            $scope.export_input=a;
        }
        $scope.clear=function(){$scope.mail_list = [];$scope.effectiveEmailList=[];}
        /**
         * 检查邮箱是否有效
         */

        $scope.email_validate = function () {
            $scope.email_input_focus = false;
            var successFunc = function (resp) {
                if ('0' == resp.data || '00' == resp.data) {
                    $scope.mail_status = "邮箱有效";
                    $scope.mail_status_code = "0";
                } else if ('1' == resp.data || '-1' == resp.data) {
                    $scope.mail_status = "邮箱无效";
                    $scope.mail_status_code = "1";
                }else if ('-99' == resp.data) {
                    $scope.mail_status = "验证失败";
                    $scope.mail_status_code = "-99";
                } else {
                    $scope.mail_status = "验证失败";
                    $scope.mail_status_code = "-1";
                }
                ;
                $scope.mail_info = {
                    mail: $scope.check_email,
                    mail_status_code: $scope.mail_status_code,
                    mail_status: $scope.mail_status
                };
                $scope.mail_list.splice(0, 0, $scope.mail_info);

                if($scope.mail_info.mail_status_code=="0" ){
                    var even = _.find($scope.effectiveEmailList, function(effectiveMail){ return effectiveMail.mail ==$scope.check_email; });
                    if(even==undefined){
                        $scope.effectiveEmailList.splice(0, 0, $scope.mail_info);
                        $scope.excel_contents=JSON.stringify($scope.effectiveEmailList);
                    }
                }
            };
            if(!_.isEmpty($scope.check_email)){
                $scope.is_checking = true;
                wt.data.email.check($scope.check_email, successFunc,
                    function () {
                        $scope.mail_status = "验证失败";
                        $scope.mail_status_code = "-1";
                    },
                    function () {
                        $scope.is_checking = false;
                        $scope.show_mail_status = true;

                    });
            }
        };
        /**
         * 批量验证
         * @param excel_contents
         */
        $scope.show_progressbar=false;
        $scope.max_mail=0;
        $scope.dynamic_mail=0;
        var begin,end;
        var batch_email=[];

        var run_batch_email={
            all_mail:[],
            valid_mail:[],
            invalid_mail:[],
            nonsupport_mail:[],
            fail_mail:[],
            init:function(){
                this.all_mail=[];
                this.valid_mail=[];
                this.invalid_mail=[];
                this.fail_mail=[];
            }
        };
        $scope.batch_email_validate=function(){
            run_batch_email.init();
            begin=new Date();
            $scope.max_mail=0;
            $scope.dynamic_mail=0;
            var batch_mail=$scope.batch_email_content;
            batch_email=$scope.batch_email_content.replace( new RegExp(/\n/g),",").split(",");
            $scope.batch_email_content='';
            _.each( batch_email,function(mail){
                mail=mail.trim();
                var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
                if(!EMAIL_REGEXP.test(mail)){
                    return;
                }
                $scope.batch_email_content+=mail+"\n";
            });
            if($scope.batch_email_content=='' && batch_mail!=''){
                $scope.submit_hint=true;
                $scope.submit_hint_word="请放入正确格式数据";
                $timeout(function(){
                    $scope.submit_hint=false;
                    $scope.submit_hint_word='';
                }, 2000);
                return;
            }else{
                $scope.batch_email_content=$scope.batch_email_content.substring(0,$scope.batch_email_content.length-1);
            }
            batch_email=$scope.batch_email_content.split("\n");
            $scope.max_mail=batch_email.length;
            run_batch_email.all_mail=batch_email;
            $scope.show_progressbar=true;
            _.each( batch_email,function(mail){
                var successFunc = function (resp) {
                    if ('0' == resp.data || '00' == resp.data) {
                        $scope.mail_status = "邮箱有效";
                        $scope.mail_status_code = "0";
                        run_batch_email.valid_mail.push(mail);
                    } else if ('1' == resp.data || '-1' == resp.data) {
                        $scope.mail_status = "邮箱无效";
                        $scope.mail_status_code = "1";
                        run_batch_email.invalid_mail.push(mail);
                    }else if ('-99' == resp.data) {
                        $scope.mail_status = "验证失败";
                        $scope.mail_status_code = "-99";
                        run_batch_email.nonsupport_mail.push(mail);
                    } else {
                        $scope.mail_status = "验证失败";
                        $scope.mail_status_code = "-1";
                        run_batch_email.fail_mail.push(mail);
                    }
                    ;
                    $scope.mail_info = {
                        mail: mail,
                        mail_status_code: $scope.mail_status_code,
                        mail_status: $scope.mail_status
                    };
                    $scope.mail_list.splice(0, 0, $scope.mail_info);

                    if($scope.mail_info.mail_status_code=="0" ){
                        var even = _.find($scope.effectiveEmailList, function(effectiveMail){ return effectiveMail.mail ==mail; });
                        if(even==undefined){
                            $scope.effectiveEmailList.splice(0, 0, $scope.mail_info);
                            $scope.excel_contents=JSON.stringify($scope.effectiveEmailList);
                        }
                    }
                };
                if(!_.isEmpty(mail)){
                    wt.data.email.check(mail, successFunc,
                        function () {
                            $scope.mail_status = "验证失败";
                            $scope.mail_status_code = "-1";
                        },
                        function () {
                            $scope.dynamic_mail+=1;
                        });
                }
            });

        }
        $scope.$watch("dynamic_mail", function (dynamic_mail) {
            if( $scope.max_mail!=undefined && $scope.max_mail!=0 && $scope.max_mail==dynamic_mail){
                end=new Date();
                $scope.show_progressbar=false;
                //alert("验证结果:有效"+run_batch_email.valid_mail.length+"个,无效"+run_batch_email.invalid_mail.length+"个,验证失败"+ run_batch_email.fail_mail.length+"个");
                batch_email=[];
            }
        }, true);
        $scope.submit_export=function (excel_contents){
            $timeout(function(){
                $scope.submit_hint=true;
                $scope.submit_hint_word="导出成功";
            }, 500);
            $timeout(function(){
                $scope.submit_hint=false;
                $scope.submit_hint_word='';
            }, 2000);
        };
        if($rootScope.global.is_login){
            if(!_.isEmpty(localStorage.getItem('mail_list'))){
                $scope.mail_list=eval("("+localStorage.getItem('mail_list')+")");
            }
            if(!_.isEmpty(localStorage.getItem('excel_contents'))){
                $scope.excel_contents=localStorage.getItem('excel_contents');
                $scope.effectiveEmailList=eval("("+localStorage.getItem('excel_contents')+")");
            }
            localStorage.removeItem("excel_contents");
            localStorage.removeItem("mail_list");
        }else{
            localStorage.removeItem("excel_contents");
            localStorage.removeItem("mail_list");
        }

        $scope.send_mail = function (mail_detail) {
            if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login("/email-verify")) {
                var string_mail_list=JSON.stringify($scope.mail_list);
                localStorage.setItem("excel_contents",$scope.excel_contents);
                localStorage.setItem("mail_list",string_mail_list);
                return
            }
            var obj = {
                from: 'sendWithoutCustomer',
                mailAddressList: [mail_detail.mail],
                tasks: []
            }
            $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj);
        }

        $scope.batch_send_mail = function () {
            if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login("/email-verify")) {
                var string_mail_list=JSON.stringify($scope.mail_list);
                localStorage.setItem("excel_contents",$scope.excel_contents);
                localStorage.setItem("mail_list",string_mail_list);
                return
            }
            var obj = {
                from: 'sendWithoutCustomer',
                mailAddressList: [],
                tasks: []
            };
            _.each( $scope.effectiveEmailList,function(effectiveEmail){
                obj.mailAddressList.push(effectiveEmail.mail);
            });
            $rootScope.$broadcast(kzi.constant.event_names.open_mail_box, obj);
        }
        /**
         * 加入收藏夹
         * @param href
         * @param title
         */
        $scope.addFavorite = function (href, title) {
            if (document.all) {
                try {
                    window.external.addFavorite(href, title);
                } catch (e) {
                    alert("加入收藏失败，请使用Ctrl+D进行添加");
                }
            } else if (window.sidebar) {
                window.sidebar.addPanel(href, title, "");
            } else {
                alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
        };
    }
]);

innerApp.controller('spam_check_ctrl',
    ["$rootScope",'$scope', "$location",'wtSpamCheck','$modal','$timeout','projectsInfo',
    function($rootScope,$scope,$location, wtSpamCheck,$modal, $timeout,projectsInfo) {
        "use strict";
        $rootScope.global.title = "Spam Check";
        $rootScope.global.loading_done = true;
        var urlString = $location.path();
        if (urlString.indexOf('spam_check') > 0) {
            $rootScope.global.header_menu = "spam_check";
        }
        var vm = $scope.vm = {};
        vm.spam_check = {
            content: "",
            title: "",
            verify: function (content) {
                wtSpamCheck.checkContent(content).then(pop_detail);
            }
        }
        function pop_detail (res) {
            $scope.is_saving = false;
            $modal.open({
                scope:$scope,
                templateUrl: '/view/modal/pop_check_result.html',
                controller: ['$scope',"$modalInstance", function($scope,$modalInstance){
                    $scope.results = res;
                    //总分
                    $scope.totalScore = _.reduce($scope.results,function (mem, item) {
                        return mem + Number(item.weight) * 10 * Number(item.count);
                    },0) / 10;
                    $scope.close = function () {
                        $modalInstance.close();
                    }
                    $scope.sensitiveWord=function(){
                        $modal.open({
                            scope:$scope,
                            templateUrl: '/view/modal/pop_check_sensitive_word.html',
                            controller: ['$scope',"$modalInstance", function($scope,$modalInstance){
                                $scope.close = function () {
                                    $modalInstance.close();
                                }
                            }]
                        })
                    }
                }]
            })
        }
        $scope.spamCheck=function(){
            var str=$scope.vm.spam_check.title + " " + $scope.vm.spam_check.content;
            $scope.is_saving = true;
            vm.spam_check.verify(str);
        }
        $scope.spamCheckDescribe=function(){
            $modal.open({
                scope:$scope,
                templateUrl: '/view/modal/pop_check_describe.html',
                controller: ['$scope',"$modalInstance", function($scope,$modalInstance){
                    $scope.close = function () {
                        $modalInstance.close();
                    }
                }]
            })
        }
        function transBack(str) {
            str = str || '';
            str = str.replace(/`/g, '');
            return str;
        }
        //存为模板
        $scope.show_save_template = function () {
            if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login("/spam_check")) {
                return
            }
            $modal.open({
                scope: $scope,
                templateUrl: '/view/modal/pop_and_complete_generator.html',
                controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.generateModalCtrl = $scope;
                    var date = new Date();
                    $scope.isUsedMost = false;
                    $scope.autoTitle = date.format("yyyy年MM月dd日hh:mm") + "开发信模板"
                    $scope.close = function () {
                        $modalInstance.close()
                    }
                    $scope.save_template = function () {
                        $scope.is_save_ing = true;
                        var watchers = [];
                        watchers.push($rootScope.global.me.uid);
                        wt.data.template.add(projectsInfo.defaultPid, "01", $scope.autoTitle, "0100", "开发", "", "", $scope.$parent.vm.spam_check.title, transBack($scope.$parent.vm.spam_check.content), watchers,
                            function (res) {
                                var templateId = res.data.template_id;
                                if ($scope.isUsedMost == true) {
                                    wt.data.user.update_defualt_template(templateId, function (res) {
                                        $window.sessionStorage.defaultTemplate = res.data.defaultTemplate
                                    }, function () {
                                    }, function () {
                                    });
                                }
                                $rootScope.$broadcast('send_mail_page__add_new_template_success', {
                                    new_template: res.data
                                })
                            },
                            function () {
                                debugger
                            },
                            function () {
                                $scope.close();
                                $scope.is_save_ing = false;
                                $modal.open({
                                    templateUrl: '/view/modal/pop_and_complete_generator_end.html',
                                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                        $scope.close = function () {
                                            $modalInstance.close()
                                        }
                                    }]
                                })
                            });
                    };
                }]
            })
        };
}]);
