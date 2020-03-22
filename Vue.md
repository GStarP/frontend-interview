# Vue.js

## Vuex

### 为什么不使用全局变量

- Vuex 的状态是响应式的，若组件依赖的状态发生变化，组件也会更新
- 更好的可维护性
- 能够被 devtool 所监控

### mutation 和 action

- mutation
  - 是修改 state 的唯一途径
  - 同步执行
  - devtool 可以跟踪 commit，监控 state 变化
  - 只关心状态
  - 组件通过 commit mutation 提交 mutation
- action
  - 通过 commit mutation 来改变 state
  - 可以包含异步代码
  - 只编写业务逻辑，不关心 state 如何改变
  - 组件通过 dispatch(action) 分发 action

## nextTick

- 语法

```js
Vue.nextTick(function () {
    // 回调
})
// 2.1.0 起新增
Vue.nextTick().then(function () {
    // 回调
})
```

- 意义：在下次 DOM 更新循环结束之后执行回调
- Vue 的异步 DOM 更新
  - 第一个 tick（当前 tick）时修改数据，数据已被修改；Vue 开启一个异步队列，缓冲在此事件循环中发生的所有数据更改（把 watcher 入队）
  - 第二个 tick（就是所说的下次 DOM 更新循环），同步任务执行完毕，开始执行异步队列的任务，更新 DOM（会先尝试使用 Promise.then 和 MessageChannel，若不支持则改用 setTimeout(fn, 0)）
  - 第三个 tick，执行 nexTick 中定义的回调
- 在 created 和 mounted 阶段，需要操作渲染后的视图必须使用 nextTick（因为 mounted 不保证其子组件渲染完成）

## 生命周期

> [详解 Vue 生命周期](https://segmentfault.com/a/1190000011381906) （评论区有不同意见）

<img src="./imgs/lifecycle.png" style="zoom: 33%;" />

- beforeCreate：data 为 undefined
- created：data 已有，无 el
  - 判断是否有 el 选项，若没有编译会暂时停止，等到后面调用 vm.$mount(el) 时才会继续向下
  - 判断是否有 template 选项，若有则将其编译为 render，若没有则找 el 里的 HTML 将其编译成 render
  - 另外，如果定义了 render 选项，它的优先级最高
- beforeMount：无 $el，DOM 中数据仍是 {{message}}
- mounted：数据渲染进 DOM
- beforeUpdate：data 中数据更新，但页面上数据未更新
- updated：页面重新渲染完毕
- beforeDestroy：实例未销毁
- destroyed：实例已销毁

