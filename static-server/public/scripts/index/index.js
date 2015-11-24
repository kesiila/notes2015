/**
 * Created by uyunge on 15-4-6.
 */
"use strict";

require.config({

    baseUrl: "/lib",
    paths: {
        "jquery": ["jquery/jquery.1.9"],
        "bootstrap": ["bootstrap"],
        "underscore": ["underscore"]
    }
});

/**
 * Created by uyunge on 15-4-7.
 */

define("number", ['underscore'], function (_) {

    var LENGTH;

    function numToString(num, length) {
        return _(length - (num + '').length).times(function () {
                return "0"
            }).join("") + num + '';
    }

    function stringToNum(numberString) {
        return parseInt(numberString);
    }

    function Number(num) {
        this.numbers = _.map(numToString(num, LENGTH).split(''), stringToNum);
    }

    Number.prototype.diff = function (num) {
        return _.map(_.zip(this.numbers, num.numbers), function (item) {
                var temp = item[0] - item[1];
                return temp >= 0 ? temp : temp + 10;
            });
    }

    return function (length) {
        LENGTH = length;
        return Number;
    };
})


define('DOMSetFACTORY', ['underscore', 'number'], function (underscore, number) {
    var _ = underscore;

    return function (opt) {
        /**
         * eg:
         * {
         *     base: 600,
          *    cell_height: 30,
          *    image: "li div span",
          *    init_number: "0000"
         * }
         */
        var BASE = opt["base"],
            HEIGHT = opt["cell_height"],
            image = opt["image"],
            init_number = opt["init_number"],
            LIMIT = BASE - HEIGHT * 10,
            COUNT = opt["num_length"],
            DURATION = opt["duration"] || 750,
            positionProperty = "top";

        var Number = number(COUNT);

        var $numbers = $(image),
            LENGTH = $numbers.length;

        var rend = rendDomWithNumber,
            toNum = pxToNum,
            toString = numToString;


        /****************************保证数字长度与DOM结构长度一致 ****************/
        if (LENGTH !== init_number.length) throw new Error("初始化数字长度与DOM长度不符合");


        function pxToNum(string) {
            return parseInt(string, 10);
        }

        function numToString(num) {
            return num + '';
        }


        function animate(ele, cell, doneCallBack) {
            ele.animate({
                "top" : "-=" + cell
            }, DURATION, doneCallBack);
        }


        function reSet(dom, number) {
            $(dom).css("top", BASE - HEIGHT * number);
        }


        function rendDomWithNumber(dom, diffNumber, number) {
            animate($(dom), HEIGHT * diffNumber, function () {
                var position = pxToNum($(this).css("top"));
                if (position <= LIMIT) {
                    reSet(this, number);
                }
            });
        }

        return {
            setNumber: function (number) {
                var diff = new Number(number).diff(new Number(init_number)),
                    numbers = _.map(toString(number).split(""), toNum);

                if (diff.length !== LENGTH) throw new Error("初始化数字长度与DOM长度不符合");

                _.forEach(_.zip($numbers, diff, numbers), function (item) {
                    var dom = item[0],
                        diffNumber = item[1];
                    rend(dom, diffNumber, item[2]);
                })
                init_number = number;
            }
        }
    }
})

define('Animate', ['jquery', 'underscore'], function ($, _) {
    var CELL = 900;
    var defaults = {
        currentActiveEle: '.tab.tab1',
        prefix: '.tab',
        changeList: ['.tab1', '.tab2', '.tab3', '.tab4', '.tab5'],
        trigger: 'click',
        changeArea: '.tabContent'
    };

    function moveTo(ele, number) {
        $(ele).css('left', number);
    }

    function bind() {
        var currentActiveEle = defaults.currentActiveEle,
            changeList = defaults.changeList,
            prefix = defaults.prefix,
            trigger = defaults.trigger,
            changeArea = defaults.changeArea;

        _.forEach(changeList, function (ele, index) {
            $(prefix + ele).bind(trigger, function () {
                $(currentActiveEle).removeClass('active');
                moveTo(changeArea, 0 - CELL * index);
                $(this).addClass('active');
                currentActiveEle = this;
            })
        });
    }

    return function (config) {
        _.extend(defaults, config);
        return bind;
    };

});

