/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLPhoneNumber } from '../src/scalars/PhoneNumber.js';

function PhoneNumberError(value: string) {
  return `Invalid phone number: ${value}. Please ensure it's in a valid format. The country code is optional, and Spaces and dashes are allowed. Examples: +1 (123) 456-7890, +44 (20) 2121 2222, or 123 456-7890.`
}

describe('PhoneNumber', () => {
  describe('valid formats', () => {
    describe('with country code', () => {
      test('serialize', () => {
        expect(GraphQLPhoneNumber.serialize('+16075551234')).toBe('+16075551234');
      });

      test('parseValue', () => {
        expect(GraphQLPhoneNumber.parseValue('+16075551234')).toBe('+16075551234');
      });

      test('parseLiteral', () => {
        expect(
          GraphQLPhoneNumber.parseLiteral({ value: '+16075551234', kind: Kind.STRING }, {}),
        ).toBe('+16075551234');
      });
    });
    describe('without country code', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('7895551234')).not.toThrow()
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('123 456-7890')).not.toThrow()
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral({ value: '789 555 1234', kind: Kind.STRING }, {}),
        ).not.toThrow();
      });
    });
    describe('different formatting', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('62-(21)-9175-5194')).not.toThrow()
      });

      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('+622191755194')).not.toThrow()
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('+62 (21) 9175 5194')).not.toThrow()
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral({ value: '+1 (123) 456-7890', kind: Kind.STRING }, {}),
        ).not.toThrow();
      });
    });
  });

  describe('invalid case', () => {
    describe('contains Non-Numeric Characters', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('98aaa333')).toThrow(PhoneNumberError('98aaa333'));
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('98aaa333ppp')).toThrow(PhoneNumberError('98aaa333ppp'));
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral(
            { value: '98aa', kind: Kind.STRING },
            {},
          ),
        ).toThrow(PhoneNumberError('98aa'));
      });
    });

    describe('not a string', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize(123)).toThrow(/Value is not string/);
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue(123)).toThrow(/Value is not string/);
      });

      test('parseLiteral', () => {
        expect(() => GraphQLPhoneNumber.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow(
          /Can only validate strings as phone numbers but got a/,
        );
      });
    });

    describe('wrong formate', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('+17 89- 5')).toThrow(PhoneNumberError('+17 89- 5'));
      });

      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('+1 ( 123 ) 456-7890')).toThrow(PhoneNumberError('+1 ( 123 ) 456-7890'));
      });

      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('+1[123]456 7890')).toThrow(PhoneNumberError('+1[123]456 7890'));
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('+(178)95 55 5678')).toThrow(PhoneNumberError('+(178)95 55 5678'));
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral({ value: '1789 [555] 1234', kind: Kind.STRING }, {}),
        ).toThrow(PhoneNumberError('1789 [555] 1234'));
      });
    });

    describe('too small', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('+12')).toThrow(PhoneNumberError('+12'));
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('+12')).toThrow(PhoneNumberError('+12'));
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral({ value: '+12', kind: Kind.STRING }, {}),
        ).toThrow(PhoneNumberError('+12'));
      });
    });

    describe('support more countries', () => {
      test('support Singapore numbers - 10 digits', () => {
        expect(() => {
          GraphQLPhoneNumber.parseValue('+6569701665');
        }).not.toThrow();
      });
      test('support Solomon Islands numbers - 8 digits', () => {
        expect(() => {
          GraphQLPhoneNumber.parseValue('+67734700');
        }).not.toThrow();
      });
      test('support Niue numbers - 7 digits', () => {
        expect(() => {
          GraphQLPhoneNumber.parseValue('+6834999');
        }).not.toThrow();
      });
    });
  });
});
