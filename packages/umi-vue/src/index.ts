import * as core from "./vuex-core";

declare var window: Window;
interface Window {
  g_history: string;
}

let store = null;

export default function umiVue(config) {
  const app = core.create(config);
  store = app._store;
  return app;
}

export const dispatch = (...rest) => store.dispatch.bind(store)(...rest);

export { mapState } from "vuex";
export { mapGetters } from "vuex";
export { mapActions } from "vuex";
export { mapMutations } from "vuex";
export { createNamespacedHelpers } from "vuex";
