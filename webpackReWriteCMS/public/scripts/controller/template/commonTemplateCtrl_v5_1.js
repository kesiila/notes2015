/**
 * Created by wuyunge on 2015/1/30.
 */
"use strict";
innerApp.controller('commonGenerator_v5_1_Ctrl',
    ["$scope", "$rootScope",
        "templateNewGeneratorInfo1",
        "$timeout", "sanitize",
        "$modal", "$location",
        "$window", "projectsInfo",
        "MdParse", "$q", "$routeParams", "mailPreview",
        function ($scope, $rootScope, templateGeneratorInfo,
                  $timeout, sanitize, $modal, $location,
                  $window, projectsInfo, MdParse, $q, $routeParams, mailPreview) {
            //init begin ----------------------------------------------------------------------------
            $scope.newGenerator = $scope;
            //$rootScope.global.header_menu = "generator";
            $scope.is_saving = false;

            //个人变量::viewModel
            $scope.variables = {
                company_name: '',
                company_products: '',
                create_time: '',
                customer_now: '',
                product_certification: '',
                QS: '',
                inspection_certificate: '',
                productivePower: ''
            }

            //活动变量::viewModel
            $scope.customer_variables = {
                company_name: '',
                contact_name: '',
                email: '',
                products: '',
                type: '',
                feature: '',
                country: ''
            }

            //活动变量--正则，映射表
            var mapVO = {}

            var editorPreviewDeffer = new $q.defer();
            var companyInfoLoadingDoneDeffer = new $q.defer();
            //生产筛选条件的条件工厂
            var generator = {
                getCurrentRootType: function () {
                    return getPredicateByCurrentRootTypeFactory(viewProperty.currentRootTemplate);
                },
                getDataPromise: templateGeneratorInfo.getDataPromise,
                generate: function () {
                    var args = [].splice.call(arguments, 0, 1);
                    args.push(this.getCurrentRootType());
                    return templateGeneratorInfo.generate.apply(templateGeneratorInfo, args)
                },
                generateTitle: function () {
                    var args = [].splice.call(arguments, 0, 1);
                    args.push(this.getCurrentRootType());
                    return templateGeneratorInfo.generateTitle.apply(templateGeneratorInfo, args)
                },
                generateTitleWithArray: templateGeneratorInfo.generateTitleWithArray,
                generateContentWithArray: templateGeneratorInfo.generateContentWithArray
            }

            var current_template_sequence = {
                content: [],
                title: []
            }
            //如果穿了马甲来到这里，就让他正常使用，不然只给他看第一封模板。
            // 要想看更多就给他看一个大牌子--快去买衣服或穿衣服(登陆或注册)
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
                        $scope.variables.productivePower = res.data.productivePower || "";
                    }
                }, function error() {

                }, function then() {
                    companyInfoLoadingDoneDeffer.resolve();
                })
            } else {
                //未登录默认呈现的信息
                generator.getDataPromise.then(function () {
                    $scope.content = generator.generate(current_template_sequence.content);
                    $scope.viewProperty.title = generator.generateTitle(current_template_sequence.title);
                });
            }

            //用来解析markdown的转换器 :: Function
            var markdown_converter = new Markdown.Converter;

            var customer_info = {}
            var company_info = {}

            //邮件文本内容:: viewModel
            $scope.content = '';

            //原始的模板文本和标题 ,可能暂时没有用到--commented March 26th
            $scope.origin = {
                content: '',
                title: ''
            };

            $scope.src = {
                content: '',
                title: ''
            };

            //viewProperty
            var viewProperty = $scope.viewProperty = {
                current_customer: {}, //当前邮件的目标活动
                previousStatus: "default",
                currentStatus: "default",
                currentRootTemplate: "default",
                templates: [],
                mail: {
                    recipient_info: '',
                    sender_info: ($rootScope.global.me.display_name || $rootScope.global.me.name || '')
                    + ( ($rootScope.global.me.reply_email || $rootScope.global.me.email) ?
                    '<' + ($rootScope.global.me.reply_email || $rootScope.global.me.email) + '>' : '' ),
                    title_info: '',
                    /** 记下用来构成邮件信息的活动在活动列表中的位置，以供群发预览使用。
                     *
                     * 当只有一个活动时，当前位置序号记为默认值 0. 最大位置序号 也记为0 */
                    position_info: {
                        current: 0,
                        tasks_max_sequence_num: 0
                    }

                }
            }

            //默认显示的发邮件姓名和邮箱
            $scope.edit_mail = {
                display_name: $rootScope.global.me && ($rootScope.global.me.name || $rootScope.global.me.display_name || ""),
                email: $rootScope.global.me && ($window.sessionStorage.reply_email || $window.sessionStorage.email || "")
            };

            //打开新标签页时，带的活动ID。暂时没有用到 -- commented March 26th
            $scope.routeParam_info = {
                customer_id: $routeParams.customer_id
            };

            //带着红帽子（活动id）进来的，直接给他想要的活动
            if ($scope.routeParam_info.customer_id) {
                wt.data.task.get(null, $scope.routeParam_info.customer_id, function (res) {
                    viewProperty.current_customer = res.data;
                    viewProperty.mail.recipient_info = res.data.name + (res.data.email ? ['<', res.data.email, '>'].join('') : '');
                }, function error() {
                    // be empty temporary
                }, function then() {
                    // be empty temporary
                })
            }

            //页面的几个状态（房间的不同装饰）
            $scope.forWho = 'forMe';

            //页面的几个状态 （从窗户进来的，通过大门进来的） :: enum
            // normal -- door
            // groupBatchSend -- window
            $scope.viewProperty.fromWhere = "normal";

            //init end ----------------------------------------------------------------------------

            //根据不同的装饰（状态）产生不同的配料（筛选条件）
            function getPredicateByCurrentRootTypeFactory(type) {
                //predicateFactory:: (emptyOrNot::bool) -> (string->bool)
                function predicateFactory() {
                    reGetCustomerVariableMap();
                    reGet();
                    var keyValueMap;
                    if (type === 'default') {
                        keyValueMap = _.clone(customerVariableMap).concat(_.clone(mapVO)) || [];
                    }
                    if (type === 'forMe') {
                        keyValueMap = mapVO || [];
                    }
                    if (type === 'advanced') {
                        keyValueMap = customerVariableMap || [];
                    }
                    var invalidate = _.chain(keyValueMap).filter(function (obj) {
                            return new RegExp(obj.reg).test(obj.text);
                        }).map(function (obj) {
                            return obj.reg
                        }).value() || [];
                    var validate = _.chain(keyValueMap).map(function (i) {
//                    if( i.reg.test(i.text) ){
//                        i.weight = -1;
//                    }
                            i.weight = new RegExp(i.reg).test(i.text) ? -1 : (i.text ? 0 : 1);
                            return i;
                        }).value() || [];
                    var predicate;
                    if (validate.length !== keyValueMap.length || validate.length === keyValueMap.length) {
                        predicate = function (item) {
                            return _.chain(validate).reduce(function (mem, i) {
                                return mem + (new RegExp(i.reg).test(item.join('')) ? (i.weight ? i.weight : -1 ) : 0.5 );
                            }, 0).value()
                        };
                    } else {
                        predicate = function (item) {
                            return !_.chain(invalidate).reduce(function (mem, reg) {
                                return mem || reg.test(item);
                            }, false).value()
                        };
                    }
                    return predicate;
                }

                return predicateFactory();
            }

            //用映射表前，重新与页面上的矫正下
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
                        text: $scope.variables.productivePower || '[生产能力]'
                    },
                    {
                        reg: /\[发件人\]/g,
                        text: $rootScope.global.me.display_name || $rootScope.global.me.name || '[发件人]'
                    }
                ]
            }

            //保存活动信息前，重新把页面内的信息，组装成正确的格式
            function reGetBeforeSaveCustomerInfo() {
                customer_info = {
                    name: $scope.customer_variables.contact_name || '',
                    company: $scope.customer_variables.company_name || '',
                    email: $scope.customer_variables.email || '',
                    phone: '',
                    website: ''
                }
            }

            //保存公司信息前，重新组装成正确的格式
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
                    productivePower: $scope.variables.productivePower
                }
            }

            //根据映射表和文本，加工文本
            // str -> map -> str ->str
            function mapWithVar(str, map, wrraper) {
                var wrraper = wrraper || '';
                str = str || '';
                str = str.replace(map.reg, wrraper + map.text + wrraper)
                return str;
            }

            function transBack(str) {
                str = str || '';
                str = str.replace(/`/g, '');
                return str;
            }

            //加工器
            function map(str, maps, wrapper) {
                var wrapper = wrapper || '';
                for (var i = 0, l = maps.length; i < l; i++) {
                    str = mapWithVar(str, maps[i], wrapper);
                }
                return str;
            }

            //触发模板制造器的开关 :: viewModel
            $scope.generate = function (preview_or_not) {
                if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login("/template/generator")) {
                    return 0;
                }

                function hint(status) {

                    if (status === 0) {
                        //  直接保存为默认
                    }
                    if (status === 1) {
                        //
                    }
                    $popbox.popbox({
                        target: event,
                        templateUrl: "/view/common/pop_generator_hint.html",
                        controller: ["$scope", "popbox", "pop_data", "$timeout",
                            function ($scope, popbox, pop_data, $timeout) {
                                /** viewmodel**/
                                var vm = $scope.vm;
                                vm.replace_origin_template = true;
                                vm.save_as_another = false;

                                vm.js_ensure = function () {
                                    if (vm.replace_origin_template) {
                                        //---更改模板信息
                                    }
                                    if (vm.save_as_another) {
                                        //---存成一份新的模板
                                    }
                                }
                                vm.js_cancle = function () {

                                }
                            }],
                        resolve: {
                            pop_data: function () {
                                return {
                                    scope: $scope
                                };
                            }
                        }
                    }).open();
                }

                current_template_sequence.content = [];
                current_template_sequence.title = [];
                /**
                 * 边界判断，第一次进入这个页面时，显示默认的模板
                 * @type {boolean}
                 */
                var isCompanyInfoAllEmpty = !$scope.variables.company_products || !$scope.variables.company_name;
                if (isCompanyInfoAllEmpty) {
                    //$scope.viewProperty.custom_template__content = $scope.origin.content = generator.generate(current_template_sequence.content);
                    //$scope.viewProperty.custom_template__title = $scope.origin.title = generator.generateTitle(current_template_sequence.title);
                    $scope.viewProperty.custom_template__content = $scope.origin.content = generator.generate(current_template_sequence.content);
                    $scope.viewProperty.custom_template__title = $scope.origin.title = generator.generateTitle(current_template_sequence.title);
                } else {
                    $scope.origin.content = generator.generate(current_template_sequence.content);
                    $scope.origin.title = generator.generateTitle(current_template_sequence.title);
                    $scope.viewProperty.custom_template__content = !preview_or_not ? map(map($scope.origin.content, mapVO), customerVariableMap) : $scope.origin.content;
                    $scope.viewProperty.custom_template__title = !preview_or_not ? map(map($scope.origin.title, mapVO), customerVariableMap) : $scope.origin.title;
                }
                f();
            };

            /**
             * when root_template, companyInfo and editorPreview have been ready, generate the first template.
             * unused sentence,
             */
            $q.all([generator.getDataPromise, companyInfoLoadingDoneDeffer.promise]).then(function () {
                $scope.generate();
            });
            //triggered when editor change status ------------------------------------------------------------
            /*     $rootScope.$on("new-editor-preview-or-not", function (event, info) {
             if (info['preview_or_not'] == true) {
             $scope.generate(true);
             } else {
             $scope.generate(false);
             }
             }) */
            //end--------------------------------------------------------------------------------------------

            //保存公司信息  ::viewModel
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
                        $scope.variables.productivePower = res.data.company.productivePower || "";
                    }
                }, function () {
                    debugger;
                }, function () {
                    kzi.msg.success('公司变量信息保存成功！', function () {
                    })
                    $scope.company_info_is_save_ing = false;
                });
            }

            //改变状态
            $scope.changeTab = function (type) {
                $scope.forWho = type;
            }

            function f() {
                $timeout(function () {
                    if ($scope.viewProperty.content) {
                        var e = markdown_converter.makeHtml($scope.viewProperty.content),
                            t = sanitize(e);
                        $scope.html = t
                    }
                    _.isEmpty($scope.viewProperty.content) && ($scope.html = "")
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
                $scope.viewProperty.custom_template__content = map($scope.origin.content, mapVO);
                var str = $scope.origin.content;
                $scope.viewProperty.custom_template__content = map(str, mapVO);
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
                if (angular.isFunction($rootScope.need_login) && !$rootScope.need_login("/template/generator_new")) {
                    return
                }
                /************************将两个状态下保存模板需要的不同信息统一到一个地方里  **************************/
                if (!$scope.which_part) {
                    $scope.edit_template__title = $scope.viewProperty.title;
                    $scope.edit_template__content = $scope.viewProperty.content;
                }
                if (!!$scope.which_part) {
                    $scope.edit_template__title = $scope.viewProperty.custom_template__title;
                    $scope.edit_template__content = $scope.viewProperty.custom_template__content;
                }
                if (!$scope.edit_template__content || !$scope.edit_template__title) {
                    kzi.msg.warn("标题和正文不能为空", function () {
                    })
                }
                /*******************************END********************************************************** */
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
                            wt.data.template.add(projectsInfo.defaultPid, "01", $scope.autoTitle, "0100", "开发", "", "", $scope.$parent.edit_template__title, transBack($scope.$parent.edit_template__content), watchers,
                                function (res) {
                                    var templateId = res.data.template_id;
                                    if ($scope.isUsedMost == true) {
                                        wt.data.user.update_defualt_template(templateId, function (res) {
                                            $window.sessionStorage.defaultTemplate = res.data.defaultTemplate
                                        }, function () {
                                        }, function () {
                                        });
                                    }
                                    ;
                                    $scope.generateModalCtrl.$parent.switch_view(0);
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

            customer_info = {
                name: $scope.customer_variables.contact_name || '',
                company: $scope.customer_variables.company_name || '',
                email: $scope.customer_variables.email || '',
                phone: '',
                website: ''
            }
            var customerVariableMap = {}
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
                    {
                        reg: /\[\[活动邮箱\]\]/g,
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
                /**
                 * 如果不是通过点击活动详情发邮件进入这个页面的，点发邮件时就直接保存 :: 边界判断
                 */
                if (!$scope.routeParam_info.customer_id) {
                    wt.data.task.add(
                        projectsInfo.defaultPid,
                        customer_info,
                        function (res) {
                            $scope.edit_mail.watchers = $scope.edit_mail.watchers || []
                            $scope.edit_mail.watchers.push({'uid': ''});
                            $scope.edit_mail.tasks = $scope.edit_mail.tasks || []
                            $scope.edit_mail.tasks.push(res.data)
                            $scope.edit_mail.content = $scope.viewProperty.content;
                            $scope.edit_mail.template_id = '';
                            $scope.edit_mail.subject = $scope.viewProperty.title;
                            defered.resolve(res);
                        },
                        function () {

                        },
                        function () {
                            $scope.customer_is_save_ing = false;
                        }
                    )
                } else {
                    $scope.edit_mail.watchers = $scope.edit_mail.watchers || []
                    $scope.edit_mail.watchers.push({'uid': ''});
                    $scope.edit_mail.tasks = $scope.edit_mail.tasks || []
                    $scope.edit_mail.tasks.push(viewProperty.current_customer)
                    $scope.edit_mail.content = $scope.viewProperty.content;
                    $scope.edit_mail.template_id = '';
                    $scope.edit_mail.subject = $scope.viewProperty.title;
                    defered.resolve();
                }
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
                var content_str = generator.generate(_.clone(current_template_sequence.content), predicate);
                $scope.viewProperty.custom_template__content = map(map(content_str, customerVariableMap), mapVO);
                var title_str = generator.generateTitle(_.clone(current_template_sequence.title), predicate);
                $scope.viewProperty.custom_template__title = map(map(title_str, customerVariableMap), mapVO);
            }

            $scope.show_save_and_send_mail = function () {
                if ($scope.viewProperty.title && $scope.viewProperty.content) {
                    if (!$scope.viewProperty.mail.sender_info) {
                        kzi.msg.warn('请填写自己用以接受回复的邮箱地址');
                    }
                    $scope.js_save_mail().then(function () {
                        $rootScope.open_mail_prompt();
                    })
                    /**   $modal.open({
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
                     */
                } else {
                    kzi.msg.warn('邮件标题和正文不能为空！')
                }
            }
            /** 是否显示发邮件时的收件人列表 ---------------------------------------------------------------------------- */
            $scope.js_show_mail_list = function () {
                $scope.show_mail_list = !$scope.show_mail_list;
            }
            /**  -------------------------------------------------------------------------------------------------- */

            /** ----------------------发送邮件(整个页面的出口)----------------------------------------------------------*/
            $scope.js_save_mail = function () {

                $scope.edit_mail.content = $scope.viewProperty.content;
                $scope.edit_mail.tasks = $scope.edit_mail.tasks || [];
                $scope.edit_mail.subject = $scope.viewProperty.title;

                var deferred = new $q.defer();
                $scope.is_saving = !0;
                var watchers = _.pluck($scope.edit_mail.watchers, "uid");
                watchers = [];
                var task_ids = _.pluck($scope.edit_mail.tasks, "tid");
                var content = MdParse($scope.edit_mail.content);
                var from = viewProperty.mail.sender_info || ($scope.edit_mail.display_name + "<" + $scope.edit_mail.email + ">");
                var template_id = $scope.edit_mail.template_id;
                if (viewProperty.fromWhere == 'normal') {
                    wt.data.email.add(projectsInfo.defaultPid, $scope.edit_mail.subject,
                        content, watchers, task_ids, from, template_id, function (i) {
                            $scope.mails = $scope.mails || [];
                            angular.forEach(i.data, function (mail) {
                                $scope.mails.unshift(mail);
                            });
                            if($rootScope.global.is_outter){
                                $rootScope.$broadcast(kzi.constant.event_names.public_customer_send_mail_success,{mail_count:$scope.edit_mail.tasks.length});
                            };
                            deferred.resolve();
                            $scope.is_saving = !1;
                        }, function (res) {
                            kzi.msg.error("操作失败，请重新尝试");
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
                            hideMailBox()
                            //       $modal.open(modalInstanceOption);
                        })
                }
                if(viewProperty.fromWhere === 'groupBatchSend') {
                    wt.data.email.projectsBatchMailSending(
                        $scope.viewProperty.projectInfos,
                        {
                            subject: $scope.edit_mail.subject,
                            content: content,
                            from: from
                        }, function successFunc() {
                            $scope.mails = $scope.mails || [];
                            angular.forEach(i.data, function (mail) {
                                $scope.mails.unshift(mail);
                            });
                            deferred.resolve();
                            $scope.is_saving = !1;
                        }, function errorFunc() {
                            kzi.msg.error("操作失败，请重新尝试");
                        }, function thenFunc() {
                            hideMailBox()
                        })
                 }
                if (viewProperty.fromWhere === 'sendWithoutCustomer') {
                    var  mailAddressList = _.chain($scope.edit_mail.tasks).pluck('email').value();
                    wt.data.email.batchSendWithoutCustomer(projectsInfo.defaultPid, $scope.edit_mail.subject,
                        content, watchers, mailAddressList, from, template_id, function (i) {
                            $scope.mails = $scope.mails || [];
                            angular.forEach(i.data, function (mail) {
                                $scope.mails.unshift(mail);
                            });
                            deferred.resolve();
                            $scope.is_saving = !1;
                        }, function (res) {
                           kzi.msg.error("操作失败，请重新尝试");
                        }, function () {
                            hideMailBox()
                        })
                }
                return deferred.promise;
            }
            /** ----------------------------------------------------------------------------------------------------*/


            /** --------------------选择一个模板 --------------------------------------------------------------------*/
            $scope.viewProperty.use_this_template = function (template) {
                $scope.viewProperty.content = $scope.viewProperty.content = template.content;
                $scope.viewProperty.title = $scope.viewProperty.title = template.summary;
                $scope.viewProperty.current_template_id = template.template_id;
            }
            /** ---------------------------------------------------------------------------------------------------*/


            /** ----------------------设为默认 ---------------------------------------------------------------------*/
            $scope.viewProperty.js_set_as_default = function (template, withoutPrompt) {
                wt.data.user.update_defualt_template(template.template_id, function (res) {
                    if (!withoutPrompt) {
                        kzi.msg.success("设置成功", function () {
                        });
                    }
                    $scope.viewProperty.defaultTemplate = template.template_id;
                }, function () {
                }, function () {
                    $window.sessionStorage.defaultTemplate = template.template_id;
                });
            }
            /** ----------------------END -----------------------------------------------------------------------*/

            viewProperty.go_to_last_page = function () {
                $scope.which_part ? $scope.switch_view(0) : hideMailBox();
            }

            function hideMailBox() {
                $rootScope.global.show_mailbox = 0;
            }

            function getUsedMost() {
                if ($rootScope.global.is_login) {
                    wt.data.template.getUsedMost(function (res) {
                        viewProperty.templates = res.data;
                    })
                }
            }

            function setUsedMost(templateId) {
                if ($rootScope.global.is_login) {
                    wt.data.template.setUsedMost(templateId, function () {

                    })
                }
            }

            function getAlltemplate() {
                if ($rootScope.global.is_login) {
                    wt.data.template.getAll(function (res) {
                        viewProperty.templates = res.data;
                    })
                }
            }

            getUsedMost();
            $scope.btnClick = {
                setPersonalVar: function () {
                    viewProperty.previousStatus = viewProperty.currentStatus;
                    viewProperty.currentStatus = "personalVar";
                },
                setPersonalVarRtn: function () {
                    viewProperty.currentStatus = viewProperty.previousStatus;

                },
                lazyMode: function () {
                    viewProperty.currentStatus = "default";
                    viewProperty.currentRootTemplate = "default";
                },
                selfMode: function () {
                    viewProperty.currentRootTemplate = "forMe";
                },
                wantPrecise: function () {
                    if ($scope.newGenerator.forWho !== "forCustomer" && viewProperty.currentStatus !== "advanced" && viewProperty.currentRootTemplate !== "advanced") {
                        $scope.newGenerator.changeTab("forCustomer");
                        viewProperty.currentStatus = "advanced";
                        viewProperty.currentRootTemplate = "advanced";
                    }
                },
                wantQuick: function () {
                    if ($scope.newGenerator.forWho !== "forMe" && viewProperty.currentStatus != "default" && viewProperty.currentRootTemplate != "default") {
                        $scope.newGenerator.changeTab("forMe");
                        viewProperty.currentStatus = "default";
                        viewProperty.currentRootTemplate = "default";
                    }
                }
            }
            /**
             * 工具函数
             * 带上数据打开预览modal的开关
             * eg.
             * trigger_preview().with([info-data])
             * those signals will flow to a point in the service named 'mail_preview'
             */
            $scope.sending_mail__trigger_preview = function () {
                return {
                    with_info: function (info) {
                        $rootScope.$broadcast('mailPreview.info_is_ready', {
                            mail_info: info.mail,
                            groupSend: (info.mail.position_info.tasks_max_sequence_num > 0) || false,
                            has_next: (info.mail.position_info.tasks_max_sequence_num > info.mail.position_info.current) || false,
                            has_previous: ( info.mail.position_info.current > 0) || false
                        });
                    }
                }
            }

            $rootScope.$$listeners["new-editor-preview-or-not"] = [];

            $rootScope.$on("new-editor-preview-or-not", function (e, i) {
                if (i.preview_or_not && i.in_modal_or_not) {
                    var content = !$scope.which_part ? $scope.viewProperty.content : $scope.viewProperty.custom_template__content,
                        title = !$scope.which_part ? $scope.viewProperty.title : $scope.viewProperty.custom_template__title;
                    $scope.sending_mail__trigger_preview().with_info({
                        mail: {
                            sender_info: viewProperty.mail.sender_info,
                            recipient_info: viewProperty.mail.recipient_info,
                            content_info: content
                                .replace(new RegExp(/\[\[收件人\]\]/), (customer.name || "Sir & Madam"))
                                .replace(new RegExp(/\[收件人\]/), (customer.name || "Sir & Madam")),
                            title_info: title
                                .replace(new RegExp(/\[\[收件人\]\]/), (customer.name || "Sir & Madam"))
                                .replace(new RegExp(/\[收件人\]/), (customer.name || "Sir & Madam")),
                            position_info: viewProperty.mail.position_info
                        }
                    });
                }
            })
            /**
             * 当被要求下一篇或者上一篇的信息时，重新组装信息发送给浮窗。
             */
            $rootScope.$$listeners["mailPreview.content_prev_or_next"] = [];

            $rootScope.$on("mailPreview.content_prev_or_next", function (e, i) {
                var customer;
                if (i.prev === true) {
                    customer = $scope.edit_mail.tasks[--viewProperty.mail.position_info.current];
                } else {
                    customer = $scope.edit_mail.tasks[++viewProperty.mail.position_info.current];
                }
                viewProperty.mail.recipient_info = customer.name +
                    (customer.email ? ['<', customer.email, '>'].join('') : '');
                $scope.sending_mail__trigger_preview().with_info({
                    mail: {
                        sender_info: viewProperty.mail.sender_info,
                        recipient_info: viewProperty.mail.recipient_info,
                        content_info: $scope.viewProperty.content
                            .replace(new RegExp(/\[\[收件人\]\]/), (customer.name || "Sir & Madam"))
                            .replace(new RegExp(/\[收件人\]/), (customer.name || "Sir & Madam"))
                            .replace(new RegExp(/\[\[联系人\]\]/), (customer.name || "Sir & Madam")),
                        title_info: $scope.viewProperty.title
                            .replace(new RegExp(/\[\[收件人\]\]/), (customer.name || "Sir & Madam"))
                            .replace(new RegExp(/\[收件人\]/), (customer.name || "Sir & Madam"))
                            .replace(new RegExp(/\[\[联系人\]\]/), (customer.name || "Sir & Madam")),
                        position_info: viewProperty.mail.position_info
                    }
                })
            })
            /*------------------------------------------------------------------------*/
            /**
             * add the template to template list  after user saving a new template
             */

            $scope.$$listeners["send_mail_page__add_new_template_success"] = [];

            $scope.$on("send_mail_page__add_new_template_success", function (e, i) {
                i.new_template && viewProperty.templates.unshift(i.new_template);
            })

            $scope.which_part = false;
            $scope.switch_view = function (num) {
                $scope.which_part = num ? true : false;
            }

            /**
             * 清空模板内容
             */
            $scope.viewProperty.clear_template = function () {
                $scope.viewProperty.custom_template__content = "";
                $scope.viewProperty.custom_template__title = "";
            };

            /**
             * 浮窗状态中,页面的入口，触发的trigger
             */
                //保证只有一个接收器
            $rootScope.$$listeners[kzi.constant.event_names.mail_box_show] = [];

            $rootScope.$on(kzi.constant.event_names.mail_box_show, function (e, i) {
                //从窗口偷翻进来的
                if (i.from === "groupBatchSend" && i.projectInfos) {
                    var pid = i.projectInfos[0].pid ? i.projectInfos[0].pid : (console.error("没有pid能够用"), void 0);
                    var queryCondition = {
                        type: 0,
                        currentPage: 1,
                        itemsPerPage: 20,
                        isDESC: 1,
                        sortKey: ''
                    }
                    $scope.viewProperty.projectInfos = i.projectInfos;
                    $scope.viewProperty.fromWhere = 'groupBatchSend';
                    /*服务器给我这个组的活动的数目吧，另外再带上20个活动回来。然后把这20个活动放到i.tasks里边，假装是从门口进来的*/
                    wt.data.task.get_for_private(
                        null,//team_id,暂时没有用
                        pid,//pid
                        queryCondition.type,
                        queryCondition.currentPage,
                        queryCondition.itemsPerPage,
                        queryCondition.isDESC,
                        queryCondition.sortKey, //
                        function (response) {
                            if(response.data.length==0){
                                kzi.msg.error('没有找到该组内的活动信息!');
                            }
                            viewProperty.totalItems = response.totalItems;
                            i.tasks = response.data;
                            $scope.edit_mail.tasks = i.tasks || [];
                            viewProperty.mail.position_info.tasks_max_sequence_num = $scope.edit_mail.tasks.length - 1 || 0;
                            viewProperty.mail.recipient_info = $scope.edit_mail.tasks[0].name + "<" + $scope.edit_mail.tasks[0].email + ">";
                        },
                        function () {
                        },
                        function () {
                            $scope.part_loading_done = true;
                        }
                    );
                } else if (i.from === "sendWithoutCustomer" && i.mailAddressList) {
                    $scope.edit_mail.tasks = _
                        .chain(i.mailAddressList)
                        .map(function (i) {
                            return  {
                                name: "",
                                email: i
                            }
                        }).value() || [];
                    $scope.viewProperty.fromWhere = 'sendWithoutCustomer';
                    viewProperty.totalItems = $scope.edit_mail.tasks.length;
                    viewProperty.mail.position_info.tasks_max_sequence_num = $scope.edit_mail.tasks.length - 1 || 0;
                    viewProperty.mail.recipient_info = $scope.edit_mail.tasks[0].name + "<" + $scope.edit_mail.tasks[0].email + ">";
                } else {
                    $scope.edit_mail.tasks = i.tasks || [];
                    viewProperty.mail.position_info.tasks_max_sequence_num = $scope.edit_mail.tasks.length - 1 || 0;
                    viewProperty.mail.recipient_info = $scope.edit_mail.tasks[0].name + "<" + $scope.edit_mail.tasks[0].email + ">";
                }
                if (i.template) {
                    $scope.edit_mail.content = i.template.content;
                    $scope.edit_mail.template_id = i.template.template_id;

                    $scope.viewProperty.current_template_id = i.template.template_id;
                } else {
                    var template_id = $window.sessionStorage.defaultTemplate || "";
                    $scope.viewProperty.defaultTemplate = template_id;
                    $scope.viewProperty.current_template_id = template_id;
                    if (template_id) {
                        wt.data.template.get("", template_id,
                            function (res) {
                                if (res.data) {
                                    $scope.viewProperty.title = res.data.summary;
                                    $scope.viewProperty.content = res.data.content;
                                    $scope.edit_mail.template_id = template_id;
                                }
                            }, function error() {
                            },
                            function then() {
                            });
                    }
                }
            });
        }
    ])