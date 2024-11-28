/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLHexadecimal } from '../src/scalars/Hexadecimal.js';

describe(`Hexadecimal`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLHexadecimal.serialize(`123456789AbCdEf`)).toEqual(`123456789AbCdEf`);
    });

    it(`parseValue`, () => {
      expect(GraphQLHexadecimal.parseValue(`123456789AbCdEf`)).toEqual(`123456789AbCdEf`);
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLHexadecimal.parseLiteral(
          {
            value: `123456789AbCdEf`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`123456789AbCdEf`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid hexadecimal value`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLHexadecimal.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHexadecimal.serialize(`this is not a hex color code`)).toThrow(
          /Value is not a valid hexadecimal value/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLHexadecimal.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLHexadecimal.parseValue(`this is not a hex color code`)).toThrow(
          /Value is not a valid hexadecimal value/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLHexadecimal.parseLiteral({ value: 123, kind: Kind.INT } as any, {}),
        ).toThrow(/Can only validate strings as a hexadecimal but got a/);

        expect(() =>
          GraphQLHexadecimal.parseLiteral(
            { value: `this is not a hex color code`, kind: Kind.STRING },
            {},
          ),
        ).toThrow(/Value is not a valid hexadecimal value/);
      });
    });
  });
});
