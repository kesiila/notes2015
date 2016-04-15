"use strict";
wt.directive = angular.module("wt.directive", []);

wt.directive.directive("wtCommentEditor", ["$timeout", "$parse", "$popbox", function (e, t, i) {
    "use strict";
    return {
        restrict: "A", require: "ngModel", link: function (e, n, a) {
            var s = ['<div class="gollum-editor-function-bar clearfix">', '<div class="gollum-editor-function-buttons">', '<div class="btn-group mr_10">', '<a class="btn btn-min function-button function-bold" title="粗体"><span>粗体</span></a>', '<a class="btn btn-min function-button function-italic" title="斜体"><span>斜体</span></a>', "</div>", '<div class="btn-group mr_10">', '<a class="btn btn-min function-button function-ul" title="无序列表"><span>无序列表</span></a>', '<a class="btn btn-min function-button function-ol" title="有序列表"><span>有序列表</span></a>', '<a class="btn btn-min function-button function-blockquote" title="引用"><span>引用</span></a>', '<a class="btn btn-min function-button function-hr" title="水平分割线"><span>水平分割线</span></a>', "</div>", '<div class="btn-group">', '<a class="btn btn-min function-button js-popbox function-emoji" data-placement="bottom" title="插入表情"><i class="icon-smile"></i></a>', "</div>", "</div>", "</div>"].join("");
            ['<div class="gollum-editor-help" class="jaws">', '<ul class="gollum-editor-help-parent">', '<li><a href="javascript:;" class="selected">Help 1</a></li>', '<li><a href="javascript:;">Help 1</a></li>', '<li><a href="javascript:;">Help 1</a></li>', "</ul>", '<ul class="gollum-editor-help-list">', '<li><a href="javascript:;">Help 2</a></li>', '<li><a href="javascript:;">Help 3</a></li>', '<li><a href="javascript:;">Help 4</a></li>', '<li><a href="javascript:;">Help 5</a></li>', '<li><a href="javascript:;">Help 6</a></li>', '<li><a href="javascript:;">Help 7</a></li>', '<li><a href="javascript:;">Help 8</a></li>', "</ul>", '<div class="gollum-editor-help-wrapper">', '<div class="gollum-editor-help-content">', "<p>", "</p>", "</div>", "</div>", "</div>"].join(""), n.before(s);
            var o = function (i) {
                e.$apply(function () {
                    t(a.ngModel).assign(e, i);
                });
            };
            n.parents(".gollum-editor-wrap").eq(0).GollumEditor({AfterClickFunBar: o});
            var l = n.parents(".gollum-editor").find(".function-emoji"), c = null;
            n.parents(".editor-wrap").bind("click", function () {
                null !== c && (c.close(), c = null);
            }), l.bind("click", function (s) {
                s.stopPropagation(), s.preventDefault(), e.$apply(function () {
                    return null !== c ? (c.close(), c = null, void 0) : (i.popbox({
                        target: s,
                        templateUrl: "/view/common/pop_emojis.html",
                        controller: ["$scope", "popbox", function (i, s) {
                            i.popbox = s, i.emojis = [];
                            var r = 72, o = [], l = [];
                            $.each(kzi.emojis, function (e) {
                                0 !== e && 0 === e % r && (l.push(o), o = []), o.push(this);
                            }), l.push(o), i.emoji_groups = l, i.emojis = l[0], i.current = 0, i.js_to_page = function (e) {
                                i.current = e, i.emojis = l[e];
                            }, c = s, i.js_insert_emoji = function (i) {
                                var r = n.val() + " :" + i + ": ";
                                t(a.ngModel).assign(e, r), s.close();
                            }, i.js_close = function () {
                                s.close()
                            }, i.js_mousedown = function (e) {
                                e.stopPropagation(), e.preventDefault();
                            };
                        }]
                    }).open().then(function () {
                        c = null;
                    }), void 0);
                });
            })
        }
    }
}]);

wt.directive.directive("wtEditor_bk", ["$timeout", "$parse", "MdParse", "sanitize", function (e, t, i, n) {
    "use strict";
    return {
        restrict: "A", require: "ngModel", link: function (e, a, s) {
            a.addClass("help-block form-control gollum-editor-body"), a.wrap('<div class="gollum-editor-wrap" />'), a.wrap('<div class="gollum-editor" />');
            var r = ['<div class="gollum-editor-function-bar clearfix">',
                '<div class="gollum-editor-function-buttons">',
                '<div class="btn-group mr_10">',
                '<a class="btn btn-min function-button function-bold" title="粗体"><span>粗体</span></a>',
                '<a class="btn btn-min function-button function-italic" title="斜体"><span>斜体</span></a>',
                "</div>",
                '<div class="btn-group">',
                '<a class="btn btn-min function-button function-ul" title="无序列表"><span>无序列表</span></a>',
                '<a class="btn btn-min function-button function-ol" title="有序列表"><span>有序列表</span></a>',
                '<a class="btn btn-min function-button function-blockquote" title="引用"><span>引用</span></a>',
                '<a class="btn btn-min function-button function-hr" title="水平分割线"><span>水平分割线</span></a>',
                "</div>",
                "</div>",
                "</div>"].join("");
            ['<div class="gollum-editor-help" class="jaws">',
                '<ul class="gollum-editor-help-parent">',
                '<li><a href="javascript:;" class="selected">Help 1</a></li>',
                '<li><a href="javascript:;">Help 1</a></li>',
                '<li><a href="javascript:;">Help 1</a></li>',
                "</ul>", '<ul class="gollum-editor-help-list">',
                '<li><a href="javascript:;">Help 2</a></li>',
                '<li><a href="javascript:;">Help 3</a></li>',
                '<li><a href="javascript:;">Help 4</a></li>',
                '<li><a href="javascript:;">Help 5</a></li>',
                '<li><a href="javascript:;">Help 6</a></li>',
                '<li><a href="javascript:;">Help 7</a></li>',
                '<li><a href="javascript:;">Help 8</a></li>',
                "</ul>", '<div class="gollum-editor-help-wrapper">',
                '<div class="gollum-editor-help-content">',
                "<p>",
                "</p>",
                "</div>",
                "</div>",
                "</div>"].join(""), a.before(r);
            var l = function (i) {
                e.$apply(function () {
                    t(s.ngModel).assign(e, i)
                })
            };
            return a.parents(".gollum-editor-wrap").eq(0).GollumEditor({AfterClickFunBar: l}), void 0
        }
    }
}]);

wt.directive.directive("wtEditor", ["$timeout", "$parse", "MdParse", "sanitize", "$popbox", function (e, t, i, n, a) {
    "use strict";
    return {
        restrict: "AE",
        transclude: !0,
        replace: !0,
        templateUrl: "/view/directive/wt_editor_add_Jan_27th.html",
        link: function (e, i) {
            var o = i.find("textarea");
            o.addClass("help-block form-control gollum-editor-body");
            var l = function (i) {
                e.$$phase ? t(o.attr("ng-model")).assign(e, i) : e.$apply(function () {
                    t(o.attr("ng-model")).assign(e, i)
                })
            };
            i.GollumEditor({
                AfterClickFunBar: function (e) {
                    l(e)
                }
            });
            var c = i.find(".function-link"),
                d = null;
            i.find(".editor-wrap").bind("click", function () {
                null !== d && (d.close(), d = null)
            }), c.bind("click", function (t) {
                t.stopPropagation(), t.preventDefault(), e.$apply(function () {
                    return null != d ? (d.close(), d = null, void 0) : (a.popbox({
                        target: t,
                        templateUrl: "/ycjs/tpl/common/pop_add_link.html",
                        controller: ["$scope", "popbox", function (e, t) {
                            e.popbox = t, d = t, e.js_close = function () {
                                t.close()
                            };
                            var i = $.GollumEditor.FunctionBar.getFieldSelection(o);
                            _.isEmpty(i) || (i = $.trim(i), 1 == /^\[.+\]\(.+\)$/gi.test(i) ? (e.link_text = i.substring(1, i.indexOf("](")), e.link_address = i.substring(i.indexOf("](") + 2, i.length - 1)) : (e.link_text = i, e.link_address = "")), e.js_insert_link = function () {
                                $.GollumEditor.FunctionBar.replaceFieldSelection(o, "[" + e.link_text + "](" + e.link_address + ")"), t.close(), l(o.val())
                            }, e.js_mousedown = function (e) {
                                e.stopPropagation(), e.preventDefault()
                            }
                        }]
                    }).open().then(function () {
                        d = null
                    }), void 0)
                })
            });
            var u = i.find(".function-image"),
                p = null;
            i.find(".editor-wrap").bind("click", function () {
                p && (p.close(), p = null)
            }), u.bind("click", function (t) {
                t.stopPropagation(), t.preventDefault();
                var i = e.pid;
                e.$apply(function () {
                    return p ? (p.close(), p = null, void 0) : (a.popbox({
                        target: t,
                        templateUrl: "/ycjs/tpl/common/pop_add_image.html",
                        controller: ["$rootScope", "$scope", "$filter", "$routeParams", "popbox", "$sce", function (e, t, n, a, s, r) {
                            t.popbox = s, p = s, t.step = 0, t.js_step = function (e) {
                                t.step = e
                            }, t.js_close = function () {
                                s.close()
                            }, t.pid = i, t.js_show_images = function () {
                                t.step = 1, _.isEmpty(t.images) && (t.images_loading_done = !1, t.images = null, wt.data.file.get_image_list(i, function (e) {
                                    t.images = e.data
                                }, null, function () {
                                    t.images_loading_done = !0
                                }))
                            }, t.js_select_image = function (e) {
                                t.step = 0, t.image_address = kzi.config.wtprj_url + e.path, t.js_insert_image(null)
                            }, t.js_insert_image = function () {
                                $.GollumEditor.FunctionBar.replaceFieldSelection(o, "![](" + t.image_address + ")"), s.close(), l(o.val())
                            }, t.js_upload_image = function () {
                                t.uploading_done !== !0 && $("#file_upload").click()
                            }, t.token = kzi.get_cookie("sid"), t.action_url = e.global.config.box_url() + "?pid=" + i + "&token=" + t.token, r.trustAsUrl(t.action_url), t.file_upload_option = {
                                processstart: function () {
                                    t.uploading_done = !1, t.error_msg = null
                                },
                                process: function (e, t) {
                                    var i = 0;
                                    _.isEmpty(t.files) || (i = t.files[0].size), s.modalEl.find("form").fileupload({
                                        formData: {
                                            size: i,
                                            target: "prj"
                                        }
                                    })
                                },
                                processfail: function () {
                                    t.error_msg = "上传失败,此处只支持图片格式的文件", t.uploading_done = !0
                                },
                                done: function (n, a) {
                                    if (_.isEmpty(a.result.files)) t.uploading_done = !0;
                                    else {
                                        var s = {
                                            type: "entity",
                                            file: {
                                                name: a.result.files[0].fname,
                                                size: a.result.files[0].size,
                                                ext: kzi.constant.get_ext(a.result.files[0].ext),
                                                path: a.result.files[0].url
                                            },
                                            ext: {
                                                folder_id: ""
                                            }
                                        };
                                        wt.data.file.new_upload(i, s, function (i) {
                                            200 === i.code && (i.data.icon = kzi.helper.build_file_icon(i.data), _.isEmpty(t.images) || t.images.push(i.data), e.refresh_cache.file.add(i.data), t.image_address = kzi.config.wtprj_url + i.data.path, t.js_insert_image(null), t.uploading_done = !0)
                                        })
                                    }
                                },
                                acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i
                            }
                        }]
                    }).open().then(function () {
                        p = null
                    }), void 0)
                })
            }), e.$on("$destroy", function () {
            })
        }
    }
}])

wt.directive.directive("wtFullEditor", ["$compile", "$timeout", "$parse", "$popbox", "$rootScope", "MdParse", "sanitize", "editorPreview",
    function (e, $timeout, i, n, $rootScope, a, s, editorPreview) {
        "use strict";
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, elem, attr) {
                var need_add_var = attr.insertVar || false;
                elem.addClass("help-block form-control gollum-editor-body gollum-editor-full");
                elem.wrap('<div class="gollum-editor-wrap mt_15" />');
                elem.wrap('<div class="gollum-editor"  />');
                var l = [
                    '<div class="gollum-editor-function-bar clearfix">',
                    '<div class="gollum-editor-function-buttons">',
                    '<div class="btn-group mr_10">',
                    '<a class="btn btn-min function-button function-bold" title="粗体"><span>粗体</span></a>',
                    '<a class="btn btn-min function-button function-italic" title="斜体"><span>斜体</span></a>',
                    '<a class="btn btn-min function-button function-code" title="代码"><span>代码</span></a>',
                    "</div>",
                    '<div class="btn-group mr_10">',
                    '<a class="btn btn-min function-button function-ul" title="无序列表"><span>无序列表</span></a>',
                    '<a class="btn btn-min function-button function-ol" title="有序列表"><span>有序列表</span></a>',
                    '<a class="btn btn-min function-button function-blockquote" title="引用"><span>引用</span></a>',
                    '<a class="btn btn-min function-button function-hr" title="水平分割线"><span>水平分割线</span></a>',
                    "</div>",
                    '<div class="btn-group mr_10">',
                    '<a class="btn btn-min function-button function-h1" title="标题1"><span>标题1</span></a>',
                    '<a class="btn btn-min function-button function-h2" title="标题2"><span>标题2</span></a>',
                    '<a class="btn btn-min function-button function-h3" title="标题3"><span>标题3</span></a>',
                    "</div>",
                    '<div class="btn-group mr_10">',
                    '<a class="btn btn-min function-button js-popbox function-link" data-placement="bottom" title="链接"><span>插入链接</span></a>',
                    '<a class="btn btn-min function-button js-popbox function-image" data-placement="bottom" title="图片"><span>插入图片</span></a>',
                    "</div>",
                    '<div class="btn-group insert-part visible_hidden">',
                    '<a class="dropdown-toggle btn btn-min" style="padding-top: 3px;padding-bottom: 4px;padding-left: 8px" data-toggle="dropdown" title="插入变量" href="javascript:;"><span>插入变量</span></a>',
                    '<ul class="dropdown-menu"><li><a class="function-recipients" href=""><span>收件人</span></a></li><li><a class="function-sender" href=""><span>发件人</span></a></li></ul>',
                    "</div>",
                    "</div>",
                    '<div class="gollum-editor-function-buttons pull-right">',
                    '<div class="btn-group back-forward ng-hide mr_15">',
                    '<a class="btn btn-min backward" style="padding-top: 7px;padding-bottom: 6px;padding-left: 8px;padding-right: 8px;" title="上一条"><i class="icon-backward"></i></a>',
                    '<a class="btn btn-min forward" style="padding-top: 7px;padding-bottom: 6px;padding-left: 8px;padding-right: 8px" title="下一条"><i class="icon-forward"></i></a>',
                    "</div>",
                    '<div class="btn-group">',
                    '<a class="btn btn-min function-button function-preview" title="预览"><i class="icon-eye-open"></i></a>',
                    "</div>",
                    "</div>",
                    "</div>"].join("");

                elem.before(l);
                var c = function (e) {
                    scope.$apply(function () {
                        i(attr.ngModel).assign(scope, e)
                    })
                };
                elem.parents(".gollum-editor-wrap").eq(0).GollumEditor({AfterClickFunBar: c});
                var d = elem.parents(".gollum-editor").find(".function-preview"),
                    u = e('<div class="markdown-preview-scroll pt_15" wt-scroll wt-exheight="260" style="display:none;padding-left: 15px; padding-right: 15px;"><div class="markdown-preview markdown"></div></div>')(scope),
                    p = u.find(".markdown-preview"),
                    backForward = elem.parents(".gollum-editor").find('.back-forward');
                elem.after(u);
                if (need_add_var) {
                    elem.parents(".gollum-editor").find('.insert-part').removeClass('visible_hidden');
                    elem.parents(".gollum-editor").find('.function-recipients').bind("click", function () {
                        $.GollumEditor.FunctionBar.replaceFieldSelection(elem, "{收件人}"),
                            i(attr.ngModel).assign(scope, elem.val())
                    });
                    elem.parents(".gollum-editor").find('.function-sender').bind("click", function () {
                        $.GollumEditor.FunctionBar.replaceFieldSelection(elem, "{发件人}"),
                            i(attr.ngModel).assign(scope, elem.val())
                    });
                }
                ;
                var preview = {
                    recieversObj: {},
                    recievers: {},
                    index: 0
                }
                //var recieversObj = {};
                //var recievers = [];
                //var index = 0;
                //backForward.bind("click", function (e) {
                //    var i = scope.$eval(attr.ngModel);
                //    var target = $(e.target);
                //    if (target.hasClass('forward') || target.parent().hasClass('forward')) {
                //        if (index < recievers.length - 1) {
                //            recievers && (index++, i = i.replace(/{收件人}/g, recievers[index])), p.html(i)
                //        } else {
                //            kzi.msg.warn('已到最后一条', function () {
                //
                //            })
                //        }
                //    }
                //    if (target.hasClass('backward') || target.parent().hasClass('backward')) {
                //        if (index > 0) {
                //            recievers && (index--, i = i.replace(/{收件人}/g, recievers[index])), p.html(i)
                //        } else {
                //            kzi.msg.warn('已到第一条', function () {
                //
                //            })
                //        }
                //    }
                //})
                //d.bind("click", function () {
                //    var i = scope.$eval(attr.ngModel), n = elem.css("display");
                //    recieversObj = scope.$eval(attr.recievers);
                //    recievers = _.chain(recieversObj).pluck('name').map(function (i) {
                //        if (_.isEmpty(i)) {
                //            return 'Sir & Madam'
                //        } else {
                //            return i;
                //        }
                //    }).value();
                //    editorPreview.previewedOrNot = !editorPreview.previewedOrNot;
                //    scope.$digest();
                //    "none" == n ?
                //        (elem.css("display", "block"), u.css("display", "none"),
                //            index = 0, !_.isEmpty(recievers) && backForward.addClass('visible_hidden'),
                //            d.html('<i class="icon-eye-open"></i>'),
                //            d.attr("title", "预览"), p.html("")) :
                //        ("" !== i && (i = a(i), i = s(i)),
                //        recievers && (i = i.replace(/{收件人}/g, recievers[index])),
                //            elem.css("display", "none"),
                //            u.css("display", "block"),
                //        !_.isEmpty(recievers) && backForward.removeClass('visible_hidden'),
                //            d.html('<i class="icon-eye-close"></i>'), d.attr("title", "取消预览"),
                //            p.html(i),
                //            p.find("a").attr("target", function () {
                //                return this.host !== location.host ? "_blank" : void 0
                //            }))
                //});
                var f = elem.parents(".gollum-editor").find(".function-link"), h = null;
                elem.parents(".editor-wrap").bind("click", function () {
                    null !== h && (h.close(), h = null)
                }), f.bind("click", function (e) {
                    e.stopPropagation(), e.preventDefault(), scope.$apply(function () {
                        return null != h ? (h.close(), h = null, void 0) : (n.popbox({
                            target: e,
                            templateUrl: "/view/common/pop_add_link.html",
                            controller: ["$scope", "popbox", function (e, n) {
                                e.popbox = n, h = n, e.js_close = function () {
                                    n.close()
                                };
                                var a = $.GollumEditor.FunctionBar.getFieldSelection(elem);
                                _.isEmpty(a) || (a = $.trim(a), 1 == /^\[.+\]\(.+\)$/gi.test(a) ? (e.link_text = a.substring(1, a.indexOf("](")), e.link_address = a.substring(a.indexOf("](") + 2, a.length - 1)) : (e.link_text = a, e.link_address = "")), e.js_insert_link = function () {
                                    $.GollumEditor.FunctionBar.replaceFieldSelection(elem, "[" + e.link_text + "](" + e.link_address + ")"), n.close(), i(attr.ngModel).assign(scope, elem.val())
                                }, e.js_mousedown = function (e) {
                                    e.stopPropagation(), e.preventDefault()
                                }
                            }]
                        }).open().then(function () {
                            h = null
                        }), void 0)
                    })
                });
                var m = elem.parents(".gollum-editor").find(".function-image"), g = null;
                elem.parents(".editor-wrap").bind("click", function () {
                    null !== g && (g.close(), g = null)
                }), m.bind("click", function (e) {
                    e.stopPropagation(), e.preventDefault(), scope.$apply(function () {
                        return null != g ? (g.close(), g = null, void 0) : (n.popbox({
                            target: e,
                            templateUrl: "/view/common/pop_add_image.html",
                            controller: ["$rootScope", "$scope", "$filter", "$routeParams", "popbox", "$sce", function (e, n, a, s, l, c) {
                                n.popbox = l, g = l, n.step = 0, n.js_step = function (e) {
                                    n.step = e
                                }, n.js_close = function () {
                                    l.close()
                                };
                                var d = s.pid;
                                n.pid = d, n.js_show_images = function () {
                                    n.step = 1, _.isEmpty(n.images) && (n.images_loading_done = !1, n.images = null, wt.data.file.get_image_list(d, function (e) {
                                        n.images = e.data
                                    }, null, function () {
                                        n.images_loading_done = !0
                                    }))
                                }, n.js_select_image = function (e) {
                                    n.step = 0, n.image_address = kzi.config.wtprj_url + e.path, n.js_insert_image(null)
                                }, n.js_insert_image = function () {
                                    $.GollumEditor.FunctionBar.replaceFieldSelection(elem, "![](" + n.image_address + ")"), l.close(), i(attr.ngModel).assign(scope, elem.val())
                                }, n.js_upload_image = function () {
                                    n.uploading_done !== !0 && $("#file_upload").click()
                                }, n.token = kzi.get_cookie("sid"),
                                    n.action_url = e.global.config.box_url() + "/upload?pid=" + d + "&token=" + n.token,
                                    c.trustAsUrl(n.action_url),
                                    n.file_upload_option = {
                                        processstart: function () {
                                            n.uploading_done = !1, n.error_msg = null
                                        },
                                        process: function (e, t) {
                                            var i = 0;
                                            _.isEmpty(t.files) || (i = t.files[0].size), l.modalEl.find("form").fileupload({
                                                formData: {
                                                    size: i,
                                                    target: "prj"
                                                }
                                            })
                                        },
                                        processfail: function () {
                                            n.error_msg = "上传失败,此处只支持图片格式的文件", n.uploading_done = !0
                                        },
                                        done: function (t, i) {
                                            if (_.isEmpty(i.result.files))n.uploading_done = !0; else {
                                                var a = {
                                                    type: "project",
                                                    file: {
                                                        name: i.result.files[0].fname,
                                                        size: i.result.files[0].size,
                                                        ext: kzi.constant.get_ext(i.result.files[0].ext),
                                                        path: i.result.files[0].url
                                                    },
                                                    ext: {folder_id: ""}
                                                };
                                                wt.data.file.new_upload(d, a, function (t) {
                                                    200 === t.code && (t.data.icon = kzi.helper.build_file_icon(t.data), _.isEmpty(n.images) || n.images.push(t.data), e.refresh_cache.file.add(t.data), n.image_address = kzi.config.wtprj_url + t.data.path, n.js_insert_image(null), n.uploading_done = !0)
                                                })
                                            }
                                        }, acceptFileTypes: /(\.|\/)(jpe?g|png|gif|bmp)$/i
                                    }
                            }]
                        }).open().then(function () {
                            g = null
                        }), void 0)
                    })
                })
            }
        }
    }]),

    wt.directive.directive('wtScroll', [
        '$timeout',
        function ($timeout) {
            'use strict';
            return function (e, t, i) {
                var n = {
                    scrollInertia: 150,
                    theme: 'dark-thick',
                    advanced: {
                        updateOnBrowserResize: true,
                        updateOnContentResize: true,
                        autoScrollOnFocus: false
                    }
                };
                if ('' !== i.wtScroll) {
                    var a = JSON.parse(i.wtScroll);
                    $.isPlainObject(a) && (n = $.extend(true, n, a));
                }
                $(t).mCustomScrollbar(n);
                $timeout(function () {
                    $(t).mCustomScrollbar('scrollTo', 'top')
                }, 100);
            }
        }]);

