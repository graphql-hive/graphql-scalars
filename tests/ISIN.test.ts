import { Kind } from 'graphql/language';
import { GraphQLISIN } from '../src/scalars/ISIN.js';

describe('ISIN', () => {
  describe('valid', () => {
    describe('serialize', () => {
      test('Apple (US)', () => {
        expect(GraphQLISIN.serialize('US0378331005')).toBe('US0378331005');
      });
      test('Microsoft (US)', () => {
        expect(GraphQLISIN.serialize('US5949181045')).toBe('US5949181045');
      });
      test('Volkswagen (DE)', () => {
        expect(GraphQLISIN.serialize('DE0007664039')).toBe('DE0007664039');
      });
      test('Nestle (CH)', () => {
        expect(GraphQLISIN.serialize('CH0012221716')).toBe('CH0012221716');
      });
      test('Australian bond (AU)', () => {
        expect(GraphQLISIN.serialize('AU0000XVGZA3')).toBe('AU0000XVGZA3');
      });
      test('Euroclear supranational (XS)', () => {
        expect(GraphQLISIN.serialize('XS2057861614')).toBe('XS2057861614');
      });
      test('lowercase input is normalized', () => {
        expect(GraphQLISIN.serialize('us0378331005')).toBe('us0378331005');
      });
      test('input with whitespace is normalized', () => {
        expect(GraphQLISIN.serialize('US 0378331005')).toBe('US 0378331005');
      });
      test('accepts dashes between country and NSIN', () => {
        expect(GraphQLISIN.serialize('US-0378331005')).toBe('US-0378331005');
      });
      test('accepts dashes country dash NSIN dash check', () => {
        expect(GraphQLISIN.serialize('US-037833100-5')).toBe('US-037833100-5');
      });
      test('accepts arbitrary dashes', () => {
        expect(GraphQLISIN.serialize('US-037833-100-5')).toBe('US-037833-100-5');
      });
    });

    describe('parseValue', () => {
      test('Apple (US)', () => {
        expect(GraphQLISIN.parseValue('US0378331005')).toBe('US0378331005');
      });
      test('GB stock', () => {
        expect(GraphQLISIN.parseValue('GB0002634946')).toBe('GB0002634946');
      });
    });

    describe('parseLiteral', () => {
      test('Apple (US)', () => {
        expect(GraphQLISIN.parseLiteral({ value: 'US0378331005', kind: Kind.STRING }, {})).toBe(
          'US0378331005',
        );
      });
      test('Volkswagen (DE)', () => {
        expect(GraphQLISIN.parseLiteral({ value: 'DE0007664039', kind: Kind.STRING }, {})).toBe(
          'DE0007664039',
        );
      });
    });
  });

  describe('invalid', () => {
    describe('serialize', () => {
      // wrong type
      test('throws on number input', () => {
        expect(() => GraphQLISIN.serialize(123)).toThrow(/Value is not string/);
      });
      test('throws on null', () => {
        expect(() => GraphQLISIN.serialize(null)).toThrow(/Value is not string/);
      });

      // wrong format
      test('throws on too short', () => {
        expect(() => GraphQLISIN.serialize('US037833100')).toThrow(/Value is not a valid ISIN/);
      });
      test('throws on too long', () => {
        expect(() => GraphQLISIN.serialize('US03783310055')).toThrow(/Value is not a valid ISIN/);
      });
      test('throws on empty string', () => {
        expect(() => GraphQLISIN.serialize('')).toThrow(/Value is not a valid ISIN/);
      });

      // invalid country code
      test('throws on unknown country code ZZ', () => {
        expect(() => GraphQLISIN.serialize('ZZ0378331005')).toThrow(/Value is not a valid ISIN/);
      });

      // invalid check digit
      test('throws when check digit is wrong', () => {
        // US0378331005 is valid — mutate last digit
        expect(() => GraphQLISIN.serialize('US0378331004')).toThrow(/Value is not a valid ISIN/);
      });
      test('throws when check digit is wrong (off by 2)', () => {
        expect(() => GraphQLISIN.serialize('US0378331007')).toThrow(/Value is not a valid ISIN/);
      });

      // special edge cases
      test('throws on all zeros with wrong check digit', () => {
        expect(() => GraphQLISIN.serialize('US00000000001')).toThrow(/Value is not a valid ISIN/);
      });
      test('throws on non-alphanumeric characters', () => {
        expect(() => GraphQLISIN.serialize('US037833100!')).toThrow(/Value is not a valid ISIN/);
      });
    });

    describe('parseValue', () => {
      test('throws on wrong check digit', () => {
        expect(() => GraphQLISIN.parseValue('US0378331004')).toThrow(/Value is not a valid ISIN/);
      });
      test('throws on invalid country code', () => {
        expect(() => GraphQLISIN.parseValue('ZZ0378331005')).toThrow(/Value is not a valid ISIN/);
      });
    });

    describe('parseLiteral', () => {
      test('throws on non-string kind', () => {
        expect(() => GraphQLISIN.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow(
          /Can only validate strings as ISINs/,
        );
      });
      test('throws on wrong check digit', () => {
        expect(() =>
          GraphQLISIN.parseLiteral({ value: 'US0378331004', kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid ISIN/);
      });
    });
  });
});
