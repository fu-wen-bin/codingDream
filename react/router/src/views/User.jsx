import { useSearchParams } from 'react-router-dom'

function User () {
  const [params] = useSearchParams()
  return (
    <div>
      <h4>用户页面 -- {params.get('id')}</h4>
    </div>
  )
}

export default User