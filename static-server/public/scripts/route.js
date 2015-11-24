"use strict";
innerApp.config(["$routeProvider", "$locationProvider",
    function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.when("/customer/vcard", {
            templateUrl: "/view/customer_vcard.html",
            header_menu: "vcard",
            need_load: false,
            is_outter: false
        }).when("/program/import", {
            templateUrl: "/view/programImport.html",
            header_menu: "import",
            need_load: false,
            is_outter: false
        }).when("/guide", {
            templateUrl: "/view/home/support/guide.html",
            controller: "home_guide_ctrl",
            header_menu: "help",
            need_load: false,
            is_outter: true
        }).when("/guide/:column", {
            templateUrl: "/view/home/support/guide.html",
            controller: "home_guide_ctrl",
            header_menu: "help",
            need_load: false,
            is_outter: true
        }).when("/guide/:column/:permalink", {
            templateUrl: "/view/home/support/guide.html",
            controller: "home_guide_ctrl",
            header_menu: "help",
            need_load: false,
            is_outter: true
        }).when("/nonprofit/apply", {
            templateUrl: "/view/team/free_apply.html",
            controller: "free_apply_ctrl",
            header_menu: "",
            need_load: true
        }).when("/share", {
            templateUrl: "/view/user/share.html",
            controller: "home_share_ctrl",
            header_menu: "",
            need_load: false
        }).when("/help", {
            templateUrl: "/view/user/help.html",
            controller: "home_help_ctrl",
            header_menu: "",
            need_load: false
        }).when("/project/add", {
            templateUrl: "/view/project/project_add.html",
            controller: "project_add_ctrl",
            header_menu: "dashboard",
            need_load: true
        }).when("/project/:pid", {
            templateUrl: "/view/project/task/project_tasks.html",
            controller: "project_tasks_ctrl",
            header_menu: "project",
            project_iconmenu: "task",
            need_load: true
        }).when("/project/:pid/notfound", {
            templateUrl: "/view/project/prj_not_found.html",
            controller: "project_notfound_ctrl",
            header_menu: "dashboard",
            need_load: false
        }).when("/project/:pid/task", {
            templateUrl: "/view/project/task/project_tasks.html",
            controller: "project_tasks_ctrl",
            header_menu: "project",
            project_iconmenu: "task",
            need_load: true
        }).when("/project/:pid/develop", {
            templateUrl: "/view/project/task/project_develop_tasks.html",
            controller: "task_list_ctrl",
            header_menu: "project",
            project_iconmenu: "develop",
            need_load: true
        }).when("/project/:pid/post", {
            templateUrl: "/view/project/post/project_posts.html",
//            controller: "project_post_ctrl",
//            templateUrl: "/view/dashboard/posts",
            controller: "myPost_ctrl",
            header_menu: "project",
            project_iconmenu: "post",
            need_load: true
        }).when("/project/:pid/mail", {
            templateUrl: "/view/project/mail/project_mails.html",
            controller: "project_mail_ctrl",
            header_menu: "project",
            project_iconmenu: "mail",
            need_load: true
        }).when("/mail", {
            templateUrl: "/view/dashboard/mails2.html",
            controller: "common_mail_ctrl",
            header_menu: "mail",
            need_load: true
        }).when("/project/:pid/template", {
            templateUrl: "/view/project/template/project_templates.html",
            controller: "project_template_ctrl",
            header_menu: "project",
            project_iconmenu: "template",
            need_load: true
        }).when("/project/:pid/chat", {
            templateUrl: "/view/project/chat/project_chats.html",
            controller: "project_chats_ctrl",
            header_menu: "project",
            project_iconmenu: "chat",
            need_load: true
        }).when("/project/:pid/file", {
            templateUrl: "/view/project/file/project_files.html",
            controller: "project_file_list_ctrl",
            header_menu: "project",
            project_iconmenu: "file",
            need_load: true
        }).when("/project/:pid/folder/:folder_id", {
            templateUrl: "/view/project/file/project_files.html",
            controller: "project_file_list_ctrl",
            header_menu: "project",
            project_iconmenu: "file",
            need_load: true
        }).when("/project/:pid/page", {
            templateUrl: "/view/project/page/project_pages.html",
            controller: "project_page_ctrl",
            header_menu: "project",
            project_iconmenu: "page",
            need_load: true
        }).when("/project/:pid/page/add", {
            templateUrl: "/view/project/page/add_or_edit_page.html",
            controller: "project_page_add_edit_ctrl",
            header_menu: "project",
            project_iconmenu: "page",
            need_load: true
        }).when("/project/:pid/page/add/:parent_page_id", {
            templateUrl: "/view/project/page/add_or_edit_page.html",
            controller: "project_page_add_edit_ctrl",
            header_menu: "project",
            project_iconmenu: "page",
            need_load: true
        }).when("/project/:pid/page/:page_id/edit", {
            templateUrl: "/view/project/page/add_or_edit_page.html",
            controller: "project_page_add_edit_ctrl",
            header_menu: "project",
            project_iconmenu: "page",
            need_load: true
        }).when("/project/:pid/event", {
            templateUrl: "/view/project/event/project_events.html",
            controller: "project_event_ctrl",
            header_menu: "project",
            project_iconmenu: "event",
            need_load: true
        }).when("/project/:pid/graph", {
            templateUrl: "/view/project/graph/project_graphs.html",
            controller: "project_graph_ctrl",
            header_menu: "project",
            project_iconmenu: "graph",
            need_load: true
        }).when("/project/:pid/activity", {
            templateUrl: "/view/activity/project_activities.html",
            controller: "project_activity_ctrl",
            header_menu: "project",
            project_iconmenu: "graph",
            need_load: true
        }).when("/project/:pid/trash", {
            templateUrl: "/view/project/trash/project_trash.html",
            controller: "project_trash_ctrl",
            header_menu: "project",
            project_iconmenu: "trash",
            need_load: true
        }).when("/project/:pid/setting", {
            templateUrl: "/view/project/setting/project_setting.html",
            controller: "project_setting_ctrl",
            header_menu: "project",
            project_iconmenu: "setting",
            need_load: true
        }).when("/project/:pid/archive", {
            templateUrl: "/view/project/task/project_archive_tasks.html",
            controller: "project_archive_ctrl",
            header_menu: "project",
            project_iconmenu: "task",
            need_load: true
        }).when("/projects/archive", {
            templateUrl: "/view/dashboard/projects_archive.html",
            controller: "projects_archive_ctrl",
            header_menu: "project",
            project_iconmenu: "task",
            need_load: true
//        }).when("/projects", {
//            templateUrl: "/view/dashboard/projects.html",
//            controller: "projects_ctrl",
//            header_menu: "projects",
//            need_load: true 
        }).when("/projects", {
            templateUrl: "/view/dashboard/project/projects.html",
            controller: "new_projects_ctrl",
            header_menu: "new_projects",
            need_load: true
        }).when("/public", {
            templateUrl: "/view/public/public_tasks.html",
            controller: "browse_task_ctrl",
            header_menu: "public",
            need_load: !0
        }).when("/kdd", {
            templateUrl: "/view/dashboard/dashboard.html",
            controller: "dashboard_ctrl",
            header_menu: "dashboard",
            need_load: true
            //}).when("/dashboard", {
            //    templateUrl: "/view/dashboard/dashboard.html",
            //    controller: "dashboard_ctrl",
            //    header_menu: "dashboard",
            //    need_load: true
        }).when("/dashboard", {
            templateUrl: "/view/dashboard/statistics.html",
            controller: "statistics_ctrl",
            header_menu: "dashboard",
            need_load: true
        }).when("/feed", {
            templateUrl: "/view/dashboard/feed.html",
            controller: "feed_all_ctrl",
            need_load: true
        }).when("/calendar", {
            templateUrl: "/view/dashboard/calendar_Jan_20th.html",
            controller: "calendar_ctrl_Jan_20th",
            header_menu: "calendar",
            need_load: true
        }).when("/browse", {
            templateUrl: "/view/browse/browse_tasks.html",
            controller: "browse_task_ctrl",
            header_menu: "browse",
            need_load: true
        }).when("/browse/mails", {
            templateUrl: "/view/browse/browse_mails.html",
            controller: "browse_mail_ctrl",
            header_menu: "browse",
            need_load: true
        }).when("/browse/files", {
            templateUrl: "/view/browse/browse_files.html",
            controller: "browse_file_ctrl",
            header_menu: "browse",
            need_load: true
        }).when("/browse/posts", {
            templateUrl: "/view/browse/browse_posts.html",
            controller: "browse_post_ctrl",
            header_menu: "browse",
            need_load: true
        }).when("/templates", {
            templateUrl: "/view/dashboard/templates.html",
            controller: "template_ctrl",
            header_menu: "template",
            need_load: true
        }).when("/templates/add", {
            templateUrl: "/view/template/add_new_template.html",
            controller: "add_new_template_ctrl",
            header_menu: "template",
            need_load: true
        }).when("/templates/generator_new", {
            is_outter: false,
            templateUrl: "/view/common/template_generator_new.html",
            controller: "newGeneratorCtrl",
            header_menu: "template",
            need_load: false
        }).when("/browse/templates", {
            templateUrl: "/view/browse/browse_templates.html",
            //templateUrl: "/view/browse/templates_added_fastlane.html",
            controller: "browse_template_ctrl",
            // controller: "project_template_ctrl",
            header_menu: "browse_template",
            need_load: true
        }).when("/browse/pages", {
            templateUrl: "/view/browse/browse_pages.html",
            controller: "browse_page_ctrl",
            header_menu: "browse",
            need_load: true
        }).when("/tasks", {
            templateUrl: "/view/dashboard/tasks.html",
            controller: "tasks_ctrl",
            header_menu: "task",
            need_load: true
        }).when("/account/myscore", {
            templateUrl: "/view/account/account_myscore.html",
            controller: "account_myscore_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account/company_info", {
            templateUrl: "/view/account/company_info.html",
            controller: "company_info_ctrl",
            header_menu: "",
            need_load: true
        }).when("/set_invalid_mails", {
            templateUrl: "/view/account/invalid_mails_set.html",
            controller: "invalid_email_ctrl",
            header_menu: "",
            need_load: true
        }).when("/set_google_ips", {
            templateUrl: "/view/account/google_ips_manage.html",
            controller: "google_ips_ctrl",
            header_menu: "",
            need_load: true
        }).when("/user_manager", {
            templateUrl: "/view/account/user_manager.html",
            controller: "user_manager",
            header_menu: "",
            need_load: true
        }).when("/batch_email_send", {
            templateUrl: "/view/account/batch_email_send.html",
            controller: "batch_email_send_ctrl",
            header_menu: "",
            need_load: true
        }).when("/reports", {
            templateUrl: "/view/account/reports.html",
            controller: "reports_ctrl",
            header_menu: "",
            need_load: true
        }).when("/system", {
            templateUrl: "/view/system/system.html",
            header_menu: "system",
            need_load: false
        }).when("/cms", {
            templateUrl: "/view/cms/cms.html",
            header_menu: "cms",
            need_load: false
        }).when("/trade", {
            templateUrl: "/view/trade/trade.html",
            header_menu: "trade",
            need_load: false
        }).when("/posts", {
            templateUrl: "/view/dashboard/post/posts.html",
            controller: "posts_ctrl",
            header_menu: "posts",
            need_load: true
        }).when("/goodss", {
            templateUrl: "/view/dashboard/goods/goodss.html",
            controller: "goodss_ctrl",
            header_menu: "goodss",
            need_load: true
        }).when("/tags", {
            templateUrl: "/view/dashboard/tags.html",
            controller: "tags_ctrl",
            header_menu: "tags",
            need_load: true
        }).when("/companies", {
                templateUrl: "/view/dashboard/companies.html",
                controller: "organizers_ctrl",
                header_menu: "companies",
                need_load: true
        }).when("/files", {
            templateUrl: "/view/dashboard/file/files.html",
            controller: "files_ctrl",
            header_menu: "files",
            need_load: true
        }).when("/users", {
            templateUrl: "/view/dashboard/user/users.html",
            controller: "users_ctrl",
            header_menu: "users",
            need_load: true
        }).when("/articles", {
            templateUrl: "/view/dashboard/article/articles.html",
            controller: "articles_ctrl",
            header_menu: "articles",
            need_load: true
        }).when("/articles/add", {
            templateUrl: "/view/dashboard/article/add_article.html",
            controller: "new_article_ctrl",
            header_menu: "new_article",
            need_load: true
        }).when("/videos", {
            templateUrl: "/view/dashboard/video/videos.html",
            controller: "videos_ctrl",
            header_menu: "videos",
            need_load: true
        }).when("/orders", {
            templateUrl: "/view/dashboard/order/orders.html",
            controller: "orders_ctrl",
            header_menu: "orders",
            need_load: true
        }).when("/coupons", {
            templateUrl: "/view/dashboard/coupon/coupons.html",
            controller: "coupons_ctrl",
            header_menu: "coupons",
            need_load: true
        }).when("/organizers", {
            templateUrl: "/view/dashboard/organizers.html",
            controller: "organizers_ctrl",
            header_menu: "organizers",
            need_load: true
        }).when("/programs", {
            templateUrl: "/view/dashboard/programs.html",
            controller: "programs_ctrl",
            header_menu: "programs",
            need_load: true
        }).when("/inbox", {
            templateUrl: "/view/dashboard/inbox.html",
            controller: "inbox_ctrl",
            header_menu: "inbox",
            need_load: true
        }).when("/search", {
            templateUrl: "/view/dashboard/search_result.html",
            controller: "search_result_ctrl",
            header_menu: "result",
            need_load: true
        }).when("/teams/add", {
            templateUrl: "/view/team/team_add.html",
            controller: "team_add_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id", {
            templateUrl: "/view/team/team.html",
            controller: "team_ctrl",
            header_menu: "team",
            need_load: true
        }).when("/teams/:team_id/projects", {
            templateUrl: "/view/team/team_projects.html",
            controller: "team_ctrl",
            header_menu: "team",
            need_load: true
        }).when("/teams/:team_id/invite", {
            templateUrl: "/view/team/team_member_invite.html",
            controller: "team_member_invite_ctrl",
            header_menu: "dashboard",
            need_load: true
        }).when("/teams/:team_id/setting", {
            templateUrl: "/view/team/team_setting.html",
            controller: "team_setting_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin", {
            templateUrl: "/view/team/team_admin_summary.html",
            controller: "team_admin_summary_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/basic", {
            templateUrl: "/view/team/team_admin_basic.html",
            controller: "team_admin_basic_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/summary", {
            templateUrl: "/view/team/team_admin_summary.html",
            controller: "team_admin_summary_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/members", {
            templateUrl: "/view/team/team_admin_members.html",
            controller: "team_admin_members_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/quota", {
            templateUrl: "/view/team/team_admin_change_quota.html",
            controller: "team_admin_change_quota_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/projects", {
            templateUrl: "/view/team/team_admin_projects.html",
            controller: "team_admin_projects_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/security", {
            templateUrl: "/view/team/team_admin_security.html",
            controller: "team_admin_security_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/export", {
            templateUrl: "/view/team/team_admin_export.html",
            controller: "team_admin_export_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/admin/consultant", {
            templateUrl: "/view/team/team_admin_consultant.html",
            controller: "team_admin_consultant_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/upgrade", {
            templateUrl: "/view/team/team_admin_upgrade.html",
            controller: "team_admin_upgrade_ctrl",
            header_menu: "",
            need_load: true
        }).when("/teams/:team_id/degrade", {
            templateUrl: "/view/team/team_admin_degrade.html",
            controller: "team_admin_degrade_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account_settings", {
            templateUrl: "/view/account/account_settings.html",
            controller: "account_settings_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account/twofactor", {
            templateUrl: "/view/account/account_twofactor.html",
            controller: "account_twofactor_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account/message", {
            templateUrl: "/view/account/account_message.html",
            controller: "account_message_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account/projects", {
            templateUrl: "/view/account/account_projects.html",
            controller: "account_projects_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account/teams", {
            templateUrl: "/view/account/account_teams.html",
            controller: "account_teams_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account/security", {
            templateUrl: "/view/account/account_security.html",
            controller: "account_security_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account/apps", {
            templateUrl: "/view/account/account_apps.html",
            controller: "account_apps_ctrl",
            header_menu: "",
            need_load: true
        }).when("/not_found", {
            templateUrl: "/view/404.html",
            need_load: false,
            header_menu: "index",
            controller: ["$rootScope",
                function (e) {
                    e.global.loading_init = false,
                        e.global.title = "404"
                }
            ],
            is_outter: true
        }).when("/directive", {
            templateUrl: "/view/directive.html",
            need_load: false
        }).when("/chat", {
            templateUrl: "/view/chat.html",
            need_load: false
        }).when("/admin", {
            templateUrl: "/view/dashboard/admin.html",
            controller: "admin_ctrl",
            header_menu: "",
            need_load: true
        }).when("/account_charge", {
            templateUrl: "/view/account/account_charge.html",
           controller: "account_charge_ctrl",
//            controller: ,
            header_menu: "积分充值",
            need_load: false
        }).when("/account_charge/:out_trade_no", {
            templateUrl: "/view/account/account_charge.html",
            controller: "account_charge_ctrl",
            header_menu: "积分充值",
            need_load: false
        })
        .when("/account_order", {
            templateUrl: "/view/account/account_order.html",
            controller: "account_order_ctrl",
            header_menu: "",
            need_load: false
        }).when("/check", {
            templateUrl: "/view/directive.html",
            controller: ["$http", "$scope", "$rootScope",
                function ($http, $scope, $rootScope) {
                    $rootScope.$watch(function () {
                        return $rootScope.projects
                    }, function (newV) {
                        if (newV.length > 0 && _.isArray(newV)) {
                            $scope.hello_projects_info = _
                                .chain($rootScope.projects)
                                .map(function (project) {
                                    return {
                                        name: project.name,
                                        totalCount: project.task_count,
                                        badges: _.pairs(project.badges)
                                    }
                                })
                                .value();
                            $rootScope.global.loading_done = true;
                        }
                    });
                    $rootScope.$watch(function () {
                        return $rootScope.teams;
                    }, function (newV) {
                        if (newV.length > 0 && _.isArray(newV)) {
                            $scope.total = _
                                .chain($rootScope.teams[0])
                                .pairs()
                                .filter(function (pair) {
                                    return pair[0].indexOf('count') > 0;
                                })
                                .value();
                        }
                    });
                    var url = "/api/programs/private",
                        url0, url1, url2, url3;
                    url += "?page=1&size=20&isDec=1&team_id=54acd1e8e4b0cedd2f0c409b";
                    url += "&pid=54acd1e8e4b0cedd2f0c409b-SYSTEM&sortKey=undefined";
                    url += "&areaCode=";
                    url += "&countryCode=";
                    url += "&howLangLastSend=0";
                    url0 = url + "&type=0";
                    url1 = url + "&type=1";
                    url2 = url + "&type=2";
                    url3 = url + "&type=3";
                    $http.get(url0);
                    wt.data.test.get(url0);
                    //wt.data.test.get(url0,function(res,state,context,hi,world) {
                    //    console.log('here');
                    //});
                    //wt.data.test.get(url1);
                    //wt.data.test.get(url2);
                    //wt.data.test.get(url3);
                }],
            header_menu: "",
            need_load: true
        }).otherwise({
            redirectTo: "/dashboard"
        })
    }
]);