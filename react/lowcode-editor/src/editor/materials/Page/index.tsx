import type { CommonComponentProps } from '../../interface.ts'
import { useDrop } from 'react-dnd' // 可以接收拖动的组件
import { message } from 'antd'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'

export default function Page ({ id, name, children }: CommonComponentProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const { addComponent } = useComponentsStore() // 获取添加组件的函数
  const { componentConfig } = useComponentConfigStore() // 获取组件配置

  const [{ canDrop }, dropRef] = useDrop(() => ({
      accept: ['Button', 'Container', 'Page'],
      drop: (item: { type: string }) => {
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
  )
  return (
    <>
      {contextHolder}
      <div ref={dropRef}
           className="p-[20px] h-[100%] box-border"
           style={{
             background: canDrop ? 'rgba(83, 107, 127, 0.2)' : '',
           }}>
        {children}
      </div>
    </>
  )
}