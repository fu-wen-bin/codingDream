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
  if (array.length <= 1) return array // 递归终止条件
  const mid = Math.floor(array.length / 2) // 找到中间索引
  const left = mergeSort(array.slice(0, mid)) // 递归排序左半部分
  const right = mergeSort(array.slice(mid)) // 递归排序右半部分
  // 合并两个有序数组
  function merge (left, right) {
    const result = []
    let i = 0
    let j = 0
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i])
        i++
      }
    }
  }

  return merge(left, right) // 合并两个有序数组

}

console.log('归并排序：', mergeSort(test)) // [2, 3, 4, 5, 8]

// 快速排序
function quickSort (array) {
  const result = array
  if (result.length <= 1) return result // 递归终止条件
  const pivot = result[0] // 选择基准值
  const left = [] // 小于基准值的子数组
  const right = [] // 大于等于基准值的子数组
  for (let i = 1; i < result.length; i++) {
    if (result[i] < pivot) {
      left.push(result[i])
    } else {
      right.push(result[i])
    }
  }
  // 递归排序子数组并合并结果
  return [...quickSort(left), pivot, ...quickSort(right)]
}

console.log('快速排序：', quickSort(test)) // [2, 3, 4, 5, 8]