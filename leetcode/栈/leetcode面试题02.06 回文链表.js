let isPalindrome = function (head) {
  // 若为空则返回true
  if(head === null) return true
  const stack = []
  let temp = head
  // 1. 链表遍历成栈
  while (temp) {
    stack.push(temp.val)
    temp = temp.next
  }

  // 2. 依次出栈再次与链表遍历比较
  while (head) {
    if(head.val !== stack.pop()){
      return false
    }
    head = head.next
  }
  // 都相等则返回false
  return true
}
