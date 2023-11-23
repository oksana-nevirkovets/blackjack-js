import { WebSocket } from 'ws';

export interface WebSocketWithSessionData extends WebSocket {
  sessionData?: SessionData;
}

export interface SessionData {
  gameId?: string;
}
