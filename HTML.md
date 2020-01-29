# HTML

## 1. Inline & Block

- Inline（行内/内联元素）
  - 和其他元素在同一行上
  - 设置 height，width，padding/margin-top/bottom 无效
  - 宽度就是其内容的宽度，不可改变
  - 只能容纳文本或其它行内元素
  - 常见
    - a：特殊！可包含块级元素，如 p
    - button
    - img
    - input
    - label
    - span
    - textarea
    - video
    - del/em/i/strong/b
- Block（块级元素）
  - 总是从新的一行开始
  - 宽度默认为其容器的 100%
  - 可以容纳行内元素和其它块级元素
  - 常见
    - audio
    - canvas
    - div
    - p
    - ul/ol
    - table/tbody/thead/tfoot/th/tr/td
    - hr
    - h1~6

## 2. Reflow & Repaint

- 它们是影响页面渲染速度的主要因素

- Reflow（回流）

  - 元素的变化影响了布局，造成部分乃至整个页面的重新渲染
  - 任何一个节点发生 Reflow 都会导致其子节点和祖先节点重新渲染
  - 原因
    - 浏览器窗口大小变化
    - 元素尺寸变化（边距，边框，宽高，display）
    - 添加/删除样式表
    - 内容改变（在输入框中输入）
    - 激活伪类（如 :hover）
    - 更改 class 属性
    - 更改 style 属性
    - JS 操作 DOM
    - 计算 offsetWidth 和 offsetHeight

- Repaint（重绘）

  - 元素的变化不影响布局，只引起这个元素的重新绘制
  - 原因：背景/文字/边框颜色改变等

- 关系

  - 回流 必定引起 重绘；但 重绘 不一定引起 回流
  - 回流 的速度明显比 重绘 更缓慢

- 启示

  - 回流是不可避免的，所以只能尽可能减小它的代价

    - 需要改变元素样式时直接设置在子元素上，而非通过父级元素影响到子元素

    - 将多次样式的修改统一为一步

      - 比如需要修改 padding，margin，width 三个样式

      ```js
      // 不应该这样修改, 会造成三次回流
      element.style.padding = '';
      element.style.margin = '';
      element.style.width = '';
      // 可以使用以下两种方法, 只造成一次回流
      element.style.cssText += 'padding: 0; margin: 0; width: 0;';
      element.className += 'hxwnb';
      ```

      

