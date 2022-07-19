import dynamicModuleFederation from './dynamicModuleFederation'
import loadRemoteScript from './loadRemoteScript'
import parseRemoteCDNUrl from './parseRemoteCDNUrl'
import { IRemoteProps, IMFProps } from '../types/index'

/**
 * 解析 MF 参数。
 * @param props IMFProps
 * @returns IMFProps
 */
export function parseRemoteProps (
  { remote, library, version, ...others } : IMFProps
) : IMFProps {
  // { library, version } => CDN remote.js
  if (!remote && library && version) {
    remote = `https://g.alicdn.com/mmfs/${library}/${version}/remote.js`
  }
  // CDN remote.js => { library, version }
  if (remote && (!library || !version)) {
    const parts = parseRemoteCDNUrl(remote)
    if (!library) library = parts.repository
    if (!version) version = parts.version
  }

  return { remote, library, version, ...others }
}

/**
 * 检测 MF 参数是否完整。
 * @param remote
 * @param library
 * @param version
 * @param module
 */
export function checkRemoteProps (remote: string, library: string, version: string, module: string) {
  const errors = []
  if (!remote) {
    const message = '[MF] 缺少 remote 文件'
    console.warn(message)
    errors.push(message)
  }
  if (!library) {
    const message = '[MF] 缺少 library 配置'
    console.warn(message)
    errors.push(message)
  }
  if (!version) {
    const message = '[MF] 缺少 version 配置'
    console.warn(message)
    errors.push(message)
  }
  if (!module) {
    const message = '[MF] 缺少 module 配置'
    console.warn(message)
    errors.push(message)
  }
  if (errors.length) throw errors
}

/**
 * 加载远程 Module Federation 模块，并且只会加载一次。
 * @param props IRemoteProps
 * @param props.remote
 * @param props.library
 * @param props.version
 * @param props.module
 * @returns
 *
 * ## 用法
 *
 * ```jsx
 * import { loadRemoteModule } from 'thx-portal'
 * await loadRemoteModule({ remote, module })
 * await loadRemoteModule({ library, version, module  })
 * ```
 *
 * ## 示例
 *
 * ```jsx
 * const { default: TopOpenUnionApp } = await loadRemoteModule({
 *   remote: 'https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js',
 *   module: 'components/TopOpenUnionApp'
 * })
 * ```
 */
export default async function loadRemoteModule (props: IRemoteProps): Promise<{ default: any }> {
  const { remote, library, version, module } = parseRemoteProps(props)
  checkRemoteProps(remote, library, version, module)

  await loadRemoteScript(remote)

  const Module = await dynamicModuleFederation({ library, version, module })
  if (!Module) {
    throw new Error(`[MF] [useRemoteModule] cannot find module ${module} in ${remote}`)
  }
  return Module
}
