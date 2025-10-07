import { useState } from 'react'

export default function App2 () {
  const [count, setCount] = useState(0)

  if (count > 0) {
    const [num, setNum] = useState(10)
  }

  const [age, setAge] = useState(18)

  return (
    <div onClick={() => setCount(count + 1)}>App2 - {count}</div>
  )
}
