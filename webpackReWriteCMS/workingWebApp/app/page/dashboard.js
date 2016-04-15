/**
 * Created by yunge on 15/11/23.
 */
"use strict";
/**-------------------------------------------------------------------------**/
// load Angular
//require('./vendor')(); // run an empty function

/* Styles */
loadCss();

/* JS */
loadLib();

/**-------------------------------------------------------------------------**/

// load the main app file
var appModule = require('../index');
//var MODE = require('../scripts/client/innerApp/config/env.js')();

//if (MODE.production) {
//    require('../scripts/client/innerApp/config/production.js')(appModule);
//}

//replaces ng-app="appName"

angular.element(document).ready(function () {
    angular.bootstrap(document, [appModule.name], {
        //strictDi: true
    });
});
/**
 * load css depended
 */
function loadCss() {
    require('../index.scss');
    //require('../../../public/css/base_common.css');
    require('../../node_modules/mdi/css/materialdesignicons.min.css');
}

/**
 * load third library depended
 */
function loadLib() {
    /* JS */
    global.$ = global.jQuery = require('jquery');
    require('velocity-animate');

    global.moment = require('moment'); //lumx user a global 'moment'
    require('angular');
    require('node-lumx');

    require('md5');
    loadJquery();
}

function loadJquery() {
    require('jquery-ui');
    require('bootstrap');
    //require('../../../public/lib/jquery/jquery.notify.js');
    //require('../../../public/lib/jquery/jquery.selection.js');
    //require('../../../public/lib/jquery/jquery.gollum.js');
    //
    //
    //require('../../../public/lib/jquery/jquery.fullcalendar.js');
    //require('../../../public/lib/jquery/jquery.mousewheel.js');
    //require('../../../public/lib/jquery/jquery.mCustomScrollbar.js');
    //require('../../../public/lib/jquery/jquery.caret.js');
    //require('../../../public/lib/jquery/jquery.atwho.js');
    //require('../../../public/lib/jquery/jquery.jcrop.js');
    //require('../../../public/lib/jquery/jquery.hotkeys.js');
    //require('../../../public/lib/jquery/jquery.select2.js');
    //require('../../../public/lib/jquery/markdown.min.js');
    //require('../../../public/lib/loadImage/loadimage.js');
    //require('../../../public/lib/loadImage/loadimage.meta.js');
    //require('../../../public/lib/loadImage/loadimage.exif.js');
    //require('../../../public/lib/loadImage/loadimage.exif.map.js');
    //require('../../../public/lib/loadImage/loadimage.orientation.js');
    //require('../../../public/lib/loadImage/loadimage.ios.js');
    //require('../../../public/lib/fileupload/jquery.fileupload.js');
    //require('../../../public/lib/fileupload/jquery.fileupload.process.js');
    //require('../../../public/lib/fileupload/jquery.fileupload.validate.js');
    //require('../../../public/lib/fileupload/jquery.fileupload.image.js');
    //require('../../../public/lib/fileupload/jquery.fileupload.audio.js');
    //require('../../../public/lib/fileupload/jquery.fileupload.video.js');
    //require('../../../public/lib/fileupload/jquery.fileupload.ui.js');
    //require('../../../public/lib/fancybox/jquery.fancybox.js');
    //require('../../../public/lib/fancybox/jquery.fancybox.buttons.js');
    //require('../../../public/lib/fancybox/jquery.fancybox.media.js');
    //require('../../../public/lib/fancybox/jquery.fancybox.thumbs.js');
    //require('../../../public/lib/angular/angular.resource.js');
    //require('../../../public/lib/angular/angular.sanitize.js');
    //require('../../../public/lib/angular/animate.js');
    //require('../../../public/lib/angular/angular-strap.js');
    //require('../../../public/lib/angular/angular-strap.tpl.js');
    //require('../../../public/lib/angular/angular.ui.utils.js');
    //require('../../../public/lib/angular/angular.ui.bootstrap.js');
    //require('../../../public/lib/angular/angular.ui.date.js');
    //require('../../../public/lib/angular/angular.ui.calendar.js');
    //require('../../../public/lib/angular/angular.ui.popbox.js');
    //require('../../../public/lib/angular/angular.fileupload.js');
    //require('../../../public/lib/angular/angular.ui.select2.js');
    //require('../../../public/lib/sanitize/sanitize.js');
    //require('../../../public/lib/sanitize/sanitize.basic.js');
    //require('../../../public/lib/sanitize/sanitize.relaxed.js');
    //require('../../../public/lib/sanitize/sanitize.restricted.js');
    //require('../../../public/lib/underscore.js');
    //require('../../../public/lib/socket.io.js');
    //require('../../../public/lib/marked.js');
    //require('../../../public/lib/heyoffline.js');
    //require('../../../public/lib/ichart.js');
    //require('../../../public/lib/xss.js');
    //require('../../../public/scripts/kzi.js');
    //require('../../../public/scripts/kzi.status.js');
    //require('../../../public/scripts/kzi.constant.js');
    //require('../../../public/scripts/analysis.js');
    //require('../../../public/scripts/service.js');
    //require('../../../public/scripts/bus.js');
    //require('../../../public/scripts/filter.js');
    //require('../../../public/scripts/directive.js');
    //require('../../../public/scripts/modules/newEditor.js');
    //require('../../../public/scripts/outerApp.js');
    //require('../../../public/scripts/outerApp/customerCtrl.js');
    //require('../../../public/scripts/outerApp/templateCtrl.js');
    //require('../../../public/scripts/outerApp/postCtrl.js');
    //require('../../../public/scripts/controller/prj/prjMemberCtrl.js');
    //require('../../../public/scripts/controller/head/headerCtrl.js');
    //require('../../../public/scripts/controller/fileupload/fileuploadCtrl.js');
    //require('../../../public/scripts/controller/team/teamCtrl.js');
    //require('../../../public/scripts/controller/team/teamAdminCtrl.js');
    //require('../../../public/scripts/controller/project/projectCtrl.js');
    //require('../../../public/scripts/controller/project/projectEventCtrl.js');
    //require('../../../public/scripts/controller/project/projectGraphCtrl.js');
    //require('../../../public/scripts/controller/project/projectFileListCtrl.js');
    //require('../../../public/scripts/controller/project/projectPageCtrl.js');
    //require('../../../public/scripts/controller/project/projectPostCtrl.js');
    //require('../../../public/scripts/controller/project/projectTemplateCtrl.js');
    //require('../../../public/scripts/controller/project/projectMailCtrl.js');
    //require('../../../public/scripts/controller/project/projectChatsCtrl.js');
    //require('../../../public/scripts/controller/project/projectTrashCtrl.js');
    //require('../../../public/scripts/controller/project/projectSettingCtrl.js');
    //require('../../../public/scripts/controller/calendar/calendarCtrl.js');
    //require('../../../public/scripts/controller/activity/activityCtrl.js');
    //require('../../../public/scripts/controller/invite/inviteCtrl.js');
    //require('../../../public/scripts/controller/prj/prjMemberCtrl.js');
    //require('../../../public/scripts/controller/mail/InMailCtrl.js');
    //require('../../../public/scripts/controller/account/accountCtrl.js');
    //require('../../../public/scripts/controller/dashboard/dashboardCtrl.js');
    //require('../../../public/scripts/controller/browse/browseCtrl.js');
    //require('../../../public/scripts/controller/dashboard/dashboardTasksCtrl.js');
    //require('../../../public/scripts/controller/dashboard/dashboardMailCtrl.js');
    //require('../../../public/scripts/controller/dashboard/mailboxCtrl.js');
    //require('../../../public/scripts/controller/event/eventCtrl.js');
    //require('../../../public/scripts/controller/post/postCtrl.js');
    //require('../../../public/scripts/controller/template/templateCtrl.js');
    //require('../../../public/scripts/controller/reward/rewardCtrl.js');
    //require('../../../public/scripts/controller/file/fileCtrl.js');
    //require('../../../public/scripts/controller/page/pageCtrl.js');
    //require('../../../public/scripts/controller/mail/entityMailCtrl.js');
    //require('../../../public/scripts/controller/comment/commentCtrl.js');
    //require('../../../public/scripts/controller/taskCtrl.js');
    //require('../../../public/scripts/controller/taskListCtrl.js');
    //require('../../../public/scripts/controller/userCtrl.js');
    //require('../../../public/scripts/controller/chatCtrl.js');
    //require('../../../public/scripts/controller/customSearchCtrl.js');
    //require('../../../public/scripts/controller/template/commonTemplateCtrl.js');
    //require('../../../public/scripts/controller/template/commonTemplateCtrl_v5_1.js');
    //require('../../../public/scripts/route_outer.js');
    //require('../../../public/scripts/toolControllers/googleSearch.js');
    //require('../../../public/scripts/toolControllers/mail_check.js');
    //require('../../../public/scripts/toolControllers/sideToolSetCtrl.js');
    //require('../../../public/scripts/toolControllers/sideToolSetCtrl.js');
}
