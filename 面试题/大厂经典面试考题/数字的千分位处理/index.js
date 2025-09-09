const oldNum = 1212354985425.135 // 1,212,354,985,425.13

function toThousands (num) {
  // 小数不用进行分割
  // [ 整数部分, 小数部分 ]
  const [integer, decimal] = String.prototype.split.call(num, '.')
  const arr = []
  let j = 0
  for (let i = integer.length - 1; i >= 0; i--) {
    arr.unshift(integer[i])
    j++
    if (j % 3 === 0 && i !== 0) {
      // 不是最后一位才添加逗号
      arr.unshift(',')
    }
  }

  // 正则方法
  /*
  const res = integer.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,')
  console.log(res)
  */

  return decimal ? `${arr.join('')}.${decimal}` : arr.join('')

}

console.log(toThousands(oldNum))