wt.directive.directive('wtExheight', [
    '$window',
    function ($window) {
        'use strict';
        return {
            link: function (t, i, n) {
                var a = function (e) {
                    var t = parseInt(kzi.util.winHeight() - e, 10);
                    $(i).css('height', t);
                }, s = _.debounce(function () {
                    a(parseInt(n.wtExheight));
                }, 50);
                t.$watch(n.wtExheight, function (e) {
                    a(e);
                }), $($window).on('resize', s);
            }
        };
    }
]);

wt.directive.directive('wtTracker', [
    '$window',
    function ($window) {
        'use strict';
        return {
            link: function (scope, element, attrs) {
                'dev' !== wt.env && element.bind('click.wtTracker', function () {
                    var array = attrs.wtTracker.split('|');
                    array.length > 0 && (array.unshift('_trackEvent'), $window._czc = $window._czc || [], $window._czc.push(array));
                });
            }
        };
    }
]);

wt.directive.directive('wtFocus', [
    '$timeout',
    '$parse',
    function ($timeout, $parse) {
        'use strict';
        return {
            link: function (i, n, a) {
                a.wtFocus ?
                    (i.$watch(a.wtFocus, function (t) {
                        angular.isDefined(t) && t === !0 && $timeout(function () {
                            n[0].focus()
                        }, 200)
                    }, !0), n.bind("blur", function () {
                        angular.isDefined(a.wtFocus) && $timeout(function () {
                            $parse(a.wtFocus).assign(i, !1)
                        }, 200)
                    })) :
                    $timeout(function () {
                        n[0].focus()
                    }, 200)
            }
        };
    }
]);

wt.directive.directive('wtClickSelect', [function () {
    'use strict';
    return {
        link: function (e, t) {
            t.bind('click', function () {
                t.select();
            });
        }
    };
}]);

wt.directive.directive('wtShowEdit', [
    '$timeout',
    '$parse',
    function ($timeout, $parse) {
        'use strict';
        return {
            link: function (i, n, a) {
                i.$watch(a.wtShowEdit, function (s) {
                    if (!_.isUndefined(s))
                        if (s === true) {
                            $timeout(function () {
                                $(n).find(':text,textarea').eq(0).focus();
                            }, 50);
                            var r = $parse(a.wtShowEdit);
                            r.assign, n.bind('mousedown.wtShowEdit', function (e) {
                                e.stopPropagation();
                            }), $timeout(function () {
                                $(document).bind('mousedown.wtShowEdit', function () {
                                    $parse(a.wtShowEdit).assign(i, false), i.$$phase || i.$apply();
                                });
                            }, 50);
                        } else
                            s === false && (n.unbind('click.wtShowEdit'), $(document).unbind('click.wtShowEdit'));
                });
            }
        };
    }
]);

wt.directive.directive('wtRepeatPassword', [function () {
    'use strict';
    return {
        require: 'ngModel',
        link: function (e, t, i, n) {
            var a = t.inheritedData('$formController')[i.wtRepeatPassword];
            n.$parsers.push(function (e) {
                return e === a.$viewValue ? (n.$setValidity('repeat', true), e) : (n.$setValidity('repeat', false), void 0);
            }), a.$parsers.push(function (e) {
                return n.$setValidity('repeat', e === n.$viewValue), e;
            });
        }
    };
}]);

wt.directive.directive("wtMultipleEmail", [function () {
    return {
        require: "ngModel",
        link: function (e, t, i, n) {
            n.$parsers.push(function (e) {
                var t = /^([a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*;?)+$/i.test(e);
                return n.$setValidity("multipleEmail", t),
                    e
            })
        }
    }
}]);

wt.directive.directive('wtCompare', [function () {
    'use strict';
    return {
        require: 'ngModel',
        link: function (e, t, i, n) {
            n.$parsers.push(function (t) {
                return t === e.$eval(i.wtCompare) ? (n.$setValidity('compare', true), t) : (n.$setValidity('compare', false), void 0);
            }), e.$watch(i.wtCompare, function (t) {
                t === e.$eval(i.ngModel) ? n.$setValidity('compare', true) : n.$setValidity('compare', false);
            });
        }
    };
}]);

wt.directive.directive('wtRegex', [function () {
    'use strict';
    return {
        require: 'ngModel',
        link: function (e, t, i, n) {
            var a = new RegExp(i.wtRegex);
            n.$parsers.push(function (e) {
                return n.$setValidity('regex', a.test(e)), e;
            });
        }
    };
}]);

wt.directive.directive('wtForm', [function () {
    'use strict';
    return {
        link: function (e, t) {
            for (var a = [
                'text',
                'password',
                'email',
                ['textarea'],
                ['select']
            ], s = t[0], o = s.name, r = 0; s.length > r; r++) {
                var l = r, c = s[l];
                if (a.toString().indexOf(c.type) > -1) {
                    if ('' === c.name)
                        continue;
                    o + '.' + c.name + '.$dirty';
                    var d = o + '.' + c.name + '.$valid', p = o + '.' + c.name + '.$viewValue';
                    e.$watch('[' + p + ',' + d + ',' + l + ']', function (t) {
                        var n = s[t[2]], a = e[o][n.name];
                        if (void 0 !== t[0])
                            if (t[1] === false && a.$dirty) {
                                var r = [];
                                for (var l in a.$error)
                                    a.$error[l] && r.push(kzi.validation_rules.get_msg(l, n));
                                $(n).tooltip('destroy'), $(n).tooltip({
                                    animation: true,
                                    placement: 'bottom',
                                    title: r.toString(),
                                    trigger: 'focus'
                                }), $(n).tooltip('show');
                            } else
                                $(n).tooltip('destroy');
                    }, true);
                }
            }
        }
    };
}]);

wt.directive.directive('wtFormValidate', [
    '$timeout',
    function ($timeout) {
        'use strict';
        return {
            link: function (scope, element, attrs) {
                var defaultOptions = {
                    blurTrig: true,
                    showMsg: false
                };
                var options = $.extend(defaultOptions, scope.$eval(attrs.wtFormValidate));
                var error = {
                    get_error_msg: function (e, i) {
                        var n = [], a = scope[e][i.name];
                        for (var errorMsg in a.$error)
                            a.$error[errorMsg] && n.push(kzi.validation_rules.get_msg(errorMsg, i));
                        return n.toString();
                    },
                    show_error: function (target, title) {
                        target.removeClass('valid').addClass('error');
                        if (options.showMsg) {
                            target.tooltip('destroy');
                            target.tooltip({
                                animation: true,
                                placement: 'right',
                                title: title,
                                trigger: 'hover'
                            })
                        }
                    },
                    remove_error: function (target) {
                        target.removeClass('error').addClass('valid');
                        options.showMsg && target.tooltip('destroy');
                    }
                };
                var inputTypeList = [
                    'text',
                    'password',
                    'email',
                    'number',
                    ['textarea'],
                    ['select'],
                    ['select-one']
                ];
                var form = element[0];
                var formName = form.name;
                scope[formName].$errors = [];
                for (var i = 0; form.length > i; i++) {
                    var p = i,
                        input = form[p];
                    if (inputTypeList.toString().indexOf(input.type) > -1) {
                        if ('' === input.name)
                            continue;
                        var m = formName + '.' + input.name + '.$viewValue';
                        formName + '.' + input.name + '.$valid', formName + '.' + input.name + '.$dirty';
                        scope.$watch('[' + m + ',' + p + ']', function (e) {
                            var i = form[e[1]];
                            scope[formName][i.name], scope[formName].$errors = [], error.remove_error($(i));
                        }, true)
                            , options.blurTrig === true && $(input).bind('blur', function () {
                            var i = $(this), n = this;
                            $timeout(function () {
                                var e = formName + '.' + n.name + '.$valid', a = scope.$eval(e);
                                a ? error.remove_error(i) : error.show_error(i, error.get_error_msg(formName, n));
                            });
                        });
                    }
                }
                var v = function (e, i) {
                    if (i.$name === form.name) {
                        for (var n = [], a = 0; form.length > a; a++) {
                            var s = a, o = form[s];
                            if (inputTypeList.toString().indexOf(o.type) > -1) {
                                if ('' === o.name)
                                    continue;
                                if (formName + '.' + o.name + '.$dirty', formName + '.' + o.name + '.$valid', formName + '.' + o.name + '.$viewValue', i[o.name].$valid)
                                    continue;
                                var h = error.get_error_msg(formName, o);
                                n.push(h), error.show_error($(o), h);
                            }
                        }
                        i.$errors = _.isEmpty(n) || n.length > 0 ? n : [], scope.$$phase || scope.$apply(i.$errors);
                    }
                };
                scope[formName].doValidate = v;
            }
        };
    }
]);

wt.directive.directive('wtFormSubmit', [
    '$parse',
    function ($parse) {
        'use strict';
        return {
            link: function (t, i, n) {
                //得到函数表达式的参数
                var s = n.wtFormSubmit.substring(n.wtFormSubmit.indexOf("(") + 1, n.wtFormSubmit.length - 1);
                //得到第一个参数
                s = s.split(",")[0];
                var o = t[s],
                    r = $parse(n.wtFormSubmit),
                    validate = function () {
                        !_.isEmpty(o.$errors) && o.$errors.length > 0 || ($("form[name=" + o.$name + "]").find(":input").trigger("input"),
                            $("form[name=" + o.$name + "]").find(":input").trigger("change"),
                            _.isFunction(o.doValidate) ? o.doValidate(null, o) : t.$broadcast("dovalidation", o),
                        o.$invalid || t.$apply(function () {
                            r(t)
                        }))
                    };
                i.parents("form").bind("keydown keypress", function (e) {
                    if (13 === e.which && !t.$eval(n.loadingStatus)) {
                        var i = document.activeElement;
                        "textarea" !== i.type && ($(this).find("button").focus(), i.focus(), validate(), e.preventDefault())
                    }
                }),
                    i.bind("click", function () {
                        validate()
                    })
            }
        }
    }
]);

wt.directive.directive('wtRemoteUniqueCheck', [
    '$timeout',
    '$http',
    function ($timeout, $http) {
        'use strict';
        return {
            require: 'ngModel',
            link: function (i, n, a, s) {
                var o = function () {
                    var e = i.$eval(a.wtRemoteUniqueCheck), n = e.url, o = e.isExists;
                    $http.get(n).success(function (e) {
                        200 === e.code && (o === false ? s.$setValidity('romoteuniquecheck', e.data) : s.$setValidity('romoteuniquecheck', !e.data));
                    });
                };
                i.$watch(a.ngModel, function (e) {
                    _.isEmpty(e) || i[n[0].form.name][n[0].name].$dirty || o();
                }), n.bind('blur', function () {
                    $timeout(function () {
                        n.val(), i[n[0].form.name][n[0].name].$invalid || o();
                    });
                }), n.bind('focus', function () {
                    $timeout(function () {
                        s.$setValidity('romoteuniquecheck', true);
                    });
                });
            }
        };
    }
]);

wt.directive.directive('wtDatepicker', [
    '$parse',
    function ($parse) {
        'use strict';
        return function (t, i, n) {
            i.addClass('wtdate');
            var a = $parse(n.select);
            i.datepicker({
                defaultDate: n.wtDatepicker,
                firstDay: 0,
                onSelect: function (e) {
                    t.$apply(function () {
                        t.$eval(n.wtDatepicker + '=\'' + e + '\'', t), _.isFunction(a) && a(t);
                    });
                }
            }), t.$watch(n.wtDatepicker, function (e) {
                i.datepicker('setDate', e);
            });
        };
    }
]);

wt.directive.directive("wtFullDatepicker", ["$parse", "$popbox", function (e) {
    return {
        restrict: "AE",
        replace: !0,
        templateUrl: "/view/directive/datepicker.html",
        link: function (t, i, n) {
            var a = t.$eval(n.defaultDate),
                s = i.find(".wtdate"),
                r = e(n.setDate),
                o = t.$eval(n.minDate);
            t.js_set_date_inner = function (e) {
                var i = null;
                switch (e) {
                    case "today":
                        i = moment().format("YYYY-MM-DD");
                        break;
                    case "tomorrow":
                        i = moment().add("days", 1).format("YYYY-MM-DD");
                        break;
                    case "week":
                        i = moment().endOf("week").add("days", 1).format("YYYY-MM-DD");
                        break;
                    case "next_week":
                        i = moment().add("days", 7).endOf("week").add("days", 1).format("YYYY-MM-DD");
                        break;
                    case "month":
                        i = moment().endOf("month").format("YYYY-MM-DD");
                        break;
                    default:
                        i = moment().format("YYYY-MM-DD")
                }
                _.isFunction(r) && r(t, {
                    date: i
                })
            };
            var l = {
                defaultDate: a,
                firstDay: 0,
                onSelect: function (e) {
                    t.$apply(function () {
                        _.isFunction(r) && r(t, {
                            date: e
                        })
                    })
                }
            };
            o && (l.minDate = o), s.datepicker(l), t.$watch(n.defaultDate, function (e) {
                s.datepicker("setDate", e)
            })
        }
    }
}]);

wt.directive.directive('wtPopFullDatepicker', [
    '$popbox',
    function ($popbox) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            link: function (e, i, n) {
                i.bind('click', function (i) {
                    $popbox.popbox({
                        target: i,
                        templateUrl: '/view/directive/pop_datepicker.html',
                        controller: [
                            '$scope',
                            'popbox',
                            function (t, i) {
                                var a = e.$eval(n.wtPopFullDatepicker);
                                t.popbox = i, t.default_date = a.default_date, t.min_date = a.min_date, t.js_set_date = function (e) {
                                    a.set_date(e), i.close();
                                }, t.js_close = function () {
                                    i.close();
                                };
                            }
                        ]
                    }).open();
                });
            }
        };
    }
]);

wt.directive.directive('wtInclude', [
    '$compile',
    '$http',
    '$templateCache',
    function ($compile, $http, $templateCache) {
        'use strict';
        return {
            restrict: 'ECA',
            compile: function (n, a) {
                var s = a.ngInclude || a.src, o = a.onload || '';
                return a.autoscroll, function (n, a) {
                    var l, r = 0, c = function () {
                        l && (l.$destroy(), l = null), a.html('');
                    };
                    n.$watch(s, function (s) {
                        if (0 >= $('#' + s).length)
                            return a.html('<span class=\'tpl_none\'>此模板' + s + '还未实现1，请耐心等待...</span>'), void 0;
                        var u = ++r;
                        s ? $http.get(s, {cache: $templateCache}).success(function (t) {
                            u === r && (l && l.$destroy(), l = n.$new(), a.html(t), $compile(a.contents())(l), l.$emit('$includeContentLoaded'), n.$eval(o));
                        }).error(function () {
                            u === r && c();
                        }) : c();
                    });
                };
            }
        };
    }
]);

wt.directive.directive('wtPopbox', [
    '$popbox',
    function ($popbox) {
        'use strict';
        return {
            link: function (t, i, n) {
                i.bind('click', function (i) {
                    var a = t.$eval(n.wtPopbox);
                    a.disabled !== true && t.$apply(function () {
                        $popbox.popbox({
                            target: i,
                            templateUrl: a.templateUrl,
                            controller: a.controller,
                            resolve: {
                                pop_data: function () {
                                    return {
                                        $scope: t,
                                        parameters: a.parameters
                                    };
                                }
                            }
                        }).open();
                    });
                });
            }
        };
    }
]);

wt.directive.directive('draggable', [function () {
    'use strict';
    return {
        restrict: 'A',
        link: function (e, t, i) {
            e.$watch(i.draggable, function (e) {
                _.isEmpty(e) || t.draggable(e);
            });
        }
    };
}]);

wt.directive.directive('droppable', [function () {
    'use strict';
    return {
        restrict: 'A',
        link: function (e, t, i) {
            e.$watch(i.droppable, function (e) {
                _.isEmpty(e) || t.droppable(e);
            });
        }
    };
}]);

wt.directive.directive('sortable', [function () {
    'use strict';
    return {
        link: function (scope, ele, attr) {
            scope.$watch(attr.sortable, function (newValue) {
                null == newValue ? ele.sortable({disabled: !0}) : ele.sortable(newValue);
            }, true);
        }
    };
}]);

wt.directive.directive('disableSelection', [function () {
    'use strict';
    return {
        link: function (e, t) {
            t.disableSelection();
        }
    };
}]);

wt.directive.directive('wtLoadingDone', [function () {
    'use strict';
    return {
        link: function (e, t, i) {
            e.$watch(i.wtLoadingDone, function (e) {
                e === true ? t.css('display', 'none') : t.css('display', 'block');
            });
        }
    };
}]);

wt.directive.directive('wtTitle', [function () {
    'use strict';
    return {
        link: function (e, t, i) {
            var n = e.$eval(i.wtTitle);
            t.attr('title', n);
        }
    };
}]);

wt.directive.directive('wtAlt', [function () {
    'use strict';
    return {
        link: function (e, t, i) {
            var n = e.$eval(i.wtAlt);
            t.attr('alt', n);
        }
    };
}]);

wt.directive.directive('wtPermissionHide', [function () {
    'use strict';
    return {
        link: function (scope, element, attr) {
            scope.$watch(attr.wtPermissionHide, function (permission) {
                (permission == kzi.constant.permission.project_archived
                || permission == kzi.constant.permission.entity_archived
                || permission == kzi.constant.permission.entity_deleted
                || permission == kzi.constant.permission.entity_not_found)
                && element.css('display', 'none');
            });
        }
    };
}]);

wt.directive.directive('wtPermission', [function () {
    'use strict';
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.wtPermission, function (permission) {
                if (permission && 4 == permission.length) {
                    var first = permission[0], second = permission[1], third = permission[2], fourth = permission[3];
                    if (!first || !second)
                        return;
                    first === kzi.constant.permission.ok ?
                        (third === kzi.constant.permission.project_archived && element.css('display', 'none'),
                            second === kzi.constant.role.member ? fourth === kzi.constant.role.admin ? element.css('display', 'none')
                                : element.css('display', '')
                                : second === kzi.constant.role.guest ? fourth === kzi.constant.role.admin || fourth === kzi.constant.role.member ? element.css('display', 'none')
                                : element.css('display', '') : element.css('display', ''))
                        : first === kzi.constant.permission.project_archived ? (third === kzi.constant.permission.holder && 0 !== fourth || third === kzi.constant.permission.ok && 0 !== fourth)
                    && element.css('display', 'none') : first === kzi.constant.permission.team_stop_service ?
                    (third === kzi.constant.permission.holder && 0 !== fourth || third === kzi.constant.permission.ok && 0 !== fourth)
                    && element.css('display', 'none') : first === kzi.constant.permission.entity_archived ? element.css('display', 'none') : first === kzi.constant.permission.entity_deleted
                    && element.css('display', 'none');
                }
            }, true);
        }
    };
}]);

wt.directive.directive('wtPermissionDisabled', [function () {
    'use strict';
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.wtPermissionDisabled, function (permission) {
                (permission == kzi.constant.permission.project_archived
                || permission == kzi.constant.permission.entity_archived
                || permission == kzi.constant.permission.entity_deleted
                || permission == kzi.constant.permission.entity_not_found)
                && (element.attr('disabled', 'disabled'), element.css('cursor', 'not-allowed'));
            });
        }
    };
}]);

wt.directive.directive('wtRule', [function () {
    'use strict';
    return {
        link: function (e, t, i) {
            e.$watch(i.wtRule, function (n) {
                var n = e.$eval(i.wtRule);
                'hide' == n.type ? 0 == n.rule && t.css('visibility', 'hidden') : 'disabled' == n.type && 0 == n.rule && (t.attr('disabled', 'disabled'), t.css('cursor', 'not-allowed'));
            });
        }
    };
}]);

wt.directive.directive('wtGoTo', [
    '$location',
    function ($location) {
        'use strict';
        return {
            link: function (t, i, n) {
                i.bind('click', function () {
                    $location.path(n.wtGoTo), t.$$phase || t.$apply();
                });
            }
        };
    }
]);

wt.directive.directive('wtAtwho', [function () {
    'use strict';
    return {
        link: function (e, t, i) {
            e.$watch(i.wtAtwho, function (e) {
                null !== e && t.atwho(e);
            });
        }
    };
}]);

