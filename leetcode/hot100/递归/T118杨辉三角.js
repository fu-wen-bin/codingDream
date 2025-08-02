// 使用动态规划的方法来解决

// 每一个填入的数据都都等于
let generate = function (numRows) {
  const triangle = []
  triangle[0] = [1] // 第一行只有一个元素 1
  triangle[1] = [1, 1] // 第二行有两个元素 1
  if (numRows === 1) {
    return [triangle[0]]
  }
  if (numRows === 2) {
    return triangle
  }

  for (let i = 3; i <= numRows; i++) {
    const row = [1] // 每行的第一个元素是 1
    const prevRow = triangle[i - 2] // 获取上一行
    for (let j = 1; j < i - 1; j++) { // 从第二个元素开始到倒数第二个元素
      row[j] = prevRow[j - 1] + prevRow[j] // 当前行的元素等于上一行的相邻两个元素之和
    }
    row.push(1) // 每行的最后一个元素也是 1
    triangle.push(row) // 将当前行添加到三角形中
  }
  return triangle
}