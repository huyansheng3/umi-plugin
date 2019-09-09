"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core = require("./vuex-core");
var store = null;
function umiVue(config) {
    var app = core.create(config);
    store = app._store;
    return app;
}
exports.default = umiVue;
exports.dispatch = function () {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return store.dispatch.bind(store).apply(void 0, rest);
};
exports.commit = function () {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return store.commit.bind(store).apply(void 0, rest);
};
exports.watch = function () {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return store.watch.bind(store).apply(void 0, rest);
};
exports.subscribe = function () {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return store.subscribe.bind(store).apply(void 0, rest);
};
exports.subscribeAction = function () {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i] = arguments[_i];
    }
    return store.subscribeAction.bind(store).apply(void 0, rest);
};
var vuex_1 = require("vuex");
exports.mapState = vuex_1.mapState;
var vuex_2 = require("vuex");
exports.mapGetters = vuex_2.mapGetters;
var vuex_3 = require("vuex");
exports.mapActions = vuex_3.mapActions;
var vuex_4 = require("vuex");
exports.mapMutations = vuex_4.mapMutations;
var vuex_5 = require("vuex");
exports.createNamespacedHelpers = vuex_5.createNamespacedHelpers;
