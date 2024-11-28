import { Kind } from 'graphql';
import { GraphQLLatitude } from '../src/scalars/Latitude.js';

const LATITUDES: { dms: string; dd: number; precision: number }[] = [
  { dms: `90° 0' 0.000" S`, dd: -90.0, precision: 0 },
  { dms: `90° 0' 0.000" N`, dd: 90.0, precision: 0 },
  { dms: `38° 36' 0.000" S`, dd: -38.6, precision: 1 },
  { dms: `66° 54' 0.000" S`, dd: -66.9, precision: 1 },
  { dms: `39° 51' 21.600" N`, dd: 39.86, precision: 2 },
  { dms: `52° 19' 48.000" N`, dd: 52.33, precision: 2 },
  { dms: `51° 30' 28.800" N`, dd: 51.508, precision: 3 },
  { dms: `64° 45' 18.000" N`, dd: 64.755, precision: 3 },
  { dms: `36° 16' 57.360" N`, dd: 36.2826, precision: 4 },
  { dms: `6° 10' 50.160" S`, dd: -6.1806, precision: 4 },
  { dms: `41°53'30.95"N`, dd: 41.89193, precision: 5 },
  { dms: `40°42'51.37"N`, dd: 40.71427, precision: 5 },
  { dms: `42° 49' 58.845" N`, dd: 42.833013, precision: 6 },
  { dms: `6° 41' 37.353" N`, dd: 6.693709, precision: 6 },
  { dms: `23° 6' 23.997" S`, dd: -23.1066658, precision: 7 },
  { dms: `23° 19' 19.453" S`, dd: -23.3220703, precision: 7 },
  { dms: `66° 0' 21.983" N`, dd: 66.00610639, precision: 8 },
  { dms: `76° 49' 14.845" N`, dd: 76.82079028, precision: 8 },
];

const toPrecision = (latitude: number, precision: number): number => {
  return Number.parseFloat(latitude.toFixed(precision));
};

describe(`Latitude`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      for (const latitude of LATITUDES) {
        expect(GraphQLLatitude.serialize(latitude.dd)).toEqual(latitude.dd);
        expect(toPrecision(GraphQLLatitude.serialize(latitude.dms), latitude.precision)).toEqual(
          latitude.dd,
        );
      }
    });

    it(`parseValue`, () => {
      for (const latitude of LATITUDES) {
        expect(GraphQLLatitude.serialize(latitude.dd)).toEqual(latitude.dd);
        expect(toPrecision(GraphQLLatitude.serialize(latitude.dms), latitude.precision)).toEqual(
          latitude.dd,
        );
      }
    });

    it(`parseLiteral`, () => {
      for (const latitude of LATITUDES) {
        expect(
          GraphQLLatitude.parseLiteral(
            {
              value: latitude.dd.toString(),
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toEqual(latitude.dd);
        expect(
          toPrecision(
            GraphQLLatitude.parseLiteral(
              {
                value: latitude.dms.toString(),
                kind: Kind.STRING,
              },
              {},
            ),
            latitude.precision,
          ),
        ).toEqual(latitude.dd);
      }
    });
  });

  describe('invalid', () => {
    describe(`not a valid latitude`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLLatitude.serialize(true)).toThrow(
          /Value is neither a number nor a string/,
        );
        expect(() => GraphQLLatitude.serialize(`this is not a latitude`)).toThrow(
          /Value is not a valid latitude/,
        );
        expect(() => GraphQLLatitude.serialize(-90.00000001)).toThrow(
          /Value must be between -90 and 90/,
        );
        expect(() => GraphQLLatitude.serialize(90.00000001)).toThrow(
          /Value must be between -90 and 90/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLLatitude.parseValue(true)).toThrow(
          /Value is neither a number nor a string/,
        );
        expect(() => GraphQLLatitude.parseValue(`this is not a latitude`)).toThrow(
          /Value is not a valid latitude/,
        );
        expect(() => GraphQLLatitude.parseValue(-90.00000001)).toThrow(
          /Value must be between -90 and 90/,
        );
        expect(() => GraphQLLatitude.parseValue(90.00000001)).toThrow(
          /Value must be between -90 and 90/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLLatitude.parseLiteral({ value: true, kind: Kind.BOOLEAN } as any, {}),
        ).toThrow(/Can only validate floats or strings as latitude but got a/);
        expect(() =>
          GraphQLLatitude.parseLiteral({ value: `this is not a latitude`, kind: Kind.STRING }, {}),
        ).toThrow(/Value is not a valid latitude/);
        expect(() =>
          GraphQLLatitude.parseLiteral(
            {
              value: '-90.00000001',
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toThrow(/Value must be between -90 and 90/);
        expect(() =>
          GraphQLLatitude.parseLiteral(
            {
              value: '90.00000001',
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toThrow(/Value must be between -90 and 90/);
      });
    });
  });
});
