# CSS

## 选择器

- 类型
  
  - 通配符：`*`
  
  - 标签：`h1`
  
  - 类：`.class`
  
  - ID：`#id`
  
  - 伪类：`a:hover`
  
  - 伪元素：`a::first-line`
  
  - 属性：`a[href="www.qq.com"]`
  
  - 关系：`div a`；`div > a`；`div + a`

- 优先级（由高到低）
  
  - !important
  
  - 内联样式
  
  - ID 选择器个数
  
  - (ID, 标签, 伪元素) 以外的选择器个数
  
  - 标签，伪元素选择器个数

## 居中方式

- 水平居中
  
  - 子元素为 display: inline-block/flex/grid/table 时，父元素设置 text-align: center
  
  - 子元素为 display: block 时，设置 margin: 0 auto
  
  - 父元素为 display: flex 时，设置 justify-content: center

- 竖直居中
  
  - 子元素为 display: inline-block/flex/grid/table 时，父元素设置 vertical-align: middle
  
  - 父元素为 display: flex 时，设置 align-items: center

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
  - 如果当前 font-size 未设置，取父元素的，直到默认值 16px
  - 因此我们可以在 body 中设置 font-size: 62.5% 就能让 1px = 10em
  - **为什么要用**
    - 根本原因在于把其它属性，如 margin、width 等表示为 function(font-size)
    - 这样就可以只改一个 font-size 而实现全部内容的缩放

- rem
  
  - root em
  - 相对于 html 根元素（JS 中的 document.documentElement；HTML 中的 \<html\>；CSS 中的 :root）的字体大小
  - 适配设备宽度
    - 比如 750px 的设计稿，上 1000px 的设备，就将根元素字体大小设为 16 / 750 * 1000 px

- rpx
  
  - 自动计算好的 rem

- vh/vw
  
  - 相对于视窗，视窗被分为 100 vh/vw 的高度/宽度

- vmax/vmin
  
  - 把高和宽中较大/较小的那个划分为 100 vmax/vmin

## 弹性盒子

- 采用 flex 布局的元素称为 flex-container，其子元素自动成为 flex-item
- 存在主轴（main start—main end）和交叉轴（cross start—cross end）
- flex-container 属性
  - flex-direction：主轴方向
  - flex-wrap：如何换行
  - flex-flow：上面两者的组合
  - justify-content：主轴对齐方式
  - align-items：交叉轴对齐方式
  - align-content：内容对齐方式（同时影响在两个轴上的表现）
- flex-item 属性
  - order：排列顺序，越小越前
  - flex-grow：如果能比自身大，就把剩余的空间按比例分配
    - 三个 1-2-1 的元素就是 25%-50%-25%
    - 为 0 时保持自身宽/高度
  - flex-shrink：同上，但是缩小
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

> [MDN 盒模型](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)

[点击查看](./css/box-sizing.html)

- 盒模型的基本规范：margin-border-padding-content(width, height)
- 应用 box-sizing: border-box 后（默认 content-box）
  - width = border + padding + content-width（height 亦同）
  - 假设 width 为 50%， padding 为 10 px，父元素宽度为 300px
  - 如果不添加 box-sizing: border-box，则其实际宽度并非 150px 而是 150+10+10=170 px
- background-clip
  - border-box：带 border
  - padding-box：不带 border 带 padding
  - content-box：不带 border/padding，只带 content
- outline
  - 类似 border，但不占空间
- 标准盒模型 v.s. 怪异盒模型
  - 标准就是 content-box，怪异就是 border-box
  - 怪异：因为 IE 设计时与 W3C 规范不一致，但是意外的有用

## 百分比

> 父元素：第一个 position 不为 static 的祖先元素

- 相对于父元素宽度：[max/min-]width，padding，margin，left，right
- 相对于父元素高度：[max/min-]height，top，bottom
- 相对于继承字号：font-size
- 相对于自身字号：line-height
- 相对于自身宽高：border-radius，background-size，transform
- 如果 position: fixed，父元素为窗口

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

## 过渡函数

```css
transition-timing-function: linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n);
```

