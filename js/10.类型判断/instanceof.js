function myInstanceof(L, R) {
  L = L.__proto__

  while(L) {
    if (L === R.prototype) {
      return true
    }
    L = L.__proto__
  }
  return false
}

console.log(myInstanceof([], Array));
console.log(myInstanceof([], Object));