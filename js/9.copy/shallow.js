// 1. for...in会遍历所有可枚举属性，包括原型链上的属性
function shallowCopy1 (obj) {
  let newObj = {}
  for (let key in obj) {
    newObj[key] = obj[key]

  }
  return newObj
}

// 2. Object.keys()只会返回对象自身的可枚举属性，不包括原型链上的
function shallowCopy2 (obj) {
  let newObj = {}
  Object.keys(obj).forEach(key => {
    newObj[key] = obj[key]
  })
  return newObj
}

// 3. 判断显式拥有的属性，隐式拥有的属性不会被拷贝
function shallowCopy3 (obj) {
  let newObj = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }
}
