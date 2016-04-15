/**
 * Created by Administrator on 2014/12/4 0004.
 */
"use strict";
innerApp.controller("google_search_ctrl", ["$rootScope", "$location", "$scope", "$http", "$window", "$timeout", '$routeParams', 'googleIP',
    function ($rootScope, $location, $scope, $http, $window, $timeout, $routeParams, googleIP) {
        //$rootScope.global.meta_description="beitaTest搜索";
        $rootScope.global.title = "搜索";
        $rootScope.global.loading_done = true;
        googleIP.getIP();
        var urlString = $location.path();
        if (urlString.indexOf('search') > 0) {
            $rootScope.global.header_menu = "google_search";
        }
        /**
         * 查询请求参数
         */
        $scope.queryCondition = {
            key_words: _.isEmpty($routeParams.key) ? "" : $routeParams.key,//查询关键字
            industry: _.isEmpty($routeParams.key) ? "" : $routeParams.key,//查询关键字
            search_customer__industry: _.isEmpty($routeParams.key) ? "" : $routeParams.key,
            company_name: _.isEmpty($routeParams.company_name) ? "" : $routeParams.company_name,//公司名称
            procurement_type: "Importer",//采购类型
            search_mail__company_name: _.isEmpty($routeParams.company_name) ? "" : $routeParams.company_name,
            search_mail__company_web: _.isEmpty($routeParams.company_web) ? "" : $routeParams.company_web,//公司网址
            search_mail__contacts: _.isEmpty($routeParams.contacts) ? "" : $routeParams.contacts,//联系人
            pure_search_input: '' //默认的google输入框
        };

        /**
         * 搜索工具页面属性
         */
        $scope.property = {

            service_ok: true,//服务是否可用

            google_ip: "",//请求Google的ip

            tab_type: _.isEmpty($routeParams.tab_type) ? "customer" : $routeParams.tab_type,//当前高级搜索类型["email","contacts","customer"."keywords"]

            show_procurement_type: false,//是否显示采购商类型

            no_b2b: true,//默认去除B2B网站和黄页

            unconcerned: true,//默认去除无关网站

            no_zh: true,//默认去除中国企业

            industry_search_history:[],//行业或产品搜索历史

            show_industry_search_history:false,//是否显示海关提单搜索历史

            procurement_types: ["Importer", "Wholesaler", "Distributor", "Retailer", "Buyer"]//采购商类型
        };

        var init=function(){
            var history=window.localStorage.getItem("industry_search_history");

            if(!_.isEmpty(history) && history.indexOf("/;/")>-1){
                $scope.property.industry_search_history = _.map(history.split("/;/"), function (e) {
                    return e.split("-");
                });
            }
        };

        init();

//        /**
//         * 获取请求Google的可用ip
//         */
//        $http.get("/api/dynamic/google").success(function(resp){
//                !_.isEmpty(resp.data) && ($scope.property.google_ip=resp.data);
//                _.isEmpty(resp.data) && ($scope.property.service_ok=false);
//        }).error(function(){$scope.property.service_ok=false;});

        /**
         * 拼装查询邮箱的链接
         * @param url
         * @returns {*}
         */
        var url_for_email = function (url) {
            var website = $scope.queryCondition.search_mail__company_web;
            if (!_.isEmpty(website)) {
                website.indexOf("www.") == -1 || (website = website.substr(website.indexOf("www.") + 4 * 1));

                website.indexOf("http://") == -1 || (website = website.substr(website.indexOf("http://") + 7 * 1));

                website.indexOf("/") == -1 || (website = website.substr(0, website.indexOf("/")));

                url = url + "%22email * * " + website + "%22";
            }
            ;
            website = null;

            !_.isEmpty($scope.queryCondition.search_mail__company_name) && (url = url + "%20OR%20intext:%22" + $scope.queryCondition.search_mail__company_name + "%22%2B%22email * *%22");

            !_.isEmpty($scope.queryCondition.search_mail__contacts) && (url = url + "%20OR%20intext:%22" + $scope.queryCondition.search_mail__contacts + "%22%2B%22email * *%22");
            return url;
        };

        /**
         * 拼装查询联系人的链接
         * @param url
         * @returns {*}
         */
        var url_for_contacts = function (url) {

            !_.isEmpty($scope.queryCondition.company_name) && (url = url + "intext:%22" + $scope.queryCondition.company_name + "%22%2B%22contact person%22");

            var email = $scope.queryCondition.email;
            !_.isEmpty(email) && (email.indexOf("@") == -1 || (email = email.substr(email.indexOf("@") + 1)), url = url + "%20OR%20%22" + email + "%22");
            email = null;

            var website = $scope.queryCondition.company_web;
            if (!_.isEmpty(website)) {
                website.indexOf("www.") == -1 || (website = website.substr(website.indexOf("www.") + 4 * 1));

                website.indexOf("http://") == -1 || (website = website.substr(website.indexOf("http://") + 7 * 1));

                website.indexOf("/") == -1 || (website = website.substr(0, website.indexOf("/")));

                url = url + "%20OR%20%22" + website + "%22%2B%22contact person%22";
            }
            ;
            website = null;
            return url;
        };

        /**
         * 动作处理
         */
        $scope.handle = {

            /**
             * 切换tab页
             */
            choose_search_type: function (type) {
                $scope.property.tab_type = type;
                $scope.property.show_procurement_type = false;
            },

            /**
             * 选择采购商类型
             */
            choose_procurement_type: function (index) {
                $scope.queryCondition.procurement_type = $scope.property.procurement_types[index];
                $scope.property.show_procurement_type = false;
            },

            /**
             * 取消采购商类型显示
             */
            hide_procurement_type: function () {
                $timeout(function () {
                    $scope.property.show_procurement_type = false;
                }, 200);
            },

            pure_google_search: function () {
                if($scope.queryCondition.pure_search_input) {
                    search('/?gws_rd=ssl#newwindow=1&q=' + $scope.queryCondition.pure_search_input);
                }
            },

            /**
             * 发出查询请求
             */
            many_conditions_search: function (search_type) {

                var url = "";
                switch (search_type) {
                    //搜邮箱
                    case "email":
                        url = url_for_email(url);
                        break;

                    //搜联系人
                    case "contacts":
//                        url = url_for_contacts(url);
                        !_.isEmpty($scope.queryCondition.company_name) && (search("/search?newwindow=1&site=&source=hp&q=%20site:linkedin.com%20intext:%22" + $scope.queryCondition.company_name+"%22"));
                        return;

                    //搜活动
                    default:
                        url = url + "%22" + $scope.queryCondition.search_customer__industry + "%22%20" + $scope.queryCondition.procurement_type,
                        url = url_handel(url);
                }
                ;

                if (url.indexOf("%20OR%20") == 0) {
                    url = url.substr(url.indexOf("%20OR%20") + 8 * 1);
                }

                search("/?gws_rd=ssl#q=" + url);
//                if($scope.property.tab_type=='customer'){search_count_solr($scope.queryCondition.search_customer__industry);}
            },

            /**
             * 关键词查询(搜海关提单)
             */
            key_words_search: function () {
                $scope.handle.hide_procurement_type();
                if (!_.isEmpty($scope.queryCondition.industry)) {
//                    var url=$scope.property.google_ip+"/search?newwindow=1&site=&source=hp&q="+$scope.queryCondition.key_words;
//                    window.open(url);
//                    search("/search?newwindow=1&site=&source=hp&q=" + $scope.queryCondition.key_words);
                    search("/search?newwindow=1&site=&source=hp&q=%20site:importgenius.com%20intext:%22" + $scope.queryCondition.industry+"%22");
                    search_count_solr($scope.queryCondition.industry);
                }
            },

            /**
             * 显示海关提单搜索历史
             */
            show_search_history:function(){
                ($scope.property.industry_search_history.length > 0) && ($scope.property.show_industry_search_history = true);
            },

            /**
             * 隐藏海关提单搜索历史
             */
            hide_search_history:function(){
                $scope.property.show_industry_search_history = false;
            }
        };

        var url_handel = function (url) {

            $scope.property.no_b2b && (url = url + "%20-B2B%20-Marketplace%20-leads%20-directory%20-member%20-yellowpages%20-online%20-\"join free\"%20-Categories%20-\"Find Suppliers\"");
            $scope.property.no_zh && (url = url + "%20-China%20-Chinese%20-.cn");
            $scope.property.unconcerned && (url = url + "%20-forum%20-.edu%20-.gov%20-blog%20-wikipedia%20-youtube%20-Jobs%20-interviews%20-Resumes%20-Industries");

            return url;
        };

        var search_count_solr=function(industry){

            var flag=true;

            if (!_.isEmpty($scope.property.industry_search_history)) {
                var temp = _.map($scope.property.industry_search_history, function (e) {
                    return e[0]
                });
                if(temp.indexOf(industry)>=0){
                    flag=false;
                }
            };

            flag && $http.get("/api/customers/product/count?industry="+industry).success(function(resp){
                if(!_.isEmpty(resp) && resp.totalItems>0){
                    var count=resp.totalItems;
                    var length = $scope.property.industry_search_history.length;
                    if(length>=3){
                        $scope.property.industry_search_history.pop();
                    };
                    if ($scope.property.industry_search_history.indexOf(industry) == -1) {
                        $scope.property.industry_search_history.unshift([industry, count]);
                        var temp = _.map($scope.property.industry_search_history, function (e) {
                            return e[0] + "-" + e[1]
                        });
                        window.localStorage.setItem("industry_search_history",temp.join("/;/"));
                    };
                }
            });
        };

        var search = function (url) {
            if (!_.isEmpty(googleIP.ip)) {
                window.open(googleIP.ip + url);
            } else {
                $scope.property.service_ok = false;
            }
        };

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

        /**
         *跳转到本站搜索
         */
        $scope.js_search_other = function (index) {

            var param=null;
            if(index>=0){
                param = $scope.property.industry_search_history[index][0];
            }
            $window.open('/customer?keywords='+param);
        }
    }
]);
