/**
 * Here are things you should know
 */

/**
 * String.trim()
 * 去除首位空格
 */
console.log(' abc hxw '.trim()); // abc_hxw

/**
 * typeof
 */
console.log(typeof 1); // number
console.log(typeof '1'); // string
console.log(typeof true); // boolean
function func() {}
console.log(typeof func); // function
console.log(typeof {}); // object
console.log(typeof []); // object
console.log(typeof null); // object
console.log(typeof /^d+$/); // object
console.log(typeof undefined); // undefined
console.log(typeof Symbol('s')); // symbol
console.log(typeof 1n); // bigint

/**
 * Object.prototype.toString
 * 用于获取 [[Class]], 主要用来判断 typeof = object 的具体类型
 */
 const arr = [];
 console.log(Object.prototype.toString.call(arr)); // [object Array]
 function HXW() {}
 const p = new HXW();
 console.log(Object.prototype.toString.call(p)); // [object Object]
 const r = /^d+$/;
 console.log(Object.prototype.toString.call(r)); // [object RegExp]
 console.log(Object.prototype.toString.call(null)); // [object Null]

/**
 * instanceof
 * a instanceof B 测试 B.prototype 是否在 Object.getPrototype(a) 原型链上
 * Object.getPrototype(Object.getPrototype(a)) 终会回溯到 Object.prototype
 */
const arr = [];
console.log(arr instanceof Array); // true
console.log(arr instanceof Object); // true
function HXW() {}
const p = new HXW();
console.log(p instanceof HXW); // true
console.log(p instanceof Object); // true
const n = Number('1')
console.log(n instanceof Number); // false 因为基本类型不存在原型链一说

/**
 * sort
 */
const arr = [5, 3, 6, 4, 1];
console.log(arr.sort());
console.log(arr.sort((a, b) => b - a));

/**
 * for loop
 */
// for in
const arr = [5, 4, 3];
for (let i in arr) {
  console.log(arr[i]);
}
// for in 会遍历原型链上的属性
function Sup() {
  this.name = 'hxw';
}
function Sub() {
  this.gf = 'zzn';
  this.age = 18;
}
Sub.prototype = new Sup();
const sub = new Sub();
for (let key in sub) {
  console.log(`${key}: ${sub[key]}`);
}
// forEach
const arr = [1, 2, 3];
arr.forEach((e, i) => {
  if (i === 2) {
    // break is illegal
    break
  }
  console.log(`${i}: ${e}`);
});
// for of
let m = new Map();
m.set('gf1', 'zzn');
m.set('gf2', 'lxc');
for (let [k, v] of m) {
  console.log(`${k}: ${v}`);
}
