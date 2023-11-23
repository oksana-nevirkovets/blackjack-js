import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { GameData } from '../types';

const WSS_FEED_URL = 'ws://localhost:4000';

interface UseWebSocketServiceReturn {
  isGameInProgress: boolean;
  gameData?: GameData;
  gameMessage?: string;
  onHitButtonClick: () => void;
  onStandButtonClick: () => void;
  onStartGameButtonClick: () => void;
}
const useWebSocketService = (): UseWebSocketServiceReturn => {
  const [isGameInProgress, setGameInProgress] = useState(false);
  const [gameData, setGameData] = useState<GameData>();
  const [gameMessage, setGameMessage] = useState<string>();

  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: () => true,
    onMessage: event => processMessages(event),
  });

  const processMessages = (event: { data: string }) => {
    const { event: gameEvent, data: socketData, message } = JSON.parse(event.data) || {};
    const isGameEnded = gameEvent === 'end_game';

    setGameMessage(message);
    setGameInProgress(!isGameEnded);

    if (!isGameEnded && socketData) {
      setGameData(socketData);
    }
  };

  const onHitButtonClick = () => {
    sendJsonMessage({ event: 'hit' });
  };

  const onStandButtonClick = () => {
    sendJsonMessage({ event: 'stand' });
  };

  const onStartGameButtonClick = () => {
    sendJsonMessage({ event: 'start_game' });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameInProgress && gameMessage) {
      timer = setTimeout(() => setGameMessage(undefined), 1500);
    }
    return () => clearTimeout(timer);
  }, [isGameInProgress, gameMessage]);

  return {
    isGameInProgress,
    gameData,
    gameMessage,
    onHitButtonClick,
    onStandButtonClick,
    onStartGameButtonClick,
  };
};

export default useWebSocketService;
