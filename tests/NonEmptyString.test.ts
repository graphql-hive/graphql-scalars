/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLNonEmptyString } from '../src/scalars/NonEmptyString.js';

describe('NonEmptyString', () => {
  describe('valid', () => {
    test('serialize', () => {
      expect(GraphQLNonEmptyString.serialize('string')).toBe('string');
    });

    test('parseValue', () => {
      expect(GraphQLNonEmptyString.parseValue('string')).toBe('string');
    });

    test('parseValue', () => {
      expect(GraphQLNonEmptyString.parseValue('string')).toBe('string');
    });

    test('parseLiteral', () => {
      expect(
        GraphQLNonEmptyString.parseLiteral(
          {
            value: 'string',
            kind: Kind.STRING,
          },
          {},
        ),
      ).toBe('string');
    });
  });

  describe('invalid', () => {
    describe('an empty string', () => {
      test('serialize', () => {
        expect(() => GraphQLNonEmptyString.serialize('')).toThrow(
          /Value cannot be an empty string/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLNonEmptyString.parseValue('')).toThrow(
          /Value cannot be an empty string/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonEmptyString.parseLiteral(
            {
              value: '',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value cannot be an empty string/);
      });

      test('serialize', () => {
        //eslint-disable-next-line
        expect(() => GraphQLNonEmptyString.serialize('   ')).toThrow(
          /Value cannot be an empty string/,
        );
      });

      test('parseValue', () => {
        //eslint-disable-next-line
        expect(() => GraphQLNonEmptyString.parseValue('   ')).toThrow(
          /Value cannot be an empty string/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonEmptyString.parseLiteral(
            {
              //eslint-disable-next-line
              value: '   ',
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value cannot be an empty string/);
      });
    });

    describe('not a string', () => {
      test('serialize', () => {
        expect(() => GraphQLNonEmptyString.serialize(123)).toThrow(/Value is not a string/);
      });

      test('parseValue', () => {
        expect(() => GraphQLNonEmptyString.parseValue(123)).toThrow(/Value is not a string/);
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLNonEmptyString.parseLiteral({ value: '123', kind: Kind.INT }, {}),
        ).toThrow(/Can only validate strings but got a/);
      });
    });
  });
});
