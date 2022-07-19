import React from 'react'
import { MemoedMF as MF } from '../MF/index'
import Iframe from '../Iframe/index'
import { IMountType, IModuleContainerProps } from '../types/index'

/**
 * 渲染远程模块，支持 [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/)、iframe。
 * @param props IModuleContainerProps
 * @param props.type IMountType
 * @returns
 *
 * ## 用法
 * 适合用于配置化集成场景。
 *
 * ## 示例
 * 示例 1：模块邦联。
 * ```jsx
 * import React from 'react'
 * import { ModuleContainer, IMountType } from 'thx-portal'

 * ReactDOM.render(
 *   <ModuleContainer type={IMountType.MF}
 *     remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
 *     module='components/TopOpenUnionApp'
 *   />,
 *   document.getElmentById('root')
 * )
 * ```
 *
 * 示例 2：兜底方案，通过 iframe 挂载。
 * ```jsx
 * import React from 'react'
 * import { ModuleContainer, IMountType } from 'thx-portal'
 *
 * ReactDOM.render(
 *   <ModuleContainer type={IMountType.IFRAME}
 *     src='https://pub.alimama.com/'
 *   />,
 *   document.getElmentById('root')
 * )
 * ```
 */
export default function ModuleContainer ({ type, ...others }: IModuleContainerProps) {
  switch (type) {
    case IMountType.MF:
      const { remote, module, ...others1 } = others
      return <MF remote={remote} module={module} {...others1} />
    case IMountType.IFRAME:
      const { src, ...others2 } = others
      return <Iframe src={src} {...others2} />
    default:
      throw new Error(`未知的挂载方式 ${type}`)
  }
}
