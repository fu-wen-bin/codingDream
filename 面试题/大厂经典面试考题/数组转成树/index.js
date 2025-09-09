const list = [
  { id: 19, parentId: 0 },
  { id: 15, parentId: 19 },
  { id: 18, parentId: 15 },
  { id: 17, parentId: 16 },
  { id: 16, parentId: 0 },
]
// const tree = {
//   id: 0,
//   children: [
//     {
//       id: 19,
//       parentId: 0
//     },
//     {
//       id: 16,
//       parentId: 0,
//       children: [
//         {
//           id: 18,
//           parentId: 16
//         },
//         {
//           id: 17,
//           parentId: 16
//         }
//       ]
//     }
//   ]
// }

const result = convert(list, 'parentId', 'id', 0)
console.log(result)

function convert (list, parentKey, currentKey, rootValue) {

  let res = {
    [currentKey]: rootValue,  // 动态设置属性名，例如 {id: 0}
    children: [],
  }

  let num = 0  // 已处理节点计数器
  while (num < list.length) {

    list.forEach((item, index) => {
      if (!item) return  // 跳过已处理的节点（已被设为null）
      // 收集最外层
      if (item[parentKey] === res[currentKey]) {
        res.children.push({
          ...item,
          children: [],
        })
        list[index] = null  // 标记为已处理
        num++  // 增加已处理计数
      } else {
        // 该节点不是 res 的子节点，尝试递归查找其父节点
        helpFn(item, index, res.children)
      }
    })
  }

  function helpFn (item, initIndex, arr) {  // arr === res.children
    let index = arr.findIndex(ele => ele[currentKey] === item[parentKey])
    // res.children里面的哪一条数据是当前 item 的父节点
    if (index !== -1) { // 找到了 item 的归属
      arr[index].children.push({
        ...item,
        children: [],
      })
      list[initIndex] = null
      num++
      return true
    }

    for (let ele of arr.values()) { // 不是 res.children中的对象的子节点，那么会不会是 resxxxx
      if (helpFn(item, initIndex, ele.children)) {
        return true
      }
    }
  }

  return res
}