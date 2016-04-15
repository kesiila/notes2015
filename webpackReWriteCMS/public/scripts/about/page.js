"use strict";
/**
 * Created by Administrator on 2014/11/7 0007.
 */

var PageReturnTop=function(){

    //页面跳转到头部
    this.pageReturnTop=function(){$(window).scrollTop(0);};

    //处理页面滚动时返回顶部div的现实和隐藏效果
    this.returnTopDivScroll=function(){$(window).scrollTop()>0?($(".return-top").show()):($(".return-top").hide());};
};

var MenuUtil=function(){

    //处理页面滚动时菜单容器的浮动效果
    this.menuDivScroll=function(){
        var container=$('#menu').parent("div");

        if($(window).scrollTop()>160)
        {
            container.css("width",container.css("width"));
            container.addClass("menu-float");
            $("#menu div").css("max-height",$(window).height()*1-(220+($("#menu>li").length+1)*$("#menu>li").height()));
        }
        else
        {
            container.removeClass("menu-float");
            $("#menu div").css("max-height","auto");
        }
    };
};
MenuUtil.prototype=new PageReturnTop();


$(function(){

    var util=new MenuUtil();

    //加载时使页面置顶
    $(window).load(util.pageReturnTop());

    //处理页面上下滚动时的响应动作
    $(window).scroll(function() {
//        util.menuDivScroll();
        util.returnTopDivScroll();
    });

    //点击回到页头
    $(".return-top").bind("click",function(){
        util.pageReturnTop();
    });


    //处理菜单折叠和展开
   $("#menu>li>a").bind("click",function() {

       var clazz= $(this).parent("li").attr("class");

       $(".spread").addClass("fold").removeClass("spread");

       if("spread"===clazz)//展开的
       {
           $(this).parent("li").addClass("fold").removeClass("spread");
       }
       else
       {
           $(this).parent("li").addClass("spread").removeClass("fold");
       }
   });



    //点击菜单，改变选中状态，并跳转目标锚点
    $(".to_anchor a").bind("click",function(){

        $(".to_anchor a").removeClass("selected");

        $(this).addClass("selected");

        var index=$(".to_anchor a").index(this);

        var target=$(".title1")[index];

        $(".title1").removeClass("selected");

        $(target).addClass("selected");


        $(window).scrollTop($(target).offset().top-70);
    });
});

var FuncPageUti=function(){

    //点击切换tab页
    this.tabSwitch=function(jquery_nav,jquery_tab,click_obj){var index=jquery_nav.index(click_obj);jquery_tab.hide();$(jquery_tab[index]).show();};

    //点击改变链接状态
    this.linkSelected=function(jquery_obj,click_obj){jquery_obj.removeClass("selected");$(click_obj).addClass("selected");};
};
FuncPageUti.prototype=new PageReturnTop();;