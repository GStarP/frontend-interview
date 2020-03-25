# JS

## call & apply

- 作用：改变 this 的指向，让一个对象去调用自己没有的，另一个对象的方法
- 区别：只有 **传参** 方面不同
  - call (thisObj, arg1, arg2, ...)
  - apply (thisObj, [arg1, arg2, ...])
  - 如果没有提供任何参数，则 Global 将被用作 thisObj 且不传递任何参数

```js
var coder = {
    name: '程序员',
    coding: function(location, time) {
        console.log(`${this.name}在${location}里码代码[${time}]`)
    }
};
var driver = {
    name: '司机'
};
coder.coding.call(driver, '车', '14:00');
coder.coding.apply(driver, ['车','14:00']);
// 司机在车里码代码[14:00]
```

## 原型

```js
function Father() {
    this.auth = 'father'
}
/**
 * prototype 只有函数才有
 * 指向这个构造函数创建的实例的原型对象
 */
console.log(Father.prototype === Father)
/**
 * 指向原型的构造函数,这里即 Father()
 */
console.log(Father.prototype.constructor)
/**
 * 除 null 外都有 __proto__
 * 指向其原型的 prototype
 * Object.prototype.__proto__ 为 null
 */
console.log(Father.prototype.__proto__)  // 指向 Object.prototype
/**
 * 实例的 __proto__ 指向原型的 prototype
 */
let father = new Father()
console.log(father.__proto__ === Father.prototype)  // true
```

## 原型链

