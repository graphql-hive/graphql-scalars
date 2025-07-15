/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLCuid2 } from '../src/scalars/Cuid2.js';

describe('Cuid2', () => {
  describe('valid', () => {
    const validCuid2 = 'dp71y53f6eykvl5g1393rmhl';

    test('serialize', () => {
      expect(GraphQLCuid2.serialize(validCuid2)).toBe(validCuid2);
    });

    test('parseValue', () => {
      expect(GraphQLCuid2.parseValue(validCuid2)).toBe(validCuid2);
    });

    test('parseLiteral', () => {
      expect(
        GraphQLCuid2.parseLiteral(
          {
            value: validCuid2,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toBe(validCuid2);
    });
  });

  describe('invalid', () => {
    describe('not a cuid2', () => {
      test('serialize', () => {
        expect(() => GraphQLCuid2.serialize('not-a-valid-cuid2')).toThrow(
          /Value is not a valid cuid2/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLCuid2.parseValue('not-a-valid-cuid2')).toThrow(
          /Value is not a valid cuid2/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLCuid2.parseLiteral(
            {
              value: 'not-a-valid-cuid2',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value is not a valid cuid2/);
      });
    });

    describe('not a string', () => {
      test('serialize', () => {
        expect(() => GraphQLCuid2.serialize(123)).toThrow(/Value is not string/);
      });

      test('parseValue', () => {
        expect(() => GraphQLCuid2.parseValue(123)).toThrow(/Value is not string/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLCuid2.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow(
          /Can only validate strings as cuid2 but got/,
        );
      });
    });

    describe('boundary cases', () => {
      test('minimum length (2 characters)', () => {
        const minCuid2 = 'a1';
        expect(GraphQLCuid2.serialize(minCuid2)).toBe(minCuid2);
        expect(GraphQLCuid2.parseValue(minCuid2)).toBe(minCuid2);
        expect(GraphQLCuid2.parseLiteral({ value: minCuid2, kind: Kind.STRING }, {})).toBe(
          minCuid2,
        );
      });

      test('maximum length (32 characters)', () => {
        const maxCuid2 = 'a123456789abcdef123456789abcdef1'; // starts with a letter
        expect(GraphQLCuid2.serialize(maxCuid2)).toBe(maxCuid2);
        expect(GraphQLCuid2.parseValue(maxCuid2)).toBe(maxCuid2);
        expect(GraphQLCuid2.parseLiteral({ value: maxCuid2, kind: Kind.STRING }, {})).toBe(
          maxCuid2,
        );
      });

      test('too short (1 character)', () => {
        const tooShort = 'a';
        expect(() => GraphQLCuid2.serialize(tooShort)).toThrow(/Value is not a valid cuid2/);
      });

      test('too long (33 characters)', () => {
        const tooLong = 'a1234567890abcdef1234567890abcdef1';
        expect(() => GraphQLCuid2.serialize(tooLong)).toThrow(/Value is not a valid cuid2/);
      });
    });
  });
});
