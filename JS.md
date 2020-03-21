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

> 参照
>
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

> 参照
>
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
  - 按照顺序将整体代码依次放入执行栈中执行
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

