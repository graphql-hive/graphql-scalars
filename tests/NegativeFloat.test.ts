/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLNegativeFloat } from '../src/scalars/NegativeFloat.js';

describe('NegativeFloat', () => {
  describe('valid', () => {
    describe('as float', () => {
      test('serialize', () => {
        expect(GraphQLNegativeFloat.serialize(-123.45)).toBe(-123.45);
      });

      test('parseValue', () => {
        expect(GraphQLNegativeFloat.parseValue(-123.45)).toBe(-123.45);
      });

      test('parseLiteral', () => {
        expect(GraphQLNegativeFloat.parseLiteral({ value: '-123.45', kind: Kind.FLOAT }, {})).toBe(
          -123.45,
        );
      });
    });

    describe('as string', () => {
      test('serialize', () => {
        expect(GraphQLNegativeFloat.serialize('-123.45')).toBe(-123.45);
      });

      test('parseValue', () => {
        expect(GraphQLNegativeFloat.parseValue('-123.45')).toBe(-123.45);
      });

      test('parseLiteral', () => {
        expect(GraphQLNegativeFloat.parseLiteral({ value: '-123.45', kind: Kind.FLOAT }, {})).toBe(
          -123.45,
        );
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeFloat.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNegativeFloat.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeFloat.parseLiteral({ value: null, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeFloat.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNegativeFloat.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeFloat.parseLiteral({ value: undefined, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeFloat.serialize(0.0)).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeFloat.parseValue(0.0)).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNegativeFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a negative number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeFloat.serialize('0.0')).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeFloat.parseValue('0.0')).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNegativeFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a negative number/);
        });
      });
    });

    describe('less than zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeFloat.serialize(1.0)).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeFloat.parseValue(1.0)).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNegativeFloat.parseLiteral({ value: '1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a negative number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNegativeFloat.serialize('1.0')).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNegativeFloat.parseValue('1.0')).toThrow(
            /Value is not a negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNegativeFloat.parseLiteral({ value: '1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a negative number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeFloat.serialize(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNegativeFloat.parseValue(Number.NEGATIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeFloat.parseLiteral(
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
        expect(() => GraphQLNegativeFloat.serialize('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNegativeFloat.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeFloat.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as negative floating point numbers but got a/,
        );
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLNegativeFloat.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNegativeFloat.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNegativeFloat.parseLiteral(
            { value: Number.NaN.toString(), kind: Kind.STRING },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as negative floating point numbers but got a/,
        );
      });
    });
  });
});
