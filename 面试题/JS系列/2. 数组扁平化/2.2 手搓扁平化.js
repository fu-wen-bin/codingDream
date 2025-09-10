// 题目：手动扁平化数组
const arr = [1, 2, [3, 4], [5, [6, 7, [8, 9]]]]

// 递归
function flatten1 (arr) {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      // 如果当前元素是数组，递归调用fatten函数
      res = res.concat(flatten1(arr[i]))
    } else {
      res.push(arr[i])
    }
  }
  return res  // 添加了return语句，返回处理后的结果
}

const res = flatten1(arr)
console.log(res) // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 使用reduce + 递归 优化
function flatten2(arr) {
  return arr.reduce((pre, cur) => {  // [1].concat(x)
    return pre.concat(Array.isArray(cur) ? flatten2(cur) : cur)
  }, [])
}

// 使用toString方法将数组转换为字符串 -- 不是纯数字或字符串不起作用
const res2 = arr.toString().split(',').map(Number)
console.log(res2) // [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 迭代
function flatten3 (arr) {
  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}
