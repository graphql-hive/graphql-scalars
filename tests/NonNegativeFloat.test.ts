/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLNonNegativeFloat } from '../src/scalars/NonNegativeFloat.js';
import { GraphQLUnsignedFloat } from '../src/scalars/UnsignedFloat.js';

describe('NonNegativeFloat', () => {
  describe('valid', () => {
    describe('greater than zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeFloat.serialize(123.45)).toBe(123.45);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeFloat.parseValue(123.45)).toBe(123.45);
        });

        test('parseLiteral', () => {
          expect(
            GraphQLNonNegativeFloat.parseLiteral({ value: '123.45', kind: Kind.FLOAT }, {}),
          ).toBe(123.45);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeFloat.serialize('123.45')).toBe(123.45);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeFloat.parseValue('123.45')).toBe(123.45);
        });

        test('parseLiteral', () => {
          expect(
            GraphQLNonNegativeFloat.parseLiteral(
              {
                value: '123.45',
                kind: Kind.FLOAT,
              },
              {},
            ),
          ).toBe(123.45);
        });
      });
    });

    describe('zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeFloat.serialize(0.0)).toBe(0.0);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeFloat.parseValue(0.0)).toBe(0.0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonNegativeFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {})).toBe(
            0.0,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeFloat.serialize('0.0')).toBe(0.0);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeFloat.parseValue('0.0')).toBe(0.0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonNegativeFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {})).toBe(
            0.0,
          );
        });
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeFloat.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNonNegativeFloat.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeFloat.parseLiteral({ value: null, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeFloat.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonNegativeFloat.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeFloat.parseLiteral({ value: undefined, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('less than zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(() => GraphQLNonNegativeFloat.serialize(-1.0)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonNegativeFloat.parseValue(-1.0)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonNegativeFloat.parseLiteral({ value: '-1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNonNegativeFloat.serialize('-1.0')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonNegativeFloat.parseValue('-1.0')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonNegativeFloat.parseLiteral({ value: '-1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeFloat.serialize(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonNegativeFloat.parseValue(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeFloat.parseLiteral(
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
        expect(() => GraphQLNonNegativeFloat.serialize('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonNegativeFloat.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeFloat.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as non-negative floating point numbers but got a/,
        );
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeFloat.serialize(Number.NaN)).toThrow(
          /Value is not a number/,
        );
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonNegativeFloat.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeFloat.parseLiteral(
            {
              value: Number.NaN.toString(),
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as non-negative floating point numbers but got a/,
        );
      });
    });
  });
});

describe('UnsignedFloat', () => {
  describe('valid', () => {
    describe('greater than zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedFloat.serialize(123.45)).toBe(123.45);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedFloat.parseValue(123.45)).toBe(123.45);
        });

        test('parseLiteral', () => {
          expect(GraphQLUnsignedFloat.parseLiteral({ value: '123.45', kind: Kind.FLOAT }, {})).toBe(
            123.45,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedFloat.serialize('123.45')).toBe(123.45);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedFloat.parseValue('123.45')).toBe(123.45);
        });

        test('parseLiteral', () => {
          expect(
            GraphQLUnsignedFloat.parseLiteral(
              {
                value: '123.45',
                kind: Kind.FLOAT,
              },
              {},
            ),
          ).toBe(123.45);
        });
      });
    });

    describe('zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedFloat.serialize(0.0)).toBe(0.0);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedFloat.parseValue(0.0)).toBe(0.0);
        });

        test('parseLiteral', () => {
          expect(GraphQLUnsignedFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {})).toBe(
            0.0,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedFloat.serialize('0.0')).toBe(0.0);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedFloat.parseValue('0.0')).toBe(0.0);
        });

        test('parseLiteral', () => {
          expect(GraphQLUnsignedFloat.parseLiteral({ value: '0.0', kind: Kind.FLOAT }, {})).toBe(
            0.0,
          );
        });
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedFloat.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLUnsignedFloat.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedFloat.parseLiteral({ value: null, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedFloat.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLUnsignedFloat.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedFloat.parseLiteral({ value: undefined, kind: Kind.FLOAT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('less than zero', () => {
      describe('as float', () => {
        test('serialize', () => {
          expect(() => GraphQLUnsignedFloat.serialize(-1.0)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLUnsignedFloat.parseValue(-1.0)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLUnsignedFloat.parseLiteral({ value: '-1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLUnsignedFloat.serialize('-1.0')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLUnsignedFloat.parseValue('-1.0')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLUnsignedFloat.parseLiteral({ value: '-1.0', kind: Kind.FLOAT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedFloat.serialize(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLUnsignedFloat.parseValue(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedFloat.parseLiteral(
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
        expect(() => GraphQLUnsignedFloat.serialize('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLUnsignedFloat.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedFloat.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as non-negative floating point numbers but got a/,
        );
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedFloat.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLUnsignedFloat.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedFloat.parseLiteral(
            {
              value: Number.NaN.toString(),
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(
          /Can only validate floating point numbers as non-negative floating point numbers but got a/,
        );
      });
    });
  });
});
