/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLPort } from '../src/scalars/Port.js';

describe(`Port`, () => {
  describe(`valid`, () => {
    describe(`as int`, () => {
      it(`serialize`, () => {
        expect(GraphQLPort.serialize(1337)).toBe(1337);
      });

      it(`parseValue`, () => {
        expect(GraphQLPort.parseValue(1337)).toBe(1337);
      });

      it(`parseLiteral`, () => {
        expect(GraphQLPort.parseLiteral({ value: 1337, kind: Kind.INT } as any, {})).toBe(1337);
      });
    });

    describe(`as string`, () => {
      it(`serialize`, () => {
        expect(GraphQLPort.serialize(`1337`)).toBe(1337);
      });

      it(`parseValue`, () => {
        expect(GraphQLPort.parseValue(`1337`)).toBe(1337);
      });

      it(`parseLiteral`, () => {
        expect(GraphQLPort.parseLiteral({ value: `1337`, kind: Kind.INT } as any, {})).toBe(1337);
      });
    });
  });

  describe(`invalid`, () => {
    describe(`negative`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLPort.serialize(-1)).toThrow(/Value is not a valid TCP port: -1/);
      });

      it(`parseValue`, () => {
        expect(() => GraphQLPort.parseValue(-1)).toThrow(/Value is not a valid TCP port/);
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLPort.parseLiteral({ value: -1, kind: Kind.INT } as any, {})).toThrow(
          /Value is not a valid TCP port: -1/,
        );
      });
    });

    describe(`out of range`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLPort.serialize(65536)).toThrow(/Value is not a valid TCP port: 65536/);
      });

      it(`parseValue`, () => {
        expect(() => GraphQLPort.parseValue(65536)).toThrow(/Value is not a valid TCP port/);
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLPort.parseLiteral({ value: 65536, kind: Kind.INT } as any, {})).toThrow(
          /Value is not a valid TCP port: 65536/,
        );
      });
    });

    describe(`null`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLPort.serialize(null)).toThrow(/Value is not a number: null/);
      });

      it(`parseValue`, () => {
        expect(() => GraphQLPort.parseValue(null)).toThrow(/Value is not a number/);
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLPort.parseLiteral({ value: null, kind: Kind.INT } as any, {})).toThrow(
          /Value is not a number: null/,
        );
      });
    });

    describe(`undefined`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLPort.serialize(undefined)).toThrow(/Value is not a number: undefined/); // eslint-disable-line
      });

      it(`parseValue`, () => {
        expect(() => GraphQLPort.parseValue(undefined)).toThrow(/Value is not a number/); // eslint-disable-line
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLPort.parseLiteral({ value: undefined, kind: Kind.INT } as any, {}),
        ).toThrow(
          // eslint-disable-line
          /Value is not a number: undefined/,
        );
      });
    });

    describe(`infinity`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLPort.serialize(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLPort.parseValue(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLPort.parseLiteral(
            {
              value: Number.POSITIVE_INFINITY,
              kind: Kind.INT,
            } as any,
            {},
          ),
        ).toThrow(/Value is not a finite number/);
      });
    });

    describe(`not a number`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLPort.serialize(`not a number`)).toThrow(/Value is not a number/);
      });

      it(`parseValue`, () => {
        expect(() => GraphQLPort.parseValue(`not a number`)).toThrow(/Value is not a number/);
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLPort.parseLiteral(
            {
              value: `not a number`,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Can only validate integers as TCP ports but got a/);
      });
    });

    describe(`NaN`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLPort.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      it(`parseValue`, () => {
        expect(() => GraphQLPort.parseValue(Number.NaN)).toThrow(/Value is not a number/);
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLPort.parseLiteral({ value: Number.NaN, kind: Kind.STRING } as any, {}),
        ).toThrow(/Can only validate integers as TCP ports but got a/);
      });
    });
  });
});
