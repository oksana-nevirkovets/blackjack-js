import { GameEvents, GameMessages } from '../constants';
import { Game } from '../models';
import { GameDocument, WebSocketWithSessionData } from '../types';

export class TableController {
  static async startGame(socket: WebSocketWithSessionData) {
    const game = new Game();
    game.startGame();
    game.save();
    socket.sessionData = {
      gameId: game.id,
    };
    socket.send(JSON.stringify({ event: GameEvents.START_GAME, data: game }));
    if (game?.isBlackjack()) {
      game.getCardForDealer();

      await this.delay(1500);

      if (game.isDraw()) {
        this.endGame(socket, GameMessages.IT_IS_A_TIE);
        return;
      }
      this.endGame(socket, GameMessages.BLACKJACK);
    }
  }

  static async hit(socket: WebSocketWithSessionData): Promise<void> {
    const game = await this.getGame(socket);
    if (!game) return;
    game.getCardForPlayer();
    game.save();
    socket.send(JSON.stringify({ event: GameEvents.HIT, data: game }));
    if (game.isLost()) {
      this.endGame(socket, GameMessages.YOU_LOST);
      return;
    }

    if (!game.shouldPlayerDrawCard()) {
      this.dealerIsPlaying(socket, game, () => {
        this.getResults(socket);
      });
    }
  }

  static async stand(socket: WebSocketWithSessionData): Promise<void> {
    const game = await this.getGame(socket);
    if (!game) return;
    socket.send(
      JSON.stringify({ event: GameEvents.SHOW_MESSAGE, message: GameMessages.DEALERS_TURN }),
    );
    this.dealerIsPlaying(socket, game, () => {
      this.getResults(socket);
    });
  }

  static dealerIsPlaying(
    socket: WebSocketWithSessionData,
    game: GameDocument,
    callback: () => void,
    drawInterval = 1500,
  ): void {
    game.setDealerTurn();
    const drawCardInterval = setInterval(async () => {
      if (game && game.shouldDealerDrawCard()) {
        game.getCardForDealer();
        game.save();
        socket.send(JSON.stringify({ event: GameEvents.STAND, data: game }));
      } else {
        clearInterval(drawCardInterval);
        callback();
      }
    }, drawInterval);
  }

  static async getResults(socket: WebSocketWithSessionData): Promise<void> {
    const game = await this.getGame(socket);
    if (!game) return;
    if (game.isLost()) {
      this.endGame(socket, GameMessages.YOU_LOST);
    }
    if (game.isDraw()) {
      this.endGame(socket, GameMessages.IT_IS_A_TIE);
    }
    if (game.isWon()) {
      this.endGame(socket, GameMessages.YOU_WON);
    }
    await this.delay(1500);
    game.resetGame();
    game.save();
  }

  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private static async getGame(socket: WebSocketWithSessionData): Promise<GameDocument | null> {
    const gameId = socket.sessionData?.gameId;
    if (!gameId) return null;

    const game = await Game.findById(gameId);
    return game;
  }

  private static endGame(socket: WebSocketWithSessionData, message: string): void {
    socket.send(JSON.stringify({ event: GameEvents.END_GAME, message }));
  }
}
