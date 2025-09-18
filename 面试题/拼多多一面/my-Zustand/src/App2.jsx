import { useEffect, useRef, useState } from 'react'

function usePrevious (value) {
  const oldVal = useRef(value)
  useEffect(() => { // 因为useEffect是异步的，所以在同一个渲染周期内，oldVal不会变化
    oldVal.current = value
  }, [value])
  return oldVal.current
}

export default function App2 () {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  const add = () => {
    setCount(count + 1)
    console.log(prevCount)
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={add}>+1</button>
    </div>
  )
}