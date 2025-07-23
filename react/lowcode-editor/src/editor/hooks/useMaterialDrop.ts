import { useDrop } from 'react-dnd'
import { message } from 'antd'
import { useComponentsStore } from '../stores/components.tsx'
import { useComponentConfigStore } from '../stores/component-config.tsx'

export default function useMaterialDrop (accept: string[], id: number) {

  const [messageApi, contextHolder] = message.useMessage()
  const { addComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()

  const [{ canDrop }, dropRef] = useDrop(() => {
    return {
      accept, // key和value名字一样时可以省略
      drop: (item: { type: string }, monitor) => {
        const didDrop = monitor.didDrop() // 是否被动冒泡接收组件
        if (didDrop) {
          return
        }
        messageApi.success(item.type + ' dropped!')

        const props = componentConfig?.[item.type]?.defaultProps || {}
        const desc = componentConfig?.[item.type]?.desc || ''
        addComponent({
          id: new Date().getTime(),
          name: item.type,
          desc: desc,
          props: props,
          styles:{}
        }, id)
      },

      collect: (monitor) => { // 接收组件的区域
        return {
          canDrop: monitor.canDrop(),
        }
      },
    }

  })

  return { canDrop, dropRef, contextHolder }
}