"use strict";
;(function (window) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (window.webkitRequestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function (callback) {
                return window.setTimeout(callback, 1000/60);
            }
        );
        window.cancelAnimationFrame =  (window.webkitCancelAnimationFrame
            || window.mozCancelAnimationFrame
            || window.oCancelAnimationFrame
            || window.msCancelAnimationFrame
            || function (id) {
                return window.clearTimeout(id);
            }
        );
    }
})(window);