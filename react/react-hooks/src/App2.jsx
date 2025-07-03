import { useEffect, useLayoutEffect, useState } from 'react'

async function queryData () {
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(666)
    }, 2000)
  })
  return data
}

function App2 () {
  const [num, setNum] = useState(1)
  // useLayoutEffect 在 DOM 更新之前执行，适用于需要在 DOM 更新前进行测量或修改的场景
  // useLayoutEffect 会阻塞浏览器的绘制，直到所有的 DOM 更新完成
  // useEffect 在 DOM 更新之后执行，适用于不需要立即测量或修改 DOM 的场景
  useLayoutEffect(() => {
    console.log('useEffect')

    setNum(2)
  }, [])

  return (
    <div>
      <button onClick={() => setNum(num + 1)}>{num}</button>
    </div>
  )
}

export default App2