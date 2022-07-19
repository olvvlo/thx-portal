export default function parseRemoteCDNUrl (remote: string)
  : { env: string, orgnization: string, repository: string, version: string } {
  // https://dev.g.alicdn.com/mmfs-playground/playground-union-college-003/20210709.2200.1234/remote.js
  const RE_CDN = /^https?:\/\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)\/.+$/
  const ma = RE_CDN.exec(remote)
  if (ma) {
    return {
      env: ma[1],
      orgnization: ma[2],
      repository: ma[3],
      version: ma[4]
    }
  }
  console.warn(`无法解析 ${remote} 中的 library、version，请手动传入！`)
}
