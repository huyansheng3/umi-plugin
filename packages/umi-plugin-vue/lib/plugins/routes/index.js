"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getRouteConfigFromDir_1 = require("./getRouteConfigFromDir");
const excludeRoute_1 = require("./excludeRoute");
const utils_1 = require("../../utils");
function default_1(api, opts = { exclude: [] }) {
    const { paths } = api;
    api.modifyRoutes(memo => {
        return excludeRoute_1.default(getRouteConfigFromDir_1.default(paths), utils_1.optsToArray(opts.exclude));
    });
}
exports.default = default_1;
