'use strict';
innerApp.controller('WtFileUploadController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        $scope.loadingFiles = true;
        $scope.options = { url: e };
        $http.get(url).then(function (e) {
            $scope.loadingFiles = false;
            $scope.queue = e.data.files;
        }, function () {
            $scope.loadingFiles = false;
        });
    }
]);

innerApp.controller('FileDestroyController', [
    '$scope',
    '$http',
    function ($scope, $http) {
        var n, i = $scope.file;
        i.url && (i.$state = function () {
            return n;
        }, i.$destroy = function () {
            return n = 'pending', $http({
                url: kzi.config.box_url + i.delete_url,
                method: i.delete_type
            }).then(function () {
                n = 'resolved', $scope.clear(i);
            }, function () {
                n = 'rejected';
            });
        });
    }
]);