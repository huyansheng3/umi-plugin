import Vuex from "vuex";

class App {
  constructor(config) {
    this._store = new Vuex.Store({ ...config });
    this.registerConfig = config.registerConfig;
  }

  model(model) {
    return this._store.registerModule(
      model.namespace,
      model,
      this.registerConfig
    );
  }

  unmodel(model) {
    return this._store.unregisterModule(model.namespace, this.registerConfig);
  }
}

export function create(config) {
  return new App(config);
}
