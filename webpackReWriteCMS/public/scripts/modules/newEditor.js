"use strict";
angular.module("wt.new.editor", []).directive("wtNewEditor", ["$timeout", "$rootScope", "$popbox", "sanitize", "templateNewGeneratorInfo", function ($timeout, $rootScope, $popbox, sanitize, templateGeneratorInfo) {
    "use strict";
    return {
        restrict: "E",
        replace: true,
        scope: {
            title: "=editTitle",
            content: "=editContent",
            pid: "=pid",
            mode: "@mode",
            entity_id: "=entityId",
            entity_type: "@entityType",
            watchers: "=watchers",
            page_message: "=message",
            page_parent_id: "=parentId",
            page_is_notify: "=pageIsNotify",
            has_variable: "@hasVariable", //是否还有变量 : string
            set_variable: "&setVariable", //设置变量的trigger:Function
            get_one: "&getOne",           //生成文本的trigger:Function
            preview_in_modal: "@previewInModal"// 是否在modal里预览
        },
        transclude: true,
        templateUrl: "/view/directive/wt_new_editor.html",
        link: function (scope, element, attr) {
            function f() {
                $timeout(function () {
                    if (scope.content) {
                        var e = d.makeHtml(scope.content),
                            t = sanitize(e);
                        scope.html = t
                    }
                    _.isEmpty(scope.content) && (scope.html = "")
                });
                p = void 0
            }

            function h() {
                p ? (clearTimeout(p), p = setTimeout(f, 500)) : p = setTimeout(f, 500)
            }

            scope.hideMini = !1;
            scope.inPreview = !1;
            scope.isFullscreen = !1;
            var r = !1,
                o = !1;
            scope.isMini = "mini" === scope.mode ? !0 : !1;
            element.find(".fullscreen-mk-content-textarea").on("scroll", function () {
                if (!o) {
                    r = !0;
                    var t = element.find(".right-side"),
                        i = element.find(".fullscreen-mk-content-textarea"),
                        n = i.scrollTop(),
                        a = t.prop("scrollHeight") - t.prop("clientHeight"),
                        l = i.prop("scrollHeight") - i.prop("clientHeight"),
                        c = n / l * a;
                    t.scrollTop(c), $timeout(function () {
                        r = !1
                    }, 200)
                }
            });
            element.find(".right-side").on("scroll", function () {
                if (!r) {
                    o = !0;
                    var t = element.find(".right-side"),
                        i = element.find(".fullscreen-mk-content-textarea"),
                        n = t.scrollTop(),
                        a = t.prop("scrollHeight") - t.prop("clientHeight"),
                        l = i.prop("scrollHeight") - i.prop("clientHeight"),
                        c = n / a * l;
                    i.scrollTop(c);
                    $timeout(function () {
                        o = !1
                    }, 200)
                }
            });
            var l = element.find(".wnd-content-textarea"),
                c = element.find(".fullscreen-mk-content-textarea"),
                d = new Markdown.Converter;
            Markdown.Extra.init(d);
            var u = {
                    "cmd-bold": {
                        search: /([^\n]+)([\n\s]*)/g,
                        replace: "**$1**$2",
                        defaultText: "加粗的文字",
                        select: {
                            leftOmit: 2,
                            rightOmit: 2
                        }
                    },
                    "cmd-italic": {
                        search: /([^\n]+)([\n\s]*)/g,
                        replace: "_$1_$2",
                        defaultText: "倾斜的文字",
                        select: {
                            leftOmit: 1,
                            rightOmit: 1
                        }
                    },
                    "cmd-code": {
                        search: /([^\n]+)([\n\s]*)/g,
                        replace: "\n```\n$1\n```$2",
                        defaultText: "代码放这里",
                        select: {
                            leftOmit: 5,
                            rightOmit: 4
                        }
                    },
                    "cmd-horizontal-line": {
                        append: "\n***\n",
                        select: {
                            leftOmit: 5,
                            rightOmit: 0
                        }
                    },
                    "cmd-unorder-list": {
                        search: /(.+)([\n]?)/g,
                        replace: "\n* $1",
                        defaultText: "无序列表",
                        select: {
                            leftOmit: 3,
                            rightOmit: 0
                        }
                    },
                    "cmd-order-list": {
                        search: /(.+)([\n]?)/g,
                        replace: "\n1. $1",
                        defaultText: "有序列表",
                        select: {
                            leftOmit: 4,
                            rightOmit: 0
                        }
                    },
                    "cmd-blockquote": {
                        search: /(.+)([\n]?)/g,
                        replace: "\n> $1\n",
                        defaultText: "引用的文字",
                        select: {
                            leftOmit: 3,
                            rightOmit: 1
                        }
                    },
                    "cmd-h1": {
                        search: /(.+)([\n]?)/g,
                        replace: "\n# $1$2",
                        defaultText: "一级标题",
                        select: {
                            leftOmit: 3,
                            rightOmit: 0
                        }
                    },
                    "cmd-h2": {
                        search: /(.+)([\n]?)/g,
                        replace: "\n## $1$2",
                        defaultText: "二级标题",
                        select: {
                            leftOmit: 4,
                            rightOmit: 0
                        }
                    },
                    "cmd-h3": {
                        search: /(.+)([\n]?)/g,
                        replace: "\n### $1$2",
                        defaultText: "三级标题",
                        select: {
                            leftOmit: 5,
                            rightOmit: 0
                        }
                    },
                    "cmd-insert-variable": {
                        search: /([^\n]+)([\n\s]*)/g,
                        replace: "[[$1]]",
                        defaultText: "联系人",
                        select: {
                            leftOmit: 1,
                            rightOmit: 1
                        }
                    },
                    "cmd-insert-link": {
                        exec: function (t, n) {
                            $popbox.popbox({
                                target: t,
                                placement: "bottom",
                                templateUrl: "/view/common/pop_add_link_2.html",
                                controller: ["$scope", "popbox", function (t, i) {
                                    t.popbox = i;
                                    t.link_address = "http://";
                                    t.insert = function () {
                                        var s = n.textrange("get");
                                        if (0 === s.length) {
                                            s.text = "输入超链接描述";
                                            s.length = s.text.length;
                                        }
                                        var r = "[" + s.text + "](" + t.link_address + ")";
                                        n.textrange("replace", r);
                                        var o = s.start + 1,
                                            l = s.text.length;
                                        $timeout(function () {
                                            n.textrange("set", o, l)
                                        });
                                        scope.content = n.val();
                                        i.close();
                                    }
                                }]
                            }).open()
                        }
                    },
                    "cmd-insert-image": {
                        exec: function (t, n) {
                            $popbox.popbox({
                                target: t,
                                placement: "bottom",
                                templateUrl: "/view/common/pop_add_image2.html",
                                controller: ["$rootScope", "$scope", "$filter", "$routeParams", "popbox", "$sce",
                                    function ($rootScope, $scope, $filter, $routeParams, popbox, $sce) {
                                        $scope.popbox = popbox;
                                        $scope.step = 0;
                                        $scope.pid = scope.pid;
                                        $scope.js_step = function (e) {
                                            $scope.step = e
                                        };
                                        $scope.js_close = function () {
                                            popbox.close()
                                        };
                                        $scope.js_show_images = function () {
                                            $scope.step = 1;
                                            if (_.isEmpty($scope.images)) {
                                                $scope.images_loading_done = !1;
                                                $scope.images = null;
                                                wt.data.file.get_image_list($scope.pid, function (e) {
                                                    $scope.images = e.data
                                                }, null, function () {
                                                    $scope.images_loading_done = !0
                                                })
                                            }
                                        };
                                        $scope.js_select_image = function (e) {
                                            $scope.step = 0;
                                            $scope.image_address = kzi.config.wtprj_url + e.path;
                                            $scope.js_insert_image(null)
                                        };
                                        $scope.js_insert_image = function () {
                                            var t = n.textrange("get");
                                            n.textrange("replace", "![图片位置](" + $scope.image_address + ")");
                                            $timeout(function () {
                                                n.textrange("set", t.start + 2, 4)
                                            });
                                            scope.content = n.val();
                                            popbox.close();
                                        };
                                        $scope.js_upload_image = function () {
                                            $scope.uploading_done !== !0 && $("#file_upload").click()
                                        };

                                        $scope.token = kzi.get_cookie("sid");
                                        $scope.action_url = $rootScope.global.config.box_url() + "/upload?pid=" + $scope.pid + "&token=" + $scope.token + "&uid=" + window.sessionStorage.uid;
                                        $sce.trustAsUrl($scope.action_url);


                                        $scope.$on("fileuploadfail", function (e,data) {
                                            if(data.total > 1024 * 1024) {
                                                $scope.error_msg = "上传失败，图片大小不应超过1M";
                                                $scope.uploading_done = true;
                                            }
                                        });

                                        $scope.file_upload_option = {
                                            processstart: function () {
                                                $scope.uploading_done = !1;
                                                $scope.error_msg = null
                                            },
                                            process: function (e, t) {
                                                var i = 0;
                                                _.isEmpty(t.files) || (i = t.files[0].size);
                                                popbox.modalEl.find("form").fileupload({
                                                    formData: {
                                                        size: i,
                                                        target: "prj"
                                                    }
                                                })
                                            },
                                            processfail: function () {
                                                $scope.error_msg = "上传失败,此处只支持图片格式的文件";
                                                $scope.uploading_done = !0
                                            },
                                            done: function (e, t) {
                                                if (_.isEmpty(t.result.files)) {
                                                    $scope.uploading_done = !0;
                                                } else {
                                                    var requestBoday = {
                                                        type: "entity",
                                                        file: {
                                                            name: t.result.files[0].fname,
                                                            size: t.result.files[0].size,
                                                            ext: kzi.constant.get_ext(t.result.files[0].ext),
                                                            path: t.result.files[0].url
                                                        },
                                                        ext: {
                                                            folder_id: ""
                                                        }
                                                    };

                                                    if(t.result.code === 22001) {
                                                        kzi.msg.error("上传失败，图片大小不应超过1M");
                                                    }

                                                    wt.data.file.new_upload($scope.pid, requestBoday, function (e) {
                                                        if (200 === e.code) {
                                                            e.data.icon = kzi.helper.build_file_icon(e.data);
                                                            _.isEmpty($scope.images) || $scope.images.push(e.data);
                                                            $scope.image_address = kzi.config.img_url_prefix + e.data.path;
                                                            $scope.js_insert_image();
                                                            $scope.uploading_done = !0
                                                        }
                                                    })
                                                }
                                            },
                                            acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i
                                        }
                                    }]
                            }).open()
                        }
                    },
                    "cmd-save": {
                        exec: function () {
                            switch (scope.entity_type) {
                                case "post":
                                    if (_.isEmpty(scope.title)) return kzi.msg.error("标题不能为空");
                                    if (_.isEmpty(scope.entity_id)) {
                                        var r = _.pluck(scope.watchers, "uid");
                                        scope.is_saving = !0;
                                        wt.data.post.add(scope.pid, scope.title, scope.content, r, function (e) {
                                            $rootScope.$broadcast(kzi.constant.event_names.post_created_by_editor, e.data);
                                            scope.entity_id = e.data.post_id;
                                            kzi.msg.success("保存新话题成功");
                                        }, function () {
                                            kzi.msg.error("保存新话题失败")
                                        }, function () {
                                            scope.is_saving = !1;
                                            $timeout(function () {
                                                element.closest("[wt-scroll]").mCustomScrollbar("disable")
                                            }, 200)
                                        })
                                    } else {
                                        scope.is_saving = !0;
                                        wt.data.post.update(scope.pid, scope.entity_id, scope.title, scope.content, function () {
                                            kzi.msg.success("更新话题成功");
                                            $rootScope.$broadcast(kzi.constant.event_names.post_updated_by_editor, {
                                                name: scope.title,
                                                content: scope.content,
                                                pid: scope.pid,
                                                post_id: scope.entity_id
                                            })
                                        }, function () {
                                            kzi.msg.error("更新话题失败")
                                        }, function () {
                                            scope.is_saving = !1
                                        });
                                    }
                                    break;
                                case "page":
                                    if (_.isEmpty(scope.title)) return kzi.msg.error("标题不能为空");
                                    if (_.isEmpty(scope.entity_id)) {
                                        scope.is_saving = !0;
                                        wt.data.page.add(scope.pid, scope.title, scope.content, scope.page_message, scope.page_parent_id, function (e) {
                                            kzi.msg.success("添加文档成功!");
                                            scope.entity_id = e.data.page_id;
                                            $rootScope.$broadcast(kzi.constant.event_names.page_created_by_editor, e.data)
                                        }, null, function () {
                                            scope.is_saving = !1
                                        })
                                    } else {
                                        scope.is_saving = !0;
                                        wt.data.page.update(scope.pid, scope.entity_id, scope.title, scope.content,
                                            scope.page_message, scope.page_parent_id, scope.page_is_notify, 0, function () {
                                                kzi.msg.success("更新文档成功!");
                                                $rootScope.$broadcast(kzi.constant.event_names.page_updated_by_editor, {
                                                    name: scope.title,
                                                    content: scope.content,
                                                    message: scope.page_message
                                                })
                                            }, null, function () {
                                                scope.is_saving = !1
                                            });
                                    }
                                    break;
                                default:
                                    alert("entity type error")
                            }
                        }
                    },
                    "cmd-preview": {}
                },
                p = void 0;
            scope.$watch("content", function (e, t) {
                e !== t && h()
            });
            scope.execEditorCmd = function (t, i) {
                var n;
                if (n = scope.isFullscreen ?
                        c :
                        scope.isMini ?
                            element.find(".mini-content-textarea") :
                            l, u[i].search && u[i].replace) {
                    var r = n.textrange("get");
                    0 === r.length && (u[i].defaultText && (r.text = u[i].defaultText), r.length = r.text.length);
                    var o = r.text.replace(u[i].search, u[i].replace);
                    n.textrange("replace", o);
                    scope.content = n.val();
                    $timeout(function () {
                        if (u[i].select) {
                            var e = r.start;
                            e += u[i].select.leftOmit;
                            var t = o.length;
                            t = t - u[i].select.rightOmit - u[i].select.leftOmit;
                            n.textrange("set", e, t)
                        }
                    })
                }
                if (u[i].append && (n.textrange("replace", u[i].append), scope.content = n.val(), u[i].select)) {
                    var d = n.textrange("get"),
                        p = d.start;
                    p += u[i].select.leftOmit;
                    n.textrange("set", p, 0)
                }
                u[i].exec && u[i].exec(t, n)
            };
            scope.flipPreview = function () {
                //add by wuyunge,at Feb 11th------------------------------------------------------------------------
                if (JSON.parse(scope.preview_in_modal || 'false')) {
                    $rootScope.$broadcast("new-editor-preview-or-not", {
                        preview_or_not: !scope.inPreview,
                        in_modal_or_not: JSON.parse(scope.preview_in_modal) ? true : false
                    });
                    return 0;
                }
                //end-----------------------------------------------------------------------------------------------
                f();
                var e = l.closest(".flip-container");
                if (scope.inPreview === !1) {
                    var t = e.find(".wnd-content-textarea"),
                        i = t.prop("scrollHeight") - t.prop("clientHeight"),
                        n = t.scrollTop();
                    scope.inPreview = !scope.inPreview, e.addClass("flipped");
                    var s = e.find(".wnd-content-html"),
                        r = s.prop("scrollHeight") - s.prop("clientHeight"),
                        o = n / i * r;
                    s.scrollTop(o);
                    e.find(".front").css("z-index", 1);
                    e.find(".back").css("z-index", 2)
                } else {
                    e.removeClass("flipped");
                    scope.inPreview = !scope.inPreview;
                    e.find(".front").css("z-index", 2);
                    e.find(".back").css("z-index", 1);
                }
            };
            scope.goFullscreen = function () {
                f();
                scope.isFullscreen = !0;
                scope.isMini === !0 && (scope.hideMini = !0);
                var e = element.closest(".slide-content");
                e.css("overflow", "visible");
                scope.isMini && element.find(".left-right-container").css("top", "48px");
                var t = element.closest("[wt-scroll]");
                t.mCustomScrollbar("disable")
            };
            scope.cancelFullscreen = function () {
                scope.isFullscreen = !1;
                scope.isMini === !0 && (scope.hideMini = !1);
                var e = element.closest(".slide-content");
                e.css("overflow", "hidden");
                var t = element.closest("[wt-scroll]");
                t.mCustomScrollbar("update")
            };
        }
    }
}]);