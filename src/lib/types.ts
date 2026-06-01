// The scene-snapshot schema — the data contract for script.yaml.
// Mirrors the "Data model" section of plans/plan.md and the schema
// header in script.yaml. Keep this in sync with the YAML.

export type Valency = 'bivalent' | 'univalent-0' | 'univalent-1'

export type Visual =
  | 'canvas'
  | 'system'
  | 'process-state'
  | 'message-buffer'
  | 'buffer-state'
  | 'message-receive'
  | 'slow-vs-dead'
  | 'valency-tree'
  | 'lemma1-commute'
  | 'lemma2-sxs'
  | 'lemma3-set-D'
  | 'construction-q'

export type Verb = 'deliver' | 'delay' | 'step'

/** Output register: blank (`b`) or a decided value. */
export type OutputReg = 'b' | 0 | 1

export interface ProcessState {
  id: string
  /** Input register x_p ∈ {0, 1}. */
  x: 0 | 1
  /** Output register y_p ∈ {b, 0, 1}. */
  y: OutputReg
  /** [x, y] canvas coordinates in the 800×600 viewBox. */
  pos: [number, number]
  faulty?: boolean
}

export interface BufferMsg {
  id: string
  from: string
  to: string
  payload: string
}

export interface TraceEntry {
  stage: number
  verb: Verb
  /** Free-form target string, e.g. "m6" or "(p2, ∅)". */
  target: string
}

export interface Chrome {
  stage: number
  valency: Valency
  /** Process id of the faulty process, or null if none yet. */
  faulty: string | null
}

export interface SceneNote {
  marker: string
  body: string
}

export interface Scene {
  id: string
  head: { section: string; topic: string }
  cite: string
  quote: string
  note?: SceneNote
  /** Canvas treatment; defaults to "canvas" when absent. */
  visual?: Visual
  chrome: Chrome
  processes: ProcessState[]
  buffer: BufferMsg[]
  /** (p, ∅) options surfaced in the buffer panel. */
  null_steps: string[]
  trace: TraceEntry[]
}

export interface Script {
  scenes: Scene[]
}
