"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vuex_1 = require("vuex");
var App = /** @class */ (function () {
    function App(config) {
        this._store = new vuex_1.default.Store(__assign({}, config));
        this.registerConfig = config.registerConfig;
    }
    App.prototype.model = function (model) {
        return this._store.registerModule(model.namespace, model, this.registerConfig);
    };
    App.prototype.unmodel = function (model) {
        return this._store.unregisterModule(model.namespace, this.registerConfig);
    };
    return App;
}());
function create(config) {
    return new App(config);
}
exports.create = create;
