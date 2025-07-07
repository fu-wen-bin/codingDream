import { useEffect, useState } from 'react'

async function queryData () {
  const data = await new Promise(resolve => {
    setTimeout(() => {
      resolve(666)
    }, 2000)
  })
  return data
}

function App3 () {
  useEffect(() => {
    queryData().then(data => {
      setNum(data)
    })
  }, [])

  const [num, setNum] = useState('0')
  return (
    <div onClick={() => {
      setNum(pre => pre + 1)
    }}>{num}
    </div>
  )
}

export default App3