> [MDN 原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

```js
function Cls(){}
Cls.prototype.a = 'hxwnb'
let instance = new Cls()
instance.b = 'hxwsb'
console.log(instance)
`
可以看到实例的__proto__指向Cls.prototype，Cls.prototype.__proto__指向Object.prototype
这就是一个 instance => Cls => Object => null 的原型链
{
    b: 'hxwsb',
    __proto__: {
        a: 'hxwnb',
        constructor: f Cls()
        __proto__: {...}
    }
}
当你访问 instance.a 的时候，它会先在 instance 中寻找，找不到就到 Cls 中寻找...
`
```

- 性能
  - 试图访问不存在的属性时将会遍历整个原型链
  - 检查某个属性是否属于当前对象而不是它的原型链，使用从 Object.prototype 集成的 hasOwnProperty
    - hasOwnProperty() 和 Object.keys() 是唯二不会遍历原型链的方法

## 继承

### 原型链

```js
function Father() {
    this.name = 'father'
    this.friends = ['Tom']
}
Father.prototype.work = function() {
    console.log('father work')
}
function Son() {}
// Son 继承了 Father
Son.prototype = new Father()
let son = new Son()
son.work()
son.friends.push('Jack')
let son2 = new Son()
console.log(son.friends)
```

- 优点
  - 能通过 instanceOf 和 isPropertyOf 的检查
- 缺点
  - 不能给父类构造函数传参
  - Father 的数组类型被 son 所更改会影响到 son2（但 son 修改 name 不会影响到 son2）

### 构造函数

```js
function Father(name) {
    this.name = name
    this.friends = ['Tom']
}
function Son(name) {
    Father.call(this, name)
}
let son = new Son('Amy')
son.friends.push('Jim')
console.log(son.name)
let son2 = new Son('Peter')
console.log(son2.friends)
```

- 优点
  - 能够自行调用父类构造函数，可以传参
  - son 无论如何不会影响到 son2

### 组合

```js
// 在构造函数继承的基础上加上下面一句
Son.prototype = new Father()
```

- 组合 原型链 + 构造函数
- 两次调用，浪费内存

### 寄生

```js
function Father(name) {
    this.name = name
    this.friends = ['Tom']
}
function Son(father) {
    let s = Object(father)
    s.study = function() {
        console.log('studying...')
    }
    return s
}
let son = new Son(new Father('Jack'))
son.study()
son.friends.push('Tommy')
let son2 = new Son(new Father('Bob'))
console.log(son2.friends)
```

- son 不会影响到 son2

### 寄生组合继承

```js
function Father(name) {
    this.name = name
    this.friends = ['Tom']
}
Father.prototype.work = function() {
    console.log('father work')
}
function Son(name, age) {
    Father.call(this, name)
    this.age = age
}
// 关键！
function inherit(Sub, Sup) {
    let s = Object(Sup.prototype)
    s.constructor = Sub
    Sub.prototype = s
}
inherit(Son, Father)
let son = new Son('Tom', 18)
son.work()
son.friends.push('Kart')
let son2 = new Son('Rita', 20)
console.log(son2.friends)
```

- 最佳选择

## 任务队列

> [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly?_blank)
>
> [对于 JS 任务队列的理解](https://segmentfault.com/a/1190000016295324)

- 任务队列的分类
  - 宏任务
    - 整体代码
    - setTimeout
    - setInterval
    - setImmidiate
    - I/O
    - UI 渲染
  - 微任务
    - process.nextTick
    - Promise
    - Object.observer
  - 宏任务队列可以有多个，微任务队列只有一个
  - 优先级
    - 宏任务 > 微任务
    - setTimeout > setImmidiate
    - process.nextTick > Promise.then
- 执行机制
  - 按照顺序将同步任务依次放入执行栈中执行
  - 期间产生的异步任务被加入两种任务队列
  - 事件循环
    - 执行栈空后，从微任务队列出队一个任务到执行栈，直到微任务队列空
      - 如果中途又产生微任务，立即入队，并在此次循环中都执行完
    - UI 线程接管，做渲染
    - JS 线程接管，从宏任务队列出队一个任务到执行栈
    - 重复事件循环

## bind

- function.bind(obj, arg1, ...)
  - 将 obj 作为函数的 this
  - 将后续参数传入
  - 返回一个函数

```js
function func(age) {
    console.log(this.name)
    console.log(age)
}
const obj = {
    name: 'hxwnb'
}
func(1)
func.bind(obj, 3)()
```

- 实现 bind

```js
Function.prototype.bind = function(ctx) {
    let self = this
    // 去除第一个,将剩下的参数转化为数组
    let innerArgs = Array.prototype.slice.call(arguments, 1)
    return function() {
        // 向 bind 返回的函数中传递的参数
        let otherArgs = Array.prototype.slice.call(arguments)
        let args = innerArgs.concat(otherArgs)
        return self.apply(ctx, args)
    }
}
```

## 函数柯里化

```js
// TODO: 有点问题
let curry = function(fn, args) {
    let self = this
    let argNum = fn.length
    let innerArgs = args || []
    
    return function() {
        let _args = Array.prototype.slice.call(arguments)
        innerArgs = innerArgs.concat(_args)
        if (innerArgs.length >= argNum) {
            return fn.apply(this, innerArgs)
        } else {
            return curry.apply(self, fn, innerArgs)
        }
    }
}
function add(x, y) { return x+y }
let cuad = curry(add)
cuad(1)(2)()
```

## 箭头函数

- 只有返回值的时候可以省略 {}
- 是匿名函数，不能作为构造函数，不能 new
- 不绑定 arguments，而是用 (...args) => 解决
- 不使用执行时而是定义时的上下文环境作为 this
- 通过 call/apply 时只传入参数，对 this 没有影响
- 没有 prototype
- 不能当做 generator 函数，不能使用 yield

## 从浏览器多线程到 JS 单线程

> [从浏览器多线程到 JS 单线程](http://www.dailichun.com/2018/01/21/js_singlethread_eventloop.html)

- 进程：CPU 资源分配的最小单位
- 线程：CPU 调度的最小单位
- 单/多线程：都是指一个进程中

### 浏览器

  - **多进程**：每个 Tab 都是一个单独的进程
    - 浏览器也有优化机制，tab 和进程有时也并非一对一
    - 比如多个空白标签页会被合并成一个
  - 有哪些进程
    - 主进程
      - 负责浏览器界面显示，与用户交互（前进，后退等）
      - 负责各个页面的管理
      - 将 Renderer 进程得到的内存中的 Bitmap 绘制到用户界面上
      - 网络资源的下载管理
    - Renderer 进程（浏览器内核）
      - 默认每个 Tab 一个
      - 页面渲染，脚本执行，事件处理等
    - GPU 进程
      - 最多一个，用于 3D 绘制
    - 第三方插件进程
      - 每类插件对应一个，使用时才会创建
  - 浏览器多进程的优势
    - 避免单个 Tab 或插件崩溃影响整个浏览器
    - 充分利用多核优势
    - 方便使用沙盒模型隔离插件等进程，提高浏览器稳定性

#### 浏览器内核

- 是 **多线程** 的
- GUI 渲染线程
  - 负责渲染界面，生成 DOM 和 RenderObject 树，布局和绘制
  - 当界面需要重绘和回流时，该线程执行
  - 与 JS 引擎线程互斥！JS 引擎执行时 GUI 进程就被挂起！
- JS 引擎线程
  - 也成 JS 内核（如 V8 引擎）
  - 一直等待任务队列中的任务到来然后处理
  - 一个 Tab 无论何时都只有一个 JS 线程在运行 JS
- 事件触发线程
  - 归属于浏览器，用来控制事件循环
  - 创建异步任务时将任务添加到事件线程中
  - 当对应的事件符合触发条件时，该线程将事件添加到待处理队列的队尾，等待 JS 引擎的处理
- 定时触发器线程
  - setTimeout 和 setInterval
  - 计时完毕后将任务添加到事件队列中
  - W3C 标准规定低于 4ms 的时间间隔算作 4ms
- 异步 HTTP 请求线程
  - XMLHttpRequest 在连接后新开一个线程进行请求
  - 检测到状态变更时，如果有回调，就产生状态变更事件，将回调放入事件队列中

#### WebWorker
- 创建 Worker 时，JS 引擎向主进程申请开一个子线程（完全受主进程控制且不能操作 DOM）
- JS 线程与 Worker 线程间通过 postMessage API 通信
- 只属于某个 Tab，不与其他 Renderer 进程共享

#### ShareWorker
- 所有 Tab 共享
- 浏览器为其单独创建一个进程

#### 主控进程与内核通信

- 主控进程收到请求，首先通过网络下载页面所需资源，随后将该任务传给Renderer 进程
- Renderer 进程接收到消息，简单解释后交给渲染线程，期间可能会发生
  - 要求主控进程获取资源
  - 需要 GPU 进程协助渲染
  - JS 进程操作 DOM 引起重绘和回流
- 最后 Renderer 进程将结果传给主控进程，主控进程绘制

#### 浏览器内核渲染流程

- Renderer 进程从主进程得到资源后
- 解析 HTML 成 DOM 树
- 解析 CSS 成 Style 树，结合 DOM 形成 Render 树
- 布局，计算各元素尺寸和位置
- 绘制
- 渲染层合并

#### load 和 DOMContentLoaded

- 上个渲染流程走完后，触发 load 事件
- 而 DOMContentLoaded 仅当 DOM 加载完成时触发（不包括样式，图片等）

#### 普通图层和复合图层

> 详细请看 [浏览器渲染流程 & Composite](https://segmentfault.com/a/1190000014520786)

- 浏览器渲染的图层分为这两大类
- 普通的文档流是一个复合图层（默认复合层）
  - absolute 或 fixed 虽然脱离普通文档流，依然属于默认复合层
- 可以通过硬件加速的方法声明一个新的复合图层
  - 会单独分配资源
  - 脱离普通文档流，不会造成默认复合层的回流重绘
- GPU 中，各个复合图层是单独绘制的
  - 但也不要大量使用，否则资源消耗过度，页面也会很卡
- 如何声明复合图层（可以用 More Tools-Rendering-Layer borders 检验）
  - trslate3d，translateZ
  - transform/opacity 动画：只有动画执行中才创建，动画结束后元素回到原来状态
  - `<video><iframe><canvas><webgl>`
  - 有一个包含复合层的子节点
  - 有一个 z-index 较低（相当于在该元素的下层）且包含一个复合层的兄弟节点
- 如何利用复合层做性能优化（硬件加速）
  - 减少动画元素对其他元素的影响，将动画效果中的元素提升为复合层，减少 paint
    - 将 will-change 设置为 opacity/transform/top/left/bottom/right
  - 使用 transform 或 opacity 来实现动画，这样只需要做复合层的合并而不会影响普通文档流
  - 对于固定不变的区域，如固定 header，可以将其提升以防页面某个区域重绘时其也被重绘
- 可能遇到的问题
  - 由于 "如何声明复合图层" 的后两点造成大量不需要被提升的元素被提升为复合层，出现层爆炸现象
  - 解决办法：手动添加 z-index，人为干预复合层的创建

### JS 引擎

- 单线程
- 任务分为同步任务和异步任务
  - 同步任务都在主线程上执行，形成一个 **执行栈**
  - 事件触发线程管理一个 **任务队列**，只要异步任务有了运行结果就在任务队列中放置一个事件
  - 一旦执行栈空，就会读取任务队列，将异步任务添加到执行栈中执行

#### setInterval 的问题

- setInterval 精准地按照时间推入事件，而不考虑回调执行的时间
- 如果第二次推入事件时，第一次的回调还没执行完，就会出现两个回调连续执行的情况
- 将浏览器窗口最小化时，setInterval 会将回调持续放在队列中，等浏览器窗口打开时一瞬间全部执行
- 解决方案
  - 用 setTimeout 模拟
  - 用 requestAnimationFrame 代替