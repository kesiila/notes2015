"use strict";
var rewrite = require('express-urlrewrite');

exports.rewrite = function(app){
    app.use(rewrite('/signin', '/index.html'));
    app.use(rewrite('/*', '/dashboard.html'));
}
