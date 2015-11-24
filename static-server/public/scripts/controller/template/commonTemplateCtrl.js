"use strict";
innerApp.controller('commonGeneratorCtrl', [ "$scope", "$rootScope", "templateNewGeneratorInfo1", "$timeout", "sanitize", "$modal", "$location", "$window", "projectsInfo", "MdParse", "$q",
    function ($scope, $rootScope, templateGeneratorInfo, $timeout, sanitize, $modal, $location, $window, projectsInfo, MdParse, $q) {
        $scope.newGenerator = $scope;
        $rootScope.global.header_menu = "generator";
        $rootScope.global.title = "智能邮件";
        $scope.variables = {
            company_name: '',
            company_products: '',
            create_time: '',
            customer_now: '',
            product_certification: '',
            QS: '',
            inspection_certificate: '',
            prodcutivePower: ''
        }
        $scope.customer_variables = {
            company_name: '',
            contact_name: '',
            email: '',
            products: '',
            type: '',
            feature: '',
            country: ''
        }
        var mapVO = {

        }

        var current_template_sequence = {
            content: [],
            title: []
        }

        if ($rootScope.global.is_login) {
            wt.data.user.get_company_info(function (res) {
                if (res.data) {
                    $scope.variables.customer_now = res.data.customerNow || "";
                    $scope.variables.create_time = res.data.buildDate || "";
                    $scope.variables.company_name = res.data.displayname || "";
                    $scope.variables.inspection_certificate = res.data.inspectionCertificate || "";
                    $scope.variables.product_certification = res.data.productCertification || "";
                    $scope.variables.company_products = res.data.products || "";
                    $scope.variables.QS = res.data.qualitySystem || "";
                    $scope.variables.prodcutivePower = res.data.prodcutivePower || "";
                }
            }, function error() {

            }, function then() {
                templateGeneratorInfo.getDataPromise.then(function () {
                    $scope.generate();
                });
            })
        } else {
            //未登录默认呈现的信息
            templateGeneratorInfo.getDataPromise.then(function () {
                //$scope.content = templateGeneratorInfo.generate(current_template_sequence.content);
                //$scope.title = templateGeneratorInfo.generateTitle(current_template_sequence.title);
                //f();
                $scope.generate();
            });
        }
        var d = new Markdown.Converter;
        var customer_info = {

        }
        var company_info = {

        }

        function reGet() {
            mapVO = [
                {
                    reg: /\[公司名称\]/g,
                    text: $scope.variables.company_name || "[公司名称]"
                },
                {
                    reg: /\[公司产品\]/g,
                    text: $scope.variables.company_products || '[公司产品]'
                },
                {
                    reg: /\[成立年数\]/g,
                    text: $scope.variables.create_time || '[成立年数]'
                },
                {
                    reg: /\[现有活动\]/g,
                    text: $scope.variables.customer_now || '[现有活动]'
                },
                {
                    reg: /\[产品认证\]/g,
                    text: $scope.variables.product_certification || '[产品认证]'
                },
                {
                    reg: /\[质量体系\]/g,
                    text: $scope.variables.QS || '[质量体系]'
                },
                {
                    reg: /\[验厂证书\]/g,
                    text: $scope.variables.inspection_certificate || '[验厂证书]'
                },
                {
                    reg: /\[生产能力\]/g,
                    text: $scope.variables.prodcutivePower || '[生产能力]'
                },
                {
                    reg: /\[发件人\]/g,
                    text: $rootScope.global.me.displayname || $rootScope.global.me.name || '[发件人]'
                }
            ]
        }

        function reGetBeforeSaveCustomerInfo() {
            customer_info = {
                name: $scope.customer_variables.contact_name || '',
                company: $scope.customer_variables.company_name || '',
                email: $scope.customer_variables.email || '',
                phone: '',
                website: ''
            }
        }

        function reGetBeforeSaveCompanyInfo() {
            company_info = {
                name: $scope.variables.name,
                displayname: $scope.variables.company_name,
                type: $scope.variables.type,
                size: $scope.variables.size,
                industry_1: $scope.variables.mainIndustryCode,
                industry_2: $scope.variables.subIndustryCode,
                address: $scope.variables.address,
                website: $scope.variables.website,
                description: $scope.variables.description,

                products: $scope.variables.company_products,
                buildDate: $scope.variables.create_time,
                customerNow: $scope.variables.customer_now,
                productCertification: $scope.variables.product_certification,
                qualitySystem: $scope.variables.QS,
                inspectionCertificate: $scope.variables.inspection_certificate,
                prodcutivePower: $scope.variables.prodcutivePower
            }
        }

        // str -> map -> str
        function mapWithVar(str, map, wrapper) {
            var wrapper = wrapper || '';
            str = str || '';
            str = str.replace(map.reg, wrapper + map.text + wrapper);
            return str;
        }

        function transBack(str) {
            str = str || '';
            str = str.replace(/`/g, '');
            return str;
        }

        function map(str, maps, wrapper) {
            var wrapper = wrapper || '';
            for (var i = 0, l = maps.length; i < l; i++) {
                str = mapWithVar(str, maps[i], wrapper);
            }
            return str;
        }

        $scope.content = '';
        $scope.origin = '';

        $scope.edit_mail = {
            display_name: $rootScope.global.me && ($rootScope.global.me.name || $rootScope.global.me.display_name || ""),
            email: $rootScope.global.me && ($window.sessionStorage.reply_email || $window.sessionStorage.email || "")
        };

        $scope.generate = function () {
//            if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login("/template/generator")) {
//                return 0;
//            }
            current_template_sequence.content = [];
            current_template_sequence.title = [];
            /**
             * 边界判断，第一次进入这个页面时，显示默认的模板
             * @type {boolean}
             */
            var isCompanyInfoAllEmpty = !$scope.variables.company_products || !$scope.variables.company_name;
            if (isCompanyInfoAllEmpty) {
                $scope.origin = templateGeneratorInfo.generate(current_template_sequence.content);
                $scope.content = $scope.origin;
                $scope.title = templateGeneratorInfo.generateTitle(current_template_sequence.title);
            } else {
                $scope.origin = templateGeneratorInfo.generate(current_template_sequence.content);
                $scope.content = map(map($scope.origin, mapVO), customerVariableMap);
                $scope.title = map(map(templateGeneratorInfo.generateTitle(current_template_sequence.title), mapVO), customerVariableMap);
            }
            f();
        }

        $scope.save_company_info = function () {
            $scope.company_info_is_save_ing = true;
            reGetBeforeSaveCompanyInfo();
            wt.data.user.save_company_info(company_info, function (res) {
                if (res.data.company) {
                    $scope.variables.customer_now = res.data.company.customerNow || "";
                    $scope.variables.create_time = res.data.company.buildDate || "";
                    $scope.variables.company_name = res.data.company.displayname || "";
                    $scope.variables.inspection_certificate = res.data.company.inspectionCertificate || "";
                    $scope.variables.product_certification = res.data.company.productCertification || "";
                    $scope.variables.company_products = res.data.company.products || "";
                    $scope.variables.QS = res.data.company.qualitySystem || "";
                    $scope.variables.prodcutivePower = res.data.company.prodcutivePower || "";
                }
            }, function () {
                debugger;
            }, function () {
                kzi.msg.success('公司变量信息保存成功！', function () {
                })
                $scope.company_info_is_save_ing = false;
            });
        }

        $scope.forWho = 'forMe';
        $scope.changeTab = function (type) {
            $scope.forWho = type;
        }

        function f() {
            $timeout(function () {
                if ($scope.content) {
                    var e = d.makeHtml($scope.content),
                        t = sanitize(e);
                    $scope.html = t
                }
                _.isEmpty($scope.content) && ($scope.html = "")
            })
        }

        var isFnRun;

        function shim() {
            isFnRun ? (clearTimeout(isFnRun), isFnRun = setTimeout(f, 500)) : isFnRun = setTimeout(f, 500)
        }

        $scope.$watch(function () {
            return $scope.variables
        }, function (newValue, OldValue) {
            reGet();
            $scope.content = map($scope.content, mapVO);
            var str = $scope.origin;
            $scope.content = map(str, mapVO);
            shim();
        }, true)

        $scope.fold_or_not = false;

        $scope.edit_or_preview = 'edit';

        $scope.toggle_generator = function () {
            $scope.fold_or_not = !$scope.fold_or_not;
        }
        $scope.toggle_edit = function () {
            if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login()) {
                return
            }
            $scope.edit_or_preview = ($scope.edit_or_preview == 'edit') ? 'preview' : ($scope.fold_or_not = true, 'edit');

        }

        $scope.show_save_template = function () {
            if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login("/template/generator")) {
                return
            }
            $modal.open({
                scope: $scope,
                templateUrl: '/view/modal/pop_and_complete_generator.html',
                controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.generateModalCtrl = $scope;
                    var date = new Date();
                    $scope.isUsedMost = false;
                    $scope.autoTitle = date.format("yyyy年MM月dd日") + "开发信模板"
                    $scope.close = function () {
                        $modalInstance.close()
                    }
                    $scope.save_template = function () {
                        $scope.is_save_ing = true;
                        var watchers = [];
                        watchers.push($rootScope.global.me.uid);
                        wt.data.template.add(projectsInfo.defaultPid, "01", $scope.autoTitle, "0100", "开发", "", "", $scope.$parent.title, transBack($scope.$parent.content), watchers,
                            function (res) {
                                var templateId = res.data.template_id;
                                if ($scope.isUsedMost == true) {
                                    wt.data.user.update_defualt_template(templateId, function (res) {
                                        $window.sessionStorage.defaultTemplate = res.data.defaultTemplate
                                    }, function () {
                                    }, function () {
                                    });
                                }
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

        customer_info = {
            name: $scope.customer_variables.contact_name || '',
            company: $scope.customer_variables.company_name || '',
            email: $scope.customer_variables.email || '',
            phone: '',
            website: ''
        }
        var customerVariableMap = {

        }
        var reGetCustomerVariableMap = function () {
            customerVariableMap = [
                {
                    reg: /\[\[活动公司\]\]/g,
                    text: $scope.customer_variables.company_name || "[[活动公司]]"
                },
                {
                    reg: /\[\[联系人\]\]/g,
                    text: $scope.customer_variables.contact_name || '[[联系人]]'
                },
                {   reg: /\[\[活动邮箱\]\]/g,
                    text: $scope.customer_variables.email || "[[活动邮箱]]"
                },
                {
                    reg: /\[\[活动产品\]\]/g,
                    text: $scope.customer_variables.products || '[[活动产品]]'
                },
                {
                    reg: /\[\[活动类型\]\]/g,
                    text: $scope.customer_variables.type || '[[活动类型]]'
                },
                {
                    reg: /\[\[活动特色\]\]/g,
                    text: $scope.customer_variables.feature || '[[活动特色]]'
                },
                {
                    reg: /\[\[活动国家\]\]/g,
                    text: $scope.customer_variables.country || '[[活动国家]]'
                }
            ]
        }
        $scope.save_customer_info = function () {
            $scope.customer_is_save_ing = true;
            reGetBeforeSaveCustomerInfo();
            /*            if ($scope.newCustomer.subIndustryCode == null) {
             $scope.newCustomer.subIndustryCode = $scope.newCustomer.mainIndustryCode;
             $scope.newCustomer.subIndustryCnName = $scope.newCustomer.subIndustryCnName;
             }
             if ($scope.newCustomer.countryCode == null) {
             $scope.newCustomer.countryCode = $scope.newCustomer.zoneCode;
             $scope.newCustomer.countryCnName = $scope.newCustomer.zoneCnName;
             }*/
            var defered = new $q.defer();
            wt.data.task.add(
                projectsInfo.defaultPid,
                customer_info,
                function (res) {
                    $scope.edit_mail.watchers = $scope.edit_mail.watchers || []
                    $scope.edit_mail.watchers.push({'uid': ''});
                    $scope.edit_mail.tasks = $scope.edit_mail.tasks || []
                    $scope.edit_mail.tasks.push(res.data)
                    $scope.edit_mail.content = $scope.content;
                    $scope.edit_mail.template_id = '';
                    $scope.edit_mail.subject = $scope.title;
                    defered.resolve(res);
                },
                function () {

                },
                function () {
                    $scope.customer_is_save_ing = false;
                }
            )
            return defered.promise;
        }
        /**
         *  定制活动变量确定按钮
         *  map the customer's variables to content and title
         */

        $scope.custom_customer_info_click = function () {
            //活动变量信息
            reGetCustomerVariableMap();
            //用户变量信息
            reGet();
            kzi.msg.success("活动变量信息已关联到开发信~", function () {
            })
            setContentAndTitle();
        };

        /**
         * map variables to content and title
         */
        function setContentAndTitle() {
            var invalidate = _.chain(customerVariableMap).filter(function (obj) {
                return obj.text === ''
            }).map(function (obj) {
                return obj.reg
            }).value() || [];
            var predicate = function (item) {
                return _.chain(invalidate).reduce(function (mem, reg) {
                    return mem || reg.test(item);
                }, false).value()
            };
            var content_str = templateGeneratorInfo.generateContentWithArray(_.clone(current_template_sequence.content), predicate);
            $scope.content = map(map(content_str, customerVariableMap), mapVO);
            var title_str = templateGeneratorInfo.generateTitleWithArray(_.clone(current_template_sequence.title), predicate);
            $scope.title = map(map(title_str, customerVariableMap), mapVO);
        }

        $scope.show_save_and_send_mail = function () {
            if ($scope.title && $scope.content) {
                $modal.open({
                    scope: $scope,
                    templateUrl: "/view/modal/pop_set_email_before_send_mail.html",
                    controller: ["$scope", function ($scope) {
                        $scope.modalCtrl = $scope;
                        $scope.close = function () {
                            $scope.$close()
                        }
                        $scope.confirm_send = function () {
                            var promise = $scope.$parent.save_customer_info();
                            promise.then(function (res) {
                                $scope.$parent.js_save_mail().then(function () {
                                    $scope.close()
                                });
                            })
                        };
                    }]
                })
            } else {
                kzi.msg.warn('邮件标题和正文不能为空！')
            }
        }

        //发送邮件
        $scope.js_save_mail = function () {
            var deferred = new $q.defer();
            $scope.is_saving = !0;
            var warthers = _.pluck($scope.edit_mail.watchers, "uid");
            warthers = [];
            var task_ids = _.pluck($scope.edit_mail.tasks, "tid");
            var content = MdParse($scope.edit_mail.content);
            var from = $scope.edit_mail.display_name + "<" + $scope.edit_mail.email + ">";
            var template_id = $scope.edit_mail.template_id;
            wt.data.email.add(projectsInfo.defaultPid, $scope.edit_mail.subject, content, warthers, task_ids, from, template_id, function (i) {
                $scope.mails = $scope.mails || [];
                angular.forEach(i.data, function (mail) {
                    $scope.mails.unshift(mail);
                });
                $scope.is_saving = !1;
            }, function (res) {
                console.log('error: sending mail!');
            }, function () {
                var modalInstanceOption = {
                    scope: $scope,
                    templateUrl: '/view/modal/pop_and_send_mail.html',
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.close()
                        }
                    }]
                }
                deferred.resolve();
                $modal.open(modalInstanceOption);
            });
            return deferred.promise;
        };
    }])