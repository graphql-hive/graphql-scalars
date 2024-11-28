/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLPositiveInt } from '../src/scalars/PositiveInt.js';

describe('PositiveInt', () => {
  describe('valid', () => {
    describe('as int', () => {
      test('serialize', () => {
        expect(GraphQLPositiveInt.serialize(123)).toBe(123);
      });

      test('parseValue', () => {
        expect(GraphQLPositiveInt.parseValue(123)).toBe(123);
      });

      test('parseLiteral', () => {
        expect(GraphQLPositiveInt.parseLiteral({ value: '123', kind: Kind.INT }, {})).toBe(123);
      });
    });

    describe('as string', () => {
      test('serialize', () => {
        expect(GraphQLPositiveInt.serialize('123')).toBe(123);
      });

      test('parseValue', () => {
        expect(GraphQLPositiveInt.parseValue('123')).toBe(123);
      });

      test('parseLiteral', () => {
        expect(GraphQLPositiveInt.parseLiteral({ value: '123', kind: Kind.INT }, {})).toBe(123);
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveInt.serialize(null)).toThrow(/Value is not a number: null/);
      });

      test('parseValue', () => {
        expect(() => GraphQLPositiveInt.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLPositiveInt.parseLiteral({ value: null, kind: Kind.INT }, {})).toThrow(
          /Value is not a number: null/,
        );
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveInt.serialize(undefined)).toThrow(
          /Value is not a number: undefined/,
        );
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLPositiveInt.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveInt.parseLiteral({ value: undefined, kind: Kind.INT }, {}),
        ).toThrow(/Value is not a number: undefined/);
      });
    });

    describe('unsafe integer', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveInt.serialize(2 ** 53)).toThrow(/Value is not a safe integer/);
      });

      test('parseValue', () => {
        expect(() => GraphQLPositiveInt.parseValue(2 ** 53)).toThrow(/Value is not a safe integer/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveInt.parseLiteral({ value: (2 ** 53).toString(), kind: Kind.INT }, {}),
        ).toThrow(/Value is not a safe integer/);
      });
    });

    describe('zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveInt.serialize(0)).toThrow(/Value is not a positive number/);
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveInt.parseValue(0)).toThrow(/Value is not a positive number/);
        });

        test('parseLiteral', () => {
          expect(() => GraphQLPositiveInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toThrow(
            /Value is not a positive number/,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveInt.serialize('0')).toThrow(/Value is not a positive number/);
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveInt.parseValue('0')).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() => GraphQLPositiveInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toThrow(
            /Value is not a positive number/,
          );
        });
      });
    });

    describe('less than zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveInt.serialize(-1)).toThrow(/Value is not a positive number/);
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveInt.parseValue(-1)).toThrow(/Value is not a positive number/);
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLPositiveInt.parseLiteral({ value: '-1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a positive number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveInt.serialize('-1')).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveInt.parseValue('-1')).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLPositiveInt.parseLiteral({ value: '-1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a positive number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveInt.serialize(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPositiveInt.parseValue(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveInt.parseLiteral(
            {
              value: Number.POSITIVE_INFINITY.toString(),
              kind: Kind.INT,
            },
            {},
          ),
        ).toThrow(/Value is not a finite number/);
      });
    });

    describe('not a number', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveInt.serialize('not a number')).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLPositiveInt.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveInt.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Can only validate integers as positive integers but got a/);
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveInt.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLPositiveInt.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveInt.parseLiteral({ value: Number.NaN.toString(), kind: Kind.STRING }, {}),
        ).toThrow(/Can only validate integers as positive integers but got a/);
      });
    });
  });
});
