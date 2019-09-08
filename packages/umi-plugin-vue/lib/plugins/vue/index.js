"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var VueLoaderPlugin = require("vue-loader/lib/plugin");
var routerVue = "require('./router').default";
function default_1(api, opts) {
    if (opts === void 0) { opts = {}; }
    var vueLoaderOption = opts.vueLoaderOption;
    var config = api.config, paths = api.paths;
    var mountElementId = config.mountElementId || "root";
    api.chainWebpackConfig(function (webpackConfig) {
        webpackConfig.resolve.extensions.merge([".vue"]);
        webpackConfig.module
            .rule("exclude")
            .exclude.add(/\.vue$/)
            .end();
        webpackConfig.module
            .delete("jsx")
            .rule("vue")
            .test(/\.vue$/)
            .include.add(paths.cwd)
            .end()
            .exclude.add(/node_modules/)
            .end()
            .use("vue-loader")
            .loader(require.resolve("vue-loader"))
            .options(vueLoaderOption);
        webpackConfig.plugin("vue-plugin").use(VueLoaderPlugin);
        return webpackConfig;
    });
    api.addRuntimePlugin(path_1.join(__dirname, "./runtime"));
    api.modifyEntryRender(function () {
        return "\n    window.g_plugins.apply('rootContainer', {\n      initialValue: {router: " + routerVue + ", Vue, store: g_app._store},\n    }).$mount('#" + mountElementId + "');";
    });
    api.modifyEntryHistory(function () {
        return routerVue + ".history";
    });
    api.modifyRouterRootComponent(function () {
        return config.history || "history";
    });
}
exports.default = default_1;
