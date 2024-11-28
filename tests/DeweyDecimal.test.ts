/* global describe, test, expect */
import { Kind } from 'graphql/language';
import { GraphQLDeweyDecimal } from '../src/scalars/library/DeweyDecimal.js';

describe('DID', () => {
  describe('valid - Dewey Decimal', () => {
    test('serialize', () => {
      expect(GraphQLDeweyDecimal.serialize('1')).toBe('1');
      expect(GraphQLDeweyDecimal.serialize('1.2345')).toBe('1.2345');
      expect(GraphQLDeweyDecimal.serialize('01')).toBe('01');
      expect(GraphQLDeweyDecimal.serialize('01.2345')).toBe('01.2345');
      expect(GraphQLDeweyDecimal.serialize('001')).toBe('001');
      expect(GraphQLDeweyDecimal.serialize('001.2345')).toBe('001.2345');
      expect(GraphQLDeweyDecimal.serialize('10')).toBe('10');
      expect(GraphQLDeweyDecimal.serialize('10.2345')).toBe('10.2345');
      expect(GraphQLDeweyDecimal.serialize('010')).toBe('010');
      expect(GraphQLDeweyDecimal.serialize('010.2345')).toBe('010.2345');
      expect(GraphQLDeweyDecimal.serialize('100')).toBe('100');
      expect(GraphQLDeweyDecimal.serialize('100.2345')).toBe('100.2345');
    });

    test('parseValue', () => {
      expect(GraphQLDeweyDecimal.parseValue('1')).toBe('1');
      expect(GraphQLDeweyDecimal.parseValue('1.2345')).toBe('1.2345');
      expect(GraphQLDeweyDecimal.parseValue('01')).toBe('01');
      expect(GraphQLDeweyDecimal.parseValue('01.2345')).toBe('01.2345');
      expect(GraphQLDeweyDecimal.parseValue('001')).toBe('001');
      expect(GraphQLDeweyDecimal.parseValue('001.2345')).toBe('001.2345');
      expect(GraphQLDeweyDecimal.parseValue('10')).toBe('10');
      expect(GraphQLDeweyDecimal.parseValue('10.2345')).toBe('10.2345');
      expect(GraphQLDeweyDecimal.parseValue('010')).toBe('010');
      expect(GraphQLDeweyDecimal.parseValue('010.2345')).toBe('010.2345');
      expect(GraphQLDeweyDecimal.parseValue('100')).toBe('100');
      expect(GraphQLDeweyDecimal.parseValue('100.2345')).toBe('100.2345');
    });

    test('parseLiteral', () => {
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '1', kind: Kind.STRING }, {})).toBe('1');
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '1.2345', kind: Kind.STRING }, {})).toBe(
        '1.2345',
      );
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '01', kind: Kind.STRING }, {})).toBe('01');
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '01.2345', kind: Kind.STRING }, {})).toBe(
        '01.2345',
      );
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '001', kind: Kind.STRING }, {})).toBe('001');
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '001.2345', kind: Kind.STRING }, {})).toBe(
        '001.2345',
      );
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '10', kind: Kind.STRING }, {})).toBe('10');
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '10.2345', kind: Kind.STRING }, {})).toBe(
        '10.2345',
      );
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '010', kind: Kind.STRING }, {})).toBe('010');
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '010.2345', kind: Kind.STRING }, {})).toBe(
        '010.2345',
      );
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '100', kind: Kind.STRING }, {})).toBe('100');
      expect(GraphQLDeweyDecimal.parseLiteral({ value: '100.2345', kind: Kind.STRING }, {})).toBe(
        '100.2345',
      );
    });
  });

  describe('invalid', () => {
    describe('not a Dewey Decimal', () => {
      expect(() => GraphQLDeweyDecimal.serialize('invaliddid')).toThrow(
        /Value is not a valid Dewey Decimal Number/,
      );
    });

    test(`parseValue invaliddidexample`, () => {
      expect(() => GraphQLDeweyDecimal.parseValue('invaliddidexample')).toThrow(
        /Value is not a valid Dewey Decimal Number/,
      );
    });

    test(`parseLiteral invaliddidexample`, () => {
      expect(() =>
        GraphQLDeweyDecimal.parseLiteral({ value: 'invaliddidexample', kind: Kind.STRING }, {}),
      ).toThrow(/Value is not a valid Dewey Decimal Number/);
    });
  });

  describe('not a string', () => {
    test('serialize', () => {
      expect(() => GraphQLDeweyDecimal.serialize(123)).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLDeweyDecimal.parseValue(123)).toThrow();
    });

    test('parseLiteral', () => {
      expect(() =>
        GraphQLDeweyDecimal.parseLiteral({ value: '123', kind: Kind.INT }, {}),
      ).toThrow();
    });
  });

  describe('not a empty string', () => {
    test('serialize', () => {
      expect(() => GraphQLDeweyDecimal.serialize('')).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLDeweyDecimal.parseValue('')).toThrow();
    });

    test('parseLiteral', () => {
      expect(() =>
        GraphQLDeweyDecimal.parseLiteral({ value: '', kind: Kind.STRING }, {}),
      ).toThrow();
    });
  });
});
