# CSS

## 单位

- px

  - 像素：Pixel
  - 相对长度单位，相对于显示器屏幕分辨率（1280px * 1080px）
  - 但在移动设备上，一个 **设备独立像素** 可能对应多个 **物理像素**
    - dpr：设备像素比 = 物理像素 / 设备独立像素
    - Retina 屏幕
      - 把更多的像素点压缩至一块屏幕里以达到更高的分辨率
      - Retina(dpr=2) 屏幕下，1px 对应 2*2 个物理像素

- em

  - 1em 相当于当前元素的 font-size
  - 如果当前 font-size 未设置，则取所有浏览器的默认，16px
  - 因此我们可以在 body 中设置 font-size: 62.5% 就能让 1px = 10em
  - 要注意 font-size 会被继承

- rem

  - root em
  - 只相对于 html 根元素（document.documentElement）
  - 对于宽度情况复杂的移动端，让 html 根元素的 font-size 与屏幕宽度对应上

  ```js
  // 100: 方便计算的自定义参数, 750: 设计稿屏幕宽度
  document.documentElement.style.fontSize = 100 * (document.documentElement.clientWidth / 750) + 'px'
  ```

- rpx

  - 可以理解为自动计算好的 rem
  - 直接按照设计稿的数值书写即可

## 弹性盒子

- 采用 flex 布局的元素称为 flex-container，其子元素自动成为 flex-item
- 存在主轴（main start—main end）和交叉轴（cross start—cross end）
- flex-container 属性
  - flex-direction：主轴方向
  - flex-wrap：如何换行
  - flex-row：上面两者的组合
  - justify-content：主轴对齐方式
  - align-items：交叉轴对齐方式
  - align-content：内容对齐方式（同时影响在两个轴上的表现）
- flex-item 属性
  - order：排列顺序，越小越前
  - flex-grow：放大比例（121 就是 25%50%25%）
  - flex-shrink：如果空间不足，该项目将缩小
  - flex-basis：在分配多余空间之前项目占据的主轴空间
  - flex：上面三者的组合
  - align-self：可覆盖 align-items

## 计算属性

[点击查看](./css/calc.html)

```css
div {
    width: calc(100% - 10px);
}
```

- 计算长度值
- 运算符前后必须有空格

## 盒模型

[点击查看](./css/box-sizing.html)

- 盒模型的基本规范：margin-border-padding-content(width, height)
- 应用 box-sizing: border-box 后
  - width = border + padding + content-width（height 亦同）
  - 假设 width 为 50%， padding 为 10 px，父元素宽度为 300px
  - 如果不添加 box-sizing: border-box，则其实际宽度并非 150px 而是 150+10+10=170 px
- margin/padding 设置百分比：按 content 的百分比
- background-clip
  - border-box：带 border
  - padding-box：不带 border 带 padding
  - content-box：不带 border/padding，只带 content
- outline
  - 类似 border，但不占空间

> 更多参见 [MDN 盒模型](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)

## 文档流和文本流

- 文档流（Normal Flow）
  - CSS 中默认的定位方式（行内左到右，块级占一行...）
  - 针对盒模型
- 文本流
  - 针对文本
- float
  - 脱离文档流而不脱离文本流，因此会出现其它元素的文本环绕着浮动元素的情况
- fixed/absolute
  - 会同时脱离文档流和文本流，其他元素和文本都会在这个元素底下被遮掩