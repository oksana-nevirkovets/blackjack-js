# blackjack-js

## Game Rules

The goal of blackjack is to beat the dealer by having a hand value as close to 21 as possible without exceeding 21.

### Initial Deal:

- The player and the dealer, is dealt two cards.
- Players' cards are usually dealt face up, while one of the dealer's cards is face up (known as the "upcard"), and the other is face down (the "hole card").

### Player's Turn:

- Players can choose to "hit" (receive another card) or "stand" (keep their current hand).
- Players can continue to hit as many times as they ListItemke, but if the total value of their hand exceeds 21, they "bust" and lose the round.

### Dealer's Turn:

- The dealer reveals their hole card.
- The dealer must hit until their hand value is 17 or higher.

### Winning:

- If a player's hand is closer to 21 than the dealer's hand without going over 21, the player wins.
- If the dealer busts (exceeds 21), all remaining players win.
- If both the player and the dealer have the same hand value, it's a "push" (a tie), and the player neither wins nor loses.
- If a player is dealt an Ace and a 10-value card (10, Jack, Queen, King) as their initial two cards, it's called a "blackjack."

## Technologies

- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Jest](https://jestjs.io)
- [Chakra_UI](https://chakra-ui.com)
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Husky](https://typicode.github.io/husky/#/)
- [mongoose](https://mongoosejs.com/)
- [express](https://expressjs.com/)

## Install

```
yarn install
```

## Running locally

In order to run the app locally you need to rename `.env.example` file to `.env` and populate `MONGODB_URI` to be able to use constants needed for the successful website work.

```
MONGODB_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<DB_URL>/?retryWrites=true&w=majority;
```

Run the development server:

```
yarn start
```

Open `http://localhost:3000` with your browser to play the game.

## Running Tests

In order to run tests please run the following command from root of the repo:

```
yarn test
```
