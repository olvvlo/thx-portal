/* eslint-disable no-use-before-define */

import { ReactNode } from 'react'

export interface IDynamicFederationOptions {
  scope?: string;
  module: string;
  [key: string]: string;
}
// MF 实例
export interface IDynamicFederationContainer {
  init: Function;
  get: Function;
}

export interface ILoadComponentOptions {
  // 页面项目名
  library: string;
  // 页面版本号
  version: string;
  // 页面挂载 js模块 id
  module: string;
}

export type ILoadComponentReturn = () => Promise<{
  default: any
}>

export type ISyncModuleList = Array<ISyncModule>

/**
 * 单个同步模块的协议
 */
export interface ISyncModule extends IInitSyncMFMoudle {
  // 外部依赖的 地址
  remote: string;
}

/**
 * InitSyncMFMoudle 的入参协议
 */
export interface IInitSyncMFMoudle {
  // 外部依赖的 scope
  name: string;
  // 外部依赖的 版本号
  version: string;
  // 外部依赖的 js bundle
  module: string[]
}

// MF 组件的 Props
export interface MFProps extends ILoadComponentOptions {
  url: string;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  sync?: ISyncModuleList;
}

/**
 * webpack 的 remotes 范式
 * 保持和 webpack5 module feberation remotes 一样的配置
 * 便于快速启动和降低学习成本
 */
export type IPortalWebpackRemotesConfig = {
  [index: string]: string
}

export type IPortalRemotesConfig = Array<{
  name: string;
  // 本地地址
  local: string;
  // 远程地址
  remote: string;
}>

export type IPortalRemotes = IPortalWebpackRemotesConfig | IPortalRemotesConfig

/**
 * 入口文件的配置
 */
export interface IEntryObject {
  local: string;
  remote: string;
}

export type IPortalEntry = string | IEntryObject

export type IRemoteModule = string[]

export interface IPortalWebpackOptions {
  remoteModule?: IRemoteModule;
  entry: IPortalEntry;
  mhub?: {
    paths?: any;
    alias?: any
  }
}

export type IRemoteList = Array<{
  name: string;
  src: string;
  sync?: Array<string>

}>
