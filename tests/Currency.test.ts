/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLCurrency } from '../src/scalars/Currency.js';

describe(`Currency`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLCurrency.serialize(`USD`)).toEqual(`USD`);
    });

    it(`parseValue`, () => {
      expect(GraphQLCurrency.parseValue(`USD`)).toEqual(`USD`);
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLCurrency.parseLiteral(
          {
            value: `USD`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`USD`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid currency value`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLCurrency.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLCurrency.serialize(`this is not a currency`)).toThrow(
          /Value is not a valid currency value/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLCurrency.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLCurrency.parseValue(`this is not a currency`)).toThrow(
          /Value is not a valid currency value/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLCurrency.parseLiteral({ value: 123, kind: Kind.INT } as any, {}),
        ).toThrow(/Can only validate strings as a currency but got a/);

        expect(() =>
          GraphQLCurrency.parseLiteral({ value: `this is not a currency`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid currency value/);
      });
    });
  });
});
