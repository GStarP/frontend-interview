# Virtual DOM

## 为什么需要

- 常规渲染流程
  - HTML $\rightarrow$ DOM
  - CSS $\rightarrow$ Style Rules
  - DOM + Style Rules $\rightarrow$ Render 树
    - Dom 节点的 attach() 接收样式返回 render 对象
  - 计算布局（节点坐标）
  - 调用节点的 paint() 将其绘制
- 为什么 DOM 操作代价大
  - 因为每次 DOM 更新都要把上边的步骤全部走一遍
- 效率方面：**有待确认**
  - 虚拟 DOM 是纯粹的 JS 对象，操作起来相比 DOM 节点更加高效
  - 虚拟 DOM 能把多次频繁的更新都只现在 VDOM 上做，最后再一起 patch 到 DOM 上
- Evan You
  - 对于结构简单的 DOM，手工优化当然能够比 VDOM 效率更高；但是对于结构复杂，体量庞大的 DOM，手工优化代价大，可维护性差；因此，VDOM 其实是普适性的，在效率、可维护性之间达成了一个较好的平衡
  - VDOM 掩盖了底层的 DOM 操作，提高了抽象化程度，使得声明式的开发成为可能，代码维护更加容易
  - 最大的好处是 **解耦 HTML 依赖**，可以渲染到 DOM 以外的平台（如 SSR，Weex）
  - 自己理解的一点
    - 不使用 VDOM 的话，数据变更时更新 DOM 的方法就是直接替换整个 innerHTML，这在变更的数据量很大时是可以接受的；但是，如果只有少量的数据需要更改，将整个 innerHTML 都替换而导致大量未变更 DOM 节点的重新创建显然是代价极大的
    - 重绘性能消耗如下
      - innerHTML：render innerHTML: O(template size) + 重新创建 **所有** DOM 元素: O(DOM size)
      - VDOM：render VDOM + diff: O(template size) + 必要的 DOM 更新: O(DOM change)

## Diff 算法

- 只在同层级之间进行比较
- 如下述代码，我们一般想的操作是把 span 移到 p 后面，但 diff 算法实际上做的是删除 span 并创建一个 span 插入到 p 后，因为 span 和 p 并不在同一层

```html
<!-- raw -->
<div>
    <p>
    	<b></b>
        <span></span>
    </p>
</div>
<!-- new -->
<div>
    <p>
        <b></b>
    </p>
    <span></span>
</div>
```

- 算法实现

```js
function patch (oldVnode, vnode) {
    // 值得比较: 一般看是节点的 key & tag 等属性是否相同
    if (sameVnode(oldVnode, vnode)) {
        // 如果值得比较,就要进入较复杂的比较过程,找到变更处
        patchVnode(oldVnode, vnode)
    } else {
        // el 属性是对真实 DOM 节点的引用
        const oEl = oldVnode.el
        let parentEle = api.parentNode(oEl)
        // 如果节点不值得比较,直接创建新节点挂载并删除旧节点
        createEle(vnode)
        if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
            api.removeChild(parentEle, oldVnode.el)
            oldVnode = null
        }
    }
    return vnode
}
```

- patchVnode

```js
function patchVnode (oldVnode, vnode) {
    // 让新 vnode 的 el(原本为 null) 指向这个真实的 DOM 节点
    // el 变化时 vnode.el 也会同步变化!
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    // 引用一致,没有变化
    if (oldVnode === vnode) return
    // 文本节点文本变更
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    } else {
        updateEle(el, vnode, oldVnode)
        // 两者都有子节点且子节点不一样
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        // 只有新 vnode 有子节点,在 vnode.el 上添加这些子节点
        } else if (ch) {
            createEle(vnode)
        // 只有旧 vnode 有子节点,将这些子节点删除
        } else if (oldCh) {
            api.removeChildren(el)
        }
    }
}
```

- updateChildren：核心

```js
updateChildren (parentElm, oldCh, newCh) {
    // 两个节点的子节点数组首尾指针
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let newEndIdx = newCh.length - 1
    // 首尾节点
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 为 null 的话就相当于直接 ++/-- 了
        if (oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx] 
        } else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx]
        } else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx]
        } else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx]
        // 同上文一样,对值得比较的两个节点递归 patch
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        // 如果旧头和新尾值得比较,说明旧头已经跑到了旧尾的后面,将其移过来
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        // 如果旧尾和新头值得比较,说明旧尾已经跑到了旧头的前面,将其移过来
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        } else {
           // 不值得比较
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
            }
            idxInOld = oldKeyToIdx[newStartVnode.key]
            // 如果新头的 key 在旧节点的子节点列表的 key 字典中不存在,说明是新节点
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                newStartVnode = newCh[++newStartIdx]
            } else {
                // 找到对应 key 的旧 vnode 的子节点
                elmToMove = oldCh[idxInOld]
                if (elmToMove.sel !== newStartVnode.sel) {
                    // key 相同但属性不同,也得创建新元素插入
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                } else {
                    // key 相同属性也相同,直接移过来
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    // 旧节点先遍历完,说明新节点有部分节点被添加
    if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    // 新节点先遍历完,说明新节点有部分节点被删除
    } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```



