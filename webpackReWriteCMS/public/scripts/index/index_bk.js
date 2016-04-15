"use strict";
/**
 * Created by wuyunge on 2014/10/23.
 */
//动态信息
$(document).ready(function () {

    //http请求工具
    var HttpUtl = {
        /**
         * get方式请求数据
         * @param url：目标地址
         * @param successFunc：请求成功回调函数
         * @param errFunc：请求失败回调函数
         * @param thenFunc：无论请求是否成功都调用
         */
        http_get: function (url, successFunc, errFunc, thenFunc) {
            $.get(url, function (resp) {
                resp.code == "200" && $.isFunction(successFunc) && successFunc(resp.data);

                resp.code == "200" || $.isFunction(errFunc) && errFunc();

                $.isFunction(thenFunc) && thenFunc();
            });
        }
    };

    var Dynamic = function () {
        this.handle = {

            /**
             * 处理活动列表
             * @param data：活动数据数组
             */
            customerHandle: function (data) {
                if (data && data.length > 0) {
                    var customer_list = $("#customer-list");

                    customer_list.empty();

                    for (var i in data) {
                        var href = "/customer?cid=" + data[i].objectId + "&f_code=" + data[i].mainIndustryCode + "&s_code=" + data[i].subIndustryCode;


                        var a = $("<span></span>"), href = null;


                        var div = $("<div class='pull-left col-sm-4 col-xs-4 text-ellipsis' style='padding-left: 30px;'>" + data[i].company + "</div>");
                        div.appendTo(a);

                        div = $("<div class='pull-left col-sm-2 col-xs-2 text-ellipsis' style='padding-left: 10px;'>" + data[i].name + "</div>");
                        div.appendTo(a);

                        div = $("<div class='pull-left col-sm-2 col-xs-2 text-ellipsis' style='padding-left: 10px;'>" + (!!data[i].subIndustryCnName ? data[i].subIndustryCnName : '') + "</div>");
                        div.appendTo(a);

                        div = $("<div class='pull-left col-sm-2 col-xs-2 text-ellipsis' style='padding-left: 10px;'>" + (!!data[i].countryCnName ? data[i].countryCnName : '' ) + "</div>");
                        div.appendTo(a);

                        div = $("<div class='pull-right col-sm-2 col-xs-2 text-ellipsis line-gray'>" + TimeUtil.UnixToDate(data[i].publish_date) + "</div>");
                        div.appendTo(a);

                        div = $("<div class='list row bor-bot font-14'></div>");
                        a.appendTo(div), a = null;
                        div.appendTo(customer_list), div = null;
                    }
                    ;

                    data.length == 8 && $("#customer-list>div:last").removeClass("bor-bot");
                }
                ;
            },

            /**
             * 处理模板列表
             * @param data：模板数据数组
             */
            templatesHandle: function (data) {
                if (data && data.length > 0) {
                    var template_list = $("#template-list");

                    template_list.empty();

                    var b_href = "/template/";

                    for (var i in data) {
                        var href = b_href;
                        if (data[i].f_type == "00") {
                            href = href + "excellent/";
                        }
                        href = href + data[i].objectId;
                        var a = $("<a target='_blank' href='" + href + "'></a>"), href = null;

                        var div = $("<div class='pull-left col-sm-10 col-xs-10 text-ellipsis max-width-500 ml_30 font-14'>" + data[i].name + "</div>");
                        div.appendTo(a);

                        div = $("<div class='pull-right col-sm-2 col-xs-2 text-ellipsis pr_25 font-14 line-gray'>" + TimeUtil.UnixToDate(data[i].publish_date) + "</div>");
                        div.appendTo(a);

                        var div = $("<div class='list row bor-bot'></div>");
                        a.appendTo(div), a = null;
                        div.appendTo(template_list), div = null;
                    }
                    ;

                    data.length == 8 && $("#template-list>div:last").removeClass("bor-bot");
                }
                ;
            },

            /**
             * 处理问答列表
             * @param data：问答数据数组
             */
            postsHandle: function (data) {
                if (data && data.length > 0) {
                    var post_list = $("#questions-list");

                    post_list.empty();

                    for (var i in data) {
                        var href = "/club/";
                        if (data[i].f_type == "00") {
                            href = "/post/";
                        }
                        ;

                        var a = $("<a target='_blank' href='" + href + data[i].objectId + "'></a>"), href = null;

                        var div = $("<div class='pull-left col-sm-10 col-xs-10 text-ellipsis max-width-500 ml_30 font-14'>" + data[i].name + "</div>");
                        div.appendTo(a);

                        div = $("<div class='pull-right col-sm-2 col-xs-2 text-ellipsis pr_25 font-14 line-gray'>" + TimeUtil.UnixToDate(data[i].publish_date) + "</div>");
                        div.appendTo(a);

                        div = $("<div class='list row bor-bot'></div>");
                        a.appendTo(div), a = null;
                        div.appendTo(post_list), div = null;
                    }
                    ;

                    data.length == 8 && $("#questions-list>div:last").removeClass("bor-bot");
                }
                ;
            },

            /**
             * 处理悬赏列表
             * @param data：悬赏数据数组
             */
            rewardHandle: function (data) {
                if (data && data.length > 0) {
                    var rewar_list = $("#reward-list");

                    rewar_list.empty();

                    for (var i in data) {
                        var href = "/club/";
                        if (data[i].f_type == "00") {
                            href = "/post/";
                        }
                        href = href + data[i].objectId;
                        var a = $("<a target='_blank' href='" + href + "'></a>"), href = null;

                        var div1 = $("<div class='pull-left text-ellipsis max-width-500 ml_30 font-14'>" + data[i].name + "</div>");
                        div1.appendTo(a), div1 = null;
                        ;

                        var div2 = $("<div class='pull-right mr_15 font-14 line-gray'>" + TimeUtil.UnixToDate(data[i].publish_date) + "</div>");
                        div2.appendTo(a), div2 = null;

                        var div = $("<div class='list bor-bot'></div>");
                        a.appendTo(div), a = null;
                        div.appendTo(template_list), div = null;
                    }
                    ;

                    data.length == 8 && $("#reward-list>div:last").removeClass("bor-bot");
                }
                ;
            },

            /**
             * 处理分享达人
             * @param data
             */
            shareMaxHandle: function (data) {
                if (data && data.length > 0) {
                    var list_class = $("#share_max_list>div:first-child");

                    var share_max_list = $("#share_max_list");

                    share_max_list.empty();

                    list_class.appendTo(share_max_list);

                    for (var i in data) {

                        if (i == 7) {
                            break;
                        }

                        var row = $("<div class='font-14 pl_15' align='left'></div>");

                        var div = $("<div class='f_l max-width-100 text-ellipsis'>" + data[i].name + "</div>");

                        div.appendTo(row);

                        div = $("<div class='f_l share-num ml_15'>" + data[i].activity + "</div>");
                        div.appendTo(row),

                            div = $("<div class='f_l share-num ml_15'>" + (i * 1 + 1) + "</div>");
                        div.appendTo(row), div = null;

                        row.appendTo(share_max_list), row = null;
                    }
                    ;
                }
                ;
            },

            /**
             * 处理首页新增信息
             * @param data
             */
            newAddCountHandle: function (data) {
                if (data && data != null) {
                    var span = $("#dynamic #all_customer_count");

                    span.html(data.allCustomerCount);

                    span = $("#dynamic #new_customer_count");
                    span.html(data.newAddCustomerCount);

                    span = $("#dynamic #new_templates_count");
                    span.html(data.newAddTemplateCount);

                    span = $("#dynamic #new_send_mails_count");
                    span.html(data.newAddMailsCount);

                    span = $("#dynamic #new_opend_mails_count");
                    span.html(data.newOpendMailsCount);

                    span = $("#dynamic #new_rewards_count");
                    span.html(data.newAddRewardsCount);

                    span = $("#dynamic #new_posts_count");
                    span.html(data.newAddPostsCount);
                    span = null;
                }
                ;
            },

            /**
             * 处理首页最新动态列表
             * @param data
             */
            newDynamicHandle: function (data) {
                if (data && data.length > 0) {
                    var dynamic_list = $("#user-dynamic");

                    dynamic_list.empty();

                    for (var i in data) {
                        var row = $("<div class='font-14 pl_15' align='left'></div>");

                        var div = $("<div align='left' class='pull-left max-width-100 text-ellipsis'>" + data[i].name + "<br>&nbsp;</div>");

                        div.appendTo(row);

                        div = $("<div align='left' class='pull-left max-width-140 text-ellipsis ml_15'>" + data[i].activity +"<br><span class='color_gray'>"+data[i].createTime+ "<span></span></div>");

                        div.appendTo(row), div = null;

                        row.appendTo(dynamic_list),row = null;
                    }
                    ;

//                    if (data.length >= 8) {
//                        Dynamic.listLoop("#user-dynamic", 2000);
//                    }
//                    ;
                }
                ;
            }
        };

        /**
         * 加载热门模板
         */
        this.loadTemplates = function () {
            HttpUtl.http_get("/api/templates/hot", this.handle.templatesHandle, null, null);
        };

        /**
         * 加载热门问答
         */
        this.loadPosts = function () {
            HttpUtl.http_get("/api/posts/hot", this.handle.postsHandle, null, null);
            $("#reward-list").addClass("hide");
            $("#questions-list").removeClass("hide");
        };

        /**
         * 加载热门活动
         */
        this.loadCustomers = function () {
            HttpUtl.http_get("/api/tasks/hot", this.handle.customerHandle, null, null);
        };

        /**
         * 加载所有新增信息
         */
        this.loadNewAdds = function () {
            HttpUtl.http_get("/api/dynamic", this.handle.newDynamicHandle, null, null);
        };

//    this.loadRewards=function(){
//        HttpUtl.http_get("/api/rewards/hot",this.handle.rewardHandle,null,null);
//        $("#reward-list").removeClass("hide");$("#questions-list").addClass("hide");
//    };
//
//    this.showPosts=function(){
//        $("#reward_tab").addClass("title-tab").removeClass("title-tab-active");
//        $("#questions_tab").addClass("title-tab-active").removeClass("title-tab");
//        this.loadPosts();
//    };
//
//    this.showRewards=function(){
//        $("#questions_tab").addClass("title-tab").removeClass("title-tab-active");
//        $("#reward_tab").addClass("title-tab-active").removeClass("title-tab");
//        this.loadRewards();
//    };
    };

    var strHandle=function(str){

        _.isEmpty(str) && (str="");

        _.isEmpty(str) || ((str=="undefined" || str=="null") && (str=""));

        return str;
    };

    var TimeUtil = {
        /**
         * 当前时间戳
         * @return <int>        unix时间戳(秒)
         */
        CurTime: function () {
            return Date.parse(new Date()) / 1000;
        },

        /**
         * 日期 转换为 Unix时间戳
         * @param <string> 2014-01-01 20:20:20  日期格式
         * @return <int>        unix时间戳(秒)
         */
        DateToUnix: function (string) {
            var f = string.split(' ', 2);
            var d = (f[0] ? f[0] : '').split('-', 3);
            var t = (f[1] ? f[1] : '').split(':', 3);
            return (new Date(
                    parseInt(d[0], 10) || null,
                    (parseInt(d[1], 10) || 1) - 1,
                    parseInt(d[2], 10) || null,
                    parseInt(t[0], 10) || null,
                    parseInt(t[1], 10) || null,
                    parseInt(t[2], 10) || null
            )).getTime() / 1000;
        },

        /**
         * 时间戳转换日期
         * @param <int> unixTime    时间戳(秒)
         * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
         */
        UnixToDate: function (unixTime, isFull) {
            var time = new Date(unixTime);
            var ymdhis = "";
            ymdhis += time.getUTCFullYear() + "-";
            ymdhis += (time.getUTCMonth() + 1) + "-";
            ymdhis += time.getUTCDate();
            if (isFull === true) {
                ymdhis += " " + time.getUTCHours() + ":";
                ymdhis += time.getUTCMinutes() + ":";
                ymdhis += time.getUTCSeconds();
            }
            return ymdhis;
        }
    };

    /**
     * 处理活动列表
     * @param data：活动数据数组
     */
    Dynamic.listLoop = function (list_id, time) {

        var list = $(list_id);

        if (list.children().length > 1) {
            setTimeout(function () {
                Dynamic.listLoop(list_id, time)
            }, time);
//        list.children().first().remove().appendTo(list);//向上滚动

            list.prepend(list.children().last());//向下滚动
        }
        ;
    };

    //加载首页数据
    function init(){
        HttpUtl.http_get("/api/dynamic", function (data) {
            if (data != null) {
                var dynamic = new Dynamic();
                dynamic.handle.newAddCountHandle(data);

                dynamic.handle.customerHandle(data.hotCustomers);

                dynamic.handle.templatesHandle(data.hotTemplates);

                dynamic.handle.newDynamicHandle(data.dynamics);

                dynamic.handle.postsHandle(data.hotPosts);

                dynamic.handle.shareMaxHandle(data.shareMaxs);
            };
        }, null, null);
    };

    init();
    setInterval(function(){init()},60000);


})
//点击切换热门问答和最新悬赏
//    var reward=$("#dynamic #reward-list");
/*if(reward.is(":hidden"))
 {
 dynamic.showPosts();
 }
 else
 {
 dynamic.showRewards();
 };*/

