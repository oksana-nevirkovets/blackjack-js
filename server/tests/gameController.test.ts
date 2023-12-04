import mongoose from 'mongoose';
import { TableGameController, gameController } from '../src/controllers/gameController';
import { WebSocketWithSessionData } from '../src/types/websocket';
import Game from '../src/models/game';
import { GameEvents, GameMessages } from '../src/constants';
import { GameDocument } from '../src/types/game';

const gameId = new mongoose.Types.ObjectId().toHexString();

const mockedSocket = {
  send: jest.fn(),
  sessionData: {
    gameId,
  },
} as unknown as WebSocketWithSessionData;

describe('TableGameController', () => {
  describe('startGame', () => {
    let game: GameDocument;
    beforeEach(() => {
      game = new Game({ _id: gameId });
      game.startGame();
      jest.spyOn(Game.prototype, 'save').mockResolvedValueOnce(game);
      jest.spyOn(Game.prototype, 'startGame').mockResolvedValueOnce(game);
      jest.spyOn(Game.prototype, 'getCardForDealer').mockResolvedValueOnce(game);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should start a new game and send the START_GAME event', async () => {
      const mockedSocket = {
        send: jest.fn(),
      } as unknown as WebSocketWithSessionData;
      jest.spyOn(Game.prototype, 'isBlackjack').mockReturnValueOnce(false);

      await TableGameController.startGame(mockedSocket);

      expect(Game.prototype.startGame).toHaveBeenCalled();
      expect(Game.prototype.save).toHaveBeenCalled();
      expect(Game.prototype.isBlackjack).toHaveBeenCalled();
      expect(mockedSocket.send).toHaveBeenCalledTimes(1);
    });
    it('should send the END_GAME event with BLACKJACK message if the game is blackjack', async () => {
      jest.spyOn(Game.prototype, 'isBlackjack').mockReturnValue(true);
      jest.spyOn(Game.prototype, 'isDraw').mockReturnValue(false);
      jest.spyOn(TableGameController, 'delay').mockImplementationOnce(() => Promise.resolve());

      await TableGameController.startGame(mockedSocket);
      expect(mockedSocket.send).toHaveBeenCalledWith(
        JSON.stringify({ event: GameEvents.END_GAME, message: GameMessages.BLACKJACK }),
      );
    });
    it('should send the IT_IS_A_TIE event if the player and the delear got a blackjack on the first two cards', async () => {
      jest.spyOn(Game.prototype, 'isBlackjack').mockReturnValue(true);
      jest.spyOn(Game.prototype, 'isDraw').mockReturnValue(true);
      jest.spyOn(TableGameController, 'delay').mockImplementationOnce(() => Promise.resolve());

      await TableGameController.startGame(mockedSocket);
      expect(mockedSocket.send).toHaveBeenCalledWith(
        JSON.stringify({ event: GameEvents.END_GAME, message: GameMessages.IT_IS_A_TIE }),
      );
    });
  });
  describe('hit', () => {
    let game: GameDocument;
    beforeEach(() => {
      game = new Game({ _id: gameId });
      game.startGame();
      jest.spyOn(Game, 'findById').mockResolvedValueOnce(game);
      jest.spyOn(game, 'save').mockResolvedValueOnce(game);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should get a card for the player and send the HIT event', async () => {
      jest.spyOn(game, 'getCardForPlayer');

      await TableGameController.hit(mockedSocket);

      expect(game.getCardForPlayer).toHaveBeenCalled();
      expect(game.save).toHaveBeenCalled();
      expect(mockedSocket.send).toHaveBeenNthCalledWith(
        1,
        JSON.stringify({ event: GameEvents.HIT, data: game }),
      );
    });
    it('should send the END_GAME event with YOU_LOST message if the player is lost', async () => {
      jest.spyOn(game, 'isLost').mockReturnValueOnce(true);

      await TableGameController.hit(mockedSocket);

      expect(mockedSocket.send).toHaveBeenNthCalledWith(
        2,
        JSON.stringify({ event: GameEvents.END_GAME, message: GameMessages.YOU_LOST }),
      );
    });
    it('should call dealerIsPlaying if shouldPlayerDrawCard is false', async () => {
      jest.spyOn(game, 'isLost').mockReturnValueOnce(false);
      jest.spyOn(game, 'shouldPlayerDrawCard').mockReturnValueOnce(false);
      jest.spyOn(TableGameController, 'dealerIsPlaying').mockImplementationOnce(() => jest.fn());
      await TableGameController.hit(mockedSocket);

      expect(TableGameController.dealerIsPlaying).toHaveBeenCalled();
    });
  });

  describe('stand', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should send SHOW_MESSAGE event and call dealerIsPlaying', async () => {
      const game = new Game({ _id: gameId });
      game.startGame();

      jest.spyOn(Game, 'findById').mockResolvedValueOnce(game);
      jest.spyOn(TableGameController, 'dealerIsPlaying').mockImplementationOnce(() => jest.fn());

      await TableGameController.stand(mockedSocket);

      expect(mockedSocket.send).toHaveBeenCalledWith(
        JSON.stringify({ event: GameEvents.SHOW_MESSAGE, message: GameMessages.DEALERS_TURN }),
      );
      expect(TableGameController.dealerIsPlaying).toHaveBeenCalled();
    });
  });

  describe('dealerIsPlaying', () => {
    const callbackMock = jest.fn();
    let game: GameDocument;
    beforeEach(() => {
      game = new Game({ _id: gameId });
      game.startGame();
      jest.spyOn(game, 'save').mockResolvedValue(game);
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.useRealTimers();
    });
    it('should send STAND event and call callback if shouldDealerDrawCard is false', async () => {
      jest.spyOn(game, 'shouldDealerDrawCard').mockReturnValue(false);
      jest.spyOn(game, 'getCardForDealer');
      jest.spyOn(game, 'setDealerTurn');

      TableGameController.dealerIsPlaying(mockedSocket, game, callbackMock, 0);
      jest.runAllTimers();
      expect(game.setDealerTurn).toHaveBeenCalled();

      expect(game.getCardForDealer).not.toHaveBeenCalled();
      expect(game.save).not.toHaveBeenCalled();
      expect(callbackMock).toHaveBeenCalled();
    });

    it('should send STAND event and call callback multiple times if shouldDealerDrawCard is true', async () => {
      jest
        .spyOn(game, 'shouldDealerDrawCard')
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      jest.spyOn(game, 'getCardForDealer');

      TableGameController.dealerIsPlaying(mockedSocket, game, callbackMock, 10);

      jest.advanceTimersByTime(10);

      expect(game.getCardForDealer).toHaveBeenCalledTimes(1);
      expect(game.save).toHaveBeenCalledTimes(1);
      expect(mockedSocket.send).toHaveBeenCalledTimes(1);
      expect(mockedSocket.send).toHaveBeenCalledWith(
        JSON.stringify({ event: GameEvents.STAND, data: game }),
      );
      expect(callbackMock).not.toHaveBeenCalled();

      jest.advanceTimersByTime(10);
      expect(game.getCardForDealer).toHaveBeenCalledTimes(2);
      expect(game.save).toHaveBeenCalledTimes(2);
      expect(mockedSocket.send).toHaveBeenCalledTimes(2);
      expect(callbackMock).not.toHaveBeenCalled();

      jest.advanceTimersByTime(10);
      expect(game.getCardForDealer).toHaveBeenCalledTimes(2);
      expect(game.save).toHaveBeenCalledTimes(2);
      expect(mockedSocket.send).toHaveBeenCalledTimes(2);
      expect(callbackMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getResults', () => {
    let game: GameDocument;
    beforeEach(() => {
      game = new Game({ _id: gameId });
      game.startGame();
      jest.spyOn(Game, 'findById').mockResolvedValueOnce(game);
      jest.spyOn(game, 'save').mockResolvedValueOnce(game);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('should send YOU_LOST event if the game is lost', async () => {
      jest.spyOn(game, 'isLost').mockReturnValueOnce(true);

      await TableGameController.getResults(mockedSocket);

      expect(mockedSocket.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: GameEvents.END_GAME,
          message: GameMessages.YOU_LOST,
        }),
      );
      expect(game.save).toHaveBeenCalled();
    });
    it('should send IT_IS_A_TIE event if the game is a draw', async () => {
      jest.spyOn(game, 'isDraw').mockReturnValueOnce(true);

      await TableGameController.getResults(mockedSocket);

      expect(mockedSocket.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: GameEvents.END_GAME,
          message: GameMessages.IT_IS_A_TIE,
        }),
      );
      expect(game.save).toHaveBeenCalled();
    });

    it('should send YOU_WON event if the game is won', async () => {
      jest.spyOn(game, 'isWon').mockReturnValueOnce(true);

      await TableGameController.getResults(mockedSocket);

      expect(mockedSocket.send).toHaveBeenCalledWith(
        JSON.stringify({
          event: GameEvents.END_GAME,
          message: GameMessages.YOU_WON,
        }),
      );
      expect(game.save).toHaveBeenCalled();
    });

    it('should reset the game after a delay', async () => {
      jest.spyOn(game, 'isWon').mockReturnValueOnce(true);
      jest.spyOn(game, 'resetGame');
      jest.spyOn(TableGameController, 'delay').mockImplementationOnce(() => Promise.resolve());

      await TableGameController.getResults(mockedSocket);

      expect(TableGameController.delay).toHaveBeenCalledWith(1500);
      expect(game.resetGame).toHaveBeenCalled();
      expect(game.save).toHaveBeenCalled();
    });
  });
});

describe('gameController', () => {
  beforeEach(() => {
    jest.spyOn(TableGameController, 'startGame').mockImplementation(() => Promise.resolve());
    jest.spyOn(TableGameController, 'hit').mockImplementation(() => Promise.resolve());
    jest.spyOn(TableGameController, 'stand').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call TableGameController.startGame for START_GAME event', () => {
    gameController(mockedSocket, GameEvents.START_GAME);
    expect(TableGameController.startGame).toHaveBeenCalledWith(mockedSocket);
  });

  it('should call TableGameController.hit for HIT event', () => {
    gameController(mockedSocket, GameEvents.HIT);
    expect(TableGameController.hit).toHaveBeenCalledWith(mockedSocket);
  });

  it('should call TableGameController.stand for STAND event', () => {
    gameController(mockedSocket, GameEvents.STAND);
    expect(TableGameController.stand).toHaveBeenCalledWith(mockedSocket);
  });

  it('should not call any function for an unknown event', () => {
    gameController(mockedSocket, 'UNKNOWN_EVENT');
    expect(TableGameController.startGame).not.toHaveBeenCalled();
    expect(TableGameController.hit).not.toHaveBeenCalled();
    expect(TableGameController.stand).not.toHaveBeenCalled();
  });
});
