/* global HTMLElement, MouseEvent */
import { useEffect, MutableRefObject } from 'react'
import { useHistory } from 'react-router-dom'

// 劫持 a 的点击事件
// 如果 href 是完整的 url，并且不在新窗口中打开，则强制刷新当前页面。
export default function useHijack (ref: MutableRefObject<HTMLElement>) {
  const history = useHistory()
  useEffect(() => {
    const hijack = (event: MouseEvent) => {
      let currentTarget: any = event.target
      while (currentTarget && currentTarget !== ref.current) {
        const { nodeName, href, target } = currentTarget
        if (nodeName && nodeName.toLowerCase() === 'a') {
          if (target !== '_blank' && /^https?/.test(href)) {
            event.preventDefault()
            // TODO 跳转是否合理
            const nextPath = new URL(href).pathname
            console.warn('[hijack]', href, '=>', nextPath)
            history.push(nextPath)
          }
          break
        }

        currentTarget = currentTarget.parentNode
      }
    }

    ref.current.addEventListener('click', hijack, false)
    return () => ref.current.removeEventListener('click', hijack, false)
  }, [ref, history])
}

export function useHijackWithJQuery (ref: MutableRefObject<HTMLElement>) {
  const history = useHistory()
  useEffect(() => {
    const hijack = (event) => {
      const { currentTarget: { href, target } } = event
      if (/^https?/.test(href)) {
        if (target !== '_blank') {
          event.preventDefault()
          history.push(new URL(href).pathname)
        }
      }
    }
    if (!window['$']) {
      console.warn('[useHijack] window.$', window['$'])
      return
    }
    const $current = window['$'](ref.current)
    $current.on('click.hijack', 'a', hijack)
    return () => $current.off('click.hijack', 'a', hijack)
  }, [ref, history])
}
