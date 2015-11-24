"use strict";
Date.prototype.isSameDay = function (d) {
    return this.getFullYear() === d.getFullYear() && this.getMonth() === d.getMonth() && this.getDate() === d.getDate()
};
Date.prototype.format = function (str) {
    var t = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(y+)/.test(str)) {
        (str = str.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
    }
    for (var i in t) {
        var newStr;
        if (new RegExp("(" + i + ")").test(str)) {
            if (1 == RegExp.$1.length) {
                newStr = t[i];
            } else {
                newStr = ("00" + t[i]).substr(("" + t[i]).length);
            }
            ;
            str = str.replace(RegExp.$1, newStr);
        }
    }
    return str;
};

var kzi = {};
kzi.config = {
    wohoo_show_version: 310,
    version: "?ver=3.1.3",
    img_url_prefix: "http://bonday.oss-cn-hangzhou.aliyuncs.com/",
    debug: function () {
        return "dev" !== wt.env || kzi.util.isIE() || "object" != typeof window.console ? false : true
    },
    prefixed: "wt",
    lang: "zh-cn",
    default_pos: 65535,
    default_count: 20,
    googleAnalytics: "UA-42366759-1",
    box_url: function () {
        //return "http://cms.bonday.cn:8080/api/file";
        return "dev" === wt.env ? "http://cms.bonday.cn/api/file" : "http://cms.bonday.cn/api/file"
    },
    box_url_regex: function () {
        //return "http://cms.bonday.cn:8080/api/file";
        return "dev" === wt.env ? new RegExp("^http://cms.bonday.cn/api/file/upload(.*)$") : new RegExp("^http://cms.bonday.cn/api/file/upload(.*)$")
    },
    wtbox: function () {
        return "dev" === wt.env ? "http://cms.bonday.cn/api/file/upload/" : "http://cms.bonday.cn/api/file/upload/"
    },
    default_team_pic: "/img/logo.png",
    default_avatar: "/img/default_avatar.png",
    default_box: "",
    default_project_bg: "",
    default_nopic: "/img/bg/nopic.png",
    wtbox_url: "http://bonday.oss-cn-hangzhou.aliyuncs.com/",
    wtlogo_url: "http://cms.bonday.cn/",
    wtavatar_url: "http://bonday.oss-cn-hangzhou.aliyuncs.com/",
    wtall_url: "http://cms.bonday.cn/",
    wtprj_url: "http://cms.bonday.cn/",
    desk_notify_key: "my_desk_notice",
    root_url: "http://cms.bonday.cn/",
    colors: {
        completed: "#88b244",
        uncompleted: "#f7af49",
        expired: "#f47a55",
        archived: "#9fc6e7",
        created: "#9fe1e7"
    },
    socket_url: function () {
        return "dev" === wt.env ? "" : "http://cms.bonday.cn/"
    },
    avatar_url: function (avatar_url) {
        return avatar_url.trim().indexOf("http") === 0 ?  avatar_url : kzi.config.wtavatar_url + avatar_url;
    }
};
kzi.calcHeight = function () {
    var headerHeight = $("#header").outerHeight(true);
    var navHeight = $(".mod_navbar").outerHeight(true);
    $(".height-full").height(kzi.util.winHeight());
    $(".height-noheader").height(kzi.util.winHeight() - headerHeight);
    $(".height-nonav").height(kzi.util.winHeight() - headerHeight - navHeight - 1);
    $(".height-main-min").css("minHeight", kzi.util.winHeight() - headerHeight - navHeight);
    $(".height-main-min-j4-new-template-by-hand").css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 5);
    $(".height-main-min-j4-new-template-by-auto").css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 6);
    $(".height-main-min-j4-new-template-by-hand-mailbox").css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 5 - 90);
    $(".height-main-min-j4-new-template-by-auto-mailbox").css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 5 - 90);
    //公海发邮件
    $(".height-main-min-j4-new-template-by-hand-mailbox-in-outter")
        .css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 5 - 90 - 30);
    //私海发邮件
    $(".height-main-min-j4-new-template-by-auto-mailbox-in-inner")
        .css("minHeight", kzi.util.winHeight()  -headerHeight - navHeight - 62 - 40 * 5 - 90 + 90 + 20);

    //公海生成器
    $(".height-main-min-j4-new-template-by-auto-mailbox-outter")
        .css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 5 - 90 + 90 - 40); //主体部分带有三个输入框时，textarea的自动高度
    $(".height-main-min-j4-new-template-by-auto-mailbox-outter-with-one-input-above")
        .css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 5 - 90 + 90 - 36  + 75);//主体部分带有1个输入框时，textarea的自动高度
    $(".height-main-min-j4-new-template-by-auto-mailbox-inner-with-one-input-above")
        .css("minHeight", kzi.util.winHeight() - headerHeight - navHeight - 62 - 40 * 5 - 90 + 90 - 36  + 75 + 60);
    $.each($(".height-nonav"), function (key, value) {
        $(value).hasClass("leftpanel") && ($(value).children().height() > parseInt($(value).css("height"), 10) ? $(value).addClass("height-scroll") : $(value).removeClass("height-scroll"))
    });
    $("[data-minheight]").each(function () {
        var minheight = parseInt(kzi.util.winHeight() - $(this).data("minheight"), 10);
        $(this).css("minHeight", minheight);
    });
    $("[data-maxheight]").each(function () {
        var maxHeight = parseInt(kzi.util.winHeight() - $(this).data("maxheight"), 10);
        $(this).css("maxHeight", maxHeight);
    });
    $("[data-height]").each(function () {
        var height = parseInt(kzi.util.winHeight() - $(this).attr("data-height"), 10);
        $(this).css("height", height);
    })
};
kzi.emojis = ["bowtie",
    "smile",
    "laughing",
    "blush",
    "smiley",
    "relaxed",
    "smirk",
    "heart_eyes",
    "kissing_heart",
    "kissing_closed_eyes",
    "flushed",
    "relieved",
    "satisfied", "grin", "wink", "stuck_out_tongue_winking_eye", "stuck_out_tongue_closed_eyes", "grinning", "kissing", "kissing_smiling_eyes", "stuck_out_tongue", "sleeping", "worried", "frowning", "anguished", "open_mouth", "grimacing", "confused", "hushed", "expressionless", "unamused", "sweat_smile", "sweat", "weary", "pensive", "disappointed", "confounded", "fearful", "cold_sweat", "persevere", "joy", "astonished", "scream", "neckbeard", "tired_face", "angry", "rage", "triumph", "sleepy", "yum", "mask", "sunglasses", "dizzy_face", "imp", "smiling_imp", "neutral_face", "no_mouth", "innocent", "alien", "yellow_heart", "blue_heart", "purple_heart", "heart", "green_heart", "broken_heart", "heartbeat", "heartpulse", "two_hearts", "revolving_hearts", "cupid", "sparkling_heart", "sparkles", "star", "star2", "dizzy", "boom", "collision", "anger", "exclamation", "question", "grey_exclamation", "grey_question", "zzz", "dash", "sweat_drops", "notes", "musical_note", "fire", "hankey", "poop", "shit", "+1", "thumbsup", "-1", "thumbsdown", "ok_hand", "punch", "facepunch", "fist", "v", "wave", "hand", "raised_hand", "open_hands", "point_up", "point_down", "point_left", "point_right", "raised_hands", "pray", "point_up_2", "clap", "muscle", "metal", "walking", "runner", "running", "couple", "family", "two_men_holding_hands", "two_women_holding_hands", "ok_woman", "no_good", "information_desk_person", "bride_with_veil", "person_with_pouting_face", "person_frowning", "bow", "couplekiss", "couple_with_heart", "massage", "haircut", "nail_care", "boy", "girl", "woman", "man", "baby", "older_woman", "older_man", "person_with_blond_hair", "man_with_gua_pi_mao", "man_with_turban", "construction_worker", "cop", "angel", "princess", "smiley_cat", "smile_cat", "heart_eyes_cat", "kissing_cat", "smirk_cat", "scream_cat", "crying_cat_face", "joy_cat", "pouting_cat", "japanese_ogre", "japanese_goblin", "see_no_evil", "hear_no_evil", "speak_no_evil", "guardsman", "skull", "feet", "lips", "kiss", "droplet", "ear", "eyes", "nose", "tongue", "love_letter", "bust_in_silhouette", "busts_in_silhouette", "speech_balloon", "thought_balloon", "feelsgood", "finnadie", "goberserk", "godmode", "hurtrealbad", "rage1", "rage2", "rage3", "rage4", "suspect", "trollface", "sunny", "umbrella", "cloud", "snowflake", "snowman", "zap", "cyclone", "foggy", "ocean", "cat", "dog", "mouse", "hamster", "rabbit", "wolf", "frog", "tiger", "koala", "bear", "pig", "pig_nose", "cow", "boar", "monkey_face", "monkey", "horse", "racehorse", "camel", "sheep", "elephant", "panda_face", "snake", "bird", "baby_chick", "hatched_chick", "hatching_chick", "chicken", "penguin", "turtle", "bug", "honeybee", "ant", "beetle", "snail", "octopus", "tropical_fish", "fish", "whale", "whale2", "dolphin", "cow2", "ram", "rat", "water_buffalo", "tiger2", "rabbit2", "dragon", "goat", "rooster", "dog2", "pig2", "mouse2", "ox", "dragon_face", "blowfish", "crocodile", "dromedary_camel", "leopard", "cat2", "poodle", "paw_prints", "bouquet", "cherry_blossom", "tulip", "four_leaf_clover", "rose", "sunflower", "hibiscus", "maple_leaf", "leaves", "fallen_leaf", "herb", "mushroom", "cactus", "palm_tree", "evergreen_tree", "deciduous_tree", "chestnut", "seedling", "blossom", "ear_of_rice", "shell", "globe_with_meridians", "sun_with_face", "full_moon_with_face", "new_moon_with_face", "new_moon", "waxing_crescent_moon", "first_quarter_moon", "waxing_gibbous_moon", "full_moon", "waning_gibbous_moon", "last_quarter_moon", "waning_crescent_moon", "last_quarter_moon_with_face", "first_quarter_moon_with_face", "moon", "earth_africa", "earth_americas", "earth_asia", "volcano", "milky_way", "partly_sunny", "octocat", "squirrel", "bamboo", "gift_heart", "dolls", "school_satchel", "mortar_board", "flags", "fireworks", "sparkler", "wind_chime", "rice_scene", "jack_o_lantern", "ghost", "santa", "christmas_tree", "gift", "bell", "no_bell", "tanabata_tree", "tada", "confetti_ball", "balloon", "crystal_ball", "cd", "dvd", "floppy_disk", "camera", "video_camera", "movie_camera", "computer", "tv", "iphone", "phone", "telephone", "telephone_receiver", "pager", "fax", "minidisc", "vhs", "sound", "speaker", "mute", "loudspeaker", "mega", "hourglass", "hourglass_flowing_sand", "alarm_clock", "watch", "radio", "satellite", "loop", "mag", "mag_right", "unlock", "lock", "lock_with_ink_pen", "closed_lock_with_key", "key", "bulb", "flashlight", "high_brightness", "low_brightness", "electric_plug", "battery", "calling", "email", "mailbox", "postbox", "bath", "bathtub", "shower", "toilet", "wrench", "nut_and_bolt", "hammer", "seat", "moneybag", "yen", "dollar", "pound", "euro", "credit_card", "money_with_wings", "e-mail", "inbox_tray", "outbox_tray", "envelope", "incoming_envelope", "postal_horn", "mailbox_closed", "mailbox_with_mail", "mailbox_with_no_mail", "door", "smoking", "bomb", "gun", "hocho", "pill", "syringe", "page_facing_up", "page_with_curl", "bookmark_tabs", "bar_chart", "chart_with_upwards_trend", "chart_with_downwards_trend", "scroll", "clipboard", "calendar", "date", "card_index", "file_folder", "open_file_folder", "scissors", "pushpin", "paperclip", "black_nib", "pencil2", "straight_ruler", "triangular_ruler", "closed_book", "green_book", "blue_book", "orange_book", "notebook", "notebook_with_decorative_cover", "ledger", "books", "bookmark", "name_badge", "microscope", "telescope", "newspaper", "football", "basketball", "soccer", "baseball", "tennis", "8ball", "rugby_football", "bowling", "golf", "mountain_bicyclist", "bicyclist", "horse_racing", "snowboarder", "swimmer", "surfer", "ski", "spades", "hearts", "clubs", "diamonds", "gem", "ring", "trophy", "musical_score", "musical_keyboard", "violin", "space_invader", "video_game", "black_joker", "flower_playing_cards", "game_die", "dart", "mahjong", "clapper", "memo", "pencil", "book", "art", "microphone", "headphones", "trumpet", "saxophone", "guitar", "shoe", "sandal", "high_heel", "lipstick", "boot", "shirt", "tshirt", "necktie", "womans_clothes", "dress", "running_shirt_with_sash", "jeans", "kimono", "bikini", "ribbon", "tophat", "crown", "womans_hat", "mans_shoe", "closed_umbrella", "briefcase", "handbag", "pouch", "purse", "eyeglasses", "fishing_pole_and_fish", "coffee", "tea", "sake", "baby_bottle", "beer", "beers", "cocktail", "tropical_drink", "wine_glass", "fork_and_knife", "pizza", "hamburger", "fries", "poultry_leg", "meat_on_bone", "spaghetti", "curry", "fried_shrimp", "bento", "sushi", "fish_cake", "rice_ball", "rice_cracker", "rice", "ramen", "stew", "oden", "dango", "egg", "bread", "doughnut", "custard", "icecream", "ice_cream", "shaved_ice", "birthday", "cake", "cookie", "chocolate_bar", "candy", "lollipop", "honey_pot", "apple", "green_apple", "tangerine", "lemon", "cherries", "grapes", "watermelon", "strawberry", "peach", "melon", "banana", "pear", "pineapple", "sweet_potato", "eggplant", "tomato", "corn", "house", "house_with_garden", "school", "office", "post_office", "hospital", "bank", "convenience_store", "love_hotel", "hotel", "wedding", "church", "department_store", "european_post_office", "city_sunrise", "city_sunset", "japanese_castle", "european_castle", "tent", "factory", "tokyo_tower", "japan", "mount_fuji", "sunrise_over_mountains", "sunrise", "stars", "statue_of_liberty", "bridge_at_night", "carousel_horse", "rainbow", "ferris_wheel", "fountain", "roller_coaster", "ship", "speedboat", "boat", "sailboat", "rowboat", "anchor", "rocket", "airplane", "helicopter", "steam_locomotive", "tram", "mountain_railway", "bike", "aerial_tramway", "suspension_railway", "mountain_cableway", "tractor", "blue_car", "oncoming_automobile", "car", "red_car", "taxi", "oncoming_taxi", "articulated_lorry", "bus", "oncoming_bus", "rotating_light", "police_car", "oncoming_police_car", "fire_engine", "ambulance", "minibus", "truck", "train", "station", "train2", "bullettrain_front", "bullettrain_side", "light_rail", "monorail", "railway_car", "trolleybus", "ticket", "fuelpump", "vertical_traffic_light", "traffic_light", "warning", "construction", "beginner", "atm", "slot_machine", "busstop", "barber", "hotsprings", "checkered_flag", "crossed_flags", "izakaya_lantern", "moyai", "circus_tent", "performing_arts", "round_pushpin", "triangular_flag_on_post", "jp", "kr", "cn", "us", "fr", "es", "it", "ru", "gb", "uk", "de", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "keycap_ten", "1234", "zero", "hash", "symbols", "arrow_backward", "arrow_down", "arrow_forward", "arrow_left", "capital_abcd", "abcd", "abc", "arrow_lower_left", "arrow_lower_right", "arrow_right", "arrow_up", "arrow_upper_left", "arrow_upper_right", "arrow_double_down", "arrow_double_up", "arrow_down_small", "arrow_heading_down", "arrow_heading_up", "leftwards_arrow_with_hook", "arrow_right_hook", "left_right_arrow", "arrow_up_down", "arrow_up_small", "arrows_clockwise", "arrows_counterclockwise", "rewind", "fast_forward", "information_source", "ok", "twisted_rightwards_arrows", "repeat", "repeat_one", "new", "top", "up", "cool", "free", "ng", "cinema", "koko", "signal_strength", "u5272", "u5408", "u55b6", "u6307", "u6708", "u6709", "u6e80", "u7121", "u7533", "u7a7a", "u7981", "sa", "restroom", "mens", "womens", "baby_symbol", "no_smoking", "parking", "wheelchair", "metro", "baggage_claim", "accept", "wc", "potable_water", "put_litter_in_its_place", "secret", "congratulations", "m", "passport_control", "left_luggage", "customs", "ideograph_advantage", "cl", "sos", "id", "no_entry_sign", "underage", "no_mobile_phones", "do_not_litter", "non-potable_water", "no_bicycles", "no_pedestrians", "children_crossing", "no_entry", "eight_spoked_asterisk", "eight_pointed_black_star", "heart_decoration", "vs", "vibration_mode", "mobile_phone_off", "chart", "currency_exchange", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpius", "sagittarius", "capricorn", "aquarius", "pisces", "ophiuchus", "six_pointed_star", "negative_squared_cross_mark", "a", "b", "ab", "o2", "diamond_shape_with_a_dot_inside", "recycle", "end", "on", "soon", "clock1", "clock130", "clock10", "clock1030", "clock11", "clock1130", "clock12", "clock1230", "clock2", "clock230", "clock3", "clock330", "clock4", "clock430", "clock5", "clock530", "clock6", "clock630", "clock7", "clock730", "clock8", "clock830", "clock9", "clock930", "heavy_dollar_sign", "copyright", "registered", "tm", "x", "heavy_exclamation_mark", "bangbang", "interrobang", "o", "heavy_multiplication_x", "heavy_plus_sign", "heavy_minus_sign", "heavy_division_sign", "white_flower", "100", "heavy_check_mark", "ballot_box_with_check", "radio_button", "link", "curly_loop", "wavy_dash", "part_alternation_mark", "trident", "black_square", "white_square", "white_check_mark", "black_square_button", "white_square_button", "black_circle", "white_circle", "red_circle", "large_blue_circle", "large_blue_diamond", "large_orange_diamond", "small_blue_diamond", "small_orange_diamond", "small_red_triangle", "small_red_triangle_down", "shipit"];
kzi.util = {
    isIE: function () {
        return !!window.ActiveXObject
    },
    isIE6: function () {
        return kzi.util.isIE() && !window.XMLHttpRequest
    },
    isIE7: function () {
        return kzi.util.isIE() && !kzi.util.isIE6() && !kzi.util.isIE8()
    },
    isIE8: function () {
        return kzi.util.isIE() && !!document.documentMode
    },
    winHeight: function () {
        return $(window).height()
    },
    docWidth: function () {
        return $(document).width()
    },
    docHeight: function () {
        return $(document).height()
    },
    docOuterWidth: function () {
        return $(document).outerWidth()
    },
    docOuterHeight: function () {
        return $(document).outerHeight()
    },
    headerNavHeight: function () {
        return $("#header").outerHeight(true)
    },
    pageNavHeight: function () {
        return $(".page_navbar").outerHeight(true)
    },
    heightNoHeader: function () {
        return kzi.util.winHeight() - kzi.util.headerNavHeight()
    },
    heightNoNav: function () {
        return kzi.util.winHeight() - kzi.util.headerNavHeight() - kzi.util.pageNavHeight()
    },
    dateToTimestamp: function (e) {
        return isNaN(e) ? Date.parse(e) : e
    },
    isDate: function (e) {
        return "object" == typeof e && e.constructor == Date
    },
    getWeekday: function (e) {
        var t = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        if (kzi.util.isDate(e)) return t[e.getDay()];
        var n = new Date(e);
        return t[n.getDay()]
    },
    datetimeToDTW: function (e) {
        var t = moment(),
            n = moment(e),
            a = "";
        return t.isSame(n, "year") || (a = n.year() + "年 "), a += t.isSame(n, "day") ? n.format("今天 ") : n.format("MM月DD日 "), a += n.format("HH:mm "), a += kzi.util.getWeekday(n)
    }
};
kzi.helper = {
    build_file_icon: function (e) {
        var t = kzi.constant.get_file_icon(e);
        return "-1" === t && (t = e.path), t
    },
    get_query: function (subStr) {
        var href = String(window.document.location.href);
        href = href.replace(/%2F/g, '/');
        var i = new RegExp("(^|)" + subStr + "=([^&]*)(&|$)", "gi").exec(href);
        return i && i.length > 2 ? i[2] : ""
    },
    substr: function (e, t) {
        return e ? t >= e.length ? e : e.substring(0, t - 1) + "..." : ""
    },
    padLeft: function (e, t) {
        return e.length >= t ? e : kzi.helper.padLeft("0" + e, t)
    },
    mouse_position: function (e) {
        return e.pageX || e.pageY ? {
            x: e.pageX,
            y: e.pageY
        } : {
            x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: e.clientY + document.body.scrollTop - document.body.clientTop
        }
    }
};
kzi.validator = {
    isEmail: function (e) {
        var t = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return t.test(e)
    }
};
kzi.get_cookie = function (e) {
    for (var t = e + "=", i = document.cookie.split(";"), n = 0; i.length > n; n++) {
        for (var a = i[n];
             " " == a.charAt(0);) a = a.substring(1, a.length);
        if (0 == a.indexOf(t)) return a.substring(t.length, a.length)
    }
    return null
};
kzi.get_uid = function () {
    return wt.me.uid;
}
kzi.debug = function () {
    kzi.config.debug()
};
kzi.console = {
    log: function (e) {
        kzi.config.debug() && console.log(e)
    },
    time: function (e) {
        kzi.config.debug() && console.time(e)
    },
    timeEnd: function (e) {
        kzi.config.debug() && console.timeEnd(e)
    },
    group: function (e) {
        kzi.config.debug() && console.groupCollapsed(e)
    },
    groupEnd: function (e) {
        kzi.config.debug() && console.groupEnd(e)
    },
    profile: function (e) {
        kzi.config.debug() && console.profile(e)
    },
    profileEnd: function (e) {
        kzi.config.debug() && console.profile(e)
    }
};
var notify = function (type, msg, callback) {
    $(".notifications").notify({
        type: type,
        message: {
            text: msg
        },
        onClosed: callback
    }).show()
};
kzi.msg = {
    info: function (msg, callback) {
        notify("info", msg, callback)
    },
    error: function (msg, callback) {
        notify("danger", msg, callback)
    },
    success: function (msg, callback) {
        notify("success", msg, callback)
    },
    warn: function (msg, callback) {
        notify("warning", msg, callback)
    }
};
kzi.localData = {
    hname: location.hostname ? location.hostname : "localStatus",
    isLocalStorage: window.localStorage ? true : false,
    dataDom: null,
    initDom: function () {
        if (!this.dataDom) try {
            this.dataDom = document.createElement("input");
            this.dataDom.type = "hidden";
            this.dataDom.style.display = "none";
            this.dataDom.addBehavior("#default#userData");
            document.body.appendChild(this.dataDom);
            var currentDate = new Date;
            currentDate = currentDate.getDate() + 30;
            this.dataDom.expires = currentDate.toUTCString()
        } catch (ex) {
            return false
        }
        return true
    },
    set: function (key, value) {
        if (this.isLocalStorage) {
            window.localStorage.setItem(key, value);
        } else {
            this.initDom() && (this.dataDom.load(this.hname), this.dataDom.setAttribute(key, value), this.dataDom.save(this.hname))
        }
    },
    get: function (key) {
        return this.isLocalStorage ? window.localStorage.getItem(key) : this.initDom() ? (this.dataDom.load(this.hname), this.dataDom.getAttribute(key)) : void 0
    },
    remove: function (key) {
        this.isLocalStorage ? localStorage.removeItem(key) : this.initDom() && (this.dataDom.load(this.hname), this.dataDom.removeAttribute(key), this.dataDom.save(this.hname))
    }
};
var rules = {
    login_name: {
        required: "用户名或者邮箱不能为空"
    },
    login_password: {
        required: "登录密码不能为空",
        maxlength: "输入的密码长度必须小于{maxlength}",
        minlength: "输入的密码长度不能小于{minlength}"
    },
    user_name: {
        required: "输入的用户名不能为空",
        maxlength: "输入的用户名长度必须小于{maxlength}",
        romoteuniquecheck: "输入的用户名已经存在，请重新输入",
        regex: "用户名必须为3-30个字符, 可以是字母、数字、下划线,以字母开头"
    },
    signup_team_name: {
        required: "公司名称不能为空",
        maxlength: "公司名称长度不能大于{maxlength}"
    },
    signup_name: {
        required: "输入的用户名不能为空",
        maxlength: "输入的用户名长度必须小于{maxlength}",
        romoteuniquecheck: "输入的用户名已经存在，请重新输入",
        regex: "用户名必须为3-30个字符, 可以是字母、数字、下划线,以字母开头"
    },
    signup_password: {
        required: "输入的密码不能为空",
        maxlength: "输入的密码长度必须小于{maxlength}",
        minlength: "输入的密码长度不能小于{minlength}"
    },
    signup_email: {
        required: "输入的邮箱不能为空",
        romoteuniquecheck: "该邮箱地址已经被注册，请重新输入"
    },
    apply_email: {
        required: "输入的邮箱不能为空",
        romoteuniquecheck: "该邮箱地址已经被注册，请重新输入",
        maxlength: "输入的邮箱长度必须小于{maxlength}"
    },
    team_name: {
        required: "公司名称不能为空",
        maxlength: "公司名称必须小于{maxlength}"
    },
    forget_email: {
        required: "输入的邮箱不能为空",
        romoteuniquecheck: "该邮箱地址不存在，请重新输入",
        maxlength: "输入的邮箱长度必须小于{maxlength}"
    },
    feedback_username: {
        required: "反馈输入的姓名不能为空"
    },
    feedback_email: {
        required: "反馈输入的邮箱不能为空"
    },
    feedback_desc: {
        required: "反馈内容不能为空"
    },
    display_name: {
        required: "姓名不能为空",
        maxlength: "姓名必须小于{maxlength}"
    },
    password: {
        required: "输入的密码不能为空",
        minlength: "输入的密码长度不能小于{minlength}"
    },
    pwd_old: {
        required: "原密码不能为空",
        minlength: "原密码长度不能小于{minlength}"
    },
    pwd_new: {
        required: "新密码不能为空",
        minlength: "新密码长度不能小于{minlength}"
    },
    prj_name: {
        required: "群组名不能为空"
    },
    task_name: {
        required: "活动名不能为空"
    },
    entry_select: {
        required: "活动所在列表不能为空"
    },
    new_email: {
        required: "新邮箱地址不能空",
        romoteuniquecheck: "该邮箱地址已经存在，请重新输入"
    },
    share_email: {
        required: "邮箱地址不能为空"
    },
    share_desc: {
        required: "分享描述信息不能为空"
    },
    selected_team: {
        required: "请选择公司"
    },
    apply_team_desc: {
        required: ""
    },
    confirm_password: {
        required: "确认密码不能为空"
    },
    factor: {
        required: "动态验证码不能为空"
    },
    recovery_code: {
        required: "安全码不能为空"
    },
    customer_company: {
        required: "公司名不能为空",
        maxlength: "公司名必须小于{maxlength}"
    },
    customer_name: {
        maxlength: "活动名必须小于{maxlength}"
    },
    customer_email: {
        required: "邮箱不能为空",
        regex: "邮箱格式不正确"
    },
    customer_phone: {
        regex: "请输入正确的电话格式"
    },
    customer_website: {
        regex: "请输入正确的网址"
    },
    cascading: {
        required: "选项不能为空"
    },
    mail_title: {
        required: "标题不能为空",
        maxlength: "标题不能超过{maxlength}个字符"
    },
    template_name: {
        required: "",
        maxlength: "模板名称不能超过{maxlength}个字符"
    },
    template_title: {

    },
    mail_content: {
        required: "正文不能为空",
        maxlength: "正文不能超过{maxlength}个字符"
    }
};
var validate = new function () {
    var msg = {
        required: "该选项不能为空",
        maxlength: "该选项输入值长度不能大于{maxlength}",
        minlength: "该选项输入值长度不能小于{minlength}",
        email: "输入邮件的格式不正确",
        repeat: "两次填写的密码不一致",
        regex: "该选项输入格式不正确",
        romoteuniquecheck: "该输入值已经存在，请重新输入"
    };
    return this.get_msg = function (i, n) {
        var s = null;
        switch (_.isEmpty(rules[n.name]) || _.isEmpty(rules[n.name][i]) || (s = rules[n.name][i]), i) {
            case "maxlength":
                return null !== s ? s.replace("{maxlength}", $(n).attr("ng-maxlength")) : msg.maxlength.replace("{maxlength}", $(n).attr("ng-maxlength"));
            case "minlength":
                return null !== s ? s.replace("{minlength}", $(n).attr("ng-minlength")) : msg.minlength.replace("{minlength}", $(n).attr("ng-minlength"));
            default:
                if (null !== s) return s;
                if (null === msg[i]) throw new Error("该验证规则(" + i + ")默认错误信息没有设置！");
                return msg[i]
        }
    }, this
};
kzi.validation_rules = validate;
kzi.activity_icon = {
    project_create: "ai-blue icon-folder-close",
    project_update: "ai-yellow icon-folder-close",
    project_archive: "ai-dark-blue icon-archive",
    project_unarchive: "ai-red icon-archive",
    project_delete: "ai-red icon-trash",
    member_add: "ai-green icon-user",
    member_remove: "ai-red icon-user",
    member_join: "ai-orange icon-user",
    entry_create: "ai-blue icon-columns",
    entry_update: "ai-yellow icon-columns",
    entry_archive: "ai-dark-blue icon-archive",
    entry_unarchive: "ai-red icon-archive",
    entry_delete: "ai-red icon-trash",
    entry_restore: "ai-yellow icon-reply-all",
    task_create: "ai-blue icon-user",
    task_update: "ai-yellow icon-user",
    task_share: "ai-green icon-share-alt",
    task_collect: "ai-green icon-book",
    task_delete: "ai-red icon-trash",
    task_restore: "ai-yellow icon-reply-all",
    task_move: "ai-orange icon-share-alt",
    task_expire_set: "ai-yellow icon-time",
    task_expire_reset: "ai-yellow icon-time",
    task_complete: "ai-green icon-check-sign",
    task_uncomplete: "ai-red icon-check-empty",
    task_archive: "ai-dark-blue icon-archive",
    task_unarchive: "ai-red icon-archive",
    task_todo_add: "ai-blue icon-th-list",
    task_todo_remove: "ai-red icon-th-list",
    task_todo_check: "ai-green icon-check-sign",
    task_todo_uncheck: "ai-red icon-check-empty",
    task_todo_update: "ai-yellow icon-th-list",
    task_tags_add: "ai-blue icon-tag",
    task_tags_remove: "ai-red icon-tag",
    task_labels_add: "ai-green icon-home",
    task_labels_remove: "ai-red icon-home",
    folder_add: "ai-blue icon-folder-open-alt",
    folder_update: "ai-yellow icon-folder-open-alt",
    folder_del: "ai-red icon-folder-open-alt",
    file_move: "ai-orange icon-share-alt",
    file_attach: "ai-blue icon-paper-clip",
    file_detach: "ai-red icon-paper-clip",
    file_upload: "ai-blue icon-file",
    file_update: "ai-yellow icon-file",
    file_new_version: "ai-blue icon-upload-alt",
    file_delete: "ai-red icon-trash",
    file_restore: "ai-yellow icon-reply-all",
    comment_add: "ai-blue icon-comment",
    comment_remove: "ai-red icon-comment",
    watch_add: "ai-purple icon-eye-open",
    watch_remove: "ai-red icon-eye-open",
    post_create: "ai-blue icon-comments-alt",
    post_update: "ai-yellow icon-comments-alt",
    post_delete: "ai-red icon-trash",
    post_restore: "ai-yellow icon-reply-all",
    template_create: "ai-blue icon-list-alt",
    template_share: "ai-blue icon-share-alt",
    template_collect: "ai-blue icon-book",
    template_update: "ai-yellow icon-list-alt",
    template_delete: "ai-red icon-trash",
    template_restore: "ai-yellow icon-reply-all",
    page_create: "ai-blue icon-file-text-alt",
    page_update: "ai-yellow icon-file-text-alt",
    page_new_version: "ai-blue icon-file-text-alt",
    page_delete: "ai-red icon-trash",
    page_restore: "ai-yellow icon-reply-all",
    event_create: "ai-blue icon-calendar",
    event_update: "ai-yellow icon-calendar",
    event_delete: "ai-red icon-trash",
    attendee_add: "ai-green icon-user",
    attendee_remove: "ai-red icon-user"
};
kzi.init_fancybox = function () {
    var option = {
        maxWidth: "95%",
        maxHeight: "95%",
        openEffect: "elastic",
        closeEffect: "elastic",
        closeBtn: false,
        beforeLoad: function () {
            _.isString(this.title) && (this.title = this.title.replace(/\n/g, "<br>"))
        },
        helpers: {
            title: {
                type: "outside",
                position: "top"
            },
            buttons: {
                tpl: ['<div id="fancybox-buttons"><ul>',
                    '<li><a class="btnPrev" title="上一个" href="javascript:;"></a></li>',
                    '<li><a class="btnPlay" title="开始幻灯播放" href="javascript:;"></a></li>',
                    '<li><a class="btnNext" title="下一个" href="javascript:;"></a></li>',
                    '<li><a class="btnToggle" title="切换大小" href="javascript:;"></a></li>',
                    '<li><a class="btnClose" title="关闭" href="javascript:;"></a></li>',
                    "</ul></div>"].join("")
            },
            thumbs: {
                width: 50,
                height: 50
            },
            media: {}
        },
        tpl: {
            wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
            image: '<img class="fancybox-image" src="{href}" alt="" />',
            iframe: ['<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" ', " webkitAllowFullScreen mozallowfullscreen allowFullScreen", kzi.util.isIE() ? ' allowtransparency="true"' : "", , "></iframe>"].join(""),
            error: '<p class="fancybox-error">内容加载失败.<br/>请稍后重试.</p>',
            closeBtn: '<a title="关闭" class="fancybox-item fancybox-close" href="javascript:;"></a>',
            next: '<a title="下一个" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
            prev: '<a title="上一个" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
        }
    };
    $(".fancybox-file").fancybox(option)
};
var init = function () {
    $(document).ready(function () {
        kzi.calcHeight();
        kzi.init_fancybox();
    });
    $(window).load(function () {
        kzi.calcHeight();
    });
    setInterval(function () {
        kzi.calcHeight();
    }, 150);
    var resize = _.debounce(function () {
        kzi.calcHeight();
    }, 50);
    $(window).on("resize", resize)
};
init();
$(function () {
    var headerHeight = $("#header").outerHeight(true);
    $(".slide-content").css("top", headerHeight);
});
