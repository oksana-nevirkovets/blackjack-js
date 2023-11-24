import { buildDeck, calculatePoints, getCardValue, shuffleArray } from '../src/utils/cardUtils';

describe('card utils >', () => {
  describe('calculatePoints', () => {
    const calculatePointsTests = [
      { hand: [], expectedResult: 0 },
      { hand: [{ face: '6', id: '6-H' }], expectedResult: 6 },
      {
        hand: [
          { face: 'A', id: 'A-S' },
          { face: '2', id: '2-D' },
        ],
        expectedResult: 13,
      },
      {
        hand: [
          { face: 'A', id: 'A-S' },
          { face: '10', id: '10-C' },
        ],
        expectedResult: 21,
      },
      {
        hand: [
          { face: 'A', id: 'A-S' },
          { face: 'A', id: 'A-D' },
          { face: '5', id: '5-H' },
          { face: '6', id: '6-C' },
        ],
        expectedResult: 13,
      },
      {
        hand: [
          { face: 'A', id: 'A-S' },
          { face: 'A', id: 'A-D' },
          { face: '10', id: '10-C' },
          { face: '6', id: '6-H' },
        ],
        expectedResult: 18,
      },
      {
        hand: [
          { face: 'K', id: 'K-S' },
          { face: '10', id: '10-C' },
          { face: '9', id: '9-D' },
        ],
        expectedResult: 29,
      },
      {
        hand: [
          { face: 'Q', id: 'Q-H' },
          { face: '7', id: '7-C' },
        ],
        expectedResult: 17,
      },
      {
        hand: [
          { face: 'J', id: 'J-D' },
          { face: '5', id: '5-S' },
        ],
        expectedResult: 15,
      },
    ];
    calculatePointsTests.forEach((test, index) => {
      it(`should calculate points - Test Case ${index + 1}`, () => {
        const { hand, expectedResult } = test;
        const points = calculatePoints(hand);
        expect(points).toBe(expectedResult);
      });
    });
  });

  describe('buildDeck', () => {
    it('should build a deck with 52 cards', () => {
      const deck = buildDeck();
      expect(deck).toHaveLength(52);
    });

    it('should include all faces and suits', () => {
      const deck = buildDeck();
      const expectedFaces = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const expectedSuits = ['S', 'D', 'H', 'C'];

      expectedFaces.forEach(face => {
        expectedSuits.forEach(suit => {
          const id = face + '-' + suit;
          expect(deck.some(card => card.id === id && card.face === face)).toBe(true);
        });
      });
    });

    it('should not have duplicate cards', () => {
      const deck = buildDeck();
      const cardIds = deck.map(card => card.id);
      const uniqueCardIds = new Set(cardIds);
      expect(cardIds.length).toBe(uniqueCardIds.size);
    });
  });

  describe('shuffleArray', () => {
    it('should not modify the original array length', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const shuffledArray = shuffleArray([...originalArray]);
      expect(shuffledArray).toHaveLength(originalArray.length);
    });

    it('should have the same elements as the original array', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const shuffledArray = shuffleArray([...originalArray]);
      originalArray.forEach(element => {
        expect(shuffledArray).toContain(element);
      });
    });

    it('should have a different order after shuffling', () => {
      const originalArray = [1, 2, 3, 4, 5];
      const shuffledArray = shuffleArray([...originalArray]);
      expect(shuffledArray).not.toEqual(originalArray);
    });
  });
  describe('getCardValue', () => {
    const getCardValueTests = [
      { nominal: 'A', expectedResult: 1 },
      { nominal: 'J', expectedResult: 10 },
      { nominal: 'Q', expectedResult: 10 },
      { nominal: 'K', expectedResult: 10 },
      { nominal: '2', expectedResult: 2 },
      { nominal: '7', expectedResult: 7 },
      { nominal: '10', expectedResult: 10 },
    ];

    getCardValueTests.forEach((test, index) => {
      it(`should get card value - Test Case ${index + 1}`, () => {
        const { nominal, expectedResult } = test;
        const value = getCardValue(nominal);
        expect(value).toBe(expectedResult);
      });
    });
  });
});
