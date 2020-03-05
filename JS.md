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

## 原型链

详见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

```js
function Cls(){}
Cls.prototype.a = 'hxwnb'
let instance = new Cls()
instance.b = 'hxwsb'
console.log(instance)
`
可以看到实例的_proto_指向类，类的_proto_指向Object.prototype
这就是一个 instance => Cls => Object => null 的原型链
{
    b: 'hxwsb',
    _proto_: {
        a: 'hxwnb',
        constructor: f Cls()
        _proto_: {...}
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