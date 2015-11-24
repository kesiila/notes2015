"use strict";
wt.filter = angular.module("wt.filter", []).filter("role", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.role.admin:
                    return "管理员";
                case kzi.constant.role.member:
                    return "成员";
                case kzi.constant.role.guest:
                    return "访客";
                default:
                    return e
            }
        }
    }
]).filter("prj_role", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.role.admin:
                    return "负责人";
                case kzi.constant.role.member:
                    return "成员";
                case kzi.constant.role.guest:
                    return "访客";
                default:
                    return e
            }
        }
    }
]).filter("wt_entity_type", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.atypes.task:
                    return "活动";
                case kzi.constant.atypes.file:
                    return "文件";
                case kzi.constant.atypes.post:
                    return "话题";
                case kzi.constant.atypes.page:
                    return "文档";
                case kzi.constant.atypes.event:
                    return "事件";
                default:
                    return ""
            }
        }
    }
]).filter("is_admin", [
    function () {
        return function (e) {
            return e == kzi.constant.role.admin ? true : false
        }
    }
]).filter("is_pending", [
    function () {
        return function (e) {
            return e == kzi.constant.status.pending ? true : false
        }
    }
]).filter("sex", [
    function () {
        return function (e) {
            switch (e) {
                case "male":
                    return "男性";
                case "female":
                    return "女性";
                default:
                    return e
            }
        }
    }
]).filter("tagName", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.tag_type.tag:
                    return "一般标签";
                case kzi.constant.tag_type.theme:
                    return "主题";
                case kzi.constant.tag_type.category:
                    return "目录";
                case kzi.constant.tag_type.group:
                    return "活动群体";
                case kzi.constant.tag_type.age:
                    return "年龄";
                case kzi.constant.tag_type.grade:
                    return "年级";
                case kzi.constant.tag_type.organizer:
                    return "机构";
                case kzi.constant.tag_type.user:
                    return "用户";
                case kzi.constant.tag_type.stay:
                    return "住宿方式";
                default:
                    return ""
            }
        }
    }
]).filter("follow", [
    function () {
        return function (e) {
            return e ? "已关注" : "关注"
        }
    }
]).filter("mark", [
    function () {
        return function (e) {
            return e ? "已标记" : "标记"
        }
    }
]).filter("name_rule", [
    function () {
        return function (e) {
            if (e) {
                var t = /^[(\u4e00-\u9fa5)a-z][(\u4e00-\u9fa5)a-zA-Z0-9_]{1,15}$/,
                    i = utf8.stringToBytes(e).length;
                return t.test(e) ? i > 0 && 5 > i ? "长度必须大于5字节，一个汉字3字节" : i > 15 ? "长度必须小于15字节，一个汉字3字节" : false : "支持汉字、小写字母a-z、数字0-9、或下划线_"
            }
        }
    }
]).filter("sanitize", ["sanitize",
    function (e) {
        return function (t) {
            return _.isString(t) ? e(t) : void 0
        }
    }
]).filter("length", [
    function () {
        return function (e) {
            return e ? utf8.stringToBytes(e).length : 0
        }
    }
]).filter("firstText", [
    function () {
        return function (e) {
            return e ? e.substring(0, 1).toLocaleUpperCase() : ""
        }
    }
]).filter("fromNow", ["$filter",
    function () {
        return function (e) {
            if (void 0 !== e && null !== e) {
                var t = new moment,
                    i = moment(e);
                return t.isSame(i, "day") ? "今天 " : t.add("days", 1).isSame(i, "day") ? "明天 " : t.add("days", -1).isSame(i, "day") ? "昨天 " : i.format("YYYY-MM-DD")
            }
        }
    }
]).filter("fromNow", ["$filter",
    function () {
        return function (e) {
            if (void 0 !== e && null !== e) {
                var t = new moment,
                    i = moment(e);
                var hhmm = i.format("HH:mm");
                return t.isSame(i, "day") ? "今天 " + hhmm : t.add("days", 1).isSame(i, "day") ?
                "明天 " + hhmm : t.add("days", -1).isSame(i, "day") ? "昨天 " + hhmm : i.format("YYYY-MM-DD HH:mm");
            }
        }
    }
]).filter("momentFormat", ["$filter",
    function () {
        return function (e) {
            return moment.lang(kzi.config.lang), moment(e[0]).format(e[1])
        }
    }
]).filter("dateFormat", ["$filter",
    function () {
        return function (e) {
            return void 0 !== e && null !== e ? (moment.lang(kzi.config.lang), moment(e).format("YYYY-MM-DD")) : void 0
        }
    }
]).filter("timeFormat", ["$filter",
    function () {
        return function (e) {
            return void 0 !== e && null !== e ? (moment.lang(kzi.config.lang), moment(e).format("HH:mm")) : void 0
        }
    }
]).filter("timeFullFormat", ["$filter",
    function () {
        return function (e) {
            return moment.lang(kzi.config.lang), moment(e).format("YYYY-MM-DD HH:mm")
        }
    }
]).filter("dateFormatZHCN", ["$filter",
    function () {
        return function (e) {
            return void 0 !== e && null !== e ? (moment.lang(kzi.config.lang), _.isObject(e) ? e.format("YYYY年MM月DD日") : _.isString(e) ? moment(parseFloat(e)).format("YYYY年MM月DD日") : moment(e).format("YYYY年MM月DD日")) : void 0
        }
    }
]).filter("timeFormatZHCN", ["$filter",
    function () {
        return function (e) {
            return void 0 !== e && null !== e ? (moment.lang(kzi.config.lang), moment(e).format("YYYY年MM月DD日 HH:mm")) : void 0
        }
    }
]).filter("timeFullFormatZHCN", ["$filter",
    function () {
        return function (e) {
            return void 0 !== e && null !== e ? (moment.lang(kzi.config.lang), moment(e).format("YYYY年MM月DD日 HH:mm")) : void 0
        }
    }
]).filter("timefullFormatZHCN", ["$filter",
    function () {
        return function (e) {
            return void 0 !== e && null !== e ? (moment.lang(kzi.config.lang), moment(e).format("YYYY-MM-DD HH:mm:ss")) : void 0
        }
    }
]).filter("shortTimeFormat", ["$filter",
    function () {
        return function (e) {
            return void 0 !== e && null !== e ? (moment.lang(kzi.config.lang), moment(e).format("MM-DD")) : void 0
        }
    }
]).filter("isNotUndefined", ["$filter",
    function () {
        return function (e) {
            return !_.isUndefined(e)
        }
    }
]).filter("isNullOrEmpty", ["$filter",
    function () {
        return function (e) {
            return angular.isUndefined(e) || null === e || "" === e || "" === $.trim(e) ? true : false
        }
    }
]).filter("isNotNullOrEmpty", ["$filter",
    function () {
        return function (e) {
            return angular.isUndefined(e) || null === e || "" === e || "" === $.trim(e) ? false : true
        }
    }
]).filter("watch", [
    function () {
        return function (e) {
            return e ? "取消关注" : "关注"
        }
    }
]).filter("indexOf", ["$filter",
    function () {
        return function (e) {
            return angular.isArray(e) ? -1 !== _.indexOf(e[0], e[1]) ? true : false : void 0
        }
    }
]).filter("activityIcon", ["$filter",
    function () {
        return function (e) {
            var t = e;
            return _.isUndefined(kzi.activity_icon[e]) || (t = kzi.activity_icon[e]), t
        }
    }
]).filter("badgaExpire", ["$filter",
    function () {
        return function (e) {
            return e.completed || e.badges.todo_checked_count == e.badges.todo_count ? "" : "badge-expire-soon"
        }
    }
]).filter("fullPath", ["$filter",
    function () {
        return function (e) {
            return e ? 0 == e.indexOf("/img") ? e : 0 == e.indexOf("http://wt-avatars") ? e : 0 == e.indexOf("http://wt-prj") ? e : kzi.config.box_url + e : void 0
        }
    }
]).filter("imageFullPath", ["$filter",
    function () {
        return function (input) {
            return input ? kzi.config.avatar_url(input) : "";
        }
    }
]).filter("wtBox", ["$filter",
    function () {
        return function (e) {
            return e ? kzi.config.wtbox_url + e : kzi.config.default_box
        }
    }
]).filter("wtBoxDownload", ["$filter",
    function () {
        return function (e) {
            if (e) {
                var t = kzi.get_cookie("sid"),
                    i = e.pid,
                    n = e.version ? e.version : "";
                return kzi.config.wtbox_url + e.path + "?pid=" + i + "&token=" + t + "&vid=" + n
            }
            return kzi.config.default_box
        }
    }
]).filter("wtBoxView", ["$filter",
    function () {
        return function (e) {
            if (e && e.ext) {
                if (kzi.constant.image_exts.indexOf(e.ext) > -1) {
                    var t = kzi.get_cookie("sid"),
                        i = e.pid;
                    return kzi.config.wtbox_url + e.path + "?pid=" + i + "&token=" + t + "&dt=" + (e.dt || "")
                }
                return kzi.config.wtbox_url + e.icon
            }
            return kzi.config.default_box
        }
    }
]).filter("getFileIcon", [
    function () {
        return function (e) {
            if (_.isEmpty(e)) return "";
            var t = e.substring(e.lastIndexOf(".") + 1),
                i = kzi.constant.get_ext(t),
                n = kzi.config.wtbox_url + kzi.constant.get_file_icon({
                        ext: i
                    });
            return n
        }
    }
]).filter("filterMembers", ["$filter",
    function () {
        return function (e, t) {
            if (_.isEmpty(t)) return e;
            var i = t.toLowerCase().trim();
            return _.filter(e, function (s) {
                if (!s.name) {
                    return false;
                }
                return s.name.toLowerCase().indexOf(i) > -1 || (s.display_name && s.display_name.toLowerCase().indexOf(i) > -1);
            });
        }
    }
]).filter("filterTasks", ["$filter",
    function () {
        return function (e, t) {
            if (_.isEmpty(t)) return e;
            var i = t.toLowerCase().trim();
            return _.filter(e, function (s) {

                return s.name && s.name.toLowerCase().indexOf(i) > -1;
            });
        }
    }
]).filter("filterTemplate", ["$filter",
    function () {
        return function (e, t) {
            if (_.isEmpty(t)) return e;
            var i = t.toLowerCase().trim();
            return _.filter(e, function (s) {
                return s.name && s.name.toLowerCase().indexOf(i) > -1;
            });
        };
    }
]).filter("fileSize", [
    function () {
        return function (e) {
            if (!_.isUndefined(e) && _.isNumber(parseInt(e, 10))) {
                var t = "K",
                    i = e / 1024;
                return i > 1024 && (t = "M", i /= 1024), i.toFixed(2) + t
            }
            return ""
        }
    }
]).filter("isFile", [
    function () {
        return function (e) {
            return e === kzi.constant.file_type.file ? true : false
        }
    }
]).filter("isFolder", [
    function () {
        return function (e) {
            return e === kzi.constant.file_type.folder ? true : false
        }
    }
]).filter("teamEdition", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.team.edition.business:
                    return "商业";
                case kzi.constant.team.edition.free:
                    return "免费";
                case kzi.constant.team.edition.nonprofit:
                    return "公益";
                default:
            }
        }
    }
]).filter("payType", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.payment.type.alipay:
                    return "支付宝";
                case kzi.constant.payment.type.bank:
                    return "网银";
                case kzi.constant.payment.type.credit:
                    return "信用卡";
                case kzi.constant.payment.type.cash:
                    return "现金支付";
                case kzi.constant.payment.type.coupon:
                    return "优惠劵";
                default:
            }
        }
    }
]).filter("couponStatus", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.coupon_status.canuse:
                    return "未使用";
                case kzi.constant.coupon_status.using:
                    return "使用中";
                case kzi.constant.coupon_status.used:
                    return "已使用";
                default:
            }
        }
    }
]).filter("userRefRole", [
    function () {
        function makeOrderStatus(confirm) {
            return confirm === 1 ? "已确认" : "待确认";
        }

        return function (userRef, type) {
            switch (userRef.role) {
                case kzi.constant.user_ref_role.order:
                    return type === 'class' ? 'ai-blue' : makeOrderStatus(userRef.confirm);
                case kzi.constant.user_ref_role.signer:
                    return type === 'class' ? 'ai-red' : "已签到";
                case kzi.constant.user_ref_role.cancel:
                    return type === 'class' ? 'ai-green' : "已取消";
                case kzi.constant.user_ref_role.admin_cancel:
                    return type === 'class' ? 'ai-green' : "已被管理员取消";
                default:
            }
        }
    }
]).filter("isConfirmed", [
    function () {
        return function (src) {
            return src.confirm === 1
        }
    }
]).filter("payStatus", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.payment.status.unpaid:
                    return "未支付";
                case kzi.constant.payment.status.failed:
                    return "支付失败";
                case kzi.constant.payment.status.cancel:
                    return "支付取消";
                case kzi.constant.payment.status.successed:
                    return "支付成功";
                default:
            }
        }
    }
]).filter("payStatusIsSuccess", [
    function () {
        return function (e) {
            return kzi.constant.payment.status.successed === e
        }
    }
]).filter("memberStatus", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.status.pending:
                    return "已邀请";
                case kzi.constant.status.ok:
                    return "正常";
                default:
            }
        }
    }
]).filter("projectStatus", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.archived.yes:
                    return "已归档";
                case kzi.constant.archived.no:
                    return "正常";
                default:
            }
        }
    }
]).filter("exportStatus", [
    function () {
        return function (e) {
            switch (e) {
                case 1:
                    return "准备中";
                case 2:
                    return "就绪";
                case 3:
                    return "已下载";
                default:
            }
        }
    }
]).filter("fileuploadErrorInfo", [
    function () {
        return function (e) {
            switch (e) {
                case "error":
                    return "上传失败";
                default:
                    return e
            }
        }
    }
]).filter("ifImgExtSetClass", [
    function () {
        return function (e) {
            var t = e[0],
                i = e[1];
            return kzi.constant.image_exts.indexOf(t) > -1 ? i : ""
        }
    }
]).filter("getExtIcon", [
    function () {
        return function (e) {
            var t = {
                type: 2,
                ext: kzi.constant.get_ext(e.substring(e.lastIndexOf(".") + 1))
            };
            return kzi.config.wtbox_url + kzi.constant.get_file_icon(t)
        }
    }
]).filter("projectVisibility", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.prj_visibility.private:
                    return "私有项目";
                case kzi.constant.prj_visibility.protected:
                    return "团队可见";
                case kzi.constant.prj_visibility.public:
                    return "公开项目";
                default:
                    return ""
            }
        }
    }
]).filter("permission", [
    function () {
        return function (e, t) {
            return e && t ? e & t : !1
        }
    }
]).filter("teamVisibility", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.team_visibility.private:
                    return "私有团队";
                case kzi.constant.team_visibility.public:
                    return "公开团队";
                default:
                    return ""
            }
        }
    }
]).filter("GetClientName", [
    function () {
        return function (e) {
            switch (e) {
                case kzi.constant.client.android:
                    return "Fastlane Android版";
                case kzi.constant.client.iphone:
                    return "Fastlane iPhone版";
                default:
                    return ""
            }
        }
    }
]).filter("abbrevition", [
    function () {
        return function (input, limit) {
            if (input) {
                var temporary = input.replace(/[^x00-xff]/g, "$&~");
                if (temporary.length > limit) {
                    var out = temporary.slice(0, limit);
                    var output = out.replace(/~/g, "");
                    return output + '...';
                } else {
                    return input;
                }
            }
        }
    }
]).filter("isLengthOK", [
    //filter::[Char]->Int->Bool
    function () {
        return function (input, limit) {
            if (input) {
                var strConverted = input.replace(/[^x00-xff]/g, "$&~");
                if (strConverted.length > limit) {
                    return false
                } else {
                    return true;
                }
            }
        }
    }
]).filter("isEmptyString", function () {
    return function (input) {
        if (_.isEmpty(input)) {
            return "暂无";
        }
        else {
            return input;
        }
    };
}).filter("toString", function () {
    return function (input) {
        return input + "";
    }
}).filter('statusToString', function () {
    return function (input) {
        switch (input) {
            case -1:
                return '回收站';
            case 0:
                return "审核中";
            case 1:
                return "已发布";

        }
    }
}).filter('statusToClass', function () {
    return function (input) {
        switch (input) {
            case -1:
                return 'ai-red';
            case 0:
                return "ai-blue";
            case 1:
                return "ai-green";

        }
    }
});

wt.filter.filter('userType', function () {
    return function (input) {
        if (input && input.tag_id) {
            switch (input.tag_id) {
                case kzi.constant.user_type.user_general:
                    return '一般用户';
                case kzi.constant.user_type.user_talent:
                    return '达人用户';
                case kzi.constant.user_type.user_official:
                    return '机构用户';
                case kzi.constant.user_type.user_bonday:
                    return '棒呆用户';
            }
        }
    }
});

wt.filter.filter('tagType', function () {
    return function (input, type) {
        return _.findWhere((input || []), {type: type});
    }
});

wt.filter.filter('jsonFilter', function () {
    return function (input, key, keyWord) {
        var keyWord = (keyWord || "").trim();
        return keyWord === "" ? input : _.filter(input, function (item) {
            return item[key].indexOf(keyWord) > -1;
        });
    }
});