import { useRef } from 'react'
import useHijack from './useHijack'

/**
 * 路由拦截组件。自动劫持其中 a 节点的点击事件，如果 href 是完整的 url，并且不在新窗口中打开，则强制刷新当前页面。以此来避免路由冲突。
 * 原因是，当子模块跳转到一个父模块无法处理的路由时，可能会导致父模块报错。此时，重新加载整个页面，来加载新的 HTML 内容。
 * @param props
 * @returns
 *
 * ## 用法
 * ```jsx
 * <Hijack>
 *   {...}
 * </Hijack>
 * ```
 *
 * ## 示例
 * ```jsx
 * <Hijack>
 *   <a href=''>Next</a>
 * </Hijack>
 * ```
 */
export default function Hijack ({ children, ...others }) {
  const wrapper = useRef<any>(null)
  useHijack(wrapper)
  return <div className='hijack' ref={wrapper} {...others}>
    {children}
  </div>
}
