import Game from "../src/models/game";
import * as utils from "../src/utils/cardUtils";

describe("Game Model", () => {
  it("should start the game with initial conditions", () => {
    const game = new Game();
    game.startGame();

    expect(game.cards.length).toBe(48); // Assuming 2 cards are dealt to the player and 1 to the dealer
    expect(game.player.hand.length).toBe(2);
    expect(game.dealer.hand.length).toBe(1); // One card face up
    expect(game.dealer.hiddenCards).not.toBeNull();
  });
  it("should allow player to hit and update points", () => {
    const game = new Game();
    game.startGame();

    const initialPoints = game.player.points;
    game.getCardForPlayer();

    expect(game.player.hand.length).toBe(3);
    expect(game.player.points).toBeGreaterThan(initialPoints);
  });
  it("should correctly determine if a player's hand is a blackjack", () => {
    jest.spyOn(utils, "shuffleDeck").mockReturnValue([
      { face: "A", id: "A-S" },
      { face: "K", id: "K-H" },
      { face: "2", id: "2-C" },
      { face: "5", id: "5-H" },
    ]);
    const game = new Game();
    game.startGame();
    expect(game.isBlackjack()).toBe(true);
  });
  it("should update hand and point for dealer if there is a hidden card", () => {
    const game = new Game();
    game.startGame();
    const initialPoints = game.dealer.points;
    const hiddenCards = game.dealer.hiddenCards[0];
    game.getCardForDealer();
    expect(game.dealer.hand.pop()).toBe(hiddenCards);
    expect(game.dealer.points).toBeGreaterThan(initialPoints);
  });

  it("should correctly handle a tie (push) scenario", () => {
    const game = new Game();
    jest.spyOn(utils, "shuffleDeck").mockReturnValue([
      { face: "J", id: "J-S" },
      { face: "8", id: "8-S" }, // Player's initial cards
      { face: "Q", id: "Q-H" },
      { face: "8", id: "8-H" }, // Dealer's initial cards
    ]);

    game.startGame();
    game.getCardForDealer();

    expect(game.isDraw()).toBeTruthy(); // It's a tie
  });

  it("should correctly handle a player winning with more points", () => {
    const game = new Game();
    jest.spyOn(utils, "shuffleDeck").mockReturnValue([
      { face: "J", id: "J-S" },
      { face: "6", id: "6-S" }, // Player's initial cards
      { face: "Q", id: "Q-H" },
      { face: "8", id: "8-H" }, // Dealer's initial cards
      { face: "3", id: "3-H" },
    ]);

    game.startGame();
    game.getCardForPlayer();
    game.getCardForDealer();

    expect(game.isWon()).toBeTruthy();
  });

  it("should recalculate Ace if the score is more than 21", () => {
    const game = new Game();
    jest.spyOn(utils, "shuffleDeck").mockReturnValue([
      { face: "A", id: "A-S" },
      { face: "6", id: "6-S" }, // Player's initial cards
      { face: "Q", id: "Q-H" },
      { face: "8", id: "8-H" }, // Dealer's initial cards
      { face: "8", id: "8-S" },
    ]);

    game.startGame();
    expect(game.player.points).toBe(17);
    game.getCardForPlayer();
    expect(game.player.points).toBe(15);
  });
});
