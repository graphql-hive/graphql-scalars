/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLIPv4 } from '../src/scalars/IPv4.js';

// Taken from https://github.com/hapijs/joi/blob/master/test/types/string.js
const addresses = [
  `0.0.0.0/32`,
  `255.255.255.255/0`,
  `127.0.0.1/0`,
  `192.168.2.1/0`,
  `0.0.0.3/2`,
  `0.0.0.7/3`,
  `0.0.0.15/4`,
  `0.0.0.31/5`,
  `0.0.0.63/6`,
  `0.0.0.127/7`,
  `01.020.030.100/7`,
  `0.0.0.0/0`,
  `00.00.00.00/0`,
  `000.000.000.000/32`,
  `0.0.0.0`,
  `255.255.255.255`,
  `127.0.0.1`,
  `192.168.2.1`,
  `0.0.0.3`,
  `0.0.0.7`,
  `0.0.0.15`,
  `0.0.0.31`,
  `0.0.0.63`,
  `0.0.0.127`,
  `01.020.030.100`,
  `0.0.0.0`,
  `00.00.00.00`,
  `000.000.000.000`,
];

describe(`IPv4`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      for (const address of addresses) {
        expect(GraphQLIPv4.serialize(address)).toEqual(address);
      }
    });

    it(`parseValue`, () => {
      for (const address of addresses) {
        expect(GraphQLIPv4.parseValue(address)).toEqual(address);
      }
    });

    it(`parseLiteral`, () => {
      for (const address of addresses) {
        expect(
          GraphQLIPv4.parseLiteral(
            {
              value: address,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toEqual(address);
      }
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid IPv4 address`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLIPv4.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIPv4.serialize(`this is not an ipv4 address`)).toThrow(
          /Value is not a valid IPv4 address/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLIPv4.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIPv4.parseValue(`this is not an ipv4 address`)).toThrow(
          /Value is not a valid IPv4 address/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLIPv4.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as IPv4 addresses but got a/,
        );

        expect(() =>
          GraphQLIPv4.parseLiteral({ value: `this is not an ipv4 address`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid IPv4 address/);
      });
    });
  });
});
