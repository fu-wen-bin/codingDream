const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let inputLines = []
rl.on('line', (line) => {
  inputLines.push(line)
}).on('close', () => {
  let ptr = 0 // 输入指针，用于逐行读取
  const t = parseInt(inputLines[ptr++]) // 测试用例数量

  for (let i = 0; i < t; i++) {
    const n = parseInt(inputLines[ptr++]) // 数组a的长度
    const a = inputLines[ptr++].split(' ').map(Number) // 数组a的元素
    const m = parseInt(inputLines[ptr++]) // 需要检查的字符串数量

    for (let j = 0; j < m; j++) {
      const s = inputLines[ptr++] // 当前待检查的字符串
      if (s.length !== n) { // 长度不一致，直接不匹配
        console.log('NO')
        continue
      }

      const numToChar = new Map() // 数字→字符的映射
      const charToNum = new Map() // 字符→数字的映射
      let isMatch = true

      for (let k = 0; k < n; k++) {
        const num = a[k]
        const char = s[k]

        // 检查数字→字符的映射是否一致
        if (numToChar.has(num)) {
          if (numToChar.get(num) !== char) {
            isMatch = false
            break
          }
        }

        // 检查字符→数字的映射是否一致
        if (charToNum.has(char)) {
          if (charToNum.get(char) !== num) {
            isMatch = false
            break
          }
        }

        // 若均未映射，建立新映射
        if (!numToChar.has(num) && !charToNum.has(char)) {
          numToChar.set(num, char)
          charToNum.set(char, num)
        }
      }

      console.log(isMatch ? 'YES' : 'NO')
    }
  }
})