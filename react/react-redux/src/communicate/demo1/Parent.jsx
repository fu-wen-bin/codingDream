import React, { useRef, useState } from 'react'
import Child from './Child'

function Parent () {
  const [list, setList] = useState(['html', 'css', 'js'])
  const inputRef = useRef(null)
  const handler = () => {
    setList([...list, inputRef.current.value])
  }

  return (
    <div>
      <div className="hd">
        <input type="text" ref={inputRef}/>
        <button onClick={handler}>确认</button>
      </div>
      <Child list={list}/>
    </div>
  )
}

export default Parent