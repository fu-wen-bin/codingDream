# 1. 回调

- 回调地狱：
    1. 不利于阅读和错误处理
    2. 无法通过try catch 捕获错误
    3. **不会爆栈，因为一个函数调用完就销毁了**

# 2. Promise

# 3. Generator 函数

- 生成器函数:
    1. 函数中可以使用 yield 关键字，会暂停函数的执行
    2. 生成器函数调用后，不会立即执行，而是返回一个迭代器对象
    3. 迭代器对象包含 next 方法，调用 next 方法会执行函数体，直到遇到下一个 yield 关键字，next接收参数作为上一个 yield
       表达式的返回值
    4. value 属性表示当前 yield 表达式的值
    5. done 属性表示函数是否执行完毕

# 4. async await

- async await 原理：
    1. async 函数返回一个 Promise 对象
    2. await 关键字只能在 async 函数中使用
    3. await 后面可以跟一个 Promise 对象，会将Promise对象中resolve的值作为 await 表达式的值
    4. await 后面可以跟一个普通值，但如果是普通值，就不具备处理异步的能力

async await -> Promise + Generator 函数 + co 库