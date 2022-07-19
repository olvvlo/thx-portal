import { useState, useEffect, ComponentType, Context, createContext } from 'react'
import dynamicModuleFederation from './dynamicModuleFederation'
import useRemoteScript from './useRemoteScript'
import { parseRemoteProps, checkRemoteProps } from './loadRemoteModule'
import { IRemoteProps } from '../types/index'

interface IRemoteModule<T> {
  default: T;
  [key: string]: any
}

// fallback () => {}
// fallback () => <div />

/**
 * 手动加载远程模块。
 * @param props IRemoteProps & { fallback?: any }
 * @returns { loading, Module }
 *
 * ## 用法
 * ```jsx
 * import { useRemoteModule } from 'thx-portal'
 * userRemoteModule({ remote, module })
 * userRemoteModule({ library, version, module })
 * ```
 *
 * ## 示例
 * ```jsx
 * function Example () {}
 *   const { loading, Module: { default: CalleeTeacherList } } = useRemoteModule<ComponentType>({
 *     remote: 'https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js',
 *     module: 'pages/teacher/list'
 *   })
 *   if (loading) return <div>loading...</div>
 *   return <CalleeTeacherList />
 * }
 * ```
 *
 */
export default function useRemoteModule<T = ComponentType | Function | Context<any>> (
  props: IRemoteProps & { fallback?: any }
): { loading: boolean, Module: IRemoteModule<T> } {
  const { remote, module, library, version, fallback } = parseRemoteProps(props)
  checkRemoteProps(remote, library, version, module)

  const [loading, setLoading] = useState(true)

  const { error, ready } = useRemoteScript(remote)
  if (error) throw error

  const [Module, setModule] = useState<any>({ default: fallback })
  useEffect(() => {
    if (!ready) return
    async function doit () {
      const Module = await dynamicModuleFederation({ library, version, module })
      if (!Module) {
        throw new Error(`[MF] [useRemoteModule] cannot find module ${module} in ${remote}`)
      }
      setModule(Module)
      setLoading(false)
    }
    doit()
  }, [ready])

  return { loading, Module }
}

/**
 * 手动加载远程模块（组件）。
 * @param props IRemoteProps
 * @returns
 */
export function useRemoteComponentModule (
  { remote, module, library, version }: IRemoteProps
): { loading: boolean, Module: IRemoteModule<ComponentType> } {
  const { loading, Module } = useRemoteModule<ComponentType>({
    remote,
    module,
    library,
    version,
    fallback () { return <div /> }
  })
  return { loading, Module }
}

/**
 * 手动加载远程模块（Hook）。
 * @param props IRemoteProps
 * @returns
 */
export function useRemoteHookModule (
  { remote, module, library, version }: IRemoteProps
): { loading: boolean, Module: IRemoteModule<Function> } {
  const { loading, Module } = useRemoteModule<Function>({
    remote,
    module,
    library,
    version,
    fallback () { return {} }
  })
  return { loading, Module }
}

/**
 * 手动加载远程模块（Context）。
 * @param props IRemoteProps
 * @returns
 */
export function useRemoteContextModule (
  { remote, module, library, version }: IRemoteProps
): { loading: boolean, Module: IRemoteModule<Context<any>> } {
  const { loading, Module } = useRemoteModule<Context<any>>({
    remote,
    module,
    library,
    version,
    fallback () { return createContext({}) }
  })
  return { loading, Module }
}
