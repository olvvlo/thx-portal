/* eslint-disable no-use-before-define */
import { ReactNode } from 'react'
import { Container } from 'react-dom'

export interface IRemoteProps {
  /** 字符串。可选。Webpack 构建的 remote.js 文件地址，由 MM CLI 自动生成。 */
  remote?: string;
  /** 字符串。可选。应用名称，通常为仓库 package.json 中的 name。 */
  library?: string;
  /** 字符串。可选。应用版本，通用为仓库 package.json 中的 version。 */
  version?: string;
  /** 字符串。必选。模块 ID，通常为 Webpack 构建入口配置 entry 中的 key。 */
  module: string;
}

export interface IComponentBoundary {
  children?: any;
  fallback?: ReactNode;
  /** @deprecated => ErrorBounday */
  errorComponent?: ReactNode;
}

/** 模块类型 */
export enum IMountType {
  MF = 'MF',
  MAGIX = 'MAGIX',
  MHUB = 'MHUB',
  IFRAME = 'IFRAME',
}

export interface IMFProps extends IComponentBoundary, IRemoteProps {
  [key: string]: any;
}

export interface IMagixProps extends IComponentBoundary {
  [key: string]: any;
}

export interface IMHubProps extends IComponentBoundary {
  /** Magix 应用的入口模块。 */
  entry: string;
  /** Magix 应用的全局变量（可选），用于获取 UMD 模块。 */
  library?: string;
  /** Magix View 路径，例如 app/gallery/mx-footer/index。 */
  view?: string;
  /** 是否自动拦截 a 链接的点击跳转，由基座应用负责路由的切换、渲染。 */
  hijack?: boolean;
  /** 其他属性，传给指定的 Magix View。 */
  [key: string]: any;
}

export interface IIframeProps extends IComponentBoundary {
  /** 字符串。必选。目标页面的地址。 */
  src: string;
  [key: string]: any;
}

type IModuleProps = IMFProps | IMagixProps | IMHubProps | IIframeProps;
export type IModuleContainerProps = {
    type: IMountType | 'MF' | 'MAGIX' | 'MHUB' | 'IFRAME';
} & IModuleProps;

export type IPageContainerProps = IModuleContainerProps;

// ==========================
// ========== MHub ==========
// ==========================

/** 工厂函数 CalleeFactoryForReact() 返回的被调方实例。 */
export interface ICalleeInstance {
  /** 在指定节点 container 上渲染组件，完成后执行回调函数 callback。 */
  mount: (
    /** 必选。渲染容器。 */
    container: Container,
    /** 可选。传递给组件的属性集。 */
    props?: {
      replacement?: any,
      [key: string]: any
    },
    /** 可选。渲染完成之后的回调函数。 */
    callback?: () => void
  ) => void;
  /** 在指定节点 container 上卸载组件，完成后执行回调函数 callback。 */
  unmount: (
    /** 必选。渲染容器。 */
    container: Container,
    /** 可选。卸载完成之后的回调函数。 */
    callback?: () => void
  ) => void
}
/**
 * 工厂函数 Caller() 返回的调用方实例。
 * @deprecated 废弃
 */
export interface ICallerInstance {
  /** 在指定节点 container 上渲染组件，完成后执行回调函数 callback。 */
  mount: (
    /** 必选。渲染容器。 */
    container: Container,
    /** 可选。传递给组件的属性集。 */
    props?: {
      [key: string]: any
    },
    /** 可选。渲染完成之后的回调函数。 */
    callback?: () => void
  ) => void;
  /** 在指定节点 container 上卸载组件，完成后执行回调函数 callback。 */
  unmount: (
    /** 必选。渲染容器。 */
    container: Container,
    /** 可选。卸载完成之后的回调函数。 */
    callback?: () => void
  ) => void
}
