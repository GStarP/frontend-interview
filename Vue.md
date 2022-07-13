# Vue 2

## $nextTick

> [nextTick | Vue3 OnePiece](https://vue3js.cn/global/nextTick.html)

- 语法

```js
Vue.$nextTick(function () {
    // 回调
})
// 2.1.0 起新增
Vue.$nextTick().then(function () {
    // 回调
})
```

- 意义：会将回调延迟到下次 DOM 更新循环之后执行
- 流程
  - 执行宏任务，宏任务包含更新数据和调用 nextTick
    - 全部数据更新完毕，不重复的 effect（执行视图更新的函数）被加入队列 A 中
    - nextTick 被调用，回调被加入队列 B 中

  - 宏任务执行完毕，开始执行微任务 flushJobs
    - 先对队列 A 排序，保证父组件视图更新优先于子组件（因为总是先渲染父组件，且父组件更新有可能卸载子组件）
    - 执行所有视图更新执行
    - 执行所有回调（所以回调总是能拿到更新后的 DOM）

- 实现
  - Promise.then
  - setImmediate
  - MessageChannel
  - setTimeout(, 0)


## 生命周期

> [详解 Vue 生命周期](https://segmentfault.com/a/1190000011381906) （评论区有不同意见）

<img src="./imgs/Vue-生命周期.png" style="zoom: 33%;" />

- 创建 Vue 实例
- 初始化事件和生命周期
- **beforeCreate**：组件 option 未创建，无 data/methods/computed......
- 初始化注入和响应数据
- **created**：有 data/methods/computed......
- 判断是否有 options.el，若没有编译会暂时停止，等到调用 vm.$mount(el) 时再继续
- vm.$mount(el)：判断是否有 options.template，若有则将其编译为 render，没有则将 el 内的 HTML 作为 template
  - 也可以直接定义 render，它的优先级最高

- 执行 render，得到 vnode
- **beforeMount**：**无 $el**，DOM 未更新
- patch vnode，修改 \$el，更新 DOM
- **mounted**：有 $el，DOM 已更新
- 每当 data 更新
- **beforeUpdate**：data 更新，DOM 未更新
- patch vnode
- **updated**：DOM 已更新
- vm.$destroy()
- **beforeDestroy**：实例未销毁
- 移除 watcher，event listener 和 子实例
- **destroyed**：实例已销毁

## Vue 和 React 的区别

> [Vue.js - 对比其它框架](https://cn.vuejs.org/v2/guide/comparison.html)

- 在 React 中，当某个组件的状态发生变化时，将会以该组件为根，重新渲染整个组件子树；如果要避免不必要的子组件重新渲染，需要自己实现 shouldComponentUpdate 来控制
  - 在 Vue 中，组件的依赖是在渲染过程中自动追踪的，所以系统能精确知晓哪些组件需要被重新渲染
- 在 React 中，一切都是 JS
  - HTML 用 JSX 表达
    - 在 Vue 中，主要使用 template，方便现有应用迁移，方便熟悉 HTML 的开发者学习
    - 偏视图表现的组件更适合用 template，偏逻辑的组件更适合用 JSX
  - CSS 用 Css-in-JS 表达，是一种面向组件的样式编写模式
    - 在 Vue 中，主要使用 style 标签，和传统的样式编写模式一致
    - scoped：组件会自动添加一个唯一属性（如 data-v-21e5b78），样式会被编译为 .class[data-v-21e5b78]

## Vue 和 AngularJS 的区别

- AngularJS 是 Vue 的灵感来源，两者很多语法相似，但 Vue 的语法和设计更加简单
- Vue 具有更强的灵活性和模块化能力
- AngularJS 使用双向绑定，而 Vue 在不同组件间使用单向数据流，使得数据流向更加清晰
- AngularJS 中，每件事都由指令来做，而组件只是一种特殊的指令
  - Vue 中，指令只封装 DOM 操作，而组件代表一个自给自足的单元
- AngularJS 的脏检查循环，需要用户使用深奥的技术来优化
  - Vue 使用基于依赖追踪的观察系统并且异步队列更新，所有的数据变化都是独立触发，除非它们之间有明确的依赖关系

## Vue 和 Angular2 的区别

- Angular2 和 TS 深度结合，而 Vue 允许灵活配置
- 运行时性能相差无几，都很快
- Angular2 面向大型复杂应用，不适合初学者

# Vuex

## 为什么不用全局变量

- Vuex 是响应式的
- 更好的可维护性
- 能够被 Devtool 监控

## 核心概念

- State
  - 单一状态树：一个 state 对象就包含了全部应用层级的状态
- Getter
  - store 的 computed 属性，会缓存
- Mutation
  - 状态更改的唯一途径
  - 必须同步
- Action
  - 并非直接更改状态，而是提交 mutation 来完成
  - 可以异步
- Module
  - 提供命名空间能力

## 技巧

双向绑定 Vuex 数据

```js
<input v-model="message">

computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```

