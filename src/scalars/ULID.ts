import { GraphQLScalarType, Kind, ValueNode } from 'graphql';
import { createGraphQLError } from '../error.js';

const ULID_REGEX = /^[0-7][0-9ABCDEFGHJKMNPQRSTVWXYZ]{25}$/i;

/**
 * Check if a ULID is valid according to the official spec
 * @param id The ULID to test
 * @returns True if valid, false otherwise
 */
const isValid = (id: string): boolean => {
  return typeof id === 'string' && ULID_REGEX.test(id);
};

const validate = (value: unknown, ast?: ValueNode): string => {
  if (typeof value !== 'string') {
    throw createGraphQLError(
      'ULID can only parse String',
      ast
        ? {
            nodes: ast,
          }
        : undefined,
    );
  }

  if (!isValid(value)) {
    throw createGraphQLError(
      'Invalid ULID format',
      ast
        ? {
            nodes: ast,
          }
        : undefined,
    );
  }

  // Return the normalized uppercase version
  return value.toUpperCase();
};

export const GraphQLULID = /*#__PURE__*/ new GraphQLScalarType({
  name: 'ULID',
  description:
    'A ULID (Universally Unique Lexicographically Sortable Identifier) is a 26-character ' +
    'string that is URL-safe, case-insensitive, and lexicographically sortable.',
  serialize(value: unknown) {
    return validate(value);
  },
  parseValue(value: unknown) {
    return validate(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return validate(ast.value, ast);
    }
    throw createGraphQLError(`ULID can only parse String but got '${ast.kind}'`, {
      nodes: [ast],
    });
  },
  extensions: {
    codegenScalarType: 'string',
    jsonSchema: {
      title: 'ULID',
      type: 'string',
      pattern: ULID_REGEX.source,
      minLength: 26,
      maxLength: 26,
    },
  },
});
