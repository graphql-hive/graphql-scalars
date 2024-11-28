import { Kind } from 'graphql/language';
import { GraphQLLocalEndTime } from '../src/scalars/LocalEndTime.js';
import { INVALID_LOCAL_TIMES, VALID_LOCAL_TIMES } from './LocalTime.test.js';

const VALID_LOCAL_END_TIMES = VALID_LOCAL_TIMES.concat(['24:00', '24:00:00', '24:00:00.000']);

const INVALID_LOCAL_END_TIMES = INVALID_LOCAL_TIMES;

describe(`LocalTime`, () => {
  describe(`valid`, () => {
    it(`serialize`, () => {
      VALID_LOCAL_END_TIMES.forEach(testValue => {
        expect(GraphQLLocalEndTime.serialize(testValue)).toEqual(testValue);
      });
    });

    it(`parseValue`, () => {
      VALID_LOCAL_END_TIMES.forEach(testValue => {
        expect(GraphQLLocalEndTime.parseValue(testValue)).toEqual(testValue);
      });
    });

    it(`parseLiteral`, () => {
      VALID_LOCAL_END_TIMES.forEach(testValue => {
        expect(
          GraphQLLocalEndTime.parseLiteral(
            {
              value: testValue,
              kind: Kind.STRING,
            },
            {},
          ),
        ).toEqual(testValue);
      });
    });
  });

  describe(`invalid`, () => {
    describe(`not a valid LocalTime`, () => {
      it(`serialize`, () => {
        expect(() => GraphQLLocalEndTime.serialize(123)).toThrow(/Value is not string/);

        expect(() => GraphQLLocalEndTime.serialize(false)).toThrow(/Value is not string/);
        INVALID_LOCAL_END_TIMES.forEach(testValue => {
          expect(() => GraphQLLocalEndTime.serialize(testValue)).toThrow(
            /Value is not a valid LocalTime/,
          );
        });
      });

      it(`parseValue`, () => {
        expect(() => GraphQLLocalEndTime.parseValue(123)).toThrow(/Value is not string/);

        expect(() => GraphQLLocalEndTime.parseValue(false)).toThrow(/Value is not string/);
        INVALID_LOCAL_END_TIMES.forEach(testValue => {
          expect(() => GraphQLLocalEndTime.parseValue(testValue)).toThrow(
            /Value is not a valid LocalTime/,
          );
        });
      });

      it(`parseLiteral`, () => {
        expect(() =>
          GraphQLLocalEndTime.parseLiteral({ value: 123, kind: Kind.INT } as any, {}),
        ).toThrow(/Can only validate strings as local times but got a/);

        expect(() =>
          GraphQLLocalEndTime.parseLiteral({ value: false, kind: Kind.BOOLEAN }, {}),
        ).toThrow(/Can only validate strings as local times but got a/);
        INVALID_LOCAL_END_TIMES.forEach(testValue => {
          expect(() =>
            GraphQLLocalEndTime.parseLiteral({ value: testValue, kind: Kind.STRING }, {}),
          ).toThrow(/Value is not a valid LocalTime/);
        });
      });
    });
  });
});
