"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rootContainer(_a) {
    var router = _a.router, Vue = _a.Vue;
    return new Vue({
        router: router,
        render: function (h) {
            return h("router-view");
        }
    });
}
exports.rootContainer = rootContainer;
