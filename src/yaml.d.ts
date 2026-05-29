// @rollup/plugin-yaml turns a `*.yaml` import into the parsed
// document as the default export. We type it as `unknown` here and
// cast to the Script schema at the single load site (lib/script.ts).
declare module '*.yaml' {
  const value: unknown
  export default value
}
