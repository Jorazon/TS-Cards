import { Card, Rank, Suit } from "../cards/card.js";

export class Deck {
	/**
	 * @param decks Number of decks to combine. Allows creating a deck that combines multiple standard 52-card decks.
	 */
	constructor(decks: number = 1) {
		// loop decks
		for (let deck_n = 0; deck_n < decks; deck_n++) {
			// loop suits
			for (let suit in Suit) {
				// temporary store for suit
				let temp: Card[] = [];
				// loop ranks
				for (let rank in Rank) {
					// add cards
					temp.push(new Card(Suit[suit], Rank[rank]));
				}
				// reverse diamonds and spades to get realistic fresh deck
				if (Suit[suit] === Suit.Diamonds || Suit[suit] == Suit.Spades) {
					temp.reverse();
				}
				// add cards to deck
				this.cards.push(...temp);
			}
		}
	}

	/**
	 * Shuffle order of cards in the deck
	 */
	shuffle() {
		for (let index = this.cards.length - 1; index > 0; index--) {
			const random = Math.floor(Math.random() * (index + 1));
			[this.cards[index], this.cards[random]] = [this.cards[random], this.cards[index]];
		}
	}

	/**
	 * Draw the top card from the deck
	 * @returns Top card. If deck is empty undefined is returned.
	 */
	draw(): Card | undefined {
		return this.cards.shift()
	}

	private cards: Card[] = [];
}