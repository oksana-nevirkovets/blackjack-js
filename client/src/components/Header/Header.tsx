import {
  Box,
  Button,
  Flex,
  Heading,
  Slide,
  Spacer,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { FC } from "react";
import { GrPowerReset } from "react-icons/gr";
import { PiQuestion } from "react-icons/pi";
import GameRules from "../GameRules/GameRules";
import { HeaderProps } from "./Header.type";

const Header: FC<HeaderProps> = ({ onGameStart }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  return (
    <>
      <Flex h="20" pos="sticky" zIndex="11" bg="gray.50">
        <Heading as="h1" size="2xl" noOfLines={1} p="4">
          BlackJack
        </Heading>
        <Spacer />
        <Flex p="4" gap="6" alignItems="center">
          <Button colorScheme="teal" onClick={onGameStart} title="Reset Game">
            {isLargerThan800 ? "Reset Game" : <GrPowerReset />}
          </Button>
          <Button colorScheme="teal" onClick={onToggle} title="Rules">
            {isLargerThan800 ? "Rules" : <PiQuestion />}
          </Button>
        </Flex>
      </Flex>
      <Slide direction="top" in={isOpen} style={{ zIndex: 10 }}>
        <Box p="40px" color="blackAlpha.800" mt="20" bg="gray.50" shadow="md" maxHeight="90vh">
          <GameRules />
        </Box>
      </Slide>
    </>
  );
};

export default Header;
