var isValid = function (s) {

  if (s.length % 2 !== 0) return false // 奇数字符串直接返回
  const stack = []
  const map = {
    '(': ')',
    '[': ']',
    '{': '}',
  }

  for (const char of s) {
    if (map[char]) { // 左括号：压入对应右括号
      stack.push(map[char])
    } else { // 右括号：检查栈顶是否匹配
      if (stack.pop() !== char)
        return false
    }
  }
  return stack.length === 0

}