import React, { useState } from 'react'
import Child1 from './Child1'
import Child2 from './Child2'

function Parent () {
  const [newData, setNewData] = useState('')
  const getData = (newData) => {
    setNewData(newData)
  }
  return (
    <div>
      <Child1 getData={getData}/>
      <Child2 newData={newData}/>
    </div>
  )
}

export default Parent