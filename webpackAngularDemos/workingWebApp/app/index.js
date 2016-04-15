"use strict";

function printMessage (status) {
    //let
    let message = 'ES6';
    //template string
    console.log(`${message} is ${status}`);
}

printMessage('working');

module.exports = angular.module('app', [
    'lumx',
    require('./core/layout').name
]);
