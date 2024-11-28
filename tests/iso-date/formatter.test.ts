/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { stringify } from 'jest-matcher-utils';
import MockDate from 'mockdate';
import {
  parseDate,
  parseDateTime,
  parseTime,
  serializeDate,
  serializeDateTimeString,
  serializeTime,
  serializeTimeString,
} from '../../src/scalars/iso-date/formatter.js';

// Mock the new Date() call so it always returns 2017-01-01T00:00:00.000Z
MockDate.set(new Date(Date.UTC(2017, 0, 1)));

describe('formatting', () => {
  (
    [
      [new Date(Date.UTC(2016, 1, 1)), '00:00:00.000Z'],
      [new Date(Date.UTC(2016, 1, 1, 2, 4, 10, 344)), '02:04:10.344Z'],
    ] as [Date, string][]
  ).forEach(([date, time]) => {
    it(`serializes ${stringify(date)} into time-string ${time}`, () => {
      expect(serializeTime(date)).toEqual(time);
    });
  });

  [
    ['00:00:00.000Z', '00:00:00.000Z'],
    ['12:23:44Z', '12:23:44Z'],
    ['14:38:12+01:00', '13:38:12Z'],
    ['00:00:00.4567+01:30', '22:30:00.4567Z'],
    ['14:38:12.1+01:00', '13:38:12.1Z'],
  ].forEach(([input, output]) => {
    it(`serializes time-string ${input} into UTC time-string ${output}`, () => {
      expect(serializeTimeString(input)).toEqual(output);
    });
  });

  (
    [
      [new Date(Date.UTC(2016, 1, 1)), '2016-02-01'],
      [new Date(Date.UTC(2016, 1, 1, 4, 5, 5)), '2016-02-01'],
      [new Date(Date.UTC(2016, 2, 3)), '2016-03-03'],
    ] as [Date, string][]
  ).forEach(([date, dateString]) => {
    it(`serializes ${stringify(date)} into date-string ${dateString}`, () => {
      expect(serializeDate(date)).toEqual(dateString);
    });
  });

  (
    [
      ['00:00:59Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 59))],
      ['00:00:00+01:30', new Date(Date.UTC(2016, 11, 31, 22, 30))],
      ['00:00:00.1Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 100))],
      ['00:00:00.12Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 120))],
      ['00:00:00.000Z', new Date(Date.UTC(2017, 0, 1))],
      ['00:00:00.993Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 993))],
      ['00:00:00.123456Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 123))],
      // No rounding takes place!
      ['00:00:00.12399Z', new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 123))],
      ['00:00:00.450+01:30', new Date(Date.UTC(2016, 11, 31, 22, 30, 0, 450))],
      ['00:00:00.450-01:30', new Date(Date.UTC(2017, 0, 1, 1, 30, 0, 450))],
    ] as [string, Date][]
  ).forEach(([time, date]) => {
    it(`parses time ${stringify(time)} into Date ${stringify(date)}`, () => {
      expect(parseTime(time)).toEqual(date);
    });
  });

  (
    [
      ['2016-12-17', new Date(Date.UTC(2016, 11, 17))],
      ['2016-02-01', new Date(Date.UTC(2016, 1, 1))],
    ] as [string, Date][]
  ).forEach(([dateString, date]) => {
    it(`parses date ${stringify(dateString)} into Date ${stringify(date)}`, () => {
      expect(parseDate(dateString)).toEqual(date);
    });
  });

  (
    [
      // Datetime with hours, minutes and seconds
      ['2016-02-01T00:00:00Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0))],
      ['2016-02-01T00:00:15Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 15))],
      ['2016-02-01T00:00:59Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 59))],
      ['2016-02-01T00:00:00-11:00', new Date(Date.UTC(2016, 1, 1, 11))],
      ['2017-01-07T11:25:00+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25))],
      ['2017-01-07T00:00:00+01:00', new Date(Date.UTC(2017, 0, 6, 23))],
      // Datetime with hours, minutes, seconds and fractional seconds.
      ['2016-02-01T00:00:00.12Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 120))],
      ['2016-02-01T00:00:00.123456Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 123))],
      ['2016-02-01T00:00:00.12399Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 123))],
      ['2016-02-01T00:00:00.000Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 0))],
      ['2016-02-01T00:00:00.993Z', new Date(Date.UTC(2016, 1, 1, 0, 0, 0, 993))],
      ['2017-01-07T11:25:00.450+01:00', new Date(Date.UTC(2017, 0, 7, 10, 25, 0, 450))],
    ] as [string, Date][]
  ).forEach(([dateTime, date]) => {
    it(`parses date-time ${stringify(dateTime)} into Date ${stringify(date)}`, () => {
      expect(parseDateTime(dateTime)).toEqual(date);
    });
  });

  [
    ['2016-02-01T00:00:00Z', '2016-02-01T00:00:00.000Z'],
    ['2016-02-01T12:23:44Z', '2016-02-01T12:23:44.000Z'],
    ['2016-02-01T14:38:12-01:00', '2016-02-01T15:38:12.000Z'],
    ['2016-02-02T00:00:00.456+01:30', '2016-02-01T22:30:00.456Z'],
    ['2016-02-01T14:38:12.1+01:00', '2016-02-01T13:38:12.100Z'],
  ].forEach(([input, output]) => {
    it(`serializes date-time-string ${input} into UTC date-time-string ${output}`, () => {
      expect(serializeDateTimeString(input).toJSON()).toEqual(output);
    });
  });
});
