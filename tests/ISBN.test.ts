/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLISBN } from '../src/scalars/ISBN.js';

// Taken from https://github.com/hapijs/joi/blob/master/test/types/string.js
const serialNumbers = [
  // 10 chars with ISBN prefix
  `ISBN 1561616161`,
  `ISBN 1577677171`,
  `ISBN 978 787 78 78`,
  `ISBN 978 787 7878`,
  `ISBN 978-0615-856`,
  `ISBN 9790765335`,
  `ISBN 979076533X`,
  `ISBN: 978-0615-856`,
  `ISBN: 9780615856`,

  // 10 chars without ISBN prefix
  `1577677171`,
  `978 787 78 78`,
  `978 787 7878`,
  `978-0615-856`,
  `9790765335`,
  `979076533X`,
  `978-0615-856`,
  `9780615856`,
  `9780615856`,
  `978 787 7878`,

  // 13 chars with ISBN prefix
  `ISBN 978 787 78 78788`,
  `ISBN 978-0615-856-73-5`,
  `ISBN 9790765335999`,
  `ISBN-13: 978-0615-856-73-5`,
  `ISBN-13: 978-0615856735`,
  `ISBN-13: 9780765335999`,
  `ISBN: 978-0615-856-73-5`,
  `ISBN: 9780615856735`,

  // 13 chars without ISBN prefix
  `978-0615-856-73-5`,
  `978-0615856735`,
  `9780765335999`,
  `978-0615-856-73-5`,
  `9780615856735`,
];

describe(`ISBN`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      for (const value of serialNumbers) {
        expect(GraphQLISBN.serialize(value)).toEqual(value);
      }
    });

    it(`parseValue`, () => {
      for (const value of serialNumbers) {
        expect(GraphQLISBN.parseValue(value)).toEqual(value);
      }
    });

    it(`parseLiteral`, () => {
      for (const value of serialNumbers) {
        expect(
          GraphQLISBN.parseLiteral(
            {
              value,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toEqual(value);
      }
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid ISBN address`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLISBN.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLISBN.serialize(`this is not an ISBN number`)).toThrow(
          /Value is not a valid ISBN number/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLISBN.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLISBN.parseValue(`this is not an ISBN number`)).toThrow(
          /Value is not a valid ISBN number/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLISBN.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as ISBN numbers but got a/,
        );

        expect(() =>
          GraphQLISBN.parseLiteral({ value: `this is not an ISBN number`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid ISBN number/);
      });
    });
  });
});
