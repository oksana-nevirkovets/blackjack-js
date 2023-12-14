import { TableController } from './tableController';
import { GameEvents } from '../constants';
import { WebSocketWithSessionData } from '../types';

export const gameController = (socket: WebSocketWithSessionData, event: string): void => {
  switch (event) {
    case GameEvents.START_GAME:
      TableController.startGame(socket);
      break;
    case GameEvents.HIT:
      TableController.hit(socket);
      break;
    case GameEvents.STAND:
      TableController.stand(socket);
      break;
    default:
      console.warn(`Unhandled event: ${event}`);
      return;
  }
};
