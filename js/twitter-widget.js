/**
 * Twitter - http://www.twitter.com
 * Copyright (C) 2010 Twitter
 * Author: Dustin Diaz (dustin@twitter.com)
 *
 * V 2.2.3 Twitter search/profile/faves/list widget
 * http://twitter.com/widgets
 */
if (!"console" in window) {
    window.console = {
        log: function () {}
    }
}
TWTR = window.TWTR || {};
if (!Array.forEach) {
    Array.prototype.forEach = function (D, E) {
        var C = E || window;
        for (var B = 0, A = this.length; B < A; ++B) {
            D.call(C, this[B], B, this)
        }
    };
    Array.prototype.filter = function (E, F) {
        var D = F || window;
        var A = [];
        for (var C = 0, B = this.length; C < B; ++C) {
            if (!E.call(D, this[C], C, this)) {
                continue
            }
            A.push(this[C])
        }
        return A
    };
    Array.prototype.indexOf = function (B, C) {
        var C = C || 0;
        for (var A = 0; A < this.length; ++A) {
            if (this[A] === B) {
                return A
            }
        }
        return -1
    }
}(function () {
    if (TWTR && TWTR.Widget) {
        return
    }
    function A(B, D, C) {
        this.el = B;
        this.prop = D;
        this.from = C.from;
        this.to = C.to;
        this.time = C.time;
        this.callback = C.callback;
        this.animDiff = this.to - this.from
    }
    A.canTransition = function () {
        var B = document.createElement("twitter");
        B.style.cssText = "-webkit-transition: all .5s linear;";
        return !!B.style.webkitTransitionProperty
    }();
    A.prototype._setStyle = function (B) {
        switch (this.prop) {
        case "opacity":
            this.el.style[this.prop] = B;
            this.el.style.filter = "alpha(opacity=" + B * 100 + ")";
            break;
        default:
            this.el.style[this.prop] = B + "px";
            break
        }
    };
    A.prototype._animate = function () {
        var B = this;
        this.now = new Date();
        this.diff = this.now - this.startTime;
        if (this.diff > this.time) {
            this._setStyle(this.to);
            if (this.callback) {
                this.callback.call(this)
            }
            clearInterval(this.timer);
            return
        }
        this.percentage = (Math.floor((this.diff / this.time) * 100) / 100);
        this.val = (this.animDiff * this.percentage) + this.from;
        this._setStyle(this.val)
    };
    A.prototype.start = function () {
        var B = this;
        this.startTime = new Date();
        this.timer = setInterval(function () {
            B._animate.call(B)
        }, 15)
    };
    TWTR.Widget = function (B) {
        this.init(B)
    };
    (function () {
        var Q = {};
        var N = location.protocol.match(/https/);
        var P = /^.+\/profile_images/;
        var V = "https://s3.amazonaws.com/twitter_production/profile_images";
        var e = {};
        var c = function (g) {
            var f = e[g];
            if (!f) {
                f = new RegExp("(?:^|\\s+)" + g + "(?:\\s+|$)");
                e[g] = f
            }
            return f
        };
        var C = function (k, o, l, m) {
            var o = o || "*";
            var l = l || document;
            var g = [],
                f = l.getElementsByTagName(o),
                n = c(k);
            for (var h = 0, j = f.length; h < j; ++h) {
                if (n.test(f[h].className)) {
                    g[g.length] = f[h];
                    if (m) {
                        m.call(f[h], f[h])
                    }
                }
            }
            return g
        };
        var d = function () {
            var f = navigator.userAgent;
            return {
                ie: f.match(/MSIE\s([^;]*)/)
            }
        }();
        var G = function (f) {
            if (typeof f == "string") {
                return document.getElementById(f)
            }
            return f
        };
        var W = function (f) {
            return f.replace(/^\s+|\s+$/g, "")
        };
        var U = function () {
            var f = self.innerHeight;
            var g = document.compatMode;
            if ((g || d.ie)) {
                f = (g == "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight
            }
            return f
        };
        var b = function (h, f) {
            var g = h.target || h.srcElement;
            return f(g)
        };
        var S = function (g) {
            try {
                if (g && 3 == g.nodeType) {
                    return g.parentNode
                } else {
                    return g
                }
            } catch (f) {}
        };
        var T = function (g) {
            var f = g.relatedTarget;
            if (!f) {
                if (g.type == "mouseout") {
                    f = g.toElement
                } else {
                    if (g.type == "mouseover") {
                        f = g.fromElement
                    }
                }
            }
            return S(f)
        };
        var Y = function (g, f) {
            f.parentNode.insertBefore(g, f.nextSibling)
        };
        var Z = function (g) {
            try {
                g.parentNode.removeChild(g)
            } catch (f) {}
        };
        var X = function (f) {
            return f.firstChild
        };
        var B = function (h) {
            var g = T(h);
            while (g && g != this) {
                try {
                    g = g.parentNode
                } catch (f) {
                    g = this
                }
            }
            if (g != this) {
                return true
            }
            return false
        };
        var F = function () {
            if (document.defaultView && document.defaultView.getComputedStyle) {
                return function (g, j) {
                    var i = null;
                    var h = document.defaultView.getComputedStyle(g, "");
                    if (h) {
                        i = h[j]
                    }
                    var f = g.style[j] || i;
                    return f
                }
            } else {
                if (document.documentElement.currentStyle && d.ie) {
                    return function (f, h) {
                        var g = f.currentStyle ? f.currentStyle[h] : null;
                        return (f.style[h] || g)
                    }
                }
            }
        }();
        var a = {
            has: function (f, g) {
                return new RegExp("(^|\\s)" + g + "(\\s|$)").test(G(f).className)
            },
            add: function (f, g) {
                if (!this.has(f, g)) {
                    G(f).className = W(G(f).className) + " " + g
                }
            },
            remove: function (f, g) {
                if (this.has(f, g)) {
                    G(f).className = G(f).className.replace(new RegExp("(^|\\s)" + g + "(\\s|$)", "g"), "")
                }
            }
        };
        var D = {
            add: function (h, g, f) {
                if (h.addEventListener) {
                    h.addEventListener(g, f, false)
                } else {
                    h.attachEvent("on" + g, function () {
                        f.call(h, window.event)
                    })
                }
            },
            remove: function (h, g, f) {
                if (h.removeEventListener) {
                    h.removeEventListener(g, f, false)
                } else {
                    h.detachEvent("on" + g, f)
                }
            }
        };
        var M = function () {
            function g(i) {
                return parseInt((i).substring(0, 2), 16)
            }
            function f(i) {
                return parseInt((i).substring(2, 4), 16)
            }
            function h(i) {
                return parseInt((i).substring(4, 6), 16)
            }
            return function (i) {
                return [g(i), f(i), h(i)]
            }
        }();
        var H = {
            bool: function (f) {
                return typeof f === "boolean"
            },
            def: function (f) {
                return !(typeof f === "undefined")
            },
            number: function (f) {
                return typeof f === "number" && isFinite(f)
            },
            string: function (f) {
                return typeof f === "string"
            },
            fn: function (g) {
                return typeof g === "function"
            },
            array: function (f) {
                if (f) {
                    return H.number(f.length) && H.fn(f.splice)
                }
                return false
            }
        };
        var L = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var R = function (i) {
            var l = new Date(i);
            if (d.ie) {
                l = Date.parse(i.replace(/( \+)/, " UTC$1"))
            }
            var g = "";
            var f = function () {
                var m = l.getHours();
                if (m > 0 && m < 13) {
                    g = "am";
                    return m
                } else {
                    if (m < 1) {
                        g = "am";
                        return 12
                    } else {
                        g = "pm";
                        return m - 12
                    }
                }
            }();
            var h = l.getMinutes();
            var k = l.getSeconds();

            function j() {
                var m = new Date();
                if (m.getDate() != l.getDate() || m.getYear() != l.getYear() || m.getMonth() != l.getMonth()) {
                    return " - " + L[l.getMonth()] + " " + l.getDate() + ", " + l.getFullYear()
                } else {
                    return ""
                }
            }
            return f + ":" + h + g + j()
        };
        var J = function (l) {
            var n = new Date();
            var j = new Date(l);
            if (d.ie) {
                j = Date.parse(l.replace(/( \+)/, " UTC$1"))
            }
            var m = n - j;
            var g = 1000,
                h = g * 60,
                i = h * 60,
                k = i * 24,
                f = k * 7;
            if (isNaN(m) || m < 0) {
                return ""
            }
            if (m < g * 7) {
                return "right now"
            }
            if (m < h) {
                return Math.floor(m / g) + " seconds ago"
            }
            if (m < h * 2) {
                return "about 1 minute ago"
            }
            if (m < i) {
                return Math.floor(m / h) + " minutes ago"
            }
            if (m < i * 2) {
                return "about 1 hour ago"
            }
            if (m < k) {
                return Math.floor(m / i) + " hours ago"
            }
            if (m > k && m < k * 2) {
                return "yesterday"
            }
            if (m < k * 365) {
                return Math.floor(m / k) + " days ago"
            } else {
                return "over a year ago"
            }
        };
        var E = {
            link: function (f) {
                return f.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function (l, k, i, h, g) {
                    var j = i.match(/w/) ? "http://" : "";
                    return '<a class="twtr-hyperlink" target="_blank" href="' + j + k + '">' + ((k.length > 25) ? k.substr(0, 24) + "..." : k) + "</a>" + g
                })
            },
            at: function (f) {
                return f.replace(/\B\@([a-zA-Z0-9_]{1,20})/g, function (g, h) {
                    return '@<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + h + '">' + h + "</a>"
                })
            },
            list: function (f) {
                return f.replace(/\B\@([a-zA-Z0-9_]{1,20}\/\w+)/g, function (g, h) {
                    return '@<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + h + '">' + h + "</a>"
                })
            },
            hash: function (f) {
                return f.replace(/(\s+)\#(\w+)/gi, function (g, h, i) {
                    return h + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + i + '">#' + i + "</a>"
                })
            },
            clean: function (f) {
                return this.hash(this.at(this.list(this.link(f))))
            }
        };

        function O(g, h, f) {
            this.job = g;
            this.decayFn = h;
            this.interval = f;
            this.decayRate = 1;
            this.decayMultiplier = 1.25;
            this.maxDecayTime = 3 * 60 * 1000
        }
        O.prototype = {
            start: function () {
                this.stop().run();
                return this
            },
            stop: function () {
                if (this.worker) {
                    window.clearTimeout(this.worker)
                }
                return this
            },
            run: function () {
                var f = this;
                this.job(function () {
                    f.decayRate = f.decayFn() ? Math.max(1, f.decayRate / f.decayMultiplier) : f.decayRate * f.decayMultiplier;
                    var g = f.interval * f.decayRate;
                    g = (g >= f.maxDecayTime) ? f.maxDecayTime : g;
                    g = Math.floor(g);
                    f.worker = window.setTimeout(function () {
                        f.run.call(f)
                    }, g)
                })
            },
            destroy: function () {
                this.stop();
                this.decayRate = 1;
                return this
            }
        };

        function I(g, h, f, i) {
            this.time = h || 6000;
            this.loop = f || false;
            this.repeated = 0;
            this.total = g.length;
            this.callback = i;
            this.haystack = g
        }
        I.prototype = {
            start: function (f) {
                var g = this;
                if (f) {
                    this.repeated = 0
                }
                this.stop()._job();
                this.timer = window.setInterval(function () {
                    g._job.call(g)
                }, this.time);
                return this
            },
            stop: function () {
                if (this.timer) {
                    window.clearInterval(this.timer)
                }
                return this
            },
            _job: function () {
                if (this.repeated === this.total) {
                    if (this.loop) {
                        this.repeated = 0
                    } else {
                        this.stop();
                        return
                    }
                }
                this.callback(this.haystack[this.repeated]);
                this.repeated++;
                return this
            }
        };

        function K(h) {
            function f() {
                if (h.needle.metadata && h.needle.metadata.result_type && h.needle.metadata.result_type == "popular") {
                    return '<span class="twtr-popular">' + h.needle.metadata.recent_retweets + "+ recent retweets</span>"
                } else {
                    return ""
                }
            }
            if (N) {
                h.avatar = h.avatar.replace(P, V)
            }
            var g = '<div class="twtr-tweet-wrap">         <div class="twtr-avatar">           <div class="twtr-img"><a target="_blank" href="http://twitter.com/' + h.user + '"><img alt="' + h.user + ' profile" src="' + h.avatar + '"></a></div>         </div>         <div class="twtr-tweet-text">           <p>             <a target="_blank" href="http://twitter.com/' + h.user + '" class="twtr-user">' + h.user + "</a> " + h.tweet + '             <em>            <a target="_blank" class="twtr-timestamp" time="' + h.timestamp + '" href="http://twitter.com/' + h.user + "/status/" + h.id + '">' + h.created_at + '</a>             <a target="_blank" class="twtr-reply" href="http://twitter.com/?status=@' + h.user + "%20&in_reply_to_status_id=" + h.id + "&in_reply_to=" + h.user + '">reply</a>             </em> ' + f() + "           </p>         </div>       </div>";
            var i = document.createElement("div");
            i.id = "tweet-id-" + ++K._tweetCount;
            i.className = "twtr-tweet";
            i.innerHTML = g;
            this.element = i
        }
        K._tweetCount = 0;
        Q.loadStyleSheet = function (h, g) {
            if (!TWTR.Widget.loadingStyleSheet) {
                TWTR.Widget.loadingStyleSheet = true;
                var f = document.createElement("link");
                f.href = h;
                f.rel = "stylesheet";
                f.type = "text/css";
                document.getElementsByTagName("head")[0].appendChild(f);
                var i = setInterval(function () {
                    var j = F(g, "position");
                    if (j == "relative") {
                        clearInterval(i);
                        TWTR.Widget.hasLoadedStyleSheet = true
                    }
                }, 50)
            }
        };
        (function () {
            var f = false;
            Q.css = function (i) {
                var h = document.createElement("style");
                h.type = "text/css";
                if (d.ie) {
                    h.styleSheet.cssText = i
                } else {
                    var j = document.createDocumentFragment();
                    j.appendChild(document.createTextNode(i));
                    h.appendChild(j)
                }
                function g() {
                    document.getElementsByTagName("head")[0].appendChild(h)
                }
                if (!d.ie || f) {
                    g()
                } else {
                    window.attachEvent("onload", function () {
                        f = true;
                        g()
                    })
                }
            }
        })();
        TWTR.Widget.isLoaded = false;
        TWTR.Widget.loadingStyleSheet = false;
        TWTR.Widget.hasLoadedStyleSheet = false;
        TWTR.Widget.WIDGET_NUMBER = 0;
        TWTR.Widget.matches = {
            mentions: /^@[a-zA-Z0-9_]{1,20}\b/,
            any_mentions: /\b@[a-zA-Z0-9_]{1,20}\b/
        };
        TWTR.Widget.jsonP = function (g, h) {
            var f = document.createElement("script");
            f.type = "text/javascript";
            f.src = g;
            document.getElementsByTagName("head")[0].appendChild(f);
            h(f);
            return f
        };
        TWTR.Widget.prototype = function () {
            var i = N ? "https://" : "http://";
            var k = i + "search.twitter.com/search.";
            var l = i + "api.twitter.com/1/statuses/user_timeline.";
            var h = i + "twitter.com/favorites/";
            var j = i + "twitter.com/";
            var g = 25000;
            var f = N ? "https://twitter-widgets.s3.amazonaws.com/j/1/default.gif" : "http://widgets.twimg.com/j/1/default.gif";
            return {
                init: function (n) {
                    var m = this;
                    this._widgetNumber = ++TWTR.Widget.WIDGET_NUMBER;
                    TWTR.Widget["receiveCallback_" + this._widgetNumber] = function (o) {
                        m._prePlay.call(m, o)
                    };
                    this._cb = "TWTR.Widget.receiveCallback_" + this._widgetNumber;
                    this.opts = n;
                    this._base = k;
                    this._isRunning = false;
                    this._hasOfficiallyStarted = false;
                    this._rendered = false;
                    this._profileImage = false;
                    this._isCreator = !! n.creator;
                    this._setWidgetType(n.type);
                    this.timesRequested = 0;
                    this.runOnce = false;
                    this.newResults = false;
                    this.results = [];
                    this.jsonMaxRequestTimeOut = 19000;
                    this.showedResults = [];
                    this.sinceId = 1;
                    this.source = "TWITTERINC_WIDGET";
                    this.id = n.id || "twtr-widget-" + this._widgetNumber;
                    this.tweets = 0;
                    this.setDimensions(n.width, n.height);
                    this.interval = n.interval || 6000;
                    this.format = "json";
                    this.rpp = n.rpp || 50;
                    this.subject = n.subject || "";
                    this.title = n.title || "";
                    this.setFooterText(n.footer);
                    this.setSearch(n.search);
                    this._setUrl();
                    this.theme = n.theme ? n.theme : this._getDefaultTheme();
                    if (!n.id) {
                        document.write('<div class="twtr-widget" id="' + this.id + '"></div>')
                    }
                    this.widgetEl = G(this.id);
                    if (n.id) {
                        a.add(this.widgetEl, "twtr-widget")
                    }
                    if (n.version >= 2 && !TWTR.Widget.hasLoadedStyleSheet) {
                        if (N) {
                            Q.loadStyleSheet("https://twitter-widgets.s3.amazonaws.com/j/2/widget.css", this.widgetEl)
                        } else {
                            Q.loadStyleSheet("http://widgets.twimg.com/j/2/widget.css", this.widgetEl)
                        }
                    }
                    this.occasionalJob = new O(function (o) {
                        m.decay = o;
                        m._getResults.call(m)
                    }, function () {
                        return m._decayDecider.call(m)
                    }, g);
                    this._ready = H.fn(n.ready) ? n.ready : function () {};
                    this._isRelativeTime = true;
                    this._tweetFilter = false;
                    this._avatars = true;
                    this._isFullScreen = false;
                    this._isLive = true;
                    this._isScroll = false;
                    this._loop = true;
                    this._showTopTweets = (this._isSearchWidget) ? true : false;
                    this._behavior = "default";
                    this.setFeatures(this.opts.features);
                    return this
                },
                setDimensions: function (m, n) {
                    this.wh = (m && n) ? [m, n] : [250, 300];
                    if (m == "auto" || m == "100%") {
                        this.wh[0] = "100%"
                    } else {
                        this.wh[0] = ((this.wh[0] < 150) ? 150 : this.wh[0]) + "px"
                    }
                    this.wh[1] = ((this.wh[1] < 100) ? 100 : this.wh[1]) + "px";
                    return this
                },
                setRpp: function (m) {
                    var m = parseInt(m);
                    this.rpp = (H.number(m) && (m > 0 && m <= 100)) ? m : 30;
                    return this
                },
                _setWidgetType: function (m) {
                    this._isSearchWidget = false, this._isProfileWidget = false, this._isFavsWidget = false, this._isListWidget = false;
                    switch (m) {
                    case "profile":
                        this._isProfileWidget = true;
                        break;
                    case "search":
                        this._isSearchWidget = true, this.search = this.opts.search;
                        break;
                    case "faves":
                    case "favs":
                        this._isFavsWidget = true;
                        break;
                    case "list":
                    case "lists":
                        this._isListWidget = true;
                        break
                    }
                    return this
                },
                setFeatures: function (n) {
                    if (n) {
                        if (H.def(n.filters)) {
                            this._tweetFilter = n.filters
                        }
                        if (H.def(n.dateformat)) {
                            this._isRelativeTime = !! (n.dateformat !== "absolute")
                        }
                        if (H.def(n.fullscreen) && H.bool(n.fullscreen)) {
                            if (n.fullscreen) {
                                this._isFullScreen = true;
                                this.wh[0] = "100%";
                                this.wh[1] = (U() - 90) + "px";
                                var o = this;
                                D.add(window, "resize", function (r) {
                                    o.wh[1] = U();
                                    o._fullScreenResize()
                                })
                            }
                        }
                        if (H.def(n.loop) && H.bool(n.loop)) {
                            this._loop = n.loop
                        }
                        if (H.def(n.behavior) && H.string(n.behavior)) {
                            switch (n.behavior) {
                            case "all":
                                this._behavior = "all";
                                break;
                            case "preloaded":
                                this._behavior = "preloaded";
                                break;
                            default:
                                this._behavior = "default";
                                break
                            }
                        }
                        if (H.def(n.toptweets) && H.bool(n.toptweets)) {
                            this._showTopTweets = n.toptweets;
                            var m = (this._showTopTweets) ? "inline-block" : "none";
                            Q.css("#" + this.id + " .twtr-popular { display: " + m + "; }")
                        }
                        if (!H.def(n.toptweets)) {
                            this._showTopTweets = true;
                            var m = (this._showTopTweets) ? "inline-block" : "none";
                            Q.css("#" + this.id + " .twtr-popular { display: " + m + "; }")
                        }
                        if (H.def(n.avatars) && H.bool(n.avatars)) {
                            if (!n.avatars) {
                                Q.css("#" + this.id + " .twtr-avatar, #" + this.id + " .twtr-user { display: none; } #" + this.id + " .twtr-tweet-text { margin-left: 0; }");
                                this._avatars = false
                            } else {
                                var p = (this._isFullScreen) ? "90px" : "40px";
                                Q.css("#" + this.id + " .twtr-avatar { display: block; } #" + this.id + " .twtr-user { display: inline; } #" + this.id + " .twtr-tweet-text { margin-left: " + p + "; }");
                                this._avatars = true
                            }
                        } else {
                            if (this._isProfileWidget) {
                                this.setFeatures({
                                    avatars: false
                                });
                                this._avatars = false
                            } else {
                                this.setFeatures({
                                    avatars: true
                                });
                                this._avatars = true
                            }
                        }
                        if (H.def(n.hashtags) && H.bool(n.hashtags)) {
                            (!n.hashtags) ? Q.css("#" + this.id + " a.twtr-hashtag { display: none; }") : ""
                        }
                        if (H.def(n.timestamp) && H.bool(n.timestamp)) {
                            var q = n.timestamp ? "block" : "none";
                            Q.css("#" + this.id + " em { display: " + q + "; }")
                        }
                        if (H.def(n.live) && H.bool(n.live)) {
                            this._isLive = n.live
                        }
                        if (H.def(n.scrollbar) && H.bool(n.scrollbar)) {
                            this._isScroll = n.scrollbar
                        }
                    } else {
                        if (this._isProfileWidget) {
                            this.setFeatures({
                                avatars: false
                            });
                            this._avatars = false
                        }
                        if (this._isProfileWidget || this._isFavsWidget) {
                            this.setFeatures({
                                behavior: "all"
                            })
                        }
                    }
                    return this
                },
                _fullScreenResize: function () {
                    var m = C("twtr-timeline", "div", document.body, function (n) {
                        n.style.height = (U() - 90) + "px"
                    })
                },
                setTweetInterval: function (m) {
                    this.interval = m;
                    return this
                },
                setBase: function (m) {
                    this._base = m;
                    return this
                },
                setUser: function (n, m) {
                    this.username = n;
                    this.realname = m || " ";
                    if (this._isFavsWidget) {
                        this.setBase(h + n + ".")
                    } else {
                        if (this._isProfileWidget) {
                            this.setBase(l + this.format + "?screen_name=" + n)
                        }
                    }
                    this.setSearch(" ");
                    return this
                },
                setList: function (n, m) {
                    this.listslug = m.replace(/ /g, "-").toLowerCase();
                    this.username = n;
                    this.setBase(j + n + "/lists/" + this.listslug + "/statuses.");
                    this.setSearch(" ");
                    return this
                },
                setProfileImage: function (m) {
                    this._profileImage = m;
                    this.byClass("twtr-profile-img", "img").src = N ? m.replace(P, V) : m;
                    this.byClass("twtr-profile-img-anchor", "a").href = "http://twitter.com/" + this.username;
                    return this
                },
                setTitle: function (m) {
                    this.title = m;
                    this.widgetEl.getElementsByTagName("h3")[0].innerHTML = this.title;
                    return this
                },
                setCaption: function (m) {
                    this.subject = m;
                    this.widgetEl.getElementsByTagName("h4")[0].innerHTML = this.subject;
                    return this
                },
                setFooterText: function (m) {
                    this.footerText = (H.def(m) && H.string(m)) ? m : "Join the conversation";
                    if (this._rendered) {
                        this.byClass("twtr-join-conv", "a").innerHTML = this.footerText
                    }
                    return this
                },
                setSearch: function (n) {
                    this.searchString = n || "";
                    this.search = encodeURIComponent(this.searchString);
                    this._setUrl();
                    if (this._rendered) {
                        var m = this.byClass("twtr-join-conv", "a");
                        m.href = "http://twitter.com/" + this._getWidgetPath()
                    }
                    return this
                },
                _getWidgetPath: function () {
                    if (this._isProfileWidget) {
                        return this.username
                    } else {
                        if (this._isFavsWidget) {
                            return this.username + "/favorites"
                        } else {
                            if (this._isListWidget) {
                                return this.username + "/lists/" + this.listslug
                            } else {
                                return "#search?q=" + this.search
                            }
                        }
                    }
                },
                _setUrl: function () {
                    var m = this;

                    function n() {
                        return (m.sinceId == 1) ? "" : "&since_id=" + m.sinceId + "&refresh=true"
                    }
                    if (this._isProfileWidget) {
                        this.url = this._base + "&callback=" + this._cb + "&include_rts=true&count=" + this.rpp + n() + "&clientsource=" + this.source
                    } else {
                        if (this._isFavsWidget || this._isListWidget) {
                            this.url = this._base + this.format + "?callback=" + this._cb + n() + "&include_rts=true&clientsource=" + this.source
                        } else {
                            this.url = this._base + this.format + "?q=" + this.search + "&result_type=mixed&include_rts=true&callback=" + this._cb + "&rpp=" + this.rpp + n() + "&clientsource=" + this.source
                        }
                    }
                    return this
                },
                _getRGB: function (m) {
                    return M(m.substring(1, 7))
                },
                setTheme: function (s, m) {
                    var q = this;
                    var n = " !important";
                    var r = ((window.location.hostname.match(/twitter\.com/)) && (window.location.pathname.match(/goodies/)));
                    if (m || r) {
                        n = ""
                    }
                    this.theme = {
                        shell: {
                            background: function () {
                                return s.shell.background || q._getDefaultTheme().shell.background
                            }(),
                            color: function () {
                                return s.shell.color || q._getDefaultTheme().shell.color
                            }()
                        },
                        tweets: {
                            background: function () {
                                return s.tweets.background || q._getDefaultTheme().tweets.background
                            }(),
                            color: function () {
                                return s.tweets.color || q._getDefaultTheme().tweets.color
                            }(),
                            links: function () {
                                return s.tweets.links || q._getDefaultTheme().tweets.links
                            }()
                        }
                    };
                    var p = "#" + this.id + " .twtr-doc,                      #" + this.id + " .twtr-hd a,                      #" + this.id + " h3,                      #" + this.id + " h4,                      #" + this.id + " .twtr-popular {            background-color: " + this.theme.shell.background + n + ";            color: " + this.theme.shell.color + n + ";          }          #" + this.id + " .twtr-popular {            color: " + this.theme.tweets.color + n + ";            background-color: rgba(" + this._getRGB(this.theme.shell.background) + ", .3)" + n + ";          }          #" + this.id + " .twtr-tweet a {            color: " + this.theme.tweets.links + n + ";          }          #" + this.id + " .twtr-bd, #" + this.id + " .twtr-timeline i a,           #" + this.id + " .twtr-bd p {            color: " + this.theme.tweets.color + n + ";          }          #" + this.id + " .twtr-new-results,           #" + this.id + " .twtr-results-inner,           #" + this.id + " .twtr-timeline {            background: " + this.theme.tweets.background + n + ";          }";
                    if (d.ie) {
                        p += "#" + this.id + " .twtr-tweet { background: " + this.theme.tweets.background + n + "; }"
                    }
                    Q.css(p);
                    return this
                },
                byClass: function (p, m, n) {
                    var o = C(p, m, G(this.id));
                    return (n) ? o : o[0]
                },
                render: function () {
                    var o = this;
                    if (!TWTR.Widget.hasLoadedStyleSheet) {
                        window.setTimeout(function () {
                            o.render.call(o)
                        }, 50);
                        return this
                    }
                    this.setTheme(this.theme, this._isCreator);
                    if (this._isProfileWidget) {
                        a.add(this.widgetEl, "twtr-widget-profile")
                    }
                    if (this._isScroll) {
                        a.add(this.widgetEl, "twtr-scroll")
                    }
                    if (!this._isLive && !this._isScroll) {
                        this.wh[1] = "auto"
                    }
                    if (this._isSearchWidget && this._isFullScreen) {
                        document.title = "Twitter search: " + escape(this.searchString)
                    }
                    this.widgetEl.innerHTML = this._getWidgetHtml();
                    this.spinner = this.byClass("twtr-spinner", "div");
                    var n = this.byClass("twtr-timeline", "div");
                    if (this._isLive && !this._isFullScreen) {
                        var p = function (q) {
                            if (B.call(this, q)) {
                                o.pause.call(o)
                            }
                        };
                        var m = function (q) {
                            if (B.call(this, q)) {
                                o.resume.call(o)
                            }
                        };
                        this.removeEvents = function () {
                            D.remove(n, "mouseover", p);
                            D.remove(n, "mouseout", m)
                        };
                        D.add(n, "mouseover", p);
                        D.add(n, "mouseout", m)
                    }
                    this._rendered = true;
                    this._ready();
                    return this
                },
                removeEvents: function () {},
                _getDefaultTheme: function () {
                    return {
                        shell: {
                            background: "#8ec1da",
                            color: "#ffffff"
                        },
                        tweets: {
                            background: "#ffffff",
                            color: "#444444",
                            links: "#1985b5"
                        }
                    }
                },
                _getWidgetHtml: function () {
                    var p = this;

                    function r() {
                        if (p._isProfileWidget) {
                            return '<a target="_blank" href="http://twitter.com/" class="twtr-profile-img-anchor"><img alt="profile" class="twtr-profile-img" src="' + f + '"></a>                      <h3></h3>                      <h4></h4>'
                        } else {
                            return "<h3>" + p.title + "</h3><h4>" + p.subject + "</h4>"
                        }
                    }
                    function o() {
                        if (!p._isFullScreen) {
                            return ' height="15"'
                        }
                        return ""
                    }
                    function n() {
                        return p._isFullScreen ? " twtr-fullscreen" : ""
                    }
                    var q = N ? "https://twitter-widgets.s3.amazonaws.com/j/1/twitter_logo_s." : "http://widgets.twimg.com/j/1/twitter_logo_s.";
                    var m = '<div class="twtr-doc' + n() + '" style="width: ' + this.wh[0] + ';">            <div class="twtr-hd">' + r() + '               <div class="twtr-spinner twtr-inactive"></div>            </div>            <div class="twtr-bd">              <div class="twtr-timeline" style="height: ' + this.wh[1] + ';">                <div class="twtr-tweets">                  <div class="twtr-reference-tweet"></div>                  <!-- tweets show here -->                </div>              </div>            </div>            <div class="twtr-ft">              <div><a target="_blank" href="http://twitter.com"><img alt="" src="' + q + (d.ie ? "gif" : "png") + '"' + o() + '></a>                <span><a target="_blank" class="twtr-join-conv" style="color:' + this.theme.shell.color + '" href="http://twitter.com/' + this._getWidgetPath() + '">' + this.footerText + "</a></span>              </div>            </div>          </div>";
                    return m
                },
                _appendTweet: function (m) {
                    Y(m, this.byClass("twtr-reference-tweet", "div"));
                    return this
                },
                _slide: function (n) {
                    var o = this;
                    var m = X(n).offsetHeight;
                    if (this.runOnce) {
                        new A(n, "height", {
                            from: 0,
                            to: m,
                            time: 500,
                            callback: function () {
                                o._fade.call(o, n)
                            }
                        }).start()
                    }
                    return this
                },
                _fade: function (m) {
                    var n = this;
                    if (A.canTransition) {
                        m.style.webkitTransition = "opacity 0.5s ease-out";
                        m.style.opacity = 1;
                        return this
                    }
                    new A(m, "opacity", {
                        from: 0,
                        to: 1,
                        time: 500
                    }).start();
                    return this
                },
                _chop: function () {
                    if (this._isScroll) {
                        return this
                    }
                    var r = this.byClass("twtr-tweet", "div", true);
                    var s = this.byClass("twtr-new-results", "div", true);
                    if (r.length) {
                        for (var o = r.length - 1; o >= 0; o--) {
                            var q = r[o];
                            var p = parseInt(q.offsetTop);
                            if (p > parseInt(this.wh[1])) {
                                Z(q)
                            } else {
                                break
                            }
                        }
                        if (s.length > 0) {
                            var m = s[s.length - 1];
                            var n = parseInt(m.offsetTop);
                            if (n > parseInt(this.wh[1])) {
                                Z(m)
                            }
                        }
                    }
                    return this
                },
                _appendSlideFade: function (n) {
                    var m = n || this.tweet.element;
                    this._chop()._appendTweet(m)._slide(m);
                    return this
                },
                _createTweet: function (m) {
                    m.timestamp = m.created_at;
                    m.created_at = this._isRelativeTime ? J(m.created_at) : R(m.created_at);
                    this.tweet = new K(m);
                    if (this._isLive && this.runOnce) {
                        this.tweet.element.style.opacity = 0;
                        this.tweet.element.style.filter = "alpha(opacity:0)";
                        this.tweet.element.style.height = "0"
                    }
                    return this
                },
                _getResults: function () {
                    var m = this;
                    this.timesRequested++;
                    this.jsonRequestRunning = true;
                    this.jsonRequestTimer = window.setTimeout(function () {
                        if (m.jsonRequestRunning) {
                            clearTimeout(m.jsonRequestTimer);
                            a.add(m.spinner, "twtr-inactive")
                        }
                        m.jsonRequestRunning = false;
                        Z(m.scriptElement);
                        m.newResults = false;
                        m.decay()
                    }, this.jsonMaxRequestTimeOut);
                    a.remove(this.spinner, "twtr-inactive");
                    TWTR.Widget.jsonP(m.url, function (n) {
                        m.scriptElement = n
                    })
                },
                clear: function () {
                    var n = this.byClass("twtr-tweet", "div", true);
                    var m = this.byClass("twtr-new-results", "div", true);
                    n = n.concat(m);
                    n.forEach(function (o) {
                        Z(o)
                    });
                    return this
                },
                _sortByLatest: function (m) {
                    this.results = m;
                    this.results = this.results.slice(0, this.rpp);
                    this.results.reverse();
                    return this
                },
                _sortByMagic: function (m) {
                    var m = m;
                    var n = this;
                    if (this._tweetFilter) {
                        if (this._tweetFilter.negatives) {
                            m = m.filter(function (o) {
                                if (!n._tweetFilter.negatives.test(o.text)) {
                                    return o
                                }
                            })
                        }
                        if (this._tweetFilter.positives) {
                            m = m.filter(function (o) {
                                if (n._tweetFilter.positives.test(o.text)) {
                                    return o
                                }
                            })
                        }
                    }
                    switch (this._behavior) {
                    case "all":
                        this._sortByLatest(m);
                        break;
                    case "preloaded":
                    default:
                        this._sortByDefault(m);
                        break
                    }
                    return this
                },
                _loadTopTweetsAtTop: function (m) {
                    var n = [];
                    m = m.filter(function (o) {
                        if (o.metadata && o.metadata.result_type && o.metadata.result_type == "popular") {
                            return o
                        } else {
                            n.push(o)
                        }
                    }).concat(n);
                    return m
                },
                _sortByDefault: function (n) {
                    var o = this;
                    var m = function () {
                        if (d.ie) {
                            return function (p) {
                                return Date.parse(p.replace(/( \+)/, " UTC$1"))
                            }
                        } else {
                            return function (p) {
                                return new Date(p)
                            }
                        }
                    }();
                    this.results.unshift.apply(this.results, n);
                    this.results.forEach(function (p) {
                        if (!p.views) {
                            p.views = 0
                        }
                    });
                    this.results.sort(function (q, p) {
                        if (m(q.created_at) < m(p.created_at)) {
                            return 1
                        } else {
                            if (m(q.created_at) > m(p.created_at)) {
                                return -1
                            } else {
                                return 0
                            }
                        }
                    });
                    this.results = this.results.slice(0, this.rpp);
                    this.results = this._loadTopTweetsAtTop(this.results);
                    if (!this._isLive) {
                        this.results.reverse()
                    }
                    this.results.sort(function (q, p) {
                        if (q.views > p.views) {
                            return 1
                        } else {
                            if (q.views < p.views) {
                                return -1
                            }
                        }
                        return 0
                    })
                },
                _prePlay: function (n) {
                    if (this.jsonRequestTimer) {
                        clearTimeout(this.jsonRequestTimer)
                    }
                    if (!d.ie) {
                        Z(this.scriptElement)
                    }
                    if (n.error) {
                        this.newResults = false
                    } else {
                        if (n.results && n.results.length > 0) {
                            this.response = n;
                            if (this.intervalJob) {
                                this.intervalJob.stop()
                            }
                            this.newResults = true;
                            this.sinceId = n.max_id;
                            this._sortByMagic(n.results);
                            if (this.isRunning()) {
                                this._play()
                            }
                        } else {
                            if ((this._isProfileWidget || this._isFavsWidget || this._isListWidget) && H.array(n) && n.length > 0) {
                                if (this.intervalJob) {
                                    this.intervalJob.stop()
                                }
                                this.newResults = true;
                                if (!this._profileImage && this._isProfileWidget) {
                                    var m = n[0].user.screen_name;
                                    this.setProfileImage(n[0].user.profile_image_url);
                                    this.setTitle(n[0].user.name);
                                    this.setCaption('<a target="_blank" href="http://twitter.com/' + m + '">' + m + "</a>")
                                }
                                this.sinceId = n[0].id;
                                this._sortByMagic(n);
                                if (this.isRunning()) {
                                    this._play()
                                }
                            } else {
                                this.newResults = false
                            }
                        }
                    }
                    this._setUrl();
                    if (this._isLive) {
                        this.decay()
                    }
                    a.add(this.spinner, "twtr-inactive")
                },
                _play: function () {
                    var m = this;
                    if (this._avatars) {
                        this._preloadImages(this.results)
                    }
                    if (this._isRelativeTime && (this._behavior == "all" || this._behavior == "preloaded")) {
                        this.byClass("twtr-timestamp", "a", true).forEach(function (n) {
                            n.innerHTML = J(n.getAttribute("time"))
                        })
                    }
                    if (!this._isLive || this._behavior == "all" || this._behavior == "preloaded") {
                        this.results.forEach(function (o) {
                            if (o.retweeted_status) {
                                o = o.retweeted_status
                            }
                            if (m._isProfileWidget) {
                                o.from_user = o.user.screen_name;
                                o.profile_image_url = o.user.profile_image_url
                            }
                            if (m._isFavsWidget || m._isListWidget) {
                                o.from_user = o.user.screen_name;
                                o.profile_image_url = o.user.profile_image_url
                            }
                            m._createTweet({
                                id: o.id,
                                user: o.from_user,
                                tweet: E.clean(o.text),
                                avatar: o.profile_image_url,
                                created_at: o.created_at,
                                needle: o
                            });
                            var n = m.tweet.element;
                            (m._behavior == "all") ? m._appendSlideFade(n) : m._appendTweet(n)
                        });
                        if (this._behavior != "preloaded") {
                            return this
                        }
                    }
                    this._insertNewResultsNumber();
                    this.intervalJob = new I(this.results, this.interval, this._loop, function (n) {
                        n.views++;
                        if (m._isProfileWidget) {
                            n.from_user = m.username;
                            n.profile_image_url = n.user.profile_image_url
                        }
                        if (m._isFavsWidget || m._isListWidget) {
                            n.from_user = n.user.screen_name;
                            n.profile_image_url = n.user.profile_image_url
                        }
                        if (m._isFullScreen) {
                            n.profile_image_url = n.profile_image_url.replace(/_normal\./, "_bigger.")
                        }
                        m._createTweet({
                            id: n.id,
                            user: n.from_user,
                            tweet: E.clean(n.text),
                            avatar: n.profile_image_url,
                            created_at: n.created_at,
                            needle: n
                        })._appendSlideFade()
                    }).start(true);
                    return this
                },
                _insertNewResultsNumber: function () {
                    if (this.runOnce && this._isSearchWidget) {
                        var p = this.response.total > this.rpp ? this.response.total : this.response.results.length;
                        var m = p > 1 ? "s" : "";
                        var o = (this.response.warning && this.response.warning.match(/adjusted since_id/)) ? "more than" : "";
                        var n = document.createElement("div");
                        a.add(n, "twtr-new-results");
                        n.innerHTML = '<div class="twtr-results-inner"> &nbsp; </div><div class="twtr-results-hr"> &nbsp; </div><span>' + o + " <strong>" + p + "</strong> new tweet" + m + "</span>";
                        Y(n, this.byClass("twtr-reference-tweet", "div"))
                    }
                },
                _preloadImages: function (m) {
                    if (this._isProfileWidget || this._isFavsWidget || this._isListWidget) {
                        m.forEach(function (o) {
                            var n = new Image();
                            n.src = o.user.profile_image_url
                        })
                    } else {
                        m.forEach(function (n) {
                            (new Image()).src = n.profile_image_url
                        })
                    }
                },
                _decayDecider: function () {
                    var m = false;
                    if (!this.runOnce) {
                        this.runOnce = true;
                        m = true
                    } else {
                        if (this.newResults) {
                            m = true
                        }
                    }
                    return m
                },
                start: function () {
                    var m = this;
                    if (!this._rendered) {
                        setTimeout(function () {
                            m.start.call(m)
                        }, 50);
                        return this
                    }
                    if (!this._isLive) {
                        this._getResults()
                    } else {
                        this.occasionalJob.start()
                    }
                    this._isRunning = true;
                    this._hasOfficiallyStarted = true;
                    return this
                },
                stop: function () {
                    this.occasionalJob.stop();
                    if (this.intervalJob) {
                        this.intervalJob.stop()
                    }
                    this._isRunning = false;
                    return this
                },
                pause: function () {
                    if (this.isRunning() && this.intervalJob) {
                        this.intervalJob.stop();
                        a.add(this.widgetEl, "twtr-paused");
                        this._isRunning = false
                    }
                    if (this._resumeTimer) {
                        clearTimeout(this._resumeTimer)
                    }
                    return this
                },
                resume: function () {
                    var m = this;
                    if (!this.isRunning() && this._hasOfficiallyStarted && this.intervalJob) {
                        this._resumeTimer = window.setTimeout(function () {
                            m.intervalJob.start();
                            m._isRunning = true;
                            a.remove(m.widgetEl, "twtr-paused")
                        }, 2000)
                    }
                    return this
                },
                isRunning: function () {
                    return this._isRunning
                },
                destroy: function () {
                    this.stop();
                    this.clear();
                    this.runOnce = false;
                    this._hasOfficiallyStarted = false;
                    this.intervalJob = false;
                    this._profileImage = false;
                    this._isLive = true;
                    this._tweetFilter = false;
                    this._isScroll = false;
                    this.newResults = false;
                    this._isRunning = false;
                    this.sinceId = 1;
                    this.results = [];
                    this.showedResults = [];
                    this.occasionalJob.destroy();
                    if (this.jsonRequestRunning) {
                        clearTimeout(this.jsonRequestTimer);
                        a.add(this.spinner, "twtr-inactive")
                    }
                    a.remove(this.widgetEl, "twtr-scroll");
                    this.removeEvents();
                    return this
                }
            }
        }()
    })()
})();