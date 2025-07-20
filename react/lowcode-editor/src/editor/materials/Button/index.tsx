import { Button as AntdButton } from 'antd'
import type { CommonComponentProps } from '../../interface.ts'

export default function Button ({ id, type, text }: CommonComponentProps) {
  return (
    <AntdButton type={type} data-component-id={id}>{text}</AntdButton>
  )
}