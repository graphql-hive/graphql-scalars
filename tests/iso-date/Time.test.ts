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
import MockDate from 'mockdate';
import { GraphQLTime } from '../../src/scalars/iso-date/Time.js';

// Mock the new Date() call so it always returns 2017-01-01T00:00:00.000Z
MockDate.set(new Date(Date.UTC(2017, 0, 1)));

const invalidDates = [
  'Invalid date',
  '2016-01-01T00:00:00.223Z',
  '10:30:02.Z',
  '00:00:00.45+0130',
  '00:00:00.45+01',
];

const validDates = [
  ['00:00:00Z', new Date(Date.UTC(2017, 0, 1))],
  ['00:00:59Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 59))],
  ['10:30:02.1Z', new Date(Date.UTC(2017, 0, 1, 10, 30, 2, 100))],
  ['09:09:06.13Z', new Date(Date.UTC(2017, 0, 1, 9, 9, 6, 130))],
  ['10:00:11.003Z', new Date(Date.UTC(2017, 0, 1, 10, 0, 11, 3))],
  ['16:10:20.1359945Z', new Date(Date.UTC(2017, 0, 1, 16, 10, 20, 135))],
  ['00:00:00+01:30', new Date(Date.UTC(2016, 11, 31, 22, 30))],
  ['00:00:30.3-01:30', new Date(Date.UTC(2017, 0, 1, 1, 30, 30, 300))],
  ['00:00:00z', new Date(Date.UTC(2017, 0, 1))],
];

describe('GraphQLTime', () => {
  it('has a description', () => {
    expect(GraphQLTime.description).toMatchSnapshot();
  });

  describe('serialization', () => {
    [{}, [], null, undefined, true].forEach(invalidInput => {
      it(`throws error when serializing ${stringify(invalidInput)}`, () => {
        expect(() => GraphQLTime.serialize(invalidInput)).toThrowErrorMatchingSnapshot();
      });
    });

    // Serialize from Date
    [
      [new Date(Date.UTC(2016, 0, 1)), '00:00:00.000Z'],
      [new Date(Date.UTC(2016, 0, 1, 14, 48, 10, 3)), '14:48:10.003Z'],
    ].forEach(([value, expected]) => {
      it(`serializes javascript Date ${stringify(value)} into ${stringify(expected)}`, () => {
        expect(GraphQLTime.serialize(value)).toEqual(expected);
      });
    });

    it(`throws error when serializing invalid date`, () => {
      expect(() => GraphQLTime.serialize(new Date('invalid date'))).toThrowErrorMatchingSnapshot();
    });

    [
      ['00:00:00Z', '00:00:00Z'],
      ['10:30:02.1Z', '10:30:02.1Z'],
      ['16:10:20.1359945Z', '16:10:20.1359945Z'],
      ['00:00:00+01:30', '22:30:00Z'],
      ['00:00:30.3-01:30', '01:30:30.3Z'],
    ].forEach(([input, output]) => {
      it(`serializes time-string ${input} into UTC time-string ${output}`, () => {
        expect(GraphQLTime.serialize(input)).toEqual(output);
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error when serializing an invalid date-string ${stringify(dateString)}`, () => {
        expect(() => GraphQLTime.serialize(dateString)).toThrowErrorMatchingSnapshot();
      });
    });
  });

  describe('value parsing', () => {
    validDates.forEach(([value, expected]) => {
      it(`parses date-string ${stringify(value)} into javascript Date ${stringify(expected)}`, () => {
        expect(GraphQLTime.parseValue(value)).toEqual(expected);
      });
    });

    [4566, {}, [], true, null].forEach(invalidInput => {
      it(`throws an error when parsing ${stringify(invalidInput)}`, () => {
        expect(() => GraphQLTime.parseValue(invalidInput)).toThrowErrorMatchingSnapshot();
      });
    });

    invalidDates.forEach(dateString => {
      it(`throws an error parsing an invalid time-string ${stringify(dateString)}`, () => {
        expect(() => GraphQLTime.parseValue(dateString)).toThrowErrorMatchingSnapshot();
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
        expect(GraphQLTime.parseLiteral(literal, {})).toEqual(expected);
      });
    });

    invalidDates.forEach(value => {
      const invalidLiteral = {
        kind: Kind.STRING,
        value,
      };
      it(`errors when parsing invalid literal ${stringify(invalidLiteral)}`, () => {
        // @ts-expect-error - intentional invalid input
        expect(() => GraphQLTime.parseLiteral(invalidLiteral, {})).toThrowErrorMatchingSnapshot();
      });
    });

    [
      {
        kind: Kind.FLOAT,
        value: '5',
      },
      {
        kind: Kind.DOCUMENT,
      },
    ].forEach(literal => {
      it(`errors when parsing invalid literal ${stringify(literal)}`, () => {
        // @ts-expect-error - intentional invalid input
        expect(() => GraphQLTime.parseLiteral(literal, {})).toThrowError();
      });
    });
  });
});