wt.directive.directive('wtCommentAtwho', [
    '$parse',
    '$filter',
    function ($parse, $filter) {
        'use strict';
        return {
            require: '^ngModel',
            link: function (scope, element, attrs) {
                var s = kzi.emojis;
                scope.$watch(attrs.wtCommentAtwho, function (o) {
                    if (element.atwho({
                            at: ':',
                            data: s,
                            tpl: '<li data-value=\'${name}:\'><img src=\'/img/emoji/${name}.png\' class=\'emoji\' /> ${name}</li>',
                            callbacks: {
                                after_insert: function (t) {
                                    $parse(attrs.ngModel).assign(scope, t.$inputor[0].value);
                                }
                            }
                        }), !_.isEmpty(o)) {
                        var l = '<li data-value=\'${name}\'><a href title=\'${display_name}\' class=\'avatar avatar-30\'><span class=\'avatar-face\'><span class=\'avatar-text\'>${firstText}</span></span></a> <span class=\'avatar-name\'>${display_name}</span></span> <small>(${name})</small></li>';
                        element.atwho({
                            at: '@',
                            limit: 5,
                            data: {names: o},
                            tpl: [
                                '<li data-value=\'${name}\'><a href title=\'${display_name}\'',
                                ' class=\'avatar avatar-30\'><span class=\'avatar-face\'>',
                                '<img src=\'' + kzi.config.wtavatar_url + '/${avatar}\'/></a>',
                                '<span class=\'avatar-name\'>${display_name}</span></span> <small>(${name})</small>',
                                '</li>'
                            ].join(''),
                            search_key: 'display_name',
                            callbacks: {
                                before_save: function (e) {
                                    return this.call_default('before_save', e.names);
                                },
                                filter: function (e, t) {
                                    return _.isEmpty(e) ? t : _.isEmpty(t) ? t : _.filter(t, function (t) {
                                        return t.display_name.toLowerCase().indexOf(e) > -1 || t.name.toLowerCase().indexOf(e) > -1;
                                    });
                                },
                                sorter: function (e, t) {
                                    return t;
                                },
                                tpl_eval: function (e, i) {
                                    var n = null;
                                    if (null == i.avatar || 'default_avatar.png' == i.avatar) {
                                        var a = $filter('firstText')(i.display_name);
                                        i.firstText = a, n = l.replace(/\$\{([^\}]*)\}/g, function (e, t) {
                                            return i[t];
                                        });
                                    } else
                                        n = e.replace(/\$\{([^\}]*)\}/g, function (e, t) {
                                            return i[t];
                                        });
                                    return n;
                                },
                                after_insert: function (t) {
                                    $parse(attrs.ngModel).assign(scope, t.$inputor[0].value);
                                }
                            }
                        });
                    }
                });
            }
        };
    }
]);

wt.directive.directive('wtEnter', [
    '$parse',
    function ($parse) {
        return function (t, i, n) {
            var a = $parse(n.wtEnter);
            i.bind('keydown keypress', function (e) {
                var i = e.which || e.keyCode;
                13 === i && (t.$apply(function () {
                    a(t, {$event: e});
                }), e.preventDefault());
            });
        };
    }
]);

wt.directive.directive('wtUpDownEnter', [
    '$parse',
    function ($parse) {
        return function (t, i, n) {
            var a = $parse(n.wtUpDownEnter);
            i.bind('keydown keypress', function (e) {
                var i = e.which || e.keyCode;
                (38 === i || 40 === i || 13 === i) && (t.$apply(function () {
                    a(t, {
                        $event: e,
                        keyCode: i
                    });
                }), e.preventDefault());
            });
        };
    }
]);

wt.directive.directive('wtCtrlEnter', [
    '$parse',
    function ($parse) {
        return function (t, i, n) {
            var a = $parse(n.wtCtrlEnter);
            i.bind('keydown keypress', function (e) {
                var i = e.which || e.keyCode;
                (e.ctrlKey || e.metaKey) && 13 === i && (t.$apply(function () {
                    a(t, {$event: e});
                }), e.preventDefault());
            });
        };
    }
]);

wt.directive.directive('wtShiftCutover', [
    '$parse',
    function ($parse) {
        return function (t, i, n) {
            var a = $parse(n.wtShiftCutover);
            i.bind('keydown keypress', function (e) {
                var i = e.which || e.keyCode, n = e.target || e.srcElement;
                (null === n || 'INPUT' !== n.nodeName && 'TEXTAREA' !== n.nodeName) && e.shiftKey && $.inArray(i, kzi.constant.shift_cutover_keys) > -1 && (t.$$phase || t.$apply(function () {
                    a(t, {
                        $event: e,
                        $keyCode: i
                    });
                }));
            });
        };
    }
]);

wt.directive.directive('wtClick', [
    '$parse',
    function ($parse) {
        return function (t, i, n) {
            var a = $parse(n.wtClick);
            i.bind('click', function (e) {
                t.$$phase ? a(t, {$event: e}) : t.$apply(function () {
                    a(t, {$event: e});
                });
            });
        };
    }
]);

wt.directive.directive('wtShortcutKey', [
    '$parse',
    function ($parse) {
        return function (t, i, n) {
            var a = $parse(n.wtShortcutKey);
            i.bind('keydown keypress', function (e) {
                var i = e.which || e.keyCode;
                if ((i !== kzi.constant.keyASCIIs.VK_SPACE || 'keypress' !== e.type) && ($.inArray(i, kzi.constant.global_shortcut_keys) > -1 || $.inArray(i, kzi.constant.entry_shortcut_keys) > -1)) {
                    if (i !== kzi.constant.keyASCIIs.ESC) {
                        var n = e.target || e.srcElement;
                        if (null !== n && ('INPUT' === n.nodeName || 'TEXTAREA' === n.nodeName))
                            return;
                    }
                    t.$apply(function () {
                        a(t, {$keyCode: i});
                    });
                }
            });
        };
    }
]);

wt.directive.directive('wtKeyAt', [
    '$parse',
    function ($parse) {
        return function (t, i, n) {
            var a = $parse(n.wtKeyAt);
            i.bind('keydown keypress', function (e) {
                var i = e.which || e.keyCode;
                i === kzi.constant.keyASCIIs.At && (t.$apply(function () {
                    a(t, {$event: e});
                }), e.preventDefault());
            });
        };
    }
]);

wt.directive.directive('loadingStatus', [
    '$timeout',
    function ($timeout) {
        'use strict';
        return function (scope, element, attrs) {
            scope.$watch(attrs.loadingStatus, function (loading) {
                loading === true ?
                    element.button('loading') :
                loading === false && $timeout(function () {
                    element.button('reset');
                });
            });
        };
    }
]);

wt.directive.directive('textareaAutoheight', [function () {
    'use strict';
    return function (e, t, i) {
        'TEXTAREA' === t[0].tagName && (t.css({
            overflow: 'hidden',
            'word-wrap': 'break-word',
            resize: 'none',
            'padding-right': '22px',
            height: '32px',
            'line-height': '110%'
        }), t.height(t[0].scrollHeight - 4), t.keyup(function () {
            var n = 1;
            i.textareaAutoheight && (n = i.textareaAutoheight), t.height(t[0].scrollHeight - 4);
        }));
    };
}]);

wt.directive.directive('textareaInitheight', [function () {
    'use strict';
    return function (e, t) {
        'TEXTAREA' === t[0].tagName && t.focus(function () {
            t[0].scrollHeight - 4 > 150 ? t.height('150px') : t.height(t[0].scrollHeight - 4);
        });
    };
}]);

wt.directive.directive('wtCopyBind', [function () {
    'use strict';
    return function () {
    };
}]);

wt.directive.directive('wtScrollFixed', [function () {
    'use strict';
    return function (e, t) {
        $(t).css({
            position: 'fixed',
            width: t.parent().width()
        }), t.parent().height(t.height()), $(window).resize(function () {
            $(t).css({width: t.parent().width()}), t.parent().height(t.height());
        });
    };
}]);
wt.directive.directive('wtDisableDrag', [function () {
    'use strict';
    return function (e, t) {
        t.on('dragstart', function (e) {
            return console.log('aaa'), e.preventDefault(), false;
        });
    };
}]);

wt.directive.directive('wtSlideShow', [
    '$parse',
    function ($parse) {
        'use strict';
        return function (scope, element, attrs) {
            var slide_change = $parse(attrs.slideChange);
            scope.$watch(attrs.wtSlideShow, function (slide_show) {
                slide_change(scope, {value: slide_show});
                slide_show === true ?
                    element.slideToggle('normal', function () {
                        var e = element.find('input')[0];
                        e && e.focus();
                    }) :
                    slide_show === false ? element.slideToggle() : attrs.defaultShow || element.slideToggle();
            });
        };
    }
]);

wt.directive.directive('wtSlidingShow', [function () {
    'use strict';
    return function (scope, element, attrs) {
        var delay = 500, right = 0, width = 730;
        scope.$watch(
            attrs.wtSlidingShow,
            function (slide_show) {
                slide_show === true ? (
                    element.animate({
                        right: right + 'px',
                        width: width
                    }, delay),
                        $(document).bind('mousedown.wtSlidingShow,drag', function (event) {
                            $(event.target).hasClass('slide-content')
                            || $(event.target).parents('.slide-content').length > 0
                            || $(event.target).hasClass('slide-trigger')
                            || $(event.target).parents('.slide-trigger').length > 0
                            || $(event.target).hasClass('popbox')
                            || $(event.target).parents('.popbox').length > 0
                            || $(event.target).hasClass('fancybox-overlay')
                            || $(event.target).parents('.fancybox-overlay').length > 0
                            || $(event.target).hasClass('layout_right_sidebar')
                            || $(event.target).parents('.layout_right_sidebar').length > 0
                            || 'fancybox-buttons' === $(event.target).attr('id')
                            || $(event.target).parents('#fancybox-buttons').length > 0
                            || $(event.target).hasClass('fancybox-overlay')
                            || $(event.target).parents('.fancybox-overlay').length > 0
                            || $(event.target).hasClass('fancybox-thumbs')
                            || $(event.target).parents('.fancybox-thumbs').length > 0
                            || $(event.target).hasClass('fancybox-wrap')
                            || $(event.target).parents('.fancybox-wrap').length > 0
                            || scope.$apply(function () {
                                scope.$root.locator.hide_slide();
                            });
                        })) : slide_show === false && (element.find('div:visible').first().width(width), element.animate({
                    width: '0',
                    right: '0'
                }, delay), $(document).unbind('mousedown.wtSlidingShow'));
            });
    };
}]);
wt.directive.directive('wtLeftMenuToggle', [
    '$window',
    function ($window) {
        'use strict';
        return function (e, t, n) {
            var a = t.children('.leftpanel'), s = a.css('width'), o = 200, r = 60;
            e.$watch(n.wtLeftMenuToggle, function (e) {
                var n = t.children('.centerpanel');
                e === true ? ($($window.document).find('body').css('overflow', 'hidden'), a.clearQueue(), n.clearQueue(), a.stop(), n.stop(), a.animate({width: r}, o), n.animate({'margin-left': r}, o, null, function () {
                    $('#calendar').fullCalendar('render');
                }), a.addClass('leftpanel_collapse')) : e === false && (a.clearQueue(), n.clearQueue(), a.stop(), n.stop(), a.animate({width: s}, o), n.animate({'margin-left': 220}, o, null, function () {
                    a.removeClass('leftpanel_collapse'), $('#calendar').fullCalendar('render');
                }));
            });
        };
    }
]);

wt.directive.directive('wtSidebarToggle', [function () {
    'use strict';
    return function (scope, element, attrs) {
        var n = $('.layout_right_sidebar'), a = n.outerWidth(), width = 86;
        scope.$watch(attrs.wtSidebarToggle, function (isCollapse) {
            var t = $('.layout_content_main');
            isCollapse === true
                ? (n.css('width', width), t.css('margin-right', width), n.addClass('sidebar_collapse'), $('#calendar').fullCalendar('render'))
                : isCollapse === false && (n.css('width', a), t.css('margin-right', '240px'), n.removeClass('sidebar_collapse'), $('#calendar').fullCalendar('render'));
        });
    };
}]);

wt.directive.directive('wtStopPropagation', [function () {
    'use strict';
    return function (e, t, i) {
        var n = i.wtStopPropagation;
        _.isEmpty(n) && (n = 'mousedown'), t.bind(n, function (e) {
            e.stopPropagation();
        });
    };
}]);


wt.directive.directive('wtChart', [function () {
    'use strict';
    return function (e, t, i) {
        e.$watch(i.chartOptions, function (e) {
            if (!_.isEmpty(e)) {
                var t = null;
                if (null == t)
                    switch (i.wtChart) {
                        case 'ColumnStacked2D':
                            t = new iChart.ColumnStacked2D(angular.copy(e)), t.draw();
                            break;
                        case 'BarStacked2D':
                            t = new iChart.BarStacked2D(angular.copy(e)), t.draw();
                        case 'Bar2D':
                            t = new iChart.Bar2D(angular.copy(e)), t.draw();
                        default:
                    }
            }
        }, true);
    };
}]);

wt.directive.directive('wtFocusEvent', [
    '$parse',
    function ($parse) {
        'use strict';
        return {
            link: function (e, i, n) {
                var s = $parse(n.wtFocusEvent);
                i.bind('focus', function (t) {
                    e.$$phase ? s(e, {$event: t}) : e.$apply(function () {
                        s(e, {$event: t});
                    });
                });
            }
        };
    }
]);

wt.directive.directive('wtModelChange', [
    '$parse',
    function ($parse) {
        'use strict';
        return {
            link: function (e, i, n) {
                var s = $parse(n.wtModelChange);
                e.$watch(n.ngModel, function () {
                    e.$$phase ? s(e) : e.$apply(function () {
                        s(e);
                    });
                });
            }
        };
    }
]);

wt.directive.directive('wtPagination', function () {
    'use strict';
    return function (e, t, i) {
        e.$watch(i.wtPagination, function (i) {
            _.isEmpty(i) || t.pagination(i.totalCount, {
                current_page: i.current_page || 0,
                items_per_page: i.items_per_page || kzi.config.default_count,
                num_display_entries: 10,
                callback: function (t) {
                    e.$apply(function () {
                        i.opts.callback(t);
                    });
                },
                load_first_page: false,
                prev_text: '上一页',
                next_text: '下一页'
            });
        });
    };
});

wt.directive.directive('wtPopDelete', [
    '$popbox',
    '$parse',
    function ($popbox, $parse) {
        'use strict';
        return {
            link: function (i, n, a) {
                n.bind('click', function (n) {
                    var s = $parse(a.wtPopDelete), o = n;
                    i.$apply(function () {
                        $popbox.popbox({
                            target: o,
                            templateUrl: '/view/common/pop_delete_confirm.html',
                            controller: [
                                '$rootScope',
                                '$scope',
                                'popbox',
                                function (e, t, i) {
                                    t.popbox = i, t.js_close = function () {
                                        i.close();
                                    }, t.delete_message = '确认要删除此项吗？', t.delete_title = '确认删除', t.js_sure_delete = function () {
                                        s(t, {
                                            $event: o,
                                            $popbox: i
                                        });
                                    };
                                }
                            ]
                        }).open();
                    });
                });
            }
        };
    }
]);

wt.directive.directive('ngBindHtmlUnsafe', [
    '$sce',
    'sanitize',
    function ($sce, sanitize) {
        return {
            scope: {ngBindHtmlUnsafe: '='},
            template: '<span ng-bind-html=\'trustedHtml\'></span>',
            link: function (i) {
                i.updateView = function () {
                    if (!_.isUndefined(i.ngBindHtmlUnsafe)) {
                        var n = sanitize(i.ngBindHtmlUnsafe);
                        i.trustedHtml = $sce.trustAsHtml(n);
                    }
                }, i.$watch('ngBindHtmlUnsafe', function (e) {
                    i.updateView(e);
                });
            }
        };
    }
]);

wt.directive.directive('wtAutofocus', [
    '$timeout',
    function ($timeout) {
        'use strict';
        return {
            link: function (t, i) {
                $timeout(function () {
                    i[0].focus();
                }, 200);
            }
        };
    }
]);

wt.directive.directive('repeatDone', [function () {
    return function (e, t, i) {
        e.$last && e.$eval(i.repeatDone);
    };
}]);

wt.directive.directive('wtAvatar', [
    '$parse',
    function ($parse) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/view/directive/avatar.html',
            link: function (t, i, n) {
                var a = function (a) {
                    var s = 40;
                    angular.isDefined(n.size) && (s = parseInt(n.size, 10));
                    i.addClass('avatar-' + s);
                    45 > s && (s = 40);
                    s >= 45 && (s = 80);
                    s >= 100 && (s = 180);
                    angular.isDefined(n.avatar) && (a.avatar = t.$eval(n.avatar));
                    i.attr('title', a.display_name);
                    i.attr('member-id', a.uid);
                    var o = i.children('.avatar-face');
                    angular.isDefined(n.faceclass) && o.addClass(n.faceclass);
                    o.empty();
                    i.find('br').remove();
                    i.find('.avatar-name').remove();
                    i.find('.avatar-atname').remove();
                    i.find('.avatar-append').remove();
                    if ('default_avatar.png' === a.avatar || _.isEmpty(a.avatar)) {
                        var r = a.display_name ? a.display_name.substring(0, 1).toLocaleUpperCase() : "";
                        o.append('<span class="avatar-text">' + r + '</span>');
                    } else {
                        var l = kzi.config.default_avatar;
                        a.avatar && (l = kzi.config.avatar_url(a.avatar) );
                        o.append('<img src="' + l + '" alt="' + a.display_name + '"/>');
                    }
                    if (angular.isDefined(n.status)) {
                        var c = 'status offline',
                            u = '离线';
                        1 === a.online && (c = 'status online', u = '在线');
                        3 === a.online && (c = 'status leave', u = '离开');
                        o.append('<span class="' + c + '" title="' + u + '"></span>');
                    }
                    angular.isDefined(n.href) ? i.attr('href', n.href) : i.attr('href', 'javascript:;');
                    angular.isDefined(n.namebr) && o.after('<br/>');
                    angular.isDefined(n.name) && i.append('<span class="avatar-name">' + a.display_name + '</span>');
                    angular.isDefined(n.atname) && i.append('<span class="avatar-atname">(' + a.name + ')</span>');
                    angular.isDefined(n.append) && i.append('<span class="avatar-append">' + n.append + '</span>');
                    i.unbind('dragstart.wt-avatar');
                    if (angular.isDefined(n.drag)) {
                        var d = t.$eval(n.drag);
                        _.isEmpty(d) ? i.bind('dragstart.wt-avatar', function (e) {
                            return e.preventDefault(), false;
                        }) : i.draggable(d);
                    } else
                        i.bind('dragstart.wt-avatar', function (e) {
                            return e.preventDefault(), false;
                        });
                    i.unbind('click.wt-avatar');
                    if (angular.isDefined(n.click)) {
                        var p = $parse(n.click);
                        i.bind('click.wt-avatar', function (e) {
                            t.$apply(function () {
                                p(t, {$event: e});
                            });
                        });
                    }
                };
                t.$watch(n.member, function (e, t) {
                    _.isUndefined(e) || _.isNull(e) || _.isEqual(e, t) || a(e);
                }, true);
                if (!_.isUndefined(n.member)) {
                    var s = t.$eval(n.member);
                    if (_.isUndefined(s) || _.isNull(s))
                        return;
                    a(s);
                }
            }
        };
    }
]);

wt.directive.directive('wtTask', [function () {
    'use strict';
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/view/directive/task.html',
        link: function (e, t, i) {
            var n = function (e) {
                if (e.labels && e.labels.length > 0) {
                    var i = '';
                    _.each(e.labels, function (e) {
                        i += '<div title="' + e.desc + '" class="task-label ' + e.name + '-label"></div>';
                    }), t.children('.entry-task-labels').empty().append(i);
                } else
                    t.children('.entry-task-labels').empty();
            };
            if (_.isEmpty(i.hideAction) || (e.hide_action = !!i.hideAction), e.$watch(i.task, function (e, t) {
                    _.isUndefined(e) || _.isNull(e) || _.isEqual(e, t) || n(e);
                }, true), !_.isUndefined(i.task)) {
                if (_.isUndefined(e.$eval(i.task)))
                    return;
                n(e.$eval(i.task));
            }
        }
    };
}]);

wt.directive.directive('wtTaskComposer', [
    '$compile',
    '$templateCache',
    '$http',
    '$parse',
    function ($compile, $templateCache, $http, $parse) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            link: function (a, s, o) {
                var r = o.position, l = '/view/directive/task_composer.html', c = function () {
                    $(document).bind('mousedown.wtTaskComposer', function (e) {
                        $(e.target).hasClass('entry-task-composer') || $(e.target).parents('.entry-task-composer').length > 0 || $(e.target).hasClass('popbox-avatar') || $(e.target).parents('.popbox-avatar').length > 0 || a.$apply(function () {
                            $parse(o.composerShow).assign(a, false);
                        });
                    });
                };
                a.focus_textarea = function (e) {
                    var t = null;
                    t = $(e.target).hasClass('composer-body-focus') ? $(e.target) : $(e.target).parents('.composer-body-focus').eq(0), t.find('textarea').focus();
                }, a.$watch(o.composerShow, function (u) {
                    if (u === true)
                        if (s.contents().length > 0) {
                            if (s.css('display', 'block'), c(), s.find('textarea')[0].focus(), 'bottom' == r) {
                                var p = s.parents('.entry').eq(0).find('.mCustomScrollbar');
                                p.mCustomScrollbar('scrollTo', 'bottom');
                            }
                        } else
                            $http.get(l, {cache: $templateCache}).success(function (t) {
                                s.html(t);
                                var i = a.$new();
                                if (i.js_task_save = function (e) {
                                        var l = $parse(o.taskSave);
                                        l(i, {
                                            $event: e,
                                            isTop: 'top' == r
                                        }), s.find('textarea')[0].focus();
                                    }, $compile(s.contents())(i), s.css('display', 'block'), c(), s.find('textarea')[0].focus(), 'bottom' == r) {
                                    var l = s.parents('.entry').eq(0).find('.mCustomScrollbar');
                                    l.mCustomScrollbar('scrollTo', 'bottom');
                                }
                            }).error(function () {
                                angular.noop();
                            });
                    else
                        u === false && (s.css('display', 'none'), $(document).unbind('mousedown.wtTaskComposer'));
                });
            }
        };
    }
]);

