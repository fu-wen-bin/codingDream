import type { CommonComponentProps } from '../../interface'
import useMaterialDrop from '../../hooks/useMaterialDrop'
/*import { useDrop } from 'react-dnd'
import { useComponentsStore } from '../../stores/components'
import { useComponentConfigStore } from '../../stores/component-config'*/

export default function Container ({
                                     children,
                                     id,
                                     styles,
                                   }: CommonComponentProps) {
  /*const { addComponent } = useComponentsStore()
  const { componentConfig } = useComponentConfigStore()*/
  // 能接收拖拽进来的组件
  /*const [{ canDrop }, dropRef] = useDrop(() => {
    return {
      accept: ['Button', 'Container', 'Page'],
      drop: (item: { type: string }, monitor) => {
        const didDrop = monitor.didDrop() // 是否被动冒泡接收组件
        if (didDrop) {
          return
        }
        const props = componentConfig?.[item.type]?.defaultProps || {}
        addComponent({
          id: new Date().getTime(),
          name: item.type,
          props: props,
        }, id)
      },
      collect: (monitor) => { // 接收组件的区域
        return {
          canDrop: monitor.canDrop(),
        }
      },
    }
  })*/

  const { canDrop, dropRef, contextHolder } = useMaterialDrop(
    ['Button', 'Container'], id)

  return (
    <>
      {contextHolder}
      <div
        data-component-id={id}
        ref={dropRef as any}
        className={`
          min-h-[100px] 
          p-[20px] 
          ${canDrop
          ? 'border-[2px] border-[blue]'
          : 'border-[1px] border-[#000]'}
        `}
        style={styles}
      >
        {children}
      </div>
    </>
  )
}