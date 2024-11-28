/**
 * Copyright (c) 2018, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { graphql, GraphQLObjectType, GraphQLSchema } from 'graphql';
import MockDate from 'mockdate';
import { GraphQLTime } from '../../src/scalars/iso-date/Time.js';

// Mock the new Date() call so it always returns 2017-01-01T00:00:00.000Z
MockDate.set(new Date(Date.UTC(2017, 0, 1)));

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      validJSDate: {
        type: GraphQLTime,
        resolve: () => new Date(Date.UTC(2016, 0, 1, 14, 48, 10, 3)),
      },
      validUTCTimeString: {
        type: GraphQLTime,
        resolve: () => '14:30:00Z',
      },
      validTimeString: {
        type: GraphQLTime,
        resolve: () => '00:00:00+01:30',
      },
      invalidTimeString: {
        type: GraphQLTime,
        resolve: () => '2222',
      },
      invalidJSDate: {
        type: GraphQLTime,
        resolve: () => new Date('wrong'),
      },
      invalidType: {
        type: GraphQLTime,
        resolve: () => 5,
      },
      input: {
        type: GraphQLTime,
        args: {
          time: {
            type: GraphQLTime,
          },
        },
        resolve: (_, input) => input.time,
      },
    },
  }),
});

it('executes a query that includes a time', async () => {
  const source = /* GraphQL */ `
    query TimeTest($time: Time!) {
      validJSDate
      validUTCTimeString
      validTimeString
      input(time: $time)
      inputNull: input
    }
  `;

  const variables = { time: '14:30:00Z' };

  const response = await graphql({ schema, source, variableValues: variables });

  expect(response).toEqual({
    data: {
      validJSDate: '14:48:10.003Z',
      validUTCTimeString: '14:30:00Z',
      validTimeString: '22:30:00Z',
      input: '14:30:00.000Z',
      inputNull: null,
    },
  });
});

it('shifts an input time to UTC', async () => {
  const source = /* GraphQL */ `
    query TimeTest($time: Time!) {
      input(time: $time)
    }
  `;

  const variables = { time: '00:00:00+01:30' };

  const response = await graphql({ schema, source, variableValues: variables });

  expect(response).toEqual({
    data: {
      input: '22:30:00.000Z',
    },
  });
});

it('parses input to a JS Date', done => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        input: {
          type: GraphQLTime,
          args: {
            time: {
              type: GraphQLTime,
            },
          },
          resolve: (_, input) => {
            try {
              expect(input.time).toEqual(new Date(Date.UTC(2016, 11, 31, 22, 30)));
              done();
            } catch (e) {
              done.fail(e);
            }
          },
        },
      },
    }),
  });

  const source = /* GraphQL */ `
    query TimeTest($time: Time!) {
      input(time: $time)
    }
  `;

  const variables = { time: '00:00:00+01:30' };

  graphql({ schema, source, variableValues: variables });
});

it('errors if there is an invalid time returned from the resolver', async () => {
  const source = /* GraphQL */ `
    {
      invalidTimeString
      invalidJSDate
      invalidType
    }
  `;

  const response = await graphql({ schema, source });

  expect(response).toMatchInlineSnapshot(`
    {
      "data": {
        "invalidJSDate": null,
        "invalidTimeString": null,
        "invalidType": null,
      },
      "errors": [
        [GraphQLError: Time cannot represent an invalid time-string 2222.],
        [GraphQLError: Time cannot represent an invalid Date instance],
        [GraphQLError: Time cannot be serialized from a non string, or non Date type 5],
      ],
    }
  `);
});

it('errors if the variable value is not a valid time', async () => {
  const source = /* GraphQL */ `
    query TimeTest($time: Time!) {
      input(time: $time)
    }
  `;

  const variables = { time: '__2222' };

  const response = await graphql({ schema, source, variableValues: variables });

  expect(response).toMatchInlineSnapshot(`
    {
      "errors": [
        [GraphQLError: Variable "$time" got invalid value "__2222"; Time cannot represent an invalid time-string __2222.],
      ],
    }
  `);
});

it('errors if the variable value is not of type string', async () => {
  const source = /* GraphQL */ `
    query DateTest($time: Time!) {
      input(time: $time)
    }
  `;

  const variables = { time: 4 };

  const response = await graphql({ schema, source, variableValues: variables });

  expect(response).toMatchInlineSnapshot(`
    {
      "errors": [
        [GraphQLError: Variable "$time" got invalid value 4; Time cannot represent non string type 4],
      ],
    }
  `);
});

it('errors if the literal input value is not a valid time', async () => {
  const source = /* GraphQL */ `
    {
      input(time: "__invalid__")
    }
  `;

  const response = await graphql({ schema, source });

  expect(response).toMatchInlineSnapshot(`
    {
      "errors": [
        [GraphQLError: Time cannot represent an invalid time-string __invalid__.],
      ],
    }
  `);
});

it('errors if the literal input value in a query is not a string', async () => {
  const source = /* GraphQL */ `
    {
      input(time: 4)
    }
  `;

  const response = await graphql({ schema, source });

  expect(response).toMatchInlineSnapshot(`
    {
      "errors": [
        [GraphQLError: Time cannot represent non string type 4],
      ],
    }
  `);
});
