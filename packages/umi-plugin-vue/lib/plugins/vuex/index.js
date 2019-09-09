"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const uniq = require("lodash.uniq");
const mustache_1 = require("mustache");
const globby_1 = require("globby");
const umi_utils_1 = require("umi-utils");
const utils_1 = require("../../utils");
const JS_EXTNAMES = [".js", ".ts"];
const tplfile = "dvaContainer.js";
function template(path) {
    return path_1.join(__dirname, "../../../template", `${path}.mustache`);
}
function exclude(models, excludes) {
    return models.filter(model => {
        for (const exclude of excludes) {
            if (typeof exclude === "function" && exclude(getModelName(model))) {
                return false;
            }
            if (exclude instanceof RegExp && exclude.test(getModelName(model))) {
                return false;
            }
        }
        return true;
    });
}
function isPagesPath(path, api) {
    const { paths } = api;
    return (utils_1.endWithSlash(umi_utils_1.winPath(path)) === utils_1.endWithSlash(umi_utils_1.winPath(paths.absPagesPath)));
}
function isSrcPath(path, api) {
    const { paths } = api;
    return (utils_1.endWithSlash(umi_utils_1.winPath(path)) === utils_1.endWithSlash(umi_utils_1.winPath(paths.absSrcPath)));
}
function getModelName(model) {
    const modelArr = umi_utils_1.winPath(model).split("/");
    return modelArr[modelArr.length - 1];
}
function getModel(cwd, api) {
    const modelJSPath = utils_1.findJSFile(cwd, "model", JS_EXTNAMES);
    return modelJSPath
        ? [umi_utils_1.winPath(modelJSPath)]
        : globby_1.sync(`./models/**/*.{ts,js}`, { cwd })
            .filter(p => p.indexOf(".test.") === -1 && p.indexOf(".d.") === -1)
            .map(p => umi_utils_1.winPath(path_1.join(cwd, p)));
}
function getPageModels(cwd, api) {
    let models = [];
    while (!isPagesPath(cwd, api) && !isSrcPath(cwd, api)) {
        models = models.concat(getModel(cwd, api));
        cwd = path_1.dirname(cwd);
    }
    return models;
}
function getModelsWithRoutes(routes, api) {
    const { paths } = api;
    return routes.reduce((memo, route) => {
        return [
            ...memo,
            ...(route.component && route.component.indexOf("() =>") !== 0
                ? getPageModels(path_1.join(paths.cwd, route.component), api)
                : []),
            ...(route.children ? getModelsWithRoutes(route.children, api) : [])
        ];
    }, []);
}
function getGlobalModels(api, shouldImportDynamic) {
    const { paths, routes } = api;
    let models = getModel(paths.absSrcPath, api);
    if (!shouldImportDynamic) {
        // 不做按需加载时，还需要额外载入 page 路由的 models 文件
        models = [...models, ...getModelsWithRoutes(routes, api)];
        // 去重
        models = uniq(models);
    }
    return models;
}
function addVersionInfo(api) {
    const { cwd, compatDirname } = api;
    api.addVersionInfo([
        `vuex@${require("vuex/package").version}`,
        `@didi/umi-vue@${require("@didi/umi-vue/package").version}`
    ]);
}
function addPageWatcher(api) {
    const { paths } = api;
    api.addPageWatcher([path_1.join(paths.absSrcPath, "models")]);
}
function default_1(api, opts = {
    immer: false,
    exclude: [],
    shouldImportDynamic: false
}) {
    const { config, paths } = api;
    addVersionInfo(api);
    addPageWatcher(api);
    api.addRuntimePluginKey("vuex");
    function getPluginContent() {
        const ret = [];
        return ret.join("\r\n");
    }
    function getGlobalModelContent() {
        return exclude(getGlobalModels(api, opts.shouldImportDynamic), utils_1.optsToArray(opts.exclude))
            .map(path => `
    app.model({ namespace: '${path_1.basename(path, path_1.extname(path))}', ...(require('${path}').default) });
  `.trim())
            .join("\r\n");
    }
    api.onGenerateFiles(() => {
        const wrapperTpl = fs_1.readFileSync(template(tplfile), "utf-8");
        const wrapperContent = mustache_1.render(wrapperTpl, {
            RegisterPlugins: getPluginContent(),
            RegisterModels: getGlobalModelContent()
        });
        const wrapperPath = path_1.join(paths.absTmpDirPath, tplfile);
        fs_1.writeFileSync(wrapperPath, wrapperContent, "utf-8");
    });
    api.modifyEntryRender(entry => {
        return `
  require('@tmp/${tplfile}')
    ${entry}`;
    });
    if (opts.shouldImportDynamic) {
        api.addRouterImport({
            source: "@didi/umi-vue/dynamic",
            specifier: "_dvaDynamic"
        });
        api.modifyAFWebpackOpts(opts => {
            return {
                ...opts,
                disableDynamicImport: false
            };
        });
        api.modifyRouteComponent((memo, args) => {
            const { importPath, component } = args;
            const models = getPageModels(path_1.join(paths.absTmpDirPath, importPath), api);
            let extendStr = `/* webpackChunkName: ^${utils_1.chunkName(paths.cwd, component)}^ */`;
            return `_dvaDynamic({
          models: () => [
            ${models
                .map(model => `import(/* webpackChunkName: '${utils_1.chunkName(paths.cwd, model)}' */'${path_1.relative(paths.absTmpDirPath, model)}')`)
                .join(",\r\n  ")}
          ],
          component: () => import(${extendStr}'${importPath}'),
        })`.trim();
        });
    }
}
exports.default = default_1;
