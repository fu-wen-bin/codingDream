import { useEffect, useRef } from 'react'

function App4 () {
  const ipt = useRef(null) // 获取DOM结构

  useEffect(() => {
    ipt.current.focus() // 让 input 聚焦
  }, [])

  return (
    <div>
      <input type="text" ref={ipt}/>
    </div>
  )
}

export default App4