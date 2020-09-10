# DOM

## 事件坐标

- pageX/Y
  - 相对于整个页面的左上角
  - Chrome 有，Firefox 有，IE 没有
    - 可以使用 pageY = clientY + scrollTop - clientTop 计算（X 同理）
- clientX/Y【W3C 标准】
  - 相对于浏览器当前可视区域的左上角
  - 所以如果已将页面向下滚动，clientY 与 pageY 就不再一致
- screenX/Y【W3C 标准】
  - 相对于电脑屏幕的左上角
- offsetX/Y
  - 相对于触发事件元素 content 部分的左上角
  - 如果点到 border 和 padding 上会出现负值
- layerX/Y
  - 如果触发事件元素定位为 relative 或 absolute，相对于触发事件元素 border 的左上角
  - 否则，同 pageX/Y