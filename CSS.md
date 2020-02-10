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