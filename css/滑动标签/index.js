/**
 * 仅 CSS 就可以完成滑动(包括惯性滑动)
 * JS 主要处理的是点击相关的样式变化
 */

var lastSelected = 0

window.onload = function() {
    var unitItems = document.getElementsByClassName('unit-item')
    for (let i = 0; i < unitItems.length; i++) {
        unitItems[i].addEventListener('click', () => {
            itemClick(i, unitItems)
        })
    }

    var slider = document.getElementById('unit-slider')
    slider.style = `width: ${unitItems[0].offsetWidth}px; transform: translateX(${unitItems[0].offsetLeft}px)`
}

function itemClick(idx, unitItems) {
    unitItems[lastSelected].classList.remove('selected')
    unitItems[idx].classList.add('selected')
    lastSelected = idx
    var slider = document.getElementById('unit-slider')
    slider.style = `width: ${unitItems[idx].offsetWidth}px; transform: translateX(${unitItems[idx].offsetLeft}px)`
}
