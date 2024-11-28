/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLNegativeInt } from '../src/scalars/NegativeInt.js';

describe('NegativeInt', () => {
  describe('valid', () => {
    describe('as int', () => {
      test('serialize', () => {
        expect(GraphQLNegativeInt.serialize(-123)).toBe(-123);
      });

      test('parseValue', () => {
        expect(GraphQLNegativeInt.parseValue(-123)).toBe(-123);
      });

      test('parseLiteral', () => {
        expect(
          GraphQLNegativeInt.parseLiteral({ value: (-123).toString(), kind: Kind.INT }, {}),
        ).toBe(-123);
      });
    });

    describe('as string', () => {
      test('serialize', () => {
        expect(GraphQLNegativeInt.serialize('-123')).toBe(-123);
      });

      test('parseValue', () => {
        expect(GraphQLNegativeInt.parseValue('-123')).toBe(-123);
      });

      test('parseLiteral', () => {
        expect(GraphQLNegativeInt.parseLiteral({ value: '-123', kind: Kind.INT }, {})).toBe(-123);
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeInt.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNegativeInt.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLNegativeInt.parseLiteral({ value: null, kind: Kind.INT }, {})).toThrow(
          /Value is not a number/,
        );
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeInt.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNegativeInt.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeInt.parseLiteral({ value: undefined, kind: Kind.INT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('unsafe integer', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeInt.serialize(2 ** 53)).toThrow(/Value is not a safe integer/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNegativeInt.parseValue(2 ** 53)).toThrow(/Value is not a safe integer/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeInt.parseLiteral({ value: (2 ** 53).toString(), kind: Kind.INT }, {}),
        ).toThrow(/Value is not a safe integer/);
      });
    });

    describe('zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeInt.serialize(0)).toThrow(/Value is not a negative number/);
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeInt.parseValue(0)).toThrow(/Value is not a negative number/);
        });

        test('parseLiteral', () => {
          expect(() => GraphQLNegativeInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toThrow(
            /Value is not a negative number/,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeInt.serialize('0')).toThrow(/Value is not a negative number/);
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeInt.parseValue('0')).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() => GraphQLNegativeInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toThrow(
            /Value is not a negative number/,
          );
        });
      });
    });

    describe('less than zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeInt.serialize(1)).toThrow(/Value is not a negative number/);
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeInt.parseValue(1)).toThrow(/Value is not a negative number/);
        });

        test('parseLiteral', () => {
          expect(() => GraphQLNegativeInt.parseLiteral({ value: '1', kind: Kind.INT }, {})).toThrow(
            /Value is not a negative number/,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeInt.serialize('1')).toThrow(/Value is not a negative number/);
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeInt.parseValue('1')).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() => GraphQLNegativeInt.parseLiteral({ value: '1', kind: Kind.INT }, {})).toThrow(
            /Value is not a negative number/,
          );
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeInt.serialize(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNegativeInt.parseValue(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeInt.parseLiteral(
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
        expect(() => GraphQLNegativeInt.serialize('not a number')).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNegativeInt.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeInt.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Can only validate integers as negative integers but got a/);
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeInt.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNegativeInt.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeInt.parseLiteral({ value: Number.NaN.toString(), kind: Kind.STRING }, {}),
        ).toThrow(/Can only validate integers as negative integers but got a/);
      });
    });
  });
});
