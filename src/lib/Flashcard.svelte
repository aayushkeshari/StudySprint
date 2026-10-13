<script>
    let { deck } = $props();

    function handleKeydown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.code === 'Space') {
            e.preventDefault();
            deck.flipCard();
        } else if (e.code === 'ArrowRight') {
            deck.nextCard();
        } else if (e.code === 'ArrowLeft') {
            deck.prevCard();
        } else if (e.key === '1' && deck.currentCard) {
            deck.updateMastery(deck.currentCard.id, 'LEARNING');
        } else if (e.key === '2' && deck.currentCard) {
            deck.updateMastery(deck.currentCard.id, 'REVIEWING');
        } else if (e.key === '3' && deck.currentCard) {
            deck.updateMastery(deck.currentCard.id, 'MASTERED');
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="practice-container">
    <!-- Sub-header: Filters & Progress -->
    <div class="deck-controls">
        <div class="filter-pills">
            {#each ['ALL', 'LEARNING', 'REVIEWING', 'MASTERED'] as f}
                <button
                        class="pill {deck.activeFilter === f ? 'active' : ''}"
                        onclick={() => deck.setFilter(f)}
                >
                    {f}
                </button>
            {/each}
        </div>

        <div class="progress-indicator">
            {#if deck.filteredCards.length > 0}
                <span class="mono-num">{(deck.currentIndex % deck.filteredCards.length) + 1}</span>
                <span class="divider">/</span>
                <span class="mono-num">{deck.filteredCards.length}</span>
            {:else}
                <span class="empty-count">0 items</span>
            {/if}
        </div>
    </div>

    {#if deck.currentCard}
        <!-- Interactive 3D Perspective Card -->
        <div
                class="card-wrapper {deck.isFlipped ? 'flipped' : ''}"
                onclick={() => deck.flipCard()}
                role="button"
                tabindex="0"
                onkeydown={(e) => e.key === 'Enter' && deck.flipCard()}
        >
            <div class="card-inner">
                <!-- Front Face -->
                <div class="card-face front">
                    <div class="card-top-row">
                        <span class="tag-pill">{deck.currentCard.tag}</span>
                        <span class="flip-hint-pill">Front</span>
                    </div>

                    <div class="term-centerpiece">
                        <h2 class="term">{deck.currentCard.term}</h2>
                    </div>

                    <div class="card-bottom-row">
                        <span class="space-kbd"><kbd>Space</kbd> to flip</span>
                    </div>
                </div>

                <!-- Back Face -->
                <div class="card-face back">
                    <div class="card-top-row">
            <span class="status-badge {deck.currentCard.mastery.toLowerCase()}">
              {deck.currentCard.mastery}
            </span>
                        <span class="flip-hint-pill">Back</span>
                    </div>

                    <div class="def-centerpiece">
                        <p class="definition">{deck.currentCard.definition}</p>
                    </div>

                    <div class="card-bottom-row">
                        <span class="review-stat">Practiced {deck.currentCard.reviewCount} {deck.currentCard.reviewCount === 1 ? 'time' : 'times'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Rating Tier Triggers -->
        <div class="action-dock">
            <div class="rating-strip">
                <button class="btn-tier learning" onclick={() => deck.updateMastery(deck.currentCard.id, 'LEARNING')}>
                    <span class="tier-kbd">1</span> Learning
                </button>
                <button class="btn-tier reviewing" onclick={() => deck.updateMastery(deck.currentCard.id, 'REVIEWING')}>
                    <span class="tier-kbd">2</span> Reviewing
                </button>
                <button class="btn-tier mastered" onclick={() => deck.updateMastery(deck.currentCard.id, 'MASTERED')}>
                    <span class="tier-kbd">3</span> Mastered
                </button>
            </div>

            <!-- Navigation Arrows -->
            <div class="nav-strip">
                <button class="btn-nav" onclick={() => deck.prevCard()} aria-label="Previous Card">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
                    Previous
                </button>
                <button class="btn-nav" onclick={() => deck.nextCard()} aria-label="Next Card">
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </div>
    {:else}
        <div class="empty-state">
            <div class="empty-icon">🗂️</div>
            <h3>No cards available in this filter</h3>
            <p>Switch to "ALL" or add new cards via the Card Manager tab.</p>
        </div>
    {/if}
</div>

<style>
    .practice-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        width: 100%;
    }

    .deck-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 640px;
    }

    .filter-pills {
        display: flex;
        gap: 0.35rem;
    }

    .pill {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid var(--surface-border);
        color: var(--text-dim);
        padding: 0.3rem 0.75rem;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .pill:hover {
        color: var(--text-muted);
        border-color: rgba(255, 255, 255, 0.15);
    }

    .pill.active {
        background: rgba(56, 189, 248, 0.15);
        border-color: rgba(56, 189, 248, 0.4);
        color: var(--accent-cyan);
    }

    .progress-indicator {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.8rem;
        color: var(--text-dim);
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .mono-num {
        color: var(--text-muted);
        font-weight: 500;
    }

    /* 3D Card Architecture */
    .card-wrapper {
        width: 100%;
        max-width: 640px;
        height: 340px;
        perspective: 1200px;
        cursor: pointer;
        user-select: none;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
        transform-style: preserve-3d;
    }

    .card-wrapper.flipped .card-inner {
        transform: rotateY(180deg);
    }

    .card-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 1.75rem 2rem;
        border-radius: 20px;
        background: linear-gradient(145deg, rgba(17, 24, 39, 0.95), rgba(15, 23, 42, 0.85));
        border: 1px solid rgba(255, 255, 255, 0.09);
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .card-wrapper:hover .card-face {
        border-color: var(--surface-border-hover);
        box-shadow: 0 24px 48px -15px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 189, 248, 0.08);
    }

    .card-face.back {
        transform: rotateY(180deg);
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(10, 15, 30, 0.85));
    }

    .card-top-row, .card-bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .tag-pill {
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        color: var(--accent-cyan);
        background: rgba(56, 189, 248, 0.1);
        border: 1px solid rgba(56, 189, 248, 0.2);
        padding: 0.2rem 0.65rem;
        border-radius: 999px;
    }

    .flip-hint-pill {
        font-size: 0.7rem;
        color: var(--text-dim);
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .term-centerpiece, .def-centerpiece {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        text-align: center;
        padding: 1rem 0;
    }

    .term {
        font-size: 2.25rem;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.025em;
        line-height: 1.2;
    }

    .definition {
        font-size: 1.25rem;
        color: #e2e8f0;
        line-height: 1.6;
        font-weight: 400;
        max-width: 520px;
    }

    .space-kbd kbd {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.7rem;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 0.15rem 0.45rem;
        border-radius: 4px;
        color: var(--text-muted);
    }

    .space-kbd {
        font-size: 0.75rem;
        color: var(--text-dim);
    }

    .status-badge {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        padding: 0.2rem 0.65rem;
        border-radius: 6px;
        text-transform: uppercase;
    }

    .status-badge.learning { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .status-badge.reviewing { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .status-badge.mastered { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }

    .review-stat {
        font-size: 0.75rem;
        color: var(--text-dim);
    }

    /* Control Dock */
    .action-dock {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        width: 100%;
        max-width: 640px;
    }

    .rating-strip {
        display: flex;
        gap: 0.75rem;
        width: 100%;
    }

    .btn-tier {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.65rem 1rem;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s ease;
    }

    .tier-kbd {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.65rem;
        background: rgba(0, 0, 0, 0.25);
        padding: 0.1rem 0.35rem;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-tier.learning {
        background: rgba(59, 130, 246, 0.15);
        color: #93c5fd;
        border-color: rgba(59, 130, 246, 0.3);
    }
    .btn-tier.learning:hover { background: rgba(59, 130, 246, 0.25); }

    .btn-tier.reviewing {
        background: rgba(245, 158, 11, 0.15);
        color: #fde68a;
        border-color: rgba(245, 158, 11, 0.3);
    }
    .btn-tier.reviewing:hover { background: rgba(245, 158, 11, 0.25); }

    .btn-tier.mastered {
        background: rgba(16, 185, 129, 0.15);
        color: #a7f3d0;
        border-color: rgba(16, 185, 129, 0.3);
    }
    .btn-tier.mastered:hover { background: rgba(16, 185, 129, 0.25); }

    .nav-strip {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .btn-nav {
        flex: 1;
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid var(--surface-border);
        color: var(--text-muted);
        padding: 0.55rem 1rem;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        transition: all 0.15s ease;
    }

    .btn-nav:hover {
        background: rgba(30, 41, 59, 0.7);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.15);
    }

    .empty-state {
        padding: 4rem 2rem;
        text-align: center;
        border-radius: 16px;
        background: rgba(15, 23, 42, 0.4);
        border: 1px dashed var(--surface-border);
        max-width: 640px;
        width: 100%;
    }

    .empty-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .empty-state h3 { font-size: 1.1rem; color: #fff; margin-bottom: 0.35rem; }
    .empty-state p { font-size: 0.85rem; color: var(--text-dim); }
</style>
