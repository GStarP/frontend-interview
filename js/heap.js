/**
 * 实现 堆
 */

// 最小堆
class MinHeap {
  // 堆用数组存储数据
  list = [];

  constructor(arr) {
    arr = arr ? arr : [];
    for (const e of arr) {
      this.add(e);
    }
  }

  // 添加元素
  add = (e) => {
    // 先将其插入末尾
    this.list.push(e);
    // 再不断与父节点比较
    let p = this.list.length - 1;
    while (p !== 0) {
      // 父节点索引为 (子节点索引 - 1) / 2 向下取整
      let pp = ((p - 1) / 2) | 0;
      const e = this.list[p];
      const pe = this.list[pp];
      // 若当前值小于父节点值, 交换
      if (e < pe) {
        this.list[p] = pe;
        this.list[pp] = e;
        p = pp;
      }
      // 否则已经处于合适位置
      else {
        break;
      }
    }
  };

  // 删除堆顶
  pop = () => {
    // 根节点即最小元素
    const minE = this.list[0];
    // 用最后一个节点替换根节点
    const last = this.list.length - 1;
    this.list[0] = this.list[last];
    // 删除最后一个节点
    this.list.splice(last, 1);
    // 从根节点开始向下调整
    this.sink(0);
    return minE;
  };

  sink = (index) => {
    let p = index;
    while (p * 2 + 1 < this.list.length) {
      let lcp = p * 2 + 1;
      let cp = lcp;
      let rcp = lcp + 1;
      // 如果有右子节点, 且右子节点比左子节点小
      if (rcp < this.list.length && this.list[rcp] < this.list[lcp]) {
        cp = rcp;
      }
      // 如果最小子节点比当前节点小, 交换
      const e = this.list[p];
      const ce = this.list[cp];
      if (ce < e) {
        this.list[p] = ce;
        this.list[cp] = e;
        p = cp;
      }
      // 否则已处于合适位置
      else {
        break;
      }
    }
  };

  // 由数组生成堆
  fromArray = (arr) => {
    this.list = arr;
    // 从最后一个节点的父节点开始, 直到根节点, 向下调整
    const last = arr.length - 1;
    let p = ((last - 1) / 2) | 0;
    for (; p >= 0; p--) {
      this.sink(p);
    }
  };

  toString = () => {
    return this.list.join(' ');
  };
}

const heap = new MinHeap([6, 4, 5, 3, 1, 7, 2]);
console.log(heap.toString());

console.log(heap.pop());
console.log(heap.toString());

const heapFromArray = new MinHeap();
heapFromArray.fromArray([6, 4, 5, 3, 1, 7, 2]);
console.log(heapFromArray.toString());
