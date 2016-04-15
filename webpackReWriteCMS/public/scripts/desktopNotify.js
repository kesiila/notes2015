"use strict";
(function (window) {
    "use strict";
    void
        function () {
            var t = null,
                i = -1,
                n = {
                    show: 1,
                    error: 1,
                    close: 1,
                    click: 1
                }, a = {
                    isSupport: function () {
                        return "Notification" in window || "webkitNotifications" in window
                    },
                    show: function (e, i, n) {
                        t = this.create(e, i, n);
                        t.show()
                    },
                    showHTML: function (e) {
                        t = this.createHTML(e);
                        t.show()
                    },
                    hide: function (e) {
                        t && t.close();
                        e && e()
                    },
                    destroy: function () {
                        t = null;
                        i = -1
                    },
                    checkPermission: function () {
                        return i = webkitNotifications.checkPermission()
                    },
                    isPermitted: function () {
                        return 0 === this.checkPermission()
                    },
                    requestPermission: function (e) {
                        this.isPermitted() ? e && e() : webkitNotifications.requestPermission(e)
                    },
                    create: function (e, t, i) {
                        return webkitNotifications.createNotification(e, t, i)
                    },
                    createHTML: function (e) {
                        return webkitNotifications.createHTMLNotification(e)
                    },
                    on: function (e, i) {
                        n[e] && t && t.addEventListener(e, i, false)
                    },
                    un: function (e, i) {
                        n[e] && t && t.removeEventListener(e, i, false)
                    }
                };
            window || (window = {});
            window.DesktopNotify = a;
        }();
    window.DesktopNotify.wt_show = function (t, i, n, a) {
        return this.isSupport() ? (this.requestPermission(function () {
            window.DesktopNotify.show(t, i, n);
            "undefined" !== a && "function" == typeof a && (window.DesktopNotify.on("click", a), window.DesktopNotify.on("click", function () {
                window.DesktopNotify.hide()
            })), setTimeout(function () {
                window.DesktopNotify.hide()
            }, 1e4)
        }), void 0) : (alert("你的浏览器不支持桌面通知！"), void 0);
    }
})(window);