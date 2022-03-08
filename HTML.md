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

## Cookie

- 属性
  - key=value（key 唯一）
  - expires：过期时间
    - 正数：在 X 秒内持久化，哪怕关闭浏览器或电脑也能够保持
    - 负数：不持久化，关闭浏览器就消失
    - 0：立即删除
  - domain：生成该 Cookie 的域名
    - Cookie 不可跨域名，哪怕是同个一级域名下的不同二级域名
  - path：允许使用该 Cookie 的路径
    - 设为 / 代表允许所有
  - secure：是否仅允许安全协议（如 HTTPS）传输
- 携带过程
  - 客户端首次访问服务端，服务端响应中有首部 Set-Cookie: uid=6fag5h
  - 客户端将 Cookie(uid=6fag5h) 存储
  - 客户端发送请求时，如果请求匹配 domain&path，就自动加上首部 Cookie: uid=6fag5h
- SameSite
  - 是 Set-Cookie 的属性之一，有三种值
  - Lax（默认）：允许导航到目标源的 GET 请求携带
    - 导航共三种：`<a href="">`，`<link rel="prerender" href="">`，`<form method="GET">`
    - 比如在 CSDN 通过打开 Github 链接，允许携带本地的 Github 登录状态 Cookie
  - Strict：只允许同源请求携带
  - None：允许所有跨域携带；但必须设置 Secure 属性使 Cookie 通过 HTTPS 发送

## 从输入 URL 到页面加载完成的过程中发生了什么？

> [大量回答](https://www.zhihu.com/question/34873227)

- 解析 URL
- 生成请求报文；通过 DNS 查询目标 IP 地址
  - DNS；CDN
- 发送请求，接收响应
  - HTTP；TCP
- 浏览器渲染页面
  - 浏览器多线程；渲染过程

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

## CORS

- 跨源资源共享：Cross-Origin Resource Sharing 

- 在了解跨源之前，我们要先了解 **同源策略**
  - 为什么：是一个重要的安全策略，限制文档或脚本与不同源的资源进行交互，这能帮助阻隔恶意逻辑，减少被攻击的可能
  - 是什么：协议、域名、端口 全部相同

- 修改源：更改 document.domain，一般只允许改为父域（如 lol.qq.com => qq.com）

- 跨源操作

  - 写操作：如重定向，表单提交；允许
  - 资源嵌入：如 `<script>` `<style>` `<img>`；允许
  - 读操作：如 Ajax 请求，fetch API；不允许

- JSONP

  - 原理

    - 因为 `<script>` 标签可以跨源，所以考虑把服务端的数据包装成 JS 以供客户端通过 `<script>` 获取

    ```html
    <!-- 客户端 -->
    <script>
        // 客户端参数
        const id = 1
        // 回调函数
    	function cb(data) { alert(JSON.parse(data)) }
    	var script = document.createElement('script')
        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', 'other.com?id=' + id + '&callback=cb')
    </script>
    ```

    ```js
    // 根据客户端参数获取数据
    const id = req.query.id
    const data = dao.findById(id)
    // 包装成 JS 代码返回
    const callback = req.query.callback
    const js = callback + '(' + JSON.stringify(data) + ')'
    res.send(js)
    // 返回后, 客户端会立即执行这段 JS, 即执行 cb(data)
    ```

  - 缺点

    - 仅支持 GET 接口，因为 `<script>` 发的是 GET 请求
    - 存在安全问题，只是达成跨源的一种妥协方案

- CORS

  - 客户端几乎不需要额外操作，只需要服务器配置
  - 两种请求
    - 简单请求
      - 方法为 GET/POST/HEAD
      - 首部不超出 Accept/Accpet-Language/Content-Language/Last-Event-ID/Content-Type (application/x-www-form-urlencoded, multipart/form-data, text/plain)
    - 非简单请求
    - 为了兼容一直以来都可以跨源的表单
  - 处理简单请求
    - 客户端在首部添加 Origin 表明请求的来源，由服务端判断是否许可
    - 若许可，响应中带上首部 Access-Control-Allow-Origin: 请求的源 和一些其它首部
      - Access-Control-Allow-Credentials：布尔值，表示是否允许发送 Cookie
        - 客户端也要设置 withCredentials 才能发送
        - Access-Control-Allow-Origin 不能为 *，必须是具体的源
        - 跨源代码依然无法读取 document.cookie（只准浏览器带）
      - Access-Control-Expose-Headers：字符串列表，表示允许客户端获取的首部
        - 否则只能获取 Cache-Control，Content-Language，Content-Type，Expires，Last-Modified，Pragma
    - 若拒绝，响应不带上上述首部，浏览器因此得知跨源失败，抛出错误
  - 处理非简单请求
    - 典型例子：PUT/DELETE；Content-Type=application/json
    - 在进行正式请求前，会发送预检请求（preflight）
      - 预检请求方法为 OPTIONS
      - 会带上 Origin 及其它两个首部
        - Access-Control-Request-Method：表明客户端将要请求的方法
        - Access-Control-Request-Headers：表明客户端将要带上的首部
      - 服务端检查源、方法、首部，依然通过 Access-Control-Allow-Origin 标识是否许可
        - Access-Control-Allow-Methods：表明服务端支持的所有请求方法，意在减少后续预检
        - Access-Control-Allow-Headers：表明服务端支持的所有首部
        - Access-Control-Allow-Credentials
        - Access-Control-Max-Age：本次预检的有效期，期间不用重新预检

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

