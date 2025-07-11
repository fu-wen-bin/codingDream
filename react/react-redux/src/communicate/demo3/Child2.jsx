import React, { useEffect, useState } from 'react'

function Child2 ({ data: newData }) {
  const [list, setList] = useState(['html', 'css', 'js'])
  useEffect(()=>{
    if (newData) {
      setList((prevList) => [...prevList, newData])
    }
  },[newData])
  return (
    <div>
      <div className="bd">
        <ul>
          {
            list.map((item) => {
              return <li key={item}>{item}</li>
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default Child2