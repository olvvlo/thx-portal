/* global __webpack_init_sharing__, __webpack_share_scopes__ */
import parseRemoteScope from './parseRemoteScope'
import parseModuleRelativePath from './parseModuleRelativePath'
import { IDynamicFederationContainer, IDynamicFederationOptions } from '../types/portal'

const MODULE_CACHE = new Map()

// 参考 https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers
export default async function dynamicModuleFederation ({ library, version, scope, module }: IDynamicFederationOptions): Promise<any> {
  if (!scope && library && version) {
    scope = parseRemoteScope(library, version)
  }
  module = parseModuleRelativePath(module)

  // 如果命中缓存，走缓存
  // MO TOOD 需要缓存吗？是否应该缓存 container？
  const cacheKey = `${scope}@${module}`
  if (MODULE_CACHE.has(cacheKey)) return MODULE_CACHE.get(cacheKey)

  // Initializes the shared scope. Fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__('default') // MO TODO 这里是干什么

  // Get the container
  const container: IDynamicFederationContainer = window[scope]
  if (!container) return // MO TODO throw Error()

  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default)
  const factory = await container.get(module)
  const Module = factory()

  MODULE_CACHE.set(cacheKey, Module)
  return Module
}
