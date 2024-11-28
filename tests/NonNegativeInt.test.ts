/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLNonNegativeInt } from '../src/scalars/NonNegativeInt.js';
import { GraphQLUnsignedInt } from '../src/scalars/UnsignedInt.js';

describe('NonNegativeInt', () => {
  describe('valid', () => {
    describe('greater than zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeInt.serialize(123)).toBe(123);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeInt.parseValue(123)).toBe(123);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonNegativeInt.parseLiteral({ value: '123', kind: Kind.INT }, {})).toBe(
            123,
          );
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeInt.serialize('123')).toBe(123);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeInt.parseValue('123')).toBe(123);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonNegativeInt.parseLiteral({ value: '123', kind: Kind.INT }, {})).toBe(
            123,
          );
        });
      });
    });

    describe('zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeInt.serialize(0)).toBe(0);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeInt.parseValue(0)).toBe(0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonNegativeInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toBe(0);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLNonNegativeInt.serialize('0')).toBe(0);
        });

        test('parseValue', () => {
          expect(GraphQLNonNegativeInt.parseValue('0')).toBe(0);
        });

        test('parseLiteral', () => {
          expect(GraphQLNonNegativeInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toBe(0);
        });
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeInt.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNonNegativeInt.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeInt.parseLiteral({ value: null, kind: Kind.INT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeInt.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonNegativeInt.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeInt.parseLiteral({ value: undefined, kind: Kind.INT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('unsafe integer', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeInt.serialize(2 ** 53)).toThrow(
          /Value is not a safe integer/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonNegativeInt.parseValue(2 ** 53)).toThrow(
          /Value is not a safe integer/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeInt.parseLiteral({ value: (2 ** 53).toString(), kind: Kind.INT }, {}),
        ).toThrow(/Value is not a safe integer/);
      });
    });

    describe('less than zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(() => GraphQLNonNegativeInt.serialize(-1)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonNegativeInt.parseValue(-1)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonNegativeInt.parseLiteral({ value: '-1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLNonNegativeInt.serialize('-1')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLNonNegativeInt.parseValue('-1')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLNonNegativeInt.parseLiteral({ value: '-1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeInt.serialize(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonNegativeInt.parseValue(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeInt.parseLiteral(
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
        expect(() => GraphQLNonNegativeInt.serialize('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonNegativeInt.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeInt.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Can only validate integers as non-negative integers but got a/);
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLNonNegativeInt.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLNonNegativeInt.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonNegativeInt.parseLiteral(
            { value: Number.NaN.toString(), kind: Kind.STRING },
            {},
          ),
        ).toThrow(/Can only validate integers as non-negative integers but got a/);
      });
    });
  });
});

describe('UnsignedInt', () => {
  describe('valid', () => {
    describe('greater than zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedInt.serialize(123)).toBe(123);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedInt.parseValue(123)).toBe(123);
        });

        test('parseLiteral', () => {
          expect(GraphQLUnsignedInt.parseLiteral({ value: '123', kind: Kind.INT }, {})).toBe(123);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedInt.serialize('123')).toBe(123);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedInt.parseValue('123')).toBe(123);
        });

        test('parseLiteral', () => {
          expect(GraphQLUnsignedInt.parseLiteral({ value: '123', kind: Kind.INT }, {})).toBe(123);
        });
      });
    });

    describe('zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedInt.serialize(0)).toBe(0);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedInt.parseValue(0)).toBe(0);
        });

        test('parseLiteral', () => {
          expect(GraphQLUnsignedInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toBe(0);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(GraphQLUnsignedInt.serialize('0')).toBe(0);
        });

        test('parseValue', () => {
          expect(GraphQLUnsignedInt.parseValue('0')).toBe(0);
        });

        test('parseLiteral', () => {
          expect(GraphQLUnsignedInt.parseLiteral({ value: '0', kind: Kind.INT }, {})).toBe(0);
        });
      });
    });
  });

  describe('invalid', () => {
    describe('null', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedInt.serialize(null)).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLUnsignedInt.parseValue(null)).toThrow(/Value is not a number/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLUnsignedInt.parseLiteral({ value: null, kind: Kind.INT }, {})).toThrow(
          /Value is not a number/,
        );
      });
    });

    describe('undefined', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedInt.serialize(undefined)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLUnsignedInt.parseValue(undefined)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedInt.parseLiteral({ value: undefined, kind: Kind.INT }, {}),
        ).toThrow(/Value is not a number/);
      });
    });

    describe('unsafe integer', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedInt.serialize(2 ** 53)).toThrow(/Value is not a safe integer/);
      });

      test('parseValue', () => {
        expect(() => GraphQLUnsignedInt.parseValue(2 ** 53)).toThrow(/Value is not a safe integer/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedInt.parseLiteral({ value: (2 ** 53).toString(), kind: Kind.INT }, {}),
        ).toThrow(/Value is not a safe integer/);
      });
    });

    describe('less than zero', () => {
      describe('as int', () => {
        test('serialize', () => {
          expect(() => GraphQLUnsignedInt.serialize(-1)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLUnsignedInt.parseValue(-1)).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLUnsignedInt.parseLiteral({ value: '-1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });

      describe('as string', () => {
        test('serialize', () => {
          expect(() => GraphQLUnsignedInt.serialize('-1')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseValue', () => {
          expect(() => GraphQLUnsignedInt.parseValue('-1')).toThrow(
            /Value is not a non-negative number/,
          );
        });

        test('parseLiteral', () => {
          expect(() =>
            GraphQLUnsignedInt.parseLiteral({ value: '-1', kind: Kind.INT }, {}),
          ).toThrow(/Value is not a non-negative number/);
        });
      });
    });

    describe('infinity', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedInt.serialize(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLUnsignedInt.parseValue(Number.POSITIVE_INFINITY)).toThrow(
          /Value is not a finite number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedInt.parseLiteral(
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
        expect(() => GraphQLUnsignedInt.serialize('not a number')).toThrow(/Value is not a number/);
      });

      test('parseValue', () => {
        expect(() => GraphQLUnsignedInt.parseValue('not a number')).toThrow(
          /Value is not a number/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedInt.parseLiteral(
            {
              value: 'not a number',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Can only validate integers as non-negative integers but got a/);
      });
    });

    describe('NaN', () => {
      test('serialize', () => {
        expect(() => GraphQLUnsignedInt.serialize(Number.NaN)).toThrow(/Value is not a number/);
      });

      // FIXME: Does nothing. No throw. Call doesn't even seem to get to the parseValue() function.
      // test('parseValue', () => {
      //   expect(() => GraphQLUnsignedInt.parseValue(Number.NaN)).toThrow(
      //     /Value is not a number/,
      //   );
      // });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLUnsignedInt.parseLiteral({ value: Number.NaN.toString(), kind: Kind.STRING }, {}),
        ).toThrow(/Can only validate integers as non-negative integers but got a/);
      });
    });
  });
});
