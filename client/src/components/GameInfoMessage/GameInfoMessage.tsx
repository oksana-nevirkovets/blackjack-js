import { FC } from "react";
import { GameInfoMessageProps } from "./GameInfoMessage.type";
import { Fade, Flex, Heading } from "@chakra-ui/react";

const GameInfoMessage: FC<GameInfoMessageProps> = ({ message }) => {
  return (
    <Fade in={true}>
      <Flex
        pos="fixed"
        top="0"
        left="0"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <Flex
          p="40px"
          color="white"
          mt="4"
          bg="teal.500"
          rounded="md"
          shadow="md"
          direction="column"
          gap="8"
          align="center"
          h="200px"
          justify="center"
        >
          <Heading as="h4" size="lg">
            {message}
          </Heading>
        </Flex>
      </Flex>
    </Fade>
  );
};

export default GameInfoMessage;
