import { Button as AntdButton } from 'antd'
import type { CommonComponentProps } from '../../interface.ts'

export default function Button ({ id, type, text, styles }
                                : CommonComponentProps) {

  return (
    <AntdButton type={type} data-component-id={id}
                style={styles}>{text}</AntdButton>
  )
}