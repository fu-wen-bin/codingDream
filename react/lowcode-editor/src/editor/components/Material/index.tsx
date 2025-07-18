import { useMemo } from 'react'
import { useComponentConfigStore } from '../../stores/component-config'
import MeterialItem from '../MaterialItem'

export default function Material () {
  const { componentConfig } = useComponentConfigStore()
  const components = useMemo(() => {
    return Object.values(componentConfig) // [ {xx}, {xx}, {xx} ]
  }, [componentConfig])

  return (
    <div>
      {
        components.map((item, index) => (
          <MeterialItem key={item.name + index} name={item.name}/>
        ))
      }
    </div>
  )
}