var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var server = require('koa-static');
var fs = require('fs');

router.get('/comments.json', function *(next) {
    fs.readFile('comments.json', function(err, data) {
        this.response.setHeader('Content-Type', 'application/json');
        this.response.send(data);
    })
});

app.use(server('./'));
app.use(router.routes());

app.listen(3000);
