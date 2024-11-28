/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLHSLA } from '../src/scalars/HSLA.js';

describe(`HSLA`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLHSLA.serialize(`hsla(240, 100%, 50%, .05)`)).toEqual(
        `hsla(240, 100%, 50%, .05)`,
      );
    });

    it(`parseValue`, () => {
      expect(GraphQLHSLA.parseValue(`hsla(240, 100%, 50%, .05)`)).toEqual(
        `hsla(240, 100%, 50%, .05)`,
      );
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLHSLA.parseLiteral(
          {
            value: `hsla(240, 100%, 50%, .05)`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`hsla(240, 100%, 50%, .05)`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid HSLA color`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLHSLA.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHSLA.serialize(`this is not an hsla color`)).toThrow(
          /Value is not a valid HSLA color/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLHSLA.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHSLA.parseValue(`this is not an hsla color`)).toThrow(
          /Value is not a valid HSLA color/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLHSLA.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as HSLA colors but got a/,
        );

        expect(() =>
          GraphQLHSLA.parseLiteral({ value: `this is not an hsla color`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid HSLA color/);
      });
    });
  });
});
