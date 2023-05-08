import { Deck } from "./modules/cards/deck.js";
import { Card } from "./modules/cards/card.js";

const deck = new Deck();

deck.shuffle();

const table = document.getElementById("table");

let card: Card;

do {
	card = deck.draw();
	if (card) {
		table.appendChild(card.createNode());
	}
} while (card);
