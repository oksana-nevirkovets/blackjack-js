import mongoose, { Schema } from 'mongoose';
import { calculatePoints, shuffleDeck } from '../utils/cardUtils';
import { GameDocument } from '../types/game';

const gameSchema = new Schema({
  cards: Array,
  dealer: {
    hand: Array,
    hiddenCards: Array,
    points: {
      type: Number,
      default: 0,
    },
  },
  player: {
    hand: Array,
    points: {
      type: Number,
      default: 0,
    },
    isPlayerTurn: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60, // expires in 24 hours
  },
});

// methods

gameSchema.methods.setPlayerPoints = function (): void {
  this.player.points = calculatePoints(this.player.hand);
};

gameSchema.methods.setDealerPoints = function (): void {
  this.dealer.points = calculatePoints(this.dealer.hand);
};

gameSchema.methods.setPlayerTurn = function (): void {
  this.player.isPlayerTurn = true;
};

gameSchema.methods.setDealerTurn = function (): void {
  this.player.isPlayerTurn = false;
};

gameSchema.methods.getCardForPlayer = function () {
  const card = this.cards.shift();
  this.player.hand.push(card);
  this.setPlayerPoints();
};

gameSchema.methods.getCardForDealer = function () {
  const card = this.dealer.hiddenCards?.pop() ?? this.cards.shift();
  this.dealer.hand.push(card);
  this.setDealerPoints();
};

gameSchema.methods.getHiddenCardsForDealer = function () {
  const card = this.cards.shift();
  this.dealer.hiddenCards = card;
};

gameSchema.methods.shouldPlayerDrawCard = function (): boolean {
  return this.player.points < 21;
};

gameSchema.methods.shouldDealerDrawCard = function (): boolean {
  return this.dealer.points < 17;
};

gameSchema.methods.isBlackjack = function (): boolean {
  return this.player.hand.length === 2 && this.player.points === 21;
};

gameSchema.methods.isLost = function (): boolean {
  return (
    (this.player.points < 21 &&
      this.dealer.points >= 17 &&
      this.dealer.points <= 21 &&
      this.player.points < this.dealer.points) ||
    this.player.points > 21
  );
};

gameSchema.methods.isDraw = function (): boolean {
  return this.player.points === this.dealer.points && this.player.points <= 21;
};

gameSchema.methods.isWon = function (): boolean {
  return (
    (this.player.points > this.dealer.points ||
      (this.player.points < this.dealer.points && this.dealer.points > 21)) &&
    this.player.points <= 21
  );
};

gameSchema.methods.startGame = function (): void {
  this.cards = shuffleDeck();
  for (let i = 0; i < 2; i++) {
    this.getCardForPlayer();
  }
  this.getCardForDealer();
  this.getHiddenCardsForDealer();
};

gameSchema.methods.resetGame = function () {
  this.dealer.points = 0;
  this.dealer.hand = [];
  this.dealer.hiddenCards = undefined;
  this.player.points = 0;
  this.player.hand = [];
  this.setPlayerTurn();
};

const Game = mongoose.model<GameDocument>('Game', gameSchema);
export default Game;
