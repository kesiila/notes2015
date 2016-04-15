"use strict";
innerApp.controller("header_menu", ["$rootScope", "$scope", "$popbox",
    function (e, $scope, $popbox) {
        $scope.js_pop_new_menu = function (e) {
            $popbox.popbox({
                target: e,
                templateUrl: "/view/header/pop_new_menu.html",
                controller: ["$scope", "popbox",
                    function ($scope, popbox) {
                        $scope.popbox = popbox;
                        $scope.js_close = function () {
                            popbox.close()
                        }
                    }
                ]
            }).open()
        }
    }
]);

innerApp.controller("search_ctrl", ["$rootScope", "$scope", "$location", "$element", "$popbox", "$timeout",
    function ($rootScope, $scope, $location, $element, $popbox, $timeout) {
        var r = null,
            l = false;
        $scope.$watch("keywords", function (t) {
            return r && _.isEmpty(t) ? (r.close(), void 0) : (null !== t && (r ? $rootScope.$broadcast("change_search_keywords", t) : $timeout(function () {
                l = true, $element.find(".icon-search").click()
            }, 50)), void 0)
        }), $scope.js_keydown_search = function () {
            _.isEmpty($scope.keywords) || ($location.path("/search").search({
                keywords: $scope.keywords
            }), $scope.keywords = "")
        }, $scope.js_up_down_enter = function (i, n) {
            r || $scope.js_keydown_search(), $rootScope.$broadcast("search_key_up_down_enter", n)
        }, $scope.js_show_pop_search_result = function (i) {
            if (!_.isEmpty($scope.keywords)) {
                if (!l) return $scope.js_keydown_search(), void 0;
                l = false, $popbox.popbox({
                    target: i,
                    templateUrl: "/view/header/pop_search.html",
                    controller: ["$scope", "popbox", "pop_data", "$filter",
                        function (t, i, a, s) {
                            r = i, t.keywords = a.scope.keywords, t.popbox = i, t.current_index = -1, t.js_close = function () {
                                i.close()
                            };
                            var l = function () {
                                t.filter_projects = _.isEmpty(t.keywords) ? [] : s("filter")($rootScope.projects, {
                                    name: t.keywords
                                })
                            };
                            $timeout(function () {
                                l()
                            }), t.filter_projects = [], $rootScope.$on("change_search_keywords", function (e, i) {
                                t.keywords = i, l()
                            }), t.$on("search_key_up_down_enter", function (e, i) {
                                return 0 >= t.filter_projects.length ? (a.scope.js_keydown_search(), void 0) : (i === kzi.constant.keyASCIIs.VK_UP ? (t.current_index = t.current_index - 1, -2 >= t.current_index && (t.current_index = t.filter_projects.length - 1)) : i === kzi.constant.keyASCIIs.VK_DOWN ? (t.current_index = t.current_index + 1, t.current_index >= t.filter_projects.length && (t.current_index = -1)) : i === kzi.constant.keyASCIIs.ENTER && (t.current_index > -1 && t.filter_projects.length > t.current_index ? ($location.path("/project/" + t.filter_projects[t.current_index].pid).search({}), t.current_index = -1) : a.scope.js_keydown_search()), void 0)
                            }), t.js_to_search_result = function () {
                                $location.path("/search").search({
                                    keywords: t.keywords
                                }), t.keywords = "", a.scope.keywords = ""
                            }
                        }
                    ],
                    resolve: {
                        pop_data: function () {
                            return {
                                scope: $scope
                            }
                        }
                    }
                }).open().then(function () {
                    r = null
                })
            }
    }
    }
]);

innerApp.controller("new_feature_ctrl", ["$rootScope", "$element", "$popbox", "$timeout",
    function ($rootScope, $element, $popbox, $timeout) {
        $timeout(function () {
            $element.children().eq(0).trigger("mouseover")
        }, 3000);
        $rootScope.js_show_new_feature = function (e) {
            $popbox.popbox({
                target: e,
                templateUrl: "/view/common/pop_new_feature.html",
                controller: ["$scope", "popbox",
                    function (e, t) {
                        kzi.localData.set("wohoo_show_version", kzi.config.wohoo_show_version), e.popbox = t, e.js_close = function () {
                            t.close()
                        }
                    }
                ]
            }).open()
        }
    }
]);