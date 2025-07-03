import { useEffect, useState } from 'react'

// 模拟一个接口请求函数
async function queryData () {  // async 函数会返回一个Promise对象

  // await会让v8当作同步任务进行等待
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(666)
    }, 2000)
  })
  return data
}

function App () {
  let [num, setNum] = useState(1) // useState 不支持异步代码
  const [age, setAge] = useState(18) // useState 返回一个数组，第一个元素是状态值，第二个元素是更新状态的函数

  useEffect(() => {
    console.log('useEffect')
    let timer = setInterval(() => {
      console.log(num)
    }, 1000)

    return () => {
      console.log('卸载组件')
      clearInterval(timer) // 清除定时器
    }

  }, [num]) // useEffect 的第二个参数是依赖数组，只有当依赖数组中的值发生变化时，才会执行 useEffect 中的函数

  return (
    <div>
      <button onClick={(pre) => setNum(pre + 1)}>{num}</button>
      <h2 onClick={() => setAge(age + 1)}>{age}</h2>
    </div>
  )
}

export default App