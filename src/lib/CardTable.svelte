<script>
    let { deck } = $props();

    let termInput = $state('');
    let defInput = $state('');
    let tagInput = $state('');
    let editingId = $state(null);
    let editTerm = $state('');
    let editDef = $state('');

    function handleCreate(e) {
        e.preventDefault();
        if (deck.addCard(termInput, defInput, tagInput)) {
            termInput = '';
            defInput = '';
            tagInput = '';
        }
    }

    function startEdit(card) {
        editingId = card.id;
        editTerm = card.term;
        editDef = card.definition;
    }

    function saveEdit(id) {
        deck.editCard(id, editTerm, editDef);
        editingId = null;
    }
</script>

<div class="roster-view">
    <!-- Fast Creation Bar -->
    <form class="create-card" onsubmit={handleCreate}>
        <div class="input-cell flex-1">
            <input type="text" placeholder="New term (e.g., Cache Hit)..." bind:value={termInput} required />
        </div>
        <div class="input-cell flex-2">
            <input type="text" placeholder="Definition or context..." bind:value={defInput} required />
        </div>
        <div class="input-cell flex-tag">
            <input type="text" placeholder="Tag (optional)" bind:value={tagInput} />
        </div>
        <button type="submit" class="btn-create">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add Card
        </button>
    </form>

    <!-- Data Table Panel -->
    <div class="table-card">
        <table>
            <thead>
            <tr>
                <th style="width: 25%;">Term</th>
                <th style="width: 40%;">Definition</th>
                <th style="width: 15%;">Tag</th>
                <th style="width: 12%;">Mastery</th>
                <th style="width: 8%; text-align: right;">Actions</th>
            </tr>
            </thead>
            <tbody>
            {#each deck.cards as card (card.id)}
                <tr>
                    {#if editingId === card.id}
                        <td><input class="cell-input" type="text" bind:value={editTerm} /></td>
                        <td><input class="cell-input" type="text" bind:value={editDef} /></td>
                        <td><span class="tag-chip">{card.tag}</span></td>
                        <td>
                            <span class="status-indicator {card.mastery.toLowerCase()}">{card.mastery}</span>
                        </td>
                        <td style="text-align: right;">
                            <button class="action-btn save" onclick={() => saveEdit(card.id)} title="Save changes">Save</button>
                            <button class="action-btn" onclick={() => (editingId = null)} title="Cancel">Cancel</button>
                        </td>
                    {:else}
                        <td class="term-cell">{card.term}</td>
                        <td class="def-cell">{card.definition}</td>
                        <td><span class="tag-chip">{card.tag}</span></td>
                        <td>
                            <select
                                    class="tier-select {card.mastery.toLowerCase()}"
                                    value={card.mastery}
                                    onchange={(e) => deck.updateMastery(card.id, e.target.value)}
                            >
                                <option value="LEARNING">LEARNING</option>
                                <option value="REVIEWING">REVIEWING</option>
                                <option value="MASTERED">MASTERED</option>
                            </select>
                        </td>
                        <td style="text-align: right;">
                            <div class="row-actions">
                                <button class="action-btn" onclick={() => startEdit(card)}>Edit</button>
                                <button class="action-btn delete" onclick={() => deck.deleteCard(card.id)}>Delete</button>
                            </div>
                        </td>
                    {/if}
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .roster-view {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        width: 100%;
    }

    .create-card {
        background: rgba(15, 23, 42, 0.7);
        border: 1px solid var(--surface-border);
        backdrop-filter: blur(8px);
        border-radius: 14px;
        padding: 0.65rem;
        display: flex;
        gap: 0.5rem;
    }

    .flex-1 { flex: 1.2; }
    .flex-2 { flex: 2.2; }
    .flex-tag { flex: 1; }

    .create-card input {
        width: 100%;
        background: rgba(10, 15, 30, 0.8);
        border: 1px solid var(--surface-border);
        border-radius: 8px;
        padding: 0.55rem 0.85rem;
        font-size: 0.825rem;
        color: #fff;
        outline: none;
        transition: border-color 0.15s ease;
    }

    .create-card input:focus {
        border-color: var(--accent-cyan);
    }

    .btn-create {
        background: var(--accent-cyan);
        color: #0b0f19;
        border: none;
        border-radius: 8px;
        padding: 0.55rem 1rem;
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        white-space: nowrap;
        transition: opacity 0.15s ease;
    }

    .btn-create:hover { opacity: 0.9; }

    .table-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid var(--surface-border);
        border-radius: 14px;
        overflow: hidden;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.825rem;
        text-align: left;
    }

    th {
        background: rgba(10, 15, 30, 0.8);
        color: var(--text-dim);
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.85rem 1rem;
        border-bottom: 1px solid var(--surface-border);
    }

    td {
        padding: 0.85rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        vertical-align: middle;
    }

    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(255, 255, 255, 0.02); }

    .term-cell {
        font-weight: 600;
        color: #fff;
    }

    .def-cell {
        color: var(--text-muted);
        line-height: 1.45;
    }

    .tag-chip {
        font-size: 0.7rem;
        color: var(--accent-cyan);
        background: rgba(56, 189, 248, 0.08);
        border: 1px solid rgba(56, 189, 248, 0.2);
        padding: 0.15rem 0.5rem;
        border-radius: 6px;
    }

    .tier-select {
        background: rgba(10, 15, 30, 0.8);
        border: 1px solid var(--surface-border);
        color: #fff;
        font-size: 0.72rem;
        font-weight: 600;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        cursor: pointer;
    }

    .tier-select.learning { color: #60a5fa; }
    .tier-select.reviewing { color: #fbbf24; }
    .tier-select.mastered { color: #34d399; }

    .cell-input {
        width: 100%;
        background: #090d16;
        border: 1px solid var(--accent-cyan);
        color: #fff;
        padding: 0.35rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }

    .row-actions {
        display: inline-flex;
        gap: 0.25rem;
    }

    .action-btn {
        background: transparent;
        border: 1px solid var(--surface-border);
        color: var(--text-dim);
        padding: 0.2rem 0.5rem;
        border-radius: 6px;
        font-size: 0.72rem;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .action-btn:hover {
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
    }

    .action-btn.save {
        background: rgba(16, 185, 129, 0.15);
        border-color: rgba(16, 185, 129, 0.3);
        color: #34d399;
    }

    .action-btn.delete {
        color: var(--accent-rose);
        border-color: rgba(244, 63, 94, 0.2);
    }

    .action-btn.delete:hover {
        background: rgba(244, 63, 94, 0.15);
    }

    @media (max-width: 640px) {
        .create-card { flex-direction: column; }
    }
</style>