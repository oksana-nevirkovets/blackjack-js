import { Card as CardType } from '../../types';

export interface CardProps {
  card: CardType;
  index: number;
  isHidden?: boolean;
}
