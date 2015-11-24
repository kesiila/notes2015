"use strict";
(function (kzi) {
    kzi.constant = kzi.constant || {};
    kzi.constant.operation = {
        add: 1,
        update: 2,
        remove: 3
    };
    kzi.constant.user_type = {
        user_general: 'user_general',
        user_talent: 'user_talent',
        user_official: 'user_official',
        user_bonday: 'user_bonday'
    };
    kzi.constant.user_ref_role = {
        order: 'order',
        cancel: 'cancel',
        signer: 'signer',
        admin_cancel:  'admin_cancel'
    };
    kzi.constant.tag_type = {
        tag: "tag",
        age: "age",
        category: "category",
        group: "group",
        grade: "grade",
        organizer: "organizer",
        organizer_scale: "organizer_scale",
        program_type: "program_type",
        user: "user",
        project: "project",
        goods: "goods",
        order: "order",
        post: "post",
        address: "address",
        ad: "ad",
        stay: "stay"
    };
    kzi.constant.ad_tag_enums = {
        AD_MOBILE_HOMEPLAY:'ad_mobile_homeplay',
        AD_MOBILE_HOMEHOT: 'ad_mobile_homehot',
        AD_MOBILE_ORGANIZERHOT: 'ad_mobile_organizerhot',
        AD_MOBILE_RANKINGSUGGEST: 'ad_mobile_rankingsuggest',
        AD_MOBILE_HOT_CITY:'ad_mobile_hot_city',
        AD_WEB_HOMEPLAY: 'ad_web_homeplay',
        AD_WEB_HOMEHOT: 'ad_web_homehot',
        AD_WEB_ORGANIZERHOT: 'ad_web_organizerhot'
    };
    kzi.constant.article_part = {
        ARTICLE_APPLYING  : "article_applying",
        ARTICLE_ACTIVITY  :"article_activity",
        ARTICLE_SPECIAL   :"article_special",
        ARTICLE_CAMPUS    : "article_campus"
    };
    kzi.constant.get_tag_type_name = function (e) {
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
            case kzi.constant.tag_type.goods:
                return "商品";
            case kzi.constant.tag_type.order:
                return "订单";
            case kzi.constant.tag_type.organizer_scale:
                return "机构规模";
            case kzi.constant.tag_type.user:
                return "用户类型";
            case kzi.constant.tag_type.project:
                return "项目类型";
            case kzi.constant.tag_type.stay:
                return "住宿方式";
            default:
                return ""
        }
    };
    kzi.constant.get_order_status = function (e) {
        switch (e) {
            case 0:
                return "未支付";
            case 1:
                return "支付成功";
            case -1:
                return "取消";
            default:
                return ""
        }
    };

    kzi.constant.get_role_name = function (e) {
        switch (e) {
            case kzi.constant.role.admin:
                return "管理员";
            case kzi.constant.role.member:
                return "普通成员";
            case kzi.constant.role.visitor:
                return "访问者";
            default:
                return "没有该角色"
        }
    };
    kzi.constant.get_member_roles = function () {
        return [
            {
                role: kzi.constant.role.admin,
                name: "管理员"
            },
            {
                role: kzi.constant.role.member,
                name: "成员"
            }
        ]
    };

    kzi.constant.show_all_hint = function () {
        for (var key in kzi.constant.hint_names) {
            kzi.localData.remove(kzi.constant.hint_names[key]);
        }
    };

    kzi.constant.event_names = {
        entity_del: "entity_del",
        entity_untrash: "entity_untrash",

        emit_filter_activity_by_type: "emit_filter_activities_by_type",
        filter_activity_by_type: "filter_activities_by_type",
        filter_activity_by_prj: "filter_activities_by_prj",
        reload_item_activities: "reload_item_activities",
        emit_filter_watch_by_type: "emit_filter_watch_by_type",
        filter_watch_by_type: "filter_watch_by_type",
        filter_posts_by_sort: "filter_posts_by_sort",
        post_comment_add: "post_comment_add",
        comment_del: "comment_del",
        shortcut_key_to_edit: "shortcut_key_to_edit",
        shortcut_key_to_cancel: "shortcut_key_to_cancel",
        shortcut_key_to_task: "shortcut_key_to_task",
        shortcut_key_left_menu_toggle: "shortcut_key_left_menu_toggle",
        load_entity_task: "load_entity_task",
        load_entity_event: "load_entity_event",
        load_entity_post: "load_entity_post",
        load_entity_project: "load_entity_project",
        load_entity_organizer: "load_entity_organizer",
        load_entity_goods: "load_entity_goods",
        load_entity_order: "load_entity_order",
        load_entity_article: "load_entity_article",
        load_entity_coupon: "load_entity_coupon",
        load_entity_tag: "load_entity_tag",
        load_entity_user: "load_entity_user",
        load_post_detail: "load_post_detail",
        load_entity_template: "load_entity_template",
        load_entity_file: "load_entity_file",
        load_entity_page: "load_entity_page",
        load_entity_mail: "load_entity_mail",
        load_comments: "load_comments",
        load_mails: "load_mails",
        load_teams_projects_sucess: "load_teams_projects_sucess",
        load_faTemplates_sucess: "load_faTemplates_sucess",
        load_item_programs: "load_item_programs",
        load_item_orders: "load_item_orders",
        load_item_coupons: "load_item_coupons",
        notice_new: "notice_new",

        on_goods_add: "on_goods_add",
        on_goods_trash: "on_goods_trash",
        on_goods_start: "on_goods_start",
        on_goods_complete: "on_goods_complete",
        on_goods_move: "on_goods_move",
        on_goods_update: "on_goods_update",
        on_goods_comment: "on_goods_comment",

        on_order_add: "on_order_add",
        on_order_trash: "on_order_trash",
        on_order_start: "on_order_start",
        on_order_complete: "on_order_complete",
        on_order_move: "on_order_move",
        on_order_update: "on_order_update",
        on_order_comment: "on_order_comment",

        on_article_add: "on_article_add",
        on_article_trash: "on_article_trash",
        on_article_update: "on_article_update",
        on_article_comment: "on_article_comment",
        on_article_publish: "on_article_publish",

        on_video_add: "on_video_add",
        on_video_trash: "on_video_trash",
        on_video_update: "on_video_update",
        on_video_comment: "on_video_comment",
        on_video_publish: "on_video_publish",

        on_coupon_add: "on_coupon_add",
        on_coupon_trash: "on_coupon_trash",
        on_coupon_start: "on_coupon_start",
        on_coupon_complete: "on_coupon_complete",
        on_coupon_move: "on_coupon_move",
        on_coupon_update: "on_coupon_update",
        on_coupon_comment: "on_coupon_comment",

        on_program_add: "on_program_add",
        on_program_trash: "on_program_trash",
        on_program_untrash: "on_program_untrash",
        on_program_start: "on_program_start",
        on_program_complete: "on_program_complete",
        on_program_move: "on_program_move",
        on_program_update: "on_program_update",
        on_program_comment: "on_program_comment",
        on_program_publish: "on_program_publish",
        on_program_trash_group: "on_program_trash_group",
        on_program_add_with_old: "on_program_add_with_old",

        on_organizer_add: "on_organizer_add",
        on_organizer_trash: "on_organizer_trash",
        on_organizer_untrash: "on_organizer_untrash",
        on_organizer_start: "on_organizer_start",
        on_organizer_complete: "on_organizer_complete",
        on_organizer_move: "on_organizer_move",
        on_organizer_update: "on_organizer_update",
        on_organizer_comment: "on_organizer_comment",
        on_organizer_publish: "on_organizer_publish",

        on_user_add: "on_user_add",
        on_user_trash: "on_user_trash",
        on_user_start: "on_user_start",
        on_user_complete: "on_user_complete",
        on_user_move: "on_user_move",
        on_user_update: "on_user_update",
        on_user_comment: "on_user_comment",

        on_post_add: "on_post_add",
        on_post_trash: "on_post_trash",
        on_post_start: "on_post_start",
        on_post_complete: "on_post_complete",
        on_post_move: "on_post_move",
        on_post_update: "on_post_update",
        on_post_comment: "on_post_comment",

        on_project_add: "on_project_add",
        on_project_trash: "on_project_trash",
        on_project_update: "on_project_update",
        on_project_comment: "on_project_comment",

        load_prj_feed: "load_prj_feed",
        on_task_add: "on_task_add",
        on_task_trash: "on_task_trash",
        on_task_start: "on_task_start",
        on_task_complete: "on_task_complete",
        on_task_move: "on_task_move",
        on_task_update: "on_task_update",
        on_task_comment: "on_task_comment",
        on_task_mail: "on_task_mail",
        on_task_badges_file: "on_task_badges_file",
        on_task_unarchived: "on_task_unarchived",
        on_task_batch_move: "on_task_batch_move",
        on_event_update: "on_event_update",
        on_event_trash: "on_event_trash",
        on_file_add: "on_file_add",
        on_file_trash: "on_file_trash",
        on_file_move: "on_file_move",
        on_file_update: "on_file_update",
        on_post_collect: "on_post_collect",
        on_template_trash: "on_template_trash",
        on_template_comment: "on_template_comment",
        on_template_update: "on_template_update",
        on_slide_hide: "on_slide_hide",
        on_mail_trash: "on_mail_trash",
        on_project_tasks_filter: "on_project_tasks_filter",
        show_project_workflow: "show_project_workflow",
        show_project_tasks_filter: "show_project_tasks_filter",
        show_project_setting: "show_project_setting",
        show_project_setting_identify: "show_project_setting_identify",
        project_clear_task_filter: "project_clear_task_filter",
        on_right_menu: "on_right_menu",
        on_task_share: "on_task_share",
        on_post_share: "on_post_share",
        on_template_share: 'on_template_share',
        cascading_open: 'cascading_open',
        public_customer_colloct: 'public_customer_colloct',
        visibility_change: 'visibility_change',
        open_mail_box: 'open_mail_box',
        close_mail_box: 'close_mail_box',
        mail_box_show: 'mail_box_show',
        entity_loading_done: 'entity_loading_done',
        teams_loading_done: 'teams_loading_done',
        edit_mail_change: 'edit_mail_change',
        show_sidebar_tasks_filter: "show_sidebar_tasks_filter",
        open_template_generator: "open_template_generator",
        select_comment_tab: "select_comment_tab",
        on_pastefile_to_event: "on_pastefile_to_event",
        on_proj_ladels_update: "on_proj_ladels_update",
        on_tasks_labels_update: "on_tasks_labels_update",
        project_tasks_filter_underdevelopment: "project_tasks_filter_underdevelopment",
        public_customer_colloct_success: "public_customer_colloct_success",
        public_customer_send_mail_success: "public_customer_send_mail_success"
    };
    kzi.constant.shift_cutover_keys = [84, 67, 70, 68, 65, 69, 82, 71];
    kzi.constant.global_shortcut_keys = [63, 69, 27, 47, 96];
    kzi.constant.entry_shortcut_keys = [37, 38, 39, 40, 13, 67, 27, 68, 76, 77, 32, 87, 60, 62, 74, 75, 73, 78, 65];
    kzi.constant.keyASCIIs = {
        T: 84,
        C: 67,
        F: 70,
        D: 68,
        A: 65,
        E: 69,
        G: 71,
        R: 82,
        L: 76,
        M: 77,
        W: 87,
        At: 64,
        ESC: 27,
        Slash: 47,
        I: 73,
        J: 74,
        K: 75,
        N: 78,
        Key96: 96,
        QuestionMark: 63,
        VK_LEFT: 37,
        VK_UP: 38,
        VK_RIGHT: 39,
        VK_DOWN: 40,
        VK_RETURN: 13,
        VK_SPACE: 32,
        VK_LessThan: 60,
        VK_GreaterThan: 62,
        ENTER: 13
    };
    kzi.constant.all_hour_sections = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"], kzi.constant.all_minute_sections = ["00", "10", "20", "30", "40", "50"], kzi.constant.mail = {
        domain: "@mail.bonday.cn"
    };
    kzi.constant.role = {
        admin: 1,
        member: 2,
        guest: 3
    };
    kzi.constant.status = {
        ok: 1,
        pending: 2
    };
    kzi.constant.trash = {
        no: 0,
        yes: 1
    };
    kzi.constant.archived = {
        yes: 1,
        no: 0
    };
    kzi.constant.star = {
        yes: 1,
        no: 0
    };
    kzi.constant.completed = {
        yes: 1,
        no: 0
    };
    kzi.constant.checked = {
        yes: 1,
        no: 0
    };
    kzi.constant.notify = {
        yes: 1,
        no: 0
    };
    kzi.constant.entity_type = {
        task: "task",
        file: "file",
        mail: "mail",
        post: "post",
        organizer: "organizer",
        order: "order",
        coupon: "coupon",
        goods: "goods",
        user: "user",
        template: "template",
        page: "page",
        event: "event"
    };
    kzi.constant.notice_type_icon = {
        task: {
            name: "task",
            icon: "icon-check"
        },
        file: {
            name: "file",
            icon: "icon-file"
        },
        post: {
            name: "post",
            icon: "icon-list-alt"
        },
        organizer: {
            name: "organizer",
            icon: "icon-bank"
        },
        goods: {
            name: "goods",
            icon: "icon-shopping-cart"
        },
        order: {
            name: "order",
            icon: "icon-barcode"
        },
        coupon: {
            name: "coupon",
            icon: "icon-money"
        },
        user: {
            name: "user",
            icon: "icon-user"
        },
        mail: {
            name: "mail",
            icon: "icon-envelope"
        },
        template: {
            name: "template",
            icon: "icon-list-alt"
        },
        page: {
            name: "page",
            icon: "icon-file-text-alt"
        },
        event: {
            name: "event",
            icon: "icon-calendar"
        },
        project: {
            name: "project",
            icon: "icon-inbox"
        },
        comment: {
            name: null,
            icon: "icon-comment-alt"
        }
    };
    kzi.constant.feed_type_icon = {
        task: {
            name: "task",
            icon: "icon-user"
        },
        event: {
            name: "event",
            icon: "icon-calendar"
        },
        file: {
            name: "file",
            icon: "icon-file"
        },
        post: {
            name: "post",
            icon: "icon-list-alt"
        },
        organizer: {
            name: "organizer",
            icon: "icon-bank"
        },
        goods: {
            name: "goods",
            icon: "icon-shopping-cart"
        },
        order: {
            name: "order",
            icon: "icon-money"
        },
        user: {
            name: "user",
            icon: "icon-user"
        },
        mail: {
            name: "mail",
            icon: "icon-envelope"
        },
        template: {
            name: "template",
            icon: "icon-list-alt"
        },
        page: {
            name: "page",
            icon: "icon-file-text-alt"
        },
        completed: {
            name: "task",
            icon: "icon-check"
        },
        label: {
            name: "label",
            icon: "icon-tag"
        },
        tag: {
            name: "tag",
            icon: "icon-tag"
        },
        comment: {
            name: "comment",
            icon: "icon-comment-alt"
        }
    };
    kzi.constant.notice_types = {
        all: "all",
        assign: "assign",
        complete: "complete",
        metion: "metion",
        watch: "watch",
        comment: "comment",
        other: "other"
    };
    kzi.constant.get_notice_types = function () {
        return [
            {
                type: kzi.constant.notice_types.all,
                name: "全部消息",
                icon_class: "icon-bell"
            },
            {
                type: kzi.constant.notice_types.assign,
                name: "分配活动",
                icon_class: "icon-user"
            },
            {
                type: kzi.constant.notice_types.complete,
                name: "完成活动",
                icon_class: "icon-check-sign"
            },
            {
                type: kzi.constant.notice_types.metion,
                name: "提到我的",
                icon_class: "icon-quote-left"
            },
            {
                type: kzi.constant.notice_types.watch,
                name: "提醒关注",
                icon_class: "icon-eye-open"
            },
            {
                type: kzi.constant.notice_types.comment,
                name: "评论",
                icon_class: "icon-comment-alt"
            },
            {
                type: kzi.constant.notice_types.other,
                name: "更多",
                icon_class: "icon-ellipsis-horizontal"
            }
        ]
    };
    kzi.constant.xtype = {
        task: "programs",
        file: "files",
        post: "posts",
        user: "users",
        organizer: "organizers",
        goods: "goodss",
        order: "orders",
        coupon: "coupons",
        template: "templates",
        mail: "mails",
        page: "pages",
        event: "events",
        article: "articles"
    };
    kzi.constant.exts = {
        none: 0,
        txt: 1,
        png: 2,
        jpeg: 3,
        jpg: 4,
        gif: 5,
        doc: 6,
        xls: 7,
        ppt: 8,
        pdf: 9,
        zip: 10,
        rar: 11,
        xml: 12,
        html: 13,
        docx: 14,
        xlsx: 15,
        pptx: 16,
        mail: 17,
        pages: 18,
        key: 19,
        numbers: 20,
        ipa: 21,
        apk: 22,
        xap: 23,
        cs: 24,
        java: 25,
        rb: 26,
        py: 27,
        css: 28,
        js: 29,
        cpp: 30,
        c: 31,
        h: 32,
        php: 33,
        cc: 34,
        hh: 35,
        vb: 36,
        mp3: 37,
        avi: 38,
        chm: 39,
        vsd: 40,
        rp: 41,
        wmv: 42,
        bmp: 43,
        psd: 44,
        cvs: 45,
        ai: 46,
        json: 47,
        "7z": 48,
        tar: 49,
        swf: 50,
        wim: 51,
        bat: 52,
        sh: 53,
        wab: 54,
        vba: 55,
        ost: 56,
        msi: 57,
        log: 58,
        svg: 59,
        less: 60,
        md: 61,
        bin: 62,
        obj: 63,
        edx: 64,
        mmap: 65,
        thmx: 66,
        dump: 67,
        one: 68,
        pst: 69,
        vcf: 70,
        ini: 71,
        csv: 72,
        wps: 73,
        et: 74,
        dps: 75,
        pfx: 76
    };
    kzi.constant.permission = {
        holder: 0,
        ok: 1,
        project_archived: 4,
        entity_not_found: 8,
        entity_deleted: 16,
        entity_archived: 32,
        team_not_found: 64,
        team_stop_service: 128
    };
    kzi.constant.get_ext = function (e) {
        return kzi.constant.exts[e.toLowerCase()] ? kzi.constant.exts[e.toLowerCase()] : 0
    };
    kzi.constant.image_exts = [2, 3, 4, 5, 43];
    kzi.constant.get_file_icon = function (e) {
        if (1 === e.type) switch (e.ext) {
            case 1:
                return "img/folder/icon-folder-green.png";
            case 2:
                return "img/folder/icon-folder-orange.png";
            case 3:
                return "img/folder/icon-folder-purple.png";
            case 4:
                return "img/folder/icon-folder-red.png";
            case 8:
                return "img/folder/icon-folder-blue.png";
            default:
                return "img/folder/icon-folder-yellow.png"
        } else switch (e.ext) {
            case 1:
                return "img/folder/icon-txt.png";
            case 2:
                return "-1";
            case 3:
                return "-1";
            case 4:
                return "-1";
            case 5:
                return "-1";
            case 6:
                return "img/folder/icon-word.png";
            case 7:
                return "img/folder/icon-excel.png";
            case 8:
                return "img/folder/icon-ppt.png";
            case 9:
                return "img/folder/icon-pdf.png";
            case 10:
                return "img/folder/icon-zip.png";
            case 11:
                return "img/folder/icon-rar.png";
            case 12:
                return "img/folder/icon-xml.png";
            case 13:
                return "img/folder/icon-html.png";
            case 14:
                return "img/folder/icon-word.png";
            case 15:
                return "img/folder/icon-excel.png";
            case 16:
                return "img/folder/icon-ppt.png";
            case 17:
                return "img/folder/icon-mail.png";
            case 18:
                return "img/folder/icon-pages.png";
            case 19:
                return "img/folder/icon-keynote.png";
            case 20:
                return "img/folder/icon-numbers.png";
            case 21:
                return "img/folder/icon-ipa.png";
            case 22:
                return "img/folder/icon-apk.png";
            case 23:
                return "img/folder/icon-xap.png";
            case 24:
                return "img/folder/icon-csharp.png";
            case 25:
                return "img/folder/icon-java.png";
            case 26:
                return "img/folder/icon-ruby.png";
            case 27:
                return "img/folder/icon-python.png";
            case 28:
                return "img/folder/icon-css.png";
            case 29:
                return "img/folder/icon-js.png";
            case 30:
                return "img/folder/icon-cpp.png";
            case 31:
                return "img/folder/icon-c.png";
            case 32:
                return "img/folder/icon-h.png";
            case 33:
                return "img/folder/icon-php.png";
            case 34:
                return "img/folder/icon-c.png";
            case 35:
                return "img/folder/icon-h.png";
            case 36:
                return "img/folder/icon-vb.png";
            case 37:
                return "img/folder/icon-mp3.png";
            case 38:
                return "img/folder/icon-avi.png";
            case 39:
                return "img/folder/icon-chm.png";
            case 40:
                return "img/folder/icon-visio.png";
            case 41:
                return "img/folder/icon-rp.png";
            case 42:
                return "img/folder/icon-wmv.png";
            case 43:
                return "-1";
            case 44:
                return "img/folder/icon-psd.png";
            case 45:
                return "img/folder/icon-cvs.png";
            case 46:
                return "img/folder/icon-ai.png";
            case 47:
                return "img/folder/icon-json.png";
            case 48:
                return "img/folder/icon-7z.png";
            case 49:
                return "img/folder/icon-tar.png";
            case 50:
                return "img/folder/icon-swf.png";
            case 51:
                return "img/folder/icon-wim.png";
            case 52:
                return "img/folder/icon-bat.png";
            case 53:
                return "img/folder/icon-sh.png";
            case 54:
                return "img/folder/icon-wab.png";
            case 55:
                return "img/folder/icon-vba.png";
            case 56:
                return "img/folder/icon-ost.png";
            case 57:
                return "img/folder/icon-msi.png";
            case 58:
                return "img/folder/icon-log.png";
            case 59:
                return "img/folder/icon-svg.png";
            case 60:
                return "img/folder/icon-less.png";
            case 61:
                return "img/folder/icon-md.png";
            case 62:
                return "img/folder/icon-bin.png";
            case 63:
                return "img/folder/icon-obj.png";
            case 64:
                return "img/folder/icon-edx.png";
            case 65:
                return "img/folder/icon-mmap.png";
            case 66:
                return "img/folder/icon-thmx.png";
            case 67:
                return "img/folder/icon-dump.png";
            case 68:
                return "img/folder/icon-one.png";
            case 69:
                return "img/folder/icon-pst.png";
            case 70:
                return "img/folder/icon-vcf.png";
            case 71:
                return "img/folder/icon-ini.png";
            case 72:
                return "img/folder/icon-csv.png";
            case 73:
                return "img/folder/icon-wps.png";
            case 74:
                return "img/folder/icon-et.png";
            case 75:
                return "img/folder/icon-dps.png";
            case 76:
                return "img/folder/icon-pfx.png";
            default:
                return "img/folder/icon-file-default.png"
        }
    };
    kzi.constant.get_folder_icons = [
        {
            ext: 1,
            path: "img/folder/icon-folder-green.png"
        },
        {
            ext: 2,
            path: "img/folder/icon-folder-orange.png"
        },
        {
            ext: 3,
            path: "img/folder/icon-folder-purple.png"
        },
        {
            ext: 4,
            path: "img/folder/icon-folder-red.png"
        },
        {
            ext: 8,
            path: "img/folder/icon-folder-blue.png"
        },
        {
            ext: 0,
            path: "img/folder/icon-folder-yellow.png"
        }
    ];
    kzi.constant.labels = [
        {
            name: "green",
            desc: ""
        },
        {
            name: "yellow",
            desc: ""
        },
        {
            name: "orange",
            desc: ""
        },
        {
            name: "red",
            desc: ""
        },
        {
            name: "purple",
            desc: ""
        },
        {
            name: "blue",
            desc: ""
        }
    ];
    kzi.constant.entries = [
        {
            name: "step_one",
            desc: ""
        },
        {
            name: "step_two",
            desc: ""
        },
        {
            name: "step_three",
            desc: ""
        },
        {
            name: "step_four",
            desc: ""
        },
        {
            name: "step_five",
            desc: ""
        },
        {
            name: "step_six",
            desc: ""
        }
    ];

    kzi.constant.verbs = {
        create: "create",
        update: "update",
        add: "add",
        remove: "remove"
    };
    kzi.constant.atypes = {
        project: "project",
        entry: "entry",
        task: "task",
        post: "post",
        mail: "mail",
        template: "template",
        page: "page",
        file: "file",
        folder: "folder",
        todo: "todo",
        vote: "vote"
    };
    kzi.constant.file_type = {
        file: 0,
        folder: 1
    };
    kzi.constant.folder_ext = {
        normal: 0,
        image: 1,
        mail: 2
    };
    kzi.constant.prj_colors = ["#92e1c0", "#9fe1e7", "#9fc6e7", "#4986e7", "#9a9cff", "#b99aff", "#ac725e", "#d06b64", "#f83a22", "#fa573c", "#ff7537", "#ffad46", "#c2c2c2", "#cabdbf", "#cca6ac", "#f691b2", "#cd74e6", "#a47ae2", "#42d692", "#16a765", "#7bd148", "#b3dc6c", "#fbe983", "#fad165"], kzi.constant.prj_icons = ["icon-apple", "icon-android", "icon-html5", "icon-desktop", "icon-mobile-phone", "icon-tablet", "icon-github", "icon-dribbble", "icon-linux", "icon-windows", "icon-qrcode", "icon-bug", "icon-suitcase", "icon-beaker", "icon-plane", "icon-truck", "icon-money", "icon-book", "icon-music", "icon-facetime-video", "icon-picture", "icon-cloud", "icon-gift", "icon-coffee", "icon-heart", "icon-flag", "icon-bar-chart", "icon-lock", "icon-gears", "icon-fire"], kzi.constant.team = {
        edition: {
            free: 1,
            business: 2,
            nonprofit: 3
        },
        status: {
            normal: 1,
            trial: 2,
            expired: 3
        },
        quota_free: 10,
        quota_nonprofit: 50
    };
    kzi.constant.subscription = {
        status: {
            normal: 1,
            arrears: 2,
            trial: 3,
            expired: 4
        },
        step: {
            pay_online: 1,
            already_fee: 2,
            next_fee: 3,
            already_fee_and_next_new: 4
        },
        price: 10,
        dividing_day: 15
    };
    kzi.constant.payment = {
        status: {
            unpaid: 0,
            successed: 1,
            failed: -1,
            cancel: -2
        },
        method: {
            unknown: 0,
            online: 1,
            manual: 2,
            remit: 3,
            transfer: 4,
            recharge: 5
        },
        type: {
            unknown: 0,
            alipay: 1,
            bank: 2,
            paypal: 3,
            credit: 4,
            cash: 5,
            coupon: 6
        },
        direction: {
            payment: 1,
            refund: 2
        },
        scheme: {
            one_month: 1,
            one_quarter: 3,
            half_year: 6,
            one_year: 12,
            two_year: 24
        }
    };
    kzi.constant.prj_permission = {
        admin: 31,
        member: 15,
        guest: 7,
        viewer: 1,
        deny: 0
    };
    kzi.constant.event_trash_type = {
        one: 1,
        follow_up: 2,
        all: 3
    }, kzi.constant.event_update_type = {
        one: 1,
        follow_up: 2
    };
    kzi.constant.coupon_status = {
        canuse: 1,
        using: 2,
        used: 3
    };
    kzi.constant.event_recurrence = {
        no_repeat: 0,
        day: 1,
        week: 2,
        month: 3,
        year: 4
    };
    kzi.constant.event_repeat_intervals = [
        {
            key: 0,
            desc: "不重复"
        },
        {
            key: 1,
            desc: "每日重复"
        },
        {
            key: 2,
            desc: "每周重复"
        },
        {
            key: 3,
            desc: "每月重复"
        },
        {
            key: 4,
            desc: "每年重复"
        }
    ];
    kzi.constant.team_module = {
        setting: 16,
        add_project: 8,
        add_member: 4,
        view: 2,
        view_base: 1
    };
    kzi.constant.team_permission = {
        owner: 31,
        admin: 15,
        member: 3,
        guest: 1,
        deny: 0
    };

    kzi.constant.prj_module = {
        setting: 16,
        crud: 8,
        comment: 4,
        watch: 2,
        view: 1
    };


    kzi.constant.client_name = {
        unknown: 0,
        web: 1,
        mail: 2,
        iphone: 3,
        ipad: 4,
        android: 5,
        androidHD: 6,
        winphone: 7,
        win8: 8,
        wap: 9,
        weinxin: 10
    };
    kzi.constant.client = {
        unknown: 0,
        web: 1,
        mail: 2,
        iphone: 3,
        ipad: 4,
        android: 5,
        androidHD: 6,
        winphone: 7,
        win8: 8,
        wap: 9,
        weinxin: 10
    };
    kzi.constant.prj_visibility = {
        "private": 1,
        "protected": 2,
        "public": 3
    };
    kzi.constant.team_visibility = {
        "private": 1,
        "public": 2
    };

    /**
     *
     * 积分及获取积分的规则配置，全局唯一；
     * 弃用json配置文件，减少用户的请求；
     */
    kzi.constant.score = {
        config: {
            "signup": 1000,//注册积分
            "login": 50,//登录积分
            "recommend": 300,//推荐积分

            "collectCustomer": -10,//收藏活动
            "shareCustomer": 10,//分享活动
            "customercollect": 2,//分享的活动被收藏

            "sharePost": 5,//发布问答
            "shareGoodPost": 20,//分享的问答被选进精华区
            "postCommentAdd": 2,//回复问答

            "shareTemplate": 15,//分享模板
            "shareGoodTemplate": 40,//分享的模板被选进精华区

            "report_err": 2,//举报错误
            "update_err": 3,//修改错误信息

            "recharge_30": 3000,//充值30元
            "recharge_50": 5500,//充值50元
            "recharge_100": 12000//充值100元
        },
        rules: [
            {"score": 1000, "event": "成功注册帐号", "url": 1},
            {"score": 300, "event": "注册填写有效推荐人", "url": 1},
            {"score": 50, "event": "每日成功登录一次", "url": 1},
            {"score": 300, "event": "推荐好友注册成功", "url": "/share"},
            {"score": 10, "event": "成功分享一位活动", "url": "/tasks?type=1"},
            {"score": 2, "event": "分享的活动每被收藏一次", "url": 1},
            {"score": 5, "event": "成功分享一份问答", "url": "/posts?type=1"},
            {"score": 2, "event": "成功回复一个问题", "url": "/club"},
            {"score": 20, "event": "分享的问答被录入精华库", "url": 1},
            {"score": 15, "event": "成功分享一份邮件模板", "url": "/templates?type=1"},
            {"score": 40, "event": "分享的模板被录入精华库", "url": 1}
        ]
    };
    kzi.constant.systemFieldList = [
        {
            name: '联系人',
            value: 'name',
            pattern: /Contact|Contacts|Name|姓名|联系人|负责人|采购联系人|customer|contact person|contact name|liason|联络人|活动姓名/i
        },
        {
            name: '公司',
            value: 'company',
            pattern: /Company|公司|企业名称|公司名称|企业|活动公司|Enterprise|Firm|Organization|单位|活动单位/i
        },
        {
            name: '邮箱',
            value: 'email',
            pattern: /邮箱|电子邮件|邮件|email|email box|mail box/i
        },
        {
            name: '职位',
            value: 'position',
            pattern: /position|职位/i
        },
        {
            name: '地区',
            value: 'zoneCnName',
            pattern: /area|zone|district|地区/i
        },
        {
            name: '国家',
            value: 'countryCnName',
            pattern: /Country|国家|country name|国别/i
        },
        {
            name: '地址',
            value: 'address',
            pattern: /地址|address|联系地址|活动地址|add|post address|post/i
        },
        {
            name: '邮编',
            value: 'postcode',
            pattern: /postcode|邮编/i
        },
        {
            name: '网址',
            value: 'website',
            pattern: /网址|url|web|website|网站地址|网站/i
        },
        {
            name: '来源',
            value: 'source',
            pattern: /source|来源/i
        },
        {
            name: '描述',
            value: 'description',
            pattern: /description|描述/i
        },
        {
            name: '电话',
            value: 'phone',
            pattern: /电话|联系电话|活动电话|tel|telephone|phone|phone number|telephone number|telephone/i

        },
        {
            name: '手机',
            value: 'mobile',
            pattern: /mobiel|telephone|手机|移动电话/i
        },
        {
            name: '传真',
            value: 'fax',
            pattern: /传真|活动传真|telefax|fax|fax number|telefax number|fax|telefax/i
        },
        {
            name: 'msn',
            value: 'msn',
            pattern: /msn/i
        },
        {
            name: 'skype',
            value: 'skype',
            pattern: /skype/i
        },
        {
            name: 'linkedin',
            value: 'linkedin',
            pattern: /linedin/i
        },
        {
            name: 'facebook',
            value: 'facebook',
            pattern: /facebook/i
        },
        {
            name: 'whatsApp',
            value: 'whatsApp',
            pattern: /whatsApp/i
        },
        {
            name: '微信',
            value: 'weixin',
            pattern: /weixin|wechat|微信/i
        },
        {
            name: 'tradeManager',
            value: 'tradeManager',
            pattern: /tradeManager/i
        }
    ];
    kzi.constant.mail_status_describe = [
        {
            name: '投递中……',
            describe: '正在投递邮件'
        },
        {
            name: '投递失败',
            describe: '由于网络原因，邮件提交给服务器失败了，系统会继续发送'
        },
        {
            name: '无效邮箱',
            describe: '这个邮箱是无效的'
        },
        {
            name: '已投递',
            describe: '这个邮件已经投递给服务器了'
        },
        {
            name: '已发送',
            describe: '这个邮件已经发送了'
        },
        {
            name: '已弹回',
            describe: '因为多种原因，邮件被弹回了'
        },
        {
            name: '已送达',
            describe: '邮件已经送达活动邮箱'
        },
        {
            name: '已打开',
            describe: '活动已经打开了邮件'
        },
        {
            name: '额度已满',
            describe: '今天不能给这个活动发送更多的邮件，排队等待中'
        },
        {
            name: '点击链接',
            describe: '活动已经打开了邮箱，并点击了邮件里的链接'
        }

    ];
})(kzi);
