/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLHSL } from '../src/scalars/HSL.js';

describe(`HSL`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLHSL.serialize(`hsl(270, 60%, 70%)`)).toEqual(`hsl(270, 60%, 70%)`);
    });

    it(`parseValue`, () => {
      expect(GraphQLHSL.parseValue(`hsl(270, 60%, 70%)`)).toEqual(`hsl(270, 60%, 70%)`);
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLHSL.parseLiteral(
          {
            value: `hsl(270, 60%, 70%)`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`hsl(270, 60%, 70%)`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid HSL color`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLHSL.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHSL.serialize(`this is not an hsl color`)).toThrow(
          /Value is not a valid HSL color/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLHSL.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHSL.parseValue(`this is not an hsl color`)).toThrow(
          /Value is not a valid HSL color/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLHSL.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as HSL colors but got a/,
        );

        expect(() =>
          GraphQLHSL.parseLiteral({ value: `this is not an hsl color`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid HSL color/);
      });
    });
  });
});
