import { ChakraProvider, Container } from '@chakra-ui/react';
import GameTable from './components/GameTable/GameTable';
import Header from './components/Header/Header';
import GameInfoMessage from './components/GameInfoMessage/GameInfoMessage';
import StartGameModal from './components/StartGameModal/StartGameModal';
import { theme } from './theme';
import useWebSocketService from './services/WebSocketService';

function App() {
  const {
    isGameInProgress,
    gameData,
    gameMessage,
    onHitButtonClick,
    onStandButtonClick,
    onStartGameButtonClick,
  } = useWebSocketService();

  return (
    <ChakraProvider theme={theme}>
      <Header onGameStart={onStartGameButtonClick} />
      <Container>
        <>
          {gameData && (
            <>
              <GameTable
                dealer={gameData?.dealer}
                player={gameData?.player}
                onHit={onHitButtonClick}
                onStand={onStandButtonClick}
              />
              {gameMessage && isGameInProgress && <GameInfoMessage message={gameMessage} />}
            </>
          )}
          {!isGameInProgress && (
            <StartGameModal
              onGameStart={onStartGameButtonClick}
              message={gameMessage}
              dealerPoints={gameData?.dealer?.points}
              playerPoints={gameData?.player?.points}
            />
          )}
        </>
      </Container>
    </ChakraProvider>
  );
}

export default App;