wt.directive.directive('wtBadges', [
    'shortTimeFormatFilter',
    function (shortTimeFormatFilter) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/view/directive/badges.html',
            link: function ($scope, element, attrs) {
                var a = function (e) {
                    var t = 0;
                    if (e.completed)
                        t = 0;
                    else {
                        var i = moment().valueOf(), n = 1000 * moment(e.expire_date).format('X');
                        t = i > n ? 1 : n > i && moment().add('days', 1).valueOf() > n ? 2 : 0;
                    }
                    return t;
                };
                s = function (t) {
                    var n = '';
                    //布尔注释
                    if (element.children('.icon-time').remove(), 0 != t.expire_date, 0 != t.expire_date && false) {
                        var s = shortTimeFormatFilter(t.expire_date), o = '', r = '', l = a(t);
                        r = '截止时间：' + s, 1 === l && (o = 'badge-expire-due', r = '活动已经截止'), 2 === l && (o = 'badge-expire-soon', r = '活动即将截止');
                        var c = [
                            '<span class="task-badge icon icon-time ' + o + '"',
                            ' title="' + r + '">',
                            s,
                            '</span> '
                        ].join('');
                        n += c;
                    }
                    if (element.children('.icon-th-list').remove(), t.badges.todo_count > 0) {
                        var u = t.badges.todo_checked_count + '/' + t.badges.todo_count, d = '';
                        t.badges.todo_checked_count === t.badges.todo_count && (d = ' badge-todo-done');
                        var p = '';
                        p = t.badges.todo_checked_count === t.badges.todo_count ? t.badges.todo_checked_count + '个检查项已全部完成' : '检查项：' + t.badges.todo_checked_count + '/' + t.badges.todo_count;
                        var f = [
                            '<span class="task-badge icon icon-th-list ' + d + '"',
                            ' title="' + p + '">',
                            u,
                            '</span> '
                        ].join('');
                        n += f;
                    }
                    if (element.children('.icon-paper-clip').remove(), t.badges.file_count > 0) {
                        var m = t.badges.file_count + '个', h = '活动有' + t.badges.file_count + '个附件', _ = [
                            '<span class="task-badge icon icon-paper-clip"',
                            ' title="' + h + '">',
                            m,
                            '</span> '
                        ].join('');
                        n += _;
                    }
                    if (element.children('.icon-envelope').remove(), t.badges.mail_count > 0) {
                        var m = t.badges.mail_count + '个', h = '活动有' + t.badges.mail_count + '个邮件', _ = [
                            '<span class="task-badge icon icon-envelope"',
                            ' title="' + h + '">',
                            m,
                            '</span> '
                        ].join('');
                        n += _;
                    }
                    if (element.children('.icon-comment-alt').remove(), t.badges.comment_count > 0) {
                        var g = t.badges.comment_count + '个', v = '活动有' + t.badges.comment_count + '个评论', b = [
                            '<span class="task-badge icon icon-comment-alt"',
                            ' title="' + v + '">',
                            g,
                            '</span> '
                        ].join('');
                        n += b;
                    }
                    if (element.children('.icon-user').remove(), t.badges.collect_count > 0) {
                        var g = t.badges.collect_count + '个', v = '活动有' + t.badges.collect_count + '个收藏者', b = [
                            '<span class="task-badge icon icon-user"',
                            ' title="' + v + '">',
                            g,
                            '</span> '
                        ].join('');
                        n += b;
                    }
                    element.append(n);
                };
                if ($scope.$watch(attrs.task, function (e, t) {
                        _.isUndefined(e) || _.isNull(e) || _.isEqual(e, {}) || _.isUndefined(e.badges) || _.isNull(e.badges) || null !== t && moment(e.expire_date).format('YYYY-MM-DD') === moment(t.expire_date).format('YYYY-MM-DD') && _.isEqual(e.badges, t.badges) && e.completed == t.completed || s(e);
                    }, true), !_.isUndefined(attrs.task)) {
                    var o = $scope.$eval(attrs.task);
                    if (_.isUndefined(o) || _.isEmpty(o))
                        return;
                    if (_.isEqual(o, {}))
                        return;
                    if (_.isUndefined(o.badges) || _.isNull(o.badges))
                        return;
                    s(o);
                }
            }
        };
    }
]);


wt.directive.directive('wtTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            task: '=task',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                });
                wt.data.task.del_tag("", e.eid, t.tag_id, function () {
                });
                e = d1(e);
                t.is_tag_edit = !1;
                $rootScope.$broadcast(kzi.constant.event_names.on_task_update, e);
            }
        }
    };
}
]);

wt.directive.directive('wtGoodsTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            goods: '=goods',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_goods.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'goods';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                }), wt.data.goods.remove_tag("", e.eid, t.tag_id, function () {
                }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_goods_update, e)
            }
        }
    };
}
]);

wt.directive.directive('wtProjectTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            project: '=project',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_project.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'project';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                });
                wt.data.projects.remove_tag("", e.eid, t.tag_id, function () {
                });
                e = d1(e);
                t.is_tag_edit = !1;
                $rootScope.$broadcast(kzi.constant.event_names.on_projects_update, e);
            }
        }
    };
}
]);


wt.directive.directive('wtOrderTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            order: '=order',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_order.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'order';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                }), wt.data.order.remove_tag("", e.eid, t.tag_id, function () {
                }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_order_update, e)
            }
        }
    };
}
]);

wt.directive.directive('wtCouponTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            coupon: '=coupon',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_coupon.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'coupon';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                }), wt.data.coupon.remove_tag("", e.eid, t.tag_id, function () {
                }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_order_update, e)
            }
        }
    };
}
]);

wt.directive.directive('wtOrganizerTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            organizer: '=organizer',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_organizer.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'organizer';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                }), wt.data.organizer.remove_tag("", e.eid, t.tag_id, function () {
                }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_organizer_update, e)
            }
        }
    };
}
]);


wt.directive.directive('wtArticleTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            article: '=article',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_article.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'article';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (entity, tag) {
                entity.tags = _.reject(entity.tags, function (e) {
                    return e.tag_id === tag.tag_id
                });
                wt.data.article.remove_tag("", entity.eid, tag.tag_id, function () {});
                entity = d1(entity);
                tag.is_tag_edit = !1;
                $rootScope.$broadcast(kzi.constant.event_names.on_article_update, entity);
            }
        }
    };
}
]);

wt.directive.directive('wtUserTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            user: '=user',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_user.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'user';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                }), wt.data.user.remove_tag("", e.eid, t.tag_id, function () {
                }), e = d1(e), t.is_tag_edit = !1, $rootScope.$broadcast(kzi.constant.event_names.on_user_update, e)
            }
        }
    };
}
]);

wt.directive.directive('wtPostTags', ['$rootScope', function ($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            post: '=post',
            tagtype: '=tagtype'
        },
        transclude: true,
        replace: true,
        templateUrl: '/view/directive/tags_post.html',
        link: function (scope, elment, attrs) {
            scope.tagtype = attrs.tagtype;
            if (scope.tagtype == 'default') scope.tagtype = 'post';
            var d1 = function (e) {
                var t = _.size(e.tags),
                    i = _.size(_.where(e.tags, {
                        checked: 1
                    }));
                return t > 0 ? (e.percentage = parseInt(100 * (i / t)), e.status = i + "/" + t) : e.percentage = 0, e.badges.tag_checked_count = i, e.badges.tag_count = t, e
            }
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (e) {
                    return e.tag_id === t.tag_id
                });
                wt.data.post.remove_tag("", e.eid, t.tag_id, function () {
                });
                e = d1(e);
                t.is_tag_edit = !1;
                $rootScope.$broadcast(kzi.constant.event_names.on_post_update, e);
            }
        }
    };
}
]);

wt.directive.directive('wtContact', [
    function () {
        'use strict';
        return {
            restrict: 'E',
            scope: {
                customer: "=task"
            },
            replace: true,
            templateUrl: '/view/directive/badges_contact.html',
            link: function (t, i, n) {
            }
        };
    }
]);

wt.directive.directive('wtTadges', [
    'shortTimeFormatFilter',
    function (shortTimeFormatFilter) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/view/directive/tadges.html',
            link: function (t, i, n) {
                var a = function (e) {
                    var t = 0;
                    if (e.completed)
                        t = 0;
                    else {
                        var i = moment().valueOf(), n = 1000 * moment(e.expire_date).format('X');
                        t = i > n ? 1 : n > i && moment().add('days', 1).valueOf() > n ? 2 : 0;
                    }
                    return t;
                }, s = function (t) {
                    var n = '';
                    if (i.children('.icon-time').remove(), 0 != t.expire_date, 0 != t.expire_date && false /* 布尔注释 */) {
                        var s = shortTimeFormatFilter(t.expire_date), o = '', r = '', l = a(t);
                        r = '截止时间：' + s, 1 === l && (o = 'badge-expire-due', r = '活动已经截止'), 2 === l && (o = 'badge-expire-soon', r = '活动即将截止');
                        var c = [
                            '<span class="task-badge icon icon-time ' + o + '"',
                            ' title="' + r + '">',
                            s,
                            '</span> '
                        ].join('');
                        n += c;
                    }
                    if (i.children('.icon-th-list').remove(), t.badges.todo_count > 0) {
                        var u = t.badges.todo_checked_count + '/' + t.badges.todo_count, d = '';
                        t.badges.todo_checked_count === t.badges.todo_count && (d = ' badge-todo-done');
                        var p = '';
                        p = t.badges.todo_checked_count === t.badges.todo_count ? t.badges.todo_checked_count + '个检查项已全部完成' : '检查项：' + t.badges.todo_checked_count + '/' + t.badges.todo_count;
                        var f = [
                            '<span class="task-badge icon icon-th-list ' + d + '"',
                            ' title="' + p + '">',
                            u,
                            '</span> '
                        ].join('');
                        n += f;
                    }
                    if (i.children('.icon-paper-clip').remove(), t.badges.file_count > 0) {
                        var m = t.badges.file_count + '个', h = '活动有' + t.badges.file_count + '个附件', _ = [
                            '<span class="task-badge icon icon-paper-clip"',
                            ' title="' + h + '">',
                            m,
                            '</span> '
                        ].join('');
                        n += _;
                    }
                    if (i.children('.icon-envelope').remove(), t.badges.mail_count > 0) {
                        var m = t.badges.mail_count + '个', h = '活动有' + t.badges.mail_count + '个邮件', _ = [
                            '<span class="task-badge icon icon-envelope"',
                            ' title="' + h + '">',
                            m,
                            '</span> '
                        ].join('');
                        n += _;
                    }
                    if (i.children('.icon-comment-alt').remove(), t.badges.comment_count > 0) {
                        var g = t.badges.comment_count + '个', v = '活动有' + t.badges.comment_count + '个评论', b = [
                            '<span class="task-badge icon icon-comment-alt" style="margin-top:0px"',
                            ' title="' + v + '">',
                            g,
                            '</span> '
                        ].join('');
                        n += b;
                    }
                    if (i.children('.icon-user').remove(), t.badges.collect_count > 0) {
                        var g = t.badges.collect_count + '个', v = '活动有' + t.badges.collect_count + '个收藏者', b = [
                            '<span class="task-badge icon icon-user" style="margin-top:0px"',
                            ' title="' + v + '">',
                            g,
                            '</span> '
                        ].join('');
                        n += b;
                    }
                    i.append(n);
                };
                if (t.$watch(n.task, function (e, q) {
                        _.isUndefined(e) || _.isNull(e) || _.isEqual(e, {}) || _.isUndefined(e.badges) || _.isNull(e.badges) || null !== q && moment(e.expire_date).format('YYYY-MM-DD') === moment(q.expire_date).format('YYYY-MM-DD') && _.isEqual(e.badges, q.badges) && e.completed == q.completed || s(e);
                    }, true), !_.isUndefined(n.task)) {
                    var o = t.$eval(n.task);
                    if (_.isUndefined(o) || _.isEmpty(o))
                        return;
                    if (_.isEqual(o, {}))
                        return;
                    if (_.isUndefined(o.badges) || _.isNull(o.badges))
                        return;
                    s(o);
                }
            }
        };
    }
]);

wt.directive.directive('wtCascading', [
    '$http', '$rootScope',
    function ($http, $rootScope) {
        "use strict";
        var ret = {
            restrict: 'E',
            scope: {
                source: '=source',
                first: '=first',
                firstkey: '=firstkey',
                second: '=second',
                secondkey: '=secondkey',
                third: '=third',
                thirdkey: '=thirdkey',
                fourth: '=fourth',
                fourthkey: '=fourthkey',
                label: '@'
            },
            transclude: true,
            replace: true,
            templateUrl: '/view/directive/cascading.html',
            link: function (scope, elment, attrs) {
                scope.firstkey = scope.firstkey || "";
                scope.second = scope.second || "";
                scope.secondkey = scope.secondkey || "";
                scope.third = scope.third || "";
                scope.thirdkey = scope.thirdkey || "";
                scope.fourth = scope.fourth || "";
                scope.fourthkey = scope.fourthkey || "";

                //默认
                scope.showAll = false;
                scope.showFirst = false;
                scope.showSecond = false;
                scope.showThird = false;
                scope.showFourth = false;

                scope.need_more = true;

                if (attrs.class) {
                    elment.find("input").addClass(attrs.class);
                }

                // 级联数目的判断,不指定默认显示两级
                if (attrs.cascad) {
                    scope.need_more = attrs.cascad > 1 ? true : false;
                }

                // 初始化数据
                $http.get('/' + attrs.source).success(function (result) {
                    scope.firsts = result.data;
                    init();
                });

                function setDefaultIfPresent() {
                    var default_first = _.findWhere(scope.firsts, {
                            code: scope.firstkey
                        }) || {};
                    scope.first = default_first.cnName || "";

                    var default_second = _.findWhere(default_first.children || [], {
                            code: scope.secondkey
                        }) || {};
                    scope.second = default_second.cnName || "";

                    var default_third = _.findWhere(default_second.children || [], {
                            code: scope.thirdkey
                        }) || {};
                    scope.third = default_third.cnName || "";

                    var default_fourth = _.findWhere(default_third.children || [], {
                            code: scope.fourthkey
                        }) || {};
                    scope.fourth = default_fourth.cnName || "";
                }

                function init() {
                    setDefaultIfPresent();

                    scope.allClick = function () {
                        scope.showAll = false;
                    };
                    // 选中
                    scope.set = {
                        first: function (firstkey, first) {
                            scope.first = first;
                            scope.firstkey = firstkey;
                            scope.second = '';
                            scope.secondkey = '';
                            scope.third = '';
                            scope.thirdkey = '';
                            scope.fourth = '';
                            scope.fourthkey = '';
                            scope.showAll = true;
                            scope.showSecond = true;
                        },
                        second: function (secondkey, second) {
                            scope.secondkey = secondkey;
                            scope.second = second;
                            scope.third = '';
                            scope.thirdkey = '';
                            scope.fourth = '';
                            scope.fourthkey = '';
                            scope.showThird = true;
                        },
                        third: function (thirdkey, third) {
                            scope.thirdkey = thirdkey;
                            scope.third = third;
                            scope.fourth = '';
                            scope.fourthkey = '';
                            scope.showFourth = true;
                        },
                        fourth: function (fourthkey, fourth) {
                            scope.fourth = fourth;
                            scope.fourthkey = fourthkey;
                            scope.open('hide');
                        }
                    };

                    // 重置
                    scope.clear = function () {
                        scope.firstkey = "";
                        scope.first = "";
                        scope.secondkey = "";
                        scope.second = "";
                        scope.thirdkey = "";
                        scope.third = "";
                        scope.fourthkey = "";
                        scope.fourth = "";
                        scope.show = false;
                        scope.showAll = false;
                    };

                    // 显示或者关闭，当显示时发送带有source信息的事件--'cascading_open'
                    scope.open = function (action) {
                        action === 'show' ?
                            ( scope.show = true, $rootScope.$broadcast('cascading_open', attrs.source), bindClick() ) :
                            (scope.show = false, unbind());
                        scope.showAll = false;
                    };

                    // 根据选中的 p(省份) 值更新 cities(城市列表)
                    scope.$watch('firstkey', function (newValue) {
                        if (newValue) {
                            var result = scope.firsts.filter(function (v) {
                                if (attrs.cascad == 1) {
                                    scope.open('hide');
                                }
                                return v.code === newValue;
                            });

                            if (result[0]) {
                                scope.seconds = result[0].children, scope.showSecond = true
                            }
                        } else {
                            scope.seconds = [];
                        }
                    });

                    scope.$watch('secondkey', function (newValue) {
                        if (newValue) {
                            var result = scope.seconds.filter(function (v) {
                                if (attrs.cascad == 2) {
                                    scope.open('hide');
                                }
                                ;
                                return v.code === newValue;
                            });

                            if (result[0]) {
                                scope.thirds = result[0].children, scope.showThird = true
                            }
                        } else {

                            scope.thirds = [];
                        }
                    });

                    scope.$watch('thirdkey', function (newValue) {
                        if (newValue) {
                            var result = scope.thirds.filter(function (v) {
                                if (attrs.cascad == 3) {
                                    scope.open('hide');
                                }
                                ;
                                return v.code === newValue;
                            });

                            if (result[0]) {
                                scope.fourths = result[0].children, scope.showFourth = true
                            }
                            ;
                        } else {

                            scope.fourths = [];
                        }
                    });
                    // 任何数据变动都更新完整地址
                    scope.$watch(function (a, b, c) {
                        var content = (scope.first + ' ' + scope.second + ' ' + scope.third + ' ' + scope.fourth);
                        scope.all = content.replace(/undefined *|   /g, '');
                        if (scope.all == ' ') {
                            scope.all = ''
                        }
                    });
                    //关闭
                    function close() {
                        scope.$apply(function () {
                            scope.show = false;
                        });
                        unbind();
                    };

                    //绑定点击
                    function bindClick() {
                        $('body:not(a)').bind('click', function (event) {
                            $(event.target).hasClass('.cascading-wapper') ||
                            $(event.target).parents('.cascading-wapper').length > 0 ||
                            $(event.target).hasClass('.cascading') ||
                            $(event.target).parents('.cascading').length > 0 ||
                            $(event.target).hasClass('.cascade-trigger') ||
                            $(event.target).parents('.cascade-trigger').length > 0 ||
                            $rootScope.$broadcast('close_all_cascading', 1);
                        });
                    };
                    //解绑
                    function unbind() {
                        $('body:not(a)').unbind('click');
                    };
                    //其他cascading打开时，自身隐藏
                    $rootScope.$on('cascading_open', function (event, i) {
                        if (attrs.source != i) {
                            scope.show = false;
                        } else {
                        }
                    });
                    //点击非级联区域，隐藏
                    $rootScope.$on('close_all_cascading', function (e, i) {
                        if (i) {
                            close();
                        }
                    });
                }
            }
        }
        return ret;
    }
]);


wt.directive.directive('wtCascading2', [
    '$http', '$rootScope', '$timeout',
    function ($http, $rootScope, $timeout) {
        "use strict";
        return {
            restrict: 'E',
            scope: {
                source: '@source',
                first: '=first',
                firstkey: '=firstkey',
                second: '=second',
                secondkey: '=secondkey'
            },
            replace: true,
            templateUrl: '/view/directive/cascading2.html',
            link: function (scope, element, attrs) {
                //默认
                scope.show = false;

                // 初始化数据
                $http.get('/' + scope.source).success(function (result) {
                    scope.main = result.data;
                    scope.label = result.label;

                    //默认显示信息
                    scope.name = '全部' + scope.label;

                    //设置默认显示信息
                    if (scope.firstkey && scope.firstkey !== "undefined") {
                        var default_first = _.filter(scope.main, function (i) {
                            return i.code == scope.firstkey;
                        });
                        scope.first = default_first[0].cnName;

                        if (scope.secondkey && scope.secondkey !== "undefined") {
                            var default_second = _.filter(default_first[0].children, function (i) {
                                return i.code == scope.secondkey;
                            })
                            scope.second = default_second[0].cnName;
                        }
                    }
                });


                scope.setMain = function (item) {
                    scope.first = item.cnName;
                    scope.firstkey = item.code;
                    scope.children = item.children;
                }

                scope.setChild = function (item) {
                    scope.second = item.cnName;
                    scope.secondkey = item.code;
                }

                scope.firstAllClick = function () {
                    scope.firstkey = '';
                    scope.secondkey = '';
                    scope.name = '全部' + scope.label;
                    scope.show = false;
                }

                scope.secondAllClick = function () {
                    scope.second = '';
                    scope.secondkey = '';
                }
                $rootScope.$on(kzi.constant.event_names.project_clear_task_filter,
                    function () {
                        scope.name = '全部' + scope.label;
                    })
                scope.$watch('first', function (first) {
                    if (typeof (first) != 'undefined') {
                        scope.name = first;
                    }
                });

                scope.$watch('second', function (second) {
                    if (typeof (second) != 'undefined') {
                        scope.name = scope.second;
                    }
                })

                //关闭
                var close = function () {
                    scope.$apply(function () {
                        scope.show = false;
                    });
                    unbind();
                };
                //打开
                scope.open = function () {
                    scope.show = true;
                    $rootScope.$broadcast('cascading_open', scope.source);
                    bindClick();
                };
                //绑定点击
                var bindClick = function () {
                    $('body:not(a)').bind('click', function (event) {
                        $(event.target).hasClass('.cascading-wapper') ||
                        $(event.target).parents('.cascading-wapper').length > 0 ||
                        $(event.target).hasClass('.cascading') ||
                        $(event.target).parents('.cascading').length > 0 ||
                        $(event.target).hasClass('.cascade-trigger') ||
                        $(event.target).parents('.cascade-trigger').length > 0 ||
                        $rootScope.$broadcast('close_all_cascading', 1);
                    });
                };
                //解绑
                var unbind = function () {
                    $('body:not(a)').unbind('click');
                };
                //其他cascading打开时，自身隐藏
                $rootScope.$on('cascading_open', function (event, i) {
                    if (scope.source != i) {
                        scope.show = false;
                    } else {
                    }
                });
                //点击非级联区域，隐藏
                $rootScope.$on('close_all_cascading', function (e, i) {
                    if (i) {
                        close();
                    }
                });
            }
        }
    }
]);

//选择类型
wt.directive.directive('wtChoosemonolayer', [
    '$http', '$rootScope',
    function ($http, $rootScope) {
        "use strict";
        return {
            restrict: 'E',
            scope: {
                value: '=value',
                key: '=key'
            },
            replace: true,
            templateUrl: '/view/directive/chooseMonolayer.html',
            link: function (scope, elment, attrs) {
                scope.showAll = false;//默认无数据，不显示

                // 初始化数据
                $http.get('/' + attrs.source).success(function (result) {
                    scope.datas = result.postTypes;//获取所有数据内容
                    scope.label = result.label;//获取显示的数据类型名称
                    init();
                });

                function init() {
                    // 选中
                    scope.set = {
                        //选择数据
                        choose: function (key, value) {
                            scope.value = value;
                            scope.showValue = value;
                            scope.key = key;
                            scope.showAll = false;
                        },

                        //清空数据
                        clear: function () {
                            delete scope.key;
                            delete scope.value;
                            delete scope.showValue;
                            scope.show = false;
                            scope.showAll = false;
                        }
                    };


                    // 显示或者关闭，当显示时发送带有source信息的事件--'cascading_open'
                    scope.open = function (action) {
                        if (action === 'show') {
                            scope.show = true;
                            $rootScope.$broadcast('kzi.constant.event_names.cascading_open', attrs.source);
                        } else {
                            scope.show = false;
                        }
                        scope.showAll = false;
                    };

                    //接受'cascading_open'事件,如果事件中的参数与source不相等，关闭当前的数据窗口
                    scope.$on('kzi.constant.event_names.cascading_open', function (e, i) {
                        if (attrs.source != i) {
                            scope.show = false;
                        }
                    });
                }
            }

        }
    }
]);

wt.directive.directive('wtAttachment', [
    '$parse',
    function ($parse) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/view/directive/attachment.html',
            link: function (t, i, n) {
                var a = function () {
                    var s = i.children('.file-action');
                    i.attr('title', t.file.name);
                    s.children('.file-del').remove();
                    var o = true;
                    if (_.isEmpty(n.delPermission) || (o = t.$eval(n.delPermission)), o && !_.isEmpty(n.del)) {
                        var r = $parse(n.del);
                        var l = [
                            '<a class="file-del" href="javascript:;"',
                            ' wt-tracker="Attachments Item|Action|Delete Link">',
                            '删除',
                            '</a>'
                        ].join('');
                        s.append(l);
                        s.children('.file-del').bind('click.wt-del-attachment', function (e) {
                            t.$apply(function () {
                                r(t, {$event: e});
                            });
                        });
                    }
                };
                _.isObject(i.scope().file) && a();
            }
        };
    }
]);

