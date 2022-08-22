# Browser

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
  - 但是，获取布局信息（如访问 offsetTop 等[定位](##%E5%AE%9A%E4%BD%8D)属性）会强制队列执行，因为要获取最新的正确的值

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

## Cookie

- key=value（key 唯一）

- Set-Cookie 首部属性
  
  - Expires：过期时间（date）
  
  - Max-Age：过期时间（s）
    
    - 正数：在 X 秒内持久化，哪怕关闭浏览器或电脑也能够保持
    
    - 未指定：不持久化，关闭浏览器就消失
    
    - 负数或零：立即失效
  
  - Domain：生成该 Cookie 的域名
    
    - Cookie 不可跨域名，哪怕是同个一级域名下的不同二级域名
  
  - Path：允许使用该 Cookie 的路径
    
    - 设为 / 代表允许所有
  
  - Secure：是否仅允许安全协议（如 HTTPS）传输
  
  - HttpOnly：禁止通过 document.cookie 读取
  
  - SameSite
    
    - Lax（默认）：允许导航到目标源的 GET 请求携带
      - 导航共三种：`<a href="">`，`<link rel="prerender" href="">`，`<form method="GET">`
      - 比如在 CSDN 通过打开 Github 链接，允许携带本地的 Github 登录状态 Cookie
    - Strict：只允许同源请求携带
    - None：允许所有跨域携带；但必须设置 Secure 属性使 Cookie 通过 HTTPS 发送

- 携带过程
  
  - 客户端首次访问服务端，服务端响应中有首部 Set-Cookie: uid=6fag5h
  - 客户端将 Cookie(uid=6fag5h) 存储
  - 客户端发送请求时，如果请求匹配 domain&path，就自动加上首部 Cookie: uid=6fag5h

## 浏览器渲染原理

> [渲染页面：浏览器的工作原理 - Web 性能 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work)

- 从输入 URL 到页面加载完成的过程中发生了什么？
  
  - 导航：输入 URL，点击链接，提交表单……
    
    - DNS 查询服务器 IP
    - TCP 三次握手建立连接
    - TLS 协商建立安全连接
  
  - 响应：发送 HTTP 请求
    
    - TCP 慢启动：第一个响应数据包 14KB，之后逐渐加倍直到达到预定值或发生拥塞
      - 能够逐步建立合适的网络传输速度
  
  - 解析
    
    - HTML => DOM，请求所包含的资源
    - CSS => CSSOM；执行 JS
  
  - 渲染
    
    - DOM + CSSOM => Render Tree
      
      - display: none 的节点不会出现在 Render Tree 中
    
    - 布局：计算尺寸和位置（Reflow）
    
    - 绘制：绘制实际像素（Repaint）
      
      - 部分元素会被提升到 GPU 上的层单开线程绘制，而非全部在 CPU 中的主线程中绘制
    
    - 合成：多层可能相互重叠，所以需要合成
  
  - 交互
    
    - onload 事件之后，如果浏览器还在下载解析执行 JS，则页面虽然可视，但无法交互

- 浏览器渲染帧
  
  - **不是只有 Reflow 和 Repaint 才会触发渲染！浏览器会根据刷新频率自动渲染（60FPS => 16.6ms）！**
  
  - 内核进程中存在一个 Compositor 线程，当它接收到每一帧的数据时，先判断是否需要交给渲染线程
    
    - 比如：`<input>`光标闪烁；没有绑定事件的 `<input>` 输入回显……都可以直接交给 GPU 渲染，无需触发渲染线程
  
  - 但如果需要处理事件、改变了 DOM 布局等，就必须交给渲染线程走一个完整流程：
    
    - 处理交互回调
    - requestAnimationFrame，这是你在这一帧被用户看见之前最后的更改机会
    - 走解析-布局-绘制-合成的一套流程
    - 交还给 Compositor 线程进行栅格化（把渲染结果转化为 GPU 需要的形式），提交给 GPU 进行实际渲染
    - 一个渲染帧结束
    - 在渲染帧完成并提交后，如果 16.6ms 还没花完，且宏任务和微任务队列空，就可以执行 requestIdleCallback 注册的小任务

## CORS

- 跨源资源共享：Cross-Origin Resource Sharing

- 在了解跨源之前，我们要先了解 **同源策略**
  
  - 为什么：是一个重要的安全策略，限制文档或脚本与不同源的资源进行交互，这能帮助阻隔恶意逻辑，减少被攻击的可能
  - 是什么：协议、域名、端口 全部相同

- 修改源：更改 document.domain，一般只允许改为父域（如 lol.qq.com => qq.com）

- 跨源操作
  
  - **核心思想：防止在 A 域拿到 B 域的数据**
  - 写操作：如重定向，表单提交 => 允许
    - 因为这些操作会使页面跳转到 B，A 的脚本没法拿到 B 的数据
  - 资源嵌入：如 `<script>` `<style>` `<img>` => 允许
    - 因为这些资源时 B 公开允许访问的
  - **此外，以上这些很大原因是历史兼容性所迫，新定义的资源 `<font>` 就不允许跨域**
  - 读操作：如 XHR，fetch => 不允许
    - 因为这些操作能在 A 请求 B 的数据并在 A 继续执行

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
    - 典型例子：PUT/DELETE；Content-Type=application/json……
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

- 客户端需要做什么？
  
  - 一般来说，客户端什么都不用做，只要服务端配置 Access-Control-Allow-Origin 等响应头就行
  
  - 但有一种特殊情况，当请求想要携带 cookie 时，由于是不同源，浏览器默认不会携带，这个时候就需要：
    
    - 浏览器配置 XMLHttpRequest 的 withCredentials 为 true（axios 同）
    
    - 服务端配置 Access-Control-Allow-Credentials: true
  
  - 就算如此，cookie 仍然可能受 domain/path 的限制，还是用 Token 好（x

## Storage

通用接口：getItem；setItem；removeItem；clear

只能存 DOMString 类型的值

分类：

- sessionStorage
  
  - 每个 Tab 一个（哪怕是相同的 URL）
  
  - 页面会话结束时清除（但重新加载或恢复页面会保持）
  
  - 如果从 Page1 打开 Page2，则 Page2 会复制 Page1 的 sessionStorage

- localStorage
  
  - 同 sessionStorage，但永久保持！
  - 容量一般在 5MB 左右

### 反向代理

我们经常用反向代理来解决开发中的跨域问题。

```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'server.com'
      }
}}}
```

问题：本地服务 localhost 由于同源策略限制不能直接请求 server.com

解决：

1. 代理服务器与本地服务同源，因此前端能够直接请求代理服务器

2. 代理服务器与 server.com 通讯不经过浏览器，没有同源策略限制

Nginx 反向代理也是同理！
