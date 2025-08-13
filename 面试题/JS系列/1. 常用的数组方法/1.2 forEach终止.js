const arr = ['a', 'b', 'c', 'd', 'e']

// forEach接收一个回调函数
// 如何终止 forEach 循环？-- 不能直接终止，但可以使用异常处理来终止。
try {
  arr.forEach((item) => {
    // throw Error('遇到 c，抛出错误');// 这里抛出错误会导致 forEach 循环终止 -- 奇淫巧计

    if (item === 'c') {
      throw new Error('遇到 c，结束')
    }
    console.log(item)

    // return // 使用 return 只会跳出本次的 forEach 回调函数。不会终止 forEach 循环。
  })
} catch (e) {
  console.log(e.message)
}
