# JS

## 数据类型

- 原始数据类型
  - String
  - Number
    - Number.MAX_VALUE/MIN_VALUE，NaN
  - Boolean
  - Undefined
  - Null
  - BigInt
    - 在数字结尾加上 "n"
    - Number.MAX_SAFE_INTEGER
  - Symbol
    - ES6
    - 唯一值，哪怕描述相同吗，即 Symbol("desc")  !== Symbol("desc")
    - 可以用作对象属性，必须通过 object[symbol] 访问
    - 不会出现在 for...in/Object.keys()/Object.getOwnPropertyNames() 中，只能用 Object.getOwnPropertySymbols() 和 Reflect.ownKeys() 获取
- Object

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
  - 具体原理参见 [理解 JavaScript 作用域和作用域链](https://www.cnblogs.com/lhb25/archive/2011/09/06/javascript-scope-chain.html)
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

## 函数柯里化

- 把 N 个参数的函数变换成“接收 1 个参数，返回接收 N-1 个参数的函数，的函数”

- 目的

  - 参数复用

  ```json
  function regexCheck(reg, txt) {
      return reg.test(txt)
  }
  check(/\d+/g, '123')
  
  function curryingRegexCheck(reg) {
      return function(txt) {
          return reg.test(txt)
      }
  }
  
  var hasNumber = curryingRegexCheck(/\d+/g)
  ```

  - 延迟执行：Function.bind 就是通过柯里化实现的

  ```js
  Function.prototype.bind = function(context) {
      let self = this
      let preArgs = Array.prototype.slice.call(arguments, 1)
      return function() {
          let newArgs = Array.prototype.slice.call(arguments)
          let args = preArgs.concat(newArgs)
          return self.apply(context, args)
      }
  }
  ```

- 通用方法

```js
const curry = function(fn) {
    let self = this
    let argNum = fn.length
    let preArgs = Array.prototype.slice.call(arguments, 1)
    
    return function() {
        let newArgs = Array.prototype.slice.call(arguments)
        let _args = preArgs.concat(newArgs)
        // 参数数量不足, 继续接收
        if (_args.length < argNum) {
            return curry.apply(self, [fn, ..._args])
        }
        // 参数收集完毕, 执行函数
        return fn.apply(this, _args)
    }
}
function add(x, y) { return x+y }
const curryAdd = curry(add)
const add1 = curryAdd(1)
add1(4)
```

## bind

- Function.bind(obj, arg1, ...): Function
  - 将 obj 作为函数的 this
  - 将后续参数传入

```js
const wyx = {
    name: 'wyx',
    dance: function(times) {
        console.log(`${this.name} dance ${times} times`)
    }
}
const hxw = {
    name: 'hxw'
}
wyx.dance(1)
wyx.dance.bind(hxw, 3)()
```

## 箭头函数

- 只有返回值的时候可以省略 {}
- 是匿名函数，不能作为构造函数，不能 new
- 不绑定 arguments，而是用 (...args) => 解决
- 不使用执行时而是定义时的上下文环境作为 this
- 通过 call/apply 时只传入参数，对 this 没有影响
- 没有 prototype

## this

- 本质：**this 总是指向调用该函数的对象！**
- 在浏览器中，如果我们不指定，直接调用函数，调用函数的对象其实就是 window
  - 在严格模式下，this 不会指向 window 而是 undefined

```js
function f() {
    var name = "func"
    console.log(this.name)
}
f()                  // undefined: 等价于 window.f(), 而 window 对象里并没有定义 name
var name = "win"
f()                  // win: 打印 window.name
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

- new 关键字会将构造函数的 this 指向实例对象（详见 [new 的时候发生了什么](##new 的时候发生了什么)）
  - 但如果函数返回的是一个对象，则 this 指向这个返回的对象

```js
function F() {
    this.name = "func"
    return {}        // 删去这一行能打印出 func
}
var f = new F()
console.log(f.name)  // undefined: this 指向的是返回的 {}
```

## JS 引擎单线程

> [JavaScript 运行机制详解：再谈Event Loop](https://www.ruanyifeng.com/blog/2014/10/event-loop.html)

### 简单理解

- 为什么不是多线程
  - 为了简单
  - JS 最初的用途是浏览器脚本语言，不需要支撑复杂的多线程场景
- 同步异步
  - 单线程意味着任务顺序执行
  - I/O 很慢（比如 Ajax 请求数据），如果 CPU 要等待结果就会阻塞后面的任务，于是，任务被分成两种
  - 同步任务
    - 在主线程上执行，形成一个执行栈（类似调用栈）
  - 异步任务
    - 异步任务有了结果，或是事件触发，就会在“任务队列”中放置一个任务
    - 当执行栈空（主线程空闲）的时候，主线程就会去任务队列中读取任务执行
  - 定时任务
    - setTimeout 和 setInterval
    - 依然要等待主线程空闲，因此可能会有时间上的误差
    - HTML5 标准规定时间间隔不得低于 4ms

### 事件循环

以上就是对 Event Loop 的简单理解，下面让我们更具体一些

#### 浏览器

> [对于 JS 任务队列的理解](https://segmentfault.com/a/1190000016295324)

- 任务队列并不只是简单的一个队列，而是分为微任务队列和宏任务队列
- 宏任务（Task）
  - 基础代码
  - setTimeout / setInterval
- 微任务（Job）
  - Promise.then
  - MutationObserver
- 执行过程
  - 基础代码 进入宏任务队列
  - 出队一个宏任务，进入执行栈执行（执行产生的宏任务和微任务进入各自队列）
  - 这个宏任务执行完后，执行栈为空，出队所有微任务，进入执行栈执行
    - **微任务产生的微任务也将继续在这个循环中被出队执行**
  - 如果有，出队下一个宏任务，循环
- 有一个易于理解的可视化实例：[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/?utm_source=html5weekly?_blank)

#### Node.js

- V8 引擎解析 JS 代码，调用 Node API
- libuv 库负责执行 Node API，管理事件循环，将异步任务的结果返回给 V8
  - 较为复杂，具体参见 [详解JavaScript中的Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)
- Node.js 提供了两个全新的任务
  - process.nextTick()：会在新一轮循环开始前执行
  - setImmediate()：在同一个 I/O 的回调中，一定先于定时器执行

## 浏览器多进程

> [从浏览器多线程到 JS 单线程](http://www.dailichun.com/2018/01/21/js_singlethread_eventloop.html)

### 多进程

  - 多进程：每个 Tab 都是一个单独的进程
    - Tab 和进程有时也并非一对一（比如多个空白标签页会被合并成一个）
  - 进程分类
    - 主进程
      - 只有一个
      - 负责浏览器界面显示，与用户交互（前进，后退等）
      - 负责各个页面（其它进程）的管理
      - 将渲染进程得到的 Bitmap 绘制到用户界面上
      - 网络资源的下载管理
    - 渲染进程（浏览器内核进程）
      - 默认每个 Tab 一个
      - 页面渲染，脚本执行，事件处理等
    - GPU 进程
      - 最多一个，用于 3D 绘制
    - 第三方插件进程
  - 浏览器多进程的优势
    - 避免单个 Tab 或插件崩溃影响整个浏览器
    - 充分利用多核优势
    - 方便隔离插件等进程，提高浏览器稳定性

### 浏览器内核

#### 多线程

- GUI 渲染线程
  - 负责解析 HTML+CSS，生成 Render 树，布局绘制，渲染界面
  - 重绘，回流
  - 与 JS 引擎线程互斥！JS 引擎执行时就被挂起！
- JS 引擎线程
  - 负责解析运行 JS 代码
  - 一个 Tab 无论何时都只有一个 JS 线程在运行 JS
- 事件触发线程
  - 负责控制事件循环
  - JS 引擎执行异步代码时，会将其添加到此线程中
  - 每当异步任务有了结果，将任务添加到任务队列中（结合 [事件循环](####事件循环)）
- 定时触发线程
  - 负责 setTimeout 和 setInterval
  - 计时完毕，将任务添加到任务队列中
- 异步 HTTP 请求线程
  - XMLHttpRequest 在连接后新开一个线程进行请求
  - 检测到状态变更时，将回调添加到任务队列中

### 浏览器内核渲染流程

- 渲染进程从主进程得到资源后
- 解析 HTML 成 DOM 树，期间可能发生
  - 请求主进程下载网络资源
  - 执行 JS 代码阻塞 DOM 树形成（所以最好把 script 放在尾部）
- 解析 CSS 成 CSSOM 树，结合 DOM 形成 Render 树
  - 解析 CSS 不会阻塞 解析 HTML，但会阻塞 Render 树形成（所以最好把 style 放在头部）
- 计算布局和尺寸（Reflow）
- 绘制（Paint）
- GPU 进行各层合并（Composite）

#### onload 和 DOMContentLoaded

- 渲染流程完全结束后，触发 onload 事件
- 而 DOMContentLoaded 仅当 DOM 加载完成时触发（不包括样式，图片等）

### WebWorker

- 创建 Worker 时，JS 引擎向主进程申请开一个子线程（完全受主进程控制且不能操作 DOM）
- JS 线程与 Worker 线程间通过 postMessage API 通信
- 只属于某个 Tab，不与其他渲染进程共享

#### SharedWorker
- 所有 Tab 共享
- 浏览器为其单独创建一个进程

## 模块化

> [阮一峰](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)

### CommonJS

- 动态语法，可以写在条件判断里
- 模块引入
  - 基本数据类型：深拷贝
  - 复杂数据类型：浅拷贝
  - 使用 require 加载某个模块时，会运行整个模块的代码
  - 再次加载同一模块时，不会再执行一遍，而是取缓存里的值
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

### AMD

- 为了解决 CommonJS 同步加载的阻塞问题
- 优点：允许异步、提前加载模块
- 缺点：声明时必须指定该模块依赖的所有模块，开发成本较高，不好用
- 实现：RequireJS

### CMD

- 与 AMD 思想相似
- 优点：相比 AMD 更简单，与 CommonJS 保持了较好的兼容性
- 缺点：依赖 SPN 进行打包（相当于把指定依赖的工作交给了专门的程序去做），模块的加载逻辑偏重
- 实现：Sea.js

### ES6

- 加载 import 时，不会去运行模块，而是生成一个引用，等到使用时才去取值（无缓存）
- 只读引用：不论是基本还是复杂都不能更改
  - 但可以对对象的属性和方法进行修改
- 循环依赖
  - ES6 不关心是否发生循环引用
  - 开发者自己保证取到正确的值

## 循环

- for...in...
  - obj 是数组时，遍历下标（且是字符型）
  - obj 是对象时，遍历属性
    - 遍历对象的可枚举属性（包括从原型中继承的属性）
- for...of...
  - ES6
  - 遍历可迭代对象（如遍历数组元素）
  - 不能直接遍历对象的属性
    - for (let key of Object.keys(obj)) {...}
- forEach((ele, idx) => {...})
  - Array.prototype 的一个方法
  - 不能 break 或 return

## Async & Await

- ES 7
- async
  - 修饰 function，返回一个 Promise 对象
  - 若返回普通数据，则返回 Promise.resolve(data)
- await
  - 只能写在 async function 里
  - 可以理解为一个运算符，如果接普通数据，则等价于 await Promise.resolve(data)
  - 如果接 Promise，则会阻塞后续代码，直到 resolve/reject
  - 意义：当异步操作依赖上一个一步操作，就会形成 then 的调用链，写起来很不友好，用 await 就可以以同步的形式编写
  - 如果 Promise 被 reject 了怎么办：把 await 放在 try..catch 里

## 深拷贝

1、JSON 转换

```js
const newObj = JSON.parse(JSON.stringify(oldObj))
```

缺点：无法拷贝函数；无法拷贝原型链；无法拷贝 undefiend，RegExp 等类型

2、Object.assign

```js
const newObj = Object.assign({}, oldObj)
```

缺点：如果对象属性也是引用，只会浅拷贝

3、递归拷贝

其中涉及到很多问题：

- 判断对象类型：非 Object，Object，Array，RegExp……
- 循环引用：o1.a = o2 同时 o2.b = o1，如果不特殊处理，会在递归时反复调用 DeepClone(o1/o2) 导致爆栈

一种比较简单且全面的实现

```js
function isPrimitive(value){
  return (typeof value === 'string' || 
  typeof value === 'number' || 
  typeof value === 'symbol' ||
  typeof value === 'boolean')
}

function isObject(value){
  return Object.prototype.toString.call(value) === "[object Object]"
}

function cloneDeep(value){

  // 记录被拷贝的值, 避免循环引用
  let memo = {};

  function baseClone(value){
    let res;
      
    if(isPrimitive(value)){
      return value;
    }else if(Array.isArray(value)){
      res = [...value];
    }else if(isObject(value)){
      res = {...value};
    }

    // Reflet.ownKeys 返回所有非原型链上且包含 Symbol 的属性
    Reflect.ownKeys(res).forEach(key => {
      if(typeof res[key] === "object" && res[key] !== null){
        // 如果已经记录过这个引用, 直接取出来赋值, 不再递归
        if(memo[res[key]]){
          res[key] = memo[res[key]];
        }else{
          memo[res[key]] = res[key];
          res[key] = baseClone(res[key])
        }
      }
    })
    return res;  
  }

  return baseClone(value)
}
```

最佳实现可参考 [lodash._cloneDeep](https://github.com/lodash/lodash/blob/master/cloneDeep.js)

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
