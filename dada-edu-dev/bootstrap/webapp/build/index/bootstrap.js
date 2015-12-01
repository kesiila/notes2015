"use strict";

var config = require('../config');
var root = config['root'];

global.$ = global.jQuery = require('jquery');
require('bootstrap-sass');
require('bootstrap-sass/assets/stylesheets/_bootstrap.scss');
