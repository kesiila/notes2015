var http = require('http'),
    httpProxy = require('http-proxy');

var rewrite = require('./../../static-server/rewrite');

var proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
    if(err) throw new Error(err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Somethin wrong. And a error message is reporting!');
});

// 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发
var server = require('http').createServer(function(req, res) {
    // 在这里可以自定义你的路由分发
    var host = req.headers.host,
        ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        url = req.url;
    console.log("client ip:" + ip + ", host:" + host + ", url:" + url);
    var target = 'http://127.0.0.1:9090'; //9090 as default

    if(url && url.indexOf('api') > -1) {
        target = 'http://localhost:8080';
    }

    switch(host){
        case '127.0.0.1:8181':
            console.log("target: " + target);
            proxy.web(req, res, { target: target });
            break;
        case 'bbs.aaaa.com':
            proxy.web(req, res, { target: 'http://xyd.bbbbb.com:82' });
            break;
        case 'vps.cccc.com':
            proxy.web(req, res, { target: 'http://xyd.bbbbb.com:8080' });
            break;
        case 'dddd.com':
        case 'www.dddd.com':
            proxy.web(req, res, { target: 'http://localhost:81' });
            break;
        case 'eeeeee.com.cn':
        case 'www.eeee.com.cn':
            proxy.web(req, res, { target: 'http://eeeee.com.cn:8082' });
            break;
        default:
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Welcome to my server!');
    }
});

console.log("listening on port 8181")
server.listen(8181);
