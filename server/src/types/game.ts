import { Document } from 'mongoose';
export interface SessionData {
  gameId?: string;
}

export interface Card {
  id: string;
  face: string;
}

export interface GameDocument extends Document {
  cards: Card[];
  dealer: {
    hiddenCards: Card[];
    hand: Card[];
    points: number;
  };
  player: {
    isPlayerTurn: boolean;
    hand: Card[];
    points: number;
  };
  startGame(): void;
  setDealerTurn(): void;
  getCardForPlayer(): void;
  getCardForDealer(): void;
  shouldPlayerDrawCard(): boolean;
  shouldDealerDrawCard(): boolean;
  isBlackjack(): boolean;
  isLost(): boolean;
  isDraw(): boolean;
  isWon(): boolean;
  resetGame(): void;
}
