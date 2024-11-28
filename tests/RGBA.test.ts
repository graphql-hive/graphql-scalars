/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLRGBA } from '../src/scalars/RGBA.js';

describe(`RGBA`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLRGBA.serialize(`rgba(51, 170, 51, .7)`)).toEqual(`rgba(51, 170, 51, .7)`);
    });

    it(`parseValue`, () => {
      expect(GraphQLRGBA.parseValue(`rgba(51, 170, 51, .7)`)).toEqual(`rgba(51, 170, 51, .7)`);
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLRGBA.parseLiteral(
          {
            value: `rgba(51, 170, 51, .7)`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`rgba(51, 170, 51, .7)`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid RGBA color`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLRGBA.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLRGBA.serialize(`this is not an rgba color`)).toThrow(
          /Value is not a valid RGBA color/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLRGBA.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLRGBA.parseValue(`this is not an rgba color`)).toThrow(
          /Value is not a valid RGBA color/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLRGBA.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as RGBA colors but got a/,
        );

        expect(() =>
          GraphQLRGBA.parseLiteral({ value: `this is not an rgba color`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid RGBA color/);
      });
    });
  });
});
