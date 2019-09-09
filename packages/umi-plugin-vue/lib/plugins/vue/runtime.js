"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rootContainer({ router, store, Vue }) {
    return new Vue({
        router,
        store,
        render(h) {
            return h("router-view");
        }
    });
}
exports.rootContainer = rootContainer;
