/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLCuid } from '../src/scalars/Cuid.js';

describe('Cuid', () => {
  describe('valid', () => {
    test('serialize', () => {
      expect(GraphQLCuid.serialize('cjld2cyuq0000t3rmniod1foy')).toBe('cjld2cyuq0000t3rmniod1foy');
    });

    test('parseValue', () => {
      expect(GraphQLCuid.parseValue('cjld2cyuq0000t3rmniod1foy')).toBe('cjld2cyuq0000t3rmniod1foy');
    });

    test('parseLiteral', () => {
      expect(
        GraphQLCuid.parseLiteral(
          {
            value: 'cjld2cyuq0000t3rmniod1foy',
            kind: Kind.STRING,
          },
          {},
        ),
      ).toBe('cjld2cyuq0000t3rmniod1foy');
    });
  });

  describe('invalid', () => {
    describe('not a cuid', () => {
      test('serialize', () => {
        expect(() => GraphQLCuid.serialize('this is not a cuid')).toThrow(
          /Value is not a valid cuid/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLCuid.parseValue('this is not a cuid')).toThrow(
          /Value is not a valid cuid/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLCuid.parseLiteral(
            {
              value: 'this is not a cuid',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value is not a valid cuid/);
      });
    });

    describe('not a string', () => {
      test('serialize', () => {
        expect(() => GraphQLCuid.serialize(123)).toThrow(/Value is not string/);
      });

      test('parseValue', () => {
        expect(() => GraphQLCuid.parseValue(123)).toThrow(/Value is not string/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLCuid.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow(
          /Can only validate strings as cuids but got a/,
        );
      });
    });
  });
});
