"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/umijs/umi/blob/master/packages/umi-build-dev/src/routes/getRouteConfigFromDir.js
const fs_1 = require("fs");
const path_1 = require("path");
const umi_utils_1 = require("umi-utils");
const utils_1 = require("../../utils");
function getRouteConfigFromDir(paths) {
    const { cwd, absPagesPath, absSrcPath, dirPath = "" } = paths;
    const absPath = path_1.join(absPagesPath, dirPath);
    const files = fs_1.readdirSync(absPath);
    const absLayoutFile = utils_1.findJSFile(absPagesPath, "_layout");
    if (absLayoutFile) {
        throw new Error("root _layout.vue is not supported, use layouts/index.vue instead");
    }
    const children = files
        .filter(file => {
        if (file.charAt(0) === "." || file.charAt(0) === "_")
            return false;
        return true;
    })
        .sort(a => (a.charAt(0) === "$" ? 1 : -1))
        .reduce(handleFile.bind(null, paths, absPath), [])
        .map(a => {
        delete a.isParamsRoute;
        return a;
    });
    if (dirPath === "" && absSrcPath) {
        const globalLayoutFile = utils_1.findJSFile(absSrcPath, "layouts/index") ||
            utils_1.findJSFile(absSrcPath, "layout/index");
        if (globalLayoutFile) {
            const wrappedRoutes = [];
            addRoute(wrappedRoutes, {
                path: "/",
                component: `./${path_1.relative(cwd, globalLayoutFile)}`,
                children
            }, {
                componentFile: globalLayoutFile
            });
            return wrappedRoutes;
        }
    }
    return children;
}
exports.default = getRouteConfigFromDir;
function handleFile(paths, absPath, memo, file) {
    const { cwd, absPagesPath, dirPath = "" } = paths;
    const absFilePath = path_1.join(absPath, file);
    const stats = fs_1.statSync(absFilePath);
    const isParamsRoute = file.charAt(0) === "$";
    if (stats.isDirectory()) {
        const newDirPath = path_1.join(dirPath, file);
        // routes & _layout
        const children = getRouteConfigFromDir({
            ...paths,
            dirPath: newDirPath
        });
        const absLayoutFile = utils_1.findJSFile(path_1.join(absPagesPath, newDirPath), "_layout");
        if (absLayoutFile) {
            addRoute(memo, {
                path: normalizePath(newDirPath),
                component: `./${umi_utils_1.winPath(path_1.relative(cwd, absLayoutFile))}`,
                children
            }, {
                componentFile: absLayoutFile
            });
        }
        else {
            memo = memo.concat(children);
        }
    }
    else if (stats.isFile() && utils_1.isValidJS(file)) {
        const bName = path_1.basename(file, path_1.extname(file));
        const path = normalizePath(path_1.join(dirPath, bName));
        addRoute(memo, {
            path,
            component: `./${umi_utils_1.winPath(path_1.relative(cwd, absFilePath))}`
        }, {
            componentFile: absFilePath
        });
    }
    return memo;
}
function normalizePath(path) {
    let newPath = `/${umi_utils_1.winPath(path)
        .split("/")
        .map(path => path.replace(/^\$/, ":").replace(/\$$/, "?"))
        .join("/")}`;
    // /index/index -> /
    if (newPath === "/index/index") {
        newPath = "/";
    }
    // /xxxx/index -> /xxxx/
    newPath = newPath.replace(/\/index$/, "/");
    // remove the last slash
    // e.g. /abc/ -> /abc
    if (newPath !== "/" && newPath.slice(-1) === "/") {
        newPath = newPath.slice(0, -1);
    }
    return newPath;
}
function addRoute(memo, route, { componentFile }) {
    memo.push({
        ...route
    });
}
