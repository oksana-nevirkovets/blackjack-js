import { Dealer, Player } from "../../types";

export interface BoardProps {
  dealer: Dealer;
  player: Player;
  onHit: () => void;
  onStand: () => void;
}
