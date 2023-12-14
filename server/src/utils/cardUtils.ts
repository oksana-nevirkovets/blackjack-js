import { Card } from '../types';

export function calculatePoints(hand: Card[]): number {
  let points = 0;
  let countAce = 0;
  hand.map(card => {
    if (card.face === 'A') {
      countAce += 1;
    }
    points += getCardValue(card.face);
  });

  if (countAce > 0) points = reCalculatePointsWithAce(points, countAce);
  return points;
}

export function reCalculatePointsWithAce(points: number, countAce: number): number {
  for (let i = 0; i < countAce; i++) {
    if (points + 10 <= 21) points += 10;
  }
  return points;
}

export function getCardValue(nominal: string): number {
  if (isNaN(Number(nominal))) {
    if (nominal === 'A') {
      return 1;
    }
    return 10;
  }

  return parseInt(nominal);
}

export function buildDeck(): Card[] {
  const faces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const suits = ['S', 'D', 'H', 'C'];
  const deck = suits.map(suit => faces.map(face => ({ id: face + '-' + suit, face }))).flat();
  return deck;
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function shuffleDeck(): Card[] {
  const deck = buildDeck();
  return shuffleArray(deck);
}
