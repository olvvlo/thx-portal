# 👻 指南

## 关于 thx-scripts 和 thx-portal
thx-sripts 内置支持 Webpack5 模块邦联（Module Federation）。在执行构建页面和模块时，会自动生成可被其他应用共享的模块。
基本原理是，当执行构建时，会自动生成一份与配置 etnry 一一对应的 remote.js 文件；其他应用可加载 remote.js，从中获取对应的模块，从而实现 React 应用的模块共享。

## 快速开始

第一步，你需要安装构建工具 `thx-script`：

```sh
# Webpack 构建工具
yarn global add thx-scripts
```
​
构建工具 thx-scripts 是基于 Webpack5 封装的最佳实践，内置了常用 loader、启动本地服务、模拟数据代理、反向接口代理、打包分析和模块邦联等基础功能。

第二步，你需要在应用的 .rmxrc 文件中指定需要构建的模块，这些模块将基于模块邦联自动支持共享。
以示例仓库 thx-portal/examples/react-callee 为例，其中指定了共享组件 components/Hello：

```json
{
  "kit": "react",
  "rapProjectId": "5765",
  "webpack": {
    "entry": {
      "index": "./src/index.tsx",
      "Portal": "./src/Portal.tsx",
      "components/Hello": "./src/components/Hello.tsx"
    },
    "externals": {
      "react": "React",
      "react-dom": "ReactDOM",
      "react-router-dom": "ReactRouterDOM",
      "styled-components": "styled",
      "@alifd/next": "Next",
    },
    "devServer": {
      "port": 9102
    }
  }
}
```

最后一步，你可以在其他应用中单独加载并渲染 `components/Hello` 了。

以示例仓库 mm-portal/examples/react-caller 为例，只需引入 `thx-portal` 中的 `<MF>` 组件（Module Federation 的缩写），像下面这样配置：

```jsx
import { MF } from 'thx-portal'

<MF
  remote='http://localhost:9102/remote.js'
  library={'react-callee'}
  version={'0.0.1'}
  module='components/Hello'
/>
```

关于组件 MF 的 API 参见 [API Reference](../api//README.md)，下文也有更多示例。

## 关于 thx-portal

工具箱 thx-portal 中集成了微前端需要的一切组件和能力，你需要在调用方应用中安装它：

```sh
yarn add thx-portal
```

或者，也可以直接引用 CDN UMD 文件：

```html
<script crossorigin="anonymous" src="https://g.alicdn.com/mmfs/mm-portal/0.0.15/umd/MPortal.js"></script>
```

需要注意的是，上面的 CDN UMD 文件依赖 `react`、`react-dom`、`react-router-dom`，需要提前引入，示例如下：

```html
<!-- 开发版本 -->
<script crossorigin="anonymous" src="//g.alicdn.com/code/lib/react/16.14.0/umd/react.development.js"></script>
<script crossorigin="anonymous" src="//g.alicdn.com/code/lib/react-dom/16.14.0/umd/react-dom.development.js"></script>
<script crossorigin="anonymous" src='//g.alicdn.com/code/lib/react-router-dom/5.2.0/react-router-dom.js'></script>
```

```html
<!-- 生产版本 -->
<script crossorigin="anonymous" src="//g.alicdn.com/code/lib/react/16.14.0/umd/react.production.min.js"></script>
<script crossorigin="anonymous" src="//g.alicdn.com/code/lib/react-dom/16.14.0/umd/react-dom.production.min.js"></script>
<script crossorigin="anonymous" src="//g.alicdn.com/code/lib/react-router-dom/5.2.0/react-router-dom.min.js"></script>
```

## MF

以下是 MF 的更多使用示例。

示例 1：传入 remote、module 即可，内部基于 remote 自动解析出 library、version。

```jsx
function Example1 () {
  return <>
    <MF
      remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
      module='components/TopOpenUnionApp'
    />
  </>
}
// library: mm-portal-playground-callee
// version: 20210709.2200.1234
```

示例 2：传入 library、version、module 即可，内部基于 library、version 自动计算出 remote 地址。
计算规则为：https://g.alicdn.com/mmfs/${library}/${version}/remote.js。

```jsx
function Example2 () {
  return <>
    <MF
      library='mm-portal-playground-callee'
      version='20210709.2200.1234'
      module='components/TopOpenUnionApp'
    />
  </>
}
// remote: https://g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js
```

示例 3：支持嵌套挂载。

```jsx
function Example3 () {
  return <>
    <MF
      remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
      module='components/ErrorBoundary'
    >
      <MF
        remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
        module='components/Empty'
      />
    </MF>
  </>
}
```

示例 4：支持挂载非 export default 组件。

```jsx
import { MF, useRemoteModule } from 'thx-portal'
function Example4 () {
  const { loading, Module: Components } = useRemoteModule({
    remote: 'https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js',
    module: 'components/index'
  })
  if (loading) return <div>loading...</div>
  return <Components.TopOpenUnionApp />
}
```

示例 5：实际使用中，可以对 <MF> 再次简单封装为 <CalleeMF>，内置 remote，只需要传入 module。

```jsx
function CalleeMF ({ module, ...others }) {
  return <MF
    remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
    module={module}
    {...others}
  />
}
function Example5 () {
  return <CalleeMF module='pages/teacher/list' />
}
```

## MF + 路由

示例 6：实际使用中，可以对 <MF>  再次简单封装为 <CalleeRoute> ，内置 remote，简化路由配置参数。

```jsx
import { Route, Switch } from 'react-router-dom'
​
function CalleeRoute ({ path, module, ...extra }) {
  return <Route exact path={path}>
    <MF
      remote='https://dev.g.alicdn.com/mmfs/mm-portal-playground-callee/20210709.2200.1234/remote.js'
      module={module}
      {...extra}
    />
  </Route>
}
​
function Example6 () {
  return <Switch>
    <CalleeRoute path='/pages/teacher/list' module='/pages/teacher/list' />
    <Route>404</Route>
  </Switch>
}
```

示例 7：生产环境中，可基于 <CalleeRoute>  设置批量灰度，来实现渐进式升级。

```jsx
import { Route, Switch } from 'react-router-dom'
​
function Example7 () {
  return <Switch>
    <Route path='/mf'>
      <Switch>
        <CalleeRoute path='/mf/pages/teacher/list' module='/pages/teacher/list' />
        <Route>404</Route>
      </Switch>
    </Route>
    <Route>404</Route>
  </Switch>
}
```

示例 8：生产环境中，还可以封装一个通用的动态路由组件 <DynamicCalleeRoute>，来挂载三方组件，可以快速使整站微前端化。

```jsx
import { useLocation } from 'react-router-dom'
​
function DynamicCalleeRoute ({ ...extra }) {
  const { pathname } = useLocation()
  return <Route exact path={pathname}>
    <CalleeMF module='components/ErrorBoundary'>
      <CalleeMF module={pathname} {...extra} />
    </CalleeMF>
  </Route>
}
function Example8 () {
  return <DynamicCalleeRoute />
}
```