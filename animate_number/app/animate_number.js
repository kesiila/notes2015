/**
 * Created by uyunge on 15-4-6.
 */
require.config({

    baseUrl: "../node_modules",
    paths: {
        "jquery": ["jquery/dist/jquery"],
        "bootstrap": ["bootstrap/dist/js/bootstrap"],
        "underscore": ["underscore/underscore"]
    }
});

/**
 * Created by uyunge on 15-4-7.
 */

define("number", ['underscore'], function (_) {

    function numToString(num, length) {
        return _(length - (num + '').length).times(function () {
                return "0"
            }).join("") + num + '';
    }

    function stringToNum(numberString) {
        return parseInt(numberString);
    }

    function Number(num) {
        this.numbers = _.map(numToString(num, Number.length).split(''), stringToNum);
    }

    Number.prototype.diff = function (num) {
        return _
            .map(_.zip(this.numbers, num.numbers), function (item) {
                return item[0] - item[1];
            })
            .map(function (item) {
                return item >= 0 ? item : item + 10;
            });
    };

    return function (length) {
        Number.length = length;
        return Number;
    };
});


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
            DURATION = opt["duration"] || 750;

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
                "background-position-y": "-=" + cell
            }, DURATION, doneCallBack);
        }


        function reSet(dom, number) {
            $(dom).css("background-position-y", BASE - HEIGHT * number);
        }


        function rendDomWithNumber(dom, diffNumber, number) {
            animate($(dom), HEIGHT * diffNumber, function () {
                var position = pxToNum($(this).css("background-position-y"));
                if (position <= LIMIT) {
                    reSet(this, number);
                }
            });
        }

        return {
            setNumber: function (number) {
                var diff = Number(number).diff(Number(init_number)),
                    numbers = _.map(toString(number).split(""), toNum);

                if (diff.length !== LENGTH) throw new Error("初始化数字长度与DOM长度不符合");

                _.forEach(_.zip($numbers, diff, numbers), function (item) {
                    var dom = item[0],
                        diffNumber = item[1];
                    rend(dom, diffNumber, item[2]);
                });
                init_number = number;
            }
        }
    }
});

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

        changeList.forEach(function (ele, index) {
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
    };

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
            window.location.href = makeUrl(url, name, email);
        });
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
            image: ".auto li div",
            init_number: "0000000",
            num_length: 7,
            duration: 1000
        });

    /**
     改变数字的配置信息
     */
    var transfer = mock,
        INTERVAL = 2500;
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
        var number = 1000000 + count * 200 + Math.round(Math.random() * 200);
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

    $.fn.bingo = function (status) {
        console.log('congratulations! you have got a painted eggshell~ we precisely hope you can join us!');
        transfer = status == 0 ? changeNumWithCustomerCount : mock;
    };

    setInterval(function () {
        transfer.call(this);
    }, INTERVAL);

});