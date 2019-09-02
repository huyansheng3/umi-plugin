export function rootContainer({ router, Vue }) {
  return new Vue({
    router,
    render(h) {
      return h("router-view");
    }
  });
}
