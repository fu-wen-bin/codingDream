const nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

// 暴力解法 --超时
var maxSlidingWindow1 = function (nums, k) {
  const len = nums.length
  let left = 0
  let right = k - 1
  let result = []
  while (right < len) {
    let max = getMax(nums, left, right)
    result.push(max)
    left++
    right++
  }
  console.log(result)
}

function getMax (nums, left, right) {
  let max = -Infinity
  for (let i = left; i <= right; i++) {
    if (nums[i] > max) {
      max = nums[i]
    }
  }
  return max
}

maxSlidingWindow1(nums, k)

// 优化解法 --使用双端队列，双端都能进出
var maxSlidingWindow2 = function (nums, k) {
  const len = nums.length
  const result = []

  //维护一个单调递减队列做到实时监控最大值
  const deque = [] // 双端队列，宽度等于窗口大小
  if (len === 0 || k === 0) return []
  if (k === 1) return nums

  for (let i = 0; i < len; i++) {
    // 队头的元素被排除在窗口之外时，移除原本队头元素
    // 即当队头的索引小于当前索引减去窗口大小 k 时，移除队头元素
    if (deque.length && deque[0] < i - k + 1) {
      deque.shift()
    }

    // 不断地移除小于当前元素的所有元素
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop()
    }

    // 添加当前元素的索引
    deque.push(i)

    // 当窗口大小达到 k 时，添加最大值到结果中
    if (i >= k - 1) {
      result.push(nums[deque[0]])
    }
  }

  return result
}

console.log(maxSlidingWindow2(nums, k))

