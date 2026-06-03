<script lang="ts">
  import type { Scene } from '../lib/types'
  import Canvas from '../visuals/Canvas.svelte'
  import MessageBuffer from '../visuals/MessageBuffer.svelte'
  import MessageReceive from '../visuals/MessageReceive.svelte'
  import SlowVsDead from '../visuals/SlowVsDead.svelte'
  import ValencyTree from '../visuals/ValencyTree.svelte'
  import Lemma1Commute from '../visuals/Lemma1Commute.svelte'
  import Lemma2Sxs from '../visuals/Lemma2Sxs.svelte'
  import Lemma3SetD from '../visuals/Lemma3SetD.svelte'
  import Lemma3Case1 from '../visuals/Lemma3Case1.svelte'
  import Lemma3Case2 from '../visuals/Lemma3Case2.svelte'
  import ConfigStack from '../visuals/ConfigStack.svelte'
  import Section4Knob from '../visuals/Section4Knob.svelte'
  import Section4Clique from '../visuals/Section4Clique.svelte'
  import BlockchainChain from '../visuals/BlockchainChain.svelte'
  import References from '../visuals/References.svelte'

  let { scene }: { scene: Scene } = $props()

  const visual = $derived(scene.visual ?? 'canvas')
</script>

<div class="canvas">
  {#if visual === 'canvas'}
    <Canvas {scene} />
  {:else if visual === 'system'}
    <MessageBuffer {scene} op="state" showBuffer={false} showRegisters={false} />
  {:else if visual === 'process-state'}
    <MessageBuffer {scene} op="state" showBuffer={false} />
  {:else if visual === 'message-buffer'}
    <MessageBuffer {scene} />
  {:else if visual === 'buffer-state'}
    <MessageBuffer {scene} op="state" />
  {:else if visual === 'message-receive'}
    <MessageReceive {scene} />
  {:else if visual === 'correctness'}
    <MessageBuffer {scene} op="state" ghostBuffer />
  {:else if visual === 'references'}
    <References />
  {:else if visual === 'slow-vs-dead'}
    <SlowVsDead />
  {:else if visual === 'valency-tree'}
    <ValencyTree />
  {:else if visual === 'lemma1-commute'}
    <Lemma1Commute />
  {:else if visual === 'lemma2-sxs'}
    <Lemma2Sxs />
  {:else if visual === 'lemma3-set-D'}
    <Lemma3SetD />
  {:else if visual === 'lemma3-case1'}
    <Lemma3Case1 />
  {:else if visual === 'lemma3-case2'}
    <Lemma3Case2 />
  {:else if visual === 'construction'}
    <MessageReceive {scene} construction />
  {:else if visual === 'section4-knob'}
    <Section4Knob />
  {:else if visual === 'section4-clique'}
    <Section4Clique />
  {:else if visual === 'blockchain-chain'}
    <BlockchainChain />
  {:else if visual === 'config-stack'}
    <ConfigStack />
  {:else if visual === 'config-stack-crash'}
    <ConfigStack crash />
  {:else}
    <div class="placeholder">
      <span>:: {visual} ::</span>
      <span class="sub">bespoke visual — not yet built</span>
    </div>
  {/if}
</div>

<style>
  .canvas {
    position: relative;
    min-width: 0;
    min-height: 0;
    padding: 1rem 1.5rem;
    box-shadow: inset -1px 0 0 rgba(24, 24, 24, 0.08);
  }
  .canvas :global(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 100%;
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 14px;
  }
  .placeholder .sub {
    font-size: 12px;
    letter-spacing: 0.1em;
  }
</style>
