import type { PropsWithChildren } from 'react'

export interface CommonComponentProps extends PropsWithChildren {
  id: number
  name: string
  [key: string]: any // 允许其他属性

}