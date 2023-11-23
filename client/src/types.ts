export interface Card {
  id: string;
  face: string;
}

export interface Dealer {
  hand: Card[];
  hiddenCards?: Card[];
  points: number;
}

export interface Player {
  hand: Card[];
  points: number;
  isPlayerTurn: boolean;
}
