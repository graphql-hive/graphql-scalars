import { Kind } from 'graphql/language';
import { COUNTRY_CODES, GraphQLCountryCode } from '../src/scalars/CountryCode.js';

describe('GraphQLCountryCode Scalar', () => {
  describe('valid country codes', () => {
    for (const code of COUNTRY_CODES) {
      it(`should accept valid country code: ${code}`, () => {
        expect(GraphQLCountryCode.serialize(code)).toBe(code);
        expect(GraphQLCountryCode.parseValue(code)).toBe(code);
        expect(GraphQLCountryCode.parseLiteral({ value: code, kind: Kind.STRING }, {})).toBe(code);
      });
    }
  });

  describe('invalid values', () => {
    it('should reject unknown country code string', () => {
      const invalid = 'XX';
      expect(() => GraphQLCountryCode.serialize(invalid)).toThrow(
        /Value is not a valid country code/,
      );
      expect(() => GraphQLCountryCode.parseValue(invalid)).toThrow(
        /Value is not a valid country code/,
      );
      expect(() =>
        GraphQLCountryCode.parseLiteral({ value: invalid, kind: Kind.STRING }, {}),
      ).toThrow(/Value is not a valid country code/);
    });

    it('should reject non-string values', () => {
      const invalid = 123;
      expect(() => GraphQLCountryCode.serialize(invalid)).toThrow(/Value is not string/);
      expect(() => GraphQLCountryCode.parseValue(invalid)).toThrow(/Value is not string/);
    });

    it('should reject non-string AST kind', () => {
      expect(() => GraphQLCountryCode.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow(
        /Can only validate strings as country codes but got a: IntValue/,
      );
    });
  });
});
