import { useDrag } from 'react-dnd'

export interface MaterialItemProps {
  name: string
}

export default function MaterialItem (props: MaterialItemProps) {
  const [_, dragRef] = useDrag(() => ({
      type: props.name,
      item: {  // 被拖动的内容
        type: props.name,
      },
    }),
  )

  return (
    <div ref={dragRef}
         className="p-2 border-b border-dashed border-[1px] border-[#000]
         hover:bg-[#cdc] cursor-crosshair py-[8px] px-[10px] inline-block m-[5px]"
    >
      {props.name}
    </div>
  )
}