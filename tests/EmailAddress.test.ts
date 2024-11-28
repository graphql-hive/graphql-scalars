/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLEmailAddress } from '../src/scalars/EmailAddress.js';

describe('EmailAddress', () => {
  describe('valid', () => {
    test('serialize', () => {
      expect(GraphQLEmailAddress.serialize('test@test.com')).toBe('test@test.com');
    });

    test('parseValue', () => {
      expect(GraphQLEmailAddress.parseValue('test@test.com')).toBe('test@test.com');
    });

    test('parseValue', () => {
      expect(GraphQLEmailAddress.parseValue('test@test')).toBe('test@test');
    });

    test('parseLiteral', () => {
      expect(
        GraphQLEmailAddress.parseLiteral(
          {
            value: 'test@test.com',
            kind: Kind.STRING,
          },
          {},
        ),
      ).toBe('test@test.com');
    });

    test('parseLiteral', () => {
      expect(
        GraphQLEmailAddress.parseLiteral(
          {
            value: 'test@test',
            kind: Kind.STRING,
          },
          {},
        ),
      ).toBe('test@test');
    });
  });

  describe('invalid', () => {
    describe('not an email address', () => {
      test('serialize', () => {
        expect(() => GraphQLEmailAddress.serialize('this is not an email address')).toThrow(
          /Value is not a valid email address/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLEmailAddress.parseValue('this is not an email address')).toThrow(
          /Value is not a valid email address/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLEmailAddress.parseLiteral(
            {
              value: 'this is not an email address',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value is not a valid email address/);
      });
    });

    describe('not a string', () => {
      test('serialize', () => {
        expect(() => GraphQLEmailAddress.serialize(123)).toThrow(/Value is not string/);
      });

      test('parseValue', () => {
        expect(() => GraphQLEmailAddress.parseValue(123)).toThrow(/Value is not string/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLEmailAddress.parseLiteral({ value: '123', kind: Kind.INT }, {}),
        ).toThrow(/Can only validate strings as email addresses but got a/);
      });
    });
  });
});
