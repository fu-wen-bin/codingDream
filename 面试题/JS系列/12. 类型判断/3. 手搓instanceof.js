function myInstanceof (L, R) {
  if (typeof R !== 'function') {
    throw new TypeError(`${R} is not a function`)
  }
  // 原始值与 null 直接为 false
  if (L === null || (typeof L !== 'object' && typeof L !== 'function')) {
    return false
  }
  if (L.__proto__ === null) {
    return false
  }
  if (L.__proto__ !== R.prototype) {
    return myInstanceof(L.__proto__, R)
  }
  return true
}

console.log(myInstanceof([], Array)) // true
console.log(myInstanceof(1, Number)) // false