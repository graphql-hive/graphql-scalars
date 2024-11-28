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
import { GraphQLDateTime } from '../../src/scalars/iso-date/DateTime.js';

const invalidDates = [
  // General
  'Invalid date',
  // Datetime with hours
  '2016-02-01T00Z',
  // Datetime with hours and minutes
  '2016-02-01T00:00Z',
  // Datetime with hours, minutes and seconds
  '2016-02-01T000059Z',
  // Datetime with hours, minutes, seconds and fractional seconds
  '2016-02-01T00:00:00.Z',
  // Datetime with hours, minutes, seconds, fractional seconds and timezone.
  '2015-02-24T00:00:00.000+0100',
];

const validDates = [
  // Datetime with hours, minutes and seconds
  ['2016-02-01T00:00:15Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 15))],
  ['2016-02-01T00:00:00-11:00', new Date(Date.UTC(2016, 1, 1, 11))],
  ['2017-01-07T11:25:00+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25))],
  ['2017-01-07T00:00:00+01:20', new Date(Date.UTC(2017, 0, 6, 22, 40))],
  // Datetime with hours, minutes, seconds and fractional seconds
  ['2016-02-01T00:00:00.1Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 100))],
  ['2016-02-01T00:00:00.000Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0))],
  ['2016-02-01T00:00:00.990Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 990))],
  ['2016-02-01T00:00:00.23498Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 234))],
  ['2017-01-07T11:25:00.450+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25, 0, 450))],
  ['2016-02-01t00:00:00.000z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0))],
];

describe('GraphQLDateTime', () => {
  it('has a description', () => {
    expect(GraphQLDateTime.description).toMatchSnapshot();
  });

  describe('serialization', () => {
    [{}, [], null, undefined, true].forEach(invalidInput => {
      it(`throws error when serializing ${stringify(invalidInput)}`, () => {
        expect(() => GraphQLDateTime.serialize(invalidInput)).toThrowErrorMatchingSnapshot();
      });
    });

    [
      [new Date(Date.UTC(2016, 0, 1)), '2016-01-01T00:00:00.000Z'],
      [new Date(Date.UTC(2016, 0, 1, 14, 48, 10, 30)), '2016-01-01T14:48:10.030Z'],
    ].forEach(([value, expected]) => {
      it(`serializes javascript Date ${stringify(value)} into ${stringify(expected)}`, () => {
        expect(GraphQLDateTime.serialize(value).toJSON()).toEqual(expected);
      });
    });

    it(`throws error when serializing invalid date`, () => {
      expect(() =>
        GraphQLDateTime.serialize(new Date('invalid date')),
      ).toThrowErrorMatchingSnapshot();
    });

    [
      ['2016-02-01T00:00:15.000Z', '2016-02-01T00:00:15.000Z'],
      ['2016-02-01T00:00:00.234Z', '2016-02-01T00:00:00.234Z'],
      ['2016-02-01T00:00:00-11:00', '2016-02-01T11:00:00.000Z'],
      ['2017-01-07T00:00:00.1+01:20', '2017-01-06T22:40:00.100Z'],
    ].forEach(([input, output]) => {
      it(`serializes date-time-string ${input} into UTC date-time-string ${output}`, () => {
        expect(GraphQLDateTime.serialize(input).toJSON()).toEqual(output);
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error when serializing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() => GraphQLDateTime.serialize(dateString)).toThrowErrorMatchingSnapshot();
      });
    });

    // Serializes Unix timestamp
    [
      [854325678000, '1997-01-27T00:41:18.000Z'],
      [876535000, '1970-01-11T03:28:55.000Z'],
      // The maximum representable unix timestamp
      [2147483647000, '2038-01-19T03:14:07.000Z'],
      // The minimum representable unit timestamp
      [-2147483648000, '1901-12-13T20:45:52.000Z'],
    ].forEach(([value, expected]) => {
      it(`serializes unix timestamp ${stringify(value)} into date-string ${expected}`, () => {
        expect(GraphQLDateTime.serialize(value).toJSON()).toEqual(expected);
      });
    });
  });

  describe('value parsing', () => {
    validDates.forEach(([value, expected]) => {
      it(`parses date-string ${stringify(value)} into javascript Date ${stringify(expected)}`, () => {
        expect(GraphQLDateTime.parseValue(value)).toEqual(expected);
      });
    });

    [4566, {}, [], true, null].forEach(invalidInput => {
      it(`throws an error when parsing ${stringify(invalidInput)}`, () => {
        expect(() => GraphQLDateTime.parseValue(invalidInput)).toThrowErrorMatchingSnapshot();
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error parsing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() => GraphQLDateTime.parseValue(dateString)).toThrowErrorMatchingSnapshot();
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
        expect(GraphQLDateTime.parseLiteral(literal, {})).toEqual(expected);
      });
    });

    invalidDates.forEach(value => {
      const invalidLiteral = {
        kind: Kind.STRING,
        value,
      };
      it(`errors when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
        expect(() =>
          // @ts-expect-error - intentional invalid input
          GraphQLDateTime.parseLiteral(invalidLiteral, {}),
        ).toThrowErrorMatchingSnapshot();
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
        expect(() => GraphQLDateTime.parseLiteral(literal, {})).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
