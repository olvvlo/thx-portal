const __PROMISE_MAP__ = {}

function __loadStyle__ (src: string) {
  if (__PROMISE_MAP__[src]) return __PROMISE_MAP__[src]

  const promised = new Promise((resolve, reject) => {
    const element = document.createElement('link')
    element.rel = 'stylesheet'
    element.type = 'text/css'
    element.href = src

    element.onload = () => {
      resolve(true)
    }

    element.onerror = (error) => {
      delete __PROMISE_MAP__[src]
      reject(error)
    }

    document.head.appendChild(element)
  })

  __PROMISE_MAP__[src] = promised

  return promised
}

/**
 * 加载远程 CSS 文件，并且只会加载一次。
 * @param remote 远程 CSS 文件地址。
 */
export default async function loadRemoteStyle (remote: string) {
  await new Promise((resolve, reject) => {
    __loadStyle__(remote)
      .then(
        resolve,
        () => {
          reject(new Error(`[MF] [loadRemoteStyle] failed to load remote script: ${remote}`))
        }
      )
  })
}