/*$("#reward_tab").bind("click",function(){

 <<<<<<< Updated upstream
 $("#dynamic #reward-list").is(":hidden") && dynamic.showRewards();
 });

 $("#questions_tab").bind("click",function(){
 $("#dynamic #questions-list").is(":hidden") && dynamic.showPosts();
 });*/

//轮播淡入淡出
$(document).ready(function () {
    var num = $('.carousel_span span').length;
    var i_mun = 0;
    var timer_banner = null;

    $('.carousel_ul li:gt(0)').hide();//页面加载隐藏所有的li 除了第一个

    //底下小图标点击切换
    $('.carousel_span span').click(function () {
        $(this).addClass('carousel_span_one')
            .siblings('span').removeClass('carousel_span_one');
        var i_mun1 = $('.carousel_span span').index(this);
        $('.carousel_ul li').eq(i_mun1).fadeIn('slow')
            .siblings('li').fadeOut('slow');

        i_mun = i_mun1;
    });

    //左边箭头点击时切换
    $('.carousel_left').click(function () {
        if (i_mun == 0) {
            i_mun = num
        }
        //大图切换
        $('.carousel_ul li').eq(i_mun - 1).fadeIn('slow')
            .siblings('li').fadeOut('slow');
        //小图切换
        $('.carousel_span span').eq(i_mun - 1).addClass('carousel_span_one')
            .siblings('span').removeClass('carousel_span_one');

        i_mun--
    });

    //左边按钮移动到其上时更换背景图片
    $('.carousel_left').mouseover(function () {
        $('.carousel_left').addClass('carousel_left1');
    });

    //左边按钮移动到其上时还原背景图片
    $('.carousel_left').mouseout(function () {
        $('.carousel_left').removeClass('carousel_left1');
    });

    //右边箭头点击时切换
    $('.carousel_right').click(function () {
        move_banner();
    });

    //右边按钮移动到其上时更换背景图片
    $('.carousel_right').mouseover(function () {
        $('.carousel_right').addClass('carousel_right1');
    });

    //右边按钮移动到其上时更换背景图片
    $('.carousel_right').mouseout(function () {
        $('.carousel_right').removeClass('carousel_right1');
    });

    //鼠标移动到幻灯片上时 显示左右切换案例
    $('.carousel').mouseover(function () {
        $('.carousel_left').show();
        $('.carousel_right').show();
    });

    //鼠标离开幻灯片上时 隐藏左右切换案例
    $('.carousel').mouseout(function () {
        $('.carousel_left').hide();
        $('.carousel_right').hide();
    });

    //自动播放函数
    function bannerMoveks() {
        timer_banner = setInterval(function () {
            move_banner()
        }, 8000)
    };
    bannerMoveks();//开始自动播放

    //鼠标移动到banner上时停止播放
    $('.carousel').mouseover(function () {
        clearInterval(timer_banner);
    });

    //鼠标离开 banner 开启定时播放
    $('.carousel').mouseout(function () {
        bannerMoveks();
    });


    //banner 右边点击执行函数
    function move_banner() {
        if (i_mun == num - 1) {
            i_mun = -1
        }
        //大图切换
        $('.carousel_ul li').eq(i_mun + 1).fadeIn('slow')
            .siblings('li').fadeOut('slow');
        //小图切换
        $('.carousel_span span').eq(i_mun + 1).addClass('carousel_span_one')
            .siblings('span').removeClass('carousel_span_one');
        i_mun++
    }
})

