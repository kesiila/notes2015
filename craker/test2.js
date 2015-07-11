'use strict';
var    assert = require('assert');
var         $ = require('./parser.js');
var        fs = require('fs');
var     iconv = require('iconv-lite');

fs.readFile('./1.txt', function (err, data) {
    if(err)
        console.log('a error occurs when reading file: ' + err);
    else {
        var str = iconv.decode(data, 'utf8')
        console.log(str);
        var temp = $.find($.parse(str)[2],'.floatLayer_text')[0];
        console.log(temp)
        console.log($.find(temp, 'a'));
    }
});
