/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLIPv6 } from '../src/scalars/IPv6.js';

// Taken from https://github.com/hapijs/joi/blob/master/test/types/string.js
const addresses = [
  `2001:db8::7/32`,
  `a:b:c:d:e::1.2.3.4/13`,
  `a:b:c:d:e::1.2.3.4/64`,
  `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/0`,
  `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/32`,
  `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210/128`,
  `1080:0:0:0:8:800:200C:417A/27`,
  `2001:db8::7`,
  `a:b:c:d:e::1.2.3.4`,
  `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210`,
  `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210`,
  `1080:0:0:0:8:800:200C:417A`,
  `::1:2:3:4:5:6:7`,
  `::1:2:3:4:5:6`,
  `1::1:2:3:4:5:6`,
  `::1:2:3:4:5`,
  `1::1:2:3:4:5`,
  `2:1::1:2:3:4:5`,
  `::1:2:3:4`,
  `1::1:2:3:4`,
  `2:1::1:2:3:4`,
  `3:2:1::1:2:3:4`,
  `::1:2:3`,
  `1::1:2:3`,
  `2:1::1:2:3`,
  `3:2:1::1:2:3`,
  `4:3:2:1::1:2:3`,
  `::1:2`,
  `1::1:2`,
  `2:1::1:2`,
  `3:2:1::1:2`,
  `4:3:2:1::1:2`,
  `5:4:3:2:1::1:2`,
  `::1`,
  `1::1`,
  `2:1::1`,
  `3:2:1::1`,
  `4:3:2:1::1`,
  `5:4:3:2:1::1`,
  `6:5:4:3:2:1::1`,
  `::`,
  `1::`,
  `2:1::`,
  `3:2:1::`,
  `4:3:2:1::`,
  `5:4:3:2:1::`,
  `6:5:4:3:2:1::`,
  `7:6:5:4:3:2:1::`,
];

describe(`IPv6`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      for (const address of addresses) {
        expect(GraphQLIPv6.serialize(address)).toEqual(address);
      }
    });

    it(`parseValue`, () => {
      for (const address of addresses) {
        expect(GraphQLIPv6.parseValue(address)).toEqual(address);
      }
    });

    it(`parseLiteral`, () => {
      for (const address of addresses) {
        expect(
          GraphQLIPv6.parseLiteral(
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
    describe(`not a valid IPv6 address`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLIPv6.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIPv6.serialize(`this is not an ipv6 address`)).toThrow(
          /Value is not a valid IPv6 address/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLIPv6.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIPv6.parseValue(`this is not an ipv6 address`)).toThrow(
          /Value is not a valid IPv6 address/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLIPv6.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as IPv6 addresses but got a/,
        );

        expect(() =>
          GraphQLIPv6.parseLiteral({ value: `this is not an ipv6 address`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid IPv6 address/);
      });
    });
  });
});
