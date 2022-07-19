import React from 'react'
import { IIframeProps } from '../types/index'

/**
 * 兜底挂载方案。
 * @param props IIframeProps
 * @returns
 *
 * ## 用法
 * ```jsx
 * <Iframe src='...' />
 * ```
 *
 * ## 示例
 * ```jsx
 * <Iframe src='https://pub.alimama.com/' />
 * ```
 */
function Iframe ({ src, ...others }: IIframeProps) {
  return (
    <iframe
      title={src}
      src={src}
      frameBorder='0'
      width='100%'
      style={{ minHeight: 'inherit' }}
      {...others}
    />
  )
}

export default Iframe