wt.directive.directive('wtNotice', [
    '$parse',
    function ($parse) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/view/directive/notice.html',
            link: function (t, i, n) {
                var a = $parse(n.noticeClick), s = t.notice.template;
                switch (s) {
                    case 'task_assign':
                        t.action = '给你分配了新的活动', t.type_icon = kzi.constant.notice_type_icon.task, t.display_entity = t.notice.data.entity;
                        break;
                    case 'task_complete':
                        t.action = '完成了活动', t.type_icon = kzi.constant.notice_type_icon.task, t.display_entity = t.notice.data.entity;
                        break;
                    case 'event_attend':
                        t.action = '邀请你参与日程', t.type_icon = kzi.constant.notice_type_icon.event, t.display_entity = t.notice.data.entity;
                        break;
                    case 'task_watch':
                        t.action = '提醒你关注活动', t.type_icon = kzi.constant.notice_type_icon.task, t.display_entity = t.notice.data.entity;
                        break;
                    case 'file_watch':
                        t.action = '提醒你关注文件', t.type_icon = kzi.constant.notice_type_icon.file, t.display_entity = t.notice.data.entity;
                        break;
                    case 'post_watch':
                        t.action = '提醒你关注话题', t.type_icon = kzi.constant.notice_type_icon.post, t.display_entity = t.notice.data.entity;
                        break;
                    case 'page_watch':
                        t.action = '提醒你关注文档', t.type_icon = kzi.constant.notice_type_icon.page, t.display_entity = t.notice.data.entity;
                        break;
                    case 'task_comment':
                        t.action = '评论了活动：' + t.notice.data.target.name, t.type_icon = kzi.constant.notice_type_icon.comment, t.display_entity = t.notice.data.entity, t.send_entity = t.notice.data.target;
                        break;
                    case 'event_comment':
                        t.action = '评论了日程：' + t.notice.data.target.name, t.type_icon = kzi.constant.notice_type_icon.comment, t.display_entity = t.notice.data.entity, t.send_entity = t.notice.data.target;
                        break;
                    case 'file_comment':
                        t.action = '评论了文件：' + t.notice.data.target.name, t.type_icon = kzi.constant.notice_type_icon.comment, t.display_entity = t.notice.data.entity, t.send_entity = t.notice.data.target;
                        break;
                    case 'post_comment':
                        t.action = '评论了话题：' + t.notice.data.target.name, t.type_icon = kzi.constant.notice_type_icon.comment, t.display_entity = t.notice.data.entity, t.send_entity = t.notice.data.target;
                        break;
                    case 'page_comment':
                        t.action = '评论了文档：' + t.notice.data.target.name, t.type_icon = kzi.constant.notice_type_icon.comment, t.display_entity = t.notice.data.entity, t.send_entity = t.notice.data.target;
                        break;
                    case 'file_version':
                        t.action = '上传了文件新版本', t.type_icon = kzi.constant.notice_type_icon.file, t.display_entity = t.notice.data.entity;
                        break;
                    case 'page_version':
                        t.action = '提交了文档新版本', t.type_icon = kzi.constant.notice_type_icon.page, t.display_entity = t.notice.data.entity;
                        break;
                    case 'metion_at_comment':
                        t.action = '在评论中提到了你', t.type_icon = kzi.constant.notice_type_icon.comment, t.display_entity = t.notice.data.entity, t.send_entity = t.notice.data.target;
                        break;
                    case 'project_archive':
                        t.action = '归档了群组', t.type_icon = kzi.constant.notice_type_icon.project, t.display_entity = t.notice.data.entity;
                        break;
                    case 'project_delete':
                        t.action = '删除了群组', t.type_icon = kzi.constant.notice_type_icon.project, t.display_entity = t.notice.data.entity;
                        break;
                    case 'project_member_add':
                        t.action = '把你加入了群组', t.type_icon = kzi.constant.notice_type_icon.project, t.display_entity = t.notice.data.entity;
                        break;
                    case 'project_member_remove':
                        t.action = '把你移出了群组', t.type_icon = kzi.constant.notice_type_icon.project, t.display_entity = t.notice.data.entity;
                        break;
                    case 'project_member_admin':
                        t.action = '设置你为群组的负责人', t.type_icon = kzi.constant.notice_type_icon.project, t.display_entity = t.notice.data.entity;
                        break;
                    case 'add_task_to_entry':
                        t.action = '在列表 ' + t.notice.data.target.name + ' 上添加了活动', t.type_icon = kzi.constant.notice_type_icon.task, t.display_entity = t.notice.data.entity;
                        break;
                    case 'move_task_to_entry':
                        t.action = '移动活动到了列表 ' + t.notice.data.target.name + ' 上', t.type_icon = kzi.constant.notice_type_icon.task, t.display_entity = t.notice.data.entity;
                        break;
                    default:
                        t.action = s + '未实现';
                }
                t.js_click_notice = function () {
                    if (!_.isEmpty(t.send_entity))
                        return a(t, {
                            $eType: t.send_entity.etype,
                            $entity: t.send_entity
                        }), void 0;
                    var e = null;
                    _.isEmpty(t.type_icon) || (e = t.type_icon.name), a(t, {
                        $eType: e,
                        $entity: t.display_entity
                    });
                };
            }
        };
    }
]);

wt.directive.directive('wtFeed', [
    '$rootScope',
    function ($rootScope) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/view/directive/feed.html',
            link: function (e) {
                var a = e.feed.template;

                switch (a) {
                    case 'user_login':
                        e.action = '登录成功', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'user_signup':
                        e.action = '注册了帐号', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_create':
                        e.action = '新建了活动', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_remove':
                        e.action = '移除了活动', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_update':
                        e.action = '更新了活动', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_share':
                        e.action = '分享了活动', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_collect':
                        e.action = '收藏了活动', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_pay_for_email':
                        e.action = '查看活动邮箱', e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_complete':
                        e.action = '完成了活动', e.type_icon = kzi.constant.feed_type_icon.completed, e.display_entity = e.feed.data.entity;
                        break;
                    case 'task_comment_add':
                        e.action = '评论了活动：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'send_mails':
                        e.action = '邮件了活动：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.mail, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'task_mail_opend':
                        e.action = '邮件被打开：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.mail, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'task_labels_add':
                        e.action = '标记了活动：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.tag, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'task_tags_add':
                        e.action = '在 活动 ' + e.feed.data.target.name + ' 中增加了标签', e.type_icon = kzi.constant.feed_type_icon.tag, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'task_tags_remove':
                        e.action = '在 活动 ' + e.feed.data.target.name + ' 中移除了标签', e.type_icon = kzi.constant.feed_type_icon.tag, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'task_attach_file':
                        e.action = '在活动上添加了附件：' + e.feed.data.entity.name, e.type_icon = kzi.constant.feed_type_icon.task, e.display_entity = e.feed.data.target, e.send_entity = e.feed.data.target;
                        break;
                    case 'file_upload':
                        e.action = '上传了文件', e.type_icon = kzi.constant.feed_type_icon.file, e.display_entity = e.feed.data.entity;
                        break;
                    case 'file_new_version':
                        e.action = '上传了文件新版本', e.type_icon = kzi.constant.feed_type_icon.file, e.display_entity = e.feed.data.entity;
                        break;
                    case 'file_comment_add':
                        e.action = '评论了文件：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'post_create':
                        e.action = '发起了新问答', e.type_icon = kzi.constant.feed_type_icon.post, e.display_entity = e.feed.data.entity;
                        break;
                    case 'post_collect':
                        e.action = '关注了问答', e.type_icon = kzi.constant.feed_type_icon.post, e.display_entity = e.feed.data.entity;
                        break;
                    case 'post_tags_add':
                        e.action = '在 知识 ' + e.feed.data.target.name + ' 中增加了标签', e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'post_tags_remove':
                        e.action = '在 知识 ' + e.feed.data.target.name + ' 中移除了标签', e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'post_share':
                        e.action = '分享了问答', e.type_icon = kzi.constant.feed_type_icon.post, e.display_entity = e.feed.data.entity;
                        break;
                    case 'good_post_share':
                        e.action = '问答被移入精华区', e.type_icon = kzi.constant.feed_type_icon.post, e.display_entity = e.feed.data.entity;
                        break;
                    case 'post_comment_add':
                        e.action = '评论了问答：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'template_create':
                        e.action = '创建了模板', e.type_icon = kzi.constant.feed_type_icon.template, e.display_entity = e.feed.data.entity;
                        break;
                    case 'template_update':
                        e.action = '更新了模板', e.type_icon = kzi.constant.feed_type_icon.template, e.display_entity = e.feed.data.entity;
                        break;
                    case 'sys_template_delete':
                        e.action = '模板包含不当内容，被管理员删除', e.type_icon = kzi.constant.feed_type_icon.template, e.display_entity = e.feed.data.entity;
                        break;
                    case 'template_delete':
                        e.action = '删除了模板', e.type_icon = kzi.constant.feed_type_icon.template, e.display_entity = e.feed.data.entity;
                        break;
                    case 'template_collect':
                        e.action = '收藏了模板', e.type_icon = kzi.constant.feed_type_icon.template, e.display_entity = e.feed.data.entity;
                        break;
                    case 'template_share':
                        e.action = '分享了模板', e.type_icon = kzi.constant.feed_type_icon.template, e.display_entity = e.feed.data.entity;
                        break;
                    case 'template_comment_add':
                        e.action = '评论了模板：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'template_tags_add':
                        e.action = '在 模板 ' + e.feed.data.target.name + ' 中增加了标签', e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'template_tags_remove':
                        e.action = '在 模板 ' + e.feed.data.target.name + ' 中移除了标签', e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'event_create':
                        e.action = '新建了日程', e.type_icon = kzi.constant.feed_type_icon.event, e.display_entity = e.feed.data.entity;
                        break;
                    case 'event_comment_add':
                        e.action = '评论了日程：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'page_create':
                        e.action = '新建了文档', e.type_icon = kzi.constant.feed_type_icon.page, e.display_entity = e.feed.data.entity;
                        break;
                    case 'page_comment_add':
                        e.action = '评论了文档：' + e.feed.data.target.name, e.type_icon = kzi.constant.feed_type_icon.comment, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    case 'mail_opend':
                        e.action = '邮件被打开了', e.type_icon = kzi.constant.feed_type_icon.mail, e.display_entity = e.feed.data.entity, e.send_entity = e.feed.data.target;
                        break;
                    default:
                }
                ;
                e.js_click_feed = function () {
                    switch (a) {
                        case 'task_share':
                            $rootScope.locator.show_slide = false;
                            ;
                            return;
                        default:
                            ;
                    }
                    $rootScope.locator.show_detail_feed_id = e.feed.objectId;
//                    if (!_.isEmpty(e.send_entity))
//                        return $rootScope.locator.to_entity(e.feed.filter.prj, e.send_entity, true), void 0;
//                    var i = null;
//                    _.isEmpty(e.type_icon) || (i = e.type_icon.name);
                    if (_.isEmpty(e.send_entity)) {
                        e.send_entity = e.display_entity;
                    }
                    $rootScope.locator.to_entity(e.feed.filter.prj, e.send_entity, true);
                };
            }
        };
    }
]);

wt.directive.directive("wtInboxTrigger", ["$rootScope", "$timeout",
    function (e) {
        "use strict";
        return {
            restrict: "A",
            link: function (t, i) {
                function s() {
                    var t = kzi.util.winHeight() - 58;
                    a = e.global.title, e.global.title = "消息中心", $("#inbox").animate({
                        height: t
                    }, 100, "", function () {
                        e.$broadcast("wtInboxTriggerSuccess", !0),
                            $(window).bind("resize.show_inbox", function () {
                                var t = kzi.util.winHeight() - 58;
                                $("#inbox").height(t)
                            }),
                            $(document).bind("click.show_inbox", function (t) {
                                0 == $(t.target).parents("#inbox").length &&
                                0 == $(t.target).parents(".slide-content").length &&
                                0 == $(t.target).parents(".popbox").length &&
                                0 != $(document).find(t.target).length &&
                                0 == $(t.target).parents("#fancybox-buttons").length &&
                                (e.global.show_inbox = !1, e.$apply())
                            }),
                            $(document).bind("keydown.show_inbox keypress.show_inbox", function (t) {
                                var i = t.which || t.keyCode;
                                (i !== kzi.constant.keyASCIIs.VK_SPACE || "keypress" !== event.type) &&
                                "0px" == $(".slide-content").css("width") &&
                                i === kzi.constant.keyASCIIs.ESC &&
                                (e.global.show_inbox = !1, e.$apply(), event.preventDefault())
                            })
                    })
                }

                function r() {
                    e.$broadcast("wtInboxTriggerSuccess", !1),
                    _.isEmpty(a) || (e.global.title = a),
                        $("#inbox").animate({
                            height: 0
                        }, 100, "", function () {
                            $(window).unbind("resize.show_inbox"),
                                $(document).unbind("click.show_inbox"),
                                $(document).unbind("keydown.show_inbox keypress.show_inbox")
                        })
                }

                var a = "";
                t.$watch("global.show_inbox", function (e) {
                    e ? s() : r()
                }),
                    i.bind("click", function (t) {
                        t.stopPropagation(),
                            e.$apply(function () {
                                e.global.show_inbox = !e.global.show_inbox
                            })
                    })
            }
        }
    }
]).directive("wtInboxView", [
    function () {
        "use strict";
        return {
            restrict: "E",
            controller: "inbox_ctrl",
            replace: !0,
            scope: !0,
            templateUrl: "/view/directive/inbox.html",
            link: function () {
            }
        }
    }
]);

