/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLPositiveFloat } from '../src/scalars/PositiveFloat.js';

describe('PositiveFloat', () => {
  describe('valid', () => {
    describe('as float', () => {
      test('serialize', () => {
        expect(GraphQLPositiveFloat.serialize(123.45)).toBe(123.45);
      });

      test('parseValue', () => {
        expect(GraphQLPositiveFloat.parseValue(123.45)).toBe(123.45);
      });

      test('parseLiteral', () => {
        expect(GraphQLPositiveFloat.parseLiteral({ value: '123.45', kind: Kind.FLOAT }, {})).toBe(
          123.45,
        );
      });
    });

    describe('as string', () => {
      test('serialize', () => {
        expect(GraphQLPositiveFloat.serialize('123.45')).toBe(123.45);
      });

      test('parseValue', () => {
        expect(GraphQLPositiveFloat.parseValue('123.45')).toBe(123.45);
      });

      test('parseLiteral', () => {
        expect(GraphQLPositiveFloat.parseLiteral({ value: '123.45', kind: Kind.FLOAT }, {})).toBe(
          123.45,
        );
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveFloat.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLPositiveFloat.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveFloat.parseLiteral({ value: null, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveFloat.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLPositiveFloat.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveFloat.parseLiteral({ value: undefined, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveFloat.serialize(0.0)).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveFloat.parseValue(0.0)).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLPositiveFloat.parseLiteral({ value: '0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a positive number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveFloat.serialize('0.0')).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveFloat.parseValue('0.0')).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLPositiveFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a positive number/);
        });
      });
    });

    describe('less than zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveFloat.serialize(-1.0)).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveFloat.parseValue(-1.0)).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLPositiveFloat.parseLiteral({ value: '-1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a positive number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLPositiveFloat.serialize('-1.0')).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLPositiveFloat.parseValue('-1.0')).toThrow(
            /Value is not a positive number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLPositiveFloat.parseLiteral({ value: '-1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a positive number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveFloat.serialize(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPositiveFloat.parseValue(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveFloat.parseLiteral(
            {
              value: Number.POSITIVE_INFINITY.toString(),
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toThrow(/Value is not a finite number/);
      });
    });

    describe('not a number', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveFloat.serialize('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPositiveFloat.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveFloat.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as positive floating point numbers but got a/,
        );
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLPositiveFloat.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLPositiveFloat.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPositiveFloat.parseLiteral(
            { value: Number.NaN.toString(), kind: Kind.STRING },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as positive floating point numbers but got a/,
        );
      });
    });
  });
});
