import { Image, SlideFade, Box } from '@chakra-ui/react';
import { FC } from 'react';
import CardBack from '../../assets/card-back.svg';
import { CardProps } from './Card.type';

const Card: FC<CardProps> = ({ card, index, isHidden }) => {
  const positionOffset = !isHidden && index === 0 ? 0 : '-50px';
  return (
    <Box
      key={card.id}
      pos="relative"
      left={positionOffset}
      mr={positionOffset}
      filter="drop-shadow(-3px 2px 6px RGBA(0, 0, 0, 0.74))"
    >
      <SlideFade in={true} offsetY="-20px" delay={index * 0.03}>
        <Image
          src={isHidden ? CardBack : require(`../../assets/${card.id}.svg`)}
          alt={isHidden ? 'card back' : card.id}
          w="100px"
          h="fit-content"
        />
      </SlideFade>
    </Box>
  );
};

export default Card;