wt.directive.directive("wtGeneratorboxTrigger", ["$rootScope", "$timeout",
    function (e, $timeout) {
        "use strict";
        return {
            restrict: "A",
            link: function (t, i) {
                function s() {
                    var t = kzi.util.winHeight() - 58;
                    a = e.global.title, e.global.title = "神笔哆哆", $("#generatorbox").animate({
                        height: t
                    }, 100, "", function () {
                        e.$broadcast("wtGeneratorboxSuccess", !0),
                            $(window).bind("resize.show_generatorbox", function () {
                                var t = kzi.util.winHeight() - 58;
                                $("#generatorbox").height(t)
                            });
                        $(document).bind("click.show_generatorbox", function (t) {
                            0 == $(t.target).parents("#generatorbox").length &&
                            0 == $(t.target).parents(".click-other-dont-hide").length &&
                            0 == $(t.target).parents(".slide-content").length &&
                            0 == $(t.target).parents(".popbox").length &&
                            0 != $(document).find(t.target).length &&
                            0 == $(t.target).parents("#fancybox-buttons").length &&
                            (e.global.show_generatorbox = !1, e.$apply())
                        }),
                            $(document).bind("keydown.show_generatorbox keypress.show_generatorbox", function (t) {
                                var i = t.which || t.keyCode;
                                (i !== kzi.constant.keyASCIIs.VK_SPACE || "keypress" !== event.type) &&
                                "0px" == $(".slide-content").css("width") &&
                                i === kzi.constant.keyASCIIs.ESC &&
                                (e.global.show_generatorbox = !1,
                                    e.$apply(),
                                    event.preventDefault())
                            })
                    })
                }

                function r() {
                    e.$broadcast("wtGeneratorboxSuccess", !1),
                    _.isEmpty(a) || (e.global.title = a),
                        $("#generatorbox").animate({
                            height: 0
                        }, 100, "", function () {
                            $(window).unbind("resize.show_generatorbox"),
                                $(document).unbind("click.show_generatorbox"),
                                $(document).unbind("keydown.show_generatorbox keypress.show_generatorbox")
                        });
                }

                e.$on(kzi.constant.event_names.open_template_generator, function (evt, i) {
                    e.global.show_generatorbox = true;
                    //与其他浮窗互斥
                    if (e.global.show_generatorbox) {
                        e.global.boxshow_type = "generatorbox";
                        e.global.show_scorebox = false;
                        e.global.show_searchbox = false;
                    }
                })

                var a = "";
                t.$watch(function () {
                    return e.global.show_generatorbox;
                }, function (e) {
                    e ? s() : r()
                }),
                    i.bind("click", function (t) {
                        t.stopPropagation(),
                            e.$apply(function () {
                                e.global.show_generatorbox = !e.global.show_generatorbox;
                                //与其他浮窗互斥
                                if (e.global.show_generatorbox) {
                                    e.global.boxshow_type = "generatorbox";
                                    e.global.show_scorebox = false;
                                    e.global.show_searchbox = false;
                                }
                            })
                    })
            }
        }
    }
]).directive("wtGeneratorboxView", ["$timeout", "$rootScope", "$popbox", "sanitize", "templateNewGeneratorInfo", function ($timeout, t, i, n, templateGeneratorInfo) {
    "use strict";
    return {
        restrict: "E",
        controller: "commonGeneratorCtrl",
        replace: !0,
        scope: !0,
        templateUrl: "/view/directive/generatorbox.html",
        link: function (scope, s, attr) {
            function f() {
                $timeout(function () {
                    if (scope.content) {
                        var e = d.makeHtml(scope.content),
                            t = n(e);
                        scope.html = t
                    }
                    _.isEmpty(scope.content) && (scope.html = "")
                }), p = void 0
            }

            function h() {
                p ? (clearTimeout(p), p = setTimeout(f, 500)) : p = setTimeout(f, 500)
            }

            scope.hideMini = !1, scope.inPreview = !1, scope.isFullscreen = !1;
            var r = !1,
                o = !1;
            scope.isMini = "mini" === scope.mode ? !0 : !1,
                s.find(".fullscreen-mk-content-textarea").on("scroll", function () {
                    if (!o) {
                        r = !0;
                        var t = s.find(".right-side"),
                            i = s.find(".fullscreen-mk-content-textarea"),
                            n = i.scrollTop(),
                            a = t.prop("scrollHeight") - t.prop("clientHeight"),
                            l = i.prop("scrollHeight") - i.prop("clientHeight"),
                            c = n / l * a;
                        t.scrollTop(c), $timeout(function () {
                            r = !1
                        }, 200)
                    }
                }), s.find(".right-side").on("scroll", function () {
                if (!r) {
                    o = !0;
                    var t = s.find(".right-side"),
                        i = s.find(".fullscreen-mk-content-textarea"),
                        n = t.scrollTop(),
                        a = t.prop("scrollHeight") - t.prop("clientHeight"),
                        l = i.prop("scrollHeight") - i.prop("clientHeight"),
                        c = n / a * l;
                    i.scrollTop(c), $timeout(function () {
                        o = !1
                    }, 200)
                }
            });
            var l = s.find(".wnd-content-textarea"),
                c = s.find(".fullscreen-mk-content-textarea"),
                d = new Markdown.Converter;
            Markdown.Extra.init(d), Markdown.Extra.init(d);
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
                        replace: "{$1}",
                        defaultText: "收件人",
                        select: {
                            leftOmit: 1,
                            rightOmit: 1
                        }
                    },
                    "cmd-insert-link": {
                        exec: function (t, n) {
                            i.popbox({
                                target: t,
                                placement: "bottom",
                                templateUrl: "/view/common/pop_add_link_2.html",
                                controller: ["$scope", "popbox", function (t, i) {
                                    t.popbox = i, t.link_address = "http://", t.insert = function () {
                                        var s = n.textrange("get");
                                        0 === s.length && (s.text = "输入超链接描述", s.length = s.text.length);
                                        var r = "[" + s.text + "](" + t.link_address + ")";
                                        n.textrange("replace", r);
                                        var o = s.start + 1,
                                            l = s.text.length;
                                        $timeout(function () {
                                            n.textrange("set", o, l)
                                        }), scope.content = n.val(), i.close()
                                    }
                                }]
                            }).open()
                        }
                    },
                    "cmd-insert-image": {
                        exec: function (t, n) {
                            i.popbox({
                                target: t,
                                placement: "bottom",
                                templateUrl: "/view/common/pop_add_image2.html",
                                controller: ["$rootScope", "$scope", "$filter", "$routeParams", "popbox", "$sce", function (t, $scope, s, r, popbox, l) {
                                    $scope.popbox = popbox, $scope.step = 0, $scope.pid = scope.pid, $scope.js_step = function (e) {
                                        $scope.step = e
                                    }, $scope.js_close = function () {
                                        popbox.close()
                                    }, $scope.js_show_images = function () {
                                        $scope.step = 1, _.isEmpty($scope.images) && ($scope.images_loading_done = !1, $scope.images = null, wt.data.file.get_image_list($scope.pid, function (e) {
                                            $scope.images = e.data
                                        }, null, function () {
                                            $scope.images_loading_done = !0
                                        }))
                                    }, $scope.js_select_image = function (e) {
                                        $scope.step = 0, $scope.image_address = kzi.config.wtprj_url + e.path, $scope.js_insert_image(null)
                                    }, $scope.js_insert_image = function () {
                                        var t = n.textrange("get");
                                        n.textrange("replace", "![替代文字](" + $scope.image_address + ")"), $timeout(function () {
                                            n.textrange("set", t.start + 2, 4)
                                        }), scope.content = n.val(), popbox.close()
                                    }, $scope.js_upload_image = function () {
                                        $scope.uploading_done !== !0 && $("#file_upload").click()
                                    }, $scope.token = kzi.get_cookie("sid"), $scope.action_url = t.global.config.box_url() + "/upload?pid=" + $scope.pid + "&token=" + $scope.token, l.trustAsUrl($scope.action_url),
                                        $scope.file_upload_option = {
                                            processstart: function () {
                                                $scope.uploading_done = !1, $scope.error_msg = null
                                            },
                                            process: function (e, t) {
                                                var i = 0;
                                                _.isEmpty(t.files) || (i = t.files[0].size), popbox.modalEl.find("form").fileupload({
                                                    formData: {
                                                        size: i,
                                                        target: "prj"
                                                    }
                                                })
                                            },
                                            processfail: function () {
                                                $scope.error_msg = "上传失败,此处只支持图片格式的文件", $scope.uploading_done = !0
                                            },
                                            done: function (e, t) {
                                                if (_.isEmpty(t.result.files)) $scope.uploading_done = !0;
                                                else {
                                                    var n = {
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
                                                    wt.data.file.new_upload($scope.pid, n, function (e) {
                                                        200 === e.code &&
                                                        (e.data.icon = kzi.helper.build_file_icon(e.data),
                                                        _.isEmpty($scope.images) ||
                                                        $scope.images.push(e.data),
                                                            $scope.image_address = kzi.config.wtprj_url + e.data.path,
                                                            $scope.js_insert_image(),
                                                            $scope.uploading_done = !0)
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
                                    if (_.isEmpty(scope.title)) return kzi.msg.error("标题不能为空"), void 0;
                                    if (_.isEmpty(scope.entity_id)) {
                                        var r = _.pluck(scope.watchers, "uid");
                                        scope.is_saving = !0, wt.data.post.add(scope.pid, scope.title, scope.content, r, function (e) {
                                            t.$broadcast(kzi.constant.event_names.post_created_by_editor, e.data), scope.entity_id = e.data.post_id, kzi.msg.success("保存新话题成功")
                                        }, function () {
                                            kzi.msg.error("保存新话题失败")
                                        }, function () {
                                            scope.is_saving = !1, $timeout(function () {
                                                s.closest("[wt-scroll]").mCustomScrollbar("disable")
                                            }, 200)
                                        })
                                    } else scope.is_saving = !0, wt.data.post.update(scope.pid, scope.entity_id, scope.title, scope.content, function () {
                                        kzi.msg.success("更新话题成功"), t.$broadcast(kzi.constant.event_names.post_updated_by_editor, {
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
                                    break;
                                case "page":
                                    if (_.isEmpty(scope.title)) return kzi.msg.error("标题不能为空"), void 0;
                                    _.isEmpty(scope.entity_id) ? (scope.is_saving = !0, wt.data.page.add(scope.pid, scope.title, scope.content, scope.page_message, scope.page_parent_id, function (e) {
                                        kzi.msg.success("添加文档成功!"), scope.entity_id = e.data.page_id, t.$broadcast(kzi.constant.event_names.page_created_by_editor, e.data)
                                    }, null, function () {
                                        scope.is_saving = !1
                                    })) : (scope.is_saving = !0, wt.data.page.update(scope.pid, scope.entity_id, scope.title, scope.content, scope.page_message, scope.page_parent_id, scope.page_is_notify, 0, function () {
                                        kzi.msg.success("更新文档成功!"), t.$broadcast(kzi.constant.event_names.page_updated_by_editor, {
                                            name: scope.title,
                                            content: scope.content,
                                            message: scope.page_message
                                        })
                                    }, null, function () {
                                        scope.is_saving = !1
                                    }));
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
            }), scope.execEditorCmd = function (t, i) {
                var n;
                if (n = scope.isFullscreen ?
                        c :
                        scope.isMini ?
                            s.find(".mini-content-textarea") :
                            l, u[i].search && u[i].replace) {
                    var r = n.textrange("get");
                    0 === r.length && (u[i].defaultText && (r.text = u[i].defaultText), r.length = r.text.length);
                    var o = r.text.replace(u[i].search, u[i].replace);
                    n.textrange("replace", o), scope.content = n.val(), $timeout(function () {
                        if (u[i].select) {
                            var e = r.start;
                            e += u[i].select.leftOmit;
                            var t = o.length;
                            t = t - u[i].select.rightOmit - u[i].select.leftOmit, n.textrange("set", e, t)
                        }
                    })
                }
                if (u[i].append && (n.textrange("replace", u[i].append), scope.content = n.val(), u[i].select)) {
                    var d = n.textrange("get"),
                        p = d.start;
                    p += u[i].select.leftOmit, n.textrange("set", p, 0)
                }
                u[i].exec && u[i].exec(t, n)
            }, scope.flipPreview = function () {
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
                    s.scrollTop(o), e.find(".front").css("z-index", 1), e.find(".back").css("z-index", 2)
                } else e.removeClass("flipped"), scope.inPreview = !scope.inPreview, e.find(".front").css("z-index", 2), e.find(".back").css("z-index", 1)
            }, scope.goFullscreen = function () {
                f(), scope.isFullscreen = !0, scope.isMini === !0 && (scope.hideMini = !0);
                var e = s.closest(".slide-content");
                e.css("overflow", "visible"), scope.isMini && s.find(".left-right-container").css("top", "48px");
                var t = s.closest("[wt-scroll]");
                t.mCustomScrollbar("disable")
            }, scope.cancelFullscreen = function () {
                scope.isFullscreen = !1, scope.isMini === !0 && (scope.hideMini = !1);
                var e = s.closest(".slide-content");
                e.css("overflow", "hidden");
                var t = s.closest("[wt-scroll]");
                t.mCustomScrollbar("update")
            }
        }
    }
}
]);

wt.directive.directive("wtSearchboxTrigger", ["$rootScope", "$timeout",
    function (e) {
        "use strict";
        return {
            restrict: "A",
            link: function (t, i) {
                function s() {
                    var t = kzi.util.winHeight() - 58;
                    a = e.global.title, e.global.title = "搜索", $("#searchbox").animate({
                        height: t
                    }, 100, "", function () {
                        e.$broadcast("wtSearchboxTriggerSuccess", !0),
                            $(window).bind("resize.show_searchbox", function () {
                                var t = kzi.util.winHeight() - 58;
                                $("#searchbox").height(t)
                            });
                        $(document).bind("click.show_searchbox", function (t) {
                            0 == $(t.target).parents("#searchbox").length &&
                            0 == $(t.target).parents(".slide-content").length &&
                            0 == $(t.target).parents(".popbox").length &&
                            0 != $(document).find(t.target).length &&
                            0 == $(t.target).parents("#fancybox-buttons").length &&
                            (e.global.show_searchbox = !1, e.$apply())
                        }),
                            $(document).bind("keydown.show_searchbox keypress.show_searchbox", function (t) {
                                var i = t.which || t.keyCode;
                                (i !== kzi.constant.keyASCIIs.VK_SPACE || "keypress" !== event.type) &&
                                "0px" == $(".slide-content").css("width") &&
                                i === kzi.constant.keyASCIIs.ESC &&
                                (e.global.show_searchbox = !1,
                                    e.$apply(),
                                    event.preventDefault())
                            })
                    })
                }

                function r() {
                    e.$broadcast("wtSearchboxTriggerSuccess", !1),
                    _.isEmpty(a) || (e.global.title = a),
                        $("#searchbox").animate({
                            height: 0
                        }, 100, "", function () {
                            $(window).unbind("resize.show_searchbox"),
                                $(document).unbind("click.show_searchbox"),
                                $(document).unbind("keydown.show_searchbox keypress.show_searchbox")
                        });
                }

                var a = "";
                t.$watch("global.show_searchbox", function (e) {
                    e ? s() : r()
                }),
                    i.bind("click", function (t) {
                        t.stopPropagation(),
                            e.$apply(function () {
                                e.global.show_searchbox = !e.global.show_searchbox;
                                //与其他浮窗互斥
                                if (e.global.show_searchbox) {
                                    e.global.boxshow_type = "searchbox";
                                    e.global.show_scorebox = false;
                                    e.global.show_mailbox = false;
                                    e.global.show_generatorbox = false;
                                }
                            })
                    })
            }
        }
    }
]).directive("wtSearchboxView", [
    function () {
        "use strict";
        return {
            restrict: "E",
            controller: "search_result_ctrl",
            replace: !0,
            scope: !0,
            templateUrl: "/view/directive/searchbox.html",
            link: function () {
            }
        }
    }
]);

wt.directive.directive("wtScoreboxTrigger", ["$rootScope", "$timeout",
    function (e) {
        "use strict";
        return {
            restrict: "A",
            link: function (t, i) {
                function s() {
                    var t = kzi.util.winHeight() - 58;
                    a = e.global.title, e.global.title = "积分", $("#scorebox").animate({
                        height: t
                    }, 500, "", function () {
                        e.$broadcast("wtScoreboxTriggerSuccess", !0),
                            $(window).bind("resize.show_scorebox", function () {
                                var t = kzi.util.winHeight() - 58;
                                $("#scorebox").height(t)
                            }),
                            $(document).bind("click.show_scorebox", function (t) {
                                0 == $(t.target).parents("#scorebox").length &&
                                0 == $(t.target).parents(".slide-content").length &&
                                0 == $(t.target).parents(".popbox").length &&
                                0 != $(document).find(t.target).length &&
                                0 == $(t.target).parents("#fancybox-buttons").length &&
                                (e.global.show_scorebox = !1, e.$apply())
                            }),
                            $(document).bind("keydown.show_scorebox keypress.show_scorebox", function (t) {
                                var i = t.which || t.keyCode;
                                (i !== kzi.constant.keyASCIIs.VK_SPACE || "keypress" !== event.type) &&
                                "0px" == $(".slide-content").css("width") &&
                                i === kzi.constant.keyASCIIs.ESC &&
                                (e.global.show_scorebox = !1, e.$apply(), event.preventDefault())
                            })
                    })
                }

                function r() {
                    e.$broadcast("wtScoreboxTriggerSuccess", !1),
                    _.isEmpty(a) || (e.global.title = a),
                        $("#scorebox").animate({
                            height: 0
                        }, 100, "", function () {
                            $(window).unbind("resize.show_scorebox"),
                                $(document).unbind("click.show_scorebox"),
                                $(document).unbind("keydown.show_scorebox keypress.show_scorebox")
                        })
                }

                var a = "";
                t.$watch("global.show_scorebox", function (e) {
                    e ? s() : r()
                }),
                    i.bind("click", function (t) {
                        t.stopPropagation(),
                            e.$apply(function () {
                                e.global.show_scorebox = !e.global.show_scorebox;
                                //与其他浮窗互斥
                                if (e.global.show_scorebox) {
                                    e.global.boxshow_type = "scorebox";
                                    e.global.show_searchbox = false;
                                    e.global.show_mailbox = false;
                                    e.global.show_generatorbox = false;
                                }
                                ;
                            })
                    })
            }
        }
    }
]).directive("wtScoreboxView", [
    '$timeout',
    function ($tiemout) {
        "use strict";
        return {
            restrict: "E",
            controller: "account_myscore_ctrl",
            replace: !0,
            scope: !0,
            templateUrl: "/view/directive/scorebox.html",
            link: function (scope, ele, attr) {
            }
        }
    }
]);

wt.directive.directive("wtMailboxTrigger", ["$rootScope", "$timeout",
    function ($rootScope, $timeout) {
        "use strict";
        return {
            restrict: "A",
            link: function (t, i) {
                function s() {
                    var t = kzi.util.winHeight() - 58;
                    a = $rootScope.global.title;
                    $rootScope.global.title = "发送邮件",
                        $("#mailbox").animate({
                            height: t
                        }, 100, "", function () {
                            $rootScope.$broadcast("wtMailboxTriggerSuccess", !0),
                                $(window).bind("resize.show_mailbox", function () {
                                    var t = kzi.util.winHeight() - 58;
                                    $("#mailbox").height(t)
                                }),
                                $(document).bind("click.show_mailbox", function (t) {
                                    0 == $(t.target).parents("#mailbox").length &&
                                    0 == $(t.target).parents(".modal").length &&
                                    0 == $(t.target).parents(".modal-backdrop").length &&
                                    0 == $(t.target).parents(".mailbox-click-other-donot-hide").length &&
                                    0 == $(t.target).parents(".slide-content").length &&
                                    0 == $(t.target).parents(".popbox").length &&
                                    0 != $(document).find(t.target).length &&
                                    0 == $(t.target).parents("#fancybox-buttons").length &&
                                    ($rootScope.global.show_mailbox = !1,
                                        $rootScope.$apply())
                                }),
                                $(document).bind("keydown.show_mailbox keypress.show_mailbox", function (t) {
                                    var i = t.which || t.keyCode;
                                    (i !== kzi.constant.keyASCIIs.VK_SPACE || "keypress" !== event.type) &&
                                    "0px" == $(".slide-content").css("width") &&
                                    i === kzi.constant.keyASCIIs.ESC &&
                                    ($rootScope.global.show_mailbox = !1, $rootScope.$apply(), event.preventDefault())
                                })
                        })
                };

                function r() {
                    $rootScope.$broadcast("wtMailboxTriggerSuccess", !1),
                    _.isEmpty(a) || ($rootScope.global.title = a),
                        $("#mailbox").animate({
                            height: 0
                        }, 100, "", function () {
                            $(window).unbind("resize.show_mailbox"),
                                $(document).unbind("click.show_mailbox"),
                                $(document).unbind("keydown.show_mailbox keypress.show_mailbox")
                        })
                };
                $rootScope.$on(kzi.constant.event_names.open_mail_box, function (event, i) {
                    var info = _.clone(i);
                    $rootScope.global.show_mailbox = !$rootScope.global.show_mailbox;
                    //当浮窗打开时隐藏左侧边栏
                    $rootScope.global.left_panel_is_fold = true;
                    //与其他浮窗互斥
                    if ($rootScope.global.show_mailbox) {
                        $rootScope.global.boxshow_type = "mailbox";
                        $rootScope.global.show_scorebox = false;
                        $rootScope.global.show_searchbox = false;
                        $rootScope.global.show_generatorbox = false;
                    }
                    $timeout(function () {
                        $rootScope.$broadcast(kzi.constant.event_names.mail_box_show, info)
                    }, 500);
                });
                var a = "";
                t.$watch("global.show_mailbox", function (e) {
                    e ? s() : r()
                });
                i.bind("click", function (t) {
                    t.stopPropagation(),
                        $rootScope.$apply(function () {
                            $rootScope.global.show_mailbox = !$rootScope.global.show_mailbox;
                            //与其他浮窗互斥
                            if ($rootScope.global.show_mailbox) {
                                $rootScope.global.boxshow_type = "mailbox";
                                $rootScope.global.show_scorebox = false;
                                $rootScope.global.show_searchbox = false;
                                $rootScope.global.show_generatorbox = false;
                            }
                        })
                })
            }
        }
    }
]).directive("wtMailboxView", [
    function () {
        "use strict";
        return {
            restrict: "E",
            controller: "commonGenerator_v5_1_Ctrl",
            replace: !0,
            templateUrl: "/view/directive/mailbox.html",
            link: function (scope, element, attr) {
            }
        }
    }
]);

wt.directive.factory('MdParse', [function () {
    'use strict';
    return function (e) {
        return 'string' != typeof e ? '' : marked(e, {breaks: true});
    };
}]).factory('sanitize', [function () {
    'use strict';
    var e = new Sanitize({}),
        t = new Sanitize(Sanitize.Config.RESTRICTED),
        i = new Sanitize(Sanitize.Config.BASIC),
        n = new Sanitize(Sanitize.Config.RELAXED);
    return function (a, s) {
        var o = n;
        switch (s) {
            case 0:
                o = e;
                break;
            case 1:
                o = t;
                break;
            case 2:
                o = i;
                break;
            case 3:
                o = n;
                break;
            default:
                o = n;
        }
        var r = document.createElement('div');
        var l = document.createElement('div');
        return r.innerHTML = filterXSS(a), l.appendChild(o.clean_node(r)), l.innerHTML;
    };
}]).directive('wtMarkdown', [
    'MdParse',
    'sanitize',
    function (Mdparse, sanitize) {
        'use strict';
        return function (i, n, a) {
            n.addClass('ng-binding markdown').data('$binding', a.genParseMarkdown);
            var s = n.html() || '';
            s = Mdparse(s);
            s = sanitize(s);
            n.html(s);
            i.$watch(a.wtMarkdown, function (i) {
                i = i || '', '' !== i ? (i = Mdparse(i), i = sanitize(i), n.html(i)) : n.html(''), n.find('a').attr('target', function () {
                    return this.host !== location.host ? '_blank' : void 0;
                });
            });
        };
    }
]);

wt.directive.directive('wtActivity', [function () {
    'use strict';
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/view/directive/activity.html',
        link: function (e) {
            var n = e.$parent.tpl_prefix, a = e.activity.template, s = 'project_', o = 'item_';
            switch (a) {
                case 'task_create':
                    n === s ? (e.verb = '在列表 <strong>' + e.activity.data.target.name + '</strong> 上添加新活动', e.display_entity = e.activity.data.entity) : e.verb = n === o ? '添加活动' : 'tpl_prefix为空';
                    break;
                case 'task_update_name':
                    n === s ? (e.verb = '修改活动', e.display_entity = e.activity.data.entity) : e.verb = n === o ? '修改活动为 <strong>' + e.activity.data.entity.name + '</strong>' : 'tpl_prefix为空';
                    break;
                default:
                    e.verb = a + '模板尚未实现';
            }
        }
    };
}]);

wt.directive.directive('wtUploadfile', [function () {
    'use strict';
    return {
        restrict: 'A',
        link: function (scope, t, i) {
            var n = function (option) {
                t.unbind('change.call_global_fileupload');
                t.bind('change.call_global_fileupload', function () {
                    if (option.formData) option.formData.uid = kzi.get_uid();
                    option.previewMaxWidth && $('#global_file_upload').fileupload({previewMaxWidth: option.previewMaxWidth});
                    option.previewMaxHeight && $('#global_file_upload').fileupload({previewMaxHeight: option.previewMaxHeight});
                    option.done && $('#global_file_upload').fileupload({done: option.done});
                    var i = {
                        url: option.url,
                        formData: option.formData,
                        fileInput: $(this)
                    };
                    _.isFunction(option.successCallback) && (i.formData.successCallback = option.successCallback);
                    $('#global_file_upload').fileupload('add', i);
                    _.isFunction(option.addCallback) && option.addCallback();
                    $(this).val('');
                });
            };
            scope.$watch(i.wtUploadfile, function (e, t) {
                _.isUndefined(e) || _.isNull(e) || _.isEqual(e, t) || n(e);
            }, true);
            if (!_.isUndefined(i.wtUploadfile) || _.isNull(i.wtUploadfile) || _.isEmpty(i.wtUploadfile)) {
                if (_.isUndefined(scope.$eval(i.wtUploadfile)))
                    return;
                n(scope.$eval(i.wtUploadfile));
            }
        }
    };
}]);

wt.directive.directive('wtConfirmPassword', [
    '$parse',
    '$window',
    function ($parse, $window) {
        'use strict';
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/view/directive/confirm_password.html',
            link: function (i, n, a) {
                var s = $parse(a.confirmSuccess), o = $parse(a.confirmCancel);
                i.js_cancel_option = function () {
                    _.isFunction(o) && o(i);
                }, i.js_forgot_password = function () {
                    $window.location.href = 'forgot';
                }, i.js_confirm_password = function (e) {
                    i.confirming = true, wt.data.account.conform_password(i.confirm_password, function () {
                        _.isFunction(s) && s(i);
                    }, function (t) {
                        t.code === kzi.statuses.user_error.invalid_pwd_error.code ? e.$errors.unshift('输入密码输入错误') : e.$errors.unshift('服务器发生错误');
                    }, function () {
                        i.confirming = false;
                    });
                };
            }
        };
    }
]);

wt.directive.directive('wtPopEmoji', [
    '$parse',
    '$popbox',
    function ($parse, $popbox) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            link: function (i, n, a) {
                n.bind('click', function (s) {
                    var o = $parse(a.wtPopEmoji);
                    $popbox.popbox({
                        target: s,
                        templateUrl: '/view/common/pop_emojis.html',
                        controller: [
                            '$scope',
                            'popbox',
                            function (e, t) {
                                e.popbox = t, e.emojis = [];
                                var a = 72, s = [], r = [];
                                $.each(kzi.emojis, function (e) {
                                    0 !== e && 0 === e % a && (r.push(s), s = []), s.push(this);
                                }), r.push(s), e.emoji_groups = r, e.emojis = r[0], e.current = 0, e.js_to_page = function (t) {
                                    e.current = t, e.emojis = r[t];
                                }, e.js_insert_emoji = function (e) {
                                    var a = n.val() + ' :' + e + ': ';
                                    _.isFunction(o) && o(i, {emoji: a}), t.close();
                                }, e.js_close = function () {
                                    t.close();
                                }, e.js_mousedown = function (e) {
                                    e.stopPropagation(), e.preventDefault();
                                };
                            }
                        ]
                    }).open().then(function () {
                    });
                });
            }
        };
    }
]);

wt.directive.directive('wtDragfile', [function () {
    'use strict';
    return {
        link: function (e, t, i) {
            var n = function (e) {
                $(t).unbind('dragover.wt_dragfile');
                $(t).unbind('drop.wt_dragfile');
                $(t).unbind('drop.wt_dragfile_exit dragleave.wt_dragfile_exit dragexit.wt_dragfile_exit dragend.wt_dragfile_exit');
                $(t).bind('dragover.wt_dragfile', function (e) {
                    e.dataTransfer = e.originalEvent && e.originalEvent.dataTransfer;
                    var i = e.dataTransfer;
                    return i && -1 !== $.inArray('Files', i.types) ? (i.dropEffect = 'copy', $(t).addClass('dragfile-hover'), false) : void 0;
                });
                $(t).bind('drop.wt_dragfile', function (t) {
                    t.dataTransfer = t.originalEvent && t.originalEvent.dataTransfer;
                    var i = t.dataTransfer;
                    if(i && i.files && i.files.length) {
                        e.upload_option.formData.size = i.files[0].size;
                        _.each(i.files, function (e) {
                            var t = {
                                type: 2,
                                ext: kzi.constant.get_ext(e.name.substring(e.name.lastIndexOf('.') + 1))
                            };
                            e.icon = kzi.constant.get_file_icon(t);
                        });
                        $('#global_file_upload').fileupload('add', {
                            url: e.upload_option.url,
                            formData: e.upload_option.formData,
                            files: i.files
                        })
                    };
                });
                $(t).bind('drop.wt_dragfile_exit dragleave.wt_dragfile_exit dragexit.wt_dragfile_exit dragend.wt_dragfile_exit', function (e) {
                    var i = true,
                        n = $(t).offset().left,
                        a = $(t).width(),
                        s = $(t).offset().top,
                        o = $(t).height(),
                        r = false;
                    e.originalEvent.pageX > n & n + a > e.originalEvent.pageX && (r = true);
                    var l = false;
                    return e.originalEvent.pageY > s & s + o > e.originalEvent.pageY && (l = true), r && l && 'drop' !== e.type && (i = false), i && $(t).removeClass('dragfile-hover'), false;
                });
            };
            e.$watch(i.wtDragfile, function (e, t) {
                _.isUndefined(e) || _.isNull(e) || _.isEqual(e, t) || n(e);
            }, true);
            if (!_.isUndefined(i.wtDragfile)) {
                var a = e.$eval(i.wtDragfile);
                if (_.isUndefined(a) || _.isEmpty(a))
                    return;
                if (_.isEqual(a, {}))
                    return;
                if (!_.isObject(a))
                    return;
                n(a);
            }
        }
    };
}]);

wt.directive.directive('wtPastefile', [function () {
    'use strict';
    return {
        link: function (e, t, i) {
            var n = function () {
                $(t).unbind('paste.wt_pastefile'), $(t).bind('paste.wt_pastefile', function (t) {
                    var n = t.originalEvent && t.originalEvent.clipboardData && t.originalEvent.clipboardData.items, a = {files: []};
                    n && n.length && _.each(n, function (n) {
                        if ('file' === n.kind && n.type.match(/^image\//i)) {
                            var s = n.getAsFile && n.getAsFile(), o = e.$eval('$parent.$parent.$parent');
                            if (o = o[i.wtPastefile], s && !_.isUndefined(o)) {
                                var r = {
                                    type: 2,
                                    ext: 2
                                };
                                n.icon = kzi.constant.get_file_icon(r), s.name = '[' + wt.me.display_name + ']' + moment().format('YYYY-MM-DD_hh:mm:ss a') + '-粘贴上传.png', a.files.push(s), t.preventDefault(), $('#global_file_upload').fileupload('add', {
                                    url: o.upload_option.url,
                                    formData: o.upload_option.formData,
                                    files: s
                                });
                            }
                        }
                    });
                });
            };
            if (e.$watch(i.wtPastefile, function (e, t) {
                    _.isUndefined(e) || _.isNull(e) || _.isEqual(e, t) || n(e);
                }, true), !_.isUndefined(i.wtPastefile)) {
                var a = i.wtPastefile;
                if (_.isUndefined(a) || _.isEmpty(a))
                    return;
                if (_.isEqual(a, {}))
                    return;
                n(a);
            }
        }
    };
}]);

wt.directive.directive('wtNewEvent', [
    '$parse',
    '$popbox',
    function ($parse, $popbox) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            link: function (e, t, a) {
                var s = $parse(a.wtNewEvent);
                t.bind('click', function (t) {
                    $popbox.popbox({
                        target: t,
                        templateUrl: '/view/project/event/pop_add_event.html',
                        controller: 'pop_new_event_ctrl',
                        resolve: {
                            pop_data: function () {
                                return {
                                    save_success: s,
                                    scope: e
                                };
                            }
                        }
                    }).open();
                });
            }
        };
    }
]);

wt.directive.directive('wtComment', [
    '$parse',
    '$rootScope',
    '$popbox',
    '$timeout',
    function ($parse, $rootScope, $popbox, $timeout) {
        'use strict';
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '/view/directive/new_comment.html',
            link: function (a, s, o) {
                var r = $parse(o.saveComment),
                    l = s.find('textarea')[0],
                    c = function (e) {
                    $timeout(function () {
                        l.focus();
                        l.select();
                        l.selectionStart = l.selectionEnd = e;
                    });
                };
                //function:u means add info to editor at cursor
                var u = function (e, t, i) {
                    if ('number' == typeof t.selectionStart && 'number' == typeof t.selectionEnd) {
                        var n = t.selectionStart,
                            a = t.selectionEnd,
                            s = n + i.length;
                        _.isUndefined(e.message) && (e.message = '');
                        e.message = e.message.substring(0, n) + i + e.message.substring(a);
                        c(s);
                    } else
                        e.message = e.message + i;
                        l.focus();
                };
                a.$js_metion_member = function (e) {
                    $popbox.popbox({
                        target: e,
                        templateUrl: '/view/common/pop_comment_metion.html',
                        controller: [
                            '$scope',
                            'popbox',
                            'pop_data',
                            function (e, t) {
                                e.popbox = t;
                                e.metion_members = a.atwho_members;
                                e.js_metion_member = function (e, i) {
                                    a.comment.message || (a.comment.message = '');
                                    u(a.comment, l, ' @' + i.name + ' ');
                                    t.close();
                                };
                                e.js_metion_all = function () {
                                    a.comment.message || (a.comment.message = '');
                                    var n = '';
                                    _.each(e.metion_members, function (e) {
                                        n += ' @' + e.name + ' ';
                                    });
                                    u(a.comment, l, n);
                                    t.close();
                                };
                                e.js_close = function () {
                                    t.close();
                                };
                                e.js_mousedown = function (e) {
                                    e.stopPropagation();
                                };
                            }
                        ],
                        resolve: {
                            pop_data: function () {
                                return {
                                    scope: a,
                                    members: a.members
                                };
                            }
                        }
                    }).open();
                };
                a.$js_save_comment = function () {
                    var e = this.$parent.$parent.global_fileupload_queue_comment();
                    0 == e.length ? r(a) : kzi.msg.warn('评论文件正在上传中...');
                };
                a.js_del_attachment_comment = function (e, t) {
                    var i = _.findWhere(a.comment.files, {fid: t.fid});
                    if(i) {
                        a.comment.files = _.reject(a.comment.files, function (e) {
                            return e.fid == t.fid;
                        })
                    };
                };
                a.js_show_attach = function (e, n) {
                    $popbox.popbox({
                        target: e,
                        templateUrl: '/view/project/file/pop_attach.html',
                        controller: [
                            '$scope',
                            'popbox',
                            'pop_data',
                            function (e, i, a) {
                                e.popbox = i;
                                e.js_step = function (t) {
                                    e.step = t;
                                };
                                e.js_close = function () {
                                    i.close();
                                };
                                e.task = n;
                                e.prj_files_loaded = false;
                                $rootScope.load_files(a.scope.pid, '', function (t) {
                                    e.prj_files_loaded = true;
                                    var i = _.where(t.files, {folder_id: ''});
                                    e.files = i;
                                });
                                e.js_attach = function (i) {
                                    if (1 == i.type) {
                                        e.step = 1;
                                        e.prj_files_loaded = false;
                                        e.sub_files = [];
                                        $rootScope.load_files(a.scope.pid, i.fid, function (t) {
                                            e.prj_files_loaded = true;
                                            var n = _.where(t.files, {folder_id: i.fid});
                                            e.sub_files = n;
                                        });
                                    } else {
                                        _.isEmpty(a.scope.comment.files) && (a.scope.comment.files = []);
                                        var n = _.findWhere(a.scope.comment.files, {fid: i.fid});
                                        n || a.scope.comment.files.push(i);
                                    }
                                };
                            }
                        ],
                        resolve: {
                            pop_data: function () {
                                return {scope: a};
                            }
                        }
                    }).open();
                };
                a.$js_pop_emojis = function (e) {
                    $popbox.popbox({
                        target: e,
                        templateUrl: '/view/common/pop_emojis.html',
                        controller: [
                            '$scope',
                            'popbox',
                            function (e, t) {
                                e.popbox = t;
                                e.emojis = [];
                                var i = 72, n = [], s = [];
                                $.each(kzi.emojis, function (e) {
                                    0 !== e && 0 === e % i && (s.push(n), n = []), n.push(this);
                                });
                                s.push(n);
                                e.emoji_groups = s;
                                e.emojis = s[0];
                                e.current = 0;
                                e.js_to_page = function (t) {
                                    e.current = t;
                                    e.emojis = s[t];
                                };
                                e.js_insert_emoji = function (e) {
                                    u(a.comment, l, ' :' + e + ': ');
                                    t.close();
                                };
                                e.js_close = function () {
                                    t.close();
                                };
                                e.js_mousedown = function (e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                };
                            }
                        ]
                    }).open().then(function () {
                    });
                };
            }
        };
    }
]);

wt.directive.directive('wtMail', [
    '$parse',
    '$rootScope',
    '$popbox',
    '$timeout',
    function ($parse, $rootScope, $popbox, $timeout) {
        'use strict';
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '/view/directive/new_mail.html',
            link: function (a, s, o) {
                var r = $parse(o.saveMail), l = s.find('textarea')[0], c = function (e) {
                    $timeout(function () {
                        l.focus(), l.select(), l.selectionStart = l.selectionEnd = e;
                    });
                }, u = function (e, t, i) {
                    if ('number' == typeof t.selectionStart && 'number' == typeof t.selectionEnd) {
                        var n = t.selectionStart, a = t.selectionEnd, s = n + i.length;
                        _.isUndefined(e.message) && (e.message = ''), e.message = e.message.substring(0, n) + i + e.message.substring(a), c(s);
                    } else
                        e.message = e.message + i, l.focus();
                };
                a.$js_metion_member = function (e) {
                    $popbox.popbox({
                        target: e,
                        templateUrl: '/view/common/pop_mail_metion.html',
                        controller: [
                            '$scope',
                            'popbox',
                            'pop_data',
                            function (e, t) {
                                e.popbox = t, e.metion_members = a.atwho_members, e.js_metion_member = function (e, i) {
                                    a.mail.message || (a.mail.message = ''), u(a.mail, l, ' @' + i.name + ' '), t.close();
                                }, e.js_metion_all = function () {
                                    a.mail.message || (a.mail.message = '');
                                    var n = '';
                                    _.each(e.metion_members, function (e) {
                                        n += ' @' + e.name + ' ';
                                    }), u(a.comment, l, n), t.close();
                                }, e.js_close = function () {
                                    t.close();
                                }, e.js_mousedown = function (e) {
                                    e.stopPropagation();
                                };
                            }
                        ],
                        resolve: {
                            pop_data: function () {
                                return {
                                    scope: a,
                                    members: a.members
                                };
                            }
                        }
                    }).open();
                }, a.$js_save_mail = function () {
                    var e = this.$parent.$parent.global_fileupload_queue_mail();
                    0 == e.length ? r(a) : kzi.msg.warn('评论文件正在上传中...');
                }, a.js_del_attachment_mail = function (e, t) {
                    var i = _.findWhere(a.mail.files, {fid: t.fid});
                    i && (a.mail.files = _.reject(a.mail.files, function (e) {
                        return e.fid == t.fid;
                    }));
                }, a.js_show_attach = function (e, n) {
                    $popbox.popbox({
                        target: e,
                        templateUrl: '/view/project/file/pop_attach.html',
                        controller: [
                            '$scope',
                            'popbox',
                            'pop_data',
                            function (e, i, a) {
                                e.popbox = i, e.js_step = function (t) {
                                    e.step = t;
                                }, e.js_close = function () {
                                    i.close();
                                }, e.task = n, e.prj_files_loaded = false, $rootScope.load_files(a.scope.pid, '', function (t) {
                                    e.prj_files_loaded = true;
                                    var i = _.where(t.files, {folder_id: ''});
                                    e.files = i;
                                }), e.js_attach = function (i) {
                                    if (1 == i.type)
                                        e.step = 1, e.prj_files_loaded = false, e.sub_files = [], $rootScope.load_files(a.scope.pid, i.fid, function (t) {
                                            e.prj_files_loaded = true;
                                            var n = _.where(t.files, {folder_id: i.fid});
                                            e.sub_files = n;
                                        });
                                    else {
                                        _.isEmpty(a.scope.mail.files) && (a.scope.mail.files = []);
                                        var n = _.findWhere(a.scope.mail.files, {fid: i.fid});
                                        n || a.scope.mail.files.push(i);
                                    }
                                };
                            }
                        ],
                        resolve: {
                            pop_data: function () {
                                return {scope: a};
                            }
                        }
                    }).open();
                }, a.$js_pop_emojis = function (e) {
                    $popbox.popbox({
                        target: e,
                        templateUrl: '/view/common/pop_emojis.html',
                        controller: [
                            '$scope',
                            'popbox',
                            function (e, t) {
                                e.popbox = t, e.emojis = [];
                                var i = 72, n = [], s = [];
                                $.each(kzi.emojis, function (e) {
                                    0 !== e && 0 === e % i && (s.push(n), n = []), n.push(this);
                                }), s.push(n), e.emoji_groups = s, e.emojis = s[0], e.current = 0, e.js_to_page = function (t) {
                                    e.current = t, e.emojis = s[t];
                                }, e.js_insert_emoji = function (e) {
                                    u(a.mail, l, ' :' + e + ': '), t.close();
                                }, e.js_close = function () {
                                    t.close();
                                }, e.js_mousedown = function (e) {
                                    e.stopPropagation(), e.preventDefault();
                                };
                            }
                        ]
                    }).open().then(function () {
                    });
                };
            }
        };
    }
]);

wt.directive.directive('wtEntityShare', [
    '$popbox',
    function ($popbox) {
        'use strict';
        return {
            restrict: 'A',
            link: function (e, i, n) {
                i.bind('click', function (i) {
                    var a = e.$eval(n.wtEntityShare);//参数
                    _.isEmpty(a) && 5 !== a.length || 1 !== a[4] && $popbox.popbox({
                        target: i,
                        templateUrl: '/view/common/pop_share_entity.html',
                        controller: [
                            '$scope',
                            'popbox',
                            '$rootScope',
                            function (e, t, $rootScope) {
                                e.popbox = t, e.email_address = '';
                                var i = a[1], n = a[2], s = a[3];
                                e.isCustomer = false;
                                var update_score = function (score) {
                                    e.score = score;
                                    $rootScope.setScore($rootScope.global.me.score * 1 + 1 * e.score);
//                                    window.localStorage.score = window.localStorage.score * 1 + e.score;
//                                    wt.me.score = window.localStorage.score;
//                                    $rootScope.global.me.score = wt.me.score;
                                };


                                n === kzi.constant.xtype.task ? e.entity = '活动' : n === kzi.constant.xtype.post ? e.entity = '问答' : n === kzi.constant.xtype.page ? e.entity = '文档' : n === kzi.constant.xtype.event ? e.entity = '日程' : n === kzi.constant.xtype.file && (e.entity = '文件'),
                                    e.js_close = function () {
                                        t.close();
                                    };
                                var o = function () {
                                    wt.data.task.share(i, s, e.email_address, function (resp) {
                                        $rootScope.$broadcast(kzi.constant.event_names.on_task_share, s);

//                                        $rootScope.updatescore(kzi.constant.score.config.shareCustomer, "成功分享一位活动，获取" + kzi.constant.score.config.shareCustomer + "积分！");
//                                        update_score($rootScope.scoreConfig.shareCustomer);
                                        e.score = kzi.constant.score.config.shareCustomer;
                                        e.isCustomer = true;
                                        e.send_success = true;
                                    }, function (resp) {
                                        if (!_.isEmpty(resp)) {
                                            var code = resp.code;
                                            if ("7023" == code) {
                                                kzi.msg.error("已有人分享", function () {
                                                });
                                            } else if ("7025" == code) {
                                                kzi.msg.error("公司名，联系人,行业和邮箱不能都为空并且邮箱应合法！", function () {
                                                });
                                            }
                                            else if ("7026" == code) {
                                                kzi.msg.error("邮箱未通过验证，分享失败！", function () {
                                                });
                                            }
                                        }
                                    }, function () {
                                        e.is_sharing = false;
                                    });
                                }, r = function () {
                                    wt.data.file.share(i, s, e.email_address, function () {
                                        e.send_success = true;
                                    }, null, function () {
                                        e.is_sharing = false;
                                    });
                                }, l = function () {
                                    wt.data.post.share(i, s, e.email_address, function () {
                                        $rootScope.$broadcast(kzi.constant.event_names.on_post_share, s);

//                                        $rootScope.updatescore(kzi.constant.score.config.sharePost, "成功发布一个问答，获取" + kzi.constant.score.config.sharePost + "积分！");
                                        update_score($rootScope.scoreConfig.sharePost);

                                        e.send_success = true;
                                    }, null, function () {
                                        e.is_sharing = false;
                                    });
                                }, tt = function () {
                                    wt.data.template.share(i, s, e.email_address, function () {
                                        $rootScope.$broadcast(kzi.constant.event_names.on_template_share, s);
//                                        $rootScope.updatescore(kzi.constant.score.config.shareTemplate, "成功分享一个模板，获取" + kzi.constant.score.config.shareTemplate + "积分！");
                                        update_score($rootScope.scoreConfig.shareTemplate);
                                        e.send_success = true;
                                    }, null, function () {
                                        e.is_sharing = false;
                                    });
                                }, c = function () {
                                    wt.data.page.share(i, s, e.email_address, function () {
                                        e.send_success = true;
                                    }, null, function () {
                                        e.is_sharing = false;
                                    });
                                }, u = function () {
                                    wt.data.event.share(i, s, e.email_address, function () {
                                        e.send_success = true;
                                    }, null, function () {
                                        e.is_sharing = false;
                                    });
                                };
                                e.js_share_entity = function () {
                                    switch (e.is_sharing = true, n) {
                                        case kzi.constant.xtype.task:
                                            o();
                                            break;
                                        case kzi.constant.xtype.file:
                                            r();
                                            break;
                                        case kzi.constant.xtype.page:
                                            c();
                                            break;
                                        case kzi.constant.xtype.post:
                                            l();
                                            break;
                                        case kzi.constant.xtype.template:
                                            tt();
                                            break;
                                        case kzi.constant.xtype.event:
                                            u();
                                            break;
                                        default:
                                    }
                                };
                            }
                        ]
                    }).open();
                });
            }
        };
    }
]);

wt.directive.directive('wtPopMember', [
    '$popbox',
    function ($popbox) {
        'use strict';
        return {
            restrict: 'A',
            link: function (e, i, n) {
                i.bind('click', function (i) {
                    var a = e.$eval(n.popMember), s = e.$eval(n.wtPopMember);
                    _.isEmpty(s) || ('true' === n.stopPropagation && i.stopPropagation(), $popbox.popbox({
                        target: i,
                        templateUrl: '/view/directive/pop_member.html',
                        controller: [
                            '$scope',
                            'popbox',
                            function (t, i) {
                                t.popbox = i, t.member = a, t.action_name = s[0].name, t.ongoing = s[0].ongoing, t.js_action_member = function (a) {
                                    if (!t.pop_member_actioning) {
                                        var o = e.$eval(n.popExtendedAttr);
                                        t.pop_member_actioning = true, s[0].click(t, i, a, function () {
                                            t.pop_member_actioning = false, i.close();
                                        }, o);
                                    }
                                };
                            }
                        ]
                    }).open());
                });
            }
        };
    }
]);

wt.directive.directive('faEditor', function () {
    return {
        restrict: 'AE',
        templateUrl: '/view/directive/editor.html',
        scope: {
            getValue: '&'
        },
        link: function (scope, element, attrs) {
            scope.variableList = {
                'receiver': '<span style="font-weight:bold">[收件人]</span>',
                'sender': '<span style="font-weight:bold">[发件人]</span>'
            };
            element.find('.magic-overlay').each(function () {
                var overlay = $(this).find('input');
                overlay.css('opacity', 0).css('position', 'absolute').offset($(this).offset()).width($(this).outerWidth()).height($(this).outerHeight());
            });
            $('.dropdown-menu input').click(function () {
                return false;
            });
            element.find('.edit-area').wysiwyg({
                $toolbar: element.find('.edit-toolbar')
            });
        }
    }
});
wt.directive.directive('wtBadgesTemplate', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            template: "="
        },
        templateUrl: '/view/directive/badges_template.html',
        link: function (scope, element, attrs) {
        }
    }
});

wt.directive.directive('wtBadgesTask', function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            task: "="
        },
        templateUrl: '/view/directive/badges_task.html',
        link: function (scope, element, attrs) {
        }
    }
});

