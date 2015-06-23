

var    $ = require('./parser.js');
var   fs = require('fs');
var iconv= require('iconv-lite');

fs.readFile('./1.txt', function (err, data) {
    if(err)
        console.log('a error occurs when reading file: ' + err);
    else {
        var str = iconv.decode(data, 'utf8')
        console.log(str);
        console.log($.find($.parse(str)[2],'#promation_slider'));
    }

});
