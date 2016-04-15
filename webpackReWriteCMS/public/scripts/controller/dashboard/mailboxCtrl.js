/**
 * Created by wuyunge on 2014/10/2.
 */
"use strict";
innerApp.controller('mail_box_ctrl', [
    "$rootScope", "$scope", "$routeParams", "$popbox",
    "$timeout", "$location", "MdParse", "editorPreview",
    "$window", "templateNewGeneratorInfo", "$modal", "$http", "projectsInfo", "$q",
    function ($rootScope, $scope, $routeParams, $popbox, $timeout, $location, MdParse, editorPreview, $window, templateGeneratorInfo, $modal, $http, projectsInfo, $q) {
        $rootScope.global.right_sidebar_show_part = 0,
            $rootScope.global.right_sidebar_is_fold = true,
            $scope.show_add_mail = 0;
        $rootScope.isPreviewed = false;
        $rootScope.global.title = '发邮件',
            $rootScope.global.loading_done = true,
            $scope.selectAll = false;
        $scope.editorPreview = editorPreview;

        var o = $routeParams.pid,
            r = 0;
        $scope.current_tab = 0;
        $scope.show_mail_list = false;


//        $rootScope.global.right_sidebar_show_part = 1;
//        $rootScope.global.right_sidebar_is_fold = 0;


        var u = $rootScope.global.me;

        $rootScope.global.loading_done = true,

            $scope.edit_mail = {
                subject: "",
                content: "",
                tasks: [],
                watchers: [u],
                display_name: $rootScope.global.me && ($rootScope.global.me.display_name || $rootScope.global.me.name || ""),
                email: $rootScope.global.me && ($window.sessionStorage.reply_email || $window.sessionStorage.email || "")
            };
        $scope.js_show_mail_list = function () {
            $scope.show_mail_list = !$scope.show_mail_list;
        };
        $scope.clear = function () {
            $rootScope.global.right_sidebar_is_fold = true;
            $rootScope.global.right_sidebar_show_part = 0;
            $rootScope.selectedMails.length = 0;
            $scope.edit_mail.tasks = [];
            _.each($scope.mails, function (mail) {
                mail.checked = false;
                var i = _.findWhere($rootScope.selectedMails, {
                    mail_id: mail.mail_id
                });
                i && ($rootScope.selectedMails = _.reject($rootScope.selectedMails, function (t) {
                    return t.mail_id === mail.mail_id
                }))
            })
        };

        $scope.js_show_add_mail = function () {
            $scope.show_add_mail = !$scope.show_add_mail;
            $rootScope.global.right_sidebar_is_fold = $scope.show_add_mail;
            if ($scope.show_add_mail) {
                $rootScope.global.right_sidebar_show_part = 1;
                $rootScope.global.right_sidebar_is_fold = false;
            }
            else {
                $scope.clear();
            }
            ;

            $rootScope.global.right_sidebar_is_fold ?
                kzi.localData.set("right_sidebar_is_fold", 1) :
                kzi.localData.set("right_sidebar_is_fold", 0);
        };
        $scope.js_watch_all = function (i, e) {
            wt.bus.mail.watch_alltask_members(i, e, o, function () {
            }, null, function () {
            });
        };

        $scope.js_remove_selected = function (selected, all) {
            var mids = [];
            _.each(selected, function (mail) {
                mids.push(mail.mail_id);
            });
            wt.data.mail.batch_delete(mids, function () {
            }, null, function () {
            });
        };

        $scope.toggleAll = function (mails) {
            $scope.selectAll = !$scope.selectAll;
            if ($scope.selectAll) {
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.global.right_sidebar_show_part = 2;
                _.each(mails, function (mail) {
                    var o = _.findWhere($rootScope.selectedMails, {
                        mail_id: mail.mail_id
                    });
                    o || $rootScope.selectedMails.push(mail);
                    mail.checked = true;
                })
            } else {
                $scope.clear();
            }
        };

        $scope.toggle = function (e) {
            e.checked = !e.checked;
            if (e.checked) {
                $rootScope.global.right_sidebar_is_fold = false;
                $rootScope.global.right_sidebar_show_part = 2;
                $rootScope.selectedMails.push(e)
            } else {
                var i = _.findWhere($rootScope.selectedMails, {
                    mail_id: e.mail_id
                });
                i && ($rootScope.selectedMails = _.reject($rootScope.selectedMails, function (t) {
                    return t.mail_id === e.mail_id
                }));
                $scope.selectAll = false;
                if ($rootScope.selectedMails.length == 0) {
                    $scope.clear();
                }
            }
        };

        $scope.js_toggle_template = function (e, es) {
            $scope.current_select_template = e;
            e.checked = !e.checked;
            reGet();
            reGetCustomerVariableMap();
            $scope.edit_mail.subject = map(map(e.summary, customerVariableMap), mapVO);
            $scope.edit_mail.content = map(map(e.content, customerVariableMap), mapVO);
            $scope.edit_mail.template_id = e.template_id;
            es && es.length > 0 && _.each(es, function (t) {
                if (t.template_id != e.template_id)
                    t.checked = false;
            })
        };


        $scope.js_cancel_edit_mail = function () {
            $scope.global.right_sidebar_is_fold = true;
            $scope.show_add_mail = !1;
            $scope.edit_mail.subject = "",
                $scope.edit_mail.content = "",
                $rootScope.global.show_mailbox = 0;
            $scope.edit_mail.watchers = [u], $scope.clear();
        };

        $scope.js_show_template = function () {
            $scope.template = wt.bus.mail.getTemplate({mainCatalogCode: "0010", page: "1"});
        };

        $scope.js_change_tab = function (e) {
            if ($scope.current_tab !== e) switch ($scope.current_tab = e, r = 0, $scope.mails = [], d(), e) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    ;
            }
        };

        $scope.js_toggle_member = function (e) {
            wt.bus.mail.toggle_watcher_member(e, $scope.edit_mail, o);
        };

        $scope.js_toggle_task = function (e) {
            angular.isUndefined(e.watched)
            wt.bus.mail.toggle_task_member(e, $scope.edit_mail, o);
        };
        //发送邮件
        $scope.js_save_mail = function (mail_form) {
            $scope.is_saving = !0;
            var n = _.pluck($scope.edit_mail.watchers, "uid");
            var m = _.pluck($scope.edit_mail.tasks, "tid");
            var content = MdParse($scope.edit_mail.content);
            var from = $scope.edit_mail.display_name + "<" + $scope.edit_mail.email + ">";
            var template_id = $scope.edit_mail.template_id;
            wt.data.email.add(o, $scope.edit_mail.subject, content, n, m, from, template_id, function (i) {
                $scope.mails = $scope.mails || [];
                angular.forEach(i.data, function (mail) {
                    $scope.mails.unshift(mail);
                });
                $scope.is_saving = !1;
                // 2 === $scope.current_tab ? n.indexOf($rootScope.global.me.uid) >= 0 && $scope.mails.unshift(i.data) : $scope.mails.unshift(i.data)
            }, function (res) {
            }, function () {
                $scope.js_cancel_edit_mail();
                $rootScope.open_mail_prompt($scope.mails);
            });
        };
        $scope.js_slide_change = function (e) {
            e ? $scope.show_add_mail_empty = !!e : $timeout(function () {
                $scope.show_add_mail_empty = !!e
            }, 400)
        },

            $rootScope.$on('wtMailboxTriggerSuccess', function (e, v) {
                if (v == true) {
                    $timeout(function () {
                        $scope.js_show_add_mail();
                    }, 0);
                } else {
                    $scope.clear();
                    $scope.edit_mail = {};
                }
            });
        $rootScope.$on(kzi.constant.event_names.mail_box_show, function (e, i) {
            $scope.edit_mail.tasks = i.tasks || [];
            $scope.current_select_task = i.tasks[0];
            if ($scope.current_select_task) {
                $scope.customer_variables = {
                    company_name: $scope.current_select_task.company,
                    contact_name: $scope.current_select_task.name,
                    email: $scope.current_select_task.email,
                    products: $scope.current_select_task.products,
                    type: '',
                    feature: '',
                    country: $scope.current_select_task.countryCnName || ''
                }
                reGetCustomerVariableMap();
            }
            if (i.template) {
                $scope.edit_mail.content = i.template.content;
                $scope.edit_mail.template_id = i.template.template_id;
            } else {
                var template_id = $window.sessionStorage.defaultTemplate || "";
                if (template_id) {
                    wt.data.template.get("", template_id,
                        function (res) {
                            if (res.data) {
                                $scope.edit_mail.subject = res.data.summary;
                                $scope.edit_mail.content = res.data.content;
                                $scope.edit_mail.template_id = template_id;
                            }
                        }, function error() {
                        },
                        function then() {
                        });
                }
            }
        });
        /*
         开发信生成器部分
         */

//        $scope.edit_mail = $scope.edit_mail;

        //开发信变量设置
        $scope.newTemplate = {
            tabs: {
                current_tab: 'writeByMyself'
            }
        };

        $scope.forWho = 'forMe';
        $scope.changeTab = function (type) {
            $scope.forWho = type;
        }
        $scope.newGenerator = $scope;

        $scope.newTemplate.changeTab = function (type) {
            if ($scope.newTemplate.tabs.current_tab == type) {
                return 0;
            }
            $scope.newTemplate.wantToShare = false
            $scope.newTemplate.tabs.current_tab = type;
            if (type == 'writeByGenerator') {
                /* 若有已选模板,则将它清空 */
                if ($scope.current_select_template) {
                    $scope.current_select_template.checked = !$scope.current_select_template.checked;
                }
                $scope.js_template_get_one();
            } else {
                $scope.edit_mail.content = '';
                $scope.edit_mail.subject = "";
                $scope.edit_mail.original_content = '';
                $scope.edit_mail.original_subject = "";
            }
        };

        $scope.variables = {
            customer_now: '',
            create_time: '',
            company_name: '',
            inspection_certificate: '',
            product_certification: '',
            company_products: '',
            QS: ''
        }
        getCompanyInfo();
        function getCompanyInfo() {
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
                    $rootScope.global.loading_done = true;
                    $scope.part_loading_done = true;
                })
            }
        }

        var company_info;

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

        $scope.is_save_ing = false;
        $scope.save_company_info = function (fn) {
            if (!$scope.variables.company_name || !$scope.variables.company_products) {
                return 0;
            }
            reGetBeforeSaveCompanyInfo();
            $scope.is_save_ing = true;
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
                $scope.is_save_ing = false;
                kzi.msg.success("成功保存公司变量信息!", function () {
                });
                angular.isFunction(fn) && fn.call();
            });
        }
        $scope.js_template_get_one = function () {
            reGet();
            reSetSequence();
            var isCompanyInfoAllEmpty = !$scope.variables.company_products || !$scope.variables.company_name;
            if (isCompanyInfoAllEmpty) {
                $scope.edit_mail.content = templateGeneratorInfo.generate(current_template_sequence.content);
                $scope.edit_mail.subject = templateGeneratorInfo.generateTitle(current_template_sequence.title);
                $scope.edit_mail.original_content = $scope.edit_mail.content;
                $scope.edit_mail.original_subject = $scope.edit_mail.subject;
            } else {
                setContentAndTitle();
            }
        }

        //当前文本和标题对应的序列
        var current_template_sequence;

        function reSetSequence() {
            current_template_sequence = {
                content: [],
                title: []
            }
        }

        function setContentAndTitle() {
            reGet();
            reSetSequence();
            var invalidate = _.chain(mapVO).filter(function (obj) {
                return obj.text === ''
            }).map(function (obj) {
                return obj.reg
            }).value() || [];
            var str = templateGeneratorInfo.generate(current_template_sequence.content, function (item) {
                return _.chain(invalidate).reduce(function (mem, reg) {
                    return mem || reg.test(item);
                }, false).value()
            });
            $scope.edit_mail.original_content = map(str, mapVO);
            $scope.edit_mail.content = map($scope.edit_mail.original_content, customerVariableMap);
            $scope.edit_mail.original_subject = map(templateGeneratorInfo.generateTitle(current_template_sequence.title), mapVO);
            $scope.edit_mail.subject = map($scope.edit_mail.original_subject, customerVariableMap);
        }

        var mapVO = [];

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

        var company_info = {

        }

        // str -> map -> str
        function mapWithVar(str, map) {
            str = str || '';
            if (map.text !== '') {
                str = str.replace(map.reg, map.text);
            }
            return str;
        }

        function transBack(str) {
            str = str || '';
            str = str.replace(/`/g, '');
            return str;
        }

        function map(str, maps) {
            for (var i = 0, l = maps.length; i < l; i++) {
                str = mapWithVar(str, maps[i]);
            }
            return str;
        }

        //获取模板类别
        $http.get('/json/templateCatalog.json').success(function (response) {
            $scope.catalogs = response.data;
        });
        //获取模板类别结束

        $scope.js_save_template = function (catalog, thenFn, setAsDefaultAndThen) {
            if (_.isEmpty($scope.edit_mail.subject)) {
                kzi.msg.error("请输入模板名称");
            }
            else if (_.isEmpty($scope.edit_mail.summary)) {
                kzi.msg.error("请输入模板标题");
            }
            else if (_.isEmpty($scope.edit_mail.content)) {
                kzi.msg.error("请输入模板内容");
            }
            else {
                $scope.is_saving = !0;
                var n = _.pluck($scope.edit_mail.watchers, "uid");
                $scope.edit_mail.mainCatalogCode = catalog.code;
                $scope.edit_mail.mainCatalogCnName = catalog.cnName;
                wt.data.template.add(projectsInfo.defaultPid, $scope.edit_mail.f_type, $scope.edit_mail.name, $scope.edit_mail.mainCatalogCode, $scope.edit_mail.mainCatalogCnName, $scope.edit_mail.subCatalogCode, $scope.edit_mail.subCatalogCnName, $scope.edit_mail.summary, $scope.edit_mail.content, n,
                    function (i) {
                        $scope.templates.unshift(i.data);
                        $scope.edit_mail.content = i.data.content;
                        $scope.rtnTemplate = i.data;
                        angular.isFunction(thenFn) && thenFn.call();
                        angular.isFunction(setAsDefaultAndThen) && setAsDefaultAndThen.call(null, $scope.rtnTemplate);
                    }, null, function () {
                        $scope.is_saving = !1
                        /*  $scope.tabSwitch(1); */
                    });
            }
        };

//        $scope.setVarBtnSelected = false;
        $scope.js_set_template_variables = function () {
            getCompanyInfo();
            $modal.open({
                scope: $scope,
                templateUrl: '/view/modal/pop_template_generator_variables.html',
                controller: ['$scope', '$modalInstance', function (scope, $modalInstance) {
                    scope.outterScope = scope.$parent;
                    scope.close = function () {
                        $modalInstance.close();
                    }
                    scope.submit = function () {
                        scope.outterScope.save_company_info(scope.close);
                    }
                }]
            })
        }

        $scope.show_save_template = function () {
            $modal.open({
                scope: $scope,
                templateUrl: '/view/modal/pop_and_complete_generator.html',
                controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.outterScope = $scope.$parent;
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
                        wt.data.template.add(projectsInfo.defaultPid, "01", $scope.autoTitle, "0100", "开发", "", "", $scope.outterScope.edit_mail.subject, $scope.outterScope.edit_mail.content, watchers,
                            function (res) {
                                var templateId = res.data.template_id;
                                if ($scope.isUsedMost == true) {
                                    wt.data.user.update_defualt_template(templateId, function (res) {
                                        $window.sessionStorage.defaultTemplate = res.data.defaultTemplate;
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
                                    scope: $scope.outterScope,
                                    templateUrl: '/view/modal/pop_and_complete_generator_at_mailbox.html',
                                    controller: ['$scope', '$modalInstance', function (scope, $modalInstance) {
                                        scope.outterScope = scope.$parent;
                                        scope.modalCtrl = scope;
                                        scope.close = function () {
                                            $modalInstance.close()
                                        }
                                        scope.has_been_ok = function () {
                                            $modalInstance.close()
                                        }
                                    }]
                                })
                            });
                    };

                }]
            })
        };

        $scope.js_set_as_default = function (template, withoutPrompt) {
            wt.data.user.update_defualt_template(template.template_id, function (res) {
                if (!withoutPrompt) {
                    kzi.msg.success("设置成功", function () {
                    });
                }
                $scope.defaultTemplate = template.template_id;
            }, function () {
            }, function () {
                $window.sessionStorage.defaultTemplate = template.template_id;
            });
        }

        var customer_info = {};
        /**
         * the customer variables in view-model
         */
        $scope.customer_variables = {
            company_name: '',
            contact_name: '',
            email: '',
            products: '',
            type: '',
            feature: '',
            country: ''
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

        /**
         * 更改活动信息的函数
         */
        function update_customer(task) {
            var pid = task.pid;
            var task_id = task.tid;
            var task_obj = {
                temp_name: $scope.customer_variables.contact_name || task.name,
                temp_address: task.address,
                temp_company: $scope.customer_variables.company_name || task.company,
                temp_email: $scope.customer_variables.email || task.email,
                temp_position: task.position,
                temp_website: task.website,
                temp_products: $scope.customer_variables.products || task.products,
                temp_mainIndustryCode: task.mainIndustryCode,
                temp_mainIndustryCnName: task.mainIndustryCnName,
                temp_subIndustryCode: task.subIndustryCode,
                temp_subIndustryCnName: task.subIndustryCnName,
                temp_zoneCode: task.zoneCode,
                temp_zoneCnName: task.zoneCnName,
                temp_countryCode: task.countryCode,
                temp_countryCnName: $scope.customer_variables.country || task.countryCnName,
                temp_mobile: task.mobile,
                temp_phone: task.phone,
                temp_fax: task.fax,
                temp_msn: task.msn,
                temp_facebook: task.facebook,
                temp_skype: task.skype,
                temp_linkedin: task.linkedin,
                temp_qq: task.qq,
                temp_weixin: task.weixin,
                temp_desc: task.desc
            }
            var defer = new $q.defer();
            wt.data.task.update(pid, task_id, task_obj,
                function success(res) {
                    defer.resolve(res);
                },
                function error(res) {
                },
                function then(res) {

                }
            );
            return defer.promise;
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

        //当定制活动信息的确定被触发后，更改活动信息，更改收件人信息，活动信息映射到模板信息
        $scope.custom_customer_info_click = function () {
            /**
             * 更改当前选择的活动信息
             */
            _.extend($scope.current_select_task, {
                company: $scope.customer_variables.company_name || '',
                name: $scope.customer_variables.contact_name || '',
                email: $scope.customer_variables.email || ''
            })
            /**
             * 映射到模板信息
             */
            reGet();
            reGetCustomerVariableMap();
            kzi.msg.success("活动变量信息已关联到开发信~", function () {
            })
            mapContentAndTitle();
        }
        /**
         * map variables to content and title
         */

        function mapContentAndTitle() {
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
            $scope.edit_mail.content = map(map(content_str, customerVariableMap), mapVO);
            var title_str = templateGeneratorInfo.generateTitleWithArray(_.clone(current_template_sequence.title), predicate);
            $scope.edit_mail.subject = map(map(title_str, customerVariableMap), mapVO);
        }

        /**
         * 发送邮件
         */
        $scope.send_mail_btn_click = function () {
            /**
             * 更改活动信息
             * 目前只支持单发，因此用下标0取得数组中唯一的活动
             */
            var promise = update_customer($scope.current_select_task);
            /**
             * 保存成功后，更改收件人信息，发送邮件
             */
            promise.then(function (res) {
                _.extend($scope.current_select_task, res.data);
            })
            $scope.js_save_mail();
        }


        $scope.save_customer_info = function (thenFn) {
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
            wt.data.task.add(
                projectsInfo.defaultPid,
                customer_info,
                function (res) {
                    $scope.edit_mail.watchers = $scope.edit_mail.watchers || []
                    $scope.edit_mail.watchers.push({'uid': ''});
                    $scope.edit_mail.tasks = $scope.edit_mail.tasks || []
                    $scope.edit_mail.tasks.push(res.data)
                    $scope.edit_mail.display_name = res.data.name;
                    $scope.edit_mail.email = res.data.email;
                    $scope.edit_mail.template_id = '';
                    $scope.edit_mail.subject = $scope.title;
                },
                function () {

                },
                function () {
                    kzi.msg.success("保存成功！");
                    $scope.customer_is_save_ing = false;
                    angular.isFunction(thenFn) && thenFn.call(this)
                }
            )
        }
    }])
;
