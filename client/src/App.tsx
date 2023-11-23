import { ChakraProvider, Container } from "@chakra-ui/react";
import Header from "./components/Header/Header";
import StartGameModal from "./components/StartGameModal/StartGameModal";
import { useEffect, useState } from "react";
import Board from "./components/Board/Board";
import useWebSocket from "react-use-websocket";
import InfoMessage from "./components/InfoMessage/InfoMessage";
import { theme } from "./styles/theme";

const WSS_FEED_URL = "ws://localhost:4000";

function App() {
  const [isGameInProgress, setGameInProgress] = useState(false);
  const [gameData, setGameData] = useState<any>();
  const [gameMessage, setGameMessage] = useState<string>();
  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    onOpen: () => console.log("WebSocket connection opened."),
    onClose: () => console.log("WebSocket connection closed."),
    shouldReconnect: () => true,
    onMessage: (event: WebSocketEventMap["message"]) => processMessages(event),
  });

  const processMessages = (event: { data: string }) => {
    const { event: gameEvent, data: socketData, message } = JSON.parse(event.data) || {};
    console.log(socketData, message, gameEvent);
    const isGameEnded = gameEvent === "endGame";
    setGameMessage(message);
    setGameInProgress(!isGameEnded);
    if (!isGameEnded && socketData) {
      setGameData(socketData);
    }
  };

  const onHitButtonClick = () => {
    sendJsonMessage({ event: "hit" });
  };

  const onStandButtonClick = () => {
    sendJsonMessage({ event: "stand" });
  };

  const onStartGameButtonClick = () => {
    sendJsonMessage({ event: "startGame" });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameInProgress && gameMessage) {
      timer = setTimeout(() => setGameMessage(undefined), 1000);
    }
    return () => clearTimeout(timer);
  }, [isGameInProgress, gameMessage]);

  return (
    <ChakraProvider theme={theme}>
      <Header onGameStart={onStartGameButtonClick} />
      <Container>
        {isGameInProgress ? (
          <>
            <Board
              dealer={gameData?.dealer}
              player={gameData?.player}
              onHit={onHitButtonClick}
              onStand={onStandButtonClick}
            />
            {gameMessage && <InfoMessage message={gameMessage} />}
          </>
        ) : (
          <StartGameModal
            onGameStart={onStartGameButtonClick}
            message={gameMessage}
            dealerPoints={gameData?.dealer?.points}
            playerPoints={gameData?.player?.points}
          />
        )}
      </Container>
    </ChakraProvider>
  );
}

export default App;
