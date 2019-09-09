"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var random_color_1 = require("random-color");
var assert = require("assert");
var chalk_1 = require("chalk");
exports.default = (function (api) {
    var paths = api.paths, config = api.config, log = api.log;
    return /** @class */ (function (_super) {
        __extends(Generator, _super);
        function Generator(args, options) {
            var _this = _super.call(this, args, options) || this;
            assert(typeof _this.args[0] === 'string', ("\n" + chalk_1.default.underline.cyan('name') + " should be supplied\n\nExample:\n\n  umi gv page users\n        ").trim());
            if (config.routes) {
                log.warn("You should config the routes in config.routes manunally since " + chalk_1.default.red('config.routes') + " exists");
                console.log();
            }
            return _this;
        }
        Generator.prototype.writing = function () {
            var path = this.args[0].toString();
            var context = {
                name: path_1.basename(path),
                color: random_color_1.default().hexString(),
            };
            this.fs.copyTpl(this.templatePath('index.vue.tpl'), path_1.join(paths.absPagesPath, path + ".vue"), context);
            if (this.options.model) {
                this.fs.copyTpl(this.templatePath('model.js.tpl'), path_1.join(paths.absPagesPath, path + ".js"), context);
            }
        };
        return Generator;
    }(api.Generator));
});
