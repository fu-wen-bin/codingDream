import { memo, useMemo, useRef, useState } from 'react'

export default function Hello () {
  const [count, setCount] = useState(0)
  // useState 也会缓存 obj 对象的引用地址
  const [obj, setObj] = useState({
    name: 'tom',
    age: 18,
  })
  let obj2 = useRef({
    name: 'tom',
    age: 18,
  })

  return (
    <div>
      <div>Hello</div>
      <button onClick={() => setCount(count + 1)}>当前计数：{count}</button>
      <Child obj2={obj2.current}/>
    </div>
  )
}

// memo 是一个高阶组件，作用是将函数组件的 vDom 进行缓存
// 当父组件重新渲染时，先比较传递给子组件的 props 是否发生变化
// 如果没有变化，则不会重新渲染子组件，直接使用上一次缓存的 vDom
const Child = memo(function ({ count, obj2 }) { // 已经将 Child 组件的vDom缓存起来了
  const doubleAge = obj2.age * 2
  console.log('Child 组件渲染了')
  const doublecount = useMemo(() => {
    return count * 2
  }, [count])
  console.log(doubleAge)
  return (
    <div>
      <h1>Child -- age:{obj2.age}</h1>
      <h2>{doublecount}</h2>
    </div>
  )
})