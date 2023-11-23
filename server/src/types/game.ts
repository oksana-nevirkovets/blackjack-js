import { Document } from "mongoose";
export interface SessionData {
  gameId?: string;
}

export interface Card {
  id: string;
  face: string;
}

export interface GameDocument extends Document {
  cards: Card[];
  isGameInProgress: boolean;
  dealer: {
    hiddenCards: Card[];
    hand: Card[];
    points: number;
  };
  player: {
    isPlaying: boolean;
    hand: Card[];
    points: number;
  };
  startGame(): void;
  getCardForPlayer(): void;
  getCardForDealer(): void;
  shouldPlayerDrawCard(): boolean;
  shouldDealerDrawCard(): boolean;
  isBlackjack(): boolean;
  isLost(): boolean;
  isDraw(): boolean;
  isWon(): boolean;
  endGame(): void;
  resetGame(): void;
}
