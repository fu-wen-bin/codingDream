let str: string | unknown = 'hello'
str = null

let len = (str as string).length // 报错，str可能为null