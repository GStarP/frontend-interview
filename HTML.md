# HTML

## Inline & Block

- inline（行内/内联元素）
  - 和其他元素在同一行上
  - **设置 height，width，padding/margin-top/bottom 无效**
    - 这里牵扯到另一个概念，叫做 **替换元素**，我们认为其指不使用 CSS 控制，其宽高也会随着显示内容而改变的元素
      - `<img>`：宽高随着显示图片的大小而改变
      - `<input>`：随着不同的 type 显示单选框或者输入框而改变
      - 还有 textarea，iframe，canvas……
    - 这些行内元素可以设置宽高，因为本质上是在为其中的内容设置宽高
    - 而它们之外的 **非替换元素**，例如 span，label 等，就无法设置宽高了
  - 一般情况下，只能容行内元素和数据
  - 常见
    - a
    - label
    - span
    - img
    - input
    - del/em/i/strong/b
- block（块级元素）
  - 总是从新的一行开始
  - 宽度默认为其容器的 100%
  - 可以容纳行内元素和其它块级元素
  - 常见
    - div
    - p
    - ul/ol
    - table/tbody/thead/tfoot/th/tr/td
    - hr
    - h1~6
- inline-block
  - 和其他元素在同一行上
  - 可以设置 height，width，padding/margin-top/bottom
  - 常见
    - button

# 

## SEO

- Search Engine Optimization
- 目标
  - 提升网页在搜索引擎自然搜索结果中的收录数量以及排序位置
- 控制首页链接数量
  - 网站首页是权重最高的地方，如果首页链接太少，会影响网站收录数量
  - 但也不能太多，无实质性的链接会影响权重
- 扁平化的目录层次
  - 尽量让爬虫在 3 次之内就能达到网站任何一个内部页
- 导航优化
  - 多使用 面包屑导航，增加内部链接，降低跳出率
- 分页
  - 下拉框选择页面跳转，而不是只有“下一页”，这样容易使爬虫放弃
- 控制页面大小
  - 加载超时，爬虫也会放弃
- 代码优化
  - `<title>`：把重要的词放到前面，多个页面的 title 不要有过多重复内容
  - `<meta keywords>` `<meta description>`：大致同上
  - `<nav><h1><main>`：语义化
  - `<a>`：内部链接加 title 属性说明；外部链接加 el="nofollow"，告诉爬虫不要去
  - `<strong>` 代替 `<b>`，`<em>` 代替 `<i>`
  - 重要内容放到最上面，不要使用 JS 动态输出

## 定位

[点击查看](./css/locate.html)

- 事件定位（Event.）
  - screenX/Y：相对于电脑屏幕左上角
  - pageX/Y：相对于页面内容左上角
  - clientX/Y：相对于浏览器左上角
  - offsetX/Y：相对于事件发生元素左上角
- 元素定位（Element.）
  - offsetTop/Left：相对于 **第一个 position 非 static 的父元素** 内容左上角
  - scrollTop/Left：有 overflow=scroll 的元素向下/右滚动的距离
  - clientTop/Left：顶部边框宽度（好像没什么用）
  - offsetWidth/Height：自身宽高，不包括 margin；对 inline 元素，offsetHeight 为 0
  - scrollWidth/Height：自身宽高，对 overflow=scroll 的元素，包含被滚动条隐藏的全部部分
  - clientWidth/Height：自身宽高，不包括 margin，border，滚动条；对 inline 元素，clientHeight 为 0

## 普通图层和复合图层

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

## DocumentFragment

- 文档碎片，可以类比 Vue 的 `<template>`
- 主要用途：将多次 DOM 操作先在文档碎片上做完，再把文档碎片挂载到真实 DOM，减少 reflow

```js
var listElement = document.querySelector('#list')

var fragment = new DocumentFragment()
arr.forEach((e) => {
  var li = document.createElement('li')
  fragment.appendChild(li)
})
listElement.appendChild(fragment)
```

## \<iframe\>

- 作用：在页面中嵌套显示一个“页面上下文”
  
  - 可以简单理解为一个 Tab
  - 拥有自己的 window 和 document

- 如何操作
  
  ```html
  <iframe id='if' name='qq' src='email.qq.com'>
  ```
  
  - ifEl.contentWindow：iframe 的 window（BOM）对象
  - ifEl.contentWindow.document：iframe 的 document（DOM）对象
    - 如果页面与 iframe 跨域，则无法操作其 DOM
    - 如果同属一个高级域名，可以分别执行 document.domain="qq.com" 设置同域
  - iframe 也可以获取父级 window 对象，同源可操作
    - window.top：顶级
    - window.parent：上一级

## 如何判断页面已滚动至底部

```js
window.onscroll = function (e) {
  let { scrollHeight, scrollTop, clientHeight } 
    = document.documentElement;
  if(clientHeight + scrollTop >= scrollHeight) {
    // do something
  }
}
```

## addEventListener

关键在于可以有第三个参数 options，包含以下选项：

- capture：默认 false，表示在冒泡阶段触发；设为 true 则在捕获阶段触发

- once：设为 true 表示只触发一次

- passive：设为 true 表示告诉浏览器，我的回调函数里不会 preventDefault
  
  - 主要用于提升滚动性能：在移动端页面中 touchstart 事件会触发滚动，并且这个事件的 cancelable 属性为 true，即能够被 preventDefault；此时，如果不设置 passive=true，浏览器不知道你是否在回调中阻止了滚动，必须等到运行完你的回调才会让页面滚动，这将导致一定的卡顿
  
  - Tips：触发 PC 页面滚动的 scroll 事件 cancelable 为 false，滚动不能被阻止
