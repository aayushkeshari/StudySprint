export class DeckManager {
    cards = $state([]);
    activeFilter = $state('ALL');
    currentIndex = $state(0);
    isFlipped = $state(false);

    constructor() {
        this.loadDeck();
        if (this.cards.length === 0) {
            this.seedInitialCards();
        }
    }

    get filteredCards() {
        if (this.activeFilter === 'ALL') return this.cards;
        return this.cards.filter((card) => card.mastery === this.activeFilter);
    }

    get currentCard() {
        const pool = this.filteredCards;
        if (pool.length === 0) return null;
        return pool[this.currentIndex % pool.length];
    }

    get stats() {
        return {
            total: this.cards.length,
            learning: this.cards.filter((c) => c.mastery === 'LEARNING').length,
            reviewing: this.cards.filter((c) => c.mastery === 'REVIEWING').length,
            mastered: this.cards.filter((c) => c.mastery === 'MASTERED').length
        };
    }

    addCard(term, definition, tag = 'General') {
        if (!term.trim() || !definition.trim()) return false;
        const newCard = {
            id: crypto.randomUUID(),
            term: term.trim(),
            definition: definition.trim(),
            tag: tag.trim() || 'General',
            mastery: 'LEARNING',
            reviewCount: 0,
            createdAt: Date.now()
        };
        this.cards.push(newCard);
        this.saveDeck();
        return true;
    }

    flipCard() {
        this.isFlipped = !this.isFlipped;
    }

    nextCard() {
        this.isFlipped = false;
        const pool = this.filteredCards;
        if (pool.length > 0) {
            this.currentIndex = (this.currentIndex + 1) % pool.length;
        }
    }

    prevCard() {
        this.isFlipped = false;
        const pool = this.filteredCards;
        if (pool.length > 0) {
            this.currentIndex = (this.currentIndex - 1 + pool.length) % pool.length;
        }
    }

    setFilter(filter) {
        this.activeFilter = filter;
        this.currentIndex = 0;
        this.isFlipped = false;
    }

    updateMastery(id, newMastery) {
        const card = this.cards.find((c) => c.id === id);
        if (card) {
            card.mastery = newMastery;
            card.reviewCount += 1;
            this.saveDeck();
        }
    }

    editCard(id, updatedTerm, updatedDefinition, updatedTag) {
        const card = this.cards.find((c) => c.id === id);
        if (card) {
            card.term = updatedTerm.trim();
            card.definition = updatedDefinition.trim();
            if (updatedTag) card.tag = updatedTag.trim();
            this.saveDeck();
        }
    }

    deleteCard(id) {
        this.cards = this.cards.filter((c) => c.id !== id);
        if (this.currentIndex >= this.filteredCards.length && this.currentIndex > 0) {
            this.currentIndex = 0;
        }
        this.saveDeck();
    }

    saveDeck() {
        try {
            localStorage.setItem('studysprint_deck', JSON.stringify(this.cards));
        } catch (e) {
            console.warn('Storage unavailable', e);
        }
    }

    loadDeck() {
        try {
            const stored = localStorage.getItem('studysprint_deck');
            if (stored) this.cards = JSON.parse(stored);
        } catch {
            this.cards = [];
        }
    }

    seedInitialCards() {
        this.addCard('Idempotent', 'An operation that produces the same result no matter how many times it is executed.', 'Systems');
        this.addCard('Epistemology', 'The branch of philosophy concerned with the theory of knowledge and belief justification.', 'Philosophy');
        this.addCard('Spatial Locality', 'Referencing memory addresses close to recently accessed locations to improve cache hits.', 'Architecture');
    }
}