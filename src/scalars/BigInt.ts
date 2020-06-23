// Based on https://github.com/stems/graphql-bigint/

import { Kind, GraphQLScalarType } from 'graphql';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

function isBigIntAvailable() {
  return (
    (typeof global === 'object' && (global as any).BigInt) ||
    (typeof window === 'object' && (window as any).BigInt)
  );
}

function patchBigInt() {
  if (!BigInt.prototype.toJSON) {
    BigInt.prototype.toJSON =
      BigInt.prototype.toJSON ||
      function (this: bigint) {
        return this.toString();
      };
  }
}

function coerceBigIntValue(value: bigint | number | string) {
  if (isBigIntAvailable()) {
    patchBigInt();
    return BigInt(value);
  } else {
    return Number(value);
  }
}

export const GraphQLBigInt = /*#__PURE__*/ new GraphQLScalarType({
  name: 'BigInt',
  description:
    'The `BigInt` scalar type represents non-fractional signed whole numeric values.',
  serialize: coerceBigIntValue,
  parseValue: coerceBigIntValue,
  parseLiteral(ast) {
    if (
      ast.kind === Kind.INT ||
      ast.kind === Kind.FLOAT ||
      ast.kind === Kind.STRING
    ) {
      return coerceBigIntValue(ast.value);
    }
    return null;
  },
});