define('HttpMethods', ['jquery'], function ($) {
    var HttpMethods = {
        /**
         * get方式请求数据
         * @param url：目标地址
         * @param successFunc：请求成功回调函数
         * @param errFunc：请求失败回调函数
         * @param thenFunc：无论请求是否成功都调用
         */
        get: function (url, successFunc, errFunc, thenFunc) {
            $.get(url, function (resp) {
                resp.code == "200" && $.isFunction(successFunc) && successFunc(resp.data);

                resp.code == "200" || $.isFunction(errFunc) && errFunc();

                $.isFunction(thenFunc) && thenFunc();
            });
        }
    };
    return HttpMethods;
});

define('SignUpWithInfo', ['jquery'], function ($) {
    var defaults = {
        formSelector: '#idnex-form',
        nameSelector: 'input[name=user]',
        emailSelector: 'input[name=email]',
        submitSelector: ' #submit',
        urlAfterChange: '/signup'
    }

    /**
     * 页面上的a标签
     * (ids, urls)
     * @type {{id}}
     */
    var elem__urls = [
        ["#toCustomer", "/customer"],
        ["#let_me_try_template", "/template/generator"],
        ["#let_me_try_customer", "/customer"],
        ["#let_me_try_mail__toSignup", "/signup"],
        ["#let_me_try_mail__toCustomer", "/tasks"]
    ]

    function makeUrl(baseUrl, userSelector, emailSelector) {
        var valUser = $(userSelector).user.val() || '',
            valEmail = $(emailSelector).email.val() || '';
        return baseUrl + '?' + ['user=', valUser].join('') + '&' + ['email=', valEmail].join('');
    }


    return function bindEvent() {
        var form = defaults.formSelector,
            name = defaults.name,
            email = defaults.emailSelector,
            submit = defaults.submitSelector,
            url = defaults.urlAfterChange;

        $(form + submit).bind('click', function () {
            if(name !== "昵称" && email !== "电子邮箱") {
                window.location.href = makeUrl(url, name, email);
            }
        });

        _.forEach(elem__urls, function (item) {
            $(item[0]).bind('click', function () {
                window.location.href = item[1];
            })
        })
    }
});

require(["jquery", "DOMSetFACTORY", "Animate", 'HttpMethods', 'SignUpWithInfo'], function ($, DomSetterFactory, Animate, HttpMethods, SignUpWithInfo) {
    var factory = DomSetterFactory,
        animate_scroll = Animate,
        httpMethods = HttpMethods,
        indexAboveFooterBind = SignUpWithInfo,
        /**
         * 第一部分（数字动画）的配置信息，返回一个对象
         */
        domSetter = factory({
            base: 0,
            cell_height: 68,
            image: ".auto li img",
            init_number: "0000000",
            num_length: 7,
            duration: 1000
        });

    /**
     改变数字的配置信息
     */
    var transfer = changeNumWithCustomerCount,
        INTERVAL = 8000,
        intervalor;

    transfer.call(this);
    intervalor = startAnimate();

    /**
     * 第四部分的类轮播动画
     */
    animate_scroll().call(this);

    /**
     * 注册跳转部分
     */
    indexAboveFooterBind.call(this);

    /**
     * 模拟数据
     */
    var count = 100;
    function mock() {
        var number = 1000000 + ( count || 100 ) * 200 + Math.round(Math.random() * 200);
        console.log(number);
        count ++ ;
        domSetter.setNumber(number);
    }

    function changeNumWithCustomerCount () {
        httpMethods.get("/api/dynamic", function (data) {
            var count = data["allCustomerCount"],
                count_t = parseInt(count.split(',').join(''),10);
            domSetter.setNumber(count_t);
        })
    }

    $.fn.bingo = function (status, interval) {
        console.log('congratulations! you have got a painted eggshell~ we precisely hope you can join us!');
        INTERVAL = interval || INTERVAL;
        transfer = status == 0 ? changeNumWithCustomerCount : mock;
        startAnimate();
    }

    function startAnimate () {
        clearInterval(intervalor);
        return  setInterval(function () {
            transfer.call(this);
        }, INTERVAL);
    }
});