/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLNonPositiveFloat } from '../src/scalars/NonPositiveFloat.js';

describe('NonPositiveFloat', () => {
  describe('valid', () => {
    describe('as float', () => {
      test('serialize', () => {
        expect(GraphQLNonPositiveFloat.serialize(-123.45)).toBe(-123.45);
      });

      test('parseValue', () => {
        expect(GraphQLNonPositiveFloat.parseValue(-123.45)).toBe(-123.45);
      });

      test('parseLiteral', () => {
        expect(
          GraphQLNonPositiveFloat.parseLiteral({ value: '-123.45', kind: Kind.FLOAT }, {}),
        ).toBe(-123.45);
      });
    });

    describe('as string', () => {
      test('serialize', () => {
        expect(GraphQLNonPositiveFloat.serialize('-123.45')).toBe(-123.45);
      });

      test('parseValue', () => {
        expect(GraphQLNonPositiveFloat.parseValue('-123.45')).toBe(-123.45);
      });

      test('parseLiteral', () => {
        expect(
          GraphQLNonPositiveFloat.parseLiteral({ value: '-123.45', kind: Kind.FLOAT }, {}),
        ).toBe(-123.45);
      });
    });

    describe('zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(GraphQLNonPositiveFloat.serialize(0.0)).toBe(0.0);
        });

        test('parseValue', () => {
          expect(GraphQLNonPositiveFloat.parseValue(0.0)).toBe(0.0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonPositiveFloat.parseLiteral({ value: '0', kind: Kind.FLOAT }, {})).toBe(
            0.0,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLNonPositiveFloat.serialize('0.0')).toBe(0.0);
        });

        test('parseValue', () => {
          expect(GraphQLNonPositiveFloat.parseValue('0.0')).toBe(0.0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonPositiveFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {})).toBe(
            0.0,
          );
        });
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveFloat.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNonPositiveFloat.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveFloat.parseLiteral({ value: null, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveFloat.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonPositiveFloat.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveFloat.parseLiteral({ value: undefined, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('more than zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(() => GraphQLNonPositiveFloat.serialize(1.0)).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonPositiveFloat.parseValue(1.0)).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonPositiveFloat.parseLiteral({ value: '1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a non-positive number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNonPositiveFloat.serialize('1.0')).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonPositiveFloat.parseValue('1.0')).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonPositiveFloat.parseLiteral({ value: '1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a non-positive number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveFloat.serialize(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonPositiveFloat.parseValue(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveFloat.parseLiteral(
            {
              value: Number.NEGATIVE_INFINITY.toString(),
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toThrow(/Value is not a finite number/);
      });
    });

    describe('not a number', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveFloat.serialize('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonPositiveFloat.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveFloat.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as non-positive floating point numbers but got a/,
        );
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveFloat.serialize(Number.NaN)).toThrow(
          /Value is not a number/,
        );
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonPositiveFloat.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveFloat.parseLiteral(
            {
              value: Number.NaN.toString(),
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as non-positive floating point numbers but got a/,
        );
      });
    });
  });
});
