/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { CURRENCY_CODES, GraphQLCurrency } from '../src/scalars/Currency.js';

describe('GraphQLCurrency Scalar', () => {
  describe('valid currency codes', () => {
    for (const code of CURRENCY_CODES) {
      it(`accepts valid code "${code}"`, () => {
        expect(GraphQLCurrency.serialize(code)).toEqual(code);
        expect(GraphQLCurrency.parseValue(code)).toEqual(code);
        expect(
          GraphQLCurrency.parseLiteral(
            {
              value: code,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toEqual(code);
      });
    }
  });

  describe('invalid currency values', () => {
    it('rejects unknown currency codes', () => {
      const invalid = 'ZZZ';
      expect(() => GraphQLCurrency.serialize(invalid)).toThrow(
        /Value is not a valid currency code/,
      );
      expect(() => GraphQLCurrency.parseValue(invalid)).toThrow(
        /Value is not a valid currency code/,
      );
      expect(() => GraphQLCurrency.parseLiteral({ value: invalid, kind: Kind.STRING }, {})).toThrow(
        /Value is not a valid currency code/,
      );
    });

    it('rejects non-string input', () => {
      expect(() => GraphQLCurrency.serialize(42)).toThrow(/Value is not string/);
      expect(() => GraphQLCurrency.parseValue({})).toThrow(/Value is not string/);
    });

    it('rejects non-string AST literals', () => {
      expect(() =>
        GraphQLCurrency.parseLiteral({ kind: Kind.INT, value: '123' } as any, {}),
      ).toThrow(/Can only validate strings as a currency but got a: IntValue/);
    });
  });
});
