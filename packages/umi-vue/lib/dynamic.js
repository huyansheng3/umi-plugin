"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cached = {};
var registerModel = function (model) {
    if (!cached[model.namespace]) {
        window.g_app.model(model);
        cached[model.namespace] = 1;
    }
};
exports.default = (function (config) {
    var resolveModels = config.models, resolveComponent = config.component;
    var models = typeof resolveModels === "function" ? resolveModels() : [];
    var component = resolveComponent();
    return function () {
        return new Promise(function (resolve) {
            Promise.all(__spreadArrays(models, [component])).then(function (ret) {
                if (!models || !models.length) {
                    return resolve(ret[0]);
                }
                else {
                    var len = models.length;
                    ret.slice(0, len).forEach(function (m) {
                        registerModel(m.default);
                    });
                    resolve(ret[len]);
                }
            });
        });
    };
});
