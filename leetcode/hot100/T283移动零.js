// 把 nums 当作栈 -- 原地栈写法(碰到非零入栈，碰到零跳过)
let moveZeroes = function (nums) {
  // stackSize = 0 作为非零元素的写入位置指针
  let stackSize = 0
  for (const x of nums) {
    // 如果取值为零则跳过
    if (x !== 0) {
      nums[stackSize++] = x // 把 x 入栈
    }
  }
  // 将从stackSize开始后的所有元素都填充为0
  nums.fill(0, stackSize)
}