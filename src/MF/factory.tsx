import { ILoadComponentOptions } from '../types/portal'
import dynamicModuleFederation from './dynamicModuleFederation'

function ErrorMessage ({ error }) {
  return <div style={{ color: 'var(--color-error-3)' }}>
    {error.message}
  </div>
}

export default function factory ({ library, version, module }: ILoadComponentOptions) {
  return async () => {
    try {
      const Module = await dynamicModuleFederation({ library, version, module })
      if (!Module) {
        throw new Error(`[MF] [factory] cannot find module ${module}, library: ${library}, version: ${version}`)
      }
      return Module
    } catch (error) {
      console.error('[MF] [factory]', error)
      return {
        default: () => <ErrorMessage error={error} />
      }
    }
  }
}
