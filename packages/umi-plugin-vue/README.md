# umi-plugin-vue
[![NPM version](https://img.shields.io/npm/v/@didi/umi-plugin-vue.svg?style=flat-square)](https://npmjs.org/package/@didi/umi-plugin-vue)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT](https://img.shields.io/dub/l/vibe-d.svg?style=flat-square)](http://opensource.org/licenses/MIT)


`umi`服务接口插件。

## 配置

**.umirc.js**

`@didi/umi-plugin-vue` 插件默认配置

```js
export default {
  plugins: [
    [
      '@didi/umi-plugin-vue',
      {
        dva: {
          immer: true,
        },
        routes: {
          exclude: [/model/],
        },
        dll: {
          include: []
        },
        dynamicImport: {
          webpackChunkName: true
        }
      }
    ]
  ]
};
```


## 扩展API

当使用本插件后，`umi`项目中会新增一个API: `@didi/umi-vue`

```html
<template>
  <div>
    Hello, {{ isAuth }} {{ name }}! <br />
    <button @click="onClick">touch me</button>
  </div>
</template>
<script>
import { mapState, dispatch } from '@didi/umi-vue'
export default {
  computed: {
    ...mapState({
      isAuth: state => state.model.isAuth,
    }),
    ...mapState('model',[
      'name'
    ])
  },
  methods: {
    onClick() {
      dispatch({type:'model/logout'})
    },
  },
};
</script>
```

```javascript
export default {
  namespace: 'model',
  state: {
    isAuth: false,
    name: 'didi',
  },
  reducers: {
    changeAuth(state) {
      state.isAuth  = true;
    },
  },
  effects: {
    *logout(_, { call, put }) {
      yield put({
        type: 'changeAuth',
      });
    },
  },
};

```



