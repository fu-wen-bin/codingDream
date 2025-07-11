import React, { useRef } from 'react'

function Child1 ({ getData }) {
  const inputRef = useRef(null)

  const handler = () => {
    getData(inputRef.current.value)
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

export default Child1