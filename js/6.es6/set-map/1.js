const s = new Set([1, 2, 2, 3, 4, 4, 4, 5, 6])
console.log(s) // Set { 1, 2, 3, 4, 5, 6 }

// 保证数组中的元素唯一，可以用作数组去重

const arr = [1, 2, 2, 3, 4, 4, 4, 5, 6]
const s1 = [...new Set(arr)]
console.log(s1)

// 只能尾部增加一个值，可以随意删除

const s3 = new Set()
s3.add(1)
s3.add(2)
s3.add(3)
s3.delete(2)
s.has(3)  // 判断元素存在
s3.clear()  // 全部清空

// 伪数组，不能直接用索引读取值，需要用 for...of 循环
for (const item of s.values()) {
  console.log(item)
}

for (const item of s.keys) {
  console.log(key) // 相当于数组结构解构的方法，key和value一样时可以省略value
}