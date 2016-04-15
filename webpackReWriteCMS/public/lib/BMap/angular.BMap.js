/**
 *  A directive which helps you easily show a baidu-map on your page.
 *
 *
 *  Usages:
 *
 *      <baidu-map options='options'></baidu-map>
 *
 *      options: The configurations for the map
 *            .center.longitude[Number]{M}: The longitude of the center point
 *            .center.latitude[Number]{M}: The latitude of the center point
 *            .zoom[Number]{O}:         Map's zoom level. This must be a number between 3 and 19
 *            .navCtrl[Boolean]{O}:     Whether to add a NavigationControl to the map
 *            .scaleCtrl[Boolean]{O}:   Whether to add a ScaleControl to the map
 *            .overviewCtrl[Boolean]{O}: Whether to add a OverviewMapControl to the map
 *            .enableScrollWheelZoom[Boolean]{O}: Whether to enableScrollWheelZoom to the map
 *            .city[String]{M}:         The city name which you want to display on the map
 *            .markers[Array]{O}:       An array of marker which will be added on the map
 *                   .longitude{M}:                The longitude of the marker
 *                   .latitude{M}:                 The latitude of the marker
 *                   .icon[String]{O}:             The icon's url for the marker
 *                   .width[Number]{O}:            The icon's width for the icon
 *                   .height[Number]{O}:           The icon's height for the icon
 *                   .title[String]{O}:            The title on the infowindow displayed once you click the marker
 *                   .content[String]{O}:          The content on the infowindow displayed once you click the marker
 *                   .enableMessage[Boolean]{O}:   Whether to enable the SMS feature for this marker window. This option only available when title/content are defined.
 *                   .clickCallBack[Function]{0};  Whether to add a callback after a click on the map;
 *
 *  @author     wuyugne
 *  @copyright  Aug 7, 2015
 *  @version    1.3.0
 *
 *  @author      Howard.Zuo
 *  @copyright   Jun 9, 2015
 *  @version     1.2.0
 *
 *  @author fenglin han
 *  @copyright 6/9/2015
 *  @version 1.1.1
 *
 *  Usages:
 *
 *  <baidu-map options='options' ></baidu-map>
 *  comments: An improvement that the map should update automatically while coordinates changes
 *
 *  @version 1.2.1
 *  comments: Accounding to 史魁杰's comments, markers' watcher should have set deep watch equal to true, and previous overlaies should be removed
 *
 */
