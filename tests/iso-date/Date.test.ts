/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Kind } from 'graphql';
import { stringify } from 'jest-matcher-utils';
import { GraphQLDate } from '../../src/scalars/iso-date/Date.js';

const invalidDates = ['invalid date', '2015-02-29', '2021-07-32'];

const validDates = [
  ['2016-12-17', new Date(Date.UTC(2016, 11, 17))],
  ['2016-02-01', new Date(Date.UTC(2016, 1, 1))],
  ['0001-01-01', new Date('0001-01-01T00:00:00.000Z')],
];

describe('GraphQLDate', () => {
  it('has a description', () => {
    expect(GraphQLDate.description).toMatchSnapshot();
  });

  describe('serialization', () => {
    [{}, [], null, undefined, true].forEach(invalidInput => {
      it(`throws error when serializing ${stringify(invalidInput)}`, () => {
        expect(() => GraphQLDate.serialize(invalidInput)).toThrowErrorMatchingSnapshot();
      });
    });

    [
      [new Date(Date.UTC(2016, 11, 17, 14)), '2016-12-17'],
      [new Date(Date.UTC(2016, 0, 1, 14, 48, 10, 3)), '2016-01-01'],
      [new Date(Date.UTC(2016, 0, 1)), '2016-01-01'],
    ].forEach(([value, expected]) => {
      it(`serializes javascript Date ${stringify(value)} into ${stringify(expected)}`, () => {
        expect(GraphQLDate.serialize(value)).toEqual(expected);
      });
    });

    it(`throws error when serializing invalid javascript Date`, () => {
      expect(() => GraphQLDate.serialize(new Date('invalid date'))).toThrowErrorMatchingSnapshot();
    });

    // Serializes from date string
    validDates.forEach(([value]) => {
      it(`serializes date-string ${value}`, () => {
        expect(GraphQLDate.serialize(value)).toEqual(value);
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error when serializing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() => GraphQLDate.serialize(dateString)).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('value parsing', () => {
    validDates.forEach(([value, expected]) => {
      it(`parses date-string ${stringify(value)} into javascript Date ${stringify(expected)}`, () => {
        expect(GraphQLDate.parseValue(value)).toEqual(expected);
      });
    });

    [4566, {}, [], true, null].forEach(invalidInput => {
      it(`throws an error when parsing ${stringify(invalidInput)}`, () => {
        expect(() => GraphQLDate.parseValue(invalidInput)).toThrowErrorMatchingSnapshot();
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error parsing an invalid datetime-string ${stringify(dateString)}`, () => {
        expect(() => GraphQLDate.parseValue(dateString)).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('literal parsing', () => {
    validDates.forEach(([value, expected]) => {
      const literal = {
        kind: Kind.STRING,
        value: value.toString(),
      };

      it(`parses literal ${stringify(literal)} into javascript Date ${stringify(expected)}`, () => {
        // @ts-expect-error - intentional invalid input
        expect(GraphQLDate.parseLiteral(literal, {})).toEqual(expected);
      });
    });

    invalidDates.forEach(value => {
      const invalidLiteral = {
        kind: Kind.STRING,
        value,
      };
      it(`errors when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
        // @ts-expect-error - intentional invalid input
        expect(() => GraphQLDate.parseLiteral(invalidLiteral, {})).toThrowErrorMatchingSnapshot();
      });
    });

    [
      {
        kind: Kind.FLOAT,
        value: '5',
      },
      {
        kind: Kind.DOCUMENT,
      } as any,
    ].forEach(literal => {
      it(`errors when parsing invalid literal ${stringify(literal)}`, () => {
        expect(() => GraphQLDate.parseLiteral(literal, {})).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
