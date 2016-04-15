"use strict";
/*
 * 静态资源服务器
 */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

var html_dir = 'workingWebApp/app/';

//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(cookieParser());

app.get('/signin', function (req, res) {
    res.sendFile(__dirname + '/' + html_dir + 'public.html');
}).get('/*', function (req, res) {
    if (req.path && req.path.indexOf('.') === -1) {
        res.status(200).sendFile(__dirname + '/' + html_dir + '/dashboard.html')
    } else {
        var contentType='none';
        var ext = path.extname(req.url);
        switch(ext)
        {
            case ".js":
                contentType = 'text/javascript';
                break;
            case ".css":
                contentType = 'text/css';
                break;
        }
        res.set({'Content-type': contentType});
        res.status(200).sendFile(__dirname + '/' + html_dir + req.url);
    }
});

//app.use(express.static(path.join(__dirname, html_dir)));
//app.use('/', routes);
//app.use('/users', users);


app.use(function (req, res, next) {
    var err = new Error('Not Found: ' + req.path);
    err.status = 404;
    next(err);
});

app.listen(9090);
console.log('listening on: 9090');
