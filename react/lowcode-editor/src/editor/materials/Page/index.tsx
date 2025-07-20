import type { CommonComponentProps } from '../../interface.ts'
import useMaterialDrop from '../../hooks/useMaterialDrop.ts'
/*import { useDrop } from 'react-dnd'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'
import { message } from 'antd'*/

export default function Page ({ id, children }: CommonComponentProps) {

  /*const [messageApi, contextHolder] = message.useMessage()
  const { addComponent } = useComponentsStore() // 获取添加组件的函数
  const { componentConfig } = useComponentConfigStore() // 获取组件配置*/

  /*const [{ canDrop }, dropRef] = useDrop(() => ({
      accept: ['Button', 'Container', 'Page'],
      drop: (item: { type: string }, monitor) => {
        const didDrop = monitor.didDrop() // 是否被动冒泡接收组件
        if (didDrop) {
          return
        }
        messageApi.success(item.type + ' dropped!')
        // 将拖动的组件添加到json对象中
        const props = componentConfig?.[item.type]?.defaultProps || {}
        addComponent({
          id: new Date().getTime(), // 使用当前时间戳作为唯一ID
          name: item.type, // 拖动的组件类型
          props: props, // 组件的属性可以根据需要设置
        }, id)
      },
      collect: (monitor) => { // 接收组件的区域
        return {
          canDrop: monitor.canDrop(),
        }
      },
    }),
  )*/

  const { canDrop, dropRef, contextHolder } = useMaterialDrop(
    ['Button', 'Container'], id)

  return (
    <>
      {contextHolder}
      <div ref={dropRef}
           data-component-id={id}
           className="p-[20px] h-[100%] box-border"
           style={{
             background: canDrop ? 'rgba(83, 107, 127, 0.2)' : '',
           }}>
        {children}
      </div>
    </>
  )
}