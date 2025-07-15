import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { createGraphQLError } from '../error.js';

const CUID2_REGEX = /^[a-z][a-z0-9]{1,31}$/;

const validateCuid2 = (value: any, ast?: ValueNode) => {
  if (typeof value !== 'string') {
    throw createGraphQLError(`Value is not string: ${value}`, ast ? { nodes: ast } : undefined);
  }

  if (!CUID2_REGEX.test(value)) {
    throw createGraphQLError(
      `Value is not a valid cuid2: ${value}`,
      ast ? { nodes: ast } : undefined,
    );
  }

  return value;
};

const specifiedByURL = 'https://github.com/paralleldrive/cuid2';

export const GraphQLCuid2 = /*#__PURE__*/ new GraphQLScalarType({
  name: 'Cuid2',
  description: `A field whose value conforms to the cuid2 format, as specified in ${specifiedByURL}`,

  serialize: validateCuid2,
  parseValue: validateCuid2,

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw createGraphQLError(`Can only validate strings as cuid2 but got: ${ast.kind}`, {
        nodes: [ast],
      });
    }

    return validateCuid2(ast.value, ast);
  },

  specifiedByURL,
  extensions: {
    codegenScalarType: 'string',
    jsonSchema: {
      title: 'Cuid2',
      type: 'string',
      pattern: CUID2_REGEX.source,
    },
  },
});
