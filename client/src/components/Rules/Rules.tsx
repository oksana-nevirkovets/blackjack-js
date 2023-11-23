import { Box, ListItem, List, Text, Icon } from "@chakra-ui/react";
import { PiPokerChip } from "react-icons/pi";
import { FC } from "react";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const ListItemWithIcon: FC<Props> = ({ children }) => {
  return (
    <ListItem fontSize="sm">
      <Icon as={PiPokerChip} color="red.600" mr="1" w="4" />
      {children}
    </ListItem>
  );
};

const Rules: FC = () => {
  return (
    <Box overflowY="auto">
      <Text fontSize="md" mb="4">
        The goal of blackjack is to beat the dealer by having a hand value as close to 21 as
        possible without exceeding 21.
      </Text>
      <List mb="4">
        <Text fontSize="md" fontWeight="700">
          Initial Deal:
        </Text>
        <ListItemWithIcon>The player and the dealer, is dealt two cards.</ListItemWithIcon>
        <ListItemWithIcon>
          Players' cards are usually dealt face up, while one of the dealer's cards is face up
          (known as the "upcard"), and the other is face down (the "hole card").
        </ListItemWithIcon>
      </List>
      <List mb="4">
        <Text fontSize="md" fontWeight="700">
          Player's Turn:
        </Text>
        <ListItemWithIcon>
          Players can choose to "hit" (receive another card) or "stand" (keep their current hand).
        </ListItemWithIcon>
        <ListItemWithIcon>
          Players can continue to hit as many times as they ListItemke, but if the total value of
          their hand exceeds 21, they "bust" and lose the round.
        </ListItemWithIcon>
      </List>
      <List mb="4">
        <Text fontSize="md" fontWeight="700">
          Dealer's Turn:
        </Text>
        <ListItemWithIcon>The dealer reveals their hole card.</ListItemWithIcon>
        <ListItemWithIcon>
          The dealer must hit until their hand value is 17 or higher.
        </ListItemWithIcon>
      </List>
      <List mb="4">
        <Text fontSize="md" fontWeight="700">
          Winning:
        </Text>
        <ListItemWithIcon>
          If a player's hand is closer to 21 than the dealer's hand without going over 21, the
          player wins.
        </ListItemWithIcon>
        <ListItemWithIcon>
          If the dealer busts (exceeds 21), all remaining players win.
        </ListItemWithIcon>
        <ListItemWithIcon>
          If both the player and the dealer have the same hand value, it's a "push" (a tie), and the
          player neither wins nor loses.
        </ListItemWithIcon>
        <ListItemWithIcon>
          If a player is dealt an Ace and a 10-value card (10, Jack, Queen, King) as their initial
          two cards, it's called a "blackjack."
        </ListItemWithIcon>
      </List>
    </Box>
  );
};

export default Rules;
