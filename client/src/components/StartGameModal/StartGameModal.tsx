import { Button, Fade, Flex, Heading } from "@chakra-ui/react";
import { FC } from "react";
import { StartGameModalProps } from "./StartGameModal.type";

const StartGameModal: FC<StartGameModalProps> = ({
  onGameStart,
  message,
  dealerPoints,
  playerPoints,
}) => {
  return (
    <Fade in={true} delay={0.75}>
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
          h="400px"
          justify="center"
        >
          <Heading as="h4" size="lg">
            {message ?? "Press 'New Game' to begin!"}
          </Heading>
          {dealerPoints && playerPoints && (
            <Flex gap="8">
              <Heading as="h5" size="md">
                Dealer: <span>{dealerPoints}</span>
              </Heading>
              <Heading as="h5" size="md">
                Player: <span>{playerPoints}</span>
              </Heading>
            </Flex>
          )}
          <Button w="fit-content" onClick={onGameStart}>
            New Game
          </Button>
        </Flex>
      </Flex>
    </Fade>
  );
};

export default StartGameModal;
