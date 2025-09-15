const test = [5, 3, 8, 4, 2]

// 冒泡排序
function bubbleSort (array) {
  const result = array
  for (let i = 1; i <= result.length; i++) {
    for (let j = 0; j < result.length - i; j++) {
      if (result[j + 1] < result[j]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]]
      }
    }
  }
  return result
}

console.log('冒泡排序：', bubbleSort(test)) // [2, 3, 4, 5, 8]

// 选择排序
function selectionSort (array) {
  const result = array
  for (let i = 0; i < result.length - 1; i++) {
    let minIndex = i // 每遍循环都假设当前初始值为最小值
    for (let j = i + 1; j < result.length; j++) {
      if (result[j] < result[minIndex]) { // 找到更小的值
        minIndex = j
      }
    }
    if (minIndex !== i) { // 如果最小值不为本身，则交换
      [result[i], result[minIndex]] = [result[minIndex], result[i]]
    }
  }
  return result
}

console.log('选择排序：', selectionSort(test)) // [2, 3, 4, 5, 8]

// 插入排序
function insertSort (array) {
  const result = array
  for (let i = 1; i < result.length; i++) {
    let current = result[i] // 当前需要插入的值
    let j = i - 1 // 已排序部分的最后一个元素的索引
    while (j >= 0 && result[j] > current) { // 从后向前遍历已排序部分，找到插入位置
      result[j + 1] = result[j] // 元素后移
      j--
    }
    result[j + 1] = current // 插入当前元素
  }
  return result
}

console.log('插入排序：', insertSort(test)) // [2, 3, 4, 5, 8]

// 归并排序
function mergeSort (array) {

}

console.log('归并排序：', mergeSort(test)) // [2, 3, 4, 5, 8]

// 快速排序
function quickSort (array) {

}