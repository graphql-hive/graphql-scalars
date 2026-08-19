/**
 * Copyright (c) 2018, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { graphql, GraphQLObjectType, GraphQLSchema, versionInfo } from 'graphql';
import { GraphQLDateTime } from '../../src/scalars/iso-date/DateTime.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      validDate: {
        type: GraphQLDateTime,
        resolve: () => new Date('2016-05-02T10:31:42.2Z'),
      },
      validUTCDateString: {
        type: GraphQLDateTime,
        resolve: () => '1991-12-24T00:00:00Z',
      },
      validDateString: {
        type: GraphQLDateTime,
        resolve: () => '2016-02-01T00:00:00-11:00',
      },
      validUnixTimestamp: {
        type: GraphQLDateTime,
        resolve: () => 854325678000,
      },
      invalidDateString: {
        type: GraphQLDateTime,
        resolve: () => '2017-01-001T00:00:00Z',
      },
      invalidDate: {
        type: GraphQLDateTime,
        resolve: () => new Date('wrong'),
      },
      invalidType: {
        type: GraphQLDateTime,
        resolve: () => [],
      },
      input: {
        type: GraphQLDateTime,
        args: {
          date: {
            type: GraphQLDateTime,
          },
        },
        resolve: (_, input: { date: Date }) => input.date,
      },
    },
  }),
});

it('executes a query that includes a DateTime', async () => {
  const source = /* GraphQL */ `
    query DateTest($date: DateTime!) {
      validDate
      validUTCDateString
      validDateString
      validUnixTimestamp
      input(date: $date)
      inputNull: input
    }
  `;

  const variables = { date: '2017-10-01T00:00:00Z' };

  const response = await graphql({ schema, source, variableValues: variables });

  expect(response).toEqual({
    data: {
      validDate: new Date('2016-05-02T10:31:42.200Z'),
      validUTCDateString: new Date('1991-12-24T00:00:00Z'),
      validDateString: new Date('2016-02-01T11:00:00Z'),
      input: new Date('2017-10-01T00:00:00.000Z'),
      validUnixTimestamp: new Date('1997-01-27T00:41:18.000Z'),
      inputNull: null,
    },
  });
});

it('shifts an input date-time to UTC', async () => {
  const source = /* GraphQL */ `
    query DateTest($date: DateTime!) {
      input(date: $date)
    }
  `;

  const variables = { date: '2016-02-01T00:00:00-11:00' };

  const response = await graphql({ schema, source, variableValues: variables });

  expect(response).toEqual({
    data: {
      input: new Date('2016-02-01T11:00:00.000Z'),
    },
  });
});

it('parses input to a JS Date', done => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        input: {
          type: GraphQLDateTime,
          args: {
            date: {
              type: GraphQLDateTime,
            },
          },
          resolve: (_, input) => {
            try {
              expect(input.date).toEqual(new Date(Date.UTC(2016, 1, 1, 0, 0, 15)));
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
    query DateTest($date: DateTime!) {
      input(date: $date)
    }
  `;
  const variables = { date: '2016-02-01T00:00:15Z' };

  graphql({ schema, source, variableValues: variables });
});

it('errors if an invalid date-time is returned from the resolver', async () => {
  const source = /* GraphQL */ `
    {
      invalidDateString
      invalidDate
      invalidType
    }
  `;

  const response = await graphql({ schema, source });

  expect(response).toMatchInlineSnapshot(`
    {
      "data": {
        "invalidDate": null,
        "invalidDateString": null,
        "invalidType": null,
      },
      "errors": [
        [GraphQLError: DateTime cannot represent an invalid date-time-string 2017-01-001T00:00:00Z.],
        [GraphQLError: DateTime cannot represent an invalid Date instance],
        [GraphQLError: DateTime cannot be serialized from a non string, non numeric or non Date type []],
      ],
    }
  `);
});

it('errors if the variable value is not a valid date-time', async () => {
  const source = /* GraphQL */ `
    query DateTest($date: DateTime!) {
      input(date: $date)
    }
  `;

  const variables = { date: '2017-10-001T00:00:00Z' };

  const response = await graphql({ schema, source, variableValues: variables });

  if (versionInfo?.major >= 17) {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" has invalid value: DateTime cannot represent an invalid date-time-string 2017-10-001T00:00:00Z.],
        ],
      }
    `);
  } else {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" got invalid value "2017-10-001T00:00:00Z"; DateTime cannot represent an invalid date-time-string 2017-10-001T00:00:00Z.],
        ],
      }
    `);
  }
});

it('errors if the variable value is not of type string', async () => {
  const source = /* GraphQL */ `
    query DateTest($date: DateTime!) {
      input(date: $date)
    }
  `;

  const variables = { date: 4 };

  const response = await graphql({ schema, source, variableValues: variables });

  if (versionInfo?.major >= 17) {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" has invalid value: DateTime cannot represent non string or Date type 4],
        ],
      }
    `);
  } else {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" got invalid value 4; DateTime cannot represent non string or Date type 4],
        ],
      }
    `);
  }
});

it('errors if the literal input value is not a valid date-time', async () => {
  const source = /* GraphQL */ `
    {
      input(date: "2017-10-001T00:00:00")
    }
  `;

  const response = await graphql({ schema, source });

  expect(response).toMatchInlineSnapshot(`
    {
      "errors": [
        [GraphQLError: DateTime cannot represent an invalid date-time-string 2017-10-001T00:00:00.],
      ],
    }
  `);
});

it('errors if the literal input value in a query is not a string', async () => {
  const source = /* GraphQL */ `
    {
      input(date: 4)
    }
  `;

  const response = await graphql({ schema, source });

  expect(response).toMatchInlineSnapshot(`
    {
      "errors": [
        [GraphQLError: DateTime cannot represent non string or Date type 4],
      ],
    }
  `);
});
