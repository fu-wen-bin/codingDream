import { useEffect } from 'react'

export default function App () {
  useEffect(() => {
    fetch('example')
      .then(res => res.json())
      .then(res => console.log(res))
  }, [])
  return (
    <div>
      App
    </div>
  )
}