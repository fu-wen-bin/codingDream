let nums = [2, 7, 11, 15], target = 9

// var twoSum = function(nums, target) {  // 用空间换时间
//   for (let i = 0; i < nums.length; i++) {
//     let item = target - nums[i]
//     // 去数组中找有没有 item，有就返回索引
//     let j = nums.indexOf(item)
//     // 实际上这个方法不会减少时间，自带函数帮你循环而已
//     if (j !== -1 && j !== i) {
//       return [i, j]
//     }
//   }
// }

var twoSum = function (nums, target) {
  // 用空间换时间
  // 本写法相当于使用哈希表，只是用了手搓的办法
  let diffs = {}

  for (let i = 0; i < nums.length; i++) {
    let item = target - nums[i]
    // 去 diffs 中找有没有 item
    if (diffs[item] !== undefined) {
      return [diffs[item], i]
    }
    diffs[nums[i]] = i

  }
}
console.log(twoSum(nums, target))