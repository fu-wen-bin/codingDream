// 暴力解法嵌套循环

let twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let left = nums[i]  // 左手握着前一个

    // 右手把剩下的值都握一遍
    for (let j = i + 1; j < nums.length; j++) {
      let right = nums[j]  // 右手握着 7
      if (left + right === target) {
        return [i, j]
      }
    }

  }

}