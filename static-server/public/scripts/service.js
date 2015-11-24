"use strict";
wt.service =
    angular.module("wt.service", ["ngResource"])
        .factory("rest", ["$resource",
    function ($resource) {
        "use strict";
        return {
            index: $resource("/api/index/:OP", {
                OP: "index"
            }),
            user: $resource("/api/users/:uid", {
                uid: "index"
            }),
            project: $resource("/api/projects/:pid", {
                pid: "index",
                OP: "index"
            })
        }
    }
]).factory("data", ["$http",
    function ($http) {
        "use strict";
        var httpMethod = {
            get: 1,
            post: 2,
            post_form: 21,
            put: 3,
            del: 4
        };

        var baseUrl = {
            team: "/api/teams",
            project: "/api/projects",
            program: "/api/programs",
            comment: "/api/comments",
            user: "/api/users",
            file: "/api/files",
            post: "/api/posts",
            goods: "/api/goodss",
            order: "/api/orders",
            coupon: "/api/coupons",
            organizer: "/api/organizers",
            tag: "/api/tags",
            article: "/api/articles",
            video:"/api/videos"
        };

        var get_req_url = function (baseUrl, obj) {
            var url = baseUrl;
            var count = 0;
            for (var key in obj) {
                if (count == 0) {
                    url += "?" + key + "=" + obj[key];
                } else {
                    url += "&" + key + "=" + obj[key];
                }
                count++;
            }
            return url;
        };

        var url_with_date = function (url) {
            return url.indexOf("?") > -1 ? url + "&dt=" + (new Date).getTime() : url + "?dt=" + (new Date).getTime();
        };
        var ajax = function (url, requestType, jsonObject, successFunc, errorFunc, thenFunc) {
            var successCallback1 = function () {
                kzi.console.timeEnd("Ajax：" + url)
            };
            var successCallback2 = function (data, status, headers, config) {
                if (config.url === void 0 && angular.noop(), 200 === data.code) {
                    angular.isFunction(successFunc) && successFunc(data);
                } else {
                    if ($(document).scope().global.loading_done = true, 2005 === data.code) {
                        return $(document).scope().returnToSignin();
                    }
                    if (angular.isFunction(errorFunc)) {
                        errorFunc(data);
                    } else {
                        if (data.code === kzi.statuses.error.permission_deny.code) {
                            return kzi.msg.error("没有权限操作");
                        }
                        if (!$(document).scope().global.show_msg) {
                            $(document).scope().global.show_msg = true;
                            var errMsg = "操作失败，请重新尝试";
                            httpMethod === httpMethod.get && (errMsg = "加载失败，请重新尝试");
                            kzi.msg.error(errMsg, function () {
                                $(document).scope().global.show_msg = false
                            })
                        }
                    }
                }
            };
            var errorCallback = function (resp) {
                if (!$(document).scope().global.show_msg) {
                    $(document).scope().global.show_msg = true;
                    var o = "操作失败，请重新尝试";
                    httpMethod === httpMethod.get && (o = "加载失败，请重新尝试");
                    kzi.msg.error(o, function () {
                        $(document).scope().global.show_msg = false
                    })
                }
                thenCallback(resp);
            };
            var thenCallback = function (resp) {
                angular.isFunction(thenFunc) && thenFunc(resp);
            };
            switch (requestType) {
                case httpMethod.get:
                    url = url_with_date(url);
                    kzi.console.time("Ajax：" + url);
                    $http.get(url).success(successCallback1).success(successCallback2).error(errorCallback).then(thenCallback);
                    break;
                case httpMethod.post:
                    kzi.console.time("Ajax：" + url);
                    $http.post(url, {
                        data: jsonObject
                    }).success(successCallback1).success(successCallback2).error(errorCallback).then(thenCallback);
                    break;
                case httpMethod.del:
                    kzi.console.time("Ajax：" + url);
                    $http({
                        method: "delete",
                        url: url
                    }).success(successCallback1).success(successCallback2).error(errorCallback).then(thenCallback);
                    break;
                case httpMethod.put:
                    kzi.console.time("Ajax：" + url);
                    $http.put(url, {
                        data: jsonObject
                    }).success(successCallback1).success(successCallback2).error(errorCallback).then(thenCallback);
                    break;
                default:
                    throw new Error("传入的方法类型不支持")
            }
        };
        var get = function (url, successFunc, errorFunc, thenFunc) {
            ajax(url, httpMethod.get, null, successFunc, errorFunc, thenFunc)
        };
        var post = function (url, jsonObject, successFunc, errorFunc, thenFunc) {
            ajax(url, httpMethod.post, jsonObject, successFunc, errorFunc, thenFunc)
        };
        var del = function (url, successFunc, errorFunc, thenFunc) {
            ajax(url, httpMethod.del, null, successFunc, errorFunc, thenFunc)
        };
        var put = function (url, jsonOject, successFunc, errorFunc, thenFunc) {
            ajax(url, httpMethod.put, jsonOject, successFunc, errorFunc, thenFunc)
        };
        return {
            hot: function (id, type, value, successFunc, errorFunc, thenFunc) {
                switch (type) {
                    case "template":
                        type = "templates";
                        break;
                    case "customer":
                        type = "programs";
                        break;
                    case "post":
                        type = "posts";
                        break;
                }
                put("/api/" + type + "/hot/" + id + "?isHot=" + value, {}, successFunc, errorFunc, thenFunc);
            },
            error: function () {
                if (!$(document).scope().global.show_msg) {
                    $(document).scope().global.show_msg = true;
                    kzi.msg.error("加载失败，请重新尝试", function () {
                        $(document).scope().global.show_msg = false;
                    });
                }
            },
            signin: function (name, password, successFunc, errorFunc, thenFunc) {
                var jsonObject = {
                    name: name,
                    password: password,
                    source: 'cms'
                };
                post(baseUrl.user + "/signin/", jsonObject, successFunc, errorFunc, thenFunc)
            },
            signup: function (jsonObject, successFunc, errorFunc, thenFunc) {
                post(baseUrl.user + "/signup", jsonObject, successFunc, errorFunc, thenFunc)
            },
            signout: function (successFunc, errorFunc, thenFunc) {
                post(baseUrl.user + "/signout", null, successFunc, errorFunc, thenFunc)
            },
            auth: function (successFunc, errorFunc, thenFunc) {
                get("/api/me", successFunc, errorFunc, thenFunc)
            },
            watch: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                post("/api/" + t + "/" + i + "/watcher?pid=" + e, {
                    uids: [n]
                }, successFunc, errorFunc, thenFunc)
            },
            watch_batch: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                post("/api/" + t + "/" + i + "/watcher?pid=" + e, {
                    uids: n
                }, successFunc, errorFunc, thenFunc)
            },
            unwatch: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                del("/api/" + t + "/" + i + "/watchers/" + n + "?pid=" + e, successFunc, errorFunc, thenFunc)
            },
            get_watchers: function (e, t, i, successFunc, errorFunc, thenFunc) {
                get("/api/" + t + "/" + i + "/watcher?pid=" + e, successFunc, errorFunc, thenFunc)
            },
            get_my_watchs: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                get("/api/watchs/forme?team_id=" + e + "&type=" + t + "&since_id=" + i + "&count=" + n, successFunc, errorFunc, thenFunc)
            },
            search_all: function (e, t, type, page, size, successFunc, errorFunc, thenFunc) {
                get("/api/search?team_id=" + e + "&keywords=" + t + "&scopes=all" + "&page=" + page + "&size=" + size + "&type=" + type, successFunc, errorFunc, thenFunc)
            },
            search_customer: function (queryCondition, successFunc, errorFunc, thenFunc) {
                /*            	var queryCondition = {
                 "zoneCode" : "",
                 "countryCode" : "",
                 "mainIndustryCode" : "",
                 "page" : "1",
                 "size":"30",
                 "keywords":"",
                 "subIndustryCode" : ""
                 };
                 */
                var url = "/api/search/customer/public?page=" + queryCondition.page + "&size=" + queryCondition.size;
                angular.forEach(queryCondition, function (value, key) {
                    if (key != "page" && key != "size" && value != "") {
                        url += "&" + key + "=" + value;
                    }
                });
                get(url, successFunc, errorFunc, thenFunc);
            },
            user: {
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.user + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                create: function (user, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.user, user, successFunc, errorFunc, thenFunc)
                },
                add_tag: function (pid, postId, tagName, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.user + "/" + postId + "/tags?pid=" + pid, {
                        name: tagName
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.user + "/" + t + "/tags?pid=" + e, {
                        tag_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, postId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.user + "/" + postId + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get_statistics: function (successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/statistics", successFunc, errorFunc, thenFunc);
                },
                get_developing_statistics: function (successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/ownStatistic", successFunc, errorFunc, thenFunc);
                },

                /**
                 * 根据用户名（帐号）查找用户信息
                 * @param data
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                get_by_name: function (data, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/info/name/" + data, successFunc, errorFunc, thenFunc);
                },

                /**
                 * 根据uid查找用户信息
                 * @param uid
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                get_by_uid: function (uid, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/info/uid/" + uid, successFunc, errorFunc, thenFunc);
                },

                /**
                 * 根据用户id修改用户帐号状态
                 * @param uid
                 * @param data [0:激活用户；1：冻结用户]
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                update_account_status: function (uid, data, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + uid + "/status?param=" + data, {}, successFunc, errorFunc, thenFunc);
                },
                save_search_setting: function (uid, data, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + uid + "/searchsettings", data, successFunc, errorFunc, thenFunc);
                },
                save_company_info: function (obj, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/default/company", {
                        company: {
                            name: obj.name || "",
                            displayname: obj.displayname || "",
                            type: obj.type || "",
                            size: obj.size || "",
                            industry_1: obj.mainIndustryCode || "",
                            industry_2: obj.mainIndustryCode || "",
                            address: obj.address || "",
                            website: obj.website || "",
                            description: obj.description || "",
                            products: obj.products || "",
                            buildDate: obj.buildDate || "",
                            customerNow: obj.customerNow || "",
                            productCertification: obj.productCertification || "",
                            qualitySystem: obj.qualitySystem || "",
                            inspectionCertificate: obj.inspectionCertificate || "",
                            prodcutivePower: obj.prodcutivePower || ""
                        }
                    }, successFunc, errorFunc, thenFunc)
                },
                get_company_info: function (successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/default/company", successFunc, errorFunc, thenFunc)
                },
                update_defualt_template: function (templateId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/default/template", {
                        defaultTemplate: templateId
                    }, successFunc, errorFunc, thenFunc)
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/" + t + "/info?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                /*
                 get: function (successFunc, errorFunc, thenFunc) {
                 get("/api/account/basic", successFunc, errorFunc, thenFunc);
                 },*/
                update: function (t, user, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.user + "/" + t;
                    put(url, {
                        name: user.temp_name,
                        enName: user.temp_enName,
                        cnName: user.temp_cnName,
                        title: user.temp_title,
                        mobile: user.temp_mobile,
                        avatar: user.temp_avatar,
                        imageUrl: user.temp_imageUrl,
                        url: user.temp_url,
                        display_name: user.temp_display_name,
                        email: user.temp_email,
                        desc: user.temp_desc
                    }, successFunc, errorFunc, thenFunc);

                },
                update_old: function (uid, e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + uid + "/info",
                        {display_name: e, companyName: t, initials: ""},
                        successFunc, errorFunc, thenFunc);
                },

                email_check: function (e, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/email/check?email=" + e, successFunc, errorFunc, thenFunc)
                },
                name_check: function (e, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/name/check?name=" + e, successFunc, errorFunc, thenFunc)
                },

                change_pwd: function (uid, e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + uid + "/password", {
                        oldpassword: e,
                        password: t
                    }, successFunc, errorFunc, thenFunc);
                },

                forgot_pwd: function (e, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/password?email=" + e, {}, successFunc, errorFunc, thenFunc);
                },
                get_info: function (uid, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.user + "/" + uid + "/info", successFunc, errorFunc, thenFunc);
                },

                change_trade: function (uid, e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + uid + "/trade", {
                        f_tradecode: e,
                        s_tradeCode: t
                    }, successFunc, errorFunc, thenFunc);
                },

                change_email: function (uid, e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + uid + "/email?type=" + t, {email: e}, successFunc, errorFunc, thenFunc);
                },

                invitation: function (jsondata, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.user + "/invitation", jsondata, successFunc, errorFunc, thenFunc);
                },

                setFirstLoad: function (successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/first_load", successFunc, errorFunc, thenFunc);
                },
//                change_email: function (uid,e, t, successFunc, errorFunc, thenFunc) {
//                    put("/api/user/"+uid+"/email?type="+t, {email: e}, successFunc, errorFunc, thenFunc);
//                },


//                reset_pwd: function (e, t, successFunc, errorFunc, thenFunc) {
//                    put("/api/user/password/reset?token=" + e, {
//                        password: t
//                    }, successFunc, errorFunc, thenFunc)
//                },

//                set_avatar: function (e, successFunc, errorFunc, thenFunc) {
//                    put("/api/user/avatar", {
//                        avatar: e
//                    }, successFunc, errorFunc, thenFunc)
//                },

//                search_user: function (e, successFunc, errorFunc, thenFunc) {
//                    get("/api/user/search?criteria=" + e, successFunc, errorFunc, thenFunc)
//                },
//                get_user_prefs: function (e, successFunc, errorFunc, thenFunc) {
//                    get("/api/users/" + e + "/prefs", successFunc, errorFunc, thenFunc)
//                },
//                set_user_prefs: function (e, t, i, successFunc, errorFunc, thenFunc) {
//                    put("/api/users/" + e + "/prefs", {
//                        key: t,
//                        value: i
//                    }, successFunc, errorFunc, thenFunc)
//                },

                apply: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/apply", {
                        email: e,
                        team_name: t,
                        team_desc: i
                    }, successFunc, errorFunc, thenFunc)
                },
                get_apply: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/apply?code=" + e, successFunc, errorFunc, thenFunc)
                },
