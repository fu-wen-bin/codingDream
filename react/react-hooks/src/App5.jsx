import { createContext, useContext } from 'react'

function Child1 (props) {
  return (
    <div>
      <h2>子组件--{props.data}</h2>
      <Child2/>
    </div>
  )
}

function Child2 (props) {
  const count = useContext(numContext) // 使用 useContext 获取上下文对象的值
  return (
    <div>
      <h3>孙子组件---{props.data}</h3>
    </div>
  )
}

const numContext = createContext() // 创建一个上下文对象
function App5 () {

  const num = 100
  return (
    <div>
      <numContext.Provider value={num}>
        <h1>父组件</h1>
        <Child1/>
      </numContext.Provider>
    </div>
  )
}

export default App5