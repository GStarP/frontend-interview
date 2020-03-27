
/**
 * Here are things you should know
 */

/**
 * String.trim()
 * 去除首位空格
 */
console.log(' abc hxw '.trim())  // abc_hxw

/**
 * typeof
 */
console.log(typeof 1)          // number
console.log(typeof '1')        // string
console.log(typeof true)       // boolean
console.log(typeof {})         // object
console.log(typeof [])         // object
console.log(typeof undefined)  // undefined
console.log(typeof null)       // object

/**
 * instanceof
 */
const arr = []
console.log(arr instanceof Array)   // true
console.log(arr instanceof Object)  // true
function HXW() {}
const p = new HXW()
console.log(p instanceof HXW)       // true

/**
 * Object.prototype.toString
 */
const arr = []
console.log(Object.prototype.toString.call(arr))  // [object Array]
function HXW() {}
const p = new HXW()
console.log(Object.prototype.toString.call(p))   // [object Object]

/**
 * sort
 */
const arr = [5, 3, 6, 4, 1]
console.log(arr.sort())
console.log(arr.sort((a, b) => b-a))