//                apply_signup: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
//                    var jsonObject = {
//                        name: t,
//                        email: i,
//                        password: n,
//                        team_name: a
//                    };
//                    post("/api/user/apply_signup?code=" + e, jsonObject, successFunc, errorFunc, thenFunc)
//                },
//                email_change_apply: function (e, successFunc, errorFunc, thenFunc) {
//                    post("/api/user/email/apply", {
//                        email: e
//                    }, successFunc, errorFunc, thenFunc)
//                },
//                reset_email: function (e, successFunc, errorFunc, thenFunc) {
//                    put("/api/user/email/reset?token=" + e, null, successFunc, errorFunc, thenFunc)
//                },
                signin_twofactor: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    var r = {
                        name: t,
                        password: i,
                        factor: e
                    };
                    post(baseUrl.user + "/twofactor", r, successFunc, errorFunc, thenFunc)
                },
                signin_recovery: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    var jsonObject = {
                        name: t,
                        password: i,
                        factor: e
                    };
                    post(baseUrl.user + "/recovery", jsonObject, successFunc, errorFunc, thenFunc);
                },
                del: function (pid, uid, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.user + "/" + uid + "/delete?pid=" + pid, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                hide: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.user + "/" + t + "/hide?pid=" + e, null, successFunc, errorFunc, thenFunc);
                }
            },
            scoreLog: {
                getScoreLogs: function (data, successFunc, errorFunc, thenFunc) {

                    var url = "/api/scorelog?page=" + data.page + "&size=" + data.size +
                        "&isAdd=" + data.isAdd + "&orderKey=" + data.orderKey + "&isDESC=" + data.isDESC;

                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            report: {

                /**
                 * 举报
                 */
                //type:['customer','post','template']
                report: function (type, data, successFunc, errorFunc, thenFunc) {
                    post("/api/report/" + type, data, successFunc, errorFunc, thenFunc);
                },
                /**
                 * 获取举报对象列表
                 */
                getReportObjects: function (data, successFunc, errorFunc, thenFunc) {
                    get("/api/report/" + data.otype + "/objects?orderKey=" + data.orderKey + "&isDESC=" + data.isDESC, successFunc, errorFunc, thenFunc);
                },
                /**
                 * 获取举报内容列表
                 */
                getReportInfos: function (data, successFunc, errorFunc, thenFunc) {
                    get("/api/report/" + data.objectId + "/reports?isDisposed=" + data.isDisposed, successFunc, errorFunc, thenFunc);
                },
                /**
                 * 处理举报信息
                 */
                disposed: function (rid, status, successFunc, errorFunc, thenFunc) {
                    put("/api/report/" + rid + "/disposed", {"type": status}, successFunc, errorFunc, thenFunc);
                }
            },
            customer: {
                get_customers_by_condition: function (queryCondition, successFunc, errorFunc, thenFunc) {
                    var get_url = function (baseUrl, obj) {
                        var url = baseUrl;
                        var count = 0;
                        for (var key in obj) {
                            if (obj[key]) {
                                if (count == 0) {
                                    url += "?" + key + "=" + obj[key];
                                } else {
                                    url += "&" + key + "=" + obj[key];
                                }
                                ;
                                count++;
                            }
                        }
                        return url;
                    };
//                    var url = get_url("/api/customers", queryCondition);
                    var url = get_url("/api/customers/search", queryCondition);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            account: {
                get_basic: function (successFunc, errorFunc, thenFunc) {
                    get("/api/account/basic", successFunc, errorFunc, thenFunc)
                },
                get_teams: function (successFunc, errorFunc, thenFunc) {
                    get("/api/account/teams", successFunc, errorFunc, thenFunc)
                },
                get_projects: function (successFunc, errorFunc, thenFunc) {
                    get("/api/account/projects", successFunc, errorFunc, thenFunc)
                },
                get_security: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/account/security?page=" + e, successFunc, errorFunc, thenFunc)
                },
                conform_password: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/account/sudo/confirm", {
                        password: e
                    }, successFunc, errorFunc, thenFunc)
                },
                get_recovery_codes: function (e, t, i) {
                    get("/api/account/twofactor/recovery", e, t, i)
                },
                get_twofactor_secret: function (e, t, i) {
                    get("/api/account/twofactor/secret", e, t, i)
                },
                enable_twofactor: function (e, t, i, n) {
                    put("/api/account/twofactor/enable", {
                        factor: e
                    }, t, i, n)
                },
                disable_twofactor: function (e, t, i) {
                    put("/api/account/twofactor/disable", {}, e, t, i)
                },
                get_apps: function (e, t, i) {
                    get("/api/account/apps", e, t, i)
                },
                decommissioning_app: function (e, t, i, n) {
                    del("/api/account/apps/" + e, t, i, n)
                }
            },
            team: {
                get: function (e, t, i, n) {
                    get("/api/teams/" + e, t, i, n)
                },
                get_list: function (e, t, i) {
                    get("/api/teams", e, t, i)
                },
                add: function (e, t, i, n, a) {
                    post("/api/teams/", {
                        name: e,
                        desc: t
                    }, i, n, a)
                },
                update: function (e, t, i, n, a, s, o) {
                    put("/api/teams/" + e + "/account", {
                        name: t,
                        desc: i,
                        url: n
                    }, a, s, o)
                },
                set_logo: function (e, t, i, n, a) {
                    put("/api/teams/" + e + "/account/logo", {
                        pic: t
                    }, i, n, a)
                },
                transfer: function (e, t, i, n, a) {
                    put("/api/teams/" + e + "/account/transfer", {
                        uid: t
                    }, i, n, a)
                },
                dismiss: function (e, t, i, n) {
                    del("/api/teams/" + e + "/account", t, i, n)
                },
                add_member: function (e, t, i, n, a) {
                    post("/api/teams/" + e + "/member", {
                        uid: t
                    }, i, n, a)
                },
                del_member: function (e, t, i, n, a) {
                    del("/api/teams/" + e + "/members/" + t, i, n, a)
                },
                invite_member: function (e, t, i, n, a, o, r) {
                    post("/api/teams/" + e + "/member/invite", {
                        members: t,
                        message: i,
                        project_ids: n
                    }, a, o, r)
                },
                uninvite_member: function (e, t, i, n, a) {
                    put("/api/teams/" + e + "/members/" + t + "/uninvite", null, i, n, a)
                },
                set_role: function (e, t, i, n, a, s) {
                    put("/api/teams/" + e + "/members/" + t + "/role", {
                        role: i
                    }, n, a, s)
                },
                set_group: function (e, t, i, n, a, s) {
                    put("/api/teams/" + e + "/members/" + t + "/group", {
                        group_id: i
                    }, n, a, s)
                },
                get_team_members: function (e, t, i, n) {
                    get("/api/teams/" + e + "/members", t, i, n)
                },
                add_team_member: function (e, t, i, n, a, o) {
                    post("/api/teams/" + e + "/member", {
                        uid: t,
                        role: i
                    }, n, a, o)
                },
                add_group: function (e, t, i, n, a) {
                    post("/api/teams/" + e + "/group", {
                        name: t
                    }, i, n, a)
                },
                del_group: function (e, t, i, n, a) {
                    del("/api/teams/" + e + "/groups/" + t, i, n, a)
                },
                update_group: function (e, t, i, n, a, s) {
                    put("/api/teams/" + e + "/groups/" + t, {
                        name: i
                    }, n, a, s)
                },
                get_groups: function (e, t, i, n) {
                    get("/api/teams/" + e + "/groups", t, i, n)
                },
                set_current: function (e, t, i, n) {
                    put("/api/teams/" + e + "/current", null, t, i, n)
                },
                get_member_projects: function (e, t, i, n, s) {
                    get("/api/teams/" + e + "/members/" + t + "/projects", i, n, s)
                },
                leave: function (e, t, i, n) {
                    put("/api/teams/" + e + "/leave", null, t, i, n)
                },
                commonweal_apply: function (e, t, i, n, a, o) {
                    post("/api/teams/" + e + "/commonweal/apply", {
                        type: t,
                        desc: i
                    }, n, a, o)
                },
                summary: function (e, t, i, n) {
                    get("/api/teams/" + e + "/account/summary", t, i, n)
                },
                upgrade: function (e, t, i, n, a) {
                    put("/api/teams/" + e + "/account/upgrade", {
                        quota: t
                    }, i, n, a)
                },
                degrade: function (e, t, i, n) {
                    put("/api/teams/" + e + "/account/degrade", null, t, i, n)
                },
                payment: function (e, t, i, n) {
                    get("/api/teams/" + e + "/account/payment", t, i, n)
                },
                get_payments: function (e, t, i, n, s) {
                    get("/api/teams/" + e + "/account/payments?page=" + t, i, n, s)
                },
                get_billings: function (e, t, i, n, s) {
                    get("/api/teams/" + e + "/account/billings", i, n, s)
                },
                redeem_coupon: function (e, t, i, n, a) {
                    post("/api/teams/" + e + "/account/redeem", {
                        coupon_no: t
                    }, i, n, a)
                },
                cancel_payment: function (e, t, i, n, a) {
                    del("/api/teams/" + e + "/account/payment?pay_id=" + t, i, n, a)
                },
                get_account_members: function (e, t, i, n) {
                    get("/api/teams/" + e + "/account/members", t, i, n)
                },
                get_account_projects: function (e, t, i, n) {
                    get("/api/teams/" + e + "/account/projects", t, i, n)
                },
                get_security_histories: function (e, t, i, n, s) {
                    get("/api/teams/" + e + "/account/security?page=" + t, i, n, s)
                },
                change_subscription: function (e, t, i, n, a) {
                    put("/api/teams/" + e + "/account/subscription", {
                        quota: t
                    }, i, n, a)
                },
                bulk_export: function (e, t, i, n) {
                    post("/api/teams/" + e + "/account/export", null, t, i, n)
                },
                get_bulk_export: function (e, t, i, n, s) {
                    get("/api/teams/" + e + "/account/export?page=" + t, i, n, s)
                }
            },
            project: {
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.project + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                get_all: function (e, t, i, n) {
                    get("/api/projects/all?type=" + e, t, i, n)
                },
                create: function (e, t, i, n, a, o) {
                    post("/api/projects", {
                        team_id: e,
                        name: t,
                        desc: i
                    }, n, a, o)
                },
                create_new: function (e, n, a, o) {
                    post("/api/projects", e, n, a, o)
                },
                get_list: function (e, t, i, n, s) {
                    get("/api/projects?team_id=" + e + "&type=" + t, i, n, s)
                },
                get: function (e, t, i, n) {
                    get("/api/projects/" + e, t, i, n)
                },
                get_new: function (e, t, i, n) {
                    get("/api/projects/new/" + e, t, i, n)
                },
                update: function (pid, title, desc, imgUrl, n, a, s) {
                    put("/api/projects/" + pid, {
                        name: title,
                        title: title,
                        imageUrl: imgUrl,
                        desc: desc
                    }, n, a, s);
                },
                del: function (e, t, i, n) {
                    del("/api/projects/" + e, t, i, n)
                },
                set_logo: function (e, t, i, n, a, s) {
                    put("/api/projects/" + e + "/logo", {
                        bg: t,
                        pic: i
                    }, n, a, s)
                },
                archive: function (e, t, i, n) {
                    put("/api/projects/" + e + "/archive", null, t, i, n)
                },
                unarchive: function (e, t, i, n) {
                    put("/api/projects/" + e + "/unarchive", null, t, i, n)
                },
                set_prefs: function (e, t, i, n, a, s) {
                    put("/api/projects/" + e + "/prefs", {
                        key: t,
                        value: i
                    }, n, a, s)
                },
                add_member: function (e, t, i, n, a, o) {
                    post("/api/projects/" + e + "/member", {
                        uid: t,
                        role: i
                    }, n, a, o)
                },
                invite_member: function (e, t, i, n, a) {
                    post("/api/projects/" + e + "/member/invite", {
                        uid: t
                    }, i, n, a)
                },
                get_members: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/projects/" + e + "/members", successFunc, errorFunc, thenFunc)
                },
                get_templates: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/projects/" + e + "/templates", successFunc, errorFunc, thenFunc)
                },
                del_member: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/projects/" + e + "/members/" + t, successFunc, errorFunc, thenFunc)
                },
                set_member_role: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/projects/" + e + "/members/role", {
                        uid: t,
                        role: i
                    }, successFunc, errorFunc, thenFunc)
                },
                set_labels: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/projects/" + e + "/labels", {
                        labels: t
                    }, successFunc, errorFunc, thenFunc)
                },
                get_labels: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/projects/" + e + "/labels", successFunc, errorFunc, thenFunc)
                },
                set_entries: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/projects/" + e + "/entries", {
                        entries: t
                    }, successFunc, errorFunc, thenFunc)
                },
                get_entries: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/projects/" + e + "/entries", successFunc, errorFunc, thenFunc)
                },
                get_trash: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/projects/" + e + "/recycle", successFunc, errorFunc, thenFunc)
                },
                clear_trash: function (e, successFunc, errorFunc, thenFunc) {
                    del("/api/projects/" + e + "/recycle", successFunc, errorFunc, thenFunc)
                },
                member_leave: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/projects/" + e + "/leave", null, successFunc, errorFunc, thenFunc)
                },
                prj_position: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/projects/" + e + "/position", {
                        pos: t
                    }, successFunc, errorFunc, thenFunc)
                },
                get_chat_list: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    var r = "/api/projects/" + e + "/chat?page=" + t;
                    i && (r += "&count=" + i), get(r, successFunc, errorFunc, thenFunc)
                },
                get_unique_admin_prjs: function (e, t, successFunc, errorFunc, thenFunc) {
                    var o = "/api/projects/users/" + t + "/unique/admin?team_id=" + e;
                    get(o, successFunc, errorFunc, thenFunc)
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/projects/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, organizerId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.project + "/" + pid + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                add_tag_new: function (pid, t, i, n, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.project + "/" + pid + "/tags?pid=" + pid, {
                        tag_id: i,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                }
            },
            entry: {
                add: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/entries?pid=" + e, {
                        name: t,
                        pos: i
                    }, successFunc, errorFunc, thenFunc)
                },
                get_list: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/entries/?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_archived_list: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/entries/archived?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                update: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "?pid=" + e, {
                        name: i
                    }, successFunc, errorFunc, thenFunc)
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/entries/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                change_pos: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/position?pid=" + e, {
                        pos: i
                    }, successFunc, errorFunc, thenFunc)
                },
                archive: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/archive?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                unarchive: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/unarchive?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                move: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/move?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                copy: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/copy?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                batch_assign: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/tasks/members?pid=" + e, {
                        uid: i
                    }, successFunc, errorFunc, thenFunc)
                },
                batch_set_label: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/tasks/labels?pid=" + e, {
                        label: i
                    }, successFunc, errorFunc, thenFunc)
                },
                batch_set_expire: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/tasks/expire?pid=" + e, {
                        expire: i
                    }, successFunc, errorFunc, thenFunc)
                },
                batch_move: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/entries/" + t + "/tasks/position?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc)
                },
                copy_entry: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/entries/" + t + "/copy?pid=" + e, {
                        name: i,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                watch_entry: function (e, t, successFunc, errorFunc, thenFunc) {
                    post("/api/entries/" + t + "/watcher?pid=" + e, {}, successFunc, errorFunc, thenFunc)
                },
                unwatch_entry: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/entries/" + t + "/watcher?pid=" + e, successFunc, errorFunc, thenFunc)
                }
            },
            task: {
                xtype: "programs",
                sync_image_url: function (program_id, successFunc, errorFunc, thenFunc) {
                    var url = ["/api/programs/", program_id, "/image/sync"].join("");
                    put(url,null, successFunc, errorFunc, thenFunc);
                },

                get_programs_in_project: function (pid, reqObj, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url("/api/programs/page/project/" + pid, reqObj);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                update_position_in_project: function (program_id, pid, position, successFunc, errorFunc, thenFunc) {
                    var url = ["/api/programs/", program_id, "/projects/", pid].join("");
                    put(url, {
                        position: position
                    }, successFunc, errorFunc, thenFunc);
                },
                update_position: function (eid, program, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.program + "/" + eid + "/position";
                    put(url, {
                        position: program.position
                    },successFunc, errorFunc, thenFunc);
                },
                isCollected: function (taskid, successFunc, errorFunc, thenFunc) {
                    get("/api/" + wt.data.task.xtype + "/check?taskid=" + taskid, successFunc, errorFunc, thenFunc)
                },
                add_simple: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/" + xtype + "?pid=" + e, {
                        entry_id: t,
                        name: i.temp_name,
                        email: i.temp_email,
                        company: i.temp_company,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                add: function (pid, customer, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "?pid=" + pid, customer, successFunc, errorFunc, thenFunc)
                },
                add_full: function (e, t, i, n, a, o, r, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "?pid=" + e, {
                        entry_id: t,
                        name: i,
                        pos: n,
                        labels: o,
                        members: a,
                        expire_date: r
                    }, successFunc, errorFunc, thenFunc)
                },
                get: function (e, t, i, n, s) {
                    get("/api/" + wt.data.task.xtype + "/" + t + "?pid=" + e, i, n, s)
                },
                get_all_count: function (e, t, i, n, s) {
                    get("/api/" + wt.data.task.xtype + "/" + t + "?pid=" + e, i, n, s)
                },
                update: function (e, t, i, a, s, o) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "?pid=" + e, {
                        name: i.temp_name,
                        enName: i.temp_enName,
                        cnName: i.temp_enName,
                        title: i.temp_title,
                        imageUrl: i.temp_imageUrl,
                        url: i.temp_url,
                        organizer_id: i.temp_organizer_id,
                        desc: i.temp_desc,
                        fee: i.temp_fee,
                        maxAge: i.temp_maxAge,
                        minAge: i.temp_minAge,
                        quota: i.temp_quota,
                        isDescMarkDown: i.temp_isDescMarkDown * 1
                    }, a, s, o)
                },
                collect: function (pid, ifFree, customerId, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + customerId + "/collect?pid=" + pid + "&ifFree=" + ifFree, null, successFunc, errorFunc, thenFunc)
                },
                batch_collect: function (pid, ifFree, customerIdList, successFunc, errorFunc, thenFunc) {
                    put("/api/programs/batchcollect/" + pid + "?ifFree=" + ifFree, customerIdList, successFunc, errorFunc, thenFunc)
                },
                /**
                 * 批量分享活动
                 * @param customerIdList
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                batch_share: function (customerIdList, successFunc, errorFunc, thenFunc) {
                    put("/api/programs/batchshare", customerIdList, successFunc, errorFunc, thenFunc)
                },
                /**
                 * 单个分享活动
                 * @param e
                 * @param t
                 * @param i
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "/" + t + "/share?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                batch_move: function (pid, from_pid, team_id, e, k, successFunc, errorFunc, thenFunc) {
                    put("/api/programs/batchmove/" + pid + '?teamId=' + team_id, {
                        ids: e,
                        cids: k,
                        from_pid: from_pid
                    }, successFunc, errorFunc, thenFunc)
                },
                // 私有-->ids  收藏-->cids  分享的活动-->sids
                batch_remove: function (pid, teamId, e, k, sharedIds, successFunc, errorFunc, thenFunc) {
                    put("/api/programs/batchRemove/" + pid + '?teamId=' + teamId, {
                        ids: e || [],
                        cids: k || [],
                        sids: sharedIds || []
                    }, successFunc, errorFunc, thenFunc)
                },
                publish: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/publish?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                unPublish: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + i + "/unpublish?pid=" + e, {
                        entry_id: t
                    }, successFunc, errorFunc, thenFunc)
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                untrash: function (pid, eid, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + eid + "/restore?pid=" + pid, null, successFunc, errorFunc, thenFunc);
                },
                trash_by_group: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/trash?type=1&pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                mail: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/mail?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/" + wt.data.task.xtype + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                change_pos: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/position?pid=" + e, {
                        pos: i
                    }, successFunc, errorFunc, thenFunc)
                },
                move: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/position?pid=" + e, {
                        from: i,
                        to: n,
                        pos: a
                    }, successFunc, errorFunc, thenFunc)
                },
                set_expire: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/expire?pid=" + e, {
                        expire: i
                    }, successFunc, errorFunc, thenFunc)
                },
                set_date: function (t, start, end, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/date?start_date=" + start + "&end_date=" + end, {
                        date: start
                    }, successFunc, errorFunc, thenFunc)
                },
                set_start: function (t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/date?start_date=" + i, {
                        date: i
                    }, successFunc, errorFunc, thenFunc)
                },
                set_end: function (t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/date?end_date=" + i, {
                        date: i
                    }, successFunc, errorFunc, thenFunc)
                },
                assign: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "/" + t + "/member?pid=" + e, {
                        uid: i
                    }, successFunc, errorFunc, thenFunc)
                },
                unassign: function (e, t, i, n, a, s) {
                    del("/api/" + wt.data.task.xtype + "/" + t + "/members/" + i + "?pid=" + e, n, a, s)
                },
                set_templates: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "/" + t + "/template?pid=" + e, {
                        template_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                del_templates: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    del("/api/" + wt.data.task.xtype + "/" + t + "/templates/" + i + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                set_labels: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/labels?pid=" + e, {
                        label: i
                    }, successFunc, errorFunc, thenFunc)
                },
                set_labels_batch: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/programs/batch_labels?pid=" + e, {
                        tasks: t,
                        label: i
                    }, successFunc, errorFunc, thenFunc)
                },
                del_labels: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    del("/api/" + wt.data.task.xtype + "/" + t + "/labels?pid=" + e + "&label=" + i, successFunc, errorFunc, thenFunc);
                },
                complete: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/complete?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                start: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/start?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                add_todo: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "/" + t + "/todo?pid=" + e, {
                        name: i,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "/" + t + "/tags?pid=" + e, {
                        name: i,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "/" + t + "/tags?pid=" + e, {
                        tag_id: i,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                update_tag: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/tags/" + i + "?pid=" + e, {
                        name: n
                    }, successFunc, errorFunc, thenFunc)
                },
                del_tag: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    del("/api/" + wt.data.task.xtype + "/" + t + "/tags/" + i + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                add_project: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/" + wt.data.task.xtype + "/" + t + "/projects?pid=" + e, {
                        pid: i,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                del_project: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    del("/api/" + wt.data.task.xtype + "/" + t + "/projects/" + i + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                update_todo: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/todos/" + i + "?pid=" + e, {
                        name: n
                    }, successFunc, errorFunc, thenFunc)
                },
                del_todo: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    del("/api/" + wt.data.task.xtype + "/" + t + "/todos/" + i + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                update_todo_pos: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    var l = "/api/" + wt.data.task.xtype + "/" + t + "/todos/" + i + "/position?pid=" + e;
                    put(l, {
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                complete_todo: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/todos/" + i + "/checked?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                uncomplete_todo: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/todos/" + i + "/unchecked?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                change_todo_pos: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/todos/" + i + "/position?pid=" + e, {
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                search: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/programs/search?q=" + e, successFunc, errorFunc, thenFunc)
                },
                get_for_me: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/programs/forme?team_id=" + e + "&complete=" + t, successFunc, errorFunc, thenFunc)
                },
                get_for_public: function (type, page, size, isDESC, successFunc, errorFunc, thenFunc) {
                    get("/api/" + wt.data.task.xtype + "/public?type=" + type + "&page=" + page + "&size=" + size + "&isDESC=" + isDESC, successFunc, errorFunc, thenFunc)
                },
                get_for_private: function (team_id, pid, type, page, size, isDESC, isOpen, sortKey, areaCode, countryCode, howLangLastSend, labels, successFunc, errorFunc, thenFunc) {
                    get("/api/" + wt.data.task.xtype + "/private?type=" + type + "&page=" + page +
                        "&size=" + size + "&isDESC=" + isDESC + "&isOpen=" + isOpen + "&team_id=" + team_id + "&pid=" + pid +
                        "&sortKey=" + sortKey + "&areaCode=" + areaCode + "&countryCode=" + countryCode + "&howLangLastSend=" + howLangLastSend + "&labels=" + labels,
                        successFunc, errorFunc, thenFunc)
                },

                get_archived_list: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/programs/archived?pid=" + e + "&page=" + t + "&count=" + i, successFunc, errorFunc, thenFunc)
                },
                get_for_graph: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/graph/user?start=" + e + "&end=" + t, successFunc, errorFunc, thenFunc)
                },
                get_for_user_overview: function (successFunc, errorFunc, thenFunc) {
                    get("/api/programs/user/overview", successFunc, errorFunc, thenFunc)
                },
                archive: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/archive?pid=" + e, {}, successFunc, errorFunc, thenFunc)
                },
                unarchive: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/" + wt.data.task.xtype + "/" + t + "/unarchive?pid=" + e, {
                        entry_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                archived_all: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/programs/archived?pid=" + e, {
                        entry_id: t
                    }, successFunc, errorFunc, thenFunc)
                },
                copy_task: function (e, t, i, n, a, o, r, l, c, u, successFunc, errorFunc, thenFunc) {
                    var m = {
                        name: i,
                        pos: n,
                        keep_comments: Number(a),
                        keep_members: Number(o),
                        keep_labels: Number(r),
                        keep_attachments: Number(l),
                        keep_watchers: Number(u),
                        keep_todos: Number(c)
                    };
                    post("/api/" + wt.data.task.xtype + "/" + t + "/copy?pid=" + e, m, successFunc, errorFunc, thenFunc)
                },
                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/programs/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
                },
                get_all_list_old: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/programs/browse_old?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
                },
                get_task_by_name: function (name, page, size, successFunc, errorFunc, thenFunc) {
                    get("/api/programs/filter/name?name=" + name + "&page=" + page + "&size=" + size, successFunc, errorFunc, thenFunc)
                },
                detect_collect: function (customerList, successFunc, errorFunc, thenFunc) {
                    put("/api/programs/detect_collect", {
                        list: customerList
                    }, successFunc, errorFunc, thenFunc);
                },
                confirm: function (programId, uid, successFunc, thenFunc, errorFunc) {
                    put("api/programs/" + programId + "/" + uid + "/confirm", {}, successFunc, thenFunc, errorFunc);
                },
                cancel: function (programId, uid, successFunc, thenFunc, errorFunc) {
                    put("api/programs/" + programId + "/" + uid + "/cancel", {}, successFunc, thenFunc, errorFunc);
                },
                get_page_by_organizer: function (organizerId, queryCondition, successFunc, thenFunc, errorFunc) {
                    var url = get_req_url("api/programs/page/organizer/" + organizerId, queryCondition);
                    get(url, successFunc, thenFunc, errorFunc);
                }
            },
            file: {
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.file + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                new_upload: function (pid, requestBoday, successFunc, errorFunc, thenFunc) {
                    var uid = window.sessionStorage.uid;
                    post("/api/file?pid=" + pid + "&uid=" + uid, requestBoday, successFunc, errorFunc, thenFunc)
                },
                new_upload1: function (e, t, successFunc, errorFunc, thenFunc) {
                    post("/api/file/upload?pid=" + e, t, successFunc, errorFunc, thenFunc)
                },
                get_list: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/files?pid=" + e + "&folder_id=" + t, successFunc, errorFunc, thenFunc)
                },
                get_image_list: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/files/images?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/files/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                update: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/files/" + t + "?pid=" + e, {
                        name: i,
                        desc: n
                    }, successFunc, errorFunc, thenFunc)
                },
                update_ext: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/files/" + t + "/ext?pid=" + e, {
                        ext: i
                    }, successFunc, errorFunc, thenFunc)
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/files/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/files/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/files/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_versions: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/files/" + t + "/versions?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                move: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/files/" + t + "/move?pid=" + e, {
                        from: i,
                        to: n
                    }, successFunc, errorFunc, thenFunc)
                },
                get_target: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/files/" + t + "/target?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                attach: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/" + t + "/" + i + "/attach?pid=" + e, {
                        fid: n
                    }, successFunc, errorFunc, thenFunc)
                },
                detach: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/" + t + "/" + i + "/detach?pid=" + e, {
                        fid: n
                    }, successFunc, errorFunc, thenFunc)
                },
                upload_attach: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/" + t + "/" + i + "/file?pid=" + e, {
                        files: n
                    }, successFunc, errorFunc, thenFunc)
                },
                get_attach_list: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/" + t + "/" + i + "/files?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                add_folder: function (e, t, successFunc, errorFunc, thenFunc) {
                    post("/api/folder?pid=" + e, {
                        name: t
                    }, successFunc, errorFunc, thenFunc)
                },
                get_folders: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/folders?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/files/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/files/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc)
                }
            },
            comment: {
                publish: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    post("/api/" + t + "/" + i + "/comment?pid=" + e, {
                        message: n,
                        fids: a
                    }, successFunc, errorFunc, thenFunc)
                },
                get_list: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/" + t + "/" + i + "/comments?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                del: function (postId, type, commentId, successFunc, errorFunc, thenFunc) {
                    del("/api/" + type + "/" + postId + "/comments/" + commentId, successFunc, errorFunc, thenFunc);
                },
                update: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    put("/api/" + i + "/" + n + "/comments/" + t + "?pid=" + e, {
                        message: a
                    }, successFunc, errorFunc, thenFunc)
                },
                set_position : function (comment_id, position,successFunc, errorFunc, thenFunc) {
                    var requestUrl = ['/api/comments/', comment_id, "/", position].join('');
                    put(requestUrl, {}, successFunc,errorFunc,thenFunc);
                }
            },
            calendar: {
                get_my_tasks: function (e, t, i, n, s, successFunc, errorFunc, thenFunc) {
                    get("/api/calendar/tasks?team_id=" + e + "&type=" + t + "&uid=" + i + "&start=" + n + "&end=" + s, successFunc, errorFunc, thenFunc)
                }
            },
            event: {
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/events/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                add: function (e, t, i, n, a, o, r, l, successFunc, errorFunc, thenFunc) {
                    post("/api/event?pid=" + e, {
                        name: t,
                        location: i,
                        attendees: n,
                        start_date: a,
                        start_time: o,
                        end_date: r,
                        end_time: l
                    }, successFunc, errorFunc, thenFunc)
                },
                update: function (e, t, i, n, a, s, o, l, c, x, successFunc, errorFunc, thenFunc) {
                    put("/api/events/" + t + "?pid=" + e, {
                        name: i,
                        location: a,
                        summary: n,
                        start_date: s,
                        start_time: o,
                        end_date: l,
                        end_time: c
                    }, successFunc, errorFunc, thenFunc)
                },
                update_date: function (e, t, i, n, a, s, successFunc, errorFunc, thenFunc) {
                    put("/api/events/" + t + "/date?pid=" + e, {
                        start_date: i,
                        start_time: n,
                        end_date: a,
                        end_time: s
                    }, successFunc, errorFunc, thenFunc)
                },
                trash: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/events/" + t + "/trash?pid=" + e, {
                        type: i
                    }, successFunc, errorFunc, thenFunc)
                },
                get_list: function (e, t, i, n, s, successFunc, errorFunc, thenFunc) {
                    get("/api/calendar/events?pid=" + e + "&type=" + t + "&showall=" + i + "&start=" + n + "&end=" + s, successFunc, errorFunc, thenFunc)
                },
                attendee_add: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put("/api/events/" + t + "/attendee?pid=" + e, {
                        uid: i
                    }, successFunc, errorFunc, thenFunc)
                },
                attendee_remove: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    del("/api/events/" + t + "/attendees/" + i + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/events/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/events/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_today_events: function (successFunc, errorFunc, thenFunc) {
                    get("/api/events/today", successFunc, errorFunc, thenFunc)
                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/events/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc)
                }
            },
            post: {
                create: function (postInfo, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.post, postInfo, successFunc, errorFunc, thenFunc)
                },

                add_tag: function (pid, postId, tagName, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.post + "/" + postId + "/tags?pid=" + pid, {
                        name: tagName
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (pid, post_id, tag_id, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.post + "/" + post_id + "/tags?pid=" + pid, {
                        tag_id: tag_id
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, postId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.post + "/" + postId + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.post + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
//                get_list: function (e, t, i, n, s, o, successFunc, errorFunc, thenFunc) {
//                    var u = "/api/posts?pid=" + e + "&since_id=" + t + "&count=" + i + "&sort=" + n + "&desc=" + s + "&type=" + o;
//                    get(u, successFunc, errorFunc, thenFunc)
//                },
                update: function (t, postInfo, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.post + "/" + t;
                    put(url, {
                        name: postInfo.temp_name,
                        enName: postInfo.temp_enName,
                        cnName: postInfo.temp_enName,
                        title: postInfo.temp_title,
                        summary: postInfo.temp_summary,
                        content: postInfo.temp_content,
                        imageUrl: postInfo.temp_imageUrl,
                        url: postInfo.temp_url,
                        contact: postInfo.temp_contact,
                        email: postInfo.temp_email,
                        desc: postInfo.temp_desc
                    }, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.post + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (postId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.post + "/" + postId + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.post + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.post + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
//                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
//                    get("/api/posts/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
//                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.post + "/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc);
                },
                praise: function (post_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.post + "/" + post_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                getPageListPost: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.post + "/public", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                getMyPageListPost: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.post + "/private", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.post + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            goods: {
                create: function (goodsInfo, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.goods, goodsInfo, successFunc, errorFunc, thenFunc)
                },

                get_all: function (e, t, i, n) {
                    get(baseUrl.goods + "?type=" + e, t, i, n)
                },

                add_tag: function (pid, goodsId, tagName, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.goods + "/" + goodsId + "/tags?pid=" + pid, {
                        name: tagName
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.goods + "/" + t + "/tags?pid=" + e, {
                        tag_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, goodsId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.goods + "/" + goodsId + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.goods + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
//                get_list: function (e, t, i, n, s, o, successFunc, errorFunc, thenFunc) {
//                    var u = "/api/goodss?pid=" + e + "&since_id=" + t + "&count=" + i + "&sort=" + n + "&desc=" + s + "&type=" + o;
//                    get(u, successFunc, errorFunc, thenFunc)
//                },
                update: function (t, goodsInfo, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.goods + "/" + t;
                    put(url, {
                        name: goodsInfo.temp_name,
                        enName: goodsInfo.temp_enName,
                        cnName: goodsInfo.temp_enName,
                        title: goodsInfo.temp_title,
                        imageUrl: goodsInfo.temp_imageUrl,
                        url: goodsInfo.temp_url,
                        price: goodsInfo.temp_price,
                        count: goodsInfo.temp_count,
                        desc: goodsInfo.temp_desc
                    }, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.goods + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (goodsId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.goods + "/" + goodsId + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.goods + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.goods + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
//                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
//                    get("/api/goodss/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
//                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.goods + "/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc);
                },
                praise: function (goods_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.goods + "/" + goods_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                getPageListgoods: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.goods + "/public", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                getMyPageListgoods: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.goods + "/private", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.goods + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            order: {
                create: function (orderInfo, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.order, orderInfo, successFunc, errorFunc, thenFunc)
                },

                add_tag: function (pid, orderId, tagName, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.order + "/" + orderId + "/tags?pid=" + pid, {
                        name: tagName
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.order + "/" + t + "/tags?pid=" + e, {
                        tag_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, orderId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.order + "/" + orderId + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.order + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_list: function (params, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.order, params);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                update: function (t, orderInfo, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.order + "/" + t;
                    put(url, {
                        name: orderInfo.temp_name,
                        enName: orderInfo.temp_enName,
                        cnName: orderInfo.temp_enName,
                        title: orderInfo.temp_title,
                        imageUrl: orderInfo.temp_imageUrl,
                        url: orderInfo.temp_url,
                        price: orderInfo.temp_price,
                        count: orderInfo.temp_count,
                        desc: orderInfo.temp_desc
                    }, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.order + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (orderId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.order + "/" + orderId + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.order + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.order + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
//                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
//                    get("/api/orders/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
//                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.order + "/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc);
                },
                praise: function (order_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.order + "/" + order_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                getPageListorder: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.order + "/public", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                getMyPageListorder: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.order + "/private", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.order + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            article: {
                create: function (articleInfo, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.article, articleInfo, successFunc, errorFunc, thenFunc)
                },

                add_tag: function (pid, articleId, tagName, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.article + "/" + articleId + "/tags?pid=" + pid, {
                        name: tagName
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.article + "/" + t + "/tags?pid=" + e, {
                        tag_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, articleId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.article + "/" + articleId + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.article + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_list: function (params, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.article, params);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                update: function (t, articleInfo, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.article + "/" + t;
                    put(url, {
                        brief: articleInfo.temp_brief,
                        title: articleInfo.temp_title,
                        content: articleInfo.temp_content,
                        images: articleInfo.temp_images
                    }, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.article + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (articleId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.article + "/" + articleId + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.article + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.article + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
                del_file: function (articleId, fileId, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.article + "/" + articleId + "/files/" + fileId, successFunc, errorFunc, thenFunc)
                },
                publish: function (pid, articleId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.article + "/" + articleId + "/publish?pid=" + pid, null, successFunc, errorFunc, thenFunc);
                },
                praise: function (article_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.article + "/" + article_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    e.source = 'cms';
                    var url = get_req_url(baseUrl.article + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            video:{
                create: function (videoForm, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.video, videoForm, successFunc, errorFunc, thenFunc)
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.video + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                get: function (e, videoId, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.video + "/" + videoId + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                publish: function (pid, videoId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.video + "/" + videoId + "/publish?pid=" + pid, null, successFunc, errorFunc, thenFunc);
                },
                update: function (videoId, videoInfo, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.video + "/" + videoId;
                    put(url, {
                        title: videoInfo.temp_title,
                        content: videoInfo.temp_content,
                        images: videoInfo.temp_images,
                        authorName: videoInfo.temp_author.name,
                        profile: videoInfo.temp_profile,
                        format: videoInfo.temp_format,
                        link: videoInfo.temp_link
                    }, successFunc, errorFunc, thenFunc);
                }
            },
            coupon: {
                create: function (couponInfo, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.coupon, couponInfo, successFunc, errorFunc, thenFunc)
                },

                add_tag: function (pid, couponId, tagName, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.coupon + "/" + couponId + "/tags?pid=" + pid, {
                        name: tagName
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.coupon + "/" + t + "/tags?pid=" + e, {
                        tag_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, couponId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.coupon + "/" + couponId + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.coupon + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_list: function (params, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.coupon, params);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                update: function (t, couponInfo, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.coupon + "/" + t;
                    put(url, {
                        name: couponInfo.temp_name,
                        enName: couponInfo.temp_enName,
                        cnName: couponInfo.temp_enName,
                        title: couponInfo.temp_title,
                        imageUrl: couponInfo.temp_imageUrl,
                        url: couponInfo.temp_url,
                        price: couponInfo.temp_price,
                        count: couponInfo.temp_count,
                        desc: couponInfo.temp_desc
                    }, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.coupon + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (couponId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.coupon + "/" + couponId + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.coupon + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.coupon + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
//                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
//                    get("/api/coupons/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
//                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.coupon + "/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc);
                },
                praise: function (coupon_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.coupon + "/" + coupon_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                getPageListcoupon: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.coupon + "/public", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                getMyPageListcoupon: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.coupon + "/private", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.coupon + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            organizer: {
                create: function (organizer, successFunc, errorFunc, thenFunc) {
                    var l = baseUrl.organizer;
                    post(l, organizer, successFunc, errorFunc, thenFunc)
                },
                get_all: function (e, t, i, n) {
                    var url = [baseUrl.organizer, "?type=", e].join('');
                    //var url = baseUrl.organizer;
                    get(url, t, i, n);
                },
                add_tag: function (pid, organizerId, tagName, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.organizer + "/" + organizerId + "/tags?pid=" + pid, {
                        name: tagName
                    }, successFunc, errorFunc, thenFunc)
                },
                add_tag_new: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.organizer + "/" + t + "/tags?pid=" + e, {
                        tag_id: i
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, organizerId, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.organizer + "/" + organizerId + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.organizer + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
//                get_list: function (e, t, i, n, s, o, successFunc, errorFunc, thenFunc) {
//                    var u = "/api/posts?pid=" + e + "&since_id=" + t + "&count=" + i + "&sort=" + n + "&desc=" + s + "&type=" + o;
//                    get(u, successFunc, errorFunc, thenFunc)
//                },
                update: function (t, organizer, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.organizer + "/" + t;
                    put(url, {
                        name: organizer.temp_name,
                        enName: organizer.temp_enName,
                        cnName: organizer.temp_enName,
                        title: organizer.temp_title,
                        imageUrl: organizer.temp_imageUrl,
                        url: organizer.temp_url,
                        address: organizer.temp_address,
                        poi: organizer.temp_poi,
                        contact: organizer.temp_contact,
                        email: organizer.temp_email,
                        desc: organizer.temp_desc,
                        company: organizer.temp_company
                    }, successFunc, errorFunc, thenFunc);
                },
                update_position: function (eid, position, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.organizer + "/" + eid + "/position";
                    put(url, {
                       position: position
                    },successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.organizer + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (postId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.organizer + "/" + postId + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.organizer + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                publish: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.organizer + "/" + t + "/publish?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                unPublish: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.organizer + "/" + i + "/unpublish?pid=" + e, {
                        entry_id: t
                    }, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.organizer + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
//                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
//                    get("/api/posts/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
//                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.organizer + "/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc);
                },
                praise: function (post_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.organizer + "/" + post_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.organizer + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            program: {
                create: function (program, pid, successFunc, errorFunc, thenFunc) {
                    var l = baseUrl.program + "?pid=" + pid;
                    post(l, program, successFunc, errorFunc, thenFunc);
                },
                add_tag: function (pid, program_id, tag_id, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.program + "/" + program_id + "/tag?pid=" + pid, {
                        tag_id: tag_id
                    }, successFunc, errorFunc, thenFunc)
                },
                remove_tag: function (pid, program_id, tagId, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.program + "/" + program_id + "/tags/" + tagId + "?pid=" + pid,
                        successFunc,
                        errorFunc,
                        thenFunc);
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.program + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_list: function (params, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.program, params);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                update: function (t, program, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.program + "/" + t;
                    put(url, {
                        name: organizer.title,
                        f_type: organizer.f_type,
                        s_type: organizer.s_type,
                        content: organizer.content
                    }, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.program + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (program_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.program + "/" + program_id + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.program + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.program + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
//                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
//                    get("/api/posts/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
//                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.program + "/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc);
                },
                praise: function (program_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.program + "/" + program_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.program + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            tag: {
                create: function (tag, successFunc, errorFunc, thenFunc) {
                    post(baseUrl.tag, tag, successFunc, errorFunc, thenFunc)
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get(baseUrl.tag + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_all: function (successFunc, errorFunc, thenFunc) {
                    get(baseUrl.tag, successFunc, errorFunc, thenFunc)
                },
//                get_list: function (e, t, i, n, s, o, successFunc, errorFunc, thenFunc) {
//                    var u = "/api/posts?pid=" + e + "&since_id=" + t + "&count=" + i + "&sort=" + n + "&desc=" + s + "&type=" + o;
//                    get(u, successFunc, errorFunc, thenFunc)
//                },
                update: function (t, postInfo, successFunc, errorFunc, thenFunc) {
                    var url = baseUrl.tag + "/" + t;
                    put(url, {
                        name: postInfo.title,
                        f_type: postInfo.f_type,
                        s_type: postInfo.s_type,
                        content: postInfo.content
                    }, successFunc, errorFunc, thenFunc);
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.tag + "/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                collect: function (postId, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.tag + "/" + postId + "/collect?pid=", null, successFunc, errorFunc, thenFunc);
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.tag + "/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc);
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del(baseUrl.tag + "/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc);
                },
//                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
//                    get("/api/posts/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
//                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.tag + "/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc);
                },
                praise: function (post_id, successFunc, errorFunc, thenFunc) {
                    put(baseUrl.tag + "/" + post_id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                get_all_page: function (e, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url(baseUrl.tag + "/page", e);
                    get(url, successFunc, errorFunc, thenFunc);
                }
            },
            template: {
                get_template_by_name: function (name, page, size, successFunc, errorFunc, thenFunc) {
                    get("/api/templates/filter/name?name=" + name + "&page=" + page + "&size=" + size, successFunc, errorFunc, thenFunc)
                },
                add_tag: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    post("/api/templates/" + t + "/tags?pid=" + e, {
                        name: i,
                        pos: n
                    }, successFunc, errorFunc, thenFunc)
                },
                del_tag: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    del("/api/templates/" + t + "/tags/" + i + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                add: function (e, f_type, t, i1, i2, i3, i4, i5, i, n, a, o, r) {
                    var l = "/api/templates?pid=" + e;
                    post(l, {
                        f_type: f_type,
                        name: t,
                        mainCatalogCode: i1,
                        mainCatalogCnName: i2,
                        subCatalogCode: i3,
                        subCatalogCnName: i4,
                        content: i,
                        summary: i5,
                        watchers: n
                    }, a, o, r)
                },
                praise: function (id, successFunc, errorFunc, thenFunc) {
                    put("/api/templates/" + id + "/praise", {}, successFunc, errorFunc, thenFunc);
                },
                get: function (pid, id, successFunc, errorFunc, thenFunc) {
                    get("/api/templates/" + id + "?pid=" + pid, successFunc, errorFunc, thenFunc)
                },
                get_list: function (e, t, i, n, s, o, successFunc, errorFunc, thenFunc) {
                    var u = "/api/templates?pid=" + e + "&since_id=" + t + "&count=" + i + "&sort=" + n + "&desc=" + s + "&type=" + o;
                    get(u, successFunc, errorFunc, thenFunc)
                },
                collect: function (e, templateId, successFunc, errorFunc, thenFunc) {
                    put("/api/templates/" + templateId + "/collect?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                update: function (e, f_type, t, i, i1, i2, i3, i4, i5, n, a, s, o) {
                    var l = "/api/templates/" + t + "?pid=" + e;
                    put(l, {
                        f_type: f_type,
                        name: i,
                        mainCatalogCode: i1,
                        mainCatalogCnName: i2,
                        subCatalogCode: i3,
                        subCatalogCnName: i4,
                        summary: i5,
                        content: n
                    }, a, s, o)
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/templates/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/templates/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/templates/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/templates/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
                },
                get_public_list: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/templates/public?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/templates/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc)
                },
                get_private_classify: function (e, successFunc, errorFunc, thenFunc) {
                    //是否必须这些参数
                    var reqObj = {
                        type: true,
                        catalog: false,
                        page: false,
                        size: false
                    }
                    var url = get_req_url("/api/templates/private", e);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                group_public: function (f_type, successFunc, errorFunc, thenFunc) {
                    get('/api/templates/group/public?f_type=' + f_type, successFunc, errorFunc, thenFunc);
                },
                public: function (queryCondition, successFunc, errorFunc, thenFunc) {
                    var url = get_req_url("/api/templates/public", queryCondition);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                private: function (queryCondition, successFunc, errorFunc, thenFunc) {
                    var get_req_url = function (baseUrl, obj) {
                        var url = baseUrl;
                        var count = 0;
                        for (var key in obj) {
                            if (count == 0) {
                                url += "?" + key + "=" + obj[key];
                            } else {
                                url += "&" + key + "=" + obj[key];
                            }
                            ;
                            count++;
                        }
                        return url;
                    };
                    var url = get_req_url("/api/templates/private", queryCondition);
                    get(url, successFunc, errorFunc, thenFunc);
                },
                browseAll: function (successFunc, errorFunc, thenFunc) {
                    get("/api/templates/browseAll", successFunc, errorFunc, thenFunc)
                },
                setUsedMost: function (templateId, successFunc, errorFunc, thenFunc) {
                    put("/api/templates/" + templateId + "usedMost/1", successFunc, errorFunc, thenFunc)
                },
                unsetUsedMost: function (templateId, successFunc, errorFunc, thenFunc) {
                    put("/api/templates/" + templateId + "usedMost/0", successFunc, errorFunc, thenFunc)
                },
                getUsedMost: function (successFunc, errorFunc, thenFunc) {
                    get("/api/templates/usedMost", successFunc, errorFunc, thenFunc)
                }
            },
            page: {
                add: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    var c = "/api/page?pid=" + e;
                    post(c, {
                        name: t,
                        content: i,
                        message: n,
                        parent_id: a
                    }, successFunc, errorFunc, thenFunc)
                },
                get: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/pages/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_versions: function (e, t, successFunc, errorFunc, thenFunc) {
                    var o = "/api/pages/" + t + "/versions?pid=" + e;
                    get(o, successFunc, errorFunc, thenFunc)
                },
                get_list: function (e, t, i, n, s, successFunc, errorFunc, thenFunc) {
                    var c = "/api/pages?pid=" + e + "&since_id=" + t + "&count=" + i + "&sort=" + n + "&desc=" + s;
                    get(c, successFunc, errorFunc, thenFunc)
                },
                get_all: function (e, successFunc, errorFunc, thenFunc) {
                    var s = "/api/pages?pid=" + e;
                    get(s, successFunc, errorFunc, thenFunc)
                },
                update: function (e, t, i, n, a, s, o, successFunc, errorFunc, thenFunc) {
                    var d = "/api/pages/" + t + "?pid=" + e;
                    put(d, {
                        name: i,
                        content: n,
                        message: a,
                        is_notify: s,
                        unloak: o
                    }, successFunc, errorFunc, thenFunc)
                },
                trash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/pages/" + t + "/trash?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                untrash: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/pages/" + t + "/restore?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                del: function (e, t, successFunc, errorFunc, thenFunc) {
                    del("/api/pages/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                locked: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/pages/" + t + "/locked?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                unlocked: function (e, t, successFunc, errorFunc, thenFunc) {
                    put("/api/pages/" + t + "/unlocked?pid=" + e, null, successFunc, errorFunc, thenFunc)
                },
                get_all_list: function (e, t, successFunc, errorFunc, thenFunc) {
                    get("/api/pages/browse?type=" + e + "&page=" + t, successFunc, errorFunc, thenFunc)
                },
                share: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/pages/" + t + "/share?pid=" + e, {
                        to: i
                    }, successFunc, errorFunc, thenFunc)
                }
            },
            activity: {
                get_for_user: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    get("/api/activity/users/" + e + "?pid=" + t + "&since_id=" + i + "&count=" + n, successFunc, errorFunc, thenFunc)
                },
                forme: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    get("/api/activity/forme?team_id=" + e + "&type=" + t + "&since_id=" + i + "&count=" + n, successFunc, errorFunc, thenFunc)
                },
                get_for_teams: function (e, t, i, n, s, successFunc, errorFunc, thenFunc) {
                    get("/api/activity/teams?team_id=" + e + "&pid=" + t + "&type=" + i + "&since_id=" + n + "&count=" + s, successFunc, errorFunc, thenFunc)
                },
                get_for_project: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    get("/api/activity/project?pid=" + e + "&type=" + t + "&since_id=" + i + "&count=" + n, successFunc, errorFunc, thenFunc)
                },
                get_for_item: function (type, id, since_Id, count, successFunc, errorFunc, thenFunc) {
                    get("/api/activity/entity/" + id + "?since_id=" + since_Id + "&count=" + count, successFunc, errorFunc, thenFunc)
                },
                get_feeds: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/activity/feed?pid=" + e + "&type=" + t + "&page=" + i, successFunc, errorFunc, thenFunc)
                }
            },
            notice: {
                unread: function (successFunc, errorFunc, thenFunc) {
                    get("/api/notice/unread/teams", successFunc, errorFunc, thenFunc)
                },
                set_allread: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/notice/allread?type=" + e, null, successFunc, errorFunc, thenFunc)
                },
                set_read: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/notices/" + e + "/read", null, successFunc, errorFunc, thenFunc)
                },
                get_list: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    get("/api/notices?type=" + e + "&since_id=" + t + "&count=" + i + "&is_read=" + n, successFunc, errorFunc, thenFunc)
                }
            },
            invite: {
                accept: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/invites/" + e + "/accept", null, successFunc, errorFunc, thenFunc)
                },
                join: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/invites/" + e + "/join", {
                        name: t,
                        display_name: i,
                        password: n
                    }, successFunc, errorFunc, thenFunc)
                },
                refuse: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/invites/" + e + "/refuse", null, successFunc, errorFunc, thenFunc)
                },
                get: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/invites/" + e, successFunc, errorFunc, thenFunc)
                },
                get_new: function (successFunc, errorFunc, thenFunc) {
                    get("/api/invites/new", successFunc, errorFunc, thenFunc)
                },
                get_invite_code: function (e, t, successFunc, errorFunc, thenFunc) {
                    var o = "/api/invite/code?member_id=" + t + "&team_id=" + e;
                    get(o, successFunc, errorFunc, thenFunc)
                }
            },
            feedback: {
                add: function (name, email, category, content, path, successFunc, errorFunc, thenFunc) {
                    var feedback = {
                        name: name,
                        email: email,
                        category: category,
                        content: content,
                        path: path
                    };
                    post("/api/feedback", feedback, successFunc, errorFunc, thenFunc)
                }
            },
            guide: {
                search_guides: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/guides/search?keywords=" + e, successFunc, errorFunc, thenFunc)
                }
            },
            graph: {
                overview: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/graph/overview?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                get_pulse: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/graph/pulse?pid=" + e + "&start=" + t + "&end=" + i, successFunc, errorFunc, thenFunc)
                },
                get_daily: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/graph/daily?pid=" + e + "&start=" + t + "&end=" + i, successFunc, errorFunc, thenFunc)
                },
                get_contribution: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/graph/contribution?pid=" + e + "&start=" + t + "&end=" + i, successFunc, errorFunc, thenFunc)
                }
            },
            blog: {
                get_blog_admin: function (successFunc, errorFunc, thenFunc) {
                    get("/api/blog/admin", successFunc, errorFunc, thenFunc)
                },
                get_categories: function (successFunc, errorFunc, thenFunc) {
                    get("/api/blog/categories", successFunc, errorFunc, thenFunc)
                },
                add_category: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    post("/api/blog/category", {
                        name: e,
                        pos: t,
                        permalink: i
                    }, successFunc, errorFunc, thenFunc)
                },
                update_category: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/blog/categories/" + e, {
                        name: t,
                        pos: i,
                        permalink: n
                    }, successFunc, errorFunc, thenFunc)
                },
                delete_category: function (e, successFunc, errorFunc, thenFunc) {
                    del("/api/blog/categories/" + e, successFunc, errorFunc, thenFunc)
                },
                get_articles: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/blog/articles?page=" + e, successFunc, errorFunc, thenFunc)
                },
                get_article: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/blog/articles/" + e, successFunc, errorFunc, thenFunc)
                },
                add_article: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    post("/api/blog/article", {
                        title: e,
                        category_id: a,
                        permalink: n,
                        summary: t,
                        content: i
                    }, successFunc, errorFunc, thenFunc)
                },
                update_article: function (e, t, i, n, a, s, successFunc, errorFunc, thenFunc) {
                    put("/api/blog/articles/" + e, {
                        title: t,
                        category_id: s,
                        permalink: a,
                        summary: i,
                        content: n
                    }, successFunc, errorFunc, thenFunc)
                },
                delete_article: function (e, successFunc, errorFunc, thenFunc) {
                    del("/api/blog/articles/" + e, successFunc, errorFunc, thenFunc)
                }
            },
            share: {
                recommand: function (e, t, successFunc, errorFunc, thenFunc) {
                    post("/api/share/recommand", {
                        email: e,
                        message: t
                    }, successFunc, errorFunc, thenFunc)
                }
            },
            google: {
                show_ips: function (successFunc, errorFunc, thenFunc) {
                    get("/api/dynamic/googleips/show", successFunc, errorFunc, thenFunc);
                },
                add_ips: function (ips, successFunc, errorFunc, thenFunc) {
                    post("/api/dynamic/googleips/set", ips, successFunc, errorFunc, thenFunc);
                },
                remove_ip: function (ip, successFunc, errorFunc, thenFunc) {
                    del("/api/dynamic/googleips/remove?ip=" + ip, successFunc, errorFunc, thenFunc);
                }
            },
            email: {
                /**
                 * 按组群发
                 * projectsInfo ::
                 * [
                 * {pid:String,
                 * type:Int,
                 * rejectedTaskId:[taskid::string,...]},
                 * ...]
                 * mailInfo:{
                 * }
                 * */
                projectsBatchMailSending: function (projectsInfo, mailInfo, successFunc, errorFunc, thenFunc) {
                    post("/api/emails/batch/send",
                        {
                            name: mailInfo.subject,
                            content: mailInfo.content,
                            from: mailInfo.from,
                            projectsId: projectsInfo
                        }, successFunc, errorFunc, thenFunc);
                },
                /**
                 *
                 * @param pid  组id，可选
                 * @param subject 主题
                 * @param content 文本内容
                 * @param watchers 无关紧要
                 * @param mailAddressList 邮件地址列表，后台没有检测，传入前必须确保为合法邮件
                 * @param from  发件人的信息
                 * @param templateId 使用的模板id
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                batchSendWithoutCustomer: function (pid, subject, content, watchers, mailAddressList, from, templateId, successFunc, errorFunc, thenFunc) {
                    var url = "/api/emails/batch_send/no_customer";
                    post(url, {
                        name: subject,
                        content: content,
                        watchers: watchers,
                        mailAddressList: mailAddressList,
                        from: from,
                        templateId: templateId
                    }, successFunc, errorFunc, thenFunc)
                },
                /**
                 * 管理员批量发送邮件
                 * @param mails
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                sys_batch_send: function (mails, successFunc, errorFunc, thenFunc) {
                    post("/api/emails/batch/sending", mails, successFunc, errorFunc, thenFunc);
                },

                set_invalid_mails: function (mails, iswhite, successFunc, errorFunc, thenFunc) {
                    post("/api/mails/blackMailList/add?iswhite=" + iswhite, mails, successFunc, errorFunc, thenFunc);
                },

                check: function (email, successFunc, errorFunc, thenFunc) {
                    get("/api/mails/address/check?email=" + email, successFunc, errorFunc, thenFunc);
                },
                export: function (email_list, successFunc, errorFunc, thenFunc) {
                    var url = "/api/mails/address/export";
                    post(url, {
                        list: email_list
                    }, successFunc, errorFunc, thenFunc);
                },
                user_check: function (email, successFunc, errorFunc, thenFunc) {
                    get("/api/mails/address/user_check?email=" + email, successFunc, errorFunc, thenFunc);
                },
                removeBlackMailList: function (email, successFunc, errorFunc, thenFunc) {
                    del("/api/mails/blackmaillist?email=" + email, successFunc, errorFunc, thenFunc);
                },

                add: function (pid, subject, content, watchers, tasks, from, templateId, a, o, r) {
                    var url = "/api/emails?pid=" + pid;
                    post(url, {
                        name: subject,
                        content: content,
                        watchers: watchers,
                        tasks: tasks,
                        from: from,
                        templateId: templateId
                    }, a, o, r)
                },
                get_email: function (e, t, i, n, s) {
                    get("/api/emails/" + t + "?pid=" + e, i, n, s)
                },
                get_list: function (e, t, i, n, s, o, r, l, c) {
                    var u = "/api/emails?pid=" + e + "&since_id=" + t + "&count=" + i + "&sort=" + n + "&desc=" + s + "&type=" + o;
                    get(u, r, l, c)
                },
                update: function (e, t, i, n, a, s, o) {
                    var l = "/api/emails/" + t + "?pid=" + e;
                    put(l, {
                        name: i,
                        content: n
                    }, a, s, o)
                },
                trash: function (e, t, i, n, a) {
                    put("/api/emails/" + t + "/trash?pid=" + e, null, i, n, a)
                },
                untrash: function (e, t, i, n, a) {
                    put("/api/emails/" + t + "/restore?pid=" + e, null, i, n, a)
                },
                del: function (e, t, i, n, a) {
                    del("/api/emails/" + t + "?pid=" + e, i, n, a)
                },
                get_all_list: function (e, t, i, n, s) {
                    get("/api/emails/browse?type=" + e + "&page=" + t, i, n, s)
                },
                batch_delete: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/emails/batch_delete", {
                        ids: e
                    }, successFunc, errorFunc, thenFunc)
                },
                share: function (e, t, i, n, a, o) {
                    post("/api/emails/" + t + "/share?pid=" + e, {
                        to: i
                    }, n, a, o)
                }
            },
            mail: {
                in_publish: function (e, t, i, n, n1, a, successFunc, errorFunc, thenFunc) {
                    post("/api/" + t + "/" + i + "/mail?pid=" + e, {
                        name: n1,
                        message: n,
                        fids: a
                    }, successFunc, errorFunc, thenFunc)
                },
                in_get_list: function (e, t, i, successFunc, errorFunc, thenFunc) {
                    get("/api/" + t + "/" + i + "/mails?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                in_del: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    del("/api/" + i + "/" + n + "/mails/" + t + "?pid=" + e, successFunc, errorFunc, thenFunc)
                },
                in_update: function (e, t, i, n, a, successFunc, errorFunc, thenFunc) {
                    put("/api/" + i + "/" + n + "/mails/" + t + "?pid=" + e, {
                        message: a
                    }, successFunc, errorFunc, thenFunc)
                },

                get_list: function (e, t, orderKey, isDESC, successFunc, errorFunc, thenFunc) {
                    get("/api/mails?page=" + e + "&category=all&is_read=" + t + "&orderKey=" + orderKey + "&isDESC=" + isDESC, successFunc, errorFunc, thenFunc)
                },
                get_mails: function (uid, data, successFunc, errorFunc, thenFunc) {
                    var url = "/api/mails/" + uid + "/user";
                    var count = 0;
                    for (var key in data) {
                        if (data[key]) {
                            if (count == 0) {
                                url += "?" + key + "=" + data[key];
                            } else {
                                url += "&" + key + "=" + data[key];
                            }
                            count++;
                        }
                    }
                    get(url, successFunc, errorFunc, thenFunc);
                },

                /**
                 * 根据用户获取已发邮件数量
                 * @param uid
                 * @param data
                 * @param successFunc
                 * @param errorFunc
                 * @param thenFunc
                 */
                get_mail_groupcounts: function (uid, data, successFunc, errorFunc, thenFunc) {
                    var url = "/api/mails/groupcounts/" + uid + "/user";
                    var count = 0;
                    for (var key in data) {
                        if (data[key]) {
                            if (count == 0) {
                                url += "?" + key + "=" + data[key];
                            } else {
                                url += "&" + key + "=" + data[key];
                            }
                            count++;
                        }
                    }
                    get(url, successFunc, errorFunc, thenFunc);
                },

                get: function (e, successFunc, errorFunc, thenFunc) {
                    get("/api/mails/" + e, successFunc, errorFunc, thenFunc)
                },
                trash: function (e, successFunc, errorFunc, thenFunc) {
                    del("/api/mails/" + e, successFunc, errorFunc, thenFunc)
                },
                batch_delete: function (e, successFunc, errorFunc, thenFunc) {
                    put("/api/mails/batch_delete", {
                        ids: e
                    }, successFunc, errorFunc, thenFunc)
                },
                convert: function (e, t, i, n, successFunc, errorFunc, thenFunc) {
                    put("/api/mails/" + t + "/convert", {
                        pid: e,
                        watchers: n,
                        type: i
                    }, successFunc, errorFunc, thenFunc)
                },
                set_read: function (e, t, i, n) {
                    //r("/api/mails/" + e + "/read", null, httpMethod, i, n)
                }
            }
            ,
            admin: {
                get_mail_status: function (userId, startDate, endDate, successFunc, errorFunc, thenFunc) {
                    get("/api/admin/statistics/mail?userId=" + userId + "&startDate=" + startDate + "&endDate=" + endDate, successFunc, errorFunc, thenFunc)
                },
                get_customer_status: function (userId, startDate, endDate, successFunc, errorFunc, thenFunc) {
                    get("/api/admin/statistics/customer?userId=" + userId + "&startDate=" + startDate + "&endDate=" + endDate, successFunc, errorFunc, thenFunc)
                },
                get_template_status: function (userId, startDate, endDate, successFunc, errorFunc, thenFunc) {
                    get("/api/admin/statistics/template?userId=" + userId + "&startDate=" + startDate + "&endDate=" + endDate, successFunc, errorFunc, thenFunc)
                },
                get_score_status: function (userId, startDate, endDate, successFunc, errorFunc, thenFunc) {
                    get("/api/admin/statistics/score?userId=" + userId + "&startDate=" + startDate + "&endDate=" + endDate, successFunc, errorFunc, thenFunc)
                },
                get_user_byname: function (userName, successFunc, errorFunc, thenFunc) {
                    get("/api/admin/userInfo/userName/" + userName, successFunc, errorFunc, thenFunc)
                },
                get_user_byemail: function (email, successFunc, errorFunc, thenFunc) {
                    get("/api/admin/userInfo/email/" + email, successFunc, errorFunc, thenFunc)
                }
            },
            test: {
                get: get,
                post: post,
                put: put,
                del: del
            }
        }
    }
]).factory("utility", [
    function () {
        "use strict";
        return {
            load_data_by_page: function (e, t, i) {
                t.has_more = false, t.loaded = false, e(function (e) {
                    angular.isFunction(i) && i(e), e.length === kzi.config.default_count && (t.has_more = true), t.loaded = true
                })
            },

            /**
             * 清空登录信息
             */
            clear_login_info: function () {
                window.sessionStorage.removeItem("token");
                window.sessionStorage.removeItem("uid");
                window.sessionStorage.removeItem("role");
                window.sessionStorage.removeItem("name");
                window.sessionStorage.removeItem("mainIndustryCode");
                window.sessionStorage.removeItem("subIndustryCode");
                window.sessionStorage.removeItem("mainIndustryName");
                window.sessionStorage.removeItem("subIndustryName");
                window.sessionStorage.removeItem("score");
                window.sessionStorage.removeItem("reply_email");
                window.sessionStorage.removeItem("companyName");
                window.sessionStorage.removeItem("display_name");
                window.sessionStorage.removeItem("email");
                window.sessionStorage.removeItem("search_setting");
                window.sessionStorage.removeItem("defaultTemplate");
//                window.localStorage.removeItem("login_kdd");
            },
            notice: {
                load_notices: function (e, t) {
                    wt.utility.load_data_by_page(e, t, function (e) {
                        t.notices = _.isEmpty(t.notices) ? e : t.notices.concat(e)
                    })
                }
            },
            activity: {
                set_default_settings: function (e, t) {
                    var i = t.last_date;
                    _.each(e, function (e) {
                        var t = moment(e.published).format("YYYY-MM-DD");
                        t === i ? e.is_show_date = false : (e.is_show_date = true, i = t)
                    }), t.last_date = i
                },
                load_activities: function (load, scope, i) {
                    load(function (data) {
                        wt.utility.activity.set_default_settings(data, scope);
                        scope.activities = _.isEmpty(scope.activities) ? data : scope.activities.concat(data);
                        scope.has_more = data.length === kzi.config.default_count ? true : false, _.isFunction(i) && i()
                    })
                }
            },
            team: {
                filter_members_by_selected_group: function (e, t) {
                    _.each(e, function (e) {
                        return null === t || t.is_all ? (e.is_show = true, void 0) : (e.is_show = e.group_id === t.group_id ? true : false, void 0)
                    })
                },
                set_default_team_members: function (e) {
                    _.each(e, function (e) {
                        e.is_show = true
                    })
                }
            }
        }
    }
]).factory("socket", ["$rootScope",
    function (e) {
        "use strict";
        var t = io.connect(kzi.config.socket_url());
        return {
            on: function (i, n) {
                t.on(i, _.throttle(function () {
                    var i = arguments;
                    e.$apply(function () {
                        n.apply(t, i)
                    })
                }, 500))
            },
            emit: function (i, n, a) {
                t.emit(i, n, function () {
                    var i = arguments;
                    e.$apply(function () {
                        a && a.apply(t, i)
                    })
                })
            }
        }
    }
]).service('stompService', function () {
    var socket = new SockJS("/api/socket");
    return Stomp.over(socket);
}).factory('editorPreview', [
    function () {
        "use strict";
        return {
            previewedOrNot: false
        }
    }]).factory('projectsInfo', function () {
    "use strict";
    var exports = {
        projects: [],
        defaultPid: ''
    }
    wt.data.project.get_all("active", function (res) {
        exports.projects = res.data;
        if (!_.isEmpty(res.data)) {
            exports.defaultPid = res.data[0].pid;
        }
    })
    return exports;
}).factory("reconsittuation", [function () {
        "use strict";
        function Atom(type, body, parent) {
            this.type = type || 'constant';
            this.body = (body = body || [], _.isArray(body) ? body : [body]);
            this.used = [];
            this.parent = parent;//父节点
            this.variables = []; //已有哪些变量
        }

        _.extend(Atom.prototype, {
            setBody: function (body) {
                this.body = _.isEmpty(this.body) ? (_.isArray(body) ? body : [body]) : (this.body.push(body), this.body);
                if (!body.getParent()) {
                    body.parent = this;
                }
//                _.union(this.variables, body.variables)
            },
            setType: function (type) {
                this.type = type || 'constant';
            },
            setUsed: function (num) {
                this.used.push(num);
            },
            clear: function () {
                this.type = 'constant';
                this.body = [];
            },
            size: function () {
                return this.body.length;
            },
            clone: function () {
                return _.extend(new Atom(), this);
            },
            drop: function (index) {
                this.body.split(index, 1);
            },
            getParent: function () {
                if (!this.parent) {
                    console.log("已到根节点");
                }
                return this.parent;
            }
        })
        /**
         * 辅助类--带有变量位置信息的对象
         * @constructor
         */
        function VarPosition() {
            this.content = "";
            this.type = ""; // constant | multi;
            this.position = null;
        }

        _.extend(VarPosition.prototype, {
            getVariable: function () {
                return this.content;
            },
            getPosition: function () {
                if (this.position == null) {
                    console.log("没有位置信息!")
                }
                return this.position;
            }
        })
        /*
         辅助类--字符栈
         --用以匹配成对的{}
         */
        function Stack() {
            this.data = [];
            this.pre = [];
            this.parentAtom = null; //当前父节点
        }

        _.extend(Stack.prototype, {
            push: function (char) {
                this.pre = _.clone(this.data);
                this.data.push(char)
            },
            pop: function () {
                this.data.pop();
            },
            getCurrent: function () {
                var t = _.clone(this.data.join(''));
                return t;
            },
            clear: function () {
                this.data = [];
            },
            getPre: function () {
                return _.clone(this.pre.join(''));
            },
            setParentAtom: function (atom) {
                this.parentAtom = atom;
            },
            getParent: function () {
                return this.parentAtom;
            }
        })
        /*
         simple lexer and construct abstract syntax tree
         String -> Atom
         {abc|def|g} --> [abc,def,g]
         --refactoring at Feb 2nd,marked as v0.1
         curring,divide the partial arguments which are used undirectly to be more clear

         */
        function unwrapper(data) {
            var exports = new Atom('multi', []);
            var stack = new Stack();
            var length = data.length;
            var flag = 0;
            var isVariable = false;
            var temp_atom = new Atom();
            var inner_atom = new Atom();
            _.forEach(data.slice(1, data.length - 1).split(''), function (item, index) {
                stack.push(item);
                //到达尾部
                if (index == length - 3) {
                    // 多子的的节点
                    if (inner_atom.size() > 0) {
                        //fixme 这里的判断不够准确，可能是导致吞末尾字符的原因所在
                        //可将终结符添加为两个字符来解决，比如 ｛ /｝
                        stack.getPre() && inner_atom.setBody(new Atom('constant', stack.getPre()))
                        exports.setBody(inner_atom.clone());
                        inner_atom.clear();
                    }
                    // 单子的节点
                    else {
                        temp_atom.setType('constant');
                        temp_atom.setBody(stack.getCurrent());
                        stack.clear();
                        exports.setBody(temp_atom.clone());
                        temp_atom.clear();
                    }
                }
                if (_.isEqual(item, '{')) {
                    flag++;
                }
                if (_.isEqual(item, '}')) {
                    flag--;
                }
                // 1{ 2| 3{ 4| 5} 6}  --->  | { | }  :: match 外层 2|   structure  Atom
                if ((_.isEqual(item, '|')) && flag == 0 && isVariable == false) {
                    //多子节点
                    if (inner_atom.size() > 0) {
                        stack.getPre() && inner_atom.setBody(new Atom('constant', stack.getPre()))
                        exports.setBody(inner_atom.clone());
                        inner_atom.clear();
                        stack.clear();
                    }
                    //单子节点
                    else {
                        temp_atom.setType('constant');
                        temp_atom.setBody(stack.getPre());
                        stack.clear();
                        exports.setBody(temp_atom.clone());
                        temp_atom.clear();
                    }
                }
                // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 内层 3{ then structure Atom
                if (flag == 1 && isVariable == false) {
                    inner_atom.setType('constant');
                    inner_atom.setBody(new Atom('constant', _.clone(stack.getPre())));
                    stack.clear();
                    stack.push(item);
                }
                // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 内层 3{ 5} 之间的内容 -- 跳过
                if (flag == 1 && isVariable == true) {
                    //skip
                }
                // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 5} 递归调用
                if (flag == 0 && isVariable == true) {
                    inner_atom.setBody(unwrapper(stack.getCurrent()))
                    stack.clear()
                }
                if (_.isEqual(item, '{') && flag > 0) {
                    isVariable = true;
                }
                if (_.isEqual(item, '}') && flag == 0) {
                    isVariable = false;
                }
            });
            return exports
        };
    }]
).factory("wtPrompt", ["$modal", "$location", function ($modal, $location) {
        "use strict";
        var exports = {
            prompt: {
                beforeSendEmail: beforeSendEmail
            }
        }
        var hasOpen = false;

        function beforeSendEmail(func) {
            if (hasOpen == true) return;
            hasOpen = true;
            $modal.open({
                templateUrl: "/view/modal/pop_before_send_mail.html",
                controller: ['$scope', '$modalInstance', '$timeout', '$rootScope', function ($scope, $modalInstance, $timeout, $rootScope) {
                    $scope.beforeSendingMail = $scope;
                    $scope.close = function () {
                        $modalInstance.close();
                        hasOpen = false;
                    }
                    $scope.writeByMyself = function () {
                        if (!_.isFunction(func)) {
                            throw new TypeError();
                        }
                        _.isFunction(func) && (func(), $scope.close());
                    }
                    $scope.writeByGenerator = function () {
                        $scope.close();
                        $timeout(function () {
                            $rootScope.$broadcast(kzi.constant.event_names.open_template_generator, {});
                        }, 500);
                    }
                }]
            })
        }

        return exports;
    }]).factory("googleIP", ['$http', function ($http) {
        "use strict";
        var exports = {
            ip: ''
        }

        function getIP() {

        }

        return exports;
    }]
).factory("parseFactory", function () {
        "use strict";

        var exports = {
            parseRootToTree: parser,
            makeGenerator: makeGenerator
        }

        function Tree() {
            this.children = [];
            this.parent = null;
            this.variables = [];
            this.type = null;
            this.isEnd = false;
            this.endString = null;
            this.index = null;
        }

        _.extend(Tree.prototype, {
            setType: function (type) {
                this.type = type;
            },
            getType: function () {
                return this.type;
            },
            setParent: function (parent) {
                this.parent = parent;
            },
            getParent: function () {
                return this.parent;
            },
            setChildren: function (treeArray) {
                this.children = treeArray;
            }
        });
        /*
         辅助类--字符栈
         --用以匹配成对的{}
         */
        function Stack() {
            this.data = [];
            this.pre = [];
        }

        _.extend(Stack.prototype, {
            push: function (char) {
                this.pre = _.clone(this.data);
                this.data.push(char);
            },
            pop: function () {
                this.data.pop();
            },
            getCurrent: function () {
                var t = _.clone(this.data.join(''));
                return t;
            },
            clear: function () {
                this.data = [];
            },
            getPre: function () {
                return _.clone(this.pre.join(''));
            }
        })

        //parser:: String s => s -> Tree
        function parser(string) {
            //hasVariable:: String -> [Variable]
            //Variable: "[.*]"
            function hasVariable(str) {
                return str.match(/\[.*?\]/g);
            }

            //preProcessVertical:: String s => {s} -> [s,s..]
            //preProcessVertical {a|b|c} = [a,b,c]
            function preProcessVertical(str) {
                var stack = new Stack();
                var srcArray = str.slice(1, str.length - 1).split('')
                var leftBraceCount = 0;
                var exports = [];
                var hasBrace = false;
                _.forEach(srcArray, function (i, index) {
                    stack.push(i);
                    if (i === "{") {
                        leftBraceCount++;
                        hasBrace = true;
                    }
                    if (i === "}") {
                        leftBraceCount--;
                    }
                    if (leftBraceCount > 0) {
                        //continue
                    }
                    if (leftBraceCount === 0) {
                        if (i === "|") {
                            exports.push({
                                hasBrace: hasBrace,
                                src: stack.getPre()
                            });
                            stack.clear();
                            hasBrace = false;
                        }
                        if (index === srcArray.length - 1) {
                            exports.push({
                                hasBrace: hasBrace,
                                src: stack.getCurrent()
                            })
                            stack.clear();
                            hasBrace = false;
                        }
                    }
                })
                return exports;
            }

            //preProcessBrace::String str=> str->[str]
            //PreProcessBrace ab{cd}ef = [ab,{cd},ef]
            function preProcessBrace(str) {
                var srcArray = str.split("");
                var stack = new Stack();
                var braceCount = 0;
                var exports = [];
                var isVariable = false;
                _.forEach(srcArray, function (i, index) {
                    stack.push(i);
                    if (i === '{') {
                        braceCount++;
                    }
                    if (i === '}') {
                        braceCount--;
                    }
                    //first left brace,push the string pushed to stack before into exports
                    if (i === '{' && braceCount === 1) {
                        exports.push({
                            isVariable: isVariable,
                            src: stack.getPre()
                        });
                        stack.clear();
                        stack.push(i);
                        isVariable = true;
                    }
                    if (i === '}' && braceCount === 0 || index === srcArray.length - 1) {
                        exports.push({
                            isVariable: isVariable,
                            src: stack.getCurrent()
                        });
                        isVariable = false;
                        stack.clear();
                    }
                })
                return exports;
            }

            //syncVariableInfo:: tree::Tree -> variables::Object -> #void
            //side-effect,  writting in haskell is unvariable for me temporaryly
            function syncVariableInfo(tree, variables, index) {
                if (tree == null) {
                    return void 0;
                } else {
                    tree.variables[index] = variables;
                    syncVariableInfo(tree.parent, tree.variables, tree.index);
                }
            }

            //strToTree::  {String} -> tree -> Tree
            //strToTree str tree = new Tree(type = multi,body = [strToTree(str)],parent = tree)
            //fixme change to curring
            function strToTree(str, parent, index) {
                if (str[0] != '{' || str[str.length - 1] != '}') {
                    throw new Error("args doesn't start with '{',or end with '}'----" + '\r\n' + str);
                }
                var exports = new Tree();
                exports.setType("multi");
                exports.parent = parent;
                exports.index = index;
                var srcArray = preProcessVertical(str);
                exports.setChildren(_.map(srcArray, function (i, index) {
                    var tree = new Tree();
                    tree.parent = exports;
                    tree.index = index;
                    if (i.hasBrace) {
                        tree.setType('constant');
                        tree.setChildren(_.map(preProcessBrace(i.src), function (m, index) {
                                var tr = new Tree()
                                if (m.isVariable) {
                                    return strToTree(m.src, tree, index);
                                } else {
                                    tr.isEnd = true;
                                    tr.endString = m.src;
                                    return tr;
                                }
                            })
                        )
                        return tree;
                    } else {
                        tree.isEnd = true;
                        tree.endString = i.src;
//                        if(hasVariable(i.src)) {
                        syncVariableInfo(tree.parent, hasVariable(i.src), index)
//                        }
                        return tree;
                    }
                }))

                return exports;
            }

            return strToTree(string, null, null);
        }

        //generateTemplate::  { key : string -> bool } -> tree -> string
        //generateTemplate fn tree -> | tree.isEnd = true  tree.endString
        //                          | tree.
        function makeGenerator(options) {
            if (options.filterFn != null && !_.isFunction(options.filterFn)) {
                throw new TypeError("options's key filterFn should be a function,but given:" + typeof options.filterFn)
            }
            if (options.rejectFn != null && !_.isFunction(options.rejectFn)) {
                throw new TypeError("options's key rejectFn should be a function,but given:" + typeof options.rejectFn)
            }
            //pollyfill
            var judge = {
                filterFn: options.filterFn || function () {
                    return true
                },
                rejectFn: options.rejectFn || function () {
                    return false
                },
                whichIsOk: function (tree) {
                    if (tree.type !== 'multi') {
                        throw new Error("tree should be multi,but given: " + tree.type);
                    }
                    if (tree.variables.length === 0) {
                        return _.random(tree.variables.length - 1)
                    }
                    var temp = _.chain(tree.variables)
                        .map(function (i, index) {
                            return {
                                src: _.flatten(i),
                                index: index,
                                weight: judge.filterFn(_.flatten(i))
                            }
                        }).value();
                    var qualified = _.chain(temp).filter(function (i) {
                        console.log(_.max(temp, function (i) {
                            return i.weight;
                        }).weight);
                        return _.max(temp, function (i) {
                                return i.weight;
                            }).weight == i.weight;
                    }).value();
                    return qualified[_.random(qualified.length - 1)].index;
//                  return (_.isUndefined(qualified) && qualified.length>0) ? qualified[_.random(qualified.length-1)] : _.random(tree.children.length - 1);
                }
            };

            var treeToString = function (tree) {
                if (!(tree instanceof  Tree)) {
                    throw new TypeError("args isn't a instance of Tree");
                }
                if (tree.isEnd === true) {
                    return tree.endString;
                }
                if (tree.type === 'constant') {
                    return _.chain(tree.children).reduce(function (mem, i) {
                        return mem + treeToString(i);
                    }, '').value();
                }
                if (tree.type === 'multi') {
                    return treeToString(tree.children[judge.whichIsOk(tree)]);
                }
            }

            return treeToString;
        }

        return exports;
    }
).factory("templateNewGeneratorInfo1", ["parseFactory", "$http", "$q",
        function (parseFactory, $http, $q) {
            "use strict";
            var deferred = new $q.defer();
            var exports = {
                template: [],
                templateAtom: {},
                templateAtomTitle: {},
                getData: getData,
                //随即生成标题
                generateTitle: generateTitle,
                //随即生成正文
                generate: generateContent,
//            generateContentWithArray: generateContentWithArray,
//            generateTitleWithArray: generateTitleWithArray,
                getDataPromise: deferred.promise
            }

            function generateContent(unused, filterFn, rejectFn) {
                return giveMeAGenerator({
                    filterFn: filterFn,
                    rejectFn: rejectFn
                })(exports.templateAtom)
            }

            function generateTitle(unused, filterFn, rejectFn) {
                return giveMeAGenerator({
                    filterFn: filterFn,
                    rejectFn: rejectFn
                })(exports.templateAtomTitle)
            }

            //giveMeAGenerator::{key:function} options => options -> (tree->string)
            //side-effect
            function giveMeAGenerator(options) {
                var default_options = {
                    filterFn: null,
                    rejectFn: null
                }
                _.extend(default_options, options);
                return parseFactory.makeGenerator(default_options);
            }

            function getData(successFn, errorFn, thenFn) {
                $http.get("/json/templateGenerator.json")
                    .success(successFn)
                    .error(errorFn)
                    .then(thenFn);
            }

            getData(function (res) {
                exports.template = res.data;
                //取得数据后立即生成语法树用以缓存
                exports.templateAtom = parseFactory.parseRootToTree('{' + exports.template[1].body.join('') + '}');
                exports.templateAtomTitle = parseFactory.parseRootToTree(exports.template[1].name);
                deferred.resolve();
            })

            return exports;

            //
        }]
).factory('templateNewGeneratorInfo', ["$http", "$q",
        function ($http, $q) {
            "use strict";
            var deferred = new $q.defer();
            var exports = {
                template: [],
                templateAtom: {},
                templateAtomTitle: {},
                /*                randomGenerate: randomGenerate,
                 generateWithArray: generateWithArray,
                 unwrapper: unwrapper,*/
                getData: getData,
                //随即生成标题
                generateTitle: generateTitle,
                //随即生成正文
                generate: generate,
                generateContentWithArray: generateContentWithArray,
                generateTitleWithArray: generateTitleWithArray,
                getDataPromise: deferred.promise
            }
            /*
             节点类
             String->Array->{_:String,_:Array}
             */
            function Atom(type, body) {
                this.type = type || 'constant';
                this.body = (body = body || [], _.isArray(body) ? body : [body]);
                this.used = [];
                this.parent = null;
            }

            _.extend(Atom.prototype, {
                setBody: function (body) {
                    this.body = _.isEmpty(this.body) ? (_.isArray(body) ? body : [body]) : (this.body.push(body), this.body);
                },
                setType: function (type) {
                    this.type = type || 'constant';
                },
                setUsed: function (num) {
                    this.used.push(num);
                },
                clear: function () {
                    this.type = 'constant';
                    this.body = [];
                },
                size: function () {
                    return this.body.length;
                },
                clone: function () {
                    return _.extend(new Atom(), this);
                },
                drop: function (index) {
                    this.body.split(index, 1);
                }
            })
            /*
             辅助类
             */
            function Stack() {
                this.data = [];
                this.pre = [];
            }

            _.extend(Stack.prototype, {
                push: function (char) {
                    this.pre = _.clone(this.data);
                    this.data.push(char)
                },
                pop: function () {
                    this.data.pop();
                },
                getCurrent: function () {
                    var t = _.clone(this.data.join(''));
                    return t;
                },
                clear: function () {
                    this.data = [];
                },
                getPre: function () {
                    return _.clone(this.pre.join(''));
                }
            })
            /*
             simple lexer and construct abstract syntax tree
             String -> Atom
             {abc|def|g} --> [abc,def,g]
             */
            function unwrapper(data) {
                var exports = new Atom('multi', []);
                var stack = new Stack();
                var length = data.length;
                var flag = 0;
                var isVariable = false;
                var temp_atom = new Atom();
                var inner_atom = new Atom();
                _.forEach(data.slice(1, data.length - 1).split(''), function (item, index) {
                    stack.push(item);
                    //到达尾部
                    if (index == length - 3) {
                        if (inner_atom.size() > 0) {
                            stack.getPre() && inner_atom.setBody(new Atom('constant', stack.getPre()))
                            exports.setBody(inner_atom.clone());
                            inner_atom.clear();
                        } else {
                            temp_atom.setType('constant');
                            temp_atom.setBody(stack.getCurrent());
                            stack.clear();
                            exports.setBody(temp_atom.clone());
                            temp_atom.clear();
                        }
                    }
                    if (_.isEqual(item, '{')) {
                        flag++;
                    }
                    if (_.isEqual(item, '}')) {
                        flag--;
                    }
                    // 1{ 2| 3{ 4| 5} 6}  --->  | { | }  :: match 外层 2|   structure  Atom
                    if ((_.isEqual(item, '|')) && flag == 0 && isVariable == false) {
                        if (inner_atom.size() > 0) {
                            stack.getPre() && inner_atom.setBody(new Atom('constant', stack.getPre()))
                            exports.setBody(inner_atom.clone());
                            inner_atom.clear();
                            stack.clear()
                        } else {
                            temp_atom.setType('constant');
                            temp_atom.setBody(stack.getPre());
                            stack.clear();
                            exports.setBody(temp_atom.clone());
                            temp_atom.clear();
                        }
                    }
                    // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 内层 3{ then structure Atom
                    if (flag == 1 && isVariable == false) {
                        inner_atom.setType('constant');
                        inner_atom.setBody(new Atom('constant', _.clone(stack.getPre())));
                        stack.clear();
                        stack.push(item);
                    }
                    // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 内层 3{ 5} 之间的内容 -- 跳过
                    if (flag == 1 && isVariable == true) {
                        //skip
                    }
                    // 1{ 2| 3{ 4| 5} 6} match  ---> | { | } :: match 5} 递归调用
                    if (flag == 0 && isVariable == true) {
                        inner_atom.setBody(unwrapper(stack.getCurrent()))
                        stack.clear()
                    }
                    if (_.isEqual(item, '{') && flag > 0) {
                        isVariable = true;
                    }
                    if (_.isEqual(item, '}') && flag == 0) {
                        isVariable = false;
                    }
                });
                return exports
            };
            /*
             再次封装提交一个可以获取更少细节的polyfill接口
             内部做了两个判断为server增加一层shell
             array[->predicateFn]->String
             arrayHook:用以存放得到的字符串对应的位置序列
             predicate:用以过滤的条件函数
             eg.
             function testFn(str) {
             if (str.match(/\[公司产品\]/) ||
             str.match(/\[收件人\]/) ||
             str.match(/\[产品认证\]/) ||
             str.match(/\[公司名称\]/)) {
             return true;
             } else {
             return false;
             }
             }
             */
            function generate(arrayHook, predicate) {
                arrayHook = arrayHook || [];
                if (_.isFunction(predicate)) {
                    return randomGenerate(arrayHook, this.templateAtom, predicate);
                } else {
                    return randomGenerate(arrayHook, this.templateAtom);
                }
            }

            function generateTitle(arrayHook, predicate) {
                arrayHook = arrayHook || [];
                if (_.isFunction(predicate)) {
                    return randomGenerate(arrayHook, this.templateAtomTitle, predicate);
                } else {
                    return randomGenerate(arrayHook, this.templateAtomTitle);
                }
            }

            function generateContentWithArray(array, predicate) {
                array = array || [];
                if (_.isFunction(predicate)) {
                    return generateWithArray(array, this.templateAtom, predicate);
                } else {
                    return generateWithArray(array, this.templateAtom);
                }
            }

            function generateTitleWithArray(array, predicate) {
                array = array || [];
                if (_.isFunction(predicate)) {
                    return generateWithArray(array, this.templateAtomTitle, predicate);
                } else {
                    return generateWithArray(array, this.templateAtomTitle);
                }
            }

            /*
             解析AST的parser,对{|}采用随机生成的形式
             array->sourceTree->predicateFn
             arrayHook:用以存放得到的字符串对应的位置序列
             predicate:用以过滤的条件函数
             这里接受两种方式来生成遍历序列：完全随机生成 和 带有过滤条件的随机生成
             */
            //生成开发信 atom->([],@string)
            function randomGenerate(arrayHook, atom, predicate) {
                var totalCount = 0;

                function generate(atom, predicate) {
                    if (totalCount > 200000) {
                        throw new Error("超过最大迭代次数:" + totalCount)
                    }
                    if (_.isEqual(atom.type, 'constant')) {
                        return _.chain(atom.body).reduce(function (mem, item) {
                            if (item instanceof Atom) {
                                return mem + generate(item, predicate);
                            } else {
                                return mem + item;
                            }
                        }, '').value()
                    }
                    if (_.isEqual(atom.type, 'multi')) {
                        var num = Math.ceil(Math.random() * atom.size()) - 1;
                        arrayHook.push(num);
                        var str = generate(atom.body[num], predicate);
                        //如果传递了第三个参数，就以此做判断
                        if (_.isFunction(predicate)) {
                            var count = 0;
                            var trigger = true;
                            while (trigger && predicate(str)) {
                                num = Math.ceil(Math.random() * atom.size()) - 1;
                                arrayHook.pop();
                                arrayHook.push(num);
                                str = generate(atom.body[num], predicate);
                                count++;
                                totalCount++;
                                if (count > 200) {
                                    trigger = false;
                                    console.log("超过最大迭代次数--随机选择一个字串")
                                }
                            }
                        }
                        return str;
                    }
                }

                return generate(atom, predicate);
            }

            /*
             用字符串序列和AST还原遍历序列
             array：位置数组
             atom：AST
             */
            //[]->atom->string
            function generateWithArray(array, atom, predicate) {
                if (_.isEqual(atom.type, 'constant')) {
                    return _.chain(atom.body).reduce(function (mem, item) {
                        if (item instanceof Atom) {
                            return mem + generateWithArray(array, item, predicate);
                        } else {
                            return mem + item;
                        }
                    }, '').value()
                }
                if (_.isEqual(atom.type, 'multi')) {
                    var num = array.shift();
                    var str = generateWithArray(array, atom.body[num], predicate);
                    //如果传递了条件函数，就以此筛选
                    if (_.isFunction(predicate)) {
                        var count = 0;
                        while (predicate(str)) {
                            num = Math.ceil(Math.random() * atom.size()) - 1;
                            str = generateWithArray(array, atom.body[num], predicate);
                            count++;
                            if (count > 200) throw new Error("超过迭代次数：200");
                        }
                    }
                    /* if(_.isFunction(predicate)) {
                     var num = array.shift();
                     var str = generateWithArray(array, atom.body[num], predicate);
                     } else {
                     do {
                     var num = array.shift();
                     var str = generateContentWithArray(array, atom.body[num],predicate);

                     } while(predicate(str));
                     }*/
                    return str;
                }
            }

            function getData(successFn, errorFn, thenFn) {
                $http.get("/json/templateGenerator.json")
                    .success(successFn)
                    .error(errorFn)
                    .then(thenFn);
            }

            getData(function (res) {
                exports.template = res.data;
                //取得数据后立即生成语法树用以缓存
                exports.templateAtom = unwrapper('{' + exports.template[0].body.join('') + '}');
                exports.templateAtomTitle = unwrapper(exports.template[0].name);
                deferred.resolve();
            })

            return exports;
        }]
).factory('mailPreview', ['$rootScope', '$modal', function ($rootScope, $modal) {
        $rootScope.$on("mailPreview.info_is_ready", function (event, msg_info) {
            var mail_info = {
                sender_info: msg_info.mail_info.sender_info,
                recipient_info: msg_info.mail_info.recipient_info,
                content_info: msg_info.mail_info.content_info,
                title_info: msg_info.mail_info.title_info,
                hasNext: msg_info.has_next,
                hasPrevious: msg_info.has_previous,
                groupSend: msg_info.groupSend
            };
            $modal.open({
                scope: $rootScope,
                size: 'lg',
                templateUrl: '/view/modal/sending_mail_page__mail_preview.html',
                controller: ['$scope', function ($scope) {
                    $scope.mail_info = mail_info;
                    $scope.property = {
                        hasNext: mail_info.hasNext,
                        hasPrevious: mail_info.hasPrevious,
                        groupSend: mail_info.groupSend
                    }
                    $scope.modal_close = function () {
                        $scope.$close();
                    };
                    $scope.click = {
                        previous: function () {
                            $rootScope.$broadcast("mailPreview.content_prev_or_next", {
                                prev: true,
                                next: false
                            });
                            $scope.$dismiss();
                        },
                        next: function () {
                            $rootScope.$broadcast("mailPreview.content_prev_or_next", {
                                prev: false,
                                next: true
                            });
                            $scope.$dismiss();
                        }
                    }
                }]
            })
        });
        return 0;
    }]
).factory("wtSpamCheck", ["$http", "$q", function ($http, $q) {
        "use strict";
        function escape(string, actionName) {
            var src = string || "";
            var pattern0 = new RegExp(/">/);
            var replaced0 = '" >';
            var pattern1 = new RegExp(/href\s*=\s*[\S]*/);
            var replaced1 = '$&)"';
            var pattern2 = new RegExp(/href\s*=\s*/);
            var replaced2 = 'href="" onClick="' + actionName + '(';
            return src.replace(pattern1, replaced1)
                .replace(pattern2, replaced2);
        }

        var exports = {
            escape: escape
        };
        return exports;
    }]
).factory("wtMockFactory", [function () {
        "use strict";
        function Signer(owner, msg, create_date, type) {
            this.owner = owner;
            this.message = msg;
            this.create_date = create_date;
            this.type = type;
        }

        function Owner(display_name) {
            this.display_name = display_name;
        }

        var exports = {
            Signer: Signer,
            Owner: Owner
        };
        return exports;
    }]);