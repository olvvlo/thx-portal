const formatModuleFederationName = (str: string): string => str.replace(/[^a-zA-Z\d]/g, '_').replace(/^(\d)/, '_$1')

export default function parseRemoteScope (library: string, version: string) : string {
  return formatModuleFederationName(`${library}/${version}`)
}
