/* global describe, test, expect */
import { Kind } from 'graphql/language';
import { GraphQLLCCSubclass } from '../src/scalars/library/LCCSubclass.js';

describe('DID', () => {
  describe('valid - LCC Subclass', () => {
    test('serialize classes', () => {
      expect(GraphQLLCCSubclass.serialize('AI')).toBe('AI');
      expect(GraphQLLCCSubclass.serialize('E')).toBe('E');
      expect(GraphQLLCCSubclass.serialize('KBM')).toBe('KBM');
    });

    test('parseValue classes', () => {
      expect(GraphQLLCCSubclass.parseValue('AI')).toBe('AI');
      expect(GraphQLLCCSubclass.parseValue('E')).toBe('E');
      expect(GraphQLLCCSubclass.parseValue('KBM')).toBe('KBM');
    });

    test('parseLiteral classes', () => {
      expect(GraphQLLCCSubclass.parseLiteral({ value: 'AI', kind: Kind.STRING }, {})).toBe('AI');
      expect(GraphQLLCCSubclass.parseLiteral({ value: 'E', kind: Kind.STRING }, {})).toBe('E');
      expect(GraphQLLCCSubclass.parseLiteral({ value: 'KBM', kind: Kind.STRING }, {})).toBe('KBM');
    });
  });

  describe('invalid', () => {
    describe('not an LCC Class A', () => {
      expect(() => GraphQLLCCSubclass.serialize('invalidexample')).toThrow(
        /Value is not a valid LCC Subclass/,
      );
    });

    test(`parseValue invaliddidexample`, () => {
      expect(() => GraphQLLCCSubclass.parseValue('invaliddidexample')).toThrow(
        /Value is not a valid LCC Subclass/,
      );
    });

    test(`parseLiteral invaliddidexample`, () => {
      expect(() =>
        GraphQLLCCSubclass.parseLiteral({ value: 'invaliddidexample', kind: Kind.STRING }, {}),
      ).toThrow(/Value is not a valid LCC Subclass/);
    });
  });

  describe('not a string', () => {
    test('serialize', () => {
      expect(() => GraphQLLCCSubclass.serialize(123)).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLLCCSubclass.parseValue(123)).toThrow();
    });

    test('parseLiteral', () => {
      expect(() => GraphQLLCCSubclass.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow();
    });
  });

  describe('not a empty string', () => {
    test('serialize', () => {
      expect(() => GraphQLLCCSubclass.serialize('')).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLLCCSubclass.parseValue('')).toThrow();
    });

    test('parseLiteral', () => {
      expect(() => GraphQLLCCSubclass.parseLiteral({ value: '', kind: Kind.STRING }, {})).toThrow();
    });
  });
});
