import { createContext, useContext, useState } from 'react'

const myContext = createContext()

function B () { // 孙子组件
  const msg = useContext(myContext) // 获取父组件传递的值
  return (
    <div>
      <h3>Component B --{msg}</h3>
    </div>
  )
}

function A () { // 子组件
  const msg = useContext(myContext) // 获取父组件传递的值
  return (
    <div>
      <h1>Component A --{msg}</h1>
      <B/>
    </div>
  )
}

function Index () { // 父组件
  const [msg, setMsg] = useState('Hello from Grandparents')
  return (
    <div>
      <myContext.Provider value={msg}>
        <A/>
      </myContext.Provider>
    </div>
  )
}

export default Index