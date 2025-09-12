let arr = [
  { name: '张三', age: 18, like: { n: 'running' } },
  { name: '李四', age: 19 },
  { name: '张三', age: 18, like: { n: 'running' } },
  { name: '王五', age: 18 },
]

// let newArr = [...new Set(arr)]
// console.log(newArr)

function unique (arr) {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    let has = false
    for (let j = 0; j < res.length; j++) {
      if (equal(arr[i], res[j])) {
        has = true
        break
      }
    }
    if (!has) {
      res.push(arr[i])
    }
  }

  return res
}

function equal (v1, v2) {
  if ((typeof v1 === 'object' && v1 !== null) &&
      (typeof v2 === 'object' && v2 !== null)) {

    if (Object.keys(v1).length !== Object.keys(v2).length) {
      return false
    }

    for (let key in v1) {
      if (key in v2) {
        // v1[key]   v2[key]
        if (!equal(v1[key], v2[key])) {
          return false
        }
      } else {
        return false
      }
    }

    return true

  } else {
    return v1 === v2
  }
}

console.log(unique(arr))
