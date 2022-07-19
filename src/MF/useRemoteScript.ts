import { useEffect, useState } from 'react'
import loadRemoteScript from './loadRemoteScript'

export default function useRemoteScript (remote: string) {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(undefined)

  useEffect(() => {
    if (!remote) {
      throw new Error('缺少 remote 文件')
    }

    setLoading(true)
    setReady(false)
    loadRemoteScript(remote)
      .then(
        () => {
          setReady(true)
        },
        (error) => {
          setError(error)
        }
      )
      .finally(() => {
        setLoading(false)
      })
  }, [remote])

  return { ready, loading, error }
}
