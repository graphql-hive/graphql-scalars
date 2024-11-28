/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLTimeZone } from '../src/scalars/TimeZone.js';

describe('TimeZone', () => {
  describe('valid - region', () => {
    const TEST_REGION = 'America/Chicago';

    test('serialize', () => {
      expect(GraphQLTimeZone.serialize(TEST_REGION)).toBe(TEST_REGION);
    });

    test('parseValue', () => {
      expect(GraphQLTimeZone.parseValue(TEST_REGION)).toBe(TEST_REGION);
    });

    test('parseLiteral', () => {
      expect(GraphQLTimeZone.parseLiteral({ value: TEST_REGION, kind: Kind.STRING }, {})).toBe(
        TEST_REGION,
      );
    });
  });

  describe('valid - GMT offset', () => {
    const TEST_OFFSET = 'Etc/GMT-6';

    test('serialize', () => {
      expect(GraphQLTimeZone.serialize(TEST_OFFSET)).toBe(TEST_OFFSET);
    });

    test('parseValue', () => {
      expect(GraphQLTimeZone.parseValue(TEST_OFFSET)).toBe(TEST_OFFSET);
    });

    test('parseLiteral', () => {
      expect(GraphQLTimeZone.parseLiteral({ value: TEST_OFFSET, kind: Kind.STRING }, {})).toBe(
        TEST_OFFSET,
      );
    });
  });

  describe('invalid - not an IANA time zone', () => {
    const TEST_INVALID_TZ = 'notatimezone';

    test('serialize', () => {
      expect(() => GraphQLTimeZone.serialize(TEST_INVALID_TZ)).toThrow(
        /Value is not a valid IANA time zone:/,
      );
    });

    test(`parseValue`, () => {
      expect(() => GraphQLTimeZone.parseValue(TEST_INVALID_TZ)).toThrow(
        /Value is not a valid IANA time zone:/,
      );
    });

    test(`parseLiteral`, () => {
      expect(() =>
        GraphQLTimeZone.parseLiteral({ value: TEST_INVALID_TZ, kind: Kind.STRING }, {}),
      ).toThrow(/Value is not a valid IANA time zone:/);
    });
  });

  describe('invalid - not a string', () => {
    test('serialize', () => {
      expect(() => GraphQLTimeZone.serialize(123)).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLTimeZone.parseValue(123)).toThrow();
    });

    test('parseLiteral', () => {
      expect(() => GraphQLTimeZone.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow();
    });
  });
});
