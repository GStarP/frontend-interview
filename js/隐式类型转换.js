/**
 * 2020-1-23
 * 隐式类型转换是笔试题中对 JS 基本功考察的常用形式
 * 也是 JS 和其他语言差异巨大之处
 */

/**
 * 1.转 Boolean
 *  false: 0, -0, NaN; ''; undefined; null;
 *  true: 除上述外所有
 *  触发情况: 条件判断(if), 逻辑运算符(!)
 */
function toBoolean(param) {
  console.log(param);
  if (param) {
    console.log('is true');
  } else {
    console.log('is false')
  }
}
toBoolean('false');

/**
 * 2.转 Number
 *  Boolean
 *    true => 1
 *    false => 0
 *  String
 *    '1' => 1
 *    'a' => NaN
 *  Array
 *    [] => 0
 *    [2] => 2
 *    其它 => NaN
 *  Null => 0
 *  Undefined => NaN
 *  其它引用类型(如 {}) => NaN
 *  触发情况: 比较(==), 按位(&), 算数(+)
 *  特殊情况:
 *    1. == 应用于 null/undefined 时, 不发生转换, null/undefined 只等于 null/undefined
 *    2. == 应用于两个字符串时不发生转换
 *    3. + 有一者为字符串时, 其他元素发生向字符串的隐式转换
 *    4. NaN 不等于任何值, 即便是它本身!
 */
function toNumber(param) {
  console.log(param);
  console.log(Number(param));
}
toNumber(true);
console.log(null == undefined);
console.log(NaN == NaN);

// undefined 和 null 在 === 判断下不等
console.log(undefined === null);

/**
 * 以上已足够应对基本情况
 * 如要了解更详细的情况请参见 https://www.cnblogs.com/Leophen/p/11384511.html
 */
