/**
 * test some simple method
 *
 */
var http = require('http');
var ng = require('nodegrass');
var  _ = require('lodash');
var jsdom = require('jsdom');
var  $ = require('jquery')(jsdom.jsdom().createElement("script"));
//var  $ = require('node-jquery');
var htmlparser = require('htmlparser');

var HTML = '<html><head></head> <body><a href= "www.baidu.com">女装</a> </html>';

var url  = 'http://www.1688.com';
ng.get(url, function(data, status, headers){
//    console.log(data);
},'gbk').on('error', function (err) {
//    console.log(err);
});

console.log($);
//console.log($(HTML).href() + "--" + $(HTML).innerHTML());

var handler = new htmlparser.DefaultHandler(function (error, dom) {
    if (error)
        throw error
    else
        console.log("no error!");
});

var parser = new htmlparser.Parser(handler);
parser.parseComplete(HTML);
console.log(handler.dom);

_.forEach(handler.dom[0].children, function(i){
    console.log(i);
});

function printAllMethod(obj){
    console.log("方法s:");
    for (var i in obj) {
        if(typeof (obj[i]) == "function") {
            console.log(obj[i].toString());
        }
    }
}

printAllMethod(handler.dom[0].children[0]);

//console.log(handler('a'));
