// selectionSort
const arr = [5, 3, 2, 4, 1]

// 寻找最值放到边界
function selectionSort (arr) {
  const len = arr.length
  let minIndex = 0
  for (let i = 0; i < len - 1; i++) {  // 代表数组下标
    minIndex = i
    // 找区间内最小值的下标
    let currentIndex = getMin(minIndex, len - 1, arr)
    if (currentIndex !== minIndex) {
      // 交换数据
      [arr[i], arr[currentIndex]] = [arr[currentIndex], arr[i]]
    }
  }
  return arr
}

function getMin (i, j, arr) {
  let min = Infinity
  let o = 0
  for (let k = i; k <= j; k++) {
    if (arr[k] < min) {
      min = arr[k]
      o = k
    }
  }
  return o
}

console.log(selectionSort(arr))