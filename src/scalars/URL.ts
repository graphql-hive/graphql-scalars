import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';

export const GraphQLURL = /*#__PURE__*/ new GraphQLScalarType<URL, string>({
  name: 'URL',

  description:
    'A field whose value conforms to the standard URL format as specified in RFC3986: https://www.ietf.org/rfc/rfc3986.txt.',

  serialize(value: any) {
    if (value === null) {
      return value;
    }

    return new URL(value.toString()).toString();
  },

  parseValue: (value: any) => (value === null ? value : new URL(value.toString())),

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw createGraphQLError(`Can only validate strings as URLs but got a: ${ast.kind}`, {
        nodes: ast,
      });
    }

    // ast.value can be null at runtime (exercised by the tests); pass it through in
    // that case, otherwise parse to a URL. Typed any to allow the null pass-through.
    const value: any = ast.value;
    return value === null ? value : new URL(value.toString());
  },
  extensions: {
    codegenScalarType: 'URL | string',
    jsonSchema: {
      type: 'string',
      format: 'uri',
    },
  },
});
