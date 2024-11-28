/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLGUID } from '../src/scalars/GUID.js';
import { GraphQLUUID } from '../src/scalars/UUID.js';

describe(`UUID`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLUUID.serialize(`38336562-3634-6431-2d39-3264302d3400`)).toEqual(
        `38336562-3634-6431-2d39-3264302d3400`,
      );
    });

    it(`parseValue`, () => {
      expect(GraphQLUUID.parseValue(`38336562-3634-6431-2d39-3264302d3400`)).toEqual(
        `38336562-3634-6431-2d39-3264302d3400`,
      );
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLUUID.parseLiteral(
          {
            value: `38336562-3634-6431-2d39-3264302d3400`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`38336562-3634-6431-2d39-3264302d3400`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid UUID`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLUUID.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLUUID.serialize(`this is not a uuid`)).toThrow(
          /Value is not a valid UUID/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLUUID.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLUUID.parseValue(`this is not a uuid`)).toThrow(
          /Value is not a valid UUID/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLUUID.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as UUIDs but got a/,
        );

        expect(() =>
          GraphQLUUID.parseLiteral({ value: `this is not a uuid`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid UUID/);
      });
    });
  });
});

describe(`GUID`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLGUID.serialize(`38336562-3634-6431-2d39-3264302d3400`)).toEqual(
        `38336562-3634-6431-2d39-3264302d3400`,
      );
    });

    it(`parseValue`, () => {
      expect(GraphQLGUID.parseValue(`38336562-3634-6431-2d39-3264302d3400`)).toEqual(
        `38336562-3634-6431-2d39-3264302d3400`,
      );
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLGUID.parseLiteral(
          {
            value: `38336562-3634-6431-2d39-3264302d3400`,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(`38336562-3634-6431-2d39-3264302d3400`);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid GUID`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLGUID.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLGUID.serialize(`this is not a uuid`)).toThrow(
          /Value is not a valid UUID/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLGUID.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLGUID.parseValue(`this is not a uuid`)).toThrow(
          /Value is not a valid UUID/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLGUID.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as UUIDs but got a/,
        );

        expect(() =>
          GraphQLGUID.parseLiteral({ value: `this is not a uuid`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid UUID/);
      });
    });
  });
});
