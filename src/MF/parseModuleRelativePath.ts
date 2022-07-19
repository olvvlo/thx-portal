export default function parseModuleRelativePath (module: string) {
  if (module.startsWith('./')) return module
  if (module.startsWith('/')) return `.${module}`
  return `./${module}`
}
