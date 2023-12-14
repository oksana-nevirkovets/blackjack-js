import { TableController, gameController } from '../src/controllers';
import { WebSocketWithSessionData } from '../src/types';
import { GameEvents } from '../src/constants';

const mockedSocket = {
  send: jest.fn(),
} as unknown as WebSocketWithSessionData;

describe('gameController', () => {
  beforeEach(() => {
    jest.spyOn(TableController, 'startGame').mockImplementation(() => Promise.resolve());
    jest.spyOn(TableController, 'hit').mockImplementation(() => Promise.resolve());
    jest.spyOn(TableController, 'stand').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should call TableController.startGame for START_GAME event', () => {
    gameController(mockedSocket, GameEvents.START_GAME);
    expect(TableController.startGame).toHaveBeenCalledWith(mockedSocket);
  });

  it('should call TableController.hit for HIT event', () => {
    gameController(mockedSocket, GameEvents.HIT);
    expect(TableController.hit).toHaveBeenCalledWith(mockedSocket);
  });

  it('should call TableController.stand for STAND event', () => {
    gameController(mockedSocket, GameEvents.STAND);
    expect(TableController.stand).toHaveBeenCalledWith(mockedSocket);
  });

  it('should not call any function for an unknown event', () => {
    gameController(mockedSocket, 'UNKNOWN_EVENT');
    expect(TableController.startGame).not.toHaveBeenCalled();
    expect(TableController.hit).not.toHaveBeenCalled();
    expect(TableController.stand).not.toHaveBeenCalled();
  });
});
