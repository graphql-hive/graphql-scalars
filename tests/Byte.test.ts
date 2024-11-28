/* global describe, test, expect */

import { Kind, ObjectValueNode, ValueNode } from 'graphql/language';
import { GraphQLByte } from '../src/scalars/Byte.js';

const byte = Buffer.from([68, 111, 100, 103, 101, 114, 115, 32, 82, 117, 108, 101, 33]);
const slashByte = Buffer.from([
  82, 71, 57, 107, 90, 50, 86, 121, 99, 121, 66, 83, 100, 87, 120, 108, 73, 81, 47, 97, 81, 61,
]);
const byteLeading0 = Buffer.from([4, 8, 15, 16, 23, 42]);
const base64String = byte.toString('base64');
const hexString = byte.toString('hex');
const hexLeading0 = byteLeading0.toString('hex');
const notBase64 = 'RG9kZ2VycyBSdWxlIQ=';
const slashBase64String = slashByte.toString('base64');
const notHex = '446f64676572732052756c65z';
const looksLikeBase64 = 'c40473746174';
const looksLikeBase64Buffer = Buffer.from(looksLikeBase64, 'hex');
const looksLikeHex = 'xARzdGF0';
const looksLikeHexBuffer = Buffer.from(looksLikeHex, 'base64');
const notByte = 1;

function createBufferObject(type: string, values: ValueNode[]): ObjectValueNode {
  return {
    fields: [
      {
        kind: Kind.OBJECT_FIELD,
        name: {
          kind: Kind.NAME,
          value: 'type',
        },
        value: {
          kind: Kind.STRING,
          value: type,
        },
      },
      {
        kind: Kind.OBJECT_FIELD,
        name: {
          kind: Kind.NAME,
          value: 'data',
        },
        value: {
          kind: Kind.LIST,
          values,
        },
      },
    ],
    kind: Kind.OBJECT,
  };
}

describe.each<[string, Buffer | string, string | number]>([
  ['Buffer', byte, notByte],
  ['Base64 String', base64String, notBase64],
  ['Hex String', hexString, notHex],
])('Byte', (testType, value, notValue) => {
  describe('valid', () => {
    test(`serialize (${testType})`, () => {
      expect(GraphQLByte.serialize(value)).toEqual(byte);
    });

    test(`parseValue (${testType})`, () => {
      expect(GraphQLByte.parseValue(value)).toEqual(byte);
    });

    test(`parseLiteral (${testType})`, () => {
      if (typeof value === 'string') {
        expect(
          GraphQLByte.parseLiteral(
            {
              value,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toEqual(byte);
      } else {
        const bufferJson = value.toJSON();
        expect(
          GraphQLByte.parseLiteral(
            createBufferObject(
              'Buffer',
              bufferJson.data.map(value => ({
                kind: Kind.INT,
                value: value.toString(),
              })),
            ),
            {},
          ),
        ).toEqual(byte);
      }
    });
  });

  describe('invalid', () => {
    test('serialize', () => {
      expect(() => GraphQLByte.serialize(notValue)).toThrow(/Value is not/);
    });

    test('parseValue', () => {
      expect(() => GraphQLByte.parseValue(notValue)).toThrow(/Value is not/);
    });

    test(`parseLiteral (${testType})`, () => {
      if (typeof notValue === 'string') {
        expect(() =>
          GraphQLByte.parseLiteral(
            {
              value: notValue,
              kind: Kind.INT,
            },
            {},
          ),
        ).toThrow(/Can only parse/);
      } else {
        expect(() => {
          GraphQLByte.parseLiteral(createBufferObject('Path', []), {});
        }).toThrow(/Value is not a JSON representation of Buffer/);
      }
    });
  });
});

describe.each<[string, string, Buffer]>([
  ['Hex String desguised as base64', looksLikeBase64, looksLikeBase64Buffer],
  ['Base64 String desguised as hex', looksLikeHex, looksLikeHexBuffer],
])('Byte string edge cases', (testType, encodedValue, decodedValue) => {
  test(`serialize (${testType})`, () => {
    expect(GraphQLByte.serialize(encodedValue)).toEqual(decodedValue);
  });

  test(`parseValue (${testType})`, () => {
    expect(GraphQLByte.parseValue(encodedValue)).toEqual(decodedValue);
  });
});

describe('hex with leading 0', () => {
  test('should return true when validating', () => {
    expect(GraphQLByte.parseValue(hexLeading0)).toEqual(byteLeading0);
  });
});

describe('base64 containing /', () => {
  test('should return true when validating', () => {
    expect(GraphQLByte.parseValue(slashBase64String)).toEqual(slashByte);
  });
});
