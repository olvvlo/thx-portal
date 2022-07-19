import React, { lazy, Suspense, useEffect, useState } from 'react'
import useRemoteScript from './useRemoteScript'
import factory from './factory'
import { IMFProps } from '../types/index'
import { parseRemoteProps } from './loadRemoteModule'

function ErrorMessage ({ message }) {
  return <div style={{ color: 'var(--color-error-3)' }}>
    {message}
  </div>
}

/**
 * 检测 MF 参数是否完整。
 * @param remote
 * @param library
 * @param version
 * @returns
 */
function checkRemoteProps (remote: string, library: string, version: string) {
  const errors = []
  if (!remote) {
    const message = '[MF] 缺少 remote 文件'
    console.warn(message)
    errors.push(<ErrorMessage key={message} message={message} />)
  }
  if (!library) {
    const message = '[MF] 缺少 library 配置'
    console.warn(message)
    errors.push(<ErrorMessage key={message} message={message} />)
  }
  if (!version) {
    const message = '[MF] 缺少 version 配置'
    console.warn(message)
    errors.push(<ErrorMessage key={message} message={message} />)
  }
  if (errors.length) return errors
}

/**
 * React 组件，挂载远程 React 模块。用于 React 应用之间相互共享模块。
 * @param props
 * @param props.remote 字符串。可选。Webpack 构建的 remote.js 文件地址，由 MM CLI 自动生成。
 * @param props.library 字符串。可选。应用名称，通常为仓库 package.json 中的 name。
 * @param props.version 字符串。可选。应用版本，通用为仓库 package.json 中的 version。
 * @param props.module 字符串。必选。模块 ID，通常为 Webpack 构建入口配置 entry 中的 key。
 * @param props.fallback ReactNode。可选。加载完成之前，先渲染 fallback；完成之后，渲染模块。
 * @param props.* 其他属性，将透传给远程模块。
 * @returns
 *
 * ## 示例：MF
 * 示例 1：传入 remote、module 即可，内部基于 remote 自动解析出 library、version。
 * ```jsx
 * function Example1 () {
 *   return <>
 *     <MF
 *       remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
 *       module='components/TopOpenUnionApp'
 *     />
 *   </>
 * }
 * // library: mm-portal-playground-callee
 * // version: 20210709.2200.1234
 * ```
 *
 * 示例 2：传入 library、version、module 即可，内部基于 library、version 自动计算出 remote 地址。
 * 计算规则为：https://g.alicdn.com/mmfs/${library}/${version}/remote.js。
 * ```jsx
 * function Example2 () {
 *   return <>
 *     <MF
 *       library='mm-portal-playground-callee'
 *       version='20210709.2200.1234'
 *       module='components/TopOpenUnionApp'
 *     />
 *   </>
 * }
 * // remote: https://g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js
 * ```
 *
 * 示例 3：支持嵌套挂载。
 * ```jsx
 * function Example3 () {
 *   return <>
 *     <MF
 *       remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
 *       module='components/ErrorBoundary'
 *     >
 *       <MF
 *         remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
 *         module='components/Empty'
 *       />
 *     </MF>
 *   </>
 * }
 * ```
 *
 * 示例 4：支持挂载非 export default 组件。
 * ```jsx
 * import { MF, useRemoteModule } from 'thx-portal'
 * function Example4 () {
 *   const { loading, Module: Components } = useRemoteModule({
 *     remote: 'https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js',
 *     module: 'components/index'
 *   })
 *   if (loading) return <div>loading...</div>
 *   return <Components.TopOpenUnionApp />
 * }
 * ```
 *
 * 示例 5：实际使用中，可以对 `<MF>` 再次简单封装为 `<CalleeMF>`，内置 `remote`，只需要传入 `module`。
 * ```jsx
 * function CalleeMF ({ module, ...others }) {
 *   return <MF
 *     remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
 *     module={module}
 *     {...others}
 *   />
 * }
 * function Example5 () {
 *   return <CalleeMF module='pages/teacher/list' />
 * }
 * function CalleeMF ({ module, ...others }) {
 *   return <MF
 *     remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
 *     module={module}
 *     {...others}
 *   />
 * }
 * function Example5 () {
 *   return <CalleeMF module='pages/teacher/list' />
 * }
 * ```
 *
 * ## 示例：MF + 路由
 *
 * 示例 6：实际使用中，可以对 `<MF>`  再次简单封装为 `<CalleeRoute>` ，内置 `remote`，简化路由配置参数。
 * ```jsx
 * import { Route, Switch } from 'react-router-dom'
 *
 * function CalleeRoute ({ path, module, ...extra }) {
 *   return <Route exact path={path}>
 *     <MF
 *       remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
 *       module={module}
 *       {...extra}
 *     />
 *   </Route>
 * }
 *
 * function Example6 () {
 *   return <Switch>
 *     <CalleeRoute path='/pages/teacher/list' module='/pages/teacher/list' />
 *     <Route>404</Route>
 *   </Switch>
 * }
 * ```
 *
 * 示例 7：生产环境中，可基于 `<CalleeRoute>`  设置批量灰度路由，来实现渐进式的微前端升级。
 * ```jsx
 * import { Route, Switch } from 'react-router-dom'
 *
 * function Example7 () {
 *   return <Switch>
 *     <Route path='/mf'>
 *       <Switch>
 *         <CalleeRoute path='/mf/pages/teacher/list' module='/pages/teacher/list' />
 *         <Route>404</Route>
 *       </Switch>
 *     </Route>
 *     <Route>404</Route>
 *   </Switch>
 * }
 * ```
 *
 * 示例 8：生产环境中，还可以封装一个通用的动态路由组件 `<DynamicCalleeRoute>`，来挂载三方组件，可以快速使整站微前端化。
 * ```jsx
 * import { useLocation } from 'react-router-dom'
 *
 * function DynamicCalleeRoute ({ ...extra }) {
 *   const { pathname } = useLocation()
 *   return <Route exact path={pathname}>
 *     <CalleeMF module='components/ErrorBoundary'>
 *       <CalleeMF module={pathname} {...extra} />
 *     </CalleeMF>
 *   </Route>
 * }
 * function Example8 () {
 *   return <DynamicCalleeRoute />
 * }
 * ```
 */
