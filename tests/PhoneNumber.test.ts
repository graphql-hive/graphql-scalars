/* global describe, test, expect */

import { Kind } from 'graphql/language';
import { GraphQLPhoneNumber } from '../src/scalars/PhoneNumber.js';

describe('PhoneNumber', () => {
  describe('valid', () => {
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

  describe('invalid', () => {
    describe('not a phone number', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('this is not a phone number')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('this is not a phone number')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral(
            { value: 'this is not a phone number', kind: Kind.STRING },
            {},
          ),
        ).toThrow(/^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/);
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

    describe('too long', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('+1789555123456789')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('+1789555123456789')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral({ value: '+1789555123456789', kind: Kind.STRING }, {}),
        ).toThrow(/^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/);
      });
    });

    describe('too small', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('+123')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('+123')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral({ value: '+123', kind: Kind.STRING }, {}),
        ).toThrow(/^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/);
      });
    });

    describe('no plus sign', () => {
      test('serialize', () => {
        expect(() => GraphQLPhoneNumber.serialize('17895551234')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseValue', () => {
        expect(() => GraphQLPhoneNumber.parseValue('17895551234')).toThrow(
          /^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/,
        );
      });

      test('parseLiteral', () => {
        expect(() =>
          GraphQLPhoneNumber.parseLiteral({ value: '17895551234', kind: Kind.STRING }, {}),
        ).toThrow(/^Value is not a valid phone number of the form \+17895551234 \(7-15 digits\)/);
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
