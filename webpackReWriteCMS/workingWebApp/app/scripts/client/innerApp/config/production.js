/**
 * Created by jaye on 15/11/23.
 */
export default (appModule) => {
    "use strict";
    appModule.config(($compileProvider, $httpProvider) => {
        /*less watchers from console debugging:
        * https://docs.angularjs.org/guide/production
        * */
        $compileProvider.debugInfoEnabled(false);
        /*
        * process multiple response @ same time:
        * https://docs.angularjs.org/api/ng/provider/$httpProvider
        * */
        $httpProvider.userApplyAsync(true);
    });
};