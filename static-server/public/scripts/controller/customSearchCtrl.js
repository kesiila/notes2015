"use strict";
innerApp.controller('custom_search_ctrl',['$scope','$window',function($scope,$window){
    $scope.search_click=function(keywords){
        console.log(keywords);
        $window.open('http://58.123.102.10/#newwindow=1&q='+keywords);
    }
}])