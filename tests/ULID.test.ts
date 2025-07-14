import { Kind } from 'graphql';
import { GraphQLULID } from '../src/scalars/ULID.js';

const invalids = [
  ['wrong length - too short', '01HNZX8JGFACFA36RBXDHEQN6'],
  ['wrong length - too long', '01HNZX8JGFACFA36RBXDHEQN6EE'],
  ['invalid character - I', '01HNZX8JGFACFA36RBXDHEQN6I'],
  ['invalid character - L', '01HNZX8JGFACFA36RBXDHEQN6L'],
  ['invalid character - O', '01HNZX8JGFACFA36RBXDHEQN6O'],
  ['invalid character - U', '01HNZX8JGFACFA36RBXDHEQN6U'],
  ['invalid character - special', '01HNZX8JGFACFA36RBXDHEQN6$'],
  ['invalid first character - 8', '81HNZX8JGFACFA36RBXDHEQN6E'],
  ['invalid first character - 9', '91HNZX8JGFACFA36RBXDHEQN6E'],
  ['empty string', ''],
  ['null-like string', 'null'],
  ['undefined-like string', 'undefined'],
];

const valids: string[] = [
  '01HNZX8JGFACFA36RBXDHEQN6E',
  '01HNZX8JGFACFA36RBXDHEQN6F',
  '01HNZX8JGFACFA36RBXDHEQN6G',
  '01HNZX8JGFACFA36RBXDHEQN6H',
  '01HNZX8JGFACFA36RBXDHEQN6J',
  '01HNZX8JGFACFA36RBXDHEQN6K',
  '7ZZZZZZZZZZZZZZZZZZZZZZZZZ', // Maximum valid ULID
  '00000000000000000000000000', // Minimum valid ULID
  '01234567890123456789012345',
  '0ABCDEFGHJKMNPQRSTVWXYZ000',
  '01J9GHQM8N5X4TQ3M1ZV9J6CBK',
];

describe('ULID', () => {
  describe('invalid', () => {
    test("type isn't String", () => {
      const value = 102;
      expect(() =>
        GraphQLULID.parseLiteral({
          kind: Kind.INT,
          value: '' + value,
        }),
      ).toThrow(/ULID can only parse String/);
      expect(() => GraphQLULID.serialize(value)).toThrow(/ULID can only parse String/);
      expect(() => GraphQLULID.parseValue(value)).toThrow(/ULID can only parse String/);
    });

    test("type isn't String - null", () => {
      const value = null;
      expect(() => GraphQLULID.serialize(value)).toThrow(/ULID can only parse String/);
      expect(() => GraphQLULID.parseValue(value)).toThrow(/ULID can only parse String/);
    });

    test("type isn't String - undefined", () => {
      const value = undefined;
      expect(() => GraphQLULID.serialize(value)).toThrow(/ULID can only parse String/);
      expect(() => GraphQLULID.parseValue(value)).toThrow(/ULID can only parse String/);
    });

    test("type isn't String - object", () => {
      const value = {};
      expect(() => GraphQLULID.serialize(value)).toThrow(/ULID can only parse String/);
      expect(() => GraphQLULID.parseValue(value)).toThrow(/ULID can only parse String/);
    });

    test("type isn't String - array", () => {
      const value = [];
      expect(() => GraphQLULID.serialize(value)).toThrow(/ULID can only parse String/);
      expect(() => GraphQLULID.parseValue(value)).toThrow(/ULID can only parse String/);
    });

    test.each(invalids)(`%s`, (_, ulid) => {
      expect(() =>
        GraphQLULID.parseLiteral({
          kind: Kind.STRING,
          value: ulid,
        }),
      ).toThrow(/Invalid ULID format/);
      expect(() => GraphQLULID.parseValue(ulid)).toThrow(/Invalid ULID format/);
      expect(() => GraphQLULID.serialize(ulid)).toThrow(/Invalid ULID format/);
    });

    test('parseLiteral with non-string kind', () => {
      expect(() =>
        GraphQLULID.parseLiteral({
          kind: Kind.INT,
          value: '123',
        }),
      ).toThrow(/ULID can only parse String but got 'IntValue'/);
    });

    test('parseLiteral with object kind', () => {
      expect(() =>
        GraphQLULID.parseLiteral({
          kind: Kind.OBJECT,
          fields: [],
        }),
      ).toThrow(/ULID can only parse String but got 'ObjectValue'/);
    });
  });

  describe('valid', () => {
    test.each(valids)('scalar: %s', ulid => {
      expect(GraphQLULID.parseValue(ulid)).toBe(ulid);
      expect(GraphQLULID.serialize(ulid)).toBe(ulid);
      expect(
        GraphQLULID.parseLiteral({
          kind: Kind.STRING,
          value: ulid,
        }),
      ).toBe(ulid);
    });
  });

  describe('edge cases', () => {
    test('case sensitivity - should accept uppercase', () => {
      const upperUlid = '01HNZX8JGFACFA36RBXDHEQN6E';
      expect(GraphQLULID.parseValue(upperUlid)).toBe(upperUlid);
      expect(GraphQLULID.serialize(upperUlid)).toBe(upperUlid);
    });

    test('case sensitivity - should normalize lowercase to uppercase', () => {
      const lowerUlid = '01hnzx8jgfacfa36rbxdheqn6e';
      const expectedUpper = '01HNZX8JGFACFA36RBXDHEQN6E';
      expect(GraphQLULID.parseValue(lowerUlid)).toBe(expectedUpper);
      expect(GraphQLULID.serialize(lowerUlid)).toBe(expectedUpper);
      expect(
        GraphQLULID.parseLiteral({
          kind: Kind.STRING,
          value: lowerUlid,
        }),
      ).toBe(expectedUpper);
    });

    test('case sensitivity - should normalize mixed case to uppercase', () => {
      const mixedUlid = '01HnZx8JgFaCfA36RbXdHeQn6E';
      const expectedUpper = '01HNZX8JGFACFA36RBXDHEQN6E';
      expect(GraphQLULID.parseValue(mixedUlid)).toBe(expectedUpper);
      expect(GraphQLULID.serialize(mixedUlid)).toBe(expectedUpper);
    });

    test('boundary values', () => {
      const minUlid = '00000000000000000000000000';
      const maxUlid = '7ZZZZZZZZZZZZZZZZZZZZZZZZZ';

      expect(GraphQLULID.parseValue(minUlid)).toBe(minUlid);
      expect(GraphQLULID.parseValue(maxUlid)).toBe(maxUlid);
    });

    test('Crockford Base32 character set validation', () => {
      // Valid characters: 0-9, A-H, J-K, M-N, P-T, V-Z (excludes I, L, O, U)
      //const validChars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
      const testUlid = '01234567890123456789012345';
      expect(GraphQLULID.parseValue(testUlid)).toBe(testUlid);
    });
  });
});