- linear：以相同速度开始至结束，= cubic-bezier(0,0,1,1)
- ease：慢速开始，然后变快，然后慢速结束，= cubic-bezier(0.25,0.1,0.25,1)
- ease-in：慢速开始，= cubic-bezier(0.42,0,1,1)
- ease-out：慢速结束，= cubic-bezier(0,0,0.58,1)
- ease-in-out：慢速开始慢速结束，= cubic-bezier(0.42,0,0.58,1)
- cubic-bezier(0, n, n, 1)
  - n 取值 0~1
  - 贝赛尔曲线：0,0 和 1,1 是函数的起始点；其他两个点拉伸出一条速度曲线（[详情](https://www.runoob.com/cssref/func-cubic-bezier.html)）

## position

- static：默认，忽略 left/right/top/bottom/z-index
- inherit：继承父元素
- relative：相对正常位置通过 left/right/top/bottom 偏移
- absolute：相对于第一个非 static 定位的父元素进行定位
- fixed：相对于浏览器窗口进行定位

## 两列布局

[点击查看](./css/double-col.html)

- 要求：左侧宽度固定，右侧宽度自适应
- 方法一：flex 布局，左侧固定宽度，右侧 flex: 1
- 方法二：左侧 absolute，右侧 margin-left 等于左侧宽度

## 三列布局

[双圣杯](./css/triple-col-ssb.html)

[Flex](./css/triple-col-flex.html)

- 要求
  - 左右宽度固定，中间自适应
  - 中间在 DOM 上优先（先行渲染）
  - 允许任意一列优先
- 圣杯布局
  - 对 left&center&right 都是用 float: left
    - 注意还要为 footer 设置清除浮动 clear: both
  - container 左右 padding 等于左右列宽度
  - 将 left 使用 margin-left: -100% 放到 center 左侧（因为 DOM 中 center 在最前面）
  - 然后用 position: relative 加 right: [左宽度] 使 left 移到左侧
  - right 使用 margin-right: -[右宽度] 使 right 移到右侧
  - 但为了保证最小宽度，需要设置 container 的 min-width: [左+左+右]
- Flex
  - left 设置 order 为 -1 保证在最左

## 变量

[点击查看](./css/variable.html)

- 名称一般以 “--” 开头，如 `--text-color: blue;`
- 定义时需要声明其作用域，定义在 :root 里可以保证作用到全局
- 使用：`color: var(--text-color)`

## Dark Mode

- 主要是为了响应苹果推出的“系统 Dark Mode”
- Dark Mode 不是简单的“反色”，即将 rgb(a, b, c) 改为 rgb(255-a, 255-b, 255-c)，这样得到的结果惨不忍睹
  - 特别是图片，往往不需要反色，或是反色后很阴间
- 一种简单的解决办法是由设计定义 Dark Mode 颜色构成
  - 本质上是“切换主题”
- 切换主题的通用实现思路
  - 在使用颜色时使用变量，而非字面量
  - 切换主题时切换变量定义，即可完成颜色更换
- 判断系统是否处于 Dark Mode
  - 通过 `@media (prefers-color-scheme: dark/light/no-preference)`
- 简单实现

```css
@media (prefers-color-scheme: no-preference) {
    :root {
        --background-color: white;
        --text-color: black;
    }
}
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: black;
        --text-color: white;
    }
}
.main {
    color: var(--text-color);
    background-color: var(--background-color);
}
```

- 更灵活的方式：通过在 <body> 上添加 class 来切换变量定义

```css
:root {
    --background-color: white;
    --text-color: black;
}
:root .diy {
    --background-color: yellow;
    --text-color: green;
}
```

## 垂直外边距合并

- 当两个垂直方向的 margin 相邻时，他们将融合成一个 margin，取较大者

- 具体问题：当无上边距的 body 中有且仅有一个 margin-top=20 的子元素时，body 会因此拥有 20 的上边距，被子元素拉下来

- 解决：给 body 上 border-top 或 padding-top，但高度不能为 0；或者用空 div 隔开

## Border 是三角形的

[点击查看](./css/border.html)

- border 并非直线，而是三角形
- 平时我们将 border 宽度设置得很小，content 在中间挡住 border 的尖角部分，剩下的部分看起来就像是一条直线
- 但如果把 border 宽度设置得很大，content 设置得很小，就能看到 border 三角形的真身

## transform

- transform 可以对元素进行平移、旋转、缩放、倾斜

```css
transform: translate(x, y);
transform: rotate(0.5turn/180deg);
transform: scale(x, y);
transform: skew(x, y);
```

- 默认为 none，如果被设为非 none，则会创建一个 stacking context

## stacking context

- 层叠上下文：体现元素的遮挡关系

- 什么情况会创建层叠上下文
  
  - 文档根元素
  
  - position: absolute | relative，且 z-index 不为 auto
  
  - position: flxed | sticky
  
  - flex 容器子元素，且 z-index 不为 auto
  
  - grid 容器子元素，且 z-index 不为 auto
  
  - opacity 小于 1
  
  - transform/filter/mask/clip-path 不为 none
  
  - contain 包含 layout 或 paint

- 默认子元素在父元素上方，兄弟元素越靠后越往上

- 可以设置 z-index 手动调整，但注意其只在兄弟元素间比较

- 没有创建层叠上下文的元素，与父元素位于同一层级
