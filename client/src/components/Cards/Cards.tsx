import { Flex, Image } from '@chakra-ui/react';
import { FC } from 'react';
import CardBack from '../../assets/card-back.svg';
import { CardsProps } from './Cards.type';

const Cards: FC<CardsProps> = ({ cards, hiddenCards }) => {
  return (
    <Flex>
      {cards.map((card: any, index: number) => {
        const cardImg = require(`../../assets/${card.id}.svg`);
        return (
          <Image
            src={cardImg}
            alt={card.id}
            w="100px"
            h="fit-content"
            pos="relative"
            left={index !== 0 ? '-50px' : 0}
            mr={index !== 0 ? '-50px' : 0}
            filter="drop-shadow(-3px 2px 6px RGBA(0, 0, 0, 0.74))"
          />
        );
      })}
      {hiddenCards?.map(() => {
        return (
          <Image
            src={CardBack}
            alt="card back"
            w="100px"
            h="fit-content"
            pos="relative"
            left="-50px"
            mr="-50px"
            filter="drop-shadow(-3px 2px 6px RGBA(0, 0, 0, 0.74))"
          />
        );
      })}
    </Flex>
  );
};

export default Cards;
