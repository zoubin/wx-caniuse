const xf = n(1)
const Af = n(2)
function Sf(t, e, n) {
    if (!e)
        return [];
    var r = Object.keys(n)
      , o = r.indexOf(e);
    if (-1 === o)
        return [];
    var a = n[r[o]];
    return Object.keys(a).filter(function(e) {
        return function(e, t) {
            e = e.split("."),
            t = t.split(".");
            for (var n = Math.max(e.length, t.length); e.length < n; )
                e.push("0");
            for (; t.length < n; )
                t.push("0");
            for (var r = 0; r < n; r++) {
                var o = parseInt(e[r], 10)
                  , a = parseInt(t[r], 10);
                if (a < o)
                    return 1;
                if (o < a)
                    return -1
            }
            return 0
        }(e, t) <= 0
    })
}
 function Ef(e, t, n, r, o) {
    var a, i, s;
    if (0 === (a = Sf(e, t, Af)).length)
        return !1;
    if (n) {
        var c = Af[t];
        if (void 0 === (i = Cf(a, c, n)))
            return !1
    }
    return (!r || void 0 !== (s = kf(i, r))) && (!o || void 0 !== kf(s, o))
}

function If(e, t, n, r) {
    var o, a;
    if (0 === (o = Sf(e, t, xf)).length)
        return !1;
    if (n) {
        var i = xf[t];
        if (void 0 === (a = Cf(o, i, n)))
            return !1
    }
    return !r || void 0 !== kf(a, r)
}

function at(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
}

function kf(e, t) {
    for (var n = 0; n < e.length; n++) {
        if ("string" == typeof e[n] && e[n] === t)
            return [];
        if ("object" === Y(e[n]) && at(e[n], t))
            return e[n][t]
    }
}

function z(e) {
    return (z = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    }
    : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }
    )(e)
}
function Y(e) {
    return (Y = "function" == typeof Symbol && "symbol" === z(Symbol.iterator) ? function(e) {
        return z(e)
    }
    : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : z(e)
    }
    )(e)
}
function Cf(e, t, n) {
    for (var r, o = 0; o < e.length; o++)
        for (var a = t[e[o]], i = 0; i < a.length; i++) {
            var s = a[i];
            if ("string" == typeof s && s === n) {
                void 0 === r && (r = []);
                break
            }
            if ("object" === Y(s) && at(s, n)) {
                r = void 0 === r ? s[n] : r.concat(s[n]);
                break
            }
        }
    return r
}

function ve(e) {
    return function(e) {
        if (Array.isArray(e)) {
            for (var t = 0, n = new Array(e.length); t < e.length; t++)
                n[t] = e[t];
            return n
        }
    }(e) || function(e) {
        if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e))
            return Array.from(e)
    }(e) || function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance")
    }()
}

const wx = {
  canIUse: function(e, t) {
    var n = 0 < arguments.length && void 0 !== e ? e : ""
      , r = 1 < arguments.length && void 0 !== t ? t : Nr;
    if ("string" != typeof n)
        throw new gt("canIUse: schema should be an object");
    var o = n.split(".");
    return !!If.apply(void 0, [r].concat(ve(o))) || !!Ef.apply(void 0, [r].concat(ve(o)))
  },
}
