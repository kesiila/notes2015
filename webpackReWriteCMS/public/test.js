innerApp.controller('item_activity_ctrl', [
    '$scope',
    function ($scope) {
        var i = null, n = null;
        $scope.tpl_prefix = 'item_';
        var a = 0, s = function (e) {
                $scope.loading_activity = true, wt.data.activity.get_for_item(n, i, a, kzi.config.default_count, function (t) {
                    t.data.length > 0 && (a = t.data[t.data.length - 1].published), angular.isFunction(e) && e(t.data);
                }, null, function () {
                    $scope.loading_activity = false;
                });
            };
        $scope.js_load_more = function () {
            wt.utility.activity.load_activities(s, $scope);
        }, $scope.$on(kzi.constant.event_names.reload_item_activities, function (e, o) {
            a = 0, n = o.xtype, i = o.xid, $scope.activities = null, wt.utility.activity.load_activities(s, $scope);
        });
    }
]);