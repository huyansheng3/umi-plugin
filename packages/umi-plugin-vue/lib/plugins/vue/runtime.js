"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rootContainer(_a) {
    var router = _a.router, store = _a.store, Vue = _a.Vue;
    return new Vue({
        router: router,
        store: store,
        render: function (h) {
            return h("router-view");
        }
    });
}
exports.rootContainer = rootContainer;
