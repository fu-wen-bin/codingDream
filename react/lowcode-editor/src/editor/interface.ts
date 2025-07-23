import type { CSSProperties, PropsWithChildren } from 'react'

export interface CommonComponentProps extends PropsWithChildren {
  id: number
  name: string
  styles?:CSSProperties // 组件样式
  [key: string]: any // 允许其他属性

}