import { describe, it, expect, beforeEach } from 'vitest';
import { DeckManager } from '../src/lib/deckState.svelte.js';

describe('DeckManager CRUD Suite', () => {
    let deck;

    beforeEach(() => {
        global.localStorage = {
            getItem: () => null,
            setItem: () => {}
        };
        deck = new DeckManager();
        deck.cards = [];
    });

    it('TC-01 [Create]: appends new card with default state', () => {
        const success = deck.addCard('Polymorphism', 'Objects taking on multiple forms', 'OOP');
        expect(success).toBe(true);
        expect(deck.cards.length).toBe(1);
        expect(deck.cards[0].term).toBe('Polymorphism');
        expect(deck.cards[0].mastery).toBe('LEARNING');
    });

    it('TC-02 [Read / Flip]: handles card traversal and flip states', () => {
        deck.addCard('A', 'Alpha');
        deck.addCard('B', 'Beta');
        expect(deck.currentCard.term).toBe('A');

        deck.flipCard();
        expect(deck.isFlipped).toBe(true);

        deck.nextCard();
        expect(deck.isFlipped).toBe(false);
        expect(deck.currentCard.term).toBe('B');
    });

    it('TC-03 [Update]: changes card mastery and review counts', () => {
        deck.addCard('C', 'Charlie');
        const id = deck.cards[0].id;

        deck.updateMastery(id, 'MASTERED');
        expect(deck.cards[0].mastery).toBe('MASTERED');
        expect(deck.cards[0].reviewCount).toBe(1);
    });

    it('TC-04 [Update]: edits term and definition inline', () => {
        deck.addCard('D', 'Delta');
        const id = deck.cards[0].id;

        deck.editCard(id, 'Delta (Updated)', 'New definition string');
        expect(deck.cards[0].term).toBe('Delta (Updated)');
        expect(deck.cards[0].definition).toBe('New definition string');
    });

    it('TC-05 [Delete]: purges card from deck array', () => {
        deck.addCard('E', 'Echo');
        const id = deck.cards[0].id;
        expect(deck.cards.length).toBe(1);

        deck.deleteCard(id);
        expect(deck.cards.length).toBe(0);
        expect(deck.currentCard).toBe(null);
    });
});