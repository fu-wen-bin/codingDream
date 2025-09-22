function isString (test: any): test is string {
  return typeof test === 'string'
}

if (isString(str)) {
  // 想要进入到该分支中，str就必须是string类型 -- 因为isString函数定死了为true的条件
}