import useListStore from '../store/index.js'

export default function List () {
  const { data } = useListStore()
  return (
    <div>
      <ul>
        {
          data.map(item => <li key={item}>{item}</li>)
        }
      </ul>
    </div>
  )
}