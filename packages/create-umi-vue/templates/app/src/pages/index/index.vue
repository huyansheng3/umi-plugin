<template>
  <div>
    Hello, {{ count }} {{ name }} for {{ lang }}! <br />
    <button @click="onClick">touch me</button>
  </div>
</template>
<script>
import { mapState, dispatch, commit } from '@didi/umi-vue';
export default {
  computed: {
    ...mapState({
      isAuth: state => state.index.isAuth,
      name: state => state.index.name,
      count: state => state.index.count,
      lang: state => state.global.lang,
    }),
  },
  updated() {
    console.log(1);
  },
  methods: {
    onClick() {
      commit({ type: 'index/increment' });
    },
  },
};
</script>
