import React from 'react'

function Child (props) {
  const { list } = props
  return (
    <div>
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

export default Child