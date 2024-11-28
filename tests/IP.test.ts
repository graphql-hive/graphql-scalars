/* global describe, it, expect */
import { Kind } from 'graphql/language';
import { GraphQLIP } from '../src/scalars/IP.js';

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

describe(`IP`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      for (const address of addresses) {
        expect(GraphQLIP.serialize(address)).toEqual(address);
      }
    });

    it(`parseValue`, () => {
      for (const address of addresses) {
        expect(GraphQLIP.parseValue(address)).toEqual(address);
      }
    });

    it(`parseLiteral`, () => {
      for (const address of addresses) {
        expect(
          GraphQLIP.parseLiteral(
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
        expect(() => GraphQLIP.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIP.serialize(`this is not an ipv4 address`)).toThrow(
          /Value is not a valid IPv4 or IPv6 address/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLIP.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIP.parseValue(`this is not an ipv4 address`)).toThrow(
          /Value is not a valid IPv4 or IPv6 address/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLIP.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as IP addresses but got a/,
        );

        expect(() =>
          GraphQLIP.parseLiteral({ value: `this is not an ipv4 address`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid IPv4 or IPv6 address/);
      });
    });

    describe(`not a valid IPv6 address`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLIP.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIP.serialize(`this is not an ipv6 address`)).toThrow(
          /Value is not a valid IPv4 or IPv6 address/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLIP.serialize(123)).toThrow(/Value is not string/);
        expect(() => GraphQLIP.parseValue(`this is not an ipv6 address`)).toThrow(
          /Value is not a valid IPv4 or IPv6 address/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() => GraphQLIP.parseLiteral({ value: 123, kind: Kind.INT } as any, {})).toThrow(
          /Can only validate strings as IP addresses but got a/,
        );

        expect(() =>
          GraphQLIP.parseLiteral({ value: `this is not an ipv6 address`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid IPv4 or IPv6 address/);
      });
    });
  });
});
