/**
 * Created by wuyunge on 2014/10/4.
 */
angular.module('wt.tagCloud', [])
    .directive('wtTagCloudBlock', ["$timeout", "$parse", function ($timeout, $parse) {
        return {
            restrict: "E",
            /*        scope: {
             tags: '=',
             tagclicked: '&'
             },*/
            templateUrl: "/view/directive/tagcloudblock.html",
            link: function (scope, element, attrs) {
                scope.tags = [
                    {text: "java", value: 73},
                    {text: "python", value: 30},
                    {text: "go", value: 500},
                    {text: "html", value: 5},
                    {text: "汽车", value: 60},
                    {text: "面包", value: 7},
                    {text: "月亮", value: 80},
                    {text: "海王星", value: 80},
                    {text: "伽利略", value: 80},
                    {text: "大航海", value: 80},
                    {text: "哥伦布", value: 80},
                    {text: "棒呆", value: 1000},
                    {text: "上海", value: 80},
                    {text: "长城", value: 80},
                    {text: "珠穆朗玛峰", value: 10000},
                    {text: "英吉利海峡", value: 200000},
                    {text: "泰晤士海", value: 500},
                    {text: "疑是银河落九天", value: 1500},
                    {text: "栀子花", value: 500},
                    {text: "铁扇公主", value: 3500},
                    {text: "java", value: 73},
                    {text: "python", value: 30},
                    {text: "go", value: 500},
                    {text: "html", value: 5},
                    {text: "汽车", value: 60},
                    {text: "面包", value: 7},
                    {text: "月亮", value: 80},
                    {text: "海王星", value: 80},
                    {text: "伽利略", value: 80},
                    {text: "大航海", value: 80},
                    {text: "哥伦布", value: 80},
                    {text: "棒呆", value: 1000},
                    {text: "上海", value: 80},
                    {text: "长城", value: 80},
                    {text: "珠穆朗玛峰", value: 10000},
                    {text: "英吉利海峡", value: 200000},
                    {text: "泰晤士海", value: 500},
                    {text: "疑是银河落九天", value: 1500},
                    {text: "栀子花", value: 500},
                    {text: "铁扇公主", value: 3500}
                ];
                $.fn.setTopLeft = function (Array) {
                    var top = Array[0];
                    var left = Array[1];
                    var style = ["top:", top, "px; ", "left:", left, "px; "].join("");
                    this.attr('style', style);
                    return this;
                };
                function setPosition(m, n) {
                    var Array = [];
                    Array[0] = (m - 1) * 32;
                    Array[1] = (n - 1) * 106;
                    return Array;
                }

                function getRandom(start, end) {
                    return Math.floor(Math.random() * (end - start + 1) + start);
                }

                function getRandomPositionFactory(m, n) {
                    var usedPosition = [];
                    return function (type) {
                        var position = [];
                        switch (type) {
                            case 1 :
                                do {
                                    position = [getRandom(1, m), getRandom(1, n)];
                                } while (transform(usedPosition).indexOf(position.toString()) > -1)
                                usedPosition.push(position);
                                return position;
                                break;
                            case 2 :
                                do {
                                    position = [getRandom(2, m - 1), getRandom(1, n - 1)];
                                } while (transform(usedPosition).indexOf(position.toString()) > -1 ||
                                    transform(usedPosition).indexOf([position[0] + 1, position[1]].toString()) > -1);
                                usedPosition.push(position);
                                usedPosition.push([position[0] + 1, position[1]])
                                return position;
                                break;
                            case 3 :
                                do {
                                    position = [getRandom(2, m - 1), getRandom(1, n - 1)];
                                } while (transform(usedPosition).indexOf(position.toString()) > -1 ||
                                    transform(usedPosition).indexOf([position[0] + 1, position[1]].toString()) > -1 ||
                                    transform(usedPosition).indexOf([position[0], position[1] + 1].toString()) > -1 ||
                                    transform(usedPosition).indexOf([position[0] + 1, position[1] + 1].toString()) > -1)
                                usedPosition.push(position);
                                usedPosition.push([position[0] + 1, position[1]]);
                                usedPosition.push([position[0], position[1] + 1]);
                                usedPosition.push([position[0] + 1, position[1] + 1]);
                                return position;
                                break;
                            default :
                                break;
                        }
                    }
                }

                var a = getRandomPositionFactory(10, 6);

                function generatePositionArray(type, size) {
                    var array = []
                    while (size > 0) {
                        size--;
                        array.push(a(type));
                    }
                    return array;
                }

                /* var bArray = [
                 [1,3],
                 [2,5],
                 [5,2],
                 [8,5]
                 ],
                 mArray =[
                 [3,1],
                 [7,1],
                 [2,2],
                 [8,3],
                 [3,4],
                 [7,4],
                 [5,5],
                 [6,6]
                 ],*/
                function transform(array) {
                    var t = [];
                    _.each(array, function (item) {
                        t.push(item.toString());
                    })
                    return t;
                }

                function transformBack(array) {
                    var t = [];
                    _.each(array, function (item) {
                        var a = item.split(",");
                        t.push([ parseInt(a[0]), parseInt(a[1]) ])
                    });
                    return t;
                }

                //生成初始的棋盘-- m : y; n: x;
                function generateBroad(m, n) {
                    var array = [],
                        sum = m * n;
                    for (var i = 0; i < sum; i++) {
                        var x = ( (i + 1 + n) % n == 0 ) ? n : (i + 1 + n) % n ,
                            y = Math.ceil((i + 1) / n);
                        array[i] = [y, x];
                    }
                    return array;
                }

                //初始位置
                var usedPosition = [],
                    bArray = generatePositionArray(3, 4),//生成4个最大的块（类型为3）
                    mArray = generatePositionArray(2, 8),//生成8个次大的块(类型为2)
                    lArray = [];
                scope.begin = function () {
                    var $tags = $('#hometag').find('a');
                    for (var i = 0; i < $tags.length; i++) {
                        if (i < 4) {
                            var y = bArray[i][0],
                                x = bArray[i][1];
                            $($tags[i]).setTopLeft(setPosition(y, x))
                                .addClass("block1");
                            usedPosition.push([y, x]);
                            usedPosition.push([y, x + 1]);
                            usedPosition.push([y + 1, x]);
                            usedPosition.push([y + 1, x + 1]);
                        } else if (i < 12) {
                            var y = mArray[i - 4][0],
                                x = mArray[i - 4][1]
                            $($tags[i]).setTopLeft(setPosition(y, x))
                                .addClass("block2 block2_10");
                            usedPosition.push([y, x]);
                            usedPosition.push([y + 1, x]);
                            if (i === 11) {
                                lArray = transformBack(_.difference(transform(generateBroad(10, 6)), transform(usedPosition)));
                            }
                        } else {
                            var y = lArray[i - 12][0],
                                x = lArray[i - 12][1]
                            $($tags[i]).setTopLeft(setPosition(y, x))
                                .addClass("block3");
                        }
                    }
                };
                $timeout(function () {
                    scope.begin()
                }, 0);
                //测试defer用法
                /*                var $q = angular.element(document).injector().get("$q");
                 var deferred = $q.defer();
                 function hello(def, name){
                 $timeout(function(){
                 def.resolve(name);
                 def.reject("拒绝");
                 def.notify("错误");
                 },3000)
                 }
                 deferred.promise.then(
                 function(data){console.log("success: "+data)},
                 function(data){console.log("reject: "+data)},
                 function(data){console.log("error:"+data)});
                 scope.click = function () {
                 hello(deferred,"angular");
                 }*/
            }
        }
    }]
).directive("wtTagCloud", [function () {
        'use strict';
        return {
            restrict: 'AE',
            templateUrl: '/view/directive/tagcloudlist.html',
            link: function (scope, ele, attr) {
                //测试数据--应该是热度有序的数据
                scope.responseTags = [
                    {name: "java", value: 200000},
                    {name: "python", value: 30},
                    {name: "汽车", value: 60},
                    {name: "面包", value: 7},
                    {name: "月亮", value: 80},
                    {name: "海王星", value: 80},
                    {name: "伽利略", value: 80},
                    {name: "大航海", value: 80},
                    {name: "哥伦布", value: 80},
                    {name: "棒呆", value: 1000},
                    {name: "上海", value: 80},
                    {name: "长城", value: 80},
                    {name: "珠穆朗玛峰", value: 10000},
                    {name: "英吉利海峡", value: 200000},
                    {name: "go", value: 500},
                    {name: "html", value: 5},
                    {name: "泰晤士海", value: 500},
                    {name: "疑是银河落九天", value: 1500},
                    {name: "栀子花", value: 500},
                    {name: "铁扇公主", value: 3500},
                    {name: "java", value: 73},
                    {name: "python", value: 30},
                    {name: "go", value: 500},
                    {name: "html", value: 5},
                    {name: "唐", value: 60},
                    {name: "宋", value: 7},
                    {name: "月亮", value: 80},
                    {name: "元", value: 80},
                    {name: "明", value: 80},
                    {name: "清", value: 80},
                    {name: "哥伦布", value: 80},
                    {name: "棒呆", value: 1000},
                    {name: "上海", value: 80},
                    {name: "长城", value: 80},
                    {name: "珠穆朗玛峰", value: 10000},
                    {name: "英吉利海峡", value: 200000},
                    {name: "泰晤士海", value: 500},
                    {name: "疑是银河落九天", value: 1500},
                    {name: "栀子花", value: 500},
                    {name: "铁扇公主", value: 5}
                ];
                var count = 0;
                //添加对应的类名
                scope.tags = _.sortBy(_.map(scope.responseTags, function (tag) {
                    //用count模拟索引值，通过对索引值取对数来得到类名
                    // size0，size1，size2
                    count++;
                    var num = Math.floor(Math.log(count) / Math.log(4)) + 1;
                    var size = "size" + num;
                    return _.extend(tag, {size: size});
                }), function (item) {
                    return item.name;
                });
            }
        }
    }]
).directive("wtTagCloudList", [function () {
        'use strict';
        return {
            restrict: 'AE',
            scope: {
                tagclick: "&"
            },
            templateUrl: '/view/directive/tagcloudlist.html',
            link: function (scope, ele, attr) {
                ele.hide();
                var type;
                switch (attr.xtype) {
                    case "customer" :
                        type = 0;
                        break;
                    case "template" :
                        type = 1;
                        break;
                    case "post" :
                        type = 2;
                        break;
                    default :
                        //FIXME 上线时应该去掉
                        //没有传值时在这里中断
                        debugger;
                        break;
                }
                scope.vm = {};
                scope.vm.current_tab = 'cloud';
                wt.data.tags.getHot(type, 200, function (res) {
                    scope.vm.data = _.clone(res.data);
                    if (res.code == 200 && res.data.length > 0) {
                        scope.vm.allTags = transform(res.data);
                        ele.show();
                        scope.vm.tags = _.pluck(scope.vm.allTags, 'name');
                        scope.tags = scope.vm.allTags.slice(0, 50);
                    }
                    ;
                })
                scope.vm.showList = function (type) {
                    if (!type) {
                        throw "unknow type:" + type + "in tagCloud.js";
                    }
                    if (_.isEqual(scope.vm.current_tab, type)) {
                        return false;
                    }
                    scope.vm.current_tab = type;
                }
                /*                vm.searchTag = function (name) {
                 scope.tagclick(scope,{tagName:name})
                 vm.tagName = name;
                 }*/
                var transform = function (source) {
                    var count = 0;
                    //添加对应的类名
                    return _.sortBy(_.map(source, function (tag) {
                        //用count模拟索引值，通过对索引值取对数来得到类名
                        // size0，size1，size2
                        count++;
                        var num = Math.floor(Math.log(count) / Math.log(4)) + 1;
                        var size = "size" + num;
                        return _.extend(tag, {size: size});
                    }), function (item) {
                        return item.name;
                    });
                }
            }
        }
    }]).directive("wtTooltip", [function () {
        'use strict';
        return {
            restrict: "AE",
            templateUrl: "/view/directive/guideBox.html",
            transclude: 'element',
            scope: true,
            link: function (scope, ele, attr) {
                var msg = attr.content, //内容
                    pos = attr.placement, //位置
                    $close = ele.parent().find(".icon-close"), //关闭按钮
                    $tooltip = ele.find(".tooltip"), // 提示框
                    $tooltipInner = ele.find(".tooltip-inner"); //提示框的内容
                if (msg) {
                    $tooltipInner.text(msg);
                }

                if (pos) {
                    $tooltip.removeClass('right top left bottom').addClass(pos);
                    setFloatPos(ele.find("[ng-transclude]").children(), $tooltip, $close, pos);
                }

                /*
                 * 设置浮动元素和关闭按钮的位置
                 * @param source fixed   固定元素
                 * @param dest   floated 浮动的元素
                 * @param pos
                 */
                function setFloatPos(fixed, floated, $close, pos) {
                    var height = fixed.outerHeight(),
                        width = fixed.outerWidth(),
                        left = fixed.position().left,
                        top = fixed.position().top,
                        destHeight = floated.height(),
                        destWidth = floated.find(".tooltip-inner").width(),
                        destOuterHeight = floated.outerHeight(),
                        destOuterWidth = floated.find(".tooltip-inner").outerWidth(),
                        destTop,
                        destLeft;
                    var close = {
                        top: '',
                        right: ''
                    }
                    //修正值
                    var fixTLB = 2;

                    pos = pos || 'top';

                    switch (pos) {
                        case 'top' :
                            destTop = top - destOuterHeight + fixTLB;
                            destLeft = left + width / 2 - destOuterWidth / 2 + fixTLB;
                            close.top = 10;
                            close.right = 5;
                            break;
                        case 'bottom' :
                            destTop = top + height - fixTLB;
                            destLeft = left + width / 2 - destOuterWidth / 2 + fixTLB;
                            close.top = 10;
                            close.right = 5;
                            break;
                        case 'right' :
                            destTop = top + height / 2 - destOuterHeight / 2;
                            destLeft = left + width - fixTLB;
                            close.top = 5;
                            close.right = 10;
                            break;
                        case 'left' :
                            destTop = top + height / 2 - destOuterHeight / 2;
                            destLeft = left - destOuterWidth - 10 + fixTLB;
                            close.top = 5;
                            close.right = 10;
                            break;
                        default :
                            break;
                    }
                    $close.attr('style', 'top:' + close.top + 'px; right:' + close.right + "px;" + " color: #fff;");
                    floated.attr('style', 'top:' + destTop + 'px; left:' + destLeft + "px;");
                }

                /*                $close.bind('click', function () {
                 $tooltip.hide();
                 });*/
            }
        }
    }]
)
    .directive('wtGuideTrigger', ["$timeout", function ($timeout) {
        return {
            restrict: 'AE',
            replace: true,
            link: function (scope, ele, attr) {
                //提示 是否已经全部隐藏的标识符
                var hasHiddenAll = false;

                var position1 = {};
                var position2 = {};

                position2 = getPosition(ele[0], {left: 0, top: 0}, 0);

                function getPosition(element, position, count) {
                    var position1 = {left: 0, top: 0};
                    if (count == 0) {
                        console.log(element)
                    }
                    console.log(count + "---left " + position.left + "  top " + position.top)
                    if (element == null || element.tagName == "BODY") {
                        console.log(position)
                        return position;
                    } else {
                        position1.left = position.left - element.offsetLeft;
                        position1.top = position.top - element.offsetTop;
                        return getPosition(element.offsetParent, position1, ++count)
                    }
                }

                ele.bind('click', function () {
                    //点击事件的判断
                    var $target = $('.guide-box .tooltip');
                    //如果所有的提示已经隐藏，重新显示所有的提示。
                    if (hasHiddenAll) {
                        $target.removeClass('guide-close').addClass('guide-open');
                        ele.removeClass('hint-off').addClass('hint-open');
                        hasHiddenAll = false;
                    } else {
                        //隐藏全部提示，并在原来位置创建一个隐藏的提示。
                        $target.each(function () {
                            var $self = $(this).clone();
                            var $parent = $(this).parent(),
                                animate1 = false,
                                animate2 = false;

                            /*                            getleft : source  -> position -> positon

                             */

                            if ($(this).hasClass('guide-open')) {

                                var position1 = getPosition(this.offsetParent, {left: 0, top: 0}, 0);

                                $self.removeClass('guide-open')
                                    .addClass('guide-close')

                                var options = {
                                    left: position1.left - position2.left,
                                    top: position1.top - position2.top
                                };
                                $(this).stop(false, true)
                                    .animate(options, {
                                        queue: false,
                                        duration: 1000,
                                        complete: function () {
                                            animate2 = true;
                                            if (animate1 && animate2) {
                                                $(this).remove();
                                                $self.appendTo($parent);
                                                animate2 = false;
                                                hasHiddenAll = true;
                                                ele.removeClass('hint-open').addClass('hint-off');
                                            }
                                        }
                                    })
                                    .animate({
                                        opacity: 0
                                    }, {
                                        queue: false,
                                        duration: 950,
                                        complete: function () {
                                            animate1 = true;
                                            if (animate1 && animate2) {
                                                $(this).remove();
                                                $self.appendTo($parent);
                                                animate1 = false;
                                                hasHiddenAll = true;
                                                ele.removeClass('hint-open').addClass('hint-off');
                                            }
                                        }
                                    });
                            }
                        });
                    }
                });
                var guidBoxNum = $('.guide-box .guide-open').length;
                var count = 0;
                //稍后为单个关闭按钮绑定事件，以免绑定时指令内容还未渲染出来
                $timeout(function () {
                    $('.guide-box').bind('click', function (event) {
                        if ($(event.target).hasClass('icon-close')) {
                            var $target = $(this).children('.tooltip'),
                                $self = $target.clone(),
                                $parent = $target.parent(),
                                animate1 = false,
                                animate2 = false;
                            if ($target.hasClass('guide-open')) {
                                var position1 = getPosition(this, {left: 0, top: 0}, 0);
                                $self.removeClass('guide-open')
                                    .addClass('guide-close');

                                //移动动画
                                $target.animate({
                                    left: position2.left - position1.left - 10,
                                    top: position2.top - position1.top - 10
                                }, {
                                    queue: false,
                                    duration: 1000,
                                    complete: function () {
                                        animate2 = true;
                                        if (animate1 && animate2) {
                                            $(this).remove();
                                            $self.appendTo($parent);
                                            animate2 = false;
                                        }
                                    }
                                })
                                    .animate({
                                        opacity: 0
                                    }, {
                                        queue: false,
                                        duration: 950,
                                        complete: function () {
                                            animate1 = true;
                                            if (animate1 && animate2) {
                                                $(this).remove();
                                                $self.appendTo($parent);
                                                animate1 = false;
                                            }
                                        }
                                    });
                            }
                        }
                        ;
                        if (++count === guidBoxNum) {
                            hasHiddenAll = true;
                            count = 0;
                        }
                    })
                }, 1500)
            }
        }
    }])
    .
    directive('guideCtrl', ['$scope', function ($scope) {
        return {
            controller: function () {
            }
        }
    }]).directive("wtProductTags", ["$rootScope", function ($rootScope) {
        "use strict";
        return {
            restrict: "AE",
            scope: {
                code: "=mainCode",
                tagClick: "&"
            },
            templateUrl: "/view/directive/tags_product.html",
            link: function (scope, element, attrs) {

                scope.showMore = function () {
                    scope.hasMore = !scope.hasMore;
                    if (scope.hasMore) {
                        $rootScope.$broadcast('product_show_more', {
                            flag: true,
                            tags: scope.moreTags
                        });
                    } else {
                        $rootScope.$broadcast('product_show_more', {
                            flag: false,
                            tags: scope.moreTags
                        });
                    }

                };

                scope.$watch(function () {
                    return scope.code;
                }, function (newValue, oldValue) {
                    element.hide();
                    if (!newValue) {
                        wt.data.tags.getHotByCode(11, 3000, newValue, function (res) {
                            if (res.code == 200 && res.data.length > 0) {
                                var tags = res.data;
                                element.show();
                                scope.tags = tags.slice(0, 30);
                                scope.moreTags = tags.slice(30);
                            } else {
                                //  kzi.msg.error("暂时没有标签数据", function () {
                                //  })
                            }
                        })
                    }
                });
            }
        }
    }])