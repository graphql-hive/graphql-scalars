/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLRGB } from '../src/scalars/RGB.js';

describe(`RGB`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLRGB.serialize(`rgb(255, 0, 153)`)).toEqual(`rgb(255, 0, 153)`);
    });

    it(`parseValue`, () => {
      expect(GraphQLRGB.parseValue(`rgb(255, 0, 153)`)).toEqual(`rgb(255, 0, 153)`);
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLRGB.parseLiteral(
          {
            value: `rgb(255, 0, 153)`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`rgb(255, 0, 153)`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid RGB color`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLRGB.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLRGB.serialize(`this is not an rgb color`)).toThrow(
          /Value is not a valid RGB color/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLRGB.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLRGB.parseValue(`this is not an rgb color`)).toThrow(
          /Value is not a valid RGB color/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLRGB.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as RGB colors but got a/,
        );

        expect(() =>
          GraphQLRGB.parseLiteral({ value: `this is not an rgb color`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid RGB color/);
      });
    });
  });
});
