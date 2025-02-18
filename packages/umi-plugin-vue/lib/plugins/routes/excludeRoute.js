"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
function default_1(routes, excludes) {
    function exclude(routes) {
        return routes.filter(route => {
            for (const exclude of excludes) {
                assert(typeof exclude === "function" || exclude instanceof RegExp, `exclude should be function or RegExp`);
                if (typeof exclude === "function" && exclude(route)) {
                    return false;
                }
                if (!route.component.startsWith("() =>") &&
                    exclude instanceof RegExp &&
                    exclude.test(route.component)) {
                    return false;
                }
            }
            if (route.children) {
                route.children = exclude(route.children);
            }
            return true;
        });
    }
    return exclude(routes);
}
exports.default = default_1;
