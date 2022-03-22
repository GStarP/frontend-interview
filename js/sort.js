/**
 * @Date 2020.3.25
 * Sort alg is everything's base
 */

// 仅展示算法,不做可靠性处理

/**
 * 快速排序(简易版)
 */
function quickSortEZ(arr, left, right) {
  if (arr.length <= 1) return arr;
  const pivot = Math.floor((left + right) / 2);
  const tmp = arr[pivot];
  arr.splice(pivot, 1);
  const lArr = [];
  const rArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < tmp) {
      lArr.push(arr[i]);
    } else {
      rArr.push(arr[i]);
    }
  }
  return quickSortEZ(lArr, 0, lArr.length).concat(
    [tmp],
    quickSort(rArr, 0, rArr.length)
  );
}

const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41];
console.log(quickSortEZ(arr, 0, arr.length));

/**
 * 快速排序(正常版)
 */
function partition(arr, left, right) {
  const pivot = arr[left];
  while (left < right) {
    while (left < right && arr[right] > pivot) {
      right--;
    }
    // 把右起第一个比 pivot 小的值放到 left, pivot 所在位变为 right
    arr[left] = arr[right];
    while (left < right && arr[left] <= pivot) {
      left++;
    }
    // 把左起第一个比 pivot 大的值放到 right, pivot 所在位变为 left
    arr[right] = arr[left];
  }
  // pivot 一定在 left/right 位, 而跳出循环的要求是 left===right
  // 所以最后 pivot 必定停留在 left 位
  arr[left] = pivot;
  return left;
}
function quickSort(arr, left, right) {
  if (left >= right) return arr;
  const pos = partition(arr, left, right);
  quickSort(arr, left, pos - 1);
  quickSort(arr, pos + 1, right);
  return arr;
}

const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41];
quickSort(arr, 0, arr.length - 1);
console.log(arr);

/**
 * 冒泡排序
 */
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        const tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}
const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41];
console.log(bubbleSort(arr));

/**
 * 插入排序
 */
function insertSort(arr) {
  if (arr.length <= 1) return arr;
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i];
    let j = i - 1;
    for (; j >= 0; j--) {
      if (arr[j] > cur) {
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }
    arr[j + 1] = cur;
  }
  return arr;
}
const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41];
console.log(insertSort(arr));
