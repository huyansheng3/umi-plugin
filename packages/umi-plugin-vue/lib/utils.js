"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const umi_utils_1 = require("umi-utils");
const JS_EXTNAMES = [".vue"];
function findJSFile(baseDir, fileNameWithoutExtname, fileExt = JS_EXTNAMES) {
    for (const extname of fileExt) {
        const fileName = `${fileNameWithoutExtname}${extname}`;
        const absFilePath = path_1.join(baseDir, fileName);
        if (fs_1.existsSync(absFilePath)) {
            return absFilePath;
        }
    }
}
exports.findJSFile = findJSFile;
function optsToArray(item) {
    if (!item)
        return [];
    if (Array.isArray(item)) {
        return item;
    }
    else {
        return [item];
    }
}
exports.optsToArray = optsToArray;
function isValidJS(file) {
    return JS_EXTNAMES.includes(path_1.extname(file));
}
exports.isValidJS = isValidJS;
function endWithSlash(path) {
    return path.slice(-1) !== "/" ? `${path}/` : path;
}
exports.endWithSlash = endWithSlash;
function stripFirstSlash(path) {
    if (path.charAt(0) === "/") {
        return path.slice(1);
    }
    else {
        return path;
    }
}
function chunkName(cwd, path) {
    return normalizeEntry(stripFirstSlash(umi_utils_1.winPath(path).replace(umi_utils_1.winPath(cwd), "")))
        .replace(/^src__/, "")
        .replace(/^pages__/, "p__")
        .replace(/^page__/, "p__");
}
exports.chunkName = chunkName;
function normalizeEntry(entry) {
    return entry
        .replace(/^.(\/|\\)/, "")
        .replace(/(\/|\\)/g, "__")
        .replace(/\.jsx?$/, "")
        .replace(/\.vue$/, "")
        .replace(/\.tsx?$/, "");
}
