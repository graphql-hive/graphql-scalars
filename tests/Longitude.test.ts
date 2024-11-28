import { Kind } from 'graphql';
import { GraphQLLongitude } from '../src/scalars/Longitude.js';

const LONGITUDES: { dms: string; dd: number; precision: number }[] = [
  { dms: `180° 0' 0.000" W`, dd: -180.0, precision: 0 },
  { dms: `180° 0' 0.000" E`, dd: 180.0, precision: 0 },
  { dms: `176° 19' 26.576" E`, dd: 176.3, precision: 1 },
  { dms: `62° 12' 48.831" W`, dd: -62.2, precision: 1 },
  { dms: `4° 46' 6.456" W`, dd: -4.77, precision: 2 },
  { dms: `6° 28' 33.481" W`, dd: -6.48, precision: 2 },
  { dms: `0° 10' 6.902" W`, dd: -0.169, precision: 3 },
  { dms: `118° 45' 3.780" E`, dd: 118.751, precision: 3 },
  { dms: `139° 19' 8.803" E`, dd: 139.3191, precision: 4 },
  { dms: `141° 59' 27.377" E`, dd: 141.9909, precision: 4 },
  { dms: `12°30'40.79"E`, dd: 12.51133, precision: 5 },
  { dms: `74°0'21.49"W`, dd: -74.00597, precision: 5 },
  { dms: `99° 44' 56.030" W`, dd: -99.748897, precision: 6 },
  { dms: `21° 55' 56.083" E`, dd: 21.932245, precision: 6 },
  { dms: `129° 39' 38.704" E`, dd: 129.6607511, precision: 7 },
  { dms: `54° 33' 12.699" W`, dd: -54.5535275, precision: 7 },
  { dms: `148° 34' 9.124" W`, dd: -148.56920111, precision: 8 },
  { dms: `44° 44' 2.119" W`, dd: -44.73392194, precision: 8 },
];

const toPrecision = (longitude: number, precision: number): number => {
  return Number.parseFloat(longitude.toFixed(precision));
};

describe(`Longitude`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      for (const longitude of LONGITUDES) {
        expect(GraphQLLongitude.serialize(longitude.dd)).toEqual(longitude.dd);
        expect(toPrecision(GraphQLLongitude.serialize(longitude.dms), longitude.precision)).toEqual(
          longitude.dd,
        );
      }
    });

    it(`parseValue`, () => {
      for (const longitude of LONGITUDES) {
        expect(GraphQLLongitude.serialize(longitude.dd)).toEqual(longitude.dd);
        expect(toPrecision(GraphQLLongitude.serialize(longitude.dms), longitude.precision)).toEqual(
          longitude.dd,
        );
      }
    });

    it(`parseLiteral`, () => {
      for (const longitude of LONGITUDES) {
        expect(
          GraphQLLongitude.parseLiteral(
            {
              value: longitude.dd.toString(),
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toEqual(longitude.dd);
        expect(
          toPrecision(
            GraphQLLongitude.parseLiteral(
              {
                value: longitude.dms.toString(),
                kind: Kind.STRING,
              },
              {},
            ),
            longitude.precision,
          ),
        ).toEqual(longitude.dd);
      }
    });
  });

  describe('invalid', () => {
    describe(`not a valid longitude`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLLongitude.serialize(true)).toThrow(
          /Value is neither a number nor a string/,
        );
        expect(() => GraphQLLongitude.serialize(`this is not a longitude`)).toThrow(
          /Value is not a valid longitude/,
        );
        expect(() => GraphQLLongitude.serialize(-180.00000001)).toThrow(
          /Value must be between -180 and 180/,
        );
        expect(() => GraphQLLongitude.serialize(180.00000001)).toThrow(
          /Value must be between -180 and 180/,
        );
      });

      it(`parseValue`, () => {
        expect(() => GraphQLLongitude.parseValue(true)).toThrow(
          /Value is neither a number nor a string/,
        );
        expect(() => GraphQLLongitude.parseValue(`this is not a longitude`)).toThrow(
          /Value is not a valid longitude/,
        );
        expect(() => GraphQLLongitude.parseValue(-180.00000001)).toThrow(
          /Value must be between -180 and 180/,
        );
        expect(() => GraphQLLongitude.parseValue(180.00000001)).toThrow(
          /Value must be between -180 and 180/,
        );
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLLongitude.parseLiteral({ value: true, kind: Kind.BOOLEAN } as any, {}),
        ).toThrow(/Can only validate floats or strings as longitude but got a/);
        expect(() =>
          GraphQLLongitude.parseLiteral(
            { value: `this is not a longitude`, kind: Kind.STRING },
            {},
          ),
        ).toThrow(/Value is not a valid longitude/);
        expect(() =>
          GraphQLLongitude.parseLiteral(
            {
              value: '-180.00000001',
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toThrow(/Value must be between -180 and 180/);
        expect(() =>
          GraphQLLongitude.parseLiteral(
            {
              value: '180.00000001',
              kind: Kind.FLOAT,
            },
            {},
          ),
        ).toThrow(/Value must be between -180 and 180/);
      });
    });
  });
});
