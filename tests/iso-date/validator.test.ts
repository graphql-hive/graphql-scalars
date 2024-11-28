/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  validateDate,
  validateDateTime,
  validateJSDate,
  validateTime,
  validateUnixTimestamp,
} from '../../src/scalars/iso-date/validator.js';

describe('validator', () => {
  describe('validateTime', () => {
    [
      '00:00:00Z',
      '23:00:00Z',
      '10:59:00Z',
      '00:11:59Z',
      '00:00:00+01:30',
      '00:00:00-01:30',
      '00:00:00.1Z',
      '00:00:00.1-01:30',
      '00:00:00.34Z',
      '00:00:00.34-01:30',
      '00:00:00.000Z',
      '00:00:00.999Z',
      '00:00:00.450+01:30',
      '00:00:00.450-01:30',
      '00:00:00.450-23:00',
      '00:00:00.450-00:59',
      '00:00:00.45643222345664443Z',
      '00:00:00.3455334564433+01:00',
    ].forEach(time => {
      it(`identifies ${time} as a valid time`, () => {
        expect(validateTime(time)).toEqual(true);
      });
    });

    [
      'Invalid date',
      '00Z',
      // Time with hours and minutes
      '00:00Z',
      // Time with hours, minutes and seconds
      '000059Z',
      '00:00:0Z',
      '00:00:00',
      '24:00:00Z',
      '13:60:00Z',
      '00:00:60Z',
      '13:60:61Z',
      '00:00:00+01',
      '00:00:00+0100',
      // Time with hours, minutes, seconds and fractional seconds
      '00:00:00.Z',
      '00:00:00.223',
      '00:00:00.000+0100',
      '00:00:00.000+01',
      '00:00:00.000+24:00',
      '00:00:00.000+00:60',
      // Date
      '2016-01-01T00:00:00.223Z',
      '2016-01-01T00Z',
    ].forEach(time => {
      it(`identifies ${time} as an invalid date`, () => {
        expect(validateTime(time)).toEqual(false);
      });
    });
  });

  describe('validateDate', () => {
    [
      '2016-12-17',
      '2016-02-01',
      '0000-01-01',
      '9999-01-01',
      '2016-02-29',
      '2000-02-29',
      '2016-05-31',
      '2016-11-20',
    ].forEach(date => {
      it(`identifies ${date} as a valid date`, () => {
        expect(validateDate(date)).toEqual(true);
      });
    });

    [
      'invalid date',
      '2016',
      '2016-01',
      '21233',
      '2016-02-01T25',
      '2016-02-01T00Z',
      '2016-02-01T00:00:00.223Z',
      '2015-02-29',
      '1900-02-29',
      '20162-12-11',
      '2015-13-11',
      '2015-8-32',
      '2015-111',
      '2016-04-31',
      '2016-06-31',
      '2016-09-31',
      '2016-11-31',
      '2016-02-30',
      '9999-00-31',
    ].forEach(date => {
      it(`identifies ${date} as an invalid date`, () => {
        expect(validateDate(date)).toEqual(false);
      });
    });
  });

  describe('validateUnixTimestamp', () => {
    [
      854325678, 876535, 876535.8, 876535.8321, -876535.8,
      // The maximum representable unix timestamp
      2147483647,
      // The minimum representable unit timestamp
      -2147483648,
    ].forEach(timestamp => {
      it(`identifies ${timestamp} as a valid Unix timestamp`, () => {
        expect(validateUnixTimestamp(timestamp)).toEqual(true);
      });
    });

    [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      2147483648,
      -2147483649,
    ].forEach(timestamp => {
      it(`identifies ${timestamp} as an invalid Unix timestamp`, () => {
        expect(validateUnixTimestamp(timestamp)).toEqual(false);
      });
    });
  });

  describe('validateDateTime', () => {
    [
      // Datetime with hours, minutes and seconds
      '2016-02-01T00:00:00Z',
      '2016-02-01T00:00:15Z',
      '2016-02-01T00:00:59Z',
      '2016-02-01T00:00:00-11:00',
      '2017-01-07T11:25:00+01:00',
      '2017-01-07T00:00:00+01:00',
      // Datetime with hours, minutes, seconds and fractional seconds
      '2017-01-07T00:00:00.0Z',
      '2017-01-01T00:00:00.0+01:00',
      '2016-02-01T00:00:00.000Z',
      '2016-02-01T00:00:00.990Z',
      '2016-02-01T00:00:00.450Z',
      '2017-01-07T11:25:00.450+01:00',
      '2017-01-01T10:23:11.45686664Z',
      '2017-01-01T10:23:11.23545654+01:00',
    ].forEach(dateTime => {
      it(`identifies ${dateTime} as a valid date-time`, () => {
        expect(validateDateTime(dateTime)).toEqual(true);
      });
    });

    [
      'Invalid date',
      // Date-time with hours
      '2016-02-01T00Z',
      // Date-time with hours and minutes
      '2016-02-01T00:00Z',
      // Date-time with hours, minutes and seconds
      '2016-02-01T000059Z',
      '2016-02-01T00:00:60Z',
      '2016-02-01T00:00:0Z',
      '2015-02-29T00:00:00Z',
      '2016-02-01T00:00:00',
      '2017-01-07T11:25:00+0100',
      '2017-01-07T11:25:00+01',
      '2017-01-07T11:25:00+',
      // Date-time with hours, minutes, seconds and fractional seconds
      '2015-02-26T00:00:00.Z',
      '2015-02-29T00:00:00.000Z',
      '2016-02-01T00:00:00.223',
      '2016-02-01T00:00:00',
      '2017-01-07T11:25:00.450+0100',
      '2017-01-07T11:25:00.450+01',
      '2017-44-07T11:25:00.450+01:00',
      '2017-01-07T25:25:00.450+01:00',
      '2017-01-07T11:11:11+24:00',
    ].forEach(dateTime => {
      it(`identifies ${dateTime} as an invalid date-time`, () => {
        expect(validateDateTime(dateTime)).toEqual(false);
      });
    });
  });

  describe('validateJSDate', () => {
    it('identifies invalid Date', () => {
      expect(validateJSDate(new Date('invalid'))).toBeFalsy();
    });

    it('identifies a valid Date', () => {
      expect(validateJSDate(new Date(2016, 1, 1))).toBeTruthy();
    });
  });
});
