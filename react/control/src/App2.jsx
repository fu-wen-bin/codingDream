import React from 'react'

function App2 () {

  const [value, setValue] = React.useState('hello')

  function onChange (event) {
    console.log(event.target.value)
    setValue(event.target.value.toUpperCase())
  }

  return (
    <input type="text" value={value} onChange={onChange}/>
  )
}

export default App2