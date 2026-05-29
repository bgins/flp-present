import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import yaml from '@rollup/plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  // script.yaml is imported at build time and parsed by
  // @rollup/plugin-yaml into a plain JS object — see src/lib/script.ts.
  plugins: [svelte(), yaml()],
})
