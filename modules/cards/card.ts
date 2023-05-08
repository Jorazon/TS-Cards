import { Transform } from "../3D/Transform.js";

export enum Suit {
	Hearts = "hearts",
	Clubs = "clubs",
	Diamonds = "diamonds",
	Spades = "spades",
};

export enum Rank {
	Ace = "ace",
	Two = "2",
	Three = "3",
	Four = "4",
	Five = "5",
	Six = "6",
	Seven = "7",
	Eight = "8",
	Nine = "9",
	Ten = "10",
	Jack = "jack",
	Queen = "queen",
	King = "king",
}

export class Card {
	suit: Suit;
	rank: Rank;
	face: HTMLImageElement;

	constructor(suit: Suit, rank: Rank) {
		this.suit = suit;
		this.rank = rank;
		this.face = new Image();
		this.face.src = `./cards/${this.suit}_${this.rank}.svg`;
		this.face.alt = `${this.rank} of ${this.suit}`;
		this.face.classList.add("card-face");
	}

	createNode() {
		const card = document.createElement("div");
		card.classList.add("card");

		card.appendChild(this.face);

		const transform = new Transform();
		const twopi = Math.PI * 2;
		transform.rotate(Math.random() * twopi, Math.random() * twopi, Math.random() * twopi);
		transform.rotate(0, Math.PI, 0);
		transform.translate(0, 0, Math.random() * 30);

		card.style.cssText = transform.css();

		return card;
	}
}