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
var fs_1 = require("fs");
var assert = require("assert");
var chalk_1 = require("chalk");
var debug = require('debug')('umi-plugin-vue:vueGen');
function default_1(api) {
    var generators = api.service.generators, log = api.log;
    function generate(args) {
        if (args === void 0) { args = {}; }
        try {
            var name_1 = args._[0];
            assert(name_1, "run " + chalk_1.default.cyan.underline('umi help gv') + " to checkout the usage");
            assert(generators[name_1], "Generator " + chalk_1.default.cyan.underline(name_1) + " not found");
            var _a = generators[name_1], Generator = _a.Generator, resolved = _a.resolved;
            var generator = new Generator(args._.slice(1), __assign(__assign({}, args), { env: {
                    cwd: api.cwd,
                }, resolved: resolved || __dirname }));
            return generator
                .run()
                .then(function () {
                log.success('');
            })
                .catch(function (e) {
                log.error(e);
            });
        }
        catch (e) {
            log.error("Generate failed, " + e.message);
        }
    }
    function registerCommand(command, description) {
        var details = ("\nExamples:\n  " + chalk_1.default.gray('# generate vue page index') + "\n  umi gv page index\n\n  " + chalk_1.default.gray('# generate vue page index with model') + "\n  umi gv page index --model\n\n  ").trim();
        debug('api.registerCommand has called');
        api.registerCommand(command, {
            description: description,
            usage: "umi " + command + " type name [options]",
            details: details,
        }, generate);
    }
    registerCommand('gvue', 'generate vue page');
    registerCommand('gv', 'generate vue page (alias for gvue)');
    fs_1.readdirSync(__dirname + "/generators")
        .filter(function (f) { return !f.startsWith('.'); })
        .forEach(function (f) {
        debug("require(`./ generators / " + f + "`).default " + require("./generators/" + f).default);
        api.registerGenerator(f, {
            // eslint-disable-next-line import/no-dynamic-require
            Generator: require("./generators/" + f).default(api),
            resolved: __dirname + "/generators/" + f + "/index",
        });
    });
}
exports.default = default_1;
