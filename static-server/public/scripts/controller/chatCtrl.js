/**
 * Created by czhang on 2014/10/30.
 */
"use strict";
innerApp.controller('chatCtrl', ['$scope', 'stompService', function ($scope, stompService) {
    $scope.price = 1;
    $scope.open = function () {
        stompService.connect({}, function (res) {
            console.log(res);
        });

        stompService.subscribe('/topic/price', function (msg) {
            console.log(msg.body);
            $scope.price = msg.body;
            $scope.$apply();
        })
    };

    $scope.send = function () {
        stompService.send("app/topic/hello", {}, "hello world!");
    };

    $scope.close = function () {

    };
}]);