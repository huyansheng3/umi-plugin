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
// import { compatDirname } from 'umi-utils';
var path_1 = require("path");
var defaultOpts = {
    vuex: {},
    routes: {
        exclude: [/model/]
    },
    dynamicImport: {
        webpackChunkName: true
    },
    hardSource: true
};
function template(path) {
    return path_1.join(__dirname, "../template", path);
}
function getId(id) {
    return "umi-plugin-vue:" + id;
}
function default_1(api, options) {
    var option = __assign(__assign({}, defaultOpts), options);
    var service = api.service, config = api.config, paths = api.paths;
    service.paths = __assign(__assign({}, service.paths), { defaultEntryTplPath: template("entry.js.mustache"), defaultRouterTplPath: template("router.js.mustache"), defaultDocumentPath: template("document.ejs") });
    api.addVersionInfo([
        "vue@" + require("vue/package").version,
        "vue-router@" + require("vue-router/package").version,
        "vue-template-compiler@" + require("vue-template-compiler/package").version
    ]);
    api.modifyAFWebpackOpts(function (memo) {
        return __assign(__assign({}, memo), { alias: __assign(__assign({}, (memo.alias || {})), { "@didi/umi-vue/dynamic": "@didi/umi-vue/lib/dynamic.js", "vue": require.resolve('vue') }) });
    });
    var plugins = {
        hardSource: function () { return require("./plugins/hardSource").default; },
        routes: function () { return require("./plugins/routes").default; },
        vuex: function () { return require("./plugins/vuex").default; }
    };
    api.registerPlugin({
        id: getId("vue"),
        apply: require("./plugins/vue").default
    });
    Object.keys(plugins).forEach(function (key) {
        if (option[key]) {
            var opts = option[key];
            if (key === "dll") {
                opts.include = (opts.include || []).concat([
                    "vue",
                    "vue-router",
                ]);
            }
            else if (key === "vuex") {
                opts = __assign(__assign({}, opts), { shouldImportDynamic: option.dynamicImport });
            }
            api.registerPlugin({
                id: getId(key),
                apply: plugins[key](),
                opts: opts
            });
        }
    });
}
exports.default = default_1;
