import { Kind, print, ValueNode } from 'graphql';
import { createGraphQLError } from '../../error.js';

export function identity<T>(value: T): T {
  return value;
}

export function ensureObject(value: any, ast?: ValueNode): object {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw createGraphQLError(
      `JSONObject cannot represent non-object value: ${value}`,
      ast
        ? {
            nodes: ast,
          }
        : undefined,
    );
  }

  return value;
}

export function parseObject(ast: ValueNode, variables: any): any {
  if (ast.kind !== Kind.OBJECT) {
    throw createGraphQLError(
      `JSONObject cannot represent non-object value: ${print(ast)}`,
      ast
        ? {
            nodes: ast,
          }
        : undefined,
    );
  }

  const value = Object.create(null);
  ast.fields.forEach(field => {
    // eslint-disable-next-line no-use-before-define
    value[field.name.value] = parseLiteral(field.value, variables);
  });

  return value;
}

export function parseLiteral(ast: ValueNode, variables: any): any {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(ast, variables);
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE: {
      const name = ast.name.value;
      return variables ? variables[name] : undefined;
    }
  }
}
