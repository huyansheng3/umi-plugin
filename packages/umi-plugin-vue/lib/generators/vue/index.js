"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const randomColor = require("random-color");
const assert = require("assert");
const chalk_1 = require("chalk");
exports.default = api => {
    const { paths, config, log } = api;
    const absTemplatePath = path_1.join(__dirname, './templates');
    return class Generator extends api.Generator {
        constructor(args, options) {
            super(args, options);
            assert(typeof this.args[0] === 'string', `
${chalk_1.default.underline.cyan('name')} should be supplied

Example:

  umi g vue users
        `.trim());
            if (config.routes) {
                log.warn(`You should config the routes in config.routes manunally since ${chalk_1.default.red('config.routes')} exists`);
                console.log();
            }
        }
        writing() {
            const path = this.args[0].toString();
            const context = {
                name: path_1.basename(path),
                color: randomColor().hexString(),
            };
            const name = context.name;
            try {
                this.fs.copyTpl(path_1.join(absTemplatePath, 'index.vue.tpl'), path_1.join(paths.absPagesPath, name, `${path}.vue`), context);
            }
            catch (e) {
                console.error(e);
            }
            if (this.options.model) {
                try {
                    this.fs.copyTpl(path_1.join(absTemplatePath, 'model.js.tpl'), path_1.join(paths.absPagesPath, name, `${path}.js`), context);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
    };
};
