// import { compatDirname } from 'umi-utils';
import { join, dirname } from "path";

const defaultOpts = {
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
  return join(__dirname, "../template", path);
}

function getId(id) {
  return `umi-plugin-vue:${id}`;
}

export default function(api, options) {
  const option = {
    ...defaultOpts,
    ...options
  };

  const { service, config, paths } = api;

  service.paths = {
    ...service.paths,
    defaultEntryTplPath: template("entry.js.mustache"),
    defaultRouterTplPath: template("router.js.mustache"),
    defaultDocumentPath: template("document.ejs")
  };

  api.addVersionInfo([
    `vue@${require("vue/package").version}`,
    `vue-router@${require("vue-router/package").version}`,
    `vue-template-compiler@${require("vue-template-compiler/package").version}`
  ]);

  api.modifyAFWebpackOpts(memo => {
    return {
      ...memo,
      alias: {
        ...(memo.alias || {}),
        "@didi/umi-vue/dynamic": "@didi/umi-vue/lib/dynamic.js",
        vue: require.resolve("vue")
      }
    };
  });

  const plugins = {
    hardSource: () => require("./plugins/hardSource").default,
    routes: () => require("./plugins/routes").default,
    vuex: () => require("./plugins/vuex").default
  };

  api.registerPlugin({
    id: getId("vue"),
    apply: require("./plugins/vue").default
  });

  Object.keys(plugins).forEach(key => {
    if (option[key]) {
      let opts = option[key];

      if (key === "dll") {
        opts.include = (opts.include || []).concat(["vue", "vue-router"]);
      } else if (key === "vuex") {
        opts = {
          ...opts,
          shouldImportDynamic: option.dynamicImport
        };
      }

      api.registerPlugin({
        id: getId(key),
        apply: plugins[key](),
        opts
      });
    }
  });
}
