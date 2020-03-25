
/**
 * @Date 2020.3.25
 * Sort alg is everything's base
 */

// 仅展示算法,不做可靠性处理

/**
 * 快速排序(简易版)
 */
function quickSortEZ(arr, left, right) {
  if (arr.length <= 1)
    return arr
  const pivot = Math.floor((left + right) / 2)
  const tmp = arr[pivot]
  arr.splice(pivot, 1)
  const lArr = []
  const rArr = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < tmp) {
      lArr.push(arr[i])
    } else {
      rArr.push(arr[i])
    }
  }
  return quickSortEZ(lArr, 0, lArr.length).concat([tmp], quickSort(rArr, 0, rArr.length))
}

const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41]
console.log(quickSortEZ(arr, 0, arr.length))

/**
 * 快速排序(正常版)
 */
function swap(arr, x, y) {
  const tmp = arr[x]
  arr[x] = arr[y]
  arr[y] = tmp
}
function partition(arr, left, right) {
  const mid = Math.floor((left + right) / 2)
  const pivot = arr[mid]
  while(left < right) {
    while(arr[left] < pivot) {
      left++
    }
    while(arr[right] > pivot) {
      right--
    }
    if (left < right) {
      swap(arr, left, right)
      left++
      right--
    }
  }
  // pivot 真正所在位置的下一位
  return left
}
function quickSort(arr, left, right) {
  if (arr.length <= 1)
    return arr
  const pos = partition(arr, left, right)
  if (pos > left) {
    quickSort(arr, left, pos - 1)
  }
  if (pos < right) {
    quickSort(arr, pos + 1, right)
  }
  return arr
}

// const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41]
const arr = ['dota', 'apex', 'QQ', 'bson', 'Python', 'java']
console.log(quickSort(arr, 0, arr.length - 1))

/**
 * 冒泡排序
 */
function bubbleSort(arr) {
  for (let i = 0 ; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j+1]) {
        const tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
      }
    }
  }
  return arr
}
const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41]
console.log(bubbleSort(arr))

/**
 * 插入排序
 */
function insertSort(arr) {
  if (arr.length <= 1)
    return arr
  for (let i = 1; i < arr.length; i++) {
    const cur = arr[i]
    let j = i - 1
    for (; j >= 0; j--) {
      if (arr[j] > cur) {
        arr[j+1] = arr[j]
      } else {
        break
      }
    }
    arr[j+1] = cur
  }
  return arr
}
const arr = [12, 34, 5, 25, 87, 63, 11, 52, 9, 41]
console.log(insertSort(arr))
