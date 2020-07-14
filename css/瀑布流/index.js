/**
 * 瀑布流布局
 * 1. 内容宽度固定, 高度不定
 * 2. 内容从左向右排列, 下一行的内容有限排在较短的列下
 */

 // 4 列
 var colNum = 4

 window.onload = function() {
    waterfall()
 }

 window.onresize = function () {
    waterfall();
}

 function getClientWH() {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }
}

 function waterfall() {
    var waterfallItems = document.getElementsByClassName('waterfall-item')

    // 定义宽度和间距
    var pageW = getClientWH().width
    var itemW = waterfallItems[0].offsetWidth
    var marginLeft = parseInt(pageW / 100)
    var marginBottom = 8
    // 保存每列当前高度
    var hArr = []
    for (var i = 0; i < waterfallItems.length; i++) {
        // 第一行
        if (i < colNum) {
            waterfallItems[i].style.top = 0
            waterfallItems[i].style.left = (itemW + marginLeft) * i + 'px'
            hArr.push(waterfallItems[i].offsetHeight)
        } else {
            // 寻找高度最低的列
            var minHeightColIdx = 0
            for(var j = 0; j < hArr.length; j++) {
                if (hArr[minHeightColIdx] > hArr[j]) {
                    minHeightColIdx = j
                }
            }

            waterfallItems[i].style.top = (hArr[minHeightColIdx] + marginBottom) + 'px'
            waterfallItems[i].style.left = waterfallItems[minHeightColIdx].style.left

            // 累计列高度
            hArr[minHeightColIdx] += waterfallItems[i].offsetHeight + marginBottom
            console.log(hArr)
        }
    }
 }
