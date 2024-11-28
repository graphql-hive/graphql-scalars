/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLJWT } from '../src/scalars/JWT.js';

// HEADER: {
//   "alg": "HS256",
//   "typ": "JWT"
// }
//
// PAYLOAD: {
//   "sub": "1234567890",
//   "iat": 1516239022,
//   "project": "graphql-scalars"
// }
//
// SIGNATURE: {
//   HMACSHA256(
//     base64UrlEncode(header) + "." +
//     base64UrlEncode(payload),
//     password
//   )
// }
const JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJwcm9qZWN0IjoiZ3JhcGhxbC1zY2FsYXJzIn0.nYdrSfE2nNRAgpiEU1uKgn2AYYKLo28Z0nhPXvsuIww`;

describe(`JWT`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      expect(GraphQLJWT.serialize(JWT)).toEqual(JWT);
    });

    it(`parseValue`, () => {
      expect(GraphQLJWT.parseValue(JWT)).toEqual(JWT);
    });

    it(`parseLiteral`, () => {
      expect(
        GraphQLJWT.parseLiteral(
          {
            value: JWT,
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual(JWT);
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid JWT`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLJWT.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLJWT.serialize(`this is not a jwt`)).toThrow(/Value is not a valid JWT/);
        expect(() => GraphQLJWT.serialize(`missing.signature`)).toThrow(/Value is not a valid JWT/);
        expect(() => GraphQLJWT.serialize(`missing.`)).toThrow(/Value is not a valid JWT/);
        expect(() => GraphQLJWT.serialize(`missing`)).toThrow(/Value is not a valid JWT/);
      });

      it(`parseValue`, () => {
        expect(() => GraphQLJWT.parseValue(123)).toThrow(/Value is not string/);
        expect(() => GraphQLJWT.parseValue(`this is not a JWT`)).toThrow(
          /Value is not a valid JWT/,
        );
        expect(() => GraphQLJWT.parseValue(`missing.signature`)).toThrow(
          /Value is not a valid JWT/,
        );
        expect(() => GraphQLJWT.parseValue(`missing.`)).toThrow(/Value is not a valid JWT/);
        expect(() => GraphQLJWT.parseValue(`missing`)).toThrow(/Value is not a valid JWT/);
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLJWT.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as JWT but got a/,
        );

        expect(() =>
          GraphQLJWT.parseLiteral({ value: `this is not a JWT`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid JWT/);
        expect(() =>
          GraphQLJWT.parseLiteral(
            {
              value: `missing.signature`,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value is not a valid JWT/);
        expect(() =>
          GraphQLJWT.parseLiteral(
            {
              value: `missing.`,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value is not a valid JWT/);
        expect(() =>
          GraphQLJWT.parseLiteral(
            {
              value: `missing`,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toThrow(/Value is not a valid JWT/);
      });
    });
  });
});