//搜索按钮的点击
$(document).ready(function () {
    var searchBtn = $('#index-search .search-btn');
    var searchInput = $('#index-search input.form-control');
    var search = function () {
        var param = searchInput.val();
        if (param) {
            window.location.href = window.location.href + "customer?key=" + param;
        } else {
            window.location.href = window.location.href + "customer";
        }
    }

    searchBtn.bind('click',search);
    searchInput.bind('keydown keypress',function(e) {
        var key = e.which || e.keyCode;
        if( key === 13) {
            search();
            e.preventDefault();
        }
    })
})
//立即注册按钮的点击
$(function () {
    var viewSignUp = {
        button: $('#sign-up-now-inline'),
        user:$('.sign-up-in-wrapper .sign-up-user input'),
        email:$('.sign-up-in-wrapper .sign-up-email input')
        };
    viewSignUp.button.bind('click', function () {
        var connector1 = '';
        var connector2 = '';
        var valUser = viewSignUp.user.val() || '';
        var valEmail = viewSignUp.email.val() || '';
        valUser && ( valUser = ['user=',valUser].join(''));
        valEmail && (valEmail = ['email=',valEmail].join(''));
        if(valUser && valEmail) {
            connector2 = '&'
        }
        if(valUser || valEmail) {
            connector1 = '?'
        }
        window.location.href = window.location.href + 'signup' + connector1 +  valUser + connector2 + valEmail;
    })
})
//AB-TEST
/*
$(function () {
    var viewDcmt = {
        search: $('.index-bg-wrapper'),
        login:$('.index-brief-wrapper'),
        carousel:$('.index-carousel-wrapper'),
        dynamic:$('#dynamic'),
        signup:$('.sign-up-in-wrapper'),
        divider:$('.index-divider-wrapper')

    }
    //default
    var viewFn = {
        //default
        changeToA: function () {

        },
        //dynamic most
        changeToB: function () {
            viewDcmt.search.remove();
            viewDcmt.login.remove();
            viewDcmt.signup.show();
            viewDcmt.dynamic.insertBefore(viewDcmt.divider[0])
            viewDcmt.carousel.insertBefore(viewDcmt.signup[0]);
        }
    }
    //map: Array -> B
    function bIpOddOrEven (a) {
        //
        var aIP = a || [];
        var sIP = aIP && aIP[0];
        var s = sIP.split('.')[0];
        var bValue = parseInt(s,10) % 2;
        if(bValue !== bValue) {
            return 1;
        } else {
            return bValue ;
        }
    }
    //奇数以及取不到IP时为默认的视图
    if(bIpOddOrEven(ILData)) {
        viewFn.changeToA();
        console.log('haschangetoA');
    } else {
        viewFn.changeToB();
        console.log('has change to b');
    }

})*/
