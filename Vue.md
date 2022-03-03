# Vue 2

## $nextTick

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

- 意义：在下次 DOM 更新循环结束之后执行回调
- Vue 的异步 DOM 更新
  - 第一个 tick（当前 tick）时修改数据，数据已被修改；Vue 开启一个异步队列，缓冲在此事件循环中发生的所有数据更改（把 watcher 入队）
  - 第二个 tick（就是所说的下次 DOM 更新循环），同步任务执行完毕，开始执行异步队列的任务，更新 DOM（会先尝试使用 Promise.then 和 MessageChannel，若不支持则改用 setTimeout(fn, 0)）
  - 第三个 tick，执行 nexTick 中定义的回调
- 在 created 和 mounted 阶段，需要操作渲染后的视图必须使用 nextTick（因为 mounted 不保证其子组件渲染完成）
- 实现
  - Vue 2.5 之前：采用 MutationObserver 实现
    - MutationObserver 能监听 DOM 节点的更改
      - var mo = new MutationObserver(function() { callback })
      - mo.observe(element)
    - Vue 的做法是通过监听一个自己创建的文本节点，然后让文本节点的数据在 '0' 和 '1' 之间变化，以此来触发 MutationObserver 执行回调，也就是我们在 nextTick 中定义的回调
    - 利用了 MutationObserver 是微任务，微任务总是在宏任务结束，渲染完成后被执行，所以可以获取到更新后的 DOM
  - Vue 2.5 及之后：由于 MutationObserver 在 IOS 未被支持，被迫降级
    - 降级顺序
      - setImmediate：微任务
      - MessageChannel 的回调：微任务
      - setTimeout(, 0)：宏任务，有 4ms 的延迟

## 生命周期

> [详解 Vue 生命周期](https://segmentfault.com/a/1190000011381906) （评论区有不同意见）

<img src="./imgs/Vue-生命周期.png" style="zoom: 33%;" />

- 创建 Vue 实例
- 初始化事件和生命周期
- **beforeCreate**：组件 option 未创建，无 data/methods/computed...
- 初始化注入和响应数据
- **created**：有 data/computed/watcher...，无 $el
- 判断是否有 options.el，若没有编译会暂时停止，等到调用 vm.$mount(el) 时再继续
- 判断是否有 options.template，若有则将其编译为 render()，若没有则将 el 内的 HTML 作为 template
  - 结合 data 和 template 生成带数据的 HTML
  - 也可以直接定义 render()，它的优先级最高
- **beforeMount**：无 $el，带数据的 HTML 还没有挂载到页面上
- 用带数据的 HTML 作为 $el，替换 options.el 指向的节点
- **mounted**：有 $el，渲染完成
- 每当 data 变化
- **beforeUpdate**：data 变化，但页面未更新
- VDOM re-render and patch
- **updated**：页面重新渲染完毕
- 调用 vm.$destroy()
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

