import { Dealer, Player } from "../../types";

export interface GameTableProps {
  dealer: Dealer;
  player: Player;
  onHit: () => void;
  onStand: () => void;
}
