let input = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null,
}
let output = {
  'a': 1,
  'b[0]': 1,
  'b[1]': 2,
  'b[2].c': true,
  'b[3][0]': 3,
  'd.e': 2,
  'd.f': 3,
}

function flattenObj (obj) {
  let res = {}

  function dfs (target, oldKey) {
    for (let key in target) {
      let newKey

      if (oldKey) { // 走了递归
        if (Array.isArray(target)) {
          newKey = `${oldKey}[${key}]`
        } else {
          newKey = `${oldKey}.${key}`
        }
      } else {
        newKey = key
      }

      if (typeof target[key] === 'object' && target[key] !== null) {
        dfs(target[key], newKey)  // {c: true},  'b[2]'
      } else {
        res[newKey] = target[key]
      }

    }
  }

  dfs(obj, '')

  return res
}

console.log(flattenObj(input))
