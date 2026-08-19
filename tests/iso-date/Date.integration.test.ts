/**
 * Copyright (c) 2018, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { graphql, GraphQLObjectType, GraphQLSchema, versionInfo } from 'graphql';
import { GraphQLDate } from '../../src/scalars/iso-date/Date.js';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      validDate: {
        type: GraphQLDate,
        resolve: () => new Date('2016-05-02'),
      },
      validDateString: {
        type: GraphQLDate,
        resolve: () => '1991-12-24',
      },
      invalidDateString: {
        type: GraphQLDate,
        resolve: () => '2017-01-001',
      },
      invalidDate: {
        type: GraphQLDate,
        resolve: () => new Date('wrong'),
      },
      invalidType: {
        type: GraphQLDate,
        resolve: () => 5,
      },
      input: {
        type: GraphQLDate,
        args: {
          date: {
            type: GraphQLDate,
          },
        },
        resolve: (_, input: { date: Date }) => input.date,
      },
    },
  }),
});

it('executes a query that includes a date', async () => {
  const source = /* GraphQL */ `
    query DateTest($date: Date!) {
      validDate
      validDateString
      input(date: $date)
      inputNull: input
    }
  `;

  const variables = { date: '2017-10-01' };

  const response = await graphql({ schema, source, variableValues: variables });

  expect(response).toEqual({
    data: {
      validDate: '2016-05-02',
      input: '2017-10-01',
      validDateString: '1991-12-24',
      inputNull: null,
    },
  });
});

it('parses input to a JS Date', done => {
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        input: {
          type: GraphQLDate,
          args: {
            date: {
              type: GraphQLDate,
            },
          },
          resolve: (_, input) => {
            try {
              expect(input.date).toEqual(new Date(Date.UTC(2016, 11, 17)));
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
    query DateTest($date: Date!) {
      input(date: $date)
    }
  `;
  const variables = { date: '2016-12-17' };

  graphql({ schema, source, variableValues: variables });
});

it('errors if there is an invalid date returned from the resolver', async () => {
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
        [GraphQLError: Date cannot represent an invalid date-string 2017-01-001.],
        [GraphQLError: Date cannot represent an invalid Date instance],
        [GraphQLError: Date cannot represent a non string, or non Date type 5],
      ],
    }
  `);
});

it('errors if the variable value is not a valid date', async () => {
  const source = /* GraphQL */ `
    query DateTest($date: Date!) {
      input(date: $date)
    }
  `;

  const variables = { date: '2017-10-001' };

  const response = await graphql({ schema, source, variableValues: variables });

  if (versionInfo?.major >= 17) {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" has invalid value: Date cannot represent an invalid date-string 2017-10-001.],
        ],
      }
    `);
  } else {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" got invalid value "2017-10-001"; Date cannot represent an invalid date-string 2017-10-001.],
        ],
      }
    `);
  }
});

it('errors if the variable value is not of type string', async () => {
  const source = /* GraphQL */ `
    query DateTest($date: Date!) {
      input(date: $date)
    }
  `;

  const variables = { date: 4 };

  const response = await graphql({ schema, source, variableValues: variables });

  if (versionInfo?.major >= 17) {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" has invalid value: Date cannot represent non string type 4],
        ],
      }
    `);
  } else {
    expect(response).toMatchInlineSnapshot(`
      {
        "errors": [
          [GraphQLError: Variable "$date" got invalid value 4; Date cannot represent non string type 4],
        ],
      }
    `);
  }
});

it('errors if the literal input value is not a valid date', async () => {
  const source = /* GraphQL */ `
    {
      input(date: "2017-10-001")
    }
  `;

  const response = await graphql({ schema, source });

  expect(response).toMatchInlineSnapshot(`
    {
      "errors": [
        [GraphQLError: Date cannot represent an invalid date-string 2017-10-001.],
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
        [GraphQLError: Date cannot represent non string type 4],
      ],
    }
  `);
});
