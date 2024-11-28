import { GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';
import { GraphQLLocale } from '../src/index.js';

describe('GraphQLLocale', () => {
  const locales = [
    'en',
    'en-GB',
    'en-US',
    'fr-CA',
    'de-DE',
    'zh-cmn-Hans-CN',
    'cmn-Hans-CN',
    'sr-Cyrl',
    'zh-Hans-CN',
    'de-CH-x-custom',
    'i-enochian',
    'unknown',
  ];
  const invalidLocales = [
    'fr_CA',
    null,
    undefined,
    '',
    'en-GB-x-',
    'en-',
    'en-GB-Hans',
    'de-419-DE',
    'a-DE',
  ];

  describe.each(locales)('valid locales', (locale: string) => {
    it(`${locale} succeeds on serialize`, async () =>
      expect(GraphQLLocale.serialize(locale)).toBe(locale));

    it(`${locale} succeeds on parseValue`, async () =>
      expect(GraphQLLocale.parseValue(locale)).toBe(locale));

    it(`${locale} succeeds on parseLiteral`, async () =>
      expect(GraphQLLocale.parseLiteral({ kind: Kind.STRING, value: locale }, null)).toBe(locale));
  });

  describe.each(invalidLocales)('invalid locales', (locale: string) => {
    it(`${locale} throws on serialize`, async () =>
      expect(() => GraphQLLocale.serialize(locale)).toThrow(GraphQLError));

    it(`${locale} throws on parseValue`, async () =>
      expect(() => GraphQLLocale.parseValue(locale)).toThrow(GraphQLError));

    it(`${locale} throws on parseLiteral`, async () =>
      expect(() => GraphQLLocale.parseLiteral({ kind: Kind.STRING, value: locale }, null)).toThrow(
        GraphQLError,
      ));
  });

  it('throws an error on other kind', () =>
    expect(() => GraphQLLocale.parseLiteral({ kind: Kind.INT, value: '1234' }, null)).toThrow(
      GraphQLError,
    ));
});
