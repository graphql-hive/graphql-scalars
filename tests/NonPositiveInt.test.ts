/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLNonPositiveInt } from '../src/scalars/NonPositiveInt.js';

describe('NonPositiveInt', () => {
  describe('valid', () => {
    describe('as int', () => {
      test('serialize', () => {
        expect(GraphQLNonPositiveInt.serialize(-123)).toBe(-123);
      });

      test('parseValue', () => {
        expect(GraphQLNonPositiveInt.parseValue(-123)).toBe(-123);
      });

      test('parseLiteral', () => {
        expect(GraphQLNonPositiveInt.parseLiteral({ value: '-123', kind: Kind.INT }, {})).toBe(
          -123,
        );
      });
    });

    describe('as string', () => {
      test('serialize', () => {
        expect(GraphQLNonPositiveInt.serialize('-123')).toBe(-123);
      });

      test('parseValue', () => {
        expect(GraphQLNonPositiveInt.parseValue('-123')).toBe(-123);
      });

      test('parseLiteral', () => {
        expect(GraphQLNonPositiveInt.parseLiteral({ value: '-123', kind: Kind.INT }, {})).toBe(
          -123,
        );
      });
    });

    describe('zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(GraphQLNonPositiveInt.serialize(0)).toBe(0);
        });

        test('parseValue', () => {
          expect(GraphQLNonPositiveInt.parseValue(0)).toBe(0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonPositiveInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toBe(0);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLNonPositiveInt.serialize('0')).toBe(0);
        });

        test('parseValue', () => {
          expect(GraphQLNonPositiveInt.parseValue('0')).toBe(0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonPositiveInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toBe(0);
        });
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveInt.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNonPositiveInt.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveInt.parseLiteral({ value: null, kind: Kind.INT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveInt.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonPositiveInt.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveInt.parseLiteral({ value: undefined, kind: Kind.INT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('unsafe integer', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveInt.serialize(2 ** 53)).toThrow(
          /Value is not a safe integer/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonPositiveInt.parseValue(2 ** 53)).toThrow(
          /Value is not a safe integer/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveInt.parseLiteral({ value: (2 ** 53).toString(), kind: Kind.INT }, {}),
        ).toThrow(/Value is not a safe integer/);
      });
    });

    describe('more than zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(() => GraphQLNonPositiveInt.serialize(1)).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonPositiveInt.parseValue(1)).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonPositiveInt.parseLiteral({ value: '1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a non-positive number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNonPositiveInt.serialize('1')).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonPositiveInt.parseValue('1')).toThrow(
            /Value is not a non-positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonPositiveInt.parseLiteral({ value: '1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a non-positive number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveInt.serialize(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonPositiveInt.parseValue(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveInt.parseLiteral(
            {
              value: Number.NEGATIVE_INFINITY.toString(),
              kind: Kind.INT,
            },
            {},
          ),
        ).toThrow(/Value is not a finite number/);
      });
    });

    describe('not a number', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveInt.serialize('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonPositiveInt.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveInt.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Can only validate integers as non-positive integers but got a/);
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLNonPositiveInt.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonPositiveInt.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonPositiveInt.parseLiteral(
            { value: Number.NaN.toString(), kind: Kind.STRING },
            {},
          ),
        ).toThrow(/Can only validate integers as non-positive integers but got a/);
      });
    });
  });
});
