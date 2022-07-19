const __PROMISE_MAP__ = {}

function __loadScript__ (src: string) {
  if (__PROMISE_MAP__[src]) return __PROMISE_MAP__[src]

  const promised = new Promise((resolve, reject) => {
    const element = document.createElement('script')
    element.type = 'text/javascript'
    element.async = true
    element.src = src

    element.onload = () => {
      // console.log(`MF: Dynamic Script Loaded: ${src}`)
      resolve(true)
    }

    element.onerror = (error) => {
      // console.error(`MF: Dynamic Script Error: ${src}`)
      delete __PROMISE_MAP__[src]
      reject(error)
    }

    document.head.appendChild(element)
  })

  __PROMISE_MAP__[src] = promised

  return promised
}

/**
 * 加载远程 JS 文件，并且只会加载一次。
 * @param remote 远程 JavaScript 文件地址。
 */
export default async function loadRemoteScript (remote: string) {
  await new Promise((resolve, reject) => {
    __loadScript__(remote)
      .then(
        resolve,
        () => {
          reject(new Error(`[MF] [loadRemoteScript] failed to load remote script: ${remote}`))
        }
      )
  })
}
