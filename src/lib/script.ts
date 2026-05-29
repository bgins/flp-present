// Single typed entry point for the narration script. The YAML is
// parsed at build time by @rollup/plugin-yaml (see vite.config.ts)
// and cast to the Script schema here.
import data from '../script.yaml'
import type { Script } from './types'

export const script = data as Script
export const scenes = script.scenes
