# JS

## call & apply

- 作用：改变 this 的指向，让一个对象去调用自己没有的，另一个对象的方法
- 区别：只有 **传参** 格式不同
  - call (thisObj, arg1, arg2, ...)
  - apply (thisObj, [arg1, arg2, ...])
  - 如果没有提供任何参数，则 global 将被用作 thisObj

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
// 构造函数
function Father() {
    this.name = 'father'
}
/**
 * prototype (原型对象)
 * 只有函数才有, 只有一个属性 constructor, 正是这个函数
 * 可以理解为这个构造函数, 也就是这个类的原初对象
 */
console.log(Father.prototype)  // { constructor: Father }
/**
 * __proto__ (原型)
 * 实例的 __proto__ 指向其构造函数的 prototype
 */
let father = new Father()
console.log(father.__proto__ === Father.prototype)  // true
console.log([].__proto__ === Array.prototype)       // true
/**
 * 除 null 外的对象都有 __proto__
 * Object.prototype.__proto__ 为 null
 */
console.log(Father.prototype.__proto__)  // Object.prototype
console.log(Array.prototype.__proto__)   // Object.prototype
```

## new 的时候发生了什么

```js
var p = new Person()
// 等价于
var p = {}
p.__proto__ = Person.prototype
Person.call(p)
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
可以看到实例的 __proto__ 指向 Cls.prototype，Cls.prototype.__proto__ 指向 Object.prototype
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
  - 试图访问不存在的属性时将会遍历整个原型链（通过 \_\_proto\_\_）
  - 检查某个属性是否属于当前对象而不是它的原型链，使用从 Object.prototype 继承的方法 hasOwnProperty
    - hasOwnProperty() 和 Object.keys() 是 **唯二** 不会遍历原型链的方法

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
son.friends.push('Jack')   // 这里实际上是修改了 Father 的 friends
let son2 = new Son()
console.log(son2.friends)  // 所以 son2 的 friends 也被修改了
// 子类实例能被检查出继承父类
console.log(son instanceof Father)  // true
console.log(Father.prototype.isPrototypeOf(son))  // true
```

- 优点
  - 能通过 instanceOf 和 isPrototypeOf 的检查
- 缺点
  - 不能给父类构造函数传参
  - Father 的数组被 son 更改会影响到 son2

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
  - 能够调用父类构造函数，可以传参
  - son 无论如何不会影响到 son2
- 缺点
  - 不能通过 instanceOf 和 isPrototypeOf 的检查，只是把父类的属性和方法在子类挂载一遍
  - 由于和原型链无关，所有属性和方法都必须在构造函数中定义

### 构造函数 + 原型

```js
// 在构造函数继承的基础上加上下面一句
Son.prototype = new Father()
```

- 优点
  - 组合 原型链 + 构造函数，通过在子类构造函数中复制一份父类属性，避免回溯到父类上产生的重复问题
- 缺点
  - 调用了两次父类构造函数
  - 子类的原型对象是父类实例，而子类实例也有这些属性，所以这些属性是被屏蔽的，浪费空间

### 寄生

```js
function Father(name) {
    this.name = name
    this.friends = ['Tom']
}
function Son(father) {
    // 拷贝了一份, 因此 son 不会影响 son2
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

- 优点
  - son 不会影响到 son2
- 缺点
  - son instanceof Son 无法通过，因为 Son 构造函数本质上返回了一个 Father，即 son.\_\_proto\_\_ 是 Father.prototype

### 构造函数 + 寄生

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
// 拷贝父类的原初对象, 把他的 constructor 变成子类构造函数, 作为子类的原初对象
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

- 优点
  - 在设定原型链这一环节，解决了“构造函数+原型”模式的缺点
  - 子类的原型对象是父类的原型对象的拷贝，更加符合语言设计，不会产生无用的实例属性

## 作用域链

- 作用域
  - 分为 全局作用域 和 局部/函数作用域
  - 下级作用域可以调用上级作用域的变量，反之则不行
- 作用域链
  - 调用变量时，如果在当前的作用域没有查到，就沿着作用域链向上查找，直到全局作用域
  - 更深的解读参见 https://www.cnblogs.com/lhb25/archive/2011/09/06/javascript-scope-chain.html
- 作用域链的启发
  - 如果需要多次调用全局作用域的变量，最好先将其存储到局部作用域中，避免多次查找直到最后的全局作用域

## 变量提升

在 JS 引擎词法分析阶段发生，把所有变量的声明提到作用域顶端而不赋值

```js
console.log(a)
var a = 1
// 变量提升
var a
console.log(a)  // undefined
a = 1

foo()
var foo = function() { console.log(1) }
// 函数表达式提升
var foo
foo()  // 报错: foo is not a function
foo = function() { console.log(1) }

foo()
function foo() { console.log(1) }
// 函数声明提升
var foo
foo = function() { console.log(1) }
foo()  // 1
```

```js
// 典型例题
console.log(v1)
var v1 = 100
function foo() {
  console.log(v1)
  var v1 = 200
  console.log(v1)
}
foo()
console.log(v1)
// 变量提升后
var v
var foo
foo = function() {
    var v
    console.log(v)
    v = 200
    console.log(v)
}
console.log(v)
v = 100
foo()
console.log(v)
// undefined undefined 200 100
```

## 函数声明和函数表达式

```js
/* 函数声明 */
// 立即执行必须用 () 包裹
(function f1() {
    console.log('f1')
})()
```

```js
/* 函数表达式 */
// 立即执行直接加 () 即可
var f2 = function() {
  console.log('f2')
}()
// 函数命名只能在内部使用
var f3 = function func() {
  console.log(typeof func)
}
f3()    // function
func()  // 报错!
```

## var 和 let/const

在 [作用域链](##作用域链) 中我们提到，JS 的作用域只有全局和函数两种，不存在块级作用域，这一点在循环中表现得异常明显

```js
i = 5
console.log(i)
for (var i = 0; i < 3; i++) {
    console.log(i)
}
// 5 0 1 2
```

循环外部居然可以访问循环里定义的变量，太离谱了，这也经常导致一些问题（参见 [闭包](##闭包)-缺点-循环闭包）。于是，ES6 提供了 let/const

- let/const 用于声明块级作用域变量，只在 {} 内有效
- let/const 会造成暂时性死区：当前块作用域被封闭，在声明之前使用全报 ReferenceError（哪怕有全局同名变量也不会顺着作用域链查找）
- 在同一作用域内，不能使用 let/const 反复定义同名变量（let-let，var-let，let-var 都不可以）

## 闭包

> [MDN - 闭包](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

- 定义

  - 闭包由 函数定义 以及 定义它的词法环境 组成
  - 每当定义一个函数，就会生成一个闭包

- 词法环境

  - 词法环境包含了定义函数的作用域内的所有局部变量
  - 这个函数不销毁，它所依赖的词法环境就不销毁
  - 我们认为函数运行完后，定义在其内的局部变量就会被销毁；但闭包提供了一种将其保持的方法，那就是返回一个依赖函数内部变量的子函数，子函数和函数内部变量构成了一个闭包，函数本质上创建并返回的是这个闭包

  ```js
  function makeAdder(x) {
    // x 是 makeAdder 的内部变量, 一般来说在 makeAdder 运行完后就会销毁
    return function(y) {
      // 但返回的子函数依赖了 x, 与其构成了闭包
      return x + y;
    };
  }
  // add1 和 add5 都是闭包, 共享函数定义, 但有不同的词法环境 (x值不同)
  var add1 = makeAdder(1);
  var add5 = makeAdder(5);
  // 只要 add1 和 add5 不被销毁, 他们的词法环境就不会被销毁
  console.log(add1(2));  // 3
  console.log(add5(2));  // 7
  ```

- 作用

  - 定义私有变量/方法（且有命名空间的能力）

  ```js
  var makeCounter = function() {
    var privateCounter = 0
    return {
      value: function() {
        return privateCounter;
      }
    }
  }
  
  var c1 = makeCounter();
  c1.privateCounter  // undefined (起到了私有变量的功能)
  c1.value()         // 0 (只能通过提供的公共方法访问)
  ```

- 缺点

  - 循环闭包

  ```js
  function blinkAllEl() {
    for (var i = 0; i < els.length; i++) {
      // var 导致 el 被定义在函数作用域, 而非每次循环的块作用域
      var el = els[i];
      document.getElementById(el.id).onclick = function() {
        // 因此所有闭包共享同一个词法环境(函数作用域), 其中 el 的值为最后一个 el
        blink(el);
      }
    }
  }
  
  // 解决方案一: 再加一层闭包
   document.getElementById(el.id).onclick = blinkEl(el)
  function blinkEl(el) {
      // 每次循环的 el 在这里被保持
      return function() {
          blink(el)
      }
  }
  
  // 解决方案二: 使用 let 把 el 定义在每次循环的块作用域
  let el = els[i];
  ```

  - 内存泄漏：[有争议](https://www.zhihu.com/question/22806887)
    - IE 低版本使用不同的内存管理器管理 JS 对象和 DOM 对象，如果他们之间存在循环依赖，IE 就无法释放任何一个对象

  ```js
  function (element, a){
      // element 依赖这个匿名函数, 这个匿名函数被维持
  	element.onclick = function(){
          // 只使用了 a, 但词法环境导致 element 也被维持
          /* 这里有个问题: 上面的词法环境实现是"不管是否使用, 变量统统保存", 而先进的实现是否如此并不知道 */
  		console.log(a)
  	}
  }
  ```

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

## this

- 本质：**this 总是指向调用该函数的对象！**
- 在浏览器中，如果我们不指定，直接调用函数，调用函数的对象其实就是 window
  - 在严格模式下，this 不会指向 window 而是 undefined

```js
function f() {
    var name = "func"
    console.log(this.name)
}
f()                  // undefined: 因为 window 对象里并没有定义 name 属性
window.f()           // 等价于上一行
var name = "window"
f()                  // window: 打印出 window.name
```

- this 只会指向最近调用它的对象，而不会像原型链一样向上查找

```js
var a = {
    x: 10,
    b: {
        f() {
            console.log(this.x)
        }
    }
}
a.b.f()  // undefined: 因为 b.x 未定义, 并不会去找到 a.x
```

- new 关键字会将 this 指向创建的实例对象（原理见 [new 的时候发生了什么](##new 的时候发生了什么)）
  - 但如果函数返回的是一个对象，则 this 指向这个返回的对象

```js
function F() {
    this.name = "func"
    return {}        // 删去这一行能打印出 func
}
var f = new F()
console.log(f.name)  // undefined: this 指向的是返回的 {}
```

- apply，call，bind 会改变 this 指向
- 箭头函数也会改变 this 指向

```js
var o1 = {
    name: 'o1',
    f() {
        return function () {
            console.log(this.name)
        }
    }
}
var f1 = o1.f()
f1()  // undefined
var name = 'window'
f1()  //window

var o2 = {
    name: 'o2',
    f() {
        return () => {
            console.log(this.name)
        }
    }
}
var f2 = o2.f()
f2()  // o2
```

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
  - 也称 JS 内核（如 V8 引擎）
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
  - translate3d，translateZ
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

## setTimout & setInterval

- setTimeout
  - 声明 200ms 后函数 f 将要执行【0-0】
  - 后续主线程执行了 220ms【0-220】
  - 开始执行 f【220-?】
- setInterval
  - 声明前主线程执行了 5ms【0-5】
  - 声明每隔 200ms 执行一次函数 f【5-5】
  - 后续主线程执行了 295 ms【5-300】
    - 推入一个执行 f 的任务【205】
  - 开始执行 f【300-650】
    - 推入一个执行 f 的任务【405】
    - 已经有了一个执行 f 的任务，跳过【605】
  - 开始执行 405ms 时的 f【650-?】

## CommonJS 和 ES6 Module

> [阮一峰](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)

### CommonJS

- 动态语法，可以写在条件判断里
- 模块引入
  - 基本数据类型：深拷贝
  - 复杂数据类型：浅拷贝
  - 使用 require 加载某个模块时，会运行整个模块的代码
  - 使用 require 加载同一模块时，不会再执行一遍，而是取缓存里的值
- require 本质其实是生成了一个对象

```json
{
    id: '模块名'
    exports: {...},  // 输出的接口
    loaded: true     // 脚本是否执行完毕
}
```

- 循环依赖
  - 假设 a.js 和 b.js 互相依赖
  - a 跑完前三行时引入 b，这时转到 b 去执行
  - b 执行到依赖 a 的时候又去 a，此时只能拿到 a 前三行给出的东西
  - b 拿到 a 前三行的东西，执行完毕，又回到 a
  - a 拿到 b 全部给出的东西，执行至结束

### ES6

- 静态语法，只能写在顶层
- 模块引入
  - 只读引用：不论是基本还是复杂都不能更改
    - 但可以对对象的属性和方法进行修改
  - 动态：模块中的值如果发生变化，加载的值也会变化
- 循环依赖
  - ES6 不做缓存，是动态地去加载引用的数据
  - 只要开发者保证通过引用能取到值就能够使用，不关心是否发生循环依赖

## 精度问题

> [JS 魔法堂：彻底理解 0.1 + 0.2 === 0.30000000000000004 的背后](https://www.cnblogs.com/fsjohnhuang/p/5115672.html)

- 常见问题

  - 0.1 + 0.2 === 0.30000000000000004
  - 0.7 * 180 === 125.99999999998
  - 1000000000000000128 === 1000000000000000129

- Number

  - 采用 IEEE 754 64 位双精度浮点编码
  - 具体过程不做详述

- 解决方法

  - 保证运算的数字和结果都在 Number.MIN_SAFE_INTEGER 和 Number.MAX_SAFE_INTEGER
    - 分别是正负 9007199254740991
  - 这就牵扯到 浮点 $\rightarrow$ 整数，大数运算 的问题
  - 下面给出两种比较简单的解决方案，但是可以想象，当小数位数较多时，会产生大数问题

  ```js
  function accAdd(arg1, arg2) {
      var r1, r2, m, c;
      // r1,r2 是 arg1,arg2 的小数位数
      try {
          r1 = arg1.toString().split(".")[1].length;
      } catch (e) {
          r1 = 0;
      }
      try {
          r2 = arg2.toString().split(".")[1].length;
      } catch (e) {
          r2 = 0;
      }
      // 位数差值, 将他们补到相同位数
      c = Math.abs(r1 - r2);
      // 从小数到整数多乘的 10^x
      m = Math.pow(10, Math.max(r1, r2));
      if (c > 0) {
          var cm = Math.pow(10, c);
          if (r1 > r2) {
              arg1 = Number(arg1.toString().replace(".", ""));
              arg2 = Number(arg2.toString().replace(".", "")) * cm;
          } else {
              arg1 = Number(arg1.toString().replace(".", "")) * cm;
              arg2 = Number(arg2.toString().replace(".", ""));
          }
      } else {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", ""));
      }
      return (arg1 + arg2) / m;
  }
  ```

  ```js
  function accMul(arg1, arg2) {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try {
          m += s1.split(".")[1].length;
      } catch (e) {}
      try {
          m += s2.split(".")[1].length;
      } catch (e) {}
      return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  }
  ```

## ~~ 和 | 的妙用

~~ 可以用作转整数

```js
~~null       // 0
~~undefined  // 0
~~1.8        // 0
~~-1.8       //-1
~~'4'        // 4
```

| 可以用作取整

```js
1.2 | 0   // 1
-1.2 | 0  // 1
```

## 大数计算

- 当数值超过 Number.MIN_SAFE_INTEGER 时会转为科学计数法表示
- 可以使用库 [bignumber.js](https://github.com/MikeMcl/bignumber.js)
- 简单的加法可以这样实现

```js
function addBigNumber(a, b) {
  var res = '', tmp = 0;
  a = a.split('');
  b = b.split('');
  while (a.length || b.length || temp) {
    tmp += ~~a.pop() + ~~b.pop();
    res = (tmp % 10) + res;
    tmp = tmp > 9;
  }
  // 去除开头的 0
  return res.replace(/^0+/, '');
}
```

## 循环

- for(let key in obj) {...}
  - obj 是数组时，key 是下标
  - obj 是对象时，key 是属性名
  - 遍历对象的可枚举属性（包括从原型中继承的属性）
- for...of...
  - ES6
  - 遍历任何可迭代对象
  - 并不能直接遍历对象的属性
    - for (let key of Object.keys(obj)) {...}
- forEach((ele, idx) => {...})
  - 是 Array 的一个方法
  - ele-元素，idx-下标
  - 不能 continue 或 break