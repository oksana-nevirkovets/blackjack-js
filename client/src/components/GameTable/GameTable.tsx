import { Button, Flex, Grid, Heading } from "@chakra-ui/react";
import { FC } from "react";
import Cards from "../Cards/Cards";

const GameTable: FC<any> = ({ dealer, player, onHit, onStand }) => {
  if (!dealer || !player) {
    return (
      <Heading as="h3" size="2xl" color="gray.50" mt="30">
        Ooops! Something went wrong...
      </Heading>
    );
  }
  return (
    <Flex direction="column" align="center" gap="12" mt="30">
      <Flex direction="column" align="center" gap="6">
        <Heading as="h4" size="lg" color="gray.50">
          Dealer's Hand: <span>{dealer.hiddenCards?.length ? "?" : dealer.points}</span>
        </Heading>
        {dealer.hand.length && <Cards hiddenCards={dealer.hiddenCards} cards={dealer.hand} />}
      </Flex>
      <Grid templateColumns="repeat(2, 1fr)" gap="6">
        <Button colorScheme="teal" onClick={onHit} isDisabled={!player.isPlayerTurn}>
          Hit
        </Button>
        <Button colorScheme="teal" onClick={onStand} isDisabled={!player.isPlayerTurn}>
          Stand
        </Button>
      </Grid>
      <Flex direction="column" align="center" gap="6">
        <Heading as="h4" size="lg" color="gray.50">
          Player's Hand: <span>{player.points}</span>
        </Heading>
        {player.hand.length && <Cards cards={player.hand} />}
      </Flex>
    </Flex>
  );
};

export default GameTable;
