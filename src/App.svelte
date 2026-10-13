<script>
  import { DeckManager } from './lib/deckState.svelte.js';
  import Flashcard from './lib/Flashcard.svelte';
  import CardTable from './lib/CardTable.svelte';

  const deck = new DeckManager();
  let currentTab = $state('practice');
</script>

<main class="app-layout">
  <!-- Brand & Live Stat Counters -->
  <header class="app-header">
    <div class="brand">
      <div class="brand-badge">PROTOTYPE</div>
      <h1>Study<span>Sprint</span></h1>
      <p class="tagline">Active Recall & Spaced-Repetition Workbench</p>
    </div>

    <div class="metrics-cluster">
      <div class="stat-card">
        <span class="stat-val">{deck.stats.total}</span>
        <span class="stat-lbl">Deck Size</span>
      </div>
      <div class="stat-card blue">
        <span class="stat-val">{deck.stats.learning}</span>
        <span class="stat-lbl">Learning</span>
      </div>
      <div class="stat-card amber">
        <span class="stat-val">{deck.stats.reviewing}</span>
        <span class="stat-lbl">Reviewing</span>
      </div>
      <div class="stat-card emerald">
        <span class="stat-val">{deck.stats.mastered}</span>
        <span class="stat-lbl">Mastered</span>
      </div>
    </div>
  </header>

  <!-- Segmented Navigation Controller -->
  <div class="nav-wrapper">
    <div class="segmented-control">
      <button
              class={currentTab === 'practice' ? 'active' : ''}
              onclick={() => (currentTab = 'practice')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 8 6 4-6 4Z"/>
        </svg>
        Practice Mode
      </button>
      <button
              class={currentTab === 'manage' ? 'active' : ''}
              onclick={() => (currentTab = 'manage')}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
        </svg>
        Card Manager <span class="counter-chip">{deck.cards.length}</span>
      </button>
    </div>
  </div>

  <!-- Content Workspace -->
  <section class="workspace">
    {#if currentTab === 'practice'}
      <Flashcard {deck} />
    {:else}
      <CardTable {deck} />
    {/if}
  </section>
</main>

<style>
  .app-layout {
    max-width: 820px;
    margin: 0 auto;
    padding: 2.75rem 1.5rem 4rem;
    position: relative;
    z-index: 1;
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--surface-border);
  }

  .brand-badge {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--accent-cyan);
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.25);
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
    margin-bottom: 0.45rem;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1.1;
  }

  h1 span {
    color: var(--accent-cyan);
  }

  .tagline {
    font-size: 0.85rem;
    color: var(--text-dim);
    margin-top: 0.35rem;
  }

  .metrics-cluster {
    display: flex;
    gap: 0.5rem;
  }

  .stat-card {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid var(--surface-border);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    padding: 0.5rem 0.85rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 68px;
    transition: transform 0.15s ease, border-color 0.15s ease;
  }

  .stat-card:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.18);
  }

  .stat-val {
    font-size: 1.15rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    color: #fff;
    line-height: 1.1;
  }

  .stat-lbl {
    font-size: 0.65rem;
    font-weight: 500;
    color: var(--text-dim);
    margin-top: 0.15rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .stat-card.blue .stat-val { color: #60a5fa; }
  .stat-card.amber .stat-val { color: #fbbf24; }
  .stat-card.emerald .stat-val { color: #34d399; }

  .nav-wrapper {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2rem;
  }

  .segmented-control {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid var(--surface-border);
    padding: 0.3rem;
    border-radius: 12px;
    display: inline-flex;
    gap: 0.25rem;
  }

  .segmented-control button {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 0.825rem;
    font-weight: 500;
    padding: 0.45rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .segmented-control button.active {
    background: rgba(30, 41, 59, 0.9);
    color: #fff;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .counter-chip {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-muted);
    font-size: 0.7rem;
    padding: 0.1rem 0.45rem;
    border-radius: 6px;
    font-family: 'JetBrains Mono', monospace;
  }

  .workspace {
    width: 100%;
  }

  @media (max-width: 640px) {
    .app-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1.25rem;
    }
    .metrics-cluster {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>