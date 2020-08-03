
/**
 * @des 创建长度为 N 的数组, 数组中每个元素的值等于其下标, 等价于 python 中的 range(N)
 * @requires ES6
 */
function range(N) {
  return [...Array(N).keys()]
}
