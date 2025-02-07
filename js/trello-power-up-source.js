(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if (typeof define === 'function' && define.amd)
        define([], factory);
    else {
        var a = factory();
        for (var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
    }
})(self, () => {
    return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 49:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

                    function _typeof(obj) {
                        "@babel/helpers - typeof";

                        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
                            return typeof obj;
                        } : function (obj) {
                            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                        }, _typeof(obj);
                    }

                    function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                    }

                    function _defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                            var descriptor = props[i];
                            descriptor.enumerable = descriptor.enumerable || false;
                            descriptor.configurable = true;
                            if ("value" in descriptor) descriptor.writable = true;
                            Object.defineProperty(target, descriptor.key, descriptor);
                        }
                    }

                    function _createClass(Constructor, protoProps, staticProps) {
                        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
                        if (staticProps) _defineProperties(Constructor, staticProps);
                        Object.defineProperty(Constructor, "prototype", {
                            writable: false
                        });
                        return Constructor;
                    }

                    function _toConsumableArray(arr) {
                        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
                    }

                    function _arrayWithoutHoles(arr) {
                        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
                    }

                    function _iterableToArray(iter) {
                        if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
                    }

                    function _unsupportedIterableToArray(o, minLen) {
                        if (!o) return;
                        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
                        var n = Object.prototype.toString.call(o).slice(8, -1);
                        if (n === "Object" && o.constructor) n = o.constructor.name;
                        if (n === "Map" || n === "Set") return Array.from(o);
                        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
                    }

                    function _arrayLikeToArray(arr, len) {
                        if (len == null || len > arr.length) len = arr.length;

                        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

                        return arr2;
                    }

                    function _nonIterableSpread() {
                        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
                    }

                    var customError = __webpack_require__(625);

                    var Deque = __webpack_require__(779);

                    var xtend = __webpack_require__(850);

                    var alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                    var ERR_DISABLED = 'plugin disabled';
                    var ERR_INVALID_CONTEXT = 'invalid context';
                    var ERR_NOT_HANDLED = 'not handled';
                    var ERR_UNSUPPORTED_COMMAND = 'unsupported command';

                    var IO = /*#__PURE__*/function () {
                        function IO(options) {
                            _classCallCheck(this, IO);

                            this.bufferSize = options.bufferSize || 256;
                            this.handlers = options.handlers;
                            this.helpfulStacks = !!options.helpfulStacks;
                            this.hostHandlers = options.hostHandlers;
                            this.local = options.local;
                            this.noisy = typeof options.noisy === 'boolean' ? options.noisy : true;
                            this.Promise = options.Promise || window.Promise;
                            this.remote = options.remote;
                            this.secret = options.secret;
                            this.Sentry = options.Sentry;
                            this.strict = !!options.strict;
                            this.targetOrigin = options.targetOrigin;
                            this._seed = IO.randomId(16);
                            this._ctr = 0;
                            this._pendingRequests = {};
                            this._messageQueues = new Map();

                            try {
                                this._messageQueues.set(this.remote, new Deque(this.bufferSize));
                            } catch (err) {
                                this._targetsFallback = {
                                    remote: this.remote
                                };
                            }

                            this.listen();
                        }

                        _createClass(IO, [{
                            key: "_handleMessage",
                            value: function _handleMessage(body, source) {
                                var _this = this;

                                var data = body.data;

                                switch (body.type) {
                                    case 'request':
                                        this._handleRequest(data.id, data.command, data.args, source);

                                        break;

                                    case 'response':
                                        this._handleResponse(data.to, data.success, data.response);

                                        break;

                                    case 'bulk':
                                        data.forEach(function (d) {
                                            return _this._handleMessage(d, source);
                                        });
                                        break;
                                }
                            }
                        }, {
                            key: "listen",
                            value: function listen() {
                                var _this2 = this;

                                this.stop();

                                this.listener = function (e) {
                                    var source = e.source; // we only care about messages with data from our known remote
                                    // or any source that knows the secret

                                    if (e.data == null) {
                                        return;
                                    }

                                    if (source === _this2.remote || e.data.secret === _this2.secret) {
                                        _this2._handleMessage(e.data, source);
                                    }
                                };

                                this.local.addEventListener('message', this.listener);
                            }
                        }, {
                            key: "stop",
                            value: function stop() {
                                this.local.removeEventListener('message', this.listener);
                            }
                        }, {
                            key: "_handleRequest",
                            value: function _handleRequest(id, command, args, source) {
                                var _this3 = this;

                                var host = xtend(this.hostHandlers, {
                                    PluginDisabled: IO.PluginDisabled,
                                    InvalidContext: IO.InvalidContext,
                                    NotHandled: IO.NotHandled,
                                    command: command,
                                    args: args,
                                    source: source,
                                    request: function request() {
                                        for (var _len = arguments.length, reqArgs = new Array(_len), _key = 0; _key < _len; _key++) {
                                            reqArgs[_key] = arguments[_key];
                                        }

                                        return _this3.request.apply(_this3, _toConsumableArray(reqArgs.concat([source])));
                                    },
                                    secret: this.secret
                                });
                                this.Promise.try(function () {
                                    if (!Object.prototype.hasOwnProperty.call(_this3.handlers, command)) {
                                        throw new IO.UnsupportedCommand("unsupported command: ".concat(command));
                                    }

                                    return _this3.handlers[command].apply(_this3, [host].concat(args));
                                }).then(function (response) {
                                    _this3.respond(id, true, response, source);
                                }).catch(function (error) {
                                    if (_this3.Sentry && error.code !== ERR_NOT_HANDLED) {
                                        _this3.Sentry.withScope(function (scope) {
                                            scope.setTag('command', command);

                                            if (args && args[0] && args[0].context) {
                                                var context = args[0].context;
                                                scope.setTag('idBoard', context.board);

                                                if (_typeof(context.permissions) === 'object') {
                                                    Object.keys(context.permissions).forEach(function (perm) {
                                                        scope.setExtra("".concat(perm, "_permission"), context.permissions[perm]);
                                                    });
                                                }
                                            }

                                            _this3.Sentry.captureException(error);
                                        });
                                    } else if (_this3.noisy && error.code !== ERR_NOT_HANDLED) {
                                        /* eslint-disable no-console */
                                        if (typeof console.warn === 'function') {
                                            console.warn('Power-Up unhandled error responding to request for', command);
                                            console.warn(error);
                                        }
                                        /* eslint-enable no-console */

                                    }

                                    _this3.respond(id, false, {
                                        code: error.code,
                                        message: error.message
                                    }, source);
                                });
                            }
                        }, {
                            key: "_handleResponse",
                            value: function _handleResponse(to, success, response) {
                                if (!Object.prototype.hasOwnProperty.call(this._pendingRequests, to)) {
                                    return null;
                                }

                                var pending = this._pendingRequests[to];
                                delete this._pendingRequests[to];

                                if (success) {
                                    return pending.resolve(response);
                                }

                                var errMsg = "".concat(response.message || '', " (Command: ").concat(pending.command, ")");

                                switch (response.code) {
                                    case ERR_DISABLED:
                                        return pending.reject(IO.errorWithStack(IO.PluginDisabled, errMsg, pending.stack));

                                    case ERR_INVALID_CONTEXT:
                                        return pending.reject(IO.errorWithStack(IO.InvalidContext, errMsg, pending.stack));

                                    case ERR_NOT_HANDLED:
                                        return pending.reject(IO.errorWithStack(IO.NotHandled, errMsg, pending.stack));

                                    case ERR_UNSUPPORTED_COMMAND:
                                        return pending.reject(IO.errorWithStack(IO.UnsupportedCommand, errMsg, pending.stack));

                                    default:
                                        return pending.reject(IO.errorWithStack(Error, errMsg, pending.stack));
                                }
                            }
                        }, {
                            key: "raw",
                            value: function raw(type, data, target) {
                                var _this4 = this;

                                if (type === 'bulk') {
                                    var message = {
                                        data: data,
                                        secret: this.secret,
                                        type: type
                                    };

                                    if (target && target !== this.remote) {
                                        target.postMessage(message, this.strict ? this.targetOrigin : '*');
                                    } else {
                                        this.remote.postMessage(message, this.targetOrigin);
                                    }
                                } else {
                                    var qKey = target || this.remote;

                                    if (this._targetsFallback) {
                                        // the Trello webclient polyfills Map for IE11 meaning we can't
                                        // set keys of the Map to cross-domain windows :(
                                        if (target === this.remote) {
                                            qKey = 'remote';
                                        } else {
                                            qKey = undefined;
                                            var targetKeys = Object.keys(this._targetsFallback); // oldschool loop so we can easily short-circuit
                                            // eslint-disable-next-line no-plusplus

                                            for (var i = 0; i < targetKeys.length; i++) {
                                                var k = targetKeys[i];

                                                if (this._targetsFallback[k] === target) {
                                                    qKey = k;
                                                    break;
                                                }
                                            }

                                            if (!qKey) {
                                                qKey = IO.randomId(8);
                                                this._targetsFallback[qKey] = target;
                                            }
                                        }
                                    }

                                    if (!this._messageQueues.has(qKey)) {
                                        this._messageQueues.set(qKey, new Deque(this.bufferSize));
                                    }

                                    var queue = this._messageQueues.get(qKey);

                                    if (queue.isEmpty()) {
                                        setTimeout(function () {
                                            return _this4.emptyQueue(qKey);
                                        }, 0);
                                    }

                                    queue.push({
                                        type: type,
                                        data: data
                                    });
                                }
                            }
                        }, {
                            key: "emptyQueue",
                            value: function emptyQueue(key) {
                                var queue = this._messageQueues.get(key);

                                if (!queue.isEmpty()) {
                                    var messages = queue.toArray();
                                    queue.clear();
                                    var target = typeof key === 'string' ? this._targetsFallback[key] : key;

                                    if (key !== this.remote && key !== 'remote') {
                                        // don't hold on to generally short lived targets
                                        this._messageQueues.delete(key);

                                        if (this._targetsFallback) {
                                            delete this._targetsFallback[key];
                                        }
                                    }

                                    this.raw('bulk', messages, target);
                                }
                            }
                        }, {
                            key: "request",
                            value: function request(command) {
                                var _this5 = this;

                                this._ctr += 1;
                                var id = this._seed + this._ctr;

                                for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                                    args[_key2 - 1] = arguments[_key2];
                                }

                                var lastArg = args[args.length - 1];
                                var target;

                                if (lastArg && typeof lastArg.postMessage === 'function') {
                                    target = args.pop();
                                }

                                var pendingReq = {
                                    args: args,
                                    command: command,
                                    id: id
                                };

                                if (this.helpfulStacks) {
                                    pendingReq.stack = new Error().stack;
                                }

                                this.raw('request', {
                                    args: args,
                                    command: command,
                                    id: id
                                }, target);
                                return new this.Promise(function (resolve, reject) {
                                    pendingReq.resolve = resolve;
                                    pendingReq.reject = reject;
                                    _this5._pendingRequests[id] = pendingReq;
                                });
                            }
                        }, {
                            key: "respond",
                            value: function respond(idRequest, success, response, target) {
                                this.raw('response', {
                                    response: response,
                                    success: success,
                                    to: idRequest
                                }, target);
                            }
                        }], [{
                            key: "randomId",
                            value: function randomId(length) {
                                var idLength = length || 16;
                                var rands = [];

                                if (window.crypto && window.crypto.getRandomValues) {
                                    rands = window.crypto.getRandomValues(new Uint32Array(idLength));
                                } else if (_typeof(window.msCrypto) === 'object' && typeof window.msCrypto.getRandomValues === 'function') {
                                    // IE11 fallback
                                    rands = window.msCrypto.getRandomValues(new Uint32Array(idLength));
                                } else {
                                    // IE10 fallback
                                    while (rands.length < idLength) {
                                        rands.push(Math.floor(Math.random() * alphabet.length));
                                    }
                                }

                                var id = [];

                                for (var i = 0; i < idLength; i += 1) {
                                    id.push(alphabet[rands[i] % alphabet.length]);
                                }

                                return id.join('');
                            }
                        }, {
                            key: "errorWithStack",
                            value: function errorWithStack(ErrType, errMsg, stack) {
                                var err = new ErrType(errMsg);

                                if (stack) {
                                    err.stack = stack;
                                }

                                return err;
                            }
                        }]);

                        return IO;
                    }();

                    IO.PluginDisabled = customError('PostMessageIO:PluginDisabled');
                    IO.PluginDisabled.prototype.code = ERR_DISABLED;
                    IO.InvalidContext = customError('PostMessageIO:InvalidContext');
                    IO.InvalidContext.prototype.code = ERR_INVALID_CONTEXT;
                    IO.NotHandled = customError('PostMessageIO:NotHandled');
                    IO.NotHandled.prototype.code = ERR_NOT_HANDLED;
                    IO.UnsupportedCommand = customError('PostMessageIO:UnsupportedCommand');
                    IO.UnsupportedCommand.prototype.code = ERR_UNSUPPORTED_COMMAND;
                    module.exports = IO;


                    /***/
}),

/***/ 611:
/***/ (() => {

                    // https://raw.githubusercontent.com/jonathantneal/closest/master/closest.js
                    // eslint-disable-next-line func-names
                    (function (ELEMENT) {
                        // eslint-disable-next-line no-param-reassign
                        ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
                        // eslint-disable-next-line no-param-reassign
                        ELEMENT.closest = ELEMENT.closest || function closest(selector) {
                            let element = this;
                            while (element) {
                                if (element.matches(selector)) {
                                    break;
                                }
                                element = element.parentElement;
                            }
                            return element;
                        };
                    })(window.Element.prototype);

                    /***/
}),

/***/ 423:
/***/ (function (__unused_webpack_module, exports, __webpack_require__) {

                    "use strict";

                    var __assign = (this && this.__assign) || function () {
                        __assign = Object.assign || function (t) {
                            for (var s, i = 1, n = arguments.length; i < n; i++) {
                                s = arguments[i];
                                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                                    t[p] = s[p];
                            }
                            return t;
                        };
                        return __assign.apply(this, arguments);
                    };
                    Object.defineProperty(exports, "__esModule", ({ value: true }));
                    exports.bindAll = void 0;
                    var bind_1 = __webpack_require__(691);
                    function toOptions(value) {
                        if (typeof value === 'undefined') {
                            return undefined;
                        }
                        if (typeof value === 'boolean') {
                            return {
                                capture: value,
                            };
                        }
                        return value;
                    }
                    function getBinding(original, sharedOptions) {
                        if (sharedOptions == null) {
                            return original;
                        }
                        var binding = __assign(__assign({}, original), { options: __assign(__assign({}, toOptions(sharedOptions)), toOptions(original.options)) });
                        return binding;
                    }
                    function bindAll(target, bindings, sharedOptions) {
                        var unbinds = bindings.map(function (original) {
                            var binding = getBinding(original, sharedOptions);
                            return (0, bind_1.bind)(target, binding);
                        });
                        return function unbindAll() {
                            unbinds.forEach(function (unbind) { return unbind(); });
                        };
                    }
                    exports.bindAll = bindAll;


                    /***/
}),

/***/ 691:
/***/ ((__unused_webpack_module, exports) => {

                    "use strict";

                    Object.defineProperty(exports, "__esModule", ({ value: true }));
                    exports.bind = void 0;
                    function bind(target, _a) {
                        var type = _a.type, listener = _a.listener, options = _a.options;
                        target.addEventListener(type, listener, options);
                        return function unbind() {
                            target.removeEventListener(type, listener, options);
                        };
                    }
                    exports.bind = bind;


                    /***/
}),

/***/ 197:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

                    "use strict";
                    var __webpack_unused_export__;

                    __webpack_unused_export__ = ({ value: true });
                    __webpack_unused_export__ = exports.ak = void 0;
                    var bind_1 = __webpack_require__(691);
                    Object.defineProperty(exports, "ak", ({ enumerable: true, get: function () { return bind_1.bind; } }));
                    var bind_all_1 = __webpack_require__(423);
                    __webpack_unused_export__ = ({ enumerable: true, get: function () { return bind_all_1.bindAll; } });


                    /***/
}),

/***/ 21:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

                    /* @preserve
                     * The MIT License (MIT)
                     * 
                     * Copyright (c) 2013-2015 Petka Antonov
                     * 
                     * Permission is hereby granted, free of charge, to any person obtaining a copy
                     * of this software and associated documentation files (the "Software"), to deal
                     * in the Software without restriction, including without limitation the rights
                     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                     * copies of the Software, and to permit persons to whom the Software is
                     * furnished to do so, subject to the following conditions:
                     * 
                     * The above copyright notice and this permission notice shall be included in
                     * all copies or substantial portions of the Software.
                     * 
                     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
                     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                     * THE SOFTWARE.
                     * 
                     */
                    /**
                     * bluebird build version 2.11.0
                     * Features enabled: core, race, call_get, generators, map, nodeify, promisify, props, reduce, settle, some, cancel, using, filter, any, each, timers
                    */
                    !function (e) { if (true) module.exports = e(); else { var f; } }(function () {
                        var define, module, exports; return (function e(t, n, r) { function s(o, u) { if (!n[o]) { if (!t[o]) { var a = typeof _dereq_ == "function" && _dereq_; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f } var l = n[o] = { exports: {} }; t[o][0].call(l.exports, function (e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r) } return n[o].exports } var i = typeof _dereq_ == "function" && _dereq_; for (var o = 0; o < r.length; o++)s(r[o]); return s })({
                            1: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise) {
                                    var SomePromiseArray = Promise._SomePromiseArray;
                                    function any(promises) {
                                        var ret = new SomePromiseArray(promises);
                                        var promise = ret.promise();
                                        ret.setHowMany(1);
                                        ret.setUnwrap();
                                        ret.init();
                                        return promise;
                                    }

                                    Promise.any = function (promises) {
                                        return any(promises);
                                    };

                                    Promise.prototype.any = function () {
                                        return any(this);
                                    };

                                };

                            }, {}], 2: [function (_dereq_, module, exports) {
                                "use strict";
                                var firstLineError;
                                try { throw new Error(); } catch (e) { firstLineError = e; }
                                var schedule = _dereq_("./schedule.js");
                                var Queue = _dereq_("./queue.js");
                                var util = _dereq_("./util.js");

                                function Async() {
                                    this._isTickUsed = false;
                                    this._lateQueue = new Queue(16);
                                    this._normalQueue = new Queue(16);
                                    this._trampolineEnabled = true;
                                    var self = this;
                                    this.drainQueues = function () {
                                        self._drainQueues();
                                    };
                                    this._schedule =
                                        schedule.isStatic ? schedule(this.drainQueues) : schedule;
                                }

                                Async.prototype.disableTrampolineIfNecessary = function () {
                                    if (util.hasDevTools) {
                                        this._trampolineEnabled = false;
                                    }
                                };

                                Async.prototype.enableTrampoline = function () {
                                    if (!this._trampolineEnabled) {
                                        this._trampolineEnabled = true;
                                        this._schedule = function (fn) {
                                            setTimeout(fn, 0);
                                        };
                                    }
                                };

                                Async.prototype.haveItemsQueued = function () {
                                    return this._normalQueue.length() > 0;
                                };

                                Async.prototype.throwLater = function (fn, arg) {
                                    if (arguments.length === 1) {
                                        arg = fn;
                                        fn = function () { throw arg; };
                                    }
                                    if (typeof setTimeout !== "undefined") {
                                        setTimeout(function () {
                                            fn(arg);
                                        }, 0);
                                    } else try {
                                        this._schedule(function () {
                                            fn(arg);
                                        });
                                    } catch (e) {
                                        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/m3OTXk\u000a");
                                    }
                                };

                                function AsyncInvokeLater(fn, receiver, arg) {
                                    this._lateQueue.push(fn, receiver, arg);
                                    this._queueTick();
                                }

                                function AsyncInvoke(fn, receiver, arg) {
                                    this._normalQueue.push(fn, receiver, arg);
                                    this._queueTick();
                                }

                                function AsyncSettlePromises(promise) {
                                    this._normalQueue._pushOne(promise);
                                    this._queueTick();
                                }

                                if (!util.hasDevTools) {
                                    Async.prototype.invokeLater = AsyncInvokeLater;
                                    Async.prototype.invoke = AsyncInvoke;
                                    Async.prototype.settlePromises = AsyncSettlePromises;
                                } else {
                                    if (schedule.isStatic) {
                                        schedule = function (fn) { setTimeout(fn, 0); };
                                    }
                                    Async.prototype.invokeLater = function (fn, receiver, arg) {
                                        if (this._trampolineEnabled) {
                                            AsyncInvokeLater.call(this, fn, receiver, arg);
                                        } else {
                                            this._schedule(function () {
                                                setTimeout(function () {
                                                    fn.call(receiver, arg);
                                                }, 100);
                                            });
                                        }
                                    };

                                    Async.prototype.invoke = function (fn, receiver, arg) {
                                        if (this._trampolineEnabled) {
                                            AsyncInvoke.call(this, fn, receiver, arg);
                                        } else {
                                            this._schedule(function () {
                                                fn.call(receiver, arg);
                                            });
                                        }
                                    };

                                    Async.prototype.settlePromises = function (promise) {
                                        if (this._trampolineEnabled) {
                                            AsyncSettlePromises.call(this, promise);
                                        } else {
                                            this._schedule(function () {
                                                promise._settlePromises();
                                            });
                                        }
                                    };
                                }

                                Async.prototype.invokeFirst = function (fn, receiver, arg) {
                                    this._normalQueue.unshift(fn, receiver, arg);
                                    this._queueTick();
                                };

                                Async.prototype._drainQueue = function (queue) {
                                    while (queue.length() > 0) {
                                        var fn = queue.shift();
                                        if (typeof fn !== "function") {
                                            fn._settlePromises();
                                            continue;
                                        }
                                        var receiver = queue.shift();
                                        var arg = queue.shift();
                                        fn.call(receiver, arg);
                                    }
                                };

                                Async.prototype._drainQueues = function () {
                                    this._drainQueue(this._normalQueue);
                                    this._reset();
                                    this._drainQueue(this._lateQueue);
                                };

                                Async.prototype._queueTick = function () {
                                    if (!this._isTickUsed) {
                                        this._isTickUsed = true;
                                        this._schedule(this.drainQueues);
                                    }
                                };

                                Async.prototype._reset = function () {
                                    this._isTickUsed = false;
                                };

                                module.exports = new Async();
                                module.exports.firstLineError = firstLineError;

                            }, { "./queue.js": 28, "./schedule.js": 31, "./util.js": 38 }], 3: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, INTERNAL, tryConvertToPromise) {
                                    var rejectThis = function (_, e) {
                                        this._reject(e);
                                    };

                                    var targetRejected = function (e, context) {
                                        context.promiseRejectionQueued = true;
                                        context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
                                    };

                                    var bindingResolved = function (thisArg, context) {
                                        if (this._isPending()) {
                                            this._resolveCallback(context.target);
                                        }
                                    };

                                    var bindingRejected = function (e, context) {
                                        if (!context.promiseRejectionQueued) this._reject(e);
                                    };

                                    Promise.prototype.bind = function (thisArg) {
                                        var maybePromise = tryConvertToPromise(thisArg);
                                        var ret = new Promise(INTERNAL);
                                        ret._propagateFrom(this, 1);
                                        var target = this._target();

                                        ret._setBoundTo(maybePromise);
                                        if (maybePromise instanceof Promise) {
                                            var context = {
                                                promiseRejectionQueued: false,
                                                promise: ret,
                                                target: target,
                                                bindingPromise: maybePromise
                                            };
                                            target._then(INTERNAL, targetRejected, ret._progress, ret, context);
                                            maybePromise._then(
                                                bindingResolved, bindingRejected, ret._progress, ret, context);
                                        } else {
                                            ret._resolveCallback(target);
                                        }
                                        return ret;
                                    };

                                    Promise.prototype._setBoundTo = function (obj) {
                                        if (obj !== undefined) {
                                            this._bitField = this._bitField | 131072;
                                            this._boundTo = obj;
                                        } else {
                                            this._bitField = this._bitField & (~131072);
                                        }
                                    };

                                    Promise.prototype._isBound = function () {
                                        return (this._bitField & 131072) === 131072;
                                    };

                                    Promise.bind = function (thisArg, value) {
                                        var maybePromise = tryConvertToPromise(thisArg);
                                        var ret = new Promise(INTERNAL);

                                        ret._setBoundTo(maybePromise);
                                        if (maybePromise instanceof Promise) {
                                            maybePromise._then(function () {
                                                ret._resolveCallback(value);
                                            }, ret._reject, ret._progress, ret, null);
                                        } else {
                                            ret._resolveCallback(value);
                                        }
                                        return ret;
                                    };
                                };

                            }, {}], 4: [function (_dereq_, module, exports) {
                                "use strict";
                                var old;
                                if (typeof Promise !== "undefined") old = Promise;
                                function noConflict() {
                                    try { if (Promise === bluebird) Promise = old; }
                                    catch (e) { }
                                    return bluebird;
                                }
                                var bluebird = _dereq_("./promise.js")();
                                bluebird.noConflict = noConflict;
                                module.exports = bluebird;

                            }, { "./promise.js": 23 }], 5: [function (_dereq_, module, exports) {
                                "use strict";
                                var cr = Object.create;
                                if (cr) {
                                    var callerCache = cr(null);
                                    var getterCache = cr(null);
                                    callerCache[" size"] = getterCache[" size"] = 0;
                                }

                                module.exports = function (Promise) {
                                    var util = _dereq_("./util.js");
                                    var canEvaluate = util.canEvaluate;
                                    var isIdentifier = util.isIdentifier;

                                    var getMethodCaller;
                                    var getGetter;
                                    if (false) { var getCompiled, makeGetter, makeMethodCaller; }

                                    function ensureMethod(obj, methodName) {
                                        var fn;
                                        if (obj != null) fn = obj[methodName];
                                        if (typeof fn !== "function") {
                                            var message = "Object " + util.classString(obj) + " has no method '" +
                                                util.toString(methodName) + "'";
                                            throw new Promise.TypeError(message);
                                        }
                                        return fn;
                                    }

                                    function caller(obj) {
                                        var methodName = this.pop();
                                        var fn = ensureMethod(obj, methodName);
                                        return fn.apply(obj, this);
                                    }
                                    Promise.prototype.call = function (methodName) {
                                        var $_len = arguments.length; var args = new Array($_len - 1); for (var $_i = 1; $_i < $_len; ++$_i) { args[$_i - 1] = arguments[$_i]; }
                                        if (false) { var maybeCaller; }
                                        args.push(methodName);
                                        return this._then(caller, undefined, undefined, args, undefined);
                                    };

                                    function namedGetter(obj) {
                                        return obj[this];
                                    }
                                    function indexedGetter(obj) {
                                        var index = +this;
                                        if (index < 0) index = Math.max(0, index + obj.length);
                                        return obj[index];
                                    }
                                    Promise.prototype.get = function (propertyName) {
                                        var isIndex = (typeof propertyName === "number");
                                        var getter;
                                        if (!isIndex) {
                                            if (canEvaluate) {
                                                var maybeGetter = getGetter(propertyName);
                                                getter = maybeGetter !== null ? maybeGetter : namedGetter;
                                            } else {
                                                getter = namedGetter;
                                            }
                                        } else {
                                            getter = indexedGetter;
                                        }
                                        return this._then(getter, undefined, undefined, propertyName, undefined);
                                    };
                                };

                            }, { "./util.js": 38 }], 6: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise) {
                                    var errors = _dereq_("./errors.js");
                                    var async = _dereq_("./async.js");
                                    var CancellationError = errors.CancellationError;

                                    Promise.prototype._cancel = function (reason) {
                                        if (!this.isCancellable()) return this;
                                        var parent;
                                        var promiseToReject = this;
                                        while ((parent = promiseToReject._cancellationParent) !== undefined &&
                                            parent.isCancellable()) {
                                            promiseToReject = parent;
                                        }
                                        this._unsetCancellable();
                                        promiseToReject._target()._rejectCallback(reason, false, true);
                                    };

                                    Promise.prototype.cancel = function (reason) {
                                        if (!this.isCancellable()) return this;
                                        if (reason === undefined) reason = new CancellationError();
                                        async.invokeLater(this._cancel, this, reason);
                                        return this;
                                    };

                                    Promise.prototype.cancellable = function () {
                                        if (this._cancellable()) return this;
                                        async.enableTrampoline();
                                        this._setCancellable();
                                        this._cancellationParent = undefined;
                                        return this;
                                    };

                                    Promise.prototype.uncancellable = function () {
                                        var ret = this.then();
                                        ret._unsetCancellable();
                                        return ret;
                                    };

                                    Promise.prototype.fork = function (didFulfill, didReject, didProgress) {
                                        var ret = this._then(didFulfill, didReject, didProgress,
                                            undefined, undefined);

                                        ret._setCancellable();
                                        ret._cancellationParent = undefined;
                                        return ret;
                                    };
                                };

                            }, { "./async.js": 2, "./errors.js": 13 }], 7: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function () {
                                    var async = _dereq_("./async.js");
                                    var util = _dereq_("./util.js");
                                    var bluebirdFramePattern =
                                        /[\\\/]bluebird[\\\/]js[\\\/](main|debug|zalgo|instrumented)/;
                                    var stackFramePattern = null;
                                    var formatStack = null;
                                    var indentStackFrames = false;
                                    var warn;

                                    function CapturedTrace(parent) {
                                        this._parent = parent;
                                        var length = this._length = 1 + (parent === undefined ? 0 : parent._length);
                                        captureStackTrace(this, CapturedTrace);
                                        if (length > 32) this.uncycle();
                                    }
                                    util.inherits(CapturedTrace, Error);

                                    CapturedTrace.prototype.uncycle = function () {
                                        var length = this._length;
                                        if (length < 2) return;
                                        var nodes = [];
                                        var stackToIndex = {};

                                        for (var i = 0, node = this; node !== undefined; ++i) {
                                            nodes.push(node);
                                            node = node._parent;
                                        }
                                        length = this._length = i;
                                        for (var i = length - 1; i >= 0; --i) {
                                            var stack = nodes[i].stack;
                                            if (stackToIndex[stack] === undefined) {
                                                stackToIndex[stack] = i;
                                            }
                                        }
                                        for (var i = 0; i < length; ++i) {
                                            var currentStack = nodes[i].stack;
                                            var index = stackToIndex[currentStack];
                                            if (index !== undefined && index !== i) {
                                                if (index > 0) {
                                                    nodes[index - 1]._parent = undefined;
                                                    nodes[index - 1]._length = 1;
                                                }
                                                nodes[i]._parent = undefined;
                                                nodes[i]._length = 1;
                                                var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

                                                if (index < length - 1) {
                                                    cycleEdgeNode._parent = nodes[index + 1];
                                                    cycleEdgeNode._parent.uncycle();
                                                    cycleEdgeNode._length =
                                                        cycleEdgeNode._parent._length + 1;
                                                } else {
                                                    cycleEdgeNode._parent = undefined;
                                                    cycleEdgeNode._length = 1;
                                                }
                                                var currentChildLength = cycleEdgeNode._length + 1;
                                                for (var j = i - 2; j >= 0; --j) {
                                                    nodes[j]._length = currentChildLength;
                                                    currentChildLength++;
                                                }
                                                return;
                                            }
                                        }
                                    };

                                    CapturedTrace.prototype.parent = function () {
                                        return this._parent;
                                    };

                                    CapturedTrace.prototype.hasParent = function () {
                                        return this._parent !== undefined;
                                    };

                                    CapturedTrace.prototype.attachExtraTrace = function (error) {
                                        if (error.__stackCleaned__) return;
                                        this.uncycle();
                                        var parsed = CapturedTrace.parseStackAndMessage(error);
                                        var message = parsed.message;
                                        var stacks = [parsed.stack];

                                        var trace = this;
                                        while (trace !== undefined) {
                                            stacks.push(cleanStack(trace.stack.split("\n")));
                                            trace = trace._parent;
                                        }
                                        removeCommonRoots(stacks);
                                        removeDuplicateOrEmptyJumps(stacks);
                                        util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
                                        util.notEnumerableProp(error, "__stackCleaned__", true);
                                    };

                                    function reconstructStack(message, stacks) {
                                        for (var i = 0; i < stacks.length - 1; ++i) {
                                            stacks[i].push("From previous event:");
                                            stacks[i] = stacks[i].join("\n");
                                        }
                                        if (i < stacks.length) {
                                            stacks[i] = stacks[i].join("\n");
                                        }
                                        return message + "\n" + stacks.join("\n");
                                    }

                                    function removeDuplicateOrEmptyJumps(stacks) {
                                        for (var i = 0; i < stacks.length; ++i) {
                                            if (stacks[i].length === 0 ||
                                                ((i + 1 < stacks.length) && stacks[i][0] === stacks[i + 1][0])) {
                                                stacks.splice(i, 1);
                                                i--;
                                            }
                                        }
                                    }

                                    function removeCommonRoots(stacks) {
                                        var current = stacks[0];
                                        for (var i = 1; i < stacks.length; ++i) {
                                            var prev = stacks[i];
                                            var currentLastIndex = current.length - 1;
                                            var currentLastLine = current[currentLastIndex];
                                            var commonRootMeetPoint = -1;

                                            for (var j = prev.length - 1; j >= 0; --j) {
                                                if (prev[j] === currentLastLine) {
                                                    commonRootMeetPoint = j;
                                                    break;
                                                }
                                            }

                                            for (var j = commonRootMeetPoint; j >= 0; --j) {
                                                var line = prev[j];
                                                if (current[currentLastIndex] === line) {
                                                    current.pop();
                                                    currentLastIndex--;
                                                } else {
                                                    break;
                                                }
                                            }
                                            current = prev;
                                        }
                                    }

                                    function cleanStack(stack) {
                                        var ret = [];
                                        for (var i = 0; i < stack.length; ++i) {
                                            var line = stack[i];
                                            var isTraceLine = stackFramePattern.test(line) ||
                                                "    (No stack trace)" === line;
                                            var isInternalFrame = isTraceLine && shouldIgnore(line);
                                            if (isTraceLine && !isInternalFrame) {
                                                if (indentStackFrames && line.charAt(0) !== " ") {
                                                    line = "    " + line;
                                                }
                                                ret.push(line);
                                            }
                                        }
                                        return ret;
                                    }

                                    function stackFramesAsArray(error) {
                                        var stack = error.stack.replace(/\s+$/g, "").split("\n");
                                        for (var i = 0; i < stack.length; ++i) {
                                            var line = stack[i];
                                            if ("    (No stack trace)" === line || stackFramePattern.test(line)) {
                                                break;
                                            }
                                        }
                                        if (i > 0) {
                                            stack = stack.slice(i);
                                        }
                                        return stack;
                                    }

                                    CapturedTrace.parseStackAndMessage = function (error) {
                                        var stack = error.stack;
                                        var message = error.toString();
                                        stack = typeof stack === "string" && stack.length > 0
                                            ? stackFramesAsArray(error) : ["    (No stack trace)"];
                                        return {
                                            message: message,
                                            stack: cleanStack(stack)
                                        };
                                    };

                                    CapturedTrace.formatAndLogError = function (error, title) {
                                        if (typeof console !== "undefined") {
                                            var message;
                                            if (typeof error === "object" || typeof error === "function") {
                                                var stack = error.stack;
                                                message = title + formatStack(stack, error);
                                            } else {
                                                message = title + String(error);
                                            }
                                            if (typeof warn === "function") {
                                                warn(message);
                                            } else if (typeof console.log === "function" ||
                                                typeof console.log === "object") {
                                                console.log(message);
                                            }
                                        }
                                    };

                                    CapturedTrace.unhandledRejection = function (reason) {
                                        CapturedTrace.formatAndLogError(reason, "^--- With additional stack trace: ");
                                    };

                                    CapturedTrace.isSupported = function () {
                                        return typeof captureStackTrace === "function";
                                    };

                                    CapturedTrace.fireRejectionEvent =
                                        function (name, localHandler, reason, promise) {
                                            var localEventFired = false;
                                            try {
                                                if (typeof localHandler === "function") {
                                                    localEventFired = true;
                                                    if (name === "rejectionHandled") {
                                                        localHandler(promise);
                                                    } else {
                                                        localHandler(reason, promise);
                                                    }
                                                }
                                            } catch (e) {
                                                async.throwLater(e);
                                            }

                                            var globalEventFired = false;
                                            try {
                                                globalEventFired = fireGlobalEvent(name, reason, promise);
                                            } catch (e) {
                                                globalEventFired = true;
                                                async.throwLater(e);
                                            }

                                            var domEventFired = false;
                                            if (fireDomEvent) {
                                                try {
                                                    domEventFired = fireDomEvent(name.toLowerCase(), {
                                                        reason: reason,
                                                        promise: promise
                                                    });
                                                } catch (e) {
                                                    domEventFired = true;
                                                    async.throwLater(e);
                                                }
                                            }

                                            if (!globalEventFired && !localEventFired && !domEventFired &&
                                                name === "unhandledRejection") {
                                                CapturedTrace.formatAndLogError(reason, "Unhandled rejection ");
                                            }
                                        };

                                    function formatNonError(obj) {
                                        var str;
                                        if (typeof obj === "function") {
                                            str = "[function " +
                                                (obj.name || "anonymous") +
                                                "]";
                                        } else {
                                            str = obj.toString();
                                            var ruselessToString = /\[object [a-zA-Z0-9$_]+\]/;
                                            if (ruselessToString.test(str)) {
                                                try {
                                                    var newStr = JSON.stringify(obj);
                                                    str = newStr;
                                                }
                                                catch (e) {

                                                }
                                            }
                                            if (str.length === 0) {
                                                str = "(empty array)";
                                            }
                                        }
                                        return ("(<" + snip(str) + ">, no stack trace)");
                                    }

                                    function snip(str) {
                                        var maxChars = 41;
                                        if (str.length < maxChars) {
                                            return str;
                                        }
                                        return str.substr(0, maxChars - 3) + "...";
                                    }

                                    var shouldIgnore = function () { return false; };
                                    var parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
                                    function parseLineInfo(line) {
                                        var matches = line.match(parseLineInfoRegex);
                                        if (matches) {
                                            return {
                                                fileName: matches[1],
                                                line: parseInt(matches[2], 10)
                                            };
                                        }
                                    }
                                    CapturedTrace.setBounds = function (firstLineError, lastLineError) {
                                        if (!CapturedTrace.isSupported()) return;
                                        var firstStackLines = firstLineError.stack.split("\n");
                                        var lastStackLines = lastLineError.stack.split("\n");
                                        var firstIndex = -1;
                                        var lastIndex = -1;
                                        var firstFileName;
                                        var lastFileName;
                                        for (var i = 0; i < firstStackLines.length; ++i) {
                                            var result = parseLineInfo(firstStackLines[i]);
                                            if (result) {
                                                firstFileName = result.fileName;
                                                firstIndex = result.line;
                                                break;
                                            }
                                        }
                                        for (var i = 0; i < lastStackLines.length; ++i) {
                                            var result = parseLineInfo(lastStackLines[i]);
                                            if (result) {
                                                lastFileName = result.fileName;
                                                lastIndex = result.line;
                                                break;
                                            }
                                        }
                                        if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
                                            firstFileName !== lastFileName || firstIndex >= lastIndex) {
                                            return;
                                        }

                                        shouldIgnore = function (line) {
                                            if (bluebirdFramePattern.test(line)) return true;
                                            var info = parseLineInfo(line);
                                            if (info) {
                                                if (info.fileName === firstFileName &&
                                                    (firstIndex <= info.line && info.line <= lastIndex)) {
                                                    return true;
                                                }
                                            }
                                            return false;
                                        };
                                    };

                                    var captureStackTrace = (function stackDetection() {
                                        var v8stackFramePattern = /^\s*at\s*/;
                                        var v8stackFormatter = function (stack, error) {
                                            if (typeof stack === "string") return stack;

                                            if (error.name !== undefined &&
                                                error.message !== undefined) {
                                                return error.toString();
                                            }
                                            return formatNonError(error);
                                        };

                                        if (typeof Error.stackTraceLimit === "number" &&
                                            typeof Error.captureStackTrace === "function") {
                                            Error.stackTraceLimit = Error.stackTraceLimit + 6;
                                            stackFramePattern = v8stackFramePattern;
                                            formatStack = v8stackFormatter;
                                            var captureStackTrace = Error.captureStackTrace;

                                            shouldIgnore = function (line) {
                                                return bluebirdFramePattern.test(line);
                                            };
                                            return function (receiver, ignoreUntil) {
                                                Error.stackTraceLimit = Error.stackTraceLimit + 6;
                                                captureStackTrace(receiver, ignoreUntil);
                                                Error.stackTraceLimit = Error.stackTraceLimit - 6;
                                            };
                                        }
                                        var err = new Error();

                                        if (typeof err.stack === "string" &&
                                            err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
                                            stackFramePattern = /@/;
                                            formatStack = v8stackFormatter;
                                            indentStackFrames = true;
                                            return function captureStackTrace(o) {
                                                o.stack = new Error().stack;
                                            };
                                        }

                                        var hasStackAfterThrow;
                                        try { throw new Error(); }
                                        catch (e) {
                                            hasStackAfterThrow = ("stack" in e);
                                        }
                                        if (!("stack" in err) && hasStackAfterThrow &&
                                            typeof Error.stackTraceLimit === "number") {
                                            stackFramePattern = v8stackFramePattern;
                                            formatStack = v8stackFormatter;
                                            return function captureStackTrace(o) {
                                                Error.stackTraceLimit = Error.stackTraceLimit + 6;
                                                try { throw new Error(); }
                                                catch (e) { o.stack = e.stack; }
                                                Error.stackTraceLimit = Error.stackTraceLimit - 6;
                                            };
                                        }

                                        formatStack = function (stack, error) {
                                            if (typeof stack === "string") return stack;

                                            if ((typeof error === "object" ||
                                                typeof error === "function") &&
                                                error.name !== undefined &&
                                                error.message !== undefined) {
                                                return error.toString();
                                            }
                                            return formatNonError(error);
                                        };

                                        return null;

                                    })([]);

                                    var fireDomEvent;
                                    var fireGlobalEvent = (function () {
                                        if (util.isNode) {
                                            return function (name, reason, promise) {
                                                if (name === "rejectionHandled") {
                                                    return process.emit(name, promise);
                                                } else {
                                                    return process.emit(name, reason, promise);
                                                }
                                            };
                                        } else {
                                            var customEventWorks = false;
                                            var anyEventWorks = true;
                                            try {
                                                var ev = new self.CustomEvent("test");
                                                customEventWorks = ev instanceof CustomEvent;
                                            } catch (e) { }
                                            if (!customEventWorks) {
                                                try {
                                                    var event = document.createEvent("CustomEvent");
                                                    event.initCustomEvent("testingtheevent", false, true, {});
                                                    self.dispatchEvent(event);
                                                } catch (e) {
                                                    anyEventWorks = false;
                                                }
                                            }
                                            if (anyEventWorks) {
                                                fireDomEvent = function (type, detail) {
                                                    var event;
                                                    if (customEventWorks) {
                                                        event = new self.CustomEvent(type, {
                                                            detail: detail,
                                                            bubbles: false,
                                                            cancelable: true
                                                        });
                                                    } else if (self.dispatchEvent) {
                                                        event = document.createEvent("CustomEvent");
                                                        event.initCustomEvent(type, false, true, detail);
                                                    }

                                                    return event ? !self.dispatchEvent(event) : false;
                                                };
                                            }

                                            var toWindowMethodNameMap = {};
                                            toWindowMethodNameMap["unhandledRejection"] = ("on" +
                                                "unhandledRejection").toLowerCase();
                                            toWindowMethodNameMap["rejectionHandled"] = ("on" +
                                                "rejectionHandled").toLowerCase();

                                            return function (name, reason, promise) {
                                                var methodName = toWindowMethodNameMap[name];
                                                var method = self[methodName];
                                                if (!method) return false;
                                                if (name === "rejectionHandled") {
                                                    method.call(self, promise);
                                                } else {
                                                    method.call(self, reason, promise);
                                                }
                                                return true;
                                            };
                                        }
                                    })();

                                    if (typeof console !== "undefined" && typeof console.warn !== "undefined") {
                                        warn = function (message) {
                                            console.warn(message);
                                        };
                                        if (util.isNode && process.stderr.isTTY) {
                                            warn = function (message) {
                                                process.stderr.write("\u001b[31m" + message + "\u001b[39m\n");
                                            };
                                        } else if (!util.isNode && typeof (new Error().stack) === "string") {
                                            warn = function (message) {
                                                console.warn("%c" + message, "color: red");
                                            };
                                        }
                                    }

                                    return CapturedTrace;
                                };

                            }, { "./async.js": 2, "./util.js": 38 }], 8: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (NEXT_FILTER) {
                                    var util = _dereq_("./util.js");
                                    var errors = _dereq_("./errors.js");
                                    var tryCatch = util.tryCatch;
                                    var errorObj = util.errorObj;
                                    var keys = _dereq_("./es5.js").keys;
                                    var TypeError = errors.TypeError;

                                    function CatchFilter(instances, callback, promise) {
                                        this._instances = instances;
                                        this._callback = callback;
                                        this._promise = promise;
                                    }

                                    function safePredicate(predicate, e) {
                                        var safeObject = {};
                                        var retfilter = tryCatch(predicate).call(safeObject, e);

                                        if (retfilter === errorObj) return retfilter;

                                        var safeKeys = keys(safeObject);
                                        if (safeKeys.length) {
                                            errorObj.e = new TypeError("Catch filter must inherit from Error or be a simple predicate function\u000a\u000a    See http://goo.gl/o84o68\u000a");
                                            return errorObj;
                                        }
                                        return retfilter;
                                    }

                                    CatchFilter.prototype.doFilter = function (e) {
                                        var cb = this._callback;
                                        var promise = this._promise;
                                        var boundTo = promise._boundValue();
                                        for (var i = 0, len = this._instances.length; i < len; ++i) {
                                            var item = this._instances[i];
                                            var itemIsErrorType = item === Error ||
                                                (item != null && item.prototype instanceof Error);

                                            if (itemIsErrorType && e instanceof item) {
                                                var ret = tryCatch(cb).call(boundTo, e);
                                                if (ret === errorObj) {
                                                    NEXT_FILTER.e = ret.e;
                                                    return NEXT_FILTER;
                                                }
                                                return ret;
                                            } else if (typeof item === "function" && !itemIsErrorType) {
                                                var shouldHandle = safePredicate(item, e);
                                                if (shouldHandle === errorObj) {
                                                    e = errorObj.e;
                                                    break;
                                                } else if (shouldHandle) {
                                                    var ret = tryCatch(cb).call(boundTo, e);
                                                    if (ret === errorObj) {
                                                        NEXT_FILTER.e = ret.e;
                                                        return NEXT_FILTER;
                                                    }
                                                    return ret;
                                                }
                                            }
                                        }
                                        NEXT_FILTER.e = e;
                                        return NEXT_FILTER;
                                    };

                                    return CatchFilter;
                                };

                            }, { "./errors.js": 13, "./es5.js": 14, "./util.js": 38 }], 9: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, CapturedTrace, isDebugging) {
                                    var contextStack = [];
                                    function Context() {
                                        this._trace = new CapturedTrace(peekContext());
                                    }
                                    Context.prototype._pushContext = function () {
                                        if (!isDebugging()) return;
                                        if (this._trace !== undefined) {
                                            contextStack.push(this._trace);
                                        }
                                    };

                                    Context.prototype._popContext = function () {
                                        if (!isDebugging()) return;
                                        if (this._trace !== undefined) {
                                            contextStack.pop();
                                        }
                                    };

                                    function createContext() {
                                        if (isDebugging()) return new Context();
                                    }

                                    function peekContext() {
                                        var lastIndex = contextStack.length - 1;
                                        if (lastIndex >= 0) {
                                            return contextStack[lastIndex];
                                        }
                                        return undefined;
                                    }

                                    Promise.prototype._peekContext = peekContext;
                                    Promise.prototype._pushContext = Context.prototype._pushContext;
                                    Promise.prototype._popContext = Context.prototype._popContext;

                                    return createContext;
                                };

                            }, {}], 10: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, CapturedTrace) {
                                    var getDomain = Promise._getDomain;
                                    var async = _dereq_("./async.js");
                                    var Warning = _dereq_("./errors.js").Warning;
                                    var util = _dereq_("./util.js");
                                    var canAttachTrace = util.canAttachTrace;
                                    var unhandledRejectionHandled;
                                    var possiblyUnhandledRejection;
                                    var debugging = false || (util.isNode &&
                                        (!!process.env["BLUEBIRD_DEBUG"] ||
                                            "production" === "development"));

                                    if (util.isNode && process.env["BLUEBIRD_DEBUG"] == 0) debugging = false;

                                    if (debugging) {
                                        async.disableTrampolineIfNecessary();
                                    }

                                    Promise.prototype._ignoreRejections = function () {
                                        this._unsetRejectionIsUnhandled();
                                        this._bitField = this._bitField | 16777216;
                                    };

                                    Promise.prototype._ensurePossibleRejectionHandled = function () {
                                        if ((this._bitField & 16777216) !== 0) return;
                                        this._setRejectionIsUnhandled();
                                        async.invokeLater(this._notifyUnhandledRejection, this, undefined);
                                    };

                                    Promise.prototype._notifyUnhandledRejectionIsHandled = function () {
                                        CapturedTrace.fireRejectionEvent("rejectionHandled",
                                            unhandledRejectionHandled, undefined, this);
                                    };

                                    Promise.prototype._notifyUnhandledRejection = function () {
                                        if (this._isRejectionUnhandled()) {
                                            var reason = this._getCarriedStackTrace() || this._settledValue;
                                            this._setUnhandledRejectionIsNotified();
                                            CapturedTrace.fireRejectionEvent("unhandledRejection",
                                                possiblyUnhandledRejection, reason, this);
                                        }
                                    };

                                    Promise.prototype._setUnhandledRejectionIsNotified = function () {
                                        this._bitField = this._bitField | 524288;
                                    };

                                    Promise.prototype._unsetUnhandledRejectionIsNotified = function () {
                                        this._bitField = this._bitField & (~524288);
                                    };

                                    Promise.prototype._isUnhandledRejectionNotified = function () {
                                        return (this._bitField & 524288) > 0;
                                    };

                                    Promise.prototype._setRejectionIsUnhandled = function () {
                                        this._bitField = this._bitField | 2097152;
                                    };

                                    Promise.prototype._unsetRejectionIsUnhandled = function () {
                                        this._bitField = this._bitField & (~2097152);
                                        if (this._isUnhandledRejectionNotified()) {
                                            this._unsetUnhandledRejectionIsNotified();
                                            this._notifyUnhandledRejectionIsHandled();
                                        }
                                    };

                                    Promise.prototype._isRejectionUnhandled = function () {
                                        return (this._bitField & 2097152) > 0;
                                    };

                                    Promise.prototype._setCarriedStackTrace = function (capturedTrace) {
                                        this._bitField = this._bitField | 1048576;
                                        this._fulfillmentHandler0 = capturedTrace;
                                    };

                                    Promise.prototype._isCarryingStackTrace = function () {
                                        return (this._bitField & 1048576) > 0;
                                    };

                                    Promise.prototype._getCarriedStackTrace = function () {
                                        return this._isCarryingStackTrace()
                                            ? this._fulfillmentHandler0
                                            : undefined;
                                    };

                                    Promise.prototype._captureStackTrace = function () {
                                        if (debugging) {
                                            this._trace = new CapturedTrace(this._peekContext());
                                        }
                                        return this;
                                    };

                                    Promise.prototype._attachExtraTrace = function (error, ignoreSelf) {
                                        if (debugging && canAttachTrace(error)) {
                                            var trace = this._trace;
                                            if (trace !== undefined) {
                                                if (ignoreSelf) trace = trace._parent;
                                            }
                                            if (trace !== undefined) {
                                                trace.attachExtraTrace(error);
                                            } else if (!error.__stackCleaned__) {
                                                var parsed = CapturedTrace.parseStackAndMessage(error);
                                                util.notEnumerableProp(error, "stack",
                                                    parsed.message + "\n" + parsed.stack.join("\n"));
                                                util.notEnumerableProp(error, "__stackCleaned__", true);
                                            }
                                        }
                                    };

                                    Promise.prototype._warn = function (message) {
                                        var warning = new Warning(message);
                                        var ctx = this._peekContext();
                                        if (ctx) {
                                            ctx.attachExtraTrace(warning);
                                        } else {
                                            var parsed = CapturedTrace.parseStackAndMessage(warning);
                                            warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
                                        }
                                        CapturedTrace.formatAndLogError(warning, "");
                                    };

                                    Promise.onPossiblyUnhandledRejection = function (fn) {
                                        var domain = getDomain();
                                        possiblyUnhandledRejection =
                                            typeof fn === "function" ? (domain === null ? fn : domain.bind(fn))
                                                : undefined;
                                    };

                                    Promise.onUnhandledRejectionHandled = function (fn) {
                                        var domain = getDomain();
                                        unhandledRejectionHandled =
                                            typeof fn === "function" ? (domain === null ? fn : domain.bind(fn))
                                                : undefined;
                                    };

                                    Promise.longStackTraces = function () {
                                        if (async.haveItemsQueued() &&
                                            debugging === false
                                        ) {
                                            throw new Error("cannot enable long stack traces after promises have been created\u000a\u000a    See http://goo.gl/DT1qyG\u000a");
                                        }
                                        debugging = CapturedTrace.isSupported();
                                        if (debugging) {
                                            async.disableTrampolineIfNecessary();
                                        }
                                    };

                                    Promise.hasLongStackTraces = function () {
                                        return debugging && CapturedTrace.isSupported();
                                    };

                                    if (!CapturedTrace.isSupported()) {
                                        Promise.longStackTraces = function () { };
                                        debugging = false;
                                    }

                                    return function () {
                                        return debugging;
                                    };
                                };

                            }, { "./async.js": 2, "./errors.js": 13, "./util.js": 38 }], 11: [function (_dereq_, module, exports) {
                                "use strict";
                                var util = _dereq_("./util.js");
                                var isPrimitive = util.isPrimitive;

                                module.exports = function (Promise) {
                                    var returner = function () {
                                        return this;
                                    };
                                    var thrower = function () {
                                        throw this;
                                    };
                                    var returnUndefined = function () { };
                                    var throwUndefined = function () {
                                        throw undefined;
                                    };

                                    var wrapper = function (value, action) {
                                        if (action === 1) {
                                            return function () {
                                                throw value;
                                            };
                                        } else if (action === 2) {
                                            return function () {
                                                return value;
                                            };
                                        }
                                    };


                                    Promise.prototype["return"] =
                                        Promise.prototype.thenReturn = function (value) {
                                            if (value === undefined) return this.then(returnUndefined);

                                            if (isPrimitive(value)) {
                                                return this._then(
                                                    wrapper(value, 2),
                                                    undefined,
                                                    undefined,
                                                    undefined,
                                                    undefined
                                                );
                                            } else if (value instanceof Promise) {
                                                value._ignoreRejections();
                                            }
                                            return this._then(returner, undefined, undefined, value, undefined);
                                        };

                                    Promise.prototype["throw"] =
                                        Promise.prototype.thenThrow = function (reason) {
                                            if (reason === undefined) return this.then(throwUndefined);

                                            if (isPrimitive(reason)) {
                                                return this._then(
                                                    wrapper(reason, 1),
                                                    undefined,
                                                    undefined,
                                                    undefined,
                                                    undefined
                                                );
                                            }
                                            return this._then(thrower, undefined, undefined, reason, undefined);
                                        };
                                };

                            }, { "./util.js": 38 }], 12: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, INTERNAL) {
                                    var PromiseReduce = Promise.reduce;

                                    Promise.prototype.each = function (fn) {
                                        return PromiseReduce(this, fn, null, INTERNAL);
                                    };

                                    Promise.each = function (promises, fn) {
                                        return PromiseReduce(promises, fn, null, INTERNAL);
                                    };
                                };

                            }, {}], 13: [function (_dereq_, module, exports) {
                                "use strict";
                                var es5 = _dereq_("./es5.js");
                                var Objectfreeze = es5.freeze;
                                var util = _dereq_("./util.js");
                                var inherits = util.inherits;
                                var notEnumerableProp = util.notEnumerableProp;

                                function subError(nameProperty, defaultMessage) {
                                    function SubError(message) {
                                        if (!(this instanceof SubError)) return new SubError(message);
                                        notEnumerableProp(this, "message",
                                            typeof message === "string" ? message : defaultMessage);
                                        notEnumerableProp(this, "name", nameProperty);
                                        if (Error.captureStackTrace) {
                                            Error.captureStackTrace(this, this.constructor);
                                        } else {
                                            Error.call(this);
                                        }
                                    }
                                    inherits(SubError, Error);
                                    return SubError;
                                }

                                var _TypeError, _RangeError;
                                var Warning = subError("Warning", "warning");
                                var CancellationError = subError("CancellationError", "cancellation error");
                                var TimeoutError = subError("TimeoutError", "timeout error");
                                var AggregateError = subError("AggregateError", "aggregate error");
                                try {
                                    _TypeError = TypeError;
                                    _RangeError = RangeError;
                                } catch (e) {
                                    _TypeError = subError("TypeError", "type error");
                                    _RangeError = subError("RangeError", "range error");
                                }

                                var methods = ("join pop push shift unshift slice filter forEach some " +
                                    "every map indexOf lastIndexOf reduce reduceRight sort reverse").split(" ");

                                for (var i = 0; i < methods.length; ++i) {
                                    if (typeof Array.prototype[methods[i]] === "function") {
                                        AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];
                                    }
                                }

                                es5.defineProperty(AggregateError.prototype, "length", {
                                    value: 0,
                                    configurable: false,
                                    writable: true,
                                    enumerable: true
                                });
                                AggregateError.prototype["isOperational"] = true;
                                var level = 0;
                                AggregateError.prototype.toString = function () {
                                    var indent = Array(level * 4 + 1).join(" ");
                                    var ret = "\n" + indent + "AggregateError of:" + "\n";
                                    level++;
                                    indent = Array(level * 4 + 1).join(" ");
                                    for (var i = 0; i < this.length; ++i) {
                                        var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "";
                                        var lines = str.split("\n");
                                        for (var j = 0; j < lines.length; ++j) {
                                            lines[j] = indent + lines[j];
                                        }
                                        str = lines.join("\n");
                                        ret += str + "\n";
                                    }
                                    level--;
                                    return ret;
                                };

                                function OperationalError(message) {
                                    if (!(this instanceof OperationalError))
                                        return new OperationalError(message);
                                    notEnumerableProp(this, "name", "OperationalError");
                                    notEnumerableProp(this, "message", message);
                                    this.cause = message;
                                    this["isOperational"] = true;

                                    if (message instanceof Error) {
                                        notEnumerableProp(this, "message", message.message);
                                        notEnumerableProp(this, "stack", message.stack);
                                    } else if (Error.captureStackTrace) {
                                        Error.captureStackTrace(this, this.constructor);
                                    }

                                }
                                inherits(OperationalError, Error);

                                var errorTypes = Error["__BluebirdErrorTypes__"];
                                if (!errorTypes) {
                                    errorTypes = Objectfreeze({
                                        CancellationError: CancellationError,
                                        TimeoutError: TimeoutError,
                                        OperationalError: OperationalError,
                                        RejectionError: OperationalError,
                                        AggregateError: AggregateError
                                    });
                                    notEnumerableProp(Error, "__BluebirdErrorTypes__", errorTypes);
                                }

                                module.exports = {
                                    Error: Error,
                                    TypeError: _TypeError,
                                    RangeError: _RangeError,
                                    CancellationError: errorTypes.CancellationError,
                                    OperationalError: errorTypes.OperationalError,
                                    TimeoutError: errorTypes.TimeoutError,
                                    AggregateError: errorTypes.AggregateError,
                                    Warning: Warning
                                };

                            }, { "./es5.js": 14, "./util.js": 38 }], 14: [function (_dereq_, module, exports) {
                                var isES5 = (function () {
                                    "use strict";
                                    return this === undefined;
                                })();

                                if (isES5) {
                                    module.exports = {
                                        freeze: Object.freeze,
                                        defineProperty: Object.defineProperty,
                                        getDescriptor: Object.getOwnPropertyDescriptor,
                                        keys: Object.keys,
                                        names: Object.getOwnPropertyNames,
                                        getPrototypeOf: Object.getPrototypeOf,
                                        isArray: Array.isArray,
                                        isES5: isES5,
                                        propertyIsWritable: function (obj, prop) {
                                            var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                                            return !!(!descriptor || descriptor.writable || descriptor.set);
                                        }
                                    };
                                } else {
                                    var has = {}.hasOwnProperty;
                                    var str = {}.toString;
                                    var proto = {}.constructor.prototype;

                                    var ObjectKeys = function (o) {
                                        var ret = [];
                                        for (var key in o) {
                                            if (has.call(o, key)) {
                                                ret.push(key);
                                            }
                                        }
                                        return ret;
                                    };

                                    var ObjectGetDescriptor = function (o, key) {
                                        return { value: o[key] };
                                    };

                                    var ObjectDefineProperty = function (o, key, desc) {
                                        o[key] = desc.value;
                                        return o;
                                    };

                                    var ObjectFreeze = function (obj) {
                                        return obj;
                                    };

                                    var ObjectGetPrototypeOf = function (obj) {
                                        try {
                                            return Object(obj).constructor.prototype;
                                        }
                                        catch (e) {
                                            return proto;
                                        }
                                    };

                                    var ArrayIsArray = function (obj) {
                                        try {
                                            return str.call(obj) === "[object Array]";
                                        }
                                        catch (e) {
                                            return false;
                                        }
                                    };

                                    module.exports = {
                                        isArray: ArrayIsArray,
                                        keys: ObjectKeys,
                                        names: ObjectKeys,
                                        defineProperty: ObjectDefineProperty,
                                        getDescriptor: ObjectGetDescriptor,
                                        freeze: ObjectFreeze,
                                        getPrototypeOf: ObjectGetPrototypeOf,
                                        isES5: isES5,
                                        propertyIsWritable: function () {
                                            return true;
                                        }
                                    };
                                }

                            }, {}], 15: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, INTERNAL) {
                                    var PromiseMap = Promise.map;

                                    Promise.prototype.filter = function (fn, options) {
                                        return PromiseMap(this, fn, options, INTERNAL);
                                    };

                                    Promise.filter = function (promises, fn, options) {
                                        return PromiseMap(promises, fn, options, INTERNAL);
                                    };
                                };

                            }, {}], 16: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, NEXT_FILTER, tryConvertToPromise) {
                                    var util = _dereq_("./util.js");
                                    var isPrimitive = util.isPrimitive;
                                    var thrower = util.thrower;

                                    function returnThis() {
                                        return this;
                                    }
                                    function throwThis() {
                                        throw this;
                                    }
                                    function return$(r) {
                                        return function () {
                                            return r;
                                        };
                                    }
                                    function throw$(r) {
                                        return function () {
                                            throw r;
                                        };
                                    }
                                    function promisedFinally(ret, reasonOrValue, isFulfilled) {
                                        var then;
                                        if (isPrimitive(reasonOrValue)) {
                                            then = isFulfilled ? return$(reasonOrValue) : throw$(reasonOrValue);
                                        } else {
                                            then = isFulfilled ? returnThis : throwThis;
                                        }
                                        return ret._then(then, thrower, undefined, reasonOrValue, undefined);
                                    }

                                    function finallyHandler(reasonOrValue) {
                                        var promise = this.promise;
                                        var handler = this.handler;

                                        var ret = promise._isBound()
                                            ? handler.call(promise._boundValue())
                                            : handler();

                                        if (ret !== undefined) {
                                            var maybePromise = tryConvertToPromise(ret, promise);
                                            if (maybePromise instanceof Promise) {
                                                maybePromise = maybePromise._target();
                                                return promisedFinally(maybePromise, reasonOrValue,
                                                    promise.isFulfilled());
                                            }
                                        }

                                        if (promise.isRejected()) {
                                            NEXT_FILTER.e = reasonOrValue;
                                            return NEXT_FILTER;
                                        } else {
                                            return reasonOrValue;
                                        }
                                    }

                                    function tapHandler(value) {
                                        var promise = this.promise;
                                        var handler = this.handler;

                                        var ret = promise._isBound()
                                            ? handler.call(promise._boundValue(), value)
                                            : handler(value);

                                        if (ret !== undefined) {
                                            var maybePromise = tryConvertToPromise(ret, promise);
                                            if (maybePromise instanceof Promise) {
                                                maybePromise = maybePromise._target();
                                                return promisedFinally(maybePromise, value, true);
                                            }
                                        }
                                        return value;
                                    }

                                    Promise.prototype._passThroughHandler = function (handler, isFinally) {
                                        if (typeof handler !== "function") return this.then();

                                        var promiseAndHandler = {
                                            promise: this,
                                            handler: handler
                                        };

                                        return this._then(
                                            isFinally ? finallyHandler : tapHandler,
                                            isFinally ? finallyHandler : undefined, undefined,
                                            promiseAndHandler, undefined);
                                    };

                                    Promise.prototype.lastly =
                                        Promise.prototype["finally"] = function (handler) {
                                            return this._passThroughHandler(handler, true);
                                        };

                                    Promise.prototype.tap = function (handler) {
                                        return this._passThroughHandler(handler, false);
                                    };
                                };

                            }, { "./util.js": 38 }], 17: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise,
                                    apiRejection,
                                    INTERNAL,
                                    tryConvertToPromise) {
                                    var errors = _dereq_("./errors.js");
                                    var TypeError = errors.TypeError;
                                    var util = _dereq_("./util.js");
                                    var errorObj = util.errorObj;
                                    var tryCatch = util.tryCatch;
                                    var yieldHandlers = [];

                                    function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
                                        for (var i = 0; i < yieldHandlers.length; ++i) {
                                            traceParent._pushContext();
                                            var result = tryCatch(yieldHandlers[i])(value);
                                            traceParent._popContext();
                                            if (result === errorObj) {
                                                traceParent._pushContext();
                                                var ret = Promise.reject(errorObj.e);
                                                traceParent._popContext();
                                                return ret;
                                            }
                                            var maybePromise = tryConvertToPromise(result, traceParent);
                                            if (maybePromise instanceof Promise) return maybePromise;
                                        }
                                        return null;
                                    }

                                    function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
                                        var promise = this._promise = new Promise(INTERNAL);
                                        promise._captureStackTrace();
                                        this._stack = stack;
                                        this._generatorFunction = generatorFunction;
                                        this._receiver = receiver;
                                        this._generator = undefined;
                                        this._yieldHandlers = typeof yieldHandler === "function"
                                            ? [yieldHandler].concat(yieldHandlers)
                                            : yieldHandlers;
                                    }

                                    PromiseSpawn.prototype.promise = function () {
                                        return this._promise;
                                    };

                                    PromiseSpawn.prototype._run = function () {
                                        this._generator = this._generatorFunction.call(this._receiver);
                                        this._receiver =
                                            this._generatorFunction = undefined;
                                        this._next(undefined);
                                    };

                                    PromiseSpawn.prototype._continue = function (result) {
                                        if (result === errorObj) {
                                            return this._promise._rejectCallback(result.e, false, true);
                                        }

                                        var value = result.value;
                                        if (result.done === true) {
                                            this._promise._resolveCallback(value);
                                        } else {
                                            var maybePromise = tryConvertToPromise(value, this._promise);
                                            if (!(maybePromise instanceof Promise)) {
                                                maybePromise =
                                                    promiseFromYieldHandler(maybePromise,
                                                        this._yieldHandlers,
                                                        this._promise);
                                                if (maybePromise === null) {
                                                    this._throw(
                                                        new TypeError(
                                                            "A value %s was yielded that could not be treated as a promise\u000a\u000a    See http://goo.gl/4Y4pDk\u000a\u000a".replace("%s", value) +
                                                            "From coroutine:\u000a" +
                                                            this._stack.split("\n").slice(1, -7).join("\n")
                                                        )
                                                    );
                                                    return;
                                                }
                                            }
                                            maybePromise._then(
                                                this._next,
                                                this._throw,
                                                undefined,
                                                this,
                                                null
                                            );
                                        }
                                    };

                                    PromiseSpawn.prototype._throw = function (reason) {
                                        this._promise._attachExtraTrace(reason);
                                        this._promise._pushContext();
                                        var result = tryCatch(this._generator["throw"])
                                            .call(this._generator, reason);
                                        this._promise._popContext();
                                        this._continue(result);
                                    };

                                    PromiseSpawn.prototype._next = function (value) {
                                        this._promise._pushContext();
                                        var result = tryCatch(this._generator.next).call(this._generator, value);
                                        this._promise._popContext();
                                        this._continue(result);
                                    };

                                    Promise.coroutine = function (generatorFunction, options) {
                                        if (typeof generatorFunction !== "function") {
                                            throw new TypeError("generatorFunction must be a function\u000a\u000a    See http://goo.gl/6Vqhm0\u000a");
                                        }
                                        var yieldHandler = Object(options).yieldHandler;
                                        var PromiseSpawn$ = PromiseSpawn;
                                        var stack = new Error().stack;
                                        return function () {
                                            var generator = generatorFunction.apply(this, arguments);
                                            var spawn = new PromiseSpawn$(undefined, undefined, yieldHandler,
                                                stack);
                                            spawn._generator = generator;
                                            spawn._next(undefined);
                                            return spawn.promise();
                                        };
                                    };

                                    Promise.coroutine.addYieldHandler = function (fn) {
                                        if (typeof fn !== "function") throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
                                        yieldHandlers.push(fn);
                                    };

                                    Promise.spawn = function (generatorFunction) {
                                        if (typeof generatorFunction !== "function") {
                                            return apiRejection("generatorFunction must be a function\u000a\u000a    See http://goo.gl/6Vqhm0\u000a");
                                        }
                                        var spawn = new PromiseSpawn(generatorFunction, this);
                                        var ret = spawn.promise();
                                        spawn._run(Promise.spawn);
                                        return ret;
                                    };
                                };

                            }, { "./errors.js": 13, "./util.js": 38 }], 18: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports =
                                    function (Promise, PromiseArray, tryConvertToPromise, INTERNAL) {
                                        var util = _dereq_("./util.js");
                                        var canEvaluate = util.canEvaluate;
                                        var tryCatch = util.tryCatch;
                                        var errorObj = util.errorObj;
                                        var reject;

                                        if (false) { var reject, Holder, i, callers, thenCallbacks, caller, thenCallback; }

                                        Promise.join = function () {
                                            var last = arguments.length - 1;
                                            var fn;
                                            if (last > 0 && typeof arguments[last] === "function") {
                                                fn = arguments[last];
                                                if (false) { var maybePromise, i, callbacks, holder, ret; }
                                            }
                                            var $_len = arguments.length; var args = new Array($_len); for (var $_i = 0; $_i < $_len; ++$_i) { args[$_i] = arguments[$_i]; }
                                            if (fn) args.pop();
                                            var ret = new PromiseArray(args).promise();
                                            return fn !== undefined ? ret.spread(fn) : ret;
                                        };

                                    };

                            }, { "./util.js": 38 }], 19: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise,
                                    PromiseArray,
                                    apiRejection,
                                    tryConvertToPromise,
                                    INTERNAL) {
                                    var getDomain = Promise._getDomain;
                                    var async = _dereq_("./async.js");
                                    var util = _dereq_("./util.js");
                                    var tryCatch = util.tryCatch;
                                    var errorObj = util.errorObj;
                                    var PENDING = {};
                                    var EMPTY_ARRAY = [];

                                    function MappingPromiseArray(promises, fn, limit, _filter) {
                                        this.constructor$(promises);
                                        this._promise._captureStackTrace();
                                        var domain = getDomain();
                                        this._callback = domain === null ? fn : domain.bind(fn);
                                        this._preservedValues = _filter === INTERNAL
                                            ? new Array(this.length())
                                            : null;
                                        this._limit = limit;
                                        this._inFlight = 0;
                                        this._queue = limit >= 1 ? [] : EMPTY_ARRAY;
                                        async.invoke(init, this, undefined);
                                    }
                                    util.inherits(MappingPromiseArray, PromiseArray);
                                    function init() { this._init$(undefined, -2); }

                                    MappingPromiseArray.prototype._init = function () { };

                                    MappingPromiseArray.prototype._promiseFulfilled = function (value, index) {
                                        var values = this._values;
                                        var length = this.length();
                                        var preservedValues = this._preservedValues;
                                        var limit = this._limit;
                                        if (values[index] === PENDING) {
                                            values[index] = value;
                                            if (limit >= 1) {
                                                this._inFlight--;
                                                this._drainQueue();
                                                if (this._isResolved()) return;
                                            }
                                        } else {
                                            if (limit >= 1 && this._inFlight >= limit) {
                                                values[index] = value;
                                                this._queue.push(index);
                                                return;
                                            }
                                            if (preservedValues !== null) preservedValues[index] = value;

                                            var callback = this._callback;
                                            var receiver = this._promise._boundValue();
                                            this._promise._pushContext();
                                            var ret = tryCatch(callback).call(receiver, value, index, length);
                                            this._promise._popContext();
                                            if (ret === errorObj) return this._reject(ret.e);

                                            var maybePromise = tryConvertToPromise(ret, this._promise);
                                            if (maybePromise instanceof Promise) {
                                                maybePromise = maybePromise._target();
                                                if (maybePromise._isPending()) {
                                                    if (limit >= 1) this._inFlight++;
                                                    values[index] = PENDING;
                                                    return maybePromise._proxyPromiseArray(this, index);
                                                } else if (maybePromise._isFulfilled()) {
                                                    ret = maybePromise._value();
                                                } else {
                                                    return this._reject(maybePromise._reason());
                                                }
                                            }
                                            values[index] = ret;
                                        }
                                        var totalResolved = ++this._totalResolved;
                                        if (totalResolved >= length) {
                                            if (preservedValues !== null) {
                                                this._filter(values, preservedValues);
                                            } else {
                                                this._resolve(values);
                                            }

                                        }
                                    };

                                    MappingPromiseArray.prototype._drainQueue = function () {
                                        var queue = this._queue;
                                        var limit = this._limit;
                                        var values = this._values;
                                        while (queue.length > 0 && this._inFlight < limit) {
                                            if (this._isResolved()) return;
                                            var index = queue.pop();
                                            this._promiseFulfilled(values[index], index);
                                        }
                                    };

                                    MappingPromiseArray.prototype._filter = function (booleans, values) {
                                        var len = values.length;
                                        var ret = new Array(len);
                                        var j = 0;
                                        for (var i = 0; i < len; ++i) {
                                            if (booleans[i]) ret[j++] = values[i];
                                        }
                                        ret.length = j;
                                        this._resolve(ret);
                                    };

                                    MappingPromiseArray.prototype.preservedValues = function () {
                                        return this._preservedValues;
                                    };

                                    function map(promises, fn, options, _filter) {
                                        var limit = typeof options === "object" && options !== null
                                            ? options.concurrency
                                            : 0;
                                        limit = typeof limit === "number" &&
                                            isFinite(limit) && limit >= 1 ? limit : 0;
                                        return new MappingPromiseArray(promises, fn, limit, _filter);
                                    }

                                    Promise.prototype.map = function (fn, options) {
                                        if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");

                                        return map(this, fn, options, null).promise();
                                    };

                                    Promise.map = function (promises, fn, options, _filter) {
                                        if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
                                        return map(promises, fn, options, _filter).promise();
                                    };


                                };

                            }, { "./async.js": 2, "./util.js": 38 }], 20: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports =
                                    function (Promise, INTERNAL, tryConvertToPromise, apiRejection) {
                                        var util = _dereq_("./util.js");
                                        var tryCatch = util.tryCatch;

                                        Promise.method = function (fn) {
                                            if (typeof fn !== "function") {
                                                throw new Promise.TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
                                            }
                                            return function () {
                                                var ret = new Promise(INTERNAL);
                                                ret._captureStackTrace();
                                                ret._pushContext();
                                                var value = tryCatch(fn).apply(this, arguments);
                                                ret._popContext();
                                                ret._resolveFromSyncValue(value);
                                                return ret;
                                            };
                                        };

                                        Promise.attempt = Promise["try"] = function (fn, args, ctx) {
                                            if (typeof fn !== "function") {
                                                return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
                                            }
                                            var ret = new Promise(INTERNAL);
                                            ret._captureStackTrace();
                                            ret._pushContext();
                                            var value = util.isArray(args)
                                                ? tryCatch(fn).apply(ctx, args)
                                                : tryCatch(fn).call(ctx, args);
                                            ret._popContext();
                                            ret._resolveFromSyncValue(value);
                                            return ret;
                                        };

                                        Promise.prototype._resolveFromSyncValue = function (value) {
                                            if (value === util.errorObj) {
                                                this._rejectCallback(value.e, false, true);
                                            } else {
                                                this._resolveCallback(value, true);
                                            }
                                        };
                                    };

                            }, { "./util.js": 38 }], 21: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise) {
                                    var util = _dereq_("./util.js");
                                    var async = _dereq_("./async.js");
                                    var tryCatch = util.tryCatch;
                                    var errorObj = util.errorObj;

                                    function spreadAdapter(val, nodeback) {
                                        var promise = this;
                                        if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
                                        var ret =
                                            tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
                                        if (ret === errorObj) {
                                            async.throwLater(ret.e);
                                        }
                                    }

                                    function successAdapter(val, nodeback) {
                                        var promise = this;
                                        var receiver = promise._boundValue();
                                        var ret = val === undefined
                                            ? tryCatch(nodeback).call(receiver, null)
                                            : tryCatch(nodeback).call(receiver, null, val);
                                        if (ret === errorObj) {
                                            async.throwLater(ret.e);
                                        }
                                    }
                                    function errorAdapter(reason, nodeback) {
                                        var promise = this;
                                        if (!reason) {
                                            var target = promise._target();
                                            var newReason = target._getCarriedStackTrace();
                                            newReason.cause = reason;
                                            reason = newReason;
                                        }
                                        var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
                                        if (ret === errorObj) {
                                            async.throwLater(ret.e);
                                        }
                                    }

                                    Promise.prototype.asCallback =
                                        Promise.prototype.nodeify = function (nodeback, options) {
                                            if (typeof nodeback == "function") {
                                                var adapter = successAdapter;
                                                if (options !== undefined && Object(options).spread) {
                                                    adapter = spreadAdapter;
                                                }
                                                this._then(
                                                    adapter,
                                                    errorAdapter,
                                                    undefined,
                                                    this,
                                                    nodeback
                                                );
                                            }
                                            return this;
                                        };
                                };

                            }, { "./async.js": 2, "./util.js": 38 }], 22: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, PromiseArray) {
                                    var util = _dereq_("./util.js");
                                    var async = _dereq_("./async.js");
                                    var tryCatch = util.tryCatch;
                                    var errorObj = util.errorObj;

                                    Promise.prototype.progressed = function (handler) {
                                        return this._then(undefined, undefined, handler, undefined, undefined);
                                    };

                                    Promise.prototype._progress = function (progressValue) {
                                        if (this._isFollowingOrFulfilledOrRejected()) return;
                                        this._target()._progressUnchecked(progressValue);

                                    };

                                    Promise.prototype._progressHandlerAt = function (index) {
                                        return index === 0
                                            ? this._progressHandler0
                                            : this[(index << 2) + index - 5 + 2];
                                    };

                                    Promise.prototype._doProgressWith = function (progression) {
                                        var progressValue = progression.value;
                                        var handler = progression.handler;
                                        var promise = progression.promise;
                                        var receiver = progression.receiver;

                                        var ret = tryCatch(handler).call(receiver, progressValue);
                                        if (ret === errorObj) {
                                            if (ret.e != null &&
                                                ret.e.name !== "StopProgressPropagation") {
                                                var trace = util.canAttachTrace(ret.e)
                                                    ? ret.e : new Error(util.toString(ret.e));
                                                promise._attachExtraTrace(trace);
                                                promise._progress(ret.e);
                                            }
                                        } else if (ret instanceof Promise) {
                                            ret._then(promise._progress, null, null, promise, undefined);
                                        } else {
                                            promise._progress(ret);
                                        }
                                    };


                                    Promise.prototype._progressUnchecked = function (progressValue) {
                                        var len = this._length();
                                        var progress = this._progress;
                                        for (var i = 0; i < len; i++) {
                                            var handler = this._progressHandlerAt(i);
                                            var promise = this._promiseAt(i);
                                            if (!(promise instanceof Promise)) {
                                                var receiver = this._receiverAt(i);
                                                if (typeof handler === "function") {
                                                    handler.call(receiver, progressValue, promise);
                                                } else if (receiver instanceof PromiseArray &&
                                                    !receiver._isResolved()) {
                                                    receiver._promiseProgressed(progressValue, promise);
                                                }
                                                continue;
                                            }

                                            if (typeof handler === "function") {
                                                async.invoke(this._doProgressWith, this, {
                                                    handler: handler,
                                                    promise: promise,
                                                    receiver: this._receiverAt(i),
                                                    value: progressValue
                                                });
                                            } else {
                                                async.invoke(progress, promise, progressValue);
                                            }
                                        }
                                    };
                                };

                            }, { "./async.js": 2, "./util.js": 38 }], 23: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function () {
                                    var makeSelfResolutionError = function () {
                                        return new TypeError("circular promise resolution chain\u000a\u000a    See http://goo.gl/LhFpo0\u000a");
                                    };
                                    var reflect = function () {
                                        return new Promise.PromiseInspection(this._target());
                                    };
                                    var apiRejection = function (msg) {
                                        return Promise.reject(new TypeError(msg));
                                    };

                                    var util = _dereq_("./util.js");

                                    var getDomain;
                                    if (util.isNode) {
                                        getDomain = function () {
                                            var ret = process.domain;
                                            if (ret === undefined) ret = null;
                                            return ret;
                                        };
                                    } else {
                                        getDomain = function () {
                                            return null;
                                        };
                                    }
                                    util.notEnumerableProp(Promise, "_getDomain", getDomain);

                                    var UNDEFINED_BINDING = {};
                                    var async = _dereq_("./async.js");
                                    var errors = _dereq_("./errors.js");
                                    var TypeError = Promise.TypeError = errors.TypeError;
                                    Promise.RangeError = errors.RangeError;
                                    Promise.CancellationError = errors.CancellationError;
                                    Promise.TimeoutError = errors.TimeoutError;
                                    Promise.OperationalError = errors.OperationalError;
                                    Promise.RejectionError = errors.OperationalError;
                                    Promise.AggregateError = errors.AggregateError;
                                    var INTERNAL = function () { };
                                    var APPLY = {};
                                    var NEXT_FILTER = { e: null };
                                    var tryConvertToPromise = _dereq_("./thenables.js")(Promise, INTERNAL);
                                    var PromiseArray =
                                        _dereq_("./promise_array.js")(Promise, INTERNAL,
                                            tryConvertToPromise, apiRejection);
                                    var CapturedTrace = _dereq_("./captured_trace.js")();
                                    var isDebugging = _dereq_("./debuggability.js")(Promise, CapturedTrace);
                                    /*jshint unused:false*/
                                    var createContext =
                                        _dereq_("./context.js")(Promise, CapturedTrace, isDebugging);
                                    var CatchFilter = _dereq_("./catch_filter.js")(NEXT_FILTER);
                                    var PromiseResolver = _dereq_("./promise_resolver.js");
                                    var nodebackForPromise = PromiseResolver._nodebackForPromise;
                                    var errorObj = util.errorObj;
                                    var tryCatch = util.tryCatch;

                                    function Promise(resolver) {
                                        if (typeof resolver !== "function") {
                                            throw new TypeError("the promise constructor requires a resolver function\u000a\u000a    See http://goo.gl/EC22Yn\u000a");
                                        }
                                        if (this.constructor !== Promise) {
                                            throw new TypeError("the promise constructor cannot be invoked directly\u000a\u000a    See http://goo.gl/KsIlge\u000a");
                                        }
                                        this._bitField = 0;
                                        this._fulfillmentHandler0 = undefined;
                                        this._rejectionHandler0 = undefined;
                                        this._progressHandler0 = undefined;
                                        this._promise0 = undefined;
                                        this._receiver0 = undefined;
                                        this._settledValue = undefined;
                                        if (resolver !== INTERNAL) this._resolveFromResolver(resolver);
                                    }

                                    Promise.prototype.toString = function () {
                                        return "[object Promise]";
                                    };

                                    Promise.prototype.caught = Promise.prototype["catch"] = function (fn) {
                                        var len = arguments.length;
                                        if (len > 1) {
                                            var catchInstances = new Array(len - 1),
                                                j = 0, i;
                                            for (i = 0; i < len - 1; ++i) {
                                                var item = arguments[i];
                                                if (typeof item === "function") {
                                                    catchInstances[j++] = item;
                                                } else {
                                                    return Promise.reject(
                                                        new TypeError("Catch filter must inherit from Error or be a simple predicate function\u000a\u000a    See http://goo.gl/o84o68\u000a"));
                                                }
                                            }
                                            catchInstances.length = j;
                                            fn = arguments[i];
                                            var catchFilter = new CatchFilter(catchInstances, fn, this);
                                            return this._then(undefined, catchFilter.doFilter, undefined,
                                                catchFilter, undefined);
                                        }
                                        return this._then(undefined, fn, undefined, undefined, undefined);
                                    };

                                    Promise.prototype.reflect = function () {
                                        return this._then(reflect, reflect, undefined, this, undefined);
                                    };

                                    Promise.prototype.then = function (didFulfill, didReject, didProgress) {
                                        if (isDebugging() && arguments.length > 0 &&
                                            typeof didFulfill !== "function" &&
                                            typeof didReject !== "function") {
                                            var msg = ".then() only accepts functions but was passed: " +
                                                util.classString(didFulfill);
                                            if (arguments.length > 1) {
                                                msg += ", " + util.classString(didReject);
                                            }
                                            this._warn(msg);
                                        }
                                        return this._then(didFulfill, didReject, didProgress,
                                            undefined, undefined);
                                    };

                                    Promise.prototype.done = function (didFulfill, didReject, didProgress) {
                                        var promise = this._then(didFulfill, didReject, didProgress,
                                            undefined, undefined);
                                        promise._setIsFinal();
                                    };

                                    Promise.prototype.spread = function (didFulfill, didReject) {
                                        return this.all()._then(didFulfill, didReject, undefined, APPLY, undefined);
                                    };

                                    Promise.prototype.isCancellable = function () {
                                        return !this.isResolved() &&
                                            this._cancellable();
                                    };

                                    Promise.prototype.toJSON = function () {
                                        var ret = {
                                            isFulfilled: false,
                                            isRejected: false,
                                            fulfillmentValue: undefined,
                                            rejectionReason: undefined
                                        };
                                        if (this.isFulfilled()) {
                                            ret.fulfillmentValue = this.value();
                                            ret.isFulfilled = true;
                                        } else if (this.isRejected()) {
                                            ret.rejectionReason = this.reason();
                                            ret.isRejected = true;
                                        }
                                        return ret;
                                    };

                                    Promise.prototype.all = function () {
                                        return new PromiseArray(this).promise();
                                    };

                                    Promise.prototype.error = function (fn) {
                                        return this.caught(util.originatesFromRejection, fn);
                                    };

                                    Promise.getNewLibraryCopy = module.exports;

                                    Promise.is = function (val) {
                                        return val instanceof Promise;
                                    };

                                    Promise.fromNode = function (fn) {
                                        var ret = new Promise(INTERNAL);
                                        var result = tryCatch(fn)(nodebackForPromise(ret));
                                        if (result === errorObj) {
                                            ret._rejectCallback(result.e, true, true);
                                        }
                                        return ret;
                                    };

                                    Promise.all = function (promises) {
                                        return new PromiseArray(promises).promise();
                                    };

                                    Promise.defer = Promise.pending = function () {
                                        var promise = new Promise(INTERNAL);
                                        return new PromiseResolver(promise);
                                    };

                                    Promise.cast = function (obj) {
                                        var ret = tryConvertToPromise(obj);
                                        if (!(ret instanceof Promise)) {
                                            var val = ret;
                                            ret = new Promise(INTERNAL);
                                            ret._fulfillUnchecked(val);
                                        }
                                        return ret;
                                    };

                                    Promise.resolve = Promise.fulfilled = Promise.cast;

                                    Promise.reject = Promise.rejected = function (reason) {
                                        var ret = new Promise(INTERNAL);
                                        ret._captureStackTrace();
                                        ret._rejectCallback(reason, true);
                                        return ret;
                                    };

                                    Promise.setScheduler = function (fn) {
                                        if (typeof fn !== "function") throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
                                        var prev = async._schedule;
                                        async._schedule = fn;
                                        return prev;
                                    };

                                    Promise.prototype._then = function (
                                        didFulfill,
                                        didReject,
                                        didProgress,
                                        receiver,
                                        internalData
                                    ) {
                                        var haveInternalData = internalData !== undefined;
                                        var ret = haveInternalData ? internalData : new Promise(INTERNAL);

                                        if (!haveInternalData) {
                                            ret._propagateFrom(this, 4 | 1);
                                            ret._captureStackTrace();
                                        }

                                        var target = this._target();
                                        if (target !== this) {
                                            if (receiver === undefined) receiver = this._boundTo;
                                            if (!haveInternalData) ret._setIsMigrated();
                                        }

                                        var callbackIndex = target._addCallbacks(didFulfill,
                                            didReject,
                                            didProgress,
                                            ret,
                                            receiver,
                                            getDomain());

                                        if (target._isResolved() && !target._isSettlePromisesQueued()) {
                                            async.invoke(
                                                target._settlePromiseAtPostResolution, target, callbackIndex);
                                        }

                                        return ret;
                                    };

                                    Promise.prototype._settlePromiseAtPostResolution = function (index) {
                                        if (this._isRejectionUnhandled()) this._unsetRejectionIsUnhandled();
                                        this._settlePromiseAt(index);
                                    };

                                    Promise.prototype._length = function () {
                                        return this._bitField & 131071;
                                    };

                                    Promise.prototype._isFollowingOrFulfilledOrRejected = function () {
                                        return (this._bitField & 939524096) > 0;
                                    };

                                    Promise.prototype._isFollowing = function () {
                                        return (this._bitField & 536870912) === 536870912;
                                    };

                                    Promise.prototype._setLength = function (len) {
                                        this._bitField = (this._bitField & -131072) |
                                            (len & 131071);
                                    };

                                    Promise.prototype._setFulfilled = function () {
                                        this._bitField = this._bitField | 268435456;
                                    };

                                    Promise.prototype._setRejected = function () {
                                        this._bitField = this._bitField | 134217728;
                                    };

                                    Promise.prototype._setFollowing = function () {
                                        this._bitField = this._bitField | 536870912;
                                    };

                                    Promise.prototype._setIsFinal = function () {
                                        this._bitField = this._bitField | 33554432;
                                    };

                                    Promise.prototype._isFinal = function () {
                                        return (this._bitField & 33554432) > 0;
                                    };

                                    Promise.prototype._cancellable = function () {
                                        return (this._bitField & 67108864) > 0;
                                    };

                                    Promise.prototype._setCancellable = function () {
                                        this._bitField = this._bitField | 67108864;
                                    };

                                    Promise.prototype._unsetCancellable = function () {
                                        this._bitField = this._bitField & (~67108864);
                                    };

                                    Promise.prototype._setIsMigrated = function () {
                                        this._bitField = this._bitField | 4194304;
                                    };

                                    Promise.prototype._unsetIsMigrated = function () {
                                        this._bitField = this._bitField & (~4194304);
                                    };

                                    Promise.prototype._isMigrated = function () {
                                        return (this._bitField & 4194304) > 0;
                                    };

                                    Promise.prototype._receiverAt = function (index) {
                                        var ret = index === 0
                                            ? this._receiver0
                                            : this[
                                            index * 5 - 5 + 4];
                                        if (ret === UNDEFINED_BINDING) {
                                            return undefined;
                                        } else if (ret === undefined && this._isBound()) {
                                            return this._boundValue();
                                        }
                                        return ret;
                                    };

                                    Promise.prototype._promiseAt = function (index) {
                                        return index === 0
                                            ? this._promise0
                                            : this[index * 5 - 5 + 3];
                                    };

                                    Promise.prototype._fulfillmentHandlerAt = function (index) {
                                        return index === 0
                                            ? this._fulfillmentHandler0
                                            : this[index * 5 - 5 + 0];
                                    };

                                    Promise.prototype._rejectionHandlerAt = function (index) {
                                        return index === 0
                                            ? this._rejectionHandler0
                                            : this[index * 5 - 5 + 1];
                                    };

                                    Promise.prototype._boundValue = function () {
                                        var ret = this._boundTo;
                                        if (ret !== undefined) {
                                            if (ret instanceof Promise) {
                                                if (ret.isFulfilled()) {
                                                    return ret.value();
                                                } else {
                                                    return undefined;
                                                }
                                            }
                                        }
                                        return ret;
                                    };

                                    Promise.prototype._migrateCallbacks = function (follower, index) {
                                        var fulfill = follower._fulfillmentHandlerAt(index);
                                        var reject = follower._rejectionHandlerAt(index);
                                        var progress = follower._progressHandlerAt(index);
                                        var promise = follower._promiseAt(index);
                                        var receiver = follower._receiverAt(index);
                                        if (promise instanceof Promise) promise._setIsMigrated();
                                        if (receiver === undefined) receiver = UNDEFINED_BINDING;
                                        this._addCallbacks(fulfill, reject, progress, promise, receiver, null);
                                    };

                                    Promise.prototype._addCallbacks = function (
                                        fulfill,
                                        reject,
                                        progress,
                                        promise,
                                        receiver,
                                        domain
                                    ) {
                                        var index = this._length();

                                        if (index >= 131071 - 5) {
                                            index = 0;
                                            this._setLength(0);
                                        }

                                        if (index === 0) {
                                            this._promise0 = promise;
                                            if (receiver !== undefined) this._receiver0 = receiver;
                                            if (typeof fulfill === "function" && !this._isCarryingStackTrace()) {
                                                this._fulfillmentHandler0 =
                                                    domain === null ? fulfill : domain.bind(fulfill);
                                            }
                                            if (typeof reject === "function") {
                                                this._rejectionHandler0 =
                                                    domain === null ? reject : domain.bind(reject);
                                            }
                                            if (typeof progress === "function") {
                                                this._progressHandler0 =
                                                    domain === null ? progress : domain.bind(progress);
                                            }
                                        } else {
                                            var base = index * 5 - 5;
                                            this[base + 3] = promise;
                                            this[base + 4] = receiver;
                                            if (typeof fulfill === "function") {
                                                this[base + 0] =
                                                    domain === null ? fulfill : domain.bind(fulfill);
                                            }
                                            if (typeof reject === "function") {
                                                this[base + 1] =
                                                    domain === null ? reject : domain.bind(reject);
                                            }
                                            if (typeof progress === "function") {
                                                this[base + 2] =
                                                    domain === null ? progress : domain.bind(progress);
                                            }
                                        }
                                        this._setLength(index + 1);
                                        return index;
                                    };

                                    Promise.prototype._setProxyHandlers = function (receiver, promiseSlotValue) {
                                        var index = this._length();

                                        if (index >= 131071 - 5) {
                                            index = 0;
                                            this._setLength(0);
                                        }
                                        if (index === 0) {
                                            this._promise0 = promiseSlotValue;
                                            this._receiver0 = receiver;
                                        } else {
                                            var base = index * 5 - 5;
                                            this[base + 3] = promiseSlotValue;
                                            this[base + 4] = receiver;
                                        }
                                        this._setLength(index + 1);
                                    };

                                    Promise.prototype._proxyPromiseArray = function (promiseArray, index) {
                                        this._setProxyHandlers(promiseArray, index);
                                    };

                                    Promise.prototype._resolveCallback = function (value, shouldBind) {
                                        if (this._isFollowingOrFulfilledOrRejected()) return;
                                        if (value === this)
                                            return this._rejectCallback(makeSelfResolutionError(), false, true);
                                        var maybePromise = tryConvertToPromise(value, this);
                                        if (!(maybePromise instanceof Promise)) return this._fulfill(value);

                                        var propagationFlags = 1 | (shouldBind ? 4 : 0);
                                        this._propagateFrom(maybePromise, propagationFlags);
                                        var promise = maybePromise._target();
                                        if (promise._isPending()) {
                                            var len = this._length();
                                            for (var i = 0; i < len; ++i) {
                                                promise._migrateCallbacks(this, i);
                                            }
                                            this._setFollowing();
                                            this._setLength(0);
                                            this._setFollowee(promise);
                                        } else if (promise._isFulfilled()) {
                                            this._fulfillUnchecked(promise._value());
                                        } else {
                                            this._rejectUnchecked(promise._reason(),
                                                promise._getCarriedStackTrace());
                                        }
                                    };

                                    Promise.prototype._rejectCallback =
                                        function (reason, synchronous, shouldNotMarkOriginatingFromRejection) {
                                            if (!shouldNotMarkOriginatingFromRejection) {
                                                util.markAsOriginatingFromRejection(reason);
                                            }
                                            var trace = util.ensureErrorObject(reason);
                                            var hasStack = trace === reason;
                                            this._attachExtraTrace(trace, synchronous ? hasStack : false);
                                            this._reject(reason, hasStack ? undefined : trace);
                                        };

                                    Promise.prototype._resolveFromResolver = function (resolver) {
                                        var promise = this;
                                        this._captureStackTrace();
                                        this._pushContext();
                                        var synchronous = true;
                                        var r = tryCatch(resolver)(function (value) {
                                            if (promise === null) return;
                                            promise._resolveCallback(value);
                                            promise = null;
                                        }, function (reason) {
                                            if (promise === null) return;
                                            promise._rejectCallback(reason, synchronous);
                                            promise = null;
                                        });
                                        synchronous = false;
                                        this._popContext();

                                        if (r !== undefined && r === errorObj && promise !== null) {
                                            promise._rejectCallback(r.e, true, true);
                                            promise = null;
                                        }
                                    };

                                    Promise.prototype._settlePromiseFromHandler = function (
                                        handler, receiver, value, promise
                                    ) {
                                        if (promise._isRejected()) return;
                                        promise._pushContext();
                                        var x;
                                        if (receiver === APPLY && !this._isRejected()) {
                                            x = tryCatch(handler).apply(this._boundValue(), value);
                                        } else {
                                            x = tryCatch(handler).call(receiver, value);
                                        }
                                        promise._popContext();

                                        if (x === errorObj || x === promise || x === NEXT_FILTER) {
                                            var err = x === promise ? makeSelfResolutionError() : x.e;
                                            promise._rejectCallback(err, false, true);
                                        } else {
                                            promise._resolveCallback(x);
                                        }
                                    };

                                    Promise.prototype._target = function () {
                                        var ret = this;
                                        while (ret._isFollowing()) ret = ret._followee();
                                        return ret;
                                    };

                                    Promise.prototype._followee = function () {
                                        return this._rejectionHandler0;
                                    };

                                    Promise.prototype._setFollowee = function (promise) {
                                        this._rejectionHandler0 = promise;
                                    };

                                    Promise.prototype._cleanValues = function () {
                                        if (this._cancellable()) {
                                            this._cancellationParent = undefined;
                                        }
                                    };

                                    Promise.prototype._propagateFrom = function (parent, flags) {
                                        if ((flags & 1) > 0 && parent._cancellable()) {
                                            this._setCancellable();
                                            this._cancellationParent = parent;
                                        }
                                        if ((flags & 4) > 0 && parent._isBound()) {
                                            this._setBoundTo(parent._boundTo);
                                        }
                                    };

                                    Promise.prototype._fulfill = function (value) {
                                        if (this._isFollowingOrFulfilledOrRejected()) return;
                                        this._fulfillUnchecked(value);
                                    };

                                    Promise.prototype._reject = function (reason, carriedStackTrace) {
                                        if (this._isFollowingOrFulfilledOrRejected()) return;
                                        this._rejectUnchecked(reason, carriedStackTrace);
                                    };

                                    Promise.prototype._settlePromiseAt = function (index) {
                                        var promise = this._promiseAt(index);
                                        var isPromise = promise instanceof Promise;

                                        if (isPromise && promise._isMigrated()) {
                                            promise._unsetIsMigrated();
                                            return async.invoke(this._settlePromiseAt, this, index);
                                        }
                                        var handler = this._isFulfilled()
                                            ? this._fulfillmentHandlerAt(index)
                                            : this._rejectionHandlerAt(index);

                                        var carriedStackTrace =
                                            this._isCarryingStackTrace() ? this._getCarriedStackTrace() : undefined;
                                        var value = this._settledValue;
                                        var receiver = this._receiverAt(index);
                                        this._clearCallbackDataAtIndex(index);

                                        if (typeof handler === "function") {
                                            if (!isPromise) {
                                                handler.call(receiver, value, promise);
                                            } else {
                                                this._settlePromiseFromHandler(handler, receiver, value, promise);
                                            }
                                        } else if (receiver instanceof PromiseArray) {
                                            if (!receiver._isResolved()) {
                                                if (this._isFulfilled()) {
                                                    receiver._promiseFulfilled(value, promise);
                                                }
                                                else {
                                                    receiver._promiseRejected(value, promise);
                                                }
                                            }
                                        } else if (isPromise) {
                                            if (this._isFulfilled()) {
                                                promise._fulfill(value);
                                            } else {
                                                promise._reject(value, carriedStackTrace);
                                            }
                                        }

                                        if (index >= 4 && (index & 31) === 4)
                                            async.invokeLater(this._setLength, this, 0);
                                    };

                                    Promise.prototype._clearCallbackDataAtIndex = function (index) {
                                        if (index === 0) {
                                            if (!this._isCarryingStackTrace()) {
                                                this._fulfillmentHandler0 = undefined;
                                            }
                                            this._rejectionHandler0 =
                                                this._progressHandler0 =
                                                this._receiver0 =
                                                this._promise0 = undefined;
                                        } else {
                                            var base = index * 5 - 5;
                                            this[base + 3] =
                                                this[base + 4] =
                                                this[base + 0] =
                                                this[base + 1] =
                                                this[base + 2] = undefined;
                                        }
                                    };

                                    Promise.prototype._isSettlePromisesQueued = function () {
                                        return (this._bitField &
                                            -1073741824) === -1073741824;
                                    };

                                    Promise.prototype._setSettlePromisesQueued = function () {
                                        this._bitField = this._bitField | -1073741824;
                                    };

                                    Promise.prototype._unsetSettlePromisesQueued = function () {
                                        this._bitField = this._bitField & (~-1073741824);
                                    };

                                    Promise.prototype._queueSettlePromises = function () {
                                        async.settlePromises(this);
                                        this._setSettlePromisesQueued();
                                    };

                                    Promise.prototype._fulfillUnchecked = function (value) {
                                        if (value === this) {
                                            var err = makeSelfResolutionError();
                                            this._attachExtraTrace(err);
                                            return this._rejectUnchecked(err, undefined);
                                        }
                                        this._setFulfilled();
                                        this._settledValue = value;
                                        this._cleanValues();

                                        if (this._length() > 0) {
                                            this._queueSettlePromises();
                                        }
                                    };

                                    Promise.prototype._rejectUncheckedCheckError = function (reason) {
                                        var trace = util.ensureErrorObject(reason);
                                        this._rejectUnchecked(reason, trace === reason ? undefined : trace);
                                    };

                                    Promise.prototype._rejectUnchecked = function (reason, trace) {
                                        if (reason === this) {
                                            var err = makeSelfResolutionError();
                                            this._attachExtraTrace(err);
                                            return this._rejectUnchecked(err);
                                        }
                                        this._setRejected();
                                        this._settledValue = reason;
                                        this._cleanValues();

                                        if (this._isFinal()) {
                                            async.throwLater(function (e) {
                                                if ("stack" in e) {
                                                    async.invokeFirst(
                                                        CapturedTrace.unhandledRejection, undefined, e);
                                                }
                                                throw e;
                                            }, trace === undefined ? reason : trace);
                                            return;
                                        }

                                        if (trace !== undefined && trace !== reason) {
                                            this._setCarriedStackTrace(trace);
                                        }

                                        if (this._length() > 0) {
                                            this._queueSettlePromises();
                                        } else {
                                            this._ensurePossibleRejectionHandled();
                                        }
                                    };

                                    Promise.prototype._settlePromises = function () {
                                        this._unsetSettlePromisesQueued();
                                        var len = this._length();
                                        for (var i = 0; i < len; i++) {
                                            this._settlePromiseAt(i);
                                        }
                                    };


                                    util.notEnumerableProp(Promise,
                                        "_makeSelfResolutionError",
                                        makeSelfResolutionError);

                                    _dereq_("./progress.js")(Promise, PromiseArray);
                                    _dereq_("./method.js")(Promise, INTERNAL, tryConvertToPromise, apiRejection);
                                    _dereq_("./bind.js")(Promise, INTERNAL, tryConvertToPromise);
                                    _dereq_("./finally.js")(Promise, NEXT_FILTER, tryConvertToPromise);
                                    _dereq_("./direct_resolve.js")(Promise);
                                    _dereq_("./synchronous_inspection.js")(Promise);
                                    _dereq_("./join.js")(Promise, PromiseArray, tryConvertToPromise, INTERNAL);
                                    Promise.version = "2.11.0";
                                    Promise.Promise = Promise;
                                    _dereq_('./map.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL);
                                    _dereq_('./cancel.js')(Promise);
                                    _dereq_('./using.js')(Promise, apiRejection, tryConvertToPromise, createContext);
                                    _dereq_('./generators.js')(Promise, apiRejection, INTERNAL, tryConvertToPromise);
                                    _dereq_('./nodeify.js')(Promise);
                                    _dereq_('./call_get.js')(Promise);
                                    _dereq_('./props.js')(Promise, PromiseArray, tryConvertToPromise, apiRejection);
                                    _dereq_('./race.js')(Promise, INTERNAL, tryConvertToPromise, apiRejection);
                                    _dereq_('./reduce.js')(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL);
                                    _dereq_('./settle.js')(Promise, PromiseArray);
                                    _dereq_('./some.js')(Promise, PromiseArray, apiRejection);
                                    _dereq_('./promisify.js')(Promise, INTERNAL);
                                    _dereq_('./any.js')(Promise);
                                    _dereq_('./each.js')(Promise, INTERNAL);
                                    _dereq_('./timers.js')(Promise, INTERNAL);
                                    _dereq_('./filter.js')(Promise, INTERNAL);

                                    util.toFastProperties(Promise);
                                    util.toFastProperties(Promise.prototype);
                                    function fillTypes(value) {
                                        var p = new Promise(INTERNAL);
                                        p._fulfillmentHandler0 = value;
                                        p._rejectionHandler0 = value;
                                        p._progressHandler0 = value;
                                        p._promise0 = value;
                                        p._receiver0 = value;
                                        p._settledValue = value;
                                    }
                                    // Complete slack tracking, opt out of field-type tracking and           
                                    // stabilize map                                                         
                                    fillTypes({ a: 1 });
                                    fillTypes({ b: 2 });
                                    fillTypes({ c: 3 });
                                    fillTypes(1);
                                    fillTypes(function () { });
                                    fillTypes(undefined);
                                    fillTypes(false);
                                    fillTypes(new Promise(INTERNAL));
                                    CapturedTrace.setBounds(async.firstLineError, util.lastLineError);
                                    return Promise;

                                };

                            }, { "./any.js": 1, "./async.js": 2, "./bind.js": 3, "./call_get.js": 5, "./cancel.js": 6, "./captured_trace.js": 7, "./catch_filter.js": 8, "./context.js": 9, "./debuggability.js": 10, "./direct_resolve.js": 11, "./each.js": 12, "./errors.js": 13, "./filter.js": 15, "./finally.js": 16, "./generators.js": 17, "./join.js": 18, "./map.js": 19, "./method.js": 20, "./nodeify.js": 21, "./progress.js": 22, "./promise_array.js": 24, "./promise_resolver.js": 25, "./promisify.js": 26, "./props.js": 27, "./race.js": 29, "./reduce.js": 30, "./settle.js": 32, "./some.js": 33, "./synchronous_inspection.js": 34, "./thenables.js": 35, "./timers.js": 36, "./using.js": 37, "./util.js": 38 }], 24: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, INTERNAL, tryConvertToPromise,
                                    apiRejection) {
                                    var util = _dereq_("./util.js");
                                    var isArray = util.isArray;

                                    function toResolutionValue(val) {
                                        switch (val) {
                                            case -2: return [];
                                            case -3: return {};
                                        }
                                    }

                                    function PromiseArray(values) {
                                        var promise = this._promise = new Promise(INTERNAL);
                                        var parent;
                                        if (values instanceof Promise) {
                                            parent = values;
                                            promise._propagateFrom(parent, 1 | 4);
                                        }
                                        this._values = values;
                                        this._length = 0;
                                        this._totalResolved = 0;
                                        this._init(undefined, -2);
                                    }
                                    PromiseArray.prototype.length = function () {
                                        return this._length;
                                    };

                                    PromiseArray.prototype.promise = function () {
                                        return this._promise;
                                    };

                                    PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
                                        var values = tryConvertToPromise(this._values, this._promise);
                                        if (values instanceof Promise) {
                                            values = values._target();
                                            this._values = values;
                                            if (values._isFulfilled()) {
                                                values = values._value();
                                                if (!isArray(values)) {
                                                    var err = new Promise.TypeError("expecting an array, a promise or a thenable\u000a\u000a    See http://goo.gl/s8MMhc\u000a");
                                                    this.__hardReject__(err);
                                                    return;
                                                }
                                            } else if (values._isPending()) {
                                                values._then(
                                                    init,
                                                    this._reject,
                                                    undefined,
                                                    this,
                                                    resolveValueIfEmpty
                                                );
                                                return;
                                            } else {
                                                this._reject(values._reason());
                                                return;
                                            }
                                        } else if (!isArray(values)) {
                                            this._promise._reject(apiRejection("expecting an array, a promise or a thenable\u000a\u000a    See http://goo.gl/s8MMhc\u000a")._reason());
                                            return;
                                        }

                                        if (values.length === 0) {
                                            if (resolveValueIfEmpty === -5) {
                                                this._resolveEmptyArray();
                                            }
                                            else {
                                                this._resolve(toResolutionValue(resolveValueIfEmpty));
                                            }
                                            return;
                                        }
                                        var len = this.getActualLength(values.length);
                                        this._length = len;
                                        this._values = this.shouldCopyValues() ? new Array(len) : this._values;
                                        var promise = this._promise;
                                        for (var i = 0; i < len; ++i) {
                                            var isResolved = this._isResolved();
                                            var maybePromise = tryConvertToPromise(values[i], promise);
                                            if (maybePromise instanceof Promise) {
                                                maybePromise = maybePromise._target();
                                                if (isResolved) {
                                                    maybePromise._ignoreRejections();
                                                } else if (maybePromise._isPending()) {
                                                    maybePromise._proxyPromiseArray(this, i);
                                                } else if (maybePromise._isFulfilled()) {
                                                    this._promiseFulfilled(maybePromise._value(), i);
                                                } else {
                                                    this._promiseRejected(maybePromise._reason(), i);
                                                }
                                            } else if (!isResolved) {
                                                this._promiseFulfilled(maybePromise, i);
                                            }
                                        }
                                    };

                                    PromiseArray.prototype._isResolved = function () {
                                        return this._values === null;
                                    };

                                    PromiseArray.prototype._resolve = function (value) {
                                        this._values = null;
                                        this._promise._fulfill(value);
                                    };

                                    PromiseArray.prototype.__hardReject__ =
                                        PromiseArray.prototype._reject = function (reason) {
                                            this._values = null;
                                            this._promise._rejectCallback(reason, false, true);
                                        };

                                    PromiseArray.prototype._promiseProgressed = function (progressValue, index) {
                                        this._promise._progress({
                                            index: index,
                                            value: progressValue
                                        });
                                    };


                                    PromiseArray.prototype._promiseFulfilled = function (value, index) {
                                        this._values[index] = value;
                                        var totalResolved = ++this._totalResolved;
                                        if (totalResolved >= this._length) {
                                            this._resolve(this._values);
                                        }
                                    };

                                    PromiseArray.prototype._promiseRejected = function (reason, index) {
                                        this._totalResolved++;
                                        this._reject(reason);
                                    };

                                    PromiseArray.prototype.shouldCopyValues = function () {
                                        return true;
                                    };

                                    PromiseArray.prototype.getActualLength = function (len) {
                                        return len;
                                    };

                                    return PromiseArray;
                                };

                            }, { "./util.js": 38 }], 25: [function (_dereq_, module, exports) {
                                "use strict";
                                var util = _dereq_("./util.js");
                                var maybeWrapAsError = util.maybeWrapAsError;
                                var errors = _dereq_("./errors.js");
                                var TimeoutError = errors.TimeoutError;
                                var OperationalError = errors.OperationalError;
                                var haveGetters = util.haveGetters;
                                var es5 = _dereq_("./es5.js");

                                function isUntypedError(obj) {
                                    return obj instanceof Error &&
                                        es5.getPrototypeOf(obj) === Error.prototype;
                                }

                                var rErrorKey = /^(?:name|message|stack|cause)$/;
                                function wrapAsOperationalError(obj) {
                                    var ret;
                                    if (isUntypedError(obj)) {
                                        ret = new OperationalError(obj);
                                        ret.name = obj.name;
                                        ret.message = obj.message;
                                        ret.stack = obj.stack;
                                        var keys = es5.keys(obj);
                                        for (var i = 0; i < keys.length; ++i) {
                                            var key = keys[i];
                                            if (!rErrorKey.test(key)) {
                                                ret[key] = obj[key];
                                            }
                                        }
                                        return ret;
                                    }
                                    util.markAsOriginatingFromRejection(obj);
                                    return obj;
                                }

                                function nodebackForPromise(promise) {
                                    return function (err, value) {
                                        if (promise === null) return;

                                        if (err) {
                                            var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
                                            promise._attachExtraTrace(wrapped);
                                            promise._reject(wrapped);
                                        } else if (arguments.length > 2) {
                                            var $_len = arguments.length; var args = new Array($_len - 1); for (var $_i = 1; $_i < $_len; ++$_i) { args[$_i - 1] = arguments[$_i]; }
                                            promise._fulfill(args);
                                        } else {
                                            promise._fulfill(value);
                                        }

                                        promise = null;
                                    };
                                }


                                var PromiseResolver;
                                if (!haveGetters) {
                                    PromiseResolver = function (promise) {
                                        this.promise = promise;
                                        this.asCallback = nodebackForPromise(promise);
                                        this.callback = this.asCallback;
                                    };
                                }
                                else {
                                    PromiseResolver = function (promise) {
                                        this.promise = promise;
                                    };
                                }
                                if (haveGetters) {
                                    var prop = {
                                        get: function () {
                                            return nodebackForPromise(this.promise);
                                        }
                                    };
                                    es5.defineProperty(PromiseResolver.prototype, "asCallback", prop);
                                    es5.defineProperty(PromiseResolver.prototype, "callback", prop);
                                }

                                PromiseResolver._nodebackForPromise = nodebackForPromise;

                                PromiseResolver.prototype.toString = function () {
                                    return "[object PromiseResolver]";
                                };

                                PromiseResolver.prototype.resolve =
                                    PromiseResolver.prototype.fulfill = function (value) {
                                        if (!(this instanceof PromiseResolver)) {
                                            throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\u000a\u000a    See http://goo.gl/sdkXL9\u000a");
                                        }
                                        this.promise._resolveCallback(value);
                                    };

                                PromiseResolver.prototype.reject = function (reason) {
                                    if (!(this instanceof PromiseResolver)) {
                                        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\u000a\u000a    See http://goo.gl/sdkXL9\u000a");
                                    }
                                    this.promise._rejectCallback(reason);
                                };

                                PromiseResolver.prototype.progress = function (value) {
                                    if (!(this instanceof PromiseResolver)) {
                                        throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\u000a\u000a    See http://goo.gl/sdkXL9\u000a");
                                    }
                                    this.promise._progress(value);
                                };

                                PromiseResolver.prototype.cancel = function (err) {
                                    this.promise.cancel(err);
                                };

                                PromiseResolver.prototype.timeout = function () {
                                    this.reject(new TimeoutError("timeout"));
                                };

                                PromiseResolver.prototype.isResolved = function () {
                                    return this.promise.isResolved();
                                };

                                PromiseResolver.prototype.toJSON = function () {
                                    return this.promise.toJSON();
                                };

                                module.exports = PromiseResolver;

                            }, { "./errors.js": 13, "./es5.js": 14, "./util.js": 38 }], 26: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, INTERNAL) {
                                    var THIS = {};
                                    var util = _dereq_("./util.js");
                                    var nodebackForPromise = _dereq_("./promise_resolver.js")
                                        ._nodebackForPromise;
                                    var withAppended = util.withAppended;
                                    var maybeWrapAsError = util.maybeWrapAsError;
                                    var canEvaluate = util.canEvaluate;
                                    var TypeError = _dereq_("./errors").TypeError;
                                    var defaultSuffix = "Async";
                                    var defaultPromisified = { __isPromisified__: true };
                                    var noCopyProps = [
                                        "arity", "length",
                                        "name",
                                        "arguments",
                                        "caller",
                                        "callee",
                                        "prototype",
                                        "__isPromisified__"
                                    ];
                                    var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

                                    var defaultFilter = function (name) {
                                        return util.isIdentifier(name) &&
                                            name.charAt(0) !== "_" &&
                                            name !== "constructor";
                                    };

                                    function propsFilter(key) {
                                        return !noCopyPropsPattern.test(key);
                                    }

                                    function isPromisified(fn) {
                                        try {
                                            return fn.__isPromisified__ === true;
                                        }
                                        catch (e) {
                                            return false;
                                        }
                                    }

                                    function hasPromisified(obj, key, suffix) {
                                        var val = util.getDataPropertyOrDefault(obj, key + suffix,
                                            defaultPromisified);
                                        return val ? isPromisified(val) : false;
                                    }
                                    function checkValid(ret, suffix, suffixRegexp) {
                                        for (var i = 0; i < ret.length; i += 2) {
                                            var key = ret[i];
                                            if (suffixRegexp.test(key)) {
                                                var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
                                                for (var j = 0; j < ret.length; j += 2) {
                                                    if (ret[j] === keyWithoutAsyncSuffix) {
                                                        throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\u000a\u000a    See http://goo.gl/iWrZbw\u000a"
                                                            .replace("%s", suffix));
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
                                        var keys = util.inheritedDataKeys(obj);
                                        var ret = [];
                                        for (var i = 0; i < keys.length; ++i) {
                                            var key = keys[i];
                                            var value = obj[key];
                                            var passesDefaultFilter = filter === defaultFilter
                                                ? true : defaultFilter(key, value, obj);
                                            if (typeof value === "function" &&
                                                !isPromisified(value) &&
                                                !hasPromisified(obj, key, suffix) &&
                                                filter(key, value, obj, passesDefaultFilter)) {
                                                ret.push(key, value);
                                            }
                                        }
                                        checkValid(ret, suffix, suffixRegexp);
                                        return ret;
                                    }

                                    var escapeIdentRegex = function (str) {
                                        return str.replace(/([$])/, "\\$");
                                    };

                                    var makeNodePromisifiedEval;
                                    if (false) { var parameterCount, parameterDeclaration, argumentSequence, switchCaseArgumentOrder; }

                                    function makeNodePromisifiedClosure(callback, receiver, _, fn) {
                                        var defaultThis = (function () { return this; })();
                                        var method = callback;
                                        if (typeof method === "string") {
                                            callback = fn;
                                        }
                                        function promisified() {
                                            var _receiver = receiver;
                                            if (receiver === THIS) _receiver = this;
                                            var promise = new Promise(INTERNAL);
                                            promise._captureStackTrace();
                                            var cb = typeof method === "string" && this !== defaultThis
                                                ? this[method] : callback;
                                            var fn = nodebackForPromise(promise);
                                            try {
                                                cb.apply(_receiver, withAppended(arguments, fn));
                                            } catch (e) {
                                                promise._rejectCallback(maybeWrapAsError(e), true, true);
                                            }
                                            return promise;
                                        }
                                        util.notEnumerableProp(promisified, "__isPromisified__", true);
                                        return promisified;
                                    }

                                    var makeNodePromisified = canEvaluate
                                        ? makeNodePromisifiedEval
                                        : makeNodePromisifiedClosure;

                                    function promisifyAll(obj, suffix, filter, promisifier) {
                                        var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$");
                                        var methods =
                                            promisifiableMethods(obj, suffix, suffixRegexp, filter);

                                        for (var i = 0, len = methods.length; i < len; i += 2) {
                                            var key = methods[i];
                                            var fn = methods[i + 1];
                                            var promisifiedKey = key + suffix;
                                            if (promisifier === makeNodePromisified) {
                                                obj[promisifiedKey] =
                                                    makeNodePromisified(key, THIS, key, fn, suffix);
                                            } else {
                                                var promisified = promisifier(fn, function () {
                                                    return makeNodePromisified(key, THIS, key, fn, suffix);
                                                });
                                                util.notEnumerableProp(promisified, "__isPromisified__", true);
                                                obj[promisifiedKey] = promisified;
                                            }
                                        }
                                        util.toFastProperties(obj);
                                        return obj;
                                    }

                                    function promisify(callback, receiver) {
                                        return makeNodePromisified(callback, receiver, undefined, callback);
                                    }

                                    Promise.promisify = function (fn, receiver) {
                                        if (typeof fn !== "function") {
                                            throw new TypeError("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
                                        }
                                        if (isPromisified(fn)) {
                                            return fn;
                                        }
                                        var ret = promisify(fn, arguments.length < 2 ? THIS : receiver);
                                        util.copyDescriptors(fn, ret, propsFilter);
                                        return ret;
                                    };

                                    Promise.promisifyAll = function (target, options) {
                                        if (typeof target !== "function" && typeof target !== "object") {
                                            throw new TypeError("the target of promisifyAll must be an object or a function\u000a\u000a    See http://goo.gl/9ITlV0\u000a");
                                        }
                                        options = Object(options);
                                        var suffix = options.suffix;
                                        if (typeof suffix !== "string") suffix = defaultSuffix;
                                        var filter = options.filter;
                                        if (typeof filter !== "function") filter = defaultFilter;
                                        var promisifier = options.promisifier;
                                        if (typeof promisifier !== "function") promisifier = makeNodePromisified;

                                        if (!util.isIdentifier(suffix)) {
                                            throw new RangeError("suffix must be a valid identifier\u000a\u000a    See http://goo.gl/8FZo5V\u000a");
                                        }

                                        var keys = util.inheritedDataKeys(target);
                                        for (var i = 0; i < keys.length; ++i) {
                                            var value = target[keys[i]];
                                            if (keys[i] !== "constructor" &&
                                                util.isClass(value)) {
                                                promisifyAll(value.prototype, suffix, filter, promisifier);
                                                promisifyAll(value, suffix, filter, promisifier);
                                            }
                                        }

                                        return promisifyAll(target, suffix, filter, promisifier);
                                    };
                                };


                            }, { "./errors": 13, "./promise_resolver.js": 25, "./util.js": 38 }], 27: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (
                                    Promise, PromiseArray, tryConvertToPromise, apiRejection) {
                                    var util = _dereq_("./util.js");
                                    var isObject = util.isObject;
                                    var es5 = _dereq_("./es5.js");

                                    function PropertiesPromiseArray(obj) {
                                        var keys = es5.keys(obj);
                                        var len = keys.length;
                                        var values = new Array(len * 2);
                                        for (var i = 0; i < len; ++i) {
                                            var key = keys[i];
                                            values[i] = obj[key];
                                            values[i + len] = key;
                                        }
                                        this.constructor$(values);
                                    }
                                    util.inherits(PropertiesPromiseArray, PromiseArray);

                                    PropertiesPromiseArray.prototype._init = function () {
                                        this._init$(undefined, -3);
                                    };

                                    PropertiesPromiseArray.prototype._promiseFulfilled = function (value, index) {
                                        this._values[index] = value;
                                        var totalResolved = ++this._totalResolved;
                                        if (totalResolved >= this._length) {
                                            var val = {};
                                            var keyOffset = this.length();
                                            for (var i = 0, len = this.length(); i < len; ++i) {
                                                val[this._values[i + keyOffset]] = this._values[i];
                                            }
                                            this._resolve(val);
                                        }
                                    };

                                    PropertiesPromiseArray.prototype._promiseProgressed = function (value, index) {
                                        this._promise._progress({
                                            key: this._values[index + this.length()],
                                            value: value
                                        });
                                    };

                                    PropertiesPromiseArray.prototype.shouldCopyValues = function () {
                                        return false;
                                    };

                                    PropertiesPromiseArray.prototype.getActualLength = function (len) {
                                        return len >> 1;
                                    };

                                    function props(promises) {
                                        var ret;
                                        var castValue = tryConvertToPromise(promises);

                                        if (!isObject(castValue)) {
                                            return apiRejection("cannot await properties of a non-object\u000a\u000a    See http://goo.gl/OsFKC8\u000a");
                                        } else if (castValue instanceof Promise) {
                                            ret = castValue._then(
                                                Promise.props, undefined, undefined, undefined, undefined);
                                        } else {
                                            ret = new PropertiesPromiseArray(castValue).promise();
                                        }

                                        if (castValue instanceof Promise) {
                                            ret._propagateFrom(castValue, 4);
                                        }
                                        return ret;
                                    }

                                    Promise.prototype.props = function () {
                                        return props(this);
                                    };

                                    Promise.props = function (promises) {
                                        return props(promises);
                                    };
                                };

                            }, { "./es5.js": 14, "./util.js": 38 }], 28: [function (_dereq_, module, exports) {
                                "use strict";
                                function arrayMove(src, srcIndex, dst, dstIndex, len) {
                                    for (var j = 0; j < len; ++j) {
                                        dst[j + dstIndex] = src[j + srcIndex];
                                        src[j + srcIndex] = void 0;
                                    }
                                }

                                function Queue(capacity) {
                                    this._capacity = capacity;
                                    this._length = 0;
                                    this._front = 0;
                                }

                                Queue.prototype._willBeOverCapacity = function (size) {
                                    return this._capacity < size;
                                };

                                Queue.prototype._pushOne = function (arg) {
                                    var length = this.length();
                                    this._checkCapacity(length + 1);
                                    var i = (this._front + length) & (this._capacity - 1);
                                    this[i] = arg;
                                    this._length = length + 1;
                                };

                                Queue.prototype._unshiftOne = function (value) {
                                    var capacity = this._capacity;
                                    this._checkCapacity(this.length() + 1);
                                    var front = this._front;
                                    var i = ((((front - 1) &
                                        (capacity - 1)) ^ capacity) - capacity);
                                    this[i] = value;
                                    this._front = i;
                                    this._length = this.length() + 1;
                                };

                                Queue.prototype.unshift = function (fn, receiver, arg) {
                                    this._unshiftOne(arg);
                                    this._unshiftOne(receiver);
                                    this._unshiftOne(fn);
                                };

                                Queue.prototype.push = function (fn, receiver, arg) {
                                    var length = this.length() + 3;
                                    if (this._willBeOverCapacity(length)) {
                                        this._pushOne(fn);
                                        this._pushOne(receiver);
                                        this._pushOne(arg);
                                        return;
                                    }
                                    var j = this._front + length - 3;
                                    this._checkCapacity(length);
                                    var wrapMask = this._capacity - 1;
                                    this[(j + 0) & wrapMask] = fn;
                                    this[(j + 1) & wrapMask] = receiver;
                                    this[(j + 2) & wrapMask] = arg;
                                    this._length = length;
                                };

                                Queue.prototype.shift = function () {
                                    var front = this._front,
                                        ret = this[front];

                                    this[front] = undefined;
                                    this._front = (front + 1) & (this._capacity - 1);
                                    this._length--;
                                    return ret;
                                };

                                Queue.prototype.length = function () {
                                    return this._length;
                                };

                                Queue.prototype._checkCapacity = function (size) {
                                    if (this._capacity < size) {
                                        this._resizeTo(this._capacity << 1);
                                    }
                                };

                                Queue.prototype._resizeTo = function (capacity) {
                                    var oldCapacity = this._capacity;
                                    this._capacity = capacity;
                                    var front = this._front;
                                    var length = this._length;
                                    var moveItemsCount = (front + length) & (oldCapacity - 1);
                                    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
                                };

                                module.exports = Queue;

                            }, {}], 29: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (
                                    Promise, INTERNAL, tryConvertToPromise, apiRejection) {
                                    var isArray = _dereq_("./util.js").isArray;

                                    var raceLater = function (promise) {
                                        return promise.then(function (array) {
                                            return race(array, promise);
                                        });
                                    };

                                    function race(promises, parent) {
                                        var maybePromise = tryConvertToPromise(promises);

                                        if (maybePromise instanceof Promise) {
                                            return raceLater(maybePromise);
                                        } else if (!isArray(promises)) {
                                            return apiRejection("expecting an array, a promise or a thenable\u000a\u000a    See http://goo.gl/s8MMhc\u000a");
                                        }

                                        var ret = new Promise(INTERNAL);
                                        if (parent !== undefined) {
                                            ret._propagateFrom(parent, 4 | 1);
                                        }
                                        var fulfill = ret._fulfill;
                                        var reject = ret._reject;
                                        for (var i = 0, len = promises.length; i < len; ++i) {
                                            var val = promises[i];

                                            if (val === undefined && !(i in promises)) {
                                                continue;
                                            }

                                            Promise.cast(val)._then(fulfill, reject, undefined, ret, null);
                                        }
                                        return ret;
                                    }

                                    Promise.race = function (promises) {
                                        return race(promises, undefined);
                                    };

                                    Promise.prototype.race = function () {
                                        return race(this, undefined);
                                    };

                                };

                            }, { "./util.js": 38 }], 30: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise,
                                    PromiseArray,
                                    apiRejection,
                                    tryConvertToPromise,
                                    INTERNAL) {
                                    var getDomain = Promise._getDomain;
                                    var async = _dereq_("./async.js");
                                    var util = _dereq_("./util.js");
                                    var tryCatch = util.tryCatch;
                                    var errorObj = util.errorObj;
                                    function ReductionPromiseArray(promises, fn, accum, _each) {
                                        this.constructor$(promises);
                                        this._promise._captureStackTrace();
                                        this._preservedValues = _each === INTERNAL ? [] : null;
                                        this._zerothIsAccum = (accum === undefined);
                                        this._gotAccum = false;
                                        this._reducingIndex = (this._zerothIsAccum ? 1 : 0);
                                        this._valuesPhase = undefined;
                                        var maybePromise = tryConvertToPromise(accum, this._promise);
                                        var rejected = false;
                                        var isPromise = maybePromise instanceof Promise;
                                        if (isPromise) {
                                            maybePromise = maybePromise._target();
                                            if (maybePromise._isPending()) {
                                                maybePromise._proxyPromiseArray(this, -1);
                                            } else if (maybePromise._isFulfilled()) {
                                                accum = maybePromise._value();
                                                this._gotAccum = true;
                                            } else {
                                                this._reject(maybePromise._reason());
                                                rejected = true;
                                            }
                                        }
                                        if (!(isPromise || this._zerothIsAccum)) this._gotAccum = true;
                                        var domain = getDomain();
                                        this._callback = domain === null ? fn : domain.bind(fn);
                                        this._accum = accum;
                                        if (!rejected) async.invoke(init, this, undefined);
                                    }
                                    function init() {
                                        this._init$(undefined, -5);
                                    }
                                    util.inherits(ReductionPromiseArray, PromiseArray);

                                    ReductionPromiseArray.prototype._init = function () { };

                                    ReductionPromiseArray.prototype._resolveEmptyArray = function () {
                                        if (this._gotAccum || this._zerothIsAccum) {
                                            this._resolve(this._preservedValues !== null
                                                ? [] : this._accum);
                                        }
                                    };

                                    ReductionPromiseArray.prototype._promiseFulfilled = function (value, index) {
                                        var values = this._values;
                                        values[index] = value;
                                        var length = this.length();
                                        var preservedValues = this._preservedValues;
                                        var isEach = preservedValues !== null;
                                        var gotAccum = this._gotAccum;
                                        var valuesPhase = this._valuesPhase;
                                        var valuesPhaseIndex;
                                        if (!valuesPhase) {
                                            valuesPhase = this._valuesPhase = new Array(length);
                                            for (valuesPhaseIndex = 0; valuesPhaseIndex < length; ++valuesPhaseIndex) {
                                                valuesPhase[valuesPhaseIndex] = 0;
                                            }
                                        }
                                        valuesPhaseIndex = valuesPhase[index];

                                        if (index === 0 && this._zerothIsAccum) {
                                            this._accum = value;
                                            this._gotAccum = gotAccum = true;
                                            valuesPhase[index] = ((valuesPhaseIndex === 0)
                                                ? 1 : 2);
                                        } else if (index === -1) {
                                            this._accum = value;
                                            this._gotAccum = gotAccum = true;
                                        } else {
                                            if (valuesPhaseIndex === 0) {
                                                valuesPhase[index] = 1;
                                            } else {
                                                valuesPhase[index] = 2;
                                                this._accum = value;
                                            }
                                        }
                                        if (!gotAccum) return;

                                        var callback = this._callback;
                                        var receiver = this._promise._boundValue();
                                        var ret;

                                        for (var i = this._reducingIndex; i < length; ++i) {
                                            valuesPhaseIndex = valuesPhase[i];
                                            if (valuesPhaseIndex === 2) {
                                                this._reducingIndex = i + 1;
                                                continue;
                                            }
                                            if (valuesPhaseIndex !== 1) return;
                                            value = values[i];
                                            this._promise._pushContext();
                                            if (isEach) {
                                                preservedValues.push(value);
                                                ret = tryCatch(callback).call(receiver, value, i, length);
                                            }
                                            else {
                                                ret = tryCatch(callback)
                                                    .call(receiver, this._accum, value, i, length);
                                            }
                                            this._promise._popContext();

                                            if (ret === errorObj) return this._reject(ret.e);

                                            var maybePromise = tryConvertToPromise(ret, this._promise);
                                            if (maybePromise instanceof Promise) {
                                                maybePromise = maybePromise._target();
                                                if (maybePromise._isPending()) {
                                                    valuesPhase[i] = 4;
                                                    return maybePromise._proxyPromiseArray(this, i);
                                                } else if (maybePromise._isFulfilled()) {
                                                    ret = maybePromise._value();
                                                } else {
                                                    return this._reject(maybePromise._reason());
                                                }
                                            }

                                            this._reducingIndex = i + 1;
                                            this._accum = ret;
                                        }

                                        this._resolve(isEach ? preservedValues : this._accum);
                                    };

                                    function reduce(promises, fn, initialValue, _each) {
                                        if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");
                                        var array = new ReductionPromiseArray(promises, fn, initialValue, _each);
                                        return array.promise();
                                    }

                                    Promise.prototype.reduce = function (fn, initialValue) {
                                        return reduce(this, fn, initialValue, null);
                                    };

                                    Promise.reduce = function (promises, fn, initialValue, _each) {
                                        return reduce(promises, fn, initialValue, _each);
                                    };
                                };

                            }, { "./async.js": 2, "./util.js": 38 }], 31: [function (_dereq_, module, exports) {
                                "use strict";
                                var schedule;
                                var util = _dereq_("./util");
                                var noAsyncScheduler = function () {
                                    throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/m3OTXk\u000a");
                                };
                                if (util.isNode && typeof MutationObserver === "undefined") {
                                    var GlobalSetImmediate = __webpack_require__.g.setImmediate;
                                    var ProcessNextTick = process.nextTick;
                                    schedule = util.isRecentNode
                                        ? function (fn) { GlobalSetImmediate.call(__webpack_require__.g, fn); }
                                        : function (fn) { ProcessNextTick.call(process, fn); };
                                } else if ((typeof MutationObserver !== "undefined") &&
                                    !(typeof window !== "undefined" &&
                                        window.navigator &&
                                        window.navigator.standalone)) {
                                    schedule = function (fn) {
                                        var div = document.createElement("div");
                                        var observer = new MutationObserver(fn);
                                        observer.observe(div, { attributes: true });
                                        return function () { div.classList.toggle("foo"); };
                                    };
                                    schedule.isStatic = true;
                                } else if (typeof setImmediate !== "undefined") {
                                    schedule = function (fn) {
                                        setImmediate(fn);
                                    };
                                } else if (typeof setTimeout !== "undefined") {
                                    schedule = function (fn) {
                                        setTimeout(fn, 0);
                                    };
                                } else {
                                    schedule = noAsyncScheduler;
                                }
                                module.exports = schedule;

                            }, { "./util": 38 }], 32: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports =
                                    function (Promise, PromiseArray) {
                                        var PromiseInspection = Promise.PromiseInspection;
                                        var util = _dereq_("./util.js");

                                        function SettledPromiseArray(values) {
                                            this.constructor$(values);
                                        }
                                        util.inherits(SettledPromiseArray, PromiseArray);

                                        SettledPromiseArray.prototype._promiseResolved = function (index, inspection) {
                                            this._values[index] = inspection;
                                            var totalResolved = ++this._totalResolved;
                                            if (totalResolved >= this._length) {
                                                this._resolve(this._values);
                                            }
                                        };

                                        SettledPromiseArray.prototype._promiseFulfilled = function (value, index) {
                                            var ret = new PromiseInspection();
                                            ret._bitField = 268435456;
                                            ret._settledValue = value;
                                            this._promiseResolved(index, ret);
                                        };
                                        SettledPromiseArray.prototype._promiseRejected = function (reason, index) {
                                            var ret = new PromiseInspection();
                                            ret._bitField = 134217728;
                                            ret._settledValue = reason;
                                            this._promiseResolved(index, ret);
                                        };

                                        Promise.settle = function (promises) {
                                            return new SettledPromiseArray(promises).promise();
                                        };

                                        Promise.prototype.settle = function () {
                                            return new SettledPromiseArray(this).promise();
                                        };
                                    };

                            }, { "./util.js": 38 }], 33: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports =
                                    function (Promise, PromiseArray, apiRejection) {
                                        var util = _dereq_("./util.js");
                                        var RangeError = _dereq_("./errors.js").RangeError;
                                        var AggregateError = _dereq_("./errors.js").AggregateError;
                                        var isArray = util.isArray;


                                        function SomePromiseArray(values) {
                                            this.constructor$(values);
                                            this._howMany = 0;
                                            this._unwrap = false;
                                            this._initialized = false;
                                        }
                                        util.inherits(SomePromiseArray, PromiseArray);

                                        SomePromiseArray.prototype._init = function () {
                                            if (!this._initialized) {
                                                return;
                                            }
                                            if (this._howMany === 0) {
                                                this._resolve([]);
                                                return;
                                            }
                                            this._init$(undefined, -5);
                                            var isArrayResolved = isArray(this._values);
                                            if (!this._isResolved() &&
                                                isArrayResolved &&
                                                this._howMany > this._canPossiblyFulfill()) {
                                                this._reject(this._getRangeError(this.length()));
                                            }
                                        };

                                        SomePromiseArray.prototype.init = function () {
                                            this._initialized = true;
                                            this._init();
                                        };

                                        SomePromiseArray.prototype.setUnwrap = function () {
                                            this._unwrap = true;
                                        };

                                        SomePromiseArray.prototype.howMany = function () {
                                            return this._howMany;
                                        };

                                        SomePromiseArray.prototype.setHowMany = function (count) {
                                            this._howMany = count;
                                        };

                                        SomePromiseArray.prototype._promiseFulfilled = function (value) {
                                            this._addFulfilled(value);
                                            if (this._fulfilled() === this.howMany()) {
                                                this._values.length = this.howMany();
                                                if (this.howMany() === 1 && this._unwrap) {
                                                    this._resolve(this._values[0]);
                                                } else {
                                                    this._resolve(this._values);
                                                }
                                            }

                                        };
                                        SomePromiseArray.prototype._promiseRejected = function (reason) {
                                            this._addRejected(reason);
                                            if (this.howMany() > this._canPossiblyFulfill()) {
                                                var e = new AggregateError();
                                                for (var i = this.length(); i < this._values.length; ++i) {
                                                    e.push(this._values[i]);
                                                }
                                                this._reject(e);
                                            }
                                        };

                                        SomePromiseArray.prototype._fulfilled = function () {
                                            return this._totalResolved;
                                        };

                                        SomePromiseArray.prototype._rejected = function () {
                                            return this._values.length - this.length();
                                        };

                                        SomePromiseArray.prototype._addRejected = function (reason) {
                                            this._values.push(reason);
                                        };

                                        SomePromiseArray.prototype._addFulfilled = function (value) {
                                            this._values[this._totalResolved++] = value;
                                        };

                                        SomePromiseArray.prototype._canPossiblyFulfill = function () {
                                            return this.length() - this._rejected();
                                        };

                                        SomePromiseArray.prototype._getRangeError = function (count) {
                                            var message = "Input array must contain at least " +
                                                this._howMany + " items but contains only " + count + " items";
                                            return new RangeError(message);
                                        };

                                        SomePromiseArray.prototype._resolveEmptyArray = function () {
                                            this._reject(this._getRangeError(0));
                                        };

                                        function some(promises, howMany) {
                                            if ((howMany | 0) !== howMany || howMany < 0) {
                                                return apiRejection("expecting a positive integer\u000a\u000a    See http://goo.gl/1wAmHx\u000a");
                                            }
                                            var ret = new SomePromiseArray(promises);
                                            var promise = ret.promise();
                                            ret.setHowMany(howMany);
                                            ret.init();
                                            return promise;
                                        }

                                        Promise.some = function (promises, howMany) {
                                            return some(promises, howMany);
                                        };

                                        Promise.prototype.some = function (howMany) {
                                            return some(this, howMany);
                                        };

                                        Promise._SomePromiseArray = SomePromiseArray;
                                    };

                            }, { "./errors.js": 13, "./util.js": 38 }], 34: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise) {
                                    function PromiseInspection(promise) {
                                        if (promise !== undefined) {
                                            promise = promise._target();
                                            this._bitField = promise._bitField;
                                            this._settledValue = promise._settledValue;
                                        }
                                        else {
                                            this._bitField = 0;
                                            this._settledValue = undefined;
                                        }
                                    }

                                    PromiseInspection.prototype.value = function () {
                                        if (!this.isFulfilled()) {
                                            throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/hc1DLj\u000a");
                                        }
                                        return this._settledValue;
                                    };

                                    PromiseInspection.prototype.error =
                                        PromiseInspection.prototype.reason = function () {
                                            if (!this.isRejected()) {
                                                throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/hPuiwB\u000a");
                                            }
                                            return this._settledValue;
                                        };

                                    PromiseInspection.prototype.isFulfilled =
                                        Promise.prototype._isFulfilled = function () {
                                            return (this._bitField & 268435456) > 0;
                                        };

                                    PromiseInspection.prototype.isRejected =
                                        Promise.prototype._isRejected = function () {
                                            return (this._bitField & 134217728) > 0;
                                        };

                                    PromiseInspection.prototype.isPending =
                                        Promise.prototype._isPending = function () {
                                            return (this._bitField & 402653184) === 0;
                                        };

                                    PromiseInspection.prototype.isResolved =
                                        Promise.prototype._isResolved = function () {
                                            return (this._bitField & 402653184) > 0;
                                        };

                                    Promise.prototype.isPending = function () {
                                        return this._target()._isPending();
                                    };

                                    Promise.prototype.isRejected = function () {
                                        return this._target()._isRejected();
                                    };

                                    Promise.prototype.isFulfilled = function () {
                                        return this._target()._isFulfilled();
                                    };

                                    Promise.prototype.isResolved = function () {
                                        return this._target()._isResolved();
                                    };

                                    Promise.prototype._value = function () {
                                        return this._settledValue;
                                    };

                                    Promise.prototype._reason = function () {
                                        this._unsetRejectionIsUnhandled();
                                        return this._settledValue;
                                    };

                                    Promise.prototype.value = function () {
                                        var target = this._target();
                                        if (!target.isFulfilled()) {
                                            throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\u000a\u000a    See http://goo.gl/hc1DLj\u000a");
                                        }
                                        return target._settledValue;
                                    };

                                    Promise.prototype.reason = function () {
                                        var target = this._target();
                                        if (!target.isRejected()) {
                                            throw new TypeError("cannot get rejection reason of a non-rejected promise\u000a\u000a    See http://goo.gl/hPuiwB\u000a");
                                        }
                                        target._unsetRejectionIsUnhandled();
                                        return target._settledValue;
                                    };


                                    Promise.PromiseInspection = PromiseInspection;
                                };

                            }, {}], 35: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, INTERNAL) {
                                    var util = _dereq_("./util.js");
                                    var errorObj = util.errorObj;
                                    var isObject = util.isObject;

                                    function tryConvertToPromise(obj, context) {
                                        if (isObject(obj)) {
                                            if (obj instanceof Promise) {
                                                return obj;
                                            }
                                            else if (isAnyBluebirdPromise(obj)) {
                                                var ret = new Promise(INTERNAL);
                                                obj._then(
                                                    ret._fulfillUnchecked,
                                                    ret._rejectUncheckedCheckError,
                                                    ret._progressUnchecked,
                                                    ret,
                                                    null
                                                );
                                                return ret;
                                            }
                                            var then = util.tryCatch(getThen)(obj);
                                            if (then === errorObj) {
                                                if (context) context._pushContext();
                                                var ret = Promise.reject(then.e);
                                                if (context) context._popContext();
                                                return ret;
                                            } else if (typeof then === "function") {
                                                return doThenable(obj, then, context);
                                            }
                                        }
                                        return obj;
                                    }

                                    function getThen(obj) {
                                        return obj.then;
                                    }

                                    var hasProp = {}.hasOwnProperty;
                                    function isAnyBluebirdPromise(obj) {
                                        return hasProp.call(obj, "_promise0");
                                    }

                                    function doThenable(x, then, context) {
                                        var promise = new Promise(INTERNAL);
                                        var ret = promise;
                                        if (context) context._pushContext();
                                        promise._captureStackTrace();
                                        if (context) context._popContext();
                                        var synchronous = true;
                                        var result = util.tryCatch(then).call(x,
                                            resolveFromThenable,
                                            rejectFromThenable,
                                            progressFromThenable);
                                        synchronous = false;
                                        if (promise && result === errorObj) {
                                            promise._rejectCallback(result.e, true, true);
                                            promise = null;
                                        }

                                        function resolveFromThenable(value) {
                                            if (!promise) return;
                                            promise._resolveCallback(value);
                                            promise = null;
                                        }

                                        function rejectFromThenable(reason) {
                                            if (!promise) return;
                                            promise._rejectCallback(reason, synchronous, true);
                                            promise = null;
                                        }

                                        function progressFromThenable(value) {
                                            if (!promise) return;
                                            if (typeof promise._progress === "function") {
                                                promise._progress(value);
                                            }
                                        }
                                        return ret;
                                    }

                                    return tryConvertToPromise;
                                };

                            }, { "./util.js": 38 }], 36: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, INTERNAL) {
                                    var util = _dereq_("./util.js");
                                    var TimeoutError = Promise.TimeoutError;

                                    var afterTimeout = function (promise, message) {
                                        if (!promise.isPending()) return;

                                        var err;
                                        if (!util.isPrimitive(message) && (message instanceof Error)) {
                                            err = message;
                                        } else {
                                            if (typeof message !== "string") {
                                                message = "operation timed out";
                                            }
                                            err = new TimeoutError(message);
                                        }
                                        util.markAsOriginatingFromRejection(err);
                                        promise._attachExtraTrace(err);
                                        promise._cancel(err);
                                    };

                                    var afterValue = function (value) { return delay(+this).thenReturn(value); };
                                    var delay = Promise.delay = function (value, ms) {
                                        if (ms === undefined) {
                                            ms = value;
                                            value = undefined;
                                            var ret = new Promise(INTERNAL);
                                            setTimeout(function () { ret._fulfill(); }, ms);
                                            return ret;
                                        }
                                        ms = +ms;
                                        return Promise.resolve(value)._then(afterValue, null, null, ms, undefined);
                                    };

                                    Promise.prototype.delay = function (ms) {
                                        return delay(this, ms);
                                    };

                                    function successClear(value) {
                                        var handle = this;
                                        if (handle instanceof Number) handle = +handle;
                                        clearTimeout(handle);
                                        return value;
                                    }

                                    function failureClear(reason) {
                                        var handle = this;
                                        if (handle instanceof Number) handle = +handle;
                                        clearTimeout(handle);
                                        throw reason;
                                    }

                                    Promise.prototype.timeout = function (ms, message) {
                                        ms = +ms;
                                        var ret = this.then().cancellable();
                                        ret._cancellationParent = this;
                                        var handle = setTimeout(function timeoutTimeout() {
                                            afterTimeout(ret, message);
                                        }, ms);
                                        return ret._then(successClear, failureClear, undefined, handle, undefined);
                                    };

                                };

                            }, { "./util.js": 38 }], 37: [function (_dereq_, module, exports) {
                                "use strict";
                                module.exports = function (Promise, apiRejection, tryConvertToPromise,
                                    createContext) {
                                    var TypeError = _dereq_("./errors.js").TypeError;
                                    var inherits = _dereq_("./util.js").inherits;
                                    var PromiseInspection = Promise.PromiseInspection;

                                    function inspectionMapper(inspections) {
                                        var len = inspections.length;
                                        for (var i = 0; i < len; ++i) {
                                            var inspection = inspections[i];
                                            if (inspection.isRejected()) {
                                                return Promise.reject(inspection.error());
                                            }
                                            inspections[i] = inspection._settledValue;
                                        }
                                        return inspections;
                                    }

                                    function thrower(e) {
                                        setTimeout(function () { throw e; }, 0);
                                    }

                                    function castPreservingDisposable(thenable) {
                                        var maybePromise = tryConvertToPromise(thenable);
                                        if (maybePromise !== thenable &&
                                            typeof thenable._isDisposable === "function" &&
                                            typeof thenable._getDisposer === "function" &&
                                            thenable._isDisposable()) {
                                            maybePromise._setDisposable(thenable._getDisposer());
                                        }
                                        return maybePromise;
                                    }
                                    function dispose(resources, inspection) {
                                        var i = 0;
                                        var len = resources.length;
                                        var ret = Promise.defer();
                                        function iterator() {
                                            if (i >= len) return ret.resolve();
                                            var maybePromise = castPreservingDisposable(resources[i++]);
                                            if (maybePromise instanceof Promise &&
                                                maybePromise._isDisposable()) {
                                                try {
                                                    maybePromise = tryConvertToPromise(
                                                        maybePromise._getDisposer().tryDispose(inspection),
                                                        resources.promise);
                                                } catch (e) {
                                                    return thrower(e);
                                                }
                                                if (maybePromise instanceof Promise) {
                                                    return maybePromise._then(iterator, thrower,
                                                        null, null, null);
                                                }
                                            }
                                            iterator();
                                        }
                                        iterator();
                                        return ret.promise;
                                    }

                                    function disposerSuccess(value) {
                                        var inspection = new PromiseInspection();
                                        inspection._settledValue = value;
                                        inspection._bitField = 268435456;
                                        return dispose(this, inspection).thenReturn(value);
                                    }

                                    function disposerFail(reason) {
                                        var inspection = new PromiseInspection();
                                        inspection._settledValue = reason;
                                        inspection._bitField = 134217728;
                                        return dispose(this, inspection).thenThrow(reason);
                                    }

                                    function Disposer(data, promise, context) {
                                        this._data = data;
                                        this._promise = promise;
                                        this._context = context;
                                    }

                                    Disposer.prototype.data = function () {
                                        return this._data;
                                    };

                                    Disposer.prototype.promise = function () {
                                        return this._promise;
                                    };

                                    Disposer.prototype.resource = function () {
                                        if (this.promise().isFulfilled()) {
                                            return this.promise().value();
                                        }
                                        return null;
                                    };

                                    Disposer.prototype.tryDispose = function (inspection) {
                                        var resource = this.resource();
                                        var context = this._context;
                                        if (context !== undefined) context._pushContext();
                                        var ret = resource !== null
                                            ? this.doDispose(resource, inspection) : null;
                                        if (context !== undefined) context._popContext();
                                        this._promise._unsetDisposable();
                                        this._data = null;
                                        return ret;
                                    };

                                    Disposer.isDisposer = function (d) {
                                        return (d != null &&
                                            typeof d.resource === "function" &&
                                            typeof d.tryDispose === "function");
                                    };

                                    function FunctionDisposer(fn, promise, context) {
                                        this.constructor$(fn, promise, context);
                                    }
                                    inherits(FunctionDisposer, Disposer);

                                    FunctionDisposer.prototype.doDispose = function (resource, inspection) {
                                        var fn = this.data();
                                        return fn.call(resource, resource, inspection);
                                    };

                                    function maybeUnwrapDisposer(value) {
                                        if (Disposer.isDisposer(value)) {
                                            this.resources[this.index]._setDisposable(value);
                                            return value.promise();
                                        }
                                        return value;
                                    }

                                    Promise.using = function () {
                                        var len = arguments.length;
                                        if (len < 2) return apiRejection(
                                            "you must pass at least 2 arguments to Promise.using");
                                        var fn = arguments[len - 1];
                                        if (typeof fn !== "function") return apiRejection("fn must be a function\u000a\u000a    See http://goo.gl/916lJJ\u000a");

                                        var input;
                                        var spreadArgs = true;
                                        if (len === 2 && Array.isArray(arguments[0])) {
                                            input = arguments[0];
                                            len = input.length;
                                            spreadArgs = false;
                                        } else {
                                            input = arguments;
                                            len--;
                                        }
                                        var resources = new Array(len);
                                        for (var i = 0; i < len; ++i) {
                                            var resource = input[i];
                                            if (Disposer.isDisposer(resource)) {
                                                var disposer = resource;
                                                resource = resource.promise();
                                                resource._setDisposable(disposer);
                                            } else {
                                                var maybePromise = tryConvertToPromise(resource);
                                                if (maybePromise instanceof Promise) {
                                                    resource =
                                                        maybePromise._then(maybeUnwrapDisposer, null, null, {
                                                            resources: resources,
                                                            index: i
                                                        }, undefined);
                                                }
                                            }
                                            resources[i] = resource;
                                        }

                                        var promise = Promise.settle(resources)
                                            .then(inspectionMapper)
                                            .then(function (vals) {
                                                promise._pushContext();
                                                var ret;
                                                try {
                                                    ret = spreadArgs
                                                        ? fn.apply(undefined, vals) : fn.call(undefined, vals);
                                                } finally {
                                                    promise._popContext();
                                                }
                                                return ret;
                                            })
                                            ._then(
                                                disposerSuccess, disposerFail, undefined, resources, undefined);
                                        resources.promise = promise;
                                        return promise;
                                    };

                                    Promise.prototype._setDisposable = function (disposer) {
                                        this._bitField = this._bitField | 262144;
                                        this._disposer = disposer;
                                    };

                                    Promise.prototype._isDisposable = function () {
                                        return (this._bitField & 262144) > 0;
                                    };

                                    Promise.prototype._getDisposer = function () {
                                        return this._disposer;
                                    };

                                    Promise.prototype._unsetDisposable = function () {
                                        this._bitField = this._bitField & (~262144);
                                        this._disposer = undefined;
                                    };

                                    Promise.prototype.disposer = function (fn) {
                                        if (typeof fn === "function") {
                                            return new FunctionDisposer(fn, this, createContext());
                                        }
                                        throw new TypeError();
                                    };

                                };

                            }, { "./errors.js": 13, "./util.js": 38 }], 38: [function (_dereq_, module, exports) {
                                "use strict";
                                var es5 = _dereq_("./es5.js");
                                var canEvaluate = typeof navigator == "undefined";
                                var haveGetters = (function () {
                                    try {
                                        var o = {};
                                        es5.defineProperty(o, "f", {
                                            get: function () {
                                                return 3;
                                            }
                                        });
                                        return o.f === 3;
                                    }
                                    catch (e) {
                                        return false;
                                    }

                                })();

                                var errorObj = { e: {} };
                                var tryCatchTarget;
                                function tryCatcher() {
                                    try {
                                        var target = tryCatchTarget;
                                        tryCatchTarget = null;
                                        return target.apply(this, arguments);
                                    } catch (e) {
                                        errorObj.e = e;
                                        return errorObj;
                                    }
                                }
                                function tryCatch(fn) {
                                    tryCatchTarget = fn;
                                    return tryCatcher;
                                }

                                var inherits = function (Child, Parent) {
                                    var hasProp = {}.hasOwnProperty;

                                    function T() {
                                        this.constructor = Child;
                                        this.constructor$ = Parent;
                                        for (var propertyName in Parent.prototype) {
                                            if (hasProp.call(Parent.prototype, propertyName) &&
                                                propertyName.charAt(propertyName.length - 1) !== "$"
                                            ) {
                                                this[propertyName + "$"] = Parent.prototype[propertyName];
                                            }
                                        }
                                    }
                                    T.prototype = Parent.prototype;
                                    Child.prototype = new T();
                                    return Child.prototype;
                                };


                                function isPrimitive(val) {
                                    return val == null || val === true || val === false ||
                                        typeof val === "string" || typeof val === "number";

                                }

                                function isObject(value) {
                                    return !isPrimitive(value);
                                }

                                function maybeWrapAsError(maybeError) {
                                    if (!isPrimitive(maybeError)) return maybeError;

                                    return new Error(safeToString(maybeError));
                                }

                                function withAppended(target, appendee) {
                                    var len = target.length;
                                    var ret = new Array(len + 1);
                                    var i;
                                    for (i = 0; i < len; ++i) {
                                        ret[i] = target[i];
                                    }
                                    ret[i] = appendee;
                                    return ret;
                                }

                                function getDataPropertyOrDefault(obj, key, defaultValue) {
                                    if (es5.isES5) {
                                        var desc = Object.getOwnPropertyDescriptor(obj, key);

                                        if (desc != null) {
                                            return desc.get == null && desc.set == null
                                                ? desc.value
                                                : defaultValue;
                                        }
                                    } else {
                                        return {}.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
                                    }
                                }

                                function notEnumerableProp(obj, name, value) {
                                    if (isPrimitive(obj)) return obj;
                                    var descriptor = {
                                        value: value,
                                        configurable: true,
                                        enumerable: false,
                                        writable: true
                                    };
                                    es5.defineProperty(obj, name, descriptor);
                                    return obj;
                                }

                                function thrower(r) {
                                    throw r;
                                }

                                var inheritedDataKeys = (function () {
                                    var excludedPrototypes = [
                                        Array.prototype,
                                        Object.prototype,
                                        Function.prototype
                                    ];

                                    var isExcludedProto = function (val) {
                                        for (var i = 0; i < excludedPrototypes.length; ++i) {
                                            if (excludedPrototypes[i] === val) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    };

                                    if (es5.isES5) {
                                        var getKeys = Object.getOwnPropertyNames;
                                        return function (obj) {
                                            var ret = [];
                                            var visitedKeys = Object.create(null);
                                            while (obj != null && !isExcludedProto(obj)) {
                                                var keys;
                                                try {
                                                    keys = getKeys(obj);
                                                } catch (e) {
                                                    return ret;
                                                }
                                                for (var i = 0; i < keys.length; ++i) {
                                                    var key = keys[i];
                                                    if (visitedKeys[key]) continue;
                                                    visitedKeys[key] = true;
                                                    var desc = Object.getOwnPropertyDescriptor(obj, key);
                                                    if (desc != null && desc.get == null && desc.set == null) {
                                                        ret.push(key);
                                                    }
                                                }
                                                obj = es5.getPrototypeOf(obj);
                                            }
                                            return ret;
                                        };
                                    } else {
                                        var hasProp = {}.hasOwnProperty;
                                        return function (obj) {
                                            if (isExcludedProto(obj)) return [];
                                            var ret = [];

                                            /*jshint forin:false */
                                            enumeration: for (var key in obj) {
                                                if (hasProp.call(obj, key)) {
                                                    ret.push(key);
                                                } else {
                                                    for (var i = 0; i < excludedPrototypes.length; ++i) {
                                                        if (hasProp.call(excludedPrototypes[i], key)) {
                                                            continue enumeration;
                                                        }
                                                    }
                                                    ret.push(key);
                                                }
                                            }
                                            return ret;
                                        };
                                    }

                                })();

                                var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
                                function isClass(fn) {
                                    try {
                                        if (typeof fn === "function") {
                                            var keys = es5.names(fn.prototype);

                                            var hasMethods = es5.isES5 && keys.length > 1;
                                            var hasMethodsOtherThanConstructor = keys.length > 0 &&
                                                !(keys.length === 1 && keys[0] === "constructor");
                                            var hasThisAssignmentAndStaticMethods =
                                                thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

                                            if (hasMethods || hasMethodsOtherThanConstructor ||
                                                hasThisAssignmentAndStaticMethods) {
                                                return true;
                                            }
                                        }
                                        return false;
                                    } catch (e) {
                                        return false;
                                    }
                                }

                                function toFastProperties(obj) {
                                    /*jshint -W027,-W055,-W031*/
                                    function f() { }
                                    f.prototype = obj;
                                    var l = 8;
                                    while (l--) new f();
                                    return obj;
                                    eval(obj);
                                }

                                var rident = /^[a-z$_][a-z$_0-9]*$/i;
                                function isIdentifier(str) {
                                    return rident.test(str);
                                }

                                function filledRange(count, prefix, suffix) {
                                    var ret = new Array(count);
                                    for (var i = 0; i < count; ++i) {
                                        ret[i] = prefix + i + suffix;
                                    }
                                    return ret;
                                }

                                function safeToString(obj) {
                                    try {
                                        return obj + "";
                                    } catch (e) {
                                        return "[no string representation]";
                                    }
                                }

                                function markAsOriginatingFromRejection(e) {
                                    try {
                                        notEnumerableProp(e, "isOperational", true);
                                    }
                                    catch (ignore) { }
                                }

                                function originatesFromRejection(e) {
                                    if (e == null) return false;
                                    return ((e instanceof Error["__BluebirdErrorTypes__"].OperationalError) ||
                                        e["isOperational"] === true);
                                }

                                function canAttachTrace(obj) {
                                    return obj instanceof Error && es5.propertyIsWritable(obj, "stack");
                                }

                                var ensureErrorObject = (function () {
                                    if (!("stack" in new Error())) {
                                        return function (value) {
                                            if (canAttachTrace(value)) return value;
                                            try { throw new Error(safeToString(value)); }
                                            catch (err) { return err; }
                                        };
                                    } else {
                                        return function (value) {
                                            if (canAttachTrace(value)) return value;
                                            return new Error(safeToString(value));
                                        };
                                    }
                                })();

                                function classString(obj) {
                                    return {}.toString.call(obj);
                                }

                                function copyDescriptors(from, to, filter) {
                                    var keys = es5.names(from);
                                    for (var i = 0; i < keys.length; ++i) {
                                        var key = keys[i];
                                        if (filter(key)) {
                                            try {
                                                es5.defineProperty(to, key, es5.getDescriptor(from, key));
                                            } catch (ignore) { }
                                        }
                                    }
                                }

                                var ret = {
                                    isClass: isClass,
                                    isIdentifier: isIdentifier,
                                    inheritedDataKeys: inheritedDataKeys,
                                    getDataPropertyOrDefault: getDataPropertyOrDefault,
                                    thrower: thrower,
                                    isArray: es5.isArray,
                                    haveGetters: haveGetters,
                                    notEnumerableProp: notEnumerableProp,
                                    isPrimitive: isPrimitive,
                                    isObject: isObject,
                                    canEvaluate: canEvaluate,
                                    errorObj: errorObj,
                                    tryCatch: tryCatch,
                                    inherits: inherits,
                                    withAppended: withAppended,
                                    maybeWrapAsError: maybeWrapAsError,
                                    toFastProperties: toFastProperties,
                                    filledRange: filledRange,
                                    toString: safeToString,
                                    canAttachTrace: canAttachTrace,
                                    ensureErrorObject: ensureErrorObject,
                                    originatesFromRejection: originatesFromRejection,
                                    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
                                    classString: classString,
                                    copyDescriptors: copyDescriptors,
                                    hasDevTools: typeof chrome !== "undefined" && chrome &&
                                        typeof chrome.loadTimes === "function",
                                    isNode: typeof process !== "undefined" &&
                                        classString(process).toLowerCase() === "[object process]"
                                };
                                ret.isRecentNode = ret.isNode && (function () {
                                    var version = process.versions.node.split(".").map(Number);
                                    return (version[0] === 0 && version[1] > 10) || (version[0] > 0);
                                })();

                                if (ret.isNode) ret.toFastProperties(process);

                                try { throw new Error(); } catch (e) { ret.lastLineError = e; }
                                module.exports = ret;

                            }, { "./es5.js": 14 }]
                        }, {}, [4])(4)
                    });; if (typeof window !== 'undefined' && window !== null) { window.P = window.Promise; } else if (typeof self !== 'undefined' && self !== null) { self.P = self.Promise; }

                    /***/
}),

/***/ 625:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

                    var v8StyleErrors = __webpack_require__(189)()
                    var reformat = __webpack_require__(125)

                    function ErrorMaker(name, ParentError) {
                        function NewError(message) {
                            if (!(this instanceof NewError))
                                return new NewError(message)

                            // Use a try/catch block to capture the stack trace. Capturing the stack trace here is
                            // necessary, otherwise we will get the stack trace at the time the new error class was created,
                            // rather than when it is instantiated.  We add `message` and `name` so that the stack trace
                            // string will match our current error class.
                            try {
                                throw new Error(message)
                            }
                            catch (err) {
                                err.name = name
                                this.stack = err.stack
                            }

                            // if we have v8-styled stack messages, then reformat
                            if (v8StyleErrors) {
                                if (this.stack) this.stack = reformat(this.stack, name, message)
                            }

                            this.message = message || ''
                            this.name = name
                        }

                        NewError.prototype = new (ParentError || Error)()
                        NewError.prototype.constructor = NewError
                        NewError.prototype.inspect = function () {
                            return this.message
                                ? '[' + name + ': ' + this.message + ']'
                                : '[' + name + ']'
                        }
                        NewError.prototype.name = name

                        return NewError
                    }

                    module.exports = ErrorMaker


                    /***/
}),

/***/ 125:
/***/ ((module) => {

                    "use strict";


                    /**
                     * Refomat the stack message to show the proper name rather than just 'Error'. This is
                     * necessary because the internal class property of Error is what determines the beginning of
                     * the stack message, and it is not accessible in JavaScript.
                     */
                    module.exports = function reformatV8Error(stack, name, msg) {
                        var errorMessage = name
                        if (msg) errorMessage += ': ' + msg
                        stack = errorMessage + stack.slice(stack.indexOf('\n'))
                        return stack
                    }


                    /***/
}),

/***/ 189:
/***/ ((module) => {

                    "use strict";


                    // returns true if the Error object returns a stack string
                    // with the signature of 'ErrorType: message'
                    module.exports = function v8StyleStackMessage() {
                        var e = new Error('yep')
                        if (!e.stack) return false
                        if (e.stack.substr(0, 11) === 'Error: yep\n') return true
                        return false
                    }


                    /***/
}),

/***/ 779:
/***/ ((module) => {

                    "use strict";
                    /**
                     * Copyright (c) 2013 Petka Antonov
                     * 
                     * Permission is hereby granted, free of charge, to any person obtaining a copy
                     * of this software and associated documentation files (the "Software"), to deal
                     * in the Software without restriction, including without limitation the rights
                     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                     * copies of the Software, and to permit persons to whom the Software is
                     * furnished to do so, subject to the following conditions:</p>
                     * 
                     * The above copyright notice and this permission notice shall be included in
                     * all copies or substantial portions of the Software.
                     * 
                     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
                     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                     * THE SOFTWARE.
                     */

                    function Deque(capacity) {
                        this._capacity = getCapacity(capacity);
                        this._length = 0;
                        this._front = 0;
                        if (isArray(capacity)) {
                            var len = capacity.length;
                            for (var i = 0; i < len; ++i) {
                                this[i] = capacity[i];
                            }
                            this._length = len;
                        }
                    }

                    Deque.prototype.toArray = function Deque$toArray() {
                        var len = this._length;
                        var ret = new Array(len);
                        var front = this._front;
                        var capacity = this._capacity;
                        for (var j = 0; j < len; ++j) {
                            ret[j] = this[(front + j) & (capacity - 1)];
                        }
                        return ret;
                    };

                    Deque.prototype.push = function Deque$push(item) {
                        var argsLength = arguments.length;
                        var length = this._length;
                        if (argsLength > 1) {
                            var capacity = this._capacity;
                            if (length + argsLength > capacity) {
                                for (var i = 0; i < argsLength; ++i) {
                                    this._checkCapacity(length + 1);
                                    var j = (this._front + length) & (this._capacity - 1);
                                    this[j] = arguments[i];
                                    length++;
                                    this._length = length;
                                }
                                return length;
                            }
                            else {
                                var j = this._front;
                                for (var i = 0; i < argsLength; ++i) {
                                    this[(j + length) & (capacity - 1)] = arguments[i];
                                    j++;
                                }
                                this._length = length + argsLength;
                                return length + argsLength;
                            }

                        }

                        if (argsLength === 0) return length;

                        this._checkCapacity(length + 1);
                        var i = (this._front + length) & (this._capacity - 1);
                        this[i] = item;
                        this._length = length + 1;
                        return length + 1;
                    };

                    Deque.prototype.pop = function Deque$pop() {
                        var length = this._length;
                        if (length === 0) {
                            return void 0;
                        }
                        var i = (this._front + length - 1) & (this._capacity - 1);
                        var ret = this[i];
                        this[i] = void 0;
                        this._length = length - 1;
                        return ret;
                    };

                    Deque.prototype.shift = function Deque$shift() {
                        var length = this._length;
                        if (length === 0) {
                            return void 0;
                        }
                        var front = this._front;
                        var ret = this[front];
                        this[front] = void 0;
                        this._front = (front + 1) & (this._capacity - 1);
                        this._length = length - 1;
                        return ret;
                    };

                    Deque.prototype.unshift = function Deque$unshift(item) {
                        var length = this._length;
                        var argsLength = arguments.length;


                        if (argsLength > 1) {
                            var capacity = this._capacity;
                            if (length + argsLength > capacity) {
                                for (var i = argsLength - 1; i >= 0; i--) {
                                    this._checkCapacity(length + 1);
                                    var capacity = this._capacity;
                                    var j = ((((this._front - 1) &
                                        (capacity - 1)) ^ capacity) - capacity);
                                    this[j] = arguments[i];
                                    length++;
                                    this._length = length;
                                    this._front = j;
                                }
                                return length;
                            }
                            else {
                                var front = this._front;
                                for (var i = argsLength - 1; i >= 0; i--) {
                                    var j = ((((front - 1) &
                                        (capacity - 1)) ^ capacity) - capacity);
                                    this[j] = arguments[i];
                                    front = j;
                                }
                                this._front = front;
                                this._length = length + argsLength;
                                return length + argsLength;
                            }
                        }

                        if (argsLength === 0) return length;

                        this._checkCapacity(length + 1);
                        var capacity = this._capacity;
                        var i = ((((this._front - 1) &
                            (capacity - 1)) ^ capacity) - capacity);
                        this[i] = item;
                        this._length = length + 1;
                        this._front = i;
                        return length + 1;
                    };

                    Deque.prototype.peekBack = function Deque$peekBack() {
                        var length = this._length;
                        if (length === 0) {
                            return void 0;
                        }
                        var index = (this._front + length - 1) & (this._capacity - 1);
                        return this[index];
                    };

                    Deque.prototype.peekFront = function Deque$peekFront() {
                        if (this._length === 0) {
                            return void 0;
                        }
                        return this[this._front];
                    };

                    Deque.prototype.get = function Deque$get(index) {
                        var i = index;
                        if ((i !== (i | 0))) {
                            return void 0;
                        }
                        var len = this._length;
                        if (i < 0) {
                            i = i + len;
                        }
                        if (i < 0 || i >= len) {
                            return void 0;
                        }
                        return this[(this._front + i) & (this._capacity - 1)];
                    };

                    Deque.prototype.isEmpty = function Deque$isEmpty() {
                        return this._length === 0;
                    };

                    Deque.prototype.clear = function Deque$clear() {
                        var len = this._length;
                        var front = this._front;
                        var capacity = this._capacity;
                        for (var j = 0; j < len; ++j) {
                            this[(front + j) & (capacity - 1)] = void 0;
                        }
                        this._length = 0;
                        this._front = 0;
                    };

                    Deque.prototype.toString = function Deque$toString() {
                        return this.toArray().toString();
                    };

                    Deque.prototype.valueOf = Deque.prototype.toString;
                    Deque.prototype.removeFront = Deque.prototype.shift;
                    Deque.prototype.removeBack = Deque.prototype.pop;
                    Deque.prototype.insertFront = Deque.prototype.unshift;
                    Deque.prototype.insertBack = Deque.prototype.push;
                    Deque.prototype.enqueue = Deque.prototype.push;
                    Deque.prototype.dequeue = Deque.prototype.shift;
                    Deque.prototype.toJSON = Deque.prototype.toArray;

                    Object.defineProperty(Deque.prototype, "length", {
                        get: function () {
                            return this._length;
                        },
                        set: function () {
                            throw new RangeError("");
                        }
                    });

                    Deque.prototype._checkCapacity = function Deque$_checkCapacity(size) {
                        if (this._capacity < size) {
                            this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
                        }
                    };

                    Deque.prototype._resizeTo = function Deque$_resizeTo(capacity) {
                        var oldCapacity = this._capacity;
                        this._capacity = capacity;
                        var front = this._front;
                        var length = this._length;
                        if (front + length > oldCapacity) {
                            var moveItemsCount = (front + length) & (oldCapacity - 1);
                            arrayMove(this, 0, this, oldCapacity, moveItemsCount);
                        }
                    };


                    var isArray = Array.isArray;

                    function arrayMove(src, srcIndex, dst, dstIndex, len) {
                        for (var j = 0; j < len; ++j) {
                            dst[j + dstIndex] = src[j + srcIndex];
                            src[j + srcIndex] = void 0;
                        }
                    }

                    function pow2AtLeast(n) {
                        n = n >>> 0;
                        n = n - 1;
                        n = n | (n >> 1);
                        n = n | (n >> 2);
                        n = n | (n >> 4);
                        n = n | (n >> 8);
                        n = n | (n >> 16);
                        return n + 1;
                    }

                    function getCapacity(capacity) {
                        if (typeof capacity !== "number") {
                            if (isArray(capacity)) {
                                capacity = capacity.length;
                            }
                            else {
                                return 16;
                            }
                        }
                        return pow2AtLeast(
                            Math.min(
                                Math.max(16, capacity), 1073741824)
                        );
                    }

                    module.exports = Deque;


                    /***/
}),

/***/ 917:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

                    /**
                     * lodash (Custom Build) <https://lodash.com/>
                     * Build: `lodash modularize exports="npm" -o ./`
                     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
                     * Released under MIT license <https://lodash.com/license>
                     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                     */

                    /** Used as the `TypeError` message for "Functions" methods. */
                    var FUNC_ERROR_TEXT = 'Expected a function';

                    /** Used to stand-in for `undefined` hash values. */
                    var HASH_UNDEFINED = '__lodash_hash_undefined__';

                    /** Used as references for various `Number` constants. */
                    var INFINITY = 1 / 0;

                    /** `Object#toString` result references. */
                    var funcTag = '[object Function]',
                        genTag = '[object GeneratorFunction]',
                        symbolTag = '[object Symbol]';

                    /** Used to match property names within property paths. */
                    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                        reIsPlainProp = /^\w*$/,
                        reLeadingDot = /^\./,
                        rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

                    /**
                     * Used to match `RegExp`
                     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
                     */
                    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

                    /** Used to match backslashes in property paths. */
                    var reEscapeChar = /\\(\\)?/g;

                    /** Used to detect host constructors (Safari). */
                    var reIsHostCtor = /^\[object .+?Constructor\]$/;

                    /** Detect free variable `global` from Node.js. */
                    var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

                    /** Detect free variable `self`. */
                    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

                    /** Used as a reference to the global object. */
                    var root = freeGlobal || freeSelf || Function('return this')();

                    /**
                     * Gets the value at `key` of `object`.
                     *
                     * @private
                     * @param {Object} [object] The object to query.
                     * @param {string} key The key of the property to get.
                     * @returns {*} Returns the property value.
                     */
                    function getValue(object, key) {
                        return object == null ? undefined : object[key];
                    }

                    /**
                     * Checks if `value` is a host object in IE < 9.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
                     */
                    function isHostObject(value) {
                        // Many host objects are `Object` objects that can coerce to strings
                        // despite having improperly defined `toString` methods.
                        var result = false;
                        if (value != null && typeof value.toString != 'function') {
                            try {
                                result = !!(value + '');
                            } catch (e) { }
                        }
                        return result;
                    }

                    /** Used for built-in method references. */
                    var arrayProto = Array.prototype,
                        funcProto = Function.prototype,
                        objectProto = Object.prototype;

                    /** Used to detect overreaching core-js shims. */
                    var coreJsData = root['__core-js_shared__'];

                    /** Used to detect methods masquerading as native. */
                    var maskSrcKey = (function () {
                        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
                        return uid ? ('Symbol(src)_1.' + uid) : '';
                    }());

                    /** Used to resolve the decompiled source of functions. */
                    var funcToString = funcProto.toString;

                    /** Used to check objects for own properties. */
                    var hasOwnProperty = objectProto.hasOwnProperty;

                    /**
                     * Used to resolve the
                     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
                     * of values.
                     */
                    var objectToString = objectProto.toString;

                    /** Used to detect if a method is native. */
                    var reIsNative = RegExp('^' +
                        funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
                            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
                    );

                    /** Built-in value references. */
                    var Symbol = root.Symbol,
                        splice = arrayProto.splice;

                    /* Built-in method references that are verified to be native. */
                    var Map = getNative(root, 'Map'),
                        nativeCreate = getNative(Object, 'create');

                    /** Used to convert symbols to primitives and strings. */
                    var symbolProto = Symbol ? Symbol.prototype : undefined,
                        symbolToString = symbolProto ? symbolProto.toString : undefined;

                    /**
                     * Creates a hash object.
                     *
                     * @private
                     * @constructor
                     * @param {Array} [entries] The key-value pairs to cache.
                     */
                    function Hash(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;

                        this.clear();
                        while (++index < length) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1]);
                        }
                    }

                    /**
                     * Removes all key-value entries from the hash.
                     *
                     * @private
                     * @name clear
                     * @memberOf Hash
                     */
                    function hashClear() {
                        this.__data__ = nativeCreate ? nativeCreate(null) : {};
                    }

                    /**
                     * Removes `key` and its value from the hash.
                     *
                     * @private
                     * @name delete
                     * @memberOf Hash
                     * @param {Object} hash The hash to modify.
                     * @param {string} key The key of the value to remove.
                     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                     */
                    function hashDelete(key) {
                        return this.has(key) && delete this.__data__[key];
                    }

                    /**
                     * Gets the hash value for `key`.
                     *
                     * @private
                     * @name get
                     * @memberOf Hash
                     * @param {string} key The key of the value to get.
                     * @returns {*} Returns the entry value.
                     */
                    function hashGet(key) {
                        var data = this.__data__;
                        if (nativeCreate) {
                            var result = data[key];
                            return result === HASH_UNDEFINED ? undefined : result;
                        }
                        return hasOwnProperty.call(data, key) ? data[key] : undefined;
                    }

                    /**
                     * Checks if a hash value for `key` exists.
                     *
                     * @private
                     * @name has
                     * @memberOf Hash
                     * @param {string} key The key of the entry to check.
                     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                     */
                    function hashHas(key) {
                        var data = this.__data__;
                        return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
                    }

                    /**
                     * Sets the hash `key` to `value`.
                     *
                     * @private
                     * @name set
                     * @memberOf Hash
                     * @param {string} key The key of the value to set.
                     * @param {*} value The value to set.
                     * @returns {Object} Returns the hash instance.
                     */
                    function hashSet(key, value) {
                        var data = this.__data__;
                        data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
                        return this;
                    }

                    // Add methods to `Hash`.
                    Hash.prototype.clear = hashClear;
                    Hash.prototype['delete'] = hashDelete;
                    Hash.prototype.get = hashGet;
                    Hash.prototype.has = hashHas;
                    Hash.prototype.set = hashSet;

                    /**
                     * Creates an list cache object.
                     *
                     * @private
                     * @constructor
                     * @param {Array} [entries] The key-value pairs to cache.
                     */
                    function ListCache(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;

                        this.clear();
                        while (++index < length) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1]);
                        }
                    }

                    /**
                     * Removes all key-value entries from the list cache.
                     *
                     * @private
                     * @name clear
                     * @memberOf ListCache
                     */
                    function listCacheClear() {
                        this.__data__ = [];
                    }

                    /**
                     * Removes `key` and its value from the list cache.
                     *
                     * @private
                     * @name delete
                     * @memberOf ListCache
                     * @param {string} key The key of the value to remove.
                     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                     */
                    function listCacheDelete(key) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);

                        if (index < 0) {
                            return false;
                        }
                        var lastIndex = data.length - 1;
                        if (index == lastIndex) {
                            data.pop();
                        } else {
                            splice.call(data, index, 1);
                        }
                        return true;
                    }

                    /**
                     * Gets the list cache value for `key`.
                     *
                     * @private
                     * @name get
                     * @memberOf ListCache
                     * @param {string} key The key of the value to get.
                     * @returns {*} Returns the entry value.
                     */
                    function listCacheGet(key) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);

                        return index < 0 ? undefined : data[index][1];
                    }

                    /**
                     * Checks if a list cache value for `key` exists.
                     *
                     * @private
                     * @name has
                     * @memberOf ListCache
                     * @param {string} key The key of the entry to check.
                     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                     */
                    function listCacheHas(key) {
                        return assocIndexOf(this.__data__, key) > -1;
                    }

                    /**
                     * Sets the list cache `key` to `value`.
                     *
                     * @private
                     * @name set
                     * @memberOf ListCache
                     * @param {string} key The key of the value to set.
                     * @param {*} value The value to set.
                     * @returns {Object} Returns the list cache instance.
                     */
                    function listCacheSet(key, value) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);

                        if (index < 0) {
                            data.push([key, value]);
                        } else {
                            data[index][1] = value;
                        }
                        return this;
                    }

                    // Add methods to `ListCache`.
                    ListCache.prototype.clear = listCacheClear;
                    ListCache.prototype['delete'] = listCacheDelete;
                    ListCache.prototype.get = listCacheGet;
                    ListCache.prototype.has = listCacheHas;
                    ListCache.prototype.set = listCacheSet;

                    /**
                     * Creates a map cache object to store key-value pairs.
                     *
                     * @private
                     * @constructor
                     * @param {Array} [entries] The key-value pairs to cache.
                     */
                    function MapCache(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;

                        this.clear();
                        while (++index < length) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1]);
                        }
                    }

                    /**
                     * Removes all key-value entries from the map.
                     *
                     * @private
                     * @name clear
                     * @memberOf MapCache
                     */
                    function mapCacheClear() {
                        this.__data__ = {
                            'hash': new Hash,
                            'map': new (Map || ListCache),
                            'string': new Hash
                        };
                    }

                    /**
                     * Removes `key` and its value from the map.
                     *
                     * @private
                     * @name delete
                     * @memberOf MapCache
                     * @param {string} key The key of the value to remove.
                     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                     */
                    function mapCacheDelete(key) {
                        return getMapData(this, key)['delete'](key);
                    }

                    /**
                     * Gets the map value for `key`.
                     *
                     * @private
                     * @name get
                     * @memberOf MapCache
                     * @param {string} key The key of the value to get.
                     * @returns {*} Returns the entry value.
                     */
                    function mapCacheGet(key) {
                        return getMapData(this, key).get(key);
                    }

                    /**
                     * Checks if a map value for `key` exists.
                     *
                     * @private
                     * @name has
                     * @memberOf MapCache
                     * @param {string} key The key of the entry to check.
                     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                     */
                    function mapCacheHas(key) {
                        return getMapData(this, key).has(key);
                    }

                    /**
                     * Sets the map `key` to `value`.
                     *
                     * @private
                     * @name set
                     * @memberOf MapCache
                     * @param {string} key The key of the value to set.
                     * @param {*} value The value to set.
                     * @returns {Object} Returns the map cache instance.
                     */
                    function mapCacheSet(key, value) {
                        getMapData(this, key).set(key, value);
                        return this;
                    }

                    // Add methods to `MapCache`.
                    MapCache.prototype.clear = mapCacheClear;
                    MapCache.prototype['delete'] = mapCacheDelete;
                    MapCache.prototype.get = mapCacheGet;
                    MapCache.prototype.has = mapCacheHas;
                    MapCache.prototype.set = mapCacheSet;

                    /**
                     * Gets the index at which the `key` is found in `array` of key-value pairs.
                     *
                     * @private
                     * @param {Array} array The array to inspect.
                     * @param {*} key The key to search for.
                     * @returns {number} Returns the index of the matched value, else `-1`.
                     */
                    function assocIndexOf(array, key) {
                        var length = array.length;
                        while (length--) {
                            if (eq(array[length][0], key)) {
                                return length;
                            }
                        }
                        return -1;
                    }

                    /**
                     * The base implementation of `_.get` without support for default values.
                     *
                     * @private
                     * @param {Object} object The object to query.
                     * @param {Array|string} path The path of the property to get.
                     * @returns {*} Returns the resolved value.
                     */
                    function baseGet(object, path) {
                        path = isKey(path, object) ? [path] : castPath(path);

                        var index = 0,
                            length = path.length;

                        while (object != null && index < length) {
                            object = object[toKey(path[index++])];
                        }
                        return (index && index == length) ? object : undefined;
                    }

                    /**
                     * The base implementation of `_.isNative` without bad shim checks.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a native function,
                     *  else `false`.
                     */
                    function baseIsNative(value) {
                        if (!isObject(value) || isMasked(value)) {
                            return false;
                        }
                        var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
                        return pattern.test(toSource(value));
                    }

                    /**
                     * The base implementation of `_.toString` which doesn't convert nullish
                     * values to empty strings.
                     *
                     * @private
                     * @param {*} value The value to process.
                     * @returns {string} Returns the string.
                     */
                    function baseToString(value) {
                        // Exit early for strings to avoid a performance hit in some environments.
                        if (typeof value == 'string') {
                            return value;
                        }
                        if (isSymbol(value)) {
                            return symbolToString ? symbolToString.call(value) : '';
                        }
                        var result = (value + '');
                        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
                    }

                    /**
                     * Casts `value` to a path array if it's not one.
                     *
                     * @private
                     * @param {*} value The value to inspect.
                     * @returns {Array} Returns the cast property path array.
                     */
                    function castPath(value) {
                        return isArray(value) ? value : stringToPath(value);
                    }

                    /**
                     * Gets the data for `map`.
                     *
                     * @private
                     * @param {Object} map The map to query.
                     * @param {string} key The reference key.
                     * @returns {*} Returns the map data.
                     */
                    function getMapData(map, key) {
                        var data = map.__data__;
                        return isKeyable(key)
                            ? data[typeof key == 'string' ? 'string' : 'hash']
                            : data.map;
                    }

                    /**
                     * Gets the native function at `key` of `object`.
                     *
                     * @private
                     * @param {Object} object The object to query.
                     * @param {string} key The key of the method to get.
                     * @returns {*} Returns the function if it's native, else `undefined`.
                     */
                    function getNative(object, key) {
                        var value = getValue(object, key);
                        return baseIsNative(value) ? value : undefined;
                    }

                    /**
                     * Checks if `value` is a property name and not a property path.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @param {Object} [object] The object to query keys on.
                     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
                     */
                    function isKey(value, object) {
                        if (isArray(value)) {
                            return false;
                        }
                        var type = typeof value;
                        if (type == 'number' || type == 'symbol' || type == 'boolean' ||
                            value == null || isSymbol(value)) {
                            return true;
                        }
                        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
                            (object != null && value in Object(object));
                    }

                    /**
                     * Checks if `value` is suitable for use as unique object key.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
                     */
                    function isKeyable(value) {
                        var type = typeof value;
                        return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
                            ? (value !== '__proto__')
                            : (value === null);
                    }

                    /**
                     * Checks if `func` has its source masked.
                     *
                     * @private
                     * @param {Function} func The function to check.
                     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
                     */
                    function isMasked(func) {
                        return !!maskSrcKey && (maskSrcKey in func);
                    }

                    /**
                     * Converts `string` to a property path array.
                     *
                     * @private
                     * @param {string} string The string to convert.
                     * @returns {Array} Returns the property path array.
                     */
                    var stringToPath = memoize(function (string) {
                        string = toString(string);

                        var result = [];
                        if (reLeadingDot.test(string)) {
                            result.push('');
                        }
                        string.replace(rePropName, function (match, number, quote, string) {
                            result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
                        });
                        return result;
                    });

                    /**
                     * Converts `value` to a string key if it's not a string or symbol.
                     *
                     * @private
                     * @param {*} value The value to inspect.
                     * @returns {string|symbol} Returns the key.
                     */
                    function toKey(value) {
                        if (typeof value == 'string' || isSymbol(value)) {
                            return value;
                        }
                        var result = (value + '');
                        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
                    }

                    /**
                     * Converts `func` to its source code.
                     *
                     * @private
                     * @param {Function} func The function to process.
                     * @returns {string} Returns the source code.
                     */
                    function toSource(func) {
                        if (func != null) {
                            try {
                                return funcToString.call(func);
                            } catch (e) { }
                            try {
                                return (func + '');
                            } catch (e) { }
                        }
                        return '';
                    }

                    /**
                     * Creates a function that memoizes the result of `func`. If `resolver` is
                     * provided, it determines the cache key for storing the result based on the
                     * arguments provided to the memoized function. By default, the first argument
                     * provided to the memoized function is used as the map cache key. The `func`
                     * is invoked with the `this` binding of the memoized function.
                     *
                     * **Note:** The cache is exposed as the `cache` property on the memoized
                     * function. Its creation may be customized by replacing the `_.memoize.Cache`
                     * constructor with one whose instances implement the
                     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
                     * method interface of `delete`, `get`, `has`, and `set`.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Function
                     * @param {Function} func The function to have its output memoized.
                     * @param {Function} [resolver] The function to resolve the cache key.
                     * @returns {Function} Returns the new memoized function.
                     * @example
                     *
                     * var object = { 'a': 1, 'b': 2 };
                     * var other = { 'c': 3, 'd': 4 };
                     *
                     * var values = _.memoize(_.values);
                     * values(object);
                     * // => [1, 2]
                     *
                     * values(other);
                     * // => [3, 4]
                     *
                     * object.a = 2;
                     * values(object);
                     * // => [1, 2]
                     *
                     * // Modify the result cache.
                     * values.cache.set(object, ['a', 'b']);
                     * values(object);
                     * // => ['a', 'b']
                     *
                     * // Replace `_.memoize.Cache`.
                     * _.memoize.Cache = WeakMap;
                     */
                    function memoize(func, resolver) {
                        if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
                            throw new TypeError(FUNC_ERROR_TEXT);
                        }
                        var memoized = function () {
                            var args = arguments,
                                key = resolver ? resolver.apply(this, args) : args[0],
                                cache = memoized.cache;

                            if (cache.has(key)) {
                                return cache.get(key);
                            }
                            var result = func.apply(this, args);
                            memoized.cache = cache.set(key, result);
                            return result;
                        };
                        memoized.cache = new (memoize.Cache || MapCache);
                        return memoized;
                    }

                    // Assign cache to `_.memoize`.
                    memoize.Cache = MapCache;

                    /**
                     * Performs a
                     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
                     * comparison between two values to determine if they are equivalent.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to compare.
                     * @param {*} other The other value to compare.
                     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
                     * @example
                     *
                     * var object = { 'a': 1 };
                     * var other = { 'a': 1 };
                     *
                     * _.eq(object, object);
                     * // => true
                     *
                     * _.eq(object, other);
                     * // => false
                     *
                     * _.eq('a', 'a');
                     * // => true
                     *
                     * _.eq('a', Object('a'));
                     * // => false
                     *
                     * _.eq(NaN, NaN);
                     * // => true
                     */
                    function eq(value, other) {
                        return value === other || (value !== value && other !== other);
                    }

                    /**
                     * Checks if `value` is classified as an `Array` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
                     * @example
                     *
                     * _.isArray([1, 2, 3]);
                     * // => true
                     *
                     * _.isArray(document.body.children);
                     * // => false
                     *
                     * _.isArray('abc');
                     * // => false
                     *
                     * _.isArray(_.noop);
                     * // => false
                     */
                    var isArray = Array.isArray;

                    /**
                     * Checks if `value` is classified as a `Function` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
                     * @example
                     *
                     * _.isFunction(_);
                     * // => true
                     *
                     * _.isFunction(/abc/);
                     * // => false
                     */
                    function isFunction(value) {
                        // The use of `Object#toString` avoids issues with the `typeof` operator
                        // in Safari 8-9 which returns 'object' for typed array and other constructors.
                        var tag = isObject(value) ? objectToString.call(value) : '';
                        return tag == funcTag || tag == genTag;
                    }

                    /**
                     * Checks if `value` is the
                     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
                     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
                     * @example
                     *
                     * _.isObject({});
                     * // => true
                     *
                     * _.isObject([1, 2, 3]);
                     * // => true
                     *
                     * _.isObject(_.noop);
                     * // => true
                     *
                     * _.isObject(null);
                     * // => false
                     */
                    function isObject(value) {
                        var type = typeof value;
                        return !!value && (type == 'object' || type == 'function');
                    }

                    /**
                     * Checks if `value` is object-like. A value is object-like if it's not `null`
                     * and has a `typeof` result of "object".
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
                     * @example
                     *
                     * _.isObjectLike({});
                     * // => true
                     *
                     * _.isObjectLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isObjectLike(_.noop);
                     * // => false
                     *
                     * _.isObjectLike(null);
                     * // => false
                     */
                    function isObjectLike(value) {
                        return !!value && typeof value == 'object';
                    }

                    /**
                     * Checks if `value` is classified as a `Symbol` primitive or object.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
                     * @example
                     *
                     * _.isSymbol(Symbol.iterator);
                     * // => true
                     *
                     * _.isSymbol('abc');
                     * // => false
                     */
                    function isSymbol(value) {
                        return typeof value == 'symbol' ||
                            (isObjectLike(value) && objectToString.call(value) == symbolTag);
                    }

                    /**
                     * Converts `value` to a string. An empty string is returned for `null`
                     * and `undefined` values. The sign of `-0` is preserved.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to process.
                     * @returns {string} Returns the string.
                     * @example
                     *
                     * _.toString(null);
                     * // => ''
                     *
                     * _.toString(-0);
                     * // => '-0'
                     *
                     * _.toString([1, 2, 3]);
                     * // => '1,2,3'
                     */
                    function toString(value) {
                        return value == null ? '' : baseToString(value);
                    }

                    /**
                     * Gets the value at `path` of `object`. If the resolved value is
                     * `undefined`, the `defaultValue` is returned in its place.
                     *
                     * @static
                     * @memberOf _
                     * @since 3.7.0
                     * @category Object
                     * @param {Object} object The object to query.
                     * @param {Array|string} path The path of the property to get.
                     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
                     * @returns {*} Returns the resolved value.
                     * @example
                     *
                     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
                     *
                     * _.get(object, 'a[0].b.c');
                     * // => 3
                     *
                     * _.get(object, ['a', '0', 'b', 'c']);
                     * // => 3
                     *
                     * _.get(object, 'a.b.c', 'default');
                     * // => 'default'
                     */
                    function get(object, path, defaultValue) {
                        var result = object == null ? undefined : baseGet(object, path);
                        return result === undefined ? defaultValue : result;
                    }

                    module.exports = get;


                    /***/
}),

/***/ 991:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

                    /**
                     * lodash (Custom Build) <https://lodash.com/>
                     * Build: `lodash modularize exports="npm" -o ./`
                     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
                     * Released under MIT license <https://lodash.com/license>
                     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                     */

                    /** Used as the `TypeError` message for "Functions" methods. */
                    var FUNC_ERROR_TEXT = 'Expected a function';

                    /** Used to stand-in for `undefined` hash values. */
                    var HASH_UNDEFINED = '__lodash_hash_undefined__';

                    /** Used as references for various `Number` constants. */
                    var INFINITY = 1 / 0,
                        MAX_SAFE_INTEGER = 9007199254740991;

                    /** `Object#toString` result references. */
                    var argsTag = '[object Arguments]',
                        funcTag = '[object Function]',
                        genTag = '[object GeneratorFunction]',
                        symbolTag = '[object Symbol]';

                    /** Used to match property names within property paths. */
                    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                        reIsPlainProp = /^\w*$/,
                        reLeadingDot = /^\./,
                        rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

                    /**
                     * Used to match `RegExp`
                     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
                     */
                    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

                    /** Used to match backslashes in property paths. */
                    var reEscapeChar = /\\(\\)?/g;

                    /** Used to detect host constructors (Safari). */
                    var reIsHostCtor = /^\[object .+?Constructor\]$/;

                    /** Used to detect unsigned integer values. */
                    var reIsUint = /^(?:0|[1-9]\d*)$/;

                    /** Detect free variable `global` from Node.js. */
                    var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

                    /** Detect free variable `self`. */
                    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

                    /** Used as a reference to the global object. */
                    var root = freeGlobal || freeSelf || Function('return this')();

                    /**
                     * Gets the value at `key` of `object`.
                     *
                     * @private
                     * @param {Object} [object] The object to query.
                     * @param {string} key The key of the property to get.
                     * @returns {*} Returns the property value.
                     */
                    function getValue(object, key) {
                        return object == null ? undefined : object[key];
                    }

                    /**
                     * Checks if `value` is a host object in IE < 9.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
                     */
                    function isHostObject(value) {
                        // Many host objects are `Object` objects that can coerce to strings
                        // despite having improperly defined `toString` methods.
                        var result = false;
                        if (value != null && typeof value.toString != 'function') {
                            try {
                                result = !!(value + '');
                            } catch (e) { }
                        }
                        return result;
                    }

                    /** Used for built-in method references. */
                    var arrayProto = Array.prototype,
                        funcProto = Function.prototype,
                        objectProto = Object.prototype;

                    /** Used to detect overreaching core-js shims. */
                    var coreJsData = root['__core-js_shared__'];

                    /** Used to detect methods masquerading as native. */
                    var maskSrcKey = (function () {
                        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
                        return uid ? ('Symbol(src)_1.' + uid) : '';
                    }());

                    /** Used to resolve the decompiled source of functions. */
                    var funcToString = funcProto.toString;

                    /** Used to check objects for own properties. */
                    var hasOwnProperty = objectProto.hasOwnProperty;

                    /**
                     * Used to resolve the
                     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
                     * of values.
                     */
                    var objectToString = objectProto.toString;

                    /** Used to detect if a method is native. */
                    var reIsNative = RegExp('^' +
                        funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
                            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
                    );

                    /** Built-in value references. */
                    var Symbol = root.Symbol,
                        propertyIsEnumerable = objectProto.propertyIsEnumerable,
                        splice = arrayProto.splice;

                    /* Built-in method references that are verified to be native. */
                    var Map = getNative(root, 'Map'),
                        nativeCreate = getNative(Object, 'create');

                    /** Used to convert symbols to primitives and strings. */
                    var symbolProto = Symbol ? Symbol.prototype : undefined,
                        symbolToString = symbolProto ? symbolProto.toString : undefined;

                    /**
                     * Creates a hash object.
                     *
                     * @private
                     * @constructor
                     * @param {Array} [entries] The key-value pairs to cache.
                     */
                    function Hash(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;

                        this.clear();
                        while (++index < length) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1]);
                        }
                    }

                    /**
                     * Removes all key-value entries from the hash.
                     *
                     * @private
                     * @name clear
                     * @memberOf Hash
                     */
                    function hashClear() {
                        this.__data__ = nativeCreate ? nativeCreate(null) : {};
                    }

                    /**
                     * Removes `key` and its value from the hash.
                     *
                     * @private
                     * @name delete
                     * @memberOf Hash
                     * @param {Object} hash The hash to modify.
                     * @param {string} key The key of the value to remove.
                     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                     */
                    function hashDelete(key) {
                        return this.has(key) && delete this.__data__[key];
                    }

                    /**
                     * Gets the hash value for `key`.
                     *
                     * @private
                     * @name get
                     * @memberOf Hash
                     * @param {string} key The key of the value to get.
                     * @returns {*} Returns the entry value.
                     */
                    function hashGet(key) {
                        var data = this.__data__;
                        if (nativeCreate) {
                            var result = data[key];
                            return result === HASH_UNDEFINED ? undefined : result;
                        }
                        return hasOwnProperty.call(data, key) ? data[key] : undefined;
                    }

                    /**
                     * Checks if a hash value for `key` exists.
                     *
                     * @private
                     * @name has
                     * @memberOf Hash
                     * @param {string} key The key of the entry to check.
                     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                     */
                    function hashHas(key) {
                        var data = this.__data__;
                        return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
                    }

                    /**
                     * Sets the hash `key` to `value`.
                     *
                     * @private
                     * @name set
                     * @memberOf Hash
                     * @param {string} key The key of the value to set.
                     * @param {*} value The value to set.
                     * @returns {Object} Returns the hash instance.
                     */
                    function hashSet(key, value) {
                        var data = this.__data__;
                        data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
                        return this;
                    }

                    // Add methods to `Hash`.
                    Hash.prototype.clear = hashClear;
                    Hash.prototype['delete'] = hashDelete;
                    Hash.prototype.get = hashGet;
                    Hash.prototype.has = hashHas;
                    Hash.prototype.set = hashSet;

                    /**
                     * Creates an list cache object.
                     *
                     * @private
                     * @constructor
                     * @param {Array} [entries] The key-value pairs to cache.
                     */
                    function ListCache(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;

                        this.clear();
                        while (++index < length) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1]);
                        }
                    }

                    /**
                     * Removes all key-value entries from the list cache.
                     *
                     * @private
                     * @name clear
                     * @memberOf ListCache
                     */
                    function listCacheClear() {
                        this.__data__ = [];
                    }

                    /**
                     * Removes `key` and its value from the list cache.
                     *
                     * @private
                     * @name delete
                     * @memberOf ListCache
                     * @param {string} key The key of the value to remove.
                     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                     */
                    function listCacheDelete(key) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);

                        if (index < 0) {
                            return false;
                        }
                        var lastIndex = data.length - 1;
                        if (index == lastIndex) {
                            data.pop();
                        } else {
                            splice.call(data, index, 1);
                        }
                        return true;
                    }

                    /**
                     * Gets the list cache value for `key`.
                     *
                     * @private
                     * @name get
                     * @memberOf ListCache
                     * @param {string} key The key of the value to get.
                     * @returns {*} Returns the entry value.
                     */
                    function listCacheGet(key) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);

                        return index < 0 ? undefined : data[index][1];
                    }

                    /**
                     * Checks if a list cache value for `key` exists.
                     *
                     * @private
                     * @name has
                     * @memberOf ListCache
                     * @param {string} key The key of the entry to check.
                     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                     */
                    function listCacheHas(key) {
                        return assocIndexOf(this.__data__, key) > -1;
                    }

                    /**
                     * Sets the list cache `key` to `value`.
                     *
                     * @private
                     * @name set
                     * @memberOf ListCache
                     * @param {string} key The key of the value to set.
                     * @param {*} value The value to set.
                     * @returns {Object} Returns the list cache instance.
                     */
                    function listCacheSet(key, value) {
                        var data = this.__data__,
                            index = assocIndexOf(data, key);

                        if (index < 0) {
                            data.push([key, value]);
                        } else {
                            data[index][1] = value;
                        }
                        return this;
                    }

                    // Add methods to `ListCache`.
                    ListCache.prototype.clear = listCacheClear;
                    ListCache.prototype['delete'] = listCacheDelete;
                    ListCache.prototype.get = listCacheGet;
                    ListCache.prototype.has = listCacheHas;
                    ListCache.prototype.set = listCacheSet;

                    /**
                     * Creates a map cache object to store key-value pairs.
                     *
                     * @private
                     * @constructor
                     * @param {Array} [entries] The key-value pairs to cache.
                     */
                    function MapCache(entries) {
                        var index = -1,
                            length = entries ? entries.length : 0;

                        this.clear();
                        while (++index < length) {
                            var entry = entries[index];
                            this.set(entry[0], entry[1]);
                        }
                    }

                    /**
                     * Removes all key-value entries from the map.
                     *
                     * @private
                     * @name clear
                     * @memberOf MapCache
                     */
                    function mapCacheClear() {
                        this.__data__ = {
                            'hash': new Hash,
                            'map': new (Map || ListCache),
                            'string': new Hash
                        };
                    }

                    /**
                     * Removes `key` and its value from the map.
                     *
                     * @private
                     * @name delete
                     * @memberOf MapCache
                     * @param {string} key The key of the value to remove.
                     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
                     */
                    function mapCacheDelete(key) {
                        return getMapData(this, key)['delete'](key);
                    }

                    /**
                     * Gets the map value for `key`.
                     *
                     * @private
                     * @name get
                     * @memberOf MapCache
                     * @param {string} key The key of the value to get.
                     * @returns {*} Returns the entry value.
                     */
                    function mapCacheGet(key) {
                        return getMapData(this, key).get(key);
                    }

                    /**
                     * Checks if a map value for `key` exists.
                     *
                     * @private
                     * @name has
                     * @memberOf MapCache
                     * @param {string} key The key of the entry to check.
                     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
                     */
                    function mapCacheHas(key) {
                        return getMapData(this, key).has(key);
                    }

                    /**
                     * Sets the map `key` to `value`.
                     *
                     * @private
                     * @name set
                     * @memberOf MapCache
                     * @param {string} key The key of the value to set.
                     * @param {*} value The value to set.
                     * @returns {Object} Returns the map cache instance.
                     */
                    function mapCacheSet(key, value) {
                        getMapData(this, key).set(key, value);
                        return this;
                    }

                    // Add methods to `MapCache`.
                    MapCache.prototype.clear = mapCacheClear;
                    MapCache.prototype['delete'] = mapCacheDelete;
                    MapCache.prototype.get = mapCacheGet;
                    MapCache.prototype.has = mapCacheHas;
                    MapCache.prototype.set = mapCacheSet;

                    /**
                     * Gets the index at which the `key` is found in `array` of key-value pairs.
                     *
                     * @private
                     * @param {Array} array The array to inspect.
                     * @param {*} key The key to search for.
                     * @returns {number} Returns the index of the matched value, else `-1`.
                     */
                    function assocIndexOf(array, key) {
                        var length = array.length;
                        while (length--) {
                            if (eq(array[length][0], key)) {
                                return length;
                            }
                        }
                        return -1;
                    }

                    /**
                     * The base implementation of `_.has` without support for deep paths.
                     *
                     * @private
                     * @param {Object} [object] The object to query.
                     * @param {Array|string} key The key to check.
                     * @returns {boolean} Returns `true` if `key` exists, else `false`.
                     */
                    function baseHas(object, key) {
                        return object != null && hasOwnProperty.call(object, key);
                    }

                    /**
                     * The base implementation of `_.isNative` without bad shim checks.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a native function,
                     *  else `false`.
                     */
                    function baseIsNative(value) {
                        if (!isObject(value) || isMasked(value)) {
                            return false;
                        }
                        var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
                        return pattern.test(toSource(value));
                    }

                    /**
                     * The base implementation of `_.toString` which doesn't convert nullish
                     * values to empty strings.
                     *
                     * @private
                     * @param {*} value The value to process.
                     * @returns {string} Returns the string.
                     */
                    function baseToString(value) {
                        // Exit early for strings to avoid a performance hit in some environments.
                        if (typeof value == 'string') {
                            return value;
                        }
                        if (isSymbol(value)) {
                            return symbolToString ? symbolToString.call(value) : '';
                        }
                        var result = (value + '');
                        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
                    }

                    /**
                     * Casts `value` to a path array if it's not one.
                     *
                     * @private
                     * @param {*} value The value to inspect.
                     * @returns {Array} Returns the cast property path array.
                     */
                    function castPath(value) {
                        return isArray(value) ? value : stringToPath(value);
                    }

                    /**
                     * Gets the data for `map`.
                     *
                     * @private
                     * @param {Object} map The map to query.
                     * @param {string} key The reference key.
                     * @returns {*} Returns the map data.
                     */
                    function getMapData(map, key) {
                        var data = map.__data__;
                        return isKeyable(key)
                            ? data[typeof key == 'string' ? 'string' : 'hash']
                            : data.map;
                    }

                    /**
                     * Gets the native function at `key` of `object`.
                     *
                     * @private
                     * @param {Object} object The object to query.
                     * @param {string} key The key of the method to get.
                     * @returns {*} Returns the function if it's native, else `undefined`.
                     */
                    function getNative(object, key) {
                        var value = getValue(object, key);
                        return baseIsNative(value) ? value : undefined;
                    }

                    /**
                     * Checks if `path` exists on `object`.
                     *
                     * @private
                     * @param {Object} object The object to query.
                     * @param {Array|string} path The path to check.
                     * @param {Function} hasFunc The function to check properties.
                     * @returns {boolean} Returns `true` if `path` exists, else `false`.
                     */
                    function hasPath(object, path, hasFunc) {
                        path = isKey(path, object) ? [path] : castPath(path);

                        var result,
                            index = -1,
                            length = path.length;

                        while (++index < length) {
                            var key = toKey(path[index]);
                            if (!(result = object != null && hasFunc(object, key))) {
                                break;
                            }
                            object = object[key];
                        }
                        if (result) {
                            return result;
                        }
                        var length = object ? object.length : 0;
                        return !!length && isLength(length) && isIndex(key, length) &&
                            (isArray(object) || isArguments(object));
                    }

                    /**
                     * Checks if `value` is a valid array-like index.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
                     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
                     */
                    function isIndex(value, length) {
                        length = length == null ? MAX_SAFE_INTEGER : length;
                        return !!length &&
                            (typeof value == 'number' || reIsUint.test(value)) &&
                            (value > -1 && value % 1 == 0 && value < length);
                    }

                    /**
                     * Checks if `value` is a property name and not a property path.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @param {Object} [object] The object to query keys on.
                     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
                     */
                    function isKey(value, object) {
                        if (isArray(value)) {
                            return false;
                        }
                        var type = typeof value;
                        if (type == 'number' || type == 'symbol' || type == 'boolean' ||
                            value == null || isSymbol(value)) {
                            return true;
                        }
                        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
                            (object != null && value in Object(object));
                    }

                    /**
                     * Checks if `value` is suitable for use as unique object key.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
                     */
                    function isKeyable(value) {
                        var type = typeof value;
                        return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
                            ? (value !== '__proto__')
                            : (value === null);
                    }

                    /**
                     * Checks if `func` has its source masked.
                     *
                     * @private
                     * @param {Function} func The function to check.
                     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
                     */
                    function isMasked(func) {
                        return !!maskSrcKey && (maskSrcKey in func);
                    }

                    /**
                     * Converts `string` to a property path array.
                     *
                     * @private
                     * @param {string} string The string to convert.
                     * @returns {Array} Returns the property path array.
                     */
                    var stringToPath = memoize(function (string) {
                        string = toString(string);

                        var result = [];
                        if (reLeadingDot.test(string)) {
                            result.push('');
                        }
                        string.replace(rePropName, function (match, number, quote, string) {
                            result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
                        });
                        return result;
                    });

                    /**
                     * Converts `value` to a string key if it's not a string or symbol.
                     *
                     * @private
                     * @param {*} value The value to inspect.
                     * @returns {string|symbol} Returns the key.
                     */
                    function toKey(value) {
                        if (typeof value == 'string' || isSymbol(value)) {
                            return value;
                        }
                        var result = (value + '');
                        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
                    }

                    /**
                     * Converts `func` to its source code.
                     *
                     * @private
                     * @param {Function} func The function to process.
                     * @returns {string} Returns the source code.
                     */
                    function toSource(func) {
                        if (func != null) {
                            try {
                                return funcToString.call(func);
                            } catch (e) { }
                            try {
                                return (func + '');
                            } catch (e) { }
                        }
                        return '';
                    }

                    /**
                     * Creates a function that memoizes the result of `func`. If `resolver` is
                     * provided, it determines the cache key for storing the result based on the
                     * arguments provided to the memoized function. By default, the first argument
                     * provided to the memoized function is used as the map cache key. The `func`
                     * is invoked with the `this` binding of the memoized function.
                     *
                     * **Note:** The cache is exposed as the `cache` property on the memoized
                     * function. Its creation may be customized by replacing the `_.memoize.Cache`
                     * constructor with one whose instances implement the
                     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
                     * method interface of `delete`, `get`, `has`, and `set`.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Function
                     * @param {Function} func The function to have its output memoized.
                     * @param {Function} [resolver] The function to resolve the cache key.
                     * @returns {Function} Returns the new memoized function.
                     * @example
                     *
                     * var object = { 'a': 1, 'b': 2 };
                     * var other = { 'c': 3, 'd': 4 };
                     *
                     * var values = _.memoize(_.values);
                     * values(object);
                     * // => [1, 2]
                     *
                     * values(other);
                     * // => [3, 4]
                     *
                     * object.a = 2;
                     * values(object);
                     * // => [1, 2]
                     *
                     * // Modify the result cache.
                     * values.cache.set(object, ['a', 'b']);
                     * values(object);
                     * // => ['a', 'b']
                     *
                     * // Replace `_.memoize.Cache`.
                     * _.memoize.Cache = WeakMap;
                     */
                    function memoize(func, resolver) {
                        if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
                            throw new TypeError(FUNC_ERROR_TEXT);
                        }
                        var memoized = function () {
                            var args = arguments,
                                key = resolver ? resolver.apply(this, args) : args[0],
                                cache = memoized.cache;

                            if (cache.has(key)) {
                                return cache.get(key);
                            }
                            var result = func.apply(this, args);
                            memoized.cache = cache.set(key, result);
                            return result;
                        };
                        memoized.cache = new (memoize.Cache || MapCache);
                        return memoized;
                    }

                    // Assign cache to `_.memoize`.
                    memoize.Cache = MapCache;

                    /**
                     * Performs a
                     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
                     * comparison between two values to determine if they are equivalent.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to compare.
                     * @param {*} other The other value to compare.
                     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
                     * @example
                     *
                     * var object = { 'a': 1 };
                     * var other = { 'a': 1 };
                     *
                     * _.eq(object, object);
                     * // => true
                     *
                     * _.eq(object, other);
                     * // => false
                     *
                     * _.eq('a', 'a');
                     * // => true
                     *
                     * _.eq('a', Object('a'));
                     * // => false
                     *
                     * _.eq(NaN, NaN);
                     * // => true
                     */
                    function eq(value, other) {
                        return value === other || (value !== value && other !== other);
                    }

                    /**
                     * Checks if `value` is likely an `arguments` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
                     *  else `false`.
                     * @example
                     *
                     * _.isArguments(function() { return arguments; }());
                     * // => true
                     *
                     * _.isArguments([1, 2, 3]);
                     * // => false
                     */
                    function isArguments(value) {
                        // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
                        return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
                            (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
                    }

                    /**
                     * Checks if `value` is classified as an `Array` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
                     * @example
                     *
                     * _.isArray([1, 2, 3]);
                     * // => true
                     *
                     * _.isArray(document.body.children);
                     * // => false
                     *
                     * _.isArray('abc');
                     * // => false
                     *
                     * _.isArray(_.noop);
                     * // => false
                     */
                    var isArray = Array.isArray;

                    /**
                     * Checks if `value` is array-like. A value is considered array-like if it's
                     * not a function and has a `value.length` that's an integer greater than or
                     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
                     * @example
                     *
                     * _.isArrayLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isArrayLike(document.body.children);
                     * // => true
                     *
                     * _.isArrayLike('abc');
                     * // => true
                     *
                     * _.isArrayLike(_.noop);
                     * // => false
                     */
                    function isArrayLike(value) {
                        return value != null && isLength(value.length) && !isFunction(value);
                    }

                    /**
                     * This method is like `_.isArrayLike` except that it also checks if `value`
                     * is an object.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an array-like object,
                     *  else `false`.
                     * @example
                     *
                     * _.isArrayLikeObject([1, 2, 3]);
                     * // => true
                     *
                     * _.isArrayLikeObject(document.body.children);
                     * // => true
                     *
                     * _.isArrayLikeObject('abc');
                     * // => false
                     *
                     * _.isArrayLikeObject(_.noop);
                     * // => false
                     */
                    function isArrayLikeObject(value) {
                        return isObjectLike(value) && isArrayLike(value);
                    }

                    /**
                     * Checks if `value` is classified as a `Function` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
                     * @example
                     *
                     * _.isFunction(_);
                     * // => true
                     *
                     * _.isFunction(/abc/);
                     * // => false
                     */
                    function isFunction(value) {
                        // The use of `Object#toString` avoids issues with the `typeof` operator
                        // in Safari 8-9 which returns 'object' for typed array and other constructors.
                        var tag = isObject(value) ? objectToString.call(value) : '';
                        return tag == funcTag || tag == genTag;
                    }

                    /**
                     * Checks if `value` is a valid array-like length.
                     *
                     * **Note:** This method is loosely based on
                     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
                     * @example
                     *
                     * _.isLength(3);
                     * // => true
                     *
                     * _.isLength(Number.MIN_VALUE);
                     * // => false
                     *
                     * _.isLength(Infinity);
                     * // => false
                     *
                     * _.isLength('3');
                     * // => false
                     */
                    function isLength(value) {
                        return typeof value == 'number' &&
                            value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
                    }

                    /**
                     * Checks if `value` is the
                     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
                     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
                     * @example
                     *
                     * _.isObject({});
                     * // => true
                     *
                     * _.isObject([1, 2, 3]);
                     * // => true
                     *
                     * _.isObject(_.noop);
                     * // => true
                     *
                     * _.isObject(null);
                     * // => false
                     */
                    function isObject(value) {
                        var type = typeof value;
                        return !!value && (type == 'object' || type == 'function');
                    }

                    /**
                     * Checks if `value` is object-like. A value is object-like if it's not `null`
                     * and has a `typeof` result of "object".
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
                     * @example
                     *
                     * _.isObjectLike({});
                     * // => true
                     *
                     * _.isObjectLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isObjectLike(_.noop);
                     * // => false
                     *
                     * _.isObjectLike(null);
                     * // => false
                     */
                    function isObjectLike(value) {
                        return !!value && typeof value == 'object';
                    }

                    /**
                     * Checks if `value` is classified as a `Symbol` primitive or object.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
                     * @example
                     *
                     * _.isSymbol(Symbol.iterator);
                     * // => true
                     *
                     * _.isSymbol('abc');
                     * // => false
                     */
                    function isSymbol(value) {
                        return typeof value == 'symbol' ||
                            (isObjectLike(value) && objectToString.call(value) == symbolTag);
                    }

                    /**
                     * Converts `value` to a string. An empty string is returned for `null`
                     * and `undefined` values. The sign of `-0` is preserved.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to process.
                     * @returns {string} Returns the string.
                     * @example
                     *
                     * _.toString(null);
                     * // => ''
                     *
                     * _.toString(-0);
                     * // => '-0'
                     *
                     * _.toString([1, 2, 3]);
                     * // => '1,2,3'
                     */
                    function toString(value) {
                        return value == null ? '' : baseToString(value);
                    }

                    /**
                     * Checks if `path` is a direct property of `object`.
                     *
                     * @static
                     * @since 0.1.0
                     * @memberOf _
                     * @category Object
                     * @param {Object} object The object to query.
                     * @param {Array|string} path The path to check.
                     * @returns {boolean} Returns `true` if `path` exists, else `false`.
                     * @example
                     *
                     * var object = { 'a': { 'b': 2 } };
                     * var other = _.create({ 'a': _.create({ 'b': 2 }) });
                     *
                     * _.has(object, 'a');
                     * // => true
                     *
                     * _.has(object, 'a.b');
                     * // => true
                     *
                     * _.has(object, ['a', 'b']);
                     * // => true
                     *
                     * _.has(other, 'a');
                     * // => false
                     */
                    function has(object, path) {
                        return object != null && hasPath(object, path, baseHas);
                    }

                    module.exports = has;


                    /***/
}),

/***/ 244:
/***/ ((module) => {

                    /**
                     * lodash (Custom Build) <https://lodash.com/>
                     * Build: `lodash modularize exports="npm" -o ./`
                     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
                     * Released under MIT license <https://lodash.com/license>
                     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                     */

                    /** Used as references for various `Number` constants. */
                    var INFINITY = 1 / 0,
                        MAX_SAFE_INTEGER = 9007199254740991,
                        MAX_INTEGER = 1.7976931348623157e+308,
                        NAN = 0 / 0;

                    /** `Object#toString` result references. */
                    var argsTag = '[object Arguments]',
                        funcTag = '[object Function]',
                        genTag = '[object GeneratorFunction]',
                        stringTag = '[object String]',
                        symbolTag = '[object Symbol]';

                    /** Used to match leading and trailing whitespace. */
                    var reTrim = /^\s+|\s+$/g;

                    /** Used to detect bad signed hexadecimal string values. */
                    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

                    /** Used to detect binary string values. */
                    var reIsBinary = /^0b[01]+$/i;

                    /** Used to detect octal string values. */
                    var reIsOctal = /^0o[0-7]+$/i;

                    /** Used to detect unsigned integer values. */
                    var reIsUint = /^(?:0|[1-9]\d*)$/;

                    /** Built-in method references without a dependency on `root`. */
                    var freeParseInt = parseInt;

                    /**
                     * A specialized version of `_.map` for arrays without support for iteratee
                     * shorthands.
                     *
                     * @private
                     * @param {Array} [array] The array to iterate over.
                     * @param {Function} iteratee The function invoked per iteration.
                     * @returns {Array} Returns the new mapped array.
                     */
                    function arrayMap(array, iteratee) {
                        var index = -1,
                            length = array ? array.length : 0,
                            result = Array(length);

                        while (++index < length) {
                            result[index] = iteratee(array[index], index, array);
                        }
                        return result;
                    }

                    /**
                     * The base implementation of `_.findIndex` and `_.findLastIndex` without
                     * support for iteratee shorthands.
                     *
                     * @private
                     * @param {Array} array The array to inspect.
                     * @param {Function} predicate The function invoked per iteration.
                     * @param {number} fromIndex The index to search from.
                     * @param {boolean} [fromRight] Specify iterating from right to left.
                     * @returns {number} Returns the index of the matched value, else `-1`.
                     */
                    function baseFindIndex(array, predicate, fromIndex, fromRight) {
                        var length = array.length,
                            index = fromIndex + (fromRight ? 1 : -1);

                        while ((fromRight ? index-- : ++index < length)) {
                            if (predicate(array[index], index, array)) {
                                return index;
                            }
                        }
                        return -1;
                    }

                    /**
                     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
                     *
                     * @private
                     * @param {Array} array The array to inspect.
                     * @param {*} value The value to search for.
                     * @param {number} fromIndex The index to search from.
                     * @returns {number} Returns the index of the matched value, else `-1`.
                     */
                    function baseIndexOf(array, value, fromIndex) {
                        if (value !== value) {
                            return baseFindIndex(array, baseIsNaN, fromIndex);
                        }
                        var index = fromIndex - 1,
                            length = array.length;

                        while (++index < length) {
                            if (array[index] === value) {
                                return index;
                            }
                        }
                        return -1;
                    }

                    /**
                     * The base implementation of `_.isNaN` without support for number objects.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
                     */
                    function baseIsNaN(value) {
                        return value !== value;
                    }

                    /**
                     * The base implementation of `_.times` without support for iteratee shorthands
                     * or max array length checks.
                     *
                     * @private
                     * @param {number} n The number of times to invoke `iteratee`.
                     * @param {Function} iteratee The function invoked per iteration.
                     * @returns {Array} Returns the array of results.
                     */
                    function baseTimes(n, iteratee) {
                        var index = -1,
                            result = Array(n);

                        while (++index < n) {
                            result[index] = iteratee(index);
                        }
                        return result;
                    }

                    /**
                     * The base implementation of `_.values` and `_.valuesIn` which creates an
                     * array of `object` property values corresponding to the property names
                     * of `props`.
                     *
                     * @private
                     * @param {Object} object The object to query.
                     * @param {Array} props The property names to get values for.
                     * @returns {Object} Returns the array of property values.
                     */
                    function baseValues(object, props) {
                        return arrayMap(props, function (key) {
                            return object[key];
                        });
                    }

                    /**
                     * Creates a unary function that invokes `func` with its argument transformed.
                     *
                     * @private
                     * @param {Function} func The function to wrap.
                     * @param {Function} transform The argument transform.
                     * @returns {Function} Returns the new function.
                     */
                    function overArg(func, transform) {
                        return function (arg) {
                            return func(transform(arg));
                        };
                    }

                    /** Used for built-in method references. */
                    var objectProto = Object.prototype;

                    /** Used to check objects for own properties. */
                    var hasOwnProperty = objectProto.hasOwnProperty;

                    /**
                     * Used to resolve the
                     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
                     * of values.
                     */
                    var objectToString = objectProto.toString;

                    /** Built-in value references. */
                    var propertyIsEnumerable = objectProto.propertyIsEnumerable;

                    /* Built-in method references for those with the same name as other `lodash` methods. */
                    var nativeKeys = overArg(Object.keys, Object),
                        nativeMax = Math.max;

                    /**
                     * Creates an array of the enumerable property names of the array-like `value`.
                     *
                     * @private
                     * @param {*} value The value to query.
                     * @param {boolean} inherited Specify returning inherited property names.
                     * @returns {Array} Returns the array of property names.
                     */
                    function arrayLikeKeys(value, inherited) {
                        // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
                        // Safari 9 makes `arguments.length` enumerable in strict mode.
                        var result = (isArray(value) || isArguments(value))
                            ? baseTimes(value.length, String)
                            : [];

                        var length = result.length,
                            skipIndexes = !!length;

                        for (var key in value) {
                            if ((inherited || hasOwnProperty.call(value, key)) &&
                                !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
                                result.push(key);
                            }
                        }
                        return result;
                    }

                    /**
                     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
                     *
                     * @private
                     * @param {Object} object The object to query.
                     * @returns {Array} Returns the array of property names.
                     */
                    function baseKeys(object) {
                        if (!isPrototype(object)) {
                            return nativeKeys(object);
                        }
                        var result = [];
                        for (var key in Object(object)) {
                            if (hasOwnProperty.call(object, key) && key != 'constructor') {
                                result.push(key);
                            }
                        }
                        return result;
                    }

                    /**
                     * Checks if `value` is a valid array-like index.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
                     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
                     */
                    function isIndex(value, length) {
                        length = length == null ? MAX_SAFE_INTEGER : length;
                        return !!length &&
                            (typeof value == 'number' || reIsUint.test(value)) &&
                            (value > -1 && value % 1 == 0 && value < length);
                    }

                    /**
                     * Checks if `value` is likely a prototype object.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
                     */
                    function isPrototype(value) {
                        var Ctor = value && value.constructor,
                            proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

                        return value === proto;
                    }

                    /**
                     * Checks if `value` is in `collection`. If `collection` is a string, it's
                     * checked for a substring of `value`, otherwise
                     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
                     * is used for equality comparisons. If `fromIndex` is negative, it's used as
                     * the offset from the end of `collection`.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Collection
                     * @param {Array|Object|string} collection The collection to inspect.
                     * @param {*} value The value to search for.
                     * @param {number} [fromIndex=0] The index to search from.
                     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
                     * @returns {boolean} Returns `true` if `value` is found, else `false`.
                     * @example
                     *
                     * _.includes([1, 2, 3], 1);
                     * // => true
                     *
                     * _.includes([1, 2, 3], 1, 2);
                     * // => false
                     *
                     * _.includes({ 'a': 1, 'b': 2 }, 1);
                     * // => true
                     *
                     * _.includes('abcd', 'bc');
                     * // => true
                     */
                    function includes(collection, value, fromIndex, guard) {
                        collection = isArrayLike(collection) ? collection : values(collection);
                        fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

                        var length = collection.length;
                        if (fromIndex < 0) {
                            fromIndex = nativeMax(length + fromIndex, 0);
                        }
                        return isString(collection)
                            ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
                            : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
                    }

                    /**
                     * Checks if `value` is likely an `arguments` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
                     *  else `false`.
                     * @example
                     *
                     * _.isArguments(function() { return arguments; }());
                     * // => true
                     *
                     * _.isArguments([1, 2, 3]);
                     * // => false
                     */
                    function isArguments(value) {
                        // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
                        return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
                            (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
                    }

                    /**
                     * Checks if `value` is classified as an `Array` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
                     * @example
                     *
                     * _.isArray([1, 2, 3]);
                     * // => true
                     *
                     * _.isArray(document.body.children);
                     * // => false
                     *
                     * _.isArray('abc');
                     * // => false
                     *
                     * _.isArray(_.noop);
                     * // => false
                     */
                    var isArray = Array.isArray;

                    /**
                     * Checks if `value` is array-like. A value is considered array-like if it's
                     * not a function and has a `value.length` that's an integer greater than or
                     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
                     * @example
                     *
                     * _.isArrayLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isArrayLike(document.body.children);
                     * // => true
                     *
                     * _.isArrayLike('abc');
                     * // => true
                     *
                     * _.isArrayLike(_.noop);
                     * // => false
                     */
                    function isArrayLike(value) {
                        return value != null && isLength(value.length) && !isFunction(value);
                    }

                    /**
                     * This method is like `_.isArrayLike` except that it also checks if `value`
                     * is an object.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an array-like object,
                     *  else `false`.
                     * @example
                     *
                     * _.isArrayLikeObject([1, 2, 3]);
                     * // => true
                     *
                     * _.isArrayLikeObject(document.body.children);
                     * // => true
                     *
                     * _.isArrayLikeObject('abc');
                     * // => false
                     *
                     * _.isArrayLikeObject(_.noop);
                     * // => false
                     */
                    function isArrayLikeObject(value) {
                        return isObjectLike(value) && isArrayLike(value);
                    }

                    /**
                     * Checks if `value` is classified as a `Function` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
                     * @example
                     *
                     * _.isFunction(_);
                     * // => true
                     *
                     * _.isFunction(/abc/);
                     * // => false
                     */
                    function isFunction(value) {
                        // The use of `Object#toString` avoids issues with the `typeof` operator
                        // in Safari 8-9 which returns 'object' for typed array and other constructors.
                        var tag = isObject(value) ? objectToString.call(value) : '';
                        return tag == funcTag || tag == genTag;
                    }

                    /**
                     * Checks if `value` is a valid array-like length.
                     *
                     * **Note:** This method is loosely based on
                     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
                     * @example
                     *
                     * _.isLength(3);
                     * // => true
                     *
                     * _.isLength(Number.MIN_VALUE);
                     * // => false
                     *
                     * _.isLength(Infinity);
                     * // => false
                     *
                     * _.isLength('3');
                     * // => false
                     */
                    function isLength(value) {
                        return typeof value == 'number' &&
                            value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
                    }

                    /**
                     * Checks if `value` is the
                     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
                     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
                     * @example
                     *
                     * _.isObject({});
                     * // => true
                     *
                     * _.isObject([1, 2, 3]);
                     * // => true
                     *
                     * _.isObject(_.noop);
                     * // => true
                     *
                     * _.isObject(null);
                     * // => false
                     */
                    function isObject(value) {
                        var type = typeof value;
                        return !!value && (type == 'object' || type == 'function');
                    }

                    /**
                     * Checks if `value` is object-like. A value is object-like if it's not `null`
                     * and has a `typeof` result of "object".
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
                     * @example
                     *
                     * _.isObjectLike({});
                     * // => true
                     *
                     * _.isObjectLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isObjectLike(_.noop);
                     * // => false
                     *
                     * _.isObjectLike(null);
                     * // => false
                     */
                    function isObjectLike(value) {
                        return !!value && typeof value == 'object';
                    }

                    /**
                     * Checks if `value` is classified as a `String` primitive or object.
                     *
                     * @static
                     * @since 0.1.0
                     * @memberOf _
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a string, else `false`.
                     * @example
                     *
                     * _.isString('abc');
                     * // => true
                     *
                     * _.isString(1);
                     * // => false
                     */
                    function isString(value) {
                        return typeof value == 'string' ||
                            (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
                    }

                    /**
                     * Checks if `value` is classified as a `Symbol` primitive or object.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
                     * @example
                     *
                     * _.isSymbol(Symbol.iterator);
                     * // => true
                     *
                     * _.isSymbol('abc');
                     * // => false
                     */
                    function isSymbol(value) {
                        return typeof value == 'symbol' ||
                            (isObjectLike(value) && objectToString.call(value) == symbolTag);
                    }

                    /**
                     * Converts `value` to a finite number.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.12.0
                     * @category Lang
                     * @param {*} value The value to convert.
                     * @returns {number} Returns the converted number.
                     * @example
                     *
                     * _.toFinite(3.2);
                     * // => 3.2
                     *
                     * _.toFinite(Number.MIN_VALUE);
                     * // => 5e-324
                     *
                     * _.toFinite(Infinity);
                     * // => 1.7976931348623157e+308
                     *
                     * _.toFinite('3.2');
                     * // => 3.2
                     */
                    function toFinite(value) {
                        if (!value) {
                            return value === 0 ? value : 0;
                        }
                        value = toNumber(value);
                        if (value === INFINITY || value === -INFINITY) {
                            var sign = (value < 0 ? -1 : 1);
                            return sign * MAX_INTEGER;
                        }
                        return value === value ? value : 0;
                    }

                    /**
                     * Converts `value` to an integer.
                     *
                     * **Note:** This method is loosely based on
                     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to convert.
                     * @returns {number} Returns the converted integer.
                     * @example
                     *
                     * _.toInteger(3.2);
                     * // => 3
                     *
                     * _.toInteger(Number.MIN_VALUE);
                     * // => 0
                     *
                     * _.toInteger(Infinity);
                     * // => 1.7976931348623157e+308
                     *
                     * _.toInteger('3.2');
                     * // => 3
                     */
                    function toInteger(value) {
                        var result = toFinite(value),
                            remainder = result % 1;

                        return result === result ? (remainder ? result - remainder : result) : 0;
                    }

                    /**
                     * Converts `value` to a number.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to process.
                     * @returns {number} Returns the number.
                     * @example
                     *
                     * _.toNumber(3.2);
                     * // => 3.2
                     *
                     * _.toNumber(Number.MIN_VALUE);
                     * // => 5e-324
                     *
                     * _.toNumber(Infinity);
                     * // => Infinity
                     *
                     * _.toNumber('3.2');
                     * // => 3.2
                     */
                    function toNumber(value) {
                        if (typeof value == 'number') {
                            return value;
                        }
                        if (isSymbol(value)) {
                            return NAN;
                        }
                        if (isObject(value)) {
                            var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
                            value = isObject(other) ? (other + '') : other;
                        }
                        if (typeof value != 'string') {
                            return value === 0 ? value : +value;
                        }
                        value = value.replace(reTrim, '');
                        var isBinary = reIsBinary.test(value);
                        return (isBinary || reIsOctal.test(value))
                            ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
                            : (reIsBadHex.test(value) ? NAN : +value);
                    }

                    /**
                     * Creates an array of the own enumerable property names of `object`.
                     *
                     * **Note:** Non-object values are coerced to objects. See the
                     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
                     * for more details.
                     *
                     * @static
                     * @since 0.1.0
                     * @memberOf _
                     * @category Object
                     * @param {Object} object The object to query.
                     * @returns {Array} Returns the array of property names.
                     * @example
                     *
                     * function Foo() {
                     *   this.a = 1;
                     *   this.b = 2;
                     * }
                     *
                     * Foo.prototype.c = 3;
                     *
                     * _.keys(new Foo);
                     * // => ['a', 'b'] (iteration order is not guaranteed)
                     *
                     * _.keys('hi');
                     * // => ['0', '1']
                     */
                    function keys(object) {
                        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
                    }

                    /**
                     * Creates an array of the own enumerable string keyed property values of `object`.
                     *
                     * **Note:** Non-object values are coerced to objects.
                     *
                     * @static
                     * @since 0.1.0
                     * @memberOf _
                     * @category Object
                     * @param {Object} object The object to query.
                     * @returns {Array} Returns the array of property values.
                     * @example
                     *
                     * function Foo() {
                     *   this.a = 1;
                     *   this.b = 2;
                     * }
                     *
                     * Foo.prototype.c = 3;
                     *
                     * _.values(new Foo);
                     * // => [1, 2] (iteration order is not guaranteed)
                     *
                     * _.values('hi');
                     * // => ['h', 'i']
                     */
                    function values(object) {
                        return object ? baseValues(object, keys(object)) : [];
                    }

                    module.exports = includes;


                    /***/
}),

/***/ 427:
/***/ ((module) => {

                    /**
                     * lodash (Custom Build) <https://lodash.com/>
                     * Build: `lodash modularize exports="npm" -o ./`
                     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
                     * Released under MIT license <https://lodash.com/license>
                     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                     */

                    /** `Object#toString` result references. */
                    var objectTag = '[object Object]';

                    /**
                     * Checks if `value` is a host object in IE < 9.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
                     */
                    function isHostObject(value) {
                        // Many host objects are `Object` objects that can coerce to strings
                        // despite having improperly defined `toString` methods.
                        var result = false;
                        if (value != null && typeof value.toString != 'function') {
                            try {
                                result = !!(value + '');
                            } catch (e) { }
                        }
                        return result;
                    }

                    /**
                     * Creates a unary function that invokes `func` with its argument transformed.
                     *
                     * @private
                     * @param {Function} func The function to wrap.
                     * @param {Function} transform The argument transform.
                     * @returns {Function} Returns the new function.
                     */
                    function overArg(func, transform) {
                        return function (arg) {
                            return func(transform(arg));
                        };
                    }

                    /** Used for built-in method references. */
                    var funcProto = Function.prototype,
                        objectProto = Object.prototype;

                    /** Used to resolve the decompiled source of functions. */
                    var funcToString = funcProto.toString;

                    /** Used to check objects for own properties. */
                    var hasOwnProperty = objectProto.hasOwnProperty;

                    /** Used to infer the `Object` constructor. */
                    var objectCtorString = funcToString.call(Object);

                    /**
                     * Used to resolve the
                     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
                     * of values.
                     */
                    var objectToString = objectProto.toString;

                    /** Built-in value references. */
                    var getPrototype = overArg(Object.getPrototypeOf, Object);

                    /**
                     * Checks if `value` is likely a DOM element.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
                     * @example
                     *
                     * _.isElement(document.body);
                     * // => true
                     *
                     * _.isElement('<body>');
                     * // => false
                     */
                    function isElement(value) {
                        return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
                    }

                    /**
                     * Checks if `value` is object-like. A value is object-like if it's not `null`
                     * and has a `typeof` result of "object".
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
                     * @example
                     *
                     * _.isObjectLike({});
                     * // => true
                     *
                     * _.isObjectLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isObjectLike(_.noop);
                     * // => false
                     *
                     * _.isObjectLike(null);
                     * // => false
                     */
                    function isObjectLike(value) {
                        return !!value && typeof value == 'object';
                    }

                    /**
                     * Checks if `value` is a plain object, that is, an object created by the
                     * `Object` constructor or one with a `[[Prototype]]` of `null`.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.8.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
                     * @example
                     *
                     * function Foo() {
                     *   this.a = 1;
                     * }
                     *
                     * _.isPlainObject(new Foo);
                     * // => false
                     *
                     * _.isPlainObject([1, 2, 3]);
                     * // => false
                     *
                     * _.isPlainObject({ 'x': 0, 'y': 0 });
                     * // => true
                     *
                     * _.isPlainObject(Object.create(null));
                     * // => true
                     */
                    function isPlainObject(value) {
                        if (!isObjectLike(value) ||
                            objectToString.call(value) != objectTag || isHostObject(value)) {
                            return false;
                        }
                        var proto = getPrototype(value);
                        if (proto === null) {
                            return true;
                        }
                        var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
                        return (typeof Ctor == 'function' &&
                            Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
                    }

                    module.exports = isElement;


                    /***/
}),

/***/ 810:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

                    /**
                     * lodash (Custom Build) <https://lodash.com/>
                     * Build: `lodash modularize exports="npm" -o ./`
                     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
                     * Released under MIT license <https://lodash.com/license>
                     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                     */

                    /** Detect free variable `global` from Node.js. */
                    var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

                    /** Detect free variable `self`. */
                    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

                    /** Used as a reference to the global object. */
                    var root = freeGlobal || freeSelf || Function('return this')();

                    /* Built-in method references for those with the same name as other `lodash` methods. */
                    var nativeIsFinite = root.isFinite;

                    /**
                     * Checks if `value` is a finite primitive number.
                     *
                     * **Note:** This method is based on
                     * [`Number.isFinite`](https://mdn.io/Number/isFinite).
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a finite number,
                     *  else `false`.
                     * @example
                     *
                     * _.isFinite(3);
                     * // => true
                     *
                     * _.isFinite(Number.MIN_VALUE);
                     * // => true
                     *
                     * _.isFinite(Infinity);
                     * // => false
                     *
                     * _.isFinite('3');
                     * // => false
                     */
                    function isFinite(value) {
                        return typeof value == 'number' && nativeIsFinite(value);
                    }

                    module.exports = isFinite;


                    /***/
}),

/***/ 217:
/***/ ((module) => {

                    /**
                     * lodash 4.0.1 (Custom Build) <https://lodash.com/>
                     * Build: `lodash modularize exports="npm" -o ./`
                     * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
                     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                     * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                     * Available under MIT license <https://lodash.com/license>
                     */

                    /** `Object#toString` result references. */
                    var stringTag = '[object String]';

                    /** Used for built-in method references. */
                    var objectProto = Object.prototype;

                    /**
                     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
                     * of values.
                     */
                    var objectToString = objectProto.toString;

                    /**
                     * Checks if `value` is classified as an `Array` object.
                     *
                     * @static
                     * @memberOf _
                     * @type Function
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
                     * @example
                     *
                     * _.isArray([1, 2, 3]);
                     * // => true
                     *
                     * _.isArray(document.body.children);
                     * // => false
                     *
                     * _.isArray('abc');
                     * // => false
                     *
                     * _.isArray(_.noop);
                     * // => false
                     */
                    var isArray = Array.isArray;

                    /**
                     * Checks if `value` is object-like. A value is object-like if it's not `null`
                     * and has a `typeof` result of "object".
                     *
                     * @static
                     * @memberOf _
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
                     * @example
                     *
                     * _.isObjectLike({});
                     * // => true
                     *
                     * _.isObjectLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isObjectLike(_.noop);
                     * // => false
                     *
                     * _.isObjectLike(null);
                     * // => false
                     */
                    function isObjectLike(value) {
                        return !!value && typeof value == 'object';
                    }

                    /**
                     * Checks if `value` is classified as a `String` primitive or object.
                     *
                     * @static
                     * @memberOf _
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
                     * @example
                     *
                     * _.isString('abc');
                     * // => true
                     *
                     * _.isString(1);
                     * // => false
                     */
                    function isString(value) {
                        return typeof value == 'string' ||
                            (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
                    }

                    module.exports = isString;


                    /***/
}),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

                    /**
                     * lodash (Custom Build) <https://lodash.com/>
                     * Build: `lodash modularize exports="npm" -o ./`
                     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
                     * Released under MIT license <https://lodash.com/license>
                     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
                     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
                     */

                    /** Used as references for various `Number` constants. */
                    var INFINITY = 1 / 0,
                        MAX_SAFE_INTEGER = 9007199254740991;

                    /** `Object#toString` result references. */
                    var argsTag = '[object Arguments]',
                        funcTag = '[object Function]',
                        genTag = '[object GeneratorFunction]',
                        symbolTag = '[object Symbol]';

                    /** Detect free variable `global` from Node.js. */
                    var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

                    /** Detect free variable `self`. */
                    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

                    /** Used as a reference to the global object. */
                    var root = freeGlobal || freeSelf || Function('return this')();

                    /**
                     * A faster alternative to `Function#apply`, this function invokes `func`
                     * with the `this` binding of `thisArg` and the arguments of `args`.
                     *
                     * @private
                     * @param {Function} func The function to invoke.
                     * @param {*} thisArg The `this` binding of `func`.
                     * @param {Array} args The arguments to invoke `func` with.
                     * @returns {*} Returns the result of `func`.
                     */
                    function apply(func, thisArg, args) {
                        switch (args.length) {
                            case 0: return func.call(thisArg);
                            case 1: return func.call(thisArg, args[0]);
                            case 2: return func.call(thisArg, args[0], args[1]);
                            case 3: return func.call(thisArg, args[0], args[1], args[2]);
                        }
                        return func.apply(thisArg, args);
                    }

                    /**
                     * A specialized version of `_.map` for arrays without support for iteratee
                     * shorthands.
                     *
                     * @private
                     * @param {Array} [array] The array to iterate over.
                     * @param {Function} iteratee The function invoked per iteration.
                     * @returns {Array} Returns the new mapped array.
                     */
                    function arrayMap(array, iteratee) {
                        var index = -1,
                            length = array ? array.length : 0,
                            result = Array(length);

                        while (++index < length) {
                            result[index] = iteratee(array[index], index, array);
                        }
                        return result;
                    }

                    /**
                     * Appends the elements of `values` to `array`.
                     *
                     * @private
                     * @param {Array} array The array to modify.
                     * @param {Array} values The values to append.
                     * @returns {Array} Returns `array`.
                     */
                    function arrayPush(array, values) {
                        var index = -1,
                            length = values.length,
                            offset = array.length;

                        while (++index < length) {
                            array[offset + index] = values[index];
                        }
                        return array;
                    }

                    /** Used for built-in method references. */
                    var objectProto = Object.prototype;

                    /** Used to check objects for own properties. */
                    var hasOwnProperty = objectProto.hasOwnProperty;

                    /**
                     * Used to resolve the
                     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
                     * of values.
                     */
                    var objectToString = objectProto.toString;

                    /** Built-in value references. */
                    var Symbol = root.Symbol,
                        propertyIsEnumerable = objectProto.propertyIsEnumerable,
                        spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

                    /* Built-in method references for those with the same name as other `lodash` methods. */
                    var nativeMax = Math.max;

                    /**
                     * The base implementation of `_.flatten` with support for restricting flattening.
                     *
                     * @private
                     * @param {Array} array The array to flatten.
                     * @param {number} depth The maximum recursion depth.
                     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
                     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
                     * @param {Array} [result=[]] The initial result value.
                     * @returns {Array} Returns the new flattened array.
                     */
                    function baseFlatten(array, depth, predicate, isStrict, result) {
                        var index = -1,
                            length = array.length;

                        predicate || (predicate = isFlattenable);
                        result || (result = []);

                        while (++index < length) {
                            var value = array[index];
                            if (depth > 0 && predicate(value)) {
                                if (depth > 1) {
                                    // Recursively flatten arrays (susceptible to call stack limits).
                                    baseFlatten(value, depth - 1, predicate, isStrict, result);
                                } else {
                                    arrayPush(result, value);
                                }
                            } else if (!isStrict) {
                                result[result.length] = value;
                            }
                        }
                        return result;
                    }

                    /**
                     * The base implementation of `_.pick` without support for individual
                     * property identifiers.
                     *
                     * @private
                     * @param {Object} object The source object.
                     * @param {string[]} props The property identifiers to pick.
                     * @returns {Object} Returns the new object.
                     */
                    function basePick(object, props) {
                        object = Object(object);
                        return basePickBy(object, props, function (value, key) {
                            return key in object;
                        });
                    }

                    /**
                     * The base implementation of  `_.pickBy` without support for iteratee shorthands.
                     *
                     * @private
                     * @param {Object} object The source object.
                     * @param {string[]} props The property identifiers to pick from.
                     * @param {Function} predicate The function invoked per property.
                     * @returns {Object} Returns the new object.
                     */
                    function basePickBy(object, props, predicate) {
                        var index = -1,
                            length = props.length,
                            result = {};

                        while (++index < length) {
                            var key = props[index],
                                value = object[key];

                            if (predicate(value, key)) {
                                result[key] = value;
                            }
                        }
                        return result;
                    }

                    /**
                     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
                     *
                     * @private
                     * @param {Function} func The function to apply a rest parameter to.
                     * @param {number} [start=func.length-1] The start position of the rest parameter.
                     * @returns {Function} Returns the new function.
                     */
                    function baseRest(func, start) {
                        start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
                        return function () {
                            var args = arguments,
                                index = -1,
                                length = nativeMax(args.length - start, 0),
                                array = Array(length);

                            while (++index < length) {
                                array[index] = args[start + index];
                            }
                            index = -1;
                            var otherArgs = Array(start + 1);
                            while (++index < start) {
                                otherArgs[index] = args[index];
                            }
                            otherArgs[start] = array;
                            return apply(func, this, otherArgs);
                        };
                    }

                    /**
                     * Checks if `value` is a flattenable `arguments` object or array.
                     *
                     * @private
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
                     */
                    function isFlattenable(value) {
                        return isArray(value) || isArguments(value) ||
                            !!(spreadableSymbol && value && value[spreadableSymbol]);
                    }

                    /**
                     * Converts `value` to a string key if it's not a string or symbol.
                     *
                     * @private
                     * @param {*} value The value to inspect.
                     * @returns {string|symbol} Returns the key.
                     */
                    function toKey(value) {
                        if (typeof value == 'string' || isSymbol(value)) {
                            return value;
                        }
                        var result = (value + '');
                        return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
                    }

                    /**
                     * Checks if `value` is likely an `arguments` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
                     *  else `false`.
                     * @example
                     *
                     * _.isArguments(function() { return arguments; }());
                     * // => true
                     *
                     * _.isArguments([1, 2, 3]);
                     * // => false
                     */
                    function isArguments(value) {
                        // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
                        return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
                            (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
                    }

                    /**
                     * Checks if `value` is classified as an `Array` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
                     * @example
                     *
                     * _.isArray([1, 2, 3]);
                     * // => true
                     *
                     * _.isArray(document.body.children);
                     * // => false
                     *
                     * _.isArray('abc');
                     * // => false
                     *
                     * _.isArray(_.noop);
                     * // => false
                     */
                    var isArray = Array.isArray;

                    /**
                     * Checks if `value` is array-like. A value is considered array-like if it's
                     * not a function and has a `value.length` that's an integer greater than or
                     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
                     * @example
                     *
                     * _.isArrayLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isArrayLike(document.body.children);
                     * // => true
                     *
                     * _.isArrayLike('abc');
                     * // => true
                     *
                     * _.isArrayLike(_.noop);
                     * // => false
                     */
                    function isArrayLike(value) {
                        return value != null && isLength(value.length) && !isFunction(value);
                    }

                    /**
                     * This method is like `_.isArrayLike` except that it also checks if `value`
                     * is an object.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an array-like object,
                     *  else `false`.
                     * @example
                     *
                     * _.isArrayLikeObject([1, 2, 3]);
                     * // => true
                     *
                     * _.isArrayLikeObject(document.body.children);
                     * // => true
                     *
                     * _.isArrayLikeObject('abc');
                     * // => false
                     *
                     * _.isArrayLikeObject(_.noop);
                     * // => false
                     */
                    function isArrayLikeObject(value) {
                        return isObjectLike(value) && isArrayLike(value);
                    }

                    /**
                     * Checks if `value` is classified as a `Function` object.
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
                     * @example
                     *
                     * _.isFunction(_);
                     * // => true
                     *
                     * _.isFunction(/abc/);
                     * // => false
                     */
                    function isFunction(value) {
                        // The use of `Object#toString` avoids issues with the `typeof` operator
                        // in Safari 8-9 which returns 'object' for typed array and other constructors.
                        var tag = isObject(value) ? objectToString.call(value) : '';
                        return tag == funcTag || tag == genTag;
                    }

                    /**
                     * Checks if `value` is a valid array-like length.
                     *
                     * **Note:** This method is loosely based on
                     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
                     * @example
                     *
                     * _.isLength(3);
                     * // => true
                     *
                     * _.isLength(Number.MIN_VALUE);
                     * // => false
                     *
                     * _.isLength(Infinity);
                     * // => false
                     *
                     * _.isLength('3');
                     * // => false
                     */
                    function isLength(value) {
                        return typeof value == 'number' &&
                            value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
                    }

                    /**
                     * Checks if `value` is the
                     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
                     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
                     *
                     * @static
                     * @memberOf _
                     * @since 0.1.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
                     * @example
                     *
                     * _.isObject({});
                     * // => true
                     *
                     * _.isObject([1, 2, 3]);
                     * // => true
                     *
                     * _.isObject(_.noop);
                     * // => true
                     *
                     * _.isObject(null);
                     * // => false
                     */
                    function isObject(value) {
                        var type = typeof value;
                        return !!value && (type == 'object' || type == 'function');
                    }

                    /**
                     * Checks if `value` is object-like. A value is object-like if it's not `null`
                     * and has a `typeof` result of "object".
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
                     * @example
                     *
                     * _.isObjectLike({});
                     * // => true
                     *
                     * _.isObjectLike([1, 2, 3]);
                     * // => true
                     *
                     * _.isObjectLike(_.noop);
                     * // => false
                     *
                     * _.isObjectLike(null);
                     * // => false
                     */
                    function isObjectLike(value) {
                        return !!value && typeof value == 'object';
                    }

                    /**
                     * Checks if `value` is classified as a `Symbol` primitive or object.
                     *
                     * @static
                     * @memberOf _
                     * @since 4.0.0
                     * @category Lang
                     * @param {*} value The value to check.
                     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
                     * @example
                     *
                     * _.isSymbol(Symbol.iterator);
                     * // => true
                     *
                     * _.isSymbol('abc');
                     * // => false
                     */
                    function isSymbol(value) {
                        return typeof value == 'symbol' ||
                            (isObjectLike(value) && objectToString.call(value) == symbolTag);
                    }

                    /**
                     * Creates an object composed of the picked `object` properties.
                     *
                     * @static
                     * @since 0.1.0
                     * @memberOf _
                     * @category Object
                     * @param {Object} object The source object.
                     * @param {...(string|string[])} [props] The property identifiers to pick.
                     * @returns {Object} Returns the new object.
                     * @example
                     *
                     * var object = { 'a': 1, 'b': '2', 'c': 3 };
                     *
                     * _.pick(object, ['a', 'c']);
                     * // => { 'a': 1, 'c': 3 }
                     */
                    var pick = baseRest(function (object, props) {
                        return object == null ? {} : basePick(object, arrayMap(baseFlatten(props, 1), toKey));
                    });

                    module.exports = pick;


                    /***/
}),

/***/ 950:
/***/ ((module, exports) => {

                    "use strict";
                    // ISC @ Julien Fontanet



                    // ===================================================================

                    var construct = typeof Reflect !== "undefined" ? Reflect.construct : undefined;
                    var defineProperty = Object.defineProperty;

                    // -------------------------------------------------------------------

                    var captureStackTrace = Error.captureStackTrace;
                    if (captureStackTrace === undefined) {
                        captureStackTrace = function captureStackTrace(error) {
                            var container = new Error();

                            defineProperty(error, "stack", {
                                configurable: true,
                                get: function getStack() {
                                    var stack = container.stack;

                                    // Replace property with value for faster future accesses.
                                    defineProperty(this, "stack", {
                                        configurable: true,
                                        value: stack,
                                        writable: true,
                                    });

                                    return stack;
                                },
                                set: function setStack(stack) {
                                    defineProperty(error, "stack", {
                                        configurable: true,
                                        value: stack,
                                        writable: true,
                                    });
                                },
                            });
                        };
                    }

                    // -------------------------------------------------------------------

                    function BaseError(message) {
                        if (message !== undefined) {
                            defineProperty(this, "message", {
                                configurable: true,
                                value: message,
                                writable: true,
                            });
                        }

                        var cname = this.constructor.name;
                        if (cname !== undefined && cname !== this.name) {
                            defineProperty(this, "name", {
                                configurable: true,
                                value: cname,
                                writable: true,
                            });
                        }

                        captureStackTrace(this, this.constructor);
                    }

                    BaseError.prototype = Object.create(Error.prototype, {
                        // See: https://github.com/JsCommunity/make-error/issues/4
                        constructor: {
                            configurable: true,
                            value: BaseError,
                            writable: true,
                        },
                    });

                    // -------------------------------------------------------------------

                    // Sets the name of a function if possible (depends of the JS engine).
                    var setFunctionName = (function () {
                        function setFunctionName(fn, name) {
                            return defineProperty(fn, "name", {
                                configurable: true,
                                value: name,
                            });
                        }
                        try {
                            var f = function () { };
                            setFunctionName(f, "foo");
                            if (f.name === "foo") {
                                return setFunctionName;
                            }
                        } catch (_) { }
                    })();

                    // -------------------------------------------------------------------

                    function makeError(constructor, super_) {
                        if (super_ == null || super_ === Error) {
                            super_ = BaseError;
                        } else if (typeof super_ !== "function") {
                            throw new TypeError("super_ should be a function");
                        }

                        var name;
                        if (typeof constructor === "string") {
                            name = constructor;
                            constructor =
                                construct !== undefined
                                    ? function () {
                                        return construct(super_, arguments, this.constructor);
                                    }
                                    : function () {
                                        super_.apply(this, arguments);
                                    };

                            // If the name can be set, do it once and for all.
                            if (setFunctionName !== undefined) {
                                setFunctionName(constructor, name);
                                name = undefined;
                            }
                        } else if (typeof constructor !== "function") {
                            throw new TypeError("constructor should be either a string or a function");
                        }

                        // Also register the super constructor also as `constructor.super_` just
                        // like Node's `util.inherits()`.
                        //
                        // eslint-disable-next-line dot-notation
                        constructor.super_ = constructor["super"] = super_;

                        var properties = {
                            constructor: {
                                configurable: true,
                                value: constructor,
                                writable: true,
                            },
                        };

                        // If the name could not be set on the constructor, set it on the
                        // prototype.
                        if (name !== undefined) {
                            properties.name = {
                                configurable: true,
                                value: name,
                                writable: true,
                            };
                        }
                        constructor.prototype = Object.create(super_.prototype, properties);

                        return constructor;
                    }
                    exports = module.exports = makeError;
                    exports.BaseError = BaseError;


                    /***/
}),

/***/ 604:
/***/ ((__unused_webpack_module, exports) => {

                    "use strict";


                    // This is free and unencumbered software released into the public domain.
                    // See LICENSE.md for more information.

                    //
                    // Utilities
                    //

                    /**
                     * @param {number} a The number to test.
                     * @param {number} min The minimum value in the range, inclusive.
                     * @param {number} max The maximum value in the range, inclusive.
                     * @return {boolean} True if a >= min and a <= max.
                     */
                    function inRange(a, min, max) {
                        return min <= a && a <= max;
                    }

                    /**
                     * @param {*} o
                     * @return {Object}
                     */
                    function ToDictionary(o) {
                        if (o === undefined) return {};
                        if (o === Object(o)) return o;
                        throw TypeError('Could not convert argument to dictionary');
                    }

                    /**
                     * @param {string} string Input string of UTF-16 code units.
                     * @return {!Array.<number>} Code points.
                     */
                    function stringToCodePoints(string) {
                        // https://heycam.github.io/webidl/#dfn-obtain-unicode

                        // 1. Let S be the DOMString value.
                        var s = String(string);

                        // 2. Let n be the length of S.
                        var n = s.length;

                        // 3. Initialize i to 0.
                        var i = 0;

                        // 4. Initialize U to be an empty sequence of Unicode characters.
                        var u = [];

                        // 5. While i < n:
                        while (i < n) {

                            // 1. Let c be the code unit in S at index i.
                            var c = s.charCodeAt(i);

                            // 2. Depending on the value of c:

                            // c < 0xD800 or c > 0xDFFF
                            if (c < 0xD800 || c > 0xDFFF) {
                                // Append to U the Unicode character with code point c.
                                u.push(c);
                            }

                            // 0xDC00 â‰¤ c â‰¤ 0xDFFF
                            else if (0xDC00 <= c && c <= 0xDFFF) {
                                // Append to U a U+FFFD REPLACEMENT CHARACTER.
                                u.push(0xFFFD);
                            }

                            // 0xD800 â‰¤ c â‰¤ 0xDBFF
                            else if (0xD800 <= c && c <= 0xDBFF) {
                                // 1. If i = nâˆ’1, then append to U a U+FFFD REPLACEMENT
                                // CHARACTER.
                                if (i === n - 1) {
                                    u.push(0xFFFD);
                                }
                                // 2. Otherwise, i < nâˆ’1:
                                else {
                                    // 1. Let d be the code unit in S at index i+1.
                                    var d = string.charCodeAt(i + 1);

                                    // 2. If 0xDC00 â‰¤ d â‰¤ 0xDFFF, then:
                                    if (0xDC00 <= d && d <= 0xDFFF) {
                                        // 1. Let a be c & 0x3FF.
                                        var a = c & 0x3FF;

                                        // 2. Let b be d & 0x3FF.
                                        var b = d & 0x3FF;

                                        // 3. Append to U the Unicode character with code point
                                        // 2^16+2^10*a+b.
                                        u.push(0x10000 + (a << 10) + b);

                                        // 4. Set i to i+1.
                                        i += 1;
                                    }

                                    // 3. Otherwise, d < 0xDC00 or d > 0xDFFF. Append to U a
                                    // U+FFFD REPLACEMENT CHARACTER.
                                    else {
                                        u.push(0xFFFD);
                                    }
                                }
                            }

                            // 3. Set i to i+1.
                            i += 1;
                        }

                        // 6. Return U.
                        return u;
                    }

                    /**
                     * @param {!Array.<number>} code_points Array of code points.
                     * @return {string} string String of UTF-16 code units.
                     */
                    function codePointsToString(code_points) {
                        var s = '';
                        for (var i = 0; i < code_points.length; ++i) {
                            var cp = code_points[i];
                            if (cp <= 0xFFFF) {
                                s += String.fromCharCode(cp);
                            } else {
                                cp -= 0x10000;
                                s += String.fromCharCode((cp >> 10) + 0xD800,
                                    (cp & 0x3FF) + 0xDC00);
                            }
                        }
                        return s;
                    }


//
// Implementation of Encoding specification
// https://encoding.spec.whatwg.org/
//

//
// 3. Terminology
//

/**
 * End-of-stream is a special token that signifies no more tokens
 * are in the stream.
 * @const
 */ var end_of_stream = -1;

                    /**
                     * A stream represents an ordered sequence of tokens.
                     *
                     * @constructor
                     * @param {!(Array.<number>|Uint8Array)} tokens Array of tokens that provide the
                     * stream.
                     */
                    function Stream(tokens) {
                        /** @type {!Array.<number>} */
                        this.tokens = [].slice.call(tokens);
                    }

                    Stream.prototype = {
                        /**
                         * @return {boolean} True if end-of-stream has been hit.
                         */
                        endOfStream: function () {
                            return !this.tokens.length;
                        },

                        /**
                         * When a token is read from a stream, the first token in the
                         * stream must be returned and subsequently removed, and
                         * end-of-stream must be returned otherwise.
                         *
                         * @return {number} Get the next token from the stream, or
                         * end_of_stream.
                         */
                        read: function () {
                            if (!this.tokens.length)
                                return end_of_stream;
                            return this.tokens.shift();
                        },

                        /**
                         * When one or more tokens are prepended to a stream, those tokens
                         * must be inserted, in given order, before the first token in the
                         * stream.
                         *
                         * @param {(number|!Array.<number>)} token The token(s) to prepend to the stream.
                         */
                        prepend: function (token) {
                            if (Array.isArray(token)) {
                                var tokens = /**@type {!Array.<number>}*/(token);
                                while (tokens.length)
                                    this.tokens.unshift(tokens.pop());
                            } else {
                                this.tokens.unshift(token);
                            }
                        },

                        /**
                         * When one or more tokens are pushed to a stream, those tokens
                         * must be inserted, in given order, after the last token in the
                         * stream.
                         *
                         * @param {(number|!Array.<number>)} token The tokens(s) to prepend to the stream.
                         */
                        push: function (token) {
                            if (Array.isArray(token)) {
                                var tokens = /**@type {!Array.<number>}*/(token);
                                while (tokens.length)
                                    this.tokens.push(tokens.shift());
                            } else {
                                this.tokens.push(token);
                            }
                        }
                    };

                    //
                    // 4. Encodings
                    //

                    // 4.1 Encoders and decoders

                    /** @const */
                    var finished = -1;

                    /**
                     * @param {boolean} fatal If true, decoding errors raise an exception.
                     * @param {number=} opt_code_point Override the standard fallback code point.
                     * @return {number} The code point to insert on a decoding error.
                     */
                    function decoderError(fatal, opt_code_point) {
                        if (fatal)
                            throw TypeError('Decoder error');
                        return opt_code_point || 0xFFFD;
                    }

//
// 7. API
//

/** @const */ var DEFAULT_ENCODING = 'utf-8';

                    // 7.1 Interface TextDecoder

                    /**
                     * @constructor
                     * @param {string=} encoding The label of the encoding;
                     *     defaults to 'utf-8'.
                     * @param {Object=} options
                     */
                    function TextDecoder(encoding, options) {
                        if (!(this instanceof TextDecoder)) {
                            return new TextDecoder(encoding, options);
                        }
                        encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
                        if (encoding !== DEFAULT_ENCODING) {
                            throw new Error('Encoding not supported. Only utf-8 is supported');
                        }
                        options = ToDictionary(options);

                        /** @private @type {boolean} */
                        this._streaming = false;
                        /** @private @type {boolean} */
                        this._BOMseen = false;
                        /** @private @type {?Decoder} */
                        this._decoder = null;
                        /** @private @type {boolean} */
                        this._fatal = Boolean(options['fatal']);
                        /** @private @type {boolean} */
                        this._ignoreBOM = Boolean(options['ignoreBOM']);

                        Object.defineProperty(this, 'encoding', { value: 'utf-8' });
                        Object.defineProperty(this, 'fatal', { value: this._fatal });
                        Object.defineProperty(this, 'ignoreBOM', { value: this._ignoreBOM });
                    }

                    TextDecoder.prototype = {
                        /**
                         * @param {ArrayBufferView=} input The buffer of bytes to decode.
                         * @param {Object=} options
                         * @return {string} The decoded string.
                         */
                        decode: function decode(input, options) {
                            var bytes;
                            if (typeof input === 'object' && input instanceof ArrayBuffer) {
                                bytes = new Uint8Array(input);
                            } else if (typeof input === 'object' && 'buffer' in input &&
                                input.buffer instanceof ArrayBuffer) {
                                bytes = new Uint8Array(input.buffer,
                                    input.byteOffset,
                                    input.byteLength);
                            } else {
                                bytes = new Uint8Array(0);
                            }

                            options = ToDictionary(options);

                            if (!this._streaming) {
                                this._decoder = new UTF8Decoder({ fatal: this._fatal });
                                this._BOMseen = false;
                            }
                            this._streaming = Boolean(options['stream']);

                            var input_stream = new Stream(bytes);

                            var code_points = [];

                            /** @type {?(number|!Array.<number>)} */
                            var result;

                            while (!input_stream.endOfStream()) {
                                result = this._decoder.handler(input_stream, input_stream.read());
                                if (result === finished)
                                    break;
                                if (result === null)
                                    continue;
                                if (Array.isArray(result))
                                    code_points.push.apply(code_points, /**@type {!Array.<number>}*/(result));
                                else
                                    code_points.push(result);
                            }
                            if (!this._streaming) {
                                do {
                                    result = this._decoder.handler(input_stream, input_stream.read());
                                    if (result === finished)
                                        break;
                                    if (result === null)
                                        continue;
                                    if (Array.isArray(result))
                                        code_points.push.apply(code_points, /**@type {!Array.<number>}*/(result));
                                    else
                                        code_points.push(result);
                                } while (!input_stream.endOfStream());
                                this._decoder = null;
                            }

                            if (code_points.length) {
                                // If encoding is one of utf-8, utf-16be, and utf-16le, and
                                // ignore BOM flag and BOM seen flag are unset, run these
                                // subsubsteps:
                                if (['utf-8'].indexOf(this.encoding) !== -1 &&
                                    !this._ignoreBOM && !this._BOMseen) {
                                    // If token is U+FEFF, set BOM seen flag.
                                    if (code_points[0] === 0xFEFF) {
                                        this._BOMseen = true;
                                        code_points.shift();
                                    } else {
                                        // Otherwise, if token is not end-of-stream, set BOM seen
                                        // flag and append token to output.
                                        this._BOMseen = true;
                                    }
                                }
                            }

                            return codePointsToString(code_points);
                        }
                    };

                    // 7.2 Interface TextEncoder

                    /**
                     * @constructor
                     * @param {string=} encoding The label of the encoding;
                     *     defaults to 'utf-8'.
                     * @param {Object=} options
                     */
                    function TextEncoder(encoding, options) {
                        if (!(this instanceof TextEncoder))
                            return new TextEncoder(encoding, options);
                        encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
                        if (encoding !== DEFAULT_ENCODING) {
                            throw new Error('Encoding not supported. Only utf-8 is supported');
                        }
                        options = ToDictionary(options);

                        /** @private @type {boolean} */
                        this._streaming = false;
                        /** @private @type {?Encoder} */
                        this._encoder = null;
                        /** @private @type {{fatal: boolean}} */
                        this._options = { fatal: Boolean(options['fatal']) };

                        Object.defineProperty(this, 'encoding', { value: 'utf-8' });
                    }

                    TextEncoder.prototype = {
                        /**
                         * @param {string=} opt_string The string to encode.
                         * @param {Object=} options
                         * @return {Uint8Array} Encoded bytes, as a Uint8Array.
                         */
                        encode: function encode(opt_string, options) {
                            opt_string = opt_string ? String(opt_string) : '';
                            options = ToDictionary(options);

                            // NOTE: This option is nonstandard. None of the encodings
                            // permitted for encoding (i.e. UTF-8, UTF-16) are stateful,
                            // so streaming is not necessary.
                            if (!this._streaming)
                                this._encoder = new UTF8Encoder(this._options);
                            this._streaming = Boolean(options['stream']);

                            var bytes = [];
                            var input_stream = new Stream(stringToCodePoints(opt_string));
                            /** @type {?(number|!Array.<number>)} */
                            var result;
                            while (!input_stream.endOfStream()) {
                                result = this._encoder.handler(input_stream, input_stream.read());
                                if (result === finished)
                                    break;
                                if (Array.isArray(result))
                                    bytes.push.apply(bytes, /**@type {!Array.<number>}*/(result));
                                else
                                    bytes.push(result);
                            }
                            if (!this._streaming) {
                                while (true) {
                                    result = this._encoder.handler(input_stream, input_stream.read());
                                    if (result === finished)
                                        break;
                                    if (Array.isArray(result))
                                        bytes.push.apply(bytes, /**@type {!Array.<number>}*/(result));
                                    else
                                        bytes.push(result);
                                }
                                this._encoder = null;
                            }
                            return new Uint8Array(bytes);
                        }
                    };

                    //
                    // 8. The encoding
                    //

                    // 8.1 utf-8

                    /**
                     * @constructor
                     * @implements {Decoder}
                     * @param {{fatal: boolean}} options
                     */
                    function UTF8Decoder(options) {
                        var fatal = options.fatal;

                        // utf-8's decoder's has an associated utf-8 code point, utf-8
                        // bytes seen, and utf-8 bytes needed (all initially 0), a utf-8
                        // lower boundary (initially 0x80), and a utf-8 upper boundary
                        // (initially 0xBF).
                        var /** @type {number} */ utf8_code_point = 0,
      /** @type {number} */ utf8_bytes_seen = 0,
      /** @type {number} */ utf8_bytes_needed = 0,
      /** @type {number} */ utf8_lower_boundary = 0x80,
      /** @type {number} */ utf8_upper_boundary = 0xBF;

                        /**
                         * @param {Stream} stream The stream of bytes being decoded.
                         * @param {number} bite The next byte read from the stream.
                         * @return {?(number|!Array.<number>)} The next code point(s)
                         *     decoded, or null if not enough data exists in the input
                         *     stream to decode a complete code point.
                         */
                        this.handler = function (stream, bite) {
                            // 1. If byte is end-of-stream and utf-8 bytes needed is not 0,
                            // set utf-8 bytes needed to 0 and return error.
                            if (bite === end_of_stream && utf8_bytes_needed !== 0) {
                                utf8_bytes_needed = 0;
                                return decoderError(fatal);
                            }

                            // 2. If byte is end-of-stream, return finished.
                            if (bite === end_of_stream)
                                return finished;

                            // 3. If utf-8 bytes needed is 0, based on byte:
                            if (utf8_bytes_needed === 0) {

                                // 0x00 to 0x7F
                                if (inRange(bite, 0x00, 0x7F)) {
                                    // Return a code point whose value is byte.
                                    return bite;
                                }

                                // 0xC2 to 0xDF
                                if (inRange(bite, 0xC2, 0xDF)) {
                                    // Set utf-8 bytes needed to 1 and utf-8 code point to byte
                                    // âˆ’ 0xC0.
                                    utf8_bytes_needed = 1;
                                    utf8_code_point = bite - 0xC0;
                                }

                                // 0xE0 to 0xEF
                                else if (inRange(bite, 0xE0, 0xEF)) {
                                    // 1. If byte is 0xE0, set utf-8 lower boundary to 0xA0.
                                    if (bite === 0xE0)
                                        utf8_lower_boundary = 0xA0;
                                    // 2. If byte is 0xED, set utf-8 upper boundary to 0x9F.
                                    if (bite === 0xED)
                                        utf8_upper_boundary = 0x9F;
                                    // 3. Set utf-8 bytes needed to 2 and utf-8 code point to
                                    // byte âˆ’ 0xE0.
                                    utf8_bytes_needed = 2;
                                    utf8_code_point = bite - 0xE0;
                                }

                                // 0xF0 to 0xF4
                                else if (inRange(bite, 0xF0, 0xF4)) {
                                    // 1. If byte is 0xF0, set utf-8 lower boundary to 0x90.
                                    if (bite === 0xF0)
                                        utf8_lower_boundary = 0x90;
                                    // 2. If byte is 0xF4, set utf-8 upper boundary to 0x8F.
                                    if (bite === 0xF4)
                                        utf8_upper_boundary = 0x8F;
                                    // 3. Set utf-8 bytes needed to 3 and utf-8 code point to
                                    // byte âˆ’ 0xF0.
                                    utf8_bytes_needed = 3;
                                    utf8_code_point = bite - 0xF0;
                                }

                                // Otherwise
                                else {
                                    // Return error.
                                    return decoderError(fatal);
                                }

                                // Then (byte is in the range 0xC2 to 0xF4) set utf-8 code
                                // point to utf-8 code point << (6 Ã— utf-8 bytes needed) and
                                // return continue.
                                utf8_code_point = utf8_code_point << (6 * utf8_bytes_needed);
                                return null;
                            }

                            // 4. If byte is not in the range utf-8 lower boundary to utf-8
                            // upper boundary, run these substeps:
                            if (!inRange(bite, utf8_lower_boundary, utf8_upper_boundary)) {

                                // 1. Set utf-8 code point, utf-8 bytes needed, and utf-8
                                // bytes seen to 0, set utf-8 lower boundary to 0x80, and set
                                // utf-8 upper boundary to 0xBF.
                                utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
                                utf8_lower_boundary = 0x80;
                                utf8_upper_boundary = 0xBF;

                                // 2. Prepend byte to stream.
                                stream.prepend(bite);

                                // 3. Return error.
                                return decoderError(fatal);
                            }

                            // 5. Set utf-8 lower boundary to 0x80 and utf-8 upper boundary
                            // to 0xBF.
                            utf8_lower_boundary = 0x80;
                            utf8_upper_boundary = 0xBF;

                            // 6. Increase utf-8 bytes seen by one and set utf-8 code point
                            // to utf-8 code point + (byte âˆ’ 0x80) << (6 Ã— (utf-8 bytes
                            // needed âˆ’ utf-8 bytes seen)).
                            utf8_bytes_seen += 1;
                            utf8_code_point += (bite - 0x80) << (6 * (utf8_bytes_needed - utf8_bytes_seen));

                            // 7. If utf-8 bytes seen is not equal to utf-8 bytes needed,
                            // continue.
                            if (utf8_bytes_seen !== utf8_bytes_needed)
                                return null;

                            // 8. Let code point be utf-8 code point.
                            var code_point = utf8_code_point;

                            // 9. Set utf-8 code point, utf-8 bytes needed, and utf-8 bytes
                            // seen to 0.
                            utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;

                            // 10. Return a code point whose value is code point.
                            return code_point;
                        };
                    }

                    /**
                     * @constructor
                     * @implements {Encoder}
                     * @param {{fatal: boolean}} options
                     */
                    function UTF8Encoder(options) {
                        var fatal = options.fatal;
                        /**
                         * @param {Stream} stream Input stream.
                         * @param {number} code_point Next code point read from the stream.
                         * @return {(number|!Array.<number>)} Byte(s) to emit.
                         */
                        this.handler = function (stream, code_point) {
                            // 1. If code point is end-of-stream, return finished.
                            if (code_point === end_of_stream)
                                return finished;

                            // 2. If code point is in the range U+0000 to U+007F, return a
                            // byte whose value is code point.
                            if (inRange(code_point, 0x0000, 0x007f))
                                return code_point;

                            // 3. Set count and offset based on the range code point is in:
                            var count, offset;
                            // U+0080 to U+07FF:    1 and 0xC0
                            if (inRange(code_point, 0x0080, 0x07FF)) {
                                count = 1;
                                offset = 0xC0;
                            }
                            // U+0800 to U+FFFF:    2 and 0xE0
                            else if (inRange(code_point, 0x0800, 0xFFFF)) {
                                count = 2;
                                offset = 0xE0;
                            }
                            // U+10000 to U+10FFFF: 3 and 0xF0
                            else if (inRange(code_point, 0x10000, 0x10FFFF)) {
                                count = 3;
                                offset = 0xF0;
                            }

                            // 4.Let bytes be a byte sequence whose first byte is (code
                            // point >> (6 Ã— count)) + offset.
                            var bytes = [(code_point >> (6 * count)) + offset];

                            // 5. Run these substeps while count is greater than 0:
                            while (count > 0) {

                                // 1. Set temp to code point >> (6 Ã— (count âˆ’ 1)).
                                var temp = code_point >> (6 * (count - 1));

                                // 2. Append to bytes 0x80 | (temp & 0x3F).
                                bytes.push(0x80 | (temp & 0x3F));

                                // 3. Decrease count by one.
                                count -= 1;
                            }

                            // 6. Return bytes bytes, in order.
                            return bytes;
                        };
                    }

                    exports.p = TextEncoder;
                    exports.k = TextDecoder;

                    /***/
}),

/***/ 850:
/***/ ((module) => {

                    module.exports = extend

                    var hasOwnProperty = Object.prototype.hasOwnProperty;

                    function extend() {
                        var target = {}

                        for (var i = 0; i < arguments.length; i++) {
                            var source = arguments[i]

                            for (var key in source) {
                                if (hasOwnProperty.call(source, key)) {
                                    target[key] = source[key]
                                }
                            }
                        }

                        return target
                    }


                    /***/
})

            /******/
});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
                /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
                /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
            /******/
}
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
                /******/
};
            /******/
})();
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for (var key in definition) {
/******/ 				if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                        /******/
}
                    /******/
}
                /******/
};
            /******/
})();
/******/
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
                        /******/
}, []));
                /******/
};
            /******/
})();
/******/
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + { "25": "@atlaskit-internal_atlassian-legacy-light", "85": "@atlaskit-internal_atlassian-light-new-input-border", "210": "@atlaskit-internal_atlassian-shape", "211": "@atlaskit-internal_atlassian-typography", "214": "@atlaskit-internal_atlassian-legacy-dark", "216": "@atlaskit-internal_atlassian-dark-iteration", "334": "@atlaskit-internal_atlassian-light", "436": "@atlaskit-internal_atlassian-spacing", "903": "@atlaskit-internal_atlassian-dark", "942": "@atlaskit-internal_atlassian-dark-new-input-border" }[chunkId] + ".power-up.js";
                /******/
};
            /******/
})();
/******/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function () {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
                    /******/
} catch (e) {
/******/ 				if (typeof window === 'object') return window;
                    /******/
}
                /******/
})();
            /******/
})();
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
            /******/
})();
/******/
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "trello-for-websites:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if (inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if (key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for (var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if (s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
                        /******/
}
                    /******/
}
/******/ 			if (!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
                        /******/
}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
                    /******/
}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if (prev) return prev(event);
                    /******/
};
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
                /******/
};
            /******/
})();
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                    /******/
}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
                /******/
};
            /******/
})();
/******/
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if (scripts.length) scriptUrl = scripts[scripts.length - 1].src
                    /******/
}
                /******/
}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
            /******/
})();
/******/
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			179: 0
                /******/
};
/******/
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if (installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 					// a Promise means "currently loading".
/******/ 					if (installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
                        /******/
} else {
/******/ 						if (true) { // all chunks have JS
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => (installedChunkData = installedChunks[chunkId] = [resolve, reject]));
/******/ 							promises.push(installedChunkData[2] = promise);
/******/
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if (__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if (installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if (installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
                                        /******/
}
                                    /******/
}
                                /******/
};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);
                            /******/
} else installedChunks[chunkId] = 0;
                        /******/
}
                    /******/
}
                /******/
};
/******/
/******/ 		// no prefetching
/******/
/******/ 		// no preloaded
/******/
/******/ 		// no HMR
/******/
/******/ 		// no HMR manifest
/******/
/******/ 		// no on chunks loaded
/******/
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if (chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for (moduleId in moreModules) {
/******/ 					if (__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
                            /******/
}
                        /******/
}
/******/ 				if (runtime) var result = runtime(__webpack_require__);
                    /******/
}
/******/ 			if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for (; i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if (__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
                        /******/
}
/******/ 				installedChunks[chunkId] = 0;
                    /******/
}
                /******/
                /******/
}
/******/
/******/ 		var chunkLoadingGlobal = self["webpackChunktrello_for_websites"] = self["webpackChunktrello_for_websites"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
            /******/
})();
        /******/
        /************************************************************************/
        var __webpack_exports__ = {};
        // This entry need to be wrapped in an IIFE because it need to be in strict mode.
        (() => {
            "use strict";
            // ESM COMPAT FLAG
            __webpack_require__.r(__webpack_exports__);

            // EXTERNAL MODULE: ./node_modules/@atlassian/trello-post-message-io/dist/index.esm.js
            var index_esm = __webpack_require__(49);
            var index_esm_default = /*#__PURE__*/__webpack_require__.n(index_esm);
            // EXTERNAL MODULE: ./node_modules/bluebird/js/browser/bluebird.js
            var bluebird = __webpack_require__(21);
            var bluebird_default = /*#__PURE__*/__webpack_require__.n(bluebird);
            // EXTERNAL MODULE: ./node_modules/lodash.isfinite/index.js
            var lodash_isfinite = __webpack_require__(810);
            var lodash_isfinite_default = /*#__PURE__*/__webpack_require__.n(lodash_isfinite);
            ;// CONCATENATED MODULE: ./src/power-up-js/util/warn.js
/* eslint-disable no-console */
/* harmony default export */ const warn = (message => {
                if (window.console && typeof console.warn === 'function') {
                    console.warn(message);
                }
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/util/colors.js


            const colors = {
                blue: {
                    50: '#E4F0F6',
                    100: '#BCD9EA',
                    200: '#8BBDD9',
                    300: '#5BA4CF',
                    400: '#298FCA',
                    500: '#0079BF',
                    600: '#026AA7',
                    700: '#055A8C',
                    800: '#094C72',
                    900: '#0C3953'
                },
                green: {
                    50: '#EEF6EC',
                    100: '#D6ECD2',
                    200: '#B7DDB0',
                    300: '#99D18F',
                    400: '#7BC86C',
                    500: '#61BD4F',
                    600: '#5AAC44',
                    700: '#519839',
                    800: '#49852E',
                    900: '#3F6F21'
                },
                orange: {
                    50: '#FDF5EC',
                    100: '#FCE8D2',
                    200: '#FAD8B0',
                    300: '#FDC788',
                    400: '#FFB968',
                    500: '#FFAB4A',
                    600: '#E99E40',
                    700: '#D29034',
                    800: '#BB8129',
                    900: '#A0711C'
                },
                red: {
                    50: '#FBEDEB',
                    100: '#F5D3CE',
                    200: '#EFB3AB',
                    300: '#EC9488',
                    400: '#EF7564',
                    500: '#EB5A46',
                    600: '#CF513D',
                    700: '#B04632',
                    800: '#933B27',
                    900: '#6E2F1A'
                },
                yellow: {
                    50: '#FDFAE5',
                    100: '#FAF3C0',
                    200: '#F5EA92',
                    300: '#F3E260',
                    400: '#F5DD29',
                    500: '#F2D600',
                    600: '#E6C60D',
                    700: '#D9B51C',
                    800: '#CCA42B',
                    900: '#BD903C'
                },
                purple: {
                    50: '#F7F0FA',
                    100: '#EDDBF4',
                    200: '#DFC0EB',
                    300: '#D5A6E6',
                    400: '#CD8DE5',
                    500: '#C377E0',
                    600: '#A86CC1',
                    700: '#89609E',
                    800: '#6C547B',
                    900: '#484553'
                },
                pink: {
                    50: '#FEF2F9',
                    100: '#FCDEF0',
                    200: '#FAC6E5',
                    300: '#FFB0E1',
                    400: '#FF95D6',
                    500: '#FF80CE',
                    600: '#E76EB1',
                    700: '#CD5A91',
                    800: '#B44772',
                    900: '#96304C'
                },
                sky: {
                    50: '#E4F7FA',
                    100: '#BDECF3',
                    200: '#8FDFEB',
                    300: '#5DD3E5',
                    400: '#29CCE5',
                    500: '#00C2E0',
                    600: '#00AECC',
                    700: '#0098B7',
                    800: '#0082A0',
                    900: '#006988'
                },
                lime: {
                    50: '#ECFBF3',
                    100: '#D3F6E4',
                    200: '#B3F1D0',
                    300: '#90ECC1',
                    400: '#6DECA9',
                    500: '#51E898',
                    600: '#4FD683',
                    700: '#4DC26B',
                    800: '#4CAF54',
                    900: '#4A9839'
                },
                gray: {
                    50: '#F8F9F9',
                    100: '#EDEFF0',
                    200: '#E2E4E6',
                    300: '#D6DADC',
                    400: '#CDD2D4',
                    500: '#C4C9CC',
                    600: '#B6BBBF',
                    700: '#A5ACB0',
                    800: '#959DA1',
                    900: '#838C91'
                },
                black: {
                    50: '#C1C7D0',
                    100: '#7A869A',
                    200: '#6B778C',
                    300: '#5E6C84',
                    400: '#505F79',
                    500: '#42526E',
                    600: '#344563',
                    700: '#253858',
                    800: '#172B4D',
                    900: '#091E42'
                },
                'business-blue': {
                    50: '#EDEFF4',
                    100: '#D2D7E5',
                    200: '#B2B9D0',
                    300: '#838FB5',
                    400: '#6170A1',
                    500: '#42548E',
                    600: '#3E4D80',
                    700: '#3A476F',
                    800: '#36405F',
                    900: '#30364C'
                },
                shades: {
                    0: '#FFFFFF',
                    10: '#FAFCFC',
                    20: '#F5F6F7',
                    30: '#EBEEF0',
                    // card back background
                    40: '#DFE3E6',
                    50: '#C2CCD1',
                    60: '#B3BAC5',
                    70: '#A6B3BA',
                    80: '#97A7B0',
                    90: '#899AA3',
                    100: '#798D99',
                    // icon color - default
                    200: '#6B808C',
                    // quiet text
                    300: '#5E7785',
                    400: '#516B7A',
                    // icon color - dark
                    500: '#425E6E',
                    600: '#355263',
                    // black label
                    700: '#254659',
                    800: '#17394D',
                    // default text color
                    900: '#092D42'
                }
            };
            colors.neutrals = colors.shades;
            const getHexString = (name, weight) => {
                warn('The colors utility has been deprecated and will be removed in future versions. Please refer to the Color Theme Compliance docs for an alternative, see: https://developer.atlassian.com/cloud/trello/power-ups/color-theme-compliance/using-atlassian-design-tokens/#how-do-i-get-the-value-of-a-token-in-javascript-');
                if (!name || typeof name !== 'string') {
                    throw new Error('Invalid color name');
                }
                const colorName = name.toLowerCase();
                if (!colors[colorName]) {
                    throw new Error(`Unknown color name: ${colorName}`);
                }
                const colorWeight = lodash_isfinite_default()(weight) ? weight : 500;
                if (!colors[colorName][colorWeight]) {
                    throw new Error(`Unknown color weight: ${colorWeight}`);
                }
                return colors[colorName][colorWeight];
            };
            const namedColorStringToHex = s => {
                if (!s || typeof s !== 'string') {
                    throw new Error('Invalid named color string');
                }
                if (/^#[a-fA-F0-9]{6}$/.test(s)) {
                    return s;
                }

                // example strings: "blue", "business-blue", "green#50", "business-blue#200"
                const colorParts = /^([a-zA-Z-]+)(#[1-9]?0?0)?$/.exec(s);
                if (!colorParts) {
                    throw new Error('Invalid accentColor provided');
                }
                const colorName = colorParts[1];
                let colorWeight = 500;
                if (colorParts[2]) {
                    colorWeight = parseInt(colorParts[2].substring(1), 10);
                }
                return getHexString(colorName, colorWeight);
            };

            ;// CONCATENATED MODULE: ./src/power-up-js/util/convert.js
            function bytesToHexString(bytes) {
                if (!bytes) {
                    return null;
                }
                // Check the incoming bytes to make sure there are no overflows that can't fit in
                // a Uint8Array (so anything over 255)
                // Why not use something like bytes.some(function (b) { b > 255 ... }) ?
                // Because for typed arrays that is not supported by IE or Safari under 10
                for (let i = 0; i < bytes.length; i += 1) {
                    const b = bytes[i];
                    if (typeof b !== 'number' || b % 1 !== 0 || b > 255 || b < 0) {
                        throw new Error('Invalid bytes. Bytes must be 0 - 255');
                    }
                }
                const buff = new Uint8Array(bytes);
                const hexBytes = [];
                for (let j = 0; j < buff.length; j += 1) {
                    let byteString = buff[j].toString(16);
                    if (byteString.length < 2) {
                        byteString = `0${byteString}`;
                    }
                    hexBytes.push(byteString);
                }
                return hexBytes.join('');
            }
            function hexStringToUint8Array(hexString) {
                if (!hexString) {
                    throw new Error('Invalid hexString');
                }
                const hex = hexString.toLowerCase();
                if (!/^[0-9a-f]+$/.test(hex) || hex.length % 2 !== 0) {
                    throw new Error('Invalid hexString');
                }
                const arrayBuffer = new Uint8Array(hex.length / 2);
                for (let i = 0; i < hex.length; i += 2) {
                    const byteValue = parseInt(hex.substr(i, 2), 16);
                    // eslint-disable-next-line no-restricted-globals
                    if (isNaN(byteValue)) {
                        throw new Error('Invalid hexString');
                    }
                    arrayBuffer[i / 2] = byteValue;
                }
                return arrayBuffer;
            }
            // EXTERNAL MODULE: ./node_modules/text-encoding-utf-8/lib/encoding.lib.js
            var encoding_lib = __webpack_require__(604);
            ;// CONCATENATED MODULE: ./src/power-up-js/util/simple-crypto.js
            /*
            
            The intention of simple-crypto is to expose AES-CBC encryption & decryption methods in an
            easy to use manner, in a way that works across as many browsers as reasonable.
            
            Current Browser Support:
            
            Chrome: 41+
            Edge: 14+
            Firefox: 36+
            IE: 11+
            Safari: 7.1+ (Maverics or newer)
            iPhone: iOS 8+
            Android: 4.4+
            
            Why use AES-CBC which has no validation/integrity check built into the algorithm instead of
            something like AES-GCM which does? AES-GCM is sadly not supported on Safari, and therefore, AES-CBC
            was the greatest common denominator, being the most widely supported across browsers.
            
            Instead we use a SHA256 digest to build in our own integrity check on top of AES-CBC.
            
            */




            const isFunc = test => typeof test === 'function';
            const Encoder = isFunc(window.TextEncoder) ? window.TextEncoder : encoding_lib/* TextEncoder */.p;
            const Decoder = isFunc(window.TextDecoder) ? window.TextDecoder : encoding_lib/* TextDecoder */.k;

            // Constant Encryption Settings
            const mode = 'AES-CBC';
            const aesOpts = {
                name: mode,
                length: 256
            };
            const exportable = true;
            const keyUses = ['encrypt', 'decrypt'];

            // Select the right subtleCrypto function based on the browser
            const useWindowCrypto = typeof window.crypto === 'object'; // Chrome, Firefox, Safari, Edge
            const useMsCrypto = !useWindowCrypto && typeof window.msCrypto === 'object'; // IE11

            let subtle;
            if (useWindowCrypto) {
                // Safari still prefixes the subtle methods, so fix that if necessary
                if (window.crypto.subtle == null && window.crypto.webkitSubtle != null) {
                    subtle = window.crypto.webkitSubtle;
                } else {
                    // eslint-disable-next-line prefer-destructuring
                    subtle = window.crypto.subtle;
                }
            } else if (useMsCrypto) {
                // eslint-disable-next-line prefer-destructuring
                subtle = window.msCrypto.subtle;
            }
            const SHA256Digest = text => {
                const textBuff = new Encoder().encode(text);
                return new (bluebird_default())((resolve, reject) => {
                    if (useWindowCrypto) {
                        // The digest will be an ArrayBuffer, we want to convert that to a hex string
                        subtle.digest({
                            name: 'SHA-256'
                        }, textBuff).then(digest => resolve(bytesToHexString(digest)));
                    } else if (useMsCrypto) {
                        const digestOp = subtle.digest({
                            name: 'SHA-256'
                        }, textBuff);
                        digestOp.oncomplete = e => {
                            resolve(bytesToHexString(e.target.result));
                        };
                        digestOp.onerror = err => {
                            reject(new Error(`Error digesting text: ${err.type}`));
                        };
                    } else {
                        reject(new Error('Browser not supported.'));
                    }
                });
            };
/* harmony default export */ const simple_crypto = ({
                // synchronously generate an initialization vector for later use during encryption
                generateInitVector: () => {
                    if (useWindowCrypto && typeof window.crypto.getRandomValues === 'function') {
                        return window.crypto.getRandomValues(new Uint8Array(16));
                    }
                    if (useMsCrypto && typeof window.msCrypto.getRandomValues === 'function') {
                        // IE11 fallback
                        return window.msCrypto.getRandomValues(new Uint8Array(16));
                    }
                    throw new Error('Browser not supported.');
                },
                // returns a promise that resolves to an AES-CBC 256 bit encryption key
                generateAESCBCKey: () => new (bluebird_default())((resolve, reject) => {
                    if (useWindowCrypto) {
                        resolve(subtle.generateKey(aesOpts, exportable, keyUses));
                    } else if (useMsCrypto) {
                        // IE11 uses msCrypto, which doesn't support Promises
                        const keyOp = subtle.generateKey(aesOpts, exportable, keyUses);
                        keyOp.oncomplete = e => {
                            resolve(e.target.result);
                        };
                        keyOp.onerror = err => {
                            reject(new Error(`Error generating key: ${err.type}`));
                        };
                    } else {
                        reject(new Error('Browser not supported.'));
                    }
                }),
                // given a hex string representing a raw exported encryption key
                // return promise that resolves to the actual key
                importAESCBCKeyFromRaw: rawHexString => {
                    const hexAsBuff = hexStringToUint8Array(rawHexString);
                    return new (bluebird_default())((resolve, reject) => {
                        if (useWindowCrypto) {
                            resolve(subtle.importKey('raw', hexAsBuff, mode, exportable, keyUses));
                        } else if (useMsCrypto) {
                            // IE11 uses msCrypto, which doesn't support Promises
                            const importOp = subtle.importKey('raw', hexAsBuff, mode, exportable, keyUses);
                            importOp.oncomplete = e => {
                                resolve(e.target.result);
                            };
                            importOp.onerror = err => {
                                reject(new Error(`Error importing key: ${err.type}`));
                            };
                        } else {
                            reject(new Error('Browser not supported.'));
                        }
                    });
                },
                // returns a hex string representation of the encryption key
                exportAESCBCKeyToRaw: key => new (bluebird_default())((resolve, reject) => {
                    if (useWindowCrypto) {
                        subtle.exportKey('raw', key).then(raw => resolve(bytesToHexString(raw)));
                    } else if (useMsCrypto) {
                        const exportOp = subtle.exportKey('raw', key);
                        exportOp.oncomplete = e => {
                            resolve(bytesToHexString(e.target.result));
                        };
                        exportOp.onerror = err => {
                            reject(new Error(`Error exporting key: ${err.type}`));
                        };
                    } else {
                        reject(new Error('Browser not supported.'));
                    }
                }),
                // returns a Promise that resolves to a hex string representation of the encrypted secret.
                // The secret should be a valid UTF-8 string
                encryptSecret: (initVector, key, secret) => SHA256Digest(secret).then(digest => {
                    // prepend the plaintext with its SHA256 digest
                    const secretBuff = new Encoder().encode(digest + secret);
                    if (useWindowCrypto) {
                        return subtle.encrypt({
                            name: mode,
                            iv: initVector
                        }, key, secretBuff).then(encrypted => bytesToHexString(encrypted));
                    }
                    if (useMsCrypto) {
                        return new (bluebird_default())((resolve, reject) => {
                            const encryptOp = subtle.encrypt({
                                name: mode,
                                iv: initVector
                            }, key, secretBuff);
                            encryptOp.oncomplete = e => {
                                resolve(bytesToHexString(e.target.result));
                            };
                            encryptOp.onerror = err => {
                                reject(new Error(`Error encrypting secret: ${err.type}`));
                            };
                        });
                    }
                    return bluebird_default().reject(new Error('Browser not supported.'));
                }),
                // takes the initialization vector and key that were used to encrypt the secret originally, as
                // well as the encryptedSecret as a hexString, and returns a Promise that resolves to the
                // decrypted secret as a UTF-8 string
                decryptSecret: (initVector, key, encryptedSecret) => {
                    const encryptedAsBuff = hexStringToUint8Array(encryptedSecret);
                    return new (bluebird_default())((resolve, reject) => {
                        if (useWindowCrypto) {
                            subtle.decrypt({
                                name: mode,
                                iv: initVector
                            }, key, encryptedAsBuff).then(decrypted => {
                                resolve(new Decoder().decode(decrypted));
                            }).catch(err => {
                                reject(new Error(`Decryption failed. Message: ${err.message}`));
                            });
                        } else if (useMsCrypto) {
                            const decryptOp = subtle.decrypt({
                                name: mode,
                                iv: initVector
                            }, key, encryptedAsBuff);
                            decryptOp.oncomplete = e => {
                                resolve(new Decoder().decode(e.target.result));
                            };
                            decryptOp.onerror = err => {
                                reject(new Error(`Decryption failed. Message: ${err.type}`));
                            };
                        } else {
                            reject(new Error('Browser not supported.'));
                        }
                    }).then(decrypted => {
                        // verify the integrity of the decrypted plaintext
                        const mac = decrypted.substring(0, 64);
                        const plaintext = decrypted.substring(64);
                        if (!/^[a-f0-9]{64}$/.test(mac)) {
                            throw new Error('Decryption failed. Unable to validate integrity.');
                        }
                        return SHA256Digest(plaintext).then(digest => {
                            if (digest === mac) {
                                return plaintext;
                            }
                            throw new Error('Decryption failed. Unable to validate integrity.');
                        });
                    });
                },
                // returns a Promise that resolves to a hex string representing the SHA256 digest of the provided
                // UTF-8 text
                sha256Digest: SHA256Digest
            });
            // EXTERNAL MODULE: ./node_modules/lodash.get/index.js
            var lodash_get = __webpack_require__(917);
            var lodash_get_default = /*#__PURE__*/__webpack_require__.n(lodash_get);
            // EXTERNAL MODULE: ./node_modules/make-error/index.js
            var make_error = __webpack_require__(950);
            var make_error_default = /*#__PURE__*/__webpack_require__.n(make_error);
            ;// CONCATENATED MODULE: ./src/power-up-js/util/make-error-enum.js

            const reservedBaseName = 'Error';
/* harmony default export */ const make_error_enum = ((namespace, names) => {
                const baseClass = make_error_default()([namespace, reservedBaseName].join('::'));
                names.forEach(name => {
                    baseClass[name] = make_error_default()([namespace, name].join('::'), baseClass);
                });
                return baseClass;
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/i18n-error.js

/* harmony default export */ const i18n_error = (make_error_enum('i18n', ['ArgNotFound', 'InvalidResourceUrl', 'KeyNotFound', 'LoadLocalizerNotAFunction', 'LocaleNotFound', 'LocaleNotSpecified', 'LocalizerNotFound', 'MissingDefaultLocale', 'MissingResourceUrl', 'MissingSupportedLocales', 'UnableToParseArgs', 'UnableToParseAttrs', 'Unknown', 'UnsupportedKeyType']));
            ;// CONCATENATED MODULE: ./src/power-up-js/i18n.js



            const urlForLocale = (baseResourceUrl, locale) => {
                if (!baseResourceUrl.includes('{locale}')) {
                    throw new i18n_error.InvalidResourceUrl('ResourceUrl must specify where to place locale with {locale}');
                }
                return baseResourceUrl.replace('{locale}', locale);
            };
            const closestSupportedLocale = (requestedLocale, defaultLocale, supportedLocales) => {
                if (supportedLocales.includes(requestedLocale)) {
                    return requestedLocale;
                }
                if (requestedLocale.includes('-')) {
                    return closestSupportedLocale(requestedLocale.split('-')[0], defaultLocale, supportedLocales);
                }
                return defaultLocale;
            };
            class Localizer {
                constructor(resourceDictionary) {
                    this.resourceDictionary = resourceDictionary;
                }
                localize(key, args) {
                    let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
                        dotNotation: false
                    };
                    const rawString = opts !== null && opts !== void 0 && opts.dotNotation ? lodash_get_default()(this.resourceDictionary, key) : this.resourceDictionary[key];
                    if (rawString != null) {
                        if (args) {
                            const holeRegex = opts !== null && opts !== void 0 && opts.dotNotation ? /\{(\w+?(?:\.\w+?)*\w+?)\}/gi : /\{(\w+?)\}/gi;
                            let formattedString = '';
                            let hole = holeRegex.exec(rawString);
                            let index = 0;
                            while (hole) {
                                if (hole.index > index) {
                                    formattedString += rawString.substring(index, hole.index);
                                }
                                const replacement = opts !== null && opts !== void 0 && opts.dotNotation ? lodash_get_default()(args, hole[1]) : args[hole[1]];
                                if (replacement !== undefined) {
                                    formattedString += replacement;
                                    index = hole.index + hole[0].length;
                                } else {
                                    throw new i18n_error.ArgNotFound(`Arg: ${hole[1]} was not defined for key: ${key}`);
                                }
                                hole = holeRegex.exec(rawString);
                            }
                            formattedString += rawString.substring(index);
                            return formattedString;
                        }
                        return rawString;
                    }
                    throw new i18n_error.KeyNotFound(`No resource defined for key: ${key}`);
                }
            }
            let loadOnce;
            let localizer;
            let activeLocale = '';
            const loadLocalizer = (requested, defaultLocale, supported, resourceUrl) => bluebird_default()["try"](() => {
                let targetLocale;
                if (!requested) {
                    targetLocale = defaultLocale;
                } else {
                    targetLocale = closestSupportedLocale(requested, defaultLocale, supported);
                }
                if (targetLocale === activeLocale && localizer) {
                    return localizer;
                }
                if (!loadOnce) {
                    loadOnce = new (bluebird_default())((resolve, reject) => {
                        const request = new XMLHttpRequest();
                        request.open('GET', urlForLocale(resourceUrl, targetLocale), true);
                        request.onload = () => {
                            try {
                                if (request.status === 200) {
                                    const resources = JSON.parse(request.responseText);
                                    localizer = new Localizer(resources);
                                    activeLocale = targetLocale;
                                    return resolve(localizer);
                                }
                                if (request.status === 404) {
                                    return reject(new i18n_error.LocaleNotFound(`${targetLocale} not found.`));
                                }
                                return reject(new i18n_error.Unknown(`Unable to load locale: ${targetLocale}, status: ${request.status}`));
                            } catch (ex) {
                                return reject(new i18n_error.Unknown(ex.message));
                            }
                        };
                        request.send();
                    });
                }
                return loadOnce;
            });
            const i18n_reset = () => {
                loadOnce = undefined;
                localizer = undefined;
                activeLocale = '';
            };
/* harmony default export */ const i18n = ({
                loadLocalizer
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/initialize-i18n.js



/* harmony default export */ const initialize_i18n = ((locale, options) => {
                const opts = options || {};
                let errmsg = '';
                if (!locale) {
                    errmsg = 'Unable to load a localizer without a locale';
                    return bluebird_default().reject(new i18n_error.LocaleNotSpecified(errmsg));
                }
                if (window.localizer) {
                    return bluebird_default().resolve();
                }
                if (opts.localizer) {
                    window.localizer = opts.localizer;
                } else if (opts.loadLocalizer) {
                    if (typeof opts.loadLocalizer === 'function') {
                        return bluebird_default().resolve(opts.loadLocalizer(locale)).then(localizer => {
                            window.localizer = localizer;
                            return bluebird_default().resolve();
                        });
                    }
                    errmsg = 'Specified loadLocalizer must be a function that returns a localizer or a Promise resolving to a localizer';
                    return bluebird_default().reject(new i18n_error.LoadLocalizerNotAFunction(errmsg));
                } else if (opts.localization) {
                    const {
                        defaultLocale,
                        supportedLocales,
                        resourceUrl
                    } = opts.localization;
                    if (!defaultLocale) {
                        return bluebird_default().reject(new i18n_error.MissingDefaultLocale('Missing defaultLocale'));
                    }
                    if (!supportedLocales) {
                        return bluebird_default().reject(new i18n_error.MissingSupportedLocales('Missing supportedLocales'));
                    }
                    if (!resourceUrl) {
                        return bluebird_default().reject(new i18n_error.MissingResourceUrl('Missing resourceUrl'));
                    }
                    return i18n.loadLocalizer(locale, defaultLocale, supportedLocales, resourceUrl).then(localizer => {
                        window.localizer = localizer;
                        return bluebird_default().resolve();
                    });
                }
                return bluebird_default().resolve();
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/util/localize.js

            const localizeKey = function (key, data) {
                let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
                    dotNotation: false
                };
                if (window.localizer && typeof window.localizer.localize === 'function') {
                    return window.localizer.localize(key, data, opts);
                }
                throw new i18n_error.LocalizerNotFound('No localizer available for localization.');
            };
            const localizeKeys = function (keys) {
                let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                    dotNotation: false
                };
                if (!keys) {
                    return [];
                }
                return keys.map(key => {
                    if (typeof key === 'string') {
                        return localizeKey(key, {}, opts);
                    }
                    if (Array.isArray(key)) {
                        return localizeKey(key[0], key[1], opts);
                    }
                    throw new i18n_error.UnsupportedKeyType(`localizeKeys doesn't recognize the supplied key type: ${typeof key}`);
                });
            };
            const localizeNode = function (node) {
                let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
                    dotNotation: false
                };
                const localizableNodes = node.querySelectorAll('[data-i18n-id],[data-i18n-attrs]');
                for (let i = 0, len = localizableNodes.length; i < len; i += 1) {
                    let replacementArgs = {};
                    const element = localizableNodes[i];
                    if (element.dataset.i18nArgs) {
                        try {
                            replacementArgs = JSON.parse(element.dataset.i18nArgs);
                        } catch (ex) {
                            throw new i18n_error.UnableToParseArgs(`Error parsing args. Error: ${ex.message}`);
                        }
                    }
                    if (element.dataset.i18nId) {
                        element.textContent = localizeKey(element.dataset.i18nId, replacementArgs, opts);
                    }
                    if (element.dataset.i18nAttrs) {
                        let requestedAttributes;
                        try {
                            requestedAttributes = JSON.parse(element.dataset.i18nAttrs);
                        } catch (ex) {
                            throw new i18n_error.UnableToParseAttrs(`Error parsing attrs. Error: ${ex.message}`);
                        }
                        if (requestedAttributes && requestedAttributes.placeholder) {
                            element.placeholder = localizeKey(requestedAttributes.placeholder, replacementArgs, opts);
                        }
                    }
                }
            };

            ;// CONCATENATED MODULE: ./src/power-up-js/util/relative-url.js
/* harmony default export */ const relative_url = (url => {
                if (/^https?:\/\//.test(url)) {
                    return url;
                }

                // IE has no location.origin until IE11 ...
                const origin = window.location.origin || `${window.location.protocol}//${window.location.host}`;

                // strip the last bit from the current path
                const basePath = window.location.pathname.replace(/[^/]+$/, '');

                // protocol relative URLs
                if (/^\/\//.test(url)) {
                    return [origin, url.substring(1)].join('');
                }

                // root relative URLs
                if (/^\//.test(url)) {
                    return [origin, url].join('');
                }
                return [origin, basePath, url].join('');
            });
            // EXTERNAL MODULE: ./node_modules/lodash.has/index.js
            var lodash_has = __webpack_require__(991);
            var lodash_has_default = /*#__PURE__*/__webpack_require__.n(lodash_has);
            ;// CONCATENATED MODULE: ./src/power-up-js/callback-cache.js



            const temporary = {};
            const retained = {};
            let index = 0;
            setInterval(() => {
                const refs = Object.keys(temporary);
                const now = Date.now();
                refs.forEach(ref => {
                    const entry = temporary[ref];
                    if (entry.expires < now) {
                        delete temporary[ref];
                    }
                });
            }, 30000);
/* harmony default export */ const callback_cache = ({
                callback: (t, options, serializeResult) => {
                    const ref = options.callback;
                    const {
                        action
                    } = options;
                    const args = options.options;
                    return bluebird_default()["try"](() => {
                        switch (action) {
                            case 'run':
                                if (lodash_has_default()(retained, ref)) {
                                    return retained[ref].call(null, t, args);
                                }
                                // fallback and check the temporary cache in case it hadn't been retained
                                if (lodash_has_default()(temporary, ref)) {
                                    retained[ref] = temporary[ref].fx;
                                    delete temporary[ref];
                                    return retained[ref].call(null, t, args);
                                }
                                warn('Attempted to run callback that does not exist or was not retained');
                                throw t.NotHandled('callback does not exist or was not retained');
                            case 'retain':
                                if (lodash_has_default()(temporary, ref)) {
                                    retained[ref] = temporary[ref].fx;
                                    delete temporary[ref];
                                    return ref;
                                }
                                warn('Attempted to retain callback that does not exist');
                                throw t.NotHandled('callback can no longer be retained');
                            case 'release':
                                if (lodash_has_default()(retained, ref)) {
                                    delete retained[ref];
                                    return null;
                                }
                                warn('Attempted to release callback that is not retained');
                                return null;
                            default:
                                warn('Attempted an unknown callback action');
                                throw t.NotHandled('unknown callback action');
                        }
                    }).then(serializeResult);
                },
                serialize: fx => {
                    const ref = `cb${index += 1}`;
                    temporary[ref] = {
                        fx,
                        expires: Date.now() + 120000 // keep around for 2 minutes
                    };

                    return {
                        _callback: ref
                    };
                },
                reset: () => {
                    index = 0;
                    Object.keys(temporary).forEach(ref => {
                        delete temporary[ref];
                    });
                    Object.keys(retained).forEach(ref => {
                        delete retained[ref];
                    });
                }
            });
            // EXTERNAL MODULE: ./node_modules/xtend/immutable.js
            var immutable = __webpack_require__(850);
            var immutable_default = /*#__PURE__*/__webpack_require__.n(immutable);
            // EXTERNAL MODULE: ./node_modules/lodash.includes/index.js
            var lodash_includes = __webpack_require__(244);
            var lodash_includes_default = /*#__PURE__*/__webpack_require__.n(lodash_includes);
            // EXTERNAL MODULE: ./node_modules/lodash.iselement/index.js
            var lodash_iselement = __webpack_require__(427);
            var lodash_iselement_default = /*#__PURE__*/__webpack_require__.n(lodash_iselement);
            // EXTERNAL MODULE: ./node_modules/lodash.isstring/index.js
            var lodash_isstring = __webpack_require__(217);
            var lodash_isstring_default = /*#__PURE__*/__webpack_require__.n(lodash_isstring);
            // EXTERNAL MODULE: ./node_modules/lodash.pick/index.js
            var lodash_pick = __webpack_require__(230);
            var lodash_pick_default = /*#__PURE__*/__webpack_require__.n(lodash_pick);
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/esm/artifacts/token-names.js
            /**
             * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
             * @codegen <<SignedSource::462a85d7e15b8fb4e0c4225b94e89903>>
             * @codegenCommand yarn build tokens
             */
            var tokens = {
                'border.radius.050': '--ds-radius-050',
                'border.radius.100': '--ds-radius-100',
                'border.radius.200': '--ds-radius-200',
                'border.radius.300': '--ds-radius-300',
                'border.radius.400': '--ds-radius-400',
                'border.radius.round': '--ds-radius-round',
                'border.width.0': '--ds-width-0',
                'border.width.050': '--ds-width-050',
                'border.width.100': '--ds-width-100',
                'color.text': '--ds-text',
                'color.text.accent.red': '--ds-text-accent-red',
                'color.text.accent.red.bolder': '--ds-text-accent-red-bolder',
                'color.text.accent.orange': '--ds-text-accent-orange',
                'color.text.accent.orange.bolder': '--ds-text-accent-orange-bolder',
                'color.text.accent.yellow': '--ds-text-accent-yellow',
                'color.text.accent.yellow.bolder': '--ds-text-accent-yellow-bolder',
                'color.text.accent.green': '--ds-text-accent-green',
                'color.text.accent.green.bolder': '--ds-text-accent-green-bolder',
                'color.text.accent.teal': '--ds-text-accent-teal',
                'color.text.accent.teal.bolder': '--ds-text-accent-teal-bolder',
                'color.text.accent.blue': '--ds-text-accent-blue',
                'color.text.accent.blue.bolder': '--ds-text-accent-blue-bolder',
                'color.text.accent.purple': '--ds-text-accent-purple',
                'color.text.accent.purple.bolder': '--ds-text-accent-purple-bolder',
                'color.text.accent.magenta': '--ds-text-accent-magenta',
                'color.text.accent.magenta.bolder': '--ds-text-accent-magenta-bolder',
                'color.text.accent.gray': '--ds-text-accent-gray',
                'color.text.accent.gray.bolder': '--ds-text-accent-gray-bolder',
                'color.text.disabled': '--ds-text-disabled',
                'color.text.inverse': '--ds-text-inverse',
                'color.text.selected': '--ds-text-selected',
                'color.text.brand': '--ds-text-brand',
                'color.text.danger': '--ds-text-danger',
                'color.text.warning': '--ds-text-warning',
                'color.text.warning.inverse': '--ds-text-warning-inverse',
                'color.text.success': '--ds-text-success',
                'color.text.discovery': '--ds-text-discovery',
                'color.text.information': '--ds-text-information',
                'color.text.subtlest': '--ds-text-subtlest',
                'color.text.subtle': '--ds-text-subtle',
                'color.link': '--ds-link',
                'color.link.pressed': '--ds-link-pressed',
                'color.icon': '--ds-icon',
                'color.icon.accent.red': '--ds-icon-accent-red',
                'color.icon.accent.orange': '--ds-icon-accent-orange',
                'color.icon.accent.yellow': '--ds-icon-accent-yellow',
                'color.icon.accent.green': '--ds-icon-accent-green',
                'color.icon.accent.teal': '--ds-icon-accent-teal',
                'color.icon.accent.blue': '--ds-icon-accent-blue',
                'color.icon.accent.purple': '--ds-icon-accent-purple',
                'color.icon.accent.magenta': '--ds-icon-accent-magenta',
                'color.icon.accent.gray': '--ds-icon-accent-gray',
                'color.icon.disabled': '--ds-icon-disabled',
                'color.icon.inverse': '--ds-icon-inverse',
                'color.icon.selected': '--ds-icon-selected',
                'color.icon.brand': '--ds-icon-brand',
                'color.icon.danger': '--ds-icon-danger',
                'color.icon.warning': '--ds-icon-warning',
                'color.icon.warning.inverse': '--ds-icon-warning-inverse',
                'color.icon.success': '--ds-icon-success',
                'color.icon.discovery': '--ds-icon-discovery',
                'color.icon.information': '--ds-icon-information',
                'color.icon.subtle': '--ds-icon-subtle',
                'color.border': '--ds-border',
                'color.border.accent.red': '--ds-border-accent-red',
                'color.border.accent.orange': '--ds-border-accent-orange',
                'color.border.accent.yellow': '--ds-border-accent-yellow',
                'color.border.accent.green': '--ds-border-accent-green',
                'color.border.accent.teal': '--ds-border-accent-teal',
                'color.border.accent.blue': '--ds-border-accent-blue',
                'color.border.accent.purple': '--ds-border-accent-purple',
                'color.border.accent.magenta': '--ds-border-accent-magenta',
                'color.border.accent.gray': '--ds-border-accent-gray',
                'color.border.disabled': '--ds-border-disabled',
                'color.border.focused': '--ds-border-focused',
                'color.border.input': '--ds-border-input',
                'color.border.inverse': '--ds-border-inverse',
                'color.border.selected': '--ds-border-selected',
                'color.border.brand': '--ds-border-brand',
                'color.border.danger': '--ds-border-danger',
                'color.border.warning': '--ds-border-warning',
                'color.border.success': '--ds-border-success',
                'color.border.discovery': '--ds-border-discovery',
                'color.border.information': '--ds-border-information',
                'color.border.bold': '--ds-border-bold',
                'color.background.accent.red.subtlest': '--ds-background-accent-red-subtlest',
                'color.background.accent.red.subtler': '--ds-background-accent-red-subtler',
                'color.background.accent.red.subtle': '--ds-background-accent-red-subtle',
                'color.background.accent.red.bolder': '--ds-background-accent-red-bolder',
                'color.background.accent.orange.subtlest': '--ds-background-accent-orange-subtlest',
                'color.background.accent.orange.subtler': '--ds-background-accent-orange-subtler',
                'color.background.accent.orange.subtle': '--ds-background-accent-orange-subtle',
                'color.background.accent.orange.bolder': '--ds-background-accent-orange-bolder',
                'color.background.accent.yellow.subtlest': '--ds-background-accent-yellow-subtlest',
                'color.background.accent.yellow.subtler': '--ds-background-accent-yellow-subtler',
                'color.background.accent.yellow.subtle': '--ds-background-accent-yellow-subtle',
                'color.background.accent.yellow.bolder': '--ds-background-accent-yellow-bolder',
                'color.background.accent.green.subtlest': '--ds-background-accent-green-subtlest',
                'color.background.accent.green.subtler': '--ds-background-accent-green-subtler',
                'color.background.accent.green.subtle': '--ds-background-accent-green-subtle',
                'color.background.accent.green.bolder': '--ds-background-accent-green-bolder',
                'color.background.accent.teal.subtlest': '--ds-background-accent-teal-subtlest',
                'color.background.accent.teal.subtler': '--ds-background-accent-teal-subtler',
                'color.background.accent.teal.subtle': '--ds-background-accent-teal-subtle',
                'color.background.accent.teal.bolder': '--ds-background-accent-teal-bolder',
                'color.background.accent.blue.subtlest': '--ds-background-accent-blue-subtlest',
                'color.background.accent.blue.subtler': '--ds-background-accent-blue-subtler',
                'color.background.accent.blue.subtle': '--ds-background-accent-blue-subtle',
                'color.background.accent.blue.bolder': '--ds-background-accent-blue-bolder',
                'color.background.accent.purple.subtlest': '--ds-background-accent-purple-subtlest',
                'color.background.accent.purple.subtler': '--ds-background-accent-purple-subtler',
                'color.background.accent.purple.subtle': '--ds-background-accent-purple-subtle',
                'color.background.accent.purple.bolder': '--ds-background-accent-purple-bolder',
                'color.background.accent.magenta.subtlest': '--ds-background-accent-magenta-subtlest',
                'color.background.accent.magenta.subtler': '--ds-background-accent-magenta-subtler',
                'color.background.accent.magenta.subtle': '--ds-background-accent-magenta-subtle',
                'color.background.accent.magenta.bolder': '--ds-background-accent-magenta-bolder',
                'color.background.accent.gray.subtlest': '--ds-background-accent-gray-subtlest',
                'color.background.accent.gray.subtler': '--ds-background-accent-gray-subtler',
                'color.background.accent.gray.subtle': '--ds-background-accent-gray-subtle',
                'color.background.accent.gray.bolder': '--ds-background-accent-gray-bolder',
                'color.background.disabled': '--ds-background-disabled',
                'color.background.input': '--ds-background-input',
                'color.background.input.hovered': '--ds-background-input-hovered',
                'color.background.input.pressed': '--ds-background-input-pressed',
                'color.background.inverse.subtle': '--ds-background-inverse-subtle',
                'color.background.inverse.subtle.hovered': '--ds-background-inverse-subtle-hovered',
                'color.background.inverse.subtle.pressed': '--ds-background-inverse-subtle-pressed',
                'color.background.neutral': '--ds-background-neutral',
                'color.background.neutral.hovered': '--ds-background-neutral-hovered',
                'color.background.neutral.pressed': '--ds-background-neutral-pressed',
                'color.background.neutral.subtle': '--ds-background-neutral-subtle',
                'color.background.neutral.subtle.hovered': '--ds-background-neutral-subtle-hovered',
                'color.background.neutral.subtle.pressed': '--ds-background-neutral-subtle-pressed',
                'color.background.neutral.bold': '--ds-background-neutral-bold',
                'color.background.neutral.bold.hovered': '--ds-background-neutral-bold-hovered',
                'color.background.neutral.bold.pressed': '--ds-background-neutral-bold-pressed',
                'color.background.selected': '--ds-background-selected',
                'color.background.selected.hovered': '--ds-background-selected-hovered',
                'color.background.selected.pressed': '--ds-background-selected-pressed',
                'color.background.selected.bold': '--ds-background-selected-bold',
                'color.background.selected.bold.hovered': '--ds-background-selected-bold-hovered',
                'color.background.selected.bold.pressed': '--ds-background-selected-bold-pressed',
                'color.background.brand.bold': '--ds-background-brand-bold',
                'color.background.brand.bold.hovered': '--ds-background-brand-bold-hovered',
                'color.background.brand.bold.pressed': '--ds-background-brand-bold-pressed',
                'color.background.danger': '--ds-background-danger',
                'color.background.danger.hovered': '--ds-background-danger-hovered',
                'color.background.danger.pressed': '--ds-background-danger-pressed',
                'color.background.danger.bold': '--ds-background-danger-bold',
                'color.background.danger.bold.hovered': '--ds-background-danger-bold-hovered',
                'color.background.danger.bold.pressed': '--ds-background-danger-bold-pressed',
                'color.background.warning': '--ds-background-warning',
                'color.background.warning.hovered': '--ds-background-warning-hovered',
                'color.background.warning.pressed': '--ds-background-warning-pressed',
                'color.background.warning.bold': '--ds-background-warning-bold',
                'color.background.warning.bold.hovered': '--ds-background-warning-bold-hovered',
                'color.background.warning.bold.pressed': '--ds-background-warning-bold-pressed',
                'color.background.success': '--ds-background-success',
                'color.background.success.hovered': '--ds-background-success-hovered',
                'color.background.success.pressed': '--ds-background-success-pressed',
                'color.background.success.bold': '--ds-background-success-bold',
                'color.background.success.bold.hovered': '--ds-background-success-bold-hovered',
                'color.background.success.bold.pressed': '--ds-background-success-bold-pressed',
                'color.background.discovery': '--ds-background-discovery',
                'color.background.discovery.hovered': '--ds-background-discovery-hovered',
                'color.background.discovery.pressed': '--ds-background-discovery-pressed',
                'color.background.discovery.bold': '--ds-background-discovery-bold',
                'color.background.discovery.bold.hovered': '--ds-background-discovery-bold-hovered',
                'color.background.discovery.bold.pressed': '--ds-background-discovery-bold-pressed',
                'color.background.information': '--ds-background-information',
                'color.background.information.hovered': '--ds-background-information-hovered',
                'color.background.information.pressed': '--ds-background-information-pressed',
                'color.background.information.bold': '--ds-background-information-bold',
                'color.background.information.bold.hovered': '--ds-background-information-bold-hovered',
                'color.background.information.bold.pressed': '--ds-background-information-bold-pressed',
                'color.blanket': '--ds-blanket',
                'color.blanket.selected': '--ds-blanket-selected',
                'color.blanket.danger': '--ds-blanket-danger',
                'color.interaction.hovered': '--ds-interaction-hovered',
                'color.interaction.pressed': '--ds-interaction-pressed',
                'color.skeleton': '--ds-skeleton',
                'color.skeleton.subtle': '--ds-skeleton-subtle',
                'color.chart.categorical.1': '--ds-chart-categorical-1',
                'color.chart.categorical.1.hovered': '--ds-chart-categorical-1-hovered',
                'color.chart.categorical.2': '--ds-chart-categorical-2',
                'color.chart.categorical.2.hovered': '--ds-chart-categorical-2-hovered',
                'color.chart.categorical.3': '--ds-chart-categorical-3',
                'color.chart.categorical.3.hovered': '--ds-chart-categorical-3-hovered',
                'color.chart.categorical.4': '--ds-chart-categorical-4',
                'color.chart.categorical.4.hovered': '--ds-chart-categorical-4-hovered',
                'color.chart.categorical.5': '--ds-chart-categorical-5',
                'color.chart.categorical.5.hovered': '--ds-chart-categorical-5-hovered',
                'color.chart.categorical.6': '--ds-chart-categorical-6',
                'color.chart.categorical.6.hovered': '--ds-chart-categorical-6-hovered',
                'color.chart.categorical.7': '--ds-chart-categorical-7',
                'color.chart.categorical.7.hovered': '--ds-chart-categorical-7-hovered',
                'color.chart.categorical.8': '--ds-chart-categorical-8',
                'color.chart.categorical.8.hovered': '--ds-chart-categorical-8-hovered',
                'color.chart.neutral': '--ds-chart-neutral',
                'color.chart.neutral.hovered': '--ds-chart-neutral-hovered',
                'color.chart.red.bold': '--ds-chart-red-bold',
                'color.chart.red.bold.hovered': '--ds-chart-red-bold-hovered',
                'color.chart.red.bolder': '--ds-chart-red-bolder',
                'color.chart.red.bolder.hovered': '--ds-chart-red-bolder-hovered',
                'color.chart.red.boldest': '--ds-chart-red-boldest',
                'color.chart.red.boldest.hovered': '--ds-chart-red-boldest-hovered',
                'color.chart.orange.bold': '--ds-chart-orange-bold',
                'color.chart.orange.bold.hovered': '--ds-chart-orange-bold-hovered',
                'color.chart.orange.bolder': '--ds-chart-orange-bolder',
                'color.chart.orange.bolder.hovered': '--ds-chart-orange-bolder-hovered',
                'color.chart.orange.boldest': '--ds-chart-orange-boldest',
                'color.chart.orange.boldest.hovered': '--ds-chart-orange-boldest-hovered',
                'color.chart.yellow.bold': '--ds-chart-yellow-bold',
                'color.chart.yellow.bold.hovered': '--ds-chart-yellow-bold-hovered',
                'color.chart.yellow.bolder': '--ds-chart-yellow-bolder',
                'color.chart.yellow.bolder.hovered': '--ds-chart-yellow-bolder-hovered',
                'color.chart.yellow.boldest': '--ds-chart-yellow-boldest',
                'color.chart.yellow.boldest.hovered': '--ds-chart-yellow-boldest-hovered',
                'color.chart.green.bold': '--ds-chart-green-bold',
                'color.chart.green.bold.hovered': '--ds-chart-green-bold-hovered',
                'color.chart.green.bolder': '--ds-chart-green-bolder',
                'color.chart.green.bolder.hovered': '--ds-chart-green-bolder-hovered',
                'color.chart.green.boldest': '--ds-chart-green-boldest',
                'color.chart.green.boldest.hovered': '--ds-chart-green-boldest-hovered',
                'color.chart.teal.bold': '--ds-chart-teal-bold',
                'color.chart.teal.bold.hovered': '--ds-chart-teal-bold-hovered',
                'color.chart.teal.bolder': '--ds-chart-teal-bolder',
                'color.chart.teal.bolder.hovered': '--ds-chart-teal-bolder-hovered',
                'color.chart.teal.boldest': '--ds-chart-teal-boldest',
                'color.chart.teal.boldest.hovered': '--ds-chart-teal-boldest-hovered',
                'color.chart.blue.bold': '--ds-chart-blue-bold',
                'color.chart.blue.bold.hovered': '--ds-chart-blue-bold-hovered',
                'color.chart.blue.bolder': '--ds-chart-blue-bolder',
                'color.chart.blue.bolder.hovered': '--ds-chart-blue-bolder-hovered',
                'color.chart.blue.boldest': '--ds-chart-blue-boldest',
                'color.chart.blue.boldest.hovered': '--ds-chart-blue-boldest-hovered',
                'color.chart.purple.bold': '--ds-chart-purple-bold',
                'color.chart.purple.bold.hovered': '--ds-chart-purple-bold-hovered',
                'color.chart.purple.bolder': '--ds-chart-purple-bolder',
                'color.chart.purple.bolder.hovered': '--ds-chart-purple-bolder-hovered',
                'color.chart.purple.boldest': '--ds-chart-purple-boldest',
                'color.chart.purple.boldest.hovered': '--ds-chart-purple-boldest-hovered',
                'color.chart.magenta.bold': '--ds-chart-magenta-bold',
                'color.chart.magenta.bold.hovered': '--ds-chart-magenta-bold-hovered',
                'color.chart.magenta.bolder': '--ds-chart-magenta-bolder',
                'color.chart.magenta.bolder.hovered': '--ds-chart-magenta-bolder-hovered',
                'color.chart.magenta.boldest': '--ds-chart-magenta-boldest',
                'color.chart.magenta.boldest.hovered': '--ds-chart-magenta-boldest-hovered',
                'color.chart.gray.bold': '--ds-chart-gray-bold',
                'color.chart.gray.bold.hovered': '--ds-chart-gray-bold-hovered',
                'color.chart.gray.bolder': '--ds-chart-gray-bolder',
                'color.chart.gray.bolder.hovered': '--ds-chart-gray-bolder-hovered',
                'color.chart.gray.boldest': '--ds-chart-gray-boldest',
                'color.chart.gray.boldest.hovered': '--ds-chart-gray-boldest-hovered',
                'color.chart.brand': '--ds-chart-brand',
                'color.chart.brand.hovered': '--ds-chart-brand-hovered',
                'color.chart.danger': '--ds-chart-danger',
                'color.chart.danger.hovered': '--ds-chart-danger-hovered',
                'color.chart.danger.bold': '--ds-chart-danger-bold',
                'color.chart.danger.bold.hovered': '--ds-chart-danger-bold-hovered',
                'color.chart.warning': '--ds-chart-warning',
                'color.chart.warning.hovered': '--ds-chart-warning-hovered',
                'color.chart.warning.bold': '--ds-chart-warning-bold',
                'color.chart.warning.bold.hovered': '--ds-chart-warning-bold-hovered',
                'color.chart.success': '--ds-chart-success',
                'color.chart.success.hovered': '--ds-chart-success-hovered',
                'color.chart.success.bold': '--ds-chart-success-bold',
                'color.chart.success.bold.hovered': '--ds-chart-success-bold-hovered',
                'color.chart.discovery': '--ds-chart-discovery',
                'color.chart.discovery.hovered': '--ds-chart-discovery-hovered',
                'color.chart.discovery.bold': '--ds-chart-discovery-bold',
                'color.chart.discovery.bold.hovered': '--ds-chart-discovery-bold-hovered',
                'color.chart.information': '--ds-chart-information',
                'color.chart.information.hovered': '--ds-chart-information-hovered',
                'color.chart.information.bold': '--ds-chart-information-bold',
                'color.chart.information.bold.hovered': '--ds-chart-information-bold-hovered',
                'elevation.surface': '--ds-surface',
                'elevation.surface.hovered': '--ds-surface-hovered',
                'elevation.surface.pressed': '--ds-surface-pressed',
                'elevation.surface.overlay': '--ds-surface-overlay',
                'elevation.surface.overlay.hovered': '--ds-surface-overlay-hovered',
                'elevation.surface.overlay.pressed': '--ds-surface-overlay-pressed',
                'elevation.surface.raised': '--ds-surface-raised',
                'elevation.surface.raised.hovered': '--ds-surface-raised-hovered',
                'elevation.surface.raised.pressed': '--ds-surface-raised-pressed',
                'elevation.surface.sunken': '--ds-surface-sunken',
                'elevation.shadow.overflow': '--ds-shadow-overflow',
                'elevation.shadow.overflow.perimeter': '--ds-shadow-overflow-perimeter',
                'elevation.shadow.overflow.spread': '--ds-shadow-overflow-spread',
                'elevation.shadow.overlay': '--ds-shadow-overlay',
                'elevation.shadow.raised': '--ds-shadow-raised',
                'opacity.disabled': '--ds-opacity-disabled',
                'opacity.loading': '--ds-opacity-loading',
                'utility.UNSAFE.transparent': '--ds-UNSAFE-transparent',
                'space.0': '--ds-space-0',
                'space.025': '--ds-space-025',
                'space.050': '--ds-space-050',
                'space.075': '--ds-space-075',
                'space.100': '--ds-space-100',
                'space.150': '--ds-space-150',
                'space.200': '--ds-space-200',
                'space.250': '--ds-space-250',
                'space.300': '--ds-space-300',
                'space.400': '--ds-space-400',
                'space.500': '--ds-space-500',
                'space.600': '--ds-space-600',
                'space.800': '--ds-space-800',
                'space.1000': '--ds-space-1000',
                'font.family.monospace': '--ds-font-family-monospace',
                'font.family.sans': '--ds-font-family-sans',
                'font.size.050': '--ds-font-size-050',
                'font.size.075': '--ds-font-size-075',
                'font.size.100': '--ds-font-size-100',
                'font.size.200': '--ds-font-size-200',
                'font.size.300': '--ds-font-size-300',
                'font.size.400': '--ds-font-size-400',
                'font.size.500': '--ds-font-size-500',
                'font.size.600': '--ds-font-size-600',
                'font.weight.bold': '--ds-font-weight-bold',
                'font.weight.medium': '--ds-font-weight-medium',
                'font.weight.regular': '--ds-font-weight-regular',
                'font.weight.semibold': '--ds-font-weight-semibold',
                'font.lineHeight.100': '--ds-font-lineHeight-100',
                'font.lineHeight.200': '--ds-font-lineHeight-200',
                'font.lineHeight.300': '--ds-font-lineHeight-300',
                'font.lineHeight.400': '--ds-font-lineHeight-400',
                'font.lineHeight.500': '--ds-font-lineHeight-500',
                'font.lineHeight.600': '--ds-font-lineHeight-600'
            };
/* harmony default export */ const token_names = (tokens);
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/esm/constants.js
            var THEME_DATA_ATTRIBUTE = 'data-theme';
            var constants_COLOR_MODE_ATTRIBUTE = 'data-color-mode';
            var DEFAULT_THEME = 'light';
            var CSS_PREFIX = 'ds';
            var CSS_VAR_FULL = (/* unused pure expression or super */ null && (['opacity', 'font', 'space']));
            var TOKEN_NOT_FOUND_CSS_VAR = "--".concat(CSS_PREFIX, "-token-not-found");
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/esm/get-token.js



            var get_token_name = "@atlaskit/tokens";
            var version = "1.4.1";
            /**
             * Takes a dot-separated token name and an optional fallback, and returns the CSS custom property for the corresponding token.
             * This should be used to implement design decisions throughout your application.
             *
             * Note: With `@atlaskit/babel-plugin-tokens`, this function can be pre-compiled and a fallback value automatically inserted.
             *
             * @param {string} path - A dot-separated token name (example: `'color.background.brand'` or `'spacing.scale.100'`).
             * @param {string} [fallback] - The fallback value that should render when token CSS is not present in your app.
             *
             * @example
             * ```
             * <div
             *   css={{
             *     backgroundColor: token('elevation.surface.raised', N0),
             *     boxShadow: token('elevation.shadow.raised', `0 20px 32px -8px ${N50A}, 0 0 1px ${N60A}`),
             *     padding: token('spacing.scale.100', '8px'),
             *     fontWeight: token('font.weight.regular', '400'),
             *   }}
             * />
             * ```
             *
             */
            function token(path, fallback) {
                var token = token_names[path];
                if (typeof process !== 'undefined' && "production" !== 'production' && 0) { }

                // if the token is not found - replacing it with variable name without any value, to avoid it being undefined which would result in invalid css
                if (!token) {
                    token = TOKEN_NOT_FOUND_CSS_VAR;
                }
                var tokenCall = fallback ? "var(".concat(token, ", ").concat(fallback, ")") : "var(".concat(token, ")");
                return tokenCall;
            }
/* harmony default export */ const get_token = (token);
            ;// CONCATENATED MODULE: ./src/power-up-js/process-result.js


            const process_result_process = (value, key) => {
                if (!value) {
                    return value;
                }
                if ((key === 'url' || key === 'icon') && typeof value === 'string') {
                    if (value.indexOf('./') === 0) {
                        return relative_url(value.substr(2));
                    }
                }
                const processed = {};
                switch (typeof value) {
                    case 'object':
                        if (Array.isArray(value)) {
                            return value.map(process_result_process);
                        }
                        Object.keys(value).forEach(k => {
                            processed[k] = process_result_process(value[k], k);
                        });
                        return processed;
                    case 'function':
                        return callback_cache.serialize(value);
                    default:
                        return value;
                }
            };
/* harmony default export */ const process_result = (process_result_process);
            ;// CONCATENATED MODULE: ./src/power-up-js/util/safe.js
/* harmony default export */ const safe = (html => String(html == null ? '' : html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/`/g, '&#x60;'));
            ;// CONCATENATED MODULE: ./src/power-up-js/util/validate.js
/* harmony default export */ const validate = ({
                isId: id => /^[a-f0-9]{24}$/.test(id),
                isShortLink: id => /^[a-zA-Z0-9]{8}$/.test(id),
                isAllowedVisibilty: visibility => ['shared', 'private'].indexOf(visibility) !== -1,
                isAllowedScope: scope => ['board', 'card', 'member', 'organization'].indexOf(scope) !== -1
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/host-handlers.js



















            const POWER_UP_THEME_CHANGE_EVENT = 'POWER-UP-THEME-CHANGE';
            const MAX_PLUGINDATA_LENGTH = {
                board: 8192,
                card: 4096,
                member: 4096,
                organization: 8192
            };
            const HostHandlers = {};
            HostHandlers.getContext = function getContext() {
                return this.args[0].context;
            };
            HostHandlers.isMemberSignedIn = function isMemberSignedIn() {
                const context = this.getContext();
                return context != null && context.member !== 'notLoggedIn' && context.member != null;
            };
            HostHandlers.memberCanWriteToModel = function memberCanWriteToModel(modelType) {
                if (!this.isMemberSignedIn()) {
                    return false;
                }
                const allowedModelTypes = ['board', 'card', 'organization'];
                if (typeof modelType !== 'string' || !lodash_includes_default()(allowedModelTypes, modelType)) {
                    throw new Error('modelType must be one of: board, card, organization');
                }
                const context = this.getContext();
                return context != null && context.permissions != null && context.permissions[modelType] === 'write';
            };
            HostHandlers.requestWithContext = function requestWithContext(command, options) {
                const opts = options || {};
                opts.context = typeof this.getContext === 'function' ? this.getContext() : {};
                return this.request(command, process_result(opts));
            };
            HostHandlers.getAll = function getAll() {
                const self = this;
                // enforce only a single data req at a time
                if (self.outstandingGetAllReq) {
                    return self.outstandingGetAllReq;
                }
                self.outstandingGetAllReq = self.requestWithContext('data').then(data => {
                    const parsed = {};
                    Object.keys(data).forEach(scope => {
                        parsed[scope] = {};
                        Object.keys(data[scope]).forEach(visibility => {
                            try {
                                parsed[scope][visibility] = JSON.parse(data[scope][visibility]);
                            } catch (ignored) {
                                parsed[scope][visibility] = {};
                            }
                        });
                    });
                    self.outstandingGetAllReq = null;
                    return parsed;
                }).catch(err => {
                    self.outstandingGetAllReq = null;
                    throw err;
                });
                return self.outstandingGetAllReq;
            };
            HostHandlers.get = function get(scope, visibility, name, defaultValue) {
                const self = this;
                if (!self.outstandingGetRequests) {
                    self.outstandingGetRequests = new Map();
                }
                let reqKey = 'GET';
                const opts = {};
                if (validate.isId(scope) || validate.isShortLink(scope)) {
                    opts.idCard = scope;
                    // eslint-disable-next-line no-param-reassign
                    scope = 'card';
                    reqKey = `GET:${opts.idCard}`;
                }
                if (!validate.isAllowedVisibilty(visibility)) {
                    throw new Error('Invalid value for visibility.');
                }
                if (!validate.isAllowedScope(scope)) {
                    throw new Error('Invalid value for scope.');
                }
                if (!self.outstandingGetRequests.has(reqKey)) {
                    self.outstandingGetRequests.set(reqKey, self.requestWithContext('data', opts));
                }
                return self.outstandingGetRequests.get(reqKey).then(data => {
                    let parsed = {};
                    if (data && lodash_has_default()(data, scope) && lodash_has_default()(data[scope], visibility)) {
                        try {
                            parsed = JSON.parse(data[scope][visibility]);
                        } catch (ignored) {
                            // nothing to do
                        }
                    }
                    self.outstandingGetRequests.delete(reqKey);
                    // get all data at a certain scope & visibility
                    if (name == null) {
                        return parsed || defaultValue;
                    }
                    // get specific property at certain scope & visibility
                    if (parsed != null && lodash_has_default()(parsed, name)) {
                        return parsed[name];
                    }
                    return defaultValue;
                }).catch(err => {
                    self.outstandingGetRequests.delete(reqKey);
                    throw err;
                });
            };
            function internalSet(scope, visibility, options, fxDataTransformer) {
                const self = this;
                const opts = {
                    ...options
                };
                // Make sure we wait for in-flight set requests to finish, before we
                // try to persist this one; otherwise we may clobber changes we've tried
                // to write just prior, due to the "outstandingGetRequests" logic in `self.get`
                if (!self.setRequestQueue) {
                    self.setRequestQueue = new Map();
                }
                const reqKey = `PUT:${scope}:${visibility}`;
                const {
                    chain,
                    size
                } = self.setRequestQueue.has(reqKey) ? self.setRequestQueue.get(reqKey) : {
                    chain: bluebird_default().resolve(),
                    size: 0
                };
                const getFreshData = () => self.get(scope, visibility);
                const promise = chain.then(getFreshData, getFreshData).then(data => {
                    const dataAtVis = data || {};
                    const originalStringified = JSON.stringify(dataAtVis);
                    const transformedData = fxDataTransformer(dataAtVis);
                    opts.data = JSON.stringify(transformedData);
                    if (opts.data === originalStringified) {
                        // the requested change did not modify the current data
                        return bluebird_default().resolve();
                    }
                    if (opts.data.length > MAX_PLUGINDATA_LENGTH[opts.scope]) {
                        throw new Error(`PluginData length of ${MAX_PLUGINDATA_LENGTH[opts.scope]} characters exceeded. See: https://developers.trello.com/v1.0/reference#section-size-limit`);
                    }
                    const req = self.requestWithContext('set', opts);
                    req.finally(() => {
                        const queue = self.setRequestQueue.get(reqKey);
                        if (queue.size === 1) {
                            self.setRequestQueue.delete(reqKey);
                        } else {
                            self.setRequestQueue.set({
                                chain: queue.chain,
                                size: queue.size - 1
                            });
                        }
                    });
                    return req;
                });
                self.setRequestQueue.set(reqKey, {
                    chain: promise,
                    size: size + 1
                });
                return promise;
            }
            HostHandlers.set = function set(scope, visibility, name, value) {
                const opts = {
                    scope,
                    visibility
                };
                if (!validate.isAllowedVisibilty(visibility)) {
                    throw new Error('Invalid value for visibility.');
                }
                if (validate.isId(scope) || validate.isShortLink(scope)) {
                    opts.idCard = scope;
                    opts.scope = 'card';
                }
                if (!validate.isAllowedScope(opts.scope)) {
                    throw new Error('Invalid value for scope.');
                }
                return internalSet.call(this, scope, visibility, opts, data => {
                    const result = {
                        ...data
                    };
                    if (typeof name === 'object') {
                        Object.keys(name).forEach(k => {
                            result[k] = name[k];
                        });
                    } else {
                        result[name] = value;
                    }
                    return result;
                });
            };
            HostHandlers.remove = function remove(scope, visibility, names) {
                const opts = {
                    scope,
                    visibility
                };
                let keys = names;
                if (validate.isId(scope) || validate.isShortLink(scope)) {
                    opts.idCard = scope;
                    opts.scope = 'card';
                }
                if (!Array.isArray(keys)) {
                    keys = [names];
                }
                if (keys.some(key => typeof key !== 'string')) {
                    warn('t.remove function takes either a single string or an array of strings for which keys to remove');
                    return null;
                }
                if (!validate.isAllowedScope(opts.scope)) {
                    throw new Error('Invalid value for scope.');
                }
                if (!validate.isAllowedVisibilty(visibility)) {
                    throw new Error('Invalid value for visibility.');
                }
                return internalSet.call(this, scope, visibility, opts, data => {
                    const result = {
                        ...data
                    };
                    keys.forEach(key => {
                        delete result[key];
                    });
                    return result;
                });
            };
            HostHandlers.safe = safe;
            HostHandlers.arg = function arg(name, defaultValue) {
                const options = this.args[1];
                if (options && typeof options === 'object' && lodash_has_default()(options, name)) {
                    return options[name];
                }
                return defaultValue;
            };
            HostHandlers.signUrl = function signUrl(url, args) {
                const context = this.getContext();
                const signature = encodeURIComponent(JSON.stringify({
                    secret: this.secret,
                    context,
                    locale: window.locale,
                    args
                }));
                // check if its already been signed
                if (url.includes('#')) {
                    warn('Power-Up signing url that already has a hash. This will remove the existing hash.', url);
                    // strip the old hash and replace it with this one
                    return `${url.slice(0, url.indexOf('#'))}#${signature}`;
                }
                return `${url}#${signature}`;
            };
            HostHandlers.navigate = function navigate(options) {
                if (!options || typeof options !== 'object' || typeof options.url !== 'string') {
                    return bluebird_default().reject(new Error('Invalid or missing url provided in options object'));
                }
                return this.requestWithContext('navigate', options);
            };
            HostHandlers.showCard = function showCard(idCard) {
                if (!idCard || typeof idCard !== 'string') {
                    return bluebird_default().reject(new Error('Invalid idCard provided'));
                }
                return this.requestWithContext('showCard', {
                    idCard
                });
            };
            HostHandlers.hideCard = function hideCard() {
                return this.requestWithContext('hideCard');
            };
            HostHandlers.alert = function alert(options) {
                const maxAlertLength = 140;
                const opts = lodash_pick_default()(options, ['message', 'duration', 'display']);
                const msg = opts.message;
                // message is required to be 1 - 140 chars
                if (!lodash_isstring_default()(msg) || msg.length < 1 || msg.length > maxAlertLength) {
                    return bluebird_default().reject(new Error('Alert requires a message of 1 to 140 characters'));
                }
                return this.requestWithContext('alert', opts);
            };
            HostHandlers.hideAlert = function hideAlert() {
                return this.requestWithContext('hideAlert');
            };
            const getContentForItemsPopup = opts => {
                let items;
                if (Array.isArray(opts.items) || typeof opts.items === 'function') {
                    // eslint-disable-next-line prefer-destructuring
                    items = opts.items;
                } else if (typeof opts.items === 'object') {
                    items = Object.keys(opts.items).map(text => {
                        const entry = opts.items[text];
                        if (typeof entry === 'function') {
                            return {
                                text,
                                callback: entry
                            };
                        }
                        if (entry && typeof entry.callback === 'function') {
                            return immutable_default()({
                                text
                            }, entry);
                        }
                        return {
                            text
                        };
                    });
                } else {
                    throw new Error('Unsupported items type for popup. Must be an array, object, or function');
                }
                return {
                    items,
                    type: 'list',
                    search: opts.search
                };
            };
            const getContentForConfirmPopup = opts => {
                if (typeof opts.message !== 'string' || typeof opts.confirmText !== 'string') {
                    throw new Error('Confirm popups must have a message and confirmText');
                }
                if (typeof opts.onConfirm !== 'function') {
                    throw new Error('Confirm popup requires onConfirm function');
                }
                if (typeof opts.onCancel === 'function' && typeof opts.cancelText !== 'string') {
                    throw new Error('Confirm popup requires cancelText to support onCancel function');
                }
                const content = {
                    type: 'confirm',
                    message: opts.message,
                    confirmStyle: opts.confirmStyle || 'primary',
                    confirmText: opts.confirmText,
                    onConfirm: opts.onConfirm
                };
                if (typeof opts.cancelText === 'string') {
                    content.cancelText = opts.cancelText;
                }
                if (typeof opts.onCancel === 'function') {
                    content.onCancel = opts.onCancel;
                }
                return content;
            };
            const getContentForDatePopup = opts => {
                if (typeof opts.callback !== 'function') {
                    throw new Error('Date popups must have a callback function');
                }
                const content = {
                    type: opts.type,
                    callback: opts.callback
                };
                if (opts.date && typeof opts.date.toISOString === 'function') {
                    content.date = opts.date.toISOString();
                }
                if (opts.minDate && typeof opts.minDate.toISOString === 'function') {
                    content.minDate = opts.minDate.toISOString();
                }
                if (opts.maxDate && typeof opts.maxDate.toISOString === 'function') {
                    content.maxDate = opts.maxDate.toISOString();
                }
                if (content.minDate && content.maxDate && content.minDate > content.maxDate) {
                    throw new Error('Date popup maxDate must come after minDate if specified');
                }
                return content;
            };
            HostHandlers.popup = function popup(options) {
                if (!this.getContext().el && !(options && options.mouseEvent)) {
                    warn('Unable to open popup. Context missing target element or a mouseEvent was not provided. This usually means you are using the wrong t param, and should instead use the one provided to the callback function itself, not the capability handler. If you are within an iframe, then make sure you pass the mouse event.');
                    return bluebird_default().reject(new Error('Context missing target element and no mouse event provided'));
                }
                const popupOptions = {
                    title: options.title
                };
                if (options && options.mouseEvent) {
                    const {
                        mouseEvent
                    } = options;
                    const {
                        clientX,
                        clientY
                    } = mouseEvent;
                    if (lodash_isfinite_default()(clientX) && lodash_isfinite_default()(clientY)) {
                        let x = clientX;
                        let y = clientY;

                        // Assumes that they've triggered the click by using Tab + Enter.
                        // Fall back to the target element of the click.
                        if (x === 0 && y === 0) {
                            if (!(mouseEvent.target && mouseEvent.target.getBoundingClientRect)) {
                                return bluebird_default().reject(new Error('Invalid mouseEvent was provided'));
                            }
                            const boundingRect = mouseEvent.target.getBoundingClientRect();
                            x = boundingRect.left;
                            y = boundingRect.top;
                        }
                        popupOptions.pos = {
                            x,
                            y
                        };
                    } else {
                        return bluebird_default().reject(new Error('Invalid mouseEvent was provided'));
                    }
                }
                if (options && typeof options.callback === 'function') {
                    popupOptions.callback = options.callback;
                }
                try {
                    if (options.url && typeof options.url === 'string') {
                        popupOptions.content = {
                            type: 'iframe',
                            url: this.signUrl(relative_url(options.url), options.args),
                            width: options.width,
                            height: options.height
                        };
                    } else if (options.items) {
                        popupOptions.content = getContentForItemsPopup(options);
                    } else if (options.type === 'confirm') {
                        popupOptions.content = getContentForConfirmPopup(options);
                    } else if (options.type === 'datetime' || options.type === 'date') {
                        delete popupOptions.callback;
                        popupOptions.content = getContentForDatePopup(options);
                    } else {
                        return bluebird_default().reject(new Error('Unknown popup type requested'));
                    }
                } catch (err) {
                    return bluebird_default().reject(err);
                }
                return this.requestWithContext('popup', popupOptions);
            };
            HostHandlers.overlay = function overlay(options) {
                warn('overlay() has been deprecated. Please use modal() instead. See: https://trello.readme.io/v1.0/reference#t-modal');
                const overlayOptions = {};
                if (options.url) {
                    overlayOptions.content = {
                        type: 'iframe',
                        url: this.signUrl(relative_url(options.url), options.args),
                        inset: options.inset
                    };
                }
                return this.requestWithContext('overlay', overlayOptions);
            };
            HostHandlers.boardBar = function boardBar(options) {
                if (!options || !options.url || typeof options.url !== 'string') {
                    throw new Error('BoardBar options requires a valid url');
                }
                if (options.actions && !Array.isArray(options.actions)) {
                    throw new Error('BoardBar actions property must be an array');
                }
                let accentColor;
                if (options.accentColor) {
                    accentColor = namedColorStringToHex(options.accentColor);
                }
                const boardBarOptions = {
                    content: {
                        actions: options.actions || [],
                        callback: options.callback,
                        accentColor,
                        height: options.height || 200,
                        resizable: options.resizable || false,
                        title: options.title,
                        type: 'iframe',
                        url: this.signUrl(relative_url(options.url), options.args)
                    }
                };
                return this.requestWithContext('board-bar', boardBarOptions);
            };
            HostHandlers.modal = function modal(options) {
                if (!options || !options.url || typeof options.url !== 'string') {
                    throw new Error('Modal options requires a valid url');
                }
                if (options.actions && !Array.isArray(options.actions)) {
                    throw new Error('Modal actions property must be an array');
                }
                let accentColor;
                if (options.accentColor) {
                    accentColor = namedColorStringToHex(options.accentColor);
                }
                const modalOptions = {
                    content: {
                        actions: options.actions || [],
                        callback: options.callback,
                        accentColor,
                        fullscreen: options.fullscreen || false,
                        height: options.height || 400,
                        title: options.title,
                        type: 'iframe',
                        url: this.signUrl(relative_url(options.url), options.args)
                    }
                };
                return this.requestWithContext('modal', modalOptions);
            };
            HostHandlers.updateModal = function updateModal(options) {
                if (!options) {
                    return bluebird_default().resolve();
                }
                const {
                    accentColor,
                    actions,
                    fullscreen,
                    title
                } = options;
                if (!accentColor && !actions && !fullscreen && !title) {
                    // noop
                    return bluebird_default().resolve();
                }
                if (options.url) {
                    throw new Error('Updating Modal url not allowed');
                }
                if (options.callback) {
                    throw new Error('Unable to update callback. You can set onBeforeUnload to run code before Modal close: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload');
                }
                if (actions && !Array.isArray(actions)) {
                    throw new Error('Modal actions property must be an array');
                }
                const modalOptions = {
                    content: lodash_pick_default()(options, ['actions', 'accentColor', 'fullscreen', 'title'])
                };
                if (accentColor) {
                    modalOptions.content.accentColor = namedColorStringToHex(accentColor);
                }
                return this.requestWithContext('update-modal', modalOptions);
            };

            // Deprecated in favor of closePopup
            HostHandlers.hide = function hide() {
                warn('hide() handler has been deprecated. Please use closePopup()');
                return this.requestWithContext('close-popup');
            };
            HostHandlers.closePopup = function closePopup() {
                return this.requestWithContext('close-popup');
            };
            HostHandlers.back = function back() {
                return this.requestWithContext('pop-popup');
            };

            // Deprecated in favor of closeOverlay
            HostHandlers.hideOverlay = function hideOverlay() {
                warn('hideOverlay() handler has been deprecated. Please use closeOverlay()');
                return this.requestWithContext('close-overlay');
            };
            HostHandlers.closeOverlay = function closeOverlay() {
                let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                warn('overlay() has been deprecated. Please use modal() instead. See: https://trello.readme.io/v1.0/reference#t-modal');
                const closeOverlayOptions = {
                    inset: options.inset
                };
                return this.requestWithContext('close-overlay', closeOverlayOptions);
            };

            // Deprecated in favor of closeBoardBar
            HostHandlers.hideBoardBar = function hideBoardBar() {
                warn('hideBoardBar() handler has been deprecated. Please use closeBoardBar()');
                return this.requestWithContext('close-board-bar');
            };
            HostHandlers.closeBoardBar = function closeBoardBar() {
                return this.requestWithContext('close-board-bar');
            };
            HostHandlers.closeModal = function closeModal() {
                return this.requestWithContext('close-modal');
            };

            /**
             * Asks Trello to alter the height of the iframe in context.
             * If arg is a string, it should be a querySelector that will select the element
             * that Trello will measure and request the height of.
             * If arg is an element, Trello will measure and request the height it has.
             * If arg is a positive number, that will be sent directly as the desired height.
             * @param {string|element|number} arg - How to determine requested size
             */
            HostHandlers.sizeTo = function sizeTo(arg) {
                let requestedHeight;
                if (lodash_isstring_default()(arg)) {
                    const el = document.querySelector(arg);
                    if (el) {
                        el.style.overflow = 'hidden';
                        requestedHeight = Math.ceil(Math.max(el.scrollHeight, el.getBoundingClientRect().height));
                    } else {
                        return bluebird_default().reject(new Error(`No elements matched sizeTo query selector: ${arg}`));
                    }
                } else if (lodash_iselement_default()(arg)) {
                    const el = arg;
                    el.style.overflow = 'hidden';
                    requestedHeight = Math.ceil(Math.max(el.scrollHeight, el.getBoundingClientRect().height));
                } else if (lodash_isfinite_default()(arg) && arg > 0) {
                    requestedHeight = arg;
                } else {
                    return bluebird_default().reject(new Error(`Invalid argument. Must be a selector, element, or positive number. Was: ${arg}`));
                }
                if (requestedHeight) {
                    return this.requestWithContext('resize', {
                        height: requestedHeight
                    });
                }
                return bluebird_default().reject(new Error(`Unable to determine desired height for ${arg} computed ${requestedHeight}`));
            };
            HostHandlers.localizeKey = localizeKey;
            HostHandlers.localizeKeys = localizeKeys;
            HostHandlers.localizeNode = localizeNode;
            HostHandlers.card = function card() {
                for (var _len = arguments.length, fields = new Array(_len), _key = 0; _key < _len; _key++) {
                    fields[_key] = arguments[_key];
                }
                return this.requestWithContext('card', {
                    fields
                });
            };
            HostHandlers.cards = function cards() {
                for (var _len2 = arguments.length, fields = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    fields[_key2] = arguments[_key2];
                }
                return this.requestWithContext('cards', {
                    fields
                });
            };
            HostHandlers.list = function list() {
                for (var _len3 = arguments.length, fields = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    fields[_key3] = arguments[_key3];
                }
                return this.requestWithContext('list', {
                    fields
                });
            };
            HostHandlers.lists = function lists() {
                for (var _len4 = arguments.length, fields = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    fields[_key4] = arguments[_key4];
                }
                return this.requestWithContext('lists', {
                    fields
                });
            };
            HostHandlers.member = function member() {
                for (var _len5 = arguments.length, fields = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    fields[_key5] = arguments[_key5];
                }
                return this.requestWithContext('member', {
                    fields
                });
            };
            HostHandlers.board = function board() {
                for (var _len6 = arguments.length, fields = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                    fields[_key6] = arguments[_key6];
                }
                return this.requestWithContext('board', {
                    fields
                });
            };
            HostHandlers.organization = function organization() {
                for (var _len7 = arguments.length, fields = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                    fields[_key7] = arguments[_key7];
                }
                return this.requestWithContext('organization', {
                    fields
                });
            };
            HostHandlers.attach = function attach(options) {
                if (!this.memberCanWriteToModel('card')) {
                    throw new Error('User lacks write permission on card.');
                }
                return this.requestWithContext('attach-to-card', options);
            };
            HostHandlers.requestToken = function requestToken(options) {
                if (!this.isMemberSignedIn()) {
                    throw new Error('No active member in context.');
                }
                return this.requestWithContext('request-token', options);
            };
            HostHandlers.authorize = (authUrl, options) => {
                let url;
                const secret = index_esm_default().randomId();
                const opts = options || {};
                if (typeof authUrl === 'string') {
                    url = authUrl;
                } else if (typeof authUrl === 'function') {
                    url = authUrl(secret);
                } else {
                    warn('authorize requires a url or function that takes a secret and returns a url');
                    throw new Error('Invalid arguments passed to authorize');
                }
                let isValidToken = () => true;
                if (opts.validToken && typeof opts.validToken === 'function') {
                    isValidToken = opts.validToken;
                }
                const width = opts.width || 800;
                const height = opts.height || 600;
                const left = window.screenX + Math.floor((window.outerWidth - width) / 2);
                const top = window.screenY + Math.floor((window.outerHeight - height) / 2);
                const windowOpts = ['width=', width, ',height=', height, ',left=', left, ',top=', top].join('');
                const storageEventHandler = resolve => {
                    const handler = e => {
                        if (e.key === 'token' && e.newValue && isValidToken(e.newValue)) {
                            try {
                                localStorage.removeItem('token');
                            } catch (err) {
                                // it is normal for access to be denied to localStorage
                                // Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
                            }
                            window.removeEventListener('storage', handler, false);
                            delete window.authorize;
                            resolve(e.newValue);
                        }
                    };
                    return handler;
                };
                const openWindow = (targetUrl, newWindowOpts) => {
                    const authWindow = window.open(targetUrl, 'authorize', newWindowOpts);
                    if (typeof opts.windowCallback === 'function') {
                        opts.windowCallback(authWindow);
                    }
                    return authWindow;
                };
                return new (bluebird_default())(resolve => {
                    window.addEventListener('storage', storageEventHandler(resolve), false);
                    if (typeof authUrl === 'function') {
                        // eslint-disable-next-line no-new
                        new (index_esm_default())({
                            Promise: (bluebird_default()),
                            local: window,
                            remote: openWindow(url, windowOpts),
                            targetOrigin: opts.targetOrigin || '*',
                            secret,
                            handlers: {
                                value(t, o) {
                                    if (o && o.token && isValidToken(o.token)) {
                                        this.stop();
                                        resolve(o.token);
                                    }
                                }
                            }
                        });
                    } else {
                        window.authorize = token => {
                            if (token && isValidToken(token)) {
                                delete window.authorize;
                                resolve(token);
                            }
                        };
                        openWindow(url, windowOpts);
                    }
                });
            };
            HostHandlers.storeSecret = function storeSecret(secretKey, secretData) {
                if (!this.isMemberSignedIn()) {
                    throw new Error('No active member in context.');
                }
                const idMember = this.getContext().member;
                const storageKey = `${idMember}:${secretKey}`;
                const self = this;

                // Generate a SHA-256 digest of secretKey, prefixed by idMember
                return simple_crypto.sha256Digest(storageKey)
                    // check to see if we already have an encryption key for this member
                    .then(digestKey => self.get('member', 'private', 'aescbc').then(storedKey => {
                        if (storedKey) {
                            // we already have a key stored, return it to carry on using that one
                            return storedKey;
                        }

                        // if we don't already have a stored encryption key we need to create and store a new one
                        return simple_crypto.generateAESCBCKey()
                            // in order to store the key in Trello, we need to export it
                            .then(key => simple_crypto.exportAESCBCKeyToRaw(key));
                    })
                        // import the key so we can use it for encryption
                        .then(storedKey => simple_crypto.importAESCBCKeyFromRaw(storedKey).then(encryptionKey => {
                            // we need to generate a new random initialization vector to use for encryption
                            const initVector = simple_crypto.generateInitVector();
                            return simple_crypto.encryptSecret(initVector, encryptionKey, secretData).then(encryptedData => {
                                const concatedData = `${bytesToHexString(initVector)};${encryptedData}`;
                                window.localStorage.setItem(digestKey, concatedData);
                                // wait until after we have successfully written the secret
                                // in order to store the key in Trello since this may cause
                                // re-calling of Power-Up capabilities that need it
                                return self.set('member', 'private', 'aescbc', storedKey).then(() => ({
                                    key: digestKey,
                                    value: concatedData
                                }));
                            });
                        })));
            };
            HostHandlers.loadSecret = function loadSecret(secretKey) {
                if (!this.isMemberSignedIn()) {
                    throw new Error('No active member in context.');
                }
                const idMember = this.getContext().member;
                const self = this;
                const storageKey = `${idMember}:${secretKey}`;
                // Generate a SHA-256 digest of secretKey, prefixed by idMember
                return simple_crypto.sha256Digest(storageKey).then(secretKeyDigest => window.localStorage.getItem(secretKeyDigest)).then(encryptedSecret => {
                    if (!encryptedSecret) {
                        return null;
                    }

                    // before we can decrypt we need to fetch the encryption key from private plugin data
                    return self.get('member', 'private', 'aescbc').then(rawEncryptionKey => {
                        if (!rawEncryptionKey) {
                            return null;
                        }

                        // now we need to import the key so it can be used for decryption
                        return simple_crypto.importAESCBCKeyFromRaw(rawEncryptionKey).then(decryptionKey => {
                            // before we can use this key to decrypt we need to pull out the initialization vector
                            const initVector = encryptedSecret.substring(0, encryptedSecret.indexOf(';'));
                            const encryptedData = encryptedSecret.substring(encryptedSecret.indexOf(';') + 1);

                            // currently the initVector is a hex string, let's convert that to an arrayBuffer
                            const ivBuff = hexStringToUint8Array(initVector);
                            return simple_crypto.decryptSecret(ivBuff, decryptionKey, encryptedData);
                        });
                    });
                });
            };
            HostHandlers.clearSecret = function clearSecret(secretKey) {
                if (!this.isMemberSignedIn()) {
                    throw new Error('No active member in context.');
                }
                const idMember = this.getContext().member;
                const storageKey = `${idMember}:${secretKey}`;
                // Generate a SHA-256 digest of secretKey, prefixed by idMember
                return simple_crypto.sha256Digest(storageKey).then(secretKeyDigest => {
                    window.localStorage.removeItem(secretKeyDigest);
                    return null;
                });
            };
            HostHandlers.notifyParent = (message, options) => {
                const opts = options || {};
                window.parent.postMessage(message, opts.targetOrigin || '*');
            };
            HostHandlers.confetti = function confetti(arg) {
                const confettiOptions = {};
                if (arg && lodash_isfinite_default()(arg.clientX) && lodash_isfinite_default()(arg.clientY) && lodash_iselement_default()(arg.target)) {
                    const mouseEvent = arg;
                    const {
                        clientX,
                        clientY
                    } = mouseEvent;
                    let x = clientX;
                    let y = clientY;

                    // Assumes that they've triggered the click by using Tab + Enter.
                    // Fall back to the target element of the click.
                    if (x === 0 && y === 0) {
                        if (!(mouseEvent.target && mouseEvent.target.getBoundingClientRect)) {
                            return bluebird_default().reject(new Error('Invalid mouseEvent was provided'));
                        }
                        const boundingRect = mouseEvent.target.getBoundingClientRect();
                        x = boundingRect.left + mouseEvent.target.offsetWidth / 2;
                        y = boundingRect.top + mouseEvent.target.offsetHeight / 2;
                    }
                    confettiOptions.pos = {
                        x,
                        y
                    };
                } else {
                    let el;
                    if (lodash_iselement_default()(arg)) {
                        el = arg;
                    } else if (lodash_isstring_default()(arg)) {
                        el = document.querySelector(arg);
                        if (!el) {
                            return bluebird_default().reject(new Error(`No elements matched confetti query selector: ${arg}`));
                        }
                    }
                    if (el) {
                        const boundingRect = el.getBoundingClientRect();
                        confettiOptions.pos = {
                            x: boundingRect.left + el.offsetWidth / 2,
                            y: boundingRect.top + el.offsetHeight / 2
                        };
                    }
                }
                return this.requestWithContext('confetti', confettiOptions);
            };
            const jwtRequests = new Map();
            HostHandlers.jwt = function jwt(options) {
                if (!this.isMemberSignedIn()) {
                    return bluebird_default().reject(new Error('No active member in context.'));
                }

                // if you ask to include the card in the JWT it must be in context
                const includeCard = (options === null || options === void 0 ? void 0 : options.card) === true;
                if (includeCard && !this.getContext().card) {
                    return bluebird_default().reject(new Error('No card in context'));
                }
                let state = '';
                if (typeof (options === null || options === void 0 ? void 0 : options.state) === 'string') {
                    if (options.state.length > 2048) {
                        return bluebird_default().reject(new Error('State parameter must be a string of at most 2048 characters'));
                    }
                    state = options.state;
                } else if ((options === null || options === void 0 ? void 0 : options.state) != null) {
                    // they gave a state that is not a string, let them know that is wrong
                    return bluebird_default().reject(new Error('State parameter must be a string of at most 2048 characters'));
                }
                const jwtKey = [this.getContext().board, includeCard ? this.getContext().card : '', state].join(':');

                // try to limit to a single request per state at a time
                // the web client will manage the caching of actual JWTs for us by expiry
                if (jwtRequests.has(jwtKey)) {
                    return jwtRequests.get(jwtKey);
                }
                const request = this.requestWithContext('jwt', {
                    state,
                    includeCard
                });
                request.finally(() => {
                    // when the request completes remove it from the map
                    jwtRequests.delete(jwtKey);
                });
                jwtRequests.set(jwtKey, request);
                return jwtRequests.get(jwtKey);
            };
            HostHandlers.getColorToken = get_token;
            HostHandlers.getComputedColorToken = function getComputedColorToken(path) {
                var _tokenResult$match, _tokenResult$match$gr;
                let fallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
                // eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
                const tokenResult = get_token(path);

                // Extract the CSS variable from the result, e.g. `var(--foo-bar) -> --foo-bar
                const propertyName = (_tokenResult$match = tokenResult.match(/var\((?<name>--.*)\)/)) === null || _tokenResult$match === void 0 ? void 0 : (_tokenResult$match$gr = _tokenResult$match.groups) === null || _tokenResult$match$gr === void 0 ? void 0 : _tokenResult$match$gr.name;
                if (!propertyName) {
                    return fallback;
                }
                const root = document.documentElement;
                const propertyValue = getComputedStyle(root).getPropertyValue(propertyName);
                return propertyValue.trim() || fallback;
            };
            HostHandlers.subscribeToThemeChanges = function subscribeToThemeChanges(onThemeLoaded) {
                if (typeof onThemeLoaded !== 'function') {
                    throw new TypeError('Argument <onThemeLoaded> passed to subscribeToThemeChanges must be a function');
                }
                const mainCallback = e => {
                    const {
                        theme,
                        type
                    } = e.data;
                    if (e.source !== window || theme === undefined || type !== POWER_UP_THEME_CHANGE_EVENT) {
                        return;
                    }
                    onThemeLoaded(theme);
                };
                window.addEventListener('message', mainCallback);
                return () => window.removeEventListener('message', mainCallback);
            };
/* harmony default export */ const host_handlers = (HostHandlers);
            ;// CONCATENATED MODULE: ./src/power-up-js/initialize-io.js


/* harmony default export */ const initialize_io = ((handlers, options) => {
                const opts = options || {};
                const io = new (opts.io || (index_esm_default()))({
                    Promise: (bluebird_default()),
                    local: window,
                    remote: window.parent,
                    targetOrigin: opts.targetOrigin || 'https://trello.com',
                    secret: opts.secret,
                    strict: true,
                    handlers,
                    hostHandlers: opts.hostHandlers,
                    helpfulStacks: typeof opts.helpfulStacks === 'boolean' ? opts.helpfulStacks : true,
                    Sentry: opts.Sentry
                });
                return io;
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/rest-api/error.js

/* harmony default export */ const error = (make_error_enum('restApi', ['AuthDeniedError', 'AuthNotReadyError', 'ApiNotConfiguredError']));
            ;// CONCATENATED MODULE: ./src/power-up-js/rest-api/authorize.js


            const AuthMethods = {};
            AuthMethods.makeWebCall = function makeWebCall(method) {
                let args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
                if (!this.t) {
                    throw new error.AuthNotReadyError('The API helper cannot be used from this context. This probably means that you are attemping to use it inside your iframe connector, but outside a capability handler. For more, http://developers.trello.com/v1.0/reference#api-client-availability.');
                }
                if (typeof this.t[method] !== 'function') {
                    throw new error.AuthNotReadyError('This method cannot be used in this context. This probably means that you are attemping to use it inside your iframe connector, but outside a capability handler. For more, http://developers.trello.com/v1.0/reference#api-client-availability.');
                }
                return this.t[method](...args);
            };
            AuthMethods.registerMessageHandler = function registerMessageHandler(popup) {
                return new (bluebird_default())((resolve, reject) => {
                    let interval;
                    let removeHandlers;
                    const checkPopup = () => {
                        if (popup && popup.closed) {
                            clearInterval(interval);
                            reject(new error.AuthDeniedError());
                        }
                    };
                    interval = setInterval(checkPopup, 500);
                    const messageHandler = e => {
                        if (e.origin !== window.location.origin || e.source !== popup) {
                            return;
                        }
                        removeHandlers();
                        e.source.close();
                        if (!e.data) {
                            reject(new error.AuthDeniedError());
                            return;
                        }
                        resolve(e.data);
                    };
                    const storageHandler = e => {
                        if (e.key === this.tokenStorageKey) {
                            removeHandlers();
                            this.fetchAndStoreToken().then(token => {
                                if (token) {
                                    resolve(token);
                                } else {
                                    reject(new error.AuthDeniedError());
                                }
                            });
                        }
                    };
                    removeHandlers = () => {
                        window.removeEventListener('storage', storageHandler, false);
                        window.removeEventListener('message', messageHandler, false);
                        clearInterval(interval);
                    };
                    window.addEventListener('message', messageHandler, false);
                    window.addEventListener('storage', storageHandler, false);
                });
            };
            AuthMethods.storeToken = function storeToken(token) {
                return this.makeWebCall('set', ['member', 'private', this.tokenStorageKey, token]).then(() => token);
            };
            AuthMethods.checkForToken = function checkForToken() {
                // the signed-out flow puts the token in localStorage when it's done. If it's
                // there, grab it and persist it.
                let token;
                try {
                    token = this.localStorage.getItem(this.tokenStorageKey);
                } catch (err) {
                    // if we can't get the token from localStorage, there isn't much we can do.
                    // If the user re-attempts auth it should work, because they're logged in
                    // now, and the logged-in flow does not use localstorage
                }
                if (token) {
                    return token;
                }
                return null;
            };
            AuthMethods.fetchAndStoreToken = function fetchAndStoreToken() {
                const token = this.checkForToken();
                if (token) {
                    return this.storeToken(token).then(() => {
                        this.localStorage.removeItem(this.tokenStorageKey);
                        return token;
                    });
                }
                return bluebird_default().resolve(null);
            };
            AuthMethods.getToken = function getToken() {
                return this.fetchAndStoreToken().then(token => {
                    if (token) {
                        return token;
                    }
                    return this.makeWebCall('get', ['member', 'private', this.tokenStorageKey]);
                });
            };
            AuthMethods.clearToken = function clearToken() {
                try {
                    this.localStorage.removeItem(this.tokenStorageKey);
                } catch (err) {
                    // nothing to do
                }
                return this.makeWebCall('remove', ['member', 'private', this.tokenStorageKey]);
            };
            AuthMethods.popupConfig = function popupConfig() {
                const popupWidth = 550;
                const popupHeight = 725;
                const popupLeft = window.screenX + (window.outerWidth - popupWidth) / 2;
                const popupTop = window.screenY + (window.outerHeight - popupHeight) / 2;
                return `width=${popupWidth},height=${popupHeight},left=${popupLeft},top=${popupTop}`;
            };
            AuthMethods.showAuthPopup = function showAuthPopup(_ref) {
                let {
                    expiration = 'never',
                    scope = 'read',
                    returnUrl = null
                } = _ref;
                const authParams = {
                    name: this.appName,
                    key: this.appKey,
                    expiration,
                    scope
                };
                if (this.appAuthor) {
                    authParams.author = this.appAuthor;
                }
                authParams.callback_method = 'fragment';
                authParams.response_type = 'fragment';
                authParams.return_url = returnUrl || window.location.href;
                let url = `${this.authBase()}/authorize?`;
                url += Object.keys(authParams).map(k => `${k}=${encodeURIComponent(authParams[k])}`).join('&');
                return window.open(url, 'authpopup', this.popupConfig());
            };
            AuthMethods.authorize = function authorize() {
                let authOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                return new (bluebird_default())((resolve, reject) => {
                    // it would be better to only show the popup after confirming the token's
                    // not in storage, but fetching the token is async, and our popup would get
                    // blocked in the .then, so we just have to do it now and close it later if
                    // we already authed.
                    const popup = this.showAuthPopup(authOpts);

                    // check if there's an existing token and close the popup if so
                    this.getToken().then(token => {
                        if (token) {
                            popup.close();
                            resolve(token);
                        }
                    });
                    this.registerMessageHandler(popup).then(resolve).catch(reject);
                }).then(token => this.storeToken(token));
            };
            AuthMethods.isAuthorized = function isAuthorized() {
                return this.getToken().then(token => !!token);
            };
            AuthMethods.checkAndStoreToken = function checkAndStoreToken() {
                // Two things might be happening here, but we're combining them to make
                // the API simpler for developers.
                //
                // 1. Trello has redirected to us with a token in the hash, in which case
                // we should forward it to our iframe and then close the window
                //
                // 2. we're inside an iframe inside trello, in which case we should look
                // to see if there's a token waiting in localstorage. If there is, put it
                // into plugindata

                // Trello redirects to our domain with #token= (i.e., token=empty string) when they
                // click deny. We want to still send that on, so that the iframe can respond
                const matches = window.location.hash.match(/token=(.+)?/);
                if (matches && matches.length === 2) {
                    const token = matches[1] || '';
                    try {
                        // We need localStorage because there are two cases
                        // where `window.opener` is null. They are:
                        //
                        // 1. When the user was initially logged out, then logged in and
                        // authorized the pup. In this case, the Trello web client refreshes
                        // itself, so we lose `window.opener`; and
                        // 2. In the Trello desktop app. Due to Electron weirdness, window.opener
                        // is not set
                        this.localStorage.setItem(this.tokenStorageKey, token);
                    } catch (err) {
                        // we will try to postMessage. if window.opener is not set now, hopefully
                        // the user tries again, and it'll be set next time (as in case 1 above.)
                    }
                    try {
                        // We need postMessage because localStorage does not work across windows
                        // in Safari, and because localStorage in general can throw in various
                        // scenarios.
                        if (window.opener) {
                            window.opener.postMessage(token, window.location.origin);
                        }
                    } catch (err) {
                        // whelp we tried
                    }

                    // wait a bit to give the postMessage/localStorage handler a head-start
                    window.setTimeout(() => window.close(), 500);
                } else {
                    this.fetchAndStoreToken();
                }
            };
/* harmony default export */ const authorize = (AuthMethods);
            ;// CONCATENATED MODULE: ./src/power-up-js/rest-api/index.js


            class RestApi {
                constructor(_ref) {
                    let {
                        t,
                        appKey,
                        appName,
                        appAuthor,
                        apiOrigin = 'https://api.trello.com',
                        authOrigin = 'https://trello.com',
                        localStorage = window.localStorage,
                        tokenStorageKey = 'trello_token'
                    } = _ref;
                    this.appKey = appKey;
                    this.appName = appName;
                    this.appAuthor = appAuthor;
                    this.apiOrigin = apiOrigin;
                    this.authOrigin = authOrigin;
                    this.t = t;
                    this.localStorage = localStorage;
                    this.tokenStorageKey = tokenStorageKey;
                }
                init() {
                    this.checkAndStoreToken();
                }
                apiBase() {
                    return `${this.apiOrigin}/1`;
                }
                authBase() {
                    return `${this.authOrigin}/1`;
                }
            }
            Object.keys(authorize).forEach(method => {
                RestApi.prototype[method] = authorize[method];
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/plugin.js











            class TrelloPlugin {
                constructor(handlers) {
                    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    this.handlers = {};
                    this.io = null;
                    this.NotHandled = (index_esm_default()).NotHandled;
                    this.options = options;
                    if (options.Sentry) {
                        options.Sentry.configureScope(scope => {
                            scope.setTag('powerupjs_version', '1.25.0');
                        });
                    }
                    const self = this;
                    Object.keys(handlers).forEach(command => {
                        self.handlers[command] = function handleCommand() {
                            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                                args[_key] = arguments[_key];
                            }
                            const innerSelf = this;
                            return bluebird_default()["try"](() => handlers[command].apply(innerSelf, args)).then(process_result);
                        };
                    });
                    this.handlers.callback = function callback(t, cbOpts) {
                        return callback_cache.callback.call(this, t, cbOpts, process_result);
                    };
                    const anonymousHandlers = ['requestWithContext', 'getAll', 'get', 'set', 'remove', 'safe', 'localizeKey', 'localizeKeys', 'localizeNode', 'board', 'cards', 'lists', 'member', 'organization'];
                    anonymousHandlers.forEach(method => {
                        if (lodash_has_default()(host_handlers, method)) {
                            self[method] = host_handlers[method];
                        }
                    });
                }
                connect() {
                    const self = this;
                    const io = initialize_io(this.handlers, immutable_default()(this.options, {
                        hostHandlers: immutable_default()(host_handlers, {
                            getRestApi() {
                                if (!self.restApi) {
                                    throw new error.ApiNotConfiguredError('To use the API helper, make sure you specify appKey and appName when you call TrelloPowerup.initialize. For more, https://developers.trello.com/v1.0/reference#rest-api.');
                                }
                                self.restApi.t = this;
                                return self.restApi;
                            }
                        })
                    }));
                    this.io = io;
                    return io.request('initialize', Object.keys(this.handlers)).then(init => {
                        io.secret = init.secret;
                        window.locale = init.locale || 'en';
                        if (this.options.Sentry && typeof init === 'object') {
                            // configure static variables that we know won't change this session
                            this.options.Sentry.configureScope(scope => {
                                scope.setTag('locale', window.locale);
                                scope.setTag('trello_version', init.version || 'unknown');
                                if (init.member) {
                                    scope.setUser({
                                        id: init.member
                                    });
                                }
                            });
                        }
                        return initialize_i18n(window.locale, this.options).then(() => io.request('ready'));
                    }).then(() => io);
                }
                initApi() {
                    if (this.options.appKey && this.options.appName) {
                        this.restApi = new RestApi({
                            t: this,
                            appKey: this.options.appKey,
                            appName: this.options.appName,
                            appAuthor: this.options.appAuthor,
                            apiOrigin: this.options.apiOrigin,
                            authOrigin: this.options.authOrigin,
                            localStorage: this.options.localStorage,
                            tokenStorageKey: this.options.tokenStorageKey
                        });
                        this.connect().tap(() => this.restApi.init());
                        return;
                    }
                    if (this.options.appKey || this.options.appName) {
                        // if we got here bc they forgot to specify one of the options, try to help them out
                        warn('Both appKey and appName must be included to use the API. See more https://developers.trello.com/v1.0/reference#rest-api.');
                    }
                    this.connect();
                }
                request(command, options) {
                    return this.io.request(command, options);
                }
                init() {
                    this.initApi();
                }
            }
            TrelloPlugin.prototype.NotHandled = (index_esm_default()).NotHandled;
/* harmony default export */ const power_up_js_plugin = (TrelloPlugin);
            // EXTERNAL MODULE: ./node_modules/bind-event-listener/dist/index.js
            var dist = __webpack_require__(197);
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/ds-lib/dist/esm/utils/noop.js
            /**
             * An empty function which does nothing.
             */
            // eslint-disable-next-line @repo/internal/react/use-noop
            function noop() { }
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/platform-feature-flags/dist/esm/debug.js
            var _ref, _globalThis$process, _globalThis$process$e, _globalThis$process2, _globalThis$process2$;
            // We can't rely on NODE_ENV === 'test' if its value is already configured by the consumer to some other value, so better to use JEST_WORKER_ID
            // https://jestjs.io/docs/environment-variables#jest_worker_id
            var TESTS_MODE = (_ref = (globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$process = globalThis.process) === null || _globalThis$process === void 0 ? void 0 : (_globalThis$process$e = _globalThis$process.env) === null || _globalThis$process$e === void 0 ? void 0 : _globalThis$process$e.JEST_WORKER_ID) !== undefined) !== null && _ref !== void 0 ? _ref : false;
            var DEBUG_MODE = !TESTS_MODE && (globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$process2 = globalThis.process) === null || _globalThis$process2 === void 0 ? void 0 : (_globalThis$process2$ = _globalThis$process2.env) === null || _globalThis$process2$ === void 0 ? void 0 : _globalThis$process2$.NODE_ENV) !== 'production';
            var debug = function debug() {
                var _console;
                if (!DEBUG_MODE) {
                    return;
                }

                // eslint-disable-next-line no-console
                (_console = console).debug.apply(_console, arguments);
            };
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/platform-feature-flags/dist/esm/resolvers.js

            var pkgName = '@atlaskit/platform-feature-flags';
            var hasProcessEnv = typeof process !== 'undefined' && typeof process.env !== 'undefined';

            // FF global overrides can be configured by test runners or Storybook
            var ENV_ENABLE_PLATFORM_FF = hasProcessEnv ?
                // Use global "process" variable and process.env['FLAG_NAME'] syntax, so it can be replaced by webpack DefinePlugin
                process.env['ENABLE_PLATFORM_FF'] === 'true' : false;

            // STORYBOOK_ENABLE_PLATFORM_FF is included as storybook only allows env vars prefixed with STORYBOOK
            // https://github.com/storybookjs/storybook/issues/12270

            var ENV_STORYBOOK_ENABLE_PLATFORM_FF = hasProcessEnv ?
                // Use global "process" variable and process.env['FLAG_NAME'] syntax, so it can be replaced by webpack DefinePlugin
                process.env['STORYBOOK_ENABLE_PLATFORM_FF'] === 'true' : false;
            var ENABLE_GLOBAL_PLATFORM_FF_OVERRIDE = ENV_ENABLE_PLATFORM_FF || ENV_STORYBOOK_ENABLE_PLATFORM_FF;
            var booleanResolver = function booleanResolver() {
                return false;
            };
            function resolvers_setBooleanResolver(resolver) {
                booleanResolver = resolver;
            }
            function resolveBooleanFlag(flagKey) {
                if (ENABLE_GLOBAL_PLATFORM_FF_OVERRIDE) {
                    debug('[%s]: The feature flags were enabled while running tests. The flag "%s" will be always enabled.', pkgName, flagKey);
                    return true;
                }
                try {
                    var result = booleanResolver(flagKey);
                    if (typeof result !== 'boolean') {
                        // eslint-disable-next-line no-console
                        console.warn("".concat(flagKey, " resolved to a non-boolean value, returning false for safety"));
                        return false;
                    }
                    return result;
                } catch (e) {
                    return false;
                }
            }
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/platform-feature-flags/dist/esm/index.js


            /**
             * Sets the flag resolver for boolean flags.
             * @param flagResolver
             */
            function setBooleanFeatureFlagResolver(flagResolver) {
                setBooleanResolver(flagResolver);
            }

            /**
             * Returns the value of a feature flag. If the flag does not resolve, it returns the "false" as a default value.
             * @param name
             */
            function esm_getBooleanFF(name) {
                return resolveBooleanFlag(name);
            }
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/es2019/constants.js
            const constants_THEME_DATA_ATTRIBUTE = 'data-theme';
            const es2019_constants_COLOR_MODE_ATTRIBUTE = 'data-color-mode';
            const constants_DEFAULT_THEME = 'light';
            const constants_CSS_PREFIX = 'ds';
            const constants_CSS_VAR_FULL = (/* unused pure expression or super */ null && (['opacity', 'font', 'space']));
            const constants_TOKEN_NOT_FOUND_CSS_VAR = `--${constants_CSS_PREFIX}-token-not-found`;
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/es2019/artifacts/theme-import-map.js
            /**
             * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
             *
             * This file contains a dynamic import for each theme this package exports.
             * Themes are loaded asynchronously at runtime to minimise the amount of CSS we send to the client.
             * This allows users to compose their themes and only use the tokens that are requested.
             * When a new theme is created, the import should automatically be added to the map
             *
             * @codegen <<SignedSource::ca8d4c1cc14d5ffdeec544d1087312a4>>
             * @codegenCommand yarn build tokens
             */

            const themeImportsMap = {
                'light': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-light */ 334).then(__webpack_require__.bind(__webpack_require__, 750)),
                'dark': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-dark */ 903).then(__webpack_require__.bind(__webpack_require__, 821)),
                'legacy-light': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-legacy-light */ 25).then(__webpack_require__.bind(__webpack_require__, 649)),
                'legacy-dark': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-legacy-dark */ 214).then(__webpack_require__.bind(__webpack_require__, 806)),
                'spacing': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-spacing */ 436).then(__webpack_require__.bind(__webpack_require__, 495)),
                'typography': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-typography */ 211).then(__webpack_require__.bind(__webpack_require__, 381)),
                'shape': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-shape */ 210).then(__webpack_require__.bind(__webpack_require__, 512)),
                'dark-iteration': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-dark-iteration */ 216).then(__webpack_require__.bind(__webpack_require__, 543)),
                'light-new-input-border': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-light-new-input-border */ 85).then(__webpack_require__.bind(__webpack_require__, 764)),
                'dark-new-input-border': () => __webpack_require__.e(/* import() | @atlaskit-internal_atlassian-dark-new-input-border */ 942).then(__webpack_require__.bind(__webpack_require__, 701))
            };
/* harmony default export */ const theme_import_map = (themeImportsMap);
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/es2019/utils/theme-loading.js


            const loadAndAppendThemeCss = async themeId => {
                if (document.head.querySelector(`style[${constants_THEME_DATA_ATTRIBUTE}="${themeId}"]`)) {
                    return;
                }
                const themeCss = await theme_loading_loadThemeCss(themeId);
                const style = document.createElement('style');
                style.textContent = themeCss;
                style.dataset.theme = themeId;
                document.head.appendChild(style);
            };
            const theme_loading_loadThemeCss = async themeId => {
                const {
                    default: themeCss
                } = await theme_import_map[themeId]();
                return themeCss;
            };
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/es2019/theme-config.js
            /**
             * This file contains the source of truth for themes and all associated meta data.
             */

            /**
             * Themes: The internal identifier of a theme.
             * These ids are what the actual theme files/folders are called.
             * style-dictionary will attempt to locate these in the file-system.
             */

            /**
             * Theme kinds: The type of theme.
             * Some themes are entirely focused on Color, whilst others are purely focused on spacing.
             * In the future other types may be introduced such as typography.
             */

            /**
             * Theme modes: The general purpose of a theme.
             * This attr is used to apply the appropriate system-preference option
             * It may also be used as a selector for mode-specific overrides such as light/dark images.
             * The idea is there may exist many color themes, but every theme must either fit into light or dark.
             */
            const themeColorModes = (/* unused pure expression or super */ null && (['light', 'dark', 'auto']));
            /**
             * Theme ids: The value that will be mounted to the DOM as a data attr
             * For example: `data-theme="light:light dark:dark spacing:spacing"
             *
             * These ids must be kebab case
             */
            const themeIds = ['light', 'dark', 'legacy-light', 'legacy-dark', 'spacing', 'typography', 'shape'];

            /**
             * Theme to use a base. This will create the theme as
             * an extension with all token values marked as optional
             * to allow tokens to be overridden as required.
             */

            /**
             * Palettes: The set of base tokens a given theme may be populated with.
             * For example: legacy light & dark themes use the "legacyPalette" containing colors from our
             * previous color set.
             */

            /**
             * ThemeConfig: the source of truth for all theme meta-data.
             * This object should be used whenever interfacing with themes.
             */

            const themeConfig = {
                'atlassian-light': {
                    id: 'light',
                    displayName: 'Light Theme',
                    palette: 'defaultPalette',
                    attributes: {
                        type: 'color',
                        mode: 'light'
                    }
                },
                'atlassian-dark': {
                    id: 'dark',
                    displayName: 'Dark Theme',
                    palette: 'defaultPalette',
                    attributes: {
                        type: 'color',
                        mode: 'dark'
                    }
                },
                'atlassian-legacy-light': {
                    id: 'legacy-light',
                    displayName: 'Light Theme (legacy)',
                    palette: 'legacyPalette',
                    attributes: {
                        type: 'color',
                        mode: 'light'
                    }
                },
                'atlassian-legacy-dark': {
                    id: 'legacy-dark',
                    displayName: 'Dark Theme (legacy)',
                    palette: 'legacyPalette',
                    attributes: {
                        type: 'color',
                        mode: 'dark'
                    }
                },
                'atlassian-spacing': {
                    id: 'spacing',
                    displayName: 'Atlassian Spacing',
                    palette: 'spacingScale',
                    attributes: {
                        type: 'spacing'
                    }
                },
                'atlassian-typography': {
                    id: 'typography',
                    displayName: 'Atlassian Typography',
                    palette: 'typographyPalette',
                    attributes: {
                        type: 'typography'
                    }
                },
                'atlassian-shape': {
                    id: 'shape',
                    displayName: 'Atlassian Shape',
                    palette: 'shapePalette',
                    attributes: {
                        type: 'shape'
                    }
                }
            };
            const themeOverrideConfig = {
                'atlassian-dark-iteration': {
                    id: 'dark-iteration',
                    displayName: 'Dark Theme Iteration',
                    palette: 'defaultPalette',
                    overrideTheme: 'dark',
                    attributes: {
                        type: 'color',
                        mode: 'dark'
                    }
                },
                'atlassian-light-new-input-border': {
                    id: 'light-new-input-border',
                    displayName: 'Light Theme New Input Border',
                    palette: 'defaultPalette',
                    overrideTheme: 'light',
                    attributes: {
                        type: 'color',
                        mode: 'light'
                    }
                },
                'atlassian-dark-new-input-border': {
                    id: 'dark-new-input-border',
                    displayName: 'Dark Theme New Input Border',
                    palette: 'defaultPalette',
                    overrideTheme: 'dark',
                    attributes: {
                        type: 'color',
                        mode: 'dark'
                    }
                }
            };
/* harmony default export */ const theme_config = ((/* unused pure expression or super */ null && (themeConfig)));
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/es2019/utils/theme-state-transformer.js

            const themeKinds = ['light', 'dark', 'spacing', 'typography'];
            const isThemeKind = themeKind => {
                return themeKinds.find(kind => kind === themeKind) !== undefined;
            };
            const isThemeIds = themeId => {
                return themeIds.find(id => id === themeId) !== undefined;
            };
            const isColorMode = modeId => {
                return ['light', 'dark', 'auto'].includes(modeId);
            };
            /**
             * Converts a string that is formatted for the `data-theme` HTML attribute
             * to an object that can be passed to `setGlobalTheme`.
             *
             * @param {string} themes The themes that should be applied.
             *
             * @example
             * ```
             * themeStringToObject('dark:dark light:legacy-light spacing:spacing');
             * // returns { dark: 'dark', light: 'legacy-light', spacing: 'spacing' }
             * ```
             */
            const themeStringToObject = themeState => {
                return themeState.split(' ').map(theme => theme.split(':')).reduce((themeObject, [kind, id]) => {
                    if (kind === 'colorMode' && isColorMode(id)) {
                        themeObject[kind] = id;
                    }
                    if (isThemeKind(kind) && isThemeIds(id)) {
                        themeObject[kind] = id;
                    }
                    return themeObject;
                }, {});
            };

            /**
             * Converts a theme object to a string formatted for the `data-theme` HTML attribute.
             *
             * @param {object} themes The themes that should be applied.
             *
             * @example
             * ```
             * themeObjectToString({ dark: 'dark', light: 'legacy-light', spacing: 'spacing' });
             * // returns 'dark:dark light:legacy-light spacing:spacing'
             * ```
             */
            const themeObjectToString = themeState => Object.entries(themeState).reduce((themeString, [kind, id]) => (kind === 'colorMode' || isThemeKind(kind)) && (isThemeIds(id) || isColorMode(id)) ? themeString + `${themeString ? ' ' : ''}` + `${kind}:${id}` : themeString, '');
            ;// CONCATENATED MODULE: ./node_modules/@atlaskit/tokens/dist/es2019/set-global-theme.js







            // Represents theme state once mounted to the page (auto is hidden from observers)

            const defaultColorMode = 'light';
            const isMatchMediaAvailable = typeof window !== 'undefined' && 'matchMedia' in window;
            const darkModeMediaQuery = '(prefers-color-scheme: dark)';
            const darkModeMql = isMatchMediaAvailable && window.matchMedia(darkModeMediaQuery);
            let unbindThemeChangeListener = noop;
            const themeStateDefaults = {
                colorMode: 'auto',
                dark: 'dark',
                light: 'light',
                spacing: undefined,
                typography: undefined
            };

            /**
             * Updates the current theme when the system theme changes. Should be bound
             * to an event listener listening on the '(prefers-color-scheme: dark)' query
             * @param e The event representing a change in system theme.
             */
            const checkNativeListener = function (e) {
                const element = document.documentElement;
                element.setAttribute(es2019_constants_COLOR_MODE_ATTRIBUTE, e.matches ? 'dark' : 'light');
            };
            const getThemePreferences = themeState => {
                const {
                    colorMode,
                    dark,
                    light,
                    spacing,
                    typography
                } = themeState;
                const themePreferences = colorMode === 'auto' ? [light, dark] : [themeState[colorMode]];
                [spacing, typography].forEach(themeId => {
                    if (themeId) {
                        themePreferences.push(themeId);
                    }
                });
                if (esm_getBooleanFF('platform.design-system-team.update-border-input_ff9l1')) {
                    themePreferences.push(`${themePreferences.includes('dark') ? 'dark' : 'light'}-new-input-border`);
                }
                return [...new Set(themePreferences)];
            };

            /**
             * Sets the theme globally at runtime. This updates the `data-theme` and `data-color-mode` attributes on your page's <html> tag.
             *
             * @param {Object<string, string>} themeState The themes and color mode that should be applied.
             * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
             * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
             * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
             * @param {string} themeState.spacing The spacing theme to be applied.
             * @param {string} themeState.typography The typography theme to be applied.
             *
             * @returns A Promise of an unbind function, that can be used to stop listening for changes to system theme.
             *
             * @example
             * ```
             * setGlobalTheme({colorMode: 'auto', light: 'light', dark: 'dark', spacing: 'spacing'});
             * ```
             */
            const setGlobalTheme = async ({
                colorMode = themeStateDefaults['colorMode'],
                dark = themeStateDefaults['dark'],
                light = themeStateDefaults['light'],
                spacing = themeStateDefaults['spacing'],
                typography = themeStateDefaults['typography']
            } = {}) => {
                const themePreferences = getThemePreferences({
                    colorMode,
                    dark,
                    light,
                    spacing,
                    typography
                });
                await Promise.all(themePreferences.map(async themeId => await loadAndAppendThemeCss(themeId)));
                if (themePreferences.includes('dark')) {
                    if (
                        // eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
                        esm_getBooleanFF('design-system-team.dark-theme-iteration_dk1ln')) {
                        await loadAndAppendThemeCss('dark-iteration');
                    } else if (esm_getBooleanFF('platform.design-system-team.dark-iteration-confluence_e2t22')) {
                        await loadAndAppendThemeCss('dark-iteration');
                    }
                }
                if (colorMode === 'auto' && darkModeMql) {
                    colorMode = darkModeMql.matches ? 'dark' : 'light';
                    // Add an event listener for changes to the system theme.
                    // If the function exists, it will not be added again.
                    unbindThemeChangeListener = (0, dist/* bind */.ak)(darkModeMql, {
                        type: 'change',
                        listener: checkNativeListener
                    });
                } else {
                    unbindThemeChangeListener();
                }
                const themeAttributes = getThemeHtmlAttrs({
                    colorMode,
                    dark,
                    light,
                    spacing,
                    typography
                });
                Object.entries(themeAttributes).forEach(([key, value]) => {
                    document.documentElement.setAttribute(key, value);
                });
                return unbindThemeChangeListener;
            };
            /**
             * Takes an object containing theme preferences, and returns an array of objects for use in applying styles to the document head.
             * Only supplies the color themes necessary for initial render, based on the current themeState. I.e. if in light mode, dark mode themes are not returned.
             *
             * @param {Object<string, string>} themeState The themes and color mode that should be applied.
             * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
             * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
             * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
             * @param {string} themeState.spacing The spacing theme to be applied.
             * @param {string} themeState.typography The typography theme to be applied.
             *
             * @returns A Promise of an object array, containing theme IDs, data-attributes to attach to the theme, and the theme CSS.
             * If an error is encountered while loading themes, the themes arrav will be emptv.
             */
            const getThemeStyles = async ({
                colorMode = themeStateDefaults['colorMode'],
                dark = themeStateDefaults['dark'],
                light = themeStateDefaults['light'],
                spacing = themeStateDefaults['spacing'],
                typography = themeStateDefaults['typography']
            } = {}) => {
                const themePreferences = getThemePreferences({
                    colorMode,
                    dark,
                    light,
                    spacing,
                    typography
                });
                if (themePreferences.includes('dark')) {
                    if (
                        // eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
                        getBooleanFF('design-system-team.dark-theme-iteration_dk1ln')) {
                        themePreferences.push('dark-iteration');
                    } else if (getBooleanFF('platform.design-system-team.dark-iteration-confluence_e2t22')) {
                        themePreferences.push('dark-iteration');
                    }
                }
                const results = await Promise.all(themePreferences.map(async themeId => {
                    try {
                        const css = await loadThemeCss(themeId);
                        return {
                            id: themeId,
                            attrs: {
                                'data-theme': themeId
                            },
                            css
                        };
                    } catch {
                        // Return an empty string if there's an error loading it.
                        return undefined;
                    }
                }));
                return results.filter(theme => theme !== undefined);
            };

            /**
             * Server-side rendering utility. Generates the valid HTML attributes for a given theme.
             * Note: this utility does not handle automatic theme switching.
             *
             * @param {Object<string, string>} themeOptions - Theme options object
             * @param {string} themeState.colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
             * @param {string} themeState.dark The color theme to be applied when the color mode resolves to 'dark'.
             * @param {string} themeState.light The color theme to be applied when the color mode resolves to 'light'.
             * @param {string} themeState.spacing The spacing theme to be applied.
             * @param {string} themeState.typography The typography theme to be applied.
             *
             * @returns {Object} Object of HTML attributes to be applied to the document root
             */
            const getThemeHtmlAttrs = ({
                colorMode = themeStateDefaults['colorMode'],
                dark = themeStateDefaults['dark'],
                light = themeStateDefaults['light'],
                spacing = themeStateDefaults['spacing'],
                typography = themeStateDefaults['typography']
            } = {}) => {
                const themePreferences = {
                    dark,
                    light,
                    spacing,
                    typography
                };
                const themeAttribute = themeObjectToString(themePreferences);
                return {
                    [constants_THEME_DATA_ATTRIBUTE]: themeAttribute,
                    [es2019_constants_COLOR_MODE_ATTRIBUTE]: colorMode === 'auto' ? defaultColorMode : colorMode
                };
            };

            /**
             * Provides a script that, when executed before paint, sets the `data-color-mode` attribute based on the current system theme,
             * to enable SSR support for automatic theme switching, avoid a flash of un-themed content on first paint.
             *
             * @param {string} colorMode Determines which color theme is applied. If set to `auto`, the theme applied will be determined by the OS setting.
             *
             * @returns {string} A string to be added to the innerHTML of a script tag in the document head
             */
            const getSSRAutoScript = colorMode => {
                return colorMode === 'auto' ? `(
  () => {
    try {
      const mql = window.matchMedia('${darkModeMediaQuery}');
      const colorMode = mql.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('${COLOR_MODE_ATTRIBUTE}', colorMode);
    } catch (e) {}
  }
)()` : undefined;
            };
/* harmony default export */ const set_global_theme = (setGlobalTheme);
            ;// CONCATENATED MODULE: ./src/power-up-js/util/arg.js


            let hashData = null;
/* harmony default export */ const arg = ((key, defaultValue) => {
                if (!hashData) {
                    try {
                        hashData = JSON.parse(decodeURIComponent(window.location.hash.replace(/^#/, '')));
                    } catch (error) {
                        warn('Power-Up unable to parse url hash, perhaps you needed a t.signUrl(url)?', error);
                        hashData = {};
                    }
                }
                if (lodash_has_default()(hashData, key)) {
                    return hashData[key];
                }
                return defaultValue;
            });
            ;// CONCATENATED MODULE: ./src/power-up-js/iframe.js












            class TrelloIFrame {
                constructor() {
                    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    options.useADSTokens ??= true;
                    this.io = null;
                    this.args = [{
                        context: arg('context', options.context),
                        secret: arg('secret', options.secret)
                    }].concat(arg('args'));
                    this.secret = arg('secret', options.secret);
                    this.options = options;
                    window.locale = arg('locale', 'en');
                    // we will start getting your localization ready immediately
                    // but it won't be guaranteed ready to go until we call your render function
                    this.i18nPromise = initialize_i18n(window.locale, options);

                    // since this is for a secondary iframe, if we don't have a secret something is probably wrong
                    // Trello won't respond to our requests that don't include a secret
                    if (!this.secret) {
                        warn('Power-Up iframe initialized without a secret. Requests to Trello will not work.');
                        warn('If this is an attachment-section or card-back-section make sure you call t.signUrl on the urls you provide.');
                    }
                }
                init() {
                    this._initTrelloThemeChangeListener();
                    this.initSentry();
                    this.initApi();
                    this.connect();
                }
                connect() {
                    const handlers = {
                        callback(t, options) {
                            return callback_cache.callback.call(this, t, options, process_result);
                        }
                    };
                    this.io = initialize_io(handlers, immutable_default()(this.options, {
                        secret: arg('secret'),
                        hostHandlers: host_handlers
                    }));
                }
                request(command, options) {
                    return this.io.request(command, options);
                }
                render(fxRender) {
                    if (typeof fxRender !== 'function') {
                        throw new TypeError('Argument passed to render must be a function');
                    }
                    const self = this;
                    // cleanup old listeners in case this is called multiple times
                    if (self.onMessage) {
                        window.removeEventListener('message', self.onMessage, false);
                    }
                    self.onMessage = e => {
                        if (e.source === window.parent && e.data === 'render') {
                            self.i18nPromise.then(() => {
                                fxRender();
                            });
                        }
                    };
                    window.addEventListener('message', self.onMessage, false);
                }
                initApi() {
                    if (!this.options.appKey || !this.options.appName) {
                        // if we got here bc they forgot to specify one of the options, try to help them out
                        if (this.options.appKey || this.options.appName) {
                            warn('Both appKey and appName must be included to use the API. See more at https://developers.trello.com/v1.0/reference#rest-api.');
                        }
                        return;
                    }
                    this.restApi = new RestApi({
                        t: this,
                        appKey: this.options.appKey,
                        appName: this.options.appName,
                        appAuthor: this.options.appAuthor,
                        apiOrigin: this.options.apiOrigin,
                        authOrigin: this.options.authOrigin,
                        localStorage: this.options.localStorage,
                        tokenStorageKey: this.options.tokenStorageKey
                    });
                    this.restApi.init();
                }
                getRestApi() {
                    if (!this.restApi) {
                        throw new error.ApiNotConfiguredError('To use the API helper, make sure you specify appKey and appName when you call TrelloPowerUp.iframe. See more at https://developers.trello.com/v1.0/reference#rest-api');
                    }
                    return this.restApi;
                }

                /**
                 * If developers provide their Sentry object, we will be nice and help to set
                 * as much context for them as possible. See:
                 * https://docs.sentry.io/enriching-error-data/context/?platform=browser
                 * https://docs.sentry.io/enriching-error-data/scopes/?platform=browser
                 */
                initSentry() {
                    if (this.options.Sentry) {
                        // in the case of a secondary iframe, the context is signed into the URL
                        // this means that we don't have to worry about it changing
                        const context = arg('context', this.options.context);
                        this.options.Sentry.configureScope(scope => {
                            scope.setTag('locale', arg('locale', 'en'));
                            scope.setTag('powerupjs_version', '1.25.0');
                            if (!context || typeof context !== 'object') {
                                return;
                            }
                            scope.setTag('trello_version', context.version || 'unknown');
                            if (context.member) {
                                scope.setUser({
                                    id: context.member
                                });
                            }
                            if (context.board) {
                                scope.setTag('idBoard', context.board);
                            }
                            if (context.permissions) {
                                Object.keys(context.permissions).forEach(perm => {
                                    scope.setExtra(`${perm}_permission`, context.permissions[perm]);
                                });
                            }
                        });
                    }
                }
                _notifyThemeChange(theme) {
                    this.args[0].context.theme = theme;
                    window.postMessage({
                        type: POWER_UP_THEME_CHANGE_EVENT,
                        theme
                    }, window.location.origin);
                }
                _updateTheme(theme) {
                    if (!this.options.useADSTokens) {
                        this._notifyThemeChange(theme);
                        return;
                    }
                    const documentDataAttrs = Object.entries(getThemeHtmlAttrs({
                        colorMode: theme
                    }));
                    if (theme === null) {
                        documentDataAttrs.forEach(_ref => {
                            let [key] = _ref;
                            document.documentElement.removeAttribute(key);
                        });
                        this._notifyThemeChange(theme);
                        return;
                    }

                    // Setting the attributes here may lead to flashing in some cases, to fix
                    // this, devs can instantiate the iframe class in a script tag in the head
                    // of their iframe.
                    // NOTE: They MUST have included the atlaskit theme stylesheets for this to
                    // work properly, otherwise instantiating the iframe class in the head
                    // of their iframe document will do nothing and we will fall back to
                    // dynamically loading the theme stylesheets which may lead to flashing
                    // even though the script tag is in the head and *should* run before the
                    // iframe is rendered but due to the async nature of setGlobalTheme the
                    // execution order is not guaranteed anymore and thus flashing may occur.
                    documentDataAttrs.forEach(_ref2 => {
                        let [key, value] = _ref2;
                        document.documentElement.setAttribute(key, value);
                    });
                    const isADSStyleSheetPresentAndWorking = this.getComputedColorToken('color.text', 'fallback') !== 'fallback';
                    if (isADSStyleSheetPresentAndWorking) {
                        this._notifyThemeChange(theme);
                        return;
                    }

                    // Dev didn't include the ads themes stylesheet or it failed to load,
                    // we're falling back to loading the themes dynamically (may lead to flashing).
                    set_global_theme({
                        colorMode: theme
                    }).then(unbindThemeChangeListener => {
                        // We don't want setGlobalTheme to be in charge of updating the theme
                        // if the user has selected 'auto' as the theme (theme is controlled
                        // by OS), instead we want to handle theme updates in
                        // _initTrelloThemeChangeListener
                        unbindThemeChangeListener();
                        this._notifyThemeChange(theme);
                    }).catch(err => {
                        documentDataAttrs.forEach(_ref3 => {
                            let [key] = _ref3;
                            document.documentElement.removeAttribute(key);
                        });

                        // eslint-disable-next-line no-console
                        console.error(`Failed to load ADS tokens - ${(err === null || err === void 0 ? void 0 : err.stack) ?? ''}`);
                    });
                }
                _initTrelloThemeChangeListener() {
                    // TODO: Remove powerUpTheme once we've merged and soaked web's changes
                    const {
                        initialTheme,
                        theme: powerUpTheme
                    } = this.getContext() ?? {};
                    if (initialTheme || powerUpTheme) {
                        this._updateTheme(initialTheme ?? powerUpTheme);
                    }
                    const callback = e => {
                        var _this$getContext;
                        const {
                            theme,
                            type
                        } = e.data;
                        if (e.source !== window.parent || theme === undefined || type === POWER_UP_THEME_CHANGE_EVENT ||
                            // We don't want to use the theme value from the closure above as that
                            // can get out of sync with the actual theme.
                            theme === ((_this$getContext = this.getContext()) === null || _this$getContext === void 0 ? void 0 : _this$getContext.theme)) {
                            return;
                        }
                        this._updateTheme(theme);
                    };
                    window.addEventListener('message', callback);
                }
            }
            TrelloIFrame.prototype.NotHandled = (index_esm_default()).NotHandled;

            // eslint-disable-next-line no-restricted-syntax
            for (const method in host_handlers) {
                if (lodash_has_default()(host_handlers, method)) {
                    TrelloIFrame.prototype[method] = host_handlers[method];
                }
            }
/* harmony default export */ const iframe = (TrelloIFrame);
            // EXTERNAL MODULE: ./src/power-up-js/compatibility/closest.js
            var closest = __webpack_require__(611);
            ;// CONCATENATED MODULE: ./src/power-up-js/index.js















            class TrelloPowerUp {
                constructor() {
                    this.version = '1.25.0';
                    this.CallbackCache = callback_cache;
                    this.PostMessageIO = (index_esm_default());
                    this.Promise = (bluebird_default());
                    this.util = {
                        colors: {
                            getHexString: getHexString,
                            namedColorStringToHex: namedColorStringToHex
                        },
                        convert: {
                            bytesToHexString: bytesToHexString,
                            hexStringToUint8Array: hexStringToUint8Array
                        },
                        crypto: simple_crypto,
                        initLocalizer: initialize_i18n,
                        i18n: {
                            localizeKey: localizeKey,
                            localizeKeys: localizeKeys,
                            localizeNode: localizeNode
                        },
                        makeErrorEnum: make_error_enum,
                        relativeUrl: relative_url
                    };
                    this.restApiError = error;
                    this.initialize = this.initialize.bind(this);
                    this.iframe = this.iframe.bind(this);
                }
                initialize(handlers, options) {
                    if (this.iframeConnector != null) {
                        warn('Cannot call TrelloPowerUp.initialize() from a secondary iframe where you have already called TrelloPowerUp.iframe(). TrelloPowerUp.initialize() should only be called from your index connector page, and should not include a call to TrelloPowerUp.iframe()');
                    }
                    if (this.indexConnector != null) {
                        warn('Warning: calling TrelloPowerUp.initialize() more than once will have no effect. It is expected that you call it only once on your index connector.');
                        return this.indexConnector;
                    }
                    this.indexConnector = new power_up_js_plugin(handlers, options);
                    this.indexConnector.init();
                    return this.indexConnector;
                }
                iframe(options) {
                    if (this.indexConnector != null) {
                        warn('Cannot call TrelloPowerUp.iframe() from your index connector where you call TrelloPowerUp.initialize(). TrelloPowerUp.iframe() is only used for secondary iframes you may create or request from Trello during the Power-Up lifecycle.');
                    }
                    if (this.iframeConnector != null) {
                        return this.iframeConnector;
                    }
                    this.iframeConnector = new iframe(options);
                    this.iframeConnector.init();
                    return this.iframeConnector;
                }
            }
/* harmony default export */ const power_up_js = (TrelloPowerUp);
            ;// CONCATENATED MODULE: ./src/power-up-js/client.js


            // eslint-disable-next-line func-names
            (function () {
                // eslint-disable-next-line global-require
                window.TrelloPowerUp = new power_up_js();
            })();
        })();

/******/ 	return __webpack_exports__;
        /******/
})()
        ;
});