# HTML

## Inline & Block

- inline（行内/内联元素）
  - 和其他元素在同一行上
  - 设置 height，width，padding/margin-top/bottom 无效
  - 宽度就是其内容的宽度，不可改变
  - 常见
    - a
      - 可包含除自身以外任何元素
    - button
    - label
    - span
    - del/em/i/strong/b
- block（块级元素）
  - 总是从新的一行开始
  - 宽度默认为其容器的 100%
  - 可以容纳行内元素和其它块级元素
  - 常见
    - div
    - p
      - 不能包含任何块级元素，包括自身
    - ul/ol
    - table/tbody/thead/tfoot/th/tr/td
    - hr
    - h1~6
- inline-block
  - 和其他元素在同一行上
  - 可以设置 height，width，padding/margin-top/bottom

## Reflow & Repaint

- 它们是影响页面渲染速度的主要因素

- Reflow（回流/重排）

  - 元素的变化影响了布局，造成部分乃至整个页面的重新渲染
    - 需要重新构建部分 Render Tree（所以页面首次加载也会首次回流）
  - 任何一个节点发生 Reflow 都会导致其子节点和祖先节点重新渲染
  - 原因
    - 浏览器窗口大小变化（因为需要根据浏览器窗口计算元素位置）
    - 元素尺寸变化（内外边距，边框，宽高）
    - 元素位置变化
    - display 属性变化（主要是 none）
    - 激活伪类（如 :hover）
    - 添加或删除 DOM 元素

- Repaint（重绘）

  - 元素的变化不影响布局，只引起这个元素的重新绘制
  - 原因：背景/文字/颜色等改变

- 关系

  - 回流 必定引起 重绘；但 重绘 不一定引起 回流
  - 回流 的速度明显比 重绘 更缓慢

- 浏览器优化机制

  - 浏览器为了减少回流次数，会将回流先放入队列，等到一定时间或一定操作再批量执行
  - 但是，获取布局信息（如访问 offsetTop 等[定位](##定位)属性）会强制队列执行，因为要获取最新的正确的值
  
- 启示

  - 回流是不可避免的，所以只能尽可能减小它的代价

    - 减少回流次数：手动进行批处理

      - 比如需要修改 padding，margin，width 三个样式

      ```js
      // 不应该这样修改, 会造成三次回流
      element.style.padding = '';
      element.style.margin = '';
      element.style.width = '';
      // 使用以下两种方法, 都只会造成一次回流
      element.style.cssText += 'padding: 0; margin: 0; width: 0;';
      
      element.className += 'hxwnb';
      ```
      
    - 使需要多次修改的元素（比如动画元素）脱离文档流

      - 设置 display: none
      - 设置 position: absolute/fixed

## SEO

- Search Engine Optimization
- 目标
  - 提升网页在搜索引擎自然搜索结果中的收录数量以及排序位置
-  控制首页链接数量
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