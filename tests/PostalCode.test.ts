/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLPostalCode } from '../src/scalars/PostalCode.js';

describe('PostalCode', () => {
  describe('valid', () => {
    describe('United States', () => {
      describe('basic', () => {
        test('serialize', () => {
          expect(GraphQLPostalCode.serialize('60031')).toBe('60031');
        });

        test('parseValue', () => {
          expect(GraphQLPostalCode.parseValue('60031')).toBe('60031');
        });

        test('parseLiteral', () => {
          expect(GraphQLPostalCode.parseLiteral({ value: '60031', kind: Kind.STRING }, {})).toBe(
            '60031',
          );
        });
      });
      describe('plus 4', () => {
        test('serialize', () => {
          expect(GraphQLPostalCode.serialize('60031-1234')).toBe('60031-1234');
        });

        test('parseValue', () => {
          expect(GraphQLPostalCode.parseValue('60031-1234')).toBe('60031-1234');
        });

        test('parseLiteral', () => {
          expect(
            GraphQLPostalCode.parseLiteral({ value: '60031-1234', kind: Kind.STRING }, {}),
          ).toBe('60031-1234');
        });
      });
    });

    // TODO: the rest of the countries
    describe('United Kingdom', () => {
      // Hi Paul, John, George and Ringo
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('NW8 9AY')).toBe('NW8 9AY');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('NW8 9AY')).toBe('NW8 9AY');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: 'NW8 9AY', kind: Kind.STRING }, {})).toBe(
          'NW8 9AY',
        );
      });
    });

    describe('Germany', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('10318')).toBe('10318');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('10318')).toBe('10318');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '10318', kind: Kind.STRING }, {})).toBe(
          '10318',
        );
      });
    });

    describe('Canada', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('M5T 1G2')).toBe('M5T 1G2');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('M5T 1G2')).toBe('M5T 1G2');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: 'M5T 1G2', kind: Kind.STRING }, {})).toBe(
          'M5T 1G2',
        );
      });
    });

    describe('France', () => {
      // Hi Xavier!
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('34000')).toBe('34000');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('34000')).toBe('34000');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '34000', kind: Kind.STRING }, {})).toBe(
          '34000',
        );
      });
    });

    describe('Italy', () => {
      // Ahhh...Venice!
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('30123')).toBe('30123');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('30123')).toBe('30123');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '30123', kind: Kind.STRING }, {})).toBe(
          '30123',
        );
      });
    });

    describe('Australia', () => {
      // Charles says, "Hi Mom."
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('4217')).toBe('4217');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('4217')).toBe('4217');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '4217', kind: Kind.STRING }, {})).toBe(
          '4217',
        );
      });
    });

    describe('Netherlands', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('1011 AC')).toBe('1011 AC');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('1011 AC')).toBe('1011 AC');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '1011 AC', kind: Kind.STRING }, {})).toBe(
          '1011 AC',
        );
      });
    });

    describe('Spain', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('28009')).toBe('28009');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('28009')).toBe('28009');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '28009', kind: Kind.STRING }, {})).toBe(
          '28009',
        );
      });
    });

    describe('Denmark', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('2100')).toBe('2100');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('2100')).toBe('2100');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '2100', kind: Kind.STRING }, {})).toBe(
          '2100',
        );
      });
    });

    describe('Sweden', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('114 55')).toBe('114 55');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('114 55')).toBe('114 55');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '114 55', kind: Kind.STRING }, {})).toBe(
          '114 55',
        );
      });
    });

    describe('Belgium', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('1043')).toBe('1043');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('1043')).toBe('1043');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '1043', kind: Kind.STRING }, {})).toBe(
          '1043',
        );
      });
    });

    describe('India', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('110003')).toBe('110003');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('110003')).toBe('110003');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '110003', kind: Kind.STRING }, {})).toBe(
          '110003',
        );
      });
    });

    describe('Iran', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('1345678987')).toBe('1345678987');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('1345678987')).toBe('1345678987');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '1345678987', kind: Kind.STRING }, {})).toBe(
          '1345678987',
        );
      });
    });

    describe('Japan', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('123-4567')).toBe('123-4567');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('123-4567')).toBe('123-4567');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '123-4567', kind: Kind.STRING }, {})).toBe(
          '123-4567',
        );
      });
    });

    describe('Ukraine', () => {
      test('serialize', () => {
        expect(GraphQLPostalCode.serialize('08001')).toBe('08001');
      });

      test('parseValue', () => {
        expect(GraphQLPostalCode.parseValue('08001')).toBe('08001');
      });

      test('parseLiteral', () => {
        expect(GraphQLPostalCode.parseLiteral({ value: '08001', kind: Kind.STRING }, {})).toBe(
          '08001',
        );
      });
    });
  });

  describe('invalid', () => {
    describe('not a postal code', () => {
      test('serialize', () => {
        expect(() => GraphQLPostalCode.serialize('this is not a postal code')).toThrow(
          /^Value is not a valid postal code/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPostalCode.parseValue('this is not a postal code')).toThrow(
          /^Value is not a valid postal code/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPostalCode.parseLiteral(
            { value: 'this is not a postal code', kind: Kind.STRING },
            {},
          ),
        ).toThrow(/^Value is not a valid postal code/);
      });
    });

    describe('not a string', () => {
      test('serialize', () => {
        expect(() => GraphQLPostalCode.serialize(123)).toThrow(/Value is not string/);
      });

      test('parseValue', () => {
        expect(() => GraphQLPostalCode.parseValue(123)).toThrow(/Value is not string/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLPostalCode.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow(
          /Can only validate strings as postal codes but got a/,
        );
      });
    });
  });
});
