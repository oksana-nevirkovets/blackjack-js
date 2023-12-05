import { Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { CardsListProps } from './CardsList.type';
import Card from '../Card/Card';

const CardsList: FC<CardsListProps> = ({ cards, hiddenCards }) => {
  return (
    <Flex>
      {cards.map((card, index) => (
        <Card key={card.id} card={card} index={index} />
      ))}
      {hiddenCards?.map((card, index) => <Card key={card.id} card={card} index={index} isHidden />)}
    </Flex>
  );
};

export default CardsList;
