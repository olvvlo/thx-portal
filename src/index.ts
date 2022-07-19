// import './wdyr'

// 加载资源
export { default as loadRemoteScript } from './MF/loadRemoteScript'
export { default as loadRemoteStyle } from './MF/loadRemoteStyle'

// Webpack Module Federation
export { MemoedMF as MF } from './MF/index'
export { default as dynamicModuleFederation } from './MF/dynamicModuleFederation'
export { default as useRemoteScript } from './MF/useRemoteScript'
export { default as loadRemoteModule } from './MF/loadRemoteModule'
export { default as useRemoteModule, useRemoteComponentModule, useRemoteHookModule, useRemoteContextModule } from './MF/useRemoteModule'
export { default as parseRemoteCDNUrl } from './MF/parseRemoteCDNUrl'

// 兜底工具
export { default as Iframe } from './Iframe/index'

// 路由拦截工具
export { default as Hijack } from './Hijack/index'
export { default as useHijack } from './Hijack/useHijack'

export { default as ModuleContainer } from './ModuleContainer/index'

export * from './types/index'
