"use strict";
var _gaq = _gaq || [];
angular.module("wt.analytics", []).run(["$http",
    function () {
        "use strict";
        _gaq.push(["_setAccount", kzi.config.googleAnalytics]);
        _gaq.push(["_trackPageview"]);
        var t = document.createElement("script");
        t.type = "text/javascript";
        t.async = true;
        t.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
        if ("dev" !== wt.env) {
            var i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(t, i)
        }
    }
]).service("analytics", function (e, t, i, n) {
    "use strict";
    var a = function () {
        var e = s(i.path(), n);
        t._gaq.push(["_trackPageview", e])
    };
    e.$on("$viewContentLoaded", a);
    var s = function (e, t) {
        for (var i in t) {
            var n = "/" + t[i];
            e = e.replace(n, "")
        }
        var a = decodeURIComponent($.param(t));
        return "" === a ? e : e + "?" + a
    }
});