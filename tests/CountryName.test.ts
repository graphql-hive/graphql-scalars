import { Kind } from 'graphql/language';
import {
  COUNTRY_NAMES as countryNameList,
  GraphQLCountryName,
} from '../src/scalars/CountryName.js';

describe('CountryName', () => {
  describe('valid', () => {
    for (const countryName of countryNameList) {
      describe(`${countryName}`, () => {
        test('serialize', () => {
          expect(GraphQLCountryName.serialize(countryName)).toBe(countryName);
        });
        test('parseValue', () => {
          expect(GraphQLCountryName.parseValue(countryName)).toBe(countryName);
        });
        test('parseLiteral', () => {
          expect(
            GraphQLCountryName.parseLiteral(
              {
                value: countryName,
                kind: Kind.STRING,
              },
              {},
            ),
          ).toBe(countryName);
        });
      });
    }
  });

  describe('invalid', () => {
    describe('not a country name', () => {
      test('serialize', () => {
        expect(() => GraphQLCountryName.serialize('this is not a country name')).toThrow(
          /^Value is not a valid country name/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLCountryName.parseValue('this is not a country name')).toThrow(
          /^Value is not a valid country name/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLCountryName.parseLiteral(
            { value: 'this is not a country name', kind: Kind.STRING },
            {},
          ),
        ).toThrow(/^Value is not a valid country name/);
      });
    });

    describe('not a string', () => {
      test('serialize', () => {
        expect(() => GraphQLCountryName.serialize(123)).toThrow(/Value is not string/);
      });

      test('parseValue', () => {
        expect(() => GraphQLCountryName.parseValue(123)).toThrow(/Value is not string/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLCountryName.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow(
          /Can only validate strings as country names but got a/,
        );
      });
    });
  });
});
