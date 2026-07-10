import { GraphQLScalarType, Kind } from 'graphql';
import { createGraphQLError } from '../error.js';

// The regex supports all phone numbers compliant with the E.164 international format standard,
// which includes country codes (Optional), area codes, and local numbers and extension (optional). For more information on E.164 formatting,
// Regex: https://regex101.com/r/nol2F6/1
// Ex. +62 (21) 9175 5194, 2191755194, +1 123-456-7890 12345, +1 (123) 456-7890
const PHONE_NUMBER_REGEX = /^\+?\d{1,3}(\-|\x20)?\(?\d+\)?((\-|\x20)?\d+)+$/;

export const GraphQLPhoneNumber = /*#__PURE__*/ new GraphQLScalarType({
  name: 'PhoneNumber',

  description:
    'A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234.',

  serialize(value) {
    if (typeof value !== 'string') {
      throw createGraphQLError(`Value is not string: ${value}`);
    }

    if (!PHONE_NUMBER_REGEX.test(value)) {
      throw createGraphQLError(
        `Invalid phone number: ${value}. Please ensure it's in a valid format. The country code is optional, and Spaces and dashes are allowed. Examples: +1 (123) 456-7890, +44 (20) 2121 2222, or 123 456-7890.`,
      );
    }

    return value;
  },

  parseValue(value) {
    if (typeof value !== 'string') {
      throw createGraphQLError(`Value is not string: ${value}`);
    }

    if (!PHONE_NUMBER_REGEX.test(value)) {
      throw createGraphQLError(
        `Invalid phone number: ${value}. Please ensure it's in a valid format. The country code is optional, and Spaces and dashes are allowed. Examples: +1 (123) 456-7890, +44 (20) 2121 2222, or 123 456-7890.`,
      );
    }

    return value;
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw createGraphQLError(
        `Can only validate strings as phone numbers but got a: ${ast.kind}`,
        { nodes: ast },
      );
    }

    if (!PHONE_NUMBER_REGEX.test(ast.value)) {
      throw createGraphQLError(
        `Invalid phone number: ${ast.value}. Please ensure it's in a valid format. The country code is optional, and Spaces and dashes are allowed. Examples: +1 (123) 456-7890, +44 (20) 2121 2222, or 123 456-7890.`,
        { nodes: ast },
      );
    }

    return ast.value;
  },
  extensions: {
    codegenScalarType: 'string',
    jsonSchema: {
      title: 'PhoneNumber',
      type: 'string',
      pattern: PHONE_NUMBER_REGEX.source,
    },
  },
});