export default function MF (props: IMFProps): any {
  const { remote, library, version, module, fallback = 'loading...', errorComponent, ...others } = parseRemoteProps(props)
  const propsErrors = checkRemoteProps(remote, library, version)

  /**
   * 修复 MF 父组件刷新时（如：setState），MF 会重新生成一个新的组件实例，导致内部状态丢失。
   * https://github.com/module-federation/module-federation-examples/blob/master/advanced-api/dynamic-remotes/app1/src/App.js#L78
   */
  const [RemoteComponent, setRemoteComponent] = useState(null)
  useEffect(() => {
    const RemoteComponent = lazy(
      factory({ library, version, module })
    )
    setRemoteComponent(RemoteComponent)
  }, [library, version, module])

  const { loading, error, ready } = useRemoteScript(remote)
  if (propsErrors) return propsErrors

  if (error) {
    // throw error // 交由 ErrorBoundary 兜底
    return <ErrorMessage message={errorComponent || error.message} />
  }
  if (loading || !ready) return fallback
  if (!RemoteComponent) return fallback

  return (
    <Suspense fallback={fallback}>
      <RemoteComponent {...others} />
    </Suspense>
  )
}

function KeyedMF (props: IMFProps) {
  return <MF key={props.remote} {...props} />
}

/**
 * 优化后的 <MF>，忽略 fallback 的变化，以减少重复渲染。
 */
export const MemoedMF = React.memo(KeyedMF, (prevProps, nextProps) => {
  const ranges = [...Object.keys(prevProps), ...Object.keys(nextProps)]
  return ranges.every((key) => {
    // 忽略 fallback，减少重复渲染
    if (key === 'fallback') return true
    return prevProps[key] === nextProps[key]
  })
})
