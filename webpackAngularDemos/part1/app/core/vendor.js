/**
 * Created by jaye on 15/11/23.
 */
"use strict";

module.exports = function () {
    /* Styles */
    require('../index.scss');
    require('../../node_modules/mdi/css/materialdesignicons.min.css');
    /* JS */
    global.$ = global.jQuery = require('jquery');
    require('velocity-animate');

    global.moment = require('moment'); //lumx user a global 'moment'
    require('angular');
    require('node-lumx');
};