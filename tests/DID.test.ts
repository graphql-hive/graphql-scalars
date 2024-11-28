/* global describe, test, expect */
import { Kind } from 'graphql/language';
import { GraphQLDID } from '../src/scalars/DID.js';

describe('DID', () => {
  describe('valid - DID example', () => {
    test('serialize', () => {
      expect(GraphQLDID.serialize('did:example:123456789abcdefghi')).toBe(
        'did:example:123456789abcdefghi',
      );
    });

    test('parseValue', () => {
      expect(GraphQLDID.parseValue('did:example:123456789abcdefghi')).toEqual(
        'did:example:123456789abcdefghi',
      );
    });

    test('parseLiteral', () => {
      expect(
        GraphQLDID.parseLiteral({ value: 'did:example:123456789abcdefghi', kind: Kind.STRING }, {}),
      ).toEqual('did:example:123456789abcdefghi');
    });
  });

  describe('valid - DID pkh', () => {
    test('serialize', () => {
      expect(
        GraphQLDID.serialize('did:pkh:eip155:1:0x6317FBFf7a0A016eD485fc33f4Ae55F91C403377'),
      ).toBe('did:pkh:eip155:1:0x6317FBFf7a0A016eD485fc33f4Ae55F91C403377');
    });

    test('parseValue', () => {
      expect(
        GraphQLDID.parseValue('did:pkh:eip155:1:0x6317FBFf7a0A016eD485fc33f4Ae55F91C403377'),
      ).toEqual('did:pkh:eip155:1:0x6317FBFf7a0A016eD485fc33f4Ae55F91C403377');
    });

    test('parseLiteral', () => {
      expect(
        GraphQLDID.parseLiteral(
          {
            value: 'did:pkh:eip155:1:0x6317FBFf7a0A016eD485fc33f4Ae55F91C403377',
            kind: Kind.STRING,
          },
          {},
        ),
      ).toEqual('did:pkh:eip155:1:0x6317FBFf7a0A016eD485fc33f4Ae55F91C403377');
    });
  });

  describe('invalid', () => {
    describe('not a DID', () => {
      expect(() => GraphQLDID.serialize('invaliddid')).toThrow(/Value is not a valid DID/);
    });

    test(`parseValue invaliddidexample`, () => {
      expect(() => GraphQLDID.parseValue('invaliddidexample')).toThrow(/Value is not a valid DID/);
    });

    test(`parseLiteral invaliddidexample`, () => {
      expect(() =>
        GraphQLDID.parseLiteral({ value: 'invaliddidexample', kind: Kind.STRING }, {}),
      ).toThrow(/Value is not a valid DID/);
    });
  });

  describe('not a string', () => {
    test('serialize', () => {
      expect(() => GraphQLDID.serialize(123)).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLDID.parseValue(123)).toThrow();
    });

    test('parseLiteral', () => {
      expect(() => GraphQLDID.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow();
    });
  });

  describe('not a empty string', () => {
    test('serialize', () => {
      expect(() => GraphQLDID.serialize('')).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLDID.parseValue('')).toThrow();
    });

    test('parseLiteral', () => {
      expect(() => GraphQLDID.parseLiteral({ value: '', kind: Kind.STRING }, {})).toThrow();
    });
  });
});
