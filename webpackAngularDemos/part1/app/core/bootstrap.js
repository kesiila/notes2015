/**
 * Created by jaye on 15/11/23.
 */
"use strict";
// load Angular
require('./vendor')(); // run an empty function

// load the main app file
var appModule = require('../index');

//replaces ng-app="appName"

angular.element(document).ready(function () {
   angular.bootstrap(document, [appModule.name], {
       //strictDi: true
   });
});