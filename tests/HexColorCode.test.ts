/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLHexColorCode } from '../src/scalars/HexColorCode.js';

describe(`HexColorCode`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLHexColorCode.serialize(`#BadA55`)).toEqual(`#BadA55`);
    });

    it(`parseValue`, () => {
      expect(GraphQLHexColorCode.parseValue(`#BadA55`)).toEqual(`#BadA55`);
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLHexColorCode.parseLiteral(
          {
            value: `#BadA55`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`#BadA55`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid HexColorCode`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLHexColorCode.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHexColorCode.serialize(`this is not a hex color code`)).toThrow(
          /Value is not a valid HexColorCode/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLHexColorCode.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHexColorCode.parseValue(`this is not a hex color code`)).toThrow(
          /Value is not a valid HexColorCode/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLHexColorCode.parseLiteral({ value: 123, kind: Kind.INT } as any, {}),
        ).toThrow(/Can only validate strings as hex color codes but got a/);

        expect(() =>
          GraphQLHexColorCode.parseLiteral(
            { value: `this is not a hex color code`, kind: Kind.STRING },
            {},
          ),
        ).toThrow(/Value is not a valid HexColorCode/);
      });
    });
  });
});
