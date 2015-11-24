"use strict";
innerApp.controller('testCtrl', ['$scope', '$http', '$window', '$rootScope', function ($scope, $http, $window, $rootScope) {
    $scope.save = function () {
            wt.data.template.add(projectsInfo.defaultPid, "01", $scope.autoTitle, "0100", "开发", "", "", $scope.edit_template__title,$scope.edit_template__content,[],
            function (res) {
                var templateId = res.data.template_id;
                if ($scope.isUsedMost == true) {
                    wt.data.user.update_defualt_template(templateId, function (res) {
                        $window.sessionStorage.defaultTemplate = res.data.defaultTemplate
                    }, function () {
                    }, function () {
                    });
                }
                ;
                $rootScope.$broadcast('send_mail_page__add_new_template_success', {
                    new_template: res.data
                })
            },
            function () {
                debugger
            },
            function () {
                $scope.is_save_ing = false;
                $modal.open({
                    templateUrl: '/view/modal/pop_and_complete_generator_end.html',
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.close()
                        }
                    }]
                })
            })
    };

    $scope.showCurrentContent = function () {
        console.log($scope.edit_template__content);
    }

    $scope.anotherValue = function () {
       $scope.edit_template__content += "----其他的信息";
    }

    $scope.edit_template__content = "默认信息";

    var longitude = 121.506191;
    var latitude = 31.245554;
    $scope.mapOptions = {
        center: {
            longitude: longitude,
            latitude: latitude
        },
        zoom: 17,
        city: 'BeiJing',
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
        clickCallBack: function (event) {
            console.log(event);
        }
    };
}]);

