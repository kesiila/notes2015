/**
 * Created by jaye on 15/11/23.
 */
"use strict";

class NavCtrl {
    constructor() {
        this.app = require('index.json');
    }
}

module.exports = function ()  {
    require('./nav.scss');
    return {
        controller: NavCtrl,
        controllerAs: 'nav',
        template: require('./nav.html')
    };
};