(function(global, factory) {
    'use strict';

    if (typeof exports === 'object') {
        module.exports = factory(require('angular'));
    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else {
        factory(global.angular);
    }

}(window, function(angular) {
    'use strict';

    var checkMandatory = function(prop, desc) {
        if (!prop) {
            throw new Error(desc);
        }
    };

    var defaults = function(dest, src) {
        for (var key in src) {
            if (typeof dest[key] === 'undefined') {
                // console.log(dest[key])
                dest[key] = src[key];
            }
        }
    };

    var baiduMapAutoCompleteDir = function ($scope, map) {
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
                "input": "suggestId"
                , "location": map
            });

        ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G("searchResultPanel").innerHTML = str;
        });

        var myValue;
        ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            setPlace();
        });


        function G(id) {
            return document.getElementById(id);
        }

        function setPlace() {
            map.clearOverlays();    //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 18);
                map.addOverlay(new BMap.Marker(pp));    //添加标注
                $scope.$broadcast('BMap.reMarkPlace', {point:pp});
            }

            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
        }
    };

    var template_content = '<div id="r-result" style="margin-bottom: 10px"><span>待查询地址:</span><input type="text" id="suggestId" size="20" class ="form-control" ng-model = "options.address", value="百度" placeholder="请输入待查询地址的名称" style="width:300px;" /></div>' +
        '<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div>';

    var baiduMapDir = function() {
        // Return configured, directive instance
        return {
            restrict: 'E',
            scope: {
                'options': '='
            },
            link: function($scope, element, attrs) {
                var defaultOpts = {
                    navCtrl: true,
                    scaleCtrl: true,
                    overviewCtrl: true,
                    enableScrollWheelZoom: true,
                    zoom: 10
                };
                var opts = $scope.options;

                defaults(opts, defaultOpts);

                checkMandatory(opts.center, 'options.center must be set');
                checkMandatory(opts.center.longitude, 'options.center.longitude must be set');
                checkMandatory(opts.center.latitude, 'options.center.latitude must be set');
                checkMandatory(opts.city, 'options.city must be set');

                // create map instance
                var target =  element.find("#angular_BMap_baiduMap")[0];
                var map = new BMap.Map(target);
                baiduMapAutoCompleteDir($scope, map);

                //default click handle
                var clickMapHandler = function (clickCallBack) {
                    return function (e) {
                        $scope.options.center.longitude = e.point.lng;
                        $scope.options.center.latitude = e.point.lat;

                        //move the icon to the point where clicking happens
                        $scope.options.markers[0].longitude = e.point.lng;
                        $scope.options.markers[0].latitude = e.point.lat;
                        $scope.$apply();
                        clickCallBack(e);
                    }
                };

                // init map, set central location and zoom level
                map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);
                if (opts.navCtrl) {
                    // add navigation control
                    map.addControl(new BMap.NavigationControl());
                }
                if (opts.scaleCtrl) {
                    // add scale control
                    map.addControl(new BMap.ScaleControl());
                }
                if (opts.overviewCtrl) {
                    //add overview map control
                    map.addControl(new BMap.OverviewMapControl());
                }
                if (opts.enableScrollWheelZoom) {
                    //enable scroll wheel zoom
                    map.enableScrollWheelZoom();
                }
                if(opts.clickCallBack) {
                    map.addEventListener('click', clickMapHandler(opts.clickCallBack));
                }
                // set the city name
                map.setCurrentCity(opts.city);

                if (!opts.markers) {
                    return;
                }
                //create markers

                var previousMarkers = [];

                var openInfoWindow = function(infoWin) {
                    return function() {
                        this.openInfoWindow(infoWin);
                    };
                };

                var mark = function() {

                    var i = 0;

                    for (i = 0; i < previousMarkers.length; i++) {
                        previousMarkers[i].removeEventListener('click', openInfoWindow(infoWindow2));
                        map.removeOverlay(previousMarkers[i]);
                    }
                    previousMarkers.length = 0;

                    for (i = 0; i < opts.markers.length; i++) {
                        var marker = opts.markers[i];
                        var pt = new BMap.Point(marker.longitude, marker.latitude);
                        var marker2;
                        if (marker.icon) {
                            var icon = new BMap.Icon(marker.icon, new BMap.Size(marker.width, marker.height));
                            marker2 = new BMap.Marker(pt, {
                                icon: icon
                            });
                        } else {
                            marker2 = new BMap.Marker(pt);
                        }

                        // add marker to the map
                        map.addOverlay(marker2);
                        previousMarkers.push(marker2);

                        if (!marker.title && !marker.content) {
                            return;
                        }
                        var infoWindow2 = new BMap.InfoWindow('<p>' + (marker.title ? marker.title : '') + '</p><p>' + (marker.content ? marker.content : '') + '</p>', {
                            enableMessage: !!marker.enableMessage
                        });
                        marker2.addEventListener('click', openInfoWindow(infoWindow2));
                    }
                };

                mark();

                $scope.$watch('options.center', function(newValue, oldValue) {

                    opts = $scope.options;
                    map.centerAndZoom(new BMap.Point(opts.center.longitude, opts.center.latitude), opts.zoom);
                    mark();

                }, true);

                $scope.$on("BMap.reMarkPlace", function (event, info) {
                    clickMapHandler(opts.clickCallBack)(info);
                });

                $scope.$watch('options.markers', function(newValue, oldValue) {
                    mark();
                }, true);

            },
            template: template_content + '<div id="angular_BMap_baiduMap" style="width: 100%; height: 100%; boarder: 1px solid #ddd;"></div>'
        };
    };
    var baiduMap = angular.module('baiduMap', []);
    baiduMap.directive('baiduMap', [baiduMapDir]);
    baiduMap.factory('baiduMapService', [function () {
        var longitude = 121.481089;
        var latitude = 31.235457;
        var OPTION = {
            center: {
                longitude: longitude,
                latitude: latitude
            },
            zoom: 16,
            city: 'ShangHai',
            markers: [{
                longitude: longitude,
                latitude: latitude,
                icon: 'img/mappiont.png',
                width: 49,
                height: 60,
                title: 'Where',
                content: 'Put description here'
            }],
            navCtrl: true,
            overviewCtrl: true,
            scaleCtrl: true,
            address:  '', /* default addresss */
            clickCallBack: function () {}  /* click event call back */
        };

        function isPoiInfo(poi){
            return poi && "".indexOf.call(poi,",") > -1
        }

        function poiToLng(poi) {
            return isPoiInfo(poi) ? "".split.call(poi, ",")[0] * 1 : longitude;
        }
        function poiToLat(poi) {
            return isPoiInfo(poi) ? "".split.call(poi, ",")[1] * 1 : longitude;
        }
        function makePoi(event) {
            if(!_.isEmpty(event)) {
                return [event.point.lng, ',', event.point.lat].join('');
            }
        }
        return {
            default_options : OPTION,
            poiToLng: poiToLng,
            poiToLat: poiToLat,
            makePoi: makePoi
        }
    }]);
}));