wt.directive.directive('wtBadgesPost', [function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            temp: '=post'
        },
        templateUrl: '/view/directive/badges_post.html',
        link: function (scope, element, attrs) {
        }
    };
}]);

wt.directive.directive('wtShow', function () {
    'use strict';
    return {
        restrict: 'A',
        link: function (s, e, a) {
            s.$watch(a.wtShow, function (n) {
                n ? e.css('visibility', 'visible') : e.css('visibility', 'hidden');
            })
        }
    }
});

wt.directive.directive('wtBadges2', function () {
    return {
        restrict: 'AE',
        scope: {
            badges: '=badges'
        },
        templateUrl: '/view/directive/badges2.html'
    }
});

wt.directive.directive('wtAddTag', ['$rootScope', '$parse', 'isLengthOKFilter', function ($rootScope, $parse, isLengthOKFilter) {
    return {
        restrict: 'E',
        templateUrl: '/view/directive/addtag.html',
        link: function (scope, element, attr) {
            scope.entity = {};
            var pid = "",
                tid = "",
                xType = "";
            scope.$on(kzi.constant.event_names.entity_loading_done, function (e, i) {
                pid = i.pid;
                tid = i.xid;
                xType = i.xtype;
                scope.entity = i.entity;
            });
            var c; // todo
            /*
             common action
             */
            //obj->click->tag-show
            scope.js_show_tag = function (e) {
                e.is_tag_edit = !0;
                e.is_add_tag_edit = !0
            };
            //obj->click->editor-hide
            scope.js_cancel_tag_editor = function (e) {
                e.is_tag_edit = !1
            };
            //obj->click->editor-show
            scope.js_show_tag_editor = function (t) {
                scope.permission === kzi.constant.permission.ok &&
                $rootScope.project.info.curr_role !== kzi.constant.role.guest &&
                (t.is_tag_edit = !0, c = t.name)
            };
            scope.js_show_add_tag_editor = function (e) {
                e.is_add_tag_edit = !0
            };
            scope.js_cancel_add_tag_editor = function (e) {
                e.is_add_tag_edit = !1
            };
//            scope.js_keyup_add_tag = function (t, i) {
//                var a = t.which || t.keyCode;
//                return 13 === a ? (t.stopPropagation(), t.preventDefault(), setTimeout(function () {
//                    $(t.target).parents(".new-tag-control").find("button[data-loading-text]").click()
//                }, 50), void 0) : 27 === a ?
//                    (scope.js_cancel_add_tag_editor(i), void 0) :
//                    void 0;
//            };
            /*
             * update action
             * */
            scope.js_add_tag = function (e, t) {
                return _.isUndefined(t) || _.isUndefined(t.temp_name) || _.isEmpty(t.temp_name) ?
                    (e.is_add_tag_edit = !1, void 0) :
                    ( addAction(e, t, xType, function () {
                    }), void 0)
            };
            var addAction = function (e, t, xType, fn) {
                var tagName = t.temp_name,
                    s = kzi.config.default_pos;
                if (!isLengthOKFilter(tagName, 16)) {
                    kzi.msg.warn("标签名称长度不能大于8个~", function () {
                    })
                    return this;
                }
                t.temp_name = "";
                var names = [];
                _.each(e.tags, function (tag) {
                    if (tag.name) {
                        names.push(tag.name);
                    }
                });
                if (names.indexOf(tagName) == -1) {
                    switch (xType) {
                        case 'task':
                            wt.data.task.add_tag(scope.task.pid, scope.task.tid, tagName, s, function (t) {
                                e.tags = e.tags || [];
                                e.tags.push(t.data);
                                scope.entity.tags = e.tags;
                            }, null, function () {
                                _.isFunction(fn) && fn()
                            });
                            break;
                        case 'template':
                            wt.data.template.add_tag(scope.template.pid, scope.template.template_id, tagName, s, function (t) {
                                e.tags = e.tags || [];
                                e.tags.push(t.data);
                                scope.entity.tags = e.tags;
                            }, null, function () {
                                _.isFunction(fn) && fn()
                            });
                            break;
                        case 'post':
                            wt.data.post.add_tag(scope.post.pid, scope.post.post_id, tagName, function (res) {
                                e.tags = e.tags || [];
                                e.tags.push(res.data);
                                scope.entity.tags = e.tags;
                            }, function (res) {
                                kzi.warn("error", function () {
                                })
                            }, function () {
                                _.isFunction(fn) && fn();
                            });
                            break;
                        default :
                            break;
                    }
                } else {
                    kzi.msg.warn("标签已存在~", function () {
                    })
                }
            };
            scope.js_del_tag = function (e, t) {
                e.tags = _.reject(e.tags, function (tag) {
                    return tag.tag_id === t.tag_id
                });
                switch (xType) {
                    case "task":
                        wt.data.task.del_tag(scope.entity.pid, tid, t.tag_id, function () {
                        });
                        t.is_tag_edit = !1;
                        break;
                    case "template":
                        wt.data.template.del_tag(scope.entity.pid, scope.template.template_id, t.tag_id, function () {
                        });
                        t.is_tag_edit = !1;
                        break;
                    case "post":
                        wt.data.post.remove_tag(scope.entity.pid, scope.post.post_id, t.tag_id, function () {

                        }, null, null);
                        t.is_tag_edit = !1;
                        break;
                    default :
                        break;
                }
            };
            scope.js_keyup_tag = function (t, i, n) {
                var a = event.which || event.keyCode;
                return 13 === a ? (scope.js_save_tag(null, n), void 0) : (27 === a && scope.js_cancel_tag_editor(n), void 0)
            };
        }
    }
}])

