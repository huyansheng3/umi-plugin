export default {
  namespace: 'index',
  state: {
    isAuth: false,
    name: 'hys',
    count: 1,
  },
  getters: {},
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {},
};
