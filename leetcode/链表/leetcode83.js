let head = [1, 1, 1,  2, 3, 3]

var deleteDuplicates = function(head) {
  let cur = head

  while(cur && cur.next) {
    if (cur.val === cur.next.val) {  // 当前的值等于下一个值 1  1
      cur.next = cur.next.next
    } else {
      cur = cur.next
    }
  }

  return head
};