/*!
 * FullCalendar v2.0.2
 * Docs & License: http://arshaw.com/fullcalendar/
 * (c) 2013 Adam Shaw
 */

+function (e, t) {
    function r(t) {
        e.extend(!0, i, t)
    }

    function o(i, n, a) {
        function z(e) {
            h ? F() && (W(), H(e)) : M()
        }

        function M() {
            m = n.theme ? "ui" : "fc", i.addClass("fc"), n.isRTL ? i.addClass("fc-rtl") : i.addClass("fc-ltr"), n.theme && i.addClass("ui-widget"), h = e("<div class='fc-content' style='position:relative'/>").prependTo(i), p = new l(r, n), f = p.render(), f && i.prepend(f), O(n.defaultView), n.handleWindowResize && e(window).resize(Y), I() || A()
        }

        function A() {
            setTimeout(function () {
                !b.start && I() && L()
            }, 0)
        }

        function P() {
            b && (gt("viewDestroy", b, b, b.element), b.triggerEventDestroy()), e(window).unbind("resize", Y), p.destroy(), h.remove(), i.removeClass("fc fc-rtl ui-widget")
        }

        function F() {
            return i.is(":visible")
        }

        function I() {
            return e("body").is(":visible")
        }

        function O(e) {
            b && e == b.name || N(e)
        }

        function N(t) {
            x++, b && (gt("viewDestroy", b, b, b.element), at(), b.triggerEventDestroy(), ft(), b.element.remove(), p.deactivateButton(b.name)), p.activateButton(t), b = new s[t](e("<div class='fc-view fc-view-" + t + "' style='position:relative'/>").appendTo(h), r), L(), ht(), x--
        }

        function L(e) {
            (!b.start || e || b.start > C || C >= b.end) && F() && H(e)
        }

        function H(e) {
            x++, b.start && (gt("viewDestroy", b, b, b.element), at(), K()), ft(), b.render(C, e || 0), B(), ht(), (b.afterRender || U)(), tt(), it(), gt("viewRender", b, b, b.element), b.trigger("viewDisplay", d), x--, Z()
        }

        function R() {
            F() && (at(), K(), W(), B(), G())
        }

        function W() {
            w = n.contentHeight ? n.contentHeight : n.height ? n.height - (f ? f.height() : 0) - q(h) : Math.round(h.width() / Math.max(n.aspectRatio, .5))
        }

        function B() {
            w === t && W(), x++, b.setHeight(w), b.setWidth(h.width()), x--, y = i.outerWidth()
        }

        function Y() {
            if (!x)
                if (b.start) {
                    var e = ++j;
                    setTimeout(function () {
                        e == j && !x && F() && y != (y = i.outerWidth()) && (x++, R(), b.trigger("windowResize", d), x--)
                    }, 200)
                } else A()
        }

        function V() {
            K(), Q()
        }

        function X(e) {
            K(), G(e)
        }

        function G(e) {
            F() && (b.setEventData(S), b.renderEvents(S, e), b.trigger("eventAfterAllRender"))
        }

        function K() {
            b.triggerEventDestroy(), b.clearEvents(), b.clearEventData()
        }

        function Z() {
            !n.lazyFetching || o(b.visStart, b.visEnd) ? Q() : G()
        }

        function Q() {
            c(b.visStart, b.visEnd)
        }

        function J(e) {
            S = e, G()
        }

        function et(e) {
            X(e)
        }

        function tt() {
            p.updateTitle(b.title)
        }

        function it() {
            var e = new Date;
            e >= b.start && b.end > e ? p.disableButton("today") : p.enableButton("today")
        }

        function nt(e, i, n) {
            b.select(e, i, n === t ? !0 : n)
        }

        function at() {
            b && b.unselect()
        }

        function st() {
            L(-1)
        }

        function rt() {
            L(1)
        }

        function ot() {
            _(C, -1), L()
        }

        function lt() {
            _(C, 1), L()
        }

        function ct() {
            C = new Date, L()
        }

        function dt(e, t, i) {
            e instanceof Date ? C = k(e) : $(C, e, t, i), L()
        }

        function ut(e, i, n) {
            e !== t && _(C, e), i !== t && g(C, i), n !== t && v(C, n), L()
        }

        function pt() {
            return k(C)
        }

        function ft() {
            h.css({
                width: "100%",
                height: h.height(),
                overflow: "hidden"
            })
        }

        function ht() {
            h.css({
                width: "",
                height: "",
                overflow: ""
            })
        }

        function mt() {
            return b
        }

        function _t(e, i) {
            return i === t ? n[e] : (("height" == e || "contentHeight" == e || "aspectRatio" == e) && (n[e] = i, R()), void 0)
        }

        function gt(e, t) {
            return n[e] ? n[e].apply(t || d, Array.prototype.slice.call(arguments, 2)) : void 0
        }

        var r = this;
        r.options = n, r.render = z, r.destroy = P, r.refetchEvents = V, r.reportEvents = J, r.reportEventChange = et, r.rerenderEvents = X, r.changeView = O, r.select = nt, r.unselect = at, r.prev = st, r.next = rt, r.prevYear = ot, r.nextYear = lt, r.today = ct, r.gotoDate = dt, r.incrementDate = ut, r.formatDate = function (e, t) {
            return E(e, t, n)
        }, r.formatDates = function (e, t, i) {
            return T(e, t, i, n)
        }, r.getDate = pt, r.getView = mt, r.option = _t, r.trigger = gt, u.call(r, n, a);
        var p, f, h, m, b, y, w, D, o = r.isFetchNeeded,
            c = r.fetchEvents,
            d = i[0],
            j = 0,
            x = 0,
            C = new Date,
            S = [];
        $(C, n.year, n.month, n.date), n.droppable && e(document).bind("dragstart", function (t, i) {
            var a = t.target,
                s = e(a);
            if (!s.parents(".fc").length) {
                var r = n.dropAccept;
                (e.isFunction(r) ? r.call(a, s) : s.is(r)) && (D = a, b.dragStart(D, t, i))
            }
        }).bind("dragstop", function (e, t) {
            D && (b.dragStop(D, e, t), D = null)
        })
    }

    function l(t, i) {
        function o() {
            r = i.theme ? "ui" : "fc";
            var t = i.header;
            return t ? a = e("<table class='fc-header' style='width:100%'/>").append(e("<tr/>").append(c("left")).append(c("center")).append(c("right"))) : void 0
        }

        function l() {
            a.remove()
        }

        function c(n) {
            var a = e("<td class='fc-header-" + n + "'/>"),
                o = i.header[n];
            return o && e.each(o.split(" "), function (n) {
                n > 0 && a.append("<span class='fc-header-space'/>");
                var o;
                e.each(this.split(","), function (n, l) {
                    if ("title" == l) a.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>"), o && o.addClass(r + "-corner-right"), o = null;
                    else {
                        var c;
                        if (t[l] ? c = t[l] : s[l] && (c = function () {
                            p.removeClass(r + "-state-hover"), t.changeView(l)
                        }), c) {
                            var d = i.theme ? K(i.buttonIcons, l) : null,
                                u = K(i.buttonText, l),
                                p = e("<span class='fc-button fc-button-" + l + " " + r + "-state-default'>" + (d ? "<span class='fc-icon-wrap'><span class='ui-icon ui-icon-" + d + "'/>" + "</span>" : u) + "</span>").click(function () {
                                    p.hasClass(r + "-state-disabled") || c()
                                }).mousedown(function () {
                                    p.not("." + r + "-state-active").not("." + r + "-state-disabled").addClass(r + "-state-down")
                                }).mouseup(function () {
                                    p.removeClass(r + "-state-down")
                                }).hover(function () {
                                    p.not("." + r + "-state-active").not("." + r + "-state-disabled").addClass(r + "-state-hover")
                                }, function () {
                                    p.removeClass(r + "-state-hover").removeClass(r + "-state-down")
                                }).appendTo(a);
                            Q(p), o || p.addClass(r + "-corner-left"), o = p
                        }
                    }
                }), o && o.addClass(r + "-corner-right")
            }), a
        }

        function d(e) {
            a.find("h2").html(e)
        }

        function u(e) {
            a.find("span.fc-button-" + e).addClass(r + "-state-active")
        }

        function p(e) {
            a.find("span.fc-button-" + e).removeClass(r + "-state-active")
        }

        function f(e) {
            a.find("span.fc-button-" + e).addClass(r + "-state-disabled")
        }

        function h(e) {
            a.find("span.fc-button-" + e).removeClass(r + "-state-disabled")
        }

        var n = this;
        n.render = o, n.destroy = l, n.updateTitle = d, n.activateButton = u, n.deactivateButton = p, n.disableButton = f, n.enableButton = h;
        var r, a = e([])
    }

    function u(i, n) {
        function y(e, t) {
            return !f || f > e || t > h
        }

        function w(e, t) {
            f = e, h = t, v = [];
            var i = ++m,
                n = p.length;
            _ = n;
            for (var a = 0; n > a; a++) j(p[a], i)
        }

        function j(t, n) {
            x(t, function (a) {
                if (n == m) {
                    if (a) {
                        i.eventDataTransform && (a = e.map(a, i.eventDataTransform)), t.eventDataTransform && (a = e.map(a, t.eventDataTransform));
                        for (var s = 0; a.length > s; s++) a[s].source = t, F(a[s]);
                        v = v.concat(a)
                    }
                    _--, _ || l(v)
                }
            })
        }

        function x(t, n) {
            var s, o, r = a.sourceFetchers;
            for (s = 0; r.length > s; s++) {
                if (o = r[s](t, f, h, n), o === !0) return;
                if ("object" == typeof o) return x(o, n), void 0
            }
            var l = t.events;
            if (l) e.isFunction(l) ? (A(), l(k(f), k(h), function (e) {
                n(e), P()
            })) : e.isArray(l) ? n(l) : n();
            else {
                var d = t.url;
                if (d) {
                    var _, u = t.success,
                        p = t.error,
                        m = t.complete;
                    _ = e.isFunction(t.data) ? t.data() : t.data;
                    var g = e.extend({}, _ || {}),
                        v = nt(t.startParam, i.startParam),
                        b = nt(t.endParam, i.endParam);
                    v && (g[v] = Math.round(+f / 1e3)), b && (g[b] = Math.round(+h / 1e3)), A(), e.ajax(e.extend({}, c, t, {
                        data: g,
                        success: function (t) {
                            t = t || [];
                            var i = it(u, this, arguments);
                            e.isArray(i) && (t = i), n(t)
                        },
                        error: function () {
                            it(p, this, arguments), n()
                        },
                        complete: function () {
                            it(m, this, arguments), P()
                        }
                    }))
                } else n()
            }
        }

        function $(e) {
            e = S(e), e && (_++, j(e, m))
        }

        function S(t) {
            return e.isFunction(t) || e.isArray(t) ? t = {
                events: t
            } : "string" == typeof t && (t = {
                url: t
            }), "object" == typeof t ? (I(t), p.push(t), t) : void 0
        }

        function D(t) {
            p = e.grep(p, function (e) {
                return !O(e, t)
            }), v = e.grep(v, function (e) {
                return !O(e.source, t)
            }), l(v)
        }

        function E(e) {
            var t, n, i = v.length,
                a = o().defaultEventEnd,
                s = e.start - e._start,
                r = e.end ? e.end - (e._end || a(e)) : 0;
            for (t = 0; i > t; t++) n = v[t], n._id == e._id && n != e && (n.start = new Date(+n.start + s), n.end = e.end ? n.end ? new Date(+n.end + r) : new Date(+a(n) + r) : null, n.title = e.title, n.url = e.url, n.allDay = e.allDay, n.className = e.className, n.editable = e.editable, n.color = e.color, n.backgroundColor = e.backgroundColor, n.borderColor = e.borderColor, n.textColor = e.textColor, F(n));
            F(e), l(v)
        }

        function T(e, t) {
            F(e), e.source || (t && (u.events.push(e), e.source = u), v.push(e)), l(v)
        }

        function z(t) {
            if (t) {
                if (!e.isFunction(t)) {
                    var n = t + "";
                    t = function (e) {
                        return e._id == n
                    }
                }
                v = e.grep(v, t, !0);
                for (var i = 0; p.length > i; i++) e.isArray(p[i].events) && (p[i].events = e.grep(p[i].events, t, !0))
            } else {
                v = [];
                for (var i = 0; p.length > i; i++) e.isArray(p[i].events) && (p[i].events = [])
            }
            l(v)
        }

        function M(t) {
            return e.isFunction(t) ? e.grep(v, t) : t ? (t += "", e.grep(v, function (e) {
                return e._id == t
            })) : v
        }

        function A() {
            g++ || r("loading", null, !0, o())
        }

        function P() {
            --g || r("loading", null, !1, o())
        }

        function F(e) {
            var n = e.source || {},
                a = nt(n.ignoreTimezone, i.ignoreTimezone);
            e._id = e._id || (e.id === t ? "_fc" + d++ : e.id + ""), e.date && (e.start || (e.start = e.date), delete e.date), e._start = k(e.start = C(e.start, a)), e.end = C(e.end, a), e.end && e.start >= e.end && (e.end = null), e._end = e.end ? k(e.end) : null, e.allDay === t && (e.allDay = nt(n.allDayDefault, i.allDayDefault)), e.className ? "string" == typeof e.className && (e.className = e.className.split(/\s+/)) : e.className = []
        }

        function I(e) {
            e.className ? "string" == typeof e.className && (e.className = e.className.split(/\s+/)) : e.className = [];
            for (var t = a.sourceNormalizers, i = 0; t.length > i; i++) t[i](e)
        }

        function O(e, t) {
            return e && t && N(e) == N(t)
        }

        function N(e) {
            return ("object" == typeof e ? e.events || e.url : "") || e
        }

        var s = this;
        s.isFetchNeeded = y, s.fetchEvents = w, s.addEventSource = $, s.removeEventSource = D, s.updateEvent = E, s.renderEvent = T, s.removeEvents = z, s.clientEvents = M, s.normalizeEvent = F;
        for (var f, h, r = s.trigger, o = s.getView, l = s.reportEvents, u = {
            events: []
        }, p = [u], m = 0, _ = 0, g = 0, v = [], b = 0; n.length > b; b++) S(n[b])
    }

    function _(e, t, i) {
        return e.setFullYear(e.getFullYear() + t), i || w(e), e
    }

    function g(e, t, i) {
        if (+e) {
            var n = e.getMonth() + t,
                a = k(e);
            for (a.setDate(1), a.setMonth(n), e.setMonth(n), i || w(e); e.getMonth() != a.getMonth();) e.setDate(e.getDate() + (a > e ? 1 : -1))
        }
        return e
    }

    function v(e, t, i) {
        if (+e) {
            var n = e.getDate() + t,
                a = k(e);
            a.setHours(9), a.setDate(n), e.setDate(n), i || w(e), b(e, a)
        }
        return e
    }

    function b(e, t) {
        if (+e)
            for (; e.getDate() != t.getDate();) e.setTime(+e + (t > e ? 1 : -1) * h)
    }

    function y(e, t) {
        return e.setMinutes(e.getMinutes() + t), e
    }

    function w(e) {
        return e.setHours(0), e.setMinutes(0), e.setSeconds(0), e.setMilliseconds(0), e
    }

    function k(e, t) {
        return t ? w(new Date(+e)) : new Date(+e)
    }

    function j() {
        var t, e = 0;
        do t = new Date(1970, e++, 1); while (t.getHours());
        return t
    }

    function x(e, t) {
        return Math.round((k(e, !0) - k(t, !0)) / f)
    }

    function $(e, i, n, a) {
        i !== t && i != e.getFullYear() && (e.setDate(1), e.setMonth(0), e.setFullYear(i)), n !== t && n != e.getMonth() && (e.setDate(1), e.setMonth(n)), a !== t && e.setDate(a)
    }

    function C(e, i) {
        return "object" == typeof e ? e : "number" == typeof e ? new Date(1e3 * e) : "string" == typeof e ? e.match(/^\d+(\.\d+)?$/) ? new Date(1e3 * parseFloat(e)) : (i === t && (i = !0), S(e, i) || (e ? new Date(e) : null)) : null
    }

    function S(e, t) {
        var i = e.match(/^([0-9]{4})(-([0-9]{2})(-([0-9]{2})([T ]([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2})(:?([0-9]{2}))?))?)?)?)?$/);
        if (!i) return null;
        var n = new Date(i[1], 0, 1);
        if (t || !i[13]) {
            var a = new Date(i[1], 0, 1, 9, 0);
            i[3] && (n.setMonth(i[3] - 1), a.setMonth(i[3] - 1)), i[5] && (n.setDate(i[5]), a.setDate(i[5])), b(n, a), i[7] && n.setHours(i[7]), i[8] && n.setMinutes(i[8]), i[10] && n.setSeconds(i[10]), i[12] && n.setMilliseconds(1e3 * Number("0." + i[12])), b(n, a)
        } else if (n.setUTCFullYear(i[1], i[3] ? i[3] - 1 : 0, i[5] || 1), n.setUTCHours(i[7] || 0, i[8] || 0, i[10] || 0, i[12] ? 1e3 * Number("0." + i[12]) : 0), i[14]) {
            var s = 60 * Number(i[16]) + (i[18] ? Number(i[18]) : 0);
            s *= "-" == i[15] ? 1 : -1, n = new Date(+n + 1e3 * 60 * s)
        }
        return n
    }

    function D(e) {
        if ("number" == typeof e) return 60 * e;
        if ("object" == typeof e) return 60 * e.getHours() + e.getMinutes();
        var t = e.match(/(\d+)(?::(\d+))?\s*(\w+)?/);
        if (t) {
            var i = parseInt(t[1], 10);
            return t[3] && (i %= 12, "p" == t[3].toLowerCase().charAt(0) && (i += 12)), 60 * i + (t[2] ? parseInt(t[2], 10) : 0)
        }
    }

    function E(e, t, i) {
        return T(e, null, t, i)
    }

    function T(e, t, n, a) {
        a = a || i;
        var o, c, d, u, s = e,
            r = t,
            l = n.length,
            p = "";
        for (o = 0; l > o; o++)
            if (c = n.charAt(o), "'" == c) {
                for (d = o + 1; l > d; d++)
                    if ("'" == n.charAt(d)) {
                        s && (p += d == o + 1 ? "'" : n.substring(o + 1, d), o = d);
                        break
                    }
            } else if ("(" == c) {
                for (d = o + 1; l > d; d++)
                    if (")" == n.charAt(d)) {
                        var f = E(s, n.substring(o + 1, d), a);
                        parseInt(f.replace(/\D/, ""), 10) && (p += f), o = d;
                        break
                    }
            } else if ("[" == c) {
                for (d = o + 1; l > d; d++)
                    if ("]" == n.charAt(d)) {
                        var h = n.substring(o + 1, d),
                            f = E(s, h, a);
                        f != E(r, h, a) && (p += f), o = d;
                        break
                    }
            } else if ("{" == c) s = t, r = e;
            else if ("}" == c) s = e, r = t;
            else {
                for (d = l; d > o; d--)
                    if (u = z[n.substring(o, d)]) {
                        s && (p += u(s, a)), o = d - 1;
                        break
                    }
                d == o && s && (p += c)
            }
        return p
    }

    function M(e) {
        var t, i = new Date(e.getTime());
        return i.setDate(i.getDate() + 4 - (i.getDay() || 7)), t = i.getTime(), i.setMonth(0), i.setDate(1), Math.floor(Math.round((t - i) / 864e5) / 7) + 1
    }

    function A(e) {
        return e.end ? P(e.end, e.allDay) : v(k(e.start), 1)
    }

    function P(e, t) {
        return e = k(e), t || e.getHours() || e.getMinutes() ? v(e, 1) : w(e)
    }

    function F(i, n, a) {
        i.unbind("mouseover").mouseover(function (i) {
            for (var r, o, l, s = i.target; s != this;) r = s, s = s.parentNode;
            (o = r._fci) !== t && (r._fci = t, l = n[o], a(l.event, l.element, l), e(i.target).trigger(i)), i.stopPropagation()
        })
    }

    function I(t, i, n) {
        for (var s, a = 0; t.length > a; a++) s = e(t[a]), s.width(Math.max(0, i - N(s, n)))
    }

    function O(t, i, n) {
        for (var s, a = 0; t.length > a; a++) s = e(t[a]), s.height(Math.max(0, i - q(s, n)))
    }

    function N(e, t) {
        return L(e) + R(e) + (t ? H(e) : 0)
    }

    function L(t) {
        return (parseFloat(e.css(t[0], "paddingLeft", !0)) || 0) + (parseFloat(e.css(t[0], "paddingRight", !0)) || 0)
    }

    function H(t) {
        return (parseFloat(e.css(t[0], "marginLeft", !0)) || 0) + (parseFloat(e.css(t[0], "marginRight", !0)) || 0)
    }

    function R(t) {
        return (parseFloat(e.css(t[0], "borderLeftWidth", !0)) || 0) + (parseFloat(e.css(t[0], "borderRightWidth", !0)) || 0)
    }

    function q(e, t) {
        return W(e) + Y(e) + (t ? B(e) : 0)
    }

    function W(t) {
        return (parseFloat(e.css(t[0], "paddingTop", !0)) || 0) + (parseFloat(e.css(t[0], "paddingBottom", !0)) || 0)
    }

    function B(t) {
        return (parseFloat(e.css(t[0], "marginTop", !0)) || 0) + (parseFloat(e.css(t[0], "marginBottom", !0)) || 0)
    }

    function Y(t) {
        return (parseFloat(e.css(t[0], "borderTopWidth", !0)) || 0) + (parseFloat(e.css(t[0], "borderBottomWidth", !0)) || 0)
    }

    function U() {
    }

    function V(e, t) {
        return e - t
    }

    function X(e) {
        return Math.max.apply(Math, e)
    }

    function G(e) {
        return (10 > e ? "0" : "") + e
    }

    function K(e, i) {
        if (e[i] !== t) return e[i];
        for (var s, n = i.split(/(?=[A-Z])/), a = n.length - 1; a >= 0; a--)
            if (s = e[n[a].toLowerCase()], s !== t) return s;
        return e[""]
    }

    function Z(e) {
        return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;").replace(/"/g, "&quot;").replace(/\n/g, "<br />")
    }

    function Q(e) {
        e.attr("unselectable", "on").css("MozUserSelect", "none").bind("selectstart.ui", function () {
            return !1
        })
    }

    function J(e) {
        e.children().removeClass("fc-first fc-last").filter(":first-child").addClass("fc-first").end().filter(":last-child").addClass("fc-last")
    }

    function tt(e, t) {
        var i = e.source || {},
            n = e.color,
            a = i.color,
            s = t("eventColor"),
            r = e.backgroundColor || n || i.backgroundColor || a || t("eventBackgroundColor") || s,
            o = e.borderColor || n || i.borderColor || a || t("eventBorderColor") || s,
            l = e.textColor || i.textColor || t("eventTextColor"),
            c = [];
        return r && c.push("background-color:" + r), o && c.push("border-color:" + o), l && c.push("color:" + l), c.join(";")
    }

    function it(t, i, n) {
        if (e.isFunction(t) && (t = [t]), t) {
            var a, s;
            for (a = 0; t.length > a; a++) s = t[a].apply(i, n) || s;
            return s
        }
    }

    function nt() {
        for (var e = 0; arguments.length > e; e++)
            if (arguments[e] !== t) return arguments[e]
    }

    function at(e, t) {
        function l(e, t) {
            t && (g(e, t), e.setDate(1));
            var l = n("firstDay"),
                c = k(e, !0);
            c.setDate(1);
            var d = g(k(c), 1),
                u = k(c);
            v(u, -((u.getDay() - l + 7) % 7)), s(u);
            var p = k(d);
            v(p, (7 - p.getDay() + l) % 7), s(p, -1, !0);
            var f = r(),
                h = Math.round(x(p, u) / 7);
            "fixed" == n("weekMode") && (v(p, 7 * (6 - h)), h = 6), i.title = o(c, n("titleFormat")), i.start = c, i.end = d, i.visStart = u, i.visEnd = p, a(h, f, !0)
        }

        var i = this;
        i.render = l, ot.call(i, e, t, "month");
        var n = i.opt,
            a = i.renderBasic,
            s = i.skipHiddenDays,
            r = i.getCellsPerWeek,
            o = t.formatDate
    }

    function st(e, t) {
        function l(e, t) {
            t && v(e, 7 * t);
            var l = v(k(e), -((e.getDay() - n("firstDay") + 7) % 7)),
                c = v(k(l), 7),
                d = k(l);
            s(d);
            var u = k(c);
            s(u, -1, !0);
            var p = r();
            i.start = l, i.end = c, i.visStart = d, i.visEnd = u, i.title = o(d, v(k(u), -1), n("titleFormat")), a(1, p, !1)
        }

        var i = this;
        i.render = l, ot.call(i, e, t, "basicWeek");
        var n = i.opt,
            a = i.renderBasic,
            s = i.skipHiddenDays,
            r = i.getCellsPerWeek,
            o = t.formatDates
    }

    function rt(e, t) {
        function o(e, t) {
            t && v(e, t), s(e, 0 > t ? -1 : 1);
            var o = k(e, !0),
                l = v(k(o), 1);
            i.title = r(e, n("titleFormat")), i.start = i.visStart = o, i.end = i.visEnd = l, a(1, 1, !1)
        }

        var i = this;
        i.render = o, ot.call(i, e, t, "basicDay");
        var n = i.opt,
            a = i.renderBasic,
            s = i.skipHiddenDays,
            r = t.formatDate
    }

    function ot(t, i, n) {
        function V(e, t, i) {
            A = e, P = t, F = i, X(), b || G(), K()
        }

        function X() {
            R = s("theme") ? "ui" : "fc", W = s("columnFormat"), B = s("weekNumbers"), Y = s("weekNumberTitle"), U = "iso" != s("weekNumberCalculation") ? "w" : "W"
        }

        function G() {
            D = e("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(t)
        }

        function K() {
            var i = et();
            m && m.remove(), m = e(i).appendTo(t), _ = m.find("thead"), g = _.find(".fc-day-header"), b = m.find("tbody"), y = b.find("tr"), j = b.find(".fc-day"), x = y.find("td:first-child"), $ = y.eq(0).find(".fc-day > div"), C = y.eq(0).find(".fc-day-content > div"), J(_.add(_.find("tr"))), J(y), y.eq(0).addClass("fc-first"), y.filter(":last").addClass("fc-last"), j.each(function (t, i) {
                var n = d(Math.floor(t / P), t % P);
                r("dayRender", a, n, e(i))
            }), rt(j)
        }

        function et() {
            var e = "<table class='fc-border-separate' style='width:100%' cellspacing='0'>" + tt() + it() + "</table>";
            return e
        }

        function tt() {
            var i, n, e = R + "-widget-header",
                t = "";
            for (t += "<thead><tr>", B && (t += "<th class='fc-week-number " + e + "'>" + Z(Y) + "</th>"), i = 0; P > i; i++) n = d(0, i), t += "<th class='fc-day-header fc-" + p[n.getDay()] + " " + e + "'>" + Z(h(n, W)) + "</th>";
            return t += "</tr></thead>"
        }

        function it() {
            var i, n, a, e = R + "-widget-content",
                t = "";
            for (t += "<tbody>", i = 0; A > i; i++) {
                for (t += "<tr class='fc-week'>", B && (a = d(i, 0), t += "<td class='fc-week-number " + e + "'>" + "<div>" + Z(h(a, U)) + "</div>" + "</td>"), n = 0; P > n; n++) a = d(i, n), t += nt(a);
                t += "</tr>"
            }
            return t += "</tbody>"
        }

        function nt(e) {
            var t = R + "-widget-content",
                i = a.start.getMonth(),
                n = w(new Date),
                s = "",
                r = ["fc-day", "fc-" + p[e.getDay()], t];
            return e.getMonth() != i && r.push("fc-other-month"), +e == +n ? r.push("fc-today", R + "-state-highlight") : n > e ? r.push("fc-past") : r.push("fc-future"), s += "<td class='" + r.join(" ") + "'" + " data-date='" + h(e, "yyyy-MM-dd") + "'" + ">" + "<div>", F && (s += "<div class='fc-day-number'>" + e.getDate() + "</div>"), s += "<div class='fc-day-content'><div style='position:relative'>&nbsp;</div></div></div></td>"
        }

        function at(t) {
            T = t;
            var n, a, r, i = T - _.height();
            "variable" == s("weekMode") ? n = a = Math.floor(i / (1 == A ? 2 : 6)) : (n = Math.floor(i / A), a = i - n * (A - 1)), x.each(function (t, i) {
                A > t && (r = e(i), r.find("> div").css("min-height", (t == A - 1 ? a : n) - q(r)))
            })
        }

        function st(e) {
            E = e, L.clear(), H.clear(), M = 0, B && (M = _.find("th.fc-week-number").outerWidth()), z = Math.floor((E - M) / P), I(g.slice(0, -1), z)
        }

        function rt(e) {
            e.click(ot).mousedown(c)
        }

        function ot(t) {
            if (!s("selectable")) {
                var i = S(e(this).data("date"));
                r("dayClick", this, i, !0, t)
            }
        }

        function ct(e, t, i) {
            i && O.build();
            for (var n = f(e, t), a = 0; n.length > a; a++) {
                var s = n[a];
                rt(dt(s.row, s.leftCol, s.row, s.rightCol))
            }
        }

        function dt(e, i, n, a) {
            var s = O.rect(e, i, n, a, t);
            return o(s, t)
        }

        function ut(e) {
            return k(e)
        }

        function pt(e, t) {
            ct(e, v(k(t), 1), !0)
        }

        function ft() {
            l()
        }

        function ht(e, t, i) {
            var n = u(e),
                a = j[n.row * P + n.col];
            r("dayClick", a, e, t, i)
        }

        function mt(e, t) {
            N.start(function (e) {
                l(), e && dt(e.row, e.col, e.row, e.col)
            }, t)
        }

        function _t(e, t, i) {
            var n = N.stop();
            if (l(), n) {
                var a = d(n);
                r("drop", e, a, !0, t, i)
            }
        }

        function gt(e) {
            return k(e.start)
        }

        function vt(e) {
            return L.left(e)
        }

        function bt(e) {
            return L.right(e)
        }

        function yt(e) {
            return H.left(e)
        }

        function wt(e) {
            return H.right(e)
        }

        function kt(e) {
            return y.eq(e)
        }

        var a = this;
        a.renderBasic = V, a.setHeight = at, a.setWidth = st, a.renderDayOverlay = ct, a.defaultSelectionEnd = ut, a.renderSelection = pt, a.clearSelection = ft, a.reportDayClick = ht, a.dragStart = mt, a.dragStop = _t, a.defaultEventEnd = gt, a.getHoverListener = function () {
            return N
        }, a.colLeft = vt, a.colRight = bt, a.colContentLeft = yt, a.colContentRight = wt, a.getIsCellAllDay = function () {
            return !0
        }, a.allDayRow = kt, a.getRowCnt = function () {
            return A
        }, a.getColCnt = function () {
            return P
        }, a.getColWidth = function () {
            return z
        }, a.getDaySegmentContainer = function () {
            return D
        }, jt.call(a, t, i, n), Et.call(a), Dt.call(a), lt.call(a);
        var m, _, g, b, y, j, x, $, C, D, E, T, z, M, A, P, F, O, N, L, H, R, W, B, Y, U, s = a.opt,
            r = a.trigger,
            o = a.renderOverlay,
            l = a.clearOverlays,
            c = a.daySelectionMousedown,
            d = a.cellToDate,
            u = a.dateToCell,
            f = a.rangeToSegments,
            h = i.formatDate;
        Q(t.addClass("fc-grid")), O = new Tt(function (t, i) {
            var n, a, s;
            g.each(function (t, r) {
                n = e(r), a = n.offset().left, t && (s[1] = a), s = [a], i[t] = s
            }), s[1] = a + n.outerWidth(), y.each(function (i, r) {
                A > i && (n = e(r), a = n.offset().top, i && (s[1] = a), s = [a], t[i] = s)
            }), s[1] = a + n.outerHeight()
        }), N = new zt(O), L = new At(function (e) {
            return $.eq(e)
        }), H = new At(function (e) {
            return C.eq(e)
        })
    }

    function lt() {
        function t(t, i) {
            e.renderDayEvents(t, i)
        }

        function i() {
            e.getDaySegmentContainer().empty()
        }

        var e = this;
        e.renderEvents = t, e.clearEvents = i, xt.call(e)
    }

    function ct(e, t) {
        function l(e, t) {
            t && v(e, 7 * t);
            var l = v(k(e), -((e.getDay() - n("firstDay") + 7) % 7)),
                c = v(k(l), 7),
                d = k(l);
            s(d);
            var u = k(c);
            s(u, -1, !0);
            var p = r();
            i.title = o(d, v(k(u), -1), n("titleFormat")), i.start = l, i.end = c, i.visStart = d, i.visEnd = u, a(p)
        }

        var i = this;
        i.render = l, ut.call(i, e, t, "agendaWeek");
        var n = i.opt,
            a = i.renderAgenda,
            s = i.skipHiddenDays,
            r = i.getCellsPerWeek,
            o = t.formatDates
    }

    function dt(e, t) {
        function o(e, t) {
            t && v(e, t), s(e, 0 > t ? -1 : 1);
            var o = k(e, !0),
                l = v(k(o), 1);
            i.title = r(e, n("titleFormat")), i.start = i.visStart = o, i.end = i.visEnd = l, a(1)
        }

        var i = this;
        i.render = o, ut.call(i, e, t, "agendaDay");
        var n = i.opt,
            a = i.renderAgenda,
            s = i.skipHiddenDays,
            r = t.formatDate
    }

    function ut(i, n, a) {
        function wt(e) {
            st = e, kt(), x ? $t() : xt()
        }

        function kt() {
            ft = r("theme") ? "ui" : "fc", ht = r("isRTL"), mt = D(r("minTime")), _t = D(r("maxTime")), gt = r("columnFormat"), vt = r("weekNumbers"), bt = r("weekNumberTitle"), yt = "iso" != r("weekNumberCalculation") ? "w" : "W", it = r("snapMinutes") || r("slotMinutes")
        }

        function xt() {
            var a, s, o, l, c, t = ft + "-widget-header",
                n = ft + "-widget-content",
                d = 0 == r("slotMinutes") % 15;
            for ($t(), P = e("<div style='position:absolute;z-index:2;left:0;width:100%'/>").appendTo(i), r("allDaySlot") ? (F = e("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(P), a = "<table style='width:100%' class='fc-agenda-allday' cellspacing='0'><tr><th class='" + t + " fc-agenda-axis'>" + r("allDayText") + "</th>" + "<td>" + "<div class='fc-day-content'><div style='position:relative'/></div>" + "</td>" + "<th class='" + t + " fc-agenda-gutter'>&nbsp;</th>" + "</tr>" + "</table>", N = e(a).appendTo(P), L = N.find("tr"), Nt(L.find("td")), P.append("<div class='fc-agenda-divider " + t + "'>" + "<div class='fc-agenda-divider-inner'/>" + "</div>")) : F = e([]), H = e("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>").appendTo(P), R = e("<div style='position:relative;width:100%;overflow:hidden'/>").appendTo(H), W = e("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>").appendTo(R), a = "<table class='fc-agenda-slots' style='width:100%' cellspacing='0'><tbody>", s = j(), l = y(k(s), _t), y(s, mt), rt = 0, o = 0; l > s; o++) c = s.getMinutes(), a += "<tr class='fc-slot" + o + " " + (c ? "fc-minor" : "") + "'>" + "<th class='fc-agenda-axis " + t + "'>" + (d && c ? "&nbsp;" : b(s, r("axisFormat"))) + "</th>" + "<td class='" + n + "'>" + "<div style='position:relative'>&nbsp;</div>" + "</td>" + "</tr>", y(s, r("slotMinutes")), rt++;
            a += "</tbody></table>", B = e(a).appendTo(R), Lt(B.find("td"))
        }

        function $t() {
            var t = Ct();
            x && x.remove(), x = e(t).appendTo(i), $ = x.find("thead"), C = $.find("th").slice(1, -1), S = x.find("tbody"), E = S.find("td").slice(0, -1), T = E.find("> div"), z = E.find(".fc-day-content > div"), M = E.eq(0), A = T.eq(0), J($.add($.find("tr"))), J(S.add(S.find("tr")))
        }

        function Ct() {
            var e = "<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'>" + St() + Mt() + "</table>";
            return e
        }

        function St() {
            var t, n, a, e = ft + "-widget-header",
                i = "";
            for (i += "<thead><tr>", vt ? (t = m(0, 0), n = b(t, yt), ht ? n += bt : n = bt + n, i += "<th class='fc-agenda-axis fc-week-number " + e + "'>" + Z(n) + "</th>") : i += "<th class='fc-agenda-axis " + e + "'>&nbsp;</th>", a = 0; st > a; a++) t = m(0, a), i += "<th class='fc-" + p[t.getDay()] + " fc-col" + a + " " + e + "'>" + Z(b(t, gt)) + "</th>";
            return i += "<th class='fc-agenda-gutter " + e + "'>&nbsp;</th>" + "</tr>" + "</thead>"
        }

        function Mt() {
            var i, a, s, r, o, e = ft + "-widget-header",
                t = ft + "-widget-content",
                n = w(new Date),
                l = "";
            for (l += "<tbody><tr><th class='fc-agenda-axis " + e + "'>&nbsp;</th>", s = "", a = 0; st > a; a++) i = m(0, a), o = ["fc-col" + a, "fc-" + p[i.getDay()], t], +i == +n ? o.push(ft + "-state-highlight", "fc-today") : n > i ? o.push("fc-past") : o.push("fc-future"), r = "<td class='" + o.join(" ") + "'>" + "<div>" + "<div class='fc-day-content'>" + "<div style='position:relative'>&nbsp;</div>" + "</div>" + "</div>" + "</td>", s += r;
            return l += s, l += "<td class='fc-agenda-gutter " + t + "'>&nbsp;</td>" + "</tr>" + "</tbody>"
        }

        function Pt(e) {
            e === t && (e = X), X = e, ut = {};
            var i = S.position().top,
                n = H.position().top,
                a = Math.min(e - i, B.height() + n + 1);
            A.height(a - q(M)), P.css("top", i), H.height(a - n - 1), tt = B.find("tr:first").height() + 1, nt = r("slotMinutes") / it, at = tt / nt
        }

        function Ft(t) {
            U = t, ct.clear(), dt.clear();
            var i = $.find("th:first");
            N && (i = i.add(N.find("th:first"))), i = i.add(B.find("th:first")), G = 0, I(i.width("").each(function (t, i) {
                G = Math.max(G, e(i).outerWidth())
            }), G);
            var n = x.find(".fc-agenda-gutter");
            N && (n = n.add(N.find("th.fc-agenda-gutter")));
            var a = H[0].clientWidth;
            et = H.width() - a, et ? (I(n, et), n.show().prev().removeClass("fc-last")) : n.hide().prev().addClass("fc-last"), K = Math.floor((a - G) / st), I(C.slice(0, -1), K)
        }

        function It() {
            function n() {
                H.scrollTop(i)
            }

            var e = j(),
                t = k(e);
            t.setHours(r("firstHour"));
            var i = Kt(e, t) + 1;
            n(), setTimeout(n, 0)
        }

        function Ot() {
            It()
        }

        function Nt(e) {
            e.click(Ht).mousedown(f)
        }

        function Lt(e) {
            e.click(Ht).mousedown(ni)
        }

        function Ht(e) {
            if (!r("selectable")) {
                var t = Math.min(st - 1, Math.floor((e.pageX - x.offset().left - G) / K)),
                    i = m(0, t),
                    n = this.parentNode.className.match(/fc-slot(\d+)/);
                if (n) {
                    var a = parseInt(n[1]) * r("slotMinutes"),
                        s = Math.floor(a / 60);
                    i.setHours(s), i.setMinutes(a % 60 + mt), o("dayClick", E[t], i, !1, e)
                } else o("dayClick", E[t], i, !0, e)
            }
        }

        function Rt(e, t, i) {
            i && ot.build();
            for (var n = g(e, t), a = 0; n.length > a; a++) {
                var s = n[a];
                Nt(qt(s.row, s.leftCol, s.row, s.rightCol))
            }
        }

        function qt(e, t, i, n) {
            var a = ot.rect(e, t, i, n, P);
            return l(a, P)
        }

        function Wt(e, t) {
            for (var i = 0; st > i; i++) {
                var n = m(0, i),
                    a = v(k(n), 1),
                    s = new Date(Math.max(n, e)),
                    r = new Date(Math.min(a, t));
                if (r > s) {
                    var o = ot.rect(0, i, 0, i, R),
                        c = Kt(n, s),
                        d = Kt(n, r);
                    o.top = c, o.height = d - c, Lt(l(o, R))
                }
            }
        }

        function Bt(e) {
            return ct.left(e)
        }

        function Yt(e) {
            return dt.left(e)
        }

        function Ut(e) {
            return ct.right(e)
        }

        function Vt(e) {
            return dt.right(e)
        }

        function Xt(e) {
            return r("allDaySlot") && !e.row
        }

        function Gt(e) {
            var t = m(0, e.col),
                i = e.row;
            return r("allDaySlot") && i--, i >= 0 && y(t, mt + i * it), t
        }

        function Kt(e, i) {
            if (e = k(e, !0), y(k(e), mt) > i) return 0;
            if (i >= y(k(e), _t)) return B.height();
            var n = r("slotMinutes"),
                a = 60 * i.getHours() + i.getMinutes() - mt,
                s = Math.floor(a / n),
                o = ut[s];
            return o === t && (o = ut[s] = B.find("tr").eq(s).find("td div")[0].offsetTop), Math.max(0, Math.round(o - 1 + tt * (a % n / n)))
        }

        function Zt() {
            return L
        }

        function Qt(e) {
            var t = k(e.start);
            return e.allDay ? t : y(t, r("defaultEventMinutes"))
        }

        function Jt(e, t) {
            return t ? k(e) : y(k(e), r("slotMinutes"))
        }

        function ei(e, t, i) {
            i ? r("allDaySlot") && Rt(e, v(k(t), 1), !0) : ti(e, t)
        }

        function ti(t, i) {
            var n = r("selectHelper");
            if (ot.build(), n) {
                var a = _(t).col;
                if (a >= 0 && st > a) {
                    var s = ot.rect(0, a, 0, a, R),
                        o = Kt(t, t),
                        l = Kt(t, i);
                    if (l > o) {
                        if (s.top = o, s.height = l - o, s.left += 2, s.width -= 5, e.isFunction(n)) {
                            var c = n(t, i);
                            c && (s.position = "absolute", Y = e(c).css(s).appendTo(R))
                        } else s.isStart = !0, s.isEnd = !0, Y = e(h({
                            title: "",
                            start: t,
                            end: i,
                            className: ["fc-select-helper"],
                            editable: !1
                        }, s)), Y.css("opacity", r("dragOpacity"));
                        Y && (Lt(Y), R.append(Y), I(Y, s.width, !0), O(Y, s.height, !0))
                    }
                }
            } else Wt(t, i)
        }

        function ii() {
            c(), Y && (Y.remove(), Y = null)
        }

        function ni(t) {
            if (1 == t.which && r("selectable")) {
                u(t);
                var i;
                lt.start(function (e, t) {
                    if (ii(), e && e.col == t.col && !Xt(e)) {
                        var n = Gt(t),
                            a = Gt(e);
                        i = [n, y(k(n), it), a, y(k(a), it)].sort(V), ti(i[0], i[3])
                    } else i = null
                }, t), e(document).one("mouseup", function (e) {
                    lt.stop(), i && (+i[0] == +i[1] && ai(i[0], !1, e), d(i[0], i[3], !1, e))
                })
            }
        }

        function ai(e, t, i) {
            o("dayClick", E[_(e).col], e, t, i)
        }

        function si(e, t) {
            lt.start(function (e) {
                if (c(), e)
                    if (Xt(e)) qt(e.row, e.col, e.row, e.col);
                    else {
                        var t = Gt(e),
                            i = y(k(t), r("defaultEventMinutes"));
                        Wt(t, i)
                    }
            }, t)
        }

        function ri(e, t, i) {
            var n = lt.stop();
            c(), n && o("drop", e, Gt(n), Xt(n), t, i)
        }

        var s = this;
        s.renderAgenda = wt, s.setWidth = Ft, s.setHeight = Pt, s.afterRender = Ot, s.defaultEventEnd = Qt, s.timePosition = Kt, s.getIsCellAllDay = Xt, s.allDayRow = Zt, s.getCoordinateGrid = function () {
            return ot
        }, s.getHoverListener = function () {
            return lt
        }, s.colLeft = Bt, s.colRight = Ut, s.colContentLeft = Yt, s.colContentRight = Vt, s.getDaySegmentContainer = function () {
            return F
        }, s.getSlotSegmentContainer = function () {
            return W
        }, s.getMinMinute = function () {
            return mt
        }, s.getMaxMinute = function () {
            return _t
        }, s.getSlotContainer = function () {
            return R
        }, s.getRowCnt = function () {
            return 1
        }, s.getColCnt = function () {
            return st
        }, s.getColWidth = function () {
            return K
        }, s.getSnapHeight = function () {
            return at
        }, s.getSnapMinutes = function () {
            return it
        }, s.defaultSelectionEnd = Jt, s.renderDayOverlay = Rt, s.renderSelection = ei, s.clearSelection = ii, s.reportDayClick = ai, s.dragStart = si, s.dragStop = ri, jt.call(s, i, n, a), Et.call(s), Dt.call(s), pt.call(s);
        var x, $, C, S, E, T, z, M, A, P, F, N, L, H, R, W, B, Y, U, X, G, K, et, tt, it, nt, at, st, rt, ot, lt, ct, dt, ft, ht, mt, _t, gt, vt, bt, yt, r = s.opt,
            o = s.trigger,
            l = s.renderOverlay,
            c = s.clearOverlays,
            d = s.reportSelection,
            u = s.unselect,
            f = s.daySelectionMousedown,
            h = s.slotSegHtml,
            m = s.cellToDate,
            _ = s.dateToCell,
            g = s.rangeToSegments,
            b = n.formatDate,
            ut = {};
        Q(i.addClass("fc-agenda")), ot = new Tt(function (t, i) {
            function d(e) {
                return Math.max(l, Math.min(c, e))
            }

            var n, a, s;
            C.each(function (t, r) {
                n = e(r), a = n.offset().left, t && (s[1] = a), s = [a], i[t] = s
            }), s[1] = a + n.outerWidth(), r("allDaySlot") && (n = L, a = n.offset().top, t[0] = [a, a + n.outerHeight()]);
            for (var o = R.offset().top, l = H.offset().top, c = l + H.outerHeight(), u = 0; rt * nt > u; u++) t.push([d(o + at * u), d(o + at * (u + 1))])
        }), lt = new zt(ot), ct = new At(function (e) {
            return T.eq(e)
        }), dt = new At(function (e) {
            return z.eq(e)
        })
    }

    function pt() {
        function U(e, t) {
            var i, a = e.length,
                s = [],
                r = [];
            for (i = 0; a > i; i++) e[i].allDay ? s.push(e[i]) : r.push(e[i]);
            n("allDaySlot") && (R(s, t), c()), Q(X(r), t)
        }

        function V() {
            d().empty(), u().empty()
        }

        function X(t) {
            var s, o, l, c, d, i = $(),
                n = h(),
                a = f(),
                r = e.map(t, K),
                u = [];
            for (o = 0; i > o; o++)
                for (s = j(0, o), y(s, n), d = G(t, r, s, y(k(s), a - n)), d = ft(d), l = 0; d.length > l; l++) c = d[l], c.col = o, u.push(c);
            return u
        }

        function G(e, t, i, n) {
            var s, o, l, c, d, u, p, f, a = [],
                r = e.length;
            for (s = 0; r > s; s++) o = e[s], l = o.start, c = t[s], c > i && n > l && (i > l ? (d = k(i), p = !1) : (d = l, p = !0), c > n ? (u = k(n), f = !1) : (u = c, f = !0), a.push({
                event: o,
                start: d,
                end: u,
                isStart: p,
                isEnd: f
            }));
            return a.sort(kt)
        }

        function K(e) {
            return e.end ? k(e.end) : y(k(e.start), n("defaultEventMinutes"))
        }

        function Q(i, s) {
            var r, l, c, d, p, f, h, m, g, v, y, j, x, $, C, S, o = i.length,
                k = "",
                D = u(),
                E = n("isRTL");
            for (r = 0; o > r; r++) l = i[r], c = l.event, d = _(l.start, l.start), p = _(l.start, l.end), f = b(l.col), h = w(l.col), m = h - f, h -= .025 * m, m = h - f, g = m * (l.forwardCoord - l.backwardCoord), n("slotEventOverlap") && (g = Math.max(2 * (g - 10), g)), E ? (y = h - l.backwardCoord * m, v = y - g) : (v = f + l.backwardCoord * m, y = v + g), v = Math.max(v, f), y = Math.min(y, h), g = y - v, l.top = d, l.left = v, l.outerWidth = g, l.outerHeight = p - d, k += J(c, l);
            for (D[0].innerHTML = k, j = D.children(), r = 0; o > r; r++) l = i[r], c = l.event, x = e(j[r]), $ = a("eventRender", c, c, x), $ === !1 ? x.remove() : ($ && $ !== !0 && (x.remove(), x = e($).css({
                position: "absolute",
                top: l.top,
                left: l.left
            }).appendTo(D)), l.element = x, c._id === s ? et(c, x, l) : x[0]._fci = r, T(c, x));
            for (F(D, i, et), r = 0; o > r; r++) l = i[r], (x = l.element) && (l.vsides = q(x, !0), l.hsides = N(x, !0), C = x.find(".fc-event-title"), C.length && (l.contentTop = C[0].offsetTop));
            for (r = 0; o > r; r++) l = i[r], (x = l.element) && (x[0].style.width = Math.max(0, l.outerWidth - l.hsides) + "px", S = Math.max(0, l.outerHeight - l.vsides), x[0].style.height = S + "px", c = l.event, l.contentTop !== t && 10 > S - l.contentTop && (x.find("div.fc-event-time").text(B(c.start, n("timeFormat")) + " - " + c.title), x.find("div.fc-event-title").remove()), a("eventAfterRender", c, c, x))
        }

        function J(e, t) {
            var i = "<",
                a = e.url,
                o = tt(e, n),
                l = ["fc-event", "fc-event-vert"];
            return s(e) && l.push("fc-event-draggable"), t.isStart && l.push("fc-event-start"), t.isEnd && l.push("fc-event-end"), l = l.concat(e.className), e.source && (l = l.concat(e.source.className || [])), i += a ? "a href='" + Z(e.url) + "'" : "div", i += " class='" + l.join(" ") + "'" + " style=" + "'" + "position:absolute;" + "top:" + t.top + "px;" + "left:" + t.left + "px;" + o + "'" + ">" + "<div class='fc-event-inner'>" + "<div class='fc-event-time'>" + Z(Y(e.start, e.end, n("timeFormat"))) + "</div>" + "<div class='fc-event-title'>" + Z(e.title || "") + "</div>" + "</div>" + "<div class='fc-event-bg'></div>", t.isEnd && r(e) && (i += "<div class='ui-resizable-handle ui-resizable-s'>=</div>"), i += "</" + (a ? "a" : "div") + ">"
        }

        function et(e, t, i) {
            var n = t.find("div.fc-event-time");
            s(e) && nt(e, t, n), i.isEnd && r(e) && at(e, t, n), l(e, t)
        }

        function it(e, t, i) {
            function b() {
                l || (t.width(r).height("").draggable("option", "grid", null), l = !0)
            }

            var r, o, c, s = i.isStart,
                l = !0,
                d = p(),
                u = C(),
                f = S(),
                _ = D(),
                g = h();
            t.draggable({
                opacity: n("dragOpacity", "month"),
                revertDuration: n("dragRevertDuration"),
                start: function (i, p) {
                    a("eventDragStart", t, e, i, p), M(e, t), r = t.width(), d.start(function (i, a) {
                        if (H(), i) {
                            o = !1;
                            var r = j(0, a.col),
                                d = j(0, i.col);
                            c = x(d, r), i.row ? s ? l && (t.width(u - 10), O(t, f * Math.round((e.end ? (e.end - e.start) / m : n("defaultEventMinutes")) / _)), t.draggable("option", "grid", [u, 1]), l = !1) : o = !0 : (L(v(k(e.start), c), v(A(e), c)), b()), o = o || l && !c
                        } else b(), o = !0;
                        t.draggable("option", "revert", o)
                    }, i, "drag")
                },
                stop: function (i, n) {
                    if (d.stop(), H(), a("eventDragStop", t, e, i, n), o) b(), t.css("filter", ""), z(e, t);
                    else {
                        var s = 0;
                        l || (s = Math.round((t.offset().top - E().offset().top) / f) * _ + g - (60 * e.start.getHours() + e.start.getMinutes())), P(this, e, c, s, l, i, n)
                    }
                }
            })
        }

        function nt(e, t, s) {
            function I() {
                H(), f && (m ? (s.hide(), t.draggable("option", "grid", null), L(v(k(e.start), E), v(A(e), E))) : (O(T), s.css("display", ""), t.draggable("option", "grid", [l, c])))
            }

            function O(t) {
                var a, i = y(k(e.start), t);
                e.end && (a = y(k(e.end), t)), s.text(Y(i, a, n("timeFormat")))
            }

            var u, p, f, h, m, _, b, w, E, T, F, r = i.getCoordinateGrid(),
                o = $(),
                l = C(),
                c = S(),
                d = D();
            t.draggable({
                scroll: !1,
                grid: [l, c],
                axis: 1 == o ? "y" : !1,
                opacity: n("dragOpacity"),
                revertDuration: n("dragRevertDuration"),
                start: function (i, n) {
                    a("eventDragStart", t, e, i, n), M(e, t), r.build(), u = t.position(), p = r.cell(i.pageX, i.pageY), f = h = !0, m = _ = g(p), b = w = 0, E = 0, T = F = 0
                },
                drag: function (e, i) {
                    var n = r.cell(e.pageX, e.pageY);
                    if (f = !!n) {
                        if (m = g(n), b = Math.round((i.position.left - u.left) / l), b != w) {
                            var a = j(0, p.col),
                                s = p.col + b;
                            s = Math.max(0, s), s = Math.min(o - 1, s);
                            var v = j(0, s);
                            E = x(v, a)
                        }
                        m || (T = Math.round((i.position.top - u.top) / c) * d)
                    }
                    (f != h || m != _ || b != w || T != F) && (I(), h = f, _ = m, w = b, F = T), t.draggable("option", "revert", !f)
                },
                stop: function (i, n) {
                    H(), a("eventDragStop", t, e, i, n), f && (m || E || T) ? P(this, e, E, m ? 0 : T, m, i, n) : (f = !0, m = !1, b = 0, E = 0, T = 0, I(), t.css("filter", ""), t.css(u), z(e, t))
                }
            })
        }

        function at(e, t, i) {
            var s, r, l = S(),
                c = D();
            t.resizable({
                handles: {
                    s: ".ui-resizable-handle"
                },
                grid: l,
                start: function (i, n) {
                    s = r = 0, M(e, t), a("eventResizeStart", this, e, i, n)
                },
                resize: function (a, d) {
                    s = Math.round((Math.max(l, t.height()) - d.originalSize.height) / l), s != r && (i.text(Y(e.start, s || e.end ? y(o(e), c * s) : null, n("timeFormat"))), r = s)
                },
                stop: function (i, n) {
                    a("eventResizeStop", this, e, i, n), s ? I(this, e, 0, c * s, i, n) : z(e, t)
                }
            })
        }

        var i = this;
        i.renderEvents = U, i.clearEvents = V, i.slotSegHtml = J, xt.call(i);
        var n = i.opt,
            a = i.trigger,
            s = i.isEventDraggable,
            r = i.isEventResizable,
            o = i.eventEnd,
            l = i.eventElementHandlers,
            c = i.setHeight,
            d = i.getDaySegmentContainer,
            u = i.getSlotSegmentContainer,
            p = i.getHoverListener,
            f = i.getMaxMinute,
            h = i.getMinMinute,
            _ = i.timePosition,
            g = i.getIsCellAllDay,
            b = i.colContentLeft,
            w = i.colContentRight,
            j = i.cellToDate,
            $ = i.getColCnt,
            C = i.getColWidth,
            S = i.getSnapHeight,
            D = i.getSnapMinutes,
            E = i.getSlotContainer,
            T = i.reportEventElement,
            z = i.showEvents,
            M = i.hideEvents,
            P = i.eventDrop,
            I = i.eventResize,
            L = i.renderDayOverlay,
            H = i.clearOverlays,
            R = i.renderDayEvents,
            W = i.calendar,
            B = W.formatDate,
            Y = W.formatDates;
        i.draggableDayEvent = it
    }

    function ft(e) {
        var n, t = ht(e),
            i = t[0];
        if (mt(t), i) {
            for (n = 0; i.length > n; n++) _t(i[n]);
            for (n = 0; i.length > n; n++) gt(i[n], 0, 0)
        }
        return vt(t)
    }

    function ht(e) {
        var i, n, a, t = [];
        for (i = 0; e.length > i; i++) {
            for (n = e[i], a = 0; t.length > a && bt(n, t[a]).length; a++);
            (t[a] || (t[a] = [])).push(n)
        }
        return t
    }

    function mt(e) {
        var t, i, n, a, s;
        for (t = 0; e.length > t; t++)
            for (i = e[t], n = 0; i.length > n; n++)
                for (a = i[n], a.forwardSegs = [], s = t + 1; e.length > s; s++) bt(a, e[s], a.forwardSegs)
    }

    function _t(e) {
        var a, s, i = e.forwardSegs,
            n = 0;
        if (e.forwardPressure === t) {
            for (a = 0; i.length > a; a++) s = i[a], _t(s), n = Math.max(n, 1 + s.forwardPressure);
            e.forwardPressure = n
        }
    }

    function gt(e, i, n) {
        var s, a = e.forwardSegs;
        if (e.forwardCoord === t)
            for (a.length ? (a.sort(wt), gt(a[0], i + 1, n), e.forwardCoord = a[0].backwardCoord) : e.forwardCoord = 1, e.backwardCoord = e.forwardCoord - (e.forwardCoord - n) / (i + 1), s = 0; a.length > s; s++) gt(a[s], 0, e.forwardCoord)
    }

    function vt(e) {
        var i, n, a, t = [];
        for (i = 0; e.length > i; i++)
            for (n = e[i], a = 0; n.length > a; a++) t.push(n[a]);
        return t
    }

    function bt(e, t, i) {
        i = i || [];
        for (var n = 0; t.length > n; n++) yt(e, t[n]) && i.push(t[n]);
        return i
    }

    function yt(e, t) {
        return e.end > t.start && t.end > e.start
    }

    function wt(e, t) {
        return t.forwardPressure - e.forwardPressure || (e.backwardCoord || 0) - (t.backwardCoord || 0) || kt(e, t)
    }

    function kt(e, t) {
        return e.start - t.start || t.end - t.start - (e.end - e.start) || (e.event.title || "").localeCompare(t.event.title)
    }

    function jt(i, n, a) {
        function f(t, i) {
            var n = p[t];
            return e.isPlainObject(n) ? K(n, i || a) : n
        }

        function h(e, t) {
            return n.trigger.apply(n, [e, t || s].concat(Array.prototype.slice.call(arguments, 2), [s]))
        }

        function m(e) {
            var t = e.source || {};
            return nt(e.startEditable, t.startEditable, f("eventStartEditable"), e.editable, t.editable, f("editable")) && !f("disableDragging")
        }

        function _(e) {
            var t = e.source || {};
            return nt(e.durationEditable, t.durationEditable, f("eventDurationEditable"), e.editable, t.editable, f("editable")) && !f("disableResizing")
        }

        function g(e) {
            c = {};
            var t, n, i = e.length;
            for (t = 0; i > t; t++) n = e[t], c[n._id] ? c[n._id].push(n) : c[n._id] = [n]
        }

        function b() {
            c = {}, d = {}, u = []
        }

        function w(e) {
            return e.end ? k(e.end) : r(e)
        }

        function j(e, t) {
            u.push({
                event: e,
                element: t
            }), d[e._id] ? d[e._id].push(t) : d[e._id] = [t]
        }

        function $() {
            e.each(u, function (e, t) {
                s.trigger("eventDestroy", t.event, t.event, t.element)
            })
        }

        function C(e, t) {
            t.click(function (i) {
                return t.hasClass("ui-draggable-dragging") || t.hasClass("ui-resizable-resizing") ? void 0 : h("eventClick", this, e, i)
            }).hover(function (t) {
                h("eventMouseover", this, e, t)
            }, function (t) {
                h("eventMouseout", this, e, t)
            })
        }

        function S(e, t) {
            E(e, t, "show")
        }

        function D(e, t) {
            E(e, t, "hide")
        }

        function E(e, t, i) {
            var a, n = d[e._id],
                s = n.length;
            for (a = 0; s > a; a++) t && n[a][0] == t[0] || n[a][i]()
        }

        function T(e, t, i, n, a, s, r) {
            var o = t.allDay,
                d = t._id;
            M(c[d], i, n, a), h("eventDrop", e, t, i, n, a, function () {
                M(c[d], -i, -n, o), l(d)
            }, s, r), l(d)
        }

        function z(e, t, i, n, a, s) {
            var r = t._id;
            A(c[r], i, n), h("eventResize", e, t, i, n, function () {
                A(c[r], -i, -n), l(r)
            }, a, s), l(r)
        }

        function M(e, i, n, a) {
            n = n || 0;
            for (var s, r = e.length, l = 0; r > l; l++) s = e[l], a !== t && (s.allDay = a), y(v(s.start, i, !0), n), s.end && (s.end = y(v(s.end, i, !0), n)), o(s, p)
        }

        function A(e, t, i) {
            i = i || 0;
            for (var n, a = e.length, s = 0; a > s; s++) n = e[s], n.end = y(v(w(n), t, !0), i), o(n, p)
        }

        function H(e) {
            return "object" == typeof e && (e = e.getDay()), F[e]
        }

        function R() {
            return I
        }

        function q(e, t, i) {
            for (t = t || 1; F[(e.getDay() + (i ? t : 0) + 7) % 7];) v(e, t)
        }

        function W() {
            var e = B.apply(null, arguments),
                t = Y(e),
                i = U(t);
            return i
        }

        function B(e, t) {
            var i = s.getColCnt(),
                n = L ? -1 : 1,
                a = L ? i - 1 : 0;
            "object" == typeof e && (t = e.col, e = e.row);
            var r = e * i + (t * n + a);
            return r
        }

        function Y(e) {
            var t = s.visStart.getDay();
            return e += O[t], 7 * Math.floor(e / I) + N[(e % I + I) % I] - t
        }

        function U(e) {
            var t = k(s.visStart);
            return v(t, e), t
        }

        function V(e) {
            var t = X(e),
                i = G(t),
                n = Z(i);
            return n
        }

        function X(e) {
            return x(e, s.visStart)
        }

        function G(e) {
            var t = s.visStart.getDay();
            return e += t, Math.floor(e / 7) * I + O[(e % 7 + 7) % 7] - O[t]
        }

        function Z(e) {
            var t = s.getColCnt(),
                i = L ? -1 : 1,
                n = L ? t - 1 : 0,
                a = Math.floor(e / t),
                r = (e % t + t) % t * i + n;
            return {
                row: a,
                col: r
            }
        }

        function Q(e, t) {
            for (var i = s.getRowCnt(), n = s.getColCnt(), a = [], r = X(e), o = X(t), l = G(r), c = G(o) - 1, d = 0; i > d; d++) {
                var u = d * n,
                    p = u + n - 1,
                    f = Math.max(l, u),
                    h = Math.min(c, p);
                if (h >= f) {
                    var m = Z(f),
                        _ = Z(h),
                        g = [m.col, _.col].sort(),
                        v = Y(f) == r,
                        b = Y(h) + 1 == o;
                    a.push({
                        row: d,
                        leftCol: g[0],
                        rightCol: g[1],
                        isStart: v,
                        isEnd: b
                    })
                }
            }
            return a
        }

        var s = this;
        s.element = i, s.calendar = n, s.name = a, s.opt = f, s.trigger = h, s.isEventDraggable = m, s.isEventResizable = _, s.setEventData = g, s.clearEventData = b, s.eventEnd = w, s.reportEventElement = j, s.triggerEventDestroy = $, s.eventElementHandlers = C, s.showEvents = S, s.hideEvents = D, s.eventDrop = T, s.eventResize = z;
        var r = s.defaultEventEnd,
            o = n.normalizeEvent,
            l = n.reportEventChange,
            c = {},
            d = {},
            u = [],
            p = n.options;
        s.isHiddenDay = H, s.skipHiddenDays = q, s.getCellsPerWeek = R, s.dateToCell = V, s.dateToDayOffset = X, s.dayOffsetToCellOffset = G, s.cellOffsetToCell = Z, s.cellToDate = W, s.cellToCellOffset = B, s.cellOffsetToDayOffset = Y, s.dayOffsetToDate = U, s.rangeToSegments = Q;
        var I, P = f("hiddenDays") || [],
            F = [],
            O = [],
            N = [],
            L = f("isRTL");
        (function () {
            f("weekends") === !1 && P.push(0, 6);
            for (var t = 0, i = 0; 7 > t; t++) O[t] = i, F[t] = -1 != e.inArray(t, P), F[t] || (N[i] = t, i++);
            if (I = i, !I) throw "invalid hiddenDays"
        })()
    }

    function xt() {
        function H(e, t) {
            var i = q(e, !1, !0);
            Ct(i, function (e, t) {
                o(e.event, t)
            }), st(i, t), Ct(i, function (e, t) {
                n("eventAfterRender", e.event, e.event, t)
            })
        }

        function R(e, t, i) {
            var n = q([e], !0, !1),
                a = [];
            return Ct(n, function (e, n) {
                e.row === t && n.css("top", i), a.push(n[0])
            }), a
        }

        function q(t, i, n) {
            var o, l, a = $(),
                s = i ? e("<div/>") : a,
                r = W(t);
            return Y(r), o = U(r), s[0].innerHTML = o, l = s.children(), i && a.append(l), G(r, l), Ct(r, function (e, t) {
                e.hsides = N(t, !0)
            }), Ct(r, function (e, t) {
                t.width(Math.max(0, e.outerWidth - e.hsides))
            }), Ct(r, function (e, t) {
                e.outerHeight = t.outerHeight(!0)
            }), K(r, n), r
        }

        function W(e) {
            for (var t = [], i = 0; e.length > i; i++) {
                var n = B(e[i]);
                t.push.apply(t, n)
            }
            return t
        }

        function B(e) {
            for (var t = e.start, i = A(e), n = z(t, i), a = 0; n.length > a; a++) n[a].event = e;
            return n
        }

        function Y(e) {
            for (var t = i("isRTL"), n = 0; e.length > n; n++) {
                var a = e[n],
                    s = (t ? a.isEnd : a.isStart) ? y : g,
                    r = (t ? a.isStart : a.isEnd) ? w : b,
                    o = s(a.leftCol),
                    l = r(a.rightCol);
                a.left = o, a.outerWidth = l - o
            }
        }

        function U(e) {
            for (var t = "", i = 0; e.length > i; i++) t += V(e[i]);
            return t
        }

        function V(e) {
            var t = "",
                n = i("isRTL"),
                r = e.event,
                o = r.url,
                l = ["fc-event", "fc-event-hori"];
            a(r) && l.push("fc-event-draggable"), e.isStart && l.push("fc-event-start"), e.isEnd && l.push("fc-event-end"), l = l.concat(r.className), r.source && (l = l.concat(r.source.className || []));
            var c = tt(r, i);
            return t += o ? "<a href='" + Z(o) + "'" : "<div", t += " class='" + l.join(" ") + "'" + " style=" + "'" + "position:absolute;" + "left:" + e.left + "px;" + c + "'" + ">" + "<div class='fc-event-inner'>", !r.allDay && e.isStart && (t += "<span class='fc-event-time'>" + Z(C(r.start, r.end, i("timeFormat"))) + "</span>"), t += "<span class='fc-event-title'>" + Z(r.title || "") + "</span>" + "</div>", e.isEnd && s(r) && (t += "<div class='ui-resizable-handle ui-resizable-" + (n ? "w" : "e") + "'>" + "&nbsp;&nbsp;&nbsp;" + "</div>"), t += "</" + (o ? "a" : "div") + ">"
        }

        function G(t, i) {
            for (var a = 0; t.length > a; a++) {
                var s = t[a],
                    r = s.event,
                    o = i.eq(a),
                    l = n("eventRender", r, r, o);
                l === !1 ? o.remove() : (l && l !== !0 && (l = e(l).css({
                    position: "absolute",
                    left: s.left
                }), o.replaceWith(l), o = l), s.element = o)
            }
        }

        function K(e, t) {
            var i = J(e),
                n = at(),
                a = [];
            if (t)
                for (var s = 0; n.length > s; s++) n[s].height(i[s]);
            for (var s = 0; n.length > s; s++) a.push(n[s].position().top);
            Ct(e, function (e, t) {
                t.css("top", a[e.row] + e.top)
            })
        }

        function J(e) {
            for (var t = f(), i = h(), n = [], a = et(e), s = 0; t > s; s++) {
                for (var r = a[s], o = [], l = 0; i > l; l++) o.push(0);
                for (var c = 0; r.length > c; c++) {
                    var d = r[c];
                    d.top = X(o.slice(d.leftCol, d.rightCol + 1));
                    for (var l = d.leftCol; d.rightCol >= l; l++) o[l] = d.top + d.outerHeight
                }
                n.push(X(o))
            }
            return n
        }

        function et(e) {
            var n, a, s, t = f(),
                i = [];
            for (n = 0; e.length > n; n++) a = e[n], s = a.row, a.element && (i[s] ? i[s].push(a) : i[s] = [a]);
            for (s = 0; t > s; s++) i[s] = it(i[s] || []);
            return i
        }

        function it(e) {
            for (var t = [], i = nt(e), n = 0; i.length > n; n++) t.push.apply(t, i[n]);
            return t
        }

        function nt(e) {
            e.sort(St);
            for (var t = [], i = 0; e.length > i; i++) {
                for (var n = e[i], a = 0; t.length > a && $t(n, t[a]); a++);
                t[a] ? t[a].push(n) : t[a] = [n]
            }
            return t
        }

        function at() {
            var e, t = f(),
                i = [];
            for (e = 0; t > e; e++) i[e] = _(e).find("div.fc-day-content > div");
            return i
        }

        function st(e, t) {
            var i = $();
            Ct(e, function (e, i, n) {
                var a = e.event;
                a._id === t ? rt(a, i, e) : i[0]._fci = n
            }), F(i, e, rt)
        }

        function rt(e, i, n) {
            a(e) && t.draggableDayEvent(e, i, n), n.isEnd && s(e) && t.resizableDayEvent(e, i, n), l(e, i)
        }

        function ot(e, t) {
            var s, a = T();
            t.draggable({
                delay: 50,
                opacity: i("dragOpacity"),
                revertDuration: i("dragRevertDuration"),
                start: function (i, r) {
                    n("eventDragStart", t, e, i, r), d(e, t), a.start(function (i, n, a, r) {
                        if (t.draggable("option", "revert", !i || !a && !r), D(), i) {
                            var o = M(n),
                                l = M(i);
                            s = x(l, o), S(v(k(e.start), s), v(A(e), s))
                        } else s = 0
                    }, i, "drag")
                },
                stop: function (i, r) {
                    a.stop(), D(), n("eventDragStop", t, e, i, r), s ? u(this, e, s, 0, e.allDay, i, r) : (t.css("filter", ""), c(e, t))
                }
            })
        }

        function lt(t, a, s) {
            var o = i("isRTL"),
                l = o ? "w" : "e",
                u = a.find(".ui-resizable-" + l),
                m = !1;
            Q(a), a.mousedown(function (e) {
                e.preventDefault()
            }).click(function (e) {
                m && (e.preventDefault(), e.stopImmediatePropagation())
            }), u.mousedown(function (i) {
                function j(i) {
                    n("eventResizeStop", this, t, i), e("body").css("cursor", ""), o.stop(), D(), b && p(this, t, b, 0, i), setTimeout(function () {
                        m = !1
                    }, 0)
                }

                if (1 == i.which) {
                    m = !0;
                    var o = T();
                    f(), h();
                    var b, y, g = a.css("top"),
                        w = e.extend({}, t),
                        k = L(O(t.start));
                    E(), e("body").css("cursor", l + "-resize").one("mouseup", j), n("eventResizeStart", this, t, i), o.start(function (i, n) {
                        if (i) {
                            var a = P(n),
                                o = P(i);
                            if (o = Math.max(o, k), b = I(o) - I(a)) {
                                w.end = v(r(t), b, !0);
                                var u = y;
                                y = R(w, s.row, g), y = e(y), y.find("*").css("cursor", l + "-resize"), u && u.remove(), d(t)
                            } else y && (c(t), y.remove(), y = null);
                            D(), S(t.start, v(A(t), b))
                        }
                    }, i)
                }
            })
        }

        var t = this;
        t.renderDayEvents = H, t.draggableDayEvent = ot, t.resizableDayEvent = lt;
        var i = t.opt,
            n = t.trigger,
            a = t.isEventDraggable,
            s = t.isEventResizable,
            r = t.eventEnd,
            o = t.reportEventElement,
            l = t.eventElementHandlers,
            c = t.showEvents,
            d = t.hideEvents,
            u = t.eventDrop,
            p = t.eventResize,
            f = t.getRowCnt,
            h = t.getColCnt;
        t.getColWidth;
        var _ = t.allDayRow,
            g = t.colLeft,
            b = t.colRight,
            y = t.colContentLeft,
            w = t.colContentRight;
        t.dateToCell;
        var $ = t.getDaySegmentContainer,
            C = t.calendar.formatDates,
            S = t.renderDayOverlay,
            D = t.clearOverlays,
            E = t.clearSelection,
            T = t.getHoverListener,
            z = t.rangeToSegments,
            M = t.cellToDate,
            P = t.cellToCellOffset,
            I = t.cellOffsetToDayOffset,
            O = t.dateToDayOffset,
            L = t.dayOffsetToCellOffset
    }

    function $t(e, t) {
        for (var i = 0; t.length > i; i++) {
            var n = t[i];
            if (e.rightCol >= n.leftCol && n.rightCol >= e.leftCol) return !0
        }
        return !1
    }

    function Ct(e, t) {
        for (var i = 0; e.length > i; i++) {
            var n = e[i],
                a = n.element;
            a && t(n, a, i)
        }
    }

    function St(e, t) {
        return t.rightCol - t.leftCol - (e.rightCol - e.leftCol) || t.event.allDay - e.event.allDay || e.event.start - t.event.start || (e.event.title || "").localeCompare(t.event.title)
    }

    function Dt() {
        function l(e, t, i) {
            c(), t || (t = a(e, i)), s(e, t, i), d(e, t, i)
        }

        function c(e) {
            o && (o = !1, r(), n("unselect", null, e))
        }

        function d(e, t, i, a) {
            o = !0, n("select", null, e, t, i, a)
        }

        function u(n) {
            var a = t.cellToDate,
                o = t.getIsCellAllDay,
                l = t.getHoverListener(),
                u = t.reportDayClick;
            if (1 == n.which && i("selectable")) {
                c(n);
                var f;
                l.start(function (e, t) {
                    r(), e && o(e) ? (f = [a(t), a(e)].sort(V), s(f[0], f[1], !0)) : f = null
                }, n), e(document).one("mouseup", function (e) {
                    l.stop(), f && (+f[0] == +f[1] && u(f[0], !0, e), d(f[0], f[1], !0, e))
                })
            }
        }

        var t = this;
        t.select = l, t.unselect = c, t.reportSelection = d, t.daySelectionMousedown = u;
        var i = t.opt,
            n = t.trigger,
            a = t.defaultSelectionEnd,
            s = t.renderSelection,
            r = t.clearSelection,
            o = !1;
        i("selectable") && i("unselectAuto") && e(document).mousedown(function (t) {
            var n = i("unselectCancel");
            n && e(t.target).parents(n).length || c(t)
        })
    }

    function Et() {
        function a(t, a) {
            var s = n.shift();
            return s || (s = e("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>")), s[0].parentNode != a[0] && s.appendTo(a), i.push(s.css(t).show()), s
        }

        function s() {
            for (var e; e = i.shift();) n.push(e.hide().unbind())
        }

        var t = this;
        t.renderOverlay = a, t.clearOverlays = s;
        var i = [],
            n = []
    }

    function Tt(e) {
        var i, n, t = this;
        t.build = function () {
            i = [], n = [], e(i, n)
        }, t.cell = function (e, t) {
            var r, a = i.length,
                s = n.length,
                o = -1,
                l = -1;
            for (r = 0; a > r; r++)
                if (t >= i[r][0] && i[r][1] > t) {
                    o = r;
                    break
                }
            for (r = 0; s > r; r++)
                if (e >= n[r][0] && n[r][1] > e) {
                    l = r;
                    break
                }
            return o >= 0 && l >= 0 ? {
                row: o,
                col: l
            } : null
        }, t.rect = function (e, t, a, s, r) {
            var o = r.offset();
            return {
                top: i[e][0] - o.top,
                left: n[t][0] - o.left,
                width: n[s][1] - n[t][0],
                height: i[a][1] - i[e][0]
            }
        }
    }

    function zt(t) {
        function o(e) {
            Mt(e);
            var i = t.cell(e.pageX, e.pageY);
            (!i != !r || i && (i.row != r.row || i.col != r.col)) && (i ? (s || (s = i), a(i, s, i.row - s.row, i.col - s.col)) : a(i, s), r = i)
        }

        var n, a, s, r, i = this;
        i.start = function (i, l, c) {
            a = i, s = r = null, t.build(), o(l), n = c || "mousemove", e(document).bind(n, o)
        }, i.stop = function () {
            return e(document).unbind(n, o), r
        }
    }

    function Mt(e) {
        e.pageX === t && (e.pageX = e.originalEvent.pageX, e.pageY = e.originalEvent.pageY)
    }

    function At(e) {
        function r(t) {
            return n[t] = n[t] || e(t)
        }

        var i = this,
            n = {},
            a = {},
            s = {};
        i.left = function (e) {
            return a[e] = a[e] === t ? r(e).position().left : a[e]
        }, i.right = function (e) {
            return s[e] = s[e] === t ? i.left(e) + r(e).width() : s[e]
        }, i.clear = function () {
            n = {}, a = {}, s = {}
        }
    }

    var i = {
            defaultView: "month",
            aspectRatio: 1.35,
            header: {
                left: "title",
                center: "",
                right: "today prev,next"
            },
            weekends: !0,
            weekNumbers: !1,
            weekNumberCalculation: "iso",
            weekNumberTitle: "W",
            allDayDefault: !0,
            ignoreTimezone: !0,
            lazyFetching: !0,
            startParam: "start",
            endParam: "end",
            titleFormat: {
                month: "MMMM yyyy",
                week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",
                day: "dddd, MMM d, yyyy"
            },
            columnFormat: {
                month: "ddd",
                week: "ddd M/d",
                day: "dddd M/d"
            },
            timeFormat: {
                "": "h(:mm)t"
            },
            isRTL: !1,
            firstDay: 0,
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            buttonText: {
                prev: "<span class='fc-text-arrow'>&lsaquo;</span>",
                next: "<span class='fc-text-arrow'>&rsaquo;</span>",
                prevYear: "<span class='fc-text-arrow'>&laquo;</span>",
                nextYear: "<span class='fc-text-arrow'>&raquo;</span>",
                today: "today",
                month: "month",
                week: "week",
                day: "day"
            },
            theme: !1,
            buttonIcons: {
                prev: "circle-triangle-w",
                next: "circle-triangle-e"
            },
            unselectAuto: !0,
            dropAccept: "*",
            handleWindowResize: !0
        },
        n = {
            header: {
                left: "next,prev today",
                center: "",
                right: "title"
            },
            buttonText: {
                prev: "<span class='fc-text-arrow'>&rsaquo;</span>",
                next: "<span class='fc-text-arrow'>&lsaquo;</span>",
                prevYear: "<span class='fc-text-arrow'>&raquo;</span>",
                nextYear: "<span class='fc-text-arrow'>&laquo;</span>"
            },
            buttonIcons: {
                prev: "circle-triangle-e",
                next: "circle-triangle-w"
            }
        },
        a = e.fullCalendar = {
            version: "1.6.4"
        },
        s = a.views = {};
    e.fn.fullCalendar = function (a) {
        if ("string" == typeof a) {
            var r, s = Array.prototype.slice.call(arguments, 1);
            return this.each(function () {
                var i = e.data(this, "fullCalendar");
                if (i && e.isFunction(i[a])) {
                    var n = i[a].apply(i, s);
                    r === t && (r = n), "destroy" == a && e.removeData(this, "fullCalendar")
                }
            }), r !== t ? r : this
        }
        a = a || {};
        var l = a.eventSources || [];
        return delete a.eventSources, a.events && (l.push(a.events), delete a.events), a = e.extend(!0, {}, i, a.isRTL || a.isRTL === t && i.isRTL ? n : {}, a), this.each(function (t, i) {
            var n = e(i),
                s = new o(n, a, l);
            n.data("fullCalendar", s), s.render()
        }), this
    }, a.sourceNormalizers = [], a.sourceFetchers = [];
    var c = {
            dataType: "json",
            cache: !1
        },
        d = 1;
    a.addDays = v, a.cloneDate = k, a.parseDate = C, a.parseISO8601 = S, a.parseTime = D, a.formatDate = E, a.formatDates = T;
    var p = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
        f = 864e5,
        h = 36e5,
        m = 6e4,
        z = {
            s: function (e) {
                return e.getSeconds()
            },
            ss: function (e) {
                return G(e.getSeconds())
            },
            m: function (e) {
                return e.getMinutes()
            },
            mm: function (e) {
                return G(e.getMinutes())
            },
            h: function (e) {
                return e.getHours() % 12 || 12
            },
            hh: function (e) {
                return G(e.getHours() % 12 || 12)
            },
            H: function (e) {
                return e.getHours()
            },
            HH: function (e) {
                return G(e.getHours())
            },
            d: function (e) {
                return e.getDate()
            },
            dd: function (e) {
                return G(e.getDate())
            },
            ddd: function (e, t) {
                return t.dayNamesShort[e.getDay()]
            },
            dddd: function (e, t) {
                return t.dayNames[e.getDay()]
            },
            M: function (e) {
                return e.getMonth() + 1
            },
            MM: function (e) {
                return G(e.getMonth() + 1)
            },
            MMM: function (e, t) {
                return t.monthNamesShort[e.getMonth()]
            },
            MMMM: function (e, t) {
                return t.monthNames[e.getMonth()]
            },
            yy: function (e) {
                return (e.getFullYear() + "").substring(2)
            },
            yyyy: function (e) {
                return e.getFullYear()
            },
            t: function (e) {
                return 12 > e.getHours() ? "a" : "p"
            },
            tt: function (e) {
                return 12 > e.getHours() ? "am" : "pm"
            },
            T: function (e) {
                return 12 > e.getHours() ? "A" : "P"
            },
            TT: function (e) {
                return 12 > e.getHours() ? "AM" : "PM"
            },
            u: function (e) {
                return E(e, "yyyy-MM-dd'T'HH:mm:ss'Z'")
            },
            S: function (e) {
                var t = e.getDate();
                return t > 10 && 20 > t ? "th" : ["st", "nd", "rd"][t % 10 - 1] || "th"
            },
            w: function (e, t) {
                return t.weekNumberCalculation(e)
            },
            W: function (e) {
                return M(e)
            }
        };
    a.dateFormatters = z, a.applyAll = it, s.month = at, s.basicWeek = st, s.basicDay = rt, r({
        weekMode: "fixed"
    }), s.agendaWeek = ct, s.agendaDay = dt, r({
        allDaySlot: !0,
        allDayText: "all-day",
        firstHour: 6,
        slotMinutes: 30,
        defaultEventMinutes: 120,
        axisFormat: "h(:mm)tt",
        timeFormat: {
            agenda: "h:mm{ - h:mm}"
        },
        dragOpacity: {
            agenda: .5
        },
        minTime: 0,
        maxTime: 24,
        slotEventOverlap: !0
    })
}(jQuery);


/*
 (function(factory) {
	if (typeof define === 'function' && define.amd) {
		define([ 'jquery', 'moment' ], factory);
	}
	else {
		factory(jQuery, moment);
	}
})(function($, moment) {

;;

var defaults = {

	lang: 'en',

	defaultTimedEventDuration: '02:00:00',
	defaultAllDayEventDuration: { days: 1 },
	forceEventDuration: false,
	nextDayThreshold: '09:00:00', // 9am

	// display
	defaultView: 'month',
	aspectRatio: 1.35,
	header: {
		left: 'title',
		center: '',
		right: 'today prev,next'
	},
	weekends: true,
	weekNumbers: false,

	weekNumberTitle: 'W',
	weekNumberCalculation: 'local',
	
	//editable: false,
	
	// event ajax
	lazyFetching: true,
	startParam: 'start',
	endParam: 'end',
	timezoneParam: 'timezone',

	timezone: false,

	//allDayDefault: undefined,
	
	// time formats
	titleFormat: {
		month: 'MMMM YYYY', // like "September 1986". each language will override this
		week: 'll', // like "Sep 4 1986"
		day: 'LL' // like "September 4 1986"
	},
	columnFormat: {
		month: 'ddd', // like "Sat"
		week: generateWeekColumnFormat,
		day: 'dddd' // like "Saturday"
	},
	timeFormat: { // for event elements
		'default': generateShortTimeFormat
	},

	displayEventEnd: {
		month: false,
		basicWeek: false,
		'default': true
	},
	
	// locale
	isRTL: false,
	defaultButtonText: {
		prev: "prev",
		next: "next",
		prevYear: "prev year",
		nextYear: "next year",
		today: 'today',
		month: 'month',
		week: 'week',
		day: 'day'
	},

	buttonIcons: {
		prev: 'left-single-arrow',
		next: 'right-single-arrow',
		prevYear: 'left-double-arrow',
		nextYear: 'right-double-arrow'
	},
	
	// jquery-ui theming
	theme: false,
	themeButtonIcons: {
		prev: 'circle-triangle-w',
		next: 'circle-triangle-e',
		prevYear: 'seek-prev',
		nextYear: 'seek-next'
	},
	
	//selectable: false,
	unselectAuto: true,
	
	dropAccept: '*',
	
	handleWindowResize: true,
	windowResizeDelay: 200 // milliseconds before a rerender happens
	
};


function generateShortTimeFormat(options, langData) {
	return langData.longDateFormat('LT')
		.replace(':mm', '(:mm)')
		.replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
		.replace(/\s*a$/i, 't'); // convert to AM/PM/am/pm to lowercase one-letter. remove any spaces beforehand
}


function generateWeekColumnFormat(options, langData) {
	var format = langData.longDateFormat('L'); // for the format like "MM/DD/YYYY"
	format = format.replace(/^Y+[^\w\s]*|[^\w\s]*Y+$/g, ''); // strip the year off the edge, as well as other misc non-whitespace chars
	if (options.isRTL) {
		format += ' ddd'; // for RTL, add day-of-week to end
	}
	else {
		format = 'ddd ' + format; // for LTR, add day-of-week to beginning
	}
	return format;
}


var langOptionHash = {
	en: {
		columnFormat: {
			week: 'ddd M/D' // override for english. different from the generated default, which is MM/DD
		}
	}
};


// right-to-left defaults
var rtlDefaults = {
	header: {
		left: 'next,prev today',
		center: '',
		right: 'title'
	},
	buttonIcons: {
		prev: 'right-single-arrow',
		next: 'left-single-arrow',
		prevYear: 'right-double-arrow',
		nextYear: 'left-double-arrow'
	},
	themeButtonIcons: {
		prev: 'circle-triangle-e',
		next: 'circle-triangle-w',
		nextYear: 'seek-prev',
		prevYear: 'seek-next'
	}
};



;;

var fc = $.fullCalendar = { version: "2.0.2" };
var fcViews = fc.views = {};


$.fn.fullCalendar = function(options) {
	var args = Array.prototype.slice.call(arguments, 1); // for a possible method call
	var res = this; // what this function will return (this jQuery object by default)

	this.each(function(i, _element) { // loop each DOM element involved
		var element = $(_element);
		var calendar = element.data('fullCalendar'); // get the existing calendar object (if any)
		var singleRes; // the returned value of this single method call

		// a method call
		if (typeof options === 'string') {
			if (calendar && $.isFunction(calendar[options])) {
				singleRes = calendar[options].apply(calendar, args);
				if (!i) {
					res = singleRes; // record the first method call result
				}
				if (options === 'destroy') { // for the destroy method, must remove Calendar object data
					element.removeData('fullCalendar');
				}
			}
		}
		// a new calendar initialization
		else if (!calendar) { // don't initialize twice
			calendar = new Calendar(element, options);
			element.data('fullCalendar', calendar);
			calendar.render();
		}
	});
	
	return res;
};


// function for adding/overriding defaults
function setDefaults(d) {
	mergeOptions(defaults, d);
}


// Recursively combines option hash-objects.
// Better than `$.extend(true, ...)` because arrays are not traversed/copied.
//
// called like:
//     mergeOptions(target, obj1, obj2, ...)
//
function mergeOptions(target) {

	function mergeIntoTarget(name, value) {
		if ($.isPlainObject(value) && $.isPlainObject(target[name]) && !isForcedAtomicOption(name)) {
			// merge into a new object to avoid destruction
			target[name] = mergeOptions({}, target[name], value); // combine. `value` object takes precedence
		}
		else if (value !== undefined) { // only use values that are set and not undefined
			target[name] = value;
		}
	}

	for (var i=1; i<arguments.length; i++) {
		$.each(arguments[i], mergeIntoTarget);
	}

	return target;
}


// overcome sucky view-option-hash and option-merging behavior messing with options it shouldn't
function isForcedAtomicOption(name) {
	// Any option that ends in "Time" or "Duration" is probably a Duration,
	// and these will commonly be specified as plain objects, which we don't want to mess up.
	return /(Time|Duration)$/.test(name);
}
// FIX: find a different solution for view-option-hashes and have a whitelist
// for options that can be recursively merged.

;;

//var langOptionHash = {}; // initialized in defaults.js
fc.langs = langOptionHash; // expose


// Initialize jQuery UI Datepicker translations while using some of the translations
// for our own purposes. Will set this as the default language for datepicker.
// Called from a translation file.
fc.datepickerLang = function(langCode, datepickerLangCode, options) {
	var langOptions = langOptionHash[langCode];

	// initialize FullCalendar's lang hash for this language
	if (!langOptions) {
		langOptions = langOptionHash[langCode] = {};
	}

	// merge certain Datepicker options into FullCalendar's options
	mergeOptions(langOptions, {
		isRTL: options.isRTL,
		weekNumberTitle: options.weekHeader,
		titleFormat: {
			month: options.showMonthAfterYear ?
				'YYYY[' + options.yearSuffix + '] MMMM' :
				'MMMM YYYY[' + options.yearSuffix + ']'
		},
		defaultButtonText: {
			// the translations sometimes wrongly contain HTML entities
			prev: stripHTMLEntities(options.prevText),
			next: stripHTMLEntities(options.nextText),
			today: stripHTMLEntities(options.currentText)
		}
	});

	// is jQuery UI Datepicker is on the page?
	if ($.datepicker) {

		// Register the language data.
		// FullCalendar and MomentJS use language codes like "pt-br" but Datepicker
		// does it like "pt-BR" or if it doesn't have the language, maybe just "pt".
		// Make an alias so the language can be referenced either way.
		$.datepicker.regional[datepickerLangCode] =
			$.datepicker.regional[langCode] = // alias
				options;

		// Alias 'en' to the default language data. Do this every time.
		$.datepicker.regional.en = $.datepicker.regional[''];

		// Set as Datepicker's global defaults.
		$.datepicker.setDefaults(options);
	}
};


// Sets FullCalendar-specific translations. Also sets the language as the global default.
// Called from a translation file.
fc.lang = function(langCode, options) {
	var langOptions;

	if (options) {
		langOptions = langOptionHash[langCode];

		// initialize the hash for this language
		if (!langOptions) {
			langOptions = langOptionHash[langCode] = {};
		}

		mergeOptions(langOptions, options || {});
	}

	// set it as the default language for FullCalendar
	defaults.lang = langCode;
};
;;

 
function Calendar(element, instanceOptions) {
	var t = this;



	// Build options object
	// -----------------------------------------------------------------------------------
	// Precedence (lowest to highest): defaults, rtlDefaults, langOptions, instanceOptions

	instanceOptions = instanceOptions || {};

	var options = mergeOptions({}, defaults, instanceOptions);
	var langOptions;

	// determine language options
	if (options.lang in langOptionHash) {
		langOptions = langOptionHash[options.lang];
	}
	else {
		langOptions = langOptionHash[defaults.lang];
	}

	if (langOptions) { // if language options exist, rebuild...
		options = mergeOptions({}, defaults, langOptions, instanceOptions);
	}

	if (options.isRTL) { // is isRTL, rebuild...
		options = mergeOptions({}, defaults, rtlDefaults, langOptions || {}, instanceOptions);
	}


	
	// Exports
	// -----------------------------------------------------------------------------------

	t.options = options;
	t.render = render;
	t.destroy = destroy;
	t.refetchEvents = refetchEvents;
	t.reportEvents = reportEvents;
	t.reportEventChange = reportEventChange;
	t.rerenderEvents = rerenderEvents;
	t.changeView = changeView;
	t.select = select;
	t.unselect = unselect;
	t.prev = prev;
	t.next = next;
	t.prevYear = prevYear;
	t.nextYear = nextYear;
	t.today = today;
	t.gotoDate = gotoDate;
	t.incrementDate = incrementDate;
	t.getDate = getDate;
	t.getCalendar = getCalendar;
	t.getView = getView;
	t.option = option;
	t.trigger = trigger;



	// Language-data Internals
	// -----------------------------------------------------------------------------------
	// Apply overrides to the current language's data

	var langData = createObject( // make a cheap clone
		moment.langData(options.lang)
	);

	if (options.monthNames) {
		langData._months = options.monthNames;
	}
	if (options.monthNamesShort) {
		langData._monthsShort = options.monthNamesShort;
	}
	if (options.dayNames) {
		langData._weekdays = options.dayNames;
	}
	if (options.dayNamesShort) {
		langData._weekdaysShort = options.dayNamesShort;
	}
	if (options.firstDay != null) {
		var _week = createObject(langData._week); // _week: { dow: # }
		_week.dow = options.firstDay;
		langData._week = _week;
	}



	// Calendar-specific Date Utilities
	// -----------------------------------------------------------------------------------


	t.defaultAllDayEventDuration = moment.duration(options.defaultAllDayEventDuration);
	t.defaultTimedEventDuration = moment.duration(options.defaultTimedEventDuration);


	// Builds a moment using the settings of the current calendar: timezone and language.
	// Accepts anything the vanilla moment() constructor accepts.
	t.moment = function() {
		var mom;

		if (options.timezone === 'local') {
			mom = fc.moment.apply(null, arguments);

			// Force the moment to be local, because fc.moment doesn't guarantee it.
			if (mom.hasTime()) { // don't give ambiguously-timed moments a local zone
				mom.local();
			}
		}
		else if (options.timezone === 'UTC') {
			mom = fc.moment.utc.apply(null, arguments); // process as UTC
		}
		else {
			mom = fc.moment.parseZone.apply(null, arguments); // let the input decide the zone
		}

		mom._lang = langData;

		return mom;
	};


	// Returns a boolean about whether or not the calendar knows how to calculate
	// the timezone offset of arbitrary dates in the current timezone.
	t.getIsAmbigTimezone = function() {
		return options.timezone !== 'local' && options.timezone !== 'UTC';
	};


	// Returns a copy of the given date in the current timezone of it is ambiguously zoned.
	// This will also give the date an unambiguous time.
	t.rezoneDate = function(date) {
		return t.moment(date.toArray());
	};


	// Returns a moment for the current date, as defined by the client's computer,
	// or overridden by the `now` option.
	t.getNow = function() {
		var now = options.now;
		if (typeof now === 'function') {
			now = now();
		}
		return t.moment(now);
	};


	// Calculates the week number for a moment according to the calendar's
	// `weekNumberCalculation` setting.
	t.calculateWeekNumber = function(mom) {
		var calc = options.weekNumberCalculation;

		if (typeof calc === 'function') {
			return calc(mom);
		}
		else if (calc === 'local') {
			return mom.week();
		}
		else if (calc.toUpperCase() === 'ISO') {
			return mom.isoWeek();
		}
	};


	// Get an event's normalized end date. If not present, calculate it from the defaults.
	t.getEventEnd = function(event) {
		if (event.end) {
			return event.end.clone();
		}
		else {
			return t.getDefaultEventEnd(event.allDay, event.start);
		}
	};


	// Given an event's allDay status and start date, return swhat its fallback end date should be.
	t.getDefaultEventEnd = function(allDay, start) { // TODO: rename to computeDefaultEventEnd
		var end = start.clone();

		if (allDay) {
			end.stripTime().add(t.defaultAllDayEventDuration);
		}
		else {
			end.add(t.defaultTimedEventDuration);
		}

		if (t.getIsAmbigTimezone()) {
			end.stripZone(); // we don't know what the tzo should be
		}

		return end;
	};



	// Date-formatting Utilities
	// -----------------------------------------------------------------------------------


	// Like the vanilla formatRange, but with calendar-specific settings applied.
	t.formatRange = function(m1, m2, formatStr) {

		// a function that returns a formatStr // TODO: in future, precompute this
		if (typeof formatStr === 'function') {
			formatStr = formatStr.call(t, options, langData);
		}

		return formatRange(m1, m2, formatStr, null, options.isRTL);
	};


	// Like the vanilla formatDate, but with calendar-specific settings applied.
	t.formatDate = function(mom, formatStr) {

		// a function that returns a formatStr // TODO: in future, precompute this
		if (typeof formatStr === 'function') {
			formatStr = formatStr.call(t, options, langData);
		}

		return formatDate(mom, formatStr);
	};


	
	// Imports
	// -----------------------------------------------------------------------------------


	EventManager.call(t, options);
	var isFetchNeeded = t.isFetchNeeded;
	var fetchEvents = t.fetchEvents;



	// Locals
	// -----------------------------------------------------------------------------------


	var _element = element[0];
	var header;
	var headerElement;
	var content;
	var tm; // for making theme classes
	var currentView;
	var elementOuterWidth;
	var suggestedViewHeight;
	var resizeUID = 0;
	var ignoreWindowResize = 0;
	var date;
	var events = [];
	var _dragElement;
	
	
	
	// Main Rendering
	// -----------------------------------------------------------------------------------


	if (options.defaultDate != null) {
		date = t.moment(options.defaultDate);
	}
	else {
		date = t.getNow();
	}
	
	
	function render(inc) {
		if (!content) {
			initialRender();
		}
		else if (elementVisible()) {
			// mainly for the public API
			calcSize();
			_renderView(inc);
		}
	}
	
	
	function initialRender() {
		tm = options.theme ? 'ui' : 'fc';
		element.addClass('fc');
		if (options.isRTL) {
			element.addClass('fc-rtl');
		}
		else {
			element.addClass('fc-ltr');
		}
		if (options.theme) {
			element.addClass('ui-widget');
		}

		content = $("<div class='fc-content' />")
			.prependTo(element);

		header = new Header(t, options);
		headerElement = header.render();
		if (headerElement) {
			element.prepend(headerElement);
		}

		changeView(options.defaultView);

		if (options.handleWindowResize) {
			$(window).resize(windowResize);
		}

		// needed for IE in a 0x0 iframe, b/c when it is resized, never triggers a windowResize
		if (!bodyVisible()) {
			lateRender();
		}
	}
	
	
	// called when we know the calendar couldn't be rendered when it was initialized,
	// but we think it's ready now
	function lateRender() {
		setTimeout(function() { // IE7 needs this so dimensions are calculated correctly
			if (!currentView.start && bodyVisible()) { // !currentView.start makes sure this never happens more than once
				renderView();
			}
		},0);
	}
	
	
	function destroy() {

		if (currentView) {
			trigger('viewDestroy', currentView, currentView, currentView.element);
			currentView.triggerEventDestroy();
		}

		$(window).unbind('resize', windowResize);

		if (options.droppable) {
			$(document)
				.off('dragstart', droppableDragStart)
				.off('dragstop', droppableDragStop);
		}

		if (currentView.selectionManagerDestroy) {
			currentView.selectionManagerDestroy();
		}

		header.destroy();
		content.remove();
		element.removeClass('fc fc-ltr fc-rtl ui-widget');
	}
	
	
	function elementVisible() {
		return element.is(':visible');
	}
	
	
	function bodyVisible() {
		return $('body').is(':visible');
	}
	
	

	// View Rendering
	// -----------------------------------------------------------------------------------
	

	function changeView(newViewName) {
		if (!currentView || newViewName != currentView.name) {
			_changeView(newViewName);
		}
	}


	function _changeView(newViewName) {
		ignoreWindowResize++;

		if (currentView) {
			trigger('viewDestroy', currentView, currentView, currentView.element);
			unselect();
			currentView.triggerEventDestroy(); // trigger 'eventDestroy' for each event
			freezeContentHeight();
			currentView.element.remove();
			header.deactivateButton(currentView.name);
		}

		header.activateButton(newViewName);

		currentView = new fcViews[newViewName](
			$("<div class='fc-view fc-view-" + newViewName + "' />")
				.appendTo(content),
			t // the calendar object
		);

		renderView();
		unfreezeContentHeight();

		ignoreWindowResize--;
	}


	function renderView(inc) {
		if (
			!currentView.start || // never rendered before
			inc || // explicit date window change
			!date.isWithin(currentView.intervalStart, currentView.intervalEnd) // implicit date window change
		) {
			if (elementVisible()) {
				_renderView(inc);
			}
		}
	}


	function _renderView(inc) { // assumes elementVisible
		ignoreWindowResize++;

		if (currentView.start) { // already been rendered?
			trigger('viewDestroy', currentView, currentView, currentView.element);
			unselect();
			clearEvents();
		}

		freezeContentHeight();
		if (inc) {
			date = currentView.incrementDate(date, inc);
		}
		currentView.render(date.clone()); // the view's render method ONLY renders the skeleton, nothing else
		setSize();
		unfreezeContentHeight();
		(currentView.afterRender || noop)();

		updateTitle();
		updateTodayButton();

		trigger('viewRender', currentView, currentView, currentView.element);

		ignoreWindowResize--;

		getAndRenderEvents();
	}
	
	

	// Resizing
	// -----------------------------------------------------------------------------------
	
	
	function updateSize() {
		if (elementVisible()) {
			unselect();
			clearEvents();
			calcSize();
			setSize();
			renderEvents();
		}
	}
	
	
	function calcSize() { // assumes elementVisible
		if (options.contentHeight) {
			suggestedViewHeight = options.contentHeight;
		}
		else if (options.height) {
			suggestedViewHeight = options.height - (headerElement ? headerElement.height() : 0) - vsides(content);
		}
		else {
			suggestedViewHeight = Math.round(content.width() / Math.max(options.aspectRatio, .5));
		}
	}
	
	
	function setSize() { // assumes elementVisible

		if (suggestedViewHeight === undefined) {
			calcSize(); // for first time
				// NOTE: we don't want to recalculate on every renderView because
				// it could result in oscillating heights due to scrollbars.
		}

		ignoreWindowResize++;
		currentView.setHeight(suggestedViewHeight);
		currentView.setWidth(content.width());
		ignoreWindowResize--;

		elementOuterWidth = element.outerWidth();
	}
	
	
	function windowResize(ev) {
		if (
			!ignoreWindowResize &&
			ev.target === window // so we don't process jqui "resize" events that have bubbled up
		) {
			if (currentView.start) { // view has already been rendered
				var uid = ++resizeUID;
				setTimeout(function() { // add a delay
					if (uid == resizeUID && !ignoreWindowResize && elementVisible()) {
						if (elementOuterWidth != (elementOuterWidth = element.outerWidth())) {
							ignoreWindowResize++; // in case the windowResize callback changes the height
							updateSize();
							currentView.trigger('windowResize', _element);
							ignoreWindowResize--;
						}
					}
				}, options.windowResizeDelay);
			}else{
				// calendar must have been initialized in a 0x0 iframe that has just been resized
				lateRender();
			}
		}
	}



 */
/* Event Fetching/Rendering
 -----------------------------------------------------------------------------*//*

 // TODO: going forward, most of this stuff should be directly handled by the view


	function refetchEvents() { // can be called as an API method
		clearEvents();
		fetchAndRenderEvents();
	}


	function rerenderEvents(modifiedEventID) { // can be called as an API method
		clearEvents();
		renderEvents(modifiedEventID);
	}


	function renderEvents(modifiedEventID) { // TODO: remove modifiedEventID hack
		if (elementVisible()) {
			currentView.renderEvents(events, modifiedEventID); // actually render the DOM elements
			currentView.trigger('eventAfterAllRender');
		}
	}


	function clearEvents() {
		currentView.triggerEventDestroy(); // trigger 'eventDestroy' for each event
		currentView.clearEvents(); // actually remove the DOM elements
		currentView.clearEventData(); // for View.js, TODO: unify with clearEvents
	}
	

	function getAndRenderEvents() {
		if (!options.lazyFetching || isFetchNeeded(currentView.start, currentView.end)) {
			fetchAndRenderEvents();
		}
		else {
			renderEvents();
		}
	}


	function fetchAndRenderEvents() {
		fetchEvents(currentView.start, currentView.end);
			// ... will call reportEvents
			// ... which will call renderEvents
	}

	
	// called when event data arrives
	function reportEvents(_events) {
		events = _events;
		renderEvents();
	}


	// called when a single event's data has been changed
	function reportEventChange(eventID) {
		rerenderEvents(eventID);
	}



 */
/* Header Updating
 -----------------------------------------------------------------------------*//*



 function updateTitle() {
		header.updateTitle(currentView.title);
	}


	function updateTodayButton() {
		var now = t.getNow();
		if (now.isWithin(currentView.intervalStart, currentView.intervalEnd)) {
			header.disableButton('today');
		}
		else {
			header.enableButton('today');
		}
	}



 */
/* Selection
 -----------------------------------------------------------------------------*//*



 function select(start, end) {
		currentView.select(start, end);
	}
	

	function unselect() { // safe to be called before renderView
		if (currentView) {
			currentView.unselect();
		}
	}



 */
/* Date
 -----------------------------------------------------------------------------*//*



 function prev() {
		renderView(-1);
	}
	
	
	function next() {
		renderView(1);
	}
	
	
	function prevYear() {
		date.add('years', -1);
		renderView();
	}
	
	
	function nextYear() {
		date.add('years', 1);
		renderView();
	}
	
	
	function today() {
		date = t.getNow();
		renderView();
	}
	
	
	function gotoDate(dateInput) {
		date = t.moment(dateInput);
		renderView();
	}
	
	
	function incrementDate(delta) {
		date.add(moment.duration(delta));
		renderView();
	}
	
	
	function getDate() {
		return date.clone();
	}



 */
/* Height "Freezing"
 -----------------------------------------------------------------------------*//*



 function freezeContentHeight() {
		content.css({
			width: '100%',
			height: content.height(),
			overflow: 'hidden'
		});
	}


	function unfreezeContentHeight() {
		content.css({
			width: '',
			height: '',
			overflow: ''
		});
	}



 */
/* Misc
 -----------------------------------------------------------------------------*//*



 function getCalendar() {
		return t;
	}

	
	function getView() {
		return currentView;
	}
	
	
	function option(name, value) {
		if (value === undefined) {
			return options[name];
		}
		if (name == 'height' || name == 'contentHeight' || name == 'aspectRatio') {
			options[name] = value;
			updateSize();
		}
	}
	
	
	function trigger(name, thisObj) {
		if (options[name]) {
			return options[name].apply(
				thisObj || _element,
				Array.prototype.slice.call(arguments, 2)
			);
		}
	}



 */
/* External Dragging
 ------------------------------------------------------------------------*//*


 if (options.droppable) {
		// TODO: unbind on destroy
		$(document)
			.on('dragstart', droppableDragStart)
			.on('dragstop', droppableDragStop);
		// this is undone in destroy
	}

	function droppableDragStart(ev, ui) {
		var _e = ev.target;
		var e = $(_e);
		if (!e.parents('.fc').length) { // not already inside a calendar
			var accept = options.dropAccept;
			if ($.isFunction(accept) ? accept.call(_e, e) : e.is(accept)) {
				_dragElement = _e;
				currentView.dragStart(_dragElement, ev, ui);
			}
		}
	}

	function droppableDragStop(ev, ui) {
		if (_dragElement) {
			currentView.dragStop(_dragElement, ev, ui);
			_dragElement = null;
		}
	}
	

}

;;

function Header(calendar, options) {
	var t = this;
	
	
	// exports
	t.render = render;
	t.destroy = destroy;
	t.updateTitle = updateTitle;
	t.activateButton = activateButton;
	t.deactivateButton = deactivateButton;
	t.disableButton = disableButton;
	t.enableButton = enableButton;
	
	
	// locals
	var element = $([]);
	var tm;
	


	function render() {
		tm = options.theme ? 'ui' : 'fc';
		var sections = options.header;
		if (sections) {
			element = $("<table class='fc-header' style='width:100%'/>")
				.append(
					$("<tr/>")
						.append(renderSection('left'))
						.append(renderSection('center'))
						.append(renderSection('right'))
				);
			return element;
		}
	}
	
	
	function destroy() {
		element.remove();
	}
	
	
	function renderSection(position) {
		var e = $("<td class='fc-header-" + position + "'/>");
		var buttonStr = options.header[position];
		if (buttonStr) {
			$.each(buttonStr.split(' '), function(i) {
				if (i > 0) {
					e.append("<span class='fc-header-space'/>");
				}
				var prevButton;
				$.each(this.split(','), function(j, buttonName) {
					if (buttonName == 'title') {
						e.append("<span class='fc-header-title'><h2>&nbsp;</h2></span>");
						if (prevButton) {
							prevButton.addClass(tm + '-corner-right');
						}
						prevButton = null;
					}else{
						var buttonClick;
						if (calendar[buttonName]) {
							buttonClick = calendar[buttonName]; // calendar method
						}
						else if (fcViews[buttonName]) {
							buttonClick = function() {
								button.removeClass(tm + '-state-hover'); // forget why
								calendar.changeView(buttonName);
							};
						}
						if (buttonClick) {

							// smartProperty allows different text per view button (ex: "Agenda Week" vs "Basic Week")
							var themeIcon = smartProperty(options.themeButtonIcons, buttonName);
							var normalIcon = smartProperty(options.buttonIcons, buttonName);
							var defaultText = smartProperty(options.defaultButtonText, buttonName);
							var customText = smartProperty(options.buttonText, buttonName);
							var html;

							if (customText) {
								html = htmlEscape(customText);
							}
							else if (themeIcon && options.theme) {
								html = "<span class='ui-icon ui-icon-" + themeIcon + "'></span>";
							}
							else if (normalIcon && !options.theme) {
								html = "<span class='fc-icon fc-icon-" + normalIcon + "'></span>";
							}
							else {
								html = htmlEscape(defaultText || buttonName);
							}

							var button = $(
								"<span class='fc-button fc-button-" + buttonName + " " + tm + "-state-default'>" +
									html +
								"</span>"
								)
								.click(function() {
									if (!button.hasClass(tm + '-state-disabled')) {
										buttonClick();
									}
								})
								.mousedown(function() {
									button
										.not('.' + tm + '-state-active')
										.not('.' + tm + '-state-disabled')
										.addClass(tm + '-state-down');
								})
								.mouseup(function() {
									button.removeClass(tm + '-state-down');
								})
								.hover(
									function() {
										button
											.not('.' + tm + '-state-active')
											.not('.' + tm + '-state-disabled')
											.addClass(tm + '-state-hover');
									},
									function() {
										button
											.removeClass(tm + '-state-hover')
											.removeClass(tm + '-state-down');
									}
								)
								.appendTo(e);
							disableTextSelection(button);
							if (!prevButton) {
								button.addClass(tm + '-corner-left');
							}
							prevButton = button;
						}
					}
				});
				if (prevButton) {
					prevButton.addClass(tm + '-corner-right');
				}
			});
		}
		return e;
	}
	
	
	function updateTitle(html) {
		element.find('h2')
			.html(html);
	}
	
	
	function activateButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-active');
	}
	
	
	function deactivateButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-active');
	}
	
	
	function disableButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-disabled');
	}
	
	
	function enableButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-disabled');
	}


}

;;

fc.sourceNormalizers = [];
fc.sourceFetchers = [];

var ajaxDefaults = {
	dataType: 'json',
	cache: false
};

var eventGUID = 1;


function EventManager(options) { // assumed to be a calendar
	var t = this;
	
	
	// exports
	t.isFetchNeeded = isFetchNeeded;
	t.fetchEvents = fetchEvents;
	t.addEventSource = addEventSource;
	t.removeEventSource = removeEventSource;
	t.updateEvent = updateEvent;
	t.renderEvent = renderEvent;
	t.removeEvents = removeEvents;
	t.clientEvents = clientEvents;
	t.mutateEvent = mutateEvent;
	
	
	// imports
	var trigger = t.trigger;
	var getView = t.getView;
	var reportEvents = t.reportEvents;
	var getEventEnd = t.getEventEnd;
	
	
	// locals
	var stickySource = { events: [] };
	var sources = [ stickySource ];
	var rangeStart, rangeEnd;
	var currentFetchID = 0;
	var pendingSourceCnt = 0;
	var loadingLevel = 0;
	var cache = [];


	$.each(
		(options.events ? [ options.events ] : []).concat(options.eventSources || []),
		function(i, sourceInput) {
			var source = buildEventSource(sourceInput);
			if (source) {
				sources.push(source);
			}
		}
	);



 */
/* Fetching
 -----------------------------------------------------------------------------*//*



 function isFetchNeeded(start, end) {
		return !rangeStart || // nothing has been fetched yet?
			// or, a part of the new range is outside of the old range? (after normalizing)
			start.clone().stripZone() < rangeStart.clone().stripZone() ||
			end.clone().stripZone() > rangeEnd.clone().stripZone();
	}
	
	
	function fetchEvents(start, end) {
		rangeStart = start;
		rangeEnd = end;
		cache = [];
		var fetchID = ++currentFetchID;
		var len = sources.length;
		pendingSourceCnt = len;
		for (var i=0; i<len; i++) {
			fetchEventSource(sources[i], fetchID);
		}
	}
	
	
	function fetchEventSource(source, fetchID) {
		_fetchEventSource(source, function(events) {
			var isArraySource = $.isArray(source.events);
			var i;
			var event;

			if (fetchID == currentFetchID) {

				if (events) {
					for (i=0; i<events.length; i++) {
						event = events[i];

						// event array sources have already been convert to Event Objects
						if (!isArraySource) {
							event = buildEvent(event, source);
						}

						if (event) {
							cache.push(event);
						}
					}
				}

				pendingSourceCnt--;
				if (!pendingSourceCnt) {
					reportEvents(cache);
				}
			}
		});
	}
	
	
	function _fetchEventSource(source, callback) {
		var i;
		var fetchers = fc.sourceFetchers;
		var res;

		for (i=0; i<fetchers.length; i++) {
			res = fetchers[i].call(
				t, // this, the Calendar object
				source,
				rangeStart.clone(),
				rangeEnd.clone(),
				options.timezone,
				callback
			);

			if (res === true) {
				// the fetcher is in charge. made its own async request
				return;
			}
			else if (typeof res == 'object') {
				// the fetcher returned a new source. process it
				_fetchEventSource(res, callback);
				return;
			}
		}

		var events = source.events;
		if (events) {
			if ($.isFunction(events)) {
				pushLoading();
				events.call(
					t, // this, the Calendar object
					rangeStart.clone(),
					rangeEnd.clone(),
					options.timezone,
					function(events) {
						callback(events);
						popLoading();
					}
				);
			}
			else if ($.isArray(events)) {
				callback(events);
			}
			else {
				callback();
			}
		}else{
			var url = source.url;
			if (url) {
				var success = source.success;
				var error = source.error;
				var complete = source.complete;

				// retrieve any outbound GET/POST $.ajax data from the options
				var customData;
				if ($.isFunction(source.data)) {
					// supplied as a function that returns a key/value object
					customData = source.data();
				}
				else {
					// supplied as a straight key/value object
					customData = source.data;
				}

				// use a copy of the custom data so we can modify the parameters
				// and not affect the passed-in object.
				var data = $.extend({}, customData || {});

				var startParam = firstDefined(source.startParam, options.startParam);
				var endParam = firstDefined(source.endParam, options.endParam);
				var timezoneParam = firstDefined(source.timezoneParam, options.timezoneParam);

				if (startParam) {
					data[startParam] = rangeStart.format();
				}
				if (endParam) {
					data[endParam] = rangeEnd.format();
				}
				if (options.timezone && options.timezone != 'local') {
					data[timezoneParam] = options.timezone;
				}

				pushLoading();
				$.ajax($.extend({}, ajaxDefaults, source, {
					data: data,
					success: function(events) {
						events = events || [];
						var res = applyAll(success, this, arguments);
						if ($.isArray(res)) {
							events = res;
						}
						callback(events);
					},
					error: function() {
						applyAll(error, this, arguments);
						callback();
					},
					complete: function() {
						applyAll(complete, this, arguments);
						popLoading();
					}
				}));
			}else{
				callback();
			}
		}
	}



 */
/* Sources
 -----------------------------------------------------------------------------*//*



 function addEventSource(sourceInput) {
		var source = buildEventSource(sourceInput);
		if (source) {
			sources.push(source);
			pendingSourceCnt++;
			fetchEventSource(source, currentFetchID); // will eventually call reportEvents
		}
	}


	function buildEventSource(sourceInput) { // will return undefined if invalid source
		var normalizers = fc.sourceNormalizers;
		var source;
		var i;

		if ($.isFunction(sourceInput) || $.isArray(sourceInput)) {
			source = { events: sourceInput };
		}
		else if (typeof sourceInput === 'string') {
			source = { url: sourceInput };
		}
		else if (typeof sourceInput === 'object') {
			source = $.extend({}, sourceInput); // shallow copy

			if (typeof source.className === 'string') {
				// TODO: repeat code, same code for event classNames
				source.className = source.className.split(/\s+/);
			}
		}

		if (source) {

			// for array sources, we convert to standard Event Objects up front
			if ($.isArray(source.events)) {
				source.events = $.map(source.events, function(eventInput) {
					return buildEvent(eventInput, source);
				});
			}

			for (i=0; i<normalizers.length; i++) {
				normalizers[i].call(t, source);
			}

			return source;
		}
	}


	function removeEventSource(source) {
		sources = $.grep(sources, function(src) {
			return !isSourcesEqual(src, source);
		});
		// remove all client events from that source
		cache = $.grep(cache, function(e) {
			return !isSourcesEqual(e.source, source);
		});
		reportEvents(cache);
	}


	function isSourcesEqual(source1, source2) {
		return source1 && source2 && getSourcePrimitive(source1) == getSourcePrimitive(source2);
	}


	function getSourcePrimitive(source) {
		return ((typeof source == 'object') ? (source.events || source.url) : '') || source;
	}



 */
/* Manipulation
 -----------------------------------------------------------------------------*//*



 function updateEvent(event) {

		event.start = t.moment(event.start);
		if (event.end) {
			event.end = t.moment(event.end);
		}

		mutateEvent(event);
		propagateMiscProperties(event);
		reportEvents(cache); // reports event modifications (so we can redraw)
	}


	var miscCopyableProps = [
		'title',
		'url',
		'allDay',
		'className',
		'editable',
		'color',
		'backgroundColor',
		'borderColor',
		'textColor'
	];

	function propagateMiscProperties(event) {
		var i;
		var cachedEvent;
		var j;
		var prop;

		for (i=0; i<cache.length; i++) {
			cachedEvent = cache[i];
			if (cachedEvent._id == event._id && cachedEvent !== event) {
				for (j=0; j<miscCopyableProps.length; j++) {
					prop = miscCopyableProps[j];
					if (event[prop] !== undefined) {
						cachedEvent[prop] = event[prop];
					}
				}
			}
		}
	}

	
	
	function renderEvent(eventData, stick) {
		var event = buildEvent(eventData);
		if (event) {
			if (!event.source) {
				if (stick) {
					stickySource.events.push(event);
					event.source = stickySource;
				}
				cache.push(event);
			}
			reportEvents(cache);
		}
	}
	
	
	function removeEvents(filter) {
		var eventID;
		var i;

		if (filter == null) { // null or undefined. remove all events
			filter = function() { return true; }; // will always match
		}
		else if (!$.isFunction(filter)) { // an event ID
			eventID = filter + '';
			filter = function(event) {
				return event._id == eventID;
			};
		}

		// Purge event(s) from our local cache
		cache = $.grep(cache, filter, true); // inverse=true

		// Remove events from array sources.
		// This works because they have been converted to official Event Objects up front.
		// (and as a result, event._id has been calculated).
		for (i=0; i<sources.length; i++) {
			if ($.isArray(sources[i].events)) {
				sources[i].events = $.grep(sources[i].events, filter, true);
			}
		}

		reportEvents(cache);
	}
	
	
	function clientEvents(filter) {
		if ($.isFunction(filter)) {
			return $.grep(cache, filter);
		}
		else if (filter != null) { // not null, not undefined. an event ID
			filter += '';
			return $.grep(cache, function(e) {
				return e._id == filter;
			});
		}
		return cache; // else, return all
	}



 */
/* Loading State
 -----------------------------------------------------------------------------*//*



 function pushLoading() {
		if (!(loadingLevel++)) {
			trigger('loading', null, true, getView());
		}
	}
	
	
	function popLoading() {
		if (!(--loadingLevel)) {
			trigger('loading', null, false, getView());
		}
	}



 */
/* Event Normalization
 -----------------------------------------------------------------------------*//*


 function buildEvent(data, source) { // source may be undefined!
		var out = {};
		var start;
		var end;
		var allDay;
		var allDayDefault;

		if (options.eventDataTransform) {
			data = options.eventDataTransform(data);
		}
		if (source && source.eventDataTransform) {
			data = source.eventDataTransform(data);
		}

		start = t.moment(data.start || data.date); // "date" is an alias for "start"
		if (!start.isValid()) {
			return;
		}

		end = null;
		if (data.end) {
			end = t.moment(data.end);
			if (!end.isValid()) {
				return;
			}
		}

		allDay = data.allDay;
		if (allDay === undefined) {
			allDayDefault = firstDefined(
				source ? source.allDayDefault : undefined,
				options.allDayDefault
			);
			if (allDayDefault !== undefined) {
				// use the default
				allDay = allDayDefault;
			}
			else {
				// all dates need to have ambig time for the event to be considered allDay
				allDay = !start.hasTime() && (!end || !end.hasTime());
			}
		}

		// normalize the date based on allDay
		if (allDay) {
			// neither date should have a time
			if (start.hasTime()) {
				start.stripTime();
			}
			if (end && end.hasTime()) {
				end.stripTime();
			}
		}
		else {
			// force a time/zone up the dates
			if (!start.hasTime()) {
				start = t.rezoneDate(start);
			}
			if (end && !end.hasTime()) {
				end = t.rezoneDate(end);
			}
		}

		// Copy all properties over to the resulting object.
		// The special-case properties will be copied over afterwards.
		$.extend(out, data);

		if (source) {
			out.source = source;
		}

		out._id = data._id || (data.id === undefined ? '_fc' + eventGUID++ : data.id + '');

		if (data.className) {
			if (typeof data.className == 'string') {
				out.className = data.className.split(/\s+/);
			}
			else { // assumed to be an array
				out.className = data.className;
			}
		}
		else {
			out.className = [];
		}

		out.allDay = allDay;
		out.start = start;
		out.end = end;

		if (options.forceEventDuration && !out.end) {
			out.end = getEventEnd(out);
		}

		backupEventDates(out);

		return out;
	}



 */
/* Event Modification Math
 -----------------------------------------------------------------------------------------*//*



 // Modify the date(s) of an event and make this change propagate to all other events with
	// the same ID (related repeating events).
	//
	// If `newStart`/`newEnd` are not specified, the "new" dates are assumed to be `event.start` and `event.end`.
	// The "old" dates to be compare against are always `event._start` and `event._end` (set by EventManager).
	//
	// Returns an object with delta information and a function to undo all operations.
	//
	function mutateEvent(event, newStart, newEnd) {
		var oldAllDay = event._allDay;
		var oldStart = event._start;
		var oldEnd = event._end;
		var clearEnd = false;
		var newAllDay;
		var dateDelta;
		var durationDelta;
		var undoFunc;

		// if no new dates were passed in, compare against the event's existing dates
		if (!newStart && !newEnd) {
			newStart = event.start;
			newEnd = event.end;
		}

		// NOTE: throughout this function, the initial values of `newStart` and `newEnd` are
		// preserved. These values may be undefined.

		// detect new allDay
		if (event.allDay != oldAllDay) { // if value has changed, use it
			newAllDay = event.allDay;
		}
		else { // otherwise, see if any of the new dates are allDay
			newAllDay = !(newStart || newEnd).hasTime();
		}

		// normalize the new dates based on allDay
		if (newAllDay) {
			if (newStart) {
				newStart = newStart.clone().stripTime();
			}
			if (newEnd) {
				newEnd = newEnd.clone().stripTime();
			}
		}

		// compute dateDelta
		if (newStart) {
			if (newAllDay) {
				dateDelta = dayishDiff(newStart, oldStart.clone().stripTime()); // treat oldStart as allDay
			}
			else {
				dateDelta = dayishDiff(newStart, oldStart);
			}
		}

		if (newAllDay != oldAllDay) {
			// if allDay has changed, always throw away the end
			clearEnd = true;
		}
		else if (newEnd) {
			durationDelta = dayishDiff(
				// new duration
				newEnd || t.getDefaultEventEnd(newAllDay, newStart || oldStart),
				newStart || oldStart
			).subtract(dayishDiff(
				// subtract old duration
				oldEnd || t.getDefaultEventEnd(oldAllDay, oldStart),
				oldStart
			));
		}

		undoFunc = mutateEvents(
			clientEvents(event._id), // get events with this ID
			clearEnd,
			newAllDay,
			dateDelta,
			durationDelta
		);

		return {
			dateDelta: dateDelta,
			durationDelta: durationDelta,
			undo: undoFunc
		};
	}


	// Modifies an array of events in the following ways (operations are in order):
	// - clear the event's `end`
	// - convert the event to allDay
	// - add `dateDelta` to the start and end
	// - add `durationDelta` to the event's duration
	//
	// Returns a function that can be called to undo all the operations.
	//
	function mutateEvents(events, clearEnd, forceAllDay, dateDelta, durationDelta) {
		var isAmbigTimezone = t.getIsAmbigTimezone();
		var undoFunctions = [];

		$.each(events, function(i, event) {
			var oldAllDay = event._allDay;
			var oldStart = event._start;
			var oldEnd = event._end;
			var newAllDay = forceAllDay != null ? forceAllDay : oldAllDay;
			var newStart = oldStart.clone();
			var newEnd = (!clearEnd && oldEnd) ? oldEnd.clone() : null;

			// NOTE: this function is responsible for transforming `newStart` and `newEnd`,
			// which were initialized to the OLD values first. `newEnd` may be null.

			// normlize newStart/newEnd to be consistent with newAllDay
			if (newAllDay) {
				newStart.stripTime();
				if (newEnd) {
					newEnd.stripTime();
				}
			}
			else {
				if (!newStart.hasTime()) {
					newStart = t.rezoneDate(newStart);
				}
				if (newEnd && !newEnd.hasTime()) {
					newEnd = t.rezoneDate(newEnd);
				}
			}

			// ensure we have an end date if necessary
			if (!newEnd && (options.forceEventDuration || +durationDelta)) {
				newEnd = t.getDefaultEventEnd(newAllDay, newStart);
			}

			// translate the dates
			newStart.add(dateDelta);
			if (newEnd) {
				newEnd.add(dateDelta).add(durationDelta);
			}

			// if the dates have changed, and we know it is impossible to recompute the
			// timezone offsets, strip the zone.
			if (isAmbigTimezone) {
				if (+dateDelta || +durationDelta) {
					newStart.stripZone();
					if (newEnd) {
						newEnd.stripZone();
					}
				}
			}

			event.allDay = newAllDay;
			event.start = newStart;
			event.end = newEnd;
			backupEventDates(event);

			undoFunctions.push(function() {
				event.allDay = oldAllDay;
				event.start = oldStart;
				event.end = oldEnd;
				backupEventDates(event);
			});
		});

		return function() {
			for (var i=0; i<undoFunctions.length; i++) {
				undoFunctions[i]();
			}
		};
	}

}


// updates the "backup" properties, which are preserved in order to compute diffs later on.
function backupEventDates(event) {
	event._allDay = event.allDay;
	event._start = event.start.clone();
	event._end = event.end ? event.end.clone() : null;
}

;;

fc.applyAll = applyAll;



// Create an object that has the given prototype.
// Just like Object.create
function createObject(proto) {
	var f = function() {};
	f.prototype = proto;
	return new f();
}

// Copies specifically-owned (non-protoype) properties of `b` onto `a`.
// FYI, $.extend would copy *all* properties of `b` onto `a`.
function extend(a, b) {
	for (var i in b) {
		if (b.hasOwnProperty(i)) {
			a[i] = b[i];
		}
	}
}



 */
/* Date
 -----------------------------------------------------------------------------*//*



 var dayIDs = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];


// diffs the two moments into a Duration where full-days are recorded first,
// then the remaining time.
function dayishDiff(d1, d0) {
	return moment.duration({
		days: d1.clone().stripTime().diff(d0.clone().stripTime(), 'days'),
		ms: d1.time() - d0.time()
	});
}


function isNativeDate(input) {
	return  Object.prototype.toString.call(input) === '[object Date]' ||
		input instanceof Date;
}



 */
/* Event Element Binding
 -----------------------------------------------------------------------------*//*



 function lazySegBind(container, segs, bindHandlers) {
	container.unbind('mouseover').mouseover(function(ev) {
		var parent=ev.target, e,
			i, seg;
		while (parent != this) {
			e = parent;
			parent = parent.parentNode;
		}
		if ((i = e._fci) !== undefined) {
			e._fci = undefined;
			seg = segs[i];
			bindHandlers(seg.event, seg.element, seg);
			$(ev.target).trigger(ev);
		}
		ev.stopPropagation();
	});
}



 */
/* Element Dimensions
 -----------------------------------------------------------------------------*//*



 function setOuterWidth(element, width, includeMargins) {
	for (var i=0, e; i<element.length; i++) {
		e = $(element[i]);
		e.width(Math.max(0, width - hsides(e, includeMargins)));
	}
}


function setOuterHeight(element, height, includeMargins) {
	for (var i=0, e; i<element.length; i++) {
		e = $(element[i]);
		e.height(Math.max(0, height - vsides(e, includeMargins)));
	}
}


function hsides(element, includeMargins) {
	return hpadding(element) + hborders(element) + (includeMargins ? hmargins(element) : 0);
}


function hpadding(element) {
	return (parseFloat($.css(element[0], 'paddingLeft', true)) || 0) +
	       (parseFloat($.css(element[0], 'paddingRight', true)) || 0);
}


function hmargins(element) {
	return (parseFloat($.css(element[0], 'marginLeft', true)) || 0) +
	       (parseFloat($.css(element[0], 'marginRight', true)) || 0);
}


function hborders(element) {
	return (parseFloat($.css(element[0], 'borderLeftWidth', true)) || 0) +
	       (parseFloat($.css(element[0], 'borderRightWidth', true)) || 0);
}


function vsides(element, includeMargins) {
	return vpadding(element) +  vborders(element) + (includeMargins ? vmargins(element) : 0);
}


function vpadding(element) {
	return (parseFloat($.css(element[0], 'paddingTop', true)) || 0) +
	       (parseFloat($.css(element[0], 'paddingBottom', true)) || 0);
}


function vmargins(element) {
	return (parseFloat($.css(element[0], 'marginTop', true)) || 0) +
	       (parseFloat($.css(element[0], 'marginBottom', true)) || 0);
}


function vborders(element) {
	return (parseFloat($.css(element[0], 'borderTopWidth', true)) || 0) +
	       (parseFloat($.css(element[0], 'borderBottomWidth', true)) || 0);
}



 */
/* Misc Utils
 -----------------------------------------------------------------------------*//*



 //TODO: arraySlice
//TODO: isFunction, grep ?


function noop() { }


function dateCompare(a, b) { // works with moments too
	return a - b;
}


function arrayMax(a) {
	return Math.max.apply(Math, a);
}


function smartProperty(obj, name) { // get a camel-cased/namespaced property of an object
	obj = obj || {};
	if (obj[name] !== undefined) {
		return obj[name];
	}
	var parts = name.split(/(?=[A-Z])/),
		i=parts.length-1, res;
	for (; i>=0; i--) {
		res = obj[parts[i].toLowerCase()];
		if (res !== undefined) {
			return res;
		}
	}
	return obj['default'];
}


function htmlEscape(s) {
	return (s + '').replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/'/g, '&#039;')
		.replace(/"/g, '&quot;')
		.replace(/\n/g, '<br />');
}


function stripHTMLEntities(text) {
	return text.replace(/&.*?;/g, '');
}


function disableTextSelection(element) {
	element
		.attr('unselectable', 'on')
		.css('MozUserSelect', 'none')
		.bind('selectstart.ui', function() { return false; });
}


 */
/*
function enableTextSelection(element) {
	element
		.attr('unselectable', 'off')
		.css('MozUserSelect', '')
		.unbind('selectstart.ui');
}
 *//*



 function markFirstLast(e) { // TODO: use CSS selectors instead
	e.children()
		.removeClass('fc-first fc-last')
		.filter(':first-child')
			.addClass('fc-first')
		.end()
		.filter(':last-child')
			.addClass('fc-last');
}


function getSkinCss(event, opt) {
	var source = event.source || {};
	var eventColor = event.color;
	var sourceColor = source.color;
	var optionColor = opt('eventColor');
	var backgroundColor =
		event.backgroundColor ||
		eventColor ||
		source.backgroundColor ||
		sourceColor ||
		opt('eventBackgroundColor') ||
		optionColor;
	var borderColor =
		event.borderColor ||
		eventColor ||
		source.borderColor ||
		sourceColor ||
		opt('eventBorderColor') ||
		optionColor;
	var textColor =
		event.textColor ||
		source.textColor ||
		opt('eventTextColor');
	var statements = [];
	if (backgroundColor) {
		statements.push('background-color:' + backgroundColor);
	}
	if (borderColor) {
		statements.push('border-color:' + borderColor);
	}
	if (textColor) {
		statements.push('color:' + textColor);
	}
	return statements.join(';');
}


function applyAll(functions, thisObj, args) {
	if ($.isFunction(functions)) {
		functions = [ functions ];
	}
	if (functions) {
		var i;
		var ret;
		for (i=0; i<functions.length; i++) {
			ret = functions[i].apply(thisObj, args) || ret;
		}
		return ret;
	}
}


function firstDefined() {
	for (var i=0; i<arguments.length; i++) {
		if (arguments[i] !== undefined) {
			return arguments[i];
		}
	}
}


;;

var ambigDateOfMonthRegex = /^\s*\d{4}-\d\d$/;
var ambigTimeOrZoneRegex = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?)?$/;


// Creating
// -------------------------------------------------------------------------------------------------

// Creates a new moment, similar to the vanilla moment(...) constructor, but with
// extra features (ambiguous time, enhanced formatting). When gived an existing moment,
// it will function as a clone (and retain the zone of the moment). Anything else will
// result in a moment in the local zone.
fc.moment = function() {
	return makeMoment(arguments);
};

// Sames as fc.moment, but forces the resulting moment to be in the UTC timezone.
fc.moment.utc = function() {
	var mom = makeMoment(arguments, true);

	// Force it into UTC because makeMoment doesn't guarantee it.
	if (mom.hasTime()) { // don't give ambiguously-timed moments a UTC zone
		mom.utc();
	}

	return mom;
};

// Same as fc.moment, but when given an ISO8601 string, the timezone offset is preserved.
// ISO8601 strings with no timezone offset will become ambiguously zoned.
fc.moment.parseZone = function() {
	return makeMoment(arguments, true, true);
};

// Builds an FCMoment from args. When given an existing moment, it clones. When given a native
// Date, or called with no arguments (the current time), the resulting moment will be local.
// Anything else needs to be "parsed" (a string or an array), and will be affected by:
//    parseAsUTC - if there is no zone information, should we parse the input in UTC?
//    parseZone - if there is zone information, should we force the zone of the moment?
function makeMoment(args, parseAsUTC, parseZone) {
	var input = args[0];
	var isSingleString = args.length == 1 && typeof input === 'string';
	var isAmbigTime;
	var isAmbigZone;
	var ambigMatch;
	var output; // an object with fields for the new FCMoment object

	if (moment.isMoment(input)) {
		output = moment.apply(null, args); // clone it

		// the ambig properties have not been preserved in the clone, so reassign them
		if (input._ambigTime) {
			output._ambigTime = true;
		}
		if (input._ambigZone) {
			output._ambigZone = true;
		}
	}
	else if (isNativeDate(input) || input === undefined) {
		output = moment.apply(null, args); // will be local
	}
	else { // "parsing" is required
		isAmbigTime = false;
		isAmbigZone = false;

		if (isSingleString) {
			if (ambigDateOfMonthRegex.test(input)) {
				// accept strings like '2014-05', but convert to the first of the month
				input += '-01';
				args = [ input ]; // for when we pass it on to moment's constructor
				isAmbigTime = true;
				isAmbigZone = true;
			}
			else if ((ambigMatch = ambigTimeOrZoneRegex.exec(input))) {
				isAmbigTime = !ambigMatch[5]; // no time part?
				isAmbigZone = true;
			}
		}
		else if ($.isArray(input)) {
			// arrays have no timezone information, so assume ambiguous zone
			isAmbigZone = true;
		}
		// otherwise, probably a string with a format

		if (parseAsUTC) {
			output = moment.utc.apply(moment, args);
		}
		else {
			output = moment.apply(null, args);
		}

		if (isAmbigTime) {
			output._ambigTime = true;
			output._ambigZone = true; // ambiguous time always means ambiguous zone
		}
		else if (parseZone) { // let's record the inputted zone somehow
			if (isAmbigZone) {
				output._ambigZone = true;
			}
			else if (isSingleString) {
				output.zone(input); // if not a valid zone, will assign UTC
			}
		}
	}

	return new FCMoment(output);
}

// Our subclass of Moment.
// Accepts an object with the internal Moment properties that should be copied over to
// `this` object (most likely another Moment object). The values in this data must not
// be referenced by anything else (two moments sharing a Date object for example).
function FCMoment(internalData) {
	extend(this, internalData);
}

// Chain the prototype to Moment's
FCMoment.prototype = createObject(moment.fn);

// We need this because Moment's implementation won't create an FCMoment,
// nor will it copy over the ambig flags.
FCMoment.prototype.clone = function() {
	return makeMoment([ this ]);
};


// Time-of-day
// -------------------------------------------------------------------------------------------------

// GETTER
// Returns a Duration with the hours/minutes/seconds/ms values of the moment.
// If the moment has an ambiguous time, a duration of 00:00 will be returned.
//
// SETTER
// You can supply a Duration, a Moment, or a Duration-like argument.
// When setting the time, and the moment has an ambiguous time, it then becomes unambiguous.
FCMoment.prototype.time = function(time) {
	if (time == null) { // getter
		return moment.duration({
			hours: this.hours(),
			minutes: this.minutes(),
			seconds: this.seconds(),
			milliseconds: this.milliseconds()
		});
	}
	else { // setter

		delete this._ambigTime; // mark that the moment now has a time

		if (!moment.isDuration(time) && !moment.isMoment(time)) {
			time = moment.duration(time);
		}

		// The day value should cause overflow (so 24 hours becomes 00:00:00 of next day).
		// Only for Duration times, not Moment times.
		var dayHours = 0;
		if (moment.isDuration(time)) {
			dayHours = Math.floor(time.asDays()) * 24;
		}

		// We need to set the individual fields.
		// Can't use startOf('day') then add duration. In case of DST at start of day.
		return this.hours(dayHours + time.hours())
			.minutes(time.minutes())
			.seconds(time.seconds())
			.milliseconds(time.milliseconds());
	}
};

// Converts the moment to UTC, stripping out its time-of-day and timezone offset,
// but preserving its YMD. A moment with a stripped time will display no time
// nor timezone offset when .format() is called.
FCMoment.prototype.stripTime = function() {
	var a = this.toArray(); // year,month,date,hours,minutes,seconds as an array

	// set the internal UTC flag
	moment.fn.utc.call(this); // call the original method, because we don't want to affect _ambigZone

	this.year(a[0]) // TODO: find a way to do this in one shot
		.month(a[1])
		.date(a[2])
		.hours(0)
		.minutes(0)
		.seconds(0)
		.milliseconds(0);

	// Mark the time as ambiguous. This needs to happen after the .utc() call, which calls .zone(), which
	// clears all ambig flags. Same concept with the .year/month/date calls in the case of moment-timezone.
	this._ambigTime = true;
	this._ambigZone = true; // if ambiguous time, also ambiguous timezone offset

	return this; // for chaining
};

// Returns if the moment has a non-ambiguous time (boolean)
FCMoment.prototype.hasTime = function() {
	return !this._ambigTime;
};


// Timezone
// -------------------------------------------------------------------------------------------------

// Converts the moment to UTC, stripping out its timezone offset, but preserving its
// YMD and time-of-day. A moment with a stripped timezone offset will display no
// timezone offset when .format() is called.
FCMoment.prototype.stripZone = function() {
	var a = this.toArray(); // year,month,date,hours,minutes,seconds as an array
	var wasAmbigTime = this._ambigTime;

	moment.fn.utc.call(this); // set the internal UTC flag

	this.year(a[0]) // TODO: find a way to do this in one shot
		.month(a[1])
		.date(a[2])
		.hours(a[3])
		.minutes(a[4])
		.seconds(a[5])
		.milliseconds(a[6]);

	if (wasAmbigTime) {
		// the above call to .utc()/.zone() unfortunately clears the ambig flags, so reassign
		this._ambigTime = true;
	}

	// Mark the zone as ambiguous. This needs to happen after the .utc() call, which calls .zone(), which
	// clears all ambig flags. Same concept with the .year/month/date calls in the case of moment-timezone.
	this._ambigZone = true;

	return this; // for chaining
};

// Returns of the moment has a non-ambiguous timezone offset (boolean)
FCMoment.prototype.hasZone = function() {
	return !this._ambigZone;
};

// this method implicitly marks a zone
FCMoment.prototype.zone = function(tzo) {

	if (tzo != null) {
		// FYI, the delete statements need to be before the .zone() call or else chaos ensues
		// for reasons I don't understand. 
		delete this._ambigTime;
		delete this._ambigZone;
	}

	return moment.fn.zone.apply(this, arguments);
};

// this method implicitly marks a zone
FCMoment.prototype.local = function() {
	var a = this.toArray(); // year,month,date,hours,minutes,seconds as an array
	var wasAmbigZone = this._ambigZone;

	// will happen anyway via .local()/.zone(), but don't want to rely on internal implementation
	delete this._ambigTime;
	delete this._ambigZone;

	moment.fn.local.apply(this, arguments);

	if (wasAmbigZone) {
		// If the moment was ambiguously zoned, the date fields were stored as UTC.
		// We want to preserve these, but in local time.
		this.year(a[0]) // TODO: find a way to do this in one shot
			.month(a[1])
			.date(a[2])
			.hours(a[3])
			.minutes(a[4])
			.seconds(a[5])
			.milliseconds(a[6]);
	}

	return this; // for chaining
};

// this method implicitly marks a zone
FCMoment.prototype.utc = function() {

	// will happen anyway via .local()/.zone(), but don't want to rely on internal implementation
	delete this._ambigTime;
	delete this._ambigZone;

	return moment.fn.utc.apply(this, arguments);
};


// Formatting
// -------------------------------------------------------------------------------------------------

FCMoment.prototype.format = function() {
	if (arguments[0]) {
		return formatDate(this, arguments[0]); // our extended formatting
	}
	if (this._ambigTime) {
		return momentFormat(this, 'YYYY-MM-DD');
	}
	if (this._ambigZone) {
		return momentFormat(this, 'YYYY-MM-DD[T]HH:mm:ss');
	}
	return momentFormat(this); // default moment original formatting
};

FCMoment.prototype.toISOString = function() {
	if (this._ambigTime) {
		return momentFormat(this, 'YYYY-MM-DD');
	}
	if (this._ambigZone) {
		return momentFormat(this, 'YYYY-MM-DD[T]HH:mm:ss');
	}
	return moment.fn.toISOString.apply(this, arguments);
};


// Querying
// -------------------------------------------------------------------------------------------------

// Is the moment within the specified range? `end` is exclusive.
FCMoment.prototype.isWithin = function(start, end) {
	var a = commonlyAmbiguate([ this, start, end ]);
	return a[0] >= a[1] && a[0] < a[2];
};

// Make these query methods work with ambiguous moments
$.each([
	'isBefore',
	'isAfter',
	'isSame'
], function(i, methodName) {
	FCMoment.prototype[methodName] = function(input, units) {
		var a = commonlyAmbiguate([ this, input ]);
		return moment.fn[methodName].call(a[0], a[1], units);
	};
});


// Misc Internals
// -------------------------------------------------------------------------------------------------

// given an array of moment-like inputs, return a parallel array w/ moments similarly ambiguated.
// for example, of one moment has ambig time, but not others, all moments will have their time stripped.
function commonlyAmbiguate(inputs) {
	var outputs = [];
	var anyAmbigTime = false;
	var anyAmbigZone = false;
	var i;

	for (i=0; i<inputs.length; i++) {
		outputs.push(fc.moment(inputs[i]));
		anyAmbigTime = anyAmbigTime || outputs[i]._ambigTime;
		anyAmbigZone = anyAmbigZone || outputs[i]._ambigZone;
	}

	for (i=0; i<outputs.length; i++) {
		if (anyAmbigTime) {
			outputs[i].stripTime();
		}
		else if (anyAmbigZone) {
			outputs[i].stripZone();
		}
	}

	return outputs;
}

;;

// Single Date Formatting
// -------------------------------------------------------------------------------------------------


// call this if you want Moment's original format method to be used
function momentFormat(mom, formatStr) {
	return moment.fn.format.call(mom, formatStr);
}


// Formats `date` with a Moment formatting string, but allow our non-zero areas and
// additional token.
function formatDate(date, formatStr) {
	return formatDateWithChunks(date, getFormatStringChunks(formatStr));
}


function formatDateWithChunks(date, chunks) {
	var s = '';
	var i;

	for (i=0; i<chunks.length; i++) {
		s += formatDateWithChunk(date, chunks[i]);
	}

	return s;
}


// addition formatting tokens we want recognized
var tokenOverrides = {
	t: function(date) { // "a" or "p"
		return momentFormat(date, 'a').charAt(0);
	},
	T: function(date) { // "A" or "P"
		return momentFormat(date, 'A').charAt(0);
	}
};


function formatDateWithChunk(date, chunk) {
	var token;
	var maybeStr;

	if (typeof chunk === 'string') { // a literal string
		return chunk;
	}
	else if ((token = chunk.token)) { // a token, like "YYYY"
		if (tokenOverrides[token]) {
			return tokenOverrides[token](date); // use our custom token
		}
		return momentFormat(date, token);
	}
	else if (chunk.maybe) { // a grouping of other chunks that must be non-zero
		maybeStr = formatDateWithChunks(date, chunk.maybe);
		if (maybeStr.match(/[1-9]/)) {
			return maybeStr;
		}
	}

	return '';
}


// Date Range Formatting
// -------------------------------------------------------------------------------------------------
// TODO: make it work with timezone offset

// Using a formatting string meant for a single date, generate a range string, like
// "Sep 2 - 9 2013", that intelligently inserts a separator where the dates differ.
// If the dates are the same as far as the format string is concerned, just return a single
// rendering of one date, without any separator.
function formatRange(date1, date2, formatStr, separator, isRTL) {

	date1 = fc.moment.parseZone(date1);
	date2 = fc.moment.parseZone(date2);

	// Expand localized format strings, like "LL" -> "MMMM D YYYY"
	formatStr = date1.lang().longDateFormat(formatStr) || formatStr;
	// BTW, this is not important for `formatDate` because it is impossible to put custom tokens
	// or non-zero areas in Moment's localized format strings.

	separator = separator || ' - ';

	return formatRangeWithChunks(
		date1,
		date2,
		getFormatStringChunks(formatStr),
		separator,
		isRTL
	);
}
fc.formatRange = formatRange; // expose


function formatRangeWithChunks(date1, date2, chunks, separator, isRTL) {
	var chunkStr; // the rendering of the chunk
	var leftI;
	var leftStr = '';
	var rightI;
	var rightStr = '';
	var middleI;
	var middleStr1 = '';
	var middleStr2 = '';
	var middleStr = '';

	// Start at the leftmost side of the formatting string and continue until you hit a token
	// that is not the same between dates.
	for (leftI=0; leftI<chunks.length; leftI++) {
		chunkStr = formatSimilarChunk(date1, date2, chunks[leftI]);
		if (chunkStr === false) {
			break;
		}
		leftStr += chunkStr;
	}

	// Similarly, start at the rightmost side of the formatting string and move left
	for (rightI=chunks.length-1; rightI>leftI; rightI--) {
		chunkStr = formatSimilarChunk(date1, date2, chunks[rightI]);
		if (chunkStr === false) {
			break;
		}
		rightStr = chunkStr + rightStr;
	}

	// The area in the middle is different for both of the dates.
	// Collect them distinctly so we can jam them together later.
	for (middleI=leftI; middleI<=rightI; middleI++) {
		middleStr1 += formatDateWithChunk(date1, chunks[middleI]);
		middleStr2 += formatDateWithChunk(date2, chunks[middleI]);
	}

	if (middleStr1 || middleStr2) {
		if (isRTL) {
			middleStr = middleStr2 + separator + middleStr1;
		}
		else {
			middleStr = middleStr1 + separator + middleStr2;
		}
	}

	return leftStr + middleStr + rightStr;
}


var similarUnitMap = {
	Y: 'year',
	M: 'month',
	D: 'day', // day of month
	d: 'day', // day of week
	// prevents a separator between anything time-related...
	A: 'second', // AM/PM
	a: 'second', // am/pm
	T: 'second', // A/P
	t: 'second', // a/p
	H: 'second', // hour (24)
	h: 'second', // hour (12)
	m: 'second', // minute
	s: 'second' // second
};
// TODO: week maybe?


// Given a formatting chunk, and given that both dates are similar in the regard the
// formatting chunk is concerned, format date1 against `chunk`. Otherwise, return `false`.
function formatSimilarChunk(date1, date2, chunk) {
	var token;
	var unit;

	if (typeof chunk === 'string') { // a literal string
		return chunk;
	}
	else if ((token = chunk.token)) {
		unit = similarUnitMap[token.charAt(0)];
		// are the dates the same for this unit of measurement?
		if (unit && date1.isSame(date2, unit)) {
			return momentFormat(date1, token); // would be the same if we used `date2`
			// BTW, don't support custom tokens
		}
	}

	return false; // the chunk is NOT the same for the two dates
	// BTW, don't support splitting on non-zero areas
}


// Chunking Utils
// -------------------------------------------------------------------------------------------------


var formatStringChunkCache = {};


function getFormatStringChunks(formatStr) {
	if (formatStr in formatStringChunkCache) {
		return formatStringChunkCache[formatStr];
	}
	return (formatStringChunkCache[formatStr] = chunkFormatString(formatStr));
}


// Break the formatting string into an array of chunks
function chunkFormatString(formatStr) {
	var chunks = [];
	var chunker = /\[([^\]]*)\]|\(([^\)]*)\)|(LT|(\w)\4*o?)|([^\w\[\(]+)/g; // TODO: more descrimination
	var match;

	while ((match = chunker.exec(formatStr))) {
		if (match[1]) { // a literal string inside [ ... ]
			chunks.push(match[1]);
		}
		else if (match[2]) { // non-zero formatting inside ( ... )
			chunks.push({ maybe: chunkFormatString(match[2]) });
		}
		else if (match[3]) { // a formatting token
			chunks.push({ token: match[3] });
		}
		else if (match[5]) { // an unenclosed literal string
			chunks.push(match[5]);
		}
	}

	return chunks;
}

;;

fcViews.month = MonthView;

function MonthView(element, calendar) {
	var t = this;
	
	
	// exports
	t.incrementDate = incrementDate;
	t.render = render;
	
	
	// imports
	BasicView.call(t, element, calendar, 'month');


	function incrementDate(date, delta) {
		return date.clone().stripTime().add('months', delta).startOf('month');
	}


	function render(date) {

		t.intervalStart = date.clone().stripTime().startOf('month');
		t.intervalEnd = t.intervalStart.clone().add('months', 1);

		t.start = t.intervalStart.clone();
		t.start = t.skipHiddenDays(t.start); // move past the first week if no visible days
		t.start.startOf('week');
		t.start = t.skipHiddenDays(t.start); // move past the first invisible days of the week

		t.end = t.intervalEnd.clone();
		t.end = t.skipHiddenDays(t.end, -1, true); // move in from the last week if no visible days
		t.end.add('days', (7 - t.end.weekday()) % 7); // move to end of week if not already
		t.end = t.skipHiddenDays(t.end, -1, true); // move in from the last invisible days of the week

		var rowCnt = Math.ceil( // need to ceil in case there are hidden days
			t.end.diff(t.start, 'weeks', true) // returnfloat=true
		);
		if (t.opt('weekMode') == 'fixed') {
			t.end.add('weeks', 6 - rowCnt);
			rowCnt = 6;
		}

		t.title = calendar.formatDate(t.intervalStart, t.opt('titleFormat'));

		t.renderBasic(rowCnt, t.getCellsPerWeek(), true);
	}
	
	
}

;;

fcViews.basicWeek = BasicWeekView;

function BasicWeekView(element, calendar) { // TODO: do a WeekView mixin
	var t = this;
	
	
	// exports
	t.incrementDate = incrementDate;
	t.render = render;
	
	
	// imports
	BasicView.call(t, element, calendar, 'basicWeek');


	function incrementDate(date, delta) {
		return date.clone().stripTime().add('weeks', delta).startOf('week');
	}


	function render(date) {

		t.intervalStart = date.clone().stripTime().startOf('week');
		t.intervalEnd = t.intervalStart.clone().add('weeks', 1);

		t.start = t.skipHiddenDays(t.intervalStart);
		t.end = t.skipHiddenDays(t.intervalEnd, -1, true);

		t.title = calendar.formatRange(
			t.start,
			t.end.clone().subtract(1), // make inclusive by subtracting 1 ms
			t.opt('titleFormat'),
			' \u2014 ' // emphasized dash
		);

		t.renderBasic(1, t.getCellsPerWeek(), false);
	}
	
	
}

;;

fcViews.basicDay = BasicDayView;

function BasicDayView(element, calendar) { // TODO: make a DayView mixin
	var t = this;
	
	
	// exports
	t.incrementDate = incrementDate;
	t.render = render;
	
	
	// imports
	BasicView.call(t, element, calendar, 'basicDay');


	function incrementDate(date, delta) {
		var out = date.clone().stripTime().add('days', delta);
		out = t.skipHiddenDays(out, delta < 0 ? -1 : 1);
		return out;
	}


	function render(date) {

		t.start = t.intervalStart = date.clone().stripTime();
		t.end = t.intervalEnd = t.start.clone().add('days', 1);

		t.title = calendar.formatDate(t.start, t.opt('titleFormat'));

		t.renderBasic(1, 1, false);
	}
	
	
}

;;

setDefaults({
	weekMode: 'fixed'
});


function BasicView(element, calendar, viewName) {
	var t = this;
	
	
	// exports
	t.renderBasic = renderBasic;
	t.setHeight = setHeight;
	t.setWidth = setWidth;
	t.renderDayOverlay = renderDayOverlay;
	t.defaultSelectionEnd = defaultSelectionEnd;
	t.renderSelection = renderSelection;
	t.clearSelection = clearSelection;
	t.reportDayClick = reportDayClick; // for selection (kinda hacky)
	t.dragStart = dragStart;
	t.dragStop = dragStop;
	t.getHoverListener = function() { return hoverListener; };
	t.colLeft = colLeft;
	t.colRight = colRight;
	t.colContentLeft = colContentLeft;
	t.colContentRight = colContentRight;
	t.getIsCellAllDay = function() { return true; };
	t.allDayRow = allDayRow;
	t.getRowCnt = function() { return rowCnt; };
	t.getColCnt = function() { return colCnt; };
	t.getColWidth = function() { return colWidth; };
	t.getDaySegmentContainer = function() { return daySegmentContainer; };
	
	
	// imports
	View.call(t, element, calendar, viewName);
	OverlayManager.call(t);
	SelectionManager.call(t);
	BasicEventRenderer.call(t);
	var opt = t.opt;
	var trigger = t.trigger;
	var renderOverlay = t.renderOverlay;
	var clearOverlays = t.clearOverlays;
	var daySelectionMousedown = t.daySelectionMousedown;
	var cellToDate = t.cellToDate;
	var dateToCell = t.dateToCell;
	var rangeToSegments = t.rangeToSegments;
	var formatDate = calendar.formatDate;
	var calculateWeekNumber = calendar.calculateWeekNumber;
	
	
	// locals
	
	var table;
	var head;
	var headCells;
	var body;
	var bodyRows;
	var bodyCells;
	var bodyFirstCells;
	var firstRowCellInners;
	var firstRowCellContentInners;
	var daySegmentContainer;
	
	var viewWidth;
	var viewHeight;
	var colWidth;
	var weekNumberWidth;
	
	var rowCnt, colCnt;
	var showNumbers;
	var coordinateGrid;
	var hoverListener;
	var colPositions;
	var colContentPositions;
	
	var tm;
	var colFormat;
	var showWeekNumbers;



 */
/* Rendering
 ------------------------------------------------------------*//*



 disableTextSelection(element.addClass('fc-grid'));
	
	
	function renderBasic(_rowCnt, _colCnt, _showNumbers) {
		rowCnt = _rowCnt;
		colCnt = _colCnt;
		showNumbers = _showNumbers;
		updateOptions();

		if (!body) {
			buildEventContainer();
		}

		buildTable();
	}
	
	
	function updateOptions() {
		tm = opt('theme') ? 'ui' : 'fc';
		colFormat = opt('columnFormat');
		showWeekNumbers = opt('weekNumbers');
	}
	
	
	function buildEventContainer() {
		daySegmentContainer =
			$("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>")
				.appendTo(element);
	}
	
	
	function buildTable() {
		var html = buildTableHTML();

		if (table) {
			table.remove();
		}
		table = $(html).appendTo(element);

		head = table.find('thead');
		headCells = head.find('.fc-day-header');
		body = table.find('tbody');
		bodyRows = body.find('tr');
		bodyCells = body.find('.fc-day');
		bodyFirstCells = bodyRows.find('td:first-child');

		firstRowCellInners = bodyRows.eq(0).find('.fc-day > div');
		firstRowCellContentInners = bodyRows.eq(0).find('.fc-day-content > div');
		
		markFirstLast(head.add(head.find('tr'))); // marks first+last tr/th's
		markFirstLast(bodyRows); // marks first+last td's
		bodyRows.eq(0).addClass('fc-first');
		bodyRows.filter(':last').addClass('fc-last');

		bodyCells.each(function(i, _cell) {
			var date = cellToDate(
				Math.floor(i / colCnt),
				i % colCnt
			);
			trigger('dayRender', t, date, $(_cell));
		});

		dayBind(bodyCells);
	}



 */
/* HTML Building
 -----------------------------------------------------------*//*



 function buildTableHTML() {
		var html =
			"<table class='fc-border-separate' style='width:100%' cellspacing='0'>" +
			buildHeadHTML() +
			buildBodyHTML() +
			"</table>";

		return html;
	}


	function buildHeadHTML() {
		var headerClass = tm + "-widget-header";
		var html = '';
		var col;
		var date;

		html += "<thead><tr>";

		if (showWeekNumbers) {
			html +=
				"<th class='fc-week-number " + headerClass + "'>" +
				htmlEscape(opt('weekNumberTitle')) +
				"</th>";
		}

		for (col=0; col<colCnt; col++) {
			date = cellToDate(0, col);
			html +=
				"<th class='fc-day-header fc-" + dayIDs[date.day()] + " " + headerClass + "'>" +
				htmlEscape(formatDate(date, colFormat)) +
				"</th>";
		}

		html += "</tr></thead>";

		return html;
	}


	function buildBodyHTML() {
		var contentClass = tm + "-widget-content";
		var html = '';
		var row;
		var col;
		var date;

		html += "<tbody>";

		for (row=0; row<rowCnt; row++) {

			html += "<tr class='fc-week'>";

			if (showWeekNumbers) {
				date = cellToDate(row, 0);
				html +=
					"<td class='fc-week-number " + contentClass + "'>" +
					"<div>" +
					htmlEscape(calculateWeekNumber(date)) +
					"</div>" +
					"</td>";
			}

			for (col=0; col<colCnt; col++) {
				date = cellToDate(row, col);
				html += buildCellHTML(date);
			}

			html += "</tr>";
		}

		html += "</tbody>";

		return html;
	}


	function buildCellHTML(date) { // date assumed to have stripped time
		var month = t.intervalStart.month();
		var today = calendar.getNow().stripTime();
		var html = '';
		var contentClass = tm + "-widget-content";
		var classNames = [
			'fc-day',
			'fc-' + dayIDs[date.day()],
			contentClass
		];

		if (date.month() != month) {
			classNames.push('fc-other-month');
		}
		if (date.isSame(today, 'day')) {
			classNames.push(
				'fc-today',
				tm + '-state-highlight'
			);
		}
		else if (date < today) {
			classNames.push('fc-past');
		}
		else {
			classNames.push('fc-future');
		}

		html +=
			"<td" +
			" class='" + classNames.join(' ') + "'" +
			" data-date='" + date.format() + "'" +
			">" +
			"<div>";

		if (showNumbers) {
			html += "<div class='fc-day-number'>" + date.date() + "</div>";
		}

		html +=
			"<div class='fc-day-content'>" +
			"<div style='position:relative'>&nbsp;</div>" +
			"</div>" +
			"</div>" +
			"</td>";

		return html;
	}



 */
/* Dimensions
 -----------------------------------------------------------*//*



 function setHeight(height) {
		viewHeight = height;
		
		var bodyHeight = Math.max(viewHeight - head.height(), 0);
		var rowHeight;
		var rowHeightLast;
		var cell;
			
		if (opt('weekMode') == 'variable') {
			rowHeight = rowHeightLast = Math.floor(bodyHeight / (rowCnt==1 ? 2 : 6));
		}else{
			rowHeight = Math.floor(bodyHeight / rowCnt);
			rowHeightLast = bodyHeight - rowHeight * (rowCnt-1);
		}
		
		bodyFirstCells.each(function(i, _cell) {
			if (i < rowCnt) {
				cell = $(_cell);
				cell.find('> div').css(
					'min-height',
					(i==rowCnt-1 ? rowHeightLast : rowHeight) - vsides(cell)
				);
			}
		});
		
	}
	
	
	function setWidth(width) {
		viewWidth = width;
		colPositions.clear();
		colContentPositions.clear();

		weekNumberWidth = 0;
		if (showWeekNumbers) {
			weekNumberWidth = head.find('th.fc-week-number').outerWidth();
		}

		colWidth = Math.floor((viewWidth - weekNumberWidth) / colCnt);
		setOuterWidth(headCells.slice(0, -1), colWidth);
	}



 */
/* Day clicking and binding
 -----------------------------------------------------------*//*



 function dayBind(days) {
		days.click(dayClick)
			.mousedown(daySelectionMousedown);
	}
	
	
	function dayClick(ev) {
		if (!opt('selectable')) { // if selectable, SelectionManager will worry about dayClick
			var date = calendar.moment($(this).data('date'));
			trigger('dayClick', this, date, ev);
		}
	}



 */
/* Semi-transparent Overlay Helpers
 ------------------------------------------------------*//*

 // TODO: should be consolidated with AgendaView's methods


	function renderDayOverlay(overlayStart, overlayEnd, refreshCoordinateGrid) { // overlayEnd is exclusive

		if (refreshCoordinateGrid) {
			coordinateGrid.build();
		}

		var segments = rangeToSegments(overlayStart, overlayEnd);

		for (var i=0; i<segments.length; i++) {
			var segment = segments[i];
			dayBind(
				renderCellOverlay(
					segment.row,
					segment.leftCol,
					segment.row,
					segment.rightCol
				)
			);
		}
	}

	
	function renderCellOverlay(row0, col0, row1, col1) { // row1,col1 is inclusive
		var rect = coordinateGrid.rect(row0, col0, row1, col1, element);
		return renderOverlay(rect, element);
	}



 */
/* Selection
 -----------------------------------------------------------------------*//*



 function defaultSelectionEnd(start) {
		return start.clone().stripTime().add('days', 1);
	}
	
	
	function renderSelection(start, end) { // end is exclusive
		renderDayOverlay(start, end, true); // true = rebuild every time
	}
	
	
	function clearSelection() {
		clearOverlays();
	}
	
	
	function reportDayClick(date, ev) {
		var cell = dateToCell(date);
		var _element = bodyCells[cell.row*colCnt + cell.col];
		trigger('dayClick', _element, date, ev);
	}



 */
/* External Dragging
 -----------------------------------------------------------------------*//*



 function dragStart(_dragElement, ev, ui) {
		hoverListener.start(function(cell) {
			clearOverlays();
			if (cell) {
				var d1 = cellToDate(cell);
				var d2 = d1.clone().add(calendar.defaultAllDayEventDuration);
				renderDayOverlay(d1, d2);
			}
		}, ev);
	}
	
	
	function dragStop(_dragElement, ev, ui) {
		var cell = hoverListener.stop();
		clearOverlays();
		if (cell) {
			trigger(
				'drop',
				_dragElement,
				cellToDate(cell),
				ev,
				ui
			);
		}
	}



 */
/* Utilities
 --------------------------------------------------------*//*



 coordinateGrid = new CoordinateGrid(function(rows, cols) {
		var e, n, p;
		headCells.each(function(i, _e) {
			e = $(_e);
			n = e.offset().left;
			if (i) {
				p[1] = n;
			}
			p = [n];
			cols[i] = p;
		});
		p[1] = n + e.outerWidth();
		bodyRows.each(function(i, _e) {
			if (i < rowCnt) {
				e = $(_e);
				n = e.offset().top;
				if (i) {
					p[1] = n;
				}
				p = [n];
				rows[i] = p;
			}
		});
		p[1] = n + e.outerHeight();
	});
	
	
	hoverListener = new HoverListener(coordinateGrid);
	
	colPositions = new HorizontalPositionCache(function(col) {
		return firstRowCellInners.eq(col);
	});

	colContentPositions = new HorizontalPositionCache(function(col) {
		return firstRowCellContentInners.eq(col);
	});


	function colLeft(col) {
		return colPositions.left(col);
	}


	function colRight(col) {
		return colPositions.right(col);
	}
	
	
	function colContentLeft(col) {
		return colContentPositions.left(col);
	}
	
	
	function colContentRight(col) {
		return colContentPositions.right(col);
	}
	
	
	function allDayRow(i) {
		return bodyRows.eq(i);
	}
	
}

;;

function BasicEventRenderer() {
	var t = this;
	
	
	// exports
	t.renderEvents = renderEvents;
	t.clearEvents = clearEvents;
	

	// imports
	DayEventRenderer.call(t);

	
	function renderEvents(events, modifiedEventId) {
		t.renderDayEvents(events, modifiedEventId);
	}
	
	
	function clearEvents() {
		t.getDaySegmentContainer().empty();
	}


	// TODO: have this class (and AgendaEventRenderer) be responsible for creating the event container div

}

;;

fcViews.agendaWeek = AgendaWeekView;

function AgendaWeekView(element, calendar) { // TODO: do a WeekView mixin
	var t = this;
	
	
	// exports
	t.incrementDate = incrementDate;
	t.render = render;
	
	
	// imports
	AgendaView.call(t, element, calendar, 'agendaWeek');


	function incrementDate(date, delta) {
		return date.clone().stripTime().add('weeks', delta).startOf('week');
	}


	function render(date) {

		t.intervalStart = date.clone().stripTime().startOf('week');
		t.intervalEnd = t.intervalStart.clone().add('weeks', 1);

		t.start = t.skipHiddenDays(t.intervalStart);
		t.end = t.skipHiddenDays(t.intervalEnd, -1, true);

		t.title = calendar.formatRange(
			t.start,
			t.end.clone().subtract(1), // make inclusive by subtracting 1 ms
			t.opt('titleFormat'),
			' \u2014 ' // emphasized dash
		);

		t.renderAgenda(t.getCellsPerWeek());
	}


}

;;

fcViews.agendaDay = AgendaDayView;

function AgendaDayView(element, calendar) { // TODO: make a DayView mixin
	var t = this;
	
	
	// exports
	t.incrementDate = incrementDate;
	t.render = render;
	
	
	// imports
	AgendaView.call(t, element, calendar, 'agendaDay');


	function incrementDate(date, delta) {
		var out = date.clone().stripTime().add('days', delta);
		out = t.skipHiddenDays(out, delta < 0 ? -1 : 1);
		return out;
	}


	function render(date) {

		t.start = t.intervalStart = date.clone().stripTime();
		t.end = t.intervalEnd = t.start.clone().add('days', 1);

		t.title = calendar.formatDate(t.start, t.opt('titleFormat'));

		t.renderAgenda(1);
	}
	

}

;;

setDefaults({
	allDaySlot: true,
	allDayText: 'all-day',

	scrollTime: '06:00:00',

	slotDuration: '00:30:00',

	axisFormat: generateAgendaAxisFormat,
	timeFormat: {
		agenda: generateAgendaTimeFormat
	},

	dragOpacity: {
		agenda: .5
	},
	minTime: '00:00:00',
	maxTime: '24:00:00',
	slotEventOverlap: true
});


function generateAgendaAxisFormat(options, langData) {
	return langData.longDateFormat('LT')
		.replace(':mm', '(:mm)')
		.replace(/(\Wmm)$/, '($1)') // like above, but for foreign langs
		.replace(/\s*a$/i, 'a'); // convert AM/PM/am/pm to lowercase. remove any spaces beforehand
}


function generateAgendaTimeFormat(options, langData) {
	return langData.longDateFormat('LT')
		.replace(/\s*a$/i, ''); // remove trailing AM/PM
}


// TODO: make it work in quirks mode (event corners, all-day height)
// TODO: test liquid width, especially in IE6


function AgendaView(element, calendar, viewName) {
	var t = this;
	
	
	// exports
	t.renderAgenda = renderAgenda;
	t.setWidth = setWidth;
	t.setHeight = setHeight;
	t.afterRender = afterRender;
	t.computeDateTop = computeDateTop;
	t.getIsCellAllDay = getIsCellAllDay;
	t.allDayRow = function() { return allDayRow; }; // badly named
	t.getCoordinateGrid = function() { return coordinateGrid; }; // specifically for AgendaEventRenderer
	t.getHoverListener = function() { return hoverListener; };
	t.colLeft = colLeft;
	t.colRight = colRight;
	t.colContentLeft = colContentLeft;
	t.colContentRight = colContentRight;
	t.getDaySegmentContainer = function() { return daySegmentContainer; };
	t.getSlotSegmentContainer = function() { return slotSegmentContainer; };
	t.getSlotContainer = function() { return slotContainer; };
	t.getRowCnt = function() { return 1; };
	t.getColCnt = function() { return colCnt; };
	t.getColWidth = function() { return colWidth; };
	t.getSnapHeight = function() { return snapHeight; };
	t.getSnapDuration = function() { return snapDuration; };
	t.getSlotHeight = function() { return slotHeight; };
	t.getSlotDuration = function() { return slotDuration; };
	t.getMinTime = function() { return minTime; };
	t.getMaxTime = function() { return maxTime; };
	t.defaultSelectionEnd = defaultSelectionEnd;
	t.renderDayOverlay = renderDayOverlay;
	t.renderSelection = renderSelection;
	t.clearSelection = clearSelection;
	t.reportDayClick = reportDayClick; // selection mousedown hack
	t.dragStart = dragStart;
	t.dragStop = dragStop;
	
	
	// imports
	View.call(t, element, calendar, viewName);
	OverlayManager.call(t);
	SelectionManager.call(t);
	AgendaEventRenderer.call(t);
	var opt = t.opt;
	var trigger = t.trigger;
	var renderOverlay = t.renderOverlay;
	var clearOverlays = t.clearOverlays;
	var reportSelection = t.reportSelection;
	var unselect = t.unselect;
	var daySelectionMousedown = t.daySelectionMousedown;
	var slotSegHtml = t.slotSegHtml;
	var cellToDate = t.cellToDate;
	var dateToCell = t.dateToCell;
	var rangeToSegments = t.rangeToSegments;
	var formatDate = calendar.formatDate;
	var calculateWeekNumber = calendar.calculateWeekNumber;
	
	
	// locals
	
	var dayTable;
	var dayHead;
	var dayHeadCells;
	var dayBody;
	var dayBodyCells;
	var dayBodyCellInners;
	var dayBodyCellContentInners;
	var dayBodyFirstCell;
	var dayBodyFirstCellStretcher;
	var slotLayer;
	var daySegmentContainer;
	var allDayTable;
	var allDayRow;
	var slotScroller;
	var slotContainer;
	var slotSegmentContainer;
	var slotTable;
	var selectionHelper;
	
	var viewWidth;
	var viewHeight;
	var axisWidth;
	var colWidth;
	var gutterWidth;

	var slotDuration;
	var slotHeight; // TODO: what if slotHeight changes? (see issue 650)

	var snapDuration;
	var snapRatio; // ratio of number of "selection" slots to normal slots. (ex: 1, 2, 4)
	var snapHeight; // holds the pixel hight of a "selection" slot
	
	var colCnt;
	var slotCnt;
	var coordinateGrid;
	var hoverListener;
	var colPositions;
	var colContentPositions;
	var slotTopCache = {};
	
	var tm;
	var rtl;
	var minTime;
	var maxTime;
	var colFormat;



 */
/* Rendering
 -----------------------------------------------------------------------------*//*



 disableTextSelection(element.addClass('fc-agenda'));
	
	
	function renderAgenda(c) {
		colCnt = c;
		updateOptions();

		if (!dayTable) { // first time rendering?
			buildSkeleton(); // builds day table, slot area, events containers
		}
		else {
			buildDayTable(); // rebuilds day table
		}
	}
	
	
	function updateOptions() {

		tm = opt('theme') ? 'ui' : 'fc';
		rtl = opt('isRTL');
		colFormat = opt('columnFormat');

		minTime = moment.duration(opt('minTime'));
		maxTime = moment.duration(opt('maxTime'));

		slotDuration = moment.duration(opt('slotDuration'));
		snapDuration = opt('snapDuration');
		snapDuration = snapDuration ? moment.duration(snapDuration) : slotDuration;
	}



 */
/* Build DOM
 -----------------------------------------------------------------------*//*



 function buildSkeleton() {
		var s;
		var headerClass = tm + "-widget-header";
		var contentClass = tm + "-widget-content";
		var slotTime;
		var slotDate;
		var minutes;
		var slotNormal = slotDuration.asMinutes() % 15 === 0;
		
		buildDayTable();
		
		slotLayer =
			$("<div style='position:absolute;z-index:2;left:0;width:100%'/>")
				.appendTo(element);
				
		if (opt('allDaySlot')) {
		
			daySegmentContainer =
				$("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>")
					.appendTo(slotLayer);
		
			s =
				"<table style='width:100%' class='fc-agenda-allday' cellspacing='0'>" +
				"<tr>" +
				"<th class='" + headerClass + " fc-agenda-axis'>" +
				(
					opt('allDayHTML') ||
					htmlEscape(opt('allDayText'))
				) +
				"</th>" +
				"<td>" +
				"<div class='fc-day-content'><div style='position:relative'/></div>" +
				"</td>" +
				"<th class='" + headerClass + " fc-agenda-gutter'>&nbsp;</th>" +
				"</tr>" +
				"</table>";
			allDayTable = $(s).appendTo(slotLayer);
			allDayRow = allDayTable.find('tr');
			
			dayBind(allDayRow.find('td'));
			
			slotLayer.append(
				"<div class='fc-agenda-divider " + headerClass + "'>" +
				"<div class='fc-agenda-divider-inner'/>" +
				"</div>"
			);
			
		}else{
		
			daySegmentContainer = $([]); // in jQuery 1.4, we can just do $()
		
		}
		
		slotScroller =
			$("<div style='position:absolute;width:100%;overflow-x:hidden;overflow-y:auto'/>")
				.appendTo(slotLayer);
				
		slotContainer =
			$("<div style='position:relative;width:100%;overflow:hidden'/>")
				.appendTo(slotScroller);
				
		slotSegmentContainer =
			$("<div class='fc-event-container' style='position:absolute;z-index:8;top:0;left:0'/>")
				.appendTo(slotContainer);
		
		s =
			"<table class='fc-agenda-slots' style='width:100%' cellspacing='0'>" +
			"<tbody>";

		slotTime = moment.duration(+minTime); // i wish there was .clone() for durations
		slotCnt = 0;
		while (slotTime < maxTime) {
			slotDate = t.start.clone().time(slotTime); // will be in UTC but that's good. to avoid DST issues
			minutes = slotDate.minutes();
			s +=
				"<tr class='fc-slot" + slotCnt + ' ' + (!minutes ? '' : 'fc-minor') + "'>" +
				"<th class='fc-agenda-axis " + headerClass + "'>" +
				((!slotNormal || !minutes) ?
					htmlEscape(formatDate(slotDate, opt('axisFormat'))) :
					'&nbsp;'
					) +
				"</th>" +
				"<td class='" + contentClass + "'>" +
				"<div style='position:relative'>&nbsp;</div>" +
				"</td>" +
				"</tr>";
			slotTime.add(slotDuration);
			slotCnt++;
		}

		s +=
			"</tbody>" +
			"</table>";

		slotTable = $(s).appendTo(slotContainer);
		
		slotBind(slotTable.find('td'));
	}



 */
/* Build Day Table
 -----------------------------------------------------------------------*//*



 function buildDayTable() {
		var html = buildDayTableHTML();

		if (dayTable) {
			dayTable.remove();
		}
		dayTable = $(html).appendTo(element);

		dayHead = dayTable.find('thead');
		dayHeadCells = dayHead.find('th').slice(1, -1); // exclude gutter
		dayBody = dayTable.find('tbody');
		dayBodyCells = dayBody.find('td').slice(0, -1); // exclude gutter
		dayBodyCellInners = dayBodyCells.find('> div');
		dayBodyCellContentInners = dayBodyCells.find('.fc-day-content > div');

		dayBodyFirstCell = dayBodyCells.eq(0);
		dayBodyFirstCellStretcher = dayBodyCellInners.eq(0);
		
		markFirstLast(dayHead.add(dayHead.find('tr')));
		markFirstLast(dayBody.add(dayBody.find('tr')));

		// TODO: now that we rebuild the cells every time, we should call dayRender
	}


	function buildDayTableHTML() {
		var html =
			"<table style='width:100%' class='fc-agenda-days fc-border-separate' cellspacing='0'>" +
			buildDayTableHeadHTML() +
			buildDayTableBodyHTML() +
			"</table>";

		return html;
	}


	function buildDayTableHeadHTML() {
		var headerClass = tm + "-widget-header";
		var date;
		var html = '';
		var weekText;
		var col;

		html +=
			"<thead>" +
			"<tr>";

		if (opt('weekNumbers')) {
			date = cellToDate(0, 0);
			weekText = calculateWeekNumber(date);
			if (rtl) {
				weekText += opt('weekNumberTitle');
			}
			else {
				weekText = opt('weekNumberTitle') + weekText;
			}
			html +=
				"<th class='fc-agenda-axis fc-week-number " + headerClass + "'>" +
				htmlEscape(weekText) +
				"</th>";
		}
		else {
			html += "<th class='fc-agenda-axis " + headerClass + "'>&nbsp;</th>";
		}

		for (col=0; col<colCnt; col++) {
			date = cellToDate(0, col);
			html +=
				"<th class='fc-" + dayIDs[date.day()] + " fc-col" + col + ' ' + headerClass + "'>" +
				htmlEscape(formatDate(date, colFormat)) +
				"</th>";
		}

		html +=
			"<th class='fc-agenda-gutter " + headerClass + "'>&nbsp;</th>" +
			"</tr>" +
			"</thead>";

		return html;
	}


	function buildDayTableBodyHTML() {
		var headerClass = tm + "-widget-header"; // TODO: make these when updateOptions() called
		var contentClass = tm + "-widget-content";
		var date;
		var today = calendar.getNow().stripTime();
		var col;
		var cellsHTML;
		var cellHTML;
		var classNames;
		var html = '';

		html +=
			"<tbody>" +
			"<tr>" +
			"<th class='fc-agenda-axis " + headerClass + "'>&nbsp;</th>";

		cellsHTML = '';

		for (col=0; col<colCnt; col++) {

			date = cellToDate(0, col);

			classNames = [
				'fc-col' + col,
				'fc-' + dayIDs[date.day()],
				contentClass
			];
			if (date.isSame(today, 'day')) {
				classNames.push(
					tm + '-state-highlight',
					'fc-today'
				);
			}
			else if (date < today) {
				classNames.push('fc-past');
			}
			else {
				classNames.push('fc-future');
			}

			cellHTML =
				"<td class='" + classNames.join(' ') + "'>" +
				"<div>" +
				"<div class='fc-day-content'>" +
				"<div style='position:relative'>&nbsp;</div>" +
				"</div>" +
				"</div>" +
				"</td>";

			cellsHTML += cellHTML;
		}

		html += cellsHTML;
		html +=
			"<td class='fc-agenda-gutter " + contentClass + "'>&nbsp;</td>" +
			"</tr>" +
			"</tbody>";

		return html;
	}


	// TODO: data-date on the cells



 */
/* Dimensions
 -----------------------------------------------------------------------*//*



 function setHeight(height) {
		if (height === undefined) {
			height = viewHeight;
		}
		viewHeight = height;
		slotTopCache = {};
	
		var headHeight = dayBody.position().top;
		var allDayHeight = slotScroller.position().top; // including divider
		var bodyHeight = Math.min( // total body height, including borders
			height - headHeight,   // when scrollbars
			slotTable.height() + allDayHeight + 1 // when no scrollbars. +1 for bottom border
		);

		dayBodyFirstCellStretcher
			.height(bodyHeight - vsides(dayBodyFirstCell));
		
		slotLayer.css('top', headHeight);
		
		slotScroller.height(bodyHeight - allDayHeight - 1);
		
		// the stylesheet guarantees that the first row has no border.
		// this allows .height() to work well cross-browser.
		var slotHeight0 = slotTable.find('tr:first').height() + 1; // +1 for bottom border
		var slotHeight1 = slotTable.find('tr:eq(1)').height();
		// HACK: i forget why we do this, but i think a cross-browser issue
		slotHeight = (slotHeight0 + slotHeight1) / 2;

		snapRatio = slotDuration / snapDuration;
		snapHeight = slotHeight / snapRatio;
	}
	
	
	function setWidth(width) {
		viewWidth = width;
		colPositions.clear();
		colContentPositions.clear();

		var axisFirstCells = dayHead.find('th:first');
		if (allDayTable) {
			axisFirstCells = axisFirstCells.add(allDayTable.find('th:first'));
		}
		axisFirstCells = axisFirstCells.add(slotTable.find('th:first'));
		
		axisWidth = 0;
		setOuterWidth(
			axisFirstCells
				.width('')
				.each(function(i, _cell) {
					axisWidth = Math.max(axisWidth, $(_cell).outerWidth());
				}),
			axisWidth
		);
		
		var gutterCells = dayTable.find('.fc-agenda-gutter');
		if (allDayTable) {
			gutterCells = gutterCells.add(allDayTable.find('th.fc-agenda-gutter'));
		}

		var slotTableWidth = slotScroller[0].clientWidth; // needs to be done after axisWidth (for IE7)
		
		gutterWidth = slotScroller.width() - slotTableWidth;
		if (gutterWidth) {
			setOuterWidth(gutterCells, gutterWidth);
			gutterCells
				.show()
				.prev()
				.removeClass('fc-last');
		}else{
			gutterCells
				.hide()
				.prev()
				.addClass('fc-last');
		}
		
		colWidth = Math.floor((slotTableWidth - axisWidth) / colCnt);
		setOuterWidth(dayHeadCells.slice(0, -1), colWidth);
	}



 */
/* Scrolling
 -----------------------------------------------------------------------*//*



 function resetScroll() {
		var top = computeTimeTop(
			moment.duration(opt('scrollTime'))
		) + 1; // +1 for the border

		function scroll() {
			slotScroller.scrollTop(top);
		}

		scroll();
		setTimeout(scroll, 0); // overrides any previous scroll state made by the browser
	}


	function afterRender() { // after the view has been freshly rendered and sized
		resetScroll();
	}



 */
/* Slot/Day clicking and binding
 -----------------------------------------------------------------------*//*



 function dayBind(cells) {
		cells.click(slotClick)
			.mousedown(daySelectionMousedown);
	}


	function slotBind(cells) {
		cells.click(slotClick)
			.mousedown(slotSelectionMousedown);
	}
	
	
	function slotClick(ev) {
		if (!opt('selectable')) { // if selectable, SelectionManager will worry about dayClick
			var col = Math.min(colCnt-1, Math.floor((ev.pageX - dayTable.offset().left - axisWidth) / colWidth));
			var date = cellToDate(0, col);
			var match = this.parentNode.className.match(/fc-slot(\d+)/); // TODO: maybe use data
			if (match) {
				var slotIndex = parseInt(match[1], 10);
				date.add(minTime + slotIndex * slotDuration);
				date = calendar.rezoneDate(date);
				trigger(
					'dayClick',
					dayBodyCells[col],
					date,
					ev
				);
			}else{
				trigger(
					'dayClick',
					dayBodyCells[col],
					date,
					ev
				);
			}
		}
	}



 */
/* Semi-transparent Overlay Helpers
 -----------------------------------------------------*//*

 // TODO: should be consolidated with BasicView's methods


	function renderDayOverlay(overlayStart, overlayEnd, refreshCoordinateGrid) { // overlayEnd is exclusive

		if (refreshCoordinateGrid) {
			coordinateGrid.build();
		}

		var segments = rangeToSegments(overlayStart, overlayEnd);

		for (var i=0; i<segments.length; i++) {
			var segment = segments[i];
			dayBind(
				renderCellOverlay(
					segment.row,
					segment.leftCol,
					segment.row,
					segment.rightCol
				)
			);
		}
	}
	
	
	function renderCellOverlay(row0, col0, row1, col1) { // only for all-day?
		var rect = coordinateGrid.rect(row0, col0, row1, col1, slotLayer);
		return renderOverlay(rect, slotLayer);
	}
	

	function renderSlotOverlay(overlayStart, overlayEnd) {

		// normalize, because dayStart/dayEnd have stripped time+zone
		overlayStart = overlayStart.clone().stripZone();
		overlayEnd = overlayEnd.clone().stripZone();

		for (var i=0; i<colCnt; i++) { // loop through the day columns

			var dayStart = cellToDate(0, i);
			var dayEnd = dayStart.clone().add('days', 1);

			var stretchStart = dayStart < overlayStart ? overlayStart : dayStart; // the max of the two
			var stretchEnd = dayEnd < overlayEnd ? dayEnd : overlayEnd; // the min of the two

			if (stretchStart < stretchEnd) {
				var rect = coordinateGrid.rect(0, i, 0, i, slotContainer); // only use it for horizontal coords
				var top = computeDateTop(stretchStart, dayStart);
				var bottom = computeDateTop(stretchEnd, dayStart);
				
				rect.top = top;
				rect.height = bottom - top;
				slotBind(
					renderOverlay(rect, slotContainer)
				);
			}
		}
	}



 */
/* Coordinate Utilities
 -----------------------------------------------------------------------------*//*



 coordinateGrid = new CoordinateGrid(function(rows, cols) {
		var e, n, p;
		dayHeadCells.each(function(i, _e) {
			e = $(_e);
			n = e.offset().left;
			if (i) {
				p[1] = n;
			}
			p = [n];
			cols[i] = p;
		});
		p[1] = n + e.outerWidth();
		if (opt('allDaySlot')) {
			e = allDayRow;
			n = e.offset().top;
			rows[0] = [n, n+e.outerHeight()];
		}
		var slotTableTop = slotContainer.offset().top;
		var slotScrollerTop = slotScroller.offset().top;
		var slotScrollerBottom = slotScrollerTop + slotScroller.outerHeight();
		function constrain(n) {
			return Math.max(slotScrollerTop, Math.min(slotScrollerBottom, n));
		}
		for (var i=0; i<slotCnt*snapRatio; i++) { // adapt slot count to increased/decreased selection slot count
			rows.push([
				constrain(slotTableTop + snapHeight*i),
				constrain(slotTableTop + snapHeight*(i+1))
			]);
		}
	});
	
	
	hoverListener = new HoverListener(coordinateGrid);
	
	colPositions = new HorizontalPositionCache(function(col) {
		return dayBodyCellInners.eq(col);
	});
	
	colContentPositions = new HorizontalPositionCache(function(col) {
		return dayBodyCellContentInners.eq(col);
	});
	
	
	function colLeft(col) {
		return colPositions.left(col);
	}


	function colContentLeft(col) {
		return colContentPositions.left(col);
	}


	function colRight(col) {
		return colPositions.right(col);
	}
	
	
	function colContentRight(col) {
		return colContentPositions.right(col);
	}


	// NOTE: the row index of these "cells" doesn't correspond to the slot index, but rather the "snap" index


	function getIsCellAllDay(cell) { // TODO: remove because mom.hasTime() from realCellToDate() is better
		return opt('allDaySlot') && !cell.row;
	}


	function realCellToDate(cell) { // ugh "real" ... but blame it on our abuse of the "cell" system
		var date = cellToDate(0, cell.col);
		var snapIndex = cell.row;

		if (opt('allDaySlot')) {
			snapIndex--;
		}

		if (snapIndex >= 0) {
			date.time(moment.duration(minTime + snapIndex * snapDuration));
			date = calendar.rezoneDate(date);
		}

		return date;
	}


	function computeDateTop(date, startOfDayDate) {
		return computeTimeTop(
			moment.duration(
				date.clone().stripZone() - startOfDayDate.clone().stripTime()
			)
		);
	}


	function computeTimeTop(time) { // time is a duration

		if (time < minTime) {
			return 0;
		}
		if (time >= maxTime) {
			return slotTable.height();
		}

		var slots = (time - minTime) / slotDuration;
		var slotIndex = Math.floor(slots);
		var slotPartial = slots - slotIndex;
		var slotTop = slotTopCache[slotIndex];

		// find the position of the corresponding <tr>
		// need to use this tecnhique because not all rows are rendered at same height sometimes.
		if (slotTop === undefined) {
			slotTop = slotTopCache[slotIndex] =
				slotTable.find('tr').eq(slotIndex).find('td div')[0].offsetTop;
				// .eq() is faster than ":eq()" selector
				// [0].offsetTop is faster than .position().top (do we really need this optimization?)
				// a better optimization would be to cache all these divs
		}

		var top =
			slotTop - 1 + // because first row doesn't have a top border
			slotPartial * slotHeight; // part-way through the row

		top = Math.max(top, 0);

		return top;
	}



 */
/* Selection
 ---------------------------------------------------------------------------------*//*



 function defaultSelectionEnd(start) {
		if (start.hasTime()) {
			return start.clone().add(slotDuration);
		}
		else {
			return start.clone().add('days', 1);
		}
	}
	
	
	function renderSelection(start, end) {
		if (start.hasTime() || end.hasTime()) {
			renderSlotSelection(start, end);
		}
		else if (opt('allDaySlot')) {
			renderDayOverlay(start, end, true); // true for refreshing coordinate grid
		}
	}
	
	
	function renderSlotSelection(startDate, endDate) {
		var helperOption = opt('selectHelper');
		coordinateGrid.build();
		if (helperOption) {
			var col = dateToCell(startDate).col;
			if (col >= 0 && col < colCnt) { // only works when times are on same day
				var rect = coordinateGrid.rect(0, col, 0, col, slotContainer); // only for horizontal coords
				var top = computeDateTop(startDate, startDate);
				var bottom = computeDateTop(endDate, startDate);
				if (bottom > top) { // protect against selections that are entirely before or after visible range
					rect.top = top;
					rect.height = bottom - top;
					rect.left += 2;
					rect.width -= 5;
					if ($.isFunction(helperOption)) {
						var helperRes = helperOption(startDate, endDate);
						if (helperRes) {
							rect.position = 'absolute';
							selectionHelper = $(helperRes)
								.css(rect)
								.appendTo(slotContainer);
						}
					}else{
						rect.isStart = true; // conside rect a "seg" now
						rect.isEnd = true;   //
						selectionHelper = $(slotSegHtml(
							{
								title: '',
								start: startDate,
								end: endDate,
								className: ['fc-select-helper'],
								editable: false
							},
							rect
						));
						selectionHelper.css('opacity', opt('dragOpacity'));
					}
					if (selectionHelper) {
						slotBind(selectionHelper);
						slotContainer.append(selectionHelper);
						setOuterWidth(selectionHelper, rect.width, true); // needs to be after appended
						setOuterHeight(selectionHelper, rect.height, true);
					}
				}
			}
		}else{
			renderSlotOverlay(startDate, endDate);
		}
	}
	
	
	function clearSelection() {
		clearOverlays();
		if (selectionHelper) {
			selectionHelper.remove();
			selectionHelper = null;
		}
	}
	
	
	function slotSelectionMousedown(ev) {
		if (ev.which == 1 && opt('selectable')) { // ev.which==1 means left mouse button
			unselect(ev);
			var dates;
			hoverListener.start(function(cell, origCell) {
				clearSelection();
				if (cell && cell.col == origCell.col && !getIsCellAllDay(cell)) {
					var d1 = realCellToDate(origCell);
					var d2 = realCellToDate(cell);
					dates = [
						d1,
						d1.clone().add(snapDuration), // calculate minutes depending on selection slot minutes
						d2,
						d2.clone().add(snapDuration)
					].sort(dateCompare);
					renderSlotSelection(dates[0], dates[3]);
				}else{
					dates = null;
				}
			}, ev);
			$(document).one('mouseup', function(ev) {
				hoverListener.stop();
				if (dates) {
					if (+dates[0] == +dates[1]) {
						reportDayClick(dates[0], ev);
					}
					reportSelection(dates[0], dates[3], ev);
				}
			});
		}
	}


	function reportDayClick(date, ev) {
		trigger('dayClick', dayBodyCells[dateToCell(date).col], date, ev);
	}



 */
/* External Dragging
 --------------------------------------------------------------------------------*//*



 function dragStart(_dragElement, ev, ui) {
		hoverListener.start(function(cell) {
			clearOverlays();
			if (cell) {
				var d1 = realCellToDate(cell);
				var d2 = d1.clone();
				if (d1.hasTime()) {
					d2.add(calendar.defaultTimedEventDuration);
					renderSlotOverlay(d1, d2);
				}
				else {
					d2.add(calendar.defaultAllDayEventDuration);
					renderDayOverlay(d1, d2);
				}
			}
		}, ev);
	}
	
	
	function dragStop(_dragElement, ev, ui) {
		var cell = hoverListener.stop();
		clearOverlays();
		if (cell) {
			trigger(
				'drop',
				_dragElement,
				realCellToDate(cell),
				ev,
				ui
			);
		}
	}
	

}

;;

function AgendaEventRenderer() {
	var t = this;
	
	
	// exports
	t.renderEvents = renderEvents;
	t.clearEvents = clearEvents;
	t.slotSegHtml = slotSegHtml;
	
	
	// imports
	DayEventRenderer.call(t);
	var opt = t.opt;
	var trigger = t.trigger;
	var isEventDraggable = t.isEventDraggable;
	var isEventResizable = t.isEventResizable;
	var eventElementHandlers = t.eventElementHandlers;
	var setHeight = t.setHeight;
	var getDaySegmentContainer = t.getDaySegmentContainer;
	var getSlotSegmentContainer = t.getSlotSegmentContainer;
	var getHoverListener = t.getHoverListener;
	var computeDateTop = t.computeDateTop;
	var getIsCellAllDay = t.getIsCellAllDay;
	var colContentLeft = t.colContentLeft;
	var colContentRight = t.colContentRight;
	var cellToDate = t.cellToDate;
	var getColCnt = t.getColCnt;
	var getColWidth = t.getColWidth;
	var getSnapHeight = t.getSnapHeight;
	var getSnapDuration = t.getSnapDuration;
	var getSlotHeight = t.getSlotHeight;
	var getSlotDuration = t.getSlotDuration;
	var getSlotContainer = t.getSlotContainer;
	var reportEventElement = t.reportEventElement;
	var showEvents = t.showEvents;
	var hideEvents = t.hideEvents;
	var eventDrop = t.eventDrop;
	var eventResize = t.eventResize;
	var renderDayOverlay = t.renderDayOverlay;
	var clearOverlays = t.clearOverlays;
	var renderDayEvents = t.renderDayEvents;
	var getMinTime = t.getMinTime;
	var getMaxTime = t.getMaxTime;
	var calendar = t.calendar;
	var formatDate = calendar.formatDate;
	var getEventEnd = calendar.getEventEnd;


	// overrides
	t.draggableDayEvent = draggableDayEvent;



 */
/* Rendering
 ----------------------------------------------------------------------------*//*



 function renderEvents(events, modifiedEventId) {
		var i, len=events.length,
			dayEvents=[],
			slotEvents=[];
		for (i=0; i<len; i++) {
			if (events[i].allDay) {
				dayEvents.push(events[i]);
			}else{
				slotEvents.push(events[i]);
			}
		}

		if (opt('allDaySlot')) {
			renderDayEvents(dayEvents, modifiedEventId);
			setHeight(); // no params means set to viewHeight
		}

		renderSlotSegs(compileSlotSegs(slotEvents), modifiedEventId);
	}
	
	
	function clearEvents() {
		getDaySegmentContainer().empty();
		getSlotSegmentContainer().empty();
	}

	
	function compileSlotSegs(events) {
		var colCnt = getColCnt(),
			minTime = getMinTime(),
			maxTime = getMaxTime(),
			cellDate,
			i,
			j, seg,
			colSegs,
			segs = [];

		for (i=0; i<colCnt; i++) {
			cellDate = cellToDate(0, i);

			colSegs = sliceSegs(
				events,
				cellDate.clone().time(minTime),
				cellDate.clone().time(maxTime)
			);

			colSegs = placeSlotSegs(colSegs); // returns a new order

			for (j=0; j<colSegs.length; j++) {
				seg = colSegs[j];
				seg.col = i;
				segs.push(seg);
			}
		}

		return segs;
	}


	function sliceSegs(events, rangeStart, rangeEnd) {

		// normalize, because all dates will be compared w/o zones
		rangeStart = rangeStart.clone().stripZone();
		rangeEnd = rangeEnd.clone().stripZone();

		var segs = [],
			i, len=events.length, event,
			eventStart, eventEnd,
			segStart, segEnd,
			isStart, isEnd;
		for (i=0; i<len; i++) {

			event = events[i];

			// get dates, make copies, then strip zone to normalize
			eventStart = event.start.clone().stripZone();
			eventEnd = getEventEnd(event).stripZone();

			if (eventEnd > rangeStart && eventStart < rangeEnd) {

				if (eventStart < rangeStart) {
					segStart = rangeStart.clone();
					isStart = false;
				}
				else {
					segStart = eventStart;
					isStart = true;
				}

				if (eventEnd > rangeEnd) {
					segEnd = rangeEnd.clone();
					isEnd = false;
				}
				else {
					segEnd = eventEnd;
					isEnd = true;
				}

				segs.push({
					event: event,
					start: segStart,
					end: segEnd,
					isStart: isStart,
					isEnd: isEnd
				});
			}
		}

		return segs.sort(compareSlotSegs);
	}
	
	
	// renders events in the 'time slots' at the bottom
	// TODO: when we refactor this, when user returns `false` eventRender, don't have empty space
	// TODO: refactor will include using pixels to detect collisions instead of dates (handy for seg cmp)
	
	function renderSlotSegs(segs, modifiedEventId) {
	
		var i, segCnt=segs.length, seg,
			event,
			top,
			bottom,
			columnLeft,
			columnRight,
			columnWidth,
			width,
			left,
			right,
			html = '',
			eventElements,
			eventElement,
			triggerRes,
			titleElement,
			height,
			slotSegmentContainer = getSlotSegmentContainer(),
			isRTL = opt('isRTL');
			
		// calculate position/dimensions, create html
		for (i=0; i<segCnt; i++) {
			seg = segs[i];
			event = seg.event;
			top = computeDateTop(seg.start, seg.start);
			bottom = computeDateTop(seg.end, seg.start);
			columnLeft = colContentLeft(seg.col);
			columnRight = colContentRight(seg.col);
			columnWidth = columnRight - columnLeft;

			// shave off space on right near scrollbars (2.5%)
			// TODO: move this to CSS somehow
			columnRight -= columnWidth * .025;
			columnWidth = columnRight - columnLeft;

			width = columnWidth * (seg.forwardCoord - seg.backwardCoord);

			if (opt('slotEventOverlap')) {
				// double the width while making sure resize handle is visible
				// (assumed to be 20px wide)
				width = Math.max(
					(width - (20/2)) * 2,
					width // narrow columns will want to make the segment smaller than
						// the natural width. don't allow it
				);
			}

			if (isRTL) {
				right = columnRight - seg.backwardCoord * columnWidth;
				left = right - width;
			}
			else {
				left = columnLeft + seg.backwardCoord * columnWidth;
				right = left + width;
			}

			// make sure horizontal coordinates are in bounds
			left = Math.max(left, columnLeft);
			right = Math.min(right, columnRight);
			width = right - left;

			seg.top = top;
			seg.left = left;
			seg.outerWidth = width;
			seg.outerHeight = bottom - top;
			html += slotSegHtml(event, seg);
		}

		slotSegmentContainer[0].innerHTML = html; // faster than html()
		eventElements = slotSegmentContainer.children();
		
		// retrieve elements, run through eventRender callback, bind event handlers
		for (i=0; i<segCnt; i++) {
			seg = segs[i];
			event = seg.event;
			eventElement = $(eventElements[i]); // faster than eq()
			triggerRes = trigger('eventRender', event, event, eventElement);
			if (triggerRes === false) {
				eventElement.remove();
			}else{
				if (triggerRes && triggerRes !== true) {
					eventElement.remove();
					eventElement = $(triggerRes)
						.css({
							position: 'absolute',
							top: seg.top,
							left: seg.left
						})
						.appendTo(slotSegmentContainer);
				}
				seg.element = eventElement;
				if (event._id === modifiedEventId) {
					bindSlotSeg(event, eventElement, seg);
				}else{
					eventElement[0]._fci = i; // for lazySegBind
				}
				reportEventElement(event, eventElement);
			}
		}
		
		lazySegBind(slotSegmentContainer, segs, bindSlotSeg);
		
		// record event sides and title positions
		for (i=0; i<segCnt; i++) {
			seg = segs[i];
			if ((eventElement = seg.element)) {
				seg.vsides = vsides(eventElement, true);
				seg.hsides = hsides(eventElement, true);
				titleElement = eventElement.find('.fc-event-title');
				if (titleElement.length) {
					seg.contentTop = titleElement[0].offsetTop;
				}
			}
		}
		
		// set all positions/dimensions at once
		for (i=0; i<segCnt; i++) {
			seg = segs[i];
			if ((eventElement = seg.element)) {
				eventElement[0].style.width = Math.max(0, seg.outerWidth - seg.hsides) + 'px';
				height = Math.max(0, seg.outerHeight - seg.vsides);
				eventElement[0].style.height = height + 'px';
				event = seg.event;
				if (seg.contentTop !== undefined && height - seg.contentTop < 10) {
					// not enough room for title, put it in the time (TODO: maybe make both display:inline instead)
					eventElement.find('div.fc-event-time')
						.text(
							formatDate(event.start, opt('timeFormat')) + ' - ' + event.title
						);
					eventElement.find('div.fc-event-title')
						.remove();
				}
				trigger('eventAfterRender', event, event, eventElement);
			}
		}
					
	}
	
	
	function slotSegHtml(event, seg) {
		var html = "<";
		var url = event.url;
		var skinCss = getSkinCss(event, opt);
		var classes = ['fc-event', 'fc-event-vert'];
		if (isEventDraggable(event)) {
			classes.push('fc-event-draggable');
		}
		if (seg.isStart) {
			classes.push('fc-event-start');
		}
		if (seg.isEnd) {
			classes.push('fc-event-end');
		}
		classes = classes.concat(event.className);
		if (event.source) {
			classes = classes.concat(event.source.className || []);
		}
		if (url) {
			html += "a href='" + htmlEscape(event.url) + "'";
		}else{
			html += "div";
		}

		html +=
			" class='" + classes.join(' ') + "'" +
			" style=" +
				"'" +
				"position:absolute;" +
				"top:" + seg.top + "px;" +
				"left:" + seg.left + "px;" +
				skinCss +
				"'" +
			">" +
			"<div class='fc-event-inner'>" +
			"<div class='fc-event-time'>" +
			htmlEscape(t.getEventTimeText(event)) +
			"</div>" +
			"<div class='fc-event-title'>" +
			htmlEscape(event.title || '') +
			"</div>" +
			"</div>" +
			"<div class='fc-event-bg'></div>";

		if (seg.isEnd && isEventResizable(event)) {
			html +=
				"<div class='ui-resizable-handle ui-resizable-s'>=</div>";
		}
		html +=
			"</" + (url ? "a" : "div") + ">";
		return html;
	}
	
	
	function bindSlotSeg(event, eventElement, seg) {
		var timeElement = eventElement.find('div.fc-event-time');
		if (isEventDraggable(event)) {
			draggableSlotEvent(event, eventElement, timeElement);
		}
		if (seg.isEnd && isEventResizable(event)) {
			resizableSlotEvent(event, eventElement, timeElement);
		}
		eventElementHandlers(event, eventElement);
	}



 */
/* Dragging
 -----------------------------------------------------------------------------------*//*



 // when event starts out FULL-DAY
	// overrides DayEventRenderer's version because it needs to account for dragging elements
	// to and from the slot area.
	
	function draggableDayEvent(event, eventElement, seg) {
		var isStart = seg.isStart;
		var origWidth;
		var revert;
		var allDay = true;
		var dayDelta;

		var hoverListener = getHoverListener();
		var colWidth = getColWidth();
		var minTime = getMinTime();
		var slotDuration = getSlotDuration();
		var slotHeight = getSlotHeight();
		var snapDuration = getSnapDuration();
		var snapHeight = getSnapHeight();

		eventElement.draggable({
			opacity: opt('dragOpacity', 'month'), // use whatever the month view was using
			revertDuration: opt('dragRevertDuration'),
			start: function(ev, ui) {

				trigger('eventDragStart', eventElement[0], event, ev, ui);
				hideEvents(event, eventElement);
				origWidth = eventElement.width();

				hoverListener.start(function(cell, origCell) {
					clearOverlays();
					if (cell) {
						revert = false;

						var origDate = cellToDate(0, origCell.col);
						var date = cellToDate(0, cell.col);
						dayDelta = date.diff(origDate, 'days');

						if (!cell.row) { // on full-days
							
							renderDayOverlay(
								event.start.clone().add('days', dayDelta),
								getEventEnd(event).add('days', dayDelta)
							);

							resetElement();
						}
						else { // mouse is over bottom slots

							if (isStart) {
								if (allDay) {
									// convert event to temporary slot-event
									eventElement.width(colWidth - 10); // don't use entire width
									setOuterHeight(eventElement, calendar.defaultTimedEventDuration / slotDuration * slotHeight); // the default height
									eventElement.draggable('option', 'grid', [ colWidth, 1 ]);
									allDay = false;
								}
							}
							else {
								revert = true;
							}
						}

						revert = revert || (allDay && !dayDelta);
					}
					else {
						resetElement();
						revert = true;
					}

					eventElement.draggable('option', 'revert', revert);

				}, ev, 'drag');
			},
			stop: function(ev, ui) {
				hoverListener.stop();
				clearOverlays();
				trigger('eventDragStop', eventElement[0], event, ev, ui);

				if (revert) { // hasn't moved or is out of bounds (draggable has already reverted)
					
					resetElement();
					eventElement.css('filter', ''); // clear IE opacity side-effects
					showEvents(event, eventElement);
				}
				else { // changed!

					var eventStart = event.start.clone().add('days', dayDelta); // already assumed to have a stripped time
					var snapTime;
					var snapIndex;
					if (!allDay) {
						snapIndex = Math.round((eventElement.offset().top - getSlotContainer().offset().top) / snapHeight); // why not use ui.offset.top?
						snapTime = moment.duration(minTime + snapIndex * snapDuration);
						eventStart = calendar.rezoneDate(eventStart.clone().time(snapTime));
					}

					eventDrop(
						eventElement[0],
						event,
						eventStart,
						ev,
						ui
					);
				}
			}
		});
		function resetElement() {
			if (!allDay) {
				eventElement
					.width(origWidth)
					.height('')
					.draggable('option', 'grid', null);
				allDay = true;
			}
		}
	}
	
	
	// when event starts out IN TIMESLOTS
	
	function draggableSlotEvent(event, eventElement, timeElement) {
		var coordinateGrid = t.getCoordinateGrid();
		var colCnt = getColCnt();
		var colWidth = getColWidth();
		var snapHeight = getSnapHeight();
		var snapDuration = getSnapDuration();

		// states
		var origPosition; // original position of the element, not the mouse
		var origCell;
		var isInBounds, prevIsInBounds;
		var isAllDay, prevIsAllDay;
		var colDelta, prevColDelta;
		var dayDelta; // derived from colDelta
		var snapDelta, prevSnapDelta; // the number of snaps away from the original position

		// newly computed
		var eventStart, eventEnd;

		eventElement.draggable({
			scroll: false,
			grid: [ colWidth, snapHeight ],
			axis: colCnt==1 ? 'y' : false,
			opacity: opt('dragOpacity'),
			revertDuration: opt('dragRevertDuration'),
			start: function(ev, ui) {

				trigger('eventDragStart', eventElement[0], event, ev, ui);
				hideEvents(event, eventElement);

				coordinateGrid.build();

				// initialize states
				origPosition = eventElement.position();
				origCell = coordinateGrid.cell(ev.pageX, ev.pageY);
				isInBounds = prevIsInBounds = true;
				isAllDay = prevIsAllDay = getIsCellAllDay(origCell);
				colDelta = prevColDelta = 0;
				dayDelta = 0;
				snapDelta = prevSnapDelta = 0;

				eventStart = null;
				eventEnd = null;
			},
			drag: function(ev, ui) {

				// NOTE: this `cell` value is only useful for determining in-bounds and all-day.
				// Bad for anything else due to the discrepancy between the mouse position and the
				// element position while snapping. (problem revealed in PR #55)
				//
				// PS- the problem exists for draggableDayEvent() when dragging an all-day event to a slot event.
				// We should overhaul the dragging system and stop relying on jQuery UI.
				var cell = coordinateGrid.cell(ev.pageX, ev.pageY);

				// update states
				isInBounds = !!cell;
				if (isInBounds) {
					isAllDay = getIsCellAllDay(cell);

					// calculate column delta
					colDelta = Math.round((ui.position.left - origPosition.left) / colWidth);
					if (colDelta != prevColDelta) {
						// calculate the day delta based off of the original clicked column and the column delta
						var origDate = cellToDate(0, origCell.col);
						var col = origCell.col + colDelta;
						col = Math.max(0, col);
						col = Math.min(colCnt-1, col);
						var date = cellToDate(0, col);
						dayDelta = date.diff(origDate, 'days');
					}

					// calculate minute delta (only if over slots)
					if (!isAllDay) {
						snapDelta = Math.round((ui.position.top - origPosition.top) / snapHeight);
					}
				}

				// any state changes?
				if (
					isInBounds != prevIsInBounds ||
					isAllDay != prevIsAllDay ||
					colDelta != prevColDelta ||
					snapDelta != prevSnapDelta
				) {

					// compute new dates
					if (isAllDay) {
						eventStart = event.start.clone().stripTime().add('days', dayDelta);
						eventEnd = eventStart.clone().add(calendar.defaultAllDayEventDuration);
					}
					else {
						eventStart = event.start.clone().add(snapDelta * snapDuration).add('days', dayDelta);
						eventEnd = getEventEnd(event).add(snapDelta * snapDuration).add('days', dayDelta);
					}

					updateUI();

					// update previous states for next time
					prevIsInBounds = isInBounds;
					prevIsAllDay = isAllDay;
					prevColDelta = colDelta;
					prevSnapDelta = snapDelta;
				}

				// if out-of-bounds, revert when done, and vice versa.
				eventElement.draggable('option', 'revert', !isInBounds);

			},
			stop: function(ev, ui) {

				clearOverlays();
				trigger('eventDragStop', eventElement[0], event, ev, ui);

				if (isInBounds && (isAllDay || dayDelta || snapDelta)) { // changed!
					eventDrop(
						eventElement[0],
						event,
						eventStart,
						ev,
						ui
					);
				}
				else { // either no change or out-of-bounds (draggable has already reverted)

					// reset states for next time, and for updateUI()
					isInBounds = true;
					isAllDay = false;
					colDelta = 0;
					dayDelta = 0;
					snapDelta = 0;

					updateUI();
					eventElement.css('filter', ''); // clear IE opacity side-effects

					// sometimes fast drags make event revert to wrong position, so reset.
					// also, if we dragged the element out of the area because of snapping,
					// but the *mouse* is still in bounds, we need to reset the position.
					eventElement.css(origPosition);

					showEvents(event, eventElement);
				}
			}
		});

		function updateUI() {
			clearOverlays();
			if (isInBounds) {
				if (isAllDay) {
					timeElement.hide();
					eventElement.draggable('option', 'grid', null); // disable grid snapping
					renderDayOverlay(eventStart, eventEnd);
				}
				else {
					updateTimeText();
					timeElement.css('display', ''); // show() was causing display=inline
					eventElement.draggable('option', 'grid', [colWidth, snapHeight]); // re-enable grid snapping
				}
			}
		}

		function updateTimeText() {
			if (eventStart) { // must of had a state change
				timeElement.text(
					t.getEventTimeText(eventStart, event.end ? eventEnd : null)
					//                                       ^
					// only display the new end if there was an old end
				);
			}
		}

	}



 */
/* Resizing
 --------------------------------------------------------------------------------------*//*



 function resizableSlotEvent(event, eventElement, timeElement) {
		var snapDelta, prevSnapDelta;
		var snapHeight = getSnapHeight();
		var snapDuration = getSnapDuration();
		var eventEnd;

		eventElement.resizable({
			handles: {
				s: '.ui-resizable-handle'
			},
			grid: snapHeight,
			start: function(ev, ui) {
				snapDelta = prevSnapDelta = 0;
				hideEvents(event, eventElement);
				trigger('eventResizeStart', eventElement[0], event, ev, ui);
			},
			resize: function(ev, ui) {
				// don't rely on ui.size.height, doesn't take grid into account
				snapDelta = Math.round((Math.max(snapHeight, eventElement.height()) - ui.originalSize.height) / snapHeight);
				if (snapDelta != prevSnapDelta) {
					eventEnd = getEventEnd(event).add(snapDuration * snapDelta);
					var text;
					if (snapDelta) { // has there been a change?
						text = t.getEventTimeText(event.start, eventEnd);
					}
					else {
						text = t.getEventTimeText(event); // the original time text
					}
					timeElement.text(text);
					prevSnapDelta = snapDelta;
				}
			},
			stop: function(ev, ui) {
				trigger('eventResizeStop', eventElement[0], event, ev, ui);
				if (snapDelta) {
					eventResize(
						eventElement[0],
						event,
						eventEnd,
						ev,
						ui
					);
				}
				else {
					showEvents(event, eventElement);
					// BUG: if event was really short, need to put title back in span
				}
			}
		});
	}
	

}



 */
/* Agenda Event Segment Utilities
 -----------------------------------------------------------------------------*//*



 // Sets the seg.backwardCoord and seg.forwardCoord on each segment and returns a new
// list in the order they should be placed into the DOM (an implicit z-index).
function placeSlotSegs(segs) {
	var levels = buildSlotSegLevels(segs);
	var level0 = levels[0];
	var i;

	computeForwardSlotSegs(levels);

	if (level0) {

		for (i=0; i<level0.length; i++) {
			computeSlotSegPressures(level0[i]);
		}

		for (i=0; i<level0.length; i++) {
			computeSlotSegCoords(level0[i], 0, 0);
		}
	}

	return flattenSlotSegLevels(levels);
}


// Builds an array of segments "levels". The first level will be the leftmost tier of segments
// if the calendar is left-to-right, or the rightmost if the calendar is right-to-left.
function buildSlotSegLevels(segs) {
	var levels = [];
	var i, seg;
	var j;

	for (i=0; i<segs.length; i++) {
		seg = segs[i];

		// go through all the levels and stop on the first level where there are no collisions
		for (j=0; j<levels.length; j++) {
			if (!computeSlotSegCollisions(seg, levels[j]).length) {
				break;
			}
		}

		(levels[j] || (levels[j] = [])).push(seg);
	}

	return levels;
}


// For every segment, figure out the other segments that are in subsequent
// levels that also occupy the same vertical space. Accumulate in seg.forwardSegs
function computeForwardSlotSegs(levels) {
	var i, level;
	var j, seg;
	var k;

	for (i=0; i<levels.length; i++) {
		level = levels[i];

		for (j=0; j<level.length; j++) {
			seg = level[j];

			seg.forwardSegs = [];
			for (k=i+1; k<levels.length; k++) {
				computeSlotSegCollisions(seg, levels[k], seg.forwardSegs);
			}
		}
	}
}


// Figure out which path forward (via seg.forwardSegs) results in the longest path until
// the furthest edge is reached. The number of segments in this path will be seg.forwardPressure
function computeSlotSegPressures(seg) {
	var forwardSegs = seg.forwardSegs;
	var forwardPressure = 0;
	var i, forwardSeg;

	if (seg.forwardPressure === undefined) { // not already computed

		for (i=0; i<forwardSegs.length; i++) {
			forwardSeg = forwardSegs[i];

			// figure out the child's maximum forward path
			computeSlotSegPressures(forwardSeg);

			// either use the existing maximum, or use the child's forward pressure
			// plus one (for the forwardSeg itself)
			forwardPressure = Math.max(
				forwardPressure,
				1 + forwardSeg.forwardPressure
			);
		}

		seg.forwardPressure = forwardPressure;
	}
}


// Calculate seg.forwardCoord and seg.backwardCoord for the segment, where both values range
// from 0 to 1. If the calendar is left-to-right, the seg.backwardCoord maps to "left" and
// seg.forwardCoord maps to "right" (via percentage). Vice-versa if the calendar is right-to-left.
//
// The segment might be part of a "series", which means consecutive segments with the same pressure
// who's width is unknown until an edge has been hit. `seriesBackwardPressure` is the number of
// segments behind this one in the current series, and `seriesBackwardCoord` is the starting
// coordinate of the first segment in the series.
function computeSlotSegCoords(seg, seriesBackwardPressure, seriesBackwardCoord) {
	var forwardSegs = seg.forwardSegs;
	var i;

	if (seg.forwardCoord === undefined) { // not already computed

		if (!forwardSegs.length) {

			// if there are no forward segments, this segment should butt up against the edge
			seg.forwardCoord = 1;
		}
		else {

			// sort highest pressure first
			forwardSegs.sort(compareForwardSlotSegs);

			// this segment's forwardCoord will be calculated from the backwardCoord of the
			// highest-pressure forward segment.
			computeSlotSegCoords(forwardSegs[0], seriesBackwardPressure + 1, seriesBackwardCoord);
			seg.forwardCoord = forwardSegs[0].backwardCoord;
		}

		// calculate the backwardCoord from the forwardCoord. consider the series
		seg.backwardCoord = seg.forwardCoord -
			(seg.forwardCoord - seriesBackwardCoord) / // available width for series
			(seriesBackwardPressure + 1); // # of segments in the series

		// use this segment's coordinates to computed the coordinates of the less-pressurized
		// forward segments
		for (i=0; i<forwardSegs.length; i++) {
			computeSlotSegCoords(forwardSegs[i], 0, seg.forwardCoord);
		}
	}
}


// Outputs a flat array of segments, from lowest to highest level
function flattenSlotSegLevels(levels) {
	var segs = [];
	var i, level;
	var j;

	for (i=0; i<levels.length; i++) {
		level = levels[i];

		for (j=0; j<level.length; j++) {
			segs.push(level[j]);
		}
	}

	return segs;
}


// Find all the segments in `otherSegs` that vertically collide with `seg`.
// Append into an optionally-supplied `results` array and return.
function computeSlotSegCollisions(seg, otherSegs, results) {
	results = results || [];

	for (var i=0; i<otherSegs.length; i++) {
		if (isSlotSegCollision(seg, otherSegs[i])) {
			results.push(otherSegs[i]);
		}
	}

	return results;
}


// Do these segments occupy the same vertical space?
function isSlotSegCollision(seg1, seg2) {
	return seg1.end > seg2.start && seg1.start < seg2.end;
}


// A cmp function for determining which forward segment to rely on more when computing coordinates.
function compareForwardSlotSegs(seg1, seg2) {
	// put higher-pressure first
	return seg2.forwardPressure - seg1.forwardPressure ||
		// put segments that are closer to initial edge first (and favor ones with no coords yet)
		(seg1.backwardCoord || 0) - (seg2.backwardCoord || 0) ||
		// do normal sorting...
		compareSlotSegs(seg1, seg2);
}


// A cmp function for determining which segment should be closer to the initial edge
// (the left edge on a left-to-right calendar).
function compareSlotSegs(seg1, seg2) {
	return seg1.start - seg2.start || // earlier start time goes first
		(seg2.end - seg2.start) - (seg1.end - seg1.start) || // tie? longer-duration goes first
		(seg1.event.title || '').localeCompare(seg2.event.title); // tie? alphabetically by title
}


;;


function View(element, calendar, viewName) {
	var t = this;
	
	
	// exports
	t.element = element;
	t.calendar = calendar;
	t.name = viewName;
	t.opt = opt;
	t.trigger = trigger;
	t.isEventDraggable = isEventDraggable;
	t.isEventResizable = isEventResizable;
	t.clearEventData = clearEventData;
	t.reportEventElement = reportEventElement;
	t.triggerEventDestroy = triggerEventDestroy;
	t.eventElementHandlers = eventElementHandlers;
	t.showEvents = showEvents;
	t.hideEvents = hideEvents;
	t.eventDrop = eventDrop;
	t.eventResize = eventResize;
	// t.start, t.end // moments with ambiguous-time
	// t.intervalStart, t.intervalEnd // moments with ambiguous-time
	
	
	// imports
	var reportEventChange = calendar.reportEventChange;
	
	
	// locals
	var eventElementsByID = {}; // eventID mapped to array of jQuery elements
	var eventElementCouples = []; // array of objects, { event, element } // TODO: unify with segment system
	var options = calendar.options;
	var nextDayThreshold = moment.duration(options.nextDayThreshold);

	
	
	
	function opt(name, viewNameOverride) {
		var v = options[name];
		if ($.isPlainObject(v) && !isForcedAtomicOption(name)) {
			return smartProperty(v, viewNameOverride || viewName);
		}
		return v;
	}

	
	function trigger(name, thisObj) {
		return calendar.trigger.apply(
			calendar,
			[name, thisObj || t].concat(Array.prototype.slice.call(arguments, 2), [t])
		);
	}



 */
/* Event Editable Boolean Calculations
 ------------------------------------------------------------------------------*//*



 function isEventDraggable(event) {
		var source = event.source || {};
		return firstDefined(
				event.startEditable,
				source.startEditable,
				opt('eventStartEditable'),
				event.editable,
				source.editable,
				opt('editable')
			);
	}
	
	
	function isEventResizable(event) { // but also need to make sure the seg.isEnd == true
		var source = event.source || {};
		return firstDefined(
				event.durationEditable,
				source.durationEditable,
				opt('eventDurationEditable'),
				event.editable,
				source.editable,
				opt('editable')
			);
	}



 */
/* Event Data
 ------------------------------------------------------------------------------*//*



 function clearEventData() {
		eventElementsByID = {};
		eventElementCouples = [];
	}



 */
/* Event Elements
 ------------------------------------------------------------------------------*//*



 // report when view creates an element for an event
	function reportEventElement(event, element) {
		eventElementCouples.push({ event: event, element: element });
		if (eventElementsByID[event._id]) {
			eventElementsByID[event._id].push(element);
		}else{
			eventElementsByID[event._id] = [element];
		}
	}


	function triggerEventDestroy() {
		$.each(eventElementCouples, function(i, couple) {
			t.trigger('eventDestroy', couple.event, couple.event, couple.element);
		});
	}
	
	
	// attaches eventClick, eventMouseover, eventMouseout
	function eventElementHandlers(event, eventElement) {
		eventElement
			.click(function(ev) {
				if (!eventElement.hasClass('ui-draggable-dragging') &&
					!eventElement.hasClass('ui-resizable-resizing')) {
						return trigger('eventClick', this, event, ev);
					}
			})
			.hover(
				function(ev) {
					trigger('eventMouseover', this, event, ev);
				},
				function(ev) {
					trigger('eventMouseout', this, event, ev);
				}
			);
		// TODO: don't fire eventMouseover/eventMouseout *while* dragging is occuring (on subject element)
		// TODO: same for resizing
	}
	
	
	function showEvents(event, exceptElement) {
		eachEventElement(event, exceptElement, 'show');
	}
	
	
	function hideEvents(event, exceptElement) {
		eachEventElement(event, exceptElement, 'hide');
	}
	
	
	function eachEventElement(event, exceptElement, funcName) {
		// NOTE: there may be multiple events per ID (repeating events)
		// and multiple segments per event
		var elements = eventElementsByID[event._id],
			i, len = elements.length;
		for (i=0; i<len; i++) {
			if (!exceptElement || elements[i][0] != exceptElement[0]) {
				elements[i][funcName]();
			}
		}
	}


	// Compute the text that should be displayed on an event's element.
	// Based off the settings of the view.
	// Given either an event object or two arguments: a start and end date (which can be null)
	t.getEventTimeText = function(event) {
		var start;
		var end;

		if (arguments.length === 2) {
			start = arguments[0];
			end = arguments[1];
		}
		else {
			start = event.start;
			end = event.end;
		}

		if (end && opt('displayEventEnd')) {
			return calendar.formatRange(start, end, opt('timeFormat'));
		}
		else {
			return calendar.formatDate(start, opt('timeFormat'));
		}
	};



 */
/* Event Modification Reporting
 ---------------------------------------------------------------------------------*//*



 function eventDrop(el, event, newStart, ev, ui) {
		var mutateResult = calendar.mutateEvent(event, newStart, null);

		trigger(
			'eventDrop',
			el,
			event,
			mutateResult.dateDelta,
			function() {
				mutateResult.undo();
				reportEventChange(event._id);
			},
			ev,
			ui
		);

		reportEventChange(event._id);
	}


	function eventResize(el, event, newEnd, ev, ui) {
		var mutateResult = calendar.mutateEvent(event, null, newEnd);

		trigger(
			'eventResize',
			el,
			event,
			mutateResult.durationDelta,
			function() {
				mutateResult.undo();
				reportEventChange(event._id);
			},
			ev,
			ui
		);

		reportEventChange(event._id);
	}


	// ====================================================================================================
	// Utilities for day "cells"
	// ====================================================================================================
	// The "basic" views are completely made up of day cells.
	// The "agenda" views have day cells at the top "all day" slot.
	// This was the obvious common place to put these utilities, but they should be abstracted out into
	// a more meaningful class (like DayEventRenderer).
	// ====================================================================================================


	// For determining how a given "cell" translates into a "date":
	//
	// 1. Convert the "cell" (row and column) into a "cell offset" (the # of the cell, cronologically from the first).
	//    Keep in mind that column indices are inverted with isRTL. This is taken into account.
	//
	// 2. Convert the "cell offset" to a "day offset" (the # of days since the first visible day in the view).
	//
	// 3. Convert the "day offset" into a "date" (a Moment).
	//
	// The reverse transformation happens when transforming a date into a cell.


	// exports
	t.isHiddenDay = isHiddenDay;
	t.skipHiddenDays = skipHiddenDays;
	t.getCellsPerWeek = getCellsPerWeek;
	t.dateToCell = dateToCell;
	t.dateToDayOffset = dateToDayOffset;
	t.dayOffsetToCellOffset = dayOffsetToCellOffset;
	t.cellOffsetToCell = cellOffsetToCell;
	t.cellToDate = cellToDate;
	t.cellToCellOffset = cellToCellOffset;
	t.cellOffsetToDayOffset = cellOffsetToDayOffset;
	t.dayOffsetToDate = dayOffsetToDate;
	t.rangeToSegments = rangeToSegments;


	// internals
	var hiddenDays = opt('hiddenDays') || []; // array of day-of-week indices that are hidden
	var isHiddenDayHash = []; // is the day-of-week hidden? (hash with day-of-week-index -> bool)
	var cellsPerWeek;
	var dayToCellMap = []; // hash from dayIndex -> cellIndex, for one week
	var cellToDayMap = []; // hash from cellIndex -> dayIndex, for one week
	var isRTL = opt('isRTL');


	// initialize important internal variables
	(function() {

		if (opt('weekends') === false) {
			hiddenDays.push(0, 6); // 0=sunday, 6=saturday
		}

		// Loop through a hypothetical week and determine which
		// days-of-week are hidden. Record in both hashes (one is the reverse of the other).
		for (var dayIndex=0, cellIndex=0; dayIndex<7; dayIndex++) {
			dayToCellMap[dayIndex] = cellIndex;
			isHiddenDayHash[dayIndex] = $.inArray(dayIndex, hiddenDays) != -1;
			if (!isHiddenDayHash[dayIndex]) {
				cellToDayMap[cellIndex] = dayIndex;
				cellIndex++;
			}
		}

		cellsPerWeek = cellIndex;
		if (!cellsPerWeek) {
			throw 'invalid hiddenDays'; // all days were hidden? bad.
		}

	})();


	// Is the current day hidden?
	// `day` is a day-of-week index (0-6), or a Moment
	function isHiddenDay(day) {
		if (moment.isMoment(day)) {
			day = day.day();
		}
		return isHiddenDayHash[day];
	}


	function getCellsPerWeek() {
		return cellsPerWeek;
	}


	// Incrementing the current day until it is no longer a hidden day, returning a copy.
	// If the initial value of `date` is not a hidden day, don't do anything.
	// Pass `isExclusive` as `true` if you are dealing with an end date.
	// `inc` defaults to `1` (increment one day forward each time)
	function skipHiddenDays(date, inc, isExclusive) {
		var out = date.clone();
		inc = inc || 1;
		while (
			isHiddenDayHash[(out.day() + (isExclusive ? inc : 0) + 7) % 7]
		) {
			out.add('days', inc);
		}
		return out;
	}


	//
	// TRANSFORMATIONS: cell -> cell offset -> day offset -> date
	//

	// cell -> date (combines all transformations)
	// Possible arguments:
	// - row, col
	// - { row:#, col: # }
	function cellToDate() {
		var cellOffset = cellToCellOffset.apply(null, arguments);
		var dayOffset = cellOffsetToDayOffset(cellOffset);
		var date = dayOffsetToDate(dayOffset);
		return date;
	}

	// cell -> cell offset
	// Possible arguments:
	// - row, col
	// - { row:#, col:# }
	function cellToCellOffset(row, col) {
		var colCnt = t.getColCnt();

		// rtl variables. wish we could pre-populate these. but where?
		var dis = isRTL ? -1 : 1;
		var dit = isRTL ? colCnt - 1 : 0;

		if (typeof row == 'object') {
			col = row.col;
			row = row.row;
		}
		var cellOffset = row * colCnt + (col * dis + dit); // column, adjusted for RTL (dis & dit)

		return cellOffset;
	}

	// cell offset -> day offset
	function cellOffsetToDayOffset(cellOffset) {
		var day0 = t.start.day(); // first date's day of week
		cellOffset += dayToCellMap[day0]; // normlize cellOffset to beginning-of-week
		return Math.floor(cellOffset / cellsPerWeek) * 7 + // # of days from full weeks
			cellToDayMap[ // # of days from partial last week
				(cellOffset % cellsPerWeek + cellsPerWeek) % cellsPerWeek // crazy math to handle negative cellOffsets
			] -
			day0; // adjustment for beginning-of-week normalization
	}

	// day offset -> date
	function dayOffsetToDate(dayOffset) {
		return t.start.clone().add('days', dayOffset);
	}


	//
	// TRANSFORMATIONS: date -> day offset -> cell offset -> cell
	//

	// date -> cell (combines all transformations)
	function dateToCell(date) {
		var dayOffset = dateToDayOffset(date);
		var cellOffset = dayOffsetToCellOffset(dayOffset);
		var cell = cellOffsetToCell(cellOffset);
		return cell;
	}

	// date -> day offset
	function dateToDayOffset(date) {
		return date.clone().stripTime().diff(t.start, 'days');
	}

	// day offset -> cell offset
	function dayOffsetToCellOffset(dayOffset) {
		var day0 = t.start.day(); // first date's day of week
		dayOffset += day0; // normalize dayOffset to beginning-of-week
		return Math.floor(dayOffset / 7) * cellsPerWeek + // # of cells from full weeks
			dayToCellMap[ // # of cells from partial last week
				(dayOffset % 7 + 7) % 7 // crazy math to handle negative dayOffsets
			] -
			dayToCellMap[day0]; // adjustment for beginning-of-week normalization
	}

	// cell offset -> cell (object with row & col keys)
	function cellOffsetToCell(cellOffset) {
		var colCnt = t.getColCnt();

		// rtl variables. wish we could pre-populate these. but where?
		var dis = isRTL ? -1 : 1;
		var dit = isRTL ? colCnt - 1 : 0;

		var row = Math.floor(cellOffset / colCnt);
		var col = ((cellOffset % colCnt + colCnt) % colCnt) * dis + dit; // column, adjusted for RTL (dis & dit)
		return {
			row: row,
			col: col
		};
	}


	//
	// Converts a date range into an array of segment objects.
	// "Segments" are horizontal stretches of time, sliced up by row.
	// A segment object has the following properties:
	// - row
	// - cols
	// - isStart
	// - isEnd
	//
	function rangeToSegments(start, end) {

		var rowCnt = t.getRowCnt();
		var colCnt = t.getColCnt();
		var segments = []; // array of segments to return

		// day offset for given date range
		var rangeDayOffsetStart = dateToDayOffset(start);
		var rangeDayOffsetEnd = dateToDayOffset(end); // an exclusive value
		var endTimeMS = +end.time();
		if (endTimeMS && endTimeMS >= nextDayThreshold) {
			rangeDayOffsetEnd++;
		}
		rangeDayOffsetEnd = Math.max(rangeDayOffsetEnd, rangeDayOffsetStart + 1);

		// first and last cell offset for the given date range
		// "last" implies inclusivity
		var rangeCellOffsetFirst = dayOffsetToCellOffset(rangeDayOffsetStart);
		var rangeCellOffsetLast = dayOffsetToCellOffset(rangeDayOffsetEnd) - 1;

		// loop through all the rows in the view
		for (var row=0; row<rowCnt; row++) {

			// first and last cell offset for the row
			var rowCellOffsetFirst = row * colCnt;
			var rowCellOffsetLast = rowCellOffsetFirst + colCnt - 1;

			// get the segment's cell offsets by constraining the range's cell offsets to the bounds of the row
			var segmentCellOffsetFirst = Math.max(rangeCellOffsetFirst, rowCellOffsetFirst);
			var segmentCellOffsetLast = Math.min(rangeCellOffsetLast, rowCellOffsetLast);

			// make sure segment's offsets are valid and in view
			if (segmentCellOffsetFirst <= segmentCellOffsetLast) {

				// translate to cells
				var segmentCellFirst = cellOffsetToCell(segmentCellOffsetFirst);
				var segmentCellLast = cellOffsetToCell(segmentCellOffsetLast);

				// view might be RTL, so order by leftmost column
				var cols = [ segmentCellFirst.col, segmentCellLast.col ].sort();

				// Determine if segment's first/last cell is the beginning/end of the date range.
				// We need to compare "day offset" because "cell offsets" are often ambiguous and
				// can translate to multiple days, and an edge case reveals itself when we the
				// range's first cell is hidden (we don't want isStart to be true).
				var isStart = cellOffsetToDayOffset(segmentCellOffsetFirst) == rangeDayOffsetStart;
				var isEnd = cellOffsetToDayOffset(segmentCellOffsetLast) + 1 == rangeDayOffsetEnd; // +1 for comparing exclusively

				segments.push({
					row: row,
					leftCol: cols[0],
					rightCol: cols[1],
					isStart: isStart,
					isEnd: isEnd
				});
			}
		}

		return segments;
	}
	

}

;;

function DayEventRenderer() {
	var t = this;

	
	// exports
	t.renderDayEvents = renderDayEvents;
	t.draggableDayEvent = draggableDayEvent; // made public so that subclasses can override
	t.resizableDayEvent = resizableDayEvent; // "
	
	
	// imports
	var opt = t.opt;
	var trigger = t.trigger;
	var isEventDraggable = t.isEventDraggable;
	var isEventResizable = t.isEventResizable;
	var reportEventElement = t.reportEventElement;
	var eventElementHandlers = t.eventElementHandlers;
	var showEvents = t.showEvents;
	var hideEvents = t.hideEvents;
	var eventDrop = t.eventDrop;
	var eventResize = t.eventResize;
	var getRowCnt = t.getRowCnt;
	var getColCnt = t.getColCnt;
	var allDayRow = t.allDayRow; // TODO: rename
	var colLeft = t.colLeft;
	var colRight = t.colRight;
	var colContentLeft = t.colContentLeft;
	var colContentRight = t.colContentRight;
	var getDaySegmentContainer = t.getDaySegmentContainer;
	var renderDayOverlay = t.renderDayOverlay;
	var clearOverlays = t.clearOverlays;
	var clearSelection = t.clearSelection;
	var getHoverListener = t.getHoverListener;
	var rangeToSegments = t.rangeToSegments;
	var cellToDate = t.cellToDate;
	var cellToCellOffset = t.cellToCellOffset;
	var cellOffsetToDayOffset = t.cellOffsetToDayOffset;
	var dateToDayOffset = t.dateToDayOffset;
	var dayOffsetToCellOffset = t.dayOffsetToCellOffset;
	var calendar = t.calendar;
	var getEventEnd = calendar.getEventEnd;


	// Render `events` onto the calendar, attach mouse event handlers, and call the `eventAfterRender` callback for each.
	// Mouse event will be lazily applied, except if the event has an ID of `modifiedEventId`.
	// Can only be called when the event container is empty (because it wipes out all innerHTML).
	function renderDayEvents(events, modifiedEventId) {

		// do the actual rendering. Receive the intermediate "segment" data structures.
		var segments = _renderDayEvents(
			events,
			false, // don't append event elements
			true // set the heights of the rows
		);

		// report the elements to the View, for general drag/resize utilities
		segmentElementEach(segments, function(segment, element) {
			reportEventElement(segment.event, element);
		});

		// attach mouse handlers
		attachHandlers(segments, modifiedEventId);

		// call `eventAfterRender` callback for each event
		segmentElementEach(segments, function(segment, element) {
			trigger('eventAfterRender', segment.event, segment.event, element);
		});
	}


	// Render an event on the calendar, but don't report them anywhere, and don't attach mouse handlers.
	// Append this event element to the event container, which might already be populated with events.
	// If an event's segment will have row equal to `adjustRow`, then explicitly set its top coordinate to `adjustTop`.
	// This hack is used to maintain continuity when user is manually resizing an event.
	// Returns an array of DOM elements for the event.
	function renderTempDayEvent(event, adjustRow, adjustTop) {

		// actually render the event. `true` for appending element to container.
		// Recieve the intermediate "segment" data structures.
		var segments = _renderDayEvents(
			[ event ],
			true, // append event elements
			false // don't set the heights of the rows
		);

		var elements = [];

		// Adjust certain elements' top coordinates
		segmentElementEach(segments, function(segment, element) {
			if (segment.row === adjustRow) {
				element.css('top', adjustTop);
			}
			elements.push(element[0]); // accumulate DOM nodes
		});

		return elements;
	}


	// Render events onto the calendar. Only responsible for the VISUAL aspect.
	// Not responsible for attaching handlers or calling callbacks.
	// Set `doAppend` to `true` for rendering elements without clearing the existing container.
	// Set `doRowHeights` to allow setting the height of each row, to compensate for vertical event overflow.
	function _renderDayEvents(events, doAppend, doRowHeights) {

		// where the DOM nodes will eventually end up
		var finalContainer = getDaySegmentContainer();

		// the container where the initial HTML will be rendered.
		// If `doAppend`==true, uses a temporary container.
		var renderContainer = doAppend ? $("<div/>") : finalContainer;

		var segments = buildSegments(events);
		var html;
		var elements;

		// calculate the desired `left` and `width` properties on each segment object
		calculateHorizontals(segments);

		// build the HTML string. relies on `left` property
		html = buildHTML(segments);

		// render the HTML. innerHTML is considerably faster than jQuery's .html()
		renderContainer[0].innerHTML = html;

		// retrieve the individual elements
		elements = renderContainer.children();

		// if we were appending, and thus using a temporary container,
		// re-attach elements to the real container.
		if (doAppend) {
			finalContainer.append(elements);
		}

		// assigns each element to `segment.event`, after filtering them through user callbacks
		resolveElements(segments, elements);

		// Calculate the left and right padding+margin for each element.
		// We need this for setting each element's desired outer width, because of the W3C box model.
		// It's important we do this in a separate pass from acually setting the width on the DOM elements
		// because alternating reading/writing dimensions causes reflow for every iteration.
		segmentElementEach(segments, function(segment, element) {
			segment.hsides = hsides(element, true); // include margins = `true`
		});

		// Set the width of each element
		segmentElementEach(segments, function(segment, element) {
			element.width(
				Math.max(0, segment.outerWidth - segment.hsides)
			);
		});

		// Grab each element's outerHeight (setVerticals uses this).
		// To get an accurate reading, it's important to have each element's width explicitly set already.
		segmentElementEach(segments, function(segment, element) {
			segment.outerHeight = element.outerHeight(true); // include margins = `true`
		});

		// Set the top coordinate on each element (requires segment.outerHeight)
		setVerticals(segments, doRowHeights);

		return segments;
	}


	// Generate an array of "segments" for all events.
	function buildSegments(events) {
		var segments = [];
		for (var i=0; i<events.length; i++) {
			var eventSegments = buildSegmentsForEvent(events[i]);
			segments.push.apply(segments, eventSegments); // append an array to an array
		}
		return segments;
	}


	// Generate an array of segments for a single event.
	// A "segment" is the same data structure that View.rangeToSegments produces,
	// with the addition of the `event` property being set to reference the original event.
	function buildSegmentsForEvent(event) {
		var segments = rangeToSegments(event.start, getEventEnd(event));
		for (var i=0; i<segments.length; i++) {
			segments[i].event = event;
		}
		return segments;
	}


	// Sets the `left` and `outerWidth` property of each segment.
	// These values are the desired dimensions for the eventual DOM elements.
	function calculateHorizontals(segments) {
		var isRTL = opt('isRTL');
		for (var i=0; i<segments.length; i++) {
			var segment = segments[i];

			// Determine functions used for calulating the elements left/right coordinates,
			// depending on whether the view is RTL or not.
			// NOTE:
			// colLeft/colRight returns the coordinate butting up the edge of the cell.
			// colContentLeft/colContentRight is indented a little bit from the edge.
			var leftFunc = (isRTL ? segment.isEnd : segment.isStart) ? colContentLeft : colLeft;
			var rightFunc = (isRTL ? segment.isStart : segment.isEnd) ? colContentRight : colRight;

			var left = leftFunc(segment.leftCol);
			var right = rightFunc(segment.rightCol);
			segment.left = left;
			segment.outerWidth = right - left;
		}
	}


	// Build a concatenated HTML string for an array of segments
	function buildHTML(segments) {
		var html = '';
		for (var i=0; i<segments.length; i++) {
			html += buildHTMLForSegment(segments[i]);
		}
		return html;
	}


	// Build an HTML string for a single segment.
	// Relies on the following properties:
	// - `segment.event` (from `buildSegmentsForEvent`)
	// - `segment.left` (from `calculateHorizontals`)
	function buildHTMLForSegment(segment) {
		var html = '';
		var isRTL = opt('isRTL');
		var event = segment.event;
		var url = event.url;

		// generate the list of CSS classNames
		var classNames = [ 'fc-event', 'fc-event-hori' ];
		if (isEventDraggable(event)) {
			classNames.push('fc-event-draggable');
		}
		if (segment.isStart) {
			classNames.push('fc-event-start');
		}
		if (segment.isEnd) {
			classNames.push('fc-event-end');
		}
		// use the event's configured classNames
		// guaranteed to be an array via `buildEvent`
		classNames = classNames.concat(event.className);
		if (event.source) {
			// use the event's source's classNames, if specified
			classNames = classNames.concat(event.source.className || []);
		}

		// generate a semicolon delimited CSS string for any of the "skin" properties
		// of the event object (`backgroundColor`, `borderColor` and such)
		var skinCss = getSkinCss(event, opt);

		if (url) {
			html += "<a href='" + htmlEscape(url) + "'";
		}else{
			html += "<div";
		}
		html +=
			" class='" + classNames.join(' ') + "'" +
			" style=" +
				"'" +
				"position:absolute;" +
				"left:" + segment.left + "px;" +
				skinCss +
				"'" +
			">" +
			"<div class='fc-event-inner'>";
		if (!event.allDay && segment.isStart) {
			html +=
				"<span class='fc-event-time'>" +
				htmlEscape(t.getEventTimeText(event)) +
				"</span>";
		}
		html +=
			"<span class='fc-event-title'>" +
			htmlEscape(event.title || '') +
			"</span>" +
			"</div>";
		if (event.allDay && segment.isEnd && isEventResizable(event)) {
			html +=
				"<div class='ui-resizable-handle ui-resizable-" + (isRTL ? 'w' : 'e') + "'>" +
				"&nbsp;&nbsp;&nbsp;" + // makes hit area a lot better for IE6/7
				"</div>";
		}
		html += "</" + (url ? "a" : "div") + ">";

		// TODO:
		// When these elements are initially rendered, they will be briefly visibile on the screen,
		// even though their widths/heights are not set.
		// SOLUTION: initially set them as visibility:hidden ?

		return html;
	}


	// Associate each segment (an object) with an element (a jQuery object),
	// by setting each `segment.element`.
	// Run each element through the `eventRender` filter, which allows developers to
	// modify an existing element, supply a new one, or cancel rendering.
	function resolveElements(segments, elements) {
		for (var i=0; i<segments.length; i++) {
			var segment = segments[i];
			var event = segment.event;
			var element = elements.eq(i);

			// call the trigger with the original element
			var triggerRes = trigger('eventRender', event, event, element);

			if (triggerRes === false) {
				// if `false`, remove the event from the DOM and don't assign it to `segment.event`
				element.remove();
			}
			else {
				if (triggerRes && triggerRes !== true) {
					// the trigger returned a new element, but not `true` (which means keep the existing element)

					// re-assign the important CSS dimension properties that were already assigned in `buildHTMLForSegment`
					triggerRes = $(triggerRes)
						.css({
							position: 'absolute',
							left: segment.left
						});

					element.replaceWith(triggerRes);
					element = triggerRes;
				}

				segment.element = element;
			}
		}
	}



 */
/* Top-coordinate Methods
 -------------------------------------------------------------------------------------------------*//*



 // Sets the "top" CSS property for each element.
	// If `doRowHeights` is `true`, also sets each row's first cell to an explicit height,
	// so that if elements vertically overflow, the cell expands vertically to compensate.
	function setVerticals(segments, doRowHeights) {
		var rowContentHeights = calculateVerticals(segments); // also sets segment.top
		var rowContentElements = getRowContentElements(); // returns 1 inner div per row
		var rowContentTops = [];
		var i;

		// Set each row's height by setting height of first inner div
		if (doRowHeights) {
			for (i=0; i<rowContentElements.length; i++) {
				rowContentElements[i].height(rowContentHeights[i]);
			}
		}

		// Get each row's top, relative to the views's origin.
		// Important to do this after setting each row's height.
		for (i=0; i<rowContentElements.length; i++) {
			rowContentTops.push(
				rowContentElements[i].position().top
			);
		}

		// Set each segment element's CSS "top" property.
		// Each segment object has a "top" property, which is relative to the row's top, but...
		segmentElementEach(segments, function(segment, element) {
			element.css(
				'top',
				rowContentTops[segment.row] + segment.top // ...now, relative to views's origin
			);
		});
	}


	// Calculate the "top" coordinate for each segment, relative to the "top" of the row.
	// Also, return an array that contains the "content" height for each row
	// (the height displaced by the vertically stacked events in the row).
	// Requires segments to have their `outerHeight` property already set.
	function calculateVerticals(segments) {
		var rowCnt = getRowCnt();
		var colCnt = getColCnt();
		var rowContentHeights = []; // content height for each row
		var segmentRows = buildSegmentRows(segments); // an array of segment arrays, one for each row
		var colI;

		for (var rowI=0; rowI<rowCnt; rowI++) {
			var segmentRow = segmentRows[rowI];

			// an array of running total heights for each column.
			// initialize with all zeros.
			var colHeights = [];
			for (colI=0; colI<colCnt; colI++) {
				colHeights.push(0);
			}

			// loop through every segment
			for (var segmentI=0; segmentI<segmentRow.length; segmentI++) {
				var segment = segmentRow[segmentI];

				// find the segment's top coordinate by looking at the max height
				// of all the columns the segment will be in.
				segment.top = arrayMax(
					colHeights.slice(
						segment.leftCol,
						segment.rightCol + 1 // make exclusive for slice
					)
				);

				// adjust the columns to account for the segment's height
				for (colI=segment.leftCol; colI<=segment.rightCol; colI++) {
					colHeights[colI] = segment.top + segment.outerHeight;
				}
			}

			// the tallest column in the row should be the "content height"
			rowContentHeights.push(arrayMax(colHeights));
		}

		return rowContentHeights;
	}


	// Build an array of segment arrays, each representing the segments that will
	// be in a row of the grid, sorted by which event should be closest to the top.
	function buildSegmentRows(segments) {
		var rowCnt = getRowCnt();
		var segmentRows = [];
		var segmentI;
		var segment;
		var rowI;

		// group segments by row
		for (segmentI=0; segmentI<segments.length; segmentI++) {
			segment = segments[segmentI];
			rowI = segment.row;
			if (segment.element) { // was rendered?
				if (segmentRows[rowI]) {
					// already other segments. append to array
					segmentRows[rowI].push(segment);
				}
				else {
					// first segment in row. create new array
					segmentRows[rowI] = [ segment ];
				}
			}
		}

		// sort each row
		for (rowI=0; rowI<rowCnt; rowI++) {
			segmentRows[rowI] = sortSegmentRow(
				segmentRows[rowI] || [] // guarantee an array, even if no segments
			);
		}

		return segmentRows;
	}


	// Sort an array of segments according to which segment should appear closest to the top
	function sortSegmentRow(segments) {
		var sortedSegments = [];

		// build the subrow array
		var subrows = buildSegmentSubrows(segments);

		// flatten it
		for (var i=0; i<subrows.length; i++) {
			sortedSegments.push.apply(sortedSegments, subrows[i]); // append an array to an array
		}

		return sortedSegments;
	}


	// Take an array of segments, which are all assumed to be in the same row,
	// and sort into subrows.
	function buildSegmentSubrows(segments) {

		// Give preference to elements with certain criteria, so they have
		// a chance to be closer to the top.
		segments.sort(compareDaySegments);

		var subrows = [];
		for (var i=0; i<segments.length; i++) {
			var segment = segments[i];

			// loop through subrows, starting with the topmost, until the segment
			// doesn't collide with other segments.
			for (var j=0; j<subrows.length; j++) {
				if (!isDaySegmentCollision(segment, subrows[j])) {
					break;
				}
			}
			// `j` now holds the desired subrow index
			if (subrows[j]) {
				subrows[j].push(segment);
			}
			else {
				subrows[j] = [ segment ];
			}
		}

		return subrows;
	}


	// Return an array of jQuery objects for the placeholder content containers of each row.
	// The content containers don't actually contain anything, but their dimensions should match
	// the events that are overlaid on top.
	function getRowContentElements() {
		var i;
		var rowCnt = getRowCnt();
		var rowDivs = [];
		for (i=0; i<rowCnt; i++) {
			rowDivs[i] = allDayRow(i)
				.find('div.fc-day-content > div');
		}
		return rowDivs;
	}



 */
/* Mouse Handlers
 ---------------------------------------------------------------------------------------------------*//*

 // TODO: better documentation!


	function attachHandlers(segments, modifiedEventId) {
		var segmentContainer = getDaySegmentContainer();

		segmentElementEach(segments, function(segment, element, i) {
			var event = segment.event;
			if (event._id === modifiedEventId) {
				bindDaySeg(event, element, segment);
			}else{
				element[0]._fci = i; // for lazySegBind
			}
		});

		lazySegBind(segmentContainer, segments, bindDaySeg);
	}


	function bindDaySeg(event, eventElement, segment) {

		if (isEventDraggable(event)) {
			t.draggableDayEvent(event, eventElement, segment); // use `t` so subclasses can override
		}

		if (
			event.allDay &&
			segment.isEnd && // only allow resizing on the final segment for an event
			isEventResizable(event)
		) {
			t.resizableDayEvent(event, eventElement, segment); // use `t` so subclasses can override
		}

		// attach all other handlers.
		// needs to be after, because resizableDayEvent might stopImmediatePropagation on click
		eventElementHandlers(event, eventElement);
	}


	function draggableDayEvent(event, eventElement) {
		var hoverListener = getHoverListener();
		var dayDelta;
		var eventStart;
		eventElement.draggable({
			delay: 50,
			opacity: opt('dragOpacity'),
			revertDuration: opt('dragRevertDuration'),
			start: function(ev, ui) {
				trigger('eventDragStart', eventElement[0], event, ev, ui);
				hideEvents(event, eventElement);
				hoverListener.start(function(cell, origCell, rowDelta, colDelta) {
					eventElement.draggable('option', 'revert', !cell || !rowDelta && !colDelta);
					clearOverlays();
					if (cell) {
						var origCellDate = cellToDate(origCell);
						var cellDate = cellToDate(cell);
						dayDelta = cellDate.diff(origCellDate, 'days');
						eventStart = event.start.clone().add('days', dayDelta);
						renderDayOverlay(
							eventStart,
							getEventEnd(event).add('days', dayDelta)
						);
					}
					else {
						dayDelta = 0;
					}
				}, ev, 'drag');
			},
			stop: function(ev, ui) {
				hoverListener.stop();
				clearOverlays();
				trigger('eventDragStop', eventElement[0], event, ev, ui);
				if (dayDelta) {
					eventDrop(
						eventElement[0],
						event,
						eventStart,
						ev,
						ui
					);
				}
				else {
					eventElement.css('filter', ''); // clear IE opacity side-effects
					showEvents(event, eventElement);
				}
			}
		});
	}

	
	function resizableDayEvent(event, element, segment) {
		var isRTL = opt('isRTL');
		var direction = isRTL ? 'w' : 'e';
		var handle = element.find('.ui-resizable-' + direction); // TODO: stop using this class because we aren't using jqui for this
		var isResizing = false;
		
		// TODO: look into using jquery-ui mouse widget for this stuff
		disableTextSelection(element); // prevent native <a> selection for IE
		element
			.mousedown(function(ev) { // prevent native <a> selection for others
				ev.preventDefault();
			})
			.click(function(ev) {
				if (isResizing) {
					ev.preventDefault(); // prevent link from being visited (only method that worked in IE6)
					ev.stopImmediatePropagation(); // prevent fullcalendar eventClick handler from being called
					                               // (eventElementHandlers needs to be bound after resizableDayEvent)
				}
			});
		
		handle.mousedown(function(ev) {
			if (ev.which != 1) {
				return; // needs to be left mouse button
			}
			isResizing = true;
			var hoverListener = getHoverListener();
			var elementTop = element.css('top');
			var dayDelta;
			var eventEnd;
			var helpers;
			var eventCopy = $.extend({}, event);
			var minCellOffset = dayOffsetToCellOffset(dateToDayOffset(event.start));
			clearSelection();
			$('body')
				.css('cursor', direction + '-resize')
				.one('mouseup', mouseup);
			trigger('eventResizeStart', element[0], event, ev, {}); // {} is dummy jqui event
			hoverListener.start(function(cell, origCell) {
				if (cell) {

					var origCellOffset = cellToCellOffset(origCell);
					var cellOffset = cellToCellOffset(cell);

					// don't let resizing move earlier than start date cell
					cellOffset = Math.max(cellOffset, minCellOffset);

					dayDelta =
						cellOffsetToDayOffset(cellOffset) -
						cellOffsetToDayOffset(origCellOffset);

					eventEnd = getEventEnd(event).add('days', dayDelta); // assumed to already have a stripped time

					if (dayDelta) {
						eventCopy.end = eventEnd;
						var oldHelpers = helpers;
						helpers = renderTempDayEvent(eventCopy, segment.row, elementTop);
						helpers = $(helpers); // turn array into a jQuery object
						helpers.find('*').css('cursor', direction + '-resize');
						if (oldHelpers) {
							oldHelpers.remove();
						}
						hideEvents(event);
					}
					else {
						if (helpers) {
							showEvents(event);
							helpers.remove();
							helpers = null;
						}
					}

					clearOverlays();
					renderDayOverlay( // coordinate grid already rebuilt with hoverListener.start()
						event.start,
						eventEnd
						// TODO: instead of calling renderDayOverlay() with dates,
						// call _renderDayOverlay (or whatever) with cell offsets.
					);
				}
			}, ev);
			
			function mouseup(ev) {
				trigger('eventResizeStop', element[0], event, ev, {}); // {} is dummy jqui event
				$('body').css('cursor', '');
				hoverListener.stop();
				clearOverlays();

				if (dayDelta) {
					eventResize(
						element[0],
						event,
						eventEnd,
						ev,
						{} // dummy jqui event
					);
					// event redraw will clear helpers
				}
				// otherwise, the drag handler already restored the old events
				
				setTimeout(function() { // make this happen after the element's click event
					isResizing = false;
				},0);
			}
		});
	}
	

}



 */
/* Generalized Segment Utilities
 -------------------------------------------------------------------------------------------------*//*



 function isDaySegmentCollision(segment, otherSegments) {
	for (var i=0; i<otherSegments.length; i++) {
		var otherSegment = otherSegments[i];
		if (
			otherSegment.leftCol <= segment.rightCol &&
			otherSegment.rightCol >= segment.leftCol
		) {
			return true;
		}
	}
	return false;
}


function segmentElementEach(segments, callback) { // TODO: use in AgendaView?
	for (var i=0; i<segments.length; i++) {
		var segment = segments[i];
		var element = segment.element;
		if (element) {
			callback(segment, element, i);
		}
	}
}


// A cmp function for determining which segments should appear higher up
function compareDaySegments(a, b) {
	return (b.rightCol - b.leftCol) - (a.rightCol - a.leftCol) || // put wider events first
		b.event.allDay - a.event.allDay || // if tie, put all-day events first (booleans cast to 0/1)
		a.event.start - b.event.start || // if a tie, sort by event start date
		(a.event.title || '').localeCompare(b.event.title); // if a tie, sort by event title
}


;;

//BUG: unselect needs to be triggered when events are dragged+dropped

function SelectionManager() {
	var t = this;
	
	
	// exports
	t.select = select;
	t.unselect = unselect;
	t.reportSelection = reportSelection;
	t.daySelectionMousedown = daySelectionMousedown;
	t.selectionManagerDestroy = destroy;
	
	
	// imports
	var calendar = t.calendar;
	var opt = t.opt;
	var trigger = t.trigger;
	var defaultSelectionEnd = t.defaultSelectionEnd;
	var renderSelection = t.renderSelection;
	var clearSelection = t.clearSelection;
	
	
	// locals
	var selected = false;



	// unselectAuto
	if (opt('selectable') && opt('unselectAuto')) {
		$(document).on('mousedown', documentMousedown);
	}


	function documentMousedown(ev) {
		var ignore = opt('unselectCancel');
		if (ignore) {
			if ($(ev.target).parents(ignore).length) { // could be optimized to stop after first match
				return;
			}
		}
		unselect(ev);
	}
	

	function select(start, end) {
		unselect();

		start = calendar.moment(start);
		if (end) {
			end = calendar.moment(end);
		}
		else {
			end = defaultSelectionEnd(start);
		}

		renderSelection(start, end);
		reportSelection(start, end);
	}
	// TODO: better date normalization. see notes in automated test
	
	
	function unselect(ev) {
		if (selected) {
			selected = false;
			clearSelection();
			trigger('unselect', null, ev);
		}
	}
	
	
	function reportSelection(start, end, ev) {
		selected = true;
		trigger('select', null, start, end, ev);
	}
	
	
	function daySelectionMousedown(ev) { // not really a generic manager method, oh well
		var cellToDate = t.cellToDate;
		var getIsCellAllDay = t.getIsCellAllDay;
		var hoverListener = t.getHoverListener();
		var reportDayClick = t.reportDayClick; // this is hacky and sort of weird

		if (ev.which == 1 && opt('selectable')) { // which==1 means left mouse button
			unselect(ev);
			var dates;
			hoverListener.start(function(cell, origCell) { // TODO: maybe put cellToDate/getIsCellAllDay info in cell
				clearSelection();
				if (cell && getIsCellAllDay(cell)) {
					dates = [ cellToDate(origCell), cellToDate(cell) ].sort(dateCompare);
					renderSelection(
						dates[0],
						dates[1].clone().add('days', 1) // make exclusive
					);
				}else{
					dates = null;
				}
			}, ev);
			$(document).one('mouseup', function(ev) {
				hoverListener.stop();
				if (dates) {
					if (+dates[0] == +dates[1]) {
						reportDayClick(dates[0], ev);
					}
					reportSelection(
						dates[0],
						dates[1].clone().add('days', 1), // make exclusive
						ev
					);
				}
			});
		}
	}


	function destroy() {
		$(document).off('mousedown', documentMousedown);
	}


}

;;
 
function OverlayManager() {
	var t = this;
	
	
	// exports
	t.renderOverlay = renderOverlay;
	t.clearOverlays = clearOverlays;
	
	
	// locals
	var usedOverlays = [];
	var unusedOverlays = [];
	
	
	function renderOverlay(rect, parent) {
		var e = unusedOverlays.shift();
		if (!e) {
			e = $("<div class='fc-cell-overlay' style='position:absolute;z-index:3'/>");
		}
		if (e[0].parentNode != parent[0]) {
			e.appendTo(parent);
		}
		usedOverlays.push(e.css(rect).show());
		return e;
	}
	

	function clearOverlays() {
		var e;
		while ((e = usedOverlays.shift())) {
			unusedOverlays.push(e.hide().unbind());
		}
	}


}

;;

function CoordinateGrid(buildFunc) {

	var t = this;
	var rows;
	var cols;
	
	
	t.build = function() {
		rows = [];
		cols = [];
		buildFunc(rows, cols);
	};
	
	
	t.cell = function(x, y) {
		var rowCnt = rows.length;
		var colCnt = cols.length;
		var i, r=-1, c=-1;
		for (i=0; i<rowCnt; i++) {
			if (y >= rows[i][0] && y < rows[i][1]) {
				r = i;
				break;
			}
		}
		for (i=0; i<colCnt; i++) {
			if (x >= cols[i][0] && x < cols[i][1]) {
				c = i;
				break;
			}
		}
		return (r>=0 && c>=0) ? { row: r, col: c } : null;
	};
	
	
	t.rect = function(row0, col0, row1, col1, originElement) { // row1,col1 is inclusive
		var origin = originElement.offset();
		return {
			top: rows[row0][0] - origin.top,
			left: cols[col0][0] - origin.left,
			width: cols[col1][1] - cols[col0][0],
			height: rows[row1][1] - rows[row0][0]
		};
	};

}

;;

function HoverListener(coordinateGrid) {


	var t = this;
	var bindType;
	var change;
	var firstCell;
	var cell;
	
	
	t.start = function(_change, ev, _bindType) {
		change = _change;
		firstCell = cell = null;
		coordinateGrid.build();
		mouse(ev);
		bindType = _bindType || 'mousemove';
		$(document).bind(bindType, mouse);
	};
	
	
	function mouse(ev) {
		_fixUIEvent(ev); // see below
		var newCell = coordinateGrid.cell(ev.pageX, ev.pageY);
		if (
			Boolean(newCell) !== Boolean(cell) ||
			newCell && (newCell.row != cell.row || newCell.col != cell.col)
		) {
			if (newCell) {
				if (!firstCell) {
					firstCell = newCell;
				}
				change(newCell, firstCell, newCell.row-firstCell.row, newCell.col-firstCell.col);
			}else{
				change(newCell, firstCell);
			}
			cell = newCell;
		}
	}
	
	
	t.stop = function() {
		$(document).unbind(bindType, mouse);
		return cell;
	};
	
	
}



// this fix was only necessary for jQuery UI 1.8.16 (and jQuery 1.7 or 1.7.1)
// upgrading to jQuery UI 1.8.17 (and using either jQuery 1.7 or 1.7.1) fixed the problem
// but keep this in here for 1.8.16 users
// and maybe remove it down the line

function _fixUIEvent(event) { // for issue 1168
	if (event.pageX === undefined) {
		event.pageX = event.originalEvent.pageX;
		event.pageY = event.originalEvent.pageY;
	}
}
;;

function HorizontalPositionCache(getElement) {

	var t = this,
		elements = {},
		lefts = {},
		rights = {};
		
	function e(i) {
		return (elements[i] = (elements[i] || getElement(i)));
	}
	
	t.left = function(i) {
		return (lefts[i] = (lefts[i] === undefined ? e(i).position().left : lefts[i]));
	};
	
	t.right = function(i) {
		return (rights[i] = (rights[i] === undefined ? t.left(i) + e(i).width() : rights[i]));
	};
	
	t.clear = function() {
		elements = {};
		lefts = {};
		rights = {};
	};
	
}

;;

 });*/
