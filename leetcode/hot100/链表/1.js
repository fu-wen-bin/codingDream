// const list = {  // 链表的一个节点
//   val: 'a',
//   next: {
//     val: 'b',
//     next: {
//       val: 'c',
//       next: null
//     }
//   }
// }

// list.next.val

function ListNode(val, next) {
  this.val = val
  this.next = next ? next : null
}

const head = new ListNode('a')

let node = head
for (let i = 1; i <= 10; i++) {
  node = node.next
}
console.log(node.val);





