'use strict';
var http = require('http');
var    _ = require('lodash');
var   fs = require('fs');
var Promise = require('bluebird');
var    $ = require('jquery');
var   ng = require('nodegrass');
var   hp = require('htmlparser');
var   m$ = require('./parse.js');

var CATALOG_SELECTOR = '.subnav_content_fzny a';

var handle0 = new hp.defaultHandler(function(err, dom) {
    if(err)
        throw err
    else
        console.log('parse done');
});

function getCatalogUrls() {
    ng.get('www.1688.com',function(data, status, headers){
        if(err) throw err;
        var keyAndUrls = $(data).find(CATALOG_SELECTOR);
        var res = _.chain(keyAndUrls)
            .map(function (item) {
                return {
                  key: $(item).innerHTML,
                  url: $(item).href
                 }
         }).value();
       //  fs.writeFile(CATALOG_PATH, res, 'w', function mayHaveFnHere(){});
    }, 'gbk').on('error', function(err) {
        if (err) throw err;
    });
}
//ul.sm-offerShopwindow>li.sm-offerShopwindow-item>.title>a
function getItemUrls(array) {
    _.forEach(function (item) {
        ng.get(item.url,function(err, data) {
            if(err) throw err;
            if(data == null) throw new Error('has wrong (key,url) : ( ' +
                                            url.key + ',' + url + ')');
            item['data'] = escapeData(data);
        });
        // should resolve a promise
    })
    // HTML->[(key,url)]
    function eascapeData(data) {
        if(data == null) throw new Error('has no variable arugments');
        var block = $(ITEM_A_SELECTOR);
        return  _.chain(block).map(function(item) {
            return {
                key: item.innerHtml,
                url: getHref(item)
            }
        }).value();
    }
    return promise;
}
// div#mod-detail-price tr.amount>td.amount-tile >.value +  tr.price.ladder-1-1
function mapFunction (url) {
    // need a deffer
    http.get(url, function (err, data) {
        if (err) throw err;
        if (data == null) throw new Error('has no response in url : ' + url);
        var res = $(DETAIL_SELECTOR);
        // resolve res
    });
    return promise;
}

// array :: [(catalog,key,url,price,amount,res)]
function reSort(array) {
    return _.sortBy(array,'res');
}

// array :: [(catalog,key,url,price,amount,res)]
// IO()
function writeToExcel(excel_path,data) {
    http.writeFile(excel_path,data, 'w', function mayNeedFn() {})
}

