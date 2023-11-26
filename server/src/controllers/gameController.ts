import { GameEvents, GameMessages } from '../constants';
import Game from '../models/game';
import { GameDocument } from '../types/game';
import { WebSocketWithSessionData } from '../types/websocket';

export class TableGameController {
  static async startGame(socket: WebSocketWithSessionData) {
    const game = new Game();
    game.startGame();
    game.save();
    socket.sessionData = {
      gameId: game.id,
    };
    socket.send(JSON.stringify({ event: GameEvents.START_GAME, data: game }));
    if (game?.isBlackjack()) {
      await TableGameController.delay(1500);
      socket.send(
        JSON.stringify({
          event: GameEvents.END_GAME,
          message: GameMessages.BLACKJACK,
        }),
      );
    }
  }

  static hit(socket: WebSocketWithSessionData): void {
    const gameId = socket.sessionData?.gameId;
    if (!gameId) return;

    Game.findById(gameId).then(game => {
      if (!game) return;

      game.getCardForPlayer();
      game.save();
      socket.send(JSON.stringify({ event: GameEvents.HIT, data: game }));
      if (game.isLost()) {
        socket.send(
          JSON.stringify({
            event: GameEvents.END_GAME,
            message: GameMessages.YOU_LOST,
          }),
        );
        return;
      }

      if (!game.shouldPlayerDrawCard()) {
        TableGameController.dealerIsPlaying(socket, game, () => {
          TableGameController.getResults(socket);
        });
      }
    });
  }

  static stand(socket: WebSocketWithSessionData): void {
    const gameId = socket.sessionData?.gameId;
    if (!gameId) return;

    Game.findById(gameId).then(game => {
      if (!game) return;
      socket.send(
        JSON.stringify({ event: GameEvents.SHOW_MESSAGE, message: GameMessages.DEALERS_TURN }),
      );
      TableGameController.dealerIsPlaying(socket, game, () => {
        TableGameController.getResults(socket);
      });
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

  static async getResults(socket: WebSocketWithSessionData) {
    const gameId = socket.sessionData?.gameId;
    if (!gameId) return;

    const game = await Game.findById(gameId);
    if (!game) return;
    if (game.isLost()) {
      socket.send(
        JSON.stringify({
          event: GameEvents.END_GAME,
          message: GameMessages.YOU_LOST,
        }),
      );
    }
    if (game.isDraw()) {
      socket.send(
        JSON.stringify({
          event: GameEvents.END_GAME,
          message: GameMessages.IT_IS_A_TIE,
        }),
      );
    }
    if (game.isWon()) {
      socket.send(
        JSON.stringify({
          event: GameEvents.END_GAME,
          message: GameMessages.YOU_WON,
        }),
      );
    }
    await TableGameController.delay(1500);
    game.resetGame();
    game.save();
  }

  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const gameController = (socket: WebSocketWithSessionData, message: string): void => {
  switch (message) {
    case GameEvents.START_GAME:
      TableGameController.startGame(socket);
      break;
    case GameEvents.HIT:
      TableGameController.hit(socket);
      break;
    case GameEvents.STAND:
      TableGameController.stand(socket);
      break;
    default:
      return;
  }
};