/**
 * @author lmm
 * @description 回到顶部，反馈
 * version 1.0
 */
wt.directive.directive('wtBackToTop', [function () {
    return {
        restrict: 'AE',
        templateUrl: '/view/directive/backToTop.html',
        link: function (scope, elem, attr) {
            var firstLink = $(elem.children()[0]).children('a.toTop');
            firstLink.hide();
            $(window).scroll(function () {
                if ($(window).scrollTop() > 100) {
                    firstLink.fadeIn(500);
                } else {
                    firstLink.fadeOut(500)
                }
            })
            firstLink.bind('click', function () {
                $('html,body').animate({scrollTop: 0}, 500);
                return false;
            })
        }
    }
}])
/**
 * @author lmm
 * @description 首页连接模块
 * @version 1.0
 */
wt.directive.directive("wtLinkModule", [function () {
    'use strict';
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        templateUrl: 'view/directive/linkModule.html',
        scope: {
            color: "@",
            title: "@",
            subTitle: "@",
            class: "@"
        }
    }
}]);

wt.directive.directive('wtFeedback', ['$modal', function ($modal) {
    return {
        restrict: 'AE',
        templateUrl: '/view/directive/feedback.html',
        link: function (scope, elem, attr) {
            scope.feedback = function () {
                $modal.open({
                    scope: scope,
                    templateUrl: '/view/modal/feedback.html',
                    controller: ['$scope', '$rootScope', '$location', '$modalInstance', function ($scope, $rootScope, $location, $modalInstance) {
                        $scope.name = $rootScope.global.me && $rootScope.global.me.display_name;
                        $scope.email = $rootScope.global.me && $rootScope.global.me.email;
                        $scope.categoryList = ['问题反映', '改进意见', '寻求帮助', '其他'];
                        $scope.category = '问题反映';
                        $scope.content = "";
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        $scope.js_submit = function () {
                            wt.data.feedback.add(
                                $scope.name,
                                $scope.email,
                                $scope.category,
                                $scope.content,
                                $location.path(),
                                function (response) {
                                    kzi.msg.success("非常感谢您的反馈，欢迎常来棒呆~");
                                },
                                function () {

                                },
                                function () {
                                    $modalInstance.close();
                                }
                            )
                        }
                    }]
                });
            }
        }
    }
}]);
//我的邮件的popover
wt.directive.directive('wtPromptInfo', ["$popover",
    function ($popover) {
        return {
            restrict: 'AE',
            link: function (scope, ele, attrs) {
                false && $popover(ele, {
                    placement: "bottom",
                    trigger: 'hover',
                    animation: 'am-flip-x',
                    delay: {
                        hide: 500
                    },
                    template: '/view/directive/prompt_info.html'
                })
            }
        };
    }
]);
//我的邮件列表邮箱的显示
wt.directive.directive('wtEmailPopShow', ["$popover",
    function ($popover) {
        return {
            restrict: 'AE',
            templateUrl: 'showMailList.html',
            link: function (scope, ele, attrs) {
                $popover(ele, {
                    scope: scope,
                    placement: "bottom",
                    trigger: 'hover',
                    animation: 'am-flip-x',
                    delay: {
                        show: 500,
                        hide: 300
                    },
                    container: "#mail_" + scope.mail.mail_id,
                    content: scope.mail.cid,
                    template: 'mailPopover.html'
                })
            }
        };
    }
]);
//我的邮件列表邮箱的popover
wt.directive.directive('wtEmailPop', ["$popover",
    function ($popover) {
        return {
            restrict: 'AE',
            template: '<div style="padding: 2px 5px;; border-bottom: 1px solid #E1E1E1"> ' +
            '<p>国家：{{entity.countryCnName|isEmptyString }}</p>' +
            '<p>公司：{{entity.company | isEmptyString }}</p>' +
            '<p>联系人：{{entity.name | isEmptyString }}</p>' +
            '</div> <div align="center">  <a href="javascript:;" ng-click="mail_list(mail.cid,\'to\',$event)"  title="历史邮件"> 该活动所有邮件 </a> </div>',
            link: function (scope, ele, attrs) {
                if (scope.mail.companyDetails == null) {
                    wt.data.task.get(null, scope.mail.cid,
                        function (resp) {
                            scope.entity = resp.data;
                            scope.mail.companyDetails = resp.data;
                            scope.$parent.$parent.$parent.$parent.entity = resp.data;
                        },
                        function () {
                        },
                        function () {
                        });
                } else {
                    scope.entity = scope.mail.companyDetails;
                }
            }
        };
    }
]);
//我的邮件列表模板的显示
wt.directive.directive('wtTempPopShow', ["$popover",
    function ($popover) {
        return {
            restrict: 'AE',
            templateUrl: 'showTempList.html',
            link: function (scope, ele, attrs) {
                if (!_.isEmpty(scope.mail.template)) {
                    $popover(ele, {
                        scope: scope,
                        placement: "bottom",
                        trigger: 'hover',
                        delay: {
                            show: 500,
                            hide: 300
                        },
                        animation: 'am-flip-x',
                        container: "#temp_" + scope.mail.mail_id,
                        template: 'templatePopover.html'
                    })
                }
            }
        };
    }
]);
//我的邮件列表模板的popover
wt.directive.directive('wtTemplatePop', ["$popover",
    function ($popover) {
        return {
            restrict: 'AE',
            template: '<div style="padding:2px 5px;;border-bottom: 1px solid #E1E1E1"><p>模板名称：{{entity.name}}</p></div><div align="center"><a href="javascript:;" style="color:#2a6496;" ng-click="mail_list(mail.template,\'template\',$event)" title="历史邮件">该模板所有邮件 </a> </div>',
            link: function (scope, ele, attrs) {
                if (scope.mail.tempDetails == null) {
                    wt.data.template.get(null, scope.mail.template,
                        function (resp) {
                            scope.entity = resp.data;
                            scope.mail.tempDetails = resp.data;
                            scope.$parent.$parent.$parent.$parent.entity = resp.data;
                        },
                        null,
                        null);
                } else {
                    scope.entity = scope.mail.tempDetails;
                }
            }
        };
    }
]);


wt.directive.directive('wtUpdateInfo', [
    function () {
        return {
            restrict: 'AE',
            templateUrl: '/view/directive/update_info.html',
            transclude: true,
            link: function (scope, ele, attrs) {
                var $ele;
                scope.entity = scope.$eval(attrs.wtUpdateInfo);
                scope.contents = scope.entity.updateCountents;
                $ele = ele.find('.ng-hide');
                ele.bind('mouseenter', function (event) {
                    $ele.removeClass('ng-hide');
                    return;
                });
                ele.bind('mouseleave', function (event) {
                    $ele.addClass('ng-hide');
                    return;
                });
            }
        };
    }
]);

wt.directive.directive('wtToggleDelay', [
    function () {
        "use strict";
        return {
            restrict: 'A',
            link: function (scope, ele, attrs) {
                var delay;
                if (!angular.isUndefined(attrs.delay)) {
                    delay = scope.$eval(attrs.delay);
                } else {
                    delay = 0;
                }
                scope.$watch(function () {
                    return scope.$eval(attrs.wtToggleDelay)
                }, function (newValue, oldValue) {
                    if (newValue == true) {
                        setTimeout(function () {
                            $(ele).css('visibility', 'visible');
                            $(ele).find('span').show();
                        }, delay)
                    } else {
                        $(ele).css('visibility', 'hidden');
                        $(ele).find('span').hide();
                    }
                });
            }
        }
    }
])

wt.directive.directive('wtClickHide', [
    function () {
        "use strict";
        return {
            restrict: "A",
            link: function (scope, ele, attrs) {
                var delay;
                if (!angular.isUndefined(attrs.delay)) {
                    delay = scope.$eval(attrs.delay);
                } else {
                    delay = 500;
                }
                ele.bind('click.clickhide', function () {
                    $(ele).hide().delay(750).fadeIn(delay, function () {
                        // $(this).removeProp("disabled")
                    });
                })
            }
        }
    }
]);

wt.directive.directive('wtShowLatter', [
    function () {
        "use strict";
        return {
            restrict: "A",
            compile: function (ele, attrs) {
                ele.hide();
                return function link(scope, ele, attrs) {
                    var default_opt = {
                        delay: 450,
                        show_latter: true
                    }
                    var options = scope.$eval(attrs.wtShowLatter);
                    _.extend(default_opt, options);
                    if (default_opt.show_latter) {
                        ele.show(default_opt.delay);
                    }
                }
            }
        }
    }
]);

wt.directive.directive('wtShowLatterTest', [
    function () {
        "use strict";
        return {
            restrict: "A",
            scope: {
                param: "="
            },
            compile: function (ele, attrs) {
                /**
                 * BASE STATUS
                 */
                ele.css({
                    "top": "100%",
                    "position": "absolute",
                    'z-index': "9996"
                });
                ele.hide();
                return function link(scope, ele, attrs) {
                    /**
                     * 显示  hide to show
                     */
                    function tmallShow() {
                        this.show();
                        this.css("z-index", "9997");
                        this.finish().animate({
                            top: "0px"
                        }, 400)
                    }

                    /**
                     * 隐藏 show to hide
                     */
                    function tmallHide() {
                        var self = this;
                        self.css({
                            "z-index": "9996"

                        }).finish().animate({
                            height: "50%",
                            width: "180px",
                            top: "50px",
                            right: '42px'
                        }, 200, function doneAndReset() {
                            self.hide();
                            self.css({
                                height: "100%",
                                width: '264px',
                                top: "100%",
                                right: '0px'
                            });
                        })
                    }

                    scope.$watch("param", function (newV, oldV) {
                        if (newV) {
                            tmallShow.call(ele);
                        }
                        else {
                            tmallHide.call(ele);
                        }
                    })
                }
            }
        }
    }
]);
wt.directive.directive('wtToolSet', [function () {
    "use strict";
    return {
        restrict: 'E',
        scope: true,
        transclude: true,
        replace: true,
        controller: 'sideToolSetCtrl',
        templateUrl: '/view/public/customer/tmall_sidebar.html',
        compile: function (ele, attr) {
            return function link(scope, ele, attrs) {
                var sideToolSetCtrl = scope;

                function bindHandle(event) {
                    if (
                        $(event.target).parents('.tool_set').length === 0 &&
                        $(document).find(event.target).length !== 0) {
                        scope.$apply(function () {
                            sideToolSetCtrl.vm.extend_or_not = false;
                        })
                    }
                }

                var bindClick = function () {
                    $(document).bind('click.tool_set', bindHandle);
                }
                var unbindClick = function () {
                    $(document).unbind('click.tool_set', bindHandle);
                }
                sideToolSetCtrl.$watch(
                    "vm.extend_or_not"
                    , function (newV, oldV) {
                        if (newV) {
                            bindClick();
                        } else {
                            unbindClick();
                        }
                    }, true);
            }
        }
    }
}
]);

wt.directive.directive('wtUEditor', ['$parse', function ($parse) {
    "use strict";
    return {
        restrict: 'A',
        scope: {
            content: '='
        },
        compile: function COMPLIE() {
            return function LINK(scope, ele, attr) {
                var id = attr.id,
                    ue;
                ue = UE.getEditor(id);

                ue.on('ready', function () {
                    ue.setContent("1234115135");
                });

                ue.on('contentChange', function () {
                    scope.$apply(function () {
                        scope.content = ue.getContent();
                    })
                });


                scope.$watch('content', function (newValue, OldValue) {
                    if (newValue && newValue !== OldValue) {
                        ue.body && ue.setContent(newValue, false, false);
                    }
                })
            }
        }
    }
}]);
wt.directive.directive('delayedModel', function () {
    return {
        scope: {
            model: '=delayedModel'
        },
        link: function (scope, element, attrs) {

            element.val(scope.model);

            scope.$watch('model', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    element.val(scope.model);
                }
            });

            var timeout;
            element.on('keyup paste search', function () {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    scope.model = element[0].value;
                    element.val(scope.model);
                    scope.$apply();
                }, attrs.delay || 500);
            });
        }
    };
});
wt.directive.directive('wtDateList', ['$popbox', function ($popbox) {
    "use strict";
    return {
        restrict: 'E',
        scope: {
            datelist: '='
        },
        templateUrl: '/view/directive/dateList/dateList.html',
        link: function ($scope, elem, attr) {
            function showSelectWindow($event) {
                $popbox.popbox({
                    target: $event,
                    placement: 'right',
                    templateUrl: '/view/directive/dateList/pop_add_date.html',
                    controller: 'pop_new_date_select_ctrl',
                    resolve: {
                        pop_data: function () {
                            return {
                                save_success: true,
                                process: $scope.actions.addDate,
                                scope: $scope
                            };
                        }
                    }
                }).open();
            }

            function deleteDate(list, $index) {
                $scope.datelist = _.reject(list, function (i, index) {
                    return index === $index
                });
            }

            /**
             * 添加起止时间到List里
             * @param dateObj {start_date:...,end_date:...}
             */
            function addDate(dateObj) {
                $scope.datelist.push(dateObj);
            }

            $scope.actions = {
                deleteDateByIndex: deleteDate,
                popSelect: showSelectWindow,
                addDate: addDate
            };
        }
    }
}]);
wt.directive.directive('wtOrganizerInfo', [function () {
    "use strict";
    return {
        restrict: "E",
        scope: {
            organizerId: "="
        },
        templateUrl: '/view/directive/organizer_info.html',
        link: function (scope, ele, attr) {
            function getOrganizerInfo() {
                wt.data.organizer.get(null, scope.organizerId, function Success(resp) {
                    scope.organizer = resp.data;
                    console.log(scope.organizer);
                }, function Error(resp) {

                }, function Then(resp) {

                });
            }

            var handle = _.once(getOrganizerInfo);
            if (_.isEmpty(scope.organizerId)) {
                scope.$watch('organizerId', function (newV, oldV) {
                    if (newV && newV !== oldV) {
                        handle();
                    }
                });
            } else {
                handle();
            }
        }
    }
}]);
wt.directive.directive('wtOrganizerProgramsList', ['$filter', function ($filter) {
    "use strict";
    return {
        restrict: "E",
        scope: {
            organizerId: "="
        },
        templateUrl: '/view/directive/organizer_program_list.html',
        link: function (scope, ele, attr) {
            function getOrganizerInfo(organizerId, queryCondition) {
                scope.programs_loading_done = false;
                wt.data.task.get_page_by_organizer(organizerId, queryCondition, function Success(resp) {
                    scope.items = mapProgramsWithDateRange(resp.data);
                }, function Error(resp) {

                }, function Then(resp) {
                    scope.programs_loading_done = true;
                });
            }

            function mapProgramsWithDateRange(programs) {
                programs.forEach(function (program) {
                    program["startEndDateRange"] = makeDateRange(program);
                })
                return programs;
            }

            function makeDateRange(program) {
                var startDateString = $filter('timeFullFormat')(program.startDate);
                var endDateString = $filter('timeFullFormat')(program.endDate).trim();
                var splitedEndDate = endDateString.split(" ") || [];
                var endDateHM = splitedEndDate.length == 2 ? splitedEndDate[1] : endDateString;
                return startDateString + " " + endDateHM;
            }

            var handle = _.once(getOrganizerInfo);
            scope.queryCondition = {
                page: 1,
                size: 30,
                sortKey: "create_date",
                isDESC: true
            };
            if (_.isEmpty(scope.organizerId)) {
                scope.$watch('organizerId', function (newV, oldV) {
                    if (newV && newV !== oldV) {
                        handle(scope.organizerId, scope.queryCondition);
                    }
                });
            } else {
                handle(scope.organizerId, scope.queryCondition);
            }
        }
    }
}]);

wt.directive.directive('wtProjectProgramsList', ['$filter', function ($filter) {
    "use strict";
    return {
        restrict: "E",
        scope: {
            projectId: "="
        },
        templateUrl: '/view/directive/project_program_list.html',
        link: function ($scope, ele, attr) {
            function getProjectInfo(projectId, queryCondition) {
                $scope.programs_loading_done = false;
                queryCondition.pid = projectId;
                wt.data.task.get_programs_in_project(projectId, queryCondition, function Success(resp) {
                    $scope.items = makePrograms(resp.data);
                    resort();
                }, function Error(resp) {

                }, function Then(resp) {
                    $scope.programs_loading_done = true;
                });
            }

            function makePrograms(programs) {
                var programs = programs || [];
                programs.forEach(function (program) {
                    program.position = program.projects.position || 0;
                });
                return programs;
            }

            var handle = _.once(getProjectInfo);
            $scope.queryCondition = {
                page: 1,
                size: 20,
                sortKey: "projects.position",
                isDESC: true
            };
            if (_.isEmpty($scope.projectId)) {
                $scope.$watch('projectId', function (newV, oldV) {
                    if (newV && newV !== oldV) {
                        handle($scope.projectId, $scope.queryCondition);
                    }
                });
            } else {
                handle($scope.projectId, $scope.queryCondition);
            }


            $scope.todo_sort_options = {
                placeholder: "todo-placeholder",
                helper: "clone",
                scroll: true,
                revert: 10,
                dropOnEmpty: !0,
                tolerance: "pointer",
                distance: "4",
                delay: "75",
                disabled: !1,
                start: function (e, t) {
                    $(".todo-placeholder").css({
                        height: t.item.outerHeight() + 10,
                        width: t.item.css("width")
                    })
                },
                stop: function (t, i) {
                    var eid = i.item.attr("todo-id"),
                        a = _.findWhere($scope.items, {
                            eid: eid
                        }),
                        s = i.item.next().attr("todo-id"),
                        o = i.item.prev().attr("todo-id"),
                        l = 0;
                    if (_.isEmpty(s)) {
                        var c = _.findWhere($scope.items, {
                            eid: o
                        });
                        l = c.position / 2 + 1
                    } else if (_.isEmpty(o)) {
                        var u = _.findWhere($scope.items, {
                            eid: s
                        });
                        l = u.position + kzi.config.default_pos + 1
                    } else {
                        var c = _.findWhere($scope.items, {
                                eid: o
                            }),
                            u = _.findWhere($scope.items, {
                                eid: s
                            });
                        l = (c.position + u.position) / 2 + 1
                    }
                    if (a.position !== l) {
                        a.position = l;
                        wt.data.task.update_position_in_project(a.eid, $scope.projectId, l, function () {
                            resort();
                        })
                    }
                    function resort() {
                        if (!_.isEmpty($scope.items)) {
                            $scope.items = _.chain($scope.items)
                                .sortBy(function (item) {
                                    return item.position;
                                }).reduceRight(function (acc, item) {
                                    acc.push(item);
                                    return acc;
                                }, []).value();
                        }

                    }
                }
            }
        }
    }
}]);

/**
 * 用户详情
 * usage:
 * yourModule.controller('thisController', function ($scope) {
 *    $scope.userId = "UserIdYouAsked";
 * });
 * <wt-user-detail user-id='userId'></wt-user-detail>
 */
wt.directive.directive('wtUserDetail', [function () {
    "use strict";
    return {
        scope: {
            userId: '=userId'
        },
        restrict: 'E',
        templateUrl: '/view/directive/userDetail/userDetail.html',
        link: function (scope, elmt, attr) {
            scope.state = {
                loading: false
            }

            scope.$watch('userId', function (newV, oldV) {
                if (!_.isEmpty(newV)) {
                    loadUser(newV);
                }
            });

            function loadUser(uid) {
                scope.state.loading = true;
                wt.data.user.get_by_uid(uid,
                    function success(resp) {
                        scope.userDetail = resp.data
                    }, function fail(res) {

                    }, function then(resp) {
                        scope.state.loading = false;
                    });
            }
        }
    }
}]);
/**
 * 品牌下的子机构
 * usage:
 * in JS:
 * yourModule.controller('thisController', function ($scope) {
 *    $scope.companyId = "companyIdYouAsked";
 * });
 * in HTML:
 * <wt-company-detail company-id='companyId'></wt-company-detail>
 */
wt.directive.directive('wtCompanyOrganizerList', [function () {
    "use strict";
    return {
        scope: {
            companyId: '='
        },
        restrict: 'E',
        templateUrl: '/view/directive/companyOrganizerList/companyOrganizerList.html',
        link: function (scope, elmt, attr) {
            scope.state = {
                loading: false
            }

            scope.$watch('companyId', function (newV, oldV) {
                if (!_.isEmpty(newV)) {
                    loadOrganizerList(newV);
                }
            });

            function loadOrganizerList(groupId) {
                scope.state.loading = true;
                wt.data.user.get_by_uid(groupId,
                    function success(resp) {
                        scope.ogranizers = resp.data
                    }, function fail(res) {

                    }, function then(resp) {
                        scope.state.loading = false;
                    });
            }
        }
    }
}]);

wt.directive.directive('wtPostTarget', [function () {
    "use strict";
    return {
        restrict: 'E',
        scope: {
            target: '='
        },
        templateUrl: '/view/directive/post/postTarget.html',
        link: function (scope, elemt, attrs) {

        }
    }
}]);

wt.directive.directive('wtBriefImages', [function () {
    "use strict";
    return {
        restrict: 'E',
        scope: {
            images: '=',
            xtype: "@"
        },
        templateUrl: '/view/directive/common/images/images.html',
        link: function (scope, elemt, attrs) {
            scope.remove = function (image) {
                scope.images = _.reject(scope.images, function (item) {
                    return item === image;
                })
            }
            scope.moveToFirst = function (image) {
                scope.remove(image);
                scope.images.unshift(image);
            }
        }
    }
}]);