import React, { useState } from 'react'
import Child from './Child'

function Parent () {
  const [list, setList] = useState(['html', 'css', 'js'])

  return (
    <div>
      <Child setList={setList}/>
      <div className="bd">
        <ul>
          {
            list.map((item, index) => {
              return (
                <li key={index}>
                  {item}
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default Parent