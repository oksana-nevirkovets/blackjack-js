export interface StartGameModalProps {
  onGameStart: () => void;
  message?: string;
  dealerPoints?: number;
  playerPoints?: number;
}
