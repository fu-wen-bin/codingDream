console.log([] instanceof Array) // true
console.log({} instanceof Object) // true
console.log(new Date() instanceof Date) // true
console.log(function () {} instanceof Function) // true

// instanceof 只能用来判断引用类型，不能用来判断基本类型
console.log(1 instanceof Number) // false
console.log('hello' instanceof String) // false