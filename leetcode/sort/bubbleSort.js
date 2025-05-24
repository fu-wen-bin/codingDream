// bubbleSort
const arr = [5, 3, 2, 4, 1]

function bubbleSort (arr) {
  const len = arr.length
  for (let i = 1; i < len; i++) {  //比较的轮数
    for (let j = 0; j < len - i; j++) {
      // 前面大就交换
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]] // 数组解构交换
      }
    }
  }
  return arr
}

console.log(bubbleSort(arr))


