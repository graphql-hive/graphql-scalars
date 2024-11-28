/* global describe, test, expect */

import { URL } from 'url';
import { Kind } from 'graphql/language';
import { GraphQLURL } from '../src/scalars/URL.js';

/*
 * these test cases are picked up from https://mathiasbynens.be/demo/url-regex
 */

describe('URL', () => {
  describe('valid - localhost', () => {
    test('serialize', () => {
      expect(GraphQLURL.serialize('http://localhost/')).toBe('http://localhost/');
    });

    test('parseValue', () => {
      expect(GraphQLURL.parseValue('http://localhost/')).toMatchObject(
        new URL('http://localhost/'),
      );
    });

    test('parseLiteral', () => {
      expect(
        GraphQLURL.parseLiteral({ value: 'http://localhost/', kind: Kind.STRING }, {}),
      ).toMatchObject(new URL('http://localhost/'));
    });
  });

  describe('valid - localhost with port', () => {
    test('serialize', () => {
      expect(GraphQLURL.serialize('http://localhost:3000/')).toBe('http://localhost:3000/');
    });

    test('parseValue', () => {
      expect(GraphQLURL.parseValue('http://localhost:3000/')).toMatchObject(
        new URL('http://localhost:3000/'),
      );
    });

    test('parseLiteral', () => {
      expect(
        GraphQLURL.parseLiteral({ value: 'http://localhost:3000/', kind: Kind.STRING }, {}),
      ).toMatchObject(new URL('http://localhost:3000/'));
    });
  });

  describe('invalid', () => {
    describe('not a URL', () => {
      expect(() => GraphQLURL.serialize('invalidurlexample')).toThrow(/Invalid URL/);
    });

    test(`parseValue invalidurlexample`, () => {
      expect(() => GraphQLURL.parseValue('invalidurlexample')).toThrow(/Invalid URL/);
    });

    test(`parseLiteral invalidurlexample`, () => {
      expect(() =>
        GraphQLURL.parseLiteral({ value: 'invalidurlexample', kind: Kind.STRING }, {}),
      ).toThrow(/Invalid URL/);
    });
  });

  describe('not a string', () => {
    test('serialize', () => {
      expect(() => GraphQLURL.serialize(123)).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLURL.parseValue(123)).toThrow();
    });

    test('parseLiteral', () => {
      expect(() => GraphQLURL.parseLiteral({ value: '123', kind: Kind.INT }, {})).toThrow();
    });
  });

  describe('returns null if the value is null', () => {
    test('serialize', () => {
      expect(GraphQLURL.serialize(null)).toBeNull();
    });

    test('parseValue', () => {
      expect(GraphQLURL.parseValue(null)).toBeNull();
    });

    test('parseLiteral', () => {
      expect(GraphQLURL.parseLiteral({ value: null, kind: Kind.STRING }, {})).toBeNull();
    });
  });

  describe('not a empty string', () => {
    test('serialize', () => {
      expect(() => GraphQLURL.serialize('')).toThrow();
    });

    test('parseValue', () => {
      expect(() => GraphQLURL.parseValue('')).toThrow();
    });

    test('parseLiteral', () => {
      expect(() => GraphQLURL.parseLiteral({ value: '', kind: Kind.STRING }, {})).toThrow();
    });
  });
});
