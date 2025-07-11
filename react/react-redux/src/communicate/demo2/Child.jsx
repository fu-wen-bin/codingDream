import React, { useRef } from 'react'

function Child ({ setList }) {
  const inputRef = useRef(null)

  const handler = () => {
    // 将input中的值添加到父组件的list中
    setList((preList) => {
      return [...preList, inputRef.current.value]
    })
  }

  return (
    <div>
      <div className="hd">
        <input type="text" ref={inputRef}/>
        <button onClick={handler}>确认</button>
      </div>
    </div>
  )
}

export default Child