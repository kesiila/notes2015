/**
 * wrapper of html-parser
 */

var htmlparser = require('htmlparser');


// rawHtml -> dom
function parse(rawHtml) {
    var handler = new htmlparser.DefaultHandler(function (err, dom) {
        if (err)
            throw err;
        else
            console.log('parse done!!');
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rawHtml);
    return handler.dom;
}

function find(dom, selector) {
    var prefix =  selector.trim()[0];
    if( prefix === '.') {
        return findByClass(dom, selector);
    } else if (prefix === '#') {
        return findById(dom, selector);
    } else {
        return findByElement(dom, selector);
    }
}

function findByClass(dom, selector) {
    if(!selector)
        throw new Error('findByClass need a non-null argument!');
    var selector = selector.substring(1);
    return traversal(dom, function (dom) {
        if (dom.hasOwnProperty('attribs')
            &&
            dom.attribs.hasOwnProperty('class')
            &&
            typeof dom.attribs['class'] === 'string'
            &&
            dom.attribs['class'].indexOf(selector) > -1) {
            return true;
        } else {
            return false;
        }
    })
}

function findById(dom, selector) {
    if(!selector)
        throw new Error('findById need a non-null argument!');
    var selector = selector.substring(1);
    return traversal(dom, function (dom) {
         if (dom.hasOwnProperty('attribs')
             &&
             dom.attribs.hasOwnProperty('id')
             &&
            typeof dom.attribs['id'] === 'string'
            &&
            dom.attribs['id'].indexOf(selector) > -1) {
            return true;
        } else {
            return false;
        }
    });
}

function findByElement(dom, selector) {
     if(!selector)
        throw new Error('findById need a non-null argument!');
    return traversal(dom, function (dom) {
         if (dom.name === selector ) {
            return true;
        } else {
            return false;
        }
    });
}

function traversal(dom, predicate) {
    if(typeof predicate !== 'function')
        throw new Error('traversal() need second argument as a Function');
    if(predicate(dom) === true) {
        return dom;
    } else if (!dom.children || !dom.children.length) {
        return null;
    } else {
        return map(dom.children, function(dom) {
            return traversal(dom, predicate);
        })
    }
}
//helper function
function map(arrayLike, fn) {
    return [].map.call(arrayLike,fn);
}

function flatArray(array) {
   return [].forEach.call(array, function() {

   })
}

function mergeArray(array1,array2){
   var arrayRes = [];
   array1.forEach(function(i){
        arrayRes.push(i);
   })
   array2.forEach(function(i){
        arrayRes.push(i);
   })
   return arrayRes;
}

// external api
exports.parse = parse;
exports.find  = find;