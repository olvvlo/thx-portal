# 🧩 API

## 目录
* `<ModuleContainer>`
* `<MF>`
* `<Iframe>`
* `useRemoteModule({ remote?, module, library?, version?, fallback? })`
* `loadRemoteModule({ remote?, module, library?, version? })`
* `<Hijack>`
* `useHijack()`
* `loadRemoteScript(remote)`
* `loadRemoteStyle(remtoe)`

## ModuleContainer

加载并渲染远程模块，支持 Webpack Module Federation、iframe。

### 参数

| 参数名 | 说明 | 必填 | 类型 | 默认值 | 备注 |
| ----- | ---- | ---- | ---- | ---- | ---- |
| type | 模块类型 | 必填 | 字符串 | 无 | `MF`、`IFRAME` |
| 其他 | - | 可选 | 任意 | 无 | 参见 `<MF>`、`<IFrame>` |


### 类型

* Module ModuleContainer

### 用法

适合用于配置化集成场景。例如 基于 ALP 配置页面信息。

### 示例

```jsx
// 示例 1：模块邦联。
import React from 'react'
import { ModuleContainer, IMountType } from 'thx-portal'
​
ReactDOM.render(
  <ModuleContainer type={IMountType.MF}
    remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
    module='components/TopOpenUnionApp'
  />,
  document.getElmentById('root')
)
```

```jsx
// 示例 2：兜底方案，通过 iframe 挂载。
import React from 'react'
import { ModuleContainer, IMountType } from 'thx-portal'
​
ReactDOM.render(
  <ModuleContainer type={IMountType.IFRAME}
    src='https://pub.alimama.com/'
  />,
  document.getElmentById('root')
)
```

## `<MF>`

React 组件，挂载远程 React 模块。用于 React 应用之间相互共享模块。

### 参数

* remote 字符串。可选。Webpack 构建的 remote.js 文件地址，由 MM CLI 自动生成。
* library 字符串。可选。应用名称，通常为仓库 package.json 中的 name。
* version 字符串。可选。应用版本，通用为仓库 package.json 中的 version。
* module 字符串。必选。模块 ID，通常为 Webpack 构建入口配置 entry 中的 key。
* fallback ReactNode。可选。加载完成之前，先渲染 fallback；完成之后，渲染模块。
* 其他属性，将透传给远程模块。

### 类型

* Module MF

### 用法

```jsx
import { MF } from 'thx-portal'
​
<MF remote='...' module='...' />
<MF liebrary='...' version='...' module='...' />
```

### 示例
```jsx
function Example () {
  return <>
    <MF
      remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
      module='components/TopOpenUnionApp'
    />
  </>
}
```

### 参考

* [更多示例]()


## `<Iframe>`

兜底挂载方案。

### 参数

* src 字符串。必选。目标页面的地址。

### 类型

* [Module IFrame]()

### 用法

```jsx
<Iframe src='...' />
```

### 示例

```jsx
<Iframe src='https://pub.alimama.com/' />
```

## useRemoteModule({ remote?, module, library?, version?, fallback? })

手动加载远程模块。

### 参数
* remote 字符串。可选。Webpack 构建的 remote.js 文件地址，由 MM CLI 自动生成。
* library 字符串。可选。应用名称，通常为仓库 package.json 中的 name。
* version 字符串。可选。应用版本，通用为仓库 package.json 中的 version。
* module 字符串。必选。模块 ID，通常为 Webpack 构建入口配置 entry 中的 key。
* fallback React.ComponentType | Function | React.Context<any>>。可选。占位符。

### 用法

```jsx
import { useRemoteModule } from 'thx-portal'
​
userRemoteModule({ remote, module })
userRemoteModule({ library, version, module })
```

### 示例

```jsx
function Example () {}
  const { loading, Module: { default: CalleeTeacherList } } = useRemoteModule<ComponentType>({
    remote: 'https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js',
    module: 'pages/teacher/list'
  })
  if (loading) return <div>loading...</div>
  return <CalleeTeacherList />
}
```

## `loadRemoteModule({ remote?, module, library?, version? })`

加载远程 Module Federation 模块，并且只会加载一次。

### 参数
* remote 字符串。可选。Webpack 构建的 remote.js 文件地址，由 MM CLI 自动生成。
* library 字符串。可选。应用名称，通常为仓库 package.json 中的 name。
* version 字符串。可选。应用版本，通用为仓库 package.json 中的 version。
* module 字符串。必选。模块 ID，通常为 Webpack 构建入口配置 entry 中的 key。

### 用法

```jsx
import { loadRemoteModule } from 'thx-portal'
​
await loadRemoteModule({ remote, module })
await loadRemoteModule({ library, version, module  })
```

### 示例

```jsx
const { default: TopOpenUnionApp } = await loadRemoteModule({
  remote: 'https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js',
  module: 'components/TopOpenUnionApp'
})
```

## `<Hijack>`

路由拦截组件。自动劫持其中 a 节点的点击事件，如果 href 是完整的 url，并且不在新窗口中打开，则强制刷新当前页面。以此来避免路由冲突。

原因是，当子模块跳转到一个父模块无法处理的路由时，可能会导致父模块报错。此时，重新加载整个页面，来加载新的 HTML 内容。

### 参数

无。

### 类型

* [Module Hijack]()

### 用法

```jsx
<Hijack>
  {...}
</Hijack>
```

### 示例

```jsx
// TODO
```

## `loadRemoteScript(remote)`

加载远程 JS 文件，并且只会加载一次。

### 参数

* remote 远程 JavaScript 文件地址。

### 用法

```jsx
await loadRemoteScript(remote)
```

### 示例

```jsx
await loadRemoteScript('//g.alicdn.com/code/lib/react/16.14.0/umd/react.development.js')
```

## `loadRemoteStyle(remtoe)`

加载远程 CSS 文件，并且只会加载一次。

### 参数

* remote 远程 CSS 文件地址。

### 用法

```jsx
await loadRemoteStyle(remote)
```

### 示例

```jsx
await loadRemoteStyle('//g.alicdn.com/mmfs/mm-portal/0.0.12/umd/react.var.min.css')